/**
 * API Coverage Validator
 * Integrates with validate-api-coverage.ts for comprehensive coverage tracking and validation
 */

import { CommandRegistry } from "./command-registry.js";
import { ApiInventoryManager } from "./api-inventory.js";

export interface ValidationResult {
  totalGlideApis: number;
  coveredApis: Set<string>;
  missingApis: Set<string>;
  coveragePercentage: number;
  missingByCategory: Record<string, string[]>;
  migrationGaps: {
    ioredis: string[];
    nodeRedis: string[];
  };
  qualityMetrics: QualityMetrics;
  recommendations: ValidationRecommendation[];
}

export interface QualityMetrics {
  completeness: number; // 0-100%
  accuracy: number; // 0-100%
  usability: number; // 0-100%
  performance: number; // 0-100%
  overall: number; // 0-100%
  breakdown: {
    documentationCoverage: number;
    exampleQuality: number;
    migrationComplexity: number;
    performanceData: number;
  };
}

export interface ValidationRecommendation {
  type: "critical" | "high" | "medium" | "low";
  category:
    | "coverage"
    | "documentation"
    | "examples"
    | "migration"
    | "performance";
  title: string;
  description: string;
  impact: string;
  actionItems: string[];
  priority: number;
}

export interface CoverageReport {
  timestamp: Date;
  validation: ValidationResult;
  trends: CoverageTrend[];
  summary: ReportSummary;
}

export interface CoverageTrend {
  date: Date;
  totalApis: number;
  coveredApis: number;
  coveragePercentage: number;
}

export interface ReportSummary {
  status: "excellent" | "good" | "needs-improvement" | "critical";
  keyFindings: string[];
  nextActions: string[];
  estimatedEffort: string;
}

export class CoverageValidator {
  private static validationHistory: ValidationResult[] = [];
  private static lastValidation: Date | null = null;

  /**
   * Perform comprehensive API coverage validation
   */
  static async validateCoverage(): Promise<ValidationResult> {
    // Load current inventory and registry data
    await ApiInventoryManager.loadInventory();
    const inventory = ApiInventoryManager.getInventory();
    const registryCommands = CommandRegistry.getAllCommands();

    if (!inventory) {
      throw new Error("Failed to load API inventory");
    }

    const result: ValidationResult = {
      totalGlideApis: 0,
      coveredApis: new Set(),
      missingApis: new Set(),
      coveragePercentage: 0,
      missingByCategory: {},
      migrationGaps: { ioredis: [], nodeRedis: [] },
      qualityMetrics: this.calculateQualityMetrics(),
      recommendations: [],
    };

    // Extract all GLIDE methods from inventory
    const glideApis = this.extractGlideApis(inventory);
    result.totalGlideApis = glideApis.size;

    // Check coverage against registry
    for (const api of glideApis) {
      const command = CommandRegistry.getCommand(api);
      if (command) {
        result.coveredApis.add(api);
      } else {
        result.missingApis.add(api);
      }
    }

    // Calculate coverage percentage
    result.coveragePercentage =
      (result.coveredApis.size / result.totalGlideApis) * 100;

    // Analyze missing APIs by category
    result.missingByCategory = this.categorizeMissingApis(
      result.missingApis,
      inventory,
    );

    // Identify migration gaps
    result.migrationGaps = this.identifyMigrationGaps();

    // Generate recommendations
    result.recommendations = this.generateRecommendations(result);

    // Store validation result
    this.validationHistory.push(result);
    this.lastValidation = new Date();

    return result;
  }

  /**
   * Extract all GLIDE API methods from inventory
   */
  private static extractGlideApis(inventory: any): Set<string> {
    const apis = new Set<string>();

    // Extract from glideClient and glideClusterClient
    if (inventory.glideClient) {
      inventory.glideClient.forEach((method: any) => {
        apis.add(method.name.toUpperCase());
      });
    }

    if (inventory.glideClusterClient) {
      inventory.glideClusterClient.forEach((method: any) => {
        apis.add(method.name.toUpperCase());
      });
    }

    // Extract from commands if available
    if (inventory.commands) {
      inventory.commands.forEach((command: any) => {
        apis.add(command.name.toUpperCase());
      });
    }

    return apis;
  }

  /**
   * Categorize missing APIs by Redis command categories
   */
  private static categorizeMissingApis(
    missingApis: Set<string>,
    inventory: any,
  ): Record<string, string[]> {
    const categorized: Record<string, string[]> = {};

    const categoryPatterns = {
      strings:
        /^(GET|SET|MGET|MSET|INCR|DECR|APPEND|STRLEN|DEL|EXISTS|EXPIRE|TTL)/,
      hashes: /^H(GET|SET|DEL|EXISTS|KEYS|VALS|LEN|GETALL|MGET|MSET)/,
      lists: /^(L|R)(PUSH|POP|LEN|RANGE|INDEX|SET|TRIM|REM)|^B(L|R)POP/,
      sets: /^S(ADD|REM|MEMBERS|CARD|ISMEMBER|INTER|UNION|DIFF|POP|RANDMEMBER)/,
      sortedsets: /^Z(ADD|REM|RANGE|RANK|SCORE|CARD|COUNT|INTER|UNION)/,
      streams: /^X(ADD|READ|LEN|RANGE|DEL|GROUP|ACK|READGROUP)/,
      geo: /^GEO(ADD|DIST|HASH|POS|RADIUS|SEARCH)/,
      pubsub: /^P?(PUBLISH|SUBSCRIBE|UNSUBSCRIBE)/,
      scripting: /^(EVAL|EVALSHA|SCRIPT)/,
      transactions: /^(MULTI|EXEC|DISCARD|WATCH|UNWATCH)/,
      connection: /^(PING|ECHO|SELECT|AUTH|QUIT)/,
      server: /^(INFO|CONFIG|FLUSHDB|FLUSHALL|DBSIZE|TIME)/,
    };

    for (const api of missingApis) {
      let categoryFound = false;

      for (const [category, pattern] of Object.entries(categoryPatterns)) {
        if (pattern.test(api)) {
          if (!categorized[category]) {
            categorized[category] = [];
          }
          categorized[category].push(api);
          categoryFound = true;
          break;
        }
      }

      if (!categoryFound) {
        if (!categorized["other"]) {
          categorized["other"] = [];
        }
        categorized["other"].push(api);
      }
    }

    return categorized;
  }

  /**
   * Identify migration gaps for legacy clients
   */
  private static identifyMigrationGaps(): {
    ioredis: string[];
    nodeRedis: string[];
  } {
    const crossRefs = CommandRegistry.getCrossReferences();
    const allCommands = CommandRegistry.getAllCommands();

    const gaps = {
      ioredis: [] as string[],
      nodeRedis: [] as string[],
    };

    // Check for commands without ioredis mappings
    for (const command of allCommands) {
      const ioredisMapping = crossRefs.ioredisToGlide.get(
        command.name.toLowerCase(),
      );
      const nodeRedisMapping = crossRefs.nodeRedisToGlide.get(
        command.name.toLowerCase(),
      );

      if (!ioredisMapping && command.migration.ioredis) {
        gaps.ioredis.push(command.name);
      }

      if (!nodeRedisMapping && command.migration.nodeRedis) {
        gaps.nodeRedis.push(command.name);
      }
    }

    return gaps;
  }

  /**
   * Calculate quality metrics for the API coverage
   */
  private static calculateQualityMetrics(): QualityMetrics {
    const commands = CommandRegistry.getAllCommands();
    const totalCommands = commands.length;

    if (totalCommands === 0) {
      return {
        completeness: 0,
        accuracy: 0,
        usability: 0,
        performance: 0,
        overall: 0,
        breakdown: {
          documentationCoverage: 0,
          exampleQuality: 0,
          migrationComplexity: 0,
          performanceData: 0,
        },
      };
    }

    // Calculate individual metrics
    const withExamples = commands.filter(
      (cmd) => cmd.examples.length > 0,
    ).length;
    const withUseCases = commands.filter(
      (cmd) => cmd.useCases.length > 0,
    ).length;
    const withMigration = commands.filter(
      (cmd) => cmd.migration.complexityRating > 0,
    ).length;
    const withPerformance = commands.filter(
      (cmd) => cmd.performance.timeComplexity !== "O(?)",
    ).length;

    const documentationCoverage = (withUseCases / totalCommands) * 100;
    const exampleQuality = (withExamples / totalCommands) * 100;
    const migrationComplexity = (withMigration / totalCommands) * 100;
    const performanceData = (withPerformance / totalCommands) * 100;

    const completeness = documentationCoverage;
    const accuracy = exampleQuality;
    const usability = (exampleQuality + documentationCoverage) / 2;
    const performance = performanceData;
    const overall = (completeness + accuracy + usability + performance) / 4;

    return {
      completeness,
      accuracy,
      usability,
      performance,
      overall,
      breakdown: {
        documentationCoverage,
        exampleQuality,
        migrationComplexity,
        performanceData,
      },
    };
  }

  /**
   * Generate actionable recommendations based on validation results
   */
  private static generateRecommendations(
    result: ValidationResult,
  ): ValidationRecommendation[] {
    const recommendations: ValidationRecommendation[] = [];

    // Coverage recommendations
    if (result.coveragePercentage < 80) {
      recommendations.push({
        type: "critical",
        category: "coverage",
        title: "Low API Coverage",
        description: `Only ${result.coveragePercentage.toFixed(1)}% of GLIDE APIs are documented`,
        impact: "Users may not discover available functionality",
        actionItems: [
          "Add missing API definitions to CommandRegistry",
          "Prioritize high-usage commands first",
          "Implement automated coverage tracking",
        ],
        priority: 1,
      });
    }

    // Category-specific recommendations
    for (const [category, missingCommands] of Object.entries(
      result.missingByCategory,
    )) {
      if (missingCommands.length > 3) {
        recommendations.push({
          type: "high",
          category: "coverage",
          title: `Missing ${category} Commands`,
          description: `${missingCommands.length} ${category} commands are not documented`,
          impact: `Limited support for ${category} use cases`,
          actionItems: [
            `Add definitions for: ${missingCommands.slice(0, 3).join(", ")}`,
            `Create usage examples for ${category} patterns`,
            `Document common ${category} workflows`,
          ],
          priority: 2,
        });
      }
    }

    // Migration gap recommendations
    if (result.migrationGaps.ioredis.length > 0) {
      recommendations.push({
        type: "medium",
        category: "migration",
        title: "IORedis Migration Gaps",
        description: `${result.migrationGaps.ioredis.length} commands lack ioredis migration info`,
        impact: "Difficult migration from ioredis",
        actionItems: [
          "Add ioredis equivalent mappings",
          "Document parameter differences",
          "Provide migration examples",
        ],
        priority: 3,
      });
    }

    // Quality recommendations
    if (result.qualityMetrics.overall < 70) {
      recommendations.push({
        type: "medium",
        category: "documentation",
        title: "Documentation Quality Issues",
        description: `Overall quality score is ${result.qualityMetrics.overall.toFixed(1)}%`,
        impact: "Poor user experience and adoption",
        actionItems: [
          "Add more code examples",
          "Improve use case descriptions",
          "Add performance characteristics",
        ],
        priority: 4,
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Generate comprehensive coverage report
   */
  static async generateReport(): Promise<CoverageReport> {
    const validation = await this.validateCoverage();
    const trends = this.calculateTrends();

    return {
      timestamp: new Date(),
      validation,
      trends,
      summary: this.generateSummary(validation),
    };
  }

  /**
   * Calculate coverage trends over time
   */
  private static calculateTrends(): CoverageTrend[] {
    return this.validationHistory.slice(-10).map((result, index) => ({
      date: new Date(Date.now() - (10 - index) * 24 * 60 * 60 * 1000), // Mock dates
      totalApis: result.totalGlideApis,
      coveredApis: result.coveredApis.size,
      coveragePercentage: result.coveragePercentage,
    }));
  }

  /**
   * Generate executive summary
   */
  private static generateSummary(validation: ValidationResult): ReportSummary {
    const coverage = validation.coveragePercentage;
    const quality = validation.qualityMetrics.overall;

    let status: ReportSummary["status"];
    if (coverage >= 90 && quality >= 80) status = "excellent";
    else if (coverage >= 80 && quality >= 70) status = "good";
    else if (coverage >= 60 && quality >= 50) status = "needs-improvement";
    else status = "critical";

    const keyFindings = [
      `${coverage.toFixed(1)}% API coverage (${validation.coveredApis.size}/${validation.totalGlideApis})`,
      `${quality.toFixed(1)}% overall quality score`,
      `${validation.recommendations.filter((r) => r.type === "critical").length} critical issues found`,
    ];

    const nextActions = validation.recommendations
      .slice(0, 3)
      .map((r) => r.title);

    const estimatedEffort = this.estimateEffort(validation);

    return { status, keyFindings, nextActions, estimatedEffort };
  }

  /**
   * Estimate effort required for improvements
   */
  private static estimateEffort(validation: ValidationResult): string {
    const missingCount = validation.missingApis.size;
    const criticalIssues = validation.recommendations.filter(
      (r) => r.type === "critical",
    ).length;

    if (missingCount > 50 || criticalIssues > 5) return "2-3 weeks";
    if (missingCount > 20 || criticalIssues > 2) return "1-2 weeks";
    if (missingCount > 10) return "3-5 days";
    return "1-2 days";
  }

  /**
   * Get validation history
   */
  static getValidationHistory(): ValidationResult[] {
    return [...this.validationHistory];
  }

  /**
   * Get last validation date
   */
  static getLastValidationDate(): Date | null {
    return this.lastValidation;
  }

  /**
   * Check if validation is stale
   */
  static isValidationStale(): boolean {
    if (!this.lastValidation) return true;
    const oneDay = 24 * 60 * 60 * 1000;
    return Date.now() - this.lastValidation.getTime() > oneDay;
  }

  /**
   * Export coverage data for external analysis
   */
  static exportCoverageData(): {
    validation: ValidationResult;
    inventory: any;
    commands: any[];
  } {
    const latestValidation =
      this.validationHistory[this.validationHistory.length - 1];
    return {
      validation: latestValidation,
      inventory: ApiInventoryManager.getInventory(),
      commands: CommandRegistry.getAllCommands(),
    };
  }
}

// Export convenience functions
export const validateCoverage = CoverageValidator.validateCoverage;
export const generateCoverageReport = CoverageValidator.generateReport;
export const isValidationStale = CoverageValidator.isValidationStale;
