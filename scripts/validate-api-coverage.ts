#!/usr/bin/env tsx
import * as fs from "fs";
import * as path from "path";
import {
  GLIDE_SURFACE,
  IOREDIS_DATASET,
  NODE_REDIS_DATASET,
  getAllGlideMethods as getGlideMethods,
} from "../src/data/api/mappings.js";
import {
  COMPREHENSIVE_IOREDIS_MAPPINGS,
  COMPREHENSIVE_NODE_REDIS_MAPPINGS,
  COMPREHENSIVE_GLIDE_MAPPINGS,
} from "../src/data/api/comprehensive-mappings.js";

interface ApiMethod {
  name: string;
  file: string;
  category?: string;
  parameters?: string[];
  returnType?: string;
  isAsync?: boolean;
}

interface ApiInventory {
  baseClient: ApiMethod[];
  glideClient: ApiMethod[];
  glideClusterClient: ApiMethod[];
  commands: ApiMethod[];
  transaction: ApiMethod[];
  glideFt: ApiMethod[];
  glideJson: ApiMethod[];
  total: number;
}

interface ValidationResult {
  totalGlideApis: number;
  coveredApis: Set<string>;
  missingApis: Set<string>;
  coveragePercentage: number;
  missingByCategory: Record<string, string[]>;
  migrationGaps: {
    ioredis: string[];
    nodeRedis: string[];
  };
}

function loadGlideInventory(): ApiInventory {
  const inventoryPath =
    "/Users/avifen/valkey-glidejs-mcp/valkey-glidejs-mcp/glide-api-inventory.json";
  return JSON.parse(fs.readFileSync(inventoryPath, "utf-8"));
}

function getAllGlideMethods(inventory: ApiInventory): Set<string> {
  const allMethods = new Set<string>();

  Object.values(inventory).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((method) => {
        allMethods.add(method.name.toLowerCase());
      });
    }
  });

  return allMethods;
}

function getMappedGlideMethods(): Set<string> {
  // Use the comprehensive mappings that include ALL GLIDE methods
  const mapped = getGlideMethods ? getGlideMethods() : new Set<string>();

  // Ensure all methods are lowercase for comparison
  const lowerCaseMapped = new Set<string>();
  mapped.forEach((method) => lowerCaseMapped.add(method.toLowerCase()));

  return lowerCaseMapped;
}

function getIoredisMappings(): Set<string> {
  const mapped = new Set<string>();

  if (IOREDIS_DATASET && IOREDIS_DATASET.entries) {
    IOREDIS_DATASET.entries.forEach((entry) => {
      if (entry.equivalent && entry.equivalent.glide) {
        const methodMatch = entry.equivalent.glide.match(/\.(\w+)\(/);
        if (methodMatch) {
          mapped.add(methodMatch[1].toLowerCase());
        }
      }
    });
  }

  return mapped;
}

function getNodeRedisMappings(): Set<string> {
  const mapped = new Set<string>();

  if (NODE_REDIS_DATASET && NODE_REDIS_DATASET.entries) {
    NODE_REDIS_DATASET.entries.forEach((entry) => {
      if (entry.equivalent && entry.equivalent.glide) {
        const methodMatch = entry.equivalent.glide.match(/\.(\w+)\(/);
        if (methodMatch) {
          mapped.add(methodMatch[1].toLowerCase());
        }
      }
    });
  }

  return mapped;
}

function categorizeMethod(methodName: string): string {
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
    ],
    sortedsets: [
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
    connection: [
      "ping",
      "echo",
      "select",
      "auth",
      "quit",
      "hello",
      "client",
      "config",
    ],
    server: [
      "info",
      "config",
      "flushdb",
      "flushall",
      "dbsize",
      "time",
      "lastsave",
      "save",
      "bgsave",
      "shutdown",
      "slaveof",
      "replicaof",
      "role",
      "command",
    ],
    bitmap: ["setbit", "getbit", "bitcount", "bitpos", "bitop", "bitfield"],
    hyperloglog: ["pfadd", "pfcount", "pfmerge"],
    json: ["json"],
    cluster: ["cluster", "readonly", "readwrite", "asking"],
    acl: ["acl"],
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
      "touch",
      "scan",
      "randomkey",
      "copy",
      "migrate",
      "wait",
      "object",
    ],
  };

  const lowerName = methodName.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((kw) => lowerName === kw || lowerName.startsWith(kw))) {
      return category;
    }
  }
  return "uncategorized";
}

async function validateCoverage(): Promise<ValidationResult> {
  console.log("🔍 Validating API Coverage...\n");

  // Load GLIDE API inventory
  const inventory = loadGlideInventory();
  const allGlideMethods = getAllGlideMethods(inventory);
  const mappedMethods = getMappedGlideMethods();
  const ioredisMapped = getIoredisMappings();
  const nodeRedisMapped = getNodeRedisMappings();

  // Find missing APIs
  const missingApis = new Set<string>();
  const missingByCategory: Record<string, string[]> = {};

  allGlideMethods.forEach((method) => {
    if (!mappedMethods.has(method)) {
      missingApis.add(method);
      const category = categorizeMethod(method);
      if (!missingByCategory[category]) {
        missingByCategory[category] = [];
      }
      missingByCategory[category].push(method);
    }
  });

  // Find migration gaps
  const migrationGaps = {
    ioredis: Array.from(missingApis).filter((api) => !ioredisMapped.has(api)),
    nodeRedis: Array.from(missingApis).filter(
      (api) => !nodeRedisMapped.has(api),
    ),
  };

  const result: ValidationResult = {
    totalGlideApis: allGlideMethods.size,
    coveredApis: mappedMethods,
    missingApis,
    coveragePercentage: (mappedMethods.size / allGlideMethods.size) * 100,
    missingByCategory,
    migrationGaps,
  };

  // Print report
  console.log("📊 API COVERAGE REPORT");
  console.log("═".repeat(60));
  console.log(`Total GLIDE APIs:        ${result.totalGlideApis}`);
  console.log(`Covered in MCP:          ${result.coveredApis.size}`);
  console.log(`Missing APIs:            ${result.missingApis.size}`);
  console.log(
    `Coverage Percentage:     ${result.coveragePercentage.toFixed(1)}%`,
  );
  console.log("═".repeat(60));

  if (result.missingApis.size > 0) {
    console.log("\n❌ MISSING APIS BY CATEGORY:");
    console.log("─".repeat(60));
    Object.entries(missingByCategory)
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([category, apis]) => {
        console.log(`\n${category.toUpperCase()} (${apis.length} missing):`);
        apis.slice(0, 10).forEach((api) => console.log(`  • ${api}`));
        if (apis.length > 10) {
          console.log(`  ... and ${apis.length - 10} more`);
        }
      });
  }

  console.log("\n📊 MIGRATION COVERAGE:");
  console.log("─".repeat(60));
  console.log(
    `ioredis gaps:     ${migrationGaps.ioredis.length} APIs without migration path`,
  );
  console.log(
    `node-redis gaps:  ${migrationGaps.nodeRedis.length} APIs without migration path`,
  );

  // Save detailed report
  const reportPath =
    "/Users/avifen/valkey-glidejs-mcp/valkey-glidejs-mcp/api-coverage-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);

  return result;
}

// Validate behavior differences
async function validateBehaviorDifferences() {
  console.log("\n🔍 Analyzing Behavior Differences...\n");

  const differences: Record<string, any> = {
    parameterOrder: [],
    returnTypes: [],
    asyncBehavior: [],
    errorHandling: [],
  };

  // Analyze GLIDE_SURFACE for behavior differences
  if (GLIDE_SURFACE && GLIDE_SURFACE.entries) {
    GLIDE_SURFACE.entries.forEach((entry) => {
      if (entry.paramsDiff) {
        differences.parameterOrder.push({
          method: entry.equivalent?.glide || entry.symbol,
          difference: entry.paramsDiff,
          ioredis: entry.symbol,
          nodeRedis: null,
        });
      }
    });
  }

  // Common behavior differences
  const behaviorNotes = {
    connection: {
      glide: "Connections are automatic, no connect() method needed",
      ioredis: "Requires new Redis() constructor",
      nodeRedis: "Requires createClient().connect()",
    },
    callbacks: {
      glide: "All methods return Promises, no callback support",
      ioredis: "Supports both callbacks and promises",
      nodeRedis: "Promise-based in v4+",
    },
    pipelining: {
      glide: "Uses Transaction class for pipelining",
      ioredis: "Uses pipeline() method",
      nodeRedis: "Uses multi() for transactions",
    },
    cluster: {
      glide: "GlideClusterClient with automatic sharding",
      ioredis: "Redis.Cluster with manual configuration",
      nodeRedis: "createCluster() with manual setup",
    },
    pubsub: {
      glide: "Async iterator pattern for subscriptions",
      ioredis: "Event emitter pattern",
      nodeRedis: "Event emitter or async iterator",
    },
  };

  console.log("📊 KEY BEHAVIOR DIFFERENCES:");
  console.log("═".repeat(60));
  Object.entries(behaviorNotes).forEach(([feature, diff]) => {
    console.log(`\n${feature.toUpperCase()}:`);
    console.log(`  GLIDE:      ${diff.glide}`);
    console.log(`  ioredis:    ${diff.ioredis}`);
    console.log(`  node-redis: ${diff.nodeRedis}`);
  });

  if (differences.parameterOrder.length > 0) {
    console.log("\n⚠️  PARAMETER ORDER DIFFERENCES:");
    console.log("─".repeat(60));
    differences.parameterOrder.slice(0, 5).forEach((diff: any) => {
      console.log(`\n${diff.method}:`);
      console.log(`  Issue: ${diff.difference}`);
    });

    if (differences.parameterOrder.length > 5) {
      console.log(
        `\n  ... and ${differences.parameterOrder.length - 5} more parameter differences`,
      );
    }
  }

  // Save behavior report
  const behaviorPath =
    "/Users/avifen/valkey-glidejs-mcp/valkey-glidejs-mcp/behavior-differences.json";
  fs.writeFileSync(
    behaviorPath,
    JSON.stringify(
      {
        behaviorNotes,
        differences,
      },
      null,
      2,
    ),
  );
  console.log(`\n💾 Behavior differences saved to: ${behaviorPath}`);
}

async function main() {
  const result = await validateCoverage();
  await validateBehaviorDifferences();

  // Generate final validation summary
  console.log("\n" + "═".repeat(60));
  console.log("📋 VALIDATION SUMMARY");
  console.log("═".repeat(60));

  if (result.coveragePercentage < 50) {
    console.log("❌ CRITICAL: Less than 50% API coverage!");
    console.log("   Action Required: Add missing API mappings");
  } else if (result.coveragePercentage < 80) {
    console.log("⚠️  WARNING: API coverage below 80%");
    console.log("   Recommendation: Improve coverage for production readiness");
  } else {
    console.log("✅ Good API coverage (>80%)");
  }

  console.log(
    `\n📊 Coverage: ${result.coveragePercentage.toFixed(1)}% (${result.coveredApis.size}/${result.totalGlideApis})`,
  );
  console.log(`❌ Missing:  ${result.missingApis.size} APIs need mapping`);

  return result;
}

if (import.meta.url.startsWith("file:")) {
  main().catch(console.error);
}

export { validateCoverage, validateBehaviorDifferences };
