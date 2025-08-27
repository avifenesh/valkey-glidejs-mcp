import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerHealthTool } from "../src/tools/health.js";

test("health tool returns ok", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerHealthTool(mcp);
  const tool = (mcp as any)._registeredTools?.["health"];
  assert.ok(tool, "health tool should be registered");
  const res = await tool.callback({} as any, {} as any);
  assert.deepEqual(res.structuredContent, { status: "ok" });
});
