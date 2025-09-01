/**
 * Smart Migration Engine - Consolidates migration functionality
 * Replaces: migrate.ts and related migration tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolRoutingContext } from "../routing/context-analyzer.js";
import { SmartTool } from "../routing/tool-router.js";

export class SmartMigrationEngine implements SmartTool {
  name = "migration-engine";
  capabilities = ["migrate", "transform", "convert", "analyze"];
  complexity = 5;

  supports(context: ToolRoutingContext): boolean {
    return (
      context.userIntent === "migration" || context.taskType === "transform"
    );
  }

  async execute(args: any, context: ToolRoutingContext): Promise<any> {
    if (!args || !args.code || !args.from) {
      return {
        content: [
          {
            type: "text",
            text: "❌ Error: Missing required parameters 'code' and 'from'",
          },
          {
            type: "text",
            text: "Usage: { code: 'your-code', from: 'ioredis' | 'node-redis' }",
          },
        ],
      };
    }

    const { code, from } = args;

    if (from !== "ioredis" && from !== "node-redis") {
      return {
        content: [
          {
            type: "text",
            text: "❌ Error: 'from' must be 'ioredis' or 'node-redis'",
          },
        ],
      };
    }

    // Analyze the code complexity
    const complexity = this.assessCodeComplexity(code);
    const patterns = this.detectMigrationPatterns(code);

    // Choose migration strategy based on complexity
    let transformedCode: string;
    let warnings: string[] = [];
    let notes: string[] = [];

    if (complexity === "simple" && patterns.length === 0) {
      transformedCode = this.naiveMigration(code, from);
    } else if (patterns.includes("cluster")) {
      const result = this.clusterMigration(code, from);
      transformedCode = result.code;
      warnings = result.warnings;
      notes = result.notes;
    } else if (
      patterns.includes("pipeline") ||
      patterns.includes("transaction")
    ) {
      const result = this.transactionMigration(code, from);
      transformedCode = result.code;
      warnings = result.warnings;
      notes = result.notes;
    } else {
      const result = this.advancedMigration(code, from, patterns);
      transformedCode = result.code;
      warnings = result.warnings;
      notes = result.notes;
    }

    // Prepare response
    const response = [
      { type: "text", text: `✅ Migration from ${from} to GLIDE completed!` },
      {
        type: "text",
        text: `Detected patterns: ${patterns.join(", ") || "basic operations"}`,
      },
      { type: "text", text: `Complexity: ${complexity}` },
    ];

    if (warnings.length > 0) {
      response.push({
        type: "text",
        text: `⚠️ Warnings:\n${warnings.map((w) => `  • ${w}`).join("\n")}`,
      });
    }

    if (notes.length > 0) {
      response.push({
        type: "text",
        text: `📝 Notes:\n${notes.map((n) => `  • ${n}`).join("\n")}`,
      });
    }

    response.push({ type: "text", text: "🔄 Transformed code:" });
    response.push({ type: "text", text: transformedCode });

    return { content: response };
  }

  private assessCodeComplexity(
    code: string,
  ): "simple" | "intermediate" | "advanced" {
    const advancedPatterns = [
      "cluster",
      "pipeline",
      "multi",
      "exec",
      "watch",
      "eval",
      "evalsha",
    ];
    const intermediatePatterns = [
      "transaction",
      "batch",
      "pub",
      "sub",
      "stream",
    ];

    const hasAdvanced = advancedPatterns.some((pattern) =>
      code.toLowerCase().includes(pattern),
    );

    const hasIntermediate = intermediatePatterns.some((pattern) =>
      code.toLowerCase().includes(pattern),
    );

    if (hasAdvanced) return "advanced";
    if (hasIntermediate) return "intermediate";
    return "simple";
  }

  private detectMigrationPatterns(code: string): string[] {
    const patterns: string[] = [];
    const lowerCode = code.toLowerCase();

    // Connection patterns
    if (lowerCode.includes("cluster")) patterns.push("cluster");
    if (lowerCode.includes("sentinel")) patterns.push("sentinel");

    // Operation patterns
    if (lowerCode.includes("pipeline")) patterns.push("pipeline");
    if (lowerCode.includes("multi") || lowerCode.includes("exec"))
      patterns.push("transaction");
    if (lowerCode.includes("eval") || lowerCode.includes("evalsha"))
      patterns.push("lua");
    if (lowerCode.includes("pub") || lowerCode.includes("sub"))
      patterns.push("pubsub");
    if (lowerCode.includes("stream") || lowerCode.includes("xadd"))
      patterns.push("streams");
    if (lowerCode.includes("scan") || lowerCode.includes("sscan"))
      patterns.push("scan");

    // Advanced features
    if (lowerCode.includes("watch") || lowerCode.includes("unwatch"))
      patterns.push("optimistic-locking");
    if (lowerCode.includes("blocking") || lowerCode.includes("blpop"))
      patterns.push("blocking");

    return patterns;
  }

  private naiveMigration(code: string, from: string): string {
    let transformed = code;

    if (from === "ioredis") {
      transformed = this.applyIoredisTransformations(transformed);
    } else if (from === "node-redis") {
      transformed = this.applyNodeRedisTransformations(transformed);
    }

    return transformed;
  }

  private clusterMigration(
    code: string,
    from: string,
  ): { code: string; warnings: string[]; notes: string[] } {
    let transformed = code;
    const warnings: string[] = [];
    const notes: string[] = [];

    if (from === "ioredis") {
      // Replace Redis.Cluster with GlideClusterClient
      transformed = transformed.replace(
        /new\s+Redis\.Cluster\s*\(\s*\[([^\]]+)\]\s*\)/g,
        (match, nodes) => {
          notes.push("Converted Redis.Cluster to GlideClusterClient");
          return `await GlideClusterClient.createClient({\n  addresses: ${nodes}\n})`;
        },
      );

      // Replace import
      transformed = transformed.replace(
        /import\s+Redis\s+from\s+['"]ioredis['"];?/g,
        "import { GlideClusterClient } from '@valkey/valkey-glide';",
      );

      warnings.push(
        "Cluster failover behavior may differ between ioredis and GLIDE",
      );
      notes.push(
        "Review cluster connection configuration for GLIDE-specific options",
      );
    }

    // Apply common transformations
    transformed = this.applyCommonTransformations(transformed);

    return { code: transformed, warnings, notes };
  }

  private transactionMigration(
    code: string,
    from: string,
  ): { code: string; warnings: string[]; notes: string[] } {
    let transformed = code;
    const warnings: string[] = [];
    const notes: string[] = [];

    // Handle pipeline/multi transformations
    if (code.includes("pipeline")) {
      transformed = transformed.replace(
        /\.pipeline\s*\(\s*\)/g,
        "new Batch(false)",
      );
      notes.push(
        "Converted pipeline() to Batch(false) - non-atomic operations",
      );
    }

    if (code.includes("multi")) {
      transformed = transformed.replace(
        /\.multi\s*\(\s*\)/g,
        "new Batch(true)",
      );
      notes.push("Converted multi() to Batch(true) - atomic operations");
    }

    if (code.includes("exec")) {
      transformed = transformed.replace(/\.exec\s*\(\s*\)/g, ".exec(batch)");
      warnings.push(
        "Ensure 'batch' variable is properly defined before exec()",
      );
    }

    // Add Batch import
    if (transformed.includes("Batch")) {
      transformed = transformed.replace(
        /(import\s+\{[^}]*)(}\s+from\s+['"]@valkey\/valkey-glide['"];?)/g,
        "$1, Batch$2",
      );
    }

    // Apply common transformations
    transformed = this.applyCommonTransformations(transformed);

    return { code: transformed, warnings, notes };
  }

  private advancedMigration(
    code: string,
    from: string,
    patterns: string[],
  ): { code: string; warnings: string[]; notes: string[] } {
    let transformed = code;
    const warnings: string[] = [];
    const notes: string[] = [];

    // Handle Lua scripts
    if (patterns.includes("lua")) {
      transformed = transformed.replace(
        /\.eval\s*\(\s*(['"`])(.*?)\1\s*,\s*([^,]+)\s*,\s*([^)]+)\)/gs,
        (match, quote, script, numKeys, args) => {
          notes.push("Converted eval() to Script object pattern");
          return `new Script(${quote}${script}${quote}).execute(client, { keys: ${args.split(",").slice(0, parseInt(numKeys))}, args: ${args.split(",").slice(parseInt(numKeys))} })`;
        },
      );

      // Add Script import
      if (transformed.includes("Script")) {
        transformed = transformed.replace(
          /(import\s+\{[^}]*)(}\s+from\s+['"]@valkey\/valkey-glide['"];?)/g,
          "$1, Script$2",
        );
      }

      warnings.push(
        "Lua script execution syntax has changed - review Script object usage",
      );
    }

    // Handle pub/sub
    if (patterns.includes("pubsub")) {
      warnings.push(
        "Pub/Sub implementation differs significantly in GLIDE - manual migration required",
      );
      notes.push(
        "Consider using GLIDE's PubSub classes for publish/subscribe operations",
      );
    }

    // Handle streams
    if (patterns.includes("streams")) {
      notes.push(
        "Stream operations syntax is similar but review GLIDE-specific parameters",
      );
    }

    // Handle blocking operations
    if (patterns.includes("blocking")) {
      warnings.push(
        "Blocking operations may have different timeout behavior in GLIDE",
      );
    }

    // Apply specific transformations based on source
    if (from === "ioredis") {
      transformed = this.applyIoredisTransformations(transformed);
    } else if (from === "node-redis") {
      transformed = this.applyNodeRedisTransformations(transformed);
    }

    return { code: transformed, warnings, notes };
  }

  private applyIoredisTransformations(code: string): string {
    let transformed = code;

    // Basic import replacement
    transformed = transformed.replace(
      /import\s+Redis\s+from\s+['"]ioredis['"];?/g,
      "import { GlideClient, GlideClusterClient } from '@valkey/valkey-glide';",
    );

    // Connection patterns
    transformed = transformed.replace(
      /new\s+Redis\s*\(\s*\)/g,
      "await GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })",
    );

    transformed = transformed.replace(
      /new\s+Redis\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      (match, url) => {
        if (url.startsWith("redis://") || url.startsWith("rediss://")) {
          return `await GlideClient.createClient(parseRedisUrl('${url}'))`;
        }
        return "await GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })";
      },
    );

    // Command transformations
    transformed = transformed.replace(
      /\.setex\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
      ".set($1, $3, { expiry: { type: 'EX', count: $2 } })",
    );

    transformed = transformed.replace(
      /\.psetex\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
      ".set($1, $3, { expiry: { type: 'PX', count: $2 } })",
    );

    return transformed;
  }

  private applyNodeRedisTransformations(code: string): string {
    let transformed = code;

    // Import replacement
    transformed = transformed.replace(
      /import\s+\{[^}]*\}\s+from\s+['"]redis['"];?/g,
      "import { GlideClient, GlideClusterClient } from '@valkey/valkey-glide';",
    );

    // Connection patterns
    transformed = transformed.replace(
      /createClient\s*\(\s*\)/g,
      "GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })",
    );

    transformed = transformed.replace(
      /createClient\s*\(\s*\{[^}]*url:\s*['"]([^'"]+)['"][^}]*\}\s*\)/g,
      (match, url) => {
        return `GlideClient.createClient(parseRedisUrl('${url}'))`;
      },
    );

    // Remove .connect() calls as GLIDE connects automatically
    transformed = transformed.replace(/\.connect\s*\(\s*\);?\s*/g, ";");

    // Command transformations
    transformed = transformed.replace(
      /\.setEx\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
      ".set($1, $3, { expiry: { type: 'EX', count: $2 } })",
    );

    return transformed;
  }

  private applyCommonTransformations(code: string): string {
    let transformed = code;

    // Common command differences
    transformed = transformed.replace(
      /\.del\s*\(\s*([^)]+)\s*\)/g,
      (match, keys) => {
        // Ensure keys are in array format for GLIDE
        if (keys.includes("[") && keys.includes("]")) {
          return `.del(${keys})`;
        } else {
          return `.del([${keys}])`;
        }
      },
    );

    transformed = transformed.replace(
      /\.exists\s*\(\s*([^)]+)\s*\)/g,
      (match, keys) => {
        // Ensure keys are in array format for GLIDE
        if (keys.includes("[") && keys.includes("]")) {
          return `.exists(${keys})`;
        } else {
          return `.exists([${keys}])`;
        }
      },
    );

    return transformed;
  }
}

/**
 * Register the smart migration engine with the MCP server
 */
export function registerSmartMigrationEngine(mcp: McpServer) {
  const engine = new SmartMigrationEngine();

  (mcp as any).tool(
    "migrate",
    "Smart migration engine for converting Redis client code to GLIDE",
    async (args: any) => {
      const context = {
        userIntent: "migration" as const,
        complexity: "advanced" as const,
        clientCapabilities: "full" as const,
        taskType: "transform" as const,
        hasParameters: args && Object.keys(args).length > 0,
        patterns: [],
      };

      return engine.execute(args, context);
    },
  );
}
