import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGeneratorTools } from "../src/tools/generators.js";

test("gen.geo includes geoadd and geosearch", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.geo"];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("geoadd"));
  assert.ok(code.includes("geosearch"));
});

test("gen.bitmaps includes setbit/getbit/bitcount", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.bitmaps"];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("setbit"));
  assert.ok(code.includes("getbit"));
  assert.ok(code.includes("bitcount"));
});

test("gen.hll includes pfadd/pfcount", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.hll"];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("pfadd"));
  assert.ok(code.includes("pfcount"));
});

test("gen.json includes JSON.SET/JSON.GET", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.json"];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("JSON.SET"));
  assert.ok(code.includes("JSON.GET"));
});

test("gen.clientAdvanced includes advanced options and GlideClusterClient", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.clientAdvanced"];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("GlideClusterClient"));
  assert.ok(code.includes("password"));
});
