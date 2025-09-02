/**
 * Cross-Reference Mapping System
 * Provides comprehensive mapping between ioredis, node-redis, and GLIDE APIs
 */

import { CommandRegistry } from "../../core/database/command-registry.js";
import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";

export interface CrossReferenceMapping {
  glideMethod: string;
  ioredisEquivalent?: IORedisMapping;
  nodeRedisEquivalent?: NodeRedisMapping;
  differences: MappingDifference[];
  migrationComplexity: "simple" | "moderate" | "complex";
  examples: CrossReferenceExample[];
}

export interface IORedisMapping {
  method: string;
  syntax: string;
  parameterDifferences: string[];
  behaviorDifferences: string[];
  notes: string[];
}

export interface NodeRedisMapping {
  method: string;
  syntax: string;
  parameterDifferences: string[];
  behaviorDifferences: string[];
  notes: string[];
}

export interface MappingDifference {
  type: "parameter" | "behavior" | "return-value" | "error-handling";
  description: string;
  impact: "low" | "medium" | "high";
  migrationNote: string;
}

export interface CrossReferenceExample {
  title: string;
  ioredisCode?: string;
  nodeRedisCode?: string;
  glideCode: string;
  migrationNotes: string[];
}

export interface MigrationGuide {
  fromLibrary: "ioredis" | "node-redis";
  toGlide: boolean;
  mappings: CrossReferenceMapping[];
  globalDifferences: GlobalDifference[];
  migrationSteps: MigrationStep[];
  bestPractices: string[];
  commonPitfalls: string[];
}

export interface GlobalDifference {
  category: string;
  description: string;
  impact: string;
  solution: string;
}

export interface MigrationStep {
  step: number;
  title: string;
  description: string;
  codeChanges: string[];
  validation: string[];
}

export class CrossReferenceMapper {
  private static mappings: Map<string, CrossReferenceMapping> = new Map();
  private static methodAliases: Map<string, string> = new Map();

  static {
    this.initializeMappings();
  }

  /**
   * Initialize comprehensive cross-reference mappings
   */
  private static initializeMappings(): void {
    // String Operations Mappings
    this.addMapping("GET", {
      glideMethod: "client.get(key)",
      ioredisEquivalent: {
        method: "get",
        syntax: "redis.get(key)",
        parameterDifferences: [],
        behaviorDifferences: [],
        notes: ["Identical behavior and return value"],
      },
      nodeRedisEquivalent: {
        method: "get",
        syntax: "client.get(key)",
        parameterDifferences: [],
        behaviorDifferences: [],
        notes: ["Identical behavior and return value"],
      },
      differences: [],
      migrationComplexity: "simple",
      examples: [
        {
          title: "Basic GET operation",
          ioredisCode: 'const value = await redis.get("user:123");',
          nodeRedisCode: 'const value = await client.get("user:123");',
          glideCode: 'const value = await client.get("user:123");',
          migrationNotes: ["Direct replacement with identical syntax"],
        },
      ],
    });

    this.addMapping("SET", {
      glideMethod: "client.set(key, value, options?)",
      ioredisEquivalent: {
        method: "set",
        syntax: 'redis.set(key, value, "EX", seconds)',
        parameterDifferences: [
          "ioredis uses separate arguments for options",
          "GLIDE uses options object",
        ],
        behaviorDifferences: [],
        notes: ["Options format differs significantly"],
      },
      nodeRedisEquivalent: {
        method: "set",
        syntax: "client.set(key, value, options)",
        parameterDifferences: [],
        behaviorDifferences: [],
        notes: ["Identical options object format"],
      },
      differences: [
        {
          type: "parameter",
          description:
            "ioredis uses separate arguments for SET options, GLIDE/node-redis use options object",
          impact: "medium",
          migrationNote:
            "Convert ioredis SET calls from separate arguments to options object",
        },
      ],
      migrationComplexity: "moderate",
      examples: [
        {
          title: "SET with expiration",
          ioredisCode: 'await redis.set("key", "value", "EX", 3600);',
          nodeRedisCode: 'await client.set("key", "value", { EX: 3600 });',
          glideCode: 'await client.set("key", "value", { EX: 3600 });',
          migrationNotes: [
            "ioredis: Convert separate EX argument to options object",
            "node-redis: Direct replacement",
          ],
        },
        {
          title: "Conditional SET",
          ioredisCode: 'await redis.set("key", "value", "NX", "EX", 30);',
          nodeRedisCode:
            'await client.set("key", "value", { NX: true, EX: 30 });',
          glideCode: 'await client.set("key", "value", { NX: true, EX: 30 });',
          migrationNotes: [
            "ioredis: Convert NX from string argument to boolean option",
            "node-redis: Direct replacement",
          ],
        },
      ],
    });

    // Hash Operations
    this.addMapping("HSET", {
      glideMethod:
        "client.hset(key, field, value) or client.hset(key, fieldValueMap)",
      ioredisEquivalent: {
        method: "hset",
        syntax: "redis.hset(key, field, value) or redis.hset(key, map)",
        parameterDifferences: [],
        behaviorDifferences: [],
        notes: ["Supports both single field and object formats"],
      },
      nodeRedisEquivalent: {
        method: "hSet",
        syntax: "client.hSet(key, field, value) or client.hSet(key, map)",
        parameterDifferences: [],
        behaviorDifferences: [],
        notes: ["Note the camelCase method name"],
      },
      differences: [
        {
          type: "parameter",
          description: "node-redis uses camelCase method names",
          impact: "low",
          migrationNote: "Update method name from hset to hSet",
        },
      ],
      migrationComplexity: "simple",
      examples: [
        {
          title: "Set hash field",
          ioredisCode: 'await redis.hset("user:123", "name", "Alice");',
          nodeRedisCode: 'await client.hSet("user:123", "name", "Alice");',
          glideCode: 'await client.hset("user:123", "name", "Alice");',
          migrationNotes: [
            "ioredis: Direct replacement",
            "node-redis: Change method name to lowercase",
          ],
        },
        {
          title: "Set multiple hash fields",
          ioredisCode:
            'await redis.hset("user:123", { name: "Alice", age: "30" });',
          nodeRedisCode:
            'await client.hSet("user:123", { name: "Alice", age: "30" });',
          glideCode:
            'await client.hset("user:123", { name: "Alice", age: "30" });',
          migrationNotes: [
            "ioredis: Direct replacement",
            "node-redis: Change method name to lowercase",
          ],
        },
      ],
    });

    // List Operations
    this.addMapping("LPUSH", {
      glideMethod: "client.lpush(key, elements)",
      ioredisEquivalent: {
        method: "lpush",
        syntax: "redis.lpush(key, ...elements)",
        parameterDifferences: [
          "ioredis accepts variadic arguments",
          "GLIDE accepts array or single element",
        ],
        behaviorDifferences: [],
        notes: ["Parameter format differs for multiple elements"],
      },
      nodeRedisEquivalent: {
        method: "lPush",
        syntax: "client.lPush(key, elements)",
        parameterDifferences: [],
        behaviorDifferences: [],
        notes: ["Identical parameter format"],
      },
      differences: [
        {
          type: "parameter",
          description:
            "ioredis uses variadic parameters, GLIDE/node-redis use array",
          impact: "medium",
          migrationNote: "Convert spread parameters to array format",
        },
      ],
      migrationComplexity: "moderate",
      examples: [
        {
          title: "Push single element",
          ioredisCode: 'await redis.lpush("list", "item1");',
          nodeRedisCode: 'await client.lPush("list", "item1");',
          glideCode: 'await client.lpush("list", "item1");',
          migrationNotes: [
            "ioredis: Direct replacement",
            "node-redis: Change method name to lowercase",
          ],
        },
        {
          title: "Push multiple elements",
          ioredisCode: 'await redis.lpush("list", "item1", "item2", "item3");',
          nodeRedisCode:
            'await client.lPush("list", ["item1", "item2", "item3"]);',
          glideCode: 'await client.lpush("list", ["item1", "item2", "item3"]);',
          migrationNotes: [
            "ioredis: Convert variadic arguments to array",
            "node-redis: Change method name to lowercase",
          ],
        },
      ],
    });

    // Stream Operations
    this.addMapping("XADD", {
      glideMethod: "client.xadd(key, entries)",
      ioredisEquivalent: {
        method: "xadd",
        syntax: "redis.xadd(key, id, ...fieldValues)",
        parameterDifferences: [
          "ioredis requires explicit ID parameter",
          "GLIDE auto-generates ID if not specified",
        ],
        behaviorDifferences: [
          "Parameter order and format differs significantly",
        ],
        notes: ["Significant API differences require careful migration"],
      },
      nodeRedisEquivalent: {
        method: "xAdd",
        syntax: "client.xAdd(key, id, fields)",
        parameterDifferences: [
          "Similar to ioredis with explicit ID",
          "Field format may differ",
        ],
        behaviorDifferences: [],
        notes: ["Requires careful parameter mapping"],
      },
      differences: [
        {
          type: "parameter",
          description: "Stream entry format differs between libraries",
          impact: "high",
          migrationNote: "Convert parameter format and ID handling",
        },
        {
          type: "behavior",
          description: "ID generation and parameter ordering differs",
          impact: "high",
          migrationNote: "Review ID generation strategy and parameter order",
        },
      ],
      migrationComplexity: "complex",
      examples: [
        {
          title: "Add stream entry",
          ioredisCode:
            'await redis.xadd("events", "*", "type", "login", "user", "123");',
          nodeRedisCode:
            'await client.xAdd("events", "*", { type: "login", user: "123" });',
          glideCode:
            'await client.xadd("events", [["type", "login"], ["user", "123"]]);',
          migrationNotes: [
            "ioredis: Convert flat field-value pairs to nested array format",
            "node-redis: Convert object format to nested array, remove explicit ID",
          ],
        },
      ],
    });

    // Sorted Set Operations
    this.addMapping("ZADD", {
      glideMethod: "client.zadd(key, scoreMembers, options?)",
      ioredisEquivalent: {
        method: "zadd",
        syntax:
          "redis.zadd(key, score, member) or redis.zadd(key, ...scoreMembers)",
        parameterDifferences: [
          "ioredis accepts variadic score-member pairs",
          "GLIDE uses object mapping",
        ],
        behaviorDifferences: [],
        notes: ["Object format vs variadic parameters"],
      },
      nodeRedisEquivalent: {
        method: "zAdd",
        syntax: "client.zAdd(key, scoreMembers)",
        parameterDifferences: [],
        behaviorDifferences: [],
        notes: ["Similar object-based format"],
      },
      differences: [
        {
          type: "parameter",
          description:
            "ioredis uses variadic score-member pairs, GLIDE uses object",
          impact: "medium",
          migrationNote: "Convert score-member pairs to object format",
        },
      ],
      migrationComplexity: "moderate",
      examples: [
        {
          title: "Add single member",
          ioredisCode: 'await redis.zadd("leaderboard", 100, "player1");',
          nodeRedisCode:
            'await client.zAdd("leaderboard", { score: 100, value: "player1" });',
          glideCode: 'await client.zadd("leaderboard", { "player1": 100 });',
          migrationNotes: [
            "ioredis: Convert score-member pairs to object format",
            "node-redis: Adapt object structure to GLIDE format",
          ],
        },
      ],
    });

    // Initialize method aliases for easier lookup
    this.initializeAliases();
  }

  /**
   * Add a cross-reference mapping
   */
  private static addMapping(
    command: string,
    mapping: CrossReferenceMapping,
  ): void {
    this.mappings.set(command.toUpperCase(), mapping);
  }

  /**
   * Initialize method aliases for different libraries
   */
  private static initializeAliases(): void {
    // node-redis camelCase aliases
    this.methodAliases.set("hget", "hGet");
    this.methodAliases.set("hset", "hSet");
    this.methodAliases.set("hdel", "hDel");
    this.methodAliases.set("hgetall", "hGetAll");
    this.methodAliases.set("lpush", "lPush");
    this.methodAliases.set("rpush", "rPush");
    this.methodAliases.set("lpop", "lPop");
    this.methodAliases.set("rpop", "rPop");
    this.methodAliases.set("lrange", "lRange");
    this.methodAliases.set("sadd", "sAdd");
    this.methodAliases.set("srem", "sRem");
    this.methodAliases.set("smembers", "sMembers");
    this.methodAliases.set("zadd", "zAdd");
    this.methodAliases.set("zrange", "zRange");
    this.methodAliases.set("zrank", "zRank");
  }

  /**
   * Get cross-reference mapping for a command
   */
  static getMapping(command: string): CrossReferenceMapping | undefined {
    return this.mappings.get(command.toUpperCase());
  }

  /**
   * Get all available mappings
   */
  static getAllMappings(): Map<string, CrossReferenceMapping> {
    return new Map(this.mappings);
  }

  /**
   * Find equivalent command in target library
   */
  static findEquivalent(
    command: string,
    targetLibrary: "ioredis" | "node-redis" | "glide",
  ): string | undefined {
    const mapping = this.getMapping(command);
    if (!mapping) return undefined;

    switch (targetLibrary) {
      case "ioredis":
        return mapping.ioredisEquivalent?.method;
      case "node-redis":
        return mapping.nodeRedisEquivalent?.method;
      case "glide":
        return command.toLowerCase(); // GLIDE uses lowercase
      default:
        return undefined;
    }
  }

  /**
   * Generate migration guide from source library to GLIDE
   */
  static generateMigrationGuide(
    fromLibrary: "ioredis" | "node-redis",
    commands?: string[],
  ): MigrationGuide {
    const relevantMappings = commands
      ? (commands
          .map((cmd) => this.getMapping(cmd))
          .filter(Boolean) as CrossReferenceMapping[])
      : Array.from(this.mappings.values());

    const globalDifferences = this.getGlobalDifferences(fromLibrary);
    const migrationSteps = this.generateMigrationSteps(fromLibrary);
    const bestPractices = this.getMigrationBestPractices(fromLibrary);
    const commonPitfalls = this.getCommonPitfalls(fromLibrary);

    return {
      fromLibrary,
      toGlide: true,
      mappings: relevantMappings,
      globalDifferences,
      migrationSteps,
      bestPractices,
      commonPitfalls,
    };
  }

  /**
   * Get global differences between libraries
   */
  private static getGlobalDifferences(
    fromLibrary: "ioredis" | "node-redis",
  ): GlobalDifference[] {
    if (fromLibrary === "ioredis") {
      return [
        {
          category: "Method Naming",
          description: "ioredis and GLIDE both use lowercase method names",
          impact: "Low - minimal changes needed",
          solution: "Direct replacement in most cases",
        },
        {
          category: "Option Parameters",
          description:
            "ioredis uses separate arguments for SET options, GLIDE uses options object",
          impact: "Medium - requires parameter restructuring",
          solution: "Convert string arguments to options object format",
        },
        {
          category: "Pipeline API",
          description: "Pipeline creation and execution syntax differs",
          impact: "High - significant API changes",
          solution: "Rewrite pipeline code using GLIDE pipeline API",
        },
        {
          category: "Event Handling",
          description: "Connection and error event handling differs",
          impact: "Medium - event listener updates needed",
          solution: "Update event listener syntax and event names",
        },
      ];
    } else {
      return [
        {
          category: "Method Naming",
          description: "node-redis uses camelCase, GLIDE uses lowercase",
          impact: "Low - consistent method name changes",
          solution: "Convert all method names to lowercase",
        },
        {
          category: "Connection Handling",
          description: "Connection creation and management syntax is similar",
          impact: "Low - minimal changes needed",
          solution: "Update import statements and connection options",
        },
        {
          category: "Type Definitions",
          description: "TypeScript type definitions may differ",
          impact: "Medium - type compatibility checks needed",
          solution: "Update type imports and validate type compatibility",
        },
      ];
    }
  }

  /**
   * Generate step-by-step migration steps
   */
  private static generateMigrationSteps(
    fromLibrary: "ioredis" | "node-redis",
  ): MigrationStep[] {
    if (fromLibrary === "ioredis") {
      return [
        {
          step: 1,
          title: "Update Dependencies",
          description: "Replace ioredis with GLIDE in package.json",
          codeChanges: [
            "npm uninstall ioredis",
            "npm install @valkey/valkey-glide",
          ],
          validation: [
            "Verify GLIDE installation",
            "Check for dependency conflicts",
          ],
        },
        {
          step: 2,
          title: "Update Imports",
          description: "Replace ioredis imports with GLIDE imports",
          codeChanges: [
            'Replace: import Redis from "ioredis"',
            'With: import { GlideClient } from "@valkey/valkey-glide"',
          ],
          validation: ["Compile check", "Import resolution verification"],
        },
        {
          step: 3,
          title: "Update Client Creation",
          description: "Convert Redis client initialization",
          codeChanges: [
            "Replace: new Redis(options)",
            "With: await GlideClient.createClient(options)",
          ],
          validation: [
            "Connection establishment",
            "Options compatibility check",
          ],
        },
        {
          step: 4,
          title: "Convert SET Operations",
          description: "Update SET command parameter format",
          codeChanges: [
            'Replace: redis.set(key, value, "EX", 60)',
            "With: client.set(key, value, { EX: 60 })",
          ],
          validation: ["SET operation testing", "Expiration validation"],
        },
        {
          step: 5,
          title: "Update Pipeline Code",
          description: "Rewrite pipeline operations",
          codeChanges: [
            "Replace ioredis pipeline syntax",
            "Use GLIDE pipeline API",
          ],
          validation: [
            "Pipeline execution testing",
            "Transaction verification",
          ],
        },
      ];
    } else {
      return [
        {
          step: 1,
          title: "Update Dependencies",
          description: "Replace node-redis with GLIDE",
          codeChanges: [
            "npm uninstall redis",
            "npm install @valkey/valkey-glide",
          ],
          validation: ["Verify GLIDE installation"],
        },
        {
          step: 2,
          title: "Update Method Names",
          description: "Convert camelCase methods to lowercase",
          codeChanges: [
            "Replace: client.hSet() with client.hset()",
            "Replace: client.lPush() with client.lpush()",
            "Apply to all camelCase method names",
          ],
          validation: ["Method name verification", "Compile check"],
        },
        {
          step: 3,
          title: "Update Client Creation",
          description: "Convert client initialization",
          codeChanges: [
            "Replace: createClient(options)",
            "With: GlideClient.createClient(options)",
          ],
          validation: ["Connection establishment"],
        },
      ];
    }
  }

  /**
   * Get migration best practices
   */
  private static getMigrationBestPractices(
    fromLibrary: "ioredis" | "node-redis",
  ): string[] {
    const common = [
      "Test each converted command individually",
      "Maintain comprehensive test coverage during migration",
      "Use TypeScript for better migration safety",
      "Implement gradual migration with feature flags",
      "Monitor performance before and after migration",
    ];

    if (fromLibrary === "ioredis") {
      return [
        ...common,
        "Pay special attention to SET command parameter format",
        "Rewrite pipeline operations completely",
        "Update event handling for connection management",
        "Verify stream operation parameter formats",
      ];
    } else {
      return [
        ...common,
        "Use find-replace for systematic method name updates",
        "Verify type compatibility with existing code",
        "Check parameter object structures",
      ];
    }
  }

  /**
   * Get common migration pitfalls
   */
  private static getCommonPitfalls(
    fromLibrary: "ioredis" | "node-redis",
  ): string[] {
    if (fromLibrary === "ioredis") {
      return [
        "Forgetting to convert SET option parameters to object format",
        "Not updating pipeline syntax completely",
        "Missing event handler updates",
        "Assuming identical behavior for stream operations",
        "Not testing error handling differences",
      ];
    } else {
      return [
        "Missing method name case changes",
        "Assuming all APIs are identical",
        "Not verifying type definition compatibility",
        "Forgetting to update import statements",
      ];
    }
  }

  /**
   * Analyze migration complexity for a set of commands
   */
  static analyzeMigrationComplexity(
    commands: string[],
    fromLibrary: "ioredis" | "node-redis",
  ): {
    overall: "simple" | "moderate" | "complex";
    breakdown: Record<string, "simple" | "moderate" | "complex">;
    estimates: {
      simpleCommands: number;
      moderateCommands: number;
      complexCommands: number;
      totalEffortHours: number;
    };
  } {
    const breakdown: Record<string, "simple" | "moderate" | "complex"> = {};
    let simpleCount = 0;
    let moderateCount = 0;
    let complexCount = 0;

    for (const command of commands) {
      const mapping = this.getMapping(command);
      if (mapping) {
        breakdown[command] = mapping.migrationComplexity;
        switch (mapping.migrationComplexity) {
          case "simple":
            simpleCount++;
            break;
          case "moderate":
            moderateCount++;
            break;
          case "complex":
            complexCount++;
            break;
        }
      }
    }

    let overall: "simple" | "moderate" | "complex";
    if (complexCount > 0) {
      overall = "complex";
    } else if (moderateCount > simpleCount) {
      overall = "moderate";
    } else {
      overall = "simple";
    }

    // Rough effort estimates (hours)
    const totalEffortHours =
      simpleCount * 0.5 + moderateCount * 2 + complexCount * 8;

    return {
      overall,
      breakdown,
      estimates: {
        simpleCommands: simpleCount,
        moderateCommands: moderateCount,
        complexCommands: complexCount,
        totalEffortHours,
      },
    };
  }
}

// Export convenience functions
export const getMapping = CrossReferenceMapper.getMapping;
export const findEquivalent = CrossReferenceMapper.findEquivalent;
export const generateMigrationGuide =
  CrossReferenceMapper.generateMigrationGuide;
export const analyzeMigrationComplexity =
  CrossReferenceMapper.analyzeMigrationComplexity;
