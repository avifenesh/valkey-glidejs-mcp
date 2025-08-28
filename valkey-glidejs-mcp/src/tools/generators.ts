import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const templates = {
  clientBasic: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.set('hello', 'world');
console.log(await client.get('hello'));
`.trim(),
  clientCluster: () =>
    `
import { createCluster } from '@valkey/valkey-glide';
const cluster = await createCluster([
  { host: '127.0.0.1', port: 7000 },
  { host: '127.0.0.1', port: 7001 },
]);
console.log(await cluster.get('hello'));
`.trim(),
  pubsubAdvanced: ({ channel }: { channel: string }) =>
    `
import { createClient } from '@valkey/valkey-glide';
// Use dedicated clients for subscriber and publisher
const publisher = await createClient({ host: 'localhost', port: 6379 });
const subscriber = await createClient({ host: 'localhost', port: 6379 });

// Async iterator style
(async () => {
  for await (const message of subscriber.subscribe('${channel}')) {
    console.log('received', message);
  }
})();

await publisher.publish('${channel}', JSON.stringify({ type: 'greeting', payload: 'hello' }));
`.trim(),
  cache: ({ key, ttlSeconds }: { key: string; ttlSeconds: number }) =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
const cached = await client.get('${key}');
if (cached !== null) { return cached; }
const fresh = await fetchData();
await client.set('${key}', JSON.stringify(fresh), { EX: ${ttlSeconds} });
return fresh;
`.trim(),
  lock: ({ lockKey, ttlMs }: { lockKey: string; ttlMs: number }) =>
    `
import { createClient } from '@valkey/valkey-glide';
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
  pubsubPublisher: ({ channel }: { channel: string }) =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.publish('${channel}', JSON.stringify({ hello: 'world' }));
`.trim(),
  pubsubSubscriber: ({ channel }: { channel: string }) =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
for await (const msg of client.subscribe('${channel}')) {
  console.log('message', msg);
}
`.trim(),
  fastify: () =>
    `
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
  rateLimiter: ({
    key,
    points,
    duration,
  }: {
    key: string;
    points: number;
    duration: number;
  }) =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
const lua = 'local key=KEYS[1]; local max=tonumber(ARGV[1]); local window=tonumber(ARGV[2]); local now=redis.call("TIME")[1]; local cnt=redis.call("INCR", key); if cnt==1 then redis.call("EXPIRE", key, window); end; if cnt>max then return 0 else return max-cnt end';
const remaining = await client.eval(lua, ['rl:${key}'], ['${points}', '${duration}']);
if (remaining === 0) throw new Error('rate limit exceeded');
`.trim(),
  queueProducer: ({ queue }: { queue: string }) =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.lPush('${queue}', JSON.stringify({ id: Date.now(), payload: 'work' }));
`.trim(),
  queueConsumer: ({ queue }: { queue: string }) =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
while (true) {
  const res = await client.brPop('${queue}', 10);
  if (!res) continue; // timeout
  const [, msg] = res;
  // process msg
}
`.trim(),
  setExample: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.sAdd('tags', ['a', 'b']);
console.log(await client.sIsMember('tags', 'a'));
console.log(await client.sMembers('tags'));
`.trim(),
  zsetExample: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.zAdd('lb', [{ score: 10, member: 'alice' }, { score: 20, member: 'bob' }]);
console.log(await client.zRange('lb', 0, -1, { WITHSCORES: true }));
await client.zRem('lb', 'alice');
`.trim(),
  streamExample: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.xGroupCreate('mystream', 'workers', '$', { MKSTREAM: true });
await client.xAdd('mystream', '*', { f1: 'v1' });
const res = await client.xReadGroup('workers', 'c1', { COUNT: 1, BLOCK: 1000, STREAMS: { mystream: '>' } });
if (res) {
  for (const [stream, entries] of Object.entries(res)) {
    for (const [id] of entries) {
      await client.xAck(stream, 'workers', [id]);
    }
  }
}
`.trim(),
  transactionExample: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
const tx = client.multi();
tx.set('a', '1');
tx.incr('a');
const results = await tx.exec();
console.log(results);
`.trim(),
  pipelineExample: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
const pl = client.pipeline();
pl.set('p1', 'v1');
pl.get('p1');
const out = await pl.exec();
console.log(out);
`.trim(),
  geoExample: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.geoAdd('places', [{ longitude: 13.361389, latitude: 38.115556, member: 'Palermo' }]);
const near = await client.geoSearch('places', { byRadius: { center: { longitude: 13.361389, latitude: 38.115556 }, radius: 200, unit: 'km' } });
console.log(near);
`.trim(),
  bitmapsExample: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.setBit('featureFlags', 42, 1);
console.log(await client.getBit('featureFlags', 42));
console.log(await client.bitCount('featureFlags'));
`.trim(),
  hllExample: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.pfAdd('visitors', ['u1','u2','u3']);
console.log(await client.pfCount('visitors'));
`.trim(),
  jsonExample: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.jsonSet('user:1', '$', { name: 'Avi', age: 30 });
console.log(await client.jsonGet('user:1', '$.name'));
`.trim(),
  hashesAdvanced: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.hMSet('user:1', { name: 'Avi', age: '30' });
await client.hIncrBy('user:1', 'age', 1);
console.log(await client.hGetAll('user:1'));
`.trim(),
  listsAdvanced: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.rPush('jobs', ['a','b','c']);
console.log(await client.lRange('jobs', 0, -1));
await client.lTrim('jobs', 1, -1);
`.trim(),
  zsetRankings: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.zAdd('lb', [{ score: 100, member: 'alice' }, { score: 120, member: 'bob' }]);
console.log('rank alice', await client.zRank('lb', 'alice'));
console.log('top', await client.zRange('lb', -3, -1, { REV: true, WITHSCORES: true }));
`.trim(),
  jsonAdvanced: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
await client.jsonSet('user:2', '$', { profile: { visits: 1, tags: [] } });
await client.jsonSet('user:2', '$.profile.tags', ['a','b']);
console.log(await client.jsonGet('user:2', '$.profile'));
`.trim(),
  scanExample: () =>
    `
import { createClient } from '@valkey/valkey-glide';
const client = await createClient({ host: 'localhost', port: 6379 });
let cursor = '0';
do {
  const res = await client.scan(cursor, { MATCH: 'user:*', COUNT: 100 });
  cursor = res.cursor;
  for (const key of res.keys) console.log(key);
} while (cursor !== '0');
`.trim(),
  clientAdvanced: () =>
    `
import { createClient, createCluster } from '@valkey/valkey-glide';

// Standalone with advanced options
const client = await createClient({
  host: 'localhost',
  port: 6379,
  username: process.env.VALKEY_USERNAME,
  password: process.env.VALKEY_PASSWORD,
  database: 0,
  tls: process.env.VALKEY_TLS === '1' ? { rejectUnauthorized: false } : undefined,
  socketTimeout: 10000,
  reconnect: { retries: 5, intervalMs: 500 },
});

// Cluster with node list and options
const cluster = await createCluster([
  { host: 'localhost', port: 7000 },
  { host: 'localhost', port: 7001 },
], {
  username: process.env.VALKEY_USERNAME,
  password: process.env.VALKEY_PASSWORD,
  dnsLookup: (hostname) => hostname,
  maxRedirections: 16,
});
`.trim(),
};

export function registerGeneratorTools(mcp: McpServer) {
  mcp.tool(
    "gen.clientBasic",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.clientBasic() },
        content: [{ type: "text", text: templates.clientBasic() }],
      }) as any,
  );
  mcp.tool(
    "gen.clientCluster",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.clientCluster() },
        content: [{ type: "text", text: templates.clientCluster() }],
      }) as any,
  );
  mcp.tool(
    "gen.cache",
    z.object({ key: z.string(), ttlSeconds: z.number().int().positive() })
      .shape,
    async (args) =>
      ({
        structuredContent: { code: templates.cache(args as any) },
        content: [{ type: "text", text: templates.cache(args as any) }],
      }) as any,
  );
  mcp.tool(
    "gen.lock",
    z.object({ lockKey: z.string(), ttlMs: z.number().int().positive() }).shape,
    async (args) =>
      ({
        structuredContent: { code: templates.lock(args as any) },
        content: [{ type: "text", text: templates.lock(args as any) }],
      }) as any,
  );
  mcp.tool(
    "gen.pubsubPublisher",
    z.object({ channel: z.string() }).shape,
    async (args) =>
      ({
        structuredContent: { code: templates.pubsubPublisher(args as any) },
        content: [
          { type: "text", text: templates.pubsubPublisher(args as any) },
        ],
      }) as any,
  );
  mcp.tool(
    "gen.pubsubSubscriber",
    z.object({ channel: z.string() }).shape,
    async (args) =>
      ({
        structuredContent: { code: templates.pubsubSubscriber(args as any) },
        content: [
          { type: "text", text: templates.pubsubSubscriber(args as any) },
        ],
      }) as any,
  );
  mcp.tool(
    "gen.pubsubAdvanced",
    z.object({ channel: z.string() }).shape,
    async (args) =>
      ({
        structuredContent: { code: templates.pubsubAdvanced(args as any) },
        content: [
          { type: "text", text: templates.pubsubAdvanced(args as any) },
        ],
      }) as any,
  );
  mcp.tool(
    "gen.fastify",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.fastify() },
        content: [{ type: "text", text: templates.fastify() }],
      }) as any,
  );
  mcp.tool(
    "gen.rateLimiter",
    z.object({
      key: z.string(),
      points: z.number().int().positive(),
      duration: z.number().int().positive(),
    }).shape,
    async (args) =>
      ({
        structuredContent: { code: templates.rateLimiter(args as any) },
        content: [{ type: "text", text: templates.rateLimiter(args as any) }],
      }) as any,
  );
  mcp.tool(
    "gen.queueProducer",
    z.object({ queue: z.string() }).shape,
    async (args) =>
      ({
        structuredContent: { code: templates.queueProducer(args as any) },
        content: [{ type: "text", text: templates.queueProducer(args as any) }],
      }) as any,
  );
  mcp.tool(
    "gen.queueConsumer",
    z.object({ queue: z.string() }).shape,
    async (args) =>
      ({
        structuredContent: { code: templates.queueConsumer(args as any) },
        content: [{ type: "text", text: templates.queueConsumer(args as any) }],
      }) as any,
  );
  mcp.tool(
    "gen.sets",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.setExample() },
        content: [{ type: "text", text: templates.setExample() }],
      }) as any,
  );
  mcp.tool(
    "gen.zsets",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.zsetExample() },
        content: [{ type: "text", text: templates.zsetExample() }],
      }) as any,
  );
  mcp.tool(
    "gen.streams",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.streamExample() },
        content: [{ type: "text", text: templates.streamExample() }],
      }) as any,
  );
  mcp.tool(
    "gen.transaction",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.transactionExample() },
        content: [{ type: "text", text: templates.transactionExample() }],
      }) as any,
  );
  mcp.tool(
    "gen.pipeline",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.pipelineExample() },
        content: [{ type: "text", text: templates.pipelineExample() }],
      }) as any,
  );
  mcp.tool(
    "gen.geo",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.geoExample() },
        content: [{ type: "text", text: templates.geoExample() }],
      }) as any,
  );
  mcp.tool(
    "gen.bitmaps",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.bitmapsExample() },
        content: [{ type: "text", text: templates.bitmapsExample() }],
      }) as any,
  );
  mcp.tool(
    "gen.hll",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.hllExample() },
        content: [{ type: "text", text: templates.hllExample() }],
      }) as any,
  );
  mcp.tool(
    "gen.json",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.jsonExample() },
        content: [{ type: "text", text: templates.jsonExample() }],
      }) as any,
  );
  mcp.tool(
    "gen.hashesAdvanced",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.hashesAdvanced() },
        content: [{ type: "text", text: templates.hashesAdvanced() }],
      }) as any,
  );
  mcp.tool(
    "gen.listsAdvanced",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.listsAdvanced() },
        content: [{ type: "text", text: templates.listsAdvanced() }],
      }) as any,
  );
  mcp.tool(
    "gen.zsetRankings",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.zsetRankings() },
        content: [{ type: "text", text: templates.zsetRankings() }],
      }) as any,
  );
  mcp.tool(
    "gen.jsonAdvanced",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.jsonAdvanced() },
        content: [{ type: "text", text: templates.jsonAdvanced() }],
      }) as any,
  );
  mcp.tool(
    "gen.scan",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.scanExample() },
        content: [{ type: "text", text: templates.scanExample() }],
      }) as any,
  );
  mcp.tool(
    "gen.clientAdvanced",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.clientAdvanced() },
        content: [{ type: "text", text: templates.clientAdvanced() }],
      }) as any,
  );
}
