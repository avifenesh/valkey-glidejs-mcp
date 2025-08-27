import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerDocsTools } from "../src/tools/docs.js";

test("docs.listSources returns sources", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerDocsTools(mcp);
  const tool = (mcp as any)._registeredTools?.["docs.listSources"];
  assert.ok(tool);
  const res = await tool.callback({} as any, {} as any);
  assert.ok(res.structuredContent.sources.length > 5);
});

test("docs.recommend returns filtered list", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerDocsTools(mcp);
  const tool = (mcp as any)._registeredTools?.["docs.recommend"];
  assert.ok(tool);
  const res = await tool.callback({ topic: "caching" } as any, {} as any);
  assert.ok(res.structuredContent.recommended.length > 3);
});
