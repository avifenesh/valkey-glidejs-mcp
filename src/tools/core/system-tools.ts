/**
 * System Tools - Consolidates health, validation, documentation, and system utilities
 * Replaces: health.ts, validate.ts, verify.ts, docs.ts, debug.ts, test-basic.ts
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolRoutingContext } from "../routing/context-analyzer.js";
import { SmartTool } from "../routing/tool-router.js";

export class SystemTools implements SmartTool {
  name = "system-tools";
  capabilities = ["health", "validate", "verify", "docs", "debug", "test"];
  complexity = 2;

  supports(context: ToolRoutingContext): boolean {
    return (
      context.userIntent === "system" || context.userIntent === "development"
    );
  }

  async execute(args: any, context: ToolRoutingContext): Promise<any> {
    const action = this.determineAction(args, context);

    switch (action) {
      case "health":
        return this.checkHealth(args, context);
      case "validate":
        return this.validateCode(args, context);
      case "verify":
        return this.verifyMigration(args, context);
      case "docs":
        return this.showDocumentation(args, context);
      case "debug":
        return this.debugTool(args, context);
      case "test":
        return this.runTest(args, context);
      default:
        return this.showSystemOptions(args, context);
    }
  }

  private determineAction(args: any, context: ToolRoutingContext): string {
    if (args.action) return args.action;
    if (args.code && args.validate) return "validate";
    if (args.code && args.verify) return "verify";
    if (args.topic || args.docs) return "docs";
    if (args.testParam || args.debug) return "debug";
    if (args.name || args.test) return "test";
    if (!args || Object.keys(args).length === 0) return "health";
    return "health";
  }

  private async checkHealth(args: any, context: ToolRoutingContext) {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    return {
      content: [
        { type: "text", text: "✅ MCP Server Health Check" },
        { type: "text", text: `Status: OK` },
        { type: "text", text: `Timestamp: ${timestamp}` },
        { type: "text", text: `Uptime: ${Math.floor(uptime)}s` },
        { type: "text", text: `Node Version: ${process.version}` },
        {
          type: "text",
          text: `Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        },
      ],
      structuredContent: {
        status: "ok",
        timestamp,
        uptime: Math.floor(uptime),
        nodeVersion: process.version,
        memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      },
    };
  }

  private async validateCode(args: any, context: ToolRoutingContext) {
    if (!args.code) {
      return {
        content: [
          { type: "text", text: "❌ Error: Missing required parameter 'code'" },
        ],
      };
    }

    const code = args.code;
    const validation = this.performStaticValidation(code);

    return {
      content: [
        { type: "text", text: "🔍 Code Validation Results" },
        { type: "text", text: `Errors: ${validation.errors.length}` },
        { type: "text", text: `Warnings: ${validation.warnings.length}` },
        { type: "text", text: `Issues: ${validation.issues.length}` },
        ...(validation.errors.length > 0
          ? [
              {
                type: "text",
                text: `\n❌ Errors:\n${validation.errors.map((e) => `  • ${e}`).join("\n")}`,
              },
            ]
          : []),
        ...(validation.warnings.length > 0
          ? [
              {
                type: "text",
                text: `\n⚠️ Warnings:\n${validation.warnings.map((w) => `  • ${w}`).join("\n")}`,
              },
            ]
          : []),
        ...(validation.issues.length > 0
          ? [
              {
                type: "text",
                text: `\n📝 Issues:\n${validation.issues.map((i) => `  • ${i}`).join("\n")}`,
              },
            ]
          : []),
      ],
    };
  }

  private async verifyMigration(args: any, context: ToolRoutingContext) {
    if (!args.code) {
      return {
        content: [
          { type: "text", text: "❌ Error: Missing required parameter 'code'" },
        ],
      };
    }

    const code = args.code;
    const verification = this.performMigrationVerification(code);

    return {
      content: [
        { type: "text", text: "🔍 Migration Verification Results" },
        {
          type: "text",
          text: `Status: ${verification.isValid ? "✅ VALID" : "❌ INVALID"}`,
        },
        { type: "text", text: `Score: ${verification.score}/100` },
        ...(verification.issues.length > 0
          ? [
              {
                type: "text",
                text: `\n🔧 Issues Found:\n${verification.issues.map((i) => `  • ${i}`).join("\n")}`,
              },
            ]
          : []),
        ...(verification.suggestions.length > 0
          ? [
              {
                type: "text",
                text: `\n💡 Suggestions:\n${verification.suggestions.map((s) => `  • ${s}`).join("\n")}`,
              },
            ]
          : []),
      ],
    };
  }

  private async showDocumentation(args: any, context: ToolRoutingContext) {
    const topic = args.topic || args.docs || "overview";

    const docs = this.getDocumentation(topic);

    return {
      content: [
        { type: "text", text: `📚 Documentation: ${topic}` },
        { type: "text", text: docs.content },
        {
          type: "text",
          text: `\n🔗 Related Topics: ${docs.related.join(", ")}`,
        },
      ],
    };
  }

  private async debugTool(args: any, context: ToolRoutingContext) {
    if (!args.testParam) {
      return {
        content: [
          {
            type: "text",
            text: "❌ Error: Missing required parameter 'testParam'",
          },
        ],
      };
    }

    const { testParam, optionalNum } = args;

    return {
      content: [
        { type: "text", text: "🐛 Debug Tool Results" },
        {
          type: "text",
          text: `testParam: "${testParam}" (${typeof testParam})`,
        },
        {
          type: "text",
          text: `optionalNum: ${optionalNum || "undefined"} (${typeof optionalNum})`,
        },
        {
          type: "text",
          text: `Args received: ${JSON.stringify(args, null, 2)}`,
        },
        { type: "text", text: `Context: ${JSON.stringify(context, null, 2)}` },
      ],
    };
  }

  private async runTest(args: any, context: ToolRoutingContext) {
    if (!args.name) {
      return {
        content: [
          { type: "text", text: "❌ Error: Missing required parameter 'name'" },
        ],
      };
    }

    const name = args.name;

    return {
      content: [
        { type: "text", text: `🧪 Test Results for: ${name}` },
        { type: "text", text: `Hello ${name}!` },
        {
          type: "text",
          text: `Test completed successfully at ${new Date().toISOString()}`,
        },
      ],
    };
  }

  private async showSystemOptions(args: any, context: ToolRoutingContext) {
    return {
      content: [
        { type: "text", text: "🛠️ System Tools - Available Actions:" },
        { type: "text", text: "• Health Check: No parameters needed" },
        { type: "text", text: "• Code Validation: Provide 'code' parameter" },
        {
          type: "text",
          text: "• Migration Verification: Provide 'code' parameter with 'verify: true'",
        },
        { type: "text", text: "• Documentation: Provide 'topic' parameter" },
        { type: "text", text: "• Debug Tool: Provide 'testParam' parameter" },
        { type: "text", text: "• Test Runner: Provide 'name' parameter" },
        {
          type: "text",
          text: "\nOr specify 'action' parameter: 'health' | 'validate' | 'verify' | 'docs' | 'debug' | 'test'",
        },
      ],
    };
  }

  private performStaticValidation(code: string): {
    errors: string[];
    warnings: string[];
    issues: string[];
  } {
    const result = { errors: [], warnings: [], issues: [] } as {
      errors: string[];
      warnings: string[];
      issues: string[];
    };

    // Check for GLIDE imports
    if (!code.includes("@valkey/valkey-glide")) {
      result.warnings.push("Code does not import '@valkey/valkey-glide'");
    }

    // Check for legacy imports
    if (/import.*from\s+['"]ioredis['"]/.test(code)) {
      result.issues.push(
        "Found ioredis import - should be migrated to @valkey/valkey-glide",
      );
    }

    if (/import.*from\s+['"]redis['"]/.test(code)) {
      result.issues.push(
        "Found node-redis import - should be migrated to @valkey/valkey-glide",
      );
    }

    // Check for legacy constructors
    if (/new\s+Redis\s*\(/.test(code)) {
      result.errors.push(
        "Found ioredis constructor (new Redis). Use GlideClient.createClient() instead",
      );
    }

    if (/createClient\s*\(\s*\)/.test(code) && code.includes("redis")) {
      result.warnings.push(
        "Found createClient() - ensure it's GLIDE's createClient method",
      );
    }

    // Check for deprecated methods
    if (/\.setex\s*\(/.test(code)) {
      result.warnings.push(
        "setex() method found - consider using set() with expiry options",
      );
    }

    // Check for proper async/await usage
    if (code.includes("GlideClient.createClient") && !code.includes("await")) {
      result.errors.push("GlideClient.createClient() must be awaited");
    }

    return result;
  }

  private performMigrationVerification(code: string): {
    isValid: boolean;
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check for proper GLIDE imports
    if (!code.includes("@valkey/valkey-glide")) {
      issues.push("Missing GLIDE import");
      score -= 30;
      suggestions.push(
        "Add: import { GlideClient } from '@valkey/valkey-glide'",
      );
    }

    // Check for legacy code remnants
    if (code.includes("ioredis") || code.includes("redis")) {
      issues.push("Legacy client references found");
      score -= 20;
      suggestions.push("Remove all references to legacy Redis clients");
    }

    // Check for proper client creation
    if (
      !code.includes("GlideClient.createClient") &&
      !code.includes("GlideClusterClient.createClient")
    ) {
      issues.push("No GLIDE client creation found");
      score -= 25;
      suggestions.push(
        "Use GlideClient.createClient() or GlideClusterClient.createClient()",
      );
    }

    // Check for proper async/await patterns
    if (code.includes("createClient") && !code.includes("await")) {
      issues.push("Client creation not properly awaited");
      score -= 15;
      suggestions.push("Add 'await' before client creation");
    }

    // Check for proper connection cleanup
    if (!code.includes(".close()")) {
      issues.push("No connection cleanup found");
      score -= 10;
      suggestions.push("Add client.close() to properly cleanup connections");
    }

    const isValid = score >= 70; // 70% threshold for valid migration

    return { isValid, score, issues, suggestions };
  }

  private getDocumentation(topic: string): {
    content: string;
    related: string[];
  } {
    const docs: Record<string, { content: string; related: string[] }> = {
      overview: {
        content: `Valkey GLIDE MCP Server provides intelligent tools for:
• API exploration and migration assistance
• Code generation for common patterns
• Migration from ioredis/node-redis to GLIDE
• Validation and verification tools

Key Features:
- Smart routing based on context
- Unified tool interface
- Comprehensive migration support
- Pattern-based code generation`,
        related: ["migration", "generation", "api-exploration"],
      },
      migration: {
        content: `Migration from Legacy Redis Clients:

1. ioredis Migration:
   - Replace 'new Redis()' with 'await GlideClient.createClient()'
   - Update command syntax for arrays (del, exists)
   - Convert pipeline() to Batch(false)
   - Convert multi() to Batch(true)

2. node-redis Migration:
   - Replace createClient() with GlideClient.createClient()
   - Remove .connect() calls (GLIDE connects automatically)
   - Update setEx() to set() with expiry options

3. Common Changes:
   - All client creation must be awaited
   - Array parameters for multi-key operations
   - Different syntax for expiry options`,
        related: ["validation", "patterns", "examples"],
      },
      generation: {
        content: `Code Generation Patterns:

1. Client Patterns:
   - Basic client connection
   - Cluster client connection
   - Connection with authentication

2. Data Patterns:
   - Caching with TTL
   - Distributed locks
   - Rate limiting
   - Set operations
   - Sorted set operations
   - Geospatial operations

3. Application Patterns:
   - Complete caching service
   - Session management
   - Queue system
   - Real-time messaging

4. Advanced Patterns:
   - Atomic transactions
   - Batch operations
   - Stream processing
   - Lua script execution`,
        related: ["patterns", "examples", "migration"],
      },
      "api-exploration": {
        content: `API Exploration Tools:

1. Search Operations:
   - Search across all GLIDE methods
   - Find equivalent operations
   - Browse by category/family

2. Comparison Tools:
   - Compare ioredis vs GLIDE
   - Compare node-redis vs GLIDE
   - Show common operation differences

3. Discovery Features:
   - Browse commands by category
   - View method signatures
   - See usage examples

Use the 'api' tool with parameters:
- query: Search for methods
- source + symbol: Find equivalents
- category: Browse by category`,
        related: ["migration", "examples", "patterns"],
      },
      validation: {
        content: `Code Validation and Verification:

1. Static Validation:
   - Check for proper imports
   - Detect legacy code patterns
   - Verify async/await usage
   - Identify deprecated methods

2. Migration Verification:
   - Score migration completeness
   - Identify remaining issues
   - Provide improvement suggestions
   - Validate GLIDE best practices

3. Best Practices:
   - Proper error handling
   - Connection management
   - Resource cleanup
   - Performance considerations

Use 'system' tool with:
- code + validate: Run validation
- code + verify: Verify migration`,
        related: ["migration", "best-practices"],
      },
    };

    return (
      docs[topic] || {
        content: `Documentation topic '${topic}' not found. Available topics: ${Object.keys(docs).join(", ")}`,
        related: Object.keys(docs),
      }
    );
  }
}

/**
 * Register the system tools with the MCP server
 */
export function registerSystemTools(mcp: McpServer) {
  const tools = new SystemTools();

  (mcp as any).tool(
    "system",
    "System tools for health, validation, documentation, and debugging",
    async (args: any) => {
      const context = {
        userIntent: "system" as const,
        complexity: "simple" as const,
        clientCapabilities: "full" as const,
        taskType: "validate" as const,
        hasParameters: args && Object.keys(args).length > 0,
        patterns: [],
      };

      return tools.execute(args, context);
    },
  );
}
