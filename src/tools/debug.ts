import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerDebugTools(mcp: McpServer) {
  // Debug tool to see exactly what parameters we receive
  mcp.tool(
    "debug.params",
    "Debug tool to examine parameter format",
    {
      testParam: z.string().describe("Test parameter"),
    },
    async (args) => {
      return {
        content: [
          { type: "text", text: `Debug Info:` },
          { type: "text", text: `typeof args: ${typeof args}` },
          { type: "text", text: `args: ${JSON.stringify(args, null, 2)}` },
          { type: "text", text: `args keys: ${Object.keys(args)}` },
        ],
        structuredContent: { 
          debug: {
            argType: typeof args,
            argValue: args,
            argKeys: Object.keys(args)
          }
        },
      };
    },
  );

  // Test with no parameters to compare
  mcp.tool(
    "debug.noparams",
    "Debug tool with no parameters",
    {},
    async () => {
      return {
        content: [{ type: "text", text: "No parameters tool works" }],
        structuredContent: { status: "success" },
      };
    },
  );
}