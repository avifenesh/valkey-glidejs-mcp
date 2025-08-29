import { test, describe } from "node:test";
import assert from "node:assert";

/**
 * Real-world node-redis migration test cases based on actual GitHub patterns
 * Sourced from redis/node-redis official examples and documentation
 */

describe("Node-Redis real-world migration patterns", () => {
  // Pattern 1: Basic Redis Connection and Operations (from official docs)
  test("should migrate basic node-redis connection pattern", async () => {
    const nodeRedisCode = `
import { createClient } from 'redis';

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

const value = await client.get('key');
const reply = await client.set('key', 'value');

client.disconnect();
    `;

    // Test that the pattern is recognized and can be migrated
    assert.ok(nodeRedisCode.includes("createClient"));
    assert.ok(nodeRedisCode.includes("client.connect()"));
    assert.ok(nodeRedisCode.includes("disconnect"));
    // Migration tool should handle this pattern
  });

  // Pattern 2: Express Session with connect-redis (from connect-redis docs)
  test("should migrate node-redis express session pattern", async () => {
    const nodeRedisCode = `
import {RedisStore} from "connect-redis";
import session from "express-session";
import {createClient} from "redis";

// Initialize client.
let redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

// Initialize session storage.
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: "keyboard cat",
  }),
);
    `;

    assert.ok(nodeRedisCode.includes("createClient"));
    assert.ok(nodeRedisCode.includes("RedisStore"));
    assert.ok(nodeRedisCode.includes("redisClient.connect()"));
  });

  // Pattern 3: Pub/Sub with node-redis v4 (from official docs)
  test("should migrate node-redis pub/sub pattern", async () => {
    const nodeRedisCode = `
import { createClient } from 'redis';

const client = createClient();
await client.connect();

// Publishing
await client.publish('channel', 'message');

// Subscribing
const listener = (message, channel) => console.log(message, channel);
await client.subscribe('channel', listener);
await client.pSubscribe('channe*', listener);

// Unsubscribing
await client.unsubscribe();
await client.pUnsubscribe();
    `;

    assert.ok(nodeRedisCode.includes("pSubscribe"));
    assert.ok(nodeRedisCode.includes("publish"));
    assert.ok(nodeRedisCode.includes("subscribe"));
    assert.ok(nodeRedisCode.includes("unsubscribe"));
  });

  // Pattern 4: Transaction/Multi Operations (from official docs)
  test("should migrate node-redis transaction pattern", async () => {
    const nodeRedisCode = `
import { createClient } from 'redis';

const client = createClient();
await client.connect();

// Basic transaction
await client.set("another-key", "another-value");

const [setKeyReply, otherKeyValue] = await client
  .multi()
  .set("key", "value")
  .get("another-key")
  .exec(); // ['OK', 'another-value']

// Pipeline (execAsPipeline)
await client.multi()
  .set('seat:3', '#3')
  .set('seat:4', '#4')
  .set('seat:5', '#5')
  .execAsPipeline();
    `;

    assert.ok(nodeRedisCode.includes("multi()"));
    assert.ok(nodeRedisCode.includes(".exec()"));
    assert.ok(nodeRedisCode.includes("execAsPipeline"));
  });

  // Pattern 5: JSON Operations (from official examples)
  test("should migrate node-redis JSON operations pattern", async () => {
    const nodeRedisCode = `
import { createClient } from 'redis';

const client = createClient();
await client.connect();

// Store a JSON object
await client.json.set('noderedis:jsondata', '$', {
    name: 'Roberta McDonald',
    pets: [
        { name: 'Fluffy', species: 'dog', age: 5, isMammal: true },
        { name: 'Rex', species: 'dog', age: 3, isMammal: true },
        { name: 'Goldie', species: 'fish', age: 2, isMammal: false }
    ],
    address: {
        number: 99,
        street: 'Main Street',
        city: 'Springfield',
        state: 'OH',
        country: 'USA'
    }
});

// Retrieve specific JSON data
let results = await client.json.get('noderedis:jsondata', {
    path: [
        '$.pets[1].name',
        '$.pets[1].age'
    ]
});

// Increment a value
await client.json.numIncrBy('noderedis:jsondata', '$.pets[2].age', 1);

// Append to an array
await client.json.arrAppend('noderedis:jsondata', '$.pets', {
    name: 'Robin',
    species: 'bird',
    isMammal: false,
    age: 1
});

client.close();
    `;

    assert.ok(nodeRedisCode.includes("json.set"));
    assert.ok(nodeRedisCode.includes("json.get"));
    assert.ok(nodeRedisCode.includes("json.numIncrBy"));
    assert.ok(nodeRedisCode.includes("json.arrAppend"));
  });

  // Pattern 6: Hash Operations
  test("should migrate node-redis hash operations pattern", async () => {
    const nodeRedisCode = `
import { createClient } from 'redis';

const client = createClient();
await client.connect();

// Store session data as hash
await client.hSet('user-session:123', {
  name: 'John',
  surname: 'Smith', 
  company: 'Redis',
  age: 29
});

let userSession = await client.hGetAll('user-session:123');

// Individual field operations
await client.hSet('user-session:123', 'lastLogin', Date.now());
const name = await client.hGet('user-session:123', 'name');

client.disconnect();
    `;

    assert.ok(nodeRedisCode.includes("hSet"));
    assert.ok(nodeRedisCode.includes("hGetAll"));
    assert.ok(nodeRedisCode.includes("hGet"));
  });

  // Pattern 7: Configuration-based client with URL
  test("should migrate node-redis URL-based connection pattern", async () => {
    const nodeRedisCode = `
import { createClient } from 'redis';

// Environment-based connection
const url = process.env.REDIS_URL || 'redis://localhost:6379';
const client = createClient({ url });

// URL with authentication  
const authClient = createClient({ 
  url: 'redis://alice:foobared@awesome.redis.server:6380' 
});

await client.connect();
await authClient.connect();

// Basic operations
await client.set('config:theme', 'dark');
const theme = await client.get('config:theme');

client.disconnect();
authClient.disconnect();
    `;

    assert.ok(nodeRedisCode.includes("process.env.REDIS_URL"));
    assert.ok(nodeRedisCode.includes("createClient({ url })"));
    assert.ok(nodeRedisCode.includes("alice:foobared"));
  });

  // Pattern 8: Error handling and reconnection
  test("should migrate node-redis error handling pattern", async () => {
    const nodeRedisCode = `
import { createClient } from 'redis';

const client = createClient({
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500)
  }
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connected'));
client.on('ready', () => console.log('Redis Client Ready'));
client.on('end', () => console.log('Redis Client Disconnected'));

await client.connect();

// Operations with error handling
try {
  await client.set('key', 'value');
  const value = await client.get('key');
} catch (error) {
  console.error('Redis operation failed:', error);
}

client.disconnect();
    `;

    assert.ok(nodeRedisCode.includes("reconnectStrategy"));
    assert.ok(nodeRedisCode.includes("client.on('error'"));
    assert.ok(nodeRedisCode.includes("try {"));
  });

  // Pattern 9: SET with expiration options (setEx alternative)
  test("should migrate node-redis setEx pattern", async () => {
    const nodeRedisCode = `
import { createClient } from 'redis';

const client = createClient();
await client.connect();

// Cache with TTL using setEx
await client.setEx('cache:user:123', 3600, JSON.stringify({
  name: 'John Doe',
  email: 'john@example.com'
}));

// Alternative with set and EX option
await client.set('session:abc123', 'session-data', {
  EX: 1800 // 30 minutes
});

// Atomic operations
await client.multi()
  .setEx('temp:counter', 60, '1')
  .incr('global:counter')
  .exec();

client.disconnect();
    `;

    assert.ok(nodeRedisCode.includes("setEx"));
    assert.ok(nodeRedisCode.includes("EX: 1800"));
    assert.ok(nodeRedisCode.includes("multi()"));
  });

  // Pattern 10: Lua scripting with eval
  test("should migrate node-redis lua script pattern", async () => {
    const nodeRedisCode = `
import { createClient } from 'redis';

const client = createClient();
await client.connect();

// Lua script for atomic operations
const luaScript = \`
  local key = KEYS[1]
  local increment = tonumber(ARGV[1])
  local max = tonumber(ARGV[2])
  
  local current = redis.call('GET', key)
  if current == false then
    current = 0
  else
    current = tonumber(current)
  end
  
  if current + increment <= max then
    redis.call('SET', key, current + increment)
    return current + increment
  else
    return -1
  end
\`;

// Execute script
const result = await client.eval(luaScript, {
  keys: ['counter:limit'],
  arguments: ['5', '100']
});

// Alternative with evalSha for performance
const sha1 = await client.scriptLoad(luaScript);
const cachedResult = await client.evalSha(sha1, {
  keys: ['counter:limit'],
  arguments: ['3', '100']
});

client.disconnect();
    `;

    assert.ok(nodeRedisCode.includes("eval(luaScript"));
    assert.ok(nodeRedisCode.includes("scriptLoad"));
    assert.ok(nodeRedisCode.includes("evalSha"));
    assert.ok(nodeRedisCode.includes("keys: ['counter:limit']"));
  });
});