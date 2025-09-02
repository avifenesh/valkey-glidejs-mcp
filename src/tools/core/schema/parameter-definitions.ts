/**
 * Universal Parameter Definition System for MCP Tools
 * Provides type-safe parameter validation, auto-completion, and context-aware hints
 */

import { z } from "zod";

// Core parameter types
export type ParameterType =
  | "string"
  | "number"
  | "boolean"
  | "array"
  | "object"
  | "enum";

// Auto-completion rule types
export type AutoCompletionSource =
  | "commands"
  | "categories"
  | "patterns"
  | "custom"
  | "dynamic";

// Validation rule types
export type ValidationLevel = "strict" | "lenient" | "suggestion";

// Query context for intelligent completion
export interface QueryContext {
  intent: "search" | "migrate" | "generate" | "compare" | "help";
  complexity: "simple" | "intermediate" | "advanced";
  domain:
    | "strings"
    | "hashes"
    | "lists"
    | "sets"
    | "streams"
    | "geo"
    | "general";
  previousCommands: string[];
  patterns: string[];
}

// Auto-completion rule definition
export interface AutoCompletionRule {
  source: AutoCompletionSource;
  staticSuggestions?: string[];
  dynamicResolver?: (context: QueryContext) => Promise<string[]>;
  filterPattern?: RegExp;
  priority?: number;
  contextual?: boolean;
}

// Validation rule definition
export interface ValidationRule {
  type: "regex" | "range" | "enum" | "custom" | "dependency";
  pattern?: RegExp;
  min?: number;
  max?: number;
  allowedValues?: string[];
  customValidator?: (value: any, context: QueryContext) => ValidationResult;
  dependsOn?: string[];
  errorMessage?: string;
  level: ValidationLevel;
}

// Parameter dependency definition
export interface ParameterDependency {
  dependentParameter: string;
  condition: "required" | "forbidden" | "conditional";
  value?: any;
  message?: string;
}

// Core parameter definition interface
export interface ParameterDefinition {
  name: string;
  type: ParameterType;
  required: boolean;
  description: string;
  examples: string[];
  autoComplete?: AutoCompletionRule;
  validation?: ValidationRule[];
  dependencies?: ParameterDependency[];
  contextHints?: string[];
  defaultValue?: any;
  category?: string;
  relevantCommands?: string[];
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
  coercedValue?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: "error" | "warning" | "info";
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Auto-completion hint interface
export interface CompletionHint {
  value: string;
  description: string;
  category: string;
  relevance: number;
  example?: string;
  contextual?: boolean;
}

// Parameter schema for tools
export interface ParameterSchema {
  parameters: ParameterDefinition[];
  groups?: ParameterGroup[];
  presets?: ParameterPreset[];
  examples?: SchemaExample[];
}

export interface ParameterGroup {
  name: string;
  description: string;
  parameters: string[];
  condition?: "any" | "all" | "none";
}

export interface ParameterPreset {
  name: string;
  description: string;
  values: Record<string, any>;
  useCase: string;
}

export interface SchemaExample {
  name: string;
  description: string;
  parameters: Record<string, any>;
  expectedResult: string;
}

// Common parameter definitions for reuse
export const COMMON_PARAMETERS: Record<string, ParameterDefinition> = {
  query: {
    name: "query",
    type: "string",
    required: true,
    description: "Search query or command pattern to find",
    examples: ["GET", "stream operations", "hash commands"],
    autoComplete: {
      source: "commands",
      contextual: true,
      priority: 1,
    },
    validation: [
      {
        type: "regex",
        pattern: /^.{1,100}$/,
        errorMessage: "Query must be 1-100 characters",
        level: "lenient",
      },
    ],
    category: "search",
  },

  source: {
    name: "source",
    type: "enum",
    required: true,
    description: "Source Redis client library",
    examples: ["ioredis", "node-redis"],
    autoComplete: {
      source: "custom",
      staticSuggestions: ["ioredis", "node-redis"],
    },
    validation: [
      {
        type: "enum",
        allowedValues: ["ioredis", "node-redis"],
        errorMessage: 'Source must be either "ioredis" or "node-redis"',
        level: "strict",
      },
    ],
    category: "migration",
  },

  symbol: {
    name: "symbol",
    type: "string",
    required: true,
    description: "Method or command name to find equivalent",
    examples: ["get", "hset", "pipeline", "multi"],
    autoComplete: {
      source: "dynamic",
      contextual: true,
    },
    validation: [
      {
        type: "regex",
        pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
        errorMessage: "Symbol must be a valid identifier",
        level: "lenient",
      },
    ],
    dependencies: [
      {
        dependentParameter: "source",
        condition: "required",
        message: "Source library must be specified when looking up symbols",
      },
    ],
    category: "migration",
  },

  category: {
    name: "category",
    type: "enum",
    required: false,
    description: "Command category to browse",
    examples: ["strings", "hashes", "lists", "sets", "streams"],
    autoComplete: {
      source: "categories",
      staticSuggestions: [
        "strings",
        "hashes",
        "lists",
        "sets",
        "sortedsets",
        "streams",
        "geo",
        "pubsub",
        "transactions",
        "scripting",
      ],
    },
    category: "browsing",
  },

  pattern: {
    name: "pattern",
    type: "enum",
    required: false,
    description: "Code pattern to generate",
    examples: ["basic-client", "caching", "streams", "distributed-lock"],
    autoComplete: {
      source: "patterns",
      staticSuggestions: [
        "basic-client",
        "cluster-client",
        "caching",
        "streams",
        "distributed-lock",
        "rate-limiting",
        "pub-sub",
        "transactions",
      ],
    },
    category: "generation",
  },

  complexity: {
    name: "complexity",
    type: "enum",
    required: false,
    description: "Complexity level for generated code or explanations",
    examples: ["simple", "intermediate", "advanced"],
    autoComplete: {
      source: "custom",
      staticSuggestions: ["simple", "intermediate", "advanced"],
    },
    defaultValue: "intermediate",
    category: "general",
  },

  includeTests: {
    name: "includeTests",
    type: "boolean",
    required: false,
    description: "Whether to include test code in generation",
    examples: ["true", "false"],
    defaultValue: false,
    category: "generation",
  },

  includeTypeScript: {
    name: "includeTypeScript",
    type: "boolean",
    required: false,
    description: "Generate TypeScript instead of JavaScript",
    examples: ["true", "false"],
    defaultValue: true,
    category: "generation",
  },
};

// Zod schema builders for runtime validation
export const createZodSchema = (paramDef: ParameterDefinition): z.ZodSchema => {
  let schema: z.ZodSchema;

  switch (paramDef.type) {
    case "string":
      schema = z.string();
      break;
    case "number":
      schema = z.number();
      break;
    case "boolean":
      schema = z.boolean();
      break;
    case "array":
      schema = z.array(z.unknown());
      break;
    case "object":
      schema = z.object({});
      break;
    case "enum":
      const allowedValues = paramDef.validation?.find(
        (v) => v.type === "enum",
      )?.allowedValues;
      if (allowedValues) {
        schema = z.enum(allowedValues as [string, ...string[]]);
      } else {
        schema = z.string();
      }
      break;
    default:
      schema = z.unknown();
  }

  // Apply additional validations
  if (paramDef.validation) {
    for (const rule of paramDef.validation) {
      switch (rule.type) {
        case "regex":
          if (rule.pattern && schema instanceof z.ZodString) {
            schema = (schema as z.ZodString).regex(
              rule.pattern,
              rule.errorMessage,
            );
          }
          break;
        case "range":
          if (schema instanceof z.ZodNumber) {
            const numSchema = schema as z.ZodNumber;
            if (rule.min !== undefined) schema = numSchema.min(rule.min);
            if (rule.max !== undefined) schema = numSchema.max(rule.max);
          }
          break;
      }
    }
  }

  // Handle required/optional
  return paramDef.required ? schema : schema.optional();
};
