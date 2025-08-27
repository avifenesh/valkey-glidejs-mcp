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
      category: "client",
      symbol: "duplicate()",
      equivalent: { glide: "createClient(options)" },
      description:
        "Create a separate connection for Pub/Sub or blocking operations by creating another Glide client.",
      quirks: "Use a dedicated subscriber client while the main client publishes.",
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
      equivalent: { glide: "subscribe(channel, listener) | for await ..." },
      description:
        "ioredis uses pattern or direct subscribe with event listeners; Glide provides subscribe with callbacks/async iterables.",
      quirks: "Ensure dedicated subscriber connection if needed.",
    },
    {
      category: "lists",
      symbol: "lpush(key, value|values)",
      equivalent: { glide: "lPush(key, value|values)" },
      description: "Push values to a list head.",
    },
    {
      category: "lists",
      symbol: "brpop(key, timeout)",
      equivalent: { glide: "brPop(key, timeout)" },
      description: "Blocking pop from list tail.",
    },
    {
      category: "scripts",
      symbol: "eval(script, numKeys, ...keysAndArgs)",
      equivalent: { glide: "eval(script, keys, args)" },
      description: "Execute Lua script.",
      paramsDiff: "Glide prefers arrays for keys/args instead of numKeys.",
    },
    {
      category: "sets",
      symbol: "sadd(key, member|members)",
      equivalent: { glide: "sAdd(key, member|members)" },
      description: "Add one or more set members.",
      examples: {
        source: `await redis.sadd('tags', 'a', 'b');`,
        glide: `await client.sAdd('tags', ['a', 'b']);`,
      },
    },
    {
      category: "sets",
      symbol: "sismember(key, member)",
      equivalent: { glide: "sIsMember(key, member)" },
      description: "Check set membership.",
    },
    {
      category: "sets",
      symbol: "smembers(key)",
      equivalent: { glide: "sMembers(key)" },
      description: "Get all set members.",
    },
    {
      category: "zsets",
      symbol: "zadd(key, score, member)",
      equivalent: { glide: "zAdd(key, [{ score, member }])" },
      description: "Add a member with score to a sorted set.",
      examples: {
        source: `await redis.zadd('lb', 10, 'alice');`,
        glide: `await client.zAdd('lb', [{ score: 10, member: 'alice' }]);`,
      },
    },
    {
      category: "zsets",
      symbol: "zrange(key, start, stop) | zrevrange(key, start, stop)",
      equivalent: { glide: "zRange(key, start, stop, { REV?: true, WITHSCORES?: true })" },
      description: "Range over sorted set with optional reverse and scores.",
    },
    {
      category: "zsets",
      symbol: "zrem(key, member|members)",
      equivalent: { glide: "zRem(key, member|members)" },
      description: "Remove member(s) from a sorted set.",
    },
    {
      category: "streams",
      symbol: "xadd(key, id, field value ...)",
      equivalent: { glide: "xAdd(key, id, map)" },
      description: "Append an entry to a stream.",
      examples: {
        source: `await redis.xadd('mystream', '*', 'f1', 'v1');`,
        glide: `await client.xAdd('mystream', '*', { f1: 'v1' });`,
      },
    },
    {
      category: "streams",
      symbol: "xgroup create key group $ mkstream",
      equivalent: { glide: "xGroupCreate(key, group, '$', { MKSTREAM: true })" },
      description: "Create a consumer group; optionally create stream if missing.",
    },
    {
      category: "streams",
      symbol: "xreadgroup group group consumer count block streams key id",
      equivalent: { glide: "xReadGroup(group, consumer, opts)" },
      description: "Read from a stream as part of a consumer group.",
    },
    {
      category: "streams",
      symbol: "xack(key, group, id|ids)",
      equivalent: { glide: "xAck(key, group, ids)" },
      description: "Acknowledge processed entries.",
    },
    {
      category: "transactions",
      symbol: "multi()...exec()",
      equivalent: { glide: "multi().command(...).exec()" },
      description: "Transactional execution of multiple commands.",
      quirks: "Ensure errors are handled; Glide returns array of results/errors.",
    },
    {
      category: "pipeline",
      symbol: "pipeline()...exec()",
      equivalent: { glide: "pipeline().command(...).exec()" },
      description: "Batch multiple commands without transactional guarantees.",
    },
    {
      category: "geo",
      symbol: "geoadd(key, longitude, latitude, member)",
      equivalent: { glide: "geoAdd(key, [{ longitude, latitude, member }])" },
      description: "Add geospatial items.",
      examples: {
        source: `await redis.geoadd('places', 13.361389, 38.115556, 'Palermo');`,
        glide: `await client.geoAdd('places', [{ longitude: 13.361389, latitude: 38.115556, member: 'Palermo' }]);`,
      },
    },
    {
      category: "geo",
      symbol: "geosearch(key, frommember|fromlonlat, byradius|bybox, opts)",
      equivalent: { glide: "geoSearch(key, opts)" },
      description: "Search geospatial index by radius or box.",
    },
    {
      category: "bitmaps",
      symbol: "setbit(key, offset, value)",
      equivalent: { glide: "setBit(key, offset, value)" },
      description: "Set the bit at offset.",
    },
    {
      category: "bitmaps",
      symbol: "getbit(key, offset)",
      equivalent: { glide: "getBit(key, offset)" },
      description: "Get the bit value at offset.",
    },
    {
      category: "bitmaps",
      symbol: "bitcount(key, start?, end?)",
      equivalent: { glide: "bitCount(key, start?, end?)" },
      description: "Count set bits.",
    },
    {
      category: "hyperloglog",
      symbol: "pfadd(key, elements)",
      equivalent: { glide: "pfAdd(key, elements)" },
      description: "Add elements to HyperLogLog.",
    },
    {
      category: "hyperloglog",
      symbol: "pfcount(key|keys)",
      equivalent: { glide: "pfCount(key|keys)" },
      description: "Estimate cardinality of set(s).",
    },
    {
      category: "hyperloglog",
      symbol: "pfmerge(destkey, sourcekeys)",
      equivalent: { glide: "pfMerge(destKey, sourceKeys)" },
      description: "Merge multiple HLLs into one.",
    },
    {
      category: "json",
      symbol: "JSON.SET key path value",
      equivalent: { glide: "jsonSet(key, path, value)" },
      description: "Set a JSON value at path (RedisJSON).",
    },
    {
      category: "json",
      symbol: "JSON.GET key path",
      equivalent: { glide: "jsonGet(key, path)" },
      description: "Get a JSON value at path (RedisJSON).",
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
      category: "client",
      symbol: "duplicate()",
      equivalent: { glide: "createClient(options)" },
      description: "Create another client for separate connections (e.g., subscriber).",
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
    {
      category: "pubsub",
      symbol: "subscribe(channel, listener)",
      equivalent: { glide: "subscribe(channel, listener) | for await ..." },
      description: "Subscribe to channel.",
    },
    {
      category: "lists",
      symbol: "lPush(key, value|values)",
      equivalent: { glide: "lPush(key, value|values)" },
      description: "Push to list head.",
    },
    {
      category: "lists",
      symbol: "brPop(key, timeout)",
      equivalent: { glide: "brPop(key, timeout)" },
      description: "Blocking pop from list tail.",
    },
    {
      category: "geo",
      symbol: "geoAdd(key, items)",
      equivalent: { glide: "geoAdd(key, items)" },
      description: "Add geospatial items.",
    },
    {
      category: "geo",
      symbol: "geoSearch(key, opts)",
      equivalent: { glide: "geoSearch(key, opts)" },
      description: "Search geospatial index.",
    },
    {
      category: "bitmaps",
      symbol: "setBit(key, offset, value)",
      equivalent: { glide: "setBit(key, offset, value)" },
      description: "Set bit.",
    },
    {
      category: "bitmaps",
      symbol: "getBit(key, offset)",
      equivalent: { glide: "getBit(key, offset)" },
      description: "Get bit.",
    },
    {
      category: "bitmaps",
      symbol: "bitCount(key, start?, end?)",
      equivalent: { glide: "bitCount(key, start?, end?)" },
      description: "Count set bits.",
    },
    {
      category: "hyperloglog",
      symbol: "pfAdd(key, elements)",
      equivalent: { glide: "pfAdd(key, elements)" },
      description: "Add to HyperLogLog.",
    },
    {
      category: "hyperloglog",
      symbol: "pfCount(key|keys)",
      equivalent: { glide: "pfCount(key|keys)" },
      description: "Estimate cardinality.",
    },
    {
      category: "hyperloglog",
      symbol: "pfMerge(destKey, sourceKeys)",
      equivalent: { glide: "pfMerge(destKey, sourceKeys)" },
      description: "Merge HLLs.",
    },
    {
      category: "json",
      symbol: "jsonSet(key, path, value)",
      equivalent: { glide: "jsonSet(key, path, value)" },
      description: "Set JSON value.",
    },
    {
      category: "json",
      symbol: "jsonGet(key, path)",
      equivalent: { glide: "jsonGet(key, path)" },
      description: "Get JSON value.",
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
    { category: "pubsub", symbol: "subscribe(channel, listener)", equivalent: { glide: "subscribe(channel, listener) | for await ..." }, description: "PubSub subscribe." },
    { category: "scripts", symbol: "eval(script, keys, args)", equivalent: { glide: "eval(script, keys, args)" }, description: "EVAL script." },
    { category: "lists", symbol: "lPush(key, value|values)", equivalent: { glide: "lPush(key, value|values)" }, description: "List push." },
    { category: "lists", symbol: "brPop(key, timeout)", equivalent: { glide: "brPop(key, timeout)" }, description: "Blocking list pop." },
    { category: "geo", symbol: "geoAdd(key, items)", equivalent: { glide: "geoAdd(key, items)" }, description: "Add geospatial items." },
    { category: "geo", symbol: "geoSearch(key, opts)", equivalent: { glide: "geoSearch(key, opts)" }, description: "Search geospatial index." },
    { category: "bitmaps", symbol: "setBit(key, offset, value)", equivalent: { glide: "setBit(key, offset, value)" }, description: "Set bit." },
    { category: "bitmaps", symbol: "getBit(key, offset)", equivalent: { glide: "getBit(key, offset)" }, description: "Get bit." },
    { category: "bitmaps", symbol: "bitCount(key, start?, end?)", equivalent: { glide: "bitCount(key, start?, end?)" }, description: "Count set bits." },
    { category: "hyperloglog", symbol: "pfAdd(key, elements)", equivalent: { glide: "pfAdd(key, elements)" }, description: "Add to HyperLogLog." },
    { category: "hyperloglog", symbol: "pfCount(key|keys)", equivalent: { glide: "pfCount(key|keys)" }, description: "Estimate cardinality." },
    { category: "hyperloglog", symbol: "pfMerge(destKey, sourceKeys)", equivalent: { glide: "pfMerge(destKey, sourceKeys)" }, description: "Merge HLLs." },
    { category: "json", symbol: "jsonSet(key, path, value)", equivalent: { glide: "jsonSet(key, path, value)" }, description: "Set JSON value." },
    { category: "json", symbol: "jsonGet(key, path)", equivalent: { glide: "jsonGet(key, path)" }, description: "Get JSON value." },
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

