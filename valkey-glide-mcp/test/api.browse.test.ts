import { test } from 'node:test';
import assert from 'node:assert/strict';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerApiTools } from '../src/tools/api.js';

test('api.categories lists categories', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerApiTools(mcp);
  const tool = (mcp as any)._registeredTools?.['api.categories'];
  const res = await tool.callback({} as any, {} as any);
  const cats = res.structuredContent.categories as string[];
  assert.ok(cats.includes('client'));
});

test('api.byCategory returns entries', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerApiTools(mcp);
  const tool = (mcp as any)._registeredTools?.['api.byCategory'];
  const res = await tool.callback({ category: 'pubsub' } as any, {} as any);
  assert.ok(Array.isArray(res.structuredContent.entries));
  assert.ok(res.structuredContent.entries.length >= 1);
});

