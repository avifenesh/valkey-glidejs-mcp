/**
 * Enhanced System Tools
 * Provides comprehensive system health diagnostics, performance monitoring, and debugging assistance
 */

import { GlideClient } from "@valkey/valkey-glide";
import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import InteractiveHealthDiagnostics, {
  type HealthDiagnosticSuite,
  type InteractiveSession,
  type DiagnosticOptions,
  type DiagnosticRecommendation,
  type HealthCheckResult,
} from "./health-diagnostics.js";
import PerformanceMetricsAnalyzer, {
  type PerformanceMetrics,
  type UsageAnalytics,
  type DebuggingContext,
  type AnalyticsRecommendation,
} from "./performance-metrics.js";

export interface SystemToolsRequest {
  tool:
    | "health-check"
    | "performance-analysis"
    | "debug-session"
    | "comprehensive-report";
  options: SystemToolsOptions;
  timeRange?: {
    start: Date;
    end: Date;
  };
}

export interface SystemToolsOptions {
  includeHealthCheck: boolean;
  includePerformanceMetrics: boolean;
  includeUsageAnalytics: boolean;
  includeDebugging: boolean;
  detailLevel: "basic" | "detailed" | "comprehensive";
  realTimeUpdates: boolean;
}

export interface SystemHealthReport {
  timestamp: Date;
  overallStatus: "healthy" | "warning" | "critical" | "unknown";
  healthDiagnostics?: HealthDiagnosticSuite;
  performanceMetrics?: PerformanceMetrics;
  usageAnalytics?: UsageAnalytics;
  recommendations: CombinedRecommendation[];
  summary: SystemSummary;
  nextSteps: string[];
}

export interface CombinedRecommendation {
  category: "health" | "performance" | "usage" | "debugging";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  source:
    | "health-diagnostics"
    | "performance-metrics"
    | "analytics"
    | "system-analysis";
  actionItems: string[];
  expectedImpact: string;
  estimatedEffort: string;
}

export interface SystemSummary {
  status: string;
  keyMetrics: KeyMetric[];
  criticalIssues: number;
  warnings: number;
  optimizationOpportunities: number;
  uptimePercentage?: number;
}

export interface KeyMetric {
  name: string;
  value: string;
  status: "good" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
}

export interface InteractiveSystemSession {
  sessionId: string;
  startTime: Date;
  healthSession?: InteractiveSession;
  debugSession?: string;
  metricsCollected: PerformanceMetrics[];
  userInteractions: UserInteraction[];
  currentContext: EnhancedQueryContext;
}

export interface UserInteraction {
  timestamp: Date;
  query: string;
  response: string;
  followUpQuestions?: string[];
  actionsTaken?: string[];
}

export class EnhancedSystemTools {
  private healthDiagnostics: InteractiveHealthDiagnostics;
  private performanceAnalyzer: PerformanceMetricsAnalyzer;
  private activeSessions: Map<string, InteractiveSystemSession> = new Map();
  private client: GlideClient | null = null;

  constructor() {
    this.healthDiagnostics = new InteractiveHealthDiagnostics();
    this.performanceAnalyzer = new PerformanceMetricsAnalyzer();
  }

  /**
   * Initialize system tools with Redis client
   */
  async initialize(client: GlideClient): Promise<void> {
    this.client = client;
    await this.healthDiagnostics.initialize(client);
    await this.performanceAnalyzer.initialize(client);
  }

  /**
   * Process system tools request
   */
  async processRequest(
    request: SystemToolsRequest,
    context: EnhancedQueryContext,
  ): Promise<SystemHealthReport> {
    if (!this.client) {
      throw new Error("System tools not initialized. Call initialize() first.");
    }

    switch (request.tool) {
      case "health-check":
        return await this.performHealthCheck(request.options, context);

      case "performance-analysis":
        return await this.performPerformanceAnalysis(
          request.options,
          context,
          request.timeRange,
        );

      case "debug-session":
        return await this.startDebugSession(request.options, context);

      case "comprehensive-report":
        return await this.generateComprehensiveReport(
          request.options,
          context,
          request.timeRange,
        );

      default:
        throw new Error(`Unknown tool: ${request.tool}`);
    }
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(
    options: SystemToolsOptions,
    context: EnhancedQueryContext,
  ): Promise<SystemHealthReport> {
    const diagnosticOptions: Partial<DiagnosticOptions> = {
      includePerformanceTests: options.includePerformanceMetrics,
      verboseOutput: options.detailLevel === "comprehensive",
      timeoutMs: 30000,
    };

    const healthSession = await this.healthDiagnostics.startDiagnosticSession(
      context,
      diagnosticOptions,
    );
    const overallStatus = this.determineOverallStatus(
      healthSession.diagnostics,
    );

    const recommendations = this.convertHealthRecommendations(
      healthSession.recommendations,
    );
    const summary = this.generateHealthSummary(healthSession.diagnostics);

    return {
      timestamp: new Date(),
      overallStatus,
      healthDiagnostics: healthSession.diagnostics,
      recommendations,
      summary,
      nextSteps: this.generateHealthNextSteps(
        healthSession.diagnostics,
        recommendations,
      ),
    };
  }

  /**
   * Perform performance analysis
   */
  private async performPerformanceAnalysis(
    options: SystemToolsOptions,
    context: EnhancedQueryContext,
    timeRange?: { start: Date; end: Date },
  ): Promise<SystemHealthReport> {
    // Collect current metrics
    const currentMetrics = await this.performanceAnalyzer.collectMetrics();

    let usageAnalytics: UsageAnalytics | undefined;
    if (options.includeUsageAnalytics && timeRange) {
      usageAnalytics = this.performanceAnalyzer.generateUsageAnalytics(
        timeRange.start,
        timeRange.end,
        context,
      );
    }

    const recommendations = usageAnalytics
      ? this.convertAnalyticsRecommendations(usageAnalytics.recommendations)
      : this.generatePerformanceRecommendations(currentMetrics);

    const summary = this.generatePerformanceSummary(
      currentMetrics,
      usageAnalytics,
    );
    const overallStatus = this.determinePerformanceStatus(currentMetrics);

    return {
      timestamp: new Date(),
      overallStatus,
      performanceMetrics: currentMetrics,
      usageAnalytics,
      recommendations,
      summary,
      nextSteps: this.generatePerformanceNextSteps(
        currentMetrics,
        recommendations,
      ),
    };
  }

  /**
   * Start debug session
   */
  private async startDebugSession(
    options: SystemToolsOptions,
    context: EnhancedQueryContext,
  ): Promise<SystemHealthReport> {
    const debugSessionId =
      this.performanceAnalyzer.startDebuggingSession(context);
    const currentMetrics = await this.performanceAnalyzer.collectMetrics();

    const recommendations: CombinedRecommendation[] = [
      {
        category: "debugging",
        priority: "medium",
        title: "Debug Session Started",
        description: "Interactive debugging session is now active",
        source: "system-analysis",
        actionItems: [
          "Execute commands to capture debug information",
          "Monitor command performance and errors",
          "Review debug timeline for patterns",
        ],
        expectedImpact: "Better understanding of system behavior",
        estimatedEffort: "Ongoing monitoring",
      },
    ];

    const summary = this.generateDebugSummary(debugSessionId);

    return {
      timestamp: new Date(),
      overallStatus: "unknown",
      performanceMetrics: currentMetrics,
      recommendations,
      summary,
      nextSteps: [
        "Execute Redis commands to capture debug data",
        "Monitor performance metrics during operations",
        "Review debug session analysis when complete",
      ],
    };
  }

  /**
   * Generate comprehensive report
   */
  private async generateComprehensiveReport(
    options: SystemToolsOptions,
    context: EnhancedQueryContext,
    timeRange?: { start: Date; end: Date },
  ): Promise<SystemHealthReport> {
    // Collect all available data
    const [healthSession, currentMetrics] = await Promise.all([
      this.healthDiagnostics.startDiagnosticSession(context, {
        includePerformanceTests: true,
        verboseOutput: true,
        timeoutMs: 45000,
      }),
      this.performanceAnalyzer.collectMetrics(),
    ]);

    let usageAnalytics: UsageAnalytics | undefined;
    if (timeRange) {
      usageAnalytics = this.performanceAnalyzer.generateUsageAnalytics(
        timeRange.start,
        timeRange.end,
        context,
      );
    }

    // Combine recommendations from all sources
    const healthRecommendations = this.convertHealthRecommendations(
      healthSession.recommendations,
    );
    const performanceRecommendations =
      this.generatePerformanceRecommendations(currentMetrics);
    const analyticsRecommendations = usageAnalytics
      ? this.convertAnalyticsRecommendations(usageAnalytics.recommendations)
      : [];

    const allRecommendations = [
      ...healthRecommendations,
      ...performanceRecommendations,
      ...analyticsRecommendations,
    ].sort(
      (a, b) => this.priorityOrder(b.priority) - this.priorityOrder(a.priority),
    );

    // Determine overall status
    const healthStatus = this.determineOverallStatus(healthSession.diagnostics);
    const performanceStatus = this.determinePerformanceStatus(currentMetrics);
    const overallStatus = this.combineStatuses(healthStatus, performanceStatus);

    const summary = this.generateComprehensiveSummary(
      healthSession.diagnostics,
      currentMetrics,
      usageAnalytics,
    );

    return {
      timestamp: new Date(),
      overallStatus,
      healthDiagnostics: healthSession.diagnostics,
      performanceMetrics: currentMetrics,
      usageAnalytics,
      recommendations: allRecommendations,
      summary,
      nextSteps: this.generateComprehensiveNextSteps(
        allRecommendations,
        overallStatus,
      ),
    };
  }

  /**
   * Start interactive system session
   */
  async startInteractiveSession(
    context: EnhancedQueryContext,
  ): Promise<string> {
    const sessionId = `system-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const session: InteractiveSystemSession = {
      sessionId,
      startTime: new Date(),
      metricsCollected: [],
      userInteractions: [],
      currentContext: context,
    };

    this.activeSessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * Add user interaction to session
   */
  addUserInteraction(
    sessionId: string,
    query: string,
    response: string,
    followUpQuestions?: string[],
    actionsTaken?: string[],
  ): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.userInteractions.push({
        timestamp: new Date(),
        query,
        response,
        followUpQuestions,
        actionsTaken,
      });
    }
  }

  /**
   * Helper methods for status determination
   */
  private determineOverallStatus(
    diagnostics: HealthDiagnosticSuite,
  ): "healthy" | "warning" | "critical" | "unknown" {
    const allChecks = [
      ...diagnostics.connection,
      ...diagnostics.performance,
      ...diagnostics.memory,
      ...diagnostics.network,
      ...diagnostics.configuration,
      ...diagnostics.operations,
    ];

    if (allChecks.some((check) => check.status === "critical"))
      return "critical";
    if (allChecks.some((check) => check.status === "warning")) return "warning";
    if (allChecks.some((check) => check.status === "unknown")) return "unknown";
    return "healthy";
  }

  private determinePerformanceStatus(
    metrics: PerformanceMetrics,
  ): "healthy" | "warning" | "critical" | "unknown" {
    const { averageLatency } = metrics.commandMetrics;
    const { errorRate } = metrics.errorMetrics;
    const { percentage: memoryUsage } = metrics.resourceMetrics.memoryUsage;

    if (averageLatency > 100 || errorRate > 5 || memoryUsage > 95)
      return "critical";
    if (averageLatency > 50 || errorRate > 2 || memoryUsage > 85)
      return "warning";
    return "healthy";
  }

  private combineStatuses(
    status1: "healthy" | "warning" | "critical" | "unknown",
    status2: "healthy" | "warning" | "critical" | "unknown",
  ): "healthy" | "warning" | "critical" | "unknown" {
    const priority = { critical: 4, warning: 3, unknown: 2, healthy: 1 };
    return priority[status1] >= priority[status2] ? status1 : status2;
  }

  /**
   * Recommendation conversion methods
   */
  private convertHealthRecommendations(
    recommendations: DiagnosticRecommendation[],
  ): CombinedRecommendation[] {
    return recommendations.map((rec) => ({
      category: "health" as const,
      priority: rec.priority,
      title: rec.title,
      description: rec.description,
      source: "health-diagnostics" as const,
      actionItems: rec.actionItems,
      expectedImpact: rec.expectedImpact,
      estimatedEffort: rec.complexity,
    }));
  }

  private convertAnalyticsRecommendations(
    recommendations: AnalyticsRecommendation[],
  ): CombinedRecommendation[] {
    return recommendations.map((rec) => ({
      category: "performance" as const,
      priority:
        rec.impact === "high"
          ? "high"
          : rec.impact === "medium"
            ? "medium"
            : "low",
      title: rec.title,
      description: rec.description,
      source: "analytics" as const,
      actionItems: rec.implementation.map((step) => step.action),
      expectedImpact: rec.benefits.join(", "),
      estimatedEffort: rec.effort,
    }));
  }

  private generatePerformanceRecommendations(
    metrics: PerformanceMetrics,
  ): CombinedRecommendation[] {
    const recommendations: CombinedRecommendation[] = [];

    if (metrics.commandMetrics.averageLatency > 20) {
      recommendations.push({
        category: "performance",
        priority: "high",
        title: "Optimize Command Latency",
        description: "Average command latency is higher than optimal",
        source: "performance-metrics",
        actionItems: [
          "Review network connectivity",
          "Implement connection pooling",
          "Consider pipelining for bulk operations",
        ],
        expectedImpact: "Improved response times",
        estimatedEffort: "medium",
      });
    }

    if (metrics.errorMetrics.errorRate > 1) {
      recommendations.push({
        category: "performance",
        priority: "high",
        title: "Reduce Error Rate",
        description: "Error rate is above acceptable threshold",
        source: "performance-metrics",
        actionItems: [
          "Investigate common error patterns",
          "Implement retry logic",
          "Review error handling procedures",
        ],
        expectedImpact: "Better reliability",
        estimatedEffort: "medium",
      });
    }

    return recommendations;
  }

  /**
   * Summary generation methods
   */
  private generateHealthSummary(
    diagnostics: HealthDiagnosticSuite,
  ): SystemSummary {
    const allChecks = [
      ...diagnostics.connection,
      ...diagnostics.performance,
      ...diagnostics.memory,
      ...diagnostics.network,
      ...diagnostics.configuration,
      ...diagnostics.operations,
    ];

    const criticalIssues = allChecks.filter(
      (check) => check.status === "critical",
    ).length;
    const warnings = allChecks.filter(
      (check) => check.status === "warning",
    ).length;

    const keyMetrics: KeyMetric[] = [
      {
        name: "Connection Health",
        value: diagnostics.connection.every((c) => c.status === "healthy")
          ? "Good"
          : "Issues Found",
        status: diagnostics.connection.some((c) => c.status === "critical")
          ? "critical"
          : diagnostics.connection.some((c) => c.status === "warning")
            ? "warning"
            : "good",
      },
      {
        name: "Operations",
        value: diagnostics.operations.every((c) => c.status === "healthy")
          ? "Functioning"
          : "Issues Found",
        status: diagnostics.operations.some((c) => c.status === "critical")
          ? "critical"
          : "good",
      },
    ];

    return {
      status:
        criticalIssues > 0
          ? "Critical Issues Found"
          : warnings > 0
            ? "Warnings Present"
            : "All Systems Healthy",
      keyMetrics,
      criticalIssues,
      warnings,
      optimizationOpportunities: warnings,
    };
  }

  private generatePerformanceSummary(
    metrics: PerformanceMetrics,
    analytics?: UsageAnalytics,
  ): SystemSummary {
    const keyMetrics: KeyMetric[] = [
      {
        name: "Average Latency",
        value: `${metrics.commandMetrics.averageLatency.toFixed(1)}ms`,
        status:
          metrics.commandMetrics.averageLatency < 10
            ? "good"
            : metrics.commandMetrics.averageLatency < 50
              ? "warning"
              : "critical",
      },
      {
        name: "Commands/sec",
        value: metrics.commandMetrics.commandsPerSecond.toFixed(0),
        status: "good",
      },
      {
        name: "Error Rate",
        value: `${metrics.errorMetrics.errorRate.toFixed(2)}%`,
        status:
          metrics.errorMetrics.errorRate < 1
            ? "good"
            : metrics.errorMetrics.errorRate < 5
              ? "warning"
              : "critical",
      },
      {
        name: "Memory Usage",
        value: `${metrics.resourceMetrics.memoryUsage.percentage.toFixed(1)}%`,
        status:
          metrics.resourceMetrics.memoryUsage.percentage < 80
            ? "good"
            : metrics.resourceMetrics.memoryUsage.percentage < 95
              ? "warning"
              : "critical",
      },
    ];

    return {
      status: "Performance Analysis Complete",
      keyMetrics,
      criticalIssues: 0,
      warnings: 0,
      optimizationOpportunities: 2,
      uptimePercentage: analytics?.summary.uptimePercentage,
    };
  }

  private generateDebugSummary(debugSessionId: string): SystemSummary {
    return {
      status: "Debug Session Active",
      keyMetrics: [
        {
          name: "Session ID",
          value: debugSessionId,
          status: "good",
        },
        {
          name: "Status",
          value: "Collecting Data",
          status: "good",
        },
      ],
      criticalIssues: 0,
      warnings: 0,
      optimizationOpportunities: 0,
    };
  }

  private generateComprehensiveSummary(
    diagnostics: HealthDiagnosticSuite,
    metrics: PerformanceMetrics,
    analytics?: UsageAnalytics,
  ): SystemSummary {
    const healthSummary = this.generateHealthSummary(diagnostics);
    const performanceSummary = this.generatePerformanceSummary(
      metrics,
      analytics,
    );

    return {
      status: "Comprehensive Analysis Complete",
      keyMetrics: [
        ...healthSummary.keyMetrics,
        ...performanceSummary.keyMetrics,
      ],
      criticalIssues:
        healthSummary.criticalIssues + performanceSummary.criticalIssues,
      warnings: healthSummary.warnings + performanceSummary.warnings,
      optimizationOpportunities:
        healthSummary.optimizationOpportunities +
        performanceSummary.optimizationOpportunities,
      uptimePercentage: analytics?.summary.uptimePercentage,
    };
  }

  /**
   * Next steps generation methods
   */
  private generateHealthNextSteps(
    diagnostics: HealthDiagnosticSuite,
    recommendations: CombinedRecommendation[],
  ): string[] {
    const steps: string[] = [];

    const criticalRecs = recommendations.filter(
      (r) => r.priority === "critical",
    );
    if (criticalRecs.length > 0) {
      steps.push("Address critical health issues immediately");
    }

    if (diagnostics.connection.some((c) => c.status !== "healthy")) {
      steps.push("Review and fix connection issues");
    }

    if (diagnostics.configuration.some((c) => c.status !== "healthy")) {
      steps.push("Optimize Redis configuration settings");
    }

    steps.push("Set up continuous health monitoring");

    return steps;
  }

  private generatePerformanceNextSteps(
    metrics: PerformanceMetrics,
    recommendations: CombinedRecommendation[],
  ): string[] {
    const steps: string[] = [];

    if (metrics.commandMetrics.averageLatency > 20) {
      steps.push("Investigate and reduce command latency");
    }

    if (metrics.errorMetrics.errorRate > 1) {
      steps.push("Address error patterns and improve reliability");
    }

    if (metrics.resourceMetrics.memoryUsage.percentage > 80) {
      steps.push("Optimize memory usage and implement eviction policies");
    }

    steps.push("Implement continuous performance monitoring");

    return steps;
  }

  private generateComprehensiveNextSteps(
    recommendations: CombinedRecommendation[],
    overallStatus: "healthy" | "warning" | "critical" | "unknown",
  ): string[] {
    const steps: string[] = [];

    if (overallStatus === "critical") {
      steps.push(
        "Address critical issues immediately to restore system stability",
      );
    }

    const highPriorityRecs = recommendations.filter(
      (r) => r.priority === "high" || r.priority === "critical",
    );
    if (highPriorityRecs.length > 0) {
      steps.push(
        `Implement ${highPriorityRecs.length} high-priority recommendations`,
      );
    }

    steps.push("Set up comprehensive monitoring and alerting");
    steps.push("Schedule regular system health reviews");
    steps.push("Document system configuration and procedures");

    return steps;
  }

  /**
   * Utility methods
   */
  private priorityOrder(priority: string): number {
    const order = { critical: 4, high: 3, medium: 2, low: 1 };
    return order[priority as keyof typeof order] || 0;
  }

  /**
   * Get active session
   */
  getSession(sessionId: string): InteractiveSystemSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Get all active sessions
   */
  getAllSessions(): InteractiveSystemSession[] {
    return Array.from(this.activeSessions.values());
  }
}

// Export all types and main class
export {
  InteractiveHealthDiagnostics,
  PerformanceMetricsAnalyzer,
  type HealthDiagnosticSuite,
  type PerformanceMetrics,
  type UsageAnalytics,
  type DebuggingContext,
};

// Export convenience function
export const createSystemTools = () => new EnhancedSystemTools();
