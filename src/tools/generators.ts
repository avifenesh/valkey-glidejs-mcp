import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const templates = {
  clientBasic: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.set('hello', 'world');
console.log(await client.get('hello'));
`.trim(),
  clientCluster: () =>
    `
import { GlideClusterClient } from '@valkey/valkey-glide';
const cluster = await GlideClusterClient.createClient({
  addresses: [
    { host: '127.0.0.1', port: 7000 },
    { host: '127.0.0.1', port: 7001 },
  ]
});
console.log(await cluster.get('hello'));
`.trim(),
  pubsubAdvanced: ({ channel }: { channel: string }) =>
    `
import { GlideClient } from '@valkey/valkey-glide';
// Use dedicated clients for subscriber and publisher
const publisher = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const subscriber = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});

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
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const cached = await client.get('${key}');
if (cached !== null) { return cached; }
const fresh = await fetchData();
await client.set('${key}', JSON.stringify(fresh), { expiry: { type: 'EX', count: ${ttlSeconds} } });
return fresh;
`.trim(),
  lock: ({ lockKey, ttlMs }: { lockKey: string; ttlMs: number }) =>
    `
import { GlideClient, Script } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const token = crypto.randomUUID();
const acquired = await client.set('${lockKey}', token, { 
  conditionalSet: 'onlyIfDoesNotExist',
  expiry: { type: 'EX', count: Math.floor(${ttlMs} / 1000) }
});
if (!acquired) throw new Error('lock busy');
try {
  // critical section
} finally {
  // Atomic release using Lua script
  const releaseScript = new Script(
    'if server.call("get", ARGV[1]) == ARGV[2] then return server.call("del", ARGV[1]) else return 0 end'
  );
  await client.invokeScript(releaseScript, { args: ['${lockKey}', token] });
}
`.trim(),
  pubsubPublisher: ({ channel }: { channel: string }) =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.publish('${channel}', JSON.stringify({ hello: 'world' }));
`.trim(),
  pubsubSubscriber: ({ channel }: { channel: string }) =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
for await (const msg of client.subscribe('${channel}')) {
  console.log('message', msg);
}
`.trim(),
  fastify: () =>
    `
import Fastify from 'fastify';
import fastifyValkeyGlide from 'fastify-valkey-glide';

const app = Fastify();
await app.register(fastifyValkeyGlide, { 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
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
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const lua = 'local key=KEYS[1]; local max=tonumber(ARGV[1]); local window=tonumber(ARGV[2]); local now=redis.call("TIME")[1]; local cnt=redis.call("INCR", key); if cnt==1 then redis.call("EXPIRE", key, window); end; if cnt>max then return 0 else return max-cnt end';
const remaining = await client.customCommand(['EVAL', lua, '1', 'rl:${key}', '${points}', '${duration}']);
if (remaining === 0) throw new Error('rate limit exceeded');
`.trim(),
  queueProducer: ({ queue }: { queue: string }) =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.lpush('${queue}', [JSON.stringify({ id: Date.now(), payload: 'work' })]);
`.trim(),
  queueConsumer: ({ queue }: { queue: string }) =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
while (true) {
  const res = await client.brpop(['${queue}'], 10);
  if (!res) continue; // timeout
  const [key, msg] = res;
  // process msg
}
`.trim(),
  setExample: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.sadd('tags', ['a', 'b']);
console.log(await client.sismember('tags', 'a'));
console.log(await client.smembers('tags'));
`.trim(),
  zsetExample: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.zadd('lb', { alice: 10, bob: 20 });
console.log(await client.zrangeWithScores('lb', { start: 0, stop: -1 }));
await client.zrem('lb', ['alice']);
`.trim(),
  streamExample: () =>
    `
import { GlideClusterClient } from '@valkey/valkey-glide';
const client = await GlideClusterClient.createClient({ 
  addresses: [{ host: 'localhost', port: 7000 }] 
});

// Create stream and consumer group
await client.xgroupCreate('tasks', 'workers', '$', { mkStream: true });

// Producer: Add tasks to stream
await client.xadd('tasks', [['task', 'process-order-123']]);

// Consumer: Read and process tasks
const result = await client.xreadgroup(
  'workers',
  'worker-1', 
  { 'tasks': '>' },
  { count: 5, block: 5000 }
);

if (result?.length) {
  const streamData = result.find(stream => stream.key === 'tasks');
  if (streamData) {
    const messageIds = Object.keys(streamData.value);
    // Acknowledge processed tasks
    await client.xack('tasks', 'workers', messageIds);
    console.log('Processed:', streamData.value);
  }
}
`.trim(),
  transactionExample: () =>
    `
import { GlideClient, Transaction } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const tx = new Transaction();
tx.set('a', '1');
tx.incr('a');
const results = await client.exec(tx);
console.log(results);
`.trim(),
  pipelineExample: () =>
    `
import { GlideClient, Batch } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
// Pipeline is deprecated, use Batch instead
const batch = new Batch();
batch.set('p1', 'v1');
batch.get('p1');
const results = await client.exec(batch);
console.log(results);
`.trim(),
  batchExample: () =>
    `
import { GlideClient, Batch } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const batch = new Batch();
batch.set('key1', 'value1');
batch.get('key1');
batch.incr('counter');
const results = await client.exec(batch);
console.log(results); // Non-atomic batch execution
`.trim(),
  geoExample: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
// GLIDE geoadd expects a Map, not an object
const locations = new Map([
  ['Palermo', { longitude: 13.361389, latitude: 38.115556 }],
  ['Catania', { longitude: 15.087269, latitude: 37.502669 }]
]);
await client.geoadd('places', locations);

// Search nearby locations
const near = await client.geosearch('places', 
  { member: 'Palermo' }, 
  { radius: 200, unit: 'km' }
);
console.log(near);
`.trim(),
  bitmapsExample: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.setbit('featureFlags', 42, 1);
console.log(await client.getbit('featureFlags', 42));
console.log(await client.bitcount('featureFlags'));
`.trim(),
  hllExample: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.pfadd('visitors', ['u1','u2','u3']);
console.log(await client.pfcount(['visitors']));
`.trim(),
  jsonExample: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.customCommand(['JSON.SET', 'user:1', '$', JSON.stringify({ name: 'Avi', age: 30 })]);
console.log(await client.customCommand(['JSON.GET', 'user:1', '$.name']));
`.trim(),
  hashesAdvanced: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.hset('user:1', { name: 'Avi', age: '30' });
await client.hincrby('user:1', 'age', 1);
console.log(await client.hgetall('user:1'));
`.trim(),
  listsAdvanced: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.rpush('jobs', ['a','b','c']);
console.log(await client.lrange('jobs', 0, -1));
await client.ltrim('jobs', 1, -1);
`.trim(),
  zsetRankings: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.zadd('lb', { alice: 100, bob: 120 });
console.log('rank alice', await client.zrank('lb', 'alice'));
console.log('top', await client.zrevrangeWithScores('lb', 0, 2));
`.trim(),
  jsonAdvanced: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.customCommand(['JSON.SET', 'user:2', '$', JSON.stringify({ profile: { visits: 1, tags: [] } })]);
await client.customCommand(['JSON.SET', 'user:2', '$.profile.tags', JSON.stringify(['a','b'])]);
console.log(await client.customCommand(['JSON.GET', 'user:2', '$.profile']));
`.trim(),
  scanExample: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
let cursor = '0';
do {
  const res = await client.scan(cursor, { match: 'user:*', count: 100 });
  cursor = res[0];
  for (const key of res[1]) console.log(key);
} while (cursor !== '0');
`.trim(),
  clientAdvanced: () =>
    `
import { GlideClient, GlideClusterClient } from '@valkey/valkey-glide';

// Standalone with advanced options
const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }],
  credentials: {
    username: process.env.VALKEY_USERNAME,
    password: process.env.VALKEY_PASSWORD,
  },
  databaseId: 0,
  useTLS: process.env.VALKEY_TLS === '1',
  requestTimeout: 2000,
});

// Cluster with node list and options
const cluster = await GlideClusterClient.createClient({
  addresses: [
    { host: 'localhost', port: 7000 },
    { host: 'localhost', port: 7001 },
  ],
  credentials: {
    username: process.env.VALKEY_USERNAME,
    password: process.env.VALKEY_PASSWORD,
  },
  useTLS: process.env.VALKEY_TLS === '1',
  requestTimeout: 2000,
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
    "gen.batch",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: { code: templates.batchExample() },
        content: [{ type: "text", text: templates.batchExample() }],
      }) as any,
  );
  mcp.tool(
    "gen.pipeline",
    z.object({}).shape,
    async () =>
      ({
        structuredContent: {
          code: templates.pipelineExample(),
          deprecated:
            "Pipeline is deprecated. Use gen.batch instead. This tool now returns Batch example.",
        },
        content: [
          {
            type: "text",
            text: "⚠️  Pipeline is deprecated. Use gen.batch instead.\n\n",
          },
          { type: "text", text: templates.pipelineExample() },
        ],
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
