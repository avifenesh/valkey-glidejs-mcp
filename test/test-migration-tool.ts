#!/usr/bin/env tsx

import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

/**
 * Test our MCP migration tool with real-world patterns
 */

interface TestCase {
  name: string;
  sourceCode: string;
  from: 'ioredis' | 'node-redis';
  expectedPatterns: string[];
  shouldMigrate: string[];
}

const testCases: TestCase[] = [
  // ioredis test cases
  {
    name: "ioredis: Session Management with Express",
    from: 'ioredis',
    sourceCode: `
import Redis from 'ioredis';
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  retryDelayOnFailover: 100
});

app.get('/profile', async (req, res) => {
  const userKey = \`user:\${req.session.userId}\`;
  let userData = await redis.get(userKey);
  if (!userData) {
    userData = await fetchUserFromDB(req.session.userId);
    await redis.setex(userKey, 3600, JSON.stringify(userData));
  }
  res.json(JSON.parse(userData));
});
    `,
    expectedPatterns: ["GlideClient.createClient", "client.get", "client.set"],
    shouldMigrate: ["new Redis(", "setex"],
  },

  {
    name: "ioredis: Distributed Lock Pattern",
    from: 'ioredis',
    sourceCode: `
import Redis from 'ioredis';

class DistributedLock {
  constructor() {
    this.redis = new Redis();
  }
  
  async acquireLock(resource, ttl = 5000) {
    const lockKey = \`lock:\${resource}\`;
    const lockValue = \`\${Date.now()}-\${Math.random()}\`;
    
    const result = await this.redis.set(lockKey, lockValue, 'PX', ttl, 'NX');
    return result === 'OK';
  }
  
  async releaseLock(lockKey, lockValue) {
    const script = \`
      if redis.call('get', KEYS[1]) == ARGV[1] then
        return redis.call('del', KEYS[1])
      else
        return 0
      end
    \`;
    return await this.redis.eval(script, 1, lockKey, lockValue);
  }
}
    `,
    expectedPatterns: ["conditionalSet", "expiry", "invokeScript"],
    shouldMigrate: ["'PX'", "'NX'", "eval"],
  },

  {
    name: "Rate Limiting with Pipeline",
    ioredisCode: `
import Redis from 'ioredis';

class RateLimiter {
  constructor() {
    this.redis = new Redis();
  }
  
  async checkRate(identifier, limit, windowMs) {
    const key = \`rate_limit:\${identifier}\`;
    const now = Date.now();
    const windowKey = \`\${key}:\${Math.floor(now / windowMs)}\`;
    
    const pipeline = this.redis.pipeline();
    pipeline.incr(windowKey);
    pipeline.expire(windowKey, Math.ceil(windowMs / 1000));
    
    const results = await pipeline.exec();
    const count = results[0][1];
    
    return { allowed: count <= limit, count };
  }
}
    `,
    expectedPatterns: ["Transaction", "tx.incr", "tx.expire"],
    shouldMigrate: ["pipeline()", "pipeline.incr", "pipeline.expire"],
  },

  {
    name: "Pub/Sub with Patterns",
    ioredisCode: `
import Redis from 'ioredis';

class EventManager {
  constructor() {
    this.publisher = new Redis();
    this.subscriber = new Redis();
  }
  
  async publishEvent(channel, data) {
    return await this.publisher.publish(channel, JSON.stringify(data));
  }
  
  subscribeToPattern(pattern, handler) {
    this.subscriber.psubscribe(pattern);
    this.subscriber.on('pmessage', (pattern, channel, message) => {
      handler(channel, JSON.parse(message));
    });
  }
}
    `,
    expectedPatterns: ["client.publish", "customCommand"],
    shouldMigrate: ["psubscribe", "pmessage"],
  },

  {
    name: "Cache with Multi-get/set",
    ioredisCode: `
import Redis from 'ioredis';

class CacheManager {
  constructor() {
    this.redis = new Redis();
  }
  
  async mget(keys) {
    const results = await this.redis.mget(...keys);
    return results.map(result => result ? JSON.parse(result) : null);
  }
  
  async mset(keyValuePairs, ttl = 3600) {
    const pipeline = this.redis.pipeline();
    
    for (const [key, value] of Object.entries(keyValuePairs)) {
      pipeline.setex(key, ttl, JSON.stringify(value));
    }
    
    return await pipeline.exec();
  }
}
    `,
    expectedPatterns: ["client.mget", "Transaction", "client.set"],
    shouldMigrate: ["mget(...keys)", "setex"],
  },

  {
    name: "Queue with Sorted Sets",
    ioredisCode: `
import Redis from 'ioredis';

class JobQueue {
  constructor() {
    this.redis = new Redis();
  }
  
  async addDelayedJob(data, delayMs) {
    const job = { id: Date.now(), data };
    const score = Date.now() + delayMs;
    await this.redis.zadd('delayed:jobs', score, JSON.stringify(job));
  }
  
  async getReadyJobs() {
    const now = Date.now();
    const jobs = await this.redis.zrangebyscore('delayed:jobs', 0, now);
    
    if (jobs.length > 0) {
      await this.redis.zremrangebyscore('delayed:jobs', 0, now);
    }
    
    return jobs.map(job => JSON.parse(job));
  }
  
  async processNext() {
    return await this.redis.brpoplpush('jobs:pending', 'jobs:processing', 5);
  }
}
    `,
    expectedPatterns: [
      "client.zadd",
      "client.zrangeByScore",
      "client.zremRangeByScore",
    ],
    shouldMigrate: ["zadd", "zrangebyscore", "brpoplpush"],
  },

  // node-redis test cases (based on real GitHub patterns)
  {
    name: "node-redis: Basic Connection Pattern",
    from: 'node-redis',
    sourceCode: `
import { createClient } from 'redis';

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

const value = await client.get('key');
const reply = await client.set('key', 'value');

client.disconnect();
    `,
    expectedPatterns: ["GlideClient.createClient", "client.get", "client.set"],
    shouldMigrate: ["createClient()", "client.connect()", "disconnect"],
  },

  {
    name: "node-redis: Express Session with connect-redis",
    from: 'node-redis',
    sourceCode: `
import {RedisStore} from "connect-redis";
import session from "express-session";
import {createClient} from "redis";

let redisClient = createClient();
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: "keyboard cat",
  }),
);
    `,
    expectedPatterns: ["GlideClient.createClient", "RedisStore"],
    shouldMigrate: ["createClient()", "redisClient.connect()"],
  },

  {
    name: "node-redis: Pub/Sub Pattern",
    from: 'node-redis',
    sourceCode: `
import { createClient } from 'redis';

const client = createClient();
await client.connect();

await client.publish('channel', 'message');

const listener = (message, channel) => console.log(message, channel);
await client.subscribe('channel', listener);
await client.pSubscribe('channe*', listener);

await client.unsubscribe();
await client.pUnsubscribe();
    `,
    expectedPatterns: ["client.publish", "GlideClient.createClient"],
    shouldMigrate: ["subscribe('channel'", "pSubscribe", "unsubscribe"],
  },

  {
    name: "node-redis: Transaction/Multi Operations",
    from: 'node-redis',
    sourceCode: `
import { createClient } from 'redis';

const client = createClient();
await client.connect();

const [setKeyReply, otherKeyValue] = await client
  .multi()
  .set("key", "value")
  .get("another-key")
  .exec();

await client.multi()
  .set('seat:3', '#3')
  .set('seat:4', '#4')
  .set('seat:5', '#5')
  .execAsPipeline();
    `,
    expectedPatterns: ["Transaction", "client.exec"],
    shouldMigrate: ["multi()", ".exec()", "execAsPipeline"],
  },

  {
    name: "node-redis: Hash Operations",
    from: 'node-redis',
    sourceCode: `
import { createClient } from 'redis';

const client = createClient();
await client.connect();

await client.hSet('user-session:123', {
  name: 'John',
  surname: 'Smith', 
  company: 'Redis',
  age: 29
});

let userSession = await client.hGetAll('user-session:123');
const name = await client.hGet('user-session:123', 'name');

client.disconnect();
    `,
    expectedPatterns: ["client.hset", "client.hgetAll", "client.hget"],
    shouldMigrate: ["hSet", "hGetAll", "hGet"],
  },

  {
    name: "node-redis: setEx and Expiration",
    from: 'node-redis',
    sourceCode: `
import { createClient } from 'redis';

const client = createClient();
await client.connect();

await client.setEx('cache:user:123', 3600, JSON.stringify({
  name: 'John Doe',
  email: 'john@example.com'
}));

await client.set('session:abc123', 'session-data', {
  EX: 1800
});

client.disconnect();
    `,
    expectedPatterns: ["client.set", "expiry"],
    shouldMigrate: ["setEx", "EX: 1800"],
  },
];

async function testMigrationTool() {
  console.log("🧪 Testing MCP Migration Tool with Real-World Patterns\n");
  console.log("=".repeat(80));

  const results: Array<{ name: string; success: boolean; issues: string[] }> =
    [];

  for (const testCase of testCases) {
    console.log(`\n📝 Testing: ${testCase.name}`);

    try {
      // Create temporary file with the test code
      const tempFile = path.join(process.cwd(), "temp-migration-test.ts");
      await fs.writeFile(tempFile, testCase.sourceCode);

      // Run MCP migration tool
      const migratedCode = await runMigrationTool(testCase.sourceCode, testCase.from);

      const issues: string[] = [];

      // Check if expected patterns are present in migrated code
      for (const pattern of testCase.expectedPatterns) {
        if (!migratedCode.includes(pattern)) {
          issues.push(`Missing expected pattern: ${pattern}`);
        }
      }

      // Check if old patterns were migrated
      for (const oldPattern of testCase.shouldMigrate) {
        if (migratedCode.includes(oldPattern)) {
          issues.push(`Old pattern not migrated: ${oldPattern}`);
        }
      }

      // Clean up
      await fs.unlink(tempFile).catch(() => {});

      const success = issues.length === 0;
      results.push({ name: testCase.name, success, issues });

      if (success) {
        console.log("  ✅ Migration successful");
      } else {
        console.log("  ❌ Migration issues found:");
        issues.forEach((issue) => console.log(`    - ${issue}`));
      }

      // Show a snippet of the migrated code
      console.log("  📄 Migrated code snippet:");
      const lines = migratedCode.split("\n").slice(0, 10);
      lines.forEach((line) => {
        if (line.trim()) console.log(`    ${line}`);
      });
    } catch (error) {
      console.log(`  ❌ Migration failed: ${error}`);
      results.push({
        name: testCase.name,
        success: false,
        issues: [`Migration error: ${error}`],
      });
    }
  }

  // Summary
  console.log("\n" + "=".repeat(80));
  console.log("📊 MIGRATION TESTING SUMMARY\n");

  const successful = results.filter((r) => r.success).length;
  const total = results.length;

  results.forEach((result) => {
    const icon = result.success ? "✅" : "❌";
    console.log(`${icon} ${result.name}`);
    if (!result.success && result.issues.length > 0) {
      result.issues.forEach((issue) => console.log(`    - ${issue}`));
    }
  });

  console.log(
    `\n📈 Results: ${successful}/${total} patterns migrated successfully`,
  );

  if (successful < total) {
    console.log("\n🔧 Suggested improvements for migration tool:");

    const allIssues = results.flatMap((r) => r.issues);
    const uniqueIssues = [...new Set(allIssues)];

    uniqueIssues.forEach((issue) => {
      if (issue.includes("Missing expected pattern")) {
        const pattern = issue.split(": ")[1];
        console.log(`  - Add support for generating: ${pattern}`);
      } else if (issue.includes("Old pattern not migrated")) {
        const pattern = issue.split(": ")[1];
        console.log(`  - Improve migration of: ${pattern}`);
      }
    });
  }

  return { successful, total, results };
}

async function runMigrationTool(code: string, from: 'ioredis' | 'node-redis'): Promise<string> {
  return new Promise((resolve, reject) => {
    // Simulate calling our MCP migration tool
    // In reality, this would use the MCP client to call the migrate tool

    const child = spawn("npx", ["tsx", "scripts/test-mcp-migration.ts"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let output = "";
    let error = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      error += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(error || "Migration tool failed"));
      }
    });

    // Send the code to stdin
    child.stdin.write(JSON.stringify({ code, from }));
    child.stdin.end();
  });
}

// Simple fallback migration for testing
async function simpleMigration(code: string): Promise<string> {
  // Basic string replacements for testing
  let migrated = code
    .replace(
      /import Redis from 'ioredis'/g,
      "import { GlideClient } from '@valkey/valkey-glide'",
    )
    .replace(
      /new Redis\(\)/g,
      'await GlideClient.createClient({ addresses: [{ host: "localhost", port: 6379 }] })',
    )
    .replace(/\.setex\(/g, ".set(")
    .replace(/\.pipeline\(\)/g, "; const tx = new Transaction(); tx")
    .replace(/pipeline\./g, "tx.")
    .replace(/\.exec\(\)/g, ".exec(tx)")
    .replace(/\.eval\(/g, ".invokeScript(")
    .replace(/\.zadd\(/g, ".zadd(")
    .replace(/\.zrangebyscore\(/g, ".zrangeByScore(");

  return migrated;
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testMigrationTool()
    .then(({ successful, total }) => {
      process.exit(successful === total ? 0 : 1);
    })
    .catch((error) => {
      console.error("Test execution failed:", error);
      process.exit(1);
    });
}
