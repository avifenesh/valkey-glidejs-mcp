#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

interface FileUsage {
  file: string;
  methods: Set<string>;
}

interface ScanResult {
  files: Record<string, string[]>;
  totalUnique: number;
}

// Collect allowed method names from generated inventory (fallback to empty set if missing)
function loadInventory(inventoryPath: string): Set<string> {
  try {
    const raw = fs.readFileSync(inventoryPath, 'utf-8');
    const json = JSON.parse(raw);
    const sets: string[] = [];
    for (const key of Object.keys(json)) {
      const value = (json as any)[key];
      if (Array.isArray(value)) {
        value.forEach((m: any) => m?.name && sets.push(m.name));
      }
    }
    return new Set(sets);
  } catch (e) {
    console.warn('Could not load inventory at', inventoryPath, e);
    return new Set();
  }
}

function scanSource(root: string): ScanResult {
  const files: Record<string, string[]> = {};
  const methodSet = new Set<string>();

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.ts')) {
        const content = fs.readFileSync(full, 'utf-8');
        const src = ts.createSourceFile(full, content, ts.ScriptTarget.Latest, true);
        const localMethods = new Set<string>();

  const visit = (node: ts.Node) => {
          // Pattern: this.client.method(...)
          if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
            const propAccess = node.expression;
            const objectText = propAccess.expression.getText(src);
            if (/\bclient\b/i.test(objectText)) {
              const methodName = propAccess.name.getText(src);
              localMethods.add(methodName);
              methodSet.add(methodName);
            }
          }
          ts.forEachChild(node, visit);
        };
        visit(src);

        if (localMethods.size) {
          files[path.relative(root, full)] = Array.from(localMethods).sort();
        }
      }
    }
  }
  walk(root);
  return { files, totalUnique: methodSet.size };
}

function main() {
  const inventory = loadInventory(path.resolve('glide-api-inventory.json'));
  const result = scanSource(path.resolve('src'));

  // Classification
  const classification: Record<string, { valid: string[]; unknown: string[]; } > = {};
  for (const [file, methods] of Object.entries(result.files)) {
    const valid: string[] = [];
    const unknown: string[] = [];
    methods.forEach(m => {
      if (inventory.has(m)) valid.push(m); else unknown.push(m);
    });
    classification[file] = { valid: valid.sort(), unknown: unknown.sort() };
  }

  const report = { summary: { files: Object.keys(result.files).length, totalUniqueUsed: result.totalUnique }, classification };
  fs.writeFileSync('glide-usage-scan.json', JSON.stringify(report, null, 2));
  console.log('Glide usage scan complete. Output: glide-usage-scan.json');
  const unknownTotal = Object.values(classification).reduce((s, c) => s + c.unknown.length, 0);
  if (unknownTotal > 0) {
    console.warn(`Found ${unknownTotal} unknown method references.`);
  } else {
    console.log('All referenced client methods match extracted inventory.');
  }
}

if (process.argv[1]?.includes('scan-glide-usage')) {
  main();
}
