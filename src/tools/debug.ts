import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerDebugTools(mcp: McpServer) {
  // Debug tool with parameters
  mcp.tool(
    "debug.params",
    "Debug tool with parameters",
    {
      testParam: z.string().describe("Test parameter"),
      optionalNum: z.number().optional().describe("Optional number parameter"),
    },
    async ({ testParam, optionalNum }) => {
      return {
        content: [
          { type: "text", text: `✅ Debug Success!` },
          { type: "text", text: `testParam: "${testParam}" (${typeof testParam})` },
          { type: "text", text: `optionalNum: ${optionalNum} (${typeof optionalNum})` },
        ],
      };
    }
  );

  // Simple no-parameter tool
  mcp.tool(
    "debug.simple",
    "Simple debug tool with no parameters",
    {},
    async () => {
      return {
        content: [{ type: "text", text: "✅ Simple tool works perfectly!" }],
      };
    }
  );
}