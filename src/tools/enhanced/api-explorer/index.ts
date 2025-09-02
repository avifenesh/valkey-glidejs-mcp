/**
 * Enhanced API Explorer Tool
 * Integrates command handlers, category browsing, cross-reference mapping, and performance analysis
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import { UniversalValidator } from "../../core/schema/universal-validator.js";
import { TemplateEngine } from "../../core/response/template-engine.js";
import { ProgressiveDisclosure } from "../../core/response/progressive-disclosure.js";
import { CommandHandlers, CommandHandlerResult } from "./command-handlers.js";
import {
  CategoryBrowser,
  CategoryInfo,
  BrowsingResult,
} from "./category-browser.js";
import {
  CrossReferenceMapper,
  CrossReferenceMapping,
  MigrationGuide,
} from "./cross-reference-mapper.js";
import {
  PerformanceAnalyzer,
  PerformanceData,
  PerformanceAnalysis,
} from "./performance-analyzer.js";
import {
  COMMON_PARAMETERS,
  ParameterSchema,
} from "../../core/schema/parameter-definitions.js";

export interface ApiExplorerRequest {
  mode: "command" | "category" | "migration" | "performance" | "search";
  query?: string;
  command?: string;
  category?: string;
  sourceLibrary?: "ioredis" | "node-redis";
  targetLibrary?: "glide";
  includeExamples?: boolean;
  includePerformance?: boolean;
  migrationContext?: MigrationContext;
  performanceContext?: PerformanceContext;
}

export interface MigrationContext {
  currentLibrary: "ioredis" | "node-redis";
  targetCommands?: string[];
  complexityFilter?: "simple" | "moderate" | "complex";
}

export interface PerformanceContext {
  usageFrequency?: "low" | "medium" | "high" | "very-high";
  dataSize?: "small" | "medium" | "large" | "very-large";
  concurrencyLevel?: "single" | "low" | "medium" | "high";
  includeOptimizations?: boolean;
}

export interface ApiExplorerResponse {
  mode: string;
  title: string;
  summary: string;
  sections: ResponseSection[];
  examples: ExampleSection[];
  relatedCommands?: string[];
  nextSteps?: string[];
  performance?: PerformanceSection;
  migration?: MigrationSection;
  metadata: ResponseMetadata;
}

export interface ResponseSection {
  type:
    | "description"
    | "syntax"
    | "parameters"
    | "use-cases"
    | "best-practices"
    | "warnings";
  title: string;
  content: string;
  priority: number;
}

export interface ExampleSection {
  title: string;
  description: string;
  code: string;
  complexity: "simple" | "intermediate" | "advanced";
  category: string;
  language: string;
}

export interface PerformanceSection {
  timeComplexity: string;
  spaceComplexity: string;
  benchmarks: BenchmarkSummary[];
  recommendations: string[];
  optimizations: string[];
}

export interface BenchmarkSummary {
  scenario: string;
  throughput: string;
  latency: string;
  memoryUsage: string;
}

export interface MigrationSection {
  sourceLibrary: string;
  targetLibrary: string;
  complexity: "simple" | "moderate" | "complex";
  steps: string[];
  codeComparison: CodeComparison[];
  warnings: string[];
}

export interface CodeComparison {
  title: string;
  sourceCode: string;
  targetCode: string;
  notes: string[];
}

export interface ResponseMetadata {
  responseTime: number;
  confidence: number;
  sources: string[];
  relatedTopics: string[];
  estimatedReadTime: number;
}

export class EnhancedApiExplorer {
  private static parameterSchema: ParameterSchema = {
    parameters: [
      COMMON_PARAMETERS.query,
      {
        name: "mode",
        type: "enum",
        required: true,
        description: "Exploration mode",
        examples: ["command", "category", "migration", "performance", "search"],
        validation: [
          {
            type: "enum",
            allowedValues: [
              "command",
              "category",
              "migration",
              "performance",
              "search",
            ],
            errorMessage:
              "Mode must be one of: command, category, migration, performance, search",
            level: "strict",
          },
        ],
        category: "general",
      },
      {
        name: "command",
        type: "string",
        required: false,
        description: "Specific Redis command to explore",
        examples: ["GET", "SET", "HSET", "XADD", "ZADD"],
        category: "command",
      },
      COMMON_PARAMETERS.category,
      COMMON_PARAMETERS.source,
      {
        name: "includeExamples",
        type: "boolean",
        required: false,
        description: "Include code examples in response",
        examples: ["true", "false"],
        defaultValue: true,
        category: "general",
      },
      {
        name: "includePerformance",
        type: "boolean",
        required: false,
        description: "Include performance analysis",
        examples: ["true", "false"],
        defaultValue: false,
        category: "performance",
      },
    ],
    groups: [
      {
        name: "command-exploration",
        description: "Parameters for exploring specific commands",
        parameters: [
          "mode",
          "command",
          "includeExamples",
          "includePerformance",
        ],
        condition: "any",
      },
      {
        name: "category-browsing",
        description: "Parameters for browsing command categories",
        parameters: ["mode", "category", "includeExamples"],
        condition: "any",
      },
      {
        name: "migration-assistance",
        description: "Parameters for migration guidance",
        parameters: ["mode", "source", "command"],
        condition: "any",
      },
    ],
    presets: [
      {
        name: "quick-command-lookup",
        description: "Quick command reference without examples",
        values: { mode: "command", includeExamples: false },
        useCase: "Fast command syntax lookup",
      },
      {
        name: "detailed-command-analysis",
        description:
          "Comprehensive command analysis with examples and performance",
        values: {
          mode: "command",
          includeExamples: true,
          includePerformance: true,
        },
        useCase: "In-depth command understanding",
      },
      {
        name: "category-learning",
        description: "Learn about command categories with examples",
        values: { mode: "category", includeExamples: true },
        useCase: "Learning Redis data structures",
      },
      {
        name: "ioredis-migration",
        description: "Migrate from ioredis to GLIDE",
        values: { mode: "migration", source: "ioredis" },
        useCase: "Library migration assistance",
      },
    ],
    examples: [
      {
        name: "Command Exploration",
        description: "Explore the GET command with examples",
        parameters: { mode: "command", command: "GET", includeExamples: true },
        expectedResult:
          "Detailed GET command information with syntax and examples",
      },
      {
        name: "Category Browsing",
        description: "Browse string commands",
        parameters: { mode: "category", category: "strings" },
        expectedResult: "Overview of string operations with popular commands",
      },
      {
        name: "Migration Help",
        description: "Get migration help for HSET from ioredis",
        parameters: { mode: "migration", command: "HSET", source: "ioredis" },
        expectedResult: "Migration guidance from ioredis HSET to GLIDE",
      },
    ],
  };

  /**
   * Main exploration entry point
   */
  static async explore(
    request: ApiExplorerRequest,
    context: EnhancedQueryContext,
  ): Promise<ApiExplorerResponse> {
    const startTime = Date.now();

    // Validate request parameters
    const validation = await UniversalValidator.validateParameters(
      request,
      this.parameterSchema.parameters,
      context,
    );
    if (!validation.isValid) {
      throw new Error(
        `Invalid parameters: ${validation.errors.map((e) => e.message).join(", ")}`,
      );
    }

    let response: ApiExplorerResponse;

    switch (request.mode) {
      case "command":
        response = await this.exploreCommand(request, context);
        break;
      case "category":
        response = await this.exploreCategory(request, context);
        break;
      case "migration":
        response = await this.exploreMigration(request, context);
        break;
      case "performance":
        response = await this.explorePerformance(request, context);
        break;
      case "search":
        response = await this.exploreSearch(request, context);
        break;
      default:
        throw new Error(`Unsupported exploration mode: ${request.mode}`);
    }

    // Add metadata
    response.metadata = {
      responseTime: Date.now() - startTime,
      confidence: this.calculateConfidence(request, context),
      sources: this.getSources(request),
      relatedTopics: this.getRelatedTopics(request, context),
      estimatedReadTime: this.estimateReadTime(response),
    };

    return response;
  }

  /**
   * Explore specific command
   */
  private static async exploreCommand(
    request: ApiExplorerRequest,
    context: EnhancedQueryContext,
  ): Promise<ApiExplorerResponse> {
    if (!request.command) {
      throw new Error("Command parameter is required for command exploration");
    }

    const commandResult = await CommandHandlers.handleCommand(
      request.command,
      context,
    );
    const sections = this.buildCommandSections(commandResult);
    const examples = this.buildExampleSections(commandResult.examples);

    let performance: PerformanceSection | undefined;
    if (request.includePerformance) {
      const perfData = PerformanceAnalyzer.getPerformanceData(request.command);
      if (perfData) {
        performance = this.buildPerformanceSection(perfData);
      }
    }

    return {
      mode: "command",
      title: `${request.command} Command Reference`,
      summary: commandResult.description,
      sections,
      examples,
      relatedCommands: commandResult.relatedCommands,
      nextSteps: this.generateCommandNextSteps(commandResult, context),
      performance,
      metadata: {} as ResponseMetadata, // Will be filled by main explore method
    };
  }

  /**
   * Explore command category
   */
  private static async exploreCategory(
    request: ApiExplorerRequest,
    context: EnhancedQueryContext,
  ): Promise<ApiExplorerResponse> {
    if (!request.category) {
      throw new Error(
        "Category parameter is required for category exploration",
      );
    }

    const browsingResult = await CategoryBrowser.browseCategory(
      request.category,
      context,
      {
        includeExamples: request.includeExamples,
        maxCommands: 5,
      },
    );

    const sections = this.buildCategorySections(browsingResult);
    const examples = this.buildCategoryExamples(browsingResult.category);

    return {
      mode: "category",
      title: `${browsingResult.category.displayName} Commands`,
      summary: browsingResult.category.description,
      sections,
      examples,
      relatedCommands: browsingResult.category.popularCommands,
      nextSteps: browsingResult.nextSteps,
      metadata: {} as ResponseMetadata,
    };
  }

  /**
   * Explore migration options
   */
  private static async exploreMigration(
    request: ApiExplorerRequest,
    context: EnhancedQueryContext,
  ): Promise<ApiExplorerResponse> {
    if (!request.sourceLibrary) {
      throw new Error(
        "Source library parameter is required for migration exploration",
      );
    }

    let migrationGuide: MigrationGuide;
    if (request.command) {
      // Single command migration
      migrationGuide = CrossReferenceMapper.generateMigrationGuide(
        request.sourceLibrary,
        [request.command],
      );
    } else {
      // General migration guide
      migrationGuide = CrossReferenceMapper.generateMigrationGuide(
        request.sourceLibrary,
      );
    }

    const sections = this.buildMigrationSections(migrationGuide);
    const migration = this.buildMigrationSection(migrationGuide);

    return {
      mode: "migration",
      title: `Migration from ${request.sourceLibrary} to GLIDE`,
      summary: `Comprehensive migration guide from ${request.sourceLibrary} to GLIDE`,
      sections,
      examples: this.buildMigrationExamples(migrationGuide),
      nextSteps: migrationGuide.bestPractices.slice(0, 3),
      migration,
      metadata: {} as ResponseMetadata,
    };
  }

  /**
   * Explore performance characteristics
   */
  private static async explorePerformance(
    request: ApiExplorerRequest,
    context: EnhancedQueryContext,
  ): Promise<ApiExplorerResponse> {
    if (!request.command) {
      throw new Error(
        "Command parameter is required for performance exploration",
      );
    }

    const perfAnalysis = PerformanceAnalyzer.analyzePerformance(
      request.command,
      context,
      {
        frequency: request.performanceContext?.usageFrequency,
        dataSize: request.performanceContext?.dataSize,
        concurrency: request.performanceContext?.concurrencyLevel,
      },
    );

    if (!perfAnalysis) {
      throw new Error(
        `Performance data not available for command: ${request.command}`,
      );
    }

    const sections = this.buildPerformanceSections(perfAnalysis);
    const performance = this.buildPerformanceSection(
      PerformanceAnalyzer.getPerformanceData(request.command)!,
    );

    return {
      mode: "performance",
      title: `${request.command} Performance Analysis`,
      summary: `Comprehensive performance analysis for ${request.command} command`,
      sections,
      examples: this.buildPerformanceExamples(perfAnalysis),
      performance,
      metadata: {} as ResponseMetadata,
    };
  }

  /**
   * Explore search results
   */
  private static async exploreSearch(
    request: ApiExplorerRequest,
    context: EnhancedQueryContext,
  ): Promise<ApiExplorerResponse> {
    if (!request.query) {
      throw new Error("Query parameter is required for search exploration");
    }

    // Search across categories and commands
    const categoryResults = CategoryBrowser.searchCategories(request.query);
    const commandResults = CommandHandlers.getAvailableCommands()
      .filter((cmd) => cmd.toLowerCase().includes(request.query!.toLowerCase()))
      .slice(0, 5);

    const sections = this.buildSearchSections(
      categoryResults,
      commandResults,
      request.query,
    );

    return {
      mode: "search",
      title: `Search Results for "${request.query}"`,
      summary: `Found ${categoryResults.length} categories and ${commandResults.length} commands`,
      sections,
      examples: [],
      relatedCommands: commandResults,
      metadata: {} as ResponseMetadata,
    };
  }

  /**
   * Build sections for command exploration
   */
  private static buildCommandSections(
    commandResult: CommandHandlerResult,
  ): ResponseSection[] {
    const sections: ResponseSection[] = [
      {
        type: "description",
        title: "Description",
        content: commandResult.description,
        priority: 1,
      },
      {
        type: "syntax",
        title: "Syntax",
        content: `\`${commandResult.syntax}\``,
        priority: 2,
      },
    ];

    if (commandResult.parameters.length > 0) {
      const paramContent = commandResult.parameters
        .map(
          (param) =>
            `- **${param.name}** (${param.type}${param.required ? ", required" : ", optional"}): ${param.description}`,
        )
        .join("\n");

      sections.push({
        type: "parameters",
        title: "Parameters",
        content: paramContent,
        priority: 3,
      });
    }

    if (commandResult.useCases.length > 0) {
      sections.push({
        type: "use-cases",
        title: "Common Use Cases",
        content: commandResult.useCases
          .map((useCase) => `- ${useCase}`)
          .join("\n"),
        priority: 4,
      });
    }

    if (commandResult.bestPractices.length > 0) {
      sections.push({
        type: "best-practices",
        title: "Best Practices",
        content: commandResult.bestPractices
          .map((practice) => `- ${practice}`)
          .join("\n"),
        priority: 5,
      });
    }

    return sections;
  }

  /**
   * Build example sections
   */
  private static buildExampleSections(examples: any[]): ExampleSection[] {
    return examples.map((example) => ({
      title: example.title,
      description: example.explanation,
      code: example.code,
      complexity: example.complexity,
      category: example.category || "general",
      language: "typescript",
    }));
  }

  /**
   * Build performance section
   */
  private static buildPerformanceSection(
    perfData: PerformanceData,
  ): PerformanceSection {
    return {
      timeComplexity: perfData.timeComplexity,
      spaceComplexity: perfData.spaceComplexity,
      benchmarks: perfData.benchmarks.map((benchmark) => ({
        scenario: benchmark.scenario,
        throughput: `${benchmark.operationsPerSecond.toLocaleString()} ops/sec`,
        latency: `P50: ${benchmark.latencyP50}ms, P95: ${benchmark.latencyP95}ms`,
        memoryUsage: `${(benchmark.memoryUsage / 1024).toFixed(2)} KB`,
      })),
      recommendations: perfData.optimizationTips.map((tip) => tip.tip),
      optimizations: perfData.optimizationTips
        .filter((tip) => tip.impact === "high")
        .map((tip) => tip.tip),
    };
  }

  /**
   * Build category sections
   */
  private static buildCategorySections(
    browsingResult: BrowsingResult,
  ): ResponseSection[] {
    const sections: ResponseSection[] = [
      {
        type: "description",
        title: "Overview",
        content: browsingResult.category.description,
        priority: 1,
      },
      {
        type: "use-cases",
        title: "Common Use Cases",
        content: browsingResult.category.commonUseCases
          .map((useCase) => `- ${useCase}`)
          .join("\n"),
        priority: 2,
      },
    ];

    if (browsingResult.commandDetails.length > 0) {
      const commandList = browsingResult.commandDetails
        .map((cmd) => `- **${cmd.command}**: ${cmd.description}`)
        .join("\n");

      sections.push({
        type: "description",
        title: "Available Commands",
        content: commandList,
        priority: 3,
      });
    }

    return sections;
  }

  /**
   * Build category examples
   */
  private static buildCategoryExamples(
    category: CategoryInfo,
  ): ExampleSection[] {
    return category.examples.map((example) => ({
      title: example.title,
      description: example.description,
      code: example.code,
      complexity: example.complexity,
      category: example.useCase,
      language: "typescript",
    }));
  }

  /**
   * Calculate confidence score
   */
  private static calculateConfidence(
    request: ApiExplorerRequest,
    context: EnhancedQueryContext,
  ): number {
    let confidence = 0.8; // Base confidence

    // Adjust based on request completeness
    if (
      request.command &&
      CommandHandlers.getAvailableCommands().includes(
        request.command.toUpperCase(),
      )
    ) {
      confidence += 0.1;
    }

    if (request.category && CategoryBrowser.getCategory(request.category)) {
      confidence += 0.1;
    }

    // Adjust based on context
    if (context.confidence) {
      confidence = (confidence + context.confidence) / 2;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Get response sources
   */
  private static getSources(request: ApiExplorerRequest): string[] {
    const sources = ["GLIDE Command Registry", "Performance Database"];

    if (request.mode === "migration") {
      sources.push("Cross-Reference Mapping Database");
    }

    if (request.mode === "category") {
      sources.push("Category Browser Database");
    }

    return sources;
  }

  /**
   * Get related topics
   */
  private static getRelatedTopics(
    request: ApiExplorerRequest,
    context: EnhancedQueryContext,
  ): string[] {
    const topics: string[] = [];

    if (request.command) {
      topics.push(
        `${request.command} performance`,
        `${request.command} examples`,
      );
    }

    if (request.category) {
      topics.push(
        `${request.category} best practices`,
        `${request.category} patterns`,
      );
    }

    if (context.detectedPatterns.length > 0) {
      topics.push(...context.detectedPatterns.map((p) => p.type));
    }

    return topics.slice(0, 5);
  }

  /**
   * Estimate reading time
   */
  private static estimateReadTime(response: ApiExplorerResponse): number {
    const wordsPerMinute = 200;
    const totalWords = [
      response.summary,
      ...response.sections.map((s) => s.content),
      ...response.examples.map((e) => e.description + e.code),
    ]
      .join(" ")
      .split(" ").length;

    return Math.ceil(totalWords / wordsPerMinute);
  }

  // Additional helper methods for building other sections...
  private static buildMigrationSections(
    guide: MigrationGuide,
  ): ResponseSection[] {
    return [
      {
        type: "description",
        title: "Migration Overview",
        content: `Guide for migrating from ${guide.fromLibrary} to GLIDE`,
        priority: 1,
      },
    ];
  }

  private static buildMigrationSection(
    guide: MigrationGuide,
  ): MigrationSection {
    return {
      sourceLibrary: guide.fromLibrary,
      targetLibrary: "GLIDE",
      complexity:
        guide.mappings.length > 0
          ? guide.mappings[0].migrationComplexity
          : "simple",
      steps: guide.migrationSteps.map((step) => step.description),
      codeComparison: [],
      warnings: guide.commonPitfalls,
    };
  }

  private static buildMigrationExamples(
    guide: MigrationGuide,
  ): ExampleSection[] {
    return [];
  }

  private static buildPerformanceSections(
    analysis: PerformanceAnalysis,
  ): ResponseSection[] {
    return [
      {
        type: "description",
        title: "Performance Assessment",
        content: `Overall performance: ${analysis.performanceAssessment.overall}`,
        priority: 1,
      },
    ];
  }

  private static buildPerformanceExamples(
    analysis: PerformanceAnalysis,
  ): ExampleSection[] {
    return analysis.optimizations.map((opt) => ({
      title: opt.suggestion,
      description: opt.impact,
      code: opt.code || `// ${opt.suggestion}`,
      complexity:
        opt.complexity === "easy"
          ? "simple"
          : opt.complexity === "moderate"
            ? "intermediate"
            : "advanced",
      category: opt.category,
      language: "typescript",
    }));
  }

  private static buildSearchSections(
    categoryResults: CategoryInfo[],
    commandResults: string[],
    query: string,
  ): ResponseSection[] {
    const sections: ResponseSection[] = [];

    if (categoryResults.length > 0) {
      sections.push({
        type: "description",
        title: "Matching Categories",
        content: categoryResults
          .map((cat) => `- **${cat.displayName}**: ${cat.description}`)
          .join("\n"),
        priority: 1,
      });
    }

    if (commandResults.length > 0) {
      sections.push({
        type: "description",
        title: "Matching Commands",
        content: commandResults.map((cmd) => `- ${cmd}`).join("\n"),
        priority: 2,
      });
    }

    return sections;
  }

  private static generateCommandNextSteps(
    commandResult: CommandHandlerResult,
    context: EnhancedQueryContext,
  ): string[] {
    const steps: string[] = [];

    if (context.userExperienceLevel === "beginner") {
      steps.push("Try the basic example", "Read about common use cases");
    } else {
      steps.push(
        "Explore advanced examples",
        "Check performance characteristics",
      );
    }

    if (commandResult.relatedCommands.length > 0) {
      steps.push(
        `Learn about related commands: ${commandResult.relatedCommands.slice(0, 2).join(", ")}`,
      );
    }

    return steps;
  }

  /**
   * Get parameter schema for validation
   */
  static getParameterSchema(): ParameterSchema {
    return this.parameterSchema;
  }
}

// Export convenience function
export const exploreApi = EnhancedApiExplorer.explore;
