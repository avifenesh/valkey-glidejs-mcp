/**
 * Unified Code Generator - Consolidates all generation tools
 * Replaces: generators.ts, enhanced-generators.ts, generators-no-params.ts
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolRoutingContext } from "../routing/context-analyzer.js";
import { SmartTool } from "../routing/tool-router.js";

export class UnifiedCodeGenerator implements SmartTool {
  name = "code-generator";
  capabilities = ["client", "pattern", "application", "advanced"];
  complexity = 4;

  supports(context: ToolRoutingContext): boolean {
    return context.userIntent === "generation" || context.taskType === "create";
  }

  async execute(args: any, context: ToolRoutingContext): Promise<any> {
    const generationType = this.determineGenerationType(args, context);

    switch (generationType) {
      case "client":
        return this.generateClientCode(args, context);
      case "pattern":
        return this.generatePatternCode(args, context);
      case "application":
        return this.generateApplicationCode(args, context);
      case "advanced":
        return this.generateAdvancedCode(args, context);
      default:
        return this.showGenerationOptions();
    }
  }

  private determineGenerationType(
    args: any,
    context: ToolRoutingContext,
  ): string {
    if (args.type) return args.type;

    // Infer from patterns
    if (context.patterns.includes("cluster")) return "client";
    if (context.patterns.includes("cache") || context.patterns.includes("lock"))
      return "pattern";
    if (
      context.patterns.includes("pubsub") ||
      context.patterns.includes("streams")
    )
      return "advanced";

    // Infer from parameters
    if (args.clientType) return "client";
    if (args.pattern) return "pattern";
    if (args.app) return "application";

    // Default based on complexity
    if (context.complexity === "simple") return "client";
    if (context.complexity === "intermediate") return "pattern";
    return "advanced";
  }

  private async generateClientCode(args: any, context: ToolRoutingContext) {
    const clientType = args.clientType || args.type || "basic";

    if (clientType === "cluster" || args.cluster) {
      return {
        content: [
          { type: "text", text: "✅ Generated GLIDE Cluster Client Code" },
          { type: "text", text: this.templates.clientCluster() },
        ],
      };
    } else {
      return {
        content: [
          { type: "text", text: "✅ Generated GLIDE Basic Client Code" },
          { type: "text", text: this.templates.clientBasic() },
        ],
      };
    }
  }

  private async generatePatternCode(args: any, context: ToolRoutingContext) {
    const pattern = args.pattern || this.inferPattern(context);

    switch (pattern) {
      case "cache":
        return this.generateCachePattern(args, context);
      case "lock":
        return this.generateLockPattern(args, context);
      case "ratelimit":
        return this.generateRateLimitPattern(args, context);
      case "sets":
        return this.generateSetsPattern(args, context);
      case "zsets":
        return this.generateZSetsPattern(args, context);
      case "geo":
        return this.generateGeoPattern(args, context);
      default:
        return this.showPatternOptions();
    }
  }

  private async generateApplicationCode(
    args: any,
    context: ToolRoutingContext,
  ) {
    const appType = args.app || args.appType || "caching";

    switch (appType) {
      case "caching":
        return {
          content: [
            { type: "text", text: "✅ Generated Complete Caching Application" },
            { type: "text", text: this.templates.app.caching() },
          ],
        };
      case "session":
        return {
          content: [
            {
              type: "text",
              text: "✅ Generated Session Management Application",
            },
            { type: "text", text: this.templates.app.session() },
          ],
        };
      case "queue":
        return {
          content: [
            { type: "text", text: "✅ Generated Queue Application" },
            { type: "text", text: this.templates.app.queue() },
          ],
        };
      default:
        return this.showApplicationOptions();
    }
  }

  private async generateAdvancedCode(args: any, context: ToolRoutingContext) {
    const advancedType = args.advanced || this.inferAdvanced(context);

    switch (advancedType) {
      case "transaction":
        return {
          content: [
            { type: "text", text: "✅ Generated Transaction Pattern" },
            { type: "text", text: this.templates.transaction() },
          ],
        };
      case "batch":
        return {
          content: [
            { type: "text", text: "✅ Generated Batch Operations Pattern" },
            { type: "text", text: this.templates.batch() },
          ],
        };
      case "streams":
        return {
          content: [
            { type: "text", text: "✅ Generated Streams Pattern" },
            { type: "text", text: this.templates.streams() },
          ],
        };
      default:
        return this.showAdvancedOptions();
    }
  }

  private async generateCachePattern(args: any, context: ToolRoutingContext) {
    const key = args.key || "cacheKey";
    const ttlSeconds = args.ttlSeconds || args.ttl || 3600;

    if (typeof ttlSeconds !== "number" || ttlSeconds <= 0) {
      return {
        content: [
          {
            type: "text",
            text: "❌ Error: 'ttlSeconds' must be a positive number",
          },
        ],
      };
    }

    const code = this.templates.cache({ key, ttlSeconds });

    return {
      content: [
        {
          type: "text",
          text: `✅ Generated cache pattern for key "${key}" with ${ttlSeconds}s TTL`,
        },
        { type: "text", text: code },
      ],
    };
  }

  private async generateLockPattern(args: any, context: ToolRoutingContext) {
    const lockKey = args.lockKey || args.key || "lockKey";
    const ttlMs = args.ttlMs || args.ttl || 30000;

    const code = this.templates.lock({ lockKey, ttlMs });

    return {
      content: [
        {
          type: "text",
          text: `✅ Generated distributed lock pattern for "${lockKey}" with ${ttlMs}ms TTL`,
        },
        { type: "text", text: code },
      ],
    };
  }

  private async generateRateLimitPattern(
    args: any,
    context: ToolRoutingContext,
  ) {
    const userId = args.userId || args.user || "userId";
    const limit = args.limit || 100;
    const windowSeconds = args.windowSeconds || args.window || 3600;

    const code = this.templates.rateLimit({ userId, limit, windowSeconds });

    return {
      content: [
        {
          type: "text",
          text: `✅ Generated rate limit pattern for ${limit} requests per ${windowSeconds}s`,
        },
        { type: "text", text: code },
      ],
    };
  }

  private async generateSetsPattern(args: any, context: ToolRoutingContext) {
    return {
      content: [
        { type: "text", text: "✅ Generated Redis Sets Operations Example" },
        { type: "text", text: this.templates.sets() },
      ],
    };
  }

  private async generateZSetsPattern(args: any, context: ToolRoutingContext) {
    return {
      content: [
        {
          type: "text",
          text: "✅ Generated Redis Sorted Sets Operations Example",
        },
        { type: "text", text: this.templates.zsets() },
      ],
    };
  }

  private async generateGeoPattern(args: any, context: ToolRoutingContext) {
    return {
      content: [
        {
          type: "text",
          text: "✅ Generated Redis Geospatial Operations Example",
        },
        { type: "text", text: this.templates.geo() },
      ],
    };
  }

  private inferPattern(context: ToolRoutingContext): string {
    if (context.patterns.includes("cache")) return "cache";
    if (context.patterns.includes("lock")) return "lock";
    if (context.patterns.includes("ratelimit")) return "ratelimit";
    return "cache"; // Default
  }

  private inferAdvanced(context: ToolRoutingContext): string {
    if (context.patterns.includes("transaction")) return "transaction";
    if (context.patterns.includes("pipeline")) return "batch";
    if (context.patterns.includes("streams")) return "streams";
    return "transaction"; // Default
  }

  private async showGenerationOptions() {
    return {
      content: [
        { type: "text", text: "🔧 Code Generator - Available Options:" },
        { type: "text", text: "• Client: 'clientType' = 'basic' | 'cluster'" },
        {
          type: "text",
          text: "• Pattern: 'pattern' = 'cache' | 'lock' | 'ratelimit' | 'sets' | 'zsets' | 'geo'",
        },
        {
          type: "text",
          text: "• Application: 'app' = 'caching' | 'session' | 'queue'",
        },
        {
          type: "text",
          text: "• Advanced: 'advanced' = 'transaction' | 'batch' | 'streams'",
        },
      ],
    };
  }

  private async showPatternOptions() {
    return {
      content: [
        { type: "text", text: "🎯 Pattern Generator Options:" },
        {
          type: "text",
          text: "• cache: Cache with TTL (args: key, ttlSeconds)",
        },
        {
          type: "text",
          text: "• lock: Distributed lock (args: lockKey, ttlMs)",
        },
        {
          type: "text",
          text: "• ratelimit: Rate limiting (args: userId, limit, windowSeconds)",
        },
        { type: "text", text: "• sets: Set operations" },
        { type: "text", text: "• zsets: Sorted set operations" },
        { type: "text", text: "• geo: Geospatial operations" },
      ],
    };
  }

  private async showApplicationOptions() {
    return {
      content: [
        { type: "text", text: "🚀 Application Generator Options:" },
        { type: "text", text: "• caching: Complete caching service" },
        { type: "text", text: "• session: Session management" },
        { type: "text", text: "• queue: Queue system" },
      ],
    };
  }

  private async showAdvancedOptions() {
    return {
      content: [
        { type: "text", text: "⚡ Advanced Generator Options:" },
        { type: "text", text: "• transaction: Atomic transactions" },
        { type: "text", text: "• batch: Batch operations" },
        { type: "text", text: "• streams: Stream processing" },
      ],
    };
  }

  // Template collection - consolidated from all generator files
  private templates = {
    clientBasic: () => `import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Basic operations
await client.set('key', 'value');
const value = await client.get('key');
console.log('Retrieved:', value);

await client.close();`,

    clientCluster:
      () => `import { GlideClusterClient } from '@valkey/valkey-glide';

const client = await GlideClusterClient.createClient({
  addresses: [
    { host: 'node1.cluster.local', port: 6379 },
    { host: 'node2.cluster.local', port: 6379 },
    { host: 'node3.cluster.local', port: 6379 }
  ]
});

// Cluster operations
await client.set('key', 'value');
const value = await client.get('key');
console.log('Retrieved from cluster:', value);

await client.close();`,

    cache: ({
      key,
      ttlSeconds,
    }: {
      key: string;
      ttlSeconds: number;
    }) => `import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Cache pattern with TTL
const cached = await client.get('${key}');
if (cached !== null) {
  return JSON.parse(cached);
}

const fresh = await fetchData();
await client.set('${key}', JSON.stringify(fresh), {
  expiry: { type: 'EX', count: ${ttlSeconds} }
});

return fresh;`,

    lock: ({
      lockKey,
      ttlMs,
    }: {
      lockKey: string;
      ttlMs: number;
    }) => `import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Distributed lock pattern
const lockId = crypto.randomUUID();
const acquired = await client.set('${lockKey}', lockId, {
  expiry: { type: 'PX', count: ${ttlMs} },
  conditionalSet: 'OnlyIfDoesNotExist'
});

if (acquired === 'OK') {
  try {
    // Critical section
    console.log('Lock acquired, executing critical section...');
  } finally {
    // Release lock
    await client.eval(\`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    \`, ['${lockKey}'], [lockId]);
  }
}`,

    rateLimit: ({
      userId,
      limit,
      windowSeconds,
    }: {
      userId: string;
      limit: number;
      windowSeconds: number;
    }) => `import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Rate limiting pattern
const key = \`ratelimit:\${userId}\`;
const current = await client.incr(key);

if (current === 1) {
  await client.expire(key, ${windowSeconds});
}

if (current > ${limit}) {
  throw new Error('Rate limit exceeded');
}

console.log(\`Request \${current}/${limit} for user ${userId}\`);`,

    sets: () => `import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Set operations
await client.sadd('users:active', ['user1', 'user2', 'user3']);
await client.sadd('users:premium', ['user2', 'user4']);

const active = await client.smembers('users:active');
const premium = await client.smembers('users:premium');
const intersection = await client.sinter(['users:active', 'users:premium']);

console.log('Active users:', active);
console.log('Premium users:', premium);
console.log('Active premium users:', intersection);

await client.close();`,

    zsets: () => `import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Sorted set operations for leaderboard
await client.zadd('leaderboard', {'player1': 1000, 'player2': 1500, 'player3': 800});

const topPlayers = await client.zrevrange('leaderboard', 0, 2, { withScores: true });
const playerRank = await client.zrevrank('leaderboard', 'player2');
const playerScore = await client.zscore('leaderboard', 'player2');

console.log('Top 3 players:', topPlayers);
console.log('Player2 rank:', playerRank);
console.log('Player2 score:', playerScore);

await client.close();`,

    geo: () => `import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Geospatial operations
await client.geoadd('locations', {'Tokyo': {longitude: 139.6917, latitude: 35.6895}});
await client.geoadd('locations', {'London': {longitude: -0.1276, latitude: 51.5074}});
await client.geoadd('locations', {'NYC': {longitude: -74.0060, latitude: 40.7128}});

const distance = await client.geodist('locations', 'Tokyo', 'London', 'km');
const nearby = await client.georadius('locations', 139.6917, 35.6895, 10000, 'km');
const hash = await client.geohash('locations', ['Tokyo']);

console.log('Tokyo to London distance:', distance, 'km');
console.log('Nearby locations:', nearby);
console.log('Tokyo geohash:', hash);

await client.close();`,

    transaction:
      () => `import { GlideClient, Batch } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Atomic transaction
const batch = new Batch(true); // true = atomic
batch.set('account:1:balance', '1000');
batch.decrby('account:1:balance', 100);
batch.incrby('account:2:balance', 100);
batch.get('account:1:balance');
batch.get('account:2:balance');

const results = await client.exec(batch);
console.log('Transaction results:', results);

await client.close();`,

    batch: () => `import { GlideClient, Batch } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Non-atomic batch operations
const batch = new Batch(false); // false = non-atomic
batch.set('key1', 'value1');
batch.set('key2', 'value2');
batch.set('key3', 'value3');
batch.get('key1');
batch.get('key2');
batch.get('key3');

const results = await client.exec(batch);
console.log('Batch results:', results);

await client.close();`,

    streams: () => `import { GlideClient } from '@valkey/valkey-glide';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Stream operations
const streamKey = 'events';

// Add messages to stream
await client.xadd(streamKey, [['action', 'login'], ['user', 'alice']], '*');
await client.xadd(streamKey, [['action', 'purchase'], ['user', 'bob'], ['amount', '99.99']], '*');

// Read from stream
const messages = await client.xread({'streams': {[streamKey]: '0'}});
console.log('Stream messages:', messages);

// Stream length
const length = await client.xlen(streamKey);
console.log('Stream length:', length);

await client.close();`,

    app: {
      caching: () => `import { GlideClient } from '@valkey/valkey-glide';

class CacheService {
  private client: GlideClient;
  private defaultTTL = 3600;

  async connect() {
    this.client = await GlideClient.createClient({
      addresses: [{ host: 'localhost', port: 6379 }]
    });
  }

  async get(key: string): Promise<any> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(\`Cache get error for \${key}:\`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      await this.client.set(key, serialized, {
        expiry: { type: 'EX', count: ttl || this.defaultTTL }
      });
      return true;
    } catch (error) {
      console.error(\`Cache set error for \${key}:\`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.client.del([key]);
      return true;
    } catch (error) {
      console.error(\`Cache delete error for \${key}:\`, error);
      return false;
    }
  }

  async close() {
    await this.client.close();
  }
}

export default CacheService;`,

      session: () => `import { GlideClient } from '@valkey/valkey-glide';

class SessionManager {
  private client: GlideClient;
  private sessionTTL = 1800; // 30 minutes

  async connect() {
    this.client = await GlideClient.createClient({
      addresses: [{ host: 'localhost', port: 6379 }]
    });
  }

  async createSession(userId: string, sessionData: any): Promise<string> {
    const sessionId = crypto.randomUUID();
    const key = \`session:\${sessionId}\`;
    
    const data = {
      userId,
      ...sessionData,
      createdAt: new Date().toISOString()
    };

    await this.client.set(key, JSON.stringify(data), {
      expiry: { type: 'EX', count: this.sessionTTL }
    });

    return sessionId;
  }

  async getSession(sessionId: string): Promise<any> {
    const key = \`session:\${sessionId}\`;
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async updateSession(sessionId: string, updates: any): Promise<boolean> {
    const session = await this.getSession(sessionId);
    if (!session) return false;

    const updated = { ...session, ...updates };
    const key = \`session:\${sessionId}\`;
    
    await this.client.set(key, JSON.stringify(updated), {
      expiry: { type: 'EX', count: this.sessionTTL }
    });

    return true;
  }

  async destroySession(sessionId: string): Promise<boolean> {
    const key = \`session:\${sessionId}\`;
    const result = await this.client.del([key]);
    return result > 0;
  }

  async close() {
    await this.client.close();
  }
}

export default SessionManager;`,

      queue: () => `import { GlideClient } from '@valkey/valkey-glide';

class QueueManager {
  private client: GlideClient;

  async connect() {
    this.client = await GlideClient.createClient({
      addresses: [{ host: 'localhost', port: 6379 }]
    });
  }

  async enqueue(queueName: string, job: any): Promise<void> {
    const serialized = JSON.stringify({
      id: crypto.randomUUID(),
      data: job,
      enqueuedAt: new Date().toISOString()
    });
    
    await this.client.lpush(queueName, [serialized]);
  }

  async dequeue(queueName: string, timeout = 10): Promise<any> {
    const result = await this.client.brpop([queueName], timeout);
    if (!result) return null;

    return JSON.parse(result[1]);
  }

  async queueLength(queueName: string): Promise<number> {
    return await this.client.llen(queueName);
  }

  async clearQueue(queueName: string): Promise<void> {
    await this.client.del([queueName]);
  }

  async close() {
    await this.client.close();
  }
}

export default QueueManager;`,
    },
  };
}

/**
 * Register the unified code generator with the MCP server
 */
export function registerUnifiedCodeGenerator(mcp: McpServer) {
  const generator = new UnifiedCodeGenerator();

  (mcp as any).tool(
    "generate",
    "Intelligent code generation for GLIDE patterns and applications",
    async (args: any) => {
      const context = {
        userIntent: "generation" as const,
        complexity:
          args && Object.keys(args).length > 2
            ? ("advanced" as const)
            : ("simple" as const),
        clientCapabilities: "full" as const,
        taskType: "create" as const,
        hasParameters: args && Object.keys(args).length > 0,
        patterns: [],
      };

      return generator.execute(args, context);
    },
  );
}
