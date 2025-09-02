/**
 * Enhanced Migration Engine Tool
 * Provides comprehensive migration assistance from ioredis/node-redis to GLIDE
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import {
  MultiPatternDetector,
  DetectedPattern,
  SourceAnalysis,
} from "./pattern-detector.js";
import {
  DependencyAnalyzer,
  DependencyAnalysis,
} from "./dependency-analyzer.js";
import {
  OptimizationAnalyzer,
  OptimizationReport,
} from "./optimization-analyzer.js";

export interface MigrationEngineRequest {
  sourceCode?: string;
  sourceLibrary: "ioredis" | "node-redis";
  projectPath?: string;
  migrationScope: "file" | "module" | "project";
  options: MigrationOptions;
}

export interface MigrationOptions {
  includeOptimizations: boolean;
  generateTests: boolean;
  preserveComments: boolean;
  targetGlideVersion: string;
  migrationStrategy: "conservative" | "aggressive" | "balanced";
}

export interface ComprehensiveMigrationResult {
  sourceAnalysis: SourceAnalysis;
  dependencyAnalysis: DependencyAnalysis;
  optimizationReport: OptimizationReport;
  migrationPlan: MigrationPlan;
  convertedCode: ConvertedCode[];
  migrationGuide: MigrationGuide;
  timeEstimate: TimeEstimate;
}

export interface ConvertedCode {
  originalFile: string;
  convertedFile: string;
  changes: CodeChange[];
  confidence: number;
  warnings: string[];
}

export interface CodeChange {
  type:
    | "method-rename"
    | "parameter-change"
    | "api-replacement"
    | "pattern-conversion";
  line: number;
  original: string;
  converted: string;
  reasoning: string;
}

export interface MigrationGuide {
  overview: string;
  phases: MigrationPhase[];
  criticalSteps: string[];
  rollbackPlan: string[];
  validationSteps: string[];
}

export interface MigrationPlan {
  phases: MigrationPhase[];
  totalSteps: number;
  estimatedTime: string;
  dependencies: string[];
  validationCheckpoints: string[];
}

export interface MigrationPhase {
  phase: number;
  title: string;
  description: string;
  tasks: string[];
  dependencies: string[];
  estimatedTime: string;
}

export interface TimeEstimate {
  totalHours: number;
  breakdown: {
    analysis: number;
    codeChanges: number;
    testing: number;
    validation: number;
  };
  confidence: "high" | "medium" | "low";
  factors: string[];
}

export class EnhancedMigrationEngine {
  /**
   * Perform comprehensive migration analysis and conversion
   */
  static async performMigration(
    request: MigrationEngineRequest,
    context: EnhancedQueryContext,
  ): Promise<ComprehensiveMigrationResult> {
    // Step 1: Analyze source code patterns
    const sourceAnalysis = request.sourceCode
      ? MultiPatternDetector.analyzeSource(
          request.sourceCode,
          request.sourceLibrary,
          context,
        )
      : this.createPlaceholderAnalysis(request.sourceLibrary);

    // Step 2: Analyze dependencies and configuration
    const dependencyAnalysis = await DependencyAnalyzer.analyzeDependencies(
      request.projectPath || "package.json",
      [], // sourceCode array not supplied in current workflow
      context,
    );

    // Step 3: Generate optimization report
    const optimizationReport = OptimizationAnalyzer.generateOptimizationReport(
      sourceAnalysis,
      dependencyAnalysis,
      context,
    );

    // Step 4: Create comprehensive migration plan
    const migrationPlan = this.createComprehensiveMigrationPlan(
      sourceAnalysis,
      dependencyAnalysis,
      optimizationReport,
      request.options,
    );

    // Step 5: Convert code
    const convertedCode = request.sourceCode
      ? this.convertSourceCode(
          request.sourceCode,
          sourceAnalysis,
          request.options,
        )
      : [];

    // Step 6: Generate migration guide
    const migrationGuide = this.generateMigrationGuide(
      sourceAnalysis,
      dependencyAnalysis,
      optimizationReport,
      request.options,
    );

    // Step 7: Estimate time and effort
    const timeEstimate = this.estimateMigrationTime(
      sourceAnalysis,
      dependencyAnalysis,
      request.migrationScope,
    );

    return {
      sourceAnalysis,
      dependencyAnalysis,
      optimizationReport,
      migrationPlan,
      convertedCode,
      migrationGuide,
      timeEstimate,
    };
  }

  /**
   * Create comprehensive migration plan
   */
  private static createComprehensiveMigrationPlan(
    sourceAnalysis: SourceAnalysis,
    dependencyAnalysis: DependencyAnalysis,
    optimizationReport: OptimizationReport,
    options: MigrationOptions,
  ): MigrationPlan {
    const basePlan: MigrationPlan = {
      phases:
        dependencyAnalysis.migrationPlan?.phases.map((phase) => ({
          phase: (phase as any).id || 1,
          title: (phase as any).name || "Migration Phase",
          description: (phase as any).description || "Phase description",
          tasks: (phase as any).tasks || [],
          dependencies: [],
          estimatedTime: "2-4 hours",
        })) || [],
      totalSteps: 0,
      estimatedTime: "To be determined",
      dependencies: [],
      validationCheckpoints: [],
    };

    // Enhance with optimization recommendations
    const enhancedPhases = [...basePlan.phases];

    if (options.includeOptimizations) {
      optimizationReport.performanceOptimizations.forEach((opt, index) => {
        enhancedPhases.push({
          phase: basePlan.phases.length + index + 1,
          title: `Apply ${opt.title}`,
          description: opt.description,
          tasks: opt.implementationSteps || [],
          dependencies: [],
          estimatedTime: "2-4 hours",
        });
      });
    }

    return {
      phases: enhancedPhases,
      totalSteps: enhancedPhases.length,
      estimatedTime: this.calculateEnhancedDuration(
        basePlan,
        optimizationReport,
        options,
      ),
      dependencies: [],
      validationCheckpoints: [],
    };
  }

  /**
   * Convert source code based on detected patterns
   */
  private static convertSourceCode(
    sourceCode: string,
    analysis: SourceAnalysis,
    options: MigrationOptions,
  ): ConvertedCode[] {
    const lines = sourceCode.split("\n");
    const changes: CodeChange[] = [];
    let convertedLines = [...lines];

    // Apply pattern-based conversions
    analysis.detectedPatterns.forEach((pattern) => {
      pattern.occurrences.forEach((occurrence) => {
        if (pattern.conversionStrategies.length > 0) {
          const strategy = pattern.conversionStrategies[0];
          const change: CodeChange = {
            type: "pattern-conversion",
            line: occurrence.startLine,
            original: occurrence.sourceCode,
            converted: this.applyConversionStrategy(
              occurrence.sourceCode,
              strategy,
            ),
            reasoning: strategy.description,
          };

          changes.push(change);
          convertedLines[occurrence.startLine - 1] =
            this.applyConversionStrategy(occurrence.sourceCode, strategy);
        }
      });
    });

    // Apply library-specific conversions
    const libraryConversions = this.getLibrarySpecificConversions(
      analysis.sourceLibrary,
    );
    libraryConversions.forEach((conversion) => {
      convertedLines = convertedLines.map((line, index) => {
        if (line.includes(conversion.pattern)) {
          changes.push({
            type: "method-rename",
            line: index + 1,
            original: line,
            converted: line.replace(conversion.pattern, conversion.replacement),
            reasoning: conversion.reason,
          });
          return line.replace(conversion.pattern, conversion.replacement);
        }
        return line;
      });
    });

    const confidence = this.calculateConversionConfidence(changes, analysis);
    const warnings = this.generateConversionWarnings(changes, analysis);

    return [
      {
        originalFile: "input.ts",
        convertedFile: convertedLines.join("\n"),
        changes,
        confidence,
        warnings,
      },
    ];
  }

  /**
   * Generate comprehensive migration guide
   */
  private static generateMigrationGuide(
    sourceAnalysis: SourceAnalysis,
    dependencyAnalysis: DependencyAnalysis,
    optimizationReport: OptimizationReport,
    options: MigrationOptions,
  ): MigrationGuide {
    const phases: MigrationPhase[] = [
      {
        phase: 1,
        title: "Preparation and Analysis",
        description: "Analyze current codebase and prepare for migration",
        tasks: [
          "Backup current codebase",
          "Document current Redis usage patterns",
          "Set up development environment",
          "Create migration branch",
        ],
        dependencies: [],
        estimatedTime: "2-4 hours",
      },
      {
        phase: 2,
        title: "Dependency Migration",
        description: "Update package dependencies and configuration",
        tasks:
          dependencyAnalysis.migrationPlan?.phases
            ?.filter(
              (phase: any) => phase.name && phase.name.includes("dependency"),
            )
            ?.map((phase: any) => phase.name) || [],
        dependencies: ["Phase 1"],
        estimatedTime: "1-2 hours",
      },
      {
        phase: 3,
        title: "Code Conversion",
        description: "Convert Redis operations to GLIDE API",
        tasks: [
          "Update import statements",
          "Convert method calls",
          "Update parameter formats",
          "Handle breaking changes",
        ],
        dependencies: ["Phase 2"],
        estimatedTime: "4-8 hours",
      },
      {
        phase: 4,
        title: "Testing and Validation",
        description: "Ensure converted code works correctly",
        tasks: [
          "Run existing tests",
          "Add migration-specific tests",
          "Validate Redis operations",
          "Performance testing",
        ],
        dependencies: ["Phase 3"],
        estimatedTime: "2-6 hours",
      },
    ];

    if (options.includeOptimizations) {
      phases.push({
        phase: 5,
        title: "Performance Optimization",
        description: "Apply performance improvements",
        tasks: optimizationReport.performanceOptimizations.map(
          (opt) => opt.title,
        ),
        dependencies: ["Phase 4"],
        estimatedTime: "2-4 hours",
      });
    }

    return {
      overview: `Migration from ${sourceAnalysis.sourceLibrary} to GLIDE with ${sourceAnalysis.detectedPatterns.length} patterns detected`,
      phases,
      criticalSteps: [
        "Backup codebase before starting",
        "Test each converted component individually",
        "Validate Redis connections and operations",
        "Monitor performance after migration",
      ],
      rollbackPlan: [
        "Restore from backup",
        "Revert dependency changes",
        "Switch back to previous Redis client",
        "Validate system functionality",
      ],
      validationSteps: [
        "All tests pass",
        "Redis operations work correctly",
        "Performance meets requirements",
        "No critical warnings or errors",
      ],
    };
  }

  /**
   * Estimate migration time and effort
   */
  private static estimateMigrationTime(
    sourceAnalysis: SourceAnalysis,
    dependencyAnalysis: DependencyAnalysis,
    scope: "file" | "module" | "project",
  ): TimeEstimate {
    const baseMultiplier = { file: 1, module: 3, project: 10 }[scope];
    const complexityMultiplier =
      sourceAnalysis.codeComplexity.complexity === "high" ? 2 : 1;

    const analysis = 2 * baseMultiplier;
    const codeChanges =
      sourceAnalysis.detectedPatterns.length * 0.5 * complexityMultiplier;
    const testing = codeChanges * 0.5;
    const validation = analysis * 0.5;

    const totalHours = Math.ceil(analysis + codeChanges + testing + validation);

    return {
      totalHours,
      breakdown: { analysis, codeChanges, testing, validation },
      confidence: totalHours < 8 ? "high" : totalHours < 20 ? "medium" : "low",
      factors: [
        `${sourceAnalysis.detectedPatterns.length} patterns detected`,
        `${sourceAnalysis.codeComplexity.complexity} complexity`,
        `${scope} scope`,
        `${dependencyAnalysis.currentDependencies.length} dependencies`,
      ],
    };
  }

  // Helper methods
  private static createPlaceholderAnalysis(
    sourceLibrary: string,
  ): SourceAnalysis {
    return {
      sourceLibrary: sourceLibrary as "ioredis" | "node-redis",
      detectedPatterns: [],
      codeComplexity: {
        totalLines: 0,
        redisLines: 0,
        complexity: "low",
        factors: [],
      },
      migrationStrategy: {
        approach: "incremental",
        phases: [],
        dependencies: [],
        risks: [],
      },
      estimatedEffort: {
        totalHours: 0,
        breakdown: {
          analysis: 0,
          conversion: 0,
          testing: 0,
          validation: 0,
          documentation: 0,
        },
        confidence: 0.8,
        assumptions: [],
      },
    };
  }

  private static applyConversionStrategy(
    sourceCode: string,
    strategy: any,
  ): string {
    // Mock implementation - apply first conversion step
    if (strategy.steps && strategy.steps.length > 0) {
      const step = strategy.steps[0];
      return sourceCode.replace(step.target, step.newCode);
    }
    return sourceCode;
  }

  private static calculateTotalTime(phases: MigrationPhase[]): string {
    return `${phases.length * 2}-${phases.length * 4} hours`;
  }

  private static extractDependencies(phases: MigrationPhase[]): string[] {
    return phases.flatMap((phase) => phase.dependencies);
  }

  private static generateValidationCheckpoints(
    phases: MigrationPhase[],
  ): string[] {
    return phases.map((phase) => `Validate ${phase.title}`);
  }

  // Removed duplicate function implementations - they're already defined below

  /**
   * Helper methods
   */
  private static getLibrarySpecificConversions(
    library: "ioredis" | "node-redis",
  ): Array<{
    pattern: string;
    replacement: string;
    reason: string;
  }> {
    if (library === "node-redis") {
      return [
        {
          pattern: ".hSet(",
          replacement: ".hset(",
          reason: "Convert camelCase to lowercase",
        },
        {
          pattern: ".hGet(",
          replacement: ".hget(",
          reason: "Convert camelCase to lowercase",
        },
        {
          pattern: ".lPush(",
          replacement: ".lpush(",
          reason: "Convert camelCase to lowercase",
        },
        {
          pattern: ".rPush(",
          replacement: ".rpush(",
          reason: "Convert camelCase to lowercase",
        },
        {
          pattern: ".zAdd(",
          replacement: ".zadd(",
          reason: "Convert camelCase to lowercase",
        },
      ];
    } else {
      return [
        {
          pattern: ".set(",
          replacement: ".set(",
          reason: "May need parameter format changes for options",
        },
      ];
    }
  }

  private static calculateConversionConfidence(
    changes: CodeChange[],
    analysis: SourceAnalysis,
  ): number {
    if (changes.length === 0) return 100;

    const complexPatterns = analysis.detectedPatterns.filter(
      (p) => p.complexity === "complex",
    ).length;
    const simpleChanges = changes.filter(
      (c) => c.type === "method-rename",
    ).length;

    const baseConfidence = 90;
    const complexityPenalty = complexPatterns * 15;
    const simplicityBonus = simpleChanges * 2;

    return Math.max(
      50,
      Math.min(100, baseConfidence - complexityPenalty + simplicityBonus),
    );
  }

  private static generateConversionWarnings(
    changes: CodeChange[],
    analysis: SourceAnalysis,
  ): string[] {
    const warnings: string[] = [];

    if (analysis.detectedPatterns.some((p) => p.type === "pipeline")) {
      warnings.push("Pipeline operations detected - requires manual review");
    }

    if (analysis.detectedPatterns.some((p) => p.type === "streaming")) {
      warnings.push(
        "Stream operations detected - parameter format changes required",
      );
    }

    if (changes.some((c) => c.type === "pattern-conversion")) {
      warnings.push(
        "Complex pattern conversions applied - thorough testing recommended",
      );
    }

    return warnings;
  }

  private static calculateEnhancedDuration(
    basePlan: MigrationPlan,
    optimizationReport: OptimizationReport,
    options: MigrationOptions,
  ): string {
    const baseHours = parseInt(
      (basePlan as any).estimatedDuration?.split("-")?.[0] || "8",
    );
    const optimizationHours = options.includeOptimizations
      ? optimizationReport.performanceOptimizations.length * 2
      : 0;

    const totalHours = baseHours + optimizationHours;
    return `${totalHours}-${Math.ceil(totalHours * 1.5)} hours`;
  }
}

// Export all types and main class
export {
  MultiPatternDetector,
  DependencyAnalyzer,
  OptimizationAnalyzer,
  type DetectedPattern,
  type SourceAnalysis,
  type DependencyAnalysis,
  type OptimizationReport,
};

// Export convenience function
export const performMigration = EnhancedMigrationEngine.performMigration;
