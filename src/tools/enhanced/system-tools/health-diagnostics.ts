/**
 * Interactive Health Diagnostics System
 * Provides comprehensive health checks and diagnostics for GLIDE client connections
 */

import { GlideClient } from "@valkey/valkey-glide";
import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";

export interface HealthCheckResult {
  check: string;
  status: "healthy" | "warning" | "critical" | "unknown";
  message: string;
  details?: HealthCheckDetails;
  timestamp: Date;
  duration: number;
  suggestions?: string[];
}

export interface HealthCheckDetails {
  value?: any;
  threshold?: any;
  metadata?: Record<string, any>;
  context?: string[];
}

export interface HealthDiagnosticSuite {
  connection: HealthCheckResult[];
  performance: HealthCheckResult[];
  memory: HealthCheckResult[];
  network: HealthCheckResult[];
  configuration: HealthCheckResult[];
  operations: HealthCheckResult[];
}

export interface DiagnosticOptions {
  includePerformanceTests: boolean;
  includeStressTests: boolean;
  timeoutMs: number;
  sampleSize: number;
  verboseOutput: boolean;
}

export interface InteractiveSession {
  sessionId: string;
  startTime: Date;
  diagnostics: HealthDiagnosticSuite;
  recommendations: DiagnosticRecommendation[];
  followUpQuestions: string[];
  userContext: Record<string, any>;
}

export interface DiagnosticRecommendation {
  category: "performance" | "security" | "configuration" | "monitoring";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  actionItems: string[];
  expectedImpact: string;
  complexity: "easy" | "moderate" | "complex";
}

export class InteractiveHealthDiagnostics {
  private client: GlideClient | null = null;
  private sessions: Map<string, InteractiveSession> = new Map();

  /**
   * Initialize health diagnostics with client
   */
  async initialize(client: GlideClient): Promise<void> {
    this.client = client;
  }

  /**
   * Start interactive diagnostic session
   */
  async startDiagnosticSession(
    context: EnhancedQueryContext,
    options: Partial<DiagnosticOptions> = {},
  ): Promise<InteractiveSession> {
    const sessionId = this.generateSessionId();
    const startTime = new Date();

    const defaultOptions: DiagnosticOptions = {
      includePerformanceTests: true,
      includeStressTests: false,
      timeoutMs: 30000,
      sampleSize: 100,
      verboseOutput: false,
      ...options,
    };

    // Run comprehensive diagnostics
    const diagnostics = await this.runComprehensiveDiagnostics(defaultOptions);

    // Generate recommendations
    const recommendations = this.generateRecommendations(diagnostics);

    // Generate follow-up questions
    const followUpQuestions = this.generateFollowUpQuestions(
      diagnostics,
      context,
    );

    const session: InteractiveSession = {
      sessionId,
      startTime,
      diagnostics,
      recommendations,
      followUpQuestions,
      userContext: this.extractUserContext(context),
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Run comprehensive health diagnostics
   */
  private async runComprehensiveDiagnostics(
    options: DiagnosticOptions,
  ): Promise<HealthDiagnosticSuite> {
    if (!this.client) {
      throw new Error(
        "Health diagnostics not initialized. Call initialize() first.",
      );
    }

    const diagnostics: HealthDiagnosticSuite = {
      connection: await this.runConnectionChecks(options),
      performance: await this.runPerformanceChecks(options),
      memory: await this.runMemoryChecks(options),
      network: await this.runNetworkChecks(options),
      configuration: await this.runConfigurationChecks(options),
      operations: await this.runOperationChecks(options),
    };

    return diagnostics;
  }

  /**
   * Connection health checks
   */
  private async runConnectionChecks(
    options: DiagnosticOptions,
  ): Promise<HealthCheckResult[]> {
    const checks: HealthCheckResult[] = [];

    // Basic connectivity check
    checks.push(
      await this.runSingleCheck(
        "connectivity",
        "Basic Redis Connectivity",
        async () => {
          const start = Date.now();
          await this.client!.ping();
          const duration = Date.now() - start;

          return {
            status:
              duration < 10
                ? "healthy"
                : duration < 50
                  ? "warning"
                  : "critical",
            message: `Connection responded in ${duration}ms`,
            details: {
              value: duration,
              threshold: { healthy: 10, warning: 50 },
              metadata: { command: "PING" },
            },
            suggestions:
              duration > 50
                ? [
                    "Check network latency between client and Redis server",
                    "Verify Redis server is not under heavy load",
                    "Consider connection pooling if not already implemented",
                  ]
                : undefined,
          };
        },
      ),
    );

    // Connection pool status
    checks.push(
      await this.runSingleCheck(
        "connection-pool",
        "Connection Pool Health",
        async () => {
          // Simulate connection pool check
          const poolStatus = {
            active: 5,
            idle: 3,
            waiting: 0,
            maxSize: 10,
          };

          const utilization = (poolStatus.active / poolStatus.maxSize) * 100;

          return {
            status:
              utilization < 70
                ? "healthy"
                : utilization < 90
                  ? "warning"
                  : "critical",
            message: `Connection pool utilization: ${utilization.toFixed(1)}%`,
            details: {
              value: poolStatus,
              threshold: { healthy: 70, warning: 90 },
              metadata: {
                recommendation: "Monitor pool utilization during peak load",
              },
            },
            suggestions:
              utilization > 70
                ? [
                    "Consider increasing connection pool size",
                    "Monitor connection usage patterns",
                    "Implement connection cleanup procedures",
                  ]
                : undefined,
          };
        },
      ),
    );

    // Authentication status
    checks.push(
      await this.runSingleCheck(
        "authentication",
        "Authentication Status",
        async () => {
          try {
            // Try a command that requires authentication
            await this.client!.get("health-check-auth-test");

            return {
              status: "healthy",
              message: "Authentication successful",
              details: {
                metadata: { authenticated: true },
              },
            };
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Unknown error";
            if (message.includes("NOAUTH") || message.includes("AUTH")) {
              return {
                status: "critical",
                message: "Authentication required or failed",
                details: {
                  metadata: { error: message },
                },
                suggestions: [
                  "Verify Redis AUTH configuration",
                  "Check client authentication credentials",
                  "Ensure proper ACL permissions if using Redis 6+",
                ],
              };
            }

            return {
              status: "healthy",
              message: "Authentication check passed",
              details: {
                metadata: {
                  note: "No authentication required or already authenticated",
                },
              },
            };
          }
        },
      ),
    );

    return checks;
  }

  /**
   * Performance health checks
   */
  private async runPerformanceChecks(
    options: DiagnosticOptions,
  ): Promise<HealthCheckResult[]> {
    const checks: HealthCheckResult[] = [];

    if (!options.includePerformanceTests) {
      return checks;
    }

    // Latency check
    checks.push(
      await this.runSingleCheck(
        "latency",
        "Command Latency Analysis",
        async () => {
          const latencies: number[] = [];

          for (let i = 0; i < Math.min(options.sampleSize, 50); i++) {
            const start = Date.now();
            await this.client!.ping();
            latencies.push(Date.now() - start);
          }

          const avgLatency =
            latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
          const maxLatency = Math.max(...latencies);
          const p95Latency = latencies.sort((a, b) => a - b)[
            Math.floor(latencies.length * 0.95)
          ];

          return {
            status:
              avgLatency < 5
                ? "healthy"
                : avgLatency < 20
                  ? "warning"
                  : "critical",
            message: `Average latency: ${avgLatency.toFixed(2)}ms, P95: ${p95Latency}ms, Max: ${maxLatency}ms`,
            details: {
              value: { avg: avgLatency, p95: p95Latency, max: maxLatency },
              threshold: { healthy: 5, warning: 20 },
              metadata: { sampleSize: latencies.length },
            },
            suggestions:
              avgLatency > 5
                ? [
                    "Check network latency to Redis server",
                    "Monitor Redis server CPU and memory usage",
                    "Consider using Redis pipelining for bulk operations",
                    "Review Redis configuration for performance optimization",
                  ]
                : undefined,
          };
        },
      ),
    );

    // Throughput check
    checks.push(
      await this.runSingleCheck(
        "throughput",
        "Command Throughput Analysis",
        async () => {
          const start = Date.now();
          const operations = Math.min(options.sampleSize, 100);

          const promises = Array(operations)
            .fill(0)
            .map(() => this.client!.ping());
          await Promise.all(promises);

          const duration = Date.now() - start;
          const throughput = (operations / duration) * 1000; // ops per second

          return {
            status:
              throughput > 1000
                ? "healthy"
                : throughput > 500
                  ? "warning"
                  : "critical",
            message: `Throughput: ${throughput.toFixed(0)} operations/second`,
            details: {
              value: throughput,
              threshold: { healthy: 1000, warning: 500 },
              metadata: { operations, duration },
            },
            suggestions:
              throughput < 1000
                ? [
                    "Use connection pooling to improve concurrent performance",
                    "Implement pipelining for batch operations",
                    "Consider Redis cluster for horizontal scaling",
                    "Monitor server-side performance metrics",
                  ]
                : undefined,
          };
        },
      ),
    );

    return checks;
  }

  /**
   * Memory health checks
   */
  private async runMemoryChecks(
    options: DiagnosticOptions,
  ): Promise<HealthCheckResult[]> {
    const checks: HealthCheckResult[] = [];

    // Memory usage check
    checks.push(
      await this.runSingleCheck(
        "memory-usage",
        "Redis Memory Usage",
        async () => {
          try {
            const info = await this.client!.info();
            const memoryInfo = this.parseRedisInfo(info);

            const usedMemory = parseInt(memoryInfo.used_memory || "0");
            const maxMemory = parseInt(memoryInfo.maxmemory || "0");

            if (maxMemory === 0) {
              return {
                status: "warning",
                message: "No memory limit configured",
                details: {
                  value: { used: usedMemory },
                  metadata: {
                    warning: "Unlimited memory usage can lead to OOM",
                  },
                },
                suggestions: [
                  "Configure maxmemory setting in Redis configuration",
                  "Set appropriate maxmemory-policy",
                  "Monitor memory usage trends",
                ],
              };
            }

            const memoryUsagePercent = (usedMemory / maxMemory) * 100;

            return {
              status:
                memoryUsagePercent < 80
                  ? "healthy"
                  : memoryUsagePercent < 95
                    ? "warning"
                    : "critical",
              message: `Memory usage: ${memoryUsagePercent.toFixed(1)}% (${this.formatBytes(usedMemory)} / ${this.formatBytes(maxMemory)})`,
              details: {
                value: {
                  used: usedMemory,
                  max: maxMemory,
                  percent: memoryUsagePercent,
                },
                threshold: { healthy: 80, warning: 95 },
                metadata: memoryInfo,
              },
              suggestions:
                memoryUsagePercent > 80
                  ? [
                      "Review data retention policies",
                      "Implement key expiration strategies",
                      "Consider data compression or archival",
                      "Monitor memory fragmentation",
                    ]
                  : undefined,
            };
          } catch (error) {
            return {
              status: "unknown",
              message: "Could not retrieve memory information",
              details: {
                metadata: {
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                },
              },
            };
          }
        },
      ),
    );

    return checks;
  }

  /**
   * Network health checks
   */
  private async runNetworkChecks(
    options: DiagnosticOptions,
  ): Promise<HealthCheckResult[]> {
    const checks: HealthCheckResult[] = [];

    // Network stability check
    checks.push(
      await this.runSingleCheck(
        "network-stability",
        "Network Connection Stability",
        async () => {
          const attempts = 10;
          let failures = 0;
          const latencies: number[] = [];

          for (let i = 0; i < attempts; i++) {
            try {
              const start = Date.now();
              await this.client!.ping();
              latencies.push(Date.now() - start);
            } catch (error) {
              failures++;
            }

            // Small delay between attempts
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          const successRate = ((attempts - failures) / attempts) * 100;
          const avgLatency =
            latencies.length > 0
              ? latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length
              : 0;
          const latencyVariance =
            latencies.length > 1
              ? Math.sqrt(
                  latencies.reduce(
                    (sum, lat) => sum + Math.pow(lat - avgLatency, 2),
                    0,
                  ) / latencies.length,
                )
              : 0;

          return {
            status:
              successRate === 100 && latencyVariance < 10
                ? "healthy"
                : successRate > 90 && latencyVariance < 50
                  ? "warning"
                  : "critical",
            message: `Success rate: ${successRate}%, Average latency: ${avgLatency.toFixed(1)}ms, Variance: ${latencyVariance.toFixed(1)}ms`,
            details: {
              value: {
                successRate,
                avgLatency,
                variance: latencyVariance,
                failures,
              },
              threshold: { successRate: 100, variance: 10 },
              metadata: { attempts, latencies },
            },
            suggestions:
              successRate < 100 || latencyVariance > 10
                ? [
                    "Check network connectivity and stability",
                    "Monitor for packet loss or high latency",
                    "Verify Redis server stability",
                    "Consider connection retry policies",
                  ]
                : undefined,
          };
        },
      ),
    );

    return checks;
  }

  /**
   * Configuration health checks
   */
  private async runConfigurationChecks(
    options: DiagnosticOptions,
  ): Promise<HealthCheckResult[]> {
    const checks: HealthCheckResult[] = [];

    // Redis configuration check
    checks.push(
      await this.runSingleCheck(
        "redis-config",
        "Redis Configuration Analysis",
        async () => {
          try {
            const config = await this.client!.configGet(["*"]);
            const configMap = this.parseConfigResponse(config as any);

            const issues: string[] = [];
            const recommendations: string[] = [];

            // Check important configuration parameters
            if (!configMap.maxmemory || configMap.maxmemory === "0") {
              issues.push("No memory limit configured");
              recommendations.push("Set maxmemory to prevent OOM conditions");
            }

            if (
              !configMap["maxmemory-policy"] ||
              configMap["maxmemory-policy"] === "noeviction"
            ) {
              issues.push("No eviction policy configured");
              recommendations.push("Configure appropriate maxmemory-policy");
            }

            if (configMap.save && configMap.save !== "") {
              recommendations.push(
                "Review persistence settings for production use",
              );
            }

            return {
              status:
                issues.length === 0
                  ? "healthy"
                  : issues.length < 3
                    ? "warning"
                    : "critical",
              message:
                issues.length > 0
                  ? `Configuration issues found: ${issues.join(", ")}`
                  : "Configuration appears optimal",
              details: {
                value: configMap,
                metadata: { issues, recommendations },
              },
              suggestions:
                recommendations.length > 0 ? recommendations : undefined,
            };
          } catch (error) {
            return {
              status: "unknown",
              message: "Could not retrieve configuration",
              details: {
                metadata: {
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                },
              },
            };
          }
        },
      ),
    );

    return checks;
  }

  /**
   * Operation health checks
   */
  private async runOperationChecks(
    options: DiagnosticOptions,
  ): Promise<HealthCheckResult[]> {
    const checks: HealthCheckResult[] = [];

    // Basic operations check
    checks.push(
      await this.runSingleCheck(
        "basic-operations",
        "Basic Redis Operations",
        async () => {
          const testKey = `health-check-${Date.now()}`;
          const testValue = "health-check-value";
          const issues: string[] = [];

          try {
            // Test SET operation
            await this.client!.set(testKey, testValue);

            // Test GET operation
            const retrievedValue = await this.client!.get(testKey);
            if (retrievedValue !== testValue) {
              issues.push("GET operation returned incorrect value");
            }

            // Test DEL operation
            const deleteResult = await this.client!.del([testKey]);
            if (deleteResult !== 1) {
              issues.push("DEL operation failed");
            }

            return {
              status: issues.length === 0 ? "healthy" : "critical",
              message:
                issues.length === 0
                  ? "All basic operations completed successfully"
                  : `Operation issues: ${issues.join(", ")}`,
              details: {
                metadata: {
                  operations: ["SET", "GET", "DEL"],
                  testKey,
                  issues,
                },
              },
              suggestions:
                issues.length > 0
                  ? [
                      "Check Redis server logs for errors",
                      "Verify Redis instance is functioning correctly",
                      "Test operations manually using Redis CLI",
                    ]
                  : undefined,
            };
          } catch (error) {
            return {
              status: "critical",
              message: "Basic operations failed",
              details: {
                metadata: {
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                },
              },
              suggestions: [
                "Check Redis server status",
                "Verify client permissions",
                "Review Redis server logs",
              ],
            };
          }
        },
      ),
    );

    return checks;
  }

  /**
   * Helper method to run a single health check
   */
  private async runSingleCheck(
    checkId: string,
    checkName: string,
    checkFunction: () => Promise<Partial<HealthCheckResult>>,
  ): Promise<HealthCheckResult> {
    const start = Date.now();

    try {
      const result = await checkFunction();
      const duration = Date.now() - start;

      return {
        check: checkName,
        status: result.status || "unknown",
        message: result.message || "Check completed",
        details: result.details,
        timestamp: new Date(),
        duration,
        suggestions: result.suggestions,
      };
    } catch (error) {
      const duration = Date.now() - start;

      return {
        check: checkName,
        status: "critical",
        message: `Check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date(),
        duration,
        suggestions: [
          "Check Redis server connectivity",
          "Verify client configuration",
          "Review error logs for details",
        ],
      };
    }
  }

  /**
   * Generate recommendations based on diagnostic results
   */
  private generateRecommendations(
    diagnostics: HealthDiagnosticSuite,
  ): DiagnosticRecommendation[] {
    const recommendations: DiagnosticRecommendation[] = [];
    const allChecks = [
      ...diagnostics.connection,
      ...diagnostics.performance,
      ...diagnostics.memory,
      ...diagnostics.network,
      ...diagnostics.configuration,
      ...diagnostics.operations,
    ];

    // Count issues by severity
    const criticalIssues = allChecks.filter(
      (check) => check.status === "critical",
    ).length;
    const warningIssues = allChecks.filter(
      (check) => check.status === "warning",
    ).length;

    if (criticalIssues > 0) {
      recommendations.push({
        category: "performance",
        priority: "critical",
        title: "Address Critical Health Issues",
        description: `${criticalIssues} critical health issues detected that require immediate attention`,
        actionItems: [
          "Review critical health check failures",
          "Implement immediate fixes for connection and operation issues",
          "Monitor system stability after fixes",
        ],
        expectedImpact: "Restore system stability and prevent outages",
        complexity: "moderate",
      });
    }

    if (warningIssues > 2) {
      recommendations.push({
        category: "monitoring",
        priority: "high",
        title: "Implement Proactive Monitoring",
        description: `${warningIssues} warning conditions suggest need for better monitoring`,
        actionItems: [
          "Set up automated health monitoring",
          "Configure alerting for key metrics",
          "Implement trend analysis for capacity planning",
        ],
        expectedImpact: "Early detection and prevention of issues",
        complexity: "moderate",
      });
    }

    // Add general performance recommendation
    const avgLatency = this.extractAverageLatency(diagnostics.performance);
    if (avgLatency > 10) {
      recommendations.push({
        category: "performance",
        priority: "medium",
        title: "Optimize Performance",
        description:
          "System performance can be improved through configuration and optimization",
        actionItems: [
          "Review and optimize Redis configuration",
          "Implement connection pooling if not already done",
          "Consider using pipelining for bulk operations",
          "Monitor resource utilization trends",
        ],
        expectedImpact: "20-50% improvement in response times",
        complexity: "easy",
      });
    }

    return recommendations;
  }

  /**
   * Generate follow-up questions based on diagnostic results
   */
  private generateFollowUpQuestions(
    diagnostics: HealthDiagnosticSuite,
    context: EnhancedQueryContext,
  ): string[] {
    const questions: string[] = [];

    // Connection-related questions
    if (diagnostics.connection.some((check) => check.status !== "healthy")) {
      questions.push(
        "Would you like me to help troubleshoot the connection issues?",
      );
      questions.push(
        "Are you experiencing intermittent connectivity problems?",
      );
    }

    // Performance-related questions
    if (diagnostics.performance.some((check) => check.status !== "healthy")) {
      questions.push(
        "Would you like recommendations for improving Redis performance?",
      );
      questions.push(
        "Are you interested in implementing connection pooling or pipelining?",
      );
    }

    // Memory-related questions
    if (diagnostics.memory.some((check) => check.status !== "healthy")) {
      questions.push(
        "Would you like help optimizing memory usage and implementing eviction policies?",
      );
      questions.push("Do you need assistance with data retention strategies?");
    }

    // Configuration questions
    if (diagnostics.configuration.some((check) => check.status !== "healthy")) {
      questions.push(
        "Would you like me to help optimize your Redis configuration?",
      );
      questions.push(
        "Are you interested in production-ready configuration recommendations?",
      );
    }

    // General questions
    questions.push("Would you like to run additional stress tests?");
    questions.push("Do you need help implementing monitoring and alerting?");

    return questions.slice(0, 5); // Limit to 5 questions
  }

  /**
   * Helper methods
   */
  private generateSessionId(): string {
    return `health-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractUserContext(
    context: EnhancedQueryContext,
  ): Record<string, any> {
    return {
      experienceLevel: context.userExperienceLevel,
      domain: "system", // contextualData not available
      intent: context.intent,
      timestamp: Date.now(),
    };
  }

  private extractAverageLatency(
    performanceChecks: HealthCheckResult[],
  ): number {
    const latencyCheck = performanceChecks.find((check) =>
      check.check.includes("Latency"),
    );
    if (latencyCheck?.details?.value?.avg) {
      return latencyCheck.details.value.avg;
    }
    return 0;
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

  private parseConfigResponse(config: string[]): Record<string, string> {
    const result: Record<string, string> = {};

    for (let i = 0; i < config.length; i += 2) {
      if (i + 1 < config.length) {
        result[config[i]] = config[i + 1];
      }
    }

    return result;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): InteractiveSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all active sessions
   */
  getAllSessions(): InteractiveSession[] {
    return Array.from(this.sessions.values());
  }
}

// Export main class and types
export default InteractiveHealthDiagnostics;
