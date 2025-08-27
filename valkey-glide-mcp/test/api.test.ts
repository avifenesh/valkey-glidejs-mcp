import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerApiTools } from "../src/tools/api.js";

test("api.findEquivalent returns mapping for get", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerApiTools(mcp);
  const tool = (mcp as any)._registeredTools?.["api.findEquivalent"];
  const res = await tool.callback({ source: "ioredis", symbol: "get" } as any, {} as any);
  assert.ok(res.structuredContent.results.length >= 1);
});

test("api.search returns results for pubsub", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerApiTools(mcp);
  const tool = (mcp as any)._registeredTools?.["api.search"];
  const res = await tool.callback({ query: "pubsub" } as any, {} as any);
  assert.ok(res.structuredContent.results.length >= 1);
});
