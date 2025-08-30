import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

function staticChecks(code: string) {
  const result: { warnings: string[]; errors: string[]; issues: string[] } = {
    warnings: [],
    errors: [],
    issues: [],
  };
  if (!code.includes("@valkey/valkey-glide")) {
    result.warnings.push("Code does not import '@valkey/valkey-glide'.");
  }
  if (/import.*from\s+['"]ioredis['"]/.test(code)) {
    result.issues.push(
      "Found ioredis import - should be migrated to @valkey/valkey-glide",
    );
  }
  if (/new\s+Redis\s*\(/.test(code)) {
    result.errors.push(
      "Found ioredis constructor (new Redis). Use GlideClient.createClient() instead.",
    );
    result.issues.push("new Redis() constructor detected");
  }
  if (/from\s+['"]redis['"]/.test(code)) {
    result.warnings.push(
      "Found node-redis import. Ensure migration is intended.",
    );
  }
  return result;
}

export function registerVerifyTools(mcp: McpServer) {
  mcp.tool(
    "verify.static",
    "Perform static verification checks on code",
    {
      code: z.string(),
    },
    async ({ code }) => {
      const res = staticChecks(code);
      return {
        content: [
          {
            type: "text",
            text: `warnings: ${res.warnings.length}, errors: ${res.errors.length}`,
          },
          { type: "text", text: JSON.stringify(res, null, 2) },
        ],
        structuredContent: { errors: res.errors, warnings: res.warnings, issues: res.issues },
      };
    },
  );
}
