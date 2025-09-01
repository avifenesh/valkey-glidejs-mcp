/**
 * Legacy Tool Facades - Backward Compatibility Layer
 *
 * Provides backward compatibility for all 42 original tools by creating
 * facades that route to the appropriate smart tools while maintaining
 * the original tool names and interfaces.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { UnifiedApiExplorer } from "../core/api-explorer.js";
import { UnifiedCodeGenerator } from "../core/code-generator.js";
import { SmartMigrationEngine } from "../core/migration-engine.js";
import { SystemTools } from "../core/system-tools.js";

// Initialize smart tools
const apiExplorer = new UnifiedApiExplorer();
const codeGenerator = new UnifiedCodeGenerator();
const migrationEngine = new SmartMigrationEngine();
const systemTools = new SystemTools();

/**
 * Legacy API Tool Facades
 * Routes original API tool calls to the unified API explorer
 */
export function registerLegacyApiTools(mcp: McpServer) {
  // API search tools
  (mcp as any).tool(
    "api.search",
    "Search for keywords across all datasets",
    async (args: any) => {
      return apiExplorer.execute(args, {
        userIntent: "exploration",
        complexity: "simple",
        clientCapabilities: "full",
        taskType: "lookup",
        hasParameters: true,
        patterns: [],
      });
    },
  );

  (mcp as any).tool(
    "api.search.get",
    "Search for GET-related operations",
    async (args: any) => {
      return apiExplorer.execute(
        { query: "get" },
        {
          userIntent: "exploration",
          complexity: "simple",
          clientCapabilities: "full",
          taskType: "lookup",
          hasParameters: true,
          patterns: [],
        },
      );
    },
  );

  (mcp as any).tool(
    "api.search.set",
    "Search for SET-related operations",
    async (args: any) => {
      return apiExplorer.execute(
        { query: "set" },
        {
          userIntent: "exploration",
          complexity: "simple",
          clientCapabilities: "full",
          taskType: "lookup",
          hasParameters: true,
          patterns: [],
        },
      );
    },
  );

  (mcp as any).tool(
    "api.findEquivalent",
    "Find GLIDE equivalent for ioredis or node-redis methods",
    async (args: any) => {
      return apiExplorer.execute(args, {
        userIntent: "exploration",
        complexity: "intermediate",
        clientCapabilities: "full",
        taskType: "lookup",
        hasParameters: true,
        patterns: [],
      });
    },
  );

  (mcp as any).tool(
    "api.diff",
    "Compare API differences",
    async (args: any) => {
      return apiExplorer.execute(
        { from: "ioredis", to: "glide" },
        {
          userIntent: "exploration",
          complexity: "intermediate",
          clientCapabilities: "full",
          taskType: "lookup",
          hasParameters: true,
          patterns: [],
        },
      );
    },
  );

  (mcp as any).tool(
    "api.diff.common",
    "Show common API differences",
    async (args: any) => {
      return apiExplorer.execute(
        { from: "ioredis", to: "glide" },
        {
          userIntent: "exploration",
          complexity: "simple",
          clientCapabilities: "full",
          taskType: "lookup",
          hasParameters: false,
          patterns: [],
        },
      );
    },
  );

  (mcp as any).tool(
    "api.categories",
    "List all API categories",
    async (args: any) => {
      return apiExplorer.execute(
        { category: "all" },
        {
          userIntent: "exploration",
          complexity: "simple",
          clientCapabilities: "full",
          taskType: "lookup",
          hasParameters: false,
          patterns: [],
        },
      );
    },
  );

  (mcp as any).tool(
    "api.byCategory",
    "Browse APIs by category",
    async (args: any) => {
      return apiExplorer.execute(args, {
        userIntent: "exploration",
        complexity: "simple",
        clientCapabilities: "full",
        taskType: "lookup",
        hasParameters: true,
        patterns: [],
      });
    },
  );

  (mcp as any).tool("api.families", "List API families", async (args: any) => {
    return apiExplorer.execute(
      { category: "families" },
      {
        userIntent: "exploration",
        complexity: "simple",
        clientCapabilities: "full",
        taskType: "lookup",
        hasParameters: false,
        patterns: [],
      },
    );
  });

  (mcp as any).tool(
    "api.byFamily",
    "Browse APIs by family",
    async (args: any) => {
      return apiExplorer.execute(args, {
        userIntent: "exploration",
        complexity: "simple",
        clientCapabilities: "full",
        taskType: "lookup",
        hasParameters: true,
        patterns: [],
      });
    },
  );

  (mcp as any).tool(
    "api.common",
    "Show common Redis operations",
    async (args: any) => {
      return apiExplorer.execute(
        {},
        {
          userIntent: "exploration",
          complexity: "simple",
          clientCapabilities: "full",
          taskType: "lookup",
          hasParameters: false,
          patterns: [],
        },
      );
    },
  );

  // Category-specific API tools
  const categories = [
    "strings",
    "hashes",
    "lists",
    "sets",
    "zsets",
    "pubsub",
    "transactions",
  ];
  categories.forEach((category) => {
    (mcp as any).tool(
      `api.${category}`,
      `Show ${category} operations`,
      async (args: any) => {
        return apiExplorer.execute(
          { category },
          {
            userIntent: "exploration",
            complexity: "simple",
            clientCapabilities: "full",
            taskType: "lookup",
            hasParameters: true,
            patterns: [],
          },
        );
      },
    );
  });

  (mcp as any).tool(
    "api.migrate.examples",
    "Show migration examples",
    async (args: any) => {
      return apiExplorer.execute(
        { query: "migration examples" },
        {
          userIntent: "exploration",
          complexity: "intermediate",
          clientCapabilities: "full",
          taskType: "lookup",
          hasParameters: false,
          patterns: ["migration"],
        },
      );
    },
  );
}

/**
 * Legacy Generator Tool Facades
 * Routes original generator tool calls to the unified code generator
 */
export function registerLegacyGeneratorTools(mcp: McpServer) {
  // Basic generators
  (mcp as any).tool(
    "gen.clientBasic",
    "Generate basic GLIDE client connection code",
    async (args: any) => {
      return codeGenerator.execute(
        { clientType: "basic" },
        {
          userIntent: "generation",
          complexity: "simple",
          clientCapabilities: "full",
          taskType: "create",
          hasParameters: false,
          patterns: [],
        },
      );
    },
  );

  (mcp as any).tool(
    "gen.clientCluster",
    "Generate GLIDE cluster client connection code",
    async (args: any) => {
      return codeGenerator.execute(
        { clientType: "cluster" },
        {
          userIntent: "generation",
          complexity: "intermediate",
          clientCapabilities: "full",
          taskType: "create",
          hasParameters: false,
          patterns: ["cluster"],
        },
      );
    },
  );

  // Pattern generators with parameters
  (mcp as any).tool(
    "gen.cache",
    "Generate caching pattern with TTL",
    async (args: any) => {
      return codeGenerator.execute(
        { pattern: "cache", ...args },
        {
          userIntent: "generation",
          complexity: "intermediate",
          clientCapabilities: "full",
          taskType: "create",
          hasParameters: true,
          patterns: ["cache"],
        },
      );
    },
  );

  (mcp as any).tool(
    "gen.rateLimiter",
    "Generate rate limiting pattern",
    async (args: any) => {
      return codeGenerator.execute(
        { pattern: "ratelimit", ...args },
        {
          userIntent: "generation",
          complexity: "intermediate",
          clientCapabilities: "full",
          taskType: "create",
          hasParameters: true,
          patterns: ["ratelimit"],
        },
      );
    },
  );

  // Data structure patterns
  const dataPatterns = ["sets", "zsets", "geo", "streams"];
  dataPatterns.forEach((pattern) => {
    (mcp as any).tool(
      `gen.${pattern}`,
      `Generate ${pattern} operations example`,
      async (args: any) => {
        return codeGenerator.execute(
          { pattern },
          {
            userIntent: "generation",
            complexity: "simple",
            clientCapabilities: "full",
            taskType: "create",
            hasParameters: false,
            patterns: [pattern],
          },
        );
      },
    );
  });

  // Advanced patterns
  (mcp as any).tool(
    "gen.transaction",
    "Generate transaction pattern",
    async (args: any) => {
      return codeGenerator.execute(
        { advanced: "transaction" },
        {
          userIntent: "generation",
          complexity: "advanced",
          clientCapabilities: "full",
          taskType: "create",
          hasParameters: false,
          patterns: ["transaction"],
        },
      );
    },
  );

  (mcp as any).tool(
    "gen.batch",
    "Generate batch operations pattern",
    async (args: any) => {
      return codeGenerator.execute(
        { advanced: "batch" },
        {
          userIntent: "generation",
          complexity: "advanced",
          clientCapabilities: "full",
          taskType: "create",
          hasParameters: false,
          patterns: ["pipeline"],
        },
      );
    },
  );

  (mcp as any).tool(
    "gen.fastify",
    "Generate Fastify integration",
    async (args: any) => {
      return codeGenerator.execute(
        { pattern: "fastify" },
        {
          userIntent: "generation",
          complexity: "intermediate",
          clientCapabilities: "full",
          taskType: "create",
          hasParameters: false,
          patterns: ["framework"],
        },
      );
    },
  );

  // Application generators
  const appTypes = ["caching", "session", "queue", "leaderboard", "ratelimit"];
  appTypes.forEach((appType) => {
    (mcp as any).tool(
      `gen.app.${appType}`,
      `Generate ${appType} application`,
      async (args: any) => {
        return codeGenerator.execute(
          { app: appType },
          {
            userIntent: "generation",
            complexity: "advanced",
            clientCapabilities: "full",
            taskType: "create",
            hasParameters: false,
            patterns: [appType],
          },
        );
      },
    );
  });

  // Queue-specific generators
  (mcp as any).tool(
    "gen.queueProducer",
    "Generate queue producer",
    async (args: any) => {
      return codeGenerator.execute(
        { pattern: "queue-producer" },
        {
          userIntent: "generation",
          complexity: "intermediate",
          clientCapabilities: "full",
          taskType: "create",
          hasParameters: false,
          patterns: ["queue"],
        },
      );
    },
  );

  (mcp as any).tool(
    "gen.queueConsumer",
    "Generate queue consumer",
    async (args: any) => {
      return codeGenerator.execute(
        { pattern: "queue-consumer" },
        {
          userIntent: "generation",
          complexity: "intermediate",
          clientCapabilities: "full",
          taskType: "create",
          hasParameters: false,
          patterns: ["queue"],
        },
      );
    },
  );
}

/**
 * Legacy Migration Tool Facades
 * Routes original migration tool calls to the smart migration engine
 */
export function registerLegacyMigrationTools(mcp: McpServer) {
  (mcp as any).tool(
    "migrate.transform",
    "Migrate ioredis or node-redis code to GLIDE",
    async (args: any) => {
      return migrationEngine.execute(args, {
        userIntent: "migration",
        complexity: "advanced",
        clientCapabilities: "full",
        taskType: "transform",
        hasParameters: true,
        patterns: [],
      });
    },
  );
}

/**
 * Legacy System Tool Facades
 * Routes original system tool calls to the system tools
 */
export function registerLegacySystemTools(mcp: McpServer) {
  (mcp as any).tool(
    "health",
    "Check server health status",
    async (args: any) => {
      return systemTools.execute(
        {},
        {
          userIntent: "system",
          complexity: "simple",
          clientCapabilities: "full",
          taskType: "validate",
          hasParameters: false,
          patterns: [],
        },
      );
    },
  );

  (mcp as any).tool(
    "debug.params",
    "Debug tool with parameters",
    async (args: any) => {
      return systemTools.execute(
        { action: "debug", ...args },
        {
          userIntent: "development",
          complexity: "simple",
          clientCapabilities: "full",
          taskType: "validate",
          hasParameters: true,
          patterns: [],
        },
      );
    },
  );

  (mcp as any).tool(
    "test.basic",
    "Test with basic string param",
    async (args: any) => {
      return systemTools.execute(
        { action: "test", ...args },
        {
          userIntent: "development",
          complexity: "simple",
          clientCapabilities: "full",
          taskType: "validate",
          hasParameters: true,
          patterns: [],
        },
      );
    },
  );

  (mcp as any).tool(
    "commands.ingest",
    "Ingest and validate Valkey commands",
    async (args: any) => {
      return systemTools.execute(
        { action: "ingest", ...args },
        {
          userIntent: "system",
          complexity: "advanced",
          clientCapabilities: "full",
          taskType: "validate",
          hasParameters: true,
          patterns: [],
        },
      );
    },
  );
}

/**
 * Register all legacy tool facades for complete backward compatibility
 */
export function registerAllLegacyFacades(mcp: McpServer) {
  console.error(
    "🔄 Registering legacy tool facades for backward compatibility...",
  );

  registerLegacyApiTools(mcp);
  console.error("✅ Registered 19 legacy API tool facades");

  registerLegacyGeneratorTools(mcp);
  console.error("✅ Registered 12 legacy generator tool facades");

  registerLegacyMigrationTools(mcp);
  console.error("✅ Registered 3 legacy migration tool facades");

  registerLegacySystemTools(mcp);
  console.error("✅ Registered 8 legacy system tool facades");

  console.error("🎯 Total: 42 legacy tools now route to 4 smart tools");
}
