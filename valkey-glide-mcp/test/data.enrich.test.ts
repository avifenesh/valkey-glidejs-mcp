import { test } from 'node:test';
import assert from 'node:assert/strict';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerDataTools } from '../src/tools/data.js';

const SAMPLE_HTML = `
<html>
  <body>
    <h1>General Concepts</h1>
    <p>Some intro</p>
    <h2>Create a client</h2>
    <pre><code>import { createClient } from '@valkey/glide';\nconst client = await createClient({ host: 'localhost', port: 6379 });</code></pre>
    <ul><li>Use dedicated client for Pub/Sub</li></ul>
    <h2>PubSub</h2>
    <pre><code>for await (const msg of client.subscribe('ch')) { console.log(msg); }</code></pre>
  </body>
</html>`;

test('data.enrich parses sections, code blocks and bullets', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerDataTools(mcp);
  const tool = (mcp as any)._registeredTools?.['data.enrich'];
  const res = await tool.callback({ sources: [{ id: 'test', url: 'https://example.com', html: SAMPLE_HTML }] } as any, {} as any);
  assert.ok(res.structuredContent.results['test'].sections.length >= 2);
  const allCode = res.structuredContent.results['test'].sections.flatMap((s: any) => s.codeBlocks);
  assert.ok(allCode.some((c: string) => c.includes('createClient')));
});

