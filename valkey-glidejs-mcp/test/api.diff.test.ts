import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerApiTools } from "../src/tools/api.js";

test("api.diff for set includes paramsDiff", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerApiTools(mcp);
  const tool = (mcp as any)._registeredTools?.["api.diff"];
  const res = await tool.callback(
    { from: "ioredis", symbol: "set" } as any,
    {} as any,
  );
  const hasDiff = res.structuredContent.diff.some((d: any) => d.paramsDiff);
  assert.equal(typeof hasDiff, "boolean");
});
