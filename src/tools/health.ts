import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerHealthTool(mcp: McpServer) {
  mcp.tool("health", {}, async () => {
    return {
      content: [{ type: "text", text: "ok" }],
      structuredContent: { status: "ok" },
    } as any;
  });
}
