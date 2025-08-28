import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerVerifyTools } from "../src/tools/verify.js";

test("verify.static spots ioredis constructor", async () => {
  const code = "import Redis from 'ioredis'; const r = new Redis();";
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerVerifyTools(mcp);
  const tool = (mcp as any)._registeredTools?.["verify.static"];
  const res = await tool.callback({ code } as any, {} as any);
  assert.ok(
    res.structuredContent.errors.find((e: string) => e.includes("ioredis")),
  );
});
