/**
 * Universal Parameter Validator
 * Provides comprehensive parameter validation, type coercion, and intelligent error handling
 */

import { z } from "zod";
import {
  ParameterDefinition,
  ParameterSchema,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  QueryContext,
  createZodSchema,
  COMMON_PARAMETERS,
} from "./parameter-definitions.js";

export class UniversalValidator {
  /**
   * Main validation entry point
   * Validates parameters against schema with context awareness
   */
  static async validateParameters(
    args: any,
    schema: ParameterDefinition[],
    context?: QueryContext,
  ): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
    };

    try {
      // Create Zod schema from parameter definitions
      const zodSchema = this.createZodSchemaFromDefinitions(schema);

      // Perform basic Zod validation
      const validationResult = zodSchema.safeParse(args);

      if (!validationResult.success) {
        result.isValid = false;
        result.errors = this.formatZodErrors(validationResult.error);
      } else {
        result.coercedValue = validationResult.data;
      }

      // Additional context-aware validation
      for (const paramDef of schema) {
        const value = args[paramDef.name];
        const paramResult = await this.validateSingleParameter(
          value,
          paramDef,
          context,
          args,
        );

        result.errors.push(...paramResult.errors);
        result.warnings.push(...paramResult.warnings);
        result.suggestions.push(...paramResult.suggestions);

        if (paramResult.errors.length > 0) {
          result.isValid = false;
        }
      }

      // Validate parameter dependencies
      const depResult = this.validateDependencies(args, schema);
      result.errors.push(...depResult.errors);
      result.warnings.push(...depResult.warnings);

      if (depResult.errors.length > 0) {
        result.isValid = false;
      }

      // Add intelligent suggestions for improvement
      result.suggestions.push(
        ...this.generateIntelligentSuggestions(args, schema, context),
      );
    } catch (error) {
      result.isValid = false;
      result.errors.push({
        field: "general",
        message: `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
        code: "VALIDATION_ERROR",
        severity: "error",
      });
    }

    return result;
  }

  /**
   * Validate a single parameter with custom rules and context awareness
   */
  private static async validateSingleParameter(
    value: any,
    paramDef: ParameterDefinition,
    context?: QueryContext,
    allArgs?: any,
  ): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
    };

    // Skip validation if parameter is not provided and not required
    if (value === undefined && !paramDef.required) {
      return result;
    }

    // Validate custom rules
    if (paramDef.validation) {
      for (const rule of paramDef.validation) {
        const ruleResult = await this.validateRule(
          value,
          rule,
          paramDef,
          context,
        );

        if (ruleResult.severity === "error") {
          result.isValid = false;
          result.errors.push(ruleResult);
        } else if (ruleResult.severity === "warning") {
          result.warnings.push({
            field: paramDef.name,
            message: ruleResult.message,
            suggestion: this.generateSuggestionForRule(value, rule, paramDef),
          });
        }
      }
    }

    // Context-aware validation
    if (context) {
      const contextResult = this.validateWithContext(value, paramDef, context);
      result.warnings.push(...contextResult.warnings);
      result.suggestions.push(...contextResult.suggestions);
    }

    return result;
  }

  /**
   * Validate individual validation rules
   */
  private static async validateRule(
    value: any,
    rule: any,
    paramDef: ParameterDefinition,
    context?: QueryContext,
  ): Promise<ValidationError> {
    const error: ValidationError = {
      field: paramDef.name,
      message: rule.errorMessage || `Validation failed for ${paramDef.name}`,
      code: `${rule.type.toUpperCase()}_VALIDATION_FAILED`,
      severity: rule.level === "strict" ? "error" : "warning",
    };

    switch (rule.type) {
      case "regex":
        if (rule.pattern && !rule.pattern.test(String(value))) {
          return error;
        }
        break;

      case "range":
        if (typeof value === "number") {
          if (rule.min !== undefined && value < rule.min) {
            error.message = `Value ${value} is below minimum ${rule.min}`;
            return error;
          }
          if (rule.max !== undefined && value > rule.max) {
            error.message = `Value ${value} is above maximum ${rule.max}`;
            return error;
          }
        }
        break;

      case "enum":
        if (rule.allowedValues && !rule.allowedValues.includes(value)) {
          error.message = `Value "${value}" is not one of allowed values: ${rule.allowedValues.join(", ")}`;
          return error;
        }
        break;

      case "custom":
        if (rule.customValidator) {
          const customResult = rule.customValidator(value, context);
          if (!customResult.isValid) {
            error.message =
              customResult.errors[0]?.message || "Custom validation failed";
            return error;
          }
        }
        break;
    }

    // If we reach here, validation passed
    error.severity = "info";
    return error;
  }

  /**
   * Validate parameter dependencies
   */
  private static validateDependencies(
    args: any,
    schema: ParameterDefinition[],
  ): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const paramDef of schema) {
      if (paramDef.dependencies) {
        for (const dep of paramDef.dependencies) {
          const hasParam = args[paramDef.name] !== undefined;
          const hasDependency = args[dep.dependentParameter] !== undefined;

          switch (dep.condition) {
            case "required":
              if (hasParam && !hasDependency) {
                errors.push({
                  field: dep.dependentParameter,
                  message:
                    dep.message ||
                    `Parameter "${dep.dependentParameter}" is required when "${paramDef.name}" is provided`,
                  code: "DEPENDENCY_REQUIRED",
                  severity: "error",
                });
              }
              break;

            case "forbidden":
              if (hasParam && hasDependency) {
                errors.push({
                  field: dep.dependentParameter,
                  message:
                    dep.message ||
                    `Parameter "${dep.dependentParameter}" cannot be used with "${paramDef.name}"`,
                  code: "DEPENDENCY_FORBIDDEN",
                  severity: "error",
                });
              }
              break;

            case "conditional":
              if (
                hasParam &&
                dep.value &&
                args[paramDef.name] === dep.value &&
                !hasDependency
              ) {
                warnings.push({
                  field: dep.dependentParameter,
                  message:
                    dep.message ||
                    `Consider providing "${dep.dependentParameter}" when "${paramDef.name}" is "${dep.value}"`,
                  suggestion: `Add parameter "${dep.dependentParameter}"`,
                });
              }
              break;
          }
        }
      }
    }

    return { errors, warnings };
  }

  /**
   * Context-aware validation
   */
  private static validateWithContext(
    value: any,
    paramDef: ParameterDefinition,
    context: QueryContext,
  ): { warnings: ValidationWarning[]; suggestions: string[] } {
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Validate based on intent
    if (context.intent === "migrate" && paramDef.name === "source") {
      if (!["ioredis", "node-redis"].includes(value)) {
        warnings.push({
          field: paramDef.name,
          message:
            'For migration, source should typically be "ioredis" or "node-redis"',
          suggestion: 'Use "ioredis" or "node-redis" as source',
        });
      }
    }

    // Validate based on complexity
    if (context.complexity === "simple" && paramDef.name === "pattern") {
      const complexPatterns = [
        "distributed-lock",
        "rate-limiting",
        "cluster-client",
      ];
      if (complexPatterns.includes(value)) {
        warnings.push({
          field: paramDef.name,
          message: "This pattern may be complex for simple use cases",
          suggestion:
            'Consider "basic-client" or "caching" for simpler patterns',
        });
      }
    }

    // Validate based on domain
    if (context.domain && paramDef.relevantCommands) {
      const domainCommands = this.getCommandsForDomain(context.domain);
      const hasRelevantCommands = paramDef.relevantCommands.some((cmd) =>
        domainCommands.includes(cmd.toLowerCase()),
      );

      if (!hasRelevantCommands) {
        suggestions.push(
          `Consider commands relevant to ${context.domain}: ${domainCommands.slice(0, 3).join(", ")}`,
        );
      }
    }

    return { warnings, suggestions };
  }

  /**
   * Generate intelligent suggestions for parameter improvement
   */
  private static generateIntelligentSuggestions(
    args: any,
    schema: ParameterDefinition[],
    context?: QueryContext,
  ): string[] {
    const suggestions: string[] = [];

    // Suggest missing optional but useful parameters
    for (const paramDef of schema) {
      if (!paramDef.required && args[paramDef.name] === undefined) {
        if (paramDef.name === "complexity" && context?.intent === "generate") {
          suggestions.push(
            'Consider specifying "complexity" parameter for better tailored results',
          );
        }
        if (
          paramDef.name === "includeTests" &&
          context?.intent === "generate"
        ) {
          suggestions.push(
            'Add "includeTests: true" to generate test code alongside examples',
          );
        }
      }
    }

    // Suggest parameter combinations
    if (args.pattern && !args.includeTypeScript) {
      suggestions.push(
        'Consider "includeTypeScript: true" for better type safety in generated code',
      );
    }

    // Context-specific suggestions
    if (context?.intent === "search" && !args.category) {
      suggestions.push(
        'Specify "category" to narrow down search results to specific command types',
      );
    }

    return suggestions;
  }

  /**
   * Create Zod schema from parameter definitions
   */
  private static createZodSchemaFromDefinitions(
    definitions: ParameterDefinition[],
  ): z.ZodSchema {
    const schemaObject: Record<string, z.ZodSchema> = {};

    for (const paramDef of definitions) {
      schemaObject[paramDef.name] = createZodSchema(paramDef);
    }

    return z.object(schemaObject);
  }

  /**
   * Format Zod validation errors
   */
  private static formatZodErrors(error: z.ZodError): ValidationError[] {
    return error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
      code: err.code,
      severity: "error" as const,
    }));
  }

  /**
   * Generate suggestion for a specific validation rule
   */
  private static generateSuggestionForRule(
    value: any,
    rule: any,
    paramDef: ParameterDefinition,
  ): string {
    switch (rule.type) {
      case "enum":
        return `Use one of: ${rule.allowedValues?.join(", ")}`;
      case "regex":
        return `Value should match pattern: ${rule.pattern}`;
      case "range":
        if (rule.min && rule.max) {
          return `Value should be between ${rule.min} and ${rule.max}`;
        } else if (rule.min) {
          return `Value should be at least ${rule.min}`;
        } else if (rule.max) {
          return `Value should be at most ${rule.max}`;
        }
        break;
    }
    return `Check the format for ${paramDef.name}`;
  }

  /**
   * Get relevant commands for a domain
   */
  private static getCommandsForDomain(domain: string): string[] {
    const domainCommands: Record<string, string[]> = {
      strings: ["get", "set", "del", "exists", "incr", "decr"],
      hashes: ["hget", "hset", "hdel", "hgetall", "hkeys", "hvals"],
      lists: ["lpush", "rpush", "lpop", "rpop", "lrange", "llen"],
      sets: ["sadd", "srem", "smembers", "scard", "sinter"],
      streams: ["xadd", "xread", "xgroup", "xlen", "xrange"],
      geo: ["geoadd", "geodist", "georadius", "geopos"],
    };
    return domainCommands[domain] || [];
  }

  /**
   * Generate parameter hints for AI agents
   */
  static generateParameterHints(
    paramName: string,
    context?: QueryContext,
  ): string[] {
    const hints: string[] = [];

    const commonParam = COMMON_PARAMETERS[paramName];
    if (commonParam) {
      hints.push(...commonParam.examples);

      if (commonParam.contextHints) {
        hints.push(...commonParam.contextHints);
      }
    }

    // Add context-specific hints
    if (context) {
      switch (paramName) {
        case "query":
          if (context.intent === "search") {
            hints.push('Try command names like "XREAD", "HSET"');
            hints.push(
              'Use patterns like "stream operations", "hash commands"',
            );
          }
          break;
        case "pattern":
          if (context.complexity === "simple") {
            hints.push('Start with "basic-client" or "caching"');
          } else if (context.complexity === "advanced") {
            hints.push(
              'Try "distributed-lock", "rate-limiting", "cluster-client"',
            );
          }
          break;
      }
    }

    return [...new Set(hints)]; // Remove duplicates
  }
}

// Export helper functions for common validations
export const validateToolParameters = UniversalValidator.validateParameters;
export const generateHints = UniversalValidator.generateParameterHints;
