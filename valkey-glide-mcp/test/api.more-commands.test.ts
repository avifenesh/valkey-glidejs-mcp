import { test } from 'node:test';
import assert from 'node:assert/strict';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerApiTools } from '../src/tools/api.js';

test('api.search finds newly added commands like json and geo', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerApiTools(mcp);
  const tool = (mcp as any)._registeredTools?.['api.search'];
  const resJson = await tool.callback({ query: 'jsonSet' } as any, {} as any);
  assert.ok(resJson.structuredContent.results.length >= 1);
  const resGeo = await tool.callback({ query: 'geoSearch' } as any, {} as any);
  assert.ok(resGeo.structuredContent.results.length >= 1);
});

