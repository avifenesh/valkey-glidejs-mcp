import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const templates = {
  cache: ({ key, ttlSeconds }: { key: string; ttlSeconds: number }) => `
import { createClient } from '@valkey/glide';
const client = await createClient({ host: 'localhost', port: 6379 });
const cached = await client.get('${key}');
if (cached !== null) { return cached; }
const fresh = await fetchData();
await client.set('${key}', JSON.stringify(fresh), { EX: ${ttlSeconds} });
return fresh;
`.trim(),
  lock: ({ lockKey, ttlMs }: { lockKey: string; ttlMs: number }) => `
import { createClient } from '@valkey/glide';
const client = await createClient({ host: 'localhost', port: 6379 });
const token = crypto.randomUUID();
const acquired = await client.set('${lockKey}', token, { PX: ${ttlMs}, NX: true });
if (!acquired) throw new Error('lock busy');
try {
  // critical section
} finally {
  const lua = 'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end';
  await client.eval(lua, ['${lockKey}'], [token]);
}
`.trim(),
  pubsubPublisher: ({ channel }: { channel: string }) => `
import { createClient } from '@valkey/glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.publish('${channel}', JSON.stringify({ hello: 'world' }));
`.trim(),
  pubsubSubscriber: ({ channel }: { channel: string }) => `
import { createClient } from '@valkey/glide';
const client = await createClient({ host: 'localhost', port: 6379 });
for await (const msg of client.subscribe('${channel}')) {
  console.log('message', msg);
}
`.trim(),
  fastify: () => `
import Fastify from 'fastify';
import fastifyValkeyGlide from 'fastify-valkey-glide';

const app = Fastify();
await app.register(fastifyValkeyGlide, { host: 'localhost', port: 6379 });
app.get('/cache', async (req, reply) => {
  const cached = await app.valkey.get('foo');
  return { cached };
});
await app.listen({ port: 3000 });
`.trim(),
  rateLimiter: ({ key, points, duration }: { key: string; points: number; duration: number }) => `
import { createClient } from '@valkey/glide';
const client = await createClient({ host: 'localhost', port: 6379 });
const lua = 'local key=KEYS[1]; local max=tonumber(ARGV[1]); local window=tonumber(ARGV[2]); local now=redis.call("TIME")[1]; local cnt=redis.call("INCR", key); if cnt==1 then redis.call("EXPIRE", key, window); end; if cnt>max then return 0 else return max-cnt end';
const remaining = await client.eval(lua, ['rl:${key}'], ['${points}', '${duration}']);
if (remaining === 0) throw new Error('rate limit exceeded');
`.trim(),
  queueProducer: ({ queue }: { queue: string }) => `
import { createClient } from '@valkey/glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.lPush('${queue}', JSON.stringify({ id: Date.now(), payload: 'work' }));
`.trim(),
  queueConsumer: ({ queue }: { queue: string }) => `
import { createClient } from '@valkey/glide';
const client = await createClient({ host: 'localhost', port: 6379 });
while (true) {
  const res = await client.brPop('${queue}', 10);
  if (!res) continue; // timeout
  const [, msg] = res;
  // process msg
}
`.trim(),
};

export function registerGeneratorTools(mcp: McpServer) {
  mcp.tool(
    'gen.cache',
    z.object({ key: z.string(), ttlSeconds: z.number().int().positive() }).shape,
    async (args) => ({ structuredContent: { code: templates.cache(args as any) }, content: [{ type: 'text', text: templates.cache(args as any) }] }) as any,
  );
  mcp.tool(
    'gen.lock',
    z.object({ lockKey: z.string(), ttlMs: z.number().int().positive() }).shape,
    async (args) => ({ structuredContent: { code: templates.lock(args as any) }, content: [{ type: 'text', text: templates.lock(args as any) }] }) as any,
  );
  mcp.tool(
    'gen.pubsubPublisher',
    z.object({ channel: z.string() }).shape,
    async (args) => ({ structuredContent: { code: templates.pubsubPublisher(args as any) }, content: [{ type: 'text', text: templates.pubsubPublisher(args as any) }] }) as any,
  );
  mcp.tool(
    'gen.pubsubSubscriber',
    z.object({ channel: z.string() }).shape,
    async (args) => ({ structuredContent: { code: templates.pubsubSubscriber(args as any) }, content: [{ type: 'text', text: templates.pubsubSubscriber(args as any) }] }) as any,
  );
  mcp.tool(
    'gen.fastify',
    z.object({}).shape,
    async () => ({ structuredContent: { code: templates.fastify() }, content: [{ type: 'text', text: templates.fastify() }] }) as any,
  );
  mcp.tool(
    'gen.rateLimiter',
    z.object({ key: z.string(), points: z.number().int().positive(), duration: z.number().int().positive() }).shape,
    async (args) => ({ structuredContent: { code: templates.rateLimiter(args as any) }, content: [{ type: 'text', text: templates.rateLimiter(args as any) }] }) as any,
  );
  mcp.tool(
    'gen.queueProducer',
    z.object({ queue: z.string() }).shape,
    async (args) => ({ structuredContent: { code: templates.queueProducer(args as any) }, content: [{ type: 'text', text: templates.queueProducer(args as any) }] }) as any,
  );
  mcp.tool(
    'gen.queueConsumer',
    z.object({ queue: z.string() }).shape,
    async (args) => ({ structuredContent: { code: templates.queueConsumer(args as any) }, content: [{ type: 'text', text: templates.queueConsumer(args as any) }] }) as any,
  );
}

