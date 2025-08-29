import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGeneratorTools } from "../src/tools/generators.js";

test("gen.sets contains sadd and sismember", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.sets"];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("sadd"));
  assert.ok(code.includes("sismember"));
});

test("gen.zsets contains zadd and zrange", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.zsets"];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("zadd"));
  assert.ok(code.includes("zrange"));
});

test("gen.streams contains xgroupCreate and xadd", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.["gen.streams"];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes("xgroupCreate"));
  assert.ok(code.includes("xadd"));
});

test("gen.transaction and gen.pipeline return code", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const tx = (mcp as any)._registeredTools?.["gen.transaction"];
  const pl = (mcp as any)._registeredTools?.["gen.pipeline"];
  const resTx = await tx.callback({} as any, {} as any);
  const resPl = await pl.callback({} as any, {} as any);
  assert.match(resTx.structuredContent.code, /Transaction/);
  assert.match(resPl.structuredContent.code, /Batch/); // Pipeline now uses Batch
});

test("gen.batch returns Batch-based code", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  const batch = (mcp as any)._registeredTools?.["gen.batch"];
  const res = await batch.callback({} as any, {} as any);
  assert.match(res.structuredContent.code, /Batch/);
  assert.match(res.structuredContent.code, /Non-atomic batch execution/);
});
