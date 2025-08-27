import { test } from 'node:test';
import assert from 'node:assert/strict';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerApiTools } from '../src/tools/api.js';

test('api.families lists families', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerApiTools(mcp);
  const tool = (mcp as any)._registeredTools?.['api.families'];
  const res = await tool.callback({} as any, {} as any);
  const fams = res.structuredContent.families as string[];
  assert.ok(fams.includes('sets'));
  assert.ok(fams.includes('zsets'));
});

test('api.byFamily returns entries for streams', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerApiTools(mcp);
  const tool = (mcp as any)._registeredTools?.['api.byFamily'];
  const res = await tool.callback({ family: 'streams' } as any, {} as any);
  assert.ok(Array.isArray(res.structuredContent.entries));
});

