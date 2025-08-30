import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { findEquivalent, searchAll } from "../data/api/mappings.js";
import {
  IOREDIS_DATASET,
  NODE_REDIS_DATASET,
  GLIDE_SURFACE,
} from "../data/api/mappings.js";

export function registerApiTools(mcp: McpServer) {
  mcp.tool(
    "api.findEquivalent",
    {
      source: z.enum(["ioredis", "node-redis"]).describe("Source client"),
      symbol: z
        .string()
        .describe("Function or usage, e.g., set(key,value,{EX:10})"),
    },
    async (args) => {
      const results = findEquivalent(args.source as any, args.symbol);
      return {
        structuredContent: { results },
        content: [
          { type: "text", text: `Found ${results.length} mapping(s)` },
          { type: "text", text: JSON.stringify(results, null, 2) },
        ],
      } as any;
    },
  );

  mcp.tool(
    "api.search",
    {
      query: z.string().describe("Keyword to search across datasets"),
    },
    async (args) => {
      const results = searchAll(args.query);
      return {
        structuredContent: { results },
        content: [
          { type: "text", text: `Found ${results.length} result(s)` },
          { type: "text", text: JSON.stringify(results, null, 2) },
        ],
      } as any;
    },
  );

  mcp.tool(
    "api.diff",
    {
      from: z.enum(["ioredis", "node-redis"]).describe("Source client"),
      symbol: z.string(),
    },
    async (args) => {
      const results = findEquivalent(args.from as any, args.symbol);
      const diff = results.map((r) => ({
        symbol: r.symbol,
        paramsDiff: r.paramsDiff,
        returnDiff: r.returnDiff,
        quirks: r.quirks,
      }));
      return {
        structuredContent: { diff },
        content: [{ type: "text", text: JSON.stringify(diff, null, 2) }],
      } as any;
    },
  );

  // Browse by category
  mcp.tool("api.categories", {}, async () => {
    const categories = new Set<string>();
    [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE].forEach((ds) =>
      ds.entries.forEach((e) => categories.add(e.category)),
    );
    const list = Array.from(categories).sort();
    return {
      structuredContent: { categories: list },
      content: [{ type: "text", text: JSON.stringify(list) }],
    } as any;
  });

  mcp.tool(
    "api.byCategory",
    {
      category: z.string(),
    },
    async (args) => {
      const cat = args.category.toLowerCase();
      const entries = [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE]
        .flatMap((ds) => ds.entries)
        .filter((e) => e.category.toLowerCase() === cat);
      return {
        structuredContent: { category: args.category, entries },
        content: [{ type: "text", text: JSON.stringify(entries, null, 2) }],
      } as any;
    },
  );

  // Aliases: families
  mcp.tool("api.families", {}, async () => {
    const families = new Set<string>();
    [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE].forEach((ds) =>
      ds.entries.forEach((e) => families.add(e.category)),
    );
    const list = Array.from(families).sort();
    return {
      structuredContent: { families: list },
      content: [{ type: "text", text: JSON.stringify(list) }],
    } as any;
  });
  mcp.tool(
    "api.byFamily",
    {
      family: z.string(),
    },
    async (args) => {
      const fam = args.family.toLowerCase();
      const entries = [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE]
        .flatMap((ds) => ds.entries)
        .filter((e) => e.category.toLowerCase() === fam);
      return {
        structuredContent: { family: args.family, entries },
        content: [{ type: "text", text: JSON.stringify(entries, null, 2) }],
      } as any;
    },
  );
}
