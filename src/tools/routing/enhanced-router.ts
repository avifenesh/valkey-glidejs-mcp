/**
 * Enhanced Context-Aware Router
 *
 * Advanced routing system that analyzes request context and automatically
 * selects the most appropriate tool implementation based on:
 * - User intent classification
 * - Parameter complexity analysis
 * - Pattern detection in code/requests
 * - Performance optimization hints
 * - Client capability awareness
 */

import { ContextAnalyzer, ToolRoutingContext } from "./context-analyzer.js";
import { SmartTool } from "./tool-router.js";

export interface RoutingDecision {
  selectedTool: SmartTool;
  confidence: number;
  reasoning: string[];
  alternatives: SmartTool[];
  context: ToolRoutingContext;
}

export interface PerformanceHints {
  cacheResults: boolean;
  estimatedComplexity: "low" | "medium" | "high";
  expectedResponseTime: number; // milliseconds
  resourceIntensive: boolean;
}

export class EnhancedRouter {
  private tools: Map<string, SmartTool> = new Map();
  private routingHistory: Map<string, RoutingDecision> = new Map();
  private performanceMetrics: Map<string, number> = new Map();

  /**
   * Register a smart tool with enhanced routing capabilities
   */
  registerTool(tool: SmartTool & { performanceHints?: PerformanceHints }) {
    this.tools.set(tool.name, tool);
  }

  /**
   * Enhanced routing with detailed decision analysis
   */
  async routeWithAnalysis(
    toolName: string,
    args: any,
    userContext?: Partial<ToolRoutingContext>,
  ): Promise<RoutingDecision> {
    // Analyze context with enhanced intelligence
    const context = this.enhancedContextAnalysis(toolName, args, userContext);

    // Find suitable tools with scoring
    const candidates = this.scoreCandidates(context);

    if (candidates.length === 0) {
      throw new Error(
        `No suitable tools found for context: ${JSON.stringify(context)}`,
      );
    }

    // Select best candidate
    const selectedTool = candidates[0].tool;
    const confidence = candidates[0].score;

    // Generate reasoning
    const reasoning = this.generateReasoning(context, candidates);

    // Get alternatives
    const alternatives = candidates.slice(1, 4).map((c) => c.tool);

    const decision: RoutingDecision = {
      selectedTool,
      confidence,
      reasoning,
      alternatives,
      context,
    };

    // Cache decision for learning
    const cacheKey = this.generateCacheKey(toolName, args);
    this.routingHistory.set(cacheKey, decision);

    return decision;
  }

  /**
   * Execute routing decision with performance tracking
   */
  async executeDecision(decision: RoutingDecision, args: any): Promise<any> {
    const startTime = Date.now();

    try {
      const result = await decision.selectedTool.execute(
        args,
        decision.context,
      );

      // Track performance
      const executionTime = Date.now() - startTime;
      this.recordPerformance(decision.selectedTool.name, executionTime);

      return result;
    } catch (error) {
      // Track errors and try alternatives if available
      console.error(`Tool ${decision.selectedTool.name} failed:`, error);

      if (decision.alternatives.length > 0) {
        console.error(
          `Trying alternative tool: ${decision.alternatives[0].name}`,
        );
        return decision.alternatives[0].execute(args, decision.context);
      }

      throw error;
    }
  }

  /**
   * Enhanced context analysis with machine learning insights
   */
  private enhancedContextAnalysis(
    toolName: string,
    args: any,
    userContext?: Partial<ToolRoutingContext>,
  ): ToolRoutingContext {
    // Start with basic analysis
    const baseContext = ContextAnalyzer.analyzeContext(toolName, args);

    // Enhance with user context
    const context = { ...baseContext, ...userContext };

    // Apply learning from routing history
    const historicalInsights = this.getHistoricalInsights(toolName, args);

    // Enhance complexity assessment
    context.complexity = this.enhanceComplexityAssessment(
      context,
      historicalInsights,
    );

    // Enhance pattern detection
    context.patterns = this.enhancePatternDetection(context, args);

    // Add performance considerations
    if (this.isPerformanceCritical(context)) {
      context.clientCapabilities = "enhanced";
    }

    return context;
  }

  /**
   * Score candidate tools based on context fit
   */
  private scoreCandidates(
    context: ToolRoutingContext,
  ): Array<{ tool: SmartTool; score: number }> {
    const candidates: Array<{ tool: SmartTool; score: number }> = [];

    for (const tool of this.tools.values()) {
      if (!tool.supports(context)) continue;

      let score = 0;

      // Base compatibility score
      score += tool.supports(context) ? 50 : 0;

      // Complexity match score
      score += this.getComplexityMatchScore(tool, context.complexity);

      // Capability match score
      score += this.getCapabilityMatchScore(tool, context);

      // Pattern match score
      score += this.getPatternMatchScore(tool, context.patterns);

      // Performance score
      score += this.getPerformanceScore(tool);

      // Historical success score
      score += this.getHistoricalSuccessScore(tool.name);

      candidates.push({ tool, score });
    }

    // Sort by score descending
    return candidates.sort((a, b) => b.score - a.score);
  }

  /**
   * Generate human-readable reasoning for tool selection
   */
  private generateReasoning(
    context: ToolRoutingContext,
    candidates: Array<{ tool: SmartTool; score: number }>,
  ): string[] {
    const reasoning: string[] = [];
    const selected = candidates[0];

    reasoning.push(`Selected ${selected.tool.name} based on context analysis`);
    reasoning.push(`User intent: ${context.userIntent}`);
    reasoning.push(`Task complexity: ${context.complexity}`);
    reasoning.push(`Task type: ${context.taskType}`);

    if (context.patterns.length > 0) {
      reasoning.push(`Detected patterns: ${context.patterns.join(", ")}`);
    }

    if (selected.score > 80) {
      reasoning.push("High confidence match (>80%)");
    } else if (selected.score > 60) {
      reasoning.push("Good match (60-80%)");
    } else {
      reasoning.push("Best available option (<60%)");
    }

    // Add performance reasoning
    const avgPerformance = this.performanceMetrics.get(selected.tool.name) || 0;
    if (avgPerformance > 0) {
      reasoning.push(`Average response time: ${avgPerformance}ms`);
    }

    return reasoning;
  }

  /**
   * Enhanced complexity assessment with learning
   */
  private enhanceComplexityAssessment(
    context: ToolRoutingContext,
    insights: any,
  ): ToolRoutingContext["complexity"] {
    let complexity = context.complexity;

    // Upgrade complexity based on insights
    if (insights.frequentlyComplex && complexity === "simple") {
      complexity = "intermediate";
    }

    // Downgrade if historically simple
    if (insights.frequentlySimple && complexity === "advanced") {
      complexity = "intermediate";
    }

    return complexity;
  }

  /**
   * Enhanced pattern detection with code analysis
   */
  private enhancePatternDetection(
    context: ToolRoutingContext,
    args: any,
  ): string[] {
    let patterns = [...context.patterns];

    if (args.code) {
      const code = args.code.toLowerCase();

      // Advanced pattern detection
      if (code.includes("distributed") || code.includes("cluster")) {
        patterns.push("distributed");
      }
      if (code.includes("async") && code.includes("await")) {
        patterns.push("async-patterns");
      }
      if (
        code.includes("error") ||
        code.includes("try") ||
        code.includes("catch")
      ) {
        patterns.push("error-handling");
      }
      if (code.includes("pool") || code.includes("connection")) {
        patterns.push("connection-management");
      }
      if (code.includes("validate") || code.includes("schema")) {
        patterns.push("validation");
      }
    }

    // Remove duplicates
    return [...new Set(patterns)];
  }

  /**
   * Check if request is performance critical
   */
  private isPerformanceCritical(context: ToolRoutingContext): boolean {
    return (
      context.complexity === "advanced" ||
      context.patterns.includes("cluster") ||
      context.patterns.includes("performance")
    );
  }

  /**
   * Get complexity match score for a tool
   */
  private getComplexityMatchScore(tool: SmartTool, complexity: string): number {
    switch (complexity) {
      case "simple":
        return tool.complexity <= 2 ? 20 : 5;
      case "intermediate":
        return tool.complexity >= 2 && tool.complexity <= 4 ? 20 : 10;
      case "advanced":
        return tool.complexity >= 4 ? 20 : 5;
      default:
        return 10;
    }
  }

  /**
   * Get capability match score
   */
  private getCapabilityMatchScore(
    tool: SmartTool,
    context: ToolRoutingContext,
  ): number {
    const relevantCapabilities = tool.capabilities.filter(
      (cap) =>
        context.taskType.includes(cap) ||
        context.userIntent.includes(cap) ||
        context.patterns.some((pattern) => cap.includes(pattern)),
    );

    return Math.min(relevantCapabilities.length * 5, 20);
  }

  /**
   * Get pattern match score
   */
  private getPatternMatchScore(tool: SmartTool, patterns: string[]): number {
    const matchingPatterns = tool.capabilities.filter((cap) =>
      patterns.some(
        (pattern) => cap.includes(pattern) || pattern.includes(cap),
      ),
    );

    return Math.min(matchingPatterns.length * 3, 15);
  }

  /**
   * Get performance score based on historical data
   */
  private getPerformanceScore(tool: SmartTool): number {
    const avgTime = this.performanceMetrics.get(tool.name) || 1000;

    // Better performance = higher score
    if (avgTime < 100) return 15;
    if (avgTime < 500) return 10;
    if (avgTime < 1000) return 5;
    return 0;
  }

  /**
   * Get historical success score
   */
  private getHistoricalSuccessScore(toolName: string): number {
    // This would be enhanced with actual success/failure tracking
    return 5; // Base score for now
  }

  /**
   * Get historical insights for better routing
   */
  private getHistoricalInsights(toolName: string, args: any): any {
    // This would analyze routing history for patterns
    return {
      frequentlyComplex: false,
      frequentlySimple: false,
      commonPatterns: [],
    };
  }

  /**
   * Record performance metrics
   */
  private recordPerformance(toolName: string, executionTime: number) {
    const current = this.performanceMetrics.get(toolName) || 0;
    const newAverage =
      current === 0 ? executionTime : (current + executionTime) / 2;
    this.performanceMetrics.set(toolName, newAverage);
  }

  /**
   * Generate cache key for routing decisions
   */
  private generateCacheKey(toolName: string, args: any): string {
    const argsHash = JSON.stringify(args).slice(0, 100);
    return `${toolName}:${argsHash}`;
  }

  /**
   * Get routing statistics
   */
  getRoutingStats(): any {
    return {
      totalDecisions: this.routingHistory.size,
      averagePerformance:
        Array.from(this.performanceMetrics.values()).reduce(
          (a, b) => a + b,
          0,
        ) / this.performanceMetrics.size || 0,
      toolUsage: Array.from(this.performanceMetrics.entries()).map(
        ([name, time]) => ({ name, avgTime: time }),
      ),
    };
  }
}

/**
 * Global enhanced router instance
 */
export const enhancedRouter = new EnhancedRouter();
