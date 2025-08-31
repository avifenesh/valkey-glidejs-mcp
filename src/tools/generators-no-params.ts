import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Templates for code generation
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

  fastify: () =>
    `
// Fastify + GLIDE Integration
import Fastify from 'fastify';
import { GlideClient } from '@valkey/valkey-glide';

const fastify = Fastify({ logger: true });

// GLIDE plugin
async function glidePlugin(fastify: any, options: any) {
  const client = await GlideClient.createClient({
    addresses: options.addresses || [{ host: 'localhost', port: 6379 }]
  });

  fastify.decorate('glide', client);
  
  fastify.addHook('onClose', async () => {
    await client.close();
  });
}

// Register plugin
fastify.register(glidePlugin, {
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Use in routes
fastify.get('/cache/:key', async (request: any, reply: any) => {
  const { key } = request.params;
  const value = await fastify.glide.get(key);
  return { key, value };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
`.trim(),

  sets: () =>
    `
// Redis Sets Operations with GLIDE
import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Add members to set
await client.sadd('myset', ['member1', 'member2', 'member3']);

// Check if member exists
const exists = await client.sismember('myset', 'member1');
console.log('Member exists:', exists);

// Get all members
const members = await client.smembers('myset');
console.log('All members:', members);

// Set operations
await client.sadd('set1', ['a', 'b', 'c']);
await client.sadd('set2', ['b', 'c', 'd']);

// Union
const union = await client.sunion(['set1', 'set2']);
console.log('Union:', union);

// Intersection
const intersection = await client.sinter(['set1', 'set2']);
console.log('Intersection:', intersection);

// Difference
const diff = await client.sdiff(['set1', 'set2']);
console.log('Difference:', diff);

// Remove member
await client.srem('myset', ['member1']);

// Get set size
const size = await client.scard('myset');
console.log('Set size:', size);

// Random member
const random = await client.srandmember('myset');
console.log('Random member:', random);

// Pop member
const popped = await client.spop('myset');
console.log('Popped member:', popped);

await client.close();
`.trim(),

  zsets: () =>
    `
// Redis Sorted Sets Operations with GLIDE
import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Add members with scores
await client.zadd('leaderboard', {
  'player1': 100,
  'player2': 200,
  'player3': 150,
  'player4': 300
});

// Get rank (0-based)
const rank = await client.zrank('leaderboard', 'player3');
console.log('Player3 rank:', rank);

// Get reverse rank (highest score = 0)
const revRank = await client.zrevrank('leaderboard', 'player3');
console.log('Player3 reverse rank:', revRank);

// Get score
const score = await client.zscore('leaderboard', 'player3');
console.log('Player3 score:', score);

// Get range by rank
const topThree = await client.zrange('leaderboard', { start: 0, end: 2 });
console.log('Top 3 (ascending):', topThree);

// Get range with scores
const topWithScores = await client.zrangeWithScores('leaderboard', { start: 0, end: 2 });
console.log('Top 3 with scores:', topWithScores);

// Get reverse range (highest scores first)
const leaders = await client.zrevrange('leaderboard', { start: 0, end: 2 });
console.log('Leaders:', leaders);

// Get by score range
const midRange = await client.zrangeByScore('leaderboard', { min: 100, max: 200 });
console.log('Scores 100-200:', midRange);

// Increment score
await client.zincrby('leaderboard', 50, 'player1');

// Remove members
await client.zrem('leaderboard', ['player4']);

// Count in range
const count = await client.zcount('leaderboard', { min: 100, max: 250 });
console.log('Count in range:', count);

// Get cardinality
const total = await client.zcard('leaderboard');
console.log('Total members:', total);

await client.close();
`.trim(),

  streams: () =>
    `
// Redis Streams Operations with GLIDE
import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Add to stream
const id1 = await client.xadd('mystream', [
  ['field1', 'value1'],
  ['field2', 'value2']
]);
console.log('Added with ID:', id1);

// Add with specific ID
await client.xadd('mystream', [
  ['field1', 'value3'],
  ['field2', 'value4']
], { id: '1526999352406-0' });

// Read from stream
const messages = await client.xrange('mystream', '-', '+');
console.log('All messages:', messages);

// Read last N entries
const recent = await client.xrevrange('mystream', '+', '-', { count: 5 });
console.log('Recent 5:', recent);

// Get stream length
const length = await client.xlen('mystream');
console.log('Stream length:', length);

// Consumer groups
await client.xgroupCreate('mystream', 'mygroup', '0');

// Read as consumer
const consumed = await client.xreadgroup(
  'mygroup',
  'consumer1',
  { 'mystream': '>' },
  { count: 2 }
);
console.log('Consumed:', consumed);

// Acknowledge messages
if (consumed && consumed['mystream']) {
  const ids = Object.keys(consumed['mystream']);
  await client.xack('mystream', 'mygroup', ids);
}

// Get pending messages
const pending = await client.xpending('mystream', 'mygroup');
console.log('Pending:', pending);

// Trim stream
await client.xtrim('mystream', { method: 'maxlen', threshold: 1000 });

await client.close();
`.trim(),

  transaction: () =>
    `
// Redis Transactions with GLIDE
import { GlideClient, Transaction } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Create transaction
const transaction = new Transaction();

// Add commands to transaction
transaction
  .set('key1', 'value1')
  .get('key1')
  .incr('counter')
  .hset('user:123', { name: 'John', age: '30' })
  .hget('user:123', 'name')
  .lpush('queue', ['item1', 'item2'])
  .llen('queue');

// Execute transaction
const results = await client.exec(transaction);
console.log('Transaction results:', results);

// Transaction with WATCH
await client.watch(['balance']);

const balance = await client.get('balance');
const newBalance = parseInt(balance || '0') + 100;

const watchTx = new Transaction();
watchTx.set('balance', newBalance.toString());

try {
  const watchResults = await client.exec(watchTx);
  console.log('Watch transaction succeeded:', watchResults);
} catch (error) {
  console.log('Watch transaction aborted (key was modified)');
}

await client.close();
`.trim(),

  batch: () =>
    `
// Batch Operations with GLIDE
import { GlideClient, Transaction } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Batch operations using transaction (without atomicity requirement)
const batch = new Transaction();

// Add multiple operations
for (let i = 0; i < 100; i++) {
  batch.set(\`key:\${i}\`, \`value:\${i}\`);
}

// Execute batch
const startTime = Date.now();
const results = await client.exec(batch);
const duration = Date.now() - startTime;

console.log(\`Batch of \${results.length} operations completed in \${duration}ms\`);

// Batch read operations
const readBatch = new Transaction();
for (let i = 0; i < 100; i++) {
  readBatch.get(\`key:\${i}\`);
}

const values = await client.exec(readBatch);
console.log(\`Read \${values.length} values\`);

// Mixed batch operations
const mixedBatch = new Transaction();
mixedBatch
  .set('status', 'processing')
  .incr('counter')
  .lpush('events', ['event1', 'event2'])
  .sadd('tags', ['tag1', 'tag2'])
  .expire('temp', 3600);

const mixedResults = await client.exec(mixedBatch);
console.log('Mixed batch results:', mixedResults);

await client.close();
`.trim(),

  geo: () =>
    `
// Redis Geospatial Operations with GLIDE
import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Add locations
await client.geoadd('locations', {
  'London': { longitude: -0.127758, latitude: 51.507351 },
  'Paris': { longitude: 2.352222, latitude: 48.856614 },
  'New York': { longitude: -74.005973, latitude: 40.712784 },
  'Tokyo': { longitude: 139.691706, latitude: 35.689487 }
});

// Get position
const position = await client.geopos('locations', ['London']);
console.log('London position:', position);

// Calculate distance
const distance = await client.geodist('locations', 'London', 'Paris', 'km');
console.log('London to Paris:', distance, 'km');

// Find nearby locations
const nearby = await client.georadius(
  'locations',
  { longitude: 2.352222, latitude: 48.856614 },
  200,
  'km'
);
console.log('Within 200km of Paris:', nearby);

// Find nearby with details
const nearbyDetails = await client.georadiusWithOptions(
  'locations',
  { longitude: 2.352222, latitude: 48.856614 },
  500,
  'km',
  { withDist: true, withCoord: true, count: 3 }
);
console.log('Nearby with details:', nearbyDetails);

// Search by member
const nearMember = await client.georadiusByMember(
  'locations',
  'London',
  1000,
  'km'
);
console.log('Within 1000km of London:', nearMember);

// Get geohash
const hash = await client.geohash('locations', ['Tokyo']);
console.log('Tokyo geohash:', hash);

await client.close();
`.trim(),

  // ... continue with other no-param templates
};

export function registerNoParamGeneratorTools(mcp: McpServer) {
  // Only register tools that don't require parameters
  const noParamTools = [
    { name: "gen.clientBasic", desc: "Generate basic GLIDE client connection code", template: templates.clientBasic },
    { name: "gen.clientCluster", desc: "Generate GLIDE cluster client connection code", template: templates.clientCluster },
    { name: "gen.fastify", desc: "Generate Fastify plugin integration with GLIDE", template: templates.fastify },
    { name: "gen.sets", desc: "Generate Redis sets operations example", template: templates.sets },
    { name: "gen.zsets", desc: "Generate Redis sorted sets operations example", template: templates.zsets },
    { name: "gen.streams", desc: "Generate Redis streams operations example", template: templates.streams },
    { name: "gen.transaction", desc: "Generate Redis transaction operations example", template: templates.transaction },
    { name: "gen.batch", desc: "Generate Redis batch operations example", template: templates.batch },
    { name: "gen.geo", desc: "Generate Redis geospatial operations example", template: templates.geo },
  ];

  for (const tool of noParamTools) {
    mcp.tool(
      tool.name,
      tool.desc,
      {},
      async () => ({
        content: [{ type: "text", text: tool.template() }],
      })
    );
  }
}