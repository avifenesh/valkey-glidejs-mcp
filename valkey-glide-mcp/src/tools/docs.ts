import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Minimal in-memory docs index. We'll expand with curated content and fetchers.
const SOURCES = [
  {
    id: "valkey-glide-node-docs",
    url: "https://valkey.io/valkey-glide/node/",
    kind: "docs",
  },
  {
    id: "valkey-glide-node-src",
    url: "https://github.com/valkey-io/valkey-glide/tree/main/node/src",
    kind: "repo",
  },
  { id: "glide-distributed-lock", url: "https://github.com/avifenesh/glide-distributed-lock", kind: "repo" },
  {
    id: "rate-limiter-flexible-glide",
    url: "https://github.com/avifenesh/node-rate-limiter-flexible/blob/main/lib/RateLimiterValkeyGlide.js",
    kind: "repo",
  },
  {
    id: "valkey-sandbox-advanced-node",
    url: "https://github.com/avifenesh/valkey-sandbox/tree/main/frontend/src/data/codeTemplates/valkey-glide/advanced/node",
    kind: "repo",
  },
  {
    id: "consumer-supplier-queue",
    url: "https://github.com/avifenesh/glide-consumer-supplier-queue/tree/main/node",
    kind: "repo",
  },
  {
    id: "cache-example",
    url: "https://github.com/gjuchault/typescript-service-starter/blob/main/src/infrastructure/cache/cache.ts",
    kind: "repo",
  },
  { id: "rate-limiters-collection", url: "https://github.com/religiosa1/rate-limiters", kind: "repo" },
  {
    id: "idempotency-docs",
    url: "https://github.com/aws-powertools/powertools-lambda-typescript/blob/main/docs/features/idempotency.md",
    kind: "docs",
  },
  { id: "fastify-glide", url: "https://github.com/fastify/fastify-valkey-glide", kind: "repo" },
  { id: "valkey-pubsub", url: "https://github.com/cbschuld/valkey-pubsub", kind: "repo" },
  { id: "ioredis-api", url: "https://ioredis.readthedocs.io/en/latest/API/", kind: "docs" },
  { id: "ioredis-repo", url: "https://github.com/redis/ioredis/tree/main/lib", kind: "repo" },
  { id: "node-redis-api", url: "https://redis.js.org/#node-redis-packages", kind: "docs" },
  { id: "node-redis-repo", url: "https://github.com/redis/node-redis/tree/master/packages", kind: "repo" },
];

export function registerDocsTools(mcp: McpServer) {
  // List curated sources
  mcp.tool("docs.listSources", z.object({}).shape, async () => {
    return {
      structuredContent: { sources: SOURCES },
      content: [{ type: "text", text: JSON.stringify({ sources: SOURCES }, null, 2) }],
    } as any;
  });

  // Return helpful starting points for a topic
  mcp.tool(
    "docs.recommend",
    z
      .object({
        topic: z.string().describe("What you want to implement/migrate, e.g., caching, lock, pubsub, fastify, ioredis migrate"),
      })
      .shape,
    async (args) => {
      const t = args.topic.toLowerCase();
      const hits = SOURCES.filter((s) =>
        ["glide", "valkey", "redis", "lock", "rate", "cache", "pubsub", "fastify", "queue", "idempot"].some((k) =>
          s.id.includes(k)
        )
      );
      return {
        structuredContent: { topic: args.topic, recommended: hits },
        content: [
          { type: "text", text: `Recommended sources for ${args.topic}:` },
          { type: "text", text: hits.map((h) => `- ${h.id}: ${h.url}`).join("\n") },
        ],
      } as any;
    }
  );

  // Fetch content of a URL (uses global fetch in Node >=18)
  mcp.tool(
    "docs.fetch",
    z.object({ url: z.string().url() }).shape,
    async (args) => {
      const res = await fetch(args.url);
      const text = await res.text();
      return {
        structuredContent: { url: args.url, length: text.length },
        content: [{ type: "text", text: text.slice(0, 20000) }],
      } as any;
    }
  );
}

