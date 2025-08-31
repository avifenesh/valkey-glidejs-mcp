import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { findEquivalent, searchAll } from "../data/api/mappings.js";
import {
  IOREDIS_DATASET,
  NODE_REDIS_DATASET,
  GLIDE_SURFACE,
} from "../data/api/mappings.js";

export function registerApiTools(mcp: McpServer) {
  // API findEquivalent tool - use any type to bypass Zod validation issues
  (mcp as any).tool(
    "api.findEquivalent",
    "Find GLIDE equivalent for ioredis or node-redis methods",
    async (args: any) => {
      // Manual validation
      if (!args || typeof args !== 'object') {
        return {
          content: [
            { type: "text", text: "❌ Error: Invalid arguments" },
          ],
        };
      }
      
      const { source, symbol } = args;
      
      if (!source || !symbol) {
        return {
          content: [
            { type: "text", text: "❌ Error: Missing required parameters 'source' and 'symbol'" },
          ],
        };
      }
      
      if (source !== "ioredis" && source !== "node-redis") {
        return {
          content: [
            { type: "text", text: "❌ Error: source must be 'ioredis' or 'node-redis'" },
          ],
        };
      }
      
      const results = findEquivalent(source as any, symbol);
      return {
        content: [
          { type: "text", text: `✅ Found ${results.length} mapping(s) for ${symbol}` },
          { type: "text", text: JSON.stringify(results, null, 2) },
        ],
      };
    }
  );

  // API search tool
  (mcp as any).tool(
    "api.search",
    "Search for keywords across all datasets",
    async (args: any) => {
      if (!args || !args.query) {
        return {
          content: [
            { type: "text", text: "❌ Error: Missing required parameter 'query'" },
          ],
        };
      }
      
      const results = searchAll(args.query);
      return {
        content: [
          { type: "text", text: `✅ Found ${results.length} result(s) for "${args.query}"` },
          { type: "text", text: JSON.stringify(results, null, 2) },
        ],
      };
    }
  );

  // API diff tool
  (mcp as any).tool(
    "api.diff",
    "Compare API differences between source client and GLIDE",
    async (args: any) => {
      if (!args || !args.from || !args.symbol) {
        return {
          content: [
            { type: "text", text: "❌ Error: Missing required parameters 'from' and 'symbol'" },
          ],
        };
      }
      
      const results = findEquivalent(args.from, args.symbol);
      const diff = results.map((r) => ({
        symbol: r.symbol,
        paramsDiff: r.paramsDiff,
        returnDiff: r.returnDiff,
        quirks: r.quirks,
      }));
      return {
        content: [{ type: "text", text: JSON.stringify(diff, null, 2) }],
      };
    }
  );

  // Browse by category - no parameters
  (mcp as any).tool(
    "api.categories",
    "Get all available API categories",
    async () => {
      const categories = new Set<string>();
      [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE].forEach((ds) =>
        ds.entries.forEach((e) => categories.add(e.category))
      );
      const list = Array.from(categories).sort();
      return {
        content: [{ type: "text", text: JSON.stringify(list) }],
      };
    }
  );

  (mcp as any).tool(
    "api.byCategory",
    "Get all APIs in a specific category",
    async (args: any) => {
      if (!args || !args.category) {
        return {
          content: [
            { type: "text", text: "❌ Error: Missing required parameter 'category'" },
          ],
        };
      }
      
      const cat = args.category.toLowerCase();
      const entries = [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE]
        .flatMap((ds) => ds.entries)
        .filter((e) => e.category.toLowerCase() === cat);
      return {
        content: [{ type: "text", text: JSON.stringify(entries, null, 2) }],
      };
    }
  );

  // Aliases: families
  (mcp as any).tool(
    "api.families",
    "Get all available API families (alias for categories)",
    async () => {
      const families = new Set<string>();
      [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE].forEach((ds) =>
        ds.entries.forEach((e) => families.add(e.category))
      );
      const list = Array.from(families).sort();
      return {
        content: [{ type: "text", text: JSON.stringify(list) }],
      };
    }
  );

  (mcp as any).tool(
    "api.byFamily",
    "Get all APIs in a specific family (alias for byCategory)",
    async (args: any) => {
      if (!args || !args.family) {
        return {
          content: [
            { type: "text", text: "❌ Error: Missing required parameter 'family'" },
          ],
        };
      }
      
      const fam = args.family.toLowerCase();
      const entries = [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE]
        .flatMap((ds) => ds.entries)
        .filter((e) => e.category.toLowerCase() === fam);
      return {
        content: [{ type: "text", text: JSON.stringify(entries, null, 2) }],
      };
    }
  );
}