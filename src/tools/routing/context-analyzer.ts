/**
 * Context Analyzer - Analyzes user requests to determine intent and routing
 */

export interface ToolRoutingContext {
  userIntent:
    | "migration"
    | "generation"
    | "exploration"
    | "system"
    | "development";
  complexity: "simple" | "intermediate" | "advanced";
  clientCapabilities: "basic" | "enhanced" | "full";
  taskType: "lookup" | "transform" | "create" | "validate";
  hasParameters: boolean;
  patterns: string[];
}

export class ContextAnalyzer {
  /**
   * Analyze request arguments and classify user intent
   */
  static analyzeContext(toolName: string, args: any): ToolRoutingContext {
    const hasParameters = args && Object.keys(args).length > 0;

    // Determine intent from tool name and arguments
    const userIntent = this.classifyIntent(toolName, args);
    const complexity = this.assessComplexity(toolName, args);
    const taskType = this.determineTaskType(toolName, args);
    const patterns = this.detectPatterns(args);

    return {
      userIntent,
      complexity,
      clientCapabilities: "full", // Default to full capabilities
      taskType,
      hasParameters,
      patterns,
    };
  }

  private static classifyIntent(
    toolName: string,
    args: any,
  ): ToolRoutingContext["userIntent"] {
    if (toolName.includes("migrate") || (args && args.from)) {
      return "migration";
    }
    if (toolName.includes("gen") || toolName.includes("generate")) {
      return "generation";
    }
    if (
      toolName.includes("api") ||
      toolName.includes("search") ||
      toolName.includes("find")
    ) {
      return "exploration";
    }
    if (
      toolName.includes("health") ||
      toolName.includes("validate") ||
      toolName.includes("verify")
    ) {
      return "system";
    }
    if (toolName.includes("debug") || toolName.includes("test")) {
      return "development";
    }

    return "exploration"; // Default
  }

  private static assessComplexity(
    toolName: string,
    args: any,
  ): ToolRoutingContext["complexity"] {
    // Check for complex patterns
    if (args && args.code) {
      const code = args.code;
      if (
        code.includes("cluster") ||
        code.includes("pipeline") ||
        code.includes("multi")
      ) {
        return "advanced";
      }
      if (code.includes("transaction") || code.includes("batch")) {
        return "intermediate";
      }
    }

    // Check parameter complexity
    if (args && Object.keys(args).length > 2) {
      return "intermediate";
    }

    return "simple";
  }

  private static determineTaskType(
    toolName: string,
    args: any,
  ): ToolRoutingContext["taskType"] {
    if (
      toolName.includes("search") ||
      toolName.includes("find") ||
      toolName.includes("get")
    ) {
      return "lookup";
    }
    if (toolName.includes("migrate") || toolName.includes("transform")) {
      return "transform";
    }
    if (toolName.includes("gen") || toolName.includes("create")) {
      return "create";
    }
    if (toolName.includes("validate") || toolName.includes("verify")) {
      return "validate";
    }

    return "lookup"; // Default
  }

  private static detectPatterns(args: any): string[] {
    const patterns: string[] = [];

    if (args && args.code) {
      const code = args.code.toLowerCase();

      if (code.includes("cluster")) patterns.push("cluster");
      if (code.includes("pipeline")) patterns.push("pipeline");
      if (code.includes("multi")) patterns.push("transaction");
      if (code.includes("pub") || code.includes("sub")) patterns.push("pubsub");
      if (code.includes("stream")) patterns.push("streams");
      if (code.includes("lock")) patterns.push("lock");
      if (code.includes("cache")) patterns.push("cache");
      if (code.includes("rate") && code.includes("limit"))
        patterns.push("ratelimit");
    }

    return patterns;
  }
}
