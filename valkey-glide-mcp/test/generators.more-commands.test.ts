import { test } from 'node:test';
import assert from 'node:assert/strict';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGeneratorTools } from '../src/tools/generators.js';

test('advanced generators exist and contain expected commands', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerGeneratorTools(mcp);
  const tools = [
    'gen.hashesAdvanced',
    'gen.listsAdvanced',
    'gen.zsetRankings',
    'gen.jsonAdvanced',
    'gen.scan',
  ];
  for (const t of tools) {
    const tool = (mcp as any)._registeredTools?.[t];
    const res = await tool.callback({} as any, {} as any);
    assert.equal(typeof res.structuredContent.code, 'string');
  }
});

