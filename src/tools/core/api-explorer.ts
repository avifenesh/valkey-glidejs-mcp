/**
 * Unified API Explorer - Consolidates all API-related tools
 * Replaces: api.ts, api-workaround.ts, enhanced-api.ts, api-bypass.ts, api-fixed-v2.ts
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { findEquivalent, searchAll } from "../../data/api/mappings.js";
import {
  IOREDIS_DATASET,
  NODE_REDIS_DATASET,
  GLIDE_SURFACE,
} from "../../data/api/mappings.js";
import { ToolRoutingContext } from "../routing/context-analyzer.js";
import { SmartTool } from "../routing/tool-router.js";

export class UnifiedApiExplorer implements SmartTool {
  name = "api-explorer";
  capabilities = [
    "search",
    "equivalent",
    "diff",
    "categories",
    "browse",
    "common",
  ];
  complexity = 3;

  supports(context: ToolRoutingContext): boolean {
    return (
      context.userIntent === "exploration" || context.taskType === "lookup"
    );
  }

  async execute(args: any, context: ToolRoutingContext): Promise<any> {
    // Determine the specific action based on arguments and context
    const action = this.determineAction(args, context);

    switch (action) {
      case "search":
        return this.intelligentSearch(args, context);
      case "equivalent":
        return this.findEquivalent(args, context);
      case "diff":
        return this.compareApis(args, context);
      case "browse":
        return this.browseByCategory(args, context);
      case "common":
        return this.showCommonOperations(args, context);
      default:
        return this.comprehensiveExploration(args, context);
    }
  }

  private determineAction(args: any, context: ToolRoutingContext): string {
    if (args.source && args.symbol) return "equivalent";
    if (args.query) return "search";
    if (args.category) return "browse";
    if (args.from && args.to) return "diff";
    if (context.complexity === "simple") return "common";
    return "search";
  }

  private async intelligentSearch(args: any, context: ToolRoutingContext) {
    const query = args.query || args.term || "";

    if (!query) {
      return {
        content: [
          {
            type: "text",
            text: "❌ Error: Search requires a 'query' parameter",
          },
        ],
      };
    }

    const results = searchAll(query);

    // Smart filtering based on context
    let filteredResults = results;
    if (context.complexity === "simple") {
      filteredResults = results.slice(0, 5); // Limit for simple requests
    }

    return {
      content: [
        {
          type: "text",
          text: `✅ Found ${results.length} result(s) for "${query}"`,
        },
        { type: "text", text: this.formatResults(filteredResults, context) },
      ],
    };
  }

  private async findEquivalent(args: any, context: ToolRoutingContext) {
    const { source, symbol } = args;

    if (!source || !symbol) {
      return {
        content: [
          {
            type: "text",
            text: "❌ Error: Missing required parameters 'source' and 'symbol'",
          },
        ],
      };
    }

    if (source !== "ioredis" && source !== "node-redis") {
      return {
        content: [
          {
            type: "text",
            text: "❌ Error: source must be 'ioredis' or 'node-redis'",
          },
        ],
      };
    }

    const results = findEquivalent(source as any, symbol);

    return {
      content: [
        {
          type: "text",
          text: `✅ Found ${results.length} mapping(s) for ${symbol}`,
        },
        { type: "text", text: this.formatMappings(results, context) },
      ],
    };
  }

  private async compareApis(args: any, context: ToolRoutingContext) {
    const commonOps = [
      {
        op: "get",
        ioredis: "get(key)",
        glide: "client.get(key)",
        nodeRedis: "client.get(key)",
      },
      {
        op: "set",
        ioredis: "set(key, value)",
        glide: "client.set(key, value)",
        nodeRedis: "client.set(key, value)",
      },
      {
        op: "set with TTL",
        ioredis: "set(key, value, 'EX', 60)",
        glide: "client.set(key, value, {expiry: {type: 'EX', count: 60}})",
        nodeRedis: "client.setEx(key, 60, value)",
      },
      {
        op: "delete",
        ioredis: "del(key)",
        glide: "client.del([key])",
        nodeRedis: "client.del(key)",
      },
      {
        op: "exists",
        ioredis: "exists(key)",
        glide: "client.exists([key])",
        nodeRedis: "client.exists(key)",
      },
    ];

    const comparison = commonOps
      .map(
        (op) =>
          `**${op.op}**:\n- ioredis: \`${op.ioredis}\`\n- node-redis: \`${op.nodeRedis}\`\n- GLIDE: \`${op.glide}\``,
      )
      .join("\n\n");

    return {
      content: [
        { type: "text", text: "✅ API Comparison - Common Operations" },
        { type: "text", text: comparison },
      ],
    };
  }

  private async browseByCategory(args: any, context: ToolRoutingContext) {
    const categories = {
      strings: ["GET", "SET", "DEL", "EXISTS", "EXPIRE", "TTL"],
      hashes: ["HGET", "HSET", "HDEL", "HGETALL", "HKEYS"],
      lists: ["LPUSH", "RPUSH", "LPOP", "RPOP", "LLEN", "LRANGE"],
      sets: ["SADD", "SREM", "SMEMBERS", "SCARD", "SINTER"],
      zsets: ["ZADD", "ZREM", "ZRANGE", "ZCARD", "ZRANK"],
      streams: ["XADD", "XREAD", "XGROUP", "XLEN"],
      pubsub: ["PUBLISH", "SUBSCRIBE", "UNSUBSCRIBE"],
      transactions: ["MULTI", "EXEC", "DISCARD", "WATCH"],
      geo: ["GEOADD", "GEODIST", "GEORADIUS", "GEOHASH"],
    };

    const category = args.category || "strings";
    const commands = categories[category as keyof typeof categories] || [];

    return {
      content: [
        { type: "text", text: `✅ ${category.toUpperCase()} Commands` },
        { type: "text", text: commands.join(", ") },
        {
          type: "text",
          text: `\nAvailable categories: ${Object.keys(categories).join(", ")}`,
        },
      ],
    };
  }

  private async showCommonOperations(args: any, context: ToolRoutingContext) {
    const commonOps = [
      { op: "get", ioredis: "get(key)", glide: "client.get(key)" },
      {
        op: "set",
        ioredis: "set(key, value)",
        glide: "client.set(key, value)",
      },
      {
        op: "set with TTL",
        ioredis: "set(key, value, 'EX', 60)",
        glide: "client.set(key, value, {expiry: {type: 'EX', count: 60}})",
      },
      { op: "delete", ioredis: "del(key)", glide: "client.del([key])" },
      { op: "exists", ioredis: "exists(key)", glide: "client.exists([key])" },
    ];

    const formatted = commonOps
      .map((op) => `**${op.op}**: ${op.ioredis} → ${op.glide}`)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: "✅ Common Redis Operations & GLIDE Equivalents",
        },
        { type: "text", text: formatted },
      ],
    };
  }

  private async comprehensiveExploration(
    args: any,
    context: ToolRoutingContext,
  ) {
    return {
      content: [
        { type: "text", text: "🔍 API Explorer - Available Actions:" },
        { type: "text", text: "• Search: Provide 'query' parameter" },
        {
          type: "text",
          text: "• Find Equivalent: Provide 'source' and 'symbol' parameters",
        },
        {
          type: "text",
          text: "• Browse Category: Provide 'category' parameter",
        },
        {
          type: "text",
          text: "• Compare APIs: Provide 'from' and 'to' parameters",
        },
        { type: "text", text: "• Common Operations: No parameters needed" },
      ],
    };
  }

  private formatResults(results: any[], context: ToolRoutingContext): string {
    if (context.complexity === "simple") {
      return results
        .map((r) => `• ${r.name || r.symbol}: ${r.description || ""}`)
        .join("\n");
    } else {
      return JSON.stringify(results, null, 2);
    }
  }

  private formatMappings(results: any[], context: ToolRoutingContext): string {
    if (context.complexity === "simple") {
      return results.map((r) => `• ${r.from} → ${r.to}`).join("\n");
    } else {
      return JSON.stringify(results, null, 2);
    }
  }
}

/**
 * Register the unified API explorer with the MCP server
 */
export function registerUnifiedApiExplorer(mcp: McpServer) {
  const explorer = new UnifiedApiExplorer();

  // Register as a single smart tool that handles all API-related requests
  (mcp as any).tool(
    "api",
    "Intelligent API exploration, search, and comparison tool",
    async (args: any) => {
      const context = {
        userIntent: "exploration" as const,
        complexity: "simple" as const,
        clientCapabilities: "full" as const,
        taskType: "lookup" as const,
        hasParameters: args && Object.keys(args).length > 0,
        patterns: [],
      };

      return explorer.execute(args, context);
    },
  );
}
