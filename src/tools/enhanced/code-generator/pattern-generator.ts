/**
 * Pattern-Aware Code Generation System
 * Provides intelligent code generation based on detected patterns and use cases
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";

export interface CodePattern {
  name: string;
  displayName: string;
  description: string;
  category:
    | "architecture"
    | "data-access"
    | "caching"
    | "messaging"
    | "processing"
    | "utility";
  complexity: "simple" | "intermediate" | "advanced";
  templates: PatternTemplate[];
  useCases: string[];
  bestPractices: string[];
}

export interface PatternTemplate {
  name: string;
  description: string;
  language: "typescript" | "javascript";
  template: string;
  placeholders: TemplatePlaceholder[];
  examples: TemplateExample[];
}

export interface TemplatePlaceholder {
  name: string;
  description: string;
  type: "string" | "number" | "boolean";
  defaultValue?: any;
  required: boolean;
}

export interface TemplateExample {
  title: string;
  description: string;
  placeholderValues: Record<string, any>;
}

export interface GenerationRequest {
  pattern: string;
  language: "typescript" | "javascript";
  options: GenerationOptions;
  placeholders?: Record<string, any>;
}

export interface GenerationOptions {
  includeErrorHandling: boolean;
  includeLogging: boolean;
  includeTests: boolean;
  targetEnvironment: "node" | "browser";
  codeStyle: "functional" | "class-based";
}

export interface GenerationResult {
  pattern: string;
  language: string;
  code: string;
  files: GeneratedFile[];
  dependencies: string[];
  usage: string[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: "main" | "test" | "config";
  description: string;
}

export class PatternAwareGenerator {
  private static patterns: Map<string, CodePattern> = new Map();

  static {
    this.initializePatterns();
  }

  /**
   * Initialize core patterns
   */
  private static initializePatterns(): void {
    // Basic Client Pattern
    this.patterns.set("basic-client", {
      name: "basic-client",
      displayName: "Basic GLIDE Client",
      description: "Simple Redis client setup with connection management",
      category: "architecture",
      complexity: "simple",
      useCases: [
        "Basic caching",
        "Session storage",
        "Configuration management",
      ],
      bestPractices: [
        "Reuse client instances",
        "Handle connection errors",
        "Close connections gracefully",
      ],
      templates: [
        {
          name: "typescript-basic-client",
          description: "Basic TypeScript client with error handling",
          language: "typescript",
          template: `import { GlideClient, GlideClientConfiguration } from '@valkey/valkey-glide';

export class {{className}} {
  private client: GlideClient | null = null;
  private readonly config: GlideClientConfiguration;

  constructor(config?: Partial<GlideClientConfiguration>) {
    this.config = {
      addresses: [{ host: '{{host}}', port: {{port}} }],
      requestTimeout: {{timeout}},
      ...config
    };
  }

  async connect(): Promise<void> {
    try {
      this.client = await GlideClient.createClient(this.config);
      {{#if includeLogging}}
      console.log('Connected to Redis successfully');
      {{/if}}
    } catch (error) {
      {{#if includeLogging}}
      console.error('Failed to connect to Redis:', error);
      {{/if}}
      throw new Error(\`Redis connection failed: \${error.message}\`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }

  private ensureConnected(): void {
    if (!this.client) {
      throw new Error('Redis client is not connected. Call connect() first.');
    }
  }

  async get(key: string): Promise<string | null> {
    this.ensureConnected();
    {{#if includeErrorHandling}}
    try {
      return await this.client!.get(key);
    } catch (error) {
      throw new Error(\`GET operation failed: \${error.message}\`);
    }
    {{else}}
    return await this.client!.get(key);
    {{/if}}
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    this.ensureConnected();
    {{#if includeErrorHandling}}
    try {
      const options = ttl ? { EX: ttl } : undefined;
      await this.client!.set(key, value, options);
    } catch (error) {
      throw new Error(\`SET operation failed: \${error.message}\`);
    }
    {{else}}
    const options = ttl ? { EX: ttl } : undefined;
    await this.client!.set(key, value, options);
    {{/if}}
  }
}`,
          placeholders: [
            {
              name: "className",
              description: "Name of the Redis client class",
              type: "string",
              defaultValue: "RedisClient",
              required: true,
            },
            {
              name: "host",
              description: "Redis server hostname",
              type: "string",
              defaultValue: "localhost",
              required: true,
            },
            {
              name: "port",
              description: "Redis server port",
              type: "number",
              defaultValue: 6379,
              required: true,
            },
            {
              name: "timeout",
              description: "Request timeout in milliseconds",
              type: "number",
              defaultValue: 5000,
              required: false,
            },
          ],
          examples: [
            {
              title: "Basic client setup",
              description: "Simple Redis client for localhost",
              placeholderValues: {
                className: "MyRedisClient",
                host: "localhost",
                port: 6379,
                timeout: 5000,
              },
            },
          ],
        },
      ],
    });

    // Caching Pattern
    this.patterns.set("caching", {
      name: "caching",
      displayName: "Caching Layer",
      description: "Intelligent caching with TTL and cache-aside pattern",
      category: "caching",
      complexity: "intermediate",
      useCases: ["Data caching", "API response caching", "Session caching"],
      bestPractices: [
        "Use cache-aside pattern",
        "Set appropriate TTL",
        "Handle cache misses",
      ],
      templates: [
        {
          name: "typescript-caching-layer",
          description: "Comprehensive caching layer",
          language: "typescript",
          template: `import { GlideClient } from '@valkey/valkey-glide';

export class {{className}}<T = any> {
  private client: GlideClient;
  private readonly namespace: string;
  private readonly defaultTtl: number;

  constructor(
    client: GlideClient,
    options: { namespace?: string; defaultTtl?: number } = {}
  ) {
    this.client = client;
    this.namespace = options.namespace || '{{namespace}}';
    this.defaultTtl = options.defaultTtl || {{ttl}};
  }

  private buildKey(key: string): string {
    return \`\${this.namespace}:\${key}\`;
  }

  async get(key: string): Promise<T | null> {
    {{#if includeErrorHandling}}
    try {
      const value = await this.client.get(this.buildKey(key));
      return value ? JSON.parse(value) : null;
    } catch (error) {
      {{#if includeLogging}}
      console.error(\`Cache get error for key \${key}:\`, error);
      {{/if}}
      return null;
    }
    {{else}}
    const value = await this.client.get(this.buildKey(key));
    return value ? JSON.parse(value) : null;
    {{/if}}
  }

  async set(key: string, value: T, ttl?: number): Promise<boolean> {
    {{#if includeErrorHandling}}
    try {
      const serialized = JSON.stringify(value);
      const actualTtl = ttl || this.defaultTtl;
      const options = actualTtl > 0 ? { EX: actualTtl } : undefined;
      await this.client.set(this.buildKey(key), serialized, options);
      return true;
    } catch (error) {
      {{#if includeLogging}}
      console.error(\`Cache set error for key \${key}:\`, error);
      {{/if}}
      return false;
    }
    {{else}}
    const serialized = JSON.stringify(value);
    const actualTtl = ttl || this.defaultTtl;
    const options = actualTtl > 0 ? { EX: actualTtl } : undefined;
    await this.client.set(this.buildKey(key), serialized, options);
    return true;
    {{/if}}
  }

  async getOrSet<TResult = T>(
    key: string,
    factory: () => Promise<TResult>,
    ttl?: number
  ): Promise<TResult> {
    const cached = await this.get(key);
    if (cached !== null) {
      return cached as TResult;
    }

    const value = await factory();
    await this.set(key, value as T, ttl);
    return value;
  }

  async delete(key: string): Promise<boolean> {
    {{#if includeErrorHandling}}
    try {
      const result = await this.client.del([this.buildKey(key)]);
      return result > 0;
    } catch (error) {
      {{#if includeLogging}}
      console.error(\`Cache delete error for key \${key}:\`, error);
      {{/if}}
      return false;
    }
    {{else}}
    const result = await this.client.del([this.buildKey(key)]);
    return result > 0;
    {{/if}}
  }
}`,
          placeholders: [
            {
              name: "className",
              description: "Name of the cache class",
              type: "string",
              defaultValue: "CacheLayer",
              required: true,
            },
            {
              name: "namespace",
              description: "Cache namespace",
              type: "string",
              defaultValue: "cache",
              required: true,
            },
            {
              name: "ttl",
              description: "Default TTL in seconds",
              type: "number",
              defaultValue: 3600,
              required: true,
            },
          ],
          examples: [
            {
              title: "User cache setup",
              description: "Cache for user data",
              placeholderValues: {
                className: "UserCache",
                namespace: "users",
                ttl: 1800,
              },
            },
          ],
        },
      ],
    });

    // Stream Processing Pattern
    this.patterns.set("streams", {
      name: "streams",
      displayName: "Stream Processor",
      description: "Event stream processing with consumer groups",
      category: "processing",
      complexity: "advanced",
      useCases: ["Event processing", "Message queues", "Real-time data"],
      bestPractices: [
        "Use consumer groups",
        "Handle errors properly",
        "Implement backpressure",
      ],
      templates: [
        {
          name: "typescript-stream-processor",
          description: "Stream processing with consumer groups",
          language: "typescript",
          template: `import { GlideClient } from '@valkey/valkey-glide';

export interface StreamMessage {
  id: string;
  fields: Record<string, string>;
}

export class {{className}} {
  private client: GlideClient;
  private streamName: string;
  private consumerGroup: string;
  private consumerName: string;
  private running = false;

  constructor(
    client: GlideClient,
    streamName: string,
    consumerGroup: string,
    consumerName: string
  ) {
    this.client = client;
    this.streamName = streamName;
    this.consumerGroup = consumerGroup;
    this.consumerName = consumerName;
  }

  async initialize(): Promise<void> {
    try {
      await this.client.xgroup(
        'CREATE',
        this.streamName,
        this.consumerGroup,
        '$',
        { MKSTREAM: true }
      );
    } catch (error) {
      if (!error.message.includes('BUSYGROUP')) {
        throw error;
      }
    }
  }

  async start(processor: (message: StreamMessage) => Promise<void>): Promise<void> {
    if (this.running) {
      throw new Error('Processor is already running');
    }

    this.running = true;
    {{#if includeLogging}}
    console.log(\`Starting stream processor for \${this.streamName}\`);
    {{/if}}

    while (this.running) {
      {{#if includeErrorHandling}}
      try {
        await this.processMessages(processor);
      } catch (error) {
        {{#if includeLogging}}
        console.error('Error in processing loop:', error);
        {{/if}}
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      {{else}}
      await this.processMessages(processor);
      {{/if}}
    }
  }

  async stop(): Promise<void> {
    this.running = false;
  }

  private async processMessages(
    processor: (message: StreamMessage) => Promise<void>
  ): Promise<void> {
    const result = await this.client.xreadgroup(
      this.consumerGroup,
      this.consumerName,
      [{ key: this.streamName, id: '>' }],
      { COUNT: {{batchSize}}, BLOCK: {{blockTime}} }
    );

    if (result.length === 0) return;

    const stream = result[0];
    for (const entry of stream.entries) {
      if (!this.running) break;

      const message: StreamMessage = {
        id: entry.id,
        fields: this.parseFields(entry.elements)
      };

      {{#if includeErrorHandling}}
      try {
        await processor(message);
        await this.client.xack(this.streamName, this.consumerGroup, message.id);
      } catch (error) {
        {{#if includeLogging}}
        console.error(\`Failed to process message \${message.id}:\`, error);
        {{/if}}
      }
      {{else}}
      await processor(message);
      await this.client.xack(this.streamName, this.consumerGroup, message.id);
      {{/if}}
    }
  }

  private parseFields(elements: string[]): Record<string, string> {
    const fields: Record<string, string> = {};
    for (let i = 0; i < elements.length; i += 2) {
      if (i + 1 < elements.length) {
        fields[elements[i]] = elements[i + 1];
      }
    }
    return fields;
  }
}`,
          placeholders: [
            {
              name: "className",
              description: "Name of the stream processor class",
              type: "string",
              defaultValue: "StreamProcessor",
              required: true,
            },
            {
              name: "batchSize",
              description: "Number of messages to process per batch",
              type: "number",
              defaultValue: 10,
              required: false,
            },
            {
              name: "blockTime",
              description: "Block time in milliseconds",
              type: "number",
              defaultValue: 1000,
              required: false,
            },
          ],
          examples: [
            {
              title: "Event processor",
              description: "Process user events",
              placeholderValues: {
                className: "EventProcessor",
                batchSize: 5,
                blockTime: 2000,
              },
            },
          ],
        },
      ],
    });

    // Session Management Pattern
    this.patterns.set("sessions", {
      name: "sessions",
      displayName: "Session Manager",
      description: "User session management with automatic expiration",
      category: "data-access",
      complexity: "simple",
      useCases: [
        "User sessions",
        "Authentication state",
        "Temporary user data",
      ],
      bestPractices: [
        "Set session expiration",
        "Use secure session IDs",
        "Handle session cleanup",
      ],
      templates: [
        {
          name: "typescript-session-manager",
          description: "Session management with Redis",
          language: "typescript",
          template: `import { GlideClient } from '@valkey/valkey-glide';

export interface SessionData {
  userId: string;
  [key: string]: any;
}

export class {{className}} {
  private client: GlideClient;
  private readonly prefix: string;
  private readonly ttl: number;

  constructor(client: GlideClient, options: { prefix?: string; ttl?: number } = {}) {
    this.client = client;
    this.prefix = options.prefix || '{{prefix}}';
    this.ttl = options.ttl || {{ttl}};
  }

  private getKey(sessionId: string): string {
    return \`\${this.prefix}:\${sessionId}\`;
  }

  async create(sessionId: string, data: SessionData): Promise<boolean> {
    {{#if includeErrorHandling}}
    try {
      const serialized = JSON.stringify(data);
      await this.client.set(this.getKey(sessionId), serialized, { EX: this.ttl });
      return true;
    } catch (error) {
      {{#if includeLogging}}
      console.error('Session create error:', error);
      {{/if}}
      return false;
    }
    {{else}}
    const serialized = JSON.stringify(data);
    await this.client.set(this.getKey(sessionId), serialized, { EX: this.ttl });
    return true;
    {{/if}}
  }

  async get(sessionId: string): Promise<SessionData | null> {
    {{#if includeErrorHandling}}
    try {
      const data = await this.client.get(this.getKey(sessionId));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      {{#if includeLogging}}
      console.error('Session get error:', error);
      {{/if}}
      return null;
    }
    {{else}}
    const data = await this.client.get(this.getKey(sessionId));
    return data ? JSON.parse(data) : null;
    {{/if}}
  }

  async update(sessionId: string, data: Partial<SessionData>): Promise<boolean> {
    const existing = await this.get(sessionId);
    if (!existing) return false;

    const updated = { ...existing, ...data };
    return await this.create(sessionId, updated);
  }

  async destroy(sessionId: string): Promise<boolean> {
    {{#if includeErrorHandling}}
    try {
      const result = await this.client.del([this.getKey(sessionId)]);
      return result > 0;
    } catch (error) {
      {{#if includeLogging}}
      console.error('Session destroy error:', error);
      {{/if}}
      return false;
    }
    {{else}}
    const result = await this.client.del([this.getKey(sessionId)]);
    return result > 0;
    {{/if}}
  }

  async extend(sessionId: string): Promise<boolean> {
    {{#if includeErrorHandling}}
    try {
      const result = await this.client.expire(this.getKey(sessionId), this.ttl);
      return result === 1;
    } catch (error) {
      {{#if includeLogging}}
      console.error('Session extend error:', error);
      {{/if}}
      return false;
    }
    {{else}}
    const result = await this.client.expire(this.getKey(sessionId), this.ttl);
    return result === 1;
    {{/if}}
  }
}`,
          placeholders: [
            {
              name: "className",
              description: "Name of the session manager class",
              type: "string",
              defaultValue: "SessionManager",
              required: true,
            },
            {
              name: "prefix",
              description: "Session key prefix",
              type: "string",
              defaultValue: "session",
              required: true,
            },
            {
              name: "ttl",
              description: "Session TTL in seconds",
              type: "number",
              defaultValue: 3600,
              required: true,
            },
          ],
          examples: [
            {
              title: "User session manager",
              description: "Manage user sessions",
              placeholderValues: {
                className: "UserSessionManager",
                prefix: "user_session",
                ttl: 1800,
              },
            },
          ],
        },
      ],
    });
  }

  /**
   * Generate code from pattern
   */
  static async generateCode(
    request: GenerationRequest,
    context: EnhancedQueryContext,
  ): Promise<GenerationResult> {
    const pattern = this.patterns.get(request.pattern);
    if (!pattern) {
      throw new Error(`Pattern '${request.pattern}' not found`);
    }

    const template = pattern.templates.find(
      (t) => t.language === request.language,
    );
    if (!template) {
      throw new Error(
        `No ${request.language} template found for pattern '${request.pattern}'`,
      );
    }

    // Merge placeholders with defaults
    const placeholders = this.mergePlaceholders(
      template.placeholders,
      request.placeholders,
    );

    // Generate main code
    const code = this.renderTemplate(
      template.template,
      placeholders,
      request.options,
    );

    // Generate additional files
    const files = this.generateAdditionalFiles(
      pattern,
      template,
      placeholders,
      request.options,
    );

    return {
      pattern: request.pattern,
      language: request.language,
      code,
      files,
      dependencies: this.getDependencies(pattern),
      usage: this.generateUsage(pattern, placeholders),
    };
  }

  /**
   * Get available patterns
   */
  static getPatterns(): CodePattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Get pattern by name
   */
  static getPattern(name: string): CodePattern | undefined {
    return this.patterns.get(name);
  }

  /**
   * Search patterns by category or use case
   */
  static searchPatterns(query: string): CodePattern[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.patterns.values()).filter(
      (pattern) =>
        pattern.name.includes(lowerQuery) ||
        pattern.displayName.toLowerCase().includes(lowerQuery) ||
        pattern.description.toLowerCase().includes(lowerQuery) ||
        pattern.useCases.some((useCase) =>
          useCase.toLowerCase().includes(lowerQuery),
        ),
    );
  }

  /**
   * Helper methods
   */
  private static mergePlaceholders(
    templatePlaceholders: TemplatePlaceholder[],
    userPlaceholders?: Record<string, any>,
  ): Record<string, any> {
    const result: Record<string, any> = {};

    templatePlaceholders.forEach((placeholder) => {
      result[placeholder.name] =
        userPlaceholders?.[placeholder.name] ?? placeholder.defaultValue;
    });

    return result;
  }

  private static renderTemplate(
    template: string,
    placeholders: Record<string, any>,
    options: GenerationOptions,
  ): string {
    let rendered = template;

    // Replace placeholders
    Object.entries(placeholders).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      rendered = rendered.replace(regex, String(value));
    });

    // Handle conditional blocks
    rendered = this.processConditionals(rendered, options);

    return rendered;
  }

  private static processConditionals(
    template: string,
    options: GenerationOptions,
  ): string {
    let processed = template;

    // Process {{#if condition}} blocks
    const conditionalRegex = /{{#if (\w+)}}([\s\S]*?){{\/if}}/g;
    processed = processed.replace(
      conditionalRegex,
      (match, condition, content) => {
        return options[condition as keyof GenerationOptions] ? content : "";
      },
    );

    return processed;
  }

  private static generateAdditionalFiles(
    pattern: CodePattern,
    template: PatternTemplate,
    placeholders: Record<string, any>,
    options: GenerationOptions,
  ): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    if (options.includeTests) {
      files.push({
        path: `${placeholders.className || "generated"}.test.ts`,
        content: this.generateTestFile(pattern, placeholders),
        type: "test",
        description: "Unit tests for the generated code",
      });
    }

    return files;
  }

  private static generateTestFile(
    pattern: CodePattern,
    placeholders: Record<string, any>,
  ): string {
    const className = placeholders.className || "GeneratedClass";

    return `import { ${className} } from './${className}';

describe('${className}', () => {
  test('should be defined', () => {
    expect(${className}).toBeDefined();
  });

  // Add more specific tests based on pattern
});`;
  }

  private static getDependencies(pattern: CodePattern): string[] {
    return ["@valkey/valkey-glide"];
  }

  private static generateUsage(
    pattern: CodePattern,
    placeholders: Record<string, any>,
  ): string[] {
    return [
      `Install dependencies: npm install @valkey/valkey-glide`,
      `Import the class: import { ${placeholders.className} } from './path/to/file'`,
      `Create an instance and use according to the pattern documentation`,
    ];
  }
}

// Export convenience functions
export const generateCode = PatternAwareGenerator.generateCode;
export const getPatterns = PatternAwareGenerator.getPatterns;
export const searchPatterns = PatternAwareGenerator.searchPatterns;
