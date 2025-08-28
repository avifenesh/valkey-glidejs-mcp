import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGeneratorTools } from "../src/tools/generators.js";

test("gen.clientBasic returns code with createClient", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.clientBasic"];
  const res = await tool.callback({} as any, {} as any);
  assert.match(res.structuredContent.code, /createClient/);
});

test("gen.clientCluster returns code with createCluster", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.clientCluster"];
  const res = await tool.callback({} as any, {} as any);
  assert.match(res.structuredContent.code, /createCluster/);
});

test("gen.pubsubAdvanced uses dedicated clients and subscribe iterator", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.pubsubAdvanced"];
  const res = await tool.callback({ channel: "ch" } as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("for await"));
  assert.ok(code.includes("publisher"));
  assert.ok(code.includes("subscriber"));
});
