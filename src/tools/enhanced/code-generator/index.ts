/**
 * Enhanced Code Generator Tool
 * Integrates pattern-aware generation, context-sensitive templates, and production-ready code generation
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import { UniversalValidator } from "../../core/schema/universal-validator.js";
import {
  COMMON_PARAMETERS,
  ParameterSchema,
} from "../../core/schema/parameter-definitions.js";
import {
  PatternAwareGenerator,
  GenerationRequest,
  GenerationResult,
} from "./pattern-generator.js";
import {
  ContextSensitiveTemplateEngine,
  TemplateContext,
  TemplateConfiguration,
} from "./template-engine.js";
import {
  ProductionCodeGenerator,
  ProductionCodeOptions,
  ProductionResult,
} from "./production-generator.js";

export interface CodeGeneratorRequest {
  mode: "pattern" | "template" | "production";
  pattern: string;
  language: "typescript" | "javascript";
  framework?: "express" | "fastify" | "nest" | "next";
  environment?: "development" | "production" | "testing";
  features?: string[];
  options?: CodeGeneratorOptions;
  placeholders?: Record<string, any>;
}

export interface CodeGeneratorOptions {
  includeErrorHandling: boolean;
  includeLogging: boolean;
  includeTests: boolean;
  includeDocumentation: boolean;
  includeMetrics: boolean;
  targetEnvironment: "node" | "browser";
  codeStyle: "functional" | "class-based";
  optimizationLevel: "development" | "production";
  securityLevel: "basic" | "enhanced";
}

export interface CodeGeneratorResponse {
  mode: string;
  pattern: string;
  language: string;
  framework?: string;
  mainCode: string;
  files: GeneratedCodeFile[];
  dependencies: string[];
  documentation: string;
  examples: CodeExample[];
  usage: UsageGuide;
  metadata: GenerationMetadata;
}

export interface GeneratedCodeFile {
  path: string;
  content: string;
  type: "main" | "config" | "test" | "utility" | "types";
  description: string;
  language: string;
}

export interface CodeExample {
  title: string;
  description: string;
  code: string;
  complexity: "simple" | "intermediate" | "advanced";
  category: string;
}

export interface UsageGuide {
  installation: string[];
  configuration: string[];
  basicUsage: string[];
  advancedUsage: string[];
  troubleshooting: string[];
}

export interface GenerationMetadata {
  generatedAt: Date;
  pattern: string;
  template?: string;
  features: string[];
  performance: PerformanceNotes;
  security: SecurityNotes;
}

export interface PerformanceNotes {
  complexity: string;
  scalability: string;
  optimizations: string[];
}

export interface SecurityNotes {
  considerations: string[];
  implementations: string[];
  recommendations: string[];
}

export class EnhancedCodeGenerator {
  private static parameterSchema: ParameterSchema = {
    parameters: [
      {
        name: "mode",
        type: "enum",
        required: true,
        description: "Code generation mode",
        examples: ["pattern", "template", "production"],
        validation: [
          {
            type: "enum",
            allowedValues: ["pattern", "template", "production"],
            errorMessage: "Mode must be pattern, template, or production",
            level: "strict",
          },
        ],
        category: "general",
      },
      {
        name: "pattern",
        type: "string",
        required: true,
        description: "Code pattern to generate",
        examples: ["basic-client", "caching", "streams", "sessions"],
        category: "pattern",
      },
      {
        name: "language",
        type: "enum",
        required: true,
        description: "Programming language",
        examples: ["typescript", "javascript"],
        validation: [
          {
            type: "enum",
            allowedValues: ["typescript", "javascript"],
            errorMessage: "Language must be typescript or javascript",
            level: "strict",
          },
        ],
        category: "general",
      },
      {
        name: "framework",
        type: "enum",
        required: false,
        description: "Web framework for template generation",
        examples: ["express", "fastify", "nest", "next"],
        validation: [
          {
            type: "enum",
            allowedValues: ["express", "fastify", "nest", "next"],
            errorMessage: "Unsupported framework",
            level: "lenient",
          },
        ],
        category: "template",
      },
      {
        name: "includeTests",
        type: "boolean",
        required: false,
        description: "Include test files",
        examples: ["true", "false"],
        defaultValue: false,
        category: "options",
      },
      {
        name: "includeErrorHandling",
        type: "boolean",
        required: false,
        description: "Include comprehensive error handling",
        examples: ["true", "false"],
        defaultValue: true,
        category: "options",
      },
      {
        name: "includeLogging",
        type: "boolean",
        required: false,
        description: "Include logging infrastructure",
        examples: ["true", "false"],
        defaultValue: false,
        category: "options",
      },
    ],
    groups: [
      {
        name: "pattern-generation",
        description: "Parameters for pattern-based generation",
        parameters: ["mode", "pattern", "language", "includeTests"],
        condition: "any",
      },
      {
        name: "template-generation",
        description: "Parameters for template-based generation",
        parameters: ["mode", "pattern", "language", "framework"],
        condition: "any",
      },
      {
        name: "production-generation",
        description: "Parameters for production-ready generation",
        parameters: [
          "mode",
          "pattern",
          "language",
          "includeErrorHandling",
          "includeLogging",
        ],
        condition: "any",
      },
    ],
    presets: [
      {
        name: "quick-prototype",
        description: "Quick prototype without tests or advanced features",
        values: {
          mode: "pattern",
          language: "typescript",
          includeTests: false,
          includeErrorHandling: false,
        },
        useCase: "Rapid prototyping",
      },
      {
        name: "production-ready",
        description: "Production-ready code with all features",
        values: {
          mode: "production",
          language: "typescript",
          includeTests: true,
          includeErrorHandling: true,
          includeLogging: true,
        },
        useCase: "Production deployment",
      },
      {
        name: "express-api",
        description: "Express.js API with Redis",
        values: {
          mode: "template",
          pattern: "basic-client",
          language: "typescript",
          framework: "express",
        },
        useCase: "Web API development",
      },
    ],
    examples: [
      {
        name: "Basic Redis Client",
        description: "Generate a simple Redis client",
        parameters: {
          mode: "pattern",
          pattern: "basic-client",
          language: "typescript",
        },
        expectedResult: "TypeScript Redis client class with basic operations",
      },
      {
        name: "Caching Layer",
        description: "Generate an intelligent caching layer",
        parameters: {
          mode: "pattern",
          pattern: "caching",
          language: "typescript",
          includeTests: true,
        },
        expectedResult: "Complete caching solution with tests",
      },
      {
        name: "Express API",
        description: "Generate Express.js API with Redis",
        parameters: {
          mode: "template",
          pattern: "basic-client",
          language: "typescript",
          framework: "express",
        },
        expectedResult: "Express.js application with Redis integration",
      },
    ],
  };

  /**
   * Main generation entry point
   */
  static async generate(
    request: CodeGeneratorRequest,
    context: EnhancedQueryContext,
  ): Promise<CodeGeneratorResponse> {
    // Validate request
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

    // Set defaults
    const options: CodeGeneratorOptions = {
      includeErrorHandling: true,
      includeLogging: false,
      includeTests: false,
      includeDocumentation: true,
      includeMetrics: false,
      targetEnvironment: "node",
      codeStyle: "class-based",
      optimizationLevel: "development",
      securityLevel: "basic",
      ...request.options,
    };

    let result: CodeGeneratorResponse;

    switch (request.mode) {
      case "pattern":
        result = await this.generateFromPattern(request, options, context);
        break;
      case "template":
        result = await this.generateFromTemplate(request, options, context);
        break;
      case "production":
        result = await this.generateProductionCode(request, options, context);
        break;
      default:
        throw new Error(`Unsupported generation mode: ${request.mode}`);
    }

    // Add metadata
    result.metadata = this.generateMetadata(request, options, result);

    return result;
  }

  /**
   * Generate from pattern
   */
  private static async generateFromPattern(
    request: CodeGeneratorRequest,
    options: CodeGeneratorOptions,
    context: EnhancedQueryContext,
  ): Promise<CodeGeneratorResponse> {
    const generationRequest: GenerationRequest = {
      pattern: request.pattern,
      language: request.language,
      options: {
        includeErrorHandling: options.includeErrorHandling,
        includeLogging: options.includeLogging,
        targetEnvironment: options.targetEnvironment,
        codeStyle: options.codeStyle,
        // Fields above conform to GenerationOptions; removed unsupported optimizationLevel
        includeTests: options.includeTests,
      },
      placeholders: request.placeholders,
    };

    const result = await PatternAwareGenerator.generateCode(
      generationRequest,
      context,
    );

    return {
      mode: request.mode,
      pattern: request.pattern,
      language: request.language,
      mainCode: result.code,
      files: result.files.map((file) => ({
        path: file.path,
        content: file.content,
        type: file.type as any,
        description: file.description,
        language: request.language,
      })),
      dependencies: result.dependencies,
      documentation: this.generatePatternDocumentation(result.pattern, options),
      examples: this.generatePatternExamples(result.pattern, request.language),
      usage: this.generateUsageGuide(result.pattern, result.dependencies),
      metadata: {} as GenerationMetadata, // Will be set by main generate method
    };
  }

  /**
   * Generate from template
   */
  private static async generateFromTemplate(
    request: CodeGeneratorRequest,
    options: CodeGeneratorOptions,
    context: EnhancedQueryContext,
  ): Promise<CodeGeneratorResponse> {
    if (!request.framework) {
      throw new Error("Framework is required for template generation");
    }

    const templateContext: TemplateContext = {
      framework: request.framework,
      environment: request.environment || "development",
      features: (request.features || []).map((name) => ({
        name,
        enabled: true,
      })),
      constraints: [],
      preferences: {
        codeStyle: options.codeStyle,
        errorHandling: options.includeErrorHandling ? "comprehensive" : "basic",
        logging: options.includeLogging ? "structured" : "none",
        testing: options.includeTests ? "unit" : "none",
        documentation: options.includeDocumentation ? "standard" : "minimal",
      },
    };

    const templateConfig =
      ContextSensitiveTemplateEngine.generateTemplateConfiguration(
        request.pattern,
        templateContext,
        context,
      );

    const code = ContextSensitiveTemplateEngine.applyTemplate(
      templateConfig,
      request.placeholders || {},
      templateContext.preferences,
    );

    return {
      mode: request.mode,
      pattern: request.pattern,
      language: request.language,
      framework: request.framework,
      mainCode: code,
      files: templateConfig.configFiles.map((file) => ({
        path: file.path,
        content: file.content,
        type: file.type === "json" ? "config" : "utility",
        description: file.description,
        language:
          file.type === "ts"
            ? "typescript"
            : file.type === "js"
              ? "javascript"
              : "json",
      })),
      dependencies: templateConfig.dependencies.map((dep) => dep.name),
      documentation: this.generateTemplateDocumentation(
        request.framework,
        request.pattern,
      ),
      examples: templateConfig.examples.map((ex) => ({
        title: ex.title,
        description: ex.description,
        code: ex.code,
        complexity: ex.complexity as any,
        category: ex.framework || "general",
      })),
      usage: this.generateFrameworkUsageGuide(
        request.framework,
        templateConfig.dependencies,
      ),
      metadata: {} as GenerationMetadata,
    };
  }

  /**
   * Generate production code
   */
  private static async generateProductionCode(
    request: CodeGeneratorRequest,
    options: CodeGeneratorOptions,
    context: EnhancedQueryContext,
  ): Promise<CodeGeneratorResponse> {
    const productionOptions: ProductionCodeOptions = {
      errorHandling: options.includeErrorHandling ? "comprehensive" : "basic",
      monitoring: options.includeMetrics ? "advanced" : "none",
      logging: options.includeLogging ? "structured" : "console",
      security: options.securityLevel,
      performance:
        options.optimizationLevel === "production" ? "optimized" : "standard",
      reliability:
        options.optimizationLevel === "production"
          ? "high-availability"
          : "standard",
      testing: options.includeTests ? "comprehensive" : "unit",
    };

    const result = ProductionCodeGenerator.generateProductionCode(
      request.pattern,
      productionOptions,
      request.placeholders || {},
      context,
    );

    return {
      mode: request.mode,
      pattern: request.pattern,
      language: request.language,
      mainCode: result.mainCode,
      files: result.supportingFiles.map((file) => ({
        path: file.name,
        content: file.content,
        type: file.type as any,
        description: file.description,
        language: file.name.endsWith(".ts")
          ? "typescript"
          : file.name.endsWith(".js")
            ? "javascript"
            : "json",
      })),
      dependencies: result.dependencies,
      documentation: result.documentation,
      examples: result.examples.map((code) => ({
        title: "Usage Example",
        description: "Production usage example",
        code,
        complexity: "intermediate" as const,
        category: "production",
      })),
      usage: this.generateProductionUsageGuide(result.dependencies),
      metadata: {} as GenerationMetadata,
    };
  }

  /**
   * Helper methods for generating documentation and guides
   */
  private static generatePatternDocumentation(
    pattern: string,
    options: CodeGeneratorOptions,
  ): string {
    return `# ${pattern} Pattern

Generated code implementing the ${pattern} pattern for Redis operations.

## Features
- ${options.includeErrorHandling ? "Comprehensive error handling" : "Basic error handling"}
- ${options.includeLogging ? "Structured logging" : "Console logging"}
- ${options.includeTests ? "Unit tests included" : "No tests included"}
- ${options.includeMetrics ? "Metrics collection" : "No metrics"}

## Usage
See the generated code for implementation details and usage examples.`;
  }

  private static generateTemplateDocumentation(
    framework: string,
    pattern: string,
  ): string {
    return `# ${framework} Application with ${pattern}

Generated ${framework} application implementing the ${pattern} pattern.

## Getting Started
1. Install dependencies: \`npm install\`
2. Configure Redis connection
3. Start the application: \`npm run dev\`

## Framework Features
- ${framework} web framework integration
- Redis client configuration
- Environment-based configuration
- Health check endpoints`;
  }

  private static generatePatternExamples(
    pattern: string,
    language: string,
  ): CodeExample[] {
    return [
      {
        title: `${pattern} Basic Usage`,
        description: `Basic usage of the ${pattern} pattern`,
        code: `// Basic ${pattern} example\nconst client = new RedisClient();\nawait client.connect();`,
        complexity: "simple",
        category: pattern,
      },
    ];
  }

  private static generateUsageGuide(
    pattern: string,
    dependencies: string[],
  ): UsageGuide {
    return {
      installation: [
        "npm install " + dependencies.join(" "),
        "Ensure Redis server is running",
      ],
      configuration: [
        "Set Redis connection parameters",
        "Configure timeouts and retry settings",
      ],
      basicUsage: [
        "Import the generated class",
        "Create an instance with configuration",
        "Connect to Redis",
        "Perform operations",
      ],
      advancedUsage: [
        "Configure monitoring and metrics",
        "Implement error recovery strategies",
        "Set up health checks",
      ],
      troubleshooting: [
        "Check Redis connection",
        "Verify configuration parameters",
        "Review error logs",
      ],
    };
  }

  private static generateFrameworkUsageGuide(
    framework: string,
    dependencies: any[],
  ): UsageGuide {
    return {
      installation: [
        "npm install " + dependencies.map((d) => d.name).join(" "),
        `Install ${framework} if not already present`,
      ],
      configuration: [
        "Update environment variables",
        "Configure Redis connection settings",
        `Configure ${framework} middleware`,
      ],
      basicUsage: [
        "Start the development server",
        "Test Redis connectivity",
        "Implement your API endpoints",
      ],
      advancedUsage: [
        "Configure production environment",
        "Set up monitoring and logging",
        "Implement caching strategies",
      ],
      troubleshooting: [
        "Check Redis connectivity",
        "Verify environment configuration",
        `Review ${framework} logs`,
      ],
    };
  }

  private static generateProductionUsageGuide(
    dependencies: string[],
  ): UsageGuide {
    return {
      installation: [
        "npm install " + dependencies.join(" "),
        "Install monitoring dependencies",
      ],
      configuration: [
        "Set production environment variables",
        "Configure monitoring and alerting",
        "Set up log aggregation",
      ],
      basicUsage: [
        "Deploy to production environment",
        "Monitor application health",
        "Scale based on metrics",
      ],
      advancedUsage: [
        "Implement circuit breakers",
        "Configure distributed tracing",
        "Set up automated recovery",
      ],
      troubleshooting: [
        "Check application metrics",
        "Review error logs and traces",
        "Verify infrastructure health",
      ],
    };
  }

  private static generateMetadata(
    request: CodeGeneratorRequest,
    options: CodeGeneratorOptions,
    result: CodeGeneratorResponse,
  ): GenerationMetadata {
    return {
      generatedAt: new Date(),
      pattern: request.pattern,
      template: request.framework,
      features: Object.entries(options)
        .filter(([_, enabled]) => enabled)
        .map(([feature, _]) => feature),
      performance: {
        complexity: "O(1) for most operations",
        scalability: "Horizontal scaling supported",
        optimizations:
          options.optimizationLevel === "production"
            ? ["Connection pooling", "Circuit breakers", "Metrics collection"]
            : ["Basic error handling"],
      },
      security: {
        considerations: [
          "Input validation",
          "Connection security",
          "Error information disclosure",
        ],
        implementations:
          options.securityLevel === "enhanced"
            ? ["Input validation", "Rate limiting", "Authentication"]
            : ["Basic input validation"],
        recommendations: [
          "Use TLS for Redis connections",
          "Implement proper authentication",
          "Validate all user inputs",
        ],
      },
    };
  }

  /**
   * Get available patterns
   */
  static getAvailablePatterns(): string[] {
    return PatternAwareGenerator.getPatterns().map((p) => p.name);
  }

  /**
   * Get available frameworks
   */
  static getAvailableFrameworks(): string[] {
    return ContextSensitiveTemplateEngine.getFrameworks();
  }

  /**
   * Get parameter schema
   */
  static getParameterSchema(): ParameterSchema {
    return this.parameterSchema;
  }
}

// Export convenience function
export const generateCode = EnhancedCodeGenerator.generate;
