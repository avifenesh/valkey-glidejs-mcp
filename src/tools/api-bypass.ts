import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { findEquivalent, searchAll } from "../data/api/mappings.js";
import {
  IOREDIS_DATASET,
  NODE_REDIS_DATASET,
  GLIDE_SURFACE,
} from "../data/api/mappings.js";

export function registerApiTools(mcp: McpServer) {
  // Bypass Zod validation entirely by using the low-level API
  const server = (mcp as any).server;
  
  // Register handlers manually
  server.setRequestHandler({
    shape: { method: { value: "tools/list" } }
  }, async () => {
    return {
      tools: [
        {
          name: "api.findEquivalent",
          description: "Find GLIDE equivalent for ioredis or node-redis methods",
          inputSchema: {
            type: "object",
            properties: {
              source: {
                type: "string",
                enum: ["ioredis", "node-redis"],
                description: "Source client"
              },
              symbol: {
                type: "string",
                description: "Function or usage, e.g., set(key,value,{EX:10})"
              }
            },
            required: ["source", "symbol"],
            additionalProperties: false
          }
        },
        {
          name: "api.search",
          description: "Search for keywords across all datasets",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Keyword to search across datasets"
              }
            },
            required: ["query"],
            additionalProperties: false
          }
        },
        {
          name: "api.categories",
          description: "Get all available API categories",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
          }
        },
        {
          name: "api.families",
          description: "Get all available API families (alias for categories)",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
          }
        },
        {
          name: "api.byCategory",
          description: "Get all APIs in a specific category",
          inputSchema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "Category name"
              }
            },
            required: ["category"],
            additionalProperties: false
          }
        },
        {
          name: "api.byFamily",
          description: "Get all APIs in a specific family (alias for byCategory)",
          inputSchema: {
            type: "object",
            properties: {
              family: {
                type: "string",
                description: "Family name"
              }
            },
            required: ["family"],
            additionalProperties: false
          }
        }
      ]
    };
  });

  server.setRequestHandler({
    shape: { method: { value: "tools/call" } }
  }, async (request: any) => {
    const { name, arguments: args } = request.params;
    
    switch (name) {
      case "api.findEquivalent": {
        if (!args.source || !args.symbol) {
          return {
            content: [
              { type: "text", text: "❌ Missing required parameters: source and symbol" }
            ]
          };
        }
        const results = findEquivalent(args.source, args.symbol);
        return {
          content: [
            { type: "text", text: `✅ Found ${results.length} mapping(s) for ${args.symbol}` },
            { type: "text", text: JSON.stringify(results, null, 2) }
          ]
        };
      }
      
      case "api.search": {
        if (!args.query) {
          return {
            content: [
              { type: "text", text: "❌ Missing required parameter: query" }
            ]
          };
        }
        const results = searchAll(args.query);
        return {
          content: [
            { type: "text", text: `✅ Found ${results.length} result(s) for "${args.query}"` },
            { type: "text", text: JSON.stringify(results, null, 2) }
          ]
        };
      }
      
      case "api.categories":
      case "api.families": {
        const categories = new Set<string>();
        [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE].forEach((ds) =>
          ds.entries.forEach((e) => categories.add(e.category))
        );
        const list = Array.from(categories).sort();
        return {
          content: [{ type: "text", text: JSON.stringify(list) }]
        };
      }
      
      case "api.byCategory":
      case "api.byFamily": {
        const key = name === "api.byCategory" ? "category" : "family";
        if (!args[key]) {
          return {
            content: [
              { type: "text", text: `❌ Missing required parameter: ${key}` }
            ]
          };
        }
        const cat = args[key].toLowerCase();
        const entries = [IOREDIS_DATASET, NODE_REDIS_DATASET, GLIDE_SURFACE]
          .flatMap((ds) => ds.entries)
          .filter((e) => e.category.toLowerCase() === cat);
        return {
          content: [{ type: "text", text: JSON.stringify(entries, null, 2) }]
        };
      }
      
      default:
        return {
          content: [
            { type: "text", text: `❌ Unknown tool: ${name}` }
          ]
        };
    }
  });
}