import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { promises as fs } from "node:fs";
import {
  IOREDIS_DATASET,
  NODE_REDIS_DATASET,
  GLIDE_SURFACE,
  ApiMappingEntry,
} from "../data/api/mappings.js";

function extractMethodCandidatesFromTs(source: string): Set<string> {
  const methods = new Set<string>();
  // naive patterns: function foo(, foo( ... inside interfaces/classes, export function foo(
  const patterns = [
    /\b([a-zA-Z][a-zA-Z0-9_]*)\s*\(/g, // general call or declaration pattern
  ];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(source))) {
      const name = m[1];
      // skip keywords and common noise
      if (
        [
          "if",
          "for",
          "while",
          "switch",
          "catch",
          "function",
          "constructor",
          "class",
          "return",
          "await",
          "async",
          "typeof",
          "new",
        ].includes(name)
      )
        continue;
      // likely method names are lowerCamelCase
      if (/^[a-z][A-Za-z0-9]*$/.test(name)) methods.add(name);
    }
  }
  return methods;
}

function extractGlideMethodTokens(
  entry: ApiMappingEntry,
  allowedLower: Set<string>,
): string[] {
  const text = entry.equivalent.glide;
  const names = new Set<string>();
  // 1) methodName( pattern
  const reCall = /\b([a-z][A-Za-z0-9]*)\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = reCall.exec(text))) names.add(m[1].toLowerCase());

  // 2) tokens split by non-alnum, filter to allowed set
  const tokens = text.split(/[^A-Za-z0-9_]+/).filter(Boolean);
  for (const t of tokens) {
    const low = t.toLowerCase();
    if (allowedLower.has(low)) names.add(low);
  }
  return Array.from(names);
}

export function registerValidationTools(mcp: McpServer) {
  mcp.tool(
    "validate.glideSurface",
    {
      urls: z.array(z.string().url()).optional(),
      sources: z
        .array(z.object({ id: z.string(), text: z.string() }))
        .optional(),
      writeReport: z.boolean().optional().default(true),
    },
    async (args) => {
      const defaultUrls = args.urls ?? [
        "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/index.ts",
        "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/BaseClient.ts",
        "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/GlideClient.ts",
        "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/GlideClusterClient.ts",
        "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/Commands.ts",
        "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/server-modules/GlideJson.ts",
        "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/server-modules/GlideFt.ts",
      ];

      const sources: { id: string; text: string }[] = [];
      if (args.sources && args.sources.length) {
        sources.push(...args.sources);
      } else {
        for (const url of defaultUrls) {
          try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const text = await res.text();
            sources.push({ id: url, text });
          } catch {}
        }
      }

      const extracted = new Set<string>();
      for (const s of sources) {
        for (const name of extractMethodCandidatesFromTs(s.text))
          extracted.add(name);
      }
      const extractedLower = new Set(
        Array.from(extracted).map((n) => n.toLowerCase()),
      );

      const datasets = [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE];
      const allEntries: ApiMappingEntry[] = datasets.flatMap((d) => d.entries);
      const results: {
        symbol: string;
        glideMethods: string[];
        validated: boolean;
        missing: string[];
      }[] = [];

      for (const entry of allEntries) {
        const methodNamesLower = extractGlideMethodTokens(
          entry,
          extractedLower,
        );
        const missing = methodNamesLower.filter((n) => !extractedLower.has(n));
        const validated = methodNamesLower.length > 0 && missing.length === 0;
        // report glideMethods in original case approximated by as-is tokens when possible
        results.push({
          symbol: entry.symbol,
          glideMethods: methodNamesLower,
          validated,
          missing,
        });
      }

      const validatedCount = results.filter((r) => r.validated).length;
      const unvalidated = results.filter((r) => !r.validated);

      if (args.writeReport) {
        const outDir = new URL("../../..", import.meta.url).pathname; // project root
        const reportJsonPath = `${outDir}/VALIDATION_REPORT.json`;
        const reportMdPath = `${outDir}/VALIDATION_REPORT.md`;
        const validatedListPath = `${outDir}/validation/validated.list.json`;
        await fs.mkdir(`${outDir}/validation`, { recursive: true });
        await fs.writeFile(
          reportJsonPath,
          JSON.stringify(
            {
              extractedMethodCount: extracted.size,
              validatedCount,
              totalEntries: results.length,
              results,
            },
            null,
            2,
          ),
          "utf8",
        );
        const md = [
          `# Glide API Validation Report`,
          ``,
          `- Extracted method candidates: ${extracted.size}`,
          `- Entries validated: ${validatedCount}/${results.length}`,
          ``,
          `## Missing/Unvalidated Entries`,
          ``,
          ...unvalidated
            .slice(0, 500)
            .map(
              (r) =>
                `- ${r.symbol} -> ${r.glideMethods.join(", ")} (missing: ${r.missing.join(", ") || "-"})`,
            ),
        ].join("\n");
        await fs.writeFile(reportMdPath, md, "utf8");
        await fs.writeFile(
          validatedListPath,
          JSON.stringify({ methods: Array.from(extracted) }, null, 2),
          "utf8",
        );
      }

      return {
        structuredContent: {
          extractedMethodCount: extracted.size,
          validatedCount,
          totalEntries: results.length,
          results,
        },
        content: [
          {
            type: "text",
            text: `validated ${validatedCount}/${results.length} entries; extracted ${extracted.size} methods`,
          },
        ],
      } as any;
    },
  );
}
