/**
 * Template-Based Response Generation System
 * Provides structured, contextual responses with dynamic content generation
 */

import { EnhancedQueryContext } from "../analysis/query-analyzer.js";
import { RecognizedCommand } from "../analysis/command-recognizer.js";
import { DetectedPattern } from "../analysis/pattern-matcher.js";

export interface ResponseTemplate {
  id: string;
  name: string;
  level: "basic" | "intermediate" | "advanced" | "expert";
  applicableContexts: string[];
  sections: ResponseSection[];
  examples: CodeExample[];
  relatedCommands: string[];
  nextSteps: FollowUpAction[];
  metadata: TemplateMetadata;
}

export interface ResponseSection {
  type: "header" | "text" | "code" | "list" | "table" | "warning" | "tip";
  title?: string;
  content: string;
  priority: number;
  conditional?: (context: EnhancedQueryContext) => boolean;
}

export interface CodeExample {
  title: string;
  language: "typescript" | "javascript";
  code: string;
  description: string;
  complexity: "simple" | "intermediate" | "advanced";
  useCase: string;
  runnable: boolean;
}

export interface FollowUpAction {
  action: string;
  description: string;
  parameters?: Record<string, any>;
  conditions?: string[];
}

export interface TemplateMetadata {
  category: string;
  tags: string[];
  estimatedReadTime: number;
  lastUpdated: string;
  version: string;
}

export interface GeneratedResponse {
  content: ResponseSection[];
  examples: CodeExample[];
  relatedTopics: string[];
  followUpActions: FollowUpAction[];
  metadata: {
    template: string;
    confidence: number;
    complexity: string;
    estimatedReadTime: number;
  };
}

export class TemplateEngine {
  private static templates: Map<string, ResponseTemplate> = new Map();
  private static variables: Map<string, any> = new Map();

  static {
    this.initializeTemplates();
  }

  /**
   * Initialize core response templates
   */
  private static initializeTemplates(): void {
    // Command Information Template
    this.addTemplate({
      id: "command-info",
      name: "Command Information",
      level: "basic",
      applicableContexts: ["search", "help"],
      sections: [
        {
          type: "header",
          title: "Command: {{commandName}}",
          content: "{{commandDescription}}",
          priority: 1,
        },
        {
          type: "text",
          content: "**GLIDE Equivalent:** `{{glideMethod}}`",
          priority: 2,
        },
        {
          type: "text",
          content: "**Category:** {{category}}",
          priority: 3,
        },
        {
          type: "text",
          content: "**Parameters:** {{parameters}}",
          priority: 4,
          conditional: (context) => context.userExperienceLevel !== "beginner",
        },
      ],
      examples: [],
      relatedCommands: [],
      nextSteps: [
        {
          action: "show-examples",
          description: "See code examples for this command",
          parameters: { command: "{{commandName}}" },
        },
        {
          action: "browse-category",
          description: "Explore more commands in this category",
          parameters: { category: "{{category}}" },
        },
      ],
      metadata: {
        category: "reference",
        tags: ["command", "basic", "reference"],
        estimatedReadTime: 1,
        lastUpdated: "2024-01-01",
        version: "1.0",
      },
    });

    // Pattern Implementation Template
    this.addTemplate({
      id: "pattern-implementation",
      name: "Pattern Implementation Guide",
      level: "intermediate",
      applicableContexts: ["generate", "help"],
      sections: [
        {
          type: "header",
          title: "Pattern: {{patternName}}",
          content: "{{patternDescription}}",
          priority: 1,
        },
        {
          type: "text",
          content: "**Complexity:** {{complexity}}",
          priority: 2,
        },
        {
          type: "text",
          content: "**Use Cases:**\n{{useCases}}",
          priority: 3,
        },
        {
          type: "text",
          content: "**Related Commands:** {{relatedCommands}}",
          priority: 4,
        },
        {
          type: "tip",
          title: "Best Practices",
          content: "{{bestPractices}}",
          priority: 5,
        },
        {
          type: "warning",
          title: "Common Pitfalls",
          content: "{{commonPitfalls}}",
          priority: 6,
          conditional: (context) => context.complexity !== "simple",
        },
      ],
      examples: [],
      relatedCommands: [],
      nextSteps: [
        {
          action: "generate-code",
          description: "Generate implementation code for this pattern",
          parameters: { pattern: "{{patternName}}" },
        },
        {
          action: "show-related-patterns",
          description: "Explore related patterns",
          parameters: { pattern: "{{patternName}}" },
        },
      ],
      metadata: {
        category: "implementation",
        tags: ["pattern", "implementation", "guide"],
        estimatedReadTime: 3,
        lastUpdated: "2024-01-01",
        version: "1.0",
      },
    });

    // Migration Guide Template
    this.addTemplate({
      id: "migration-guide",
      name: "Migration Guide",
      level: "intermediate",
      applicableContexts: ["migrate"],
      sections: [
        {
          type: "header",
          title: "Migration: {{sourceLibrary}} → GLIDE",
          content:
            "Guide for migrating {{symbol}} from {{sourceLibrary}} to GLIDE",
          priority: 1,
        },
        {
          type: "table",
          title: "Comparison",
          content:
            "| {{sourceLibrary}} | GLIDE |\n|---|---|\n| {{originalCode}} | {{glideCode}} |",
          priority: 2,
        },
        {
          type: "text",
          content: "**Parameter Differences:** {{paramDifferences}}",
          priority: 3,
          conditional: (context) => context.detectedCommands.length > 0,
        },
        {
          type: "text",
          content: "**Return Value Differences:** {{returnDifferences}}",
          priority: 4,
          conditional: (context) => context.userExperienceLevel !== "beginner",
        },
        {
          type: "warning",
          title: "Migration Notes",
          content: "{{migrationWarnings}}",
          priority: 5,
        },
      ],
      examples: [],
      relatedCommands: [],
      nextSteps: [
        {
          action: "generate-migration-code",
          description: "Generate complete migration example",
          parameters: { source: "{{sourceLibrary}}", symbol: "{{symbol}}" },
        },
        {
          action: "validate-migration",
          description: "Validate your migration code",
          parameters: { source: "{{sourceLibrary}}" },
        },
      ],
      metadata: {
        category: "migration",
        tags: ["migration", "conversion", "guide"],
        estimatedReadTime: 5,
        lastUpdated: "2024-01-01",
        version: "1.0",
      },
    });

    // API Comparison Template
    this.addTemplate({
      id: "api-comparison",
      name: "API Comparison",
      level: "intermediate",
      applicableContexts: ["compare"],
      sections: [
        {
          type: "header",
          title: "API Comparison: {{comparisonTitle}}",
          content: "Detailed comparison between different Redis clients",
          priority: 1,
        },
        {
          type: "table",
          title: "Feature Comparison",
          content: "{{comparisonTable}}",
          priority: 2,
        },
        {
          type: "text",
          content: "**Performance Notes:** {{performanceNotes}}",
          priority: 3,
        },
        {
          type: "text",
          content: "**Compatibility:** {{compatibilityNotes}}",
          priority: 4,
        },
      ],
      examples: [],
      relatedCommands: [],
      nextSteps: [
        {
          action: "detailed-analysis",
          description: "Get detailed performance analysis",
          parameters: { comparison: "{{comparisonTitle}}" },
        },
      ],
      metadata: {
        category: "comparison",
        tags: ["comparison", "analysis", "performance"],
        estimatedReadTime: 4,
        lastUpdated: "2024-01-01",
        version: "1.0",
      },
    });

    // Code Generation Template
    this.addTemplate({
      id: "code-generation",
      name: "Generated Code",
      level: "intermediate",
      applicableContexts: ["generate"],
      sections: [
        {
          type: "header",
          title: "Generated Code: {{codeTitle}}",
          content: "{{codeDescription}}",
          priority: 1,
        },
        {
          type: "text",
          content: "**Pattern:** {{pattern}}",
          priority: 2,
        },
        {
          type: "text",
          content: "**Complexity:** {{complexity}}",
          priority: 3,
        },
      ],
      examples: [],
      relatedCommands: [],
      nextSteps: [
        {
          action: "add-tests",
          description: "Generate test code for this implementation",
          parameters: { pattern: "{{pattern}}" },
        },
        {
          action: "add-error-handling",
          description: "Add comprehensive error handling",
          parameters: { pattern: "{{pattern}}" },
        },
        {
          action: "optimize-performance",
          description: "Get performance optimization suggestions",
          parameters: { pattern: "{{pattern}}" },
        },
      ],
      metadata: {
        category: "generation",
        tags: ["code", "generation", "implementation"],
        estimatedReadTime: 2,
        lastUpdated: "2024-01-01",
        version: "1.0",
      },
    });

    // Error/Troubleshooting Template
    this.addTemplate({
      id: "troubleshooting",
      name: "Troubleshooting Guide",
      level: "advanced",
      applicableContexts: ["help"],
      sections: [
        {
          type: "header",
          title: "Troubleshooting: {{issueTitle}}",
          content: "{{issueDescription}}",
          priority: 1,
        },
        {
          type: "text",
          content: "**Common Causes:**\n{{commonCauses}}",
          priority: 2,
        },
        {
          type: "text",
          content: "**Solutions:**\n{{solutions}}",
          priority: 3,
        },
        {
          type: "tip",
          title: "Prevention",
          content: "{{preventionTips}}",
          priority: 4,
        },
      ],
      examples: [],
      relatedCommands: [],
      nextSteps: [
        {
          action: "validate-solution",
          description: "Test your solution",
          parameters: { issue: "{{issueTitle}}" },
        },
      ],
      metadata: {
        category: "troubleshooting",
        tags: ["troubleshooting", "debug", "help"],
        estimatedReadTime: 3,
        lastUpdated: "2024-01-01",
        version: "1.0",
      },
    });
  }

  /**
   * Add a template to the engine
   */
  private static addTemplate(template: ResponseTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * Generate response using appropriate template
   */
  static generateResponse(
    context: EnhancedQueryContext,
    data: Record<string, any>,
  ): GeneratedResponse {
    // Select best template for context
    const template = this.selectTemplate(context);

    // Set template variables from data
    this.setVariables(data);

    // Process template sections
    const sections = this.processSections(template.sections, context);

    // Generate examples if applicable
    const examples = this.generateExamples(template, context, data);

    // Determine follow-up actions
    const followUpActions = this.processFollowUpActions(
      template.nextSteps,
      context,
    );

    // Extract related topics
    const relatedTopics = this.extractRelatedTopics(context, data);

    return {
      content: sections,
      examples,
      relatedTopics,
      followUpActions,
      metadata: {
        template: template.id,
        confidence: this.calculateTemplateConfidence(template, context),
        complexity: template.level,
        estimatedReadTime: template.metadata.estimatedReadTime,
      },
    };
  }

  /**
   * Select most appropriate template for context
   */
  private static selectTemplate(
    context: EnhancedQueryContext,
  ): ResponseTemplate {
    const candidates: Array<{ template: ResponseTemplate; score: number }> = [];

    for (const template of this.templates.values()) {
      const score = this.scoreTemplateForContext(template, context);
      if (score > 0) {
        candidates.push({ template, score });
      }
    }

    // Sort by score and select best match
    candidates.sort((a, b) => b.score - a.score);

    return candidates.length > 0
      ? candidates[0].template
      : this.getDefaultTemplate();
  }

  /**
   * Score template relevance for context
   */
  private static scoreTemplateForContext(
    template: ResponseTemplate,
    context: EnhancedQueryContext,
  ): number {
    let score = 0;

    // Check intent match
    if (template.applicableContexts.includes(context.intent)) {
      score += 0.5;
    }

    // Check complexity match
    const complexityMapping = {
      basic: ["beginner"],
      intermediate: ["beginner", "intermediate"],
      advanced: ["intermediate", "expert"],
      expert: ["expert"],
    };

    if (
      complexityMapping[template.level]?.includes(context.userExperienceLevel)
    ) {
      score += 0.3;
    }

    // Check query type relevance
    const queryTypeMapping = {
      "direct-command": ["command-info"],
      conceptual: ["pattern-implementation"],
      comparative: ["api-comparison"],
      workflow: ["code-generation"],
      troubleshooting: ["troubleshooting"],
    };

    const relevantTemplates = queryTypeMapping[context.queryType] || [];
    if (relevantTemplates.includes(template.id)) {
      score += 0.4;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Process template sections with context filtering
   */
  private static processSections(
    sections: ResponseSection[],
    context: EnhancedQueryContext,
  ): ResponseSection[] {
    return sections
      .filter((section) => {
        // Apply conditional filters
        if (section.conditional && !section.conditional(context)) {
          return false;
        }
        return true;
      })
      .map((section) => ({
        ...section,
        content: this.interpolateTemplate(section.content),
        title: section.title
          ? this.interpolateTemplate(section.title)
          : undefined,
      }))
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Generate appropriate examples for context
   */
  private static generateExamples(
    template: ResponseTemplate,
    context: EnhancedQueryContext,
    data: Record<string, any>,
  ): CodeExample[] {
    const examples: CodeExample[] = [];

    // Add command-specific examples
    if (context.detectedCommands.length > 0) {
      for (const command of context.detectedCommands.slice(0, 2)) {
        examples.push(...this.generateCommandExamples(command as any, context));
      }
    }

    // Add pattern-specific examples
    if (context.detectedPatterns.length > 0) {
      for (const pattern of context.detectedPatterns.slice(0, 1)) {
        examples.push(...this.generatePatternExamples(pattern as any, context));
      }
    }

    // Filter by complexity and user experience
    return examples
      .filter((example) => this.isExampleAppropriate(example, context))
      .slice(0, 3); // Limit to 3 examples
  }

  /**
   * Generate examples for specific commands
   */
  private static generateCommandExamples(
    command: RecognizedCommand,
    context: EnhancedQueryContext,
  ): CodeExample[] {
    const examples: CodeExample[] = [];
    const useTypeScript = context.userExperienceLevel !== "beginner";

    // Basic usage example
    examples.push({
      title: `Basic ${command.name} Usage`,
      language: useTypeScript ? "typescript" : "javascript",
      code: this.generateBasicCommandCode(command, useTypeScript),
      description: `Simple example of using ${command.name} with GLIDE`,
      complexity: "simple",
      useCase: command.examples?.[0] || "Basic usage",
      runnable: true,
    });

    // Advanced example for experienced users
    if (context.userExperienceLevel !== "beginner") {
      examples.push({
        title: `Advanced ${command.name} Usage`,
        language: useTypeScript ? "typescript" : "javascript",
        code: this.generateAdvancedCommandCode(command, useTypeScript),
        description: `Advanced example with error handling and best practices`,
        complexity: "advanced",
        useCase: "Production usage",
        runnable: true,
      });
    }

    return examples;
  }

  /**
   * Generate examples for patterns
   */
  private static generatePatternExamples(
    pattern: DetectedPattern,
    context: EnhancedQueryContext,
  ): CodeExample[] {
    const examples: CodeExample[] = [];
    const useTypeScript = context.userExperienceLevel !== "beginner";

    examples.push({
      title: `${pattern.type} Pattern Implementation`,
      language: useTypeScript ? "typescript" : "javascript",
      code: this.generatePatternCode(pattern, useTypeScript),
      description: `Complete implementation of ${pattern.type} pattern`,
      complexity: pattern.complexity,
      useCase: pattern.useCases[0] || "Pattern implementation",
      runnable: true,
    });

    return examples;
  }

  /**
   * Check if example is appropriate for user context
   */
  private static isExampleAppropriate(
    example: CodeExample,
    context: EnhancedQueryContext,
  ): boolean {
    // Filter by complexity
    const complexityLevels = {
      beginner: ["simple"],
      intermediate: ["simple", "intermediate"],
      expert: ["simple", "intermediate", "advanced"],
    };

    const allowedComplexities = complexityLevels[context.userExperienceLevel];
    return allowedComplexities.includes(example.complexity);
  }

  /**
   * Generate basic command code
   */
  private static generateBasicCommandCode(
    command: RecognizedCommand,
    useTypeScript: boolean,
  ): string {
    const imports = useTypeScript
      ? 'import { createClient } from "@valkey/glide";'
      : 'const { createClient } = require("@valkey/glide");';

    const clientType = useTypeScript ? ": GlideClient" : "";

    switch (command.name.toUpperCase()) {
      case "GET":
        return `${imports}

async function example() {
  const client${clientType} = await createClient({ host: "localhost", port: 6379 });
  
  const value = await client.get("key");
  console.log("Value:", value);
  
  await client.close();
}`;

      case "SET":
        return `${imports}

async function example() {
  const client${clientType} = await createClient({ host: "localhost", port: 6379 });
  
  await client.set("key", "value");
  console.log("Value set successfully");
  
  await client.close();
}`;

      default:
        return `${imports}

async function example() {
  const client${clientType} = await createClient({ host: "localhost", port: 6379 });
  
  // Use ${command.glideMethod}
  const result = await ${command.glideMethod.replace("client.", "client.")};
  console.log("Result:", result);
  
  await client.close();
}`;
    }
  }

  /**
   * Generate advanced command code with error handling
   */
  private static generateAdvancedCommandCode(
    command: RecognizedCommand,
    useTypeScript: boolean,
  ): string {
    const imports = useTypeScript
      ? 'import { createClient, GlideClient } from "@valkey/glide";'
      : 'const { createClient } = require("@valkey/glide");';

    return `${imports}

async function advancedExample() {
  let client${useTypeScript ? ": GlideClient | null" : ""} = null;
  
  try {
    client = await createClient({
      host: "localhost",
      port: 6379,
      requestTimeout: 5000,
      reconnectBackoff: { minDelay: 100, maxDelay: 3000 }
    });
    
    // Use ${command.glideMethod} with error handling
    const result = await ${command.glideMethod.replace("client.", "client.")};
    
    if (result !== null) {
      console.log("Operation successful:", result);
    } else {
      console.log("No result returned");
    }
    
  } catch (error) {
    console.error("Error occurred:", error.message);
    // Handle specific error types here
  } finally {
    if (client) {
      await client.close();
    }
  }
}`;
  }

  /**
   * Generate pattern implementation code
   */
  private static generatePatternCode(
    pattern: DetectedPattern,
    useTypeScript: boolean,
  ): string {
    const imports = useTypeScript
      ? 'import { createClient, GlideClient } from "@valkey/glide";'
      : 'const { createClient } = require("@valkey/glide");';

    switch (pattern.type) {
      case "caching":
        return `${imports}

class CacheManager {
  private client${useTypeScript ? ": GlideClient" : ""};
  
  constructor(client${useTypeScript ? ": GlideClient" : ""}) {
    this.client = client;
  }
  
  async get(key${useTypeScript ? ": string" : ""}) {
    return await this.client.get(key);
  }
  
  async set(key${useTypeScript ? ": string" : ""}, value${useTypeScript ? ": string" : ""}, ttl${useTypeScript ? ": number = 3600" : " = 3600"}) {
    return await this.client.set(key, value, { EX: ttl });
  }
  
  async delete(key${useTypeScript ? ": string" : ""}) {
    return await this.client.del([key]);
  }
}

// Usage
const client = await createClient({ host: "localhost", port: 6379 });
const cache = new CacheManager(client);

await cache.set("user:123", JSON.stringify({ name: "Alice" }), 3600);
const userData = await cache.get("user:123");`;

      case "streams":
        return `${imports}

class EventStream {
  private client${useTypeScript ? ": GlideClient" : ""};
  private streamKey${useTypeScript ? ": string" : ""};
  
  constructor(client${useTypeScript ? ": GlideClient" : ""}, streamKey${useTypeScript ? ": string" : ""}) {
    this.client = client;
    this.streamKey = streamKey;
  }
  
  async addEvent(data${useTypeScript ? ": Record<string, string>" : ""}) {
    const entries = Object.entries(data).flat();
    return await this.client.xadd(this.streamKey, [entries]);
  }
  
  async readEvents(fromId${useTypeScript ? ': string = "$"' : ' = "$"'}) {
    return await this.client.xread([{ key: this.streamKey, id: fromId }]);
  }
}

// Usage
const client = await createClient({ host: "localhost", port: 6379 });
const eventStream = new EventStream(client, "events");

await eventStream.addEvent({ type: "user_login", userId: "123" });
const events = await eventStream.readEvents();`;

      default:
        return `${imports}

// ${pattern.type} pattern implementation
async function ${pattern.type}Example() {
  const client = await createClient({ host: "localhost", port: 6379 });
  
  // Implementation for ${pattern.type} pattern
  // Related commands: ${pattern.relatedCommands.join(", ")}
  
  await client.close();
}`;
    }
  }

  /**
   * Process follow-up actions with variable interpolation
   */
  private static processFollowUpActions(
    actions: FollowUpAction[],
    context: EnhancedQueryContext,
  ): FollowUpAction[] {
    return actions.map((action) => ({
      ...action,
      action: this.interpolateTemplate(action.action),
      description: this.interpolateTemplate(action.description),
      parameters: action.parameters
        ? Object.fromEntries(
            Object.entries(action.parameters).map(([key, value]) => [
              key,
              typeof value === "string"
                ? this.interpolateTemplate(value)
                : value,
            ]),
          )
        : undefined,
    }));
  }

  /**
   * Extract related topics from context and data
   */
  private static extractRelatedTopics(
    context: EnhancedQueryContext,
    data: Record<string, any>,
  ): string[] {
    const topics: string[] = [];

    // Add command categories
    context.detectedCommands.forEach((cmd) => {
      if (cmd.category && !topics.includes(cmd.category)) {
        topics.push(cmd.category);
      }
    });

    // Add pattern use cases
    context.detectedPatterns.forEach((pattern) => {
      pattern.useCases.forEach((useCase) => {
        if (!topics.includes(useCase)) {
          topics.push(useCase);
        }
      });
    });

    // Add related concepts
    topics.push(...context.detectedConcepts);

    return topics.slice(0, 5); // Limit to 5 topics
  }

  /**
   * Set template variables
   */
  private static setVariables(data: Record<string, any>): void {
    this.variables.clear();
    Object.entries(data).forEach(([key, value]) => {
      this.variables.set(key, value);
    });
  }

  /**
   * Interpolate template variables in text
   */
  private static interpolateTemplate(text: string): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      const value = this.variables.get(variable);
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Calculate template confidence score
   */
  private static calculateTemplateConfidence(
    template: ResponseTemplate,
    context: EnhancedQueryContext,
  ): number {
    return this.scoreTemplateForContext(template, context);
  }

  /**
   * Get default template when no specific template matches
   */
  private static getDefaultTemplate(): ResponseTemplate {
    return (
      this.templates.get("command-info") || {
        id: "default",
        name: "Default Response",
        level: "basic",
        applicableContexts: ["*"],
        sections: [
          {
            type: "text",
            content: "I found some information that might help you.",
            priority: 1,
          },
        ],
        examples: [],
        relatedCommands: [],
        nextSteps: [],
        metadata: {
          category: "general",
          tags: ["default"],
          estimatedReadTime: 1,
          lastUpdated: "2024-01-01",
          version: "1.0",
        },
      }
    );
  }

  /**
   * Get available templates
   */
  static getAvailableTemplates(): ResponseTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by ID
   */
  static getTemplate(id: string): ResponseTemplate | undefined {
    return this.templates.get(id);
  }
}

// Export convenience functions
export const generateResponse = TemplateEngine.generateResponse;
export const getAvailableTemplates = TemplateEngine.getAvailableTemplates;
