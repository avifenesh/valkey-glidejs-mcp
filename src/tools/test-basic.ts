import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerTestTools(mcp: McpServer) {
  // Try the most basic parameter setup
  const testSchema = {
    name: z.string(),
  };
  
  mcp.tool(
    "test.basic",
    "Test with basic string param",
    testSchema,
    async ({ name }) => {
      return {
        content: [
          { type: "text", text: `Hello ${name}!` },
        ],
      };
    }
  );
}