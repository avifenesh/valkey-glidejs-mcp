/**
 * Command-Specific Handlers for Enhanced API Explorer
 * Provides specialized handling for Redis/GLIDE commands with context-aware responses
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import { CommandRegistry } from "../../core/database/command-registry.js";
import { TemplateEngine } from "../../core/response/template-engine.js";
import { ProgressiveDisclosure } from "../../core/response/progressive-disclosure.js";

export interface CommandHandlerResult {
  command: string;
  description: string;
  syntax: string;
  examples: CommandExample[];
  useCases: string[];
  parameters: ParameterSpec[];
  relatedCommands: string[];
  bestPractices: string[];
  performanceNotes: string[];
  migrationInfo?: MigrationInfo;
}

export interface CommandExample {
  title: string;
  code: string;
  explanation: string;
  complexity: "simple" | "intermediate" | "advanced";
  category: string;
}

export interface ParameterSpec {
  name: string;
  type: string;
  required: boolean;
  description: string;
  examples: string[];
  constraints?: string;
}

export interface MigrationInfo {
  ioredis?: {
    equivalent: string;
    differences: string[];
    migrationSteps: string[];
  };
  nodeRedis?: {
    equivalent: string;
    differences: string[];
    migrationSteps: string[];
  };
}

export class CommandHandlers {
  private static handlers: Map<string, CommandHandler> = new Map();

  static {
    this.initializeHandlers();
  }

  /**
   * Initialize command-specific handlers
   */
  private static initializeHandlers(): void {
    // String Operations
    this.registerHandler("GET", this.handleGetCommand);
    this.registerHandler("SET", this.handleSetCommand);
    this.registerHandler("MGET", this.handleGetCommand);
    this.registerHandler("MSET", this.handleSetCommand);

    // Hash Operations
    this.registerHandler("HGET", this.handleGetCommand);
    this.registerHandler("HSET", this.handleHsetCommand);
    this.registerHandler("HGETALL", this.handleGetCommand);
    this.registerHandler("HMGET", this.handleGetCommand);
    this.registerHandler("HMSET", this.handleHsetCommand);

    // List Operations
    this.registerHandler("LPUSH", this.handleCommand);
    this.registerHandler("RPUSH", this.handleCommand);
    this.registerHandler("LPOP", this.handleCommand);
    this.registerHandler("RPOP", this.handleCommand);
    this.registerHandler("LRANGE", this.handleGetCommand);

    // Set Operations
    this.registerHandler("SADD", this.handleCommand);
    this.registerHandler("SREM", this.handleCommand);
    this.registerHandler("SMEMBERS", this.handleCommand);
    this.registerHandler("SINTER", this.handleCommand);

    // Sorted Set Operations
    this.registerHandler("ZADD", this.handleZaddCommand);
    this.registerHandler("ZRANGE", this.handleGetCommand);
    this.registerHandler("ZRANK", this.handleCommand);
    this.registerHandler("ZSCORE", this.handleCommand);

    // Stream Operations
    this.registerHandler("XADD", this.handleCommand);
    this.registerHandler("XREAD", this.handleXreadCommand);
    this.registerHandler("XGROUP", this.handleCommand);
    this.registerHandler("XREADGROUP", this.handleXreadCommand);

    // Pub/Sub Operations
    this.registerHandler("PUBLISH", this.handleCommand);
    this.registerHandler("SUBSCRIBE", this.handleCommand);

    // Geospatial Operations
    this.registerHandler("GEOADD", this.handleCommand);
    this.registerHandler("GEORADIUS", this.handleGetCommand);

    // Transaction Operations
    this.registerHandler("MULTI", this.handleCommand);
    this.registerHandler("EXEC", this.handleCommand);

    // Key Operations
    this.registerHandler("DEL", this.handleCommand);
    this.registerHandler("EXISTS", this.handleGetCommand);
    this.registerHandler("EXPIRE", this.handleCommand);
    this.registerHandler("TTL", this.handleCommand);
  }

  /**
   * Register a command handler
   */
  private static registerHandler(
    command: string,
    handler: CommandHandler,
  ): void {
    this.handlers.set(command.toUpperCase(), handler);
  }

  /**
   * Handle a specific command with context-aware response
   */
  static async handleCommand(
    command: string,
    context: EnhancedQueryContext,
    parameters?: Record<string, any>,
  ): Promise<CommandHandlerResult> {
    const upperCommand = command.toUpperCase();
    const handler = this.handlers.get(upperCommand);

    if (handler) {
      return await handler(context, parameters);
    }

    // Fallback to generic handler
    return this.handleGenericCommand(upperCommand, context, parameters);
  }

  /**
   * Get available command handlers
   */
  static getAvailableCommands(): string[] {
    return Array.from(this.handlers.keys()).sort();
  }

  /**
   * STRING COMMAND HANDLERS
   */

  private static async handleGetCommand(
    context: EnhancedQueryContext,
    parameters?: Record<string, any>,
  ): Promise<CommandHandlerResult> {
    return {
      command: "GET",
      description: "Retrieve the value of a key",
      syntax: "client.get(key)",
      examples: [
        {
          title: "Basic Usage",
          code: `const value = await client.get("user:123");
if (value !== null) {
  console.log("User data:", value);
} else {
  console.log("User not found");
}`,
          explanation: "Retrieve a simple string value with null check",
          complexity: "simple",
          category: "basic",
        },
        {
          title: "JSON Data Retrieval",
          code: `const userData = await client.get("user:profile:456");
if (userData) {
  const profile = JSON.parse(userData);
  console.log("Profile:", profile);
}`,
          explanation: "Retrieve and parse JSON data stored as string",
          complexity: "intermediate",
          category: "json",
        },
        {
          title: "Batch Retrieval Pattern",
          code: `const keys = ["user:123", "user:456", "user:789"];
const values = await Promise.all(
  keys.map(key => client.get(key))
);
const results = keys.reduce((acc, key, index) => {
  if (values[index] !== null) {
    acc[key] = values[index];
  }
  return acc;
}, {});`,
          explanation: "Retrieve multiple keys efficiently with error handling",
          complexity: "advanced",
          category: "optimization",
        },
      ],
      useCases: [
        "Cache retrieval",
        "User session data",
        "Configuration values",
        "Temporary data storage",
      ],
      parameters: [
        {
          name: "key",
          type: "string",
          required: true,
          description: "The key to retrieve",
          examples: ["user:123", "cache:data", "config:timeout"],
        },
      ],
      relatedCommands: ["SET", "MGET", "EXISTS", "TTL"],
      bestPractices: [
        "Always check for null return values",
        "Use meaningful key naming conventions",
        "Consider using MGET for multiple keys",
        "Handle JSON parsing errors gracefully",
      ],
      performanceNotes: [
        "O(1) time complexity",
        "Network latency is primary factor",
        "Use pipelining for multiple GET operations",
      ],
      migrationInfo: {
        ioredis: {
          equivalent: "redis.get(key)",
          differences: ["Return type handling is identical"],
          migrationSteps: [
            "Direct replacement possible",
            "Update import statements",
          ],
        },
        nodeRedis: {
          equivalent: "client.get(key)",
          differences: ["Identical syntax and behavior"],
          migrationSteps: ["Direct replacement possible"],
        },
      },
    };
  }

  private static async handleSetCommand(
    context: EnhancedQueryContext,
    parameters?: Record<string, any>,
  ): Promise<CommandHandlerResult> {
    return {
      command: "SET",
      description: "Set the value of a key with optional expiration",
      syntax: "client.set(key, value, options?)",
      examples: [
        {
          title: "Basic SET",
          code: `await client.set("user:123", "John Doe");
console.log("User saved successfully");`,
          explanation: "Store a simple string value",
          complexity: "simple",
          category: "basic",
        },
        {
          title: "SET with Expiration",
          code: `await client.set("session:abc123", sessionData, {
  EX: 3600 // Expire in 1 hour
});`,
          explanation: "Store data with automatic expiration",
          complexity: "intermediate",
          category: "expiration",
        },
        {
          title: "Conditional SET",
          code: `const result = await client.set("lock:resource", "locked", {
  NX: true, // Only set if key doesn't exist
  EX: 30   // Expire in 30 seconds
});

if (result === "OK") {
  console.log("Lock acquired");
  // Perform critical section
} else {
  console.log("Lock already held");
}`,
          explanation: "Implement distributed locking with conditional SET",
          complexity: "advanced",
          category: "locking",
        },
      ],
      useCases: [
        "Data storage",
        "Caching with TTL",
        "Session management",
        "Distributed locking",
        "Rate limiting counters",
      ],
      parameters: [
        {
          name: "key",
          type: "string",
          required: true,
          description: "The key to set",
          examples: ["user:123", "cache:data", "lock:resource"],
        },
        {
          name: "value",
          type: "string",
          required: true,
          description: "The value to store",
          examples: ["John Doe", "JSON.stringify(data)", "locked"],
        },
        {
          name: "options",
          type: "object",
          required: false,
          description: "SET options (EX, PX, NX, XX)",
          examples: ["{ EX: 3600 }", "{ NX: true }", "{ PX: 5000, XX: true }"],
        },
      ],
      relatedCommands: ["GET", "MSET", "EXPIRE", "SETNX"],
      bestPractices: [
        "Use expiration for temporary data",
        "Consider NX/XX flags for conditional operations",
        "Store JSON as strings for complex objects",
        "Use meaningful key prefixes for organization",
      ],
      performanceNotes: [
        "O(1) time complexity",
        "Memory usage depends on value size",
        "Use MSET for multiple key-value pairs",
      ],
      migrationInfo: {
        ioredis: {
          equivalent: 'redis.set(key, value, "EX", seconds)',
          differences: ["Options format differs", "GLIDE uses object notation"],
          migrationSteps: [
            "Convert string-based options to object format",
            "Update EX/PX syntax from separate arguments",
          ],
        },
        nodeRedis: {
          equivalent: "client.set(key, value, options)",
          differences: ["Identical syntax and behavior"],
          migrationSteps: ["Direct replacement possible"],
        },
      },
    };
  }

  /**
   * HASH COMMAND HANDLERS
   */

  private static async handleHsetCommand(
    context: EnhancedQueryContext,
    parameters?: Record<string, any>,
  ): Promise<CommandHandlerResult> {
    return {
      command: "HSET",
      description: "Set field-value pairs in a hash",
      syntax:
        "client.hset(key, field, value) or client.hset(key, fieldValueMap)",
      examples: [
        {
          title: "Single Field",
          code: `await client.hset("user:123", "name", "Alice");
await client.hset("user:123", "age", "30");`,
          explanation: "Set individual hash fields",
          complexity: "simple",
          category: "basic",
        },
        {
          title: "Multiple Fields",
          code: `await client.hset("user:456", {
  name: "Bob",
  age: "25",
  email: "bob@example.com",
  lastLogin: new Date().toISOString()
});`,
          explanation: "Set multiple hash fields in one operation",
          complexity: "intermediate",
          category: "bulk",
        },
        {
          title: "User Profile Management",
          code: `class UserProfile {
  static async create(userId, profileData) {
    const key = \`profile:\${userId}\`;
    await client.hset(key, {
      ...profileData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    await client.expire(key, 86400); // 24 hours
    return key;
  }
  
  static async update(userId, updates) {
    const key = \`profile:\${userId}\`;
    await client.hset(key, {
      ...updates,
      updatedAt: Date.now()
    });
  }
}`,
          explanation: "Complete user profile management system",
          complexity: "advanced",
          category: "patterns",
        },
      ],
      useCases: [
        "User profiles",
        "Object storage",
        "Configuration management",
        "Structured data caching",
        "Shopping cart items",
      ],
      parameters: [
        {
          name: "key",
          type: "string",
          required: true,
          description: "The hash key",
          examples: ["user:123", "profile:456", "config:app"],
        },
        {
          name: "field",
          type: "string",
          required: true,
          description: "Field name (for single field variant)",
          examples: ["name", "age", "email"],
        },
        {
          name: "value",
          type: "string",
          required: true,
          description: "Field value (for single field variant)",
          examples: ["Alice", "30", "alice@example.com"],
        },
        {
          name: "fieldValueMap",
          type: "object",
          required: true,
          description: "Object with field-value pairs (for multiple fields)",
          examples: ['{ name: "Alice", age: "30" }'],
        },
      ],
      relatedCommands: ["HGET", "HGETALL", "HMGET", "HDEL"],
      bestPractices: [
        "Use meaningful field names",
        "Group related data in single hash",
        "Consider hash expiration for temporary data",
        "Use bulk operations for multiple fields",
      ],
      performanceNotes: [
        "O(1) for single field, O(N) for N fields",
        "Memory efficient for small objects",
        "Prefer HSET over multiple HSET calls",
      ],
    };
  }

  /**
   * STREAM COMMAND HANDLERS
   */

  private static async handleXreadCommand(
    context: EnhancedQueryContext,
    parameters?: Record<string, any>,
  ): Promise<CommandHandlerResult> {
    return {
      command: "XREAD",
      description: "Read entries from one or more streams",
      syntax: "client.xread(streams, options?)",
      examples: [
        {
          title: "Basic Stream Reading",
          code: `const entries = await client.xread([
  { key: "events", id: "0" }
]);

entries.forEach(stream => {
  console.log(\`Stream: \${stream.name}\`);
  stream.entries.forEach(entry => {
    console.log(\`ID: \${entry.id}, Data:\`, entry.elements);
  });
});`,
          explanation: "Read all entries from a stream from the beginning",
          complexity: "simple",
          category: "basic",
        },
        {
          title: "Blocking Read",
          code: `const entries = await client.xread([
  { key: "notifications", id: "$" }
], {
  BLOCK: 5000, // Block for 5 seconds
  COUNT: 10   // Read up to 10 entries
});

if (entries.length > 0) {
  // Process new notifications
  entries[0].entries.forEach(entry => {
    processNotification(entry.elements);
  });
}`,
          explanation: "Block waiting for new stream entries with timeout",
          complexity: "intermediate",
          category: "blocking",
        },
        {
          title: "Event Processing Pipeline",
          code: `class EventProcessor {
  constructor(streamName) {
    this.streamName = streamName;
    this.lastId = "$";
    this.running = false;
  }
  
  async start() {
    this.running = true;
    while (this.running) {
      try {
        const result = await client.xread([
          { key: this.streamName, id: this.lastId }
        ], { BLOCK: 1000 });
        
        if (result.length > 0) {
          const stream = result[0];
          for (const entry of stream.entries) {
            await this.processEvent(entry);
            this.lastId = entry.id;
          }
        }
      } catch (error) {
        console.error("Stream read error:", error);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  async processEvent(entry) {
    const eventType = entry.elements.type;
    const eventData = entry.elements.data;
    
    console.log(\`Processing \${eventType} event:\`, eventData);
    // Add your event processing logic here
  }
  
  stop() {
    this.running = false;
  }
}`,
          explanation: "Production-ready event processing with error handling",
          complexity: "advanced",
          category: "production",
        },
      ],
      useCases: [
        "Event processing",
        "Message consumption",
        "Real-time data feeds",
        "Audit log reading",
        "Activity stream monitoring",
      ],
      parameters: [
        {
          name: "streams",
          type: "array",
          required: true,
          description: "Array of stream specifications with key and ID",
          examples: [
            '[{ key: "events", id: "0" }]',
            '[{ key: "logs", id: "$" }]',
          ],
        },
        {
          name: "options",
          type: "object",
          required: false,
          description: "Read options (BLOCK, COUNT)",
          examples: ["{ BLOCK: 5000 }", "{ COUNT: 10, BLOCK: 0 }"],
        },
      ],
      relatedCommands: ["XADD", "XRANGE", "XREADGROUP", "XLEN"],
      bestPractices: [
        "Use blocking reads for real-time processing",
        "Handle timeouts gracefully",
        "Track last processed ID for resumption",
        "Implement error recovery mechanisms",
      ],
      performanceNotes: [
        "O(N) where N is number of entries returned",
        "Blocking operations don't consume CPU",
        "Use COUNT to limit memory usage",
      ],
    };
  }

  /**
   * SORTED SET COMMAND HANDLERS
   */

  private static async handleZaddCommand(
    context: EnhancedQueryContext,
    parameters?: Record<string, any>,
  ): Promise<CommandHandlerResult> {
    return {
      command: "ZADD",
      description: "Add members with scores to a sorted set",
      syntax: "client.zadd(key, scoreMembers, options?)",
      examples: [
        {
          title: "Single Member",
          code: `await client.zadd("leaderboard", { "player1": 100 });
console.log("Score added to leaderboard");`,
          explanation: "Add a single member with score",
          complexity: "simple",
          category: "basic",
        },
        {
          title: "Multiple Members",
          code: `await client.zadd("scores", {
  "alice": 95,
  "bob": 87,
  "charlie": 92,
  "diana": 98
});`,
          explanation: "Add multiple members with their scores",
          complexity: "intermediate",
          category: "bulk",
        },
        {
          title: "Leaderboard System",
          code: `class Leaderboard {
  constructor(name) {
    this.key = \`leaderboard:\${name}\`;
  }
  
  async addScore(playerId, score) {
    return await client.zadd(this.key, { [playerId]: score });
  }
  
  async updateScore(playerId, increment) {
    return await client.zincrby(this.key, increment, playerId);
  }
  
  async getTopPlayers(count = 10) {
    return await client.zrevrange(this.key, 0, count - 1, {
      WITHSCORES: true
    });
  }
  
  async getPlayerRank(playerId) {
    return await client.zrevrank(this.key, playerId);
  }
}`,
          explanation: "Complete leaderboard implementation with ranking",
          complexity: "advanced",
          category: "patterns",
        },
      ],
      useCases: [
        "Leaderboards",
        "Priority queues",
        "Time-series data",
        "Scoring systems",
        "Ranking algorithms",
      ],
      parameters: [
        {
          name: "key",
          type: "string",
          required: true,
          description: "The sorted set key",
          examples: ["leaderboard", "scores:game1", "priority:tasks"],
        },
        {
          name: "scoreMembers",
          type: "object",
          required: true,
          description: "Object mapping members to scores",
          examples: ['{ "player1": 100 }', '{ "alice": 95, "bob": 87 }'],
        },
        {
          name: "options",
          type: "object",
          required: false,
          description: "ZADD options (NX, XX, CH, INCR)",
          examples: ["{ NX: true }", "{ XX: true, CH: true }"],
        },
      ],
      relatedCommands: ["ZRANGE", "ZRANK", "ZSCORE", "ZREM"],
      bestPractices: [
        "Use meaningful member names",
        "Consider score precision requirements",
        "Use batch operations for multiple members",
        "Implement proper error handling",
      ],
      performanceNotes: [
        "O(log(N)) for each element added",
        "Memory usage scales with set size",
        "Bulk operations are more efficient",
      ],
    };
  }

  /**
   * Generic command handler fallback
   */
  private static async handleGenericCommand(
    command: string,
    context: EnhancedQueryContext,
    parameters?: Record<string, any>,
  ): Promise<CommandHandlerResult> {
    const registryCommand = CommandRegistry.getCommand(command);

    if (registryCommand) {
      return {
        command,
        description: registryCommand.description,
        syntax: registryCommand.glideMethod,
        examples: registryCommand.examples.map((ex) => ({
          title: "Example",
          code: typeof ex === 'string' ? ex : ex.code || 'No example available',
          explanation: "Basic usage example",
          complexity: "simple" as const,
          category: "basic",
        })),
        useCases: registryCommand.useCases,
        parameters: [],
        relatedCommands: registryCommand.relatedCommands,
        bestPractices: [],
        performanceNotes: [registryCommand.performance.timeComplexity],
      };
    }

    return {
      command,
      description: `Redis command: ${command}`,
      syntax: `client.${command.toLowerCase()}()`,
      examples: [],
      useCases: [],
      parameters: [],
      relatedCommands: [],
      bestPractices: [],
      performanceNotes: [],
    };
  }
}

type CommandHandler = (
  context: EnhancedQueryContext,
  parameters?: Record<string, any>,
) => Promise<CommandHandlerResult>;

// Export convenience functions
export const handleCommand = CommandHandlers.handleCommand;
export const getAvailableCommands = CommandHandlers.getAvailableCommands;
