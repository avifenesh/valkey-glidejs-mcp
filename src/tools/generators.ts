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
// GLIDE handles pub/sub with dedicated clients
// Publisher client
const publisher = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});

// Subscriber client with callback configuration
const subscriber = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }],
  pubsubSubscriptions: {
    channelsAndPatterns: {
      channels: ['${channel}']
    },
    callback: (message) => {
      console.log('Received:', message);
    }
  }
});

// Note: GLIDE doesn't support async iterators for pub/sub yet
// Messages are handled via the callback provided at connection time
// For await pattern could be simulated with an async queue:
const messages = [];
const messageQueue = {
  async *[Symbol.asyncIterator]() {
    while (true) {
      if (messages.length > 0) {
        yield messages.shift();
      } else {
        await new Promise(r => setTimeout(r, 100));
      }
    }
  }
};

// Simulated for await pattern (for compatibility)
(async () => {
  for await (const msg of messageQueue) {
    console.log('Processing:', msg);
  }
})();

// Publish message
await publisher.publish('${channel}', JSON.stringify({ type: 'greeting', payload: 'hello' }));
`.trim(),
  cache: ({ key, ttlSeconds }: { key: string; ttlSeconds: number }) =>
    `
import { GlideClient, TimeUnit } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const cached = await client.get('${key}');
if (cached !== null) { return cached; }
const fresh = await fetchData();
await client.set('${key}', JSON.stringify(fresh), { expiry: { type: TimeUnit.Seconds, count: ${ttlSeconds} } });
return fresh;
`.trim(),
  lock: ({ lockKey, ttlMs }: { lockKey: string; ttlMs: number }) =>
    `
import { GlideClient, Script, TimeUnit } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const token = crypto.randomUUID();
const acquired = await client.set('${lockKey}', token, { 
  conditionalSet: 'onlyIfDoesNotExist',
  expiry: { type: TimeUnit.Seconds, count: Math.floor(${ttlMs} / 1000) }
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
  addresses: [{ host: 'localhost', port: 6379 }],
  pubsubSubscriptions: {
    channelsAndPatterns: {
      channels: ['${channel}']
    },
    callback: (message) => {
      console.log('Message received:', message);
    }
  }
});
// The callback will be invoked for each message
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

// Add members with scores (using Record<string, Score>)
await client.zadd('leaderboard', { alice: 100, bob: 85, charlie: 92 });

// Get score for a member
const aliceScore = await client.zscore('leaderboard', 'alice');
console.log('Alice score:', aliceScore);

// Get rank (0-based, lowest score first)
const bobRank = await client.zrank('leaderboard', 'bob');
console.log('Bob rank:', bobRank);

// Get reverse rank (highest score first)
const bobRevRank = await client.zrevrank('leaderboard', 'bob');
console.log('Bob reverse rank:', bobRevRank);

// Range with scores (ascending by score) - note: uses 'end' not 'stop'
const ascending = await client.zrangeWithScores('leaderboard', { start: 0, end: -1 });
console.log('Ascending:', ascending);

// Remove members
await client.zrem('leaderboard', ['alice']);

// Pop minimum and maximum (returns null or [member, score])
const minMember = await client.zpopmin('leaderboard');
console.log('Popped min:', minMember);

const maxMember = await client.zpopmax('leaderboard');
console.log('Popped max:', maxMember);
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
import { GlideClient, Batch } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
// Use Batch with atomic=true for transactional operations
const tx = new Batch(true);
tx.set('a', '1');
tx.incr('a');
const results = await client.exec(tx);
console.log(results); // Atomic transaction execution
`.trim(),
  pipelineExample: () =>
    `
import { GlideClient, Batch } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
// Pipeline is deprecated, use Batch with atomic=false for non-atomic operations
const batch = new Batch(false);
batch.set('p1', 'v1');
batch.get('p1');
const results = await client.exec(batch);
console.log(results); // Non-atomic pipeline execution
`.trim(),
  batchExample: () =>
    `
import { GlideClient, Batch } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
// Use Batch with atomic=false for non-atomic batch operations
const batch = new Batch(false);
batch.set('key1', 'value1');
batch.get('key1');
batch.incr('counter');
const results = await client.exec(batch);
console.log(results); // Non-atomic batch execution
`.trim(),
  geoExample: () =>
    `
import { GlideClient, GeoUnit } from '@valkey/valkey-glide';
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
  { radius: 200, unit: GeoUnit.KILOMETERS }
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
await client.hincrBy('user:1', 'age', 1);
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
import { GlideClient, InfBoundary } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});

// Create leaderboard with multiple players
await client.zadd('rankings', { 
  alice: 2500, 
  bob: 1800, 
  charlie: 3200,
  diana: 2100,
  eve: 2900
});

// Get player rank (0-based, ascending)
const aliceRank = await client.zrank('rankings', 'alice');
console.log('Alice rank (ascending):', aliceRank);

// Get player reverse rank (0-based, descending)
const aliceRevRank = await client.zrevrank('rankings', 'alice');
console.log('Alice rank (descending):', aliceRevRank);

// Get top 3 players with scores (using reverse option)
const top3 = await client.zrangeWithScores('rankings', { start: 0, end: 2 }, { reverse: true });
console.log('Top 3 players:', top3);

// Count players in score range (using Boundary objects)
const midRange = await client.zcount('rankings', 
  { value: 2000, isInclusive: true }, 
  { value: 2600, isInclusive: true }
);
console.log('Players with 2000-2600 score:', midRange);

// Increment player score
const newScore = await client.zaddIncr('rankings', 'bob', 150);
console.log('Bob new score:', newScore);

// Remove players below threshold
await client.zremRangeByScore('rankings', 
  InfBoundary.NegativeInfinity, 
  { value: 2000, isInclusive: false }
);
console.log('Remaining players:', await client.zrange('rankings', { start: 0, end: -1 }));

// Union multiple leaderboards (using KeyWeight array)
await client.zadd('weekly_rankings', { alice: 500, frank: 600 });
await client.zunionstore('combined', [
  ['rankings', 1],
  ['weekly_rankings', 0.1]  // Weekly scores count 10%
]);
console.log('Combined:', await client.zrangeWithScores('combined', { start: 0, end: -1 }));
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
  azAffinityClient: () =>
    `
import { GlideClusterClient, ReadFrom } from '@valkey/valkey-glide';

// Client with AZ affinity configuration
const azAwareClient = await GlideClusterClient.createClient({
  addresses: [
    { host: 'node1.us-east-1a.cluster.local', port: 6379 },
    { host: 'node2.us-east-1b.cluster.local', port: 6379 },
    { host: 'node3.us-east-1c.cluster.local', port: 6379 },
  ],
  // Set the client's availability zone
  clientAz: 'us-east-1a',
  // Configure read preference for AZ affinity
  readFrom: ReadFrom.AZAffinity,
  requestTimeout: 3000,
  credentials: {
    username: process.env.VALKEY_USERNAME,
    password: process.env.VALKEY_PASSWORD,
  },
});

// Example: Reading with AZ affinity
// Reads will prefer replicas in the same AZ (us-east-1a)
const value = await azAwareClient.get('user:123');
console.log('Value read from AZ-local replica:', value);

// Writes always go to primary
await azAwareClient.set('user:123', JSON.stringify({ name: 'John', region: 'us-east-1a' }));
`.trim(),
  readPreferenceClient: () =>
    `
import { GlideClusterClient, ReadFrom, Routes } from '@valkey/valkey-glide';

// Client with different read strategies
const readOptimizedClient = await GlideClusterClient.createClient({
  addresses: [
    { host: 'primary.cluster.local', port: 6379 },
    { host: 'replica1.cluster.local', port: 6379 },
    { host: 'replica2.cluster.local', port: 6379 },
  ],
  // Read preference strategies:
  // ReadFrom.Primary - Always read from primary (strong consistency)
  // ReadFrom.PreferReplica - Prefer replicas for reads (better read scaling)
  // ReadFrom.AZAffinity - Prefer same AZ (lower latency)
  readFrom: ReadFrom.PreferReplica,
  requestTimeout: 2000,
});

// Example: Explicit routing for reads
// Force read from primary for consistency-critical operations
const criticalData = await readOptimizedClient.get('critical:key', {
  route: Routes.primaryNodeRoute(),
});

// Allow reading from replicas for scale
const cachedData = await readOptimizedClient.get('cache:key', {
  route: Routes.replicaNodeRoute(),
});

// Route by hash slot for specific key patterns
const userData = await readOptimizedClient.get('user:123', {
  route: Routes.keyRoute('user:123'),
});
`.trim(),
  clusterScanAdvanced: () =>
    `
import { GlideClusterClient, Routes } from '@valkey/valkey-glide';

const cluster = await GlideClusterClient.createClient({
  addresses: [
    { host: 'localhost', port: 7000 },
    { host: 'localhost', port: 7001 },
  ],
});

// Advanced cluster scanning with options
const scanOptions = {
  match: 'user:*',           // Pattern to match keys
  count: 100,                 // Suggested batch size
  type: 'string',            // Only scan string keys
};

// Scan across all cluster nodes
let cursor = '0';
const allKeys = [];

do {
  const result = await cluster.scan(cursor, scanOptions);
  cursor = result[0];
  const keys = result[1];
  allKeys.push(...keys);
  
  console.log('Found', keys.length, 'keys in this batch');
  
  // Process keys in batches to avoid memory issues
  if (keys.length > 0) {
    const values = await Promise.all(
      keys.map(key => cluster.get(key))
    );
    console.log('Batch processed:', keys.length);
  }
} while (cursor !== '0');

console.log('Total keys found:', allKeys.length);

// Scan with routing to specific nodes
const primaryScan = await cluster.scan('0', {
  match: 'session:*',
  count: 50,
  route: Routes.primaryNodeRoute(), // Scan only primary nodes
});

const replicaScan = await cluster.scan('0', {
  match: 'cache:*',
  count: 50,
  route: Routes.replicaNodeRoute(), // Scan only replica nodes
});
`.trim(),
  routingStrategies: () =>
    `
import { GlideClusterClient, Routes, SlotType, Batch } from '@valkey/valkey-glide';

const cluster = await GlideClusterClient.createClient({
  addresses: [
    { host: 'localhost', port: 7000 },
    { host: 'localhost', port: 7001 },
  ],
});

// Different routing strategies for cluster operations

// 1. Route by key - automatically determines the slot
await cluster.set('user:123', 'data', {
  route: Routes.keyRoute('user:123'),
});

// 2. Route by slot - explicitly specify the slot number
const slot = 12345;
await cluster.get('some:key', {
  route: Routes.slotRoute(slot, SlotType.Primary),
});

// 3. Route to all primaries - for broadcast operations
await cluster.flushall({
  route: Routes.allPrimaries(),
});

// 4. Route to all nodes - for monitoring/info commands
const info = await cluster.info({
  route: Routes.allNodes(),
});

// 5. Route to random node - for load distribution
await cluster.ping({
  route: Routes.randomRoute(),
});

// 6. Multi-key operations with same slot
// Use hash tags to ensure keys are in the same slot
const hashTag = '{user:123}';
await cluster.mset([
  [hashTag + ':profile', JSON.stringify({ name: 'John' })],
  [hashTag + ':settings', JSON.stringify({ theme: 'dark' })],
  [hashTag + ':activity', JSON.stringify({ lastLogin: Date.now() })],
]);

// Transaction with routing
const transaction = new Batch(true);
transaction.get(hashTag + ':profile');
transaction.get(hashTag + ':settings');
const results = await cluster.exec(transaction, {
  route: Routes.keyRoute(hashTag),
});
`.trim(),
  telemetryClient: () =>
    `
import { GlideClient, TimeUnit } from '@valkey/valkey-glide';

// Simple telemetry wrapper for GLIDE client
class TelemetryGlideClient {
  private client: GlideClient;
  private metrics: Map<string, { count: number; totalMs: number }>;
  
  constructor(client: GlideClient) {
    this.client = client;
    this.metrics = new Map();
  }
  
  private recordMetric(operation: string, durationMs: number) {
    const metric = this.metrics.get(operation) || { count: 0, totalMs: 0 };
    metric.count++;
    metric.totalMs += durationMs;
    this.metrics.set(operation, metric);
  }
  
  async get(key: string): Promise<string | null> {
    const startTime = Date.now();
    try {
      const result = await this.client.get(key);
      const duration = Date.now() - startTime;
      this.recordMetric('GET', duration);
      console.log('GET', key, 'took', duration + 'ms, cache_hit=' + (result !== null));
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordMetric('GET_ERROR', duration);
      throw error;
    }
  }
  
  async set(key: string, value: string, ttl?: number): Promise<void> {
    const startTime = Date.now();
    try {
      await this.client.set(key, value, ttl ? { 
        expiry: { type: TimeUnit.Seconds, count: ttl } 
      } : undefined);
      const duration = Date.now() - startTime;
      this.recordMetric('SET', duration);
      console.log('SET', key, 'took', duration + 'ms');
    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordMetric('SET_ERROR', duration);
      throw error;
    }
  }
  
  getMetrics() {
    const report: any = {};
    for (const [op, stats] of this.metrics.entries()) {
      report[op] = {
        count: stats.count,
        avgMs: Math.round(stats.totalMs / stats.count),
        totalMs: stats.totalMs,
      };
    }
    return report;
  }
}

// Usage
const baseClient = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }],
  clientName: 'telemetry-app',
});

const client = new TelemetryGlideClient(baseClient);

// All operations are now tracked
await client.set('user:123', JSON.stringify({ name: 'John' }), 3600);
const user = await client.get('user:123');

// Get metrics report
console.log('Metrics:', client.getMetrics());
`.trim(),
  connectionBackoff: () =>
    `
import { GlideClient } from '@valkey/valkey-glide';

// Client with custom connection backoff strategy
const resilientClient = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }],
  
  // Connection backoff configuration for resilience
  connectionBackoff: {
    numberOfRetries: 5,        // Max retry attempts
    factor: 2,                  // Backoff multiplier
    exponentBase: 2,           // Exponential base for delays
  },
  
  // Other resilience settings
  requestTimeout: 5000,        // 5 second timeout per request
  inflightRequestsLimit: 500,  // Limit concurrent requests
});

// Example: Graceful degradation with fallback
async function getWithFallback(key: string, fallback: any) {
  try {
    const value = await resilientClient.get(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error('Failed to get from Valkey, using fallback:', error);
    return fallback;
  }
}

// Usage with resilience
const userData = await getWithFallback('user:123', { 
  name: 'Guest', 
  cached: false 
});

// Implement circuit breaker pattern
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is open');
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private isOpen(): boolean {
    return this.failures >= this.threshold && 
           (Date.now() - this.lastFailTime) < this.timeout;
  }
  
  private onSuccess() {
    this.failures = 0;
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();
  }
}

const breaker = new CircuitBreaker();
await breaker.execute(() => resilientClient.get('key'));
`.trim(),
};

export function registerGeneratorTools(mcp: McpServer) {
  mcp.tool(
    "gen.clientBasic",
    "Generate basic GLIDE client connection code",
    {},
    async () => ({
      content: [{ type: "text", text: templates.clientBasic() }],
      structuredContent: { code: templates.clientBasic() },
    }),
  );
  mcp.tool(
    "gen.clientCluster",
    "Generate GLIDE cluster client connection code",
    {},
    async () => ({
      content: [{ type: "text", text: templates.clientCluster() }],
      structuredContent: { code: templates.clientCluster() },
    }),
  );
  mcp.tool(
    "gen.cache",
    "Generate caching pattern with TTL",
    {
      key: z.string(),
      ttlSeconds: z.number().int().positive(),
    },
    async ({ key, ttlSeconds }) => ({
      content: [{ type: "text", text: templates.cache({ key, ttlSeconds }) }],
      structuredContent: { code: templates.cache({ key, ttlSeconds }) },
    }),
  );
  mcp.tool(
    "gen.lock",
    "Generate distributed lock pattern",
    {
      lockKey: z.string(),
      ttlMs: z.number().int().positive(),
    },
    async ({ lockKey, ttlMs }) => ({
      content: [{ type: "text", text: templates.lock({ lockKey, ttlMs }) }],
      structuredContent: { code: templates.lock({ lockKey, ttlMs }) },
    }),
  );
  mcp.tool(
    "gen.pubsubPublisher",
    "Generate pub/sub publisher pattern",
    {
      channel: z.string(),
    },
    async ({ channel }) => ({
      content: [{ type: "text", text: templates.pubsubPublisher({ channel }) }],
      structuredContent: { code: templates.pubsubPublisher({ channel }) },
    }),
  );
  mcp.tool(
    "gen.pubsubSubscriber",
    "Generate pub/sub subscriber pattern",
    {
      channel: z.string(),
    },
    async ({ channel }) => ({
      content: [{ type: "text", text: templates.pubsubSubscriber({ channel }) }],
      structuredContent: { code: templates.pubsubSubscriber({ channel }) },
    }),
  );
  mcp.tool(
    "gen.pubsubAdvanced",
    "Generate advanced pub/sub pattern with message queuing",
    {
      channel: z.string(),
    },
    async ({ channel }) => ({
      content: [{ type: "text", text: templates.pubsubAdvanced({ channel }) }],
      structuredContent: { code: templates.pubsubAdvanced({ channel }) },
    }),
  );
  mcp.tool(
    "gen.fastify",
    "Generate Fastify plugin integration with GLIDE",
    {},
    async () => ({
      content: [{ type: "text", text: templates.fastify() }],
      structuredContent: { code: templates.fastify() },
    }),
  );
  mcp.tool(
    "gen.rateLimiter",
    "Generate rate limiting pattern",
    {
      key: z.string(),
      points: z.number().int().positive(),
      duration: z.number().int().positive(),
    },
    async ({ key, points, duration }) => ({
      content: [{ type: "text", text: templates.rateLimiter({ key, points, duration }) }],
      structuredContent: { code: templates.rateLimiter({ key, points, duration }) },
    }),
  );
  mcp.tool(
    "gen.queueProducer",
    "Generate queue producer pattern",
    {
      queue: z.string(),
    },
    async ({ queue }) => ({
      content: [{ type: "text", text: templates.queueProducer({ queue }) }],
      structuredContent: { code: templates.queueProducer({ queue }) },
    }),
  );
  mcp.tool(
    "gen.queueConsumer",
    "Generate queue consumer pattern",
    {
      queue: z.string(),
    },
    async ({ queue }) => ({
      content: [{ type: "text", text: templates.queueConsumer({ queue }) }],
      structuredContent: { code: templates.queueConsumer({ queue }) },
    }),
  );
  mcp.tool(
    "gen.sets",
    "Generate Redis sets operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.setExample() }],
      structuredContent: { code: templates.setExample() },
    }),
  );
  mcp.tool(
    "gen.zsets",
    "Generate Redis sorted sets operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.zsetExample() }],
      structuredContent: { code: templates.zsetExample() },
    }),
  );
  mcp.tool(
    "gen.streams",
    "Generate Redis streams operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.streamExample() }],
      structuredContent: { code: templates.streamExample() },
    }),
  );
  mcp.tool(
    "gen.transaction",
    "Generate Redis transaction operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.transactionExample() }],
      structuredContent: { code: templates.transactionExample() },
    }),
  );
  mcp.tool(
    "gen.batch",
    "Generate Redis batch operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.batchExample() }],
      structuredContent: { code: templates.batchExample() },
    }),
  );
  mcp.tool(
    "gen.pipeline",
    "Generate Redis pipeline operations example (deprecated, use gen.batch instead)",
    {},
    async () => ({
      content: [
        {
          type: "text",
          text: "⚠️  Pipeline is deprecated. Use gen.batch instead.\n\n",
        },
        { type: "text", text: templates.pipelineExample() },
      ],
      structuredContent: { code: templates.pipelineExample() },
    }),
  );
  mcp.tool(
    "gen.geo",
    "Generate Redis geospatial operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.geoExample() }],
      structuredContent: { code: templates.geoExample() },
    }),
  );
  mcp.tool(
    "gen.bitmaps",
    "Generate Redis bitmaps operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.bitmapsExample() }],
      structuredContent: { code: templates.bitmapsExample() },
    }),
  );
  mcp.tool(
    "gen.hll",
    "Generate Redis HyperLogLog operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.hllExample() }],
      structuredContent: { code: templates.hllExample() },
    }),
  );
  mcp.tool(
    "gen.json",
    "Generate Redis JSON operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.jsonExample() }],
      structuredContent: { code: templates.jsonExample() },
    }),
  );
  mcp.tool(
    "gen.hashesAdvanced",
    "Generate Redis hashes advanced operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.hashesAdvanced() }],
      structuredContent: { code: templates.hashesAdvanced() },
    }),
  );
  mcp.tool(
    "gen.listsAdvanced",
    "Generate Redis lists advanced operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.listsAdvanced() }],
      structuredContent: { code: templates.listsAdvanced() },
    }),
  );
  mcp.tool(
    "gen.zsetRankings",
    "Generate Redis sorted set rankings operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.zsetRankings() }],
      structuredContent: { code: templates.zsetRankings() },
    }),
  );
  mcp.tool(
    "gen.jsonAdvanced",
    "Generate Redis JSON advanced operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.jsonAdvanced() }],
      structuredContent: { code: templates.jsonAdvanced() },
    }),
  );
  mcp.tool(
    "gen.scan",
    "Generate Redis key scanning operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.scanExample() }],
      structuredContent: { code: templates.scanExample() },
    }),
  );
  mcp.tool(
    "gen.clientAdvanced",
    "Generate advanced GLIDE client configuration example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.clientAdvanced() }],
      structuredContent: { code: templates.clientAdvanced() },
    }),
  );
  mcp.tool(
    "gen.azAffinityClient",
    "Generate availability zone affinity client configuration example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.azAffinityClient() }],
      structuredContent: { code: templates.azAffinityClient() },
    }),
  );
  mcp.tool(
    "gen.readPreferenceClient",
    "Generate read preference client configuration example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.readPreferenceClient() }],
      structuredContent: { code: templates.readPreferenceClient() },
    }),
  );
  mcp.tool(
    "gen.clusterScanAdvanced",
    "Generate advanced cluster scanning operations example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.clusterScanAdvanced() }],
      structuredContent: { code: templates.clusterScanAdvanced() },
    }),
  );
  mcp.tool(
    "gen.routingStrategies",
    "Generate cluster routing strategies example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.routingStrategies() }],
      structuredContent: { code: templates.routingStrategies() },
    }),
  );
  mcp.tool(
    "gen.telemetryClient",
    "Generate client with telemetry and metrics tracking example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.telemetryClient() }],
      structuredContent: { code: templates.telemetryClient() },
    }),
  );
  mcp.tool(
    "gen.connectionBackoff",
    "Generate resilient client with connection backoff and circuit breaker example",
    {},
    async () => ({
      content: [{ type: "text", text: templates.connectionBackoff() }],
      structuredContent: { code: templates.connectionBackoff() },
    }),
  );
}
