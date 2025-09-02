#!/usr/bin/env tsx
import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

interface MethodMeta {
  minArity: number;
  maxArity: number | null;
  paramTypes?: string[];
}
interface InventoryIndex {
  [name: string]: MethodMeta[];
}

function loadInventory(file: string): InventoryIndex {
  const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
  const index: InventoryIndex = {};
  for (const k of Object.keys(raw)) {
    const arr = (raw as any)[k];
    if (Array.isArray(arr)) {
      arr.forEach((m: any) => {
        if (!m.name) return;
        (index[m.name] ||= []).push({
          minArity: m.minArity ?? 0,
          maxArity: m.maxArity ?? (m.maxArity === 0 ? 0 : null),
          paramTypes: m.paramTypes,
        });
      });
    }
  }
  return index;
}

interface CallRecord {
  file: string;
  method: string;
  argCount: number;
  valid: boolean;
  reason?: string;
  detail?: string;
  dynamic?: boolean;
}

function acceptable(meta: MethodMeta[], argCount: number): boolean {
  return meta.some(
    (m) =>
      argCount >= m.minArity && (m.maxArity === null || argCount <= m.maxArity),
  );
}

function shapeMismatch(
  meta: MethodMeta[],
  nodeArgs: ts.NodeArray<ts.Expression>,
): string | null {
  // Heuristic: if expected first param type looks like object (/{.*}|Record|{\w+:|.*Options/ ) but provided is string literal, flag.
  for (const variant of meta) {
    if (!variant.paramTypes || variant.paramTypes.length === 0) continue;
    const firstType = variant.paramTypes[0];
    if (!firstType) continue;
    const firstArg = nodeArgs[0];
    if (!firstArg) return null;
    const expectsObject = /(\{|Record<|Options|Configuration|Config)/.test(
      firstType,
    );
    if (expectsObject) {
      if (ts.isStringLiteral(firstArg) || ts.isNumericLiteral(firstArg)) {
        return `expected object-like first argument (type: ${firstType})`;
      }
    }
  }
  return null;
}

function scanTsFiles(root: string, inventory: InventoryIndex): CallRecord[] {
  const records: CallRecord[] = [];
  function walk(dir: string) {
    for (const e of fs.readdirSync(dir)) {
      const full = path.join(dir, e);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (e.endsWith(".ts")) {
        const content = fs.readFileSync(full, "utf-8");
        const sf = ts.createSourceFile(
          full,
          content,
          ts.ScriptTarget.Latest,
          true,
        );
        const visit = (node: ts.Node) => {
          if (
            ts.isCallExpression(node) &&
            ts.isPropertyAccessExpression(node.expression)
          ) {
            const objTxt = node.expression.expression.getText(sf);
            const method = node.expression.name.getText(sf);
            // Heuristic filters
            const arrayMethodBlacklist = new Set([
              "forEach",
              "map",
              "filter",
              "reduce",
              "some",
              "every",
              "push",
              "pop",
              "includes",
              "slice",
            ]);
            if (arrayMethodBlacklist.has(method)) return;
            if (method === "test" && /\/.*\//.test(objTxt)) return; // regex.test(...) pattern
            // Accept objects whose final identifier is one of known client tokens
            const finalToken = objTxt.split(/\.|!|\?/).pop() || "";
            if (!/^([a-z]*)(glide)?client$/i.test(finalToken)) return;
            const argCount = node.arguments.length;
            const meta = inventory[method];
            if (!meta) {
              records.push({
                file: path.relative(root, full),
                method,
                argCount,
                valid: false,
                reason: "unknown-method",
              });
            } else if (!acceptable(meta, argCount)) {
              records.push({
                file: path.relative(root, full),
                method,
                argCount,
                valid: false,
                reason: "arity-mismatch",
              });
            } else {
              const shape = shapeMismatch(meta, node.arguments);
              if (shape) {
                records.push({
                  file: path.relative(root, full),
                  method,
                  argCount,
                  valid: false,
                  reason: "shape-mismatch",
                  detail: shape,
                });
              } else {
                records.push({
                  file: path.relative(root, full),
                  method,
                  argCount,
                  valid: true,
                });
              }
            }
          }
          // Dynamic property access: client["cmd"](...) or client[var](...)
          if (
            ts.isCallExpression(node) &&
            ts.isElementAccessExpression(node.expression)
          ) {
            const expr = node.expression.expression.getText(sf);
            const finalToken = expr.split(/\.|!|\?/).pop() || "";
            if (!/^([a-z]*)(glide)?client$/i.test(finalToken)) {
              // allow module clients
              if (!/(json|ft)client$/i.test(finalToken))
                return ts.forEachChild(node, visit);
            }
            const argumentExpr = node.expression.argumentExpression;
            let methodName: string | null = null;
            let dynamic = false;
            if (argumentExpr) {
              if (ts.isStringLiteral(argumentExpr))
                methodName = argumentExpr.text;
              else dynamic = true;
            }
            const argCount = node.arguments.length;
            if (methodName) {
              const meta = inventory[methodName];
              if (!meta) {
                records.push({
                  file: path.relative(root, full),
                  method: methodName,
                  argCount,
                  valid: false,
                  reason: "unknown-method",
                  dynamic,
                });
              } else if (!acceptable(meta, argCount)) {
                records.push({
                  file: path.relative(root, full),
                  method: methodName,
                  argCount,
                  valid: false,
                  reason: "arity-mismatch",
                  dynamic,
                });
              } else {
                const shape = shapeMismatch(meta, node.arguments);
                if (shape) {
                  records.push({
                    file: path.relative(root, full),
                    method: methodName,
                    argCount,
                    valid: false,
                    reason: "shape-mismatch",
                    detail: shape,
                    dynamic,
                  });
                } else {
                  records.push({
                    file: path.relative(root, full),
                    method: methodName,
                    argCount,
                    valid: true,
                    dynamic,
                  });
                }
              }
            } else {
              // dynamic unknown name
              records.push({
                file: path.relative(root, full),
                method: "<dynamic>",
                argCount,
                valid: true,
                reason: undefined,
                dynamic: true,
              });
            }
          }
          ts.forEachChild(node, visit);
        };
        visit(sf);
      }
    }
  }
  walk(root);
  return records;
}

// Simple markdown code fence scanner
function scanMarkdown(root: string, inventory: InventoryIndex): CallRecord[] {
  const records: CallRecord[] = [];
  function processFile(mdPath: string) {
    const text = fs.readFileSync(mdPath, "utf-8");
    const fenceRegex = /```(ts|typescript|js|javascript)\n([\s\S]*?)```/g;
    let match: RegExpExecArray | null;
    while ((match = fenceRegex.exec(text))) {
      const code = match[2];
      const sf = ts.createSourceFile(
        mdPath,
        code,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      const visit = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression)
        ) {
          const obj = node.expression.expression.getText(sf);
          const method = node.expression.name.getText(sf);
          const arrayMethodBlacklist = new Set([
            "forEach",
            "map",
            "filter",
            "reduce",
            "some",
            "every",
            "push",
            "pop",
            "includes",
            "slice",
          ]);
          if (arrayMethodBlacklist.has(method)) return;
          if (method === "test" && /\/.*\//.test(obj)) return;
          const finalToken = obj.split(/\.|!|\?/).pop() || "";
          if (!/^([a-z]*)(glide)?client$/i.test(finalToken)) return;
          const argCount = node.arguments.length;
          const meta = inventory[method];
          if (!meta) {
            records.push({
              file: path.relative(process.cwd(), mdPath),
              method,
              argCount,
              valid: false,
              reason: "unknown-method",
            });
          } else if (!acceptable(meta, argCount)) {
            records.push({
              file: path.relative(process.cwd(), mdPath),
              method,
              argCount,
              valid: false,
              reason: "arity-mismatch",
            });
          } else {
            const shape = shapeMismatch(meta, node.arguments);
            if (shape) {
              records.push({
                file: path.relative(process.cwd(), mdPath),
                method,
                argCount,
                valid: false,
                reason: "shape-mismatch",
                detail: shape,
              });
            } else {
              records.push({
                file: path.relative(process.cwd(), mdPath),
                method,
                argCount,
                valid: true,
              });
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
    // Inline pattern scanning (outside fences) for client.method(...) occurrences
    // Simple heuristic: scan whole file text excluding code fences already processed.
    const stripped = text.replace(fenceRegex, "");
    const inlinePattern =
      /(\b[a-zA-Z0-9_]*(?:glide)?client|\bjsonclient|\bftclient)\.([a-zA-Z0-9_]+)\s*\(([^)]*)\)/gi;
    let im: RegExpExecArray | null;
    while ((im = inlinePattern.exec(stripped))) {
      const obj = im[1];
      const method = im[2];
      const argsRaw = im[3].trim();
      if (method === "forEach" || method === "test") continue;
      const finalToken = obj.split(/\.|!|\?/).pop() || "";
      if (
        !/^([a-z]*)(glide)?client$/i.test(finalToken) &&
        !/(json|ft)client$/i.test(finalToken)
      )
        continue;
      // Rough arg count: empty -> 0 else split on commas not inside braces/brackets (simplified)
      let argCount = 0;
      if (argsRaw.length) {
        // remove balanced {} [] () segments temporarily? keep simple split; may over-count nested objects with commas
        const parts = argsRaw.split(/,(?![^\{]*\}|[^\[]*\]|[^\(]*\))/); // basic negative lookahead for closing delimiters
        argCount = parts.filter((p) => p.trim().length).length;
      }
      const meta = inventory[method];
      if (!meta) {
        records.push({
          file: path.relative(process.cwd(), mdPath),
          method,
          argCount,
          valid: false,
          reason: "unknown-method",
        });
      } else if (!acceptable(meta, argCount)) {
        records.push({
          file: path.relative(process.cwd(), mdPath),
          method,
          argCount,
          valid: false,
          reason: "arity-mismatch",
        });
      } else {
        // Inline arg shape heuristic: only inspect first argument like AST version (simple string literal vs object expectation)
        if (
          meta.some(
            (m) =>
              m.paramTypes &&
              /(\{|Record<|Options|Configuration|Config)/.test(
                m.paramTypes[0] || "",
              ),
          )
        ) {
          if (/^\s*['"][^'"]*['"]\s*$/.test(argsRaw.split(",")[0] || "")) {
            records.push({
              file: path.relative(process.cwd(), mdPath),
              method,
              argCount,
              valid: false,
              reason: "shape-mismatch",
              detail: "expected object-like first argument",
            });
            continue;
          }
        }
        records.push({
          file: path.relative(process.cwd(), mdPath),
          method,
          argCount,
          valid: true,
        });
      }
    }
  }
  function walkDocs(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir)) {
      const full = path.join(dir, e);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walkDocs(full);
      else if (e.endsWith(".md")) processFile(full);
    }
  }
  ["README.md", "docs"].forEach((p) => {
    const full = path.resolve(p);
    if (fs.existsSync(full)) {
      const st = fs.statSync(full);
      if (st.isDirectory()) walkDocs(full);
      else processFile(full);
    }
  });
  return records;
}

function main() {
  const inventoryFile = path.resolve("glide-api-inventory.json");
  if (!fs.existsSync(inventoryFile)) {
    console.error("Inventory file not found. Run extract-all-apis first.");
    process.exit(1);
  }
  const inventory = loadInventory(inventoryFile);
  const codeRecords = scanTsFiles(path.resolve("src"), inventory);
  const docRecords = scanMarkdown(process.cwd(), inventory);
  const all = [...codeRecords, ...docRecords];
  const summary = {
    totalCalls: all.length,
    invalid: all.filter((r) => !r.valid).length,
    unknownMethods: all.filter((r) => r.reason === "unknown-method").length,
    arityMismatches: all.filter((r) => r.reason === "arity-mismatch").length,
  };
  const report = { summary, records: all };
  fs.writeFileSync(
    "glide-parameter-validation.json",
    JSON.stringify(report, null, 2),
  );
  console.log(
    "Parameter validation complete. Output: glide-parameter-validation.json",
  );
  if (summary.invalid > 0) {
    console.error(
      `Found ${summary.invalid} invalid method usages (unknown or arity mismatch).`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      "All detected usages and examples conform to inventory method arity.",
    );
  }
}

if (process.argv[1]?.includes("validate-glide-parameters")) {
  main();
}
