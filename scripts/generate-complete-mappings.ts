#!/usr/bin/env tsx
import * as fs from "fs";
import * as path from "path";

interface GlideApi {
  name: string;
  file: string;
  category?: string;
}

// Load the GLIDE inventory we created
const inventoryPath =
  "/Users/avifen/valkey-glidejs-mcp/valkey-glidejs-mcp/glide-api-inventory.json";
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf-8"));

// Categorize methods properly
function getCategory(methodName: string): string {
  const categories: Record<string, string[]> = {
    strings: [
      "get",
      "set",
      "mget",
      "mset",
      "del",
      "exists",
      "incr",
      "decr",
      "append",
      "strlen",
      "setex",
      "psetex",
      "setnx",
      "getset",
      "getrange",
      "setrange",
      "getdel",
      "getex",
    ],
    hashes: [
      "hget",
      "hset",
      "hmget",
      "hmset",
      "hdel",
      "hexists",
      "hkeys",
      "hvals",
      "hlen",
      "hincrby",
      "hgetall",
      "hsetnx",
      "hincrbyfloat",
      "hscan",
      "hstrlen",
      "hrandfield",
    ],
    lists: [
      "lpush",
      "rpush",
      "lpop",
      "rpop",
      "llen",
      "lrange",
      "lindex",
      "lset",
      "ltrim",
      "lrem",
      "linsert",
      "rpoplpush",
      "brpoplpush",
      "blpop",
      "brpop",
      "lmove",
      "blmove",
      "lpushx",
      "rpushx",
    ],
    sets: [
      "sadd",
      "srem",
      "smembers",
      "sismember",
      "scard",
      "sinter",
      "sunion",
      "sdiff",
      "sinterstore",
      "sunionstore",
      "sdiffstore",
      "spop",
      "srandmember",
      "smove",
      "sscan",
      "smismember",
      "sintercard",
    ],
    "sorted-sets": [
      "zadd",
      "zrem",
      "zrange",
      "zrank",
      "zscore",
      "zcount",
      "zincrby",
      "zcard",
      "zrevrange",
      "zrevrank",
      "zunion",
      "zinter",
      "zdiff",
      "zrangebyscore",
      "zremrangebyscore",
      "zremrangebyrank",
      "zscan",
      "zpopmin",
      "zpopmax",
      "bzpopmin",
      "bzpopmax",
      "zrandmember",
      "zunionstore",
      "zinterstore",
      "zintercard",
      "zdiffstore",
    ],
    geo: [
      "geoadd",
      "geodist",
      "geohash",
      "geopos",
      "georadius",
      "geosearch",
      "geosearchstore",
    ],
    streams: [
      "xadd",
      "xread",
      "xlen",
      "xrange",
      "xdel",
      "xgroup",
      "xreadgroup",
      "xack",
      "xpending",
      "xclaim",
      "xinfo",
      "xtrim",
      "xrevrange",
    ],
    pubsub: [
      "publish",
      "subscribe",
      "psubscribe",
      "unsubscribe",
      "punsubscribe",
      "pubsub",
    ],
    transactions: ["multi", "exec", "discard", "watch", "unwatch"],
    scripting: ["eval", "evalsha", "script", "fcall", "fcall_ro", "function"],
    connection: ["ping", "echo", "select", "auth", "quit", "hello", "client"],
    server: [
      "info",
      "config",
      "flushdb",
      "flushall",
      "dbsize",
      "time",
      "lastsave",
    ],
    bitmap: ["setbit", "getbit", "bitcount", "bitpos", "bitop", "bitfield"],
    hyperloglog: ["pfadd", "pfcount", "pfmerge"],
    json: ["json"],
    cluster: ["cluster", "readonly", "readwrite"],
    generic: [
      "expire",
      "expireat",
      "ttl",
      "pttl",
      "persist",
      "rename",
      "renamenx",
      "type",
      "dump",
      "restore",
      "scan",
      "keys",
      "randomkey",
      "touch",
      "unlink",
      "copy",
      "object",
    ],
  };

  const lowerName = methodName.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((kw) => lowerName === kw || lowerName.startsWith(kw))) {
      return category;
    }
  }
  return "general";
}

// Generate parameter string based on common patterns
function generateParams(methodName: string): string {
  const name = methodName.toLowerCase();

  // Key-value operations
  if (["get", "del", "exists", "ttl", "type", "dump"].includes(name)) {
    return "(key)";
  }
  if (["set", "setex", "setnx"].includes(name)) {
    return "(key, value, options?)";
  }

  // Hash operations
  if (name.startsWith("h")) {
    if (name === "hset") return "(key, field, value)";
    if (name === "hget") return "(key, field)";
    if (name === "hgetall" || name === "hkeys" || name === "hvals")
      return "(key)";
    if (name === "hdel") return "(key, ...fields)";
    if (name === "hmget") return "(key, fields)";
    if (name === "hmset") return "(key, fieldValueMap)";
  }

  // List operations
  if (name.startsWith("l") || name.startsWith("r")) {
    if (["lpush", "rpush"].includes(name)) return "(key, ...elements)";
    if (["lpop", "rpop"].includes(name)) return "(key, count?)";
    if (name === "lrange") return "(key, start, stop)";
    if (name === "lindex") return "(key, index)";
    if (name === "lset") return "(key, index, element)";
  }

  // Set operations
  if (name.startsWith("s") && !name.startsWith("set")) {
    if (name === "sadd") return "(key, ...members)";
    if (name === "srem") return "(key, ...members)";
    if (name === "sismember") return "(key, member)";
    if (["smembers", "scard"].includes(name)) return "(key)";
    if (["sinter", "sunion", "sdiff"].includes(name)) return "(...keys)";
  }

  // Sorted set operations
  if (name.startsWith("z")) {
    if (name === "zadd") return "(key, membersScores)";
    if (name === "zrem") return "(key, ...members)";
    if (name === "zrange") return "(key, start, stop, options?)";
    if (name === "zscore") return "(key, member)";
    if (name === "zrank") return "(key, member)";
  }

  // Stream operations
  if (name.startsWith("x")) {
    if (name === "xadd") return "(key, entries, options?)";
    if (name === "xread") return "(keys, options?)";
    if (name === "xreadgroup") return "(group, consumer, keys, options?)";
  }

  // Default
  return "(...)";
}

// Generate mappings for all GLIDE APIs
function generateCompleteMappings() {
  const allMethods = new Set<string>();
  const mappingEntries: any[] = [];

  // Collect all unique method names
  Object.values(inventory).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((method: GlideApi) => {
        allMethods.add(method.name);
      });
    }
  });

  // Generate mapping entries for each method
  allMethods.forEach((methodName) => {
    const category = getCategory(methodName);
    const params = generateParams(methodName);

    // Generate ioredis equivalent
    const ioredisEntry = {
      category,
      symbol: `redis.${methodName}${params}`,
      equivalent: {
        glide: `client.${methodName}${params}`,
      },
      description: `Execute ${methodName} command`,
      examples: {
        source: `await redis.${methodName}${params}`,
        glide: `await client.${methodName}${params}`,
      },
    };

    // Generate node-redis equivalent
    const nodeRedisEntry = {
      category,
      symbol: `client.${methodName}${params}`,
      equivalent: {
        glide: `client.${methodName}${params}`,
      },
      description: `Execute ${methodName} command`,
      examples: {
        source: `await client.${methodName}${params}`,
        glide: `await client.${methodName}${params}`,
      },
    };

    mappingEntries.push({
      ioredis: ioredisEntry,
      nodeRedis: nodeRedisEntry,
      methodName,
    });
  });

  // Create comprehensive dataset files
  const comprehensiveDataset = {
    ioredis: {
      client: "ioredis",
      version: "5.x",
      entries: mappingEntries.map((e) => e.ioredis),
    },
    nodeRedis: {
      client: "node-redis",
      version: "4.x",
      entries: mappingEntries.map((e) => e.nodeRedis),
    },
    glide: {
      client: "glide",
      version: "2.0.x",
      entries: mappingEntries.map((e) => ({
        category: getCategory(e.methodName),
        symbol: e.methodName,
        equivalent: {
          glide: `client.${e.methodName}${generateParams(e.methodName)}`,
        },
        description: `GLIDE method: ${e.methodName}`,
      })),
    },
  };

  // Save the comprehensive mappings
  const outputPath =
    "/Users/avifen/valkey-glidejs-mcp/valkey-glidejs-mcp/src/data/api/comprehensive-mappings.ts";
  const fileContent = `// Auto-generated comprehensive GLIDE API mappings
// Generated from GLIDE TypeScript definitions
// Total methods covered: ${allMethods.size}

import { ApiDataset } from './mappings.js';

export const COMPREHENSIVE_IOREDIS_MAPPINGS: ApiDataset = ${JSON.stringify(comprehensiveDataset.ioredis, null, 2)};

export const COMPREHENSIVE_NODE_REDIS_MAPPINGS: ApiDataset = ${JSON.stringify(comprehensiveDataset.nodeRedis, null, 2)};

export const COMPREHENSIVE_GLIDE_MAPPINGS: ApiDataset = ${JSON.stringify(comprehensiveDataset.glide, null, 2)};

// Export helper to get all GLIDE methods
export function getAllGlideMethods(): Set<string> {
  return new Set(${JSON.stringify(Array.from(allMethods))});
}
`;

  fs.writeFileSync(outputPath, fileContent);

  console.log(
    `✅ Generated comprehensive mappings for ${allMethods.size} GLIDE APIs`,
  );
  console.log(`📄 Saved to: ${outputPath}`);

  // Summary by category
  const categorySummary: Record<string, number> = {};
  mappingEntries.forEach((e) => {
    const cat = getCategory(e.methodName);
    categorySummary[cat] = (categorySummary[cat] || 0) + 1;
  });

  console.log("\n📊 Methods by Category:");
  Object.entries(categorySummary)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} methods`);
    });

  return allMethods.size;
}

// Run the generation
if (import.meta.url.startsWith("file:")) {
  console.log("🔨 Generating comprehensive GLIDE API mappings...\n");
  const count = generateCompleteMappings();
  console.log(
    `\n✅ Successfully generated mappings for ${count} GLIDE API methods`,
  );
}

export { generateCompleteMappings };
