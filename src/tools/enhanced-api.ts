import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { findEquivalent, searchAll } from "../data/api/mappings.js";
import {
  IOREDIS_DATASET,
  NODE_REDIS_DATASET,
  GLIDE_SURFACE,
} from "../data/api/mappings.js";

export function registerEnhancedApiTools(mcp: McpServer) {
  // ============================================
  // ENHANCED NO-PARAMETER TOOLS FOR USABILITY
  // ============================================

  // Show common Redis operations and their GLIDE equivalents
  mcp.tool(
    "api.common",
    "Show the most common Redis operations and their GLIDE equivalents",
    {},
    async () => {
      const commonOps = [
        { op: "get", ioredis: "get(key)", glide: "client.get(key)" },
        { op: "set", ioredis: "set(key, value)", glide: "client.set(key, value)" },
        { op: "set with TTL", ioredis: "set(key, value, 'EX', 60)", glide: "client.set(key, value, {expiry: {type: 'EX', count: 60}})" },
        { op: "delete", ioredis: "del(key)", glide: "client.del([key])" },
        { op: "exists", ioredis: "exists(key)", glide: "client.exists([key])" },
        { op: "expire", ioredis: "expire(key, seconds)", glide: "client.expire(key, seconds)" },
        { op: "ttl", ioredis: "ttl(key)", glide: "client.ttl(key)" },
        { op: "incr", ioredis: "incr(key)", glide: "client.incr(key)" },
        { op: "decr", ioredis: "decr(key)", glide: "client.decr(key)" },
        { op: "hget", ioredis: "hget(key, field)", glide: "client.hget(key, field)" },
        { op: "hset", ioredis: "hset(key, field, value)", glide: "client.hset(key, {[field]: value})" },
        { op: "lpush", ioredis: "lpush(key, value)", glide: "client.lpush(key, [value])" },
        { op: "rpush", ioredis: "rpush(key, value)", glide: "client.rpush(key, [value])" },
        { op: "lpop", ioredis: "lpop(key)", glide: "client.lpop(key)" },
        { op: "rpop", ioredis: "rpop(key)", glide: "client.rpop(key)" },
        { op: "sadd", ioredis: "sadd(key, member)", glide: "client.sadd(key, [member])" },
        { op: "srem", ioredis: "srem(key, member)", glide: "client.srem(key, [member])" },
        { op: "smembers", ioredis: "smembers(key)", glide: "client.smembers(key)" },
        { op: "zadd", ioredis: "zadd(key, score, member)", glide: "client.zadd(key, {[member]: score})" },
        { op: "zrange", ioredis: "zrange(key, 0, -1)", glide: "client.zrange(key, {start: 0, end: -1})" },
      ];

      const output = [
        "# Common Redis Operations - GLIDE Migration Guide\n",
        "| Operation | ioredis | GLIDE |",
        "|-----------|---------|-------|",
        ...commonOps.map(item => 
          `| ${item.op} | \`${item.ioredis}\` | \`${item.glide}\` |`
        ),
        "\n## Key Differences:",
        "1. **Arrays for multiple values**: GLIDE often uses arrays where ioredis uses varargs",
        "2. **Object configs**: GLIDE uses config objects for options (e.g., expiry)",
        "3. **Consistent naming**: GLIDE uses consistent method names across all operations",
      ];

      return {
        content: [
          { type: "text", text: output.join("\n") },
        ],
      };
    }
  );

  // Show all string operations
  mcp.tool(
    "api.strings",
    "Show all string operations in GLIDE with examples",
    {},
    async () => {
      const stringOps = GLIDE_SURFACE.entries
        .filter(e => e.category === "strings")
        .map(e => ({
          method: e.symbol,
          description: e.description || "String operation",
          example: (e as any).examples?.[0] || `client.${e.symbol}(key, value)`
        }));

      return {
        content: [
          { type: "text", text: "# GLIDE String Operations\n" },
          { type: "text", text: JSON.stringify(stringOps, null, 2) },
        ],
      };
    }
  );

  // Show all hash operations
  mcp.tool(
    "api.hashes",
    "Show all hash operations in GLIDE with examples",
    {},
    async () => {
      const hashOps = GLIDE_SURFACE.entries
        .filter(e => e.category === "hashes")
        .map(e => ({
          method: e.symbol,
          description: e.description || "Hash operation",
          example: (e as any).examples?.[0] || `client.${e.symbol}(key, field)`
        }));

      return {
        content: [
          { type: "text", text: "# GLIDE Hash Operations\n" },
          { type: "text", text: JSON.stringify(hashOps, null, 2) },
        ],
      };
    }
  );

  // Show all list operations
  mcp.tool(
    "api.lists",
    "Show all list operations in GLIDE with examples",
    {},
    async () => {
      const listOps = GLIDE_SURFACE.entries
        .filter(e => e.category === "lists")
        .map(e => ({
          method: e.symbol,
          description: e.description || "List operation",
          example: (e as any).examples?.[0] || `client.${e.symbol}(key, value)`
        }));

      return {
        content: [
          { type: "text", text: "# GLIDE List Operations\n" },
          { type: "text", text: JSON.stringify(listOps, null, 2) },
        ],
      };
    }
  );

  // Show all set operations
  mcp.tool(
    "api.sets",
    "Show all set operations in GLIDE with examples",
    {},
    async () => {
      const setOps = GLIDE_SURFACE.entries
        .filter(e => e.category === "sets")
        .map(e => ({
          method: e.symbol,
          description: e.description || "Set operation",
          example: (e as any).examples?.[0] || `client.${e.symbol}(key, member)`
        }));

      return {
        content: [
          { type: "text", text: "# GLIDE Set Operations\n" },
          { type: "text", text: JSON.stringify(setOps, null, 2) },
        ],
      };
    }
  );

  // Show all sorted set operations
  mcp.tool(
    "api.zsets",
    "Show all sorted set operations in GLIDE with examples",
    {},
    async () => {
      const zsetOps = GLIDE_SURFACE.entries
        .filter(e => e.category === "zsets")
        .map(e => ({
          method: e.symbol,
          description: e.description || "Sorted set operation",
          example: (e as any).examples?.[0] || `client.${e.symbol}(key, member, score)`
        }));

      return {
        content: [
          { type: "text", text: "# GLIDE Sorted Set Operations\n" },
          { type: "text", text: JSON.stringify(zsetOps, null, 2) },
        ],
      };
    }
  );

  // Migration examples for common patterns
  mcp.tool(
    "api.migrate.examples",
    "Show migration examples from ioredis to GLIDE for common patterns",
    {},
    async () => {
      const examples = [
        {
          pattern: "Pipeline/Batch Operations",
          ioredis: `const pipeline = redis.pipeline();
pipeline.set('key1', 'value1');
pipeline.get('key2');
pipeline.del('key3');
const results = await pipeline.exec();`,
          glide: `const transaction = new Transaction();
transaction.set('key1', 'value1');
transaction.get('key2');
transaction.del(['key3']);
const results = await client.exec(transaction);`,
          notes: "GLIDE uses Transaction for batching"
        },
        {
          pattern: "Pub/Sub",
          ioredis: `redis.subscribe('channel');
redis.on('message', (channel, message) => {
  console.log(message);
});`,
          glide: `const subscriber = await GlideClient.createClient({
  addresses: [{host: 'localhost', port: 6379}],
  pubsubSubscriptions: {
    channelsAndPatterns: {channels: ['channel']},
    callback: (message) => {
      console.log(message);
    }
  }
});`,
          notes: "GLIDE requires callback at connection time"
        },
        {
          pattern: "Lua Scripts",
          ioredis: `const result = await redis.eval(
  "return redis.call('get', KEYS[1])",
  1, 'mykey'
);`,
          glide: `const script = \`return redis.call('get', KEYS[1])\`;
const result = await client.eval(
  script,
  {keys: ['mykey']}
);`,
          notes: "GLIDE uses object syntax for keys/args"
        },
        {
          pattern: "Connection with Auth",
          ioredis: `const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: 'secret'
});`,
          glide: `const client = await GlideClient.createClient({
  addresses: [{host: 'localhost', port: 6379}],
  credentials: {password: 'secret'}
});`,
          notes: "GLIDE uses credentials object"
        },
        {
          pattern: "Cluster Mode",
          ioredis: `const cluster = new Redis.Cluster([
  {host: '127.0.0.1', port: 7000},
  {host: '127.0.0.1', port: 7001}
]);`,
          glide: `const cluster = await GlideClusterClient.createClient({
  addresses: [
    {host: '127.0.0.1', port: 7000},
    {host: '127.0.0.1', port: 7001}
  ]
});`,
          notes: "Use GlideClusterClient for clusters"
        }
      ];

      const output = examples.map(ex => `
## ${ex.pattern}

### ioredis:
\`\`\`javascript
${ex.ioredis}
\`\`\`

### GLIDE:
\`\`\`javascript
${ex.glide}
\`\`\`

**Note:** ${ex.notes}
`).join("\n---\n");

      return {
        content: [
          { type: "text", text: "# Migration Examples: ioredis to GLIDE\n" + output },
        ],
      };
    }
  );

  // Show differences for a common operation set
  mcp.tool(
    "api.diff.common",
    "Show key differences between ioredis/node-redis and GLIDE for common operations",
    {},
    async () => {
      const differences = [
        {
          aspect: "Method Arguments",
          ioredis: "Variadic arguments: set(key, value, 'EX', 60)",
          nodeRedis: "Options object: set(key, value, {EX: 60})",
          glide: "Typed config: set(key, value, {expiry: {type: 'EX', count: 60}})"
        },
        {
          aspect: "Multiple Values",
          ioredis: "Variadic: lpush(key, val1, val2, val3)",
          nodeRedis: "Array: lPush(key, [val1, val2, val3])",
          glide: "Always array: lpush(key, [val1, val2, val3])"
        },
        {
          aspect: "Return Types",
          ioredis: "Mixed: exists returns 0/1",
          nodeRedis: "Mixed: exists returns boolean",
          glide: "Consistent: exists returns number"
        },
        {
          aspect: "Error Handling",
          ioredis: "Throws errors or returns null",
          nodeRedis: "Throws errors",
          glide: "Always throws typed errors"
        },
        {
          aspect: "Async/Promises",
          ioredis: "Callbacks or Promises",
          nodeRedis: "Promises only (v4+)",
          glide: "Promises only, fully async"
        },
        {
          aspect: "Pipeline/Batch",
          ioredis: "pipeline() with chaining",
          nodeRedis: "multi() with chaining",
          glide: "Transaction class with methods"
        },
        {
          aspect: "Pub/Sub",
          ioredis: "Event-based: on('message')",
          nodeRedis: "Async iterator or callbacks",
          glide: "Callback at connection time"
        }
      ];

      const output = [
        "# Key Differences: ioredis vs node-redis vs GLIDE\n",
        "| Aspect | ioredis | node-redis | GLIDE |",
        "|--------|---------|------------|-------|",
        ...differences.map(d => 
          `| ${d.aspect} | ${d.ioredis} | ${d.nodeRedis} | ${d.glide} |`
        )
      ];

      return {
        content: [
          { type: "text", text: output.join("\n") },
        ],
      };
    }
  );

  // Search for SET-related operations
  mcp.tool(
    "api.search.set",
    "Search for all SET-related operations across all clients",
    {},
    async () => {
      const results = searchAll("set");
      const organized = {
        ioredis: results.filter(r => (r as any).source === "ioredis").slice(0, 10),
        nodeRedis: results.filter(r => (r as any).source === "node-redis").slice(0, 10),
        glide: results.filter(r => (r as any).source === "glide").slice(0, 10)
      };

      return {
        content: [
          { type: "text", text: "# SET-related Operations\n" },
          { type: "text", text: JSON.stringify(organized, null, 2) },
        ],
      };
    }
  );

  // Search for GET-related operations
  mcp.tool(
    "api.search.get",
    "Search for all GET-related operations across all clients",
    {},
    async () => {
      const results = searchAll("get");
      const organized = {
        ioredis: results.filter(r => (r as any).source === "ioredis").slice(0, 10),
        nodeRedis: results.filter(r => (r as any).source === "node-redis").slice(0, 10),
        glide: results.filter(r => (r as any).source === "glide").slice(0, 10)
      };

      return {
        content: [
          { type: "text", text: "# GET-related Operations\n" },
          { type: "text", text: JSON.stringify(organized, null, 2) },
        ],
      };
    }
  );

  // Show transaction/pipeline patterns
  mcp.tool(
    "api.transactions",
    "Show transaction and pipeline patterns in GLIDE",
    {},
    async () => {
      const transactionOps = GLIDE_SURFACE.entries
        .filter(e => e.category === "transactions" || e.symbol.includes("transaction"))
        .map(e => ({
          method: e.symbol,
          description: e.description || "Transaction operation",
          example: (e as any).examples?.[0] || `client.${e.symbol}()`
        }));

      const examples = `
# GLIDE Transaction Examples

## Basic Transaction
\`\`\`javascript
import { Transaction } from '@valkey/valkey-glide';

const transaction = new Transaction();
transaction
  .set('key1', 'value1')
  .get('key2')
  .incr('counter')
  .hset('hash', {'field': 'value'})
  .zadd('zset', {'member': 1.0});

const results = await client.exec(transaction);
// results is an array of responses for each command
\`\`\`

## Conditional Transaction (WATCH)
\`\`\`javascript
// Watch keys for changes
await client.watch(['key1', 'key2']);

// Build transaction
const transaction = new Transaction();
transaction.set('key1', 'newvalue');

// Execute (will fail if watched keys changed)
try {
  const results = await client.exec(transaction);
} catch (error) {
  console.log('Transaction aborted due to key changes');
}
\`\`\`

## Transaction with Error Handling
\`\`\`javascript
const transaction = new Transaction();
transaction
  .set('key', 'value')
  .incr('not_a_number')  // This will fail
  .get('key');

try {
  const results = await client.exec(transaction);
} catch (error) {
  // Handle transaction errors
  console.error('Transaction failed:', error);
}
\`\`\`
`;

      return {
        content: [
          { type: "text", text: examples },
          { type: "text", text: "\n## Transaction Methods:\n" },
          { type: "text", text: JSON.stringify(transactionOps, null, 2) },
        ],
      };
    }
  );

  // Show pub/sub patterns
  mcp.tool(
    "api.pubsub",
    "Show pub/sub patterns and operations in GLIDE",
    {},
    async () => {
      const pubsubOps = GLIDE_SURFACE.entries
        .filter(e => e.category === "pubsub")
        .map(e => ({
          method: e.symbol,
          description: e.description || "Pub/Sub operation",
          example: (e as any).examples?.[0] || `client.${e.symbol}()`
        }));

      const examples = `
# GLIDE Pub/Sub Patterns

## Basic Pub/Sub Setup
\`\`\`javascript
// Publisher client
const publisher = await GlideClient.createClient({
  addresses: [{host: 'localhost', port: 6379}]
});

// Subscriber client with callback
const subscriber = await GlideClient.createClient({
  addresses: [{host: 'localhost', port: 6379}],
  pubsubSubscriptions: {
    channelsAndPatterns: {
      channels: ['news', 'updates'],
      patterns: ['user:*', 'system:*']
    },
    callback: (message) => {
      console.log('Channel:', message.channel);
      console.log('Message:', message.message);
      console.log('Pattern:', message.pattern); // if pattern match
    }
  }
});

// Publishing messages
await publisher.publish('news', 'Breaking news!');
await publisher.publish('user:123', 'User update');
\`\`\`

## Advanced Pub/Sub with Message Queue
\`\`\`javascript
class MessageQueue {
  constructor() {
    this.messages = [];
    this.handlers = new Map();
  }

  async connect() {
    this.client = await GlideClient.createClient({
      addresses: [{host: 'localhost', port: 6379}],
      pubsubSubscriptions: {
        channelsAndPatterns: {
          channels: Array.from(this.handlers.keys())
        },
        callback: (msg) => this.handleMessage(msg)
      }
    });
  }

  handleMessage(msg) {
    const handler = this.handlers.get(msg.channel);
    if (handler) {
      handler(msg.message);
    } else {
      this.messages.push(msg);
    }
  }

  subscribe(channel, handler) {
    this.handlers.set(channel, handler);
  }
}
\`\`\`

## Pub/Sub with Async Iterator Pattern
\`\`\`javascript
// Note: GLIDE doesn't natively support async iterators yet
// This is a workaround pattern using callbacks and promises

class AsyncPubSub {
  constructor() {
    this.messageQueue = [];
    this.waiters = [];
  }

  async *messages() {
    while (true) {
      if (this.messageQueue.length > 0) {
        yield this.messageQueue.shift();
      } else {
        await new Promise(resolve => this.waiters.push(resolve));
      }
    }
  }

  async connect(channels) {
    this.client = await GlideClient.createClient({
      addresses: [{host: 'localhost', port: 6379}],
      pubsubSubscriptions: {
        channelsAndPatterns: { channels },
        callback: (msg) => {
          this.messageQueue.push(msg);
          if (this.waiters.length > 0) {
            this.waiters.shift()();
          }
        }
      }
    });
  }
}

// Usage
const pubsub = new AsyncPubSub();
await pubsub.connect(['events']);

for await (const msg of pubsub.messages()) {
  console.log('Received:', msg);
}
\`\`\`
`;

      return {
        content: [
          { type: "text", text: examples },
          { type: "text", text: "\n## Pub/Sub Methods:\n" },
          { type: "text", text: JSON.stringify(pubsubOps, null, 2) },
        ],
      };
    }
  );
}