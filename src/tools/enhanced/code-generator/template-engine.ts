/**
 * Context-Sensitive Template Engine
 * Provides intelligent template selection and configuration based on context
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";

export interface TemplateContext {
  framework?: "express" | "fastify" | "nest" | "next" | "koa";
  environment: "development" | "production" | "testing";
  features: TemplateFeature[];
  constraints: TemplateConstraint[];
  preferences: UserPreferences;
}

export interface TemplateFeature {
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface TemplateConstraint {
  type: "performance" | "security" | "memory" | "compatibility";
  requirement: string;
  impact: "low" | "medium" | "high";
}

export interface UserPreferences {
  codeStyle: "functional" | "class-based" | "mixed";
  errorHandling: "basic" | "comprehensive" | "custom";
  logging: "none" | "basic" | "structured" | "advanced";
  testing: "none" | "unit" | "integration" | "e2e";
  documentation: "minimal" | "standard" | "comprehensive";
}

export interface TemplateConfiguration {
  templateId: string;
  baseTemplate: string;
  modifications: TemplateModification[];
  dependencies: DependencySpec[];
  configFiles: ConfigFile[];
  examples: CodeExample[];
}

export interface TemplateModification {
  type: "import" | "middleware" | "method" | "decorator" | "config";
  position: "top" | "bottom" | "before" | "after" | "replace";
  target?: string;
  content: string;
  condition?: string;
}

export interface DependencySpec {
  name: string;
  version: string;
  type: "runtime" | "dev" | "peer";
  optional: boolean;
  reason: string;
}

export interface ConfigFile {
  name: string;
  path: string;
  content: string;
  type: "json" | "yaml" | "env" | "ts" | "js";
  description: string;
}

export interface CodeExample {
  title: string;
  description: string;
  code: string;
  framework?: string;
  complexity: "basic" | "intermediate" | "advanced";
}

export class ContextSensitiveTemplateEngine {
  private static frameworkTemplates: Map<string, FrameworkTemplate> = new Map();
  private static featureModules: Map<string, FeatureModule> = new Map();

  static {
    this.initializeFrameworkTemplates();
    this.initializeFeatureModules();
  }

  /**
   * Initialize framework-specific templates
   */
  private static initializeFrameworkTemplates(): void {
    // Express.js Templates
    this.frameworkTemplates.set("express", {
      name: "express",
      displayName: "Express.js",
      version: "^4.18.0",
      baseTemplate: `import express from 'express';
import { GlideClient } from '@valkey/valkey-glide';
{{#if includeMiddleware}}
{{middlewareImports}}
{{/if}}

export class {{className}} {
  private app: express.Application;
  private redisClient: GlideClient;
  private server?: any;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  async initialize(): Promise<void> {
    // Initialize Redis connection
    this.redisClient = await GlideClient.createClient({
      addresses: [{ host: '{{redisHost}}', port: {{redisPort}} }]
    });

    {{#if includeLogging}}
    console.log('Redis client connected successfully');
    {{/if}}
  }

  private setupMiddleware(): void {
    {{#if includeJsonParser}}
    this.app.use(express.json());
    {{/if}}
    {{#if includeCors}}
    this.app.use(cors());
    {{/if}}
    {{#if includeHelmet}}
    this.app.use(helmet());
    {{/if}}
    {{#if includeRateLimit}}
    this.app.use('/api', rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }));
    {{/if}}
    {{middlewareSetup}}
  }

  private setupRoutes(): void {
    {{routeDefinitions}}
    
    {{#if includeHealthCheck}}
    this.app.get('/health', async (req, res) => {
      try {
        await this.redisClient.ping();
        res.json({ status: 'healthy', redis: 'connected' });
      } catch (error) {
        res.status(503).json({ status: 'unhealthy', redis: 'disconnected' });
      }
    });
    {{/if}}

    {{#if includeErrorHandler}}
    this.app.use(this.errorHandler.bind(this));
    {{/if}}
  }

  {{#if includeErrorHandler}}
  private errorHandler(
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    {{#if includeLogging}}
    console.error('Express error:', error);
    {{/if}}
    
    const statusCode = (error as any).statusCode || 500;
    res.status(statusCode).json({
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message
    });
  }
  {{/if}}

  async start(port: number = {{defaultPort}}): Promise<void> {
    await this.initialize();
    
    this.server = this.app.listen(port, () => {
      {{#if includeLogging}}
      console.log(\`Server running on port \${port}\`);
      {{/if}}
    });
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.server.close();
    }
    if (this.redisClient) {
      await this.redisClient.close();
    }
  }
}`,
      modifications: {
        caching: `
  // Cache middleware
  private cacheMiddleware(ttl: number = 300) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const key = \`cache:\${req.method}:\${req.path}:\${JSON.stringify(req.query)}\`;
      
      try {
        const cached = await this.redisClient.get(key);
        if (cached) {
          return res.json(JSON.parse(cached));
        }
        
        const originalSend = res.json;
        res.json = function(data: any) {
          this.redisClient.set(key, JSON.stringify(data), { EX: ttl });
          return originalSend.call(this, data);
        }.bind(this);
        
        next();
      } catch (error) {
        next();
      }
    };
  }`,
        sessions: `
  // Session middleware
  private sessionMiddleware() {
    return session({
      store: new RedisStore({ client: this.redisClient as any }),
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
      }
    });
  }`,
        rateLimiting: `
  // Rate limiting with Redis
  private rateLimitMiddleware() {
    return rateLimit({
      store: new RedisStore({
        client: this.redisClient as any,
        prefix: 'rl:'
      }),
      windowMs: 15 * 60 * 1000,
      max: 100
    });
  }`,
      },
      dependencies: [
        {
          name: "express",
          version: "^4.18.0",
          type: "runtime",
          optional: false,
          reason: "Web framework",
        },
        {
          name: "@types/express",
          version: "^4.17.0",
          type: "dev",
          optional: false,
          reason: "TypeScript types",
        },
      ],
    });

    // Fastify Templates
    this.frameworkTemplates.set("fastify", {
      name: "fastify",
      displayName: "Fastify",
      version: "^4.0.0",
      baseTemplate: `import Fastify, { FastifyInstance } from 'fastify';
import { GlideClient } from '@valkey/valkey-glide';
{{#if includeMiddleware}}
{{middlewareImports}}
{{/if}}

export class {{className}} {
  private server: FastifyInstance;
  private redisClient: GlideClient;

  constructor() {
    this.server = Fastify({
      logger: {{includeLogging}},
      {{#if includeRequestId}}
      genReqId: () => \`req-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`
      {{/if}}
    });
    
    this.setupPlugins();
    this.setupRoutes();
  }

  async initialize(): Promise<void> {
    // Initialize Redis connection
    this.redisClient = await GlideClient.createClient({
      addresses: [{ host: '{{redisHost}}', port: {{redisPort}} }]
    });

    // Register Redis client with Fastify
    this.server.decorate('redis', this.redisClient);
  }

  private async setupPlugins(): Promise<void> {
    {{#if includeCors}}
    await this.server.register(require('@fastify/cors'));
    {{/if}}
    {{#if includeHelmet}}
    await this.server.register(require('@fastify/helmet'));
    {{/if}}
    {{#if includeRateLimit}}
    await this.server.register(require('@fastify/rate-limit'), {
      max: 100,
      timeWindow: '1 minute'
    });
    {{/if}}
    {{pluginRegistrations}}
  }

  private setupRoutes(): void {
    {{routeDefinitions}}
    
    {{#if includeHealthCheck}}
    this.server.get('/health', async (request, reply) => {
      try {
        await this.redisClient.ping();
        return { status: 'healthy', redis: 'connected' };
      } catch (error) {
        reply.code(503);
        return { status: 'unhealthy', redis: 'disconnected' };
      }
    });
    {{/if}}
  }

  async start(port: number = {{defaultPort}}): Promise<void> {
    await this.initialize();
    
    try {
      await this.server.listen({ port, host: '0.0.0.0' });
      {{#if includeLogging}}
      this.server.log.info(\`Server running on port \${port}\`);
      {{/if}}
    } catch (error) {
      this.server.log.error(error);
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    await this.server.close();
    if (this.redisClient) {
      await this.redisClient.close();
    }
  }
}`,
      modifications: {
        caching: `
  // Cache plugin
  private async setupCaching(): Promise<void> {
    this.server.addHook('onRequest', async (request, reply) => {
      const key = \`cache:\${request.method}:\${request.url}\`;
      
      try {
        const cached = await this.redisClient.get(key);
        if (cached) {
          reply.send(JSON.parse(cached));
          return;
        }
        
        request.cacheKey = key;
      } catch (error) {
        // Continue without cache
      }
    });
    
    this.server.addHook('onSend', async (request, reply, payload) => {
      if (request.cacheKey && reply.statusCode === 200) {
        try {
          await this.redisClient.set(request.cacheKey, payload, { EX: 300 });
        } catch (error) {
          // Cache write failed, continue
        }
      }
      
      return payload;
    });
  }`,
      },
      dependencies: [
        {
          name: "fastify",
          version: "^4.0.0",
          type: "runtime",
          optional: false,
          reason: "Web framework",
        },
      ],
    });

    // NestJS Templates
    this.frameworkTemplates.set("nest", {
      name: "nest",
      displayName: "NestJS",
      version: "^10.0.0",
      baseTemplate: `import { Module, Injectable, Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GlideClient } from '@valkey/valkey-glide';

@Injectable()
export class {{serviceName}} {
  private redisClient: GlideClient;

  async onModuleInit() {
    this.redisClient = await GlideClient.createClient({
      addresses: [{ host: '{{redisHost}}', port: {{redisPort}} }]
    });
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      await this.redisClient.close();
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const options = ttl ? { EX: ttl } : undefined;
    await this.redisClient.set(key, value, options);
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.redisClient.del([key]);
    return result > 0;
  }
}

@Controller('{{controllerPath}}')
export class {{controllerName}} {
  constructor(private readonly {{serviceInstanceName}}: {{serviceName}}) {}

  {{#if includeHealthCheck}}
  @Get('health')
  async health() {
    try {
      await this.{{serviceInstanceName}}.redisClient.ping();
      return { status: 'healthy', redis: 'connected' };
    } catch (error) {
      return { status: 'unhealthy', redis: 'disconnected' };
    }
  }
  {{/if}}

  {{routeMethods}}
}

@Module({
  controllers: [{{controllerName}}],
  providers: [{{serviceName}}],
  exports: [{{serviceName}}]
})
export class {{moduleName}} {}`,
      modifications: {
        caching: `
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly {{serviceInstanceName}}: {{serviceName}}) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = \`cache:\${request.method}:\${request.url}\`;
    
    try {
      const cached = await this.{{serviceInstanceName}}.get(key);
      if (cached) {
        return of(JSON.parse(cached));
      }
    } catch (error) {
      // Continue without cache
    }
    
    return next.handle().pipe(
      tap(async (data) => {
        try {
          await this.{{serviceInstanceName}}.set(key, JSON.stringify(data), 300);
        } catch (error) {
          // Cache write failed
        }
      })
    );
  }
}`,
      },
      dependencies: [
        {
          name: "@nestjs/common",
          version: "^10.0.0",
          type: "runtime",
          optional: false,
          reason: "NestJS core",
        },
        {
          name: "@nestjs/core",
          version: "^10.0.0",
          type: "runtime",
          optional: false,
          reason: "NestJS core",
        },
      ],
    });
  }

  /**
   * Initialize feature modules
   */
  private static initializeFeatureModules(): void {
    // Caching Feature
    this.featureModules.set("caching", {
      name: "caching",
      displayName: "Caching Layer",
      description: "Intelligent caching with TTL and invalidation",
      dependencies: [],
      implementation: {
        express: "caching",
        fastify: "caching",
        nest: "caching",
      },
      configuration: {
        defaultTtl: 300,
        namespace: "cache",
        enableMetrics: true,
      },
    });

    // Session Management Feature
    this.featureModules.set("sessions", {
      name: "sessions",
      displayName: "Session Management",
      description: "Redis-backed session storage",
      dependencies: [
        {
          name: "express-session",
          version: "^1.17.0",
          type: "runtime",
          optional: false,
          reason: "Session middleware",
        },
        {
          name: "connect-redis",
          version: "^7.0.0",
          type: "runtime",
          optional: false,
          reason: "Redis session store",
        },
      ],
      implementation: {
        express: "sessions",
      },
      configuration: {
        secret: "your-session-secret",
        ttl: 86400,
        secure: true,
      },
    });

    // Rate Limiting Feature
    this.featureModules.set("rateLimiting", {
      name: "rateLimiting",
      displayName: "Rate Limiting",
      description: "Redis-backed rate limiting",
      dependencies: [
        {
          name: "express-rate-limit",
          version: "^6.0.0",
          type: "runtime",
          optional: false,
          reason: "Rate limiting",
        },
        {
          name: "rate-limit-redis",
          version: "^3.0.0",
          type: "runtime",
          optional: false,
          reason: "Redis rate limit store",
        },
      ],
      implementation: {
        express: "rateLimiting",
      },
      configuration: {
        windowMs: 900000, // 15 minutes
        max: 100,
        message: "Too many requests",
      },
    });
  }

  /**
   * Generate template configuration based on context
   */
  static generateTemplateConfiguration(
    pattern: string,
    context: TemplateContext,
    queryContext: EnhancedQueryContext,
  ): TemplateConfiguration {
    const framework = context.framework || "express";
    const frameworkTemplate = this.frameworkTemplates.get(framework);

    if (!frameworkTemplate) {
      throw new Error(`Framework '${framework}' not supported`);
    }

    // Build template modifications based on enabled features
    const modifications: TemplateModification[] = [];
    const dependencies: DependencySpec[] = [...frameworkTemplate.dependencies];
    const configFiles: ConfigFile[] = [];

    // Add feature-specific modifications
    context.features.forEach((feature) => {
      if (!feature.enabled) return;

      const featureModule = this.featureModules.get(feature.name);
      if (featureModule && featureModule.implementation[framework]) {
        const modification =
          frameworkTemplate.modifications[
            featureModule.implementation[framework]
          ];
        if (modification) {
          modifications.push({
            type: "method",
            position: "bottom",
            content: modification,
            condition: feature.name,
          });
        }

        dependencies.push(...featureModule.dependencies);
      }
    });

    // Add environment-specific configurations
    if (context.environment === "production") {
      configFiles.push({
        name: "production.env",
        path: ".env.production",
        content: this.generateProductionEnv(),
        type: "env",
        description: "Production environment configuration",
      });
    }

    // Add package.json
    configFiles.push({
      name: "package.json",
      path: "package.json",
      content: this.generatePackageJson(dependencies, framework),
      type: "json",
      description: "Node.js package configuration",
    });

    return {
      templateId: `${pattern}-${framework}-${context.environment}`,
      baseTemplate: frameworkTemplate.baseTemplate,
      modifications,
      dependencies,
      configFiles,
      examples: this.generateFrameworkExamples(framework, pattern),
    };
  }

  /**
   * Apply template configuration to generate final code
   */
  static applyTemplate(
    config: TemplateConfiguration,
    placeholders: Record<string, any>,
    preferences: UserPreferences,
  ): string {
    let template = config.baseTemplate;

    // Apply modifications
    config.modifications.forEach((mod) => {
      if (mod.condition && !placeholders[mod.condition]) {
        return;
      }

      switch (mod.type) {
        case "method":
          if (mod.position === "bottom") {
            template = template.replace(
              "{{routeDefinitions}}",
              "{{routeDefinitions}}\n" + mod.content,
            );
          }
          break;
        case "import":
          template = mod.content + "\n" + template;
          break;
        case "middleware":
          template = template.replace(
            "{{middlewareSetup}}",
            "{{middlewareSetup}}\n" + mod.content,
          );
          break;
      }
    });

    // Apply placeholders
    Object.entries(placeholders).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      template = template.replace(regex, String(value));
    });

    // Handle conditionals
    template = this.processConditionals(template, placeholders);

    return template;
  }

  /**
   * Get available frameworks
   */
  static getFrameworks(): string[] {
    return Array.from(this.frameworkTemplates.keys());
  }

  /**
   * Get available features
   */
  static getFeatures(): FeatureModule[] {
    return Array.from(this.featureModules.values());
  }

  /**
   * Helper methods
   */
  private static processConditionals(
    template: string,
    placeholders: Record<string, any>,
  ): string {
    let processed = template;

    // Process {{#if condition}} blocks
    const conditionalRegex = /{{#if (\w+)}}([\s\S]*?){{\/if}}/g;
    processed = processed.replace(
      conditionalRegex,
      (match, condition, content) => {
        return placeholders[condition] ? content : "";
      },
    );

    return processed;
  }

  private static generateProductionEnv(): string {
    return `NODE_ENV=production
REDIS_HOST=localhost
REDIS_PORT=6379
SESSION_SECRET=your-secure-session-secret
LOG_LEVEL=info`;
  }

  private static generatePackageJson(
    dependencies: DependencySpec[],
    framework: string,
  ): string {
    const deps: Record<string, string> = {};
    const devDeps: Record<string, string> = {};

    dependencies.forEach((dep) => {
      if (dep.type === "dev") {
        devDeps[dep.name] = dep.version;
      } else {
        deps[dep.name] = dep.version;
      }
    });

    return JSON.stringify(
      {
        name: `redis-${framework}-app`,
        version: "1.0.0",
        description: `Redis application with ${framework}`,
        main: "dist/index.js",
        scripts: {
          build: "tsc",
          start: "node dist/index.js",
          dev: "ts-node src/index.ts",
          test: "jest",
        },
        dependencies: deps,
        devDependencies: {
          ...devDeps,
          typescript: "^5.0.0",
          "ts-node": "^10.9.0",
          "@types/node": "^20.0.0",
        },
      },
      null,
      2,
    );
  }

  private static generateFrameworkExamples(
    framework: string,
    pattern: string,
  ): CodeExample[] {
    const examples: CodeExample[] = [];

    if (framework === "express" && pattern === "caching") {
      examples.push({
        title: "Express Caching Route",
        description: "Example route with caching middleware",
        code: `app.get('/api/users/:id', cacheMiddleware(300), async (req, res) => {
  const userId = req.params.id;
  const user = await getUserFromDatabase(userId);
  res.json(user);
});`,
        framework: "express",
        complexity: "basic",
      });
    }

    return examples;
  }
}

interface FrameworkTemplate {
  name: string;
  displayName: string;
  version: string;
  baseTemplate: string;
  modifications: Record<string, string>;
  dependencies: DependencySpec[];
}

interface FeatureModule {
  name: string;
  displayName: string;
  description: string;
  dependencies: DependencySpec[];
  implementation: Record<string, string>;
  configuration: Record<string, any>;
}

// Export convenience functions
export const generateTemplateConfiguration =
  ContextSensitiveTemplateEngine.generateTemplateConfiguration;
export const applyTemplate = ContextSensitiveTemplateEngine.applyTemplate;
export const getFrameworks = ContextSensitiveTemplateEngine.getFrameworks;
