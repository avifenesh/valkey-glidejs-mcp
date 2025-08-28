import { test } from 'node:test';
import assert from 'node:assert/strict';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerApiTools } from '../src/tools/api.js';

test('families include geo, bitmaps, hyperloglog, json', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerApiTools(mcp);
  const tool = (mcp as any)._registeredTools?.['api.families'];
  const res = await tool.callback({} as any, {} as any);
  const fams = res.structuredContent.families as string[];
  for (const fam of ['geo', 'bitmaps', 'hyperloglog', 'json']) {
    assert.ok(fams.includes(fam));
  }
});

