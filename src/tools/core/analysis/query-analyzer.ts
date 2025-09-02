/**
 * Enhanced Query Analysis Engine
 * Provides sophisticated analysis of user queries with intent detection, command recognition, and pattern matching
 */

import { QueryContext } from "../schema/parameter-definitions.js";

// Enhanced interfaces extending the base QueryContext
export interface EnhancedQueryContext extends QueryContext {
  // Query characteristics
  queryType:
    | "direct-command"
    | "conceptual"
    | "comparative"
    | "workflow"
    | "troubleshooting";
  confidence: number; // 0-1 confidence score for analysis

  // Detected entities
  detectedCommands: DetectedCommand[];
  detectedPatterns: DetectedPattern[];
  detectedConcepts: string[];

  // Contextual information
  userExperienceLevel: "beginner" | "intermediate" | "expert";
  preferredFormat: "minimal" | "detailed" | "tutorial";

  // Workflow context
  workflowStage:
    | "discovery"
    | "implementation"
    | "optimization"
    | "troubleshooting";
  relatedQueries: string[];
}

export interface DetectedCommand {
  name: string;
  confidence: number;
  source: "redis" | "ioredis" | "node-redis" | "glide";
  category: string;
  variants: string[];
}

export interface DetectedPattern {
  type: string;
  confidence: number;
  complexity: "simple" | "intermediate" | "advanced";
  relatedCommands: string[];
  useCases: string[];
}

export interface AnalysisResult {
  context: EnhancedQueryContext;
  recommendations: Recommendation[];
  nextActions: NextAction[];
  relatedTopics: string[];
}

export interface Recommendation {
  type: "tool" | "parameter" | "workflow" | "learning";
  priority: "high" | "medium" | "low";
  message: string;
  actionable: boolean;
}

export interface NextAction {
  action: string;
  description: string;
  parameters?: Record<string, any>;
  followUp?: string[];
}

export class QueryAnalyzer {
  private static intentPatterns: Map<string, RegExp[]> = new Map([
    [
      "search",
      [
        /\b(find|search|look|show|list|what|which)\b/i,
        /\b(command|method|function)\b.*\b(for|to)\b/i,
        /\b(how to|how do I)\b.*\b(find|get|retrieve)\b/i,
      ],
    ],
    [
      "migrate",
      [
        /\b(convert|migrate|transform|change)\b/i,
        /\b(from|to)\b.*(ioredis|node-redis|glide)/i,
        /\b(equivalent|alternative|replacement)\b/i,
        /\b(upgrade|port|switch)\b/i,
      ],
    ],
    [
      "generate",
      [
        /\b(generate|create|build|make)\b/i,
        /\b(code|example|pattern|template)\b/i,
        /\b(show me|give me)\b.*\b(example|code)\b/i,
      ],
    ],
    [
      "compare",
      [
        /\b(compare|difference|vs|versus|better)\b/i,
        /\b(performance|speed|efficiency)\b/i,
        /\b(which|what).*(faster|better|recommended)\b/i,
      ],
    ],
    [
      "help",
      [
        /\b(help|explain|understand|learn)\b/i,
        /\b(what is|how does)\b/i,
        /\b(documentation|docs|guide)\b/i,
      ],
    ],
  ]);

  private static commandPatterns: Map<string, RegExp[]> = new Map([
    ["GET", [/\bget\b/i, /\bretrieve\b/i, /\bfetch\b/i]],
    ["SET", [/\bset\b/i, /\bstore\b/i, /\bsave\b/i, /\bput\b/i]],
    ["HGET", [/\bhget\b/i, /\bhash.*get\b/i, /\bfield.*get\b/i]],
    ["HSET", [/\bhset\b/i, /\bhash.*set\b/i, /\bfield.*set\b/i]],
    ["XREAD", [/\bxread\b/i, /\bstream.*read\b/i, /\bevent.*read\b/i]],
    ["XADD", [/\bxadd\b/i, /\bstream.*add\b/i, /\bevent.*add\b/i]],
    ["LPUSH", [/\blpush\b/i, /\blist.*push\b/i, /\bqueue.*add\b/i]],
    ["SADD", [/\bsadd\b/i, /\bset.*add\b/i, /\bmember.*add\b/i]],
    ["ZADD", [/\bzadd\b/i, /\bsorted.*set.*add\b/i, /\brank.*add\b/i]],
  ]);

  private static patternKeywords: Map<string, string[]> = new Map([
    ["caching", ["cache", "caching", "ttl", "expir", "temporary", "session"]],
    [
      "streams",
      ["stream", "event", "consumer", "producer", "real-time", "log"],
    ],
    [
      "transactions",
      ["transaction", "atomic", "multi", "exec", "batch", "consistency"],
    ],
    ["locking", ["lock", "mutex", "semaphore", "distributed", "concurrency"]],
    ["clustering", ["cluster", "shard", "partition", "scale", "distributed"]],
    [
      "pubsub",
      ["publish", "subscribe", "message", "notification", "broadcast"],
    ],
    ["rate-limiting", ["rate", "limit", "throttle", "quota", "bucket"]],
    ["geo", ["geo", "location", "distance", "radius", "coordinate"]],
    ["search", ["search", "index", "query", "filter", "full-text"]],
  ]);

  /**
   * Main analysis entry point
   */
  static analyzeQuery(
    query: string,
    parameters?: Record<string, any>,
    previousContext?: QueryContext[],
  ): AnalysisResult {
    const context = this.buildQueryContext(query, parameters, previousContext);
    const recommendations = this.generateRecommendations(context, parameters);
    const nextActions = this.suggestNextActions(context, parameters);
    const relatedTopics = this.findRelatedTopics(context);

    return {
      context,
      recommendations,
      nextActions,
      relatedTopics,
    };
  }

  /**
   * Build comprehensive query context
   */
  private static buildQueryContext(
    query: string,
    parameters?: Record<string, any>,
    previousContext?: QueryContext[],
  ): EnhancedQueryContext {
    // Detect intent
    const intent = this.detectIntent(query);
    const confidence = this.calculateIntentConfidence(query, intent);

    // Analyze query characteristics
    const queryType = this.classifyQueryType(query);
    const complexity = this.assessComplexity(query, parameters);

    // Detect entities
    const detectedCommands = this.detectCommands(query);
    const detectedPatterns = this.detectPatterns(query);
    const detectedConcepts = this.extractConcepts(query);

    // Infer user characteristics
    const userExperienceLevel = this.inferExperienceLevel(query, parameters);
    const preferredFormat = this.inferPreferredFormat(query, parameters);

    // Determine workflow context
    const workflowStage = this.determineWorkflowStage(
      query,
      parameters,
      previousContext,
    );
    const domain = this.inferDomain(detectedCommands, detectedPatterns);

    return {
      // Base context
      intent,
      complexity,
      domain,
      previousCommands: this.extractPreviousCommands(previousContext),
      patterns: detectedPatterns.map((p) => p.type),

      // Enhanced context
      queryType,
      confidence,
      detectedCommands,
      detectedPatterns,
      detectedConcepts,
      userExperienceLevel,
      preferredFormat,
      workflowStage,
      relatedQueries: this.findRelatedQueries(query, previousContext),
    };
  }

  /**
   * Detect user intent from query
   */
  private static detectIntent(query: string): QueryContext["intent"] {
    let maxScore = 0;
    let detectedIntent: QueryContext["intent"] = "search";

    for (const [intent, patterns] of this.intentPatterns) {
      const score = patterns.reduce((acc, pattern) => {
        return acc + (pattern.test(query) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        detectedIntent = intent as QueryContext["intent"];
      }
    }

    return detectedIntent;
  }

  /**
   * Calculate confidence score for intent detection
   */
  private static calculateIntentConfidence(
    query: string,
    intent: QueryContext["intent"],
  ): number {
    const patterns = this.intentPatterns.get(intent) || [];
    const matches = patterns.filter((pattern) => pattern.test(query)).length;
    const totalPatterns = patterns.length;

    if (totalPatterns === 0) return 0.5; // Default confidence

    const baseConfidence = matches / totalPatterns;

    // Boost confidence for specific keywords
    const boostKeywords = {
      search: ["find", "search", "show", "list"],
      migrate: ["convert", "migrate", "equivalent"],
      generate: ["generate", "create", "example"],
      compare: ["compare", "vs", "better"],
      help: ["help", "explain", "how"],
    };

    const keywords = boostKeywords[intent] || [];
    const keywordBoost = keywords.some((keyword) =>
      query.toLowerCase().includes(keyword),
    )
      ? 0.2
      : 0;

    return Math.min(baseConfidence + keywordBoost, 1.0);
  }

  /**
   * Classify the type of query
   */
  private static classifyQueryType(
    query: string,
  ): EnhancedQueryContext["queryType"] {
    const lowerQuery = query.toLowerCase();

    // Direct command queries
    if (this.commandPatterns.size > 0) {
      for (const [command, patterns] of this.commandPatterns) {
        if (patterns.some((pattern) => pattern.test(query))) {
          return "direct-command";
        }
      }
    }

    // Comparative queries
    if (/\b(vs|versus|compare|better|difference)\b/i.test(query)) {
      return "comparative";
    }

    // Workflow queries
    if (/\b(step|process|workflow|how to)\b/i.test(query)) {
      return "workflow";
    }

    // Troubleshooting queries
    if (/\b(error|issue|problem|not working|fail)\b/i.test(query)) {
      return "troubleshooting";
    }

    // Default to conceptual
    return "conceptual";
  }

  /**
   * Detect commands mentioned in query
   */
  private static detectCommands(query: string): DetectedCommand[] {
    const commands: DetectedCommand[] = [];

    for (const [commandName, patterns] of this.commandPatterns) {
      const matches = patterns.filter((pattern) => pattern.test(query));
      if (matches.length > 0) {
        commands.push({
          name: commandName,
          confidence: matches.length / patterns.length,
          source: this.inferCommandSource(commandName, query),
          category: this.getCommandCategory(commandName),
          variants: this.getCommandVariants(commandName),
        });
      }
    }

    return commands.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Detect patterns mentioned in query
   */
  private static detectPatterns(query: string): DetectedPattern[] {
    const patterns: DetectedPattern[] = [];
    const lowerQuery = query.toLowerCase();

    for (const [patternType, keywords] of this.patternKeywords) {
      const matchingKeywords = keywords.filter((keyword) =>
        lowerQuery.includes(keyword.toLowerCase()),
      );

      if (matchingKeywords.length > 0) {
        patterns.push({
          type: patternType,
          confidence: matchingKeywords.length / keywords.length,
          complexity: this.getPatternComplexity(patternType),
          relatedCommands: this.getPatternCommands(patternType),
          useCases: this.getPatternUseCases(patternType),
        });
      }
    }

    return patterns.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Extract general concepts from query
   */
  private static extractConcepts(query: string): string[] {
    const concepts: string[] = [];
    const lowerQuery = query.toLowerCase();

    // Technical concepts
    const technicalConcepts = [
      "performance",
      "scalability",
      "consistency",
      "durability",
      "replication",
      "sharding",
      "partitioning",
      "indexing",
    ];

    technicalConcepts.forEach((concept) => {
      if (lowerQuery.includes(concept)) {
        concepts.push(concept);
      }
    });

    // Use case concepts
    const useCaseConcepts = [
      "analytics",
      "logging",
      "monitoring",
      "alerting",
      "authentication",
      "authorization",
      "session management",
    ];

    useCaseConcepts.forEach((concept) => {
      if (lowerQuery.includes(concept)) {
        concepts.push(concept);
      }
    });

    return concepts;
  }

  /**
   * Infer user experience level
   */
  private static inferExperienceLevel(
    query: string,
    parameters?: Record<string, any>,
  ): EnhancedQueryContext["userExperienceLevel"] {
    const lowerQuery = query.toLowerCase();

    // Beginner indicators
    if (/\b(how to|what is|explain|basic|simple|tutorial)\b/i.test(query)) {
      return "beginner";
    }

    // Expert indicators
    if (/\b(optimize|performance|advanced|complex|internals)\b/i.test(query)) {
      return "expert";
    }

    // Check parameter sophistication
    if (parameters) {
      const sophisticatedParams = [
        "complexity",
        "includeTests",
        "optimization",
      ];
      const hasSophisticatedParams = sophisticatedParams.some(
        (param) => parameters[param] !== undefined,
      );

      if (hasSophisticatedParams) {
        return "expert";
      }
    }

    return "intermediate"; // Default
  }

  /**
   * Infer preferred response format
   */
  private static inferPreferredFormat(
    query: string,
    parameters?: Record<string, any>,
  ): EnhancedQueryContext["preferredFormat"] {
    const lowerQuery = query.toLowerCase();

    // Minimal format indicators
    if (/\b(quick|short|brief|summary)\b/i.test(query)) {
      return "minimal";
    }

    // Tutorial format indicators
    if (/\b(tutorial|step by step|guide|explain|learn)\b/i.test(query)) {
      return "tutorial";
    }

    // Check parameters
    if (parameters?.format) {
      return parameters.format as EnhancedQueryContext["preferredFormat"];
    }

    return "detailed"; // Default
  }

  /**
   * Generate contextual recommendations
   */
  private static generateRecommendations(
    context: EnhancedQueryContext,
    parameters?: Record<string, any>,
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Intent-based recommendations
    switch (context.intent) {
      case "migrate":
        if (!parameters?.source) {
          recommendations.push({
            type: "parameter",
            priority: "high",
            message:
              "Specify source library (ioredis or node-redis) for better migration guidance",
            actionable: true,
          });
        }
        break;

      case "generate":
        if (!parameters?.pattern) {
          recommendations.push({
            type: "parameter",
            priority: "medium",
            message: "Specify a pattern for more targeted code generation",
            actionable: true,
          });
        }
        break;
    }

    // Experience level recommendations
    if (
      context.userExperienceLevel === "beginner" &&
      context.complexity === "advanced"
    ) {
      recommendations.push({
        type: "learning",
        priority: "medium",
        message:
          "Consider starting with simpler patterns before advanced implementations",
        actionable: true,
      });
    }

    // Tool recommendations based on detected patterns
    context.detectedPatterns.forEach((pattern) => {
      if (pattern.confidence > 0.7) {
        recommendations.push({
          type: "tool",
          priority: "high",
          message: `Use 'generate' tool with pattern '${pattern.type}' for implementation examples`,
          actionable: true,
        });
      }
    });

    return recommendations;
  }

  /**
   * Suggest next actions based on context
   */
  private static suggestNextActions(
    context: EnhancedQueryContext,
    parameters?: Record<string, any>,
  ): NextAction[] {
    const actions: NextAction[] = [];

    // Workflow-based actions
    switch (context.workflowStage) {
      case "discovery":
        actions.push({
          action: "explore-api",
          description: "Browse available commands by category",
          parameters: { category: context.domain },
          followUp: [
            "What specific operation do you need?",
            "Would you like examples?",
          ],
        });
        break;

      case "implementation":
        if (context.detectedPatterns.length > 0) {
          actions.push({
            action: "generate-code",
            description: `Generate ${context.detectedPatterns[0].type} pattern implementation`,
            parameters: {
              pattern: context.detectedPatterns[0].type,
              complexity: context.complexity,
            },
            followUp: ["Need tests?", "Want TypeScript version?"],
          });
        }
        break;
    }

    return actions;
  }

  /**
   * Find related topics
   */
  private static findRelatedTopics(context: EnhancedQueryContext): string[] {
    const topics: string[] = [];

    // Add topics based on detected commands
    context.detectedCommands.forEach((command) => {
      const category = command.category;
      if (category && !topics.includes(category)) {
        topics.push(category);
      }
    });

    // Add topics based on detected patterns
    context.detectedPatterns.forEach((pattern) => {
      pattern.useCases.forEach((useCase) => {
        if (!topics.includes(useCase)) {
          topics.push(useCase);
        }
      });
    });

    return topics.slice(0, 5); // Limit to top 5
  }

  // Helper methods
  private static inferCommandSource(
    commandName: string,
    query: string,
  ): DetectedCommand["source"] {
    if (/ioredis/i.test(query)) return "ioredis";
    if (/node-redis/i.test(query)) return "node-redis";
    if (/glide/i.test(query)) return "glide";
    return "redis"; // Default
  }

  private static getCommandCategory(commandName: string): string {
    const categories: Record<string, string> = {
      GET: "strings",
      SET: "strings",
      HGET: "hashes",
      HSET: "hashes",
      LPUSH: "lists",
      RPUSH: "lists",
      SADD: "sets",
      ZADD: "sortedsets",
      XREAD: "streams",
      XADD: "streams",
    };
    return categories[commandName] || "general";
  }

  private static getCommandVariants(commandName: string): string[] {
    const variants: Record<string, string[]> = {
      GET: ["MGET", "GETRANGE", "GETSET"],
      SET: ["MSET", "SETEX", "SETNX"],
      HGET: ["HMGET", "HGETALL"],
      HSET: ["HMSET", "HSETNX"],
    };
    return variants[commandName] || [];
  }

  private static getPatternComplexity(
    patternType: string,
  ): DetectedPattern["complexity"] {
    const complexityMap: Record<string, DetectedPattern["complexity"]> = {
      caching: "simple",
      streams: "intermediate",
      transactions: "intermediate",
      locking: "advanced",
      clustering: "advanced",
      "rate-limiting": "advanced",
    };
    return complexityMap[patternType] || "intermediate";
  }

  private static getPatternCommands(patternType: string): string[] {
    const commandMap: Record<string, string[]> = {
      caching: ["GET", "SET", "EXPIRE", "TTL"],
      streams: ["XADD", "XREAD", "XGROUP"],
      transactions: ["MULTI", "EXEC", "DISCARD"],
      locking: ["SET", "DEL", "EXPIRE"],
      pubsub: ["PUBLISH", "SUBSCRIBE"],
    };
    return commandMap[patternType] || [];
  }

  private static getPatternUseCases(patternType: string): string[] {
    const useCaseMap: Record<string, string[]> = {
      caching: ["session-storage", "api-caching", "temporary-data"],
      streams: ["event-processing", "real-time-analytics", "audit-logging"],
      locking: [
        "resource-coordination",
        "critical-sections",
        "mutual-exclusion",
      ],
      "rate-limiting": ["api-throttling", "user-quotas", "ddos-protection"],
    };
    return useCaseMap[patternType] || [];
  }

  private static assessComplexity(
    query: string,
    parameters?: Record<string, any>,
  ): QueryContext["complexity"] {
    // Check for complexity indicators in query
    if (/\b(simple|basic|easy|quick)\b/i.test(query)) return "simple";
    if (/\b(advanced|complex|sophisticated|optimize)\b/i.test(query))
      return "advanced";

    // Check parameters
    if (parameters?.complexity) return parameters.complexity;

    return "intermediate"; // Default
  }

  private static determineWorkflowStage(
    query: string,
    parameters?: Record<string, any>,
    previousContext?: QueryContext[],
  ): EnhancedQueryContext["workflowStage"] {
    if (/\b(find|search|explore|what|which)\b/i.test(query)) return "discovery";
    if (/\b(generate|create|implement|build)\b/i.test(query))
      return "implementation";
    if (/\b(optimize|improve|performance|better)\b/i.test(query))
      return "optimization";
    if (/\b(error|issue|problem|debug)\b/i.test(query))
      return "troubleshooting";

    return "discovery"; // Default
  }

  private static inferDomain(
    commands: DetectedCommand[],
    patterns: DetectedPattern[],
  ): QueryContext["domain"] {
    // Infer from commands
    if (commands.length > 0) {
      return commands[0].category as QueryContext["domain"];
    }

    // Infer from patterns
    const domainMapping: Record<string, QueryContext["domain"]> = {
      streams: "streams",
      caching: "strings",
      locking: "strings",
      geo: "geo",
    };

    if (patterns.length > 0) {
      const domain = domainMapping[patterns[0].type];
      if (domain) return domain;
    }

    return "general";
  }

  private static extractPreviousCommands(
    previousContext?: QueryContext[],
  ): string[] {
    if (!previousContext) return [];

    return previousContext
      .flatMap((ctx) => ctx.previousCommands || [])
      .slice(-5); // Keep last 5 commands
  }

  private static findRelatedQueries(
    query: string,
    previousContext?: QueryContext[],
  ): string[] {
    // Simple implementation - could be enhanced with ML
    const related: string[] = [];

    if (/\bmigrat/i.test(query)) {
      related.push("How to test migration?", "Performance comparison?");
    }

    if (/\bgenerat/i.test(query)) {
      related.push("Best practices?", "Add error handling?");
    }

    return related;
  }
}

// Export convenience function
export const analyzeQuery = QueryAnalyzer.analyzeQuery;
