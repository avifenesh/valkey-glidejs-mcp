import { test } from 'node:test';
import assert from 'node:assert/strict';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCommandsTools } from '../src/tools/commands.js';

const SAMPLE_MD = `
| cmd type | Python | Node | Java |
| ------ | ----- | ----- | ----- |
| append | Done | Done | Done |
| zadd | Done | Done | Done |
| xgroup create | Done | Done | Done |
| function list | Done | Done | Done |
`;

const SAMPLE_TS_BASE = `
export class BaseClient {
  public async append(key: string, value: string): Promise<number> { return 0 }
  public async zadd(key: string, xs: any): Promise<number> { return 0 }
}
`;
const SAMPLE_TS_CLIENT = `export class GlideClient { public static async createClient(): Promise<any> { return {} as any } }`;
const SAMPLE_TS_CLUSTER = `export class GlideClusterClient { public static async createClient(): Promise<any> { return {} as any } }`;
const SAMPLE_TS_JSON = `export class GlideJson { public static async set(): Promise<'OK'|null> { return 'OK' } }`;

test('commands.ingest ingests sample markdown and validates mapped methods', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerCommandsTools(mcp);
  const tool = (mcp as any)._registeredTools?.['commands.ingest'];
  const res = await tool.callback({ start: 0, count: 10, refresh: true, sources: { md: SAMPLE_MD, tsBase: SAMPLE_TS_BASE, tsClient: SAMPLE_TS_CLIENT, tsCluster: SAMPLE_TS_CLUSTER, tsJson: SAMPLE_TS_JSON } } as any, {} as any);
  assert.ok(res.structuredContent.processed >= 4);
});

