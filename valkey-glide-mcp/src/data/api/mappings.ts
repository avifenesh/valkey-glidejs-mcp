export type ApiClient = "ioredis" | "node-redis" | "glide";

export interface ApiMappingEntry {
  category: string;
  symbol: string;
  equivalent: {
    glide: string;
  };
  description: string;
  paramsDiff?: string;
  returnDiff?: string;
  quirks?: string;
  examples?: {
    source?: string;
    glide?: string;
  };
}

export interface ApiDataset {
  client: ApiClient;
  version?: string;
  entries: ApiMappingEntry[];
}

// Note: This dataset is a curated starting subset focused on common commands and client setup.
// It should be expanded over time by scraping docs and repositories.

export const IOREDIS_DATASET: ApiDataset = {
  client: "ioredis",
  entries: [
    {
      category: "client",
      symbol: "new Redis(options)",
      equivalent: { glide: "createClient(options)" },
      description:
        "Create a standalone client. In Glide, you create the client via a factory and typically await readiness.",
      paramsDiff:
        "ioredis uses constructor options; Glide uses a factory. Options fields may differ (e.g., retry/cluster strategy).",
      returnDiff: "Both return a client-like object. Methods mostly align on command names.",
      examples: {
        source: `import Redis from "ioredis";\nconst redis = new Redis({ host: "localhost", port: 6379 });`,
        glide: `import { createClient } from "@valkey/glide";\nconst client = await createClient({ host: "localhost", port: 6379 });`,
      },
    },
    {
      category: "client",
      symbol: "new Redis.Cluster(nodes, options)",
      equivalent: { glide: "createCluster(nodes, options)" },
      description: "Create a cluster client.",
      paramsDiff:
        "Both accept node addresses; option names differ. Align timeouts/retries accordingly.",
    },
    {
      category: "strings",
      symbol: "get(key)",
      equivalent: { glide: "get(key)" },
      description: "Get the value of key.",
      returnDiff:
        "ioredis returns string | null; Glide may return string | null (binary config differs).",
    },
    {
      category: "strings",
      symbol: "set(key, value, [EX seconds|PX ms|NX|XX])",
      equivalent: { glide: "set(key, value, options?)" },
      description: "Set key with optional expiration and conditions.",
      paramsDiff:
        "ioredis variadic flags vs Glide structured options (e.g., { EX: seconds, NX: true }).",
    },
    {
      category: "keys",
      symbol: "del(key|keys)",
      equivalent: { glide: "del(...keys)" },
      description: "Delete one or more keys.",
    },
    {
      category: "keys",
      symbol: "expire(key, seconds)",
      equivalent: { glide: "expire(key, seconds)" },
      description: "Set TTL in seconds.",
    },
    {
      category: "hashes",
      symbol: "hset(key, field, value) | hset(key, object)",
      equivalent: { glide: "hset(key, field, value) | hset(key, object)" },
      description: "Set hash fields.",
    },
    {
      category: "hashes",
      symbol: "hget(key, field)",
      equivalent: { glide: "hget(key, field)" },
      description: "Get hash field.",
    },
    {
      category: "pubsub",
      symbol: "publish(channel, message)",
      equivalent: { glide: "publish(channel, message)" },
      description: "Publish message to channel.",
    },
    {
      category: "pubsub",
      symbol: "subscribe(channel, callback)",
      equivalent: { glide: "subscribe(channel, listener)" },
      description:
        "ioredis uses pattern or direct subscribe with event listeners; Glide provides subscribe with callbacks/async iterables.",
      quirks: "Ensure dedicated subscriber connection if needed.",
    },
    {
      category: "scripts",
      symbol: "eval(script, numKeys, ...keysAndArgs)",
      equivalent: { glide: "eval(script, keys, args)" },
      description: "Execute Lua script.",
      paramsDiff: "Glide prefers arrays for keys/args instead of numKeys.",
    },
  ],
};

export const NODE_REDIS_DATASET: ApiDataset = {
  client: "node-redis",
  entries: [
    {
      category: "client",
      symbol: "createClient(options)",
      equivalent: { glide: "createClient(options)" },
      description:
        "Both expose a client factory. Node-redis requires await client.connect(); Glide may await creation and be ready.",
      paramsDiff: "Option shapes differ (e.g., URL vs host/port).",
    },
    {
      category: "client",
      symbol: "createCluster(options)",
      equivalent: { glide: "createCluster(nodes, options)" },
      description: "Create cluster client.",
    },
    {
      category: "strings",
      symbol: "get(key)",
      equivalent: { glide: "get(key)" },
      description: "Get the value of key.",
      returnDiff: "Node-redis can return Buffer if configured; Glide similar if binary mode enabled.",
    },
    {
      category: "strings",
      symbol: "set(key, value, options?)",
      equivalent: { glide: "set(key, value, options?)" },
      description: "Set value with options.",
      paramsDiff: "Option keys may differ slightly (EX vs ex) between libs.",
    },
    {
      category: "pubsub",
      symbol: "publish(channel, message)",
      equivalent: { glide: "publish(channel, message)" },
      description: "Publish to channel.",
    },
  ],
};

export const GLIDE_SURFACE: ApiDataset = {
  client: "glide",
  entries: [
    {
      category: "client",
      symbol: "createClient(options)",
      equivalent: { glide: "createClient(options)" },
      description: "Create a standalone Glide client.",
    },
    {
      category: "client",
      symbol: "createCluster(nodes, options)",
      equivalent: { glide: "createCluster(nodes, options)" },
      description: "Create a cluster client.",
    },
    { category: "strings", symbol: "get(key)", equivalent: { glide: "get(key)" }, description: "Get a key." },
    { category: "strings", symbol: "set(key, value, options?)", equivalent: { glide: "set(key, value, options?)" }, description: "Set a key." },
    { category: "keys", symbol: "del(...keys)", equivalent: { glide: "del(...keys)" }, description: "Delete keys." },
    { category: "keys", symbol: "expire(key, seconds)", equivalent: { glide: "expire(key, seconds)" }, description: "Set TTL." },
    { category: "hashes", symbol: "hset(key, field, value)|hset(key, object)", equivalent: { glide: "hset(...)" }, description: "Hash set." },
    { category: "hashes", symbol: "hget(key, field)", equivalent: { glide: "hget(key, field)" }, description: "Hash get." },
    { category: "pubsub", symbol: "publish(channel, message)", equivalent: { glide: "publish(channel, message)" }, description: "PubSub publish." },
    { category: "pubsub", symbol: "subscribe(channel, listener)", equivalent: { glide: "subscribe(channel, listener)" }, description: "PubSub subscribe." },
    { category: "scripts", symbol: "eval(script, keys, args)", equivalent: { glide: "eval(script, keys, args)" }, description: "EVAL script." },
  ],
};

export function findEquivalent(
  sourceClient: Exclude<ApiClient, "glide">,
  symbol: string
): ApiMappingEntry[] {
  const dataset = sourceClient === "ioredis" ? IOREDIS_DATASET : NODE_REDIS_DATASET;
  const norm = symbol.toLowerCase();
  return dataset.entries.filter((e) => e.symbol.toLowerCase().includes(norm));
}

export function searchAll(keyword: string): ApiMappingEntry[] {
  const kw = keyword.toLowerCase();
  const all = [...IOREDIS_DATASET.entries, ...NODE_REDIS_DATASET.entries, ...GLIDE_SURFACE.entries];
  return all.filter(
    (e) =>
      e.symbol.toLowerCase().includes(kw) ||
      e.category.toLowerCase().includes(kw) ||
      e.description.toLowerCase().includes(kw)
  );
}

