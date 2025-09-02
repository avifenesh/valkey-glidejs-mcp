/**
 * Auto-Completion Hints System for AI Agents
 * Provides intelligent parameter suggestions, contextual hints, and dynamic completions
 */

import {
  CompletionHint,
  AutoCompletionRule,
  QueryContext,
  ParameterDefinition,
  COMMON_PARAMETERS,
} from "./parameter-definitions.js";

// Import API mappings for dynamic suggestions
import {
  GLIDE_SURFACE,
  IOREDIS_DATASET,
  NODE_REDIS_DATASET,
} from "../../../data/api/mappings.js";

export class AutoCompletionEngine {
  private static commandCache: Map<string, string[]> = new Map();
  private static categoryCache: Map<string, string[]> = new Map();
  private static patternCache: Map<string, string[]> = new Map();

  /**
   * Generate completion hints for a specific parameter
   */
  static async generateHints(
    parameterName: string,
    parameterDef: ParameterDefinition,
    context?: QueryContext,
    currentValue?: string,
    allParameters?: Record<string, any>,
  ): Promise<CompletionHint[]> {
    const hints: CompletionHint[] = [];

    // Get base hints from parameter definition
    if (parameterDef.autoComplete) {
      const baseHints = await this.getHintsFromRule(
        parameterDef.autoComplete,
        context,
        currentValue,
      );
      hints.push(...baseHints);
    }

    // Add contextual hints based on other parameters
    if (context && allParameters) {
      const contextualHints = await this.getContextualHints(
        parameterName,
        parameterDef,
        context,
        allParameters,
        currentValue,
      );
      hints.push(...contextualHints);
    }

    // Add fuzzy matching hints for partial inputs
    if (currentValue && currentValue.length > 0) {
      const fuzzyHints = this.getFuzzyMatchingHints(
        currentValue,
        hints,
        parameterDef,
      );
      hints.push(...fuzzyHints);
    }

    // Sort hints by relevance
    const sortedHints = this.sortHintsByRelevance(hints, context, currentValue);

    // Limit to top 10 most relevant hints
    return sortedHints.slice(0, 10);
  }

  /**
   * Get hints from auto-completion rule
   */
  private static async getHintsFromRule(
    rule: AutoCompletionRule,
    context?: QueryContext,
    currentValue?: string,
  ): Promise<CompletionHint[]> {
    let suggestions: string[] = [];

    switch (rule.source) {
      case "commands":
        suggestions = await this.getCommandSuggestions(context);
        break;

      case "categories":
        suggestions = await this.getCategorySuggestions();
        break;

      case "patterns":
        suggestions = await this.getPatternSuggestions(context);
        break;

      case "custom":
        suggestions = rule.staticSuggestions || [];
        break;

      case "dynamic":
        if (rule.dynamicResolver) {
          suggestions = await rule.dynamicResolver(
            context || this.createDefaultContext(),
          );
        }
        break;
    }

    // Filter suggestions based on current value
    if (currentValue && rule.filterPattern) {
      suggestions = suggestions.filter((s) => rule.filterPattern!.test(s));
    }

    return suggestions.map((suggestion) => ({
      value: suggestion,
      description: this.getDescriptionForSuggestion(suggestion, rule.source),
      category: rule.source,
      relevance: rule.priority || 1,
      contextual: rule.contextual || false,
    }));
  }

  /**
   * Get command suggestions from GLIDE API surface
   */
  private static async getCommandSuggestions(
    context?: QueryContext,
  ): Promise<string[]> {
    if (this.commandCache.has("all")) {
      return this.commandCache.get("all")!;
    }

    const commands: string[] = [];

    // Extract from GLIDE surface
    if (GLIDE_SURFACE && GLIDE_SURFACE.entries) {
      GLIDE_SURFACE.entries.forEach((entry) => {
        if ((entry as any).method) {
          commands.push((entry as any).method);
        }
      });
    }

    // Add common Redis commands
    const commonCommands = [
      "GET",
      "SET",
      "DEL",
      "EXISTS",
      "EXPIRE",
      "TTL",
      "HGET",
      "HSET",
      "HDEL",
      "HGETALL",
      "HKEYS",
      "LPUSH",
      "RPUSH",
      "LPOP",
      "RPOP",
      "LRANGE",
      "SADD",
      "SREM",
      "SMEMBERS",
      "SCARD",
      "ZADD",
      "ZREM",
      "ZRANGE",
      "ZRANK",
      "XADD",
      "XREAD",
      "XGROUP",
      "XLEN",
      "GEOADD",
      "GEODIST",
      "GEORADIUS",
    ];

    commands.push(...commonCommands);

    // Filter duplicates and cache
    const uniqueCommands = [...new Set(commands)];
    this.commandCache.set("all", uniqueCommands);

    // Filter by context if provided
    if (context?.domain) {
      return this.filterCommandsByDomain(uniqueCommands, context.domain);
    }

    return uniqueCommands;
  }

  /**
   * Get category suggestions
   */
  private static async getCategorySuggestions(): Promise<string[]> {
    if (this.categoryCache.has("all")) {
      return this.categoryCache.get("all")!;
    }

    const categories = [
      "strings",
      "hashes",
      "lists",
      "sets",
      "sortedsets",
      "streams",
      "geo",
      "pubsub",
      "transactions",
      "scripting",
      "bitmap",
      "hyperloglog",
      "json",
      "connection",
      "server",
    ];

    this.categoryCache.set("all", categories);
    return categories;
  }

  /**
   * Get pattern suggestions
   */
  private static async getPatternSuggestions(
    context?: QueryContext,
  ): Promise<string[]> {
    const cacheKey = context?.complexity || "all";

    if (this.patternCache.has(cacheKey)) {
      return this.patternCache.get(cacheKey)!;
    }

    const allPatterns = [
      "basic-client",
      "cluster-client",
      "caching",
      "streams",
      "distributed-lock",
      "rate-limiting",
      "pub-sub",
      "transactions",
      "session-store",
      "leaderboard",
      "real-time-analytics",
      "message-queue",
      "event-sourcing",
      "time-series",
    ];

    let filteredPatterns = allPatterns;

    // Filter by complexity
    if (context?.complexity === "simple") {
      filteredPatterns = ["basic-client", "caching", "session-store"];
    } else if (context?.complexity === "intermediate") {
      filteredPatterns = [
        "cluster-client",
        "streams",
        "pub-sub",
        "transactions",
        "leaderboard",
      ];
    } else if (context?.complexity === "advanced") {
      filteredPatterns = [
        "distributed-lock",
        "rate-limiting",
        "real-time-analytics",
        "message-queue",
        "event-sourcing",
      ];
    }

    this.patternCache.set(cacheKey, filteredPatterns);
    return filteredPatterns;
  }

  /**
   * Get contextual hints based on other parameters
   */
  private static async getContextualHints(
    parameterName: string,
    parameterDef: ParameterDefinition,
    context: QueryContext,
    allParameters: Record<string, any>,
    currentValue?: string,
  ): Promise<CompletionHint[]> {
    const hints: CompletionHint[] = [];

    // Context-specific logic for different parameters
    switch (parameterName) {
      case "symbol":
        if (allParameters.source) {
          const sourceHints = await this.getSymbolHintsForSource(
            allParameters.source,
          );
          hints.push(...sourceHints);
        }
        break;

      case "category":
        if (allParameters.query) {
          const categoryHints = this.getCategoryHintsForQuery(
            allParameters.query,
          );
          hints.push(...categoryHints);
        }
        break;

      case "pattern":
        if (context.domain) {
          const patternHints = this.getPatternHintsForDomain(context.domain);
          hints.push(...patternHints);
        }
        break;

      case "query":
        if (context.intent === "search" && allParameters.category) {
          const queryHints = await this.getQueryHintsForCategory(
            allParameters.category,
          );
          hints.push(...queryHints);
        }
        break;
    }

    return hints;
  }

  /**
   * Get symbol hints for specific source (ioredis/node-redis)
   */
  private static async getSymbolHintsForSource(
    source: string,
  ): Promise<CompletionHint[]> {
    const hints: CompletionHint[] = [];

    // Datasets expose 'symbol' (original API surface name) – earlier code referenced a non-existent 'original' property
    if (source === "ioredis" && IOREDIS_DATASET?.entries) {
      IOREDIS_DATASET.entries.forEach((entry) => {
        if (entry.symbol) {
          hints.push({
            value: entry.symbol,
            description: `ioredis method: ${entry.symbol}`,
            category: "ioredis-methods",
            relevance: 2,
            contextual: true,
          });
        }
      });
    } else if (source === "node-redis" && NODE_REDIS_DATASET?.entries) {
      NODE_REDIS_DATASET.entries.forEach((entry) => {
        if (entry.symbol) {
          hints.push({
            value: entry.symbol,
            description: `node-redis method: ${entry.symbol}`,
            category: "node-redis-methods",
            relevance: 2,
            contextual: true,
          });
        }
      });
    }

    return hints.slice(0, 5); // Limit to prevent overwhelming
  }

  /**
   * Get category hints based on query content
   */
  private static getCategoryHintsForQuery(query: string): CompletionHint[] {
    const hints: CompletionHint[] = [];
    const lowerQuery = query.toLowerCase();

    const categoryMappings = {
      streams: ["xread", "xadd", "stream", "event"],
      hashes: ["hget", "hset", "hash", "field"],
      lists: ["lpush", "rpush", "list", "queue"],
      sets: ["sadd", "srem", "set", "member"],
      geo: ["geo", "location", "radius", "distance"],
    };

    Object.entries(categoryMappings).forEach(([category, keywords]) => {
      const matches = keywords.filter((keyword) =>
        lowerQuery.includes(keyword),
      );
      if (matches.length > 0) {
        hints.push({
          value: category,
          description: `Category matching "${matches.join(", ")}" in your query`,
          category: "suggested-categories",
          relevance: matches.length + 1,
          contextual: true,
        });
      }
    });

    return hints;
  }

  /**
   * Get pattern hints for specific domain
   */
  private static getPatternHintsForDomain(domain: string): CompletionHint[] {
    const domainPatterns: Record<string, string[]> = {
      streams: ["streams", "event-sourcing", "real-time-analytics"],
      hashes: ["caching", "session-store"],
      lists: ["message-queue", "leaderboard"],
      geo: ["location-services"],
      sets: ["tag-system", "social-features"],
    };

    const patterns = domainPatterns[domain] || [];

    return patterns.map((pattern) => ({
      value: pattern,
      description: `Pattern optimized for ${domain} operations`,
      category: "domain-patterns",
      relevance: 3,
      contextual: true,
    }));
  }

  /**
   * Get query hints for specific category
   */
  private static async getQueryHintsForCategory(
    category: string,
  ): Promise<CompletionHint[]> {
    const categoryQueries: Record<string, string[]> = {
      strings: ["GET operations", "SET with expiry", "string manipulation"],
      hashes: ["field operations", "hash manipulation", "object storage"],
      streams: ["event processing", "consumer groups", "stream reading"],
      lists: ["queue operations", "stack operations", "list manipulation"],
      sets: ["set operations", "intersection", "union operations"],
    };

    const queries = categoryQueries[category] || [];

    return queries.map((query) => ({
      value: query,
      description: `Common query for ${category} category`,
      category: "category-queries",
      relevance: 2,
      contextual: true,
    }));
  }

  /**
   * Get fuzzy matching hints for partial input
   */
  private static getFuzzyMatchingHints(
    currentValue: string,
    existingHints: CompletionHint[],
    parameterDef: ParameterDefinition,
  ): CompletionHint[] {
    const lowerValue = currentValue.toLowerCase();
    const fuzzyHints: CompletionHint[] = [];

    // Check existing hints for partial matches
    existingHints.forEach((hint) => {
      if (
        hint.value.toLowerCase().includes(lowerValue) &&
        hint.value.toLowerCase() !== lowerValue
      ) {
        fuzzyHints.push({
          ...hint,
          relevance: hint.relevance + 1, // Boost relevance for partial matches
          description: `${hint.description} (matches "${currentValue}")`,
        });
      }
    });

    // Add examples from parameter definition if they match
    if (parameterDef.examples) {
      parameterDef.examples.forEach((example) => {
        if (
          example.toLowerCase().includes(lowerValue) &&
          example.toLowerCase() !== lowerValue
        ) {
          fuzzyHints.push({
            value: example,
            description: `Example value matching "${currentValue}"`,
            category: "examples",
            relevance: 2,
            contextual: true,
          });
        }
      });
    }

    return fuzzyHints;
  }

  /**
   * Sort hints by relevance and context
   */
  private static sortHintsByRelevance(
    hints: CompletionHint[],
    context?: QueryContext,
    currentValue?: string,
  ): CompletionHint[] {
    return hints.sort((a, b) => {
      // Primary sort: relevance score
      if (a.relevance !== b.relevance) {
        return b.relevance - a.relevance;
      }

      // Secondary sort: contextual hints first
      if (a.contextual !== b.contextual) {
        return a.contextual ? -1 : 1;
      }

      // Tertiary sort: exact prefix matches
      if (currentValue) {
        const aStartsWith = a.value
          .toLowerCase()
          .startsWith(currentValue.toLowerCase());
        const bStartsWith = b.value
          .toLowerCase()
          .startsWith(currentValue.toLowerCase());
        if (aStartsWith !== bStartsWith) {
          return aStartsWith ? -1 : 1;
        }
      }

      // Final sort: alphabetical
      return a.value.localeCompare(b.value);
    });
  }

  /**
   * Get description for suggestion based on source
   */
  private static getDescriptionForSuggestion(
    suggestion: string,
    source: string,
  ): string {
    switch (source) {
      case "commands":
        return `Redis/GLIDE command: ${suggestion}`;
      case "categories":
        return `Command category: ${suggestion}`;
      case "patterns":
        return `Code pattern: ${suggestion}`;
      case "custom":
        return `Option: ${suggestion}`;
      default:
        return suggestion;
    }
  }

  /**
   * Filter commands by domain
   */
  private static filterCommandsByDomain(
    commands: string[],
    domain: string,
  ): string[] {
    const domainCommands: Record<string, string[]> = {
      strings: ["GET", "SET", "DEL", "EXISTS", "INCR", "DECR"],
      hashes: ["HGET", "HSET", "HDEL", "HGETALL", "HKEYS"],
      lists: ["LPUSH", "RPUSH", "LPOP", "RPOP", "LRANGE"],
      sets: ["SADD", "SREM", "SMEMBERS", "SCARD"],
      streams: ["XADD", "XREAD", "XGROUP", "XLEN"],
      geo: ["GEOADD", "GEODIST", "GEORADIUS"],
    };

    const relevantCommands = domainCommands[domain] || [];
    return commands.filter((cmd) =>
      relevantCommands.some(
        (relevant) =>
          cmd.toUpperCase().includes(relevant) ||
          relevant.includes(cmd.toUpperCase()),
      ),
    );
  }

  /**
   * Create default context for when none is provided
   */
  private static createDefaultContext(): QueryContext {
    return {
      intent: "search",
      complexity: "intermediate",
      domain: "general",
      previousCommands: [],
      patterns: [],
    };
  }

  /**
   * Get intelligent suggestions for multi-parameter scenarios
   */
  static getParameterCombinationSuggestions(
    allParameters: Record<string, any>,
    context?: QueryContext,
  ): CompletionHint[] {
    const suggestions: CompletionHint[] = [];

    // Migration workflow suggestions
    if (allParameters.source && !allParameters.symbol) {
      suggestions.push({
        value: "symbol",
        description: "Specify a method name to find GLIDE equivalent",
        category: "workflow",
        relevance: 3,
        example: "get, hset, pipeline",
      });
    }

    // Generation workflow suggestions
    if (allParameters.pattern && !allParameters.includeTypeScript) {
      suggestions.push({
        value: "includeTypeScript",
        description: "Enable TypeScript for better type safety",
        category: "workflow",
        relevance: 2,
        example: "true",
      });
    }

    // Search workflow suggestions
    if (allParameters.query && !allParameters.category) {
      suggestions.push({
        value: "category",
        description: "Narrow search to specific command category",
        category: "workflow",
        relevance: 2,
        example: "strings, hashes, streams",
      });
    }

    return suggestions;
  }
}

// Export convenience functions
export const generateParameterHints = AutoCompletionEngine.generateHints;
export const getWorkflowSuggestions =
  AutoCompletionEngine.getParameterCombinationSuggestions;
