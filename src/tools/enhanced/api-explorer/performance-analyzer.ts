/**
 * Performance Comparison and Analysis System
 * Provides comprehensive performance data and recommendations for Redis operations
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";

export interface PerformanceData {
  command: string;
  timeComplexity: string;
  spaceComplexity: string;
  benchmarks: BenchmarkResult[];
  scalingCharacteristics: ScalingInfo;
  optimizationTips: OptimizationTip[];
  comparisonData: ComparisonData;
  usageRecommendations: UsageRecommendation[];
}

export interface BenchmarkResult {
  scenario: string;
  operationsPerSecond: number;
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  memoryUsage: number;
  testConditions: TestConditions;
}

export interface TestConditions {
  dataSize: string;
  connectionType: "single" | "cluster" | "sentinel";
  concurrency: number;
  networkLatency: number;
  hardware: string;
}

export interface ScalingInfo {
  scalesWith:
    | "data-size"
    | "key-count"
    | "field-count"
    | "element-count"
    | "constant";
  scalingFactor: string;
  bottlenecks: string[];
  horizontalScaling: boolean;
  verticalScaling: boolean;
}

export interface OptimizationTip {
  category: "performance" | "memory" | "network" | "cpu";
  tip: string;
  impact: "low" | "medium" | "high";
  effort: "easy" | "moderate" | "complex";
  applicableScenarios: string[];
}

export interface ComparisonData {
  alternativeCommands: AlternativeCommand[];
  libraryComparison: LibraryPerformance[];
  versusOtherSolutions: ExternalComparison[];
}

export interface AlternativeCommand {
  command: string;
  scenario: string;
  performanceDifference: string;
  tradeoffs: string[];
  recommendation: string;
}

export interface LibraryPerformance {
  library: "ioredis" | "node-redis" | "glide";
  relativePerformance: number; // Multiplier vs baseline
  strengths: string[];
  weaknesses: string[];
  bestUseCases: string[];
}

export interface ExternalComparison {
  solution: string;
  type: "database" | "cache" | "messaging";
  performanceComparison: string;
  useCaseComparison: string;
  migrationEffort: "low" | "medium" | "high";
}

export interface UsageRecommendation {
  scenario: string;
  recommendation: "excellent" | "good" | "acceptable" | "poor" | "avoid";
  reasoning: string;
  alternatives?: string[];
  conditions?: string[];
}

export interface PerformanceAnalysis {
  command: string;
  currentUsage: UsagePattern;
  performanceAssessment: PerformanceAssessment;
  recommendations: PerformanceRecommendation[];
  optimizations: OptimizationSuggestion[];
}

export interface UsagePattern {
  frequency: "very-high" | "high" | "medium" | "low";
  dataSize: "small" | "medium" | "large" | "very-large";
  concurrency: "single" | "low" | "medium" | "high";
  consistency: "strong" | "eventual" | "none";
}

export interface PerformanceAssessment {
  overall: "excellent" | "good" | "acceptable" | "poor";
  throughput: "excellent" | "good" | "acceptable" | "poor";
  latency: "excellent" | "good" | "acceptable" | "poor";
  memory: "excellent" | "good" | "acceptable" | "poor";
  scalability: "excellent" | "good" | "acceptable" | "poor";
}

export interface PerformanceRecommendation {
  type: "command-choice" | "parameters" | "architecture" | "monitoring";
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  implementation: string[];
  expectedImprovement: string;
}

export interface OptimizationSuggestion {
  category: "batching" | "pipelining" | "clustering" | "caching" | "indexing";
  suggestion: string;
  code?: string;
  impact: string;
  complexity: "easy" | "moderate" | "complex";
}

export class PerformanceAnalyzer {
  private static performanceDatabase: Map<string, PerformanceData> = new Map();

  static {
    this.initializePerformanceDatabase();
  }

  /**
   * Initialize comprehensive performance database
   */
  private static initializePerformanceDatabase(): void {
    // String Operations Performance Data
    this.addPerformanceData("GET", {
      command: "GET",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      benchmarks: [
        {
          scenario: "Small strings (< 1KB)",
          operationsPerSecond: 150000,
          latencyP50: 0.05,
          latencyP95: 0.08,
          latencyP99: 0.12,
          memoryUsage: 64,
          testConditions: {
            dataSize: "< 1KB",
            connectionType: "single",
            concurrency: 50,
            networkLatency: 0.1,
            hardware: "Standard VM",
          },
        },
        {
          scenario: "Large strings (1MB)",
          operationsPerSecond: 8000,
          latencyP50: 1.2,
          latencyP95: 2.1,
          latencyP99: 3.5,
          memoryUsage: 1048576,
          testConditions: {
            dataSize: "1MB",
            connectionType: "single",
            concurrency: 10,
            networkLatency: 0.1,
            hardware: "Standard VM",
          },
        },
      ],
      scalingCharacteristics: {
        scalesWith: "data-size",
        scalingFactor: "Linear with value size for network transfer",
        bottlenecks: ["Network bandwidth", "Memory allocation"],
        horizontalScaling: true,
        verticalScaling: true,
      },
      optimizationTips: [
        {
          category: "network",
          tip: "Use MGET for multiple keys to reduce round trips",
          impact: "high",
          effort: "easy",
          applicableScenarios: ["Multiple key retrieval", "Batch operations"],
        },
        {
          category: "memory",
          tip: "Consider compression for large values",
          impact: "medium",
          effort: "moderate",
          applicableScenarios: ["Large string values", "Text content"],
        },
        {
          category: "performance",
          tip: "Use pipelining for non-blocking multiple operations",
          impact: "high",
          effort: "moderate",
          applicableScenarios: [
            "High throughput scenarios",
            "Batch processing",
          ],
        },
      ],
      comparisonData: {
        alternativeCommands: [
          {
            command: "MGET",
            scenario: "Multiple key retrieval",
            performanceDifference: "5-10x faster for 10+ keys",
            tradeoffs: [
              "More complex response handling",
              "Higher memory usage",
            ],
            recommendation: "Use MGET when retrieving 3+ keys",
          },
        ],
        libraryComparison: [
          {
            library: "glide",
            relativePerformance: 1.0,
            strengths: ["Optimized protocol", "Efficient memory usage"],
            weaknesses: ["Newer library", "Smaller ecosystem"],
            bestUseCases: [
              "High performance applications",
              "Large-scale deployments",
            ],
          },
          {
            library: "ioredis",
            relativePerformance: 0.92,
            strengths: ["Mature ecosystem", "Rich features"],
            weaknesses: [
              "Slightly lower performance",
              "Larger memory footprint",
            ],
            bestUseCases: ["Feature-rich applications", "Complex Redis usage"],
          },
          {
            library: "node-redis",
            relativePerformance: 0.88,
            strengths: ["Official library", "Good TypeScript support"],
            weaknesses: ["Performance overhead", "API complexity"],
            bestUseCases: ["Standard applications", "TypeScript projects"],
          },
        ],
        versusOtherSolutions: [
          {
            solution: "In-memory JavaScript Map",
            type: "cache",
            performanceComparison: "10-50x faster for local access",
            useCaseComparison: "Single process only, no persistence",
            migrationEffort: "low",
          },
          {
            solution: "Memcached",
            type: "cache",
            performanceComparison: "Similar performance, simpler protocol",
            useCaseComparison: "Cache-only, no data structures",
            migrationEffort: "medium",
          },
        ],
      },
      usageRecommendations: [
        {
          scenario: "Simple caching",
          recommendation: "excellent",
          reasoning: "O(1) operation, highly optimized for key-value retrieval",
          conditions: ["Appropriate key naming", "Reasonable value sizes"],
        },
        {
          scenario: "Session storage",
          recommendation: "excellent",
          reasoning: "Fast retrieval, supports expiration",
          conditions: ["Serialize session data appropriately"],
        },
        {
          scenario: "Large blob storage",
          recommendation: "acceptable",
          reasoning: "Works but consider alternatives for very large data",
          alternatives: ["Object storage", "File system", "Database BLOBs"],
          conditions: ["Values < 100MB", "Infrequent access patterns"],
        },
      ],
    });

    this.addPerformanceData("HSET", {
      command: "HSET",
      timeComplexity: "O(1) for single field, O(N) for N fields",
      spaceComplexity: "O(N) where N is number of fields",
      benchmarks: [
        {
          scenario: "Single field update",
          operationsPerSecond: 120000,
          latencyP50: 0.06,
          latencyP95: 0.09,
          latencyP99: 0.15,
          memoryUsage: 96,
          testConditions: {
            dataSize: "Small field",
            connectionType: "single",
            concurrency: 50,
            networkLatency: 0.1,
            hardware: "Standard VM",
          },
        },
        {
          scenario: "Bulk field update (100 fields)",
          operationsPerSecond: 15000,
          latencyP50: 0.8,
          latencyP95: 1.2,
          latencyP99: 2.0,
          memoryUsage: 8192,
          testConditions: {
            dataSize: "100 fields",
            connectionType: "single",
            concurrency: 20,
            networkLatency: 0.1,
            hardware: "Standard VM",
          },
        },
      ],
      scalingCharacteristics: {
        scalesWith: "field-count",
        scalingFactor: "Linear with number of fields being set",
        bottlenecks: ["Hash table operations", "Memory allocation"],
        horizontalScaling: true,
        verticalScaling: true,
      },
      optimizationTips: [
        {
          category: "performance",
          tip: "Use bulk HSET with object parameter for multiple fields",
          impact: "high",
          effort: "easy",
          applicableScenarios: ["Object storage", "Profile updates"],
        },
        {
          category: "memory",
          tip: "Use hash-max-ziplist-entries for small hashes",
          impact: "medium",
          effort: "easy",
          applicableScenarios: ["Small objects", "Memory optimization"],
        },
      ],
      comparisonData: {
        alternativeCommands: [
          {
            command: "SET with JSON",
            scenario: "Object storage",
            performanceDifference: "HSET 2-3x faster for partial updates",
            tradeoffs: [
              "HSET allows field-level access",
              "JSON requires full object replacement",
            ],
            recommendation:
              "Use HSET for objects with frequent partial updates",
          },
        ],
        libraryComparison: [
          {
            library: "glide",
            relativePerformance: 1.0,
            strengths: ["Optimized hash operations"],
            weaknesses: [],
            bestUseCases: ["High performance hash operations"],
          },
        ],
        versusOtherSolutions: [
          {
            solution: "MongoDB documents",
            type: "database",
            performanceComparison: "HSET 5-10x faster for simple field updates",
            useCaseComparison: "MongoDB better for complex queries",
            migrationEffort: "high",
          },
        ],
      },
      usageRecommendations: [
        {
          scenario: "User profiles",
          recommendation: "excellent",
          reasoning: "Perfect for structured user data with field-level access",
          conditions: ["Reasonable number of fields (<1000)"],
        },
        {
          scenario: "Configuration objects",
          recommendation: "excellent",
          reasoning: "Easy field updates without replacing entire object",
        },
      ],
    });

    this.addPerformanceData("XADD", {
      command: "XADD",
      timeComplexity: "O(1) when adding to end of stream",
      spaceComplexity: "O(N) where N is size of entry",
      benchmarks: [
        {
          scenario: "Small events (< 1KB)",
          operationsPerSecond: 80000,
          latencyP50: 0.08,
          latencyP95: 0.12,
          latencyP99: 0.2,
          memoryUsage: 256,
          testConditions: {
            dataSize: "< 1KB",
            connectionType: "single",
            concurrency: 30,
            networkLatency: 0.1,
            hardware: "Standard VM",
          },
        },
      ],
      scalingCharacteristics: {
        scalesWith: "element-count",
        scalingFactor: "Linear with entry size and stream length",
        bottlenecks: ["Memory usage", "Stream trimming strategy"],
        horizontalScaling: true,
        verticalScaling: false,
      },
      optimizationTips: [
        {
          category: "memory",
          tip: "Implement automatic stream trimming with MAXLEN",
          impact: "high",
          effort: "easy",
          applicableScenarios: [
            "High-volume streams",
            "Memory-constrained environments",
          ],
        },
        {
          category: "performance",
          tip: "Batch multiple XADD operations using pipelines",
          impact: "medium",
          effort: "moderate",
          applicableScenarios: [
            "Bulk event ingestion",
            "High throughput scenarios",
          ],
        },
      ],
      comparisonData: {
        alternativeCommands: [
          {
            command: "LPUSH to list",
            scenario: "Event logging",
            performanceDifference: "XADD provides better ordering and metadata",
            tradeoffs: ["XADD has more overhead", "Lists are simpler"],
            recommendation:
              "Use XADD for event sourcing, LPUSH for simple queues",
          },
        ],
        libraryComparison: [
          {
            library: "glide",
            relativePerformance: 1.0,
            strengths: ["Optimized stream operations"],
            weaknesses: [],
            bestUseCases: ["Stream processing applications"],
          },
        ],
        versusOtherSolutions: [
          {
            solution: "Apache Kafka",
            type: "messaging",
            performanceComparison:
              "Kafka better for high-throughput, multi-partition scenarios",
            useCaseComparison: "Redis Streams better for simple event sourcing",
            migrationEffort: "high",
          },
        ],
      },
      usageRecommendations: [
        {
          scenario: "Event sourcing",
          recommendation: "excellent",
          reasoning:
            "Purpose-built for append-only event logs with consumer groups",
        },
        {
          scenario: "Real-time analytics",
          recommendation: "good",
          reasoning:
            "Good for real-time processing with some limitations on scale",
        },
      ],
    });

    this.addPerformanceData("ZADD", {
      command: "ZADD",
      timeComplexity: "O(log(N)) for each element added",
      spaceComplexity: "O(N) where N is number of elements",
      benchmarks: [
        {
          scenario: "Single element addition",
          operationsPerSecond: 100000,
          latencyP50: 0.07,
          latencyP95: 0.11,
          latencyP99: 0.18,
          memoryUsage: 128,
          testConditions: {
            dataSize: "Single score-member pair",
            connectionType: "single",
            concurrency: 40,
            networkLatency: 0.1,
            hardware: "Standard VM",
          },
        },
        {
          scenario: "Large leaderboard (1M members)",
          operationsPerSecond: 60000,
          latencyP50: 0.12,
          latencyP95: 0.18,
          latencyP99: 0.3,
          memoryUsage: 256,
          testConditions: {
            dataSize: "1M existing members",
            connectionType: "single",
            concurrency: 20,
            networkLatency: 0.1,
            hardware: "Standard VM",
          },
        },
      ],
      scalingCharacteristics: {
        scalesWith: "element-count",
        scalingFactor: "Logarithmic with existing set size",
        bottlenecks: ["Sorted set maintenance", "Memory fragmentation"],
        horizontalScaling: true,
        verticalScaling: true,
      },
      optimizationTips: [
        {
          category: "performance",
          tip: "Use bulk ZADD operations for multiple members",
          impact: "high",
          effort: "easy",
          applicableScenarios: ["Leaderboard initialization", "Bulk scoring"],
        },
        {
          category: "memory",
          tip: "Consider zset-max-ziplist-entries for small sorted sets",
          impact: "medium",
          effort: "easy",
          applicableScenarios: ["Small leaderboards", "Memory optimization"],
        },
      ],
      comparisonData: {
        alternativeCommands: [
          {
            command: "Multiple HSET operations",
            scenario: "Leaderboard storage",
            performanceDifference:
              "ZADD provides automatic sorting and ranking",
            tradeoffs: [
              "HSET requires manual sorting",
              "ZADD has logarithmic complexity",
            ],
            recommendation: "Use ZADD when ranking/sorting is needed",
          },
        ],
        libraryComparison: [
          {
            library: "glide",
            relativePerformance: 1.0,
            strengths: ["Optimized sorted set operations"],
            weaknesses: [],
            bestUseCases: ["Leaderboard applications"],
          },
        ],
        versusOtherSolutions: [
          {
            solution: "Database with indexed score column",
            type: "database",
            performanceComparison:
              "ZADD much faster for simple ranking operations",
            useCaseComparison:
              "Database better for complex queries and relations",
            migrationEffort: "medium",
          },
        ],
      },
      usageRecommendations: [
        {
          scenario: "Gaming leaderboards",
          recommendation: "excellent",
          reasoning:
            "Purpose-built for ranking and scoring with O(log N) performance",
        },
        {
          scenario: "Priority queues",
          recommendation: "excellent",
          reasoning: "Efficient priority-based element retrieval",
        },
        {
          scenario: "Time-series data",
          recommendation: "good",
          reasoning: "Good for simple time-based ordering",
          alternatives: ["Redis Streams", "Time-series databases"],
          conditions: ["Simple time-based queries", "Limited data retention"],
        },
      ],
    });
  }

  /**
   * Add performance data for a command
   */
  private static addPerformanceData(
    command: string,
    data: PerformanceData,
  ): void {
    this.performanceDatabase.set(command.toUpperCase(), data);
  }

  /**
   * Get performance data for a specific command
   */
  static getPerformanceData(command: string): PerformanceData | undefined {
    return this.performanceDatabase.get(command.toUpperCase());
  }

  /**
   * Analyze performance for current usage context
   */
  static analyzePerformance(
    command: string,
    context: EnhancedQueryContext,
    usagePattern?: Partial<UsagePattern>,
  ): PerformanceAnalysis | undefined {
    const performanceData = this.getPerformanceData(command);
    if (!performanceData) return undefined;

    const defaultUsagePattern: UsagePattern = {
      frequency: "medium",
      dataSize: "medium",
      concurrency: "medium",
      consistency: "strong",
    };

    const currentUsage = { ...defaultUsagePattern, ...usagePattern };
    const assessment = this.assessPerformance(performanceData, currentUsage);
    const recommendations = this.generatePerformanceRecommendations(
      performanceData,
      currentUsage,
      assessment,
    );
    const optimizations = this.generateOptimizationSuggestions(
      performanceData,
      currentUsage,
    );

    return {
      command,
      currentUsage,
      performanceAssessment: assessment,
      recommendations,
      optimizations,
    };
  }

  /**
   * Assess performance based on usage pattern
   */
  private static assessPerformance(
    data: PerformanceData,
    usage: UsagePattern,
  ): PerformanceAssessment {
    // Simple heuristic-based assessment
    const complexity = data.timeComplexity;

    let throughput: PerformanceAssessment["throughput"] = "good";
    let latency: PerformanceAssessment["latency"] = "good";
    let memory: PerformanceAssessment["memory"] = "good";
    let scalability: PerformanceAssessment["scalability"] = "good";

    // Assess based on time complexity and usage
    if (complexity.includes("O(1)")) {
      throughput = usage.frequency === "very-high" ? "excellent" : "excellent";
      latency = "excellent";
      scalability = "excellent";
    } else if (complexity.includes("O(log(N))")) {
      throughput = usage.frequency === "very-high" ? "good" : "excellent";
      latency = "good";
      scalability = "good";
    } else if (complexity.includes("O(N)")) {
      throughput = usage.dataSize === "very-large" ? "acceptable" : "good";
      latency = usage.dataSize === "very-large" ? "acceptable" : "good";
      scalability = "acceptable";
    }

    // Memory assessment
    if (usage.dataSize === "very-large") {
      memory = "acceptable";
    } else if (usage.dataSize === "large") {
      memory = "good";
    }

    // Overall assessment
    const scores = { excellent: 4, good: 3, acceptable: 2, poor: 1 };
    const avgScore =
      (scores[throughput] +
        scores[latency] +
        scores[memory] +
        scores[scalability]) /
      4;

    let overall: PerformanceAssessment["overall"];
    if (avgScore >= 3.5) overall = "excellent";
    else if (avgScore >= 2.5) overall = "good";
    else if (avgScore >= 1.5) overall = "acceptable";
    else overall = "poor";

    return { overall, throughput, latency, memory, scalability };
  }

  /**
   * Generate performance recommendations
   */
  private static generatePerformanceRecommendations(
    data: PerformanceData,
    usage: UsagePattern,
    assessment: PerformanceAssessment,
  ): PerformanceRecommendation[] {
    const recommendations: PerformanceRecommendation[] = [];

    // High frequency usage recommendations
    if (usage.frequency === "very-high") {
      recommendations.push({
        type: "architecture",
        priority: "high",
        title: "Consider Connection Pooling",
        description: "High frequency usage benefits from connection pooling",
        implementation: [
          "Implement connection pooling",
          "Use pipelining for bulk operations",
          "Consider clustering for horizontal scaling",
        ],
        expectedImprovement: "20-40% throughput increase",
      });
    }

    // Large data recommendations
    if (usage.dataSize === "large" || usage.dataSize === "very-large") {
      recommendations.push({
        type: "parameters",
        priority: "medium",
        title: "Optimize Data Size",
        description: "Large data operations can benefit from optimization",
        implementation: [
          "Consider data compression",
          "Break large operations into smaller chunks",
          "Use streaming for very large data",
        ],
        expectedImprovement: "30-50% memory reduction",
      });
    }

    // Scalability recommendations
    if (
      assessment.scalability === "acceptable" ||
      assessment.scalability === "poor"
    ) {
      recommendations.push({
        type: "architecture",
        priority: "high",
        title: "Improve Scalability",
        description: "Current usage pattern may not scale well",
        implementation: [
          "Consider sharding strategies",
          "Implement caching layers",
          "Review data modeling",
        ],
        expectedImprovement: "Better horizontal scaling",
      });
    }

    return recommendations;
  }

  /**
   * Generate optimization suggestions
   */
  private static generateOptimizationSuggestions(
    data: PerformanceData,
    usage: UsagePattern,
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Add relevant optimization tips as suggestions
    data.optimizationTips.forEach((tip) => {
      if (
        tip.applicableScenarios.some((scenario) =>
          this.matchesUsage(scenario, usage),
        )
      ) {
        suggestions.push({
          category: this.mapTipCategoryToSuggestionCategory(tip.category),
          suggestion: tip.tip,
          impact: `${tip.impact} impact improvement`,
          complexity: tip.effort,
        });
      }
    });

    // Add usage-specific suggestions
    if (usage.concurrency === "high") {
      suggestions.push({
        category: "pipelining",
        suggestion: "Use pipelining to batch multiple operations",
        code: `const pipeline = client.pipeline();
pipeline.${data.command.toLowerCase()}(key1, value1);
pipeline.${data.command.toLowerCase()}(key2, value2);
const results = await pipeline.exec();`,
        impact: "Significant latency reduction for multiple operations",
        complexity: "moderate",
      });
    }

    return suggestions;
  }

  /**
   * Check if usage pattern matches scenario
   */
  private static matchesUsage(scenario: string, usage: UsagePattern): boolean {
    const scenarioLower = scenario.toLowerCase();

    if (scenarioLower.includes("high") && usage.frequency === "very-high")
      return true;
    if (scenarioLower.includes("batch") && usage.concurrency === "high")
      return true;
    if (
      scenarioLower.includes("large") &&
      (usage.dataSize === "large" || usage.dataSize === "very-large")
    )
      return true;

    return false;
  }

  /**
   * Map tip category to suggestion category
   */
  private static mapTipCategoryToSuggestionCategory(
    tipCategory: string,
  ): OptimizationSuggestion["category"] {
    const mapping: Record<string, OptimizationSuggestion["category"]> = {
      performance: "batching",
      network: "pipelining",
      memory: "caching",
      cpu: "clustering",
    };

    return mapping[tipCategory] || "batching";
  }

  /**
   * Compare multiple commands for a use case
   */
  static compareCommands(
    commands: string[],
    useCase?: string,
  ): {
    comparison: CommandComparison[];
    recommendation: string;
    reasoning: string[];
  } {
    const comparison: CommandComparison[] = commands.map((cmd) => {
      const data = this.getPerformanceData(cmd);
      return {
        command: cmd,
        timeComplexity: data?.timeComplexity || "Unknown",
        strengths:
          data?.optimizationTips.map((tip) => tip.tip).slice(0, 2) || [],
        weaknesses: data?.scalingCharacteristics.bottlenecks || [],
        bestFor:
          data?.usageRecommendations
            .filter((rec) => rec.recommendation === "excellent")
            .map((rec) => rec.scenario) || [],
      };
    });

    // Simple recommendation logic
    const o1Commands = comparison.filter((c) =>
      c.timeComplexity.includes("O(1)"),
    );
    const recommendation =
      o1Commands.length > 0 ? o1Commands[0].command : comparison[0].command;

    const reasoning = [
      `${recommendation} offers the best performance characteristics for most scenarios`,
      "Consider specific use case requirements when choosing alternatives",
    ];

    return { comparison, recommendation, reasoning };
  }

  /**
   * Get all performance data
   */
  static getAllPerformanceData(): Map<string, PerformanceData> {
    return new Map(this.performanceDatabase);
  }
}

interface CommandComparison {
  command: string;
  timeComplexity: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
}

// Export convenience functions
export const getPerformanceData = PerformanceAnalyzer.getPerformanceData;
export const analyzePerformance = PerformanceAnalyzer.analyzePerformance;
export const compareCommands = PerformanceAnalyzer.compareCommands;
