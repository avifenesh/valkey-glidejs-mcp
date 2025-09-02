# Parameter Examples and Workflow Patterns

## Universal MCP Tool Enhancement System

This document provides comprehensive examples for all system parameters and common workflow patterns for the Universal MCP Tool Enhancement System.

## Table of Contents

1. [Parameter Examples](#parameter-examples)
2. [Common Workflow Patterns](#common-workflow-patterns)
3. [Integration Examples](#integration-examples)
4. [Advanced Usage Patterns](#advanced-usage-patterns)

## Parameter Examples

### Universal Input Schema Examples

#### Basic Parameter Definitions

```typescript
// String Parameter Example
const keyParameter: ParameterDefinition = {
  name: "key",
  type: "string",
  required: true,
  description: "Redis key name",
  validation: z.string().min(1),
  autoCompletion: {
    suggestions: ["user:123", "cache:data", "session:abc"],
    pattern: /^[a-zA-Z0-9:_-]+$/,
  },
};

// Hash Field Parameter Example
const fieldParameter: ParameterDefinition = {
  name: "field",
  type: "string",
  required: true,
  description: "Hash field name",
  validation: z.string(),
  autoCompletion: {
    suggestions: ["name", "email", "created_at"],
    contextDependent: true,
  },
};

// TTL Parameter Example
const ttlParameter: ParameterDefinition = {
  name: "ttl",
  type: "number",
  required: false,
  description: "Time to live in seconds",
  validation: z.number().positive(),
  defaultValue: 3600,
  autoCompletion: {
    suggestions: [60, 300, 3600, 86400],
    unit: "seconds",
  },
};
```

#### Enhanced Query Context Examples

```typescript
// Beginner Query Context
const beginnerContext: EnhancedQueryContext = {
  intent: {
    primary: "search",
    secondary: ["basic_operation"],
    confidence: 0.9,
  },
  experienceLevel: "beginner",
  complexityPreference: "basic",
  includeExamples: true,
  previousCommands: [],
  sessionGoals: ["learn redis basics"],
};

// Expert Query Context
const expertContext: EnhancedQueryContext = {
  intent: {
    primary: "optimize",
    secondary: ["performance", "scaling"],
    confidence: 0.95,
  },
  experienceLevel: "expert",
  complexityPreference: "advanced",
  includeExamples: false,
  previousCommands: ["PIPELINE", "MULTI"],
  sessionGoals: ["performance optimization"],
};
```

### Tool-Specific Parameter Examples

#### API Explorer Parameters

```typescript
// Command Exploration Parameters
const apiExplorerParams = {
  command: "HSET",
  userLevel: "intermediate",
  includeExamples: true,
  includeMigration: true,
  showPerformance: true,
  relatedCommands: 5,
};

// Category Browsing Parameters
const categoryParams = {
  category: "hashes",
  complexity: "intermediate",
  includeUseCases: true,
  maxResults: 10,
};
```

#### Code Generator Parameters

```typescript
// Pattern Generation Parameters
const patternParams = {
  pattern: "caching",
  subPattern: "cache-aside",
  language: "typescript",
  framework: "express",
  features: ["error-handling", "metrics"],
  includeTests: true,
};

// Production Code Parameters
const productionParams = {
  pattern: "sessions",
  features: ["clustering", "graceful-shutdown", "monitoring", "security"],
  complexity: "production",
  includeDocumentation: true,
};
```

## Common Workflow Patterns

### Pattern 1: Cache-Aside Implementation

```typescript
// Basic Cache-Aside Pattern
const cacheAsideWorkflow = {
  name: "Cache-Aside Pattern",
  steps: [
    {
      action: "Check cache",
      command: "GET",
      parameters: { key: "user:123" },
      fallback: "Query database if miss",
    },
    {
      action: "Update cache",
      command: "SETEX",
      parameters: { key: "user:123", ttl: 3600, value: "userData" },
      condition: "On cache miss",
    },
  ],
  codeExample: `
async function getUser(userId: string) {
  const cacheKey = \`user:\${userId}\`;
  
  // Check cache first
  let user = await redis.get(cacheKey);
  
  if (!user) {
    // Cache miss - query database
    user = await database.getUser(userId);
    
    // Update cache
    await redis.setex(cacheKey, 3600, JSON.stringify(user));
  }
  
  return JSON.parse(user);
}
  `,
};
```

### Pattern 2: Session Management

```typescript
// Session Management Pattern
const sessionPattern = {
  name: "Session Management",
  commands: ["HSET", "HGET", "EXPIRE", "DEL"],
  implementation: `
// Store session data
await redis.hset('session:abc123', {
  userId: '456',
  email: 'user@example.com',
  loginTime: Date.now()
});

// Set session expiration
await redis.expire('session:abc123', 1800);

// Retrieve session
const session = await redis.hgetall('session:abc123');

// Extend session
await redis.expire('session:abc123', 1800);

// Destroy session
await redis.del('session:abc123');
  `,
};
```

### Pattern 3: Real-time Analytics

```typescript
// Analytics Pattern
const analyticsPattern = {
  name: "Real-time Analytics",
  commands: ["INCR", "HINCRBY", "ZADD", "ZRANGE"],
  implementation: `
// Track page views
await redis.incr('pageviews:today');

// Track user actions
await redis.hincrby('user:stats:123', 'logins', 1);

// Leaderboard updates
await redis.zadd('leaderboard', Date.now(), userId);

// Get top users
const topUsers = await redis.zrevrange('leaderboard', 0, 9);
  `,
};
```

### Pattern 4: Message Queues with Streams

```typescript
// Stream-based Queue Pattern
const streamQueuePattern = {
  name: "Stream Message Queue",
  commands: ["XADD", "XREAD", "XGROUP"],
  implementation: `
// Add message to stream
await redis.xadd('tasks', '*', {
  type: 'email',
  recipient: 'user@example.com',
  priority: 'high'
});

// Consumer group setup
await redis.xgroup('CREATE', 'tasks', 'workers', '$', 'MKSTREAM');

// Process messages
const messages = await redis.xreadgroup(
  'GROUP', 'workers', 'worker-1',
  'COUNT', 1,
  'STREAMS', 'tasks', '>'
);
  `,
};
```

## Integration Examples

### Enhanced API Explorer Integration

```typescript
// Complete API exploration workflow
const apiExplorationWorkflow = {
  async exploreCommand(command: string, userLevel: string) {
    // Get command details
    const commandInfo = await apiExplorer.exploreCommand({
      command,
      userLevel,
      includeExamples: true,
      includeMigration: true,
    });

    // Get related commands
    const related = await apiExplorer.getRelatedCommands(command);

    // Get usage examples
    const examples = await apiExplorer.getUsageExamples(command, userLevel);

    return {
      command: commandInfo,
      related,
      examples,
    };
  },
};
```

### Migration Engine Integration

```typescript
// Complete migration workflow
const migrationWorkflow = {
  async migrateFromIoredis(sourceCode: string) {
    // Analyze existing code
    const analysis = await migrationEngine.analyzeCode({
      sourceCode,
      sourceClient: "ioredis",
      targetClient: "glide",
    });

    // Generate migration plan
    const plan = await migrationEngine.generateMigrationPlan(analysis);

    // Apply transformations
    const result = await migrationEngine.applyTransformations(plan);

    return result;
  },
};
```

## Advanced Usage Patterns

### Multi-Pattern Detection

```typescript
// Complex pattern detection workflow
const advancedPatterns = {
  async detectAndOptimize(codebase: string) {
    // Detect multiple patterns
    const patterns = await patternMatcher.detectPatterns(codebase, {
      patterns: ["caching", "sessions", "transactions", "streams"],
      includeOptimizations: true,
    });

    // Generate optimizations
    const optimizations = await optimizationEngine.suggest(patterns);

    // Apply improvements
    const enhanced = await codeGenerator.enhance(codebase, optimizations);

    return enhanced;
  },
};
```

### Conversational Learning Workflow

```typescript
// Complete learning progression
const learningWorkflow = {
  async manageLearningSession(userId: string, query: string) {
    // Initialize or retrieve session
    const session = await sessionManager.getOrCreate(userId);

    // Process query with context
    const response = await conversationalInterface.processQuery({
      query,
      session,
      generateFollowups: true,
    });

    // Update learning progression
    await progressionEngine.updateProgress(session, response);

    // Generate next suggestions
    const suggestions = await suggestionEngine.generateNext(session);

    return {
      response,
      suggestions,
      learningPath: session.learningPath,
    };
  },
};
```

### Production Deployment Pattern

```typescript
// Production-ready implementation
const productionPattern = {
  async setupProduction() {
    // Generate production code
    const code = await codeGenerator.generateProduction({
      pattern: "multi-service",
      features: [
        "clustering",
        "monitoring",
        "graceful-shutdown",
        "error-handling",
        "security",
      ],
    });

    // Setup health monitoring
    const health = await systemTools.setupHealthChecks({
      checkInterval: 30000,
      alertThresholds: {
        memory: 0.8,
        cpu: 0.7,
        connections: 0.9,
      },
    });

    return { code, health };
  },
};
```

## Parameter Validation Examples

### Complex Validation Scenarios

```typescript
// Advanced parameter validation
const validationExamples = {
  // Multiple key validation
  multiKeyValidation: {
    parameters: {
      keys: z.array(z.string().min(1)).min(1).max(100),
      operation: z.enum(["GET", "DEL", "EXISTS"]),
    },
    example: {
      keys: ["user:123", "session:abc", "cache:data"],
      operation: "GET",
    },
  },

  // Range validation
  rangeValidation: {
    parameters: {
      start: z.number().int(),
      stop: z.number().int(),
      key: z.string(),
    },
    validation: (data) => data.start <= data.stop,
    example: {
      start: 0,
      stop: 10,
      key: "leaderboard",
    },
  },

  // Conditional validation
  conditionalValidation: {
    parameters: {
      command: z.string(),
      ttl: z.number().optional(),
      persistent: z.boolean().optional(),
    },
    validation: (data) => !(data.ttl && data.persistent),
    example: {
      command: "SET",
      ttl: 3600,
      persistent: false,
    },
  },
};
```

## Best Practices Summary

### Parameter Design Principles

1. **Type Safety**: Use Zod schemas for runtime validation
2. **Auto-completion**: Provide contextual suggestions
3. **Documentation**: Include clear descriptions and examples
4. **Validation**: Implement comprehensive validation rules
5. **Defaults**: Provide sensible default values

### Workflow Pattern Guidelines

1. **Modularity**: Design reusable pattern components
2. **Error Handling**: Include comprehensive error scenarios
3. **Performance**: Consider optimization opportunities
4. **Scalability**: Design for production environments
5. **Testing**: Include validation and testing strategies

### Integration Best Practices

1. **Consistency**: Maintain consistent parameter naming
2. **Compatibility**: Ensure cross-tool compatibility
3. **Documentation**: Provide clear integration examples
4. **Monitoring**: Include performance monitoring
5. **Maintenance**: Design for easy updates and extensions

This documentation provides comprehensive examples and patterns for effectively utilizing the Universal MCP Tool Enhancement System across all user experience levels and use cases.
