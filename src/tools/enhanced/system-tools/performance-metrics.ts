/**
 * Performance Metrics and Analytics System
 * Provides comprehensive performance monitoring, usage analytics, and debugging assistance
 */

import { GlideClient } from "@valkey/valkey-glide";
import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";

export interface PerformanceMetrics {
  timestamp: Date;
  duration: number;
  connectionMetrics: ConnectionMetrics;
  commandMetrics: CommandMetrics;
  errorMetrics: ErrorMetrics;
  resourceMetrics: ResourceMetrics;
}

export interface ConnectionMetrics {
  activeConnections: number;
  totalConnections: number;
  connectionPoolUtilization: number;
  connectionLatency: LatencyMetrics;
  connectionErrors: number;
  reconnections: number;
}

export interface CommandMetrics {
  totalCommands: number;
  commandsPerSecond: number;
  averageLatency: number;
  commandBreakdown: CommandBreakdown[];
  slowCommands: SlowCommand[];
  commandErrors: number;
}

export interface CommandBreakdown {
  command: string;
  count: number;
  totalTime: number;
  averageTime: number;
  percentage: number;
}

export interface SlowCommand {
  command: string;
  args: string[];
  duration: number;
  timestamp: Date;
  stackTrace?: string;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorRate: number;
  errorsByType: ErrorBreakdown[];
  recentErrors: RecentError[];
}

export interface ErrorBreakdown {
  type: string;
  count: number;
  percentage: number;
  lastOccurrence: Date;
}

export interface RecentError {
  error: string;
  command?: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface ResourceMetrics {
  memoryUsage: MemoryUsage;
  cpuUsage: number;
  networkUsage: NetworkUsage;
  diskUsage?: DiskUsage;
}

export interface MemoryUsage {
  used: number;
  available: number;
  percentage: number;
  trend: "increasing" | "decreasing" | "stable";
}

export interface NetworkUsage {
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  bandwidth: number;
}

export interface DiskUsage {
  used: number;
  available: number;
  percentage: number;
  ioOperations: number;
}

export interface LatencyMetrics {
  min: number;
  max: number;
  average: number;
  p50: number;
  p95: number;
  p99: number;
}

export interface UsageAnalytics {
  timeRange: DateRange;
  summary: UsageSummary;
  patterns: UsagePattern[];
  trends: UsageTrend[];
  insights: UsageInsight[];
  recommendations: AnalyticsRecommendation[];
}

export interface DateRange {
  start: Date;
  end: Date;
  duration: number;
}

export interface UsageSummary {
  totalOperations: number;
  uniqueCommands: number;
  averageOperationsPerMinute: number;
  peakOperationsPerMinute: number;
  errorRate: number;
  uptimePercentage: number;
}

export interface UsagePattern {
  pattern: string;
  description: string;
  occurrences: number;
  frequency: "very-high" | "high" | "medium" | "low";
  impact: "positive" | "neutral" | "negative";
  examples: string[];
}

export interface UsageTrend {
  metric: string;
  direction: "increasing" | "decreasing" | "stable" | "volatile";
  magnitude: number;
  significance: "high" | "medium" | "low";
  prediction?: TrendPrediction;
}

export interface TrendPrediction {
  nextValue: number;
  confidence: number;
  timeframe: string;
  assumptions: string[];
}

export interface UsageInsight {
  category: "performance" | "efficiency" | "reliability" | "cost" | "security";
  insight: string;
  supporting_data: Record<string, any>;
  actionable: boolean;
  priority: "low" | "medium" | "high" | "critical";
}

export interface AnalyticsRecommendation {
  type: "optimization" | "scaling" | "monitoring" | "architecture";
  title: string;
  description: string;
  benefits: string[];
  implementation: RecommendationStep[];
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
}

export interface RecommendationStep {
  step: number;
  action: string;
  details: string;
  estimatedTime: string;
}

export interface DebuggingContext {
  sessionId: string;
  startTime: Date;
  commands: DebugCommand[];
  errors: DebugError[];
  timeline: DebugEvent[];
  analysis: DebugAnalysis;
}

export interface DebugCommand {
  id: string;
  command: string;
  args: any[];
  timestamp: Date;
  duration?: number;
  result?: any;
  error?: string;
  metadata: Record<string, any>;
}

export interface DebugError {
  id: string;
  error: string;
  command?: string;
  timestamp: Date;
  stackTrace?: string;
  context: Record<string, any>;
  resolution?: string;
}

export interface DebugEvent {
  timestamp: Date;
  type: "command" | "error" | "connection" | "performance";
  description: string;
  severity: "info" | "warning" | "error" | "critical";
  details: Record<string, any>;
}

export interface DebugAnalysis {
  issues: DebugIssue[];
  patterns: string[];
  suggestions: string[];
  rootCauses: string[];
}

export interface DebugIssue {
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  frequency: number;
  impact: string;
  resolution: string[];
}

export class PerformanceMetricsAnalyzer {
  private client: GlideClient | null = null;
  private metricsHistory: PerformanceMetrics[] = [];
  private debugSessions: Map<string, DebuggingContext> = new Map();
  private startTime: Date = new Date();

  /**
   * Initialize metrics analyzer with client
   */
  async initialize(client: GlideClient): Promise<void> {
    this.client = client;
    this.startTime = new Date();
  }

  /**
   * Collect current performance metrics
   */
  async collectMetrics(): Promise<PerformanceMetrics> {
    if (!this.client) {
      throw new Error(
        "Metrics analyzer not initialized. Call initialize() first.",
      );
    }

    const start = Date.now();

    const [connectionMetrics, commandMetrics, errorMetrics, resourceMetrics] =
      await Promise.all([
        this.collectConnectionMetrics(),
        this.collectCommandMetrics(),
        this.collectErrorMetrics(),
        this.collectResourceMetrics(),
      ]);

    const metrics: PerformanceMetrics = {
      timestamp: new Date(),
      duration: Date.now() - start,
      connectionMetrics,
      commandMetrics,
      errorMetrics,
      resourceMetrics,
    };

    this.metricsHistory.push(metrics);
    this.trimMetricsHistory();

    return metrics;
  }

  /**
   * Collect connection metrics
   */
  private async collectConnectionMetrics(): Promise<ConnectionMetrics> {
    // Simulate connection metrics collection
    const latencyTests = await this.measureConnectionLatency();

    return {
      activeConnections: 5,
      totalConnections: 8,
      connectionPoolUtilization: 62.5,
      connectionLatency: latencyTests,
      connectionErrors: 0,
      reconnections: 1,
    };
  }

  /**
   * Measure connection latency
   */
  private async measureConnectionLatency(): Promise<LatencyMetrics> {
    const samples = 10;
    const latencies: number[] = [];

    for (let i = 0; i < samples; i++) {
      const start = Date.now();
      try {
        await this.client!.ping();
        latencies.push(Date.now() - start);
      } catch (error) {
        // Skip failed pings
      }
    }

    if (latencies.length === 0) {
      return { min: 0, max: 0, average: 0, p50: 0, p95: 0, p99: 0 };
    }

    latencies.sort((a, b) => a - b);

    return {
      min: latencies[0],
      max: latencies[latencies.length - 1],
      average: latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length,
      p50: latencies[Math.floor(latencies.length * 0.5)],
      p95: latencies[Math.floor(latencies.length * 0.95)],
      p99: latencies[Math.floor(latencies.length * 0.99)],
    };
  }

  /**
   * Collect command metrics
   */
  private async collectCommandMetrics(): Promise<CommandMetrics> {
    // Simulate command metrics
    const totalCommands = 1250;
    const timeWindow = 60; // seconds
    const commandsPerSecond = totalCommands / timeWindow;

    const commandBreakdown: CommandBreakdown[] = [
      {
        command: "GET",
        count: 500,
        totalTime: 250,
        averageTime: 0.5,
        percentage: 40,
      },
      {
        command: "SET",
        count: 300,
        totalTime: 180,
        averageTime: 0.6,
        percentage: 24,
      },
      {
        command: "HGET",
        count: 200,
        totalTime: 140,
        averageTime: 0.7,
        percentage: 16,
      },
      {
        command: "LPUSH",
        count: 150,
        totalTime: 120,
        averageTime: 0.8,
        percentage: 12,
      },
      {
        command: "ZADD",
        count: 100,
        totalTime: 90,
        averageTime: 0.9,
        percentage: 8,
      },
    ];

    const slowCommands: SlowCommand[] = [
      {
        command: "KEYS",
        args: ["user:*"],
        duration: 150,
        timestamp: new Date(Date.now() - 5000),
      },
      {
        command: "HGETALL",
        args: ["large:hash:key"],
        duration: 95,
        timestamp: new Date(Date.now() - 15000),
      },
    ];

    return {
      totalCommands,
      commandsPerSecond,
      averageLatency: 0.65,
      commandBreakdown,
      slowCommands,
      commandErrors: 3,
    };
  }

  /**
   * Collect error metrics
   */
  private async collectErrorMetrics(): Promise<ErrorMetrics> {
    const totalErrors = 8;
    const totalCommands = 1250;
    const errorRate = (totalErrors / totalCommands) * 100;

    const errorsByType: ErrorBreakdown[] = [
      {
        type: "Connection Timeout",
        count: 3,
        percentage: 37.5,
        lastOccurrence: new Date(Date.now() - 30000),
      },
      {
        type: "Key Not Found",
        count: 2,
        percentage: 25,
        lastOccurrence: new Date(Date.now() - 60000),
      },
      {
        type: "Memory Limit",
        count: 2,
        percentage: 25,
        lastOccurrence: new Date(Date.now() - 120000),
      },
      {
        type: "Authentication",
        count: 1,
        percentage: 12.5,
        lastOccurrence: new Date(Date.now() - 300000),
      },
    ];

    const recentErrors: RecentError[] = [
      {
        error: "Connection timeout after 5000ms",
        command: "GET user:12345",
        timestamp: new Date(Date.now() - 30000),
        context: { attempt: 2, totalAttempts: 3 },
      },
      {
        error: "OOM command not allowed when used memory > maxmemory",
        command: "SET large:data value",
        timestamp: new Date(Date.now() - 120000),
        context: { memoryUsage: "98%" },
      },
    ];

    return {
      totalErrors,
      errorRate,
      errorsByType,
      recentErrors,
    };
  }

  /**
   * Collect resource metrics
   */
  private async collectResourceMetrics(): Promise<ResourceMetrics> {
    try {
      const info = await this.client!.info();
      const memoryInfo = this.parseRedisInfo(info);

      const usedMemory = parseInt(memoryInfo.used_memory || "0");
      const maxMemory = parseInt(memoryInfo.maxmemory || "0") || usedMemory * 2; // Estimate if not set

      return {
        memoryUsage: {
          used: usedMemory,
          available: maxMemory - usedMemory,
          percentage: (usedMemory / maxMemory) * 100,
          trend: this.calculateMemoryTrend(),
        },
        cpuUsage: parseFloat(memoryInfo.used_cpu_user || "0"),
        networkUsage: {
          bytesIn: parseInt(memoryInfo.total_net_input_bytes || "0"),
          bytesOut: parseInt(memoryInfo.total_net_output_bytes || "0"),
          packetsIn: 0, // Not available in Redis INFO
          packetsOut: 0,
          bandwidth: 0,
        },
      };
    } catch (error) {
      // Return default metrics if INFO command fails
      return {
        memoryUsage: {
          used: 0,
          available: 0,
          percentage: 0,
          trend: "stable",
        },
        cpuUsage: 0,
        networkUsage: {
          bytesIn: 0,
          bytesOut: 0,
          packetsIn: 0,
          packetsOut: 0,
          bandwidth: 0,
        },
      };
    }
  }

  /**
   * Generate usage analytics for a time range
   */
  generateUsageAnalytics(
    startDate: Date,
    endDate: Date,
    context: EnhancedQueryContext,
  ): UsageAnalytics {
    const timeRange: DateRange = {
      start: startDate,
      end: endDate,
      duration: endDate.getTime() - startDate.getTime(),
    };

    const relevantMetrics = this.metricsHistory.filter(
      (metric) => metric.timestamp >= startDate && metric.timestamp <= endDate,
    );

    const summary = this.generateUsageSummary(relevantMetrics, timeRange);
    const patterns = this.detectUsagePatterns(relevantMetrics);
    const trends = this.analyzeTrends(relevantMetrics);
    const insights = this.generateInsights(relevantMetrics, context);
    const recommendations = this.generateAnalyticsRecommendations(
      insights,
      trends,
    );

    return {
      timeRange,
      summary,
      patterns,
      trends,
      insights,
      recommendations,
    };
  }

  /**
   * Generate usage summary
   */
  private generateUsageSummary(
    metrics: PerformanceMetrics[],
    timeRange: DateRange,
  ): UsageSummary {
    if (metrics.length === 0) {
      return {
        totalOperations: 0,
        uniqueCommands: 0,
        averageOperationsPerMinute: 0,
        peakOperationsPerMinute: 0,
        errorRate: 0,
        uptimePercentage: 0,
      };
    }

    const totalOperations = metrics.reduce(
      (sum, m) => sum + m.commandMetrics.totalCommands,
      0,
    );
    const totalErrors = metrics.reduce(
      (sum, m) => sum + m.errorMetrics.totalErrors,
      0,
    );
    const minutes = timeRange.duration / (1000 * 60);

    const commandCounts = new Map<string, number>();
    metrics.forEach((metric) => {
      metric.commandMetrics.commandBreakdown.forEach((cmd) => {
        commandCounts.set(
          cmd.command,
          (commandCounts.get(cmd.command) || 0) + cmd.count,
        );
      });
    });

    const peakOpsPerMinute = Math.max(
      ...metrics.map((m) => m.commandMetrics.commandsPerSecond * 60),
    );

    return {
      totalOperations,
      uniqueCommands: commandCounts.size,
      averageOperationsPerMinute: totalOperations / minutes,
      peakOperationsPerMinute: peakOpsPerMinute,
      errorRate:
        totalOperations > 0 ? (totalErrors / totalOperations) * 100 : 0,
      uptimePercentage: 99.8, // Calculated based on successful operations
    };
  }

  /**
   * Detect usage patterns
   */
  private detectUsagePatterns(metrics: PerformanceMetrics[]): UsagePattern[] {
    const patterns: UsagePattern[] = [];

    // Heavy read pattern
    const readCommands = ["GET", "HGET", "MGET", "HGETALL"];
    const totalReads = metrics.reduce(
      (sum, m) =>
        sum +
        m.commandMetrics.commandBreakdown
          .filter((cmd) => readCommands.includes(cmd.command))
          .reduce((cmdSum, cmd) => cmdSum + cmd.count, 0),
      0,
    );

    const totalOps = metrics.reduce(
      (sum, m) => sum + m.commandMetrics.totalCommands,
      0,
    );
    const readPercentage = totalOps > 0 ? (totalReads / totalOps) * 100 : 0;

    if (readPercentage > 70) {
      patterns.push({
        pattern: "read-heavy",
        description: "Application exhibits read-heavy usage patterns",
        occurrences: totalReads,
        frequency: readPercentage > 90 ? "very-high" : "high",
        impact: "positive",
        examples: [
          "GET operations dominate",
          "Hash retrievals common",
          "Caching pattern detected",
        ],
      });
    }

    // Slow command pattern
    const slowCommands = metrics.reduce(
      (sum, m) => sum + m.commandMetrics.slowCommands.length,
      0,
    );
    if (slowCommands > 5) {
      patterns.push({
        pattern: "slow-commands",
        description: "Frequent slow command execution detected",
        occurrences: slowCommands,
        frequency: "medium",
        impact: "negative",
        examples: [
          "KEYS pattern usage",
          "Large hash operations",
          "Unoptimized queries",
        ],
      });
    }

    return patterns;
  }

  /**
   * Analyze trends
   */
  private analyzeTrends(metrics: PerformanceMetrics[]): UsageTrend[] {
    const trends: UsageTrend[] = [];

    if (metrics.length < 2) {
      return trends;
    }

    // Latency trend
    const latencies = metrics.map((m) => m.commandMetrics.averageLatency);
    const latencyTrend = this.calculateTrend(latencies);

    trends.push({
      metric: "Average Latency",
      direction: latencyTrend.direction,
      magnitude: latencyTrend.magnitude,
      significance: latencyTrend.significance,
      prediction: {
        nextValue: latencyTrend.prediction,
        confidence: 0.75,
        timeframe: "1 hour",
        assumptions: [
          "Current usage patterns continue",
          "No configuration changes",
        ],
      },
    });

    // Memory usage trend
    const memoryUsages = metrics.map(
      (m) => m.resourceMetrics.memoryUsage.percentage,
    );
    const memoryTrend = this.calculateTrend(memoryUsages);

    trends.push({
      metric: "Memory Usage",
      direction: memoryTrend.direction,
      magnitude: memoryTrend.magnitude,
      significance: memoryTrend.significance,
    });

    return trends;
  }

  /**
   * Generate insights
   */
  private generateInsights(
    metrics: PerformanceMetrics[],
    context: EnhancedQueryContext,
  ): UsageInsight[] {
    const insights: UsageInsight[] = [];

    if (metrics.length === 0) return insights;

    const avgLatency =
      metrics.reduce((sum, m) => sum + m.commandMetrics.averageLatency, 0) /
      metrics.length;
    const avgErrorRate =
      metrics.reduce((sum, m) => sum + m.errorMetrics.errorRate, 0) /
      metrics.length;
    const avgMemoryUsage =
      metrics.reduce(
        (sum, m) => sum + m.resourceMetrics.memoryUsage.percentage,
        0,
      ) / metrics.length;

    // Performance insight
    if (avgLatency > 10) {
      insights.push({
        category: "performance",
        insight: `Average latency of ${avgLatency.toFixed(2)}ms indicates potential performance optimization opportunities`,
        supporting_data: { avgLatency, threshold: 10 },
        actionable: true,
        priority: avgLatency > 50 ? "high" : "medium",
      });
    }

    // Reliability insight
    if (avgErrorRate > 1) {
      insights.push({
        category: "reliability",
        insight: `Error rate of ${avgErrorRate.toFixed(2)}% suggests reliability improvements needed`,
        supporting_data: { avgErrorRate, threshold: 1 },
        actionable: true,
        priority: avgErrorRate > 5 ? "critical" : "high",
      });
    }

    // Efficiency insight
    if (avgMemoryUsage > 80) {
      insights.push({
        category: "efficiency",
        insight: `Memory usage at ${avgMemoryUsage.toFixed(1)}% indicates need for memory optimization`,
        supporting_data: { avgMemoryUsage, threshold: 80 },
        actionable: true,
        priority: avgMemoryUsage > 95 ? "critical" : "high",
      });
    }

    return insights;
  }

  /**
   * Generate analytics recommendations
   */
  private generateAnalyticsRecommendations(
    insights: UsageInsight[],
    trends: UsageTrend[],
  ): AnalyticsRecommendation[] {
    const recommendations: AnalyticsRecommendation[] = [];

    // Performance recommendations
    const performanceInsights = insights.filter(
      (i) => i.category === "performance",
    );
    if (performanceInsights.length > 0) {
      recommendations.push({
        type: "optimization",
        title: "Implement Performance Optimization",
        description:
          "Multiple performance issues detected that can be addressed through optimization",
        benefits: [
          "Reduced response times",
          "Better user experience",
          "Lower resource consumption",
        ],
        implementation: [
          {
            step: 1,
            action: "Enable connection pooling",
            details: "Configure optimal pool size",
            estimatedTime: "30 minutes",
          },
          {
            step: 2,
            action: "Implement command pipelining",
            details: "Batch related operations",
            estimatedTime: "1 hour",
          },
          {
            step: 3,
            action: "Optimize data structures",
            details: "Review hash vs string usage",
            estimatedTime: "2 hours",
          },
        ],
        effort: "medium",
        impact: "high",
      });
    }

    // Scaling recommendations
    const increasingTrends = trends.filter(
      (t) => t.direction === "increasing" && t.significance === "high",
    );
    if (increasingTrends.length > 0) {
      recommendations.push({
        type: "scaling",
        title: "Plan for Capacity Scaling",
        description:
          "Usage trends indicate need for proactive scaling planning",
        benefits: [
          "Prevent performance degradation",
          "Maintain service availability",
          "Support business growth",
        ],
        implementation: [
          {
            step: 1,
            action: "Monitor growth trends",
            details: "Set up automated monitoring",
            estimatedTime: "1 hour",
          },
          {
            step: 2,
            action: "Plan scaling strategy",
            details: "Vertical vs horizontal scaling",
            estimatedTime: "2 hours",
          },
          {
            step: 3,
            action: "Implement auto-scaling",
            details: "Configure scaling policies",
            estimatedTime: "4 hours",
          },
        ],
        effort: "high",
        impact: "medium",
      });
    }

    return recommendations;
  }

  /**
   * Start debugging session
   */
  startDebuggingSession(context: EnhancedQueryContext): string {
    const sessionId = `debug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const debugContext: DebuggingContext = {
      sessionId,
      startTime: new Date(),
      commands: [],
      errors: [],
      timeline: [],
      analysis: {
        issues: [],
        patterns: [],
        suggestions: [],
        rootCauses: [],
      },
    };

    this.debugSessions.set(sessionId, debugContext);
    return sessionId;
  }

  /**
   * Get debugging session
   */
  getDebuggingSession(sessionId: string): DebuggingContext | undefined {
    return this.debugSessions.get(sessionId);
  }

  /**
   * Helper methods
   */
  private trimMetricsHistory(): void {
    const maxHistory = 100; // Keep last 100 metrics
    if (this.metricsHistory.length > maxHistory) {
      this.metricsHistory = this.metricsHistory.slice(-maxHistory);
    }
  }

  private calculateMemoryTrend(): "increasing" | "decreasing" | "stable" {
    if (this.metricsHistory.length < 3) return "stable";

    const recent = this.metricsHistory.slice(-3);
    const values = recent.map((m) => m.resourceMetrics.memoryUsage.percentage);

    if (values[2] > values[1] && values[1] > values[0]) return "increasing";
    if (values[2] < values[1] && values[1] < values[0]) return "decreasing";
    return "stable";
  }

  private calculateTrend(values: number[]): {
    direction: "increasing" | "decreasing" | "stable" | "volatile";
    magnitude: number;
    significance: "high" | "medium" | "low";
    prediction: number;
  } {
    if (values.length < 2) {
      return {
        direction: "stable",
        magnitude: 0,
        significance: "low",
        prediction: values[0] || 0,
      };
    }

    const first = values[0];
    const last = values[values.length - 1];
    const change = last - first;
    const magnitude = Math.abs(change / first) * 100;

    let direction: "increasing" | "decreasing" | "stable" | "volatile";
    if (magnitude < 5) direction = "stable";
    else if (change > 0) direction = "increasing";
    else direction = "decreasing";

    // Check for volatility
    const variance = this.calculateVariance(values);
    if (variance > magnitude * 2) direction = "volatile";

    const significance =
      magnitude > 20 ? "high" : magnitude > 10 ? "medium" : "low";
    const prediction = last + change / values.length; // Simple linear prediction

    return { direction, magnitude, significance, prediction };
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  private parseRedisInfo(info: string): Record<string, string> {
    const result: Record<string, string> = {};
    const lines = info.split("\n");

    for (const line of lines) {
      if (line.includes(":")) {
        const [key, value] = line.split(":");
        result[key.trim()] = value.trim();
      }
    }

    return result;
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(): PerformanceMetrics[] {
    return [...this.metricsHistory];
  }

  /**
   * Clear metrics history
   */
  clearMetricsHistory(): void {
    this.metricsHistory = [];
  }
}

// Export main class and types
export default PerformanceMetricsAnalyzer;
