import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Minimal, regex-based migration scaffolding for quick suggestions.
// Future work: integrate ts-morph or recast for AST-level transforms.

function naiveTransform(source: string, from: "ioredis" | "node-redis") {
  let code = source;
  if (from === "ioredis") {
    code = code.replace(
      /import\s+Redis\s+from\s+['"]ioredis['"];?/g,
      "import { GlideClient } from '@valkey/valkey-glide';",
    );
    code = code.replace(/new\s+Redis\s*\(([^)]*)\)/g, "await GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })");
    code = code.replace(
      /new\s+Redis\.Cluster\s*\(([^)]*)\)/g,
      "await GlideClusterClient.createClient({ addresses: [] })",
    );
  } else {
    code = code.replace(/from\s+['"]redis['"]/g, "from '@valkey/valkey-glide'");
    code = code.replace(/import\s*{\s*createClient\s*}\s*from/g, "import { GlideClient } from");
    code = code.replace(/createClient\s*\(/g, "GlideClient.createClient(");
    code = code.replace(/client\.connect\(\);?/g, "// Connection is automatic in GLIDE");
  }
  return code;
}

export function registerMigrationTools(mcp: McpServer) {
  mcp.tool(
    "migrate.naive",
    z.object({
      from: z.enum(["ioredis", "node-redis"]),
      code: z.string(),
    }).shape,
    async (args) => {
      const transformed = naiveTransform(args.code, args.from as any);
      return {
        structuredContent: { transformed },
        content: [{ type: "text", text: transformed }],
      } as any;
    },
  );
}
