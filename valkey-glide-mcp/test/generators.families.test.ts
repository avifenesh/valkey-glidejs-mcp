import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGeneratorTools } from "../src/tools/generators.js";

test("gen.sets contains sAdd and sIsMember", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.sets"];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("sAdd"));
  assert.ok(code.includes("sIsMember"));
});

test("gen.zsets contains zAdd and zRange", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.zsets"];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("zAdd"));
  assert.ok(code.includes("zRange"));
});

test("gen.streams contains xGroupCreate and xAdd", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.streams"];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("xGroupCreate"));
  assert.ok(code.includes("xAdd"));
});

test("gen.transaction and gen.pipeline return code", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tx = (mcp as any)._registeredTools?.["gen.transaction"];
  const pl = (mcp as any)._registeredTools?.["gen.pipeline"];
  const resTx = await tx.callback({} as any, {} as any);
  const resPl = await pl.callback({} as any, {} as any);
  assert.match(resTx.structuredContent.code, /multi/);
  assert.match(resPl.structuredContent.code, /pipeline/);
});
