import { test } from 'node:test';
import assert from 'node:assert/strict';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGeneratorTools } from '../src/tools/generators.js';

test('gen.geo includes geoAdd and geoSearch', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.['gen.geo'];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes('geoAdd'));
  assert.ok(code.includes('geoSearch'));
});

test('gen.bitmaps includes setBit/getBit/bitCount', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.['gen.bitmaps'];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes('setBit'));
  assert.ok(code.includes('getBit'));
  assert.ok(code.includes('bitCount'));
});

test('gen.hll includes pfAdd/pfCount', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.['gen.hll'];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes('pfAdd'));
  assert.ok(code.includes('pfCount'));
});

test('gen.json includes jsonSet/jsonGet', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.['gen.json'];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes('jsonSet'));
  assert.ok(code.includes('jsonGet'));
});

test('gen.clientAdvanced includes advanced options and createCluster', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerGeneratorTools(mcp);
  const tool = (mcp as any)._registeredTools?.['gen.clientAdvanced'];
  const res = await tool.callback({} as any, {} as any);
  const code = res.structuredContent.code as string;
  assert.ok(code.includes('createCluster'));
  assert.ok(code.includes('password'));
});

