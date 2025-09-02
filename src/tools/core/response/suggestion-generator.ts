/**
 * Smart Suggestion Generator
 * Provides intelligent command suggestions, related operations, and contextual recommendations
 */

import { EnhancedQueryContext } from "../analysis/query-analyzer.js";
import { RecognizedCommand } from "../analysis/command-recognizer.js";
import { DetectedPattern } from "../analysis/pattern-matcher.js";

export interface SmartSuggestion {
  type: "command" | "pattern" | "workflow" | "optimization" | "learning";
  title: string;
  description: string;
  relevanceScore: number;
  category: string;
  actionable: boolean;
  quickAction?: QuickAction;
  relatedCommands?: string[];
  useCases?: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface QuickAction {
  type: "generate" | "explore" | "migrate" | "validate";
  parameters: Record<string, any>;
  description: string;
}

export interface SuggestionContext {
  primaryCommand?: RecognizedCommand;
  detectedPatterns: DetectedPattern[];
  userGoals: string[];
  currentWorkflow: string[];
  missingElements: string[];
}

export interface WorkflowStep {
  step: number;
  action: string;
  description: string;
  commands: string[];
  expectedOutcome: string;
  nextSteps: string[];
}

export class SuggestionGenerator {
  private static commandRelationships: Map<string, string[]> = new Map();
  private static workflowTemplates: Map<string, WorkflowStep[]> = new Map();
  private static optimizationRules: Map<string, OptimizationRule[]> = new Map();

  static {
    this.initializeCommandRelationships();
    this.initializeWorkflowTemplates();
    this.initializeOptimizationRules();
  }

  /**
   * Initialize command relationship mappings
   */
  private static initializeCommandRelationships(): void {
    // String operations relationships
    this.commandRelationships.set("GET", [
      "SET",
      "MGET",
      "EXISTS",
      "DEL",
      "EXPIRE",
    ]);
    this.commandRelationships.set("SET", [
      "GET",
      "SETEX",
      "SETNX",
      "MSET",
      "EXPIRE",
    ]);
    this.commandRelationships.set("MGET", ["GET", "MSET", "EXISTS"]);
    this.commandRelationships.set("MSET", ["SET", "MGET"]);

    // Hash operations relationships
    this.commandRelationships.set("HSET", [
      "HGET",
      "HMSET",
      "HSETNX",
      "HDEL",
      "HEXISTS",
    ]);
    this.commandRelationships.set("HGET", [
      "HSET",
      "HMGET",
      "HGETALL",
      "HEXISTS",
    ]);
    this.commandRelationships.set("HMGET", ["HGET", "HMSET", "HGETALL"]);
    this.commandRelationships.set("HGETALL", [
      "HGET",
      "HMGET",
      "HKEYS",
      "HVALS",
    ]);

    // List operations relationships
    this.commandRelationships.set("LPUSH", [
      "LPOP",
      "RPUSH",
      "LLEN",
      "LRANGE",
      "LTRIM",
    ]);
    this.commandRelationships.set("RPUSH", [
      "RPOP",
      "LPUSH",
      "LLEN",
      "LRANGE",
      "LTRIM",
    ]);
    this.commandRelationships.set("LPOP", ["LPUSH", "BLPOP", "LLEN"]);
    this.commandRelationships.set("RPOP", ["RPUSH", "BRPOP", "LLEN"]);
    this.commandRelationships.set("LRANGE", [
      "LPUSH",
      "RPUSH",
      "LLEN",
      "LINDEX",
    ]);

    // Set operations relationships
    this.commandRelationships.set("SADD", [
      "SREM",
      "SMEMBERS",
      "SCARD",
      "SISMEMBER",
    ]);
    this.commandRelationships.set("SREM", ["SADD", "SMEMBERS", "SCARD"]);
    this.commandRelationships.set("SMEMBERS", [
      "SADD",
      "SCARD",
      "SINTER",
      "SUNION",
    ]);
    this.commandRelationships.set("SINTER", [
      "SADD",
      "SMEMBERS",
      "SUNION",
      "SDIFF",
    ]);

    // Sorted set relationships
    this.commandRelationships.set("ZADD", [
      "ZREM",
      "ZRANGE",
      "ZRANK",
      "ZSCORE",
      "ZCARD",
    ]);
    this.commandRelationships.set("ZRANGE", [
      "ZADD",
      "ZREVRANGE",
      "ZRANK",
      "ZCARD",
    ]);
    this.commandRelationships.set("ZRANK", [
      "ZADD",
      "ZRANGE",
      "ZSCORE",
      "ZREVRANK",
    ]);

    // Stream relationships
    this.commandRelationships.set("XADD", ["XREAD", "XLEN", "XTRIM", "XRANGE"]);
    this.commandRelationships.set("XREAD", [
      "XADD",
      "XREADGROUP",
      "XGROUP",
      "XRANGE",
    ]);
    this.commandRelationships.set("XREADGROUP", [
      "XREAD",
      "XGROUP",
      "XACK",
      "XADD",
    ]);

    // Pub/Sub relationships
    this.commandRelationships.set("PUBLISH", ["SUBSCRIBE", "PUBSUB"]);
    this.commandRelationships.set("SUBSCRIBE", [
      "PUBLISH",
      "UNSUBSCRIBE",
      "PSUBSCRIBE",
    ]);

    // Geo relationships
    this.commandRelationships.set("GEOADD", [
      "GEODIST",
      "GEORADIUS",
      "GEOPOS",
      "GEOHASH",
    ]);
    this.commandRelationships.set("GEORADIUS", [
      "GEOADD",
      "GEODIST",
      "GEORADIUSBYMEMBER",
    ]);

    // Transaction relationships
    this.commandRelationships.set("MULTI", [
      "EXEC",
      "DISCARD",
      "WATCH",
      "UNWATCH",
    ]);
    this.commandRelationships.set("EXEC", ["MULTI", "DISCARD"]);
    this.commandRelationships.set("WATCH", ["MULTI", "EXEC", "UNWATCH"]);
  }

  /**
   * Initialize workflow templates for common patterns
   */
  private static initializeWorkflowTemplates(): void {
    // Caching workflow
    this.workflowTemplates.set("caching", [
      {
        step: 1,
        action: "Check cache",
        description: "Look for existing cached value",
        commands: ["GET"],
        expectedOutcome: "Value found or cache miss",
        nextSteps: ["Return cached value", "Fetch from source"],
      },
      {
        step: 2,
        action: "Handle cache miss",
        description: "Fetch data from original source when cache is empty",
        commands: ["GET (from database/API)"],
        expectedOutcome: "Fresh data retrieved",
        nextSteps: ["Store in cache", "Return to client"],
      },
      {
        step: 3,
        action: "Update cache",
        description: "Store fresh data in cache with appropriate TTL",
        commands: ["SET", "SETEX"],
        expectedOutcome: "Data cached with expiration",
        nextSteps: ["Return data", "Monitor cache performance"],
      },
    ]);

    // Stream processing workflow
    this.workflowTemplates.set("streams", [
      {
        step: 1,
        action: "Create consumer group",
        description: "Set up consumer group for parallel processing",
        commands: ["XGROUP"],
        expectedOutcome: "Consumer group created",
        nextSteps: ["Add consumers", "Start reading"],
      },
      {
        step: 2,
        action: "Produce events",
        description: "Add events to the stream",
        commands: ["XADD"],
        expectedOutcome: "Events stored in stream",
        nextSteps: ["Process events", "Monitor stream length"],
      },
      {
        step: 3,
        action: "Consume events",
        description: "Read and process events from stream",
        commands: ["XREADGROUP"],
        expectedOutcome: "Events processed",
        nextSteps: ["Acknowledge processing", "Handle failures"],
      },
      {
        step: 4,
        action: "Acknowledge processing",
        description: "Mark events as successfully processed",
        commands: ["XACK"],
        expectedOutcome: "Events acknowledged",
        nextSteps: ["Continue processing", "Clean up old events"],
      },
    ]);

    // Leaderboard workflow
    this.workflowTemplates.set("leaderboard", [
      {
        step: 1,
        action: "Add scores",
        description: "Add or update user scores",
        commands: ["ZADD"],
        expectedOutcome: "Scores updated in leaderboard",
        nextSteps: ["Query rankings", "Update UI"],
      },
      {
        step: 2,
        action: "Get top scores",
        description: "Retrieve top performers",
        commands: ["ZREVRANGE"],
        expectedOutcome: "Top scores retrieved",
        nextSteps: ["Display leaderboard", "Get user rank"],
      },
      {
        step: 3,
        action: "Get user rank",
        description: "Find specific user position",
        commands: ["ZREVRANK"],
        expectedOutcome: "User rank determined",
        nextSteps: ["Show user position", "Get surrounding players"],
      },
    ]);

    // Session management workflow
    this.workflowTemplates.set("session-store", [
      {
        step: 1,
        action: "Create session",
        description: "Store session data on login",
        commands: ["HSET", "EXPIRE"],
        expectedOutcome: "Session created with TTL",
        nextSteps: ["Return session token", "Track activity"],
      },
      {
        step: 2,
        action: "Validate session",
        description: "Check if session is valid and active",
        commands: ["HGETALL", "TTL"],
        expectedOutcome: "Session validity confirmed",
        nextSteps: ["Allow access", "Refresh session"],
      },
      {
        step: 3,
        action: "Update session",
        description: "Refresh session data and extend TTL",
        commands: ["HSET", "EXPIRE"],
        expectedOutcome: "Session refreshed",
        nextSteps: ["Continue session", "Log activity"],
      },
    ]);
  }

  /**
   * Initialize optimization rules
   */
  private static initializeOptimizationRules(): void {
    this.optimizationRules.set("strings", [
      {
        pattern: /GET.*SET/,
        suggestion: "Consider using MGET/MSET for bulk operations",
        impact: "high",
        category: "performance",
      },
      {
        pattern: /SET.*without.*TTL/,
        suggestion: "Add expiration times to prevent memory leaks",
        impact: "medium",
        category: "memory",
      },
    ]);

    this.optimizationRules.set("hashes", [
      {
        pattern: /HGET.*multiple/,
        suggestion: "Use HMGET for retrieving multiple fields",
        impact: "medium",
        category: "performance",
      },
      {
        pattern: /HSET.*loop/,
        suggestion: "Use HMSET for setting multiple fields at once",
        impact: "high",
        category: "performance",
      },
    ]);

    this.optimizationRules.set("lists", [
      {
        pattern: /LPUSH.*LPOP.*same/,
        suggestion: "Consider using blocking operations (BLPOP) for queues",
        impact: "medium",
        category: "efficiency",
      },
    ]);

    this.optimizationRules.set("streams", [
      {
        pattern: /XREAD.*without.*consumer.*group/,
        suggestion: "Use consumer groups for scalable stream processing",
        impact: "high",
        category: "scalability",
      },
    ]);
  }

  /**
   * Generate smart suggestions based on context
   */
  static generateSuggestions(
    context: EnhancedQueryContext,
    recognizedCommands: RecognizedCommand[],
    detectedPatterns: DetectedPattern[],
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    // Generate command-based suggestions
    if (recognizedCommands.length > 0) {
      suggestions.push(
        ...this.generateCommandSuggestions(recognizedCommands, context),
      );
    }

    // Generate pattern-based suggestions
    if (detectedPatterns.length > 0) {
      suggestions.push(
        ...this.generatePatternSuggestions(detectedPatterns, context),
      );
    }

    // Generate workflow suggestions
    suggestions.push(
      ...this.generateWorkflowSuggestions(
        context,
        recognizedCommands,
        detectedPatterns,
      ),
    );

    // Generate learning suggestions
    suggestions.push(...this.generateLearningSuggestions(context));

    // Generate optimization suggestions
    suggestions.push(
      ...this.generateOptimizationSuggestions(context, recognizedCommands),
    );

    // Sort by relevance and filter
    return this.rankAndFilterSuggestions(suggestions, context);
  }

  /**
   * Generate command-based suggestions
   */
  private static generateCommandSuggestions(
    commands: RecognizedCommand[],
    context: EnhancedQueryContext,
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    for (const command of commands.slice(0, 2)) {
      // Process top 2 commands
      const relatedCommands = this.commandRelationships.get(command.name) || [];

      for (const relatedCommand of relatedCommands.slice(0, 3)) {
        suggestions.push({
          type: "command",
          title: `Explore ${relatedCommand}`,
          description: `${relatedCommand} is commonly used with ${command.name} for ${this.getCommandPurpose(relatedCommand)}`,
          relevanceScore: this.calculateCommandRelevance(
            command.name,
            relatedCommand,
            context,
          ),
          category: command.category,
          actionable: true,
          quickAction: {
            type: "explore",
            parameters: { command: relatedCommand },
            description: `Get details about ${relatedCommand} command`,
          },
          relatedCommands: [command.name],
          useCases: this.getCommandUseCases(relatedCommand),
          difficulty: this.getCommandDifficulty(relatedCommand),
        });
      }

      // Suggest examples for the primary command
      suggestions.push({
        type: "command",
        title: `See ${command.name} Examples`,
        description: `Get practical examples of ${command.name} usage in different scenarios`,
        relevanceScore: 0.8,
        category: command.category,
        actionable: true,
        quickAction: {
          type: "generate",
          parameters: { command: command.name, type: "examples" },
          description: `Generate code examples for ${command.name}`,
        },
        difficulty: "beginner",
      });
    }

    return suggestions;
  }

  /**
   * Generate pattern-based suggestions
   */
  private static generatePatternSuggestions(
    patterns: DetectedPattern[],
    context: EnhancedQueryContext,
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    for (const pattern of patterns.slice(0, 2)) {
      // Suggest implementation
      suggestions.push({
        type: "pattern",
        title: `Implement ${pattern.type} Pattern`,
        description: `Generate a complete implementation of the ${pattern.type} pattern with best practices`,
        relevanceScore: pattern.confidence * 0.9,
        category: "implementation",
        actionable: true,
        quickAction: {
          type: "generate",
          parameters: { pattern: pattern.type, complexity: pattern.complexity },
          description: `Generate ${pattern.type} implementation`,
        },
        relatedCommands: pattern.relatedCommands,
        useCases: pattern.useCases,
        difficulty:
          pattern.complexity === "simple"
            ? "beginner"
            : pattern.complexity === "intermediate"
              ? "intermediate"
              : "advanced",
      });

      // Suggest related patterns
      const relatedPatterns = this.getRelatedPatterns(pattern.type);
      for (const relatedPattern of relatedPatterns.slice(0, 2)) {
        suggestions.push({
          type: "pattern",
          title: `Consider ${relatedPattern} Pattern`,
          description: `${relatedPattern} pattern complements ${pattern.type} for enhanced functionality`,
          relevanceScore: 0.6,
          category: "architecture",
          actionable: true,
          quickAction: {
            type: "explore",
            parameters: { pattern: relatedPattern },
            description: `Learn about ${relatedPattern} pattern`,
          },
          difficulty: "intermediate",
        });
      }
    }

    return suggestions;
  }

  /**
   * Generate workflow suggestions
   */
  private static generateWorkflowSuggestions(
    context: EnhancedQueryContext,
    commands: RecognizedCommand[],
    patterns: DetectedPattern[],
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    // Suggest workflows based on detected patterns
    for (const pattern of patterns) {
      const workflow = this.workflowTemplates.get(pattern.type);
      if (workflow) {
        suggestions.push({
          type: "workflow",
          title: `${pattern.type} Workflow Guide`,
          description: `Step-by-step guide for implementing ${pattern.type} pattern`,
          relevanceScore: 0.7,
          category: "workflow",
          actionable: true,
          quickAction: {
            type: "generate",
            parameters: { workflow: pattern.type, steps: true },
            description: `Generate complete workflow for ${pattern.type}`,
          },
          difficulty:
            pattern.complexity === "simple" ? "beginner" : "intermediate",
        });
      }
    }

    // Suggest next steps based on current context
    if (context.workflowStage === "discovery") {
      suggestions.push({
        type: "workflow",
        title: "Start Implementation",
        description: "Move from exploration to actual code implementation",
        relevanceScore: 0.6,
        category: "progression",
        actionable: true,
        quickAction: {
          type: "generate",
          parameters: { intent: "implementation" },
          description: "Generate starter implementation code",
        },
        difficulty: "beginner",
      });
    }

    return suggestions;
  }

  /**
   * Generate learning suggestions
   */
  private static generateLearningSuggestions(
    context: EnhancedQueryContext,
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    // Suggest progression based on experience level
    if (context.userExperienceLevel === "beginner") {
      suggestions.push({
        type: "learning",
        title: "Redis Fundamentals",
        description: "Learn the basic Redis data types and operations",
        relevanceScore: 0.5,
        category: "education",
        actionable: true,
        quickAction: {
          type: "explore",
          parameters: { topic: "fundamentals" },
          description: "Browse fundamental concepts",
        },
        difficulty: "beginner",
      });
    } else if (context.userExperienceLevel === "intermediate") {
      suggestions.push({
        type: "learning",
        title: "Advanced Patterns",
        description: "Explore advanced Redis patterns and architectures",
        relevanceScore: 0.4,
        category: "education",
        actionable: true,
        quickAction: {
          type: "explore",
          parameters: { topic: "advanced-patterns" },
          description: "Learn advanced implementation patterns",
        },
        difficulty: "advanced",
      });
    }

    // Suggest based on missing knowledge
    if (context.intent === "generate" && !context.detectedPatterns.length) {
      suggestions.push({
        type: "learning",
        title: "Common Use Case Patterns",
        description: "Discover common Redis usage patterns for your use case",
        relevanceScore: 0.6,
        category: "patterns",
        actionable: true,
        quickAction: {
          type: "explore",
          parameters: { category: "patterns" },
          description: "Browse common patterns",
        },
        difficulty: "intermediate",
      });
    }

    return suggestions;
  }

  /**
   * Generate optimization suggestions
   */
  private static generateOptimizationSuggestions(
    context: EnhancedQueryContext,
    commands: RecognizedCommand[],
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    // Check for optimization opportunities
    for (const command of commands) {
      const rules = this.optimizationRules.get(command.category) || [];

      for (const rule of rules) {
        suggestions.push({
          type: "optimization",
          title: `Optimize ${command.name} Usage`,
          description: rule.suggestion,
          relevanceScore:
            rule.impact === "high" ? 0.8 : rule.impact === "medium" ? 0.6 : 0.4,
          category: rule.category,
          actionable: true,
          quickAction: {
            type: "generate",
            parameters: { optimization: rule.category, command: command.name },
            description: `Show optimized implementation`,
          },
          difficulty: "intermediate",
        });
      }
    }

    // General performance suggestions
    if (context.userExperienceLevel !== "beginner") {
      suggestions.push({
        type: "optimization",
        title: "Performance Best Practices",
        description: "Learn Redis performance optimization techniques",
        relevanceScore: 0.3,
        category: "performance",
        actionable: true,
        quickAction: {
          type: "explore",
          parameters: { topic: "performance" },
          description: "View performance guidelines",
        },
        difficulty: "advanced",
      });
    }

    return suggestions;
  }

  /**
   * Rank and filter suggestions by relevance
   */
  private static rankAndFilterSuggestions(
    suggestions: SmartSuggestion[],
    context: EnhancedQueryContext,
  ): SmartSuggestion[] {
    return suggestions
      .filter((suggestion) => this.shouldIncludeSuggestion(suggestion, context))
      .sort((a, b) => {
        // Primary sort: relevance score
        if (a.relevanceScore !== b.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }

        // Secondary sort: actionable suggestions first
        if (a.actionable !== b.actionable) {
          return a.actionable ? -1 : 1;
        }

        // Tertiary sort: match user difficulty
        const userDifficultyScore = (suggestion: SmartSuggestion) => {
          const difficultyMatch = {
            beginner: { beginner: 3, intermediate: 1, advanced: 0 },
            intermediate: { beginner: 2, intermediate: 3, advanced: 2 },
            expert: { beginner: 1, intermediate: 2, advanced: 3 },
          };
          return (
            difficultyMatch[context.userExperienceLevel]?.[
              suggestion.difficulty
            ] || 1
          );
        };

        return userDifficultyScore(b) - userDifficultyScore(a);
      })
      .slice(0, 8); // Limit to top 8 suggestions
  }

  /**
   * Determine if suggestion should be included
   */
  private static shouldIncludeSuggestion(
    suggestion: SmartSuggestion,
    context: EnhancedQueryContext,
  ): boolean {
    // Filter by minimum relevance
    if (suggestion.relevanceScore < 0.3) return false;

    // Filter by user experience level
    if (
      context.userExperienceLevel === "beginner" &&
      suggestion.difficulty === "advanced"
    ) {
      return false;
    }

    // Filter duplicates by title
    // (This would be handled by the calling function to track seen titles)

    return true;
  }

  /**
   * Helper methods
   */
  private static calculateCommandRelevance(
    primaryCommand: string,
    relatedCommand: string,
    context: EnhancedQueryContext,
  ): number {
    let score = 0.5; // Base relevance

    // Boost for same category
    const primaryCategory = this.getCommandCategory(primaryCommand);
    const relatedCategory = this.getCommandCategory(relatedCommand);
    if (primaryCategory === relatedCategory) {
      score += 0.2;
    }

    // Boost for complementary operations
    const complementaryPairs = [
      ["GET", "SET"],
      ["LPUSH", "LPOP"],
      ["ZADD", "ZRANGE"],
      ["HSET", "HGET"],
      ["SADD", "SMEMBERS"],
    ];

    for (const [cmd1, cmd2] of complementaryPairs) {
      if (
        (primaryCommand === cmd1 && relatedCommand === cmd2) ||
        (primaryCommand === cmd2 && relatedCommand === cmd1)
      ) {
        score += 0.3;
        break;
      }
    }

    return Math.min(score, 1.0);
  }

  private static getCommandPurpose(command: string): string {
    const purposes: Record<string, string> = {
      GET: "retrieving values",
      SET: "storing data",
      HGET: "accessing hash fields",
      HSET: "updating hash fields",
      LPUSH: "adding to lists",
      LPOP: "processing queues",
      ZADD: "maintaining rankings",
      ZRANGE: "querying sorted data",
    };
    return purposes[command] || "data operations";
  }

  private static getCommandUseCases(command: string): string[] {
    const useCases: Record<string, string[]> = {
      SET: ["caching", "session storage", "configuration"],
      GET: ["cache lookup", "data retrieval", "session validation"],
      HSET: ["object storage", "user profiles", "metadata"],
      LPUSH: ["task queues", "activity feeds", "message queues"],
      ZADD: ["leaderboards", "priority queues", "time-based sorting"],
    };
    return useCases[command] || ["general operations"];
  }

  private static getCommandDifficulty(
    command: string,
  ): "beginner" | "intermediate" | "advanced" {
    const difficulties: Record<
      string,
      "beginner" | "intermediate" | "advanced"
    > = {
      GET: "beginner",
      SET: "beginner",
      HGET: "beginner",
      HSET: "beginner",
      LPUSH: "beginner",
      XREAD: "intermediate",
      XADD: "intermediate",
      ZADD: "intermediate",
      GEORADIUS: "advanced",
      EVAL: "advanced",
    };
    return difficulties[command] || "intermediate";
  }

  private static getCommandCategory(command: string): string {
    const categories: Record<string, string> = {
      GET: "strings",
      SET: "strings",
      HGET: "hashes",
      HSET: "hashes",
      LPUSH: "lists",
      LPOP: "lists",
      SADD: "sets",
      SMEMBERS: "sets",
      ZADD: "sortedsets",
      ZRANGE: "sortedsets",
      XADD: "streams",
      XREAD: "streams",
    };
    return categories[command] || "general";
  }

  private static getRelatedPatterns(patternType: string): string[] {
    const relationships: Record<string, string[]> = {
      caching: ["session-store", "rate-limiting"],
      streams: ["pubsub", "leaderboard"],
      locking: ["rate-limiting", "transactions"],
      leaderboard: ["streams", "caching"],
      "session-store": ["caching", "locking"],
    };
    return relationships[patternType] || [];
  }

  /**
   * Get workflow template for pattern
   */
  static getWorkflowTemplate(patternType: string): WorkflowStep[] | undefined {
    return this.workflowTemplates.get(patternType);
  }

  /**
   * Get command relationships
   */
  static getRelatedCommands(command: string): string[] {
    return this.commandRelationships.get(command) || [];
  }
}

interface OptimizationRule {
  pattern: RegExp;
  suggestion: string;
  impact: "low" | "medium" | "high";
  category: string;
}

// Export convenience functions
export const generateSuggestions = SuggestionGenerator.generateSuggestions;
export const getWorkflowTemplate = SuggestionGenerator.getWorkflowTemplate;
export const getRelatedCommands = SuggestionGenerator.getRelatedCommands;
