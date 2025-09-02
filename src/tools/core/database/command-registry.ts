/**
 * Universal Command Registry
 * Comprehensive database of Redis/GLIDE commands with cross-reference mapping and metadata
 */

export interface CommandDefinition {
  name: string;
  category: string;
  glideMethod: string;
  description: string;
  parameters: ParameterInfo[];
  returnType: string;
  complexity: "simple" | "intermediate" | "advanced";
  useCases: string[];
  examples: CommandExample[];
  relatedCommands: string[];
  performance: PerformanceInfo;
  migration: MigrationInfo;
}

export interface ParameterInfo {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface CommandExample {
  title: string;
  code: string;
  language: "typescript" | "javascript";
  useCase: string;
}

export interface PerformanceInfo {
  timeComplexity: string;
  spaceComplexity: string;
  optimizationTips: string[];
}

export interface MigrationInfo {
  ioredis?: MigrationMapping;
  nodeRedis?: MigrationMapping;
  complexityRating: number;
  commonIssues: string[];
}

export interface MigrationMapping {
  method: string;
  signature: string;
  example: { before: string; after: string };
}

export interface CrossReferenceMap {
  ioredisToGlide: Map<string, GlideEquivalent>;
  nodeRedisToGlide: Map<string, GlideEquivalent>;
  categoryMappings: Map<string, string[]>;
  patternMappings: Map<string, string[]>;
}

export interface GlideEquivalent {
  command: string;
  method: string;
  signature: string;
  examples: string[];
  migrationComplexity: number;
  notes: string[];
}

export class CommandRegistry {
  private static commands: Map<string, CommandDefinition> = new Map();
  private static categories: Map<string, string[]> = new Map();
  private static crossReferences: CrossReferenceMap;
  private static searchIndex: Map<string, Set<string>> = new Map();
  private static initialized = false;

  static {
    this.initialize();
  }

  private static async initialize(): Promise<void> {
    if (this.initialized) return;

    this.crossReferences = {
      ioredisToGlide: new Map(),
      nodeRedisToGlide: new Map(),
      categoryMappings: new Map(),
      patternMappings: new Map(),
    };

    await this.loadCoreCommands();
    this.buildSearchIndex();
    this.initializeMappings();
    this.initialized = true;
  }

  private static async loadCoreCommands(): Promise<void> {
    // String Commands
    this.addCommand({
      name: "GET",
      category: "strings",
      glideMethod: "client.get(key)",
      description: "Get the value of a key",
      parameters: [
        {
          name: "key",
          type: "string",
          required: true,
          description: "The key to retrieve",
        },
      ],
      returnType: "string | null",
      complexity: "simple",
      useCases: ["cache lookup", "data retrieval"],
      examples: [
        {
          title: "Basic GET",
          code: 'const value = await client.get("user:123");',
          language: "typescript",
          useCase: "cache lookup",
        },
      ],
      relatedCommands: ["SET", "MGET", "EXISTS"],
      performance: {
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        optimizationTips: ["Use MGET for multiple keys"],
      },
      migration: {
        ioredis: {
          method: "get",
          signature: "get(key)",
          example: { before: 'redis.get("key")', after: 'client.get("key")' },
        },
        complexityRating: 1,
        commonIssues: [],
      },
    });

    this.addCommand({
      name: "SET",
      category: "strings",
      glideMethod: "client.set(key, value, options?)",
      description: "Set the value of a key",
      parameters: [
        { name: "key", type: "string", required: true, description: "The key" },
        {
          name: "value",
          type: "string",
          required: true,
          description: "The value",
        },
      ],
      returnType: "string | null",
      complexity: "simple",
      useCases: ["caching", "session storage"],
      examples: [
        {
          title: "Basic SET",
          code: 'await client.set("user:123", "Alice");',
          language: "typescript",
          useCase: "storage",
        },
      ],
      relatedCommands: ["GET", "SETEX", "SETNX"],
      performance: {
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        optimizationTips: ["Use MSET for bulk"],
      },
      migration: {
        ioredis: {
          method: "set",
          signature: "set(key, value)",
          example: {
            before: 'redis.set("k", "v")',
            after: 'client.set("k", "v")',
          },
        },
        complexityRating: 1,
        commonIssues: [],
      },
    });

    // Hash Commands
    this.addCommand({
      name: "HSET",
      category: "hashes",
      glideMethod: "client.hset(key, field, value)",
      description: "Set hash field value",
      parameters: [
        {
          name: "key",
          type: "string",
          required: true,
          description: "Hash key",
        },
        {
          name: "field",
          type: "string",
          required: true,
          description: "Field name",
        },
        {
          name: "value",
          type: "string",
          required: true,
          description: "Field value",
        },
      ],
      returnType: "number",
      complexity: "simple",
      useCases: ["object storage", "user profiles"],
      examples: [
        {
          title: "Set field",
          code: 'await client.hset("user:123", "name", "Alice");',
          language: "typescript",
          useCase: "profile",
        },
      ],
      relatedCommands: ["HGET", "HDEL", "HGETALL"],
      performance: {
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        optimizationTips: ["Use object form for multiple fields"],
      },
      migration: { complexityRating: 1, commonIssues: [] },
    });

    // Stream Commands
    this.addCommand({
      name: "XADD",
      category: "streams",
      glideMethod: "client.xadd(key, entries)",
      description: "Add entry to stream",
      parameters: [
        {
          name: "key",
          type: "string",
          required: true,
          description: "Stream key",
        },
        {
          name: "entries",
          type: "string[][]",
          required: true,
          description: "Field-value pairs",
        },
      ],
      returnType: "string",
      complexity: "intermediate",
      useCases: ["event logging", "message queues"],
      examples: [
        {
          title: "Add event",
          code: 'await client.xadd("events", [["type", "login"]]);',
          language: "typescript",
          useCase: "logging",
        },
      ],
      relatedCommands: ["XREAD", "XLEN", "XTRIM"],
      performance: {
        timeComplexity: "O(1)",
        spaceComplexity: "O(N)",
        optimizationTips: ["Use MAXLEN for cleanup"],
      },
      migration: {
        complexityRating: 3,
        commonIssues: ["Field format differences"],
      },
    });

    // Additional core commands...
    this.loadMoreCommands();
  }

  private static loadMoreCommands(): void {
    const additionalCommands = [
      {
        name: "LPUSH",
        category: "lists",
        method: "client.lpush(key, elements)",
        desc: "Prepend to list",
      },
      {
        name: "SADD",
        category: "sets",
        method: "client.sadd(key, members)",
        desc: "Add to set",
      },
      {
        name: "ZADD",
        category: "sortedsets",
        method: "client.zadd(key, scoreMap)",
        desc: "Add to sorted set",
      },
    ];

    additionalCommands.forEach((cmd) => {
      this.addCommand({
        name: cmd.name,
        category: cmd.category,
        glideMethod: cmd.method,
        description: cmd.desc,
        parameters: [
          { name: "key", type: "string", required: true, description: "Key" },
        ],
        returnType: "number",
        complexity: "simple",
        useCases: ["data structure"],
        examples: [],
        relatedCommands: [],
        performance: {
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          optimizationTips: [],
        },
        migration: { complexityRating: 1, commonIssues: [] },
      });
    });
  }

  private static addCommand(command: CommandDefinition): void {
    this.commands.set(command.name, command);
    if (!this.categories.has(command.category)) {
      this.categories.set(command.category, []);
    }
    this.categories.get(command.category)!.push(command.name);
    this.updateCrossReferences(command);
  }

  private static updateCrossReferences(command: CommandDefinition): void {
    if (command.migration.ioredis) {
      this.crossReferences.ioredisToGlide.set(
        command.migration.ioredis.method,
        {
          command: command.name,
          method: command.glideMethod,
          signature: command.glideMethod,
          examples: command.examples.map((ex) => ex.code),
          migrationComplexity: command.migration.complexityRating,
          notes: command.migration.commonIssues,
        },
      );
    }
  }

  private static buildSearchIndex(): void {
    for (const [name, command] of this.commands) {
      this.addToSearchIndex(name.toLowerCase(), name);
      command.description
        .toLowerCase()
        .split(/\s+/)
        .forEach((word) => this.addToSearchIndex(word, name));
      command.useCases.forEach((useCase) => {
        useCase
          .toLowerCase()
          .split(/\s+/)
          .forEach((word) => this.addToSearchIndex(word, name));
      });
    }
  }

  private static addToSearchIndex(term: string, commandName: string): void {
    if (!this.searchIndex.has(term)) {
      this.searchIndex.set(term, new Set());
    }
    this.searchIndex.get(term)!.add(commandName);
  }

  private static initializeMappings(): void {
    // Category mappings
    for (const [category, commands] of this.categories) {
      this.crossReferences.categoryMappings.set(category, commands);
    }

    // Pattern mappings
    const patterns = {
      caching: ["GET", "SET", "SETEX", "EXPIRE"],
      sessions: ["HSET", "HGET", "EXPIRE"],
      queues: ["LPUSH", "RPOP", "BLPOP"],
      leaderboards: ["ZADD", "ZRANGE", "ZRANK"],
      streams: ["XADD", "XREAD", "XGROUP"],
    };

    Object.entries(patterns).forEach(([pattern, commands]) => {
      this.crossReferences.patternMappings.set(pattern, commands);
    });
  }

  // Public API
  static getCommand(name: string): CommandDefinition | null {
    return this.commands.get(name.toUpperCase()) || null;
  }

  static searchCommands(query: string): CommandDefinition[] {
    const searchTerms = query.toLowerCase().split(/\s+/);
    const matchingCommands = new Set<string>();

    for (const term of searchTerms) {
      const matches = this.searchIndex.get(term);
      if (matches) matches.forEach((cmd) => matchingCommands.add(cmd));
    }

    return Array.from(matchingCommands)
      .map((name) => this.commands.get(name)!)
      .filter(Boolean)
      .slice(0, 10);
  }

  static getRelatedCommands(commandName: string): CommandDefinition[] {
    const command = this.getCommand(commandName);
    if (!command) return [];
    return command.relatedCommands
      .map((name) => this.getCommand(name))
      .filter(Boolean) as CommandDefinition[];
  }

  static getCategoryCommands(category: string): CommandDefinition[] {
    const commandNames = this.categories.get(category) || [];
    return commandNames
      .map((name) => this.getCommand(name))
      .filter(Boolean) as CommandDefinition[];
  }

  static getPatternCommands(pattern: string): CommandDefinition[] {
    const commandNames =
      this.crossReferences.patternMappings.get(pattern) || [];
    return commandNames
      .map((name) => this.getCommand(name))
      .filter(Boolean) as CommandDefinition[];
  }

  static getGlideEquivalent(
    library: "ioredis" | "node-redis",
    method: string,
  ): GlideEquivalent | null {
    const mapping =
      library === "ioredis"
        ? this.crossReferences.ioredisToGlide
        : this.crossReferences.nodeRedisToGlide;
    return mapping.get(method.toLowerCase()) || null;
  }

  static getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  static getAllCommands(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  static getCrossReferences(): CrossReferenceMap {
    return this.crossReferences;
  }
}

// Export convenience functions
export const getCommand = CommandRegistry.getCommand;
export const searchCommands = CommandRegistry.searchCommands;
export const getRelatedCommands = CommandRegistry.getRelatedCommands;
