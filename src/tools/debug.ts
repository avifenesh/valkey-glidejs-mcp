import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { registerEnhancedTool, registerSimpleTool } from "../utils/mcp-wrapper.js";

export function registerDebugTools(mcp: McpServer) {
  // Enhanced debug tool using new wrapper
  registerEnhancedTool(mcp, {
    name: "debug.enhanced",
    description: "Enhanced debug tool with dual schema support",
    zodSchema: {
      testParam: z.string().describe("Test parameter"),
      optionalNum: z.number().optional().describe("Optional number parameter"),
    },
    handler: async ({ testParam, optionalNum }) => {
      return {
        content: [
          { type: "text", text: `✅ Enhanced Debug Success!` },
          { type: "text", text: `testParam: "${testParam}" (${typeof testParam})` },
          { type: "text", text: `optionalNum: ${optionalNum} (${typeof optionalNum})` },
        ],
        structuredContent: { 
          success: true,
          testParam,
          optionalNum,
          validation: "passed"
        },
      };
    },
  });

  // Simple no-parameter tool using helper
  registerSimpleTool(
    mcp,
    "debug.simple", 
    "Simple debug tool with no parameters",
    async () => {
      return {
        content: [{ type: "text", text: "✅ Simple tool works perfectly!" }],
        structuredContent: { status: "success", type: "simple" },
      };
    }
  );

  // Legacy debug tool for comparison
  mcp.tool(
    "debug.legacy",
    "Legacy debug tool using old format", 
    {
      testParam: z.string().describe("Test parameter"),
    },
    async (args) => {
      return {
        content: [
          { type: "text", text: `Legacy Debug Info:` },
          { type: "text", text: `typeof args: ${typeof args}` },
          { type: "text", text: `args: ${JSON.stringify(args, null, 2)}` },
        ],
        structuredContent: { 
          legacy: true,
          argType: typeof args,
          argValue: args
        },
      };
    },
  );
}