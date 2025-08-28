import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerMigrationTools } from "../src/tools/migrate.js";

test("migrate.naive transforms ioredis import", async () => {
  const src = "import Redis from 'ioredis'; const r = new Redis();";
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerMigrationTools(mcp);
  const tool = (mcp as any)._registeredTools?.["migrate.naive"];
  const res = await tool.callback(
    { from: "ioredis", code: src } as any,
    {} as any,
  );
  assert.match(res.structuredContent.transformed, /@valkey\/glide/);
});
