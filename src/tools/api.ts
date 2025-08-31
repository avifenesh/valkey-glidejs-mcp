import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { findEquivalent, searchAll } from "../data/api/mappings.js";
import {
  IOREDIS_DATASET,
  NODE_REDIS_DATASET,
  GLIDE_SURFACE,
} from "../data/api/mappings.js";
import { registerEnhancedTool } from "../utils/mcp-wrapper.js";

export function registerApiTools(mcp: McpServer) {
  // Enhanced API tool with dual schema support
  registerEnhancedTool(mcp, {
    name: "api.findEquivalent",
    description: "Find GLIDE equivalent for ioredis or node-redis methods",
    zodSchema: {
      source: z.enum(["ioredis", "node-redis"]).describe("Source client"),
      symbol: z
        .string()
        .describe("Function or usage, e.g., set(key,value,{EX:10})"),
    },
    handler: async ({ source, symbol }) => {
      const results = findEquivalent(source as any, symbol);
      return {
        content: [
          { type: "text", text: `✅ Found ${results.length} mapping(s) for ${symbol}` },
          { type: "text", text: JSON.stringify(results, null, 2) },
        ],
        structuredContent: { results, source, symbol, count: results.length },
      };
    },
  });

  // Enhanced search tool
  registerEnhancedTool(mcp, {
    name: "api.search",
    description: "Search for keywords across all datasets",
    zodSchema: {
      query: z.string().describe("Keyword to search across datasets"),
    },
    handler: async ({ query }) => {
      const results = searchAll(query);
      return {
        content: [
          { type: "text", text: `✅ Found ${results.length} result(s) for "${query}"` },
          { type: "text", text: JSON.stringify(results, null, 2) },
        ],
        structuredContent: { results, query, count: results.length },
      };
    },
  });

  mcp.tool(
    "api.diff",
    "Compare API differences between source client and GLIDE",
    {
      from: z.enum(["ioredis", "node-redis"]).describe("Source client"),
      symbol: z.string(),
    },
    async ({ from, symbol }) => {
      const results = findEquivalent(from as any, symbol);
      const diff = results.map((r) => ({
        symbol: r.symbol,
        paramsDiff: r.paramsDiff,
        returnDiff: r.returnDiff,
        quirks: r.quirks,
      }));
      return {
        content: [{ type: "text", text: JSON.stringify(diff, null, 2) }],
        structuredContent: { diff },
      };
    },
  );

  // Browse by category
  mcp.tool(
    "api.categories",
    "Get all available API categories",
    {},
    async () => {
      const categories = new Set<string>();
      [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE].forEach((ds) =>
        ds.entries.forEach((e) => categories.add(e.category)),
      );
      const list = Array.from(categories).sort();
      return {
        content: [{ type: "text", text: JSON.stringify(list) }],
        structuredContent: { categories: list },
      };
    },
  );

  mcp.tool(
    "api.byCategory",
    "Get all APIs in a specific category",
    {
      category: z.string(),
    },
    async ({ category }) => {
      const cat = category.toLowerCase();
      const entries = [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE]
        .flatMap((ds) => ds.entries)
        .filter((e) => e.category.toLowerCase() === cat);
      return {
        content: [{ type: "text", text: JSON.stringify(entries, null, 2) }],
        structuredContent: { category: category, entries },
      };
    },
  );

  // Aliases: families
  mcp.tool(
    "api.families",
    "Get all available API families (alias for categories)",
    {},
    async () => {
      const families = new Set<string>();
      [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE].forEach((ds) =>
        ds.entries.forEach((e) => families.add(e.category)),
      );
      const list = Array.from(families).sort();
      return {
        content: [{ type: "text", text: JSON.stringify(list) }],
        structuredContent: { families: list },
      };
    },
  );
  mcp.tool(
    "api.byFamily",
    "Get all APIs in a specific family (alias for byCategory)",
    {
      family: z.string(),
    },
    async ({ family }) => {
      const fam = family.toLowerCase();
      const entries = [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE]
        .flatMap((ds) => ds.entries)
        .filter((e) => e.category.toLowerCase() === fam);
      return {
        content: [{ type: "text", text: JSON.stringify(entries, null, 2) }],
        structuredContent: { family: family, entries },
      };
    },
  );
}
