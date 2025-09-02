/**
 * Production-Ready Code Generator
 * Generates robust, production-ready code with comprehensive error handling and monitoring
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";

export interface ProductionCodeOptions {
  errorHandling: "basic" | "comprehensive" | "enterprise";
  monitoring: "none" | "basic" | "advanced";
  logging: "console" | "structured";
  security: "basic" | "enhanced";
  performance: "standard" | "optimized";
  reliability: "standard" | "high-availability";
  testing: "unit" | "integration" | "comprehensive";
}

export interface ProductionTemplate {
  name: string;
  description: string;
  baseCode: string;
  patterns: ProductionPattern[];
}

export interface ProductionPattern {
  type:
    | "error-handling"
    | "monitoring"
    | "security"
    | "performance"
    | "testing";
  level: string;
  code: string;
  dependencies: string[];
  description: string;
}

export interface ProductionResult {
  mainCode: string;
  supportingFiles: SupportingFile[];
  dependencies: string[];
  documentation: string;
  examples: string[];
}

export interface SupportingFile {
  name: string;
  content: string;
  type: "config" | "utility" | "test" | "types";
  description: string;
}

export class ProductionCodeGenerator {
  private static templates: Map<string, ProductionTemplate> = new Map();

  static {
    this.initializeTemplates();
  }

  /**
   * Initialize production templates
   */
  private static initializeTemplates(): void {
    // Enterprise Redis Client
    this.templates.set("enterprise-client", {
      name: "enterprise-client",
      description:
        "Production-ready Redis client with full monitoring and error handling",
      baseCode: `import { GlideClient, GlideClientConfiguration } from '@valkey/valkey-glide';
import { EventEmitter } from 'events';
{{#if includeMetrics}}
import { Metrics } from './metrics';
{{/if}}
{{#if includeLogger}}
import { Logger } from './logger';
{{/if}}

export interface {{className}}Config extends Partial<GlideClientConfiguration> {
  retryAttempts?: number;
  retryDelay?: number;
  connectionTimeout?: number;
  operationTimeout?: number;
  healthCheckInterval?: number;
}

export interface ConnectionHealth {
  isConnected: boolean;
  lastPing: Date | null;
  failureCount: number;
  totalOperations: number;
  averageLatency: number;
}

export class {{className}} extends EventEmitter {
  private client: GlideClient | null = null;
  private config: {{className}}Config;
  private health: ConnectionHealth;
  private healthTimer?: NodeJS.Timeout;
  private connecting = false;

  {{#if includeMetrics}}
  private metrics = new Metrics();
  {{/if}}
  {{#if includeLogger}}
  private logger = new Logger('{{className}}');
  {{/if}}

  constructor(config: {{className}}Config = {}) {
    super();
    
    this.config = {
      addresses: [{ host: 'localhost', port: 6379 }],
      retryAttempts: 3,
      retryDelay: 1000,
      connectionTimeout: 5000,
      operationTimeout: 3000,
      healthCheckInterval: 30000,
      ...config
    };

    this.health = {
      isConnected: false,
      lastPing: null,
      failureCount: 0,
      totalOperations: 0,
      averageLatency: 0
    };
  }

  async connect(): Promise<void> {
    if (this.connecting) return;
    if (this.client) return;

    this.connecting = true;
    
    try {
      {{#if includeLogger}}
      this.logger.info('Connecting to Redis', { addresses: this.config.addresses });
      {{/if}}

      const startTime = Date.now();
      
      this.client = await Promise.race([
        GlideClient.createClient(this.config),
        this.timeoutPromise(this.config.connectionTimeout!, 'Connection timeout')
      ]);

      const duration = Date.now() - startTime;
      this.health.isConnected = true;
      this.health.failureCount = 0;

      {{#if includeMetrics}}
      this.metrics.recordConnection('success', duration);
      {{/if}}

      {{#if includeLogger}}
      this.logger.info('Connected to Redis', { duration });
      {{/if}}

      this.emit('connected');
      this.startHealthCheck();

    } catch (error) {
      this.health.failureCount++;
      
      {{#if includeMetrics}}
      this.metrics.recordConnection('error');
      {{/if}}

      {{#if includeLogger}}
      this.logger.error('Connection failed', { error: error.message });
      {{/if}}

      throw error;
    } finally {
      this.connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    this.stopHealthCheck();
    
    if (this.client) {
      try {
        await this.client.close();
        {{#if includeLogger}}
        this.logger.info('Disconnected from Redis');
        {{/if}}
      } catch (error) {
        {{#if includeLogger}}
        this.logger.error('Disconnect error', { error: error.message });
        {{/if}}
      } finally {
        this.client = null;
        this.health.isConnected = false;
        this.emit('disconnected');
      }
    }
  }

  private async executeWithRetry<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    let lastError: Error;
    const startTime = Date.now();

    for (let attempt = 1; attempt <= this.config.retryAttempts!; attempt++) {
      try {
        this.ensureConnected();
        
        const result = await Promise.race([
          fn(),
          this.timeoutPromise(this.config.operationTimeout!, 'Operation timeout')
        ]);

        const duration = Date.now() - startTime;
        this.recordOperation(operation, 'success', duration);
        return result;

      } catch (error) {
        lastError = error as Error;
        const duration = Date.now() - startTime;
        this.recordOperation(operation, 'error', duration);

        {{#if includeLogger}}
        this.logger.warn('Operation failed', { operation, attempt, error: error.message });
        {{/if}}

        if (attempt < this.config.retryAttempts!) {
          await this.delay(this.config.retryDelay! * attempt);
        }
      }
    }

    throw new Error(\`Operation '\${operation}' failed after \${this.config.retryAttempts} attempts: \${lastError!.message}\`);
  }

  private ensureConnected(): void {
    if (!this.client || !this.health.isConnected) {
      throw new Error('Redis client not connected');
    }
  }

  private recordOperation(operation: string, status: 'success' | 'error', duration: number): void {
    this.health.totalOperations++;
    
    {{#if includeMetrics}}
    this.metrics.recordOperation(operation, status, duration);
    {{/if}}

    this.health.averageLatency = (
      (this.health.averageLatency * (this.health.totalOperations - 1) + duration) / 
      this.health.totalOperations
    );
  }

  private startHealthCheck(): void {
    this.healthTimer = setInterval(async () => {
      try {
        await this.ping();
        this.health.lastPing = new Date();
        this.health.failureCount = 0;
      } catch (error) {
        this.health.failureCount++;
        this.health.isConnected = false;
        
        {{#if includeLogger}}
        this.logger.error('Health check failed', { error: error.message });
        {{/if}}

        this.emit('healthCheckFailed', error);
      }
    }, this.config.healthCheckInterval);
  }

  private stopHealthCheck(): void {
    if (this.healthTimer) {
      clearInterval(this.healthTimer);
      this.healthTimer = undefined;
    }
  }

  private timeoutPromise<T>(ms: number, message: string): Promise<T> {
    return new Promise((_, reject) => 
      setTimeout(() => reject(new Error(message)), ms)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Redis operations with error handling
  async get(key: string): Promise<string | null> {
    return this.executeWithRetry('get', () => this.client!.get(key));
  }

  async set(key: string, value: string, options?: { EX?: number }): Promise<string | null> {
    return this.executeWithRetry('set', () => this.client!.set(key, value, options));
  }

  async del(keys: string[]): Promise<number> {
    return this.executeWithRetry('del', () => this.client!.del(keys));
  }

  async ping(): Promise<string> {
    return this.executeWithRetry('ping', () => this.client!.ping());
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.executeWithRetry('hget', () => this.client!.hget(key, field));
  }

  async hset(key: string, field: string, value: string): Promise<number>;
  async hset(key: string, fieldValueMap: Record<string, string>): Promise<number>;
  async hset(key: string, fieldOrMap: string | Record<string, string>, value?: string): Promise<number> {
    return this.executeWithRetry('hset', () => {
      if (typeof fieldOrMap === 'string' && value !== undefined) {
        return this.client!.hset(key, fieldOrMap, value);
      }
      return this.client!.hset(key, fieldOrMap as Record<string, string>);
    });
  }

  // Monitoring
  getHealth(): ConnectionHealth {
    return { ...this.health };
  }

  isConnected(): boolean {
    return this.health.isConnected && this.client !== null;
  }

  {{#if includeMetrics}}
  getMetrics() {
    return this.metrics.getAll();
  }
  {{/if}}
}`,
      patterns: [
        {
          type: "error-handling",
          level: "comprehensive",
          code: `// Enhanced error handling with circuit breaker
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      const timeSinceLastFail = Date.now() - this.lastFailTime;
      if (timeSinceLastFail < this.resetTimeout) {
        throw new Error('Circuit breaker is open');
      }
      this.state = 'half-open';
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}`,
          dependencies: [],
          description: "Circuit breaker pattern for failure isolation",
        },
        {
          type: "monitoring",
          level: "advanced",
          code: `export class Metrics {
  private counters = new Map<string, number>();
  private histograms = new Map<string, number[]>();
  
  recordOperation(operation: string, status: string, duration: number): void {
    const key = \`\${operation}_\${status}\`;
    this.counters.set(key, (this.counters.get(key) || 0) + 1);
    
    const durations = this.histograms.get(operation) || [];
    durations.push(duration);
    this.histograms.set(operation, durations);
  }
  
  recordConnection(status: string, duration?: number): void {
    this.counters.set(\`connections_\${status}\`, (this.counters.get(\`connections_\${status}\`) || 0) + 1);
    if (duration) {
      const durations = this.histograms.get('connection_time') || [];
      durations.push(duration);
      this.histograms.set('connection_time', durations);
    }
  }
}`,
          dependencies: ["prom-client"],
          description: "Comprehensive metrics collection",
        },
        {
          type: "security",
          level: "enhanced",
          code: `import Joi from 'joi';

export class SecurityValidator {
  private keySchema = Joi.string().alphanum().min(1).max(250);
  private valueSchema = Joi.string().max(1048576); // 1MB limit
  
  validateKey(key: string): void {
    const { error } = this.keySchema.validate(key);
    if (error) throw new Error(\`Invalid key: \${error.message}\`);
  }
  
  validateValue(value: string): void {
    const { error } = this.valueSchema.validate(value);
    if (error) throw new Error(\`Invalid value: \${error.message}\`);
  }
}`,
          dependencies: ["joi"],
          description: "Input validation and sanitization",
        },
      ],
    });

    // High-Performance Cache Template
    this.templates.set("high-performance-cache", {
      name: "high-performance-cache",
      description: "High-performance caching solution with advanced features",
      baseCode: `import { GlideClient } from '@valkey/valkey-glide';
{{#if includeCompression}}
import { compress, decompress } from './compression';
{{/if}}
{{#if includeMetrics}}
import { CacheMetrics } from './cache-metrics';
{{/if}}

export interface CacheConfig {
  namespace: string;
  defaultTtl: number;
  maxValueSize: number;
  compressionThreshold: number;
  enableMetrics: boolean;
}

export class {{className}} {
  private client: GlideClient;
  private config: CacheConfig;
  {{#if includeMetrics}}
  private metrics = new CacheMetrics();
  {{/if}}

  constructor(client: GlideClient, config: Partial<CacheConfig> = {}) {
    this.client = client;
    this.config = {
      namespace: 'cache',
      defaultTtl: 3600,
      maxValueSize: 1048576, // 1MB
      compressionThreshold: 1024, // 1KB
      enableMetrics: true,
      ...config
    };
  }

  private buildKey(key: string): string {
    return \`\${this.config.namespace}:\${key}\`;
  }

  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    
    try {
      const cacheKey = this.buildKey(key);
      let value = await this.client.get(cacheKey);
      
      if (!value) {
        {{#if includeMetrics}}
        this.metrics.recordMiss(key, Date.now() - startTime);
        {{/if}}
        return null;
      }

      {{#if includeCompression}}
      if (value.startsWith('compressed:')) {
        value = await decompress(value.substring(11));
      }
      {{/if}}

      const result = JSON.parse(value);
      
      {{#if includeMetrics}}
      this.metrics.recordHit(key, Date.now() - startTime);
      {{/if}}

      return result;
    } catch (error) {
      {{#if includeMetrics}}
      this.metrics.recordError(key, error.message);
      {{/if}}
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      let serialized = JSON.stringify(value);
      
      if (serialized.length > this.config.maxValueSize) {
        throw new Error('Value exceeds maximum size');
      }

      {{#if includeCompression}}
      if (serialized.length > this.config.compressionThreshold) {
        serialized = 'compressed:' + await compress(serialized);
      }
      {{/if}}

      const cacheKey = this.buildKey(key);
      const actualTtl = ttl || this.config.defaultTtl;
      const options = actualTtl > 0 ? { EX: actualTtl } : undefined;
      
      await this.client.set(cacheKey, serialized, options);
      
      {{#if includeMetrics}}
      this.metrics.recordSet(key, serialized.length);
      {{/if}}

      return true;
    } catch (error) {
      {{#if includeMetrics}}
      this.metrics.recordError(key, error.message);
      {{/if}}
      return false;
    }
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.client.del([this.buildKey(key)]);
      {{#if includeMetrics}}
      this.metrics.recordDelete(key);
      {{/if}}
      return result > 0;
    } catch (error) {
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      const pattern = this.buildKey('*');
      const keys = await this.client.keys(pattern);
      
      if (keys.length === 0) return true;
      
      const result = await this.client.del(keys);
      return result > 0;
    } catch (error) {
      return false;
    }
  }

  {{#if includeMetrics}}
  getStats() {
    return this.metrics.getStats();
  }
  {{/if}}
}`,
      patterns: [],
    });
  }

  /**
   * Generate production code
   */
  static generateProductionCode(
    pattern: string,
    options: ProductionCodeOptions,
    placeholders: Record<string, any>,
    context: EnhancedQueryContext,
  ): ProductionResult {
    const template = this.templates.get(pattern);
    if (!template) {
      throw new Error(`Template '${pattern}' not found`);
    }

    // Generate main code
    const mainCode = this.processTemplate(
      template.baseCode,
      options,
      placeholders,
    );

    // Generate supporting files
    const supportingFiles = this.generateSupportingFiles(options, placeholders);

    // Collect dependencies
    const dependencies = this.collectDependencies(template, options);

    return {
      mainCode,
      supportingFiles,
      dependencies,
      documentation: this.generateDocumentation(template, options),
      examples: this.generateExamples(template, placeholders),
    };
  }

  private static processTemplate(
    template: string,
    options: ProductionCodeOptions,
    placeholders: Record<string, any>,
  ): string {
    let processed = template;

    // Apply placeholders
    Object.entries(placeholders).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      processed = processed.replace(regex, String(value));
    });

    // Process conditionals based on options
    const features = this.getFeatures(options);
    features.forEach((feature) => {
      const regex = new RegExp(`{{#if ${feature}}}([\\s\\S]*?){{/if}}`, "g");
      processed = processed.replace(regex, "$1");
    });

    // Remove unused conditionals
    processed = processed.replace(/{{#if \w+}}[\s\S]*?{{\/if}}/g, "");

    return processed;
  }

  private static getFeatures(options: ProductionCodeOptions): string[] {
    const features: string[] = [];

    if (options.monitoring !== "none") features.push("includeMetrics");
    if (options.logging === "structured") features.push("includeLogger");
    if (options.performance === "optimized")
      features.push("includeCompression");
    if (options.errorHandling !== "basic")
      features.push("includeAdvancedErrorHandling");

    return features;
  }

  private static generateSupportingFiles(
    options: ProductionCodeOptions,
    placeholders: Record<string, any>,
  ): SupportingFile[] {
    const files: SupportingFile[] = [];

    if (options.monitoring !== "none") {
      files.push({
        name: "metrics.ts",
        content: this.createMetricsFile(),
        type: "utility",
        description: "Metrics collection utilities",
      });
    }

    if (options.logging === "structured") {
      files.push({
        name: "logger.ts",
        content: this.createLoggerFile(),
        type: "utility",
        description: "Structured logging utilities",
      });
    }

    if (options.testing !== "unit") {
      files.push({
        name: `${placeholders.className || "Client"}.test.ts`,
        content: this.createTestFile(placeholders),
        type: "test",
        description: "Comprehensive test suite",
      });
    }

    return files;
  }

  private static createMetricsFile(): string {
    return `export class Metrics {
  private counters = new Map<string, number>();
  private histograms = new Map<string, number[]>();

  recordOperation(op: string, status: string, duration: number): void {
    this.counters.set(\`\${op}_\${status}\`, (this.counters.get(\`\${op}_\${status}\`) || 0) + 1);
    const durations = this.histograms.get(op) || [];
    durations.push(duration);
    this.histograms.set(op, durations);
  }

  getAll() {
    return { counters: Object.fromEntries(this.counters), histograms: Object.fromEntries(this.histograms) };
  }
}`;
  }

  private static createLoggerFile(): string {
    return `export class Logger {
  constructor(private service: string) {}

  info(message: string, meta?: any): void {
    console.log(JSON.stringify({ level: 'info', service: this.service, message, meta, timestamp: new Date() }));
  }

  error(message: string, meta?: any): void {
    console.error(JSON.stringify({ level: 'error', service: this.service, message, meta, timestamp: new Date() }));
  }

  warn(message: string, meta?: any): void {
    console.warn(JSON.stringify({ level: 'warn', service: this.service, message, meta, timestamp: new Date() }));
  }
}`;
  }

  private static createTestFile(placeholders: Record<string, any>): string {
    const className = placeholders.className || "RedisClient";

    return `import { ${className} } from './${className}';

describe('${className}', () => {
  let client: ${className};

  beforeEach(() => {
    client = new ${className}();
  });

  it('should connect successfully', async () => {
    await expect(client.connect()).resolves.not.toThrow();
  });

  it('should handle get/set operations', async () => {
    await client.connect();
    await client.set('test', 'value');
    const result = await client.get('test');
    expect(result).toBe('value');
  });
});`;
  }

  private static collectDependencies(
    template: ProductionTemplate,
    options: ProductionCodeOptions,
  ): string[] {
    const deps = ["@valkey/valkey-glide"];

    if (options.monitoring !== "none") deps.push("prom-client");
    if (options.logging === "structured") deps.push("winston");
    if (options.security === "enhanced") deps.push("joi");
    if (options.testing !== "unit") deps.push("jest", "@types/jest");

    return [...new Set(deps)];
  }

  private static generateDocumentation(
    template: ProductionTemplate,
    options: ProductionCodeOptions,
  ): string {
    return `# ${template.name}

${template.description}

## Features
- ${options.errorHandling} error handling
- ${options.monitoring} monitoring
- ${options.logging} logging
- ${options.security} security

## Usage
\`\`\`typescript
const client = new RedisClient();
await client.connect();
await client.set('key', 'value');
const value = await client.get('key');
\`\`\`

## Configuration
See the config interface for available options.`;
  }

  private static generateExamples(
    template: ProductionTemplate,
    placeholders: Record<string, any>,
  ): string[] {
    return [
      `// Basic usage
const client = new ${placeholders.className || "RedisClient"}();
await client.connect();`,
      `// With monitoring
const health = client.getHealth();
console.log('Connected:', health.isConnected);`,
      `// Error handling
try {
  await client.set('key', 'value');
} catch (error) {
  console.error('Operation failed:', error.message);
}`,
    ];
  }

  /**
   * Get available templates
   */
  static getTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Get template details
   */
  static getTemplate(name: string): ProductionTemplate | undefined {
    return this.templates.get(name);
  }
}

// Export convenience function
export const generateProductionCode =
  ProductionCodeGenerator.generateProductionCode;
