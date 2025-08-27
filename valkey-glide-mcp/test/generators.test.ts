import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGeneratorTools } from "../src/tools/generators.js";

test("gen.cache returns code with key", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.['gen.cache'];
  const res = await tool.callback({ key: 'k', ttlSeconds: 60 } as any, {} as any);
  assert.match(res.structuredContent.code, /client\.set\('k'/);
});

