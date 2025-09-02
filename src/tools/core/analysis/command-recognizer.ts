/**
 * Command Recognition Engine for GLIDE Methods
 * Provides comprehensive pattern matching and recognition of Redis/GLIDE commands from natural language queries
 */

import {
  GLIDE_SURFACE,
  IOREDIS_DATASET,
  NODE_REDIS_DATASET,
} from "../../../data/api/mappings.js";

export interface RecognizedCommand {
  name: string;
  confidence: number;
  source: "redis" | "ioredis" | "node-redis" | "glide";
  category: string;
  variants: string[];
  glideMethod: string;
  parameters?: string[];
  description: string;
  examples?: string[];
}

export interface CommandPattern {
  command: string;
  patterns: RegExp[];
  category: string;
  variants: string[];
  glideEquivalent: string;
  commonUseCases: string[];
  parameters: string[];
}

export class CommandRecognizer {
  private static commandPatterns: Map<string, CommandPattern> = new Map();
  private static categoryKeywords: Map<string, string[]> = new Map();
  private static aliasMap: Map<string, string> = new Map();

  static {
    this.initializePatterns();
  }

  /**
   * Initialize comprehensive command patterns from GLIDE API mappings
   */
  private static initializePatterns(): void {
    // Core string operations
    this.addCommandPattern({
      command: "GET",
      patterns: [
        /\b(get|retrieve|fetch|read)\s+(value|data|key)\b/i,
        /\bget\s+key\b/i,
        /\bretrieve.*value\b/i,
        /\bfetch.*data\b/i,
      ],
      category: "strings",
      variants: ["MGET", "GETRANGE", "GETSET"],
      glideEquivalent: "client.get(key)",
      commonUseCases: [
        "retrieve stored values",
        "cache lookup",
        "session data",
      ],
      parameters: ["key"],
    });

    this.addCommandPattern({
      command: "SET",
      patterns: [
        /\b(set|store|save|put|write)\s+(value|data|key)\b/i,
        /\bstore.*key\b/i,
        /\bset.*expir/i,
        /\bcache.*value\b/i,
      ],
      category: "strings",
      variants: ["SETEX", "SETNX", "MSET", "SETRANGE"],
      glideEquivalent: "client.set(key, value, options?)",
      commonUseCases: [
        "store values",
        "caching",
        "session storage",
        "temporary data",
      ],
      parameters: ["key", "value", "options?"],
    });

    // Hash operations
    this.addCommandPattern({
      command: "HSET",
      patterns: [
        /\b(hset|hash.*set|field.*set)\b/i,
        /\bset.*hash.*field\b/i,
        /\bstore.*object.*field\b/i,
        /\bupdate.*hash\b/i,
      ],
      category: "hashes",
      variants: ["HMSET", "HSETNX"],
      glideEquivalent: "client.hset(key, field, value)",
      commonUseCases: ["object storage", "user profiles", "structured data"],
      parameters: ["key", "field", "value"],
    });

    this.addCommandPattern({
      command: "HGET",
      patterns: [
        /\b(hget|hash.*get|field.*get)\b/i,
        /\bget.*hash.*field\b/i,
        /\bretrieve.*object.*field\b/i,
        /\bfetch.*hash\b/i,
      ],
      category: "hashes",
      variants: ["HMGET", "HGETALL"],
      glideEquivalent: "client.hget(key, field)",
      commonUseCases: [
        "retrieve object fields",
        "user data lookup",
        "structured queries",
      ],
      parameters: ["key", "field"],
    });

    // List operations
    this.addCommandPattern({
      command: "LPUSH",
      patterns: [
        /\b(lpush|list.*push|push.*left|prepend)\b/i,
        /\badd.*beginning.*list\b/i,
        /\bpush.*head\b/i,
        /\bqueue.*front\b/i,
      ],
      category: "lists",
      variants: ["RPUSH", "LPUSHX", "RPUSHX"],
      glideEquivalent: "client.lpush(key, elements)",
      commonUseCases: ["task queues", "message queues", "activity feeds"],
      parameters: ["key", "elements"],
    });

    this.addCommandPattern({
      command: "LPOP",
      patterns: [
        /\b(lpop|list.*pop|pop.*left|dequeue)\b/i,
        /\bremove.*beginning.*list\b/i,
        /\bpop.*head\b/i,
        /\bqueue.*remove\b/i,
      ],
      category: "lists",
      variants: ["RPOP", "BLPOP", "BRPOP"],
      glideEquivalent: "client.lpop(key)",
      commonUseCases: [
        "process task queue",
        "message processing",
        "stack operations",
      ],
      parameters: ["key"],
    });

    // Set operations
    this.addCommandPattern({
      command: "SADD",
      patterns: [
        /\b(sadd|set.*add|add.*member)\b/i,
        /\badd.*to.*set\b/i,
        /\binsert.*unique\b/i,
        /\bmember.*add\b/i,
      ],
      category: "sets",
      variants: ["SREM", "SMOVE"],
      glideEquivalent: "client.sadd(key, members)",
      commonUseCases: ["unique collections", "tags", "categories", "followers"],
      parameters: ["key", "members"],
    });

    this.addCommandPattern({
      command: "SMEMBERS",
      patterns: [
        /\b(smembers|set.*members|get.*all.*set)\b/i,
        /\ball.*members\b/i,
        /\blist.*set.*contents\b/i,
        /\bretrieve.*unique.*items\b/i,
      ],
      category: "sets",
      variants: ["SCARD", "SISMEMBER", "SINTER"],
      glideEquivalent: "client.smembers(key)",
      commonUseCases: [
        "get all tags",
        "list categories",
        "retrieve unique items",
      ],
      parameters: ["key"],
    });

    // Sorted set operations
    this.addCommandPattern({
      command: "ZADD",
      patterns: [
        /\b(zadd|sorted.*set.*add|rank.*add|score.*add)\b/i,
        /\badd.*with.*score\b/i,
        /\bleaderboard.*add\b/i,
        /\branking.*insert\b/i,
      ],
      category: "sortedsets",
      variants: ["ZREM", "ZINCRBY", "ZCOUNT"],
      glideEquivalent: "client.zadd(key, { member: score })",
      commonUseCases: [
        "leaderboards",
        "rankings",
        "scored data",
        "priority queues",
      ],
      parameters: ["key", "score", "member"],
    });

    this.addCommandPattern({
      command: "ZRANGE",
      patterns: [
        /\b(zrange|sorted.*set.*range|rank.*range|leaderboard.*get)\b/i,
        /\bget.*top.*scores\b/i,
        /\branking.*query\b/i,
        /\brange.*by.*score\b/i,
      ],
      category: "sortedsets",
      variants: ["ZREVRANGE", "ZRANGEBYSCORE", "ZRANK"],
      glideEquivalent: "client.zrange(key, start, stop, options?)",
      commonUseCases: ["top scores", "ranking queries", "leaderboard display"],
      parameters: ["key", "start", "stop", "options?"],
    });

    // Stream operations
    this.addCommandPattern({
      command: "XADD",
      patterns: [
        /\b(xadd|stream.*add|event.*add|log.*append)\b/i,
        /\bappend.*stream\b/i,
        /\badd.*event\b/i,
        /\bproduce.*message\b/i,
      ],
      category: "streams",
      variants: ["XLEN", "XTRIM", "XDEL"],
      glideEquivalent: "client.xadd(key, entries)",
      commonUseCases: ["event logging", "message production", "audit trails"],
      parameters: ["key", "entries"],
    });

    this.addCommandPattern({
      command: "XREAD",
      patterns: [
        /\b(xread|stream.*read|event.*read|consume.*stream)\b/i,
        /\bread.*from.*stream\b/i,
        /\bconsume.*events\b/i,
        /\bprocess.*messages\b/i,
      ],
      category: "streams",
      variants: ["XREADGROUP", "XREVRANGE", "XRANGE"],
      glideEquivalent: "client.xread(streams)",
      commonUseCases: [
        "event processing",
        "message consumption",
        "real-time data",
      ],
      parameters: ["streams"],
    });

    // Pub/Sub operations
    this.addCommandPattern({
      command: "PUBLISH",
      patterns: [
        /\b(publish|send.*message|broadcast|notify)\b/i,
        /\bpublish.*channel\b/i,
        /\bsend.*notification\b/i,
        /\bbroadcast.*event\b/i,
      ],
      category: "pubsub",
      variants: ["PUBSUB"],
      glideEquivalent: "client.publish(channel, message)",
      commonUseCases: [
        "notifications",
        "real-time updates",
        "event broadcasting",
      ],
      parameters: ["channel", "message"],
    });

    this.addCommandPattern({
      command: "SUBSCRIBE",
      patterns: [
        /\b(subscribe|listen|receive.*messages|watch.*channel)\b/i,
        /\bsubscribe.*channel\b/i,
        /\blisten.*events\b/i,
        /\breceive.*notifications\b/i,
      ],
      category: "pubsub",
      variants: ["PSUBSCRIBE", "UNSUBSCRIBE"],
      glideEquivalent: "client.subscribe(channels, callback)",
      commonUseCases: [
        "real-time notifications",
        "event listening",
        "live updates",
      ],
      parameters: ["channels", "callback"],
    });

    // Geospatial operations
    this.addCommandPattern({
      command: "GEOADD",
      patterns: [
        /\b(geoadd|add.*location|store.*coordinates)\b/i,
        /\badd.*geo.*point\b/i,
        /\bstore.*latitude.*longitude\b/i,
        /\blocation.*data\b/i,
      ],
      category: "geo",
      variants: ["GEODIST", "GEOHASH", "GEOPOS"],
      glideEquivalent: "client.geoadd(key, longitude, latitude, member)",
      commonUseCases: ["location tracking", "geofencing", "proximity search"],
      parameters: ["key", "longitude", "latitude", "member"],
    });

    this.addCommandPattern({
      command: "GEORADIUS",
      patterns: [
        /\b(georadius|nearby.*locations|proximity.*search)\b/i,
        /\bfind.*within.*radius\b/i,
        /\bnear.*location\b/i,
        /\bsearch.*by.*distance\b/i,
      ],
      category: "geo",
      variants: ["GEORADIUSBYMEMBER", "GEOSEARCH"],
      glideEquivalent:
        "client.georadius(key, longitude, latitude, radius, unit)",
      commonUseCases: [
        "find nearby locations",
        "proximity queries",
        "location-based search",
      ],
      parameters: ["key", "longitude", "latitude", "radius", "unit"],
    });

    // Transaction operations
    this.addCommandPattern({
      command: "MULTI",
      patterns: [
        /\b(multi|transaction|atomic|batch.*start)\b/i,
        /\bbegin.*transaction\b/i,
        /\bstart.*atomic\b/i,
        /\bbatch.*operations\b/i,
      ],
      category: "transactions",
      variants: ["EXEC", "DISCARD", "WATCH"],
      glideEquivalent: "client.multi()",
      commonUseCases: ["atomic operations", "batch processing", "consistency"],
      parameters: [],
    });

    // Key operations
    this.addCommandPattern({
      command: "DEL",
      patterns: [
        /\b(del|delete|remove|clear)\s+(key|keys)\b/i,
        /\bdelete.*data\b/i,
        /\bremove.*entry\b/i,
        /\bclear.*cache\b/i,
      ],
      category: "keys",
      variants: ["UNLINK", "FLUSHDB"],
      glideEquivalent: "client.del(keys)",
      commonUseCases: ["cleanup", "cache invalidation", "data removal"],
      parameters: ["keys"],
    });

    this.addCommandPattern({
      command: "EXISTS",
      patterns: [
        /\b(exists|check.*key|key.*exists|has.*key)\b/i,
        /\bcheck.*if.*exists\b/i,
        /\bverify.*presence\b/i,
        /\btest.*existence\b/i,
      ],
      category: "keys",
      variants: ["TYPE", "TTL", "PTTL"],
      glideEquivalent: "client.exists(keys)",
      commonUseCases: [
        "validation",
        "presence checking",
        "conditional operations",
      ],
      parameters: ["keys"],
    });

    this.addCommandPattern({
      command: "EXPIRE",
      patterns: [
        /\b(expire|ttl|expir.*time|set.*timeout)\b/i,
        /\btime.*to.*live\b/i,
        /\bset.*expiration\b/i,
        /\btemporary.*data\b/i,
      ],
      category: "keys",
      variants: ["EXPIREAT", "PEXPIRE", "PERSIST"],
      glideEquivalent: "client.expire(key, seconds)",
      commonUseCases: ["cache expiration", "temporary data", "session timeout"],
      parameters: ["key", "seconds"],
    });

    // Initialize category keywords
    this.initializeCategoryKeywords();
  }

  /**
   * Add a command pattern to the recognition system
   */
  private static addCommandPattern(pattern: CommandPattern): void {
    this.commandPatterns.set(pattern.command, pattern);

    // Add aliases
    pattern.variants.forEach((variant) => {
      this.aliasMap.set(variant.toLowerCase(), pattern.command);
    });
  }

  /**
   * Initialize category-based keyword mappings
   */
  private static initializeCategoryKeywords(): void {
    this.categoryKeywords.set("strings", [
      "string",
      "value",
      "key-value",
      "cache",
      "text",
      "data",
      "simple",
    ]);

    this.categoryKeywords.set("hashes", [
      "hash",
      "object",
      "field",
      "property",
      "structure",
      "record",
      "document",
    ]);

    this.categoryKeywords.set("lists", [
      "list",
      "queue",
      "stack",
      "array",
      "sequence",
      "ordered",
      "fifo",
      "lifo",
    ]);

    this.categoryKeywords.set("sets", [
      "set",
      "unique",
      "collection",
      "member",
      "distinct",
      "unordered",
    ]);

    this.categoryKeywords.set("sortedsets", [
      "sorted",
      "rank",
      "score",
      "leaderboard",
      "priority",
      "ordered",
      "ranking",
    ]);

    this.categoryKeywords.set("streams", [
      "stream",
      "event",
      "log",
      "message",
      "time-series",
      "append-only",
      "producer",
      "consumer",
    ]);

    this.categoryKeywords.set("geo", [
      "geo",
      "location",
      "coordinate",
      "latitude",
      "longitude",
      "distance",
      "radius",
      "spatial",
    ]);

    this.categoryKeywords.set("pubsub", [
      "publish",
      "subscribe",
      "channel",
      "message",
      "notification",
      "broadcast",
      "real-time",
    ]);

    this.categoryKeywords.set("transactions", [
      "transaction",
      "atomic",
      "batch",
      "consistency",
      "rollback",
      "commit",
    ]);
  }

  /**
   * Recognize commands from a natural language query
   */
  static recognizeCommands(query: string): RecognizedCommand[] {
    const commands: RecognizedCommand[] = [];
    const lowerQuery = query.toLowerCase();

    // Direct pattern matching
    for (const [commandName, pattern] of this.commandPatterns) {
      const confidence = this.calculatePatternConfidence(query, pattern);

      if (confidence > 0.3) {
        // Minimum confidence threshold
        commands.push({
          name: commandName,
          confidence,
          source: "glide",
          category: pattern.category,
          variants: pattern.variants,
          glideMethod: pattern.glideEquivalent,
          parameters: pattern.parameters,
          description: `GLIDE method: ${pattern.glideEquivalent}`,
          examples: this.generateExamplesForCommand(commandName, pattern),
        });
      }
    }

    // Check for direct command mentions
    this.commandPatterns.forEach((pattern, commandName) => {
      const directMention = new RegExp(
        `\\b${commandName.toLowerCase()}\\b`,
        "i",
      );
      if (directMention.test(query)) {
        const existingCommand = commands.find((c) => c.name === commandName);
        if (existingCommand) {
          existingCommand.confidence = Math.min(
            existingCommand.confidence + 0.3,
            1.0,
          );
        } else {
          commands.push({
            name: commandName,
            confidence: 0.8,
            source: "glide",
            category: pattern.category,
            variants: pattern.variants,
            glideMethod: pattern.glideEquivalent,
            parameters: pattern.parameters,
            description: `Direct command: ${commandName}`,
            examples: this.generateExamplesForCommand(commandName, pattern),
          });
        }
      }
    });

    // Check aliases
    for (const [alias, mainCommand] of this.aliasMap) {
      const aliasPattern = new RegExp(`\\b${alias}\\b`, "i");
      if (aliasPattern.test(query)) {
        const pattern = this.commandPatterns.get(mainCommand);
        if (pattern) {
          commands.push({
            name: alias.toUpperCase(),
            confidence: 0.7,
            source: "glide",
            category: pattern.category,
            variants: [mainCommand],
            glideMethod: pattern.glideEquivalent,
            parameters: pattern.parameters,
            description: `Variant of ${mainCommand}`,
            examples: this.generateExamplesForCommand(alias, pattern),
          });
        }
      }
    }

    // Sort by confidence and remove duplicates
    const uniqueCommands = this.deduplicateCommands(commands);
    return uniqueCommands
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  /**
   * Calculate confidence score for a pattern match
   */
  private static calculatePatternConfidence(
    query: string,
    pattern: CommandPattern,
  ): number {
    let matchScore = 0;
    let totalPatterns = pattern.patterns.length;

    // Check pattern matches
    for (const regex of pattern.patterns) {
      if (regex.test(query)) {
        matchScore += 1;
      }
    }

    const patternConfidence = matchScore / totalPatterns;

    // Boost for category keywords
    const categoryKeywords = this.categoryKeywords.get(pattern.category) || [];
    const categoryBoost = categoryKeywords.some((keyword) =>
      query.toLowerCase().includes(keyword),
    )
      ? 0.2
      : 0;

    // Boost for use case mentions
    const useCaseBoost = pattern.commonUseCases.some((useCase) =>
      query.toLowerCase().includes(useCase.toLowerCase()),
    )
      ? 0.1
      : 0;

    return Math.min(patternConfidence + categoryBoost + useCaseBoost, 1.0);
  }

  /**
   * Generate examples for a recognized command
   */
  private static generateExamplesForCommand(
    commandName: string,
    pattern: CommandPattern,
  ): string[] {
    const examples: string[] = [];

    switch (commandName.toUpperCase()) {
      case "GET":
        examples.push(
          'await client.get("user:123")',
          'const value = await client.get("cache_key")',
        );
        break;
      case "SET":
        examples.push(
          'await client.set("user:123", "data")',
          'await client.set("cache_key", "value", { EX: 3600 })',
        );
        break;
      case "HSET":
        examples.push(
          'await client.hset("user:123", "name", "Alice")',
          'await client.hset("user:123", { name: "Alice", age: 30 })',
        );
        break;
      case "XADD":
        examples.push(
          'await client.xadd("events", [["type", "login"], ["user", "123"]])',
          'await client.xadd("logs", [["level", "info"], ["message", "User login"]])',
        );
        break;
      case "ZADD":
        examples.push(
          'await client.zadd("leaderboard", { "player1": 100 })',
          'await client.zadd("scores", { "alice": 85, "bob": 92 })',
        );
        break;
      default:
        examples.push(`await client.${commandName.toLowerCase()}(...args)`);
    }

    return examples;
  }

  /**
   * Remove duplicate commands from recognition results
   */
  private static deduplicateCommands(
    commands: RecognizedCommand[],
  ): RecognizedCommand[] {
    const seen = new Set<string>();
    const unique: RecognizedCommand[] = [];

    for (const command of commands) {
      const key = `${command.name}-${command.category}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(command);
      }
    }

    return unique;
  }

  /**
   * Get all available commands for a category
   */
  static getCommandsByCategory(category: string): string[] {
    const commands: string[] = [];

    for (const [commandName, pattern] of this.commandPatterns) {
      if (pattern.category === category) {
        commands.push(commandName);
        commands.push(...pattern.variants);
      }
    }

    return [...new Set(commands)];
  }

  /**
   * Get category for a specific command
   */
  static getCommandCategory(commandName: string): string {
    const upperCommand = commandName.toUpperCase();
    const pattern = this.commandPatterns.get(upperCommand);

    if (pattern) {
      return pattern.category;
    }

    // Check aliases
    const mainCommand = this.aliasMap.get(commandName.toLowerCase());
    if (mainCommand) {
      const mainPattern = this.commandPatterns.get(mainCommand);
      return mainPattern?.category || "general";
    }

    return "general";
  }

  /**
   * Get GLIDE equivalent for a command
   */
  static getGlideEquivalent(commandName: string): string {
    const upperCommand = commandName.toUpperCase();
    const pattern = this.commandPatterns.get(upperCommand);

    if (pattern) {
      return pattern.glideEquivalent;
    }

    // Check aliases
    const mainCommand = this.aliasMap.get(commandName.toLowerCase());
    if (mainCommand) {
      const mainPattern = this.commandPatterns.get(mainCommand);
      return (
        mainPattern?.glideEquivalent || `client.${commandName.toLowerCase()}()`
      );
    }

    return `client.${commandName.toLowerCase()}()`;
  }

  /**
   * Get common use cases for a command
   */
  static getCommandUseCases(commandName: string): string[] {
    const upperCommand = commandName.toUpperCase();
    const pattern = this.commandPatterns.get(upperCommand);

    return pattern?.commonUseCases || [];
  }

  /**
   * Extract parameters from a query for a specific command
   */
  static extractParameters(
    query: string,
    command: RecognizedCommand,
  ): Record<string, any> {
    const parameters: Record<string, any> = {};
    const lowerQuery = query.toLowerCase();

    // Extract common parameter patterns
    const patterns = {
      key: /\bkey[:\s]*['"]?([a-zA-Z0-9:_-]+)['"]?/i,
      value: /\bvalue[:\s]*['"]?([^'"]+)['"]?/i,
      field: /\bfield[:\s]*['"]?([a-zA-Z0-9_-]+)['"]?/i,
      score: /\bscore[:\s]*(\d+\.?\d*)/i,
      timeout: /\btimeout[:\s]*(\d+)/i,
      channel: /\bchannel[:\s]*['"]?([a-zA-Z0-9:_-]+)['"]?/i,
    };

    for (const [paramName, pattern] of Object.entries(patterns)) {
      const match = query.match(pattern);
      if (match && match[1]) {
        parameters[paramName] =
          paramName === "score" || paramName === "timeout"
            ? parseFloat(match[1])
            : match[1];
      }
    }

    return parameters;
  }
}

// Export convenience functions
export const recognizeCommands = CommandRecognizer.recognizeCommands;
export const getGlideEquivalent = CommandRecognizer.getGlideEquivalent;
export const getCommandCategory = CommandRecognizer.getCommandCategory;
