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
  assert.match(res.structuredContent.transformed, /@valkey\/valkey-glide/);
});

test("migrate.naive transforms ioredis URL connections", async () => {
  const src = `import Redis from 'ioredis'; 
const redis1 = new Redis('redis://localhost:6379');
const redis2 = new Redis(process.env.REDIS_URL);`;
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerMigrationTools(mcp);
  const tool = (mcp as any)._registeredTools?.["migrate.naive"];
  const res = await tool.callback(
    { from: "ioredis", code: src } as any,
    {} as any,
  );
  const transformed = res.structuredContent.transformed;
  assert.match(transformed, /GlideClient\.createClient/);
  assert.match(transformed, /'host': 'localhost'/); // URL is now parsed
  assert.match(transformed, /parseRedisUrlRuntime/); // Environment URL helper
  assert.match(transformed, /Helper function to add to your codebase/);
});

test("migrate.naive transforms blocking operations to native GLIDE methods", async () => {
  const src = `import Redis from 'ioredis';
const redis = new Redis();
await redis.blpop('queue', 10);
await redis.brpop('queue', 5);
await redis.brpoplpush('source', 'dest', 0);
await redis.bzpopmin('zset', 15);
await redis.bzpopmax('zset', 20);`;
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerMigrationTools(mcp);
  const tool = (mcp as any)._registeredTools?.["migrate.naive"];
  const res = await tool.callback(
    { from: "ioredis", code: src } as any,
    {} as any,
  );
  const transformed = res.structuredContent.transformed;
  assert.match(transformed, /\.blpop\(/); // Native GLIDE method
  assert.match(transformed, /\.brpop\(/); // Native GLIDE method
  assert.match(transformed, /\.blmove\(/); // Modern replacement for BRPOPLPUSH
  assert.match(transformed, /\.bzpopmin\(/); // Native GLIDE method
  assert.match(transformed, /\.bzpopmax\(/); // Native GLIDE method
  assert.doesNotMatch(transformed, /customCommand/); // Should not use customCommand
});
