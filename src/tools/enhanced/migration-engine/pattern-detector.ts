/**
 * Multi-Pattern Detection and Conversion Engine
 * Analyzes source code to detect Redis usage patterns and converts them to GLIDE equivalents
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";

export interface DetectedPattern {
  type:
    | "pipeline"
    | "transaction"
    | "clustering"
    | "pubsub"
    | "streaming"
    | "connection"
    | "scripting";
  confidence: number;
  occurrences: PatternOccurrence[];
  complexity: "simple" | "moderate" | "complex";
  migrationRequirements: MigrationRequirement[];
  conversionStrategies: ConversionStrategy[];
}

export interface PatternOccurrence {
  startLine: number;
  endLine: number;
  sourceCode: string;
  methods: string[];
  variables: string[];
  dependencies: string[];
  context: CodeContext;
}

export interface CodeContext {
  className?: string;
  methodName?: string;
  asyncContext: boolean;
  errorHandling: boolean;
  loopContext: boolean;
  conditionalContext: boolean;
}

export interface MigrationRequirement {
  type:
    | "api-change"
    | "syntax-change"
    | "behavioral-change"
    | "dependency-change";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  impact: string;
  solution: string;
  codeExample?: string;
}

export interface ConversionStrategy {
  name: string;
  description: string;
  applicability: string[];
  steps: ConversionStep[];
  risks: string[];
  validation: string[];
}

export interface ConversionStep {
  order: number;
  action: "replace" | "add" | "remove" | "modify" | "wrap";
  target: string;
  newCode: string;
  explanation: string;
  preserveComments: boolean;
}

export interface ConversionResult {
  originalCode: string;
  convertedCode: string;
  pattern: DetectedPattern;
  strategy: ConversionStrategy;
  warnings: ConversionWarning[];
  validationTests: string[];
  migrationNotes: string[];
}

export interface ConversionWarning {
  type:
    | "behavior-change"
    | "performance-impact"
    | "breaking-change"
    | "manual-review";
  severity: "info" | "warning" | "error";
  message: string;
  location: { line: number; column: number };
  suggestion?: string;
}

export interface SourceAnalysis {
  sourceLibrary: "ioredis" | "node-redis";
  detectedPatterns: DetectedPattern[];
  codeComplexity: CodeComplexity;
  migrationStrategy: MigrationStrategy;
  estimatedEffort: EffortEstimate;
}

export interface CodeComplexity {
  totalLines: number;
  redisLines: number;
  complexity: "low" | "medium" | "high" | "very-high";
  factors: ComplexityFactor[];
}

export interface ComplexityFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface MigrationStrategy {
  approach: "incremental" | "big-bang" | "parallel" | "feature-flag";
  phases: MigrationPhase[];
  dependencies: string[];
  risks: RiskAssessment[];
}

export interface MigrationPhase {
  name: string;
  description: string;
  patterns: string[];
  estimatedDuration: string;
  dependencies: string[];
  deliverables: string[];
}

export interface RiskAssessment {
  risk: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  mitigation: string;
}

export interface EffortEstimate {
  totalHours: number;
  breakdown: EffortBreakdown;
  confidence: number;
  assumptions: string[];
}

export interface EffortBreakdown {
  analysis: number;
  conversion: number;
  testing: number;
  validation: number;
  documentation: number;
}

export class MultiPatternDetector {
  private static patternDefinitions: Map<string, PatternDefinition> = new Map();

  static {
    this.initializePatternDefinitions();
  }

  /**
   * Initialize pattern detection definitions
   */
  private static initializePatternDefinitions(): void {
    // Pipeline Pattern
    this.patternDefinitions.set("pipeline", {
      type: "pipeline",
      signatures: [
        {
          library: "ioredis",
          patterns: [/\.pipeline\(\)/, /\.multi\(\)/, /\.exec\(\)/],
        },
        { library: "node-redis", patterns: [/\.multi\(\)/, /\.exec\(\)/] },
      ],
      contextRequirements: ["multiple commands", "batch execution"],
      complexity: "moderate",
      migrationRequirements: [
        {
          type: "api-change",
          severity: "medium",
          description: "Pipeline API syntax differs between libraries",
          impact: "Method calls and result handling need updates",
          solution: "Use GLIDE pipeline API with transaction semantics",
        },
      ],
      conversionStrategies: [
        {
          name: "ioredis-pipeline-conversion",
          description: "Convert ioredis pipeline to GLIDE transaction",
          applicability: ["ioredis"],
          steps: [
            {
              order: 1,
              action: "replace",
              target: "redis.pipeline()",
              newCode: "client.multi()",
              explanation: "Replace pipeline creation with multi",
              preserveComments: true,
            },
            {
              order: 2,
              action: "modify",
              target: ".exec()",
              newCode: ".exec()",
              explanation: "Update exec() call syntax",
              preserveComments: true,
            },
          ],
          risks: ["Result array structure may differ"],
          validation: ["Test result parsing", "Verify error handling"],
        },
      ],
    });

    // Transaction Pattern
    this.patternDefinitions.set("transaction", {
      type: "transaction",
      signatures: [
        {
          library: "ioredis",
          patterns: [/\.multi\(\)/, /\.exec\(\)/, /\.discard\(\)/],
        },
        {
          library: "node-redis",
          patterns: [/\.multi\(\)/, /\.exec\(\)/, /\.discard\(\)/],
        },
      ],
      contextRequirements: ["atomic operations", "ACID semantics"],
      complexity: "moderate",
      migrationRequirements: [
        {
          type: "behavioral-change",
          severity: "medium",
          description: "Transaction result handling may differ",
          impact: "Result array structure and error handling",
          solution: "Update result processing logic",
        },
      ],
      conversionStrategies: [
        {
          name: "transaction-conversion",
          description: "Convert transaction blocks to GLIDE format",
          applicability: ["ioredis", "node-redis"],
          steps: [
            {
              order: 1,
              action: "replace",
              target: "redis.multi()",
              newCode: "client.multi()",
              explanation: "Update multi() call",
              preserveComments: true,
            },
          ],
          risks: ["Error handling differences"],
          validation: ["Test transaction rollback", "Verify ACID properties"],
        },
      ],
    });

    // Clustering Pattern
    this.patternDefinitions.set("clustering", {
      type: "clustering",
      signatures: [
        {
          library: "ioredis",
          patterns: [/new Redis\.Cluster/, /\.nodes\(\)/, /\.slots\(\)/],
        },
        {
          library: "node-redis",
          patterns: [/createCluster/, /\.masters/, /\.replicas/],
        },
      ],
      contextRequirements: ["cluster deployment", "sharding"],
      complexity: "complex",
      migrationRequirements: [
        {
          type: "api-change",
          severity: "high",
          description:
            "Cluster initialization and management APIs differ significantly",
          impact: "Complete cluster setup and management code needs rewriting",
          solution: "Use GLIDE cluster client with updated configuration",
        },
      ],
      conversionStrategies: [
        {
          name: "cluster-migration",
          description: "Migrate cluster setup to GLIDE cluster client",
          applicability: ["ioredis", "node-redis"],
          steps: [
            {
              order: 1,
              action: "replace",
              target: "new Redis.Cluster",
              newCode: "GlideClusterClient.createClient",
              explanation: "Replace cluster initialization",
              preserveComments: true,
            },
          ],
          risks: ["Configuration format changes", "Node discovery differences"],
          validation: ["Test cluster connectivity", "Verify failover behavior"],
        },
      ],
    });

    // Pub/Sub Pattern
    this.patternDefinitions.set("pubsub", {
      type: "pubsub",
      signatures: [
        {
          library: "ioredis",
          patterns: [
            /\.subscribe\(/,
            /\.publish\(/,
            /\.on\('message'/,
            /\.psubscribe\(/,
          ],
        },
        {
          library: "node-redis",
          patterns: [/\.subscribe\(/, /\.publish\(/, /\.on\('message'/],
        },
      ],
      contextRequirements: ["message publishing", "subscription handling"],
      complexity: "moderate",
      migrationRequirements: [
        {
          type: "api-change",
          severity: "medium",
          description: "Pub/Sub event handling and subscription management",
          impact: "Event listener registration and message handling",
          solution: "Update to GLIDE pub/sub API",
        },
      ],
      conversionStrategies: [
        {
          name: "pubsub-conversion",
          description: "Convert pub/sub implementation to GLIDE",
          applicability: ["ioredis", "node-redis"],
          steps: [
            {
              order: 1,
              action: "modify",
              target: ".subscribe(",
              newCode: ".subscribe(",
              explanation: "Update subscription syntax",
              preserveComments: true,
            },
          ],
          risks: ["Event handling differences"],
          validation: [
            "Test message delivery",
            "Verify subscription management",
          ],
        },
      ],
    });

    // Streaming Pattern
    this.patternDefinitions.set("streaming", {
      type: "streaming",
      signatures: [
        {
          library: "ioredis",
          patterns: [/\.xadd\(/, /\.xread\(/, /\.xgroup\(/, /\.xreadgroup\(/],
        },
        {
          library: "node-redis",
          patterns: [/\.xAdd\(/, /\.xRead\(/, /\.xGroup/, /\.xReadGroup\(/],
        },
      ],
      contextRequirements: ["stream processing", "consumer groups"],
      complexity: "complex",
      migrationRequirements: [
        {
          type: "syntax-change",
          severity: "high",
          description: "Stream command parameter formats differ significantly",
          impact: "Stream entry format and consumer group management",
          solution: "Rewrite stream operations with GLIDE parameter formats",
        },
      ],
      conversionStrategies: [
        {
          name: "stream-conversion",
          description: "Convert stream operations to GLIDE format",
          applicability: ["ioredis", "node-redis"],
          steps: [
            {
              order: 1,
              action: "replace",
              target: "xadd(",
              newCode: "xadd(",
              explanation: "Update stream add syntax",
              preserveComments: true,
            },
          ],
          risks: ["Parameter format changes", "Entry structure differences"],
          validation: [
            "Test stream operations",
            "Verify consumer group behavior",
          ],
        },
      ],
    });

    // Connection Pattern
    this.patternDefinitions.set("connection", {
      type: "connection",
      signatures: [
        {
          library: "ioredis",
          patterns: [
            /new Redis\(/,
            /\.connect\(/,
            /\.disconnect\(/,
            /\.on\('connect'/,
          ],
        },
        {
          library: "node-redis",
          patterns: [
            /createClient\(/,
            /\.connect\(/,
            /\.disconnect\(/,
            /\.on\('connect'/,
          ],
        },
      ],
      contextRequirements: ["connection management", "configuration"],
      complexity: "simple",
      migrationRequirements: [
        {
          type: "api-change",
          severity: "low",
          description: "Connection initialization and configuration format",
          impact: "Client creation and connection options",
          solution: "Update to GLIDE client creation pattern",
        },
      ],
      conversionStrategies: [
        {
          name: "connection-conversion",
          description: "Convert connection setup to GLIDE client",
          applicability: ["ioredis", "node-redis"],
          steps: [
            {
              order: 1,
              action: "replace",
              target: "new Redis(",
              newCode: "await GlideClient.createClient(",
              explanation: "Replace Redis constructor with GLIDE factory",
              preserveComments: true,
            },
          ],
          risks: ["Configuration option mapping"],
          validation: [
            "Test connection establishment",
            "Verify configuration options",
          ],
        },
      ],
    });
  }

  /**
   * Analyze source code for Redis patterns
   */
  static analyzeSource(
    sourceCode: string,
    sourceLibrary: "ioredis" | "node-redis",
    context: EnhancedQueryContext,
  ): SourceAnalysis {
    const detectedPatterns = this.detectPatterns(sourceCode, sourceLibrary);
    const codeComplexity = this.analyzeComplexity(sourceCode, detectedPatterns);
    const migrationStrategy = this.determineMigrationStrategy(
      detectedPatterns,
      codeComplexity,
    );
    const estimatedEffort = this.estimateEffort(
      detectedPatterns,
      codeComplexity,
    );

    return {
      sourceLibrary,
      detectedPatterns,
      codeComplexity,
      migrationStrategy,
      estimatedEffort,
    };
  }

  /**
   * Detect patterns in source code
   */
  static detectPatterns(
    sourceCode: string,
    sourceLibrary: "ioredis" | "node-redis",
  ): DetectedPattern[] {
    const patterns: DetectedPattern[] = [];
    const lines = sourceCode.split("\n");

    for (const [patternType, definition] of this.patternDefinitions) {
      const librarySignatures = definition.signatures.find(
        (sig) => sig.library === sourceLibrary,
      );
      if (!librarySignatures) continue;

      const occurrences = this.findPatternOccurrences(
        lines,
        librarySignatures.patterns,
        patternType,
      );

      if (occurrences.length > 0) {
        const confidence = this.calculatePatternConfidence(
          occurrences,
          definition,
        );

        patterns.push({
          type: definition.type,
          confidence,
          occurrences,
          complexity: definition.complexity,
          migrationRequirements: definition.migrationRequirements,
          conversionStrategies: definition.conversionStrategies,
        });
      }
    }

    return patterns.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Convert detected pattern to GLIDE equivalent
   */
  static convertPattern(
    pattern: DetectedPattern,
    sourceCode: string,
    targetLibrary: "glide" = "glide",
  ): ConversionResult {
    const strategy = this.selectConversionStrategy(pattern);
    const convertedCode = this.applyConversionStrategy(sourceCode, strategy);
    const warnings = this.generateConversionWarnings(pattern, strategy);
    const validationTests = this.generateValidationTests(pattern);
    const migrationNotes = this.generateMigrationNotes(pattern, strategy);

    return {
      originalCode: sourceCode,
      convertedCode,
      pattern,
      strategy,
      warnings,
      validationTests,
      migrationNotes,
    };
  }

  /**
   * Helper methods
   */
  private static findPatternOccurrences(
    lines: string[],
    patterns: RegExp[],
    patternType: string,
  ): PatternOccurrence[] {
    const occurrences: PatternOccurrence[] = [];

    lines.forEach((line, index) => {
      for (const pattern of patterns) {
        if (pattern.test(line)) {
          // Find the block of code that encompasses this pattern
          const blockStart = Math.max(0, index - 2);
          const blockEnd = Math.min(lines.length - 1, index + 5);
          const sourceCode = lines.slice(blockStart, blockEnd + 1).join("\n");

          occurrences.push({
            startLine: blockStart,
            endLine: blockEnd,
            sourceCode,
            methods: this.extractMethods(sourceCode),
            variables: this.extractVariables(sourceCode),
            dependencies: this.extractDependencies(sourceCode),
            context: this.analyzeCodeContext(sourceCode, lines, index),
          });
          break;
        }
      }
    });

    return occurrences;
  }

  private static calculatePatternConfidence(
    occurrences: PatternOccurrence[],
    definition: PatternDefinition,
  ): number {
    let confidence = 0.5; // Base confidence

    // More occurrences increase confidence
    confidence += Math.min(occurrences.length * 0.1, 0.3);

    // Context requirements boost confidence
    const hasRequiredContext = definition.contextRequirements.some((req) =>
      occurrences.some((occ) =>
        occ.sourceCode.toLowerCase().includes(req.toLowerCase()),
      ),
    );
    if (hasRequiredContext) confidence += 0.2;

    return Math.min(confidence, 1.0);
  }

  private static selectConversionStrategy(
    pattern: DetectedPattern,
  ): ConversionStrategy {
    // Select the most appropriate strategy based on pattern characteristics
    return (
      pattern.conversionStrategies[0] || {
        name: "default-conversion",
        description: "Default conversion strategy",
        applicability: ["all"],
        steps: [],
        risks: [],
        validation: [],
      }
    );
  }

  private static applyConversionStrategy(
    sourceCode: string,
    strategy: ConversionStrategy,
  ): string {
    let convertedCode = sourceCode;

    strategy.steps
      .sort((a, b) => a.order - b.order)
      .forEach((step) => {
        switch (step.action) {
          case "replace":
            convertedCode = convertedCode.replace(
              new RegExp(
                step.target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "g",
              ),
              step.newCode,
            );
            break;
          case "add":
            // Add new code at appropriate location
            break;
          case "remove":
            convertedCode = convertedCode.replace(
              new RegExp(
                step.target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "g",
              ),
              "",
            );
            break;
        }
      });

    return convertedCode;
  }

  private static generateConversionWarnings(
    pattern: DetectedPattern,
    strategy: ConversionStrategy,
  ): ConversionWarning[] {
    const warnings: ConversionWarning[] = [];

    // Generate warnings based on pattern complexity and risks
    if (pattern.complexity === "complex") {
      warnings.push({
        type: "manual-review",
        severity: "warning",
        message: "Complex pattern detected - manual review recommended",
        location: { line: 1, column: 1 },
        suggestion: "Review converted code carefully and test thoroughly",
      });
    }

    strategy.risks.forEach((risk) => {
      warnings.push({
        type: "behavior-change",
        severity: "warning",
        message: risk,
        location: { line: 1, column: 1 },
      });
    });

    return warnings;
  }

  private static generateValidationTests(pattern: DetectedPattern): string[] {
    const tests: string[] = [];

    switch (pattern.type) {
      case "pipeline":
        tests.push("Test pipeline execution order");
        tests.push("Verify error handling in pipeline");
        tests.push("Check result array structure");
        break;
      case "transaction":
        tests.push("Test transaction atomicity");
        tests.push("Verify rollback behavior");
        tests.push("Check error handling");
        break;
      case "clustering":
        tests.push("Test cluster connectivity");
        tests.push("Verify failover behavior");
        tests.push("Check slot distribution");
        break;
    }

    return tests;
  }

  private static generateMigrationNotes(
    pattern: DetectedPattern,
    strategy: ConversionStrategy,
  ): string[] {
    const notes: string[] = [];

    notes.push(`Pattern: ${pattern.type} (${pattern.complexity} complexity)`);
    notes.push(`Strategy: ${strategy.name}`);
    notes.push(`Confidence: ${(pattern.confidence * 100).toFixed(1)}%`);

    pattern.migrationRequirements.forEach((req) => {
      notes.push(`${req.type}: ${req.description}`);
    });

    return notes;
  }

  private static analyzeComplexity(
    sourceCode: string,
    patterns: DetectedPattern[],
  ): CodeComplexity {
    const lines = sourceCode.split("\n");
    const totalLines = lines.length;
    const redisLines = lines.filter(
      (line) =>
        /redis|Redis|REDIS/.test(line) ||
        patterns.some((p) =>
          p.occurrences.some(
            (occ) => line >= lines[occ.startLine] && line <= lines[occ.endLine],
          ),
        ),
    ).length;

    const complexityScore = this.calculateComplexityScore(
      patterns,
      totalLines,
      redisLines,
    );
    const complexity =
      complexityScore < 20
        ? "low"
        : complexityScore < 50
          ? "medium"
          : complexityScore < 80
            ? "high"
            : "very-high";

    const factors: ComplexityFactor[] = [
      {
        factor: "Pattern Complexity",
        impact: patterns.reduce(
          (sum, p) =>
            sum +
            (p.complexity === "complex"
              ? 3
              : p.complexity === "moderate"
                ? 2
                : 1),
          0,
        ),
        description: "Complexity of detected patterns",
      },
      {
        factor: "Code Size",
        impact: Math.min(totalLines / 100, 10),
        description: "Total lines of code",
      },
      {
        factor: "Redis Usage",
        impact: (redisLines / totalLines) * 10,
        description: "Percentage of Redis-related code",
      },
    ];

    return { totalLines, redisLines, complexity, factors };
  }

  private static calculateComplexityScore(
    patterns: DetectedPattern[],
    totalLines: number,
    redisLines: number,
  ): number {
    let score = 0;

    // Pattern complexity
    patterns.forEach((pattern) => {
      score +=
        pattern.complexity === "complex"
          ? 20
          : pattern.complexity === "moderate"
            ? 10
            : 5;
      score += pattern.occurrences.length * 2;
    });

    // Code size factor
    score += Math.min(totalLines / 50, 20);

    // Redis usage density
    score += (redisLines / totalLines) * 30;

    return Math.min(score, 100);
  }

  private static determineMigrationStrategy(
    patterns: DetectedPattern[],
    complexity: CodeComplexity,
  ): MigrationStrategy {
    const approach =
      complexity.complexity === "low"
        ? "big-bang"
        : complexity.complexity === "medium"
          ? "incremental"
          : "parallel";

    const phases: MigrationPhase[] = [];
    const risks: RiskAssessment[] = [];

    if (approach === "incremental") {
      phases.push(
        {
          name: "Phase 1",
          description: "Simple patterns",
          patterns: ["connection"],
          estimatedDuration: "1-2 days",
          dependencies: [],
          deliverables: ["Updated connection code"],
        },
        {
          name: "Phase 2",
          description: "Moderate patterns",
          patterns: ["pipeline", "transaction"],
          estimatedDuration: "3-5 days",
          dependencies: ["Phase 1"],
          deliverables: ["Converted patterns"],
        },
        {
          name: "Phase 3",
          description: "Complex patterns",
          patterns: ["clustering", "streaming"],
          estimatedDuration: "1-2 weeks",
          dependencies: ["Phase 2"],
          deliverables: ["Full migration"],
        },
      );
    }

    return { approach, phases, dependencies: ["@valkey/valkey-glide"], risks };
  }

  private static estimateEffort(
    patterns: DetectedPattern[],
    complexity: CodeComplexity,
  ): EffortEstimate {
    let totalHours = 0;

    // Base effort by complexity
    totalHours +=
      complexity.complexity === "low"
        ? 8
        : complexity.complexity === "medium"
          ? 24
          : complexity.complexity === "high"
            ? 60
            : 120;

    // Pattern-specific effort
    patterns.forEach((pattern) => {
      const patternHours =
        pattern.complexity === "simple"
          ? 2
          : pattern.complexity === "moderate"
            ? 8
            : 16;
      totalHours += patternHours * pattern.occurrences.length;
    });

    const breakdown: EffortBreakdown = {
      analysis: totalHours * 0.2,
      conversion: totalHours * 0.4,
      testing: totalHours * 0.3,
      validation: totalHours * 0.05,
      documentation: totalHours * 0.05,
    };

    return {
      totalHours,
      breakdown,
      confidence: 0.7,
      assumptions: [
        "Existing test coverage",
        "Development team familiarity",
        "No major architectural changes",
      ],
    };
  }

  // Helper methods for code analysis
  private static extractMethods(code: string): string[] {
    const methodRegex = /\.(\w+)\(/g;
    const methods: string[] = [];
    let match;
    while ((match = methodRegex.exec(code)) !== null) {
      methods.push(match[1]);
    }
    return [...new Set(methods)];
  }

  private static extractVariables(code: string): string[] {
    const variableRegex = /(?:const|let|var)\s+(\w+)/g;
    const variables: string[] = [];
    let match;
    while ((match = variableRegex.exec(code)) !== null) {
      variables.push(match[1]);
    }
    return variables;
  }

  private static extractDependencies(code: string): string[] {
    const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
    const dependencies: string[] = [];

    let match;
    while ((match = importRegex.exec(code)) !== null) {
      dependencies.push(match[1]);
    }
    while ((match = requireRegex.exec(code)) !== null) {
      dependencies.push(match[1]);
    }

    return [...new Set(dependencies)];
  }

  private static analyzeCodeContext(
    code: string,
    allLines: string[],
    currentLine: number,
  ): CodeContext {
    return {
      asyncContext: /async|await/.test(code),
      errorHandling: /try|catch|throw/.test(code),
      loopContext: /for|while|forEach/.test(code),
      conditionalContext: /if|else|switch/.test(code),
    };
  }
}

interface PatternDefinition {
  type: DetectedPattern["type"];
  signatures: Array<{ library: "ioredis" | "node-redis"; patterns: RegExp[] }>;
  contextRequirements: string[];
  complexity: DetectedPattern["complexity"];
  migrationRequirements: MigrationRequirement[];
  conversionStrategies: ConversionStrategy[];
}

// Export convenience functions
export const analyzeSource = MultiPatternDetector.analyzeSource;
export const detectPatterns = MultiPatternDetector.detectPatterns;
export const convertPattern = MultiPatternDetector.convertPattern;
