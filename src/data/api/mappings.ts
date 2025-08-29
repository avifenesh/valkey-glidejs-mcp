// Import comprehensive mappings
import {
  COMPREHENSIVE_IOREDIS_MAPPINGS,
  COMPREHENSIVE_NODE_REDIS_MAPPINGS,
  COMPREHENSIVE_GLIDE_MAPPINGS,
  getAllGlideMethods,
} from "./comprehensive-mappings.js";

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
      returnDiff:
        "Both return a client-like object. Methods mostly align on command names.",
      examples: {
        source: `import Redis from "ioredis";\nconst redis = new Redis({ host: "localhost", port: 6379 });`,
        glide: `import { createClient } from "@valkey/glide";\nconst client = await createClient({ host: "localhost", port: 6379 });`,
      },
    },
    {
      category: "client",
      symbol: "new Redis.Cluster(nodes, options)",
      equivalent: { glide: "GlideClusterClient.createClient(options)" },
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
      quirks:
        "Use a dedicated subscriber client while the main client publishes.",
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
      equivalent: {
        glide: "customCommand(['SUBSCRIBE', channel]) + getPubSubMessage()",
      },
      description:
        "Use SUBSCRIBE via customCommand and consume messages via getPubSubMessage or a callback configured at client creation.",
      quirks: "Ensure dedicated subscriber connection if needed.",
    },
    {
      category: "lists",
      symbol: "lpush(key, value|values)",
      equivalent: { glide: "lpush(key, value|values)" },
      description: "Push values to a list head.",
    },
    {
      category: "lists",
      symbol: "brpop(key, timeout)",
      equivalent: { glide: "brpop(key, timeout)" },
      description: "Blocking pop from list tail.",
    },
    {
      category: "scripts",
      symbol: "eval(script, numKeys, ...keysAndArgs)",
      equivalent: { glide: "invokeScript(script, keys, args)" },
      description: "Execute Lua script.",
      paramsDiff: "Glide prefers arrays for keys/args instead of numKeys.",
    },
    {
      category: "sets",
      symbol: "sadd(key, member|members)",
      equivalent: { glide: "sadd(key, member|members)" },
      description: "Add one or more set members.",
      examples: {
        source: `await redis.sadd('tags', 'a', 'b');`,
        glide: `await client.sadd('tags', ['a', 'b']);`,
      },
    },
    {
      category: "sets",
      symbol: "sismember(key, member)",
      equivalent: { glide: "sismember(key, member)" },
      description: "Check set membership.",
    },
    {
      category: "sets",
      symbol: "smembers(key)",
      equivalent: { glide: "smembers(key)" },
      description: "Get all set members.",
    },
    {
      category: "zsets",
      symbol: "zadd(key, score, member)",
      equivalent: { glide: "zadd(key, { member: score })" },
      description: "Add a member with score to a sorted set.",
      examples: {
        source: `await redis.zadd('lb', 10, 'alice');`,
        glide: `await client.zadd('lb', { 'alice': 10 });`,
      },
    },
    {
      category: "zsets",
      symbol: "zrange(key, start, stop) | zrevrange(key, start, stop)",
      equivalent: {
        glide: "zrange(key, start, stop, { REV?: true, WITHSCORES?: true })",
      },
      description: "Range over sorted set with optional reverse and scores.",
    },
    {
      category: "zsets",
      symbol: "zrem(key, member|members)",
      equivalent: { glide: "zrem(key, member|members)" },
      description: "Remove member(s) from a sorted set.",
    },
    {
      category: "streams",
      symbol: "xadd(key, id, field value ...)",
      equivalent: { glide: "xadd(key, [id, entries])" },
      description: "Append an entry to a stream.",
      examples: {
        source: `await redis.xadd('mystream', '*', 'f1', 'v1');`,
        glide: `await client.xadd('mystream', [['f1', 'v1']]);`,
      },
    },
    {
      category: "streams",
      symbol: "xgroup create key group $ mkstream",
      equivalent: {
        glide: "xgroupCreate(key, group, '$', { MKSTREAM: true })",
      },
      description:
        "Create a consumer group; optionally create stream if missing.",
    },
    {
      category: "streams",
      symbol: "xreadgroup group group consumer count block streams key id",
      equivalent: { glide: "xreadgroup(group, consumer, opts)" },
      description: "Read from a stream as part of a consumer group.",
    },
    {
      category: "streams",
      symbol: "xack(key, group, id|ids)",
      equivalent: { glide: "xack(key, group, ids)" },
      description: "Acknowledge processed entries.",
    },
    {
      category: "transactions",
      symbol: "multi()...exec()",
      equivalent: { glide: "new Batch(true).command(...) → client.exec(tx)" },
      description: "Atomic transactional execution of multiple commands.",
      quirks:
        "Use Batch class with atomic=true for atomic operations. Ensure errors are handled; GLIDE returns array of results/errors.",
    },
    {
      category: "batch",
      symbol: "pipeline()...exec()",
      equivalent: {
        glide: "new Batch(false).command(...) → client.exec(batch)",
      },
      description:
        "Non-atomic batch execution of multiple commands (replaces deprecated pipeline).",
      quirks:
        "Use Batch class with atomic=false for non-atomic operations. Pipeline is deprecated, use batch instead.",
    },
    {
      category: "geo",
      symbol: "geoadd(key, longitude, latitude, member)",
      equivalent: { glide: "geoadd(key, { member: {longitude, latitude} })" },
      description: "Add geospatial items.",
      examples: {
        source: `await redis.geoadd('places', 13.361389, 38.115556, 'Palermo');`,
        glide: `await client.geoadd('places', { 'Palermo': { longitude: 13.361389, latitude: 38.115556 } });`,
      },
    },
    {
      category: "geo",
      symbol: "geosearch(key, frommember|fromlonlat, byradius|bybox, opts)",
      equivalent: { glide: "geosearch(key, opts)" },
      description: "Search geospatial index by radius or box.",
    },
    {
      category: "bitmaps",
      symbol: "setbit(key, offset, value)",
      equivalent: { glide: "setbit(key, offset, value)" },
      description: "Set the bit at offset.",
    },
    {
      category: "bitmaps",
      symbol: "getbit(key, offset)",
      equivalent: { glide: "getbit(key, offset)" },
      description: "Get the bit value at offset.",
    },
    {
      category: "bitmaps",
      symbol: "bitcount(key, start?, end?)",
      equivalent: { glide: "bitcount(key, start?, end?)" },
      description: "Count set bits.",
    },
    {
      category: "hyperloglog",
      symbol: "pfadd(key, elements)",
      equivalent: { glide: "pfadd(key, elements)" },
      description: "Add elements to HyperLogLog.",
    },
    {
      category: "hyperloglog",
      symbol: "pfcount(key|keys)",
      equivalent: { glide: "pfcount(key|keys)" },
      description: "Estimate cardinality of set(s).",
    },
    {
      category: "hyperloglog",
      symbol: "pfmerge(destkey, sourcekeys)",
      equivalent: { glide: "pfmerge(destKey, sourceKeys)" },
      description: "Merge multiple HLLs into one.",
    },
    {
      category: "json",
      symbol: "JSON.SET key path value",
      equivalent: { glide: "GlideJson.set(client, key, path, value)" },
      description: "Set a JSON value at path (RedisJSON).",
    },
    {
      category: "json",
      symbol: "JSON.GET key path",
      equivalent: { glide: "GlideJson.get(client, key, { path })" },
      description: "Get a JSON value at path (RedisJSON).",
    },
    {
      category: "strings",
      symbol: "incr(key) | decr(key)",
      equivalent: { glide: "incr(key) | decr(key)" },
      description: "Increment or decrement integer value stored at key.",
    },
    {
      category: "strings",
      symbol: "mget(keys) | mset(object)",
      equivalent: { glide: "mGet(keys) | mSet(object)" },
      description: "Bulk get/set of string keys.",
    },
    {
      category: "strings",
      symbol: "append(key, value) | strlen(key)",
      equivalent: { glide: "append(key, value) | strLen(key)" },
      description: "Append to string and get length.",
    },
    {
      category: "keys",
      symbol: "exists(...keys) | ttl(key) | persist(key)",
      equivalent: { glide: "exists(...keys) | ttl(key) | persist(key)" },
      description: "Key introspection and TTL management.",
    },
    {
      category: "keys",
      symbol: "rename(key, newKey)",
      equivalent: { glide: "rename(key, newKey)" },
      description: "Rename a key.",
    },
    {
      category: "scan",
      symbol: "scan(cursor, opts)",
      equivalent: { glide: "scan(cursor, opts)" },
      description: "Incrementally iterate the keyspace.",
    },
    {
      category: "hashes",
      symbol: "hgetall(key) | hmget(key, fields) | hset(key, object)",
      equivalent: {
        glide: "hgetall(key) | hmget(key, fields) | hset(key, object)",
      },
      description: "Hash get all and bulk set by object using hset.",
    },
    {
      category: "hashes",
      symbol: "hincrby(key, field, increment)",
      equivalent: { glide: "hIncrBy(key, field, increment)" },
      description: "Increment numeric hash field.",
    },
    {
      category: "hashes",
      symbol: "hdel(key, fields) | hexists(key, field) | hlen(key)",
      equivalent: {
        glide: "hDel(key, fields) | hExists(key, field) | hLen(key)",
      },
      description: "Delete and introspect hash fields.",
    },
    {
      category: "hashes",
      symbol: "hkeys(key) | hvals(key) | hscan(key, cursor, opts)",
      equivalent: {
        glide: "hKeys(key) | hVals(key) | hScan(key, cursor, opts)",
      },
      description: "Iterate hash keys/values and scan.",
    },
    {
      category: "lists",
      symbol: "lrange(key, start, stop) | llen(key)",
      equivalent: { glide: "lRange(key, start, stop) | lLen(key)" },
      description: "Read subrange and length of list.",
    },
    {
      category: "lists",
      symbol:
        "lpop(key) | rpop(key) | rpush(key, values) | ltrim(key, start, stop)",
      equivalent: {
        glide:
          "lPop(key) | rPop(key) | rPush(key, values) | lTrim(key, start, stop)",
      },
      description: "Common list mutations.",
    },
    {
      category: "sets",
      symbol:
        "srem(key, members) | scard(key) | spop(key, count?) | srandmember(key, count?)",
      equivalent: {
        glide:
          "sRem(key, members) | sCard(key) | sPop(key, count?) | sRandMember(key, count?)",
      },
      description: "Set mutations and random ops.",
    },
    {
      category: "sets",
      symbol: "sdiff(keys) | sinter(keys) | sunion(keys)",
      equivalent: { glide: "sDiff(keys) | sInter(keys) | sUnion(keys)" },
      description: "Set algebra operations.",
    },
    {
      category: "zsets",
      symbol:
        "zcard(key) | zscore(key, member) | zincrby(key, increment, member)",
      equivalent: {
        glide:
          "zCard(key) | zScore(key, member) | zIncrBy(key, increment, member)",
      },
      description: "Sorted set cardinality, score lookup and increment.",
    },
    {
      category: "zsets",
      symbol: "zrank(key, member) | zrevrank(key, member)",
      equivalent: { glide: "zRank(key, member) | zRevRank(key, member)" },
      description: "Sorted set rank lookups.",
    },
    {
      category: "zsets",
      symbol:
        "zcount(key, min, max) | zremrangebyscore(key, min, max) | zremrangebyrank(key, start, stop)",
      equivalent: {
        glide:
          "zCount(key, min, max) | zRemRangeByScore(key, min, max) | zRemRangeByRank(key, start, stop)",
      },
      description: "Sorted set range operations.",
    },
    {
      category: "zsets",
      symbol: "zpopmax(key, count?) | zpopmin(key, count?)",
      equivalent: { glide: "zPopMax(key, count?) | zPopMin(key, count?)" },
      description: "Pop highest/lowest scored members.",
    },
    {
      category: "geo",
      symbol:
        "geodist(key, member1, member2, unit?) | geopos(key, members) | geohash(key, members)",
      equivalent: {
        glide:
          "geoDist(key, m1, m2, unit?) | geoPos(key, members) | geoHash(key, members)",
      },
      description: "Geo utilities.",
    },
    {
      category: "bitmaps",
      symbol:
        "bitop(operation, destKey, keys) | bitpos(key, bit, start?, end?)",
      equivalent: {
        glide:
          "bitOp(operation, destKey, keys) | bitPos(key, bit, start?, end?)",
      },
      description: "Bitmap operations.",
    },
    {
      category: "scripts",
      symbol: "script load|exists|flush",
      equivalent: { glide: "scriptLoad|scriptExists|scriptFlush" },
      description: "Scripting helpers.",
    },
    {
      category: "pubsub",
      symbol: "psubscribe(pattern) | punsubscribe(pattern)",
      equivalent: {
        glide:
          "customCommand(['PSUBSCRIBE', pattern]) + getPubSubMessage() | customCommand(['PUNSUBSCRIBE', pattern])",
      },
      description: "Pattern Pub/Sub via customCommand and getPubSubMessage.",
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
      equivalent: { glide: "GlideClusterClient.createClient(options)" },
      description: "Create cluster client.",
    },
    {
      category: "client",
      symbol: "duplicate()",
      equivalent: { glide: "createClient(options)" },
      description:
        "Create another client for separate connections (e.g., subscriber).",
    },
    {
      category: "strings",
      symbol: "get(key)",
      equivalent: { glide: "get(key)" },
      description: "Get the value of key.",
      returnDiff:
        "Node-redis can return Buffer if configured; Glide similar if binary mode enabled.",
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
      equivalent: {
        glide: "customCommand(['SUBSCRIBE', channel]) + getPubSubMessage()",
      },
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
      symbol: "GlideJson.set(client, key, path, value)",
      equivalent: { glide: "GlideJson.set(client, key, path, value)" },
      description: "Set JSON value.",
    },
    {
      category: "json",
      symbol: "GlideJson.get(client, key, { path })",
      equivalent: { glide: "GlideJson.get(client, key, { path })" },
      description: "Get JSON value.",
    },
    {
      category: "strings",
      symbol: "incr(key) | decr(key)",
      equivalent: { glide: "incr(key) | decr(key)" },
      description: "Increment or decrement integer value.",
    },
    {
      category: "strings",
      symbol: "mGet(keys) | mSet(object)",
      equivalent: { glide: "mGet(keys) | mSet(object)" },
      description: "Bulk get/set.",
    },
    {
      category: "keys",
      symbol: "exists(...keys) | ttl(key) | persist(key) | rename(key,newKey)",
      equivalent: { glide: "exists(...keys) | ttl | persist | rename" },
      description: "Key management.",
    },
    {
      category: "scan",
      symbol: "scan(cursor, opts) | hScan/sScan/zScan",
      equivalent: { glide: "scan | hScan | sScan | zScan" },
      description: "Iterate keyspace and data structures.",
    },
    {
      category: "hashes",
      symbol:
        "hGetAll | hMGet | hMSet | hIncrBy | hDel | hExists | hLen | hKeys | hVals",
      equivalent: {
        glide:
          "hGetAll | hMGet | hMSet | hIncrBy | hDel | hExists | hLen | hKeys | hVals",
      },
      description: "Hash utilities.",
    },
    {
      category: "lists",
      symbol: "lRange | lLen | lPop | rPop | rPush | lTrim",
      equivalent: { glide: "lRange | lLen | lPop | rPop | rPush | lTrim" },
      description: "List utilities.",
    },
    {
      category: "sets",
      symbol: "sRem | sCard | sPop | sRandMember | sDiff | sInter | sUnion",
      equivalent: {
        glide: "sRem | sCard | sPop | sRandMember | sDiff | sInter | sUnion",
      },
      description: "Set utilities.",
    },
    {
      category: "zsets",
      symbol:
        "zCard | zScore | zIncrBy | zRank | zRevRank | zCount | zRemRangeByScore | zRemRangeByRank | zPopMax | zPopMin",
      equivalent: {
        glide:
          "zCard | zScore | zIncrBy | zRank | zRevRank | zCount | zRemRangeByScore | zRemRangeByRank | zPopMax | zPopMin",
      },
      description: "Sorted set utilities.",
    },
    {
      category: "geo",
      symbol: "geoDist | geoPos | geoHash",
      equivalent: { glide: "geoDist | geoPos | geoHash" },
      description: "Geo utilities.",
    },
    {
      category: "bitmaps",
      symbol: "bitOp | bitPos",
      equivalent: { glide: "bitOp | bitPos" },
      description: "Bitmap ops.",
    },
    {
      category: "scripts",
      symbol: "evalSha | scriptLoad | scriptExists | scriptFlush",
      equivalent: {
        glide: "evalSha | scriptLoad | scriptExists | scriptFlush",
      },
      description: "Scripting helpers.",
    },
    {
      category: "pubsub",
      symbol: "pSubscribe | pUnsubscribe",
      equivalent: {
        glide:
          "customCommand(['PSUBSCRIBE', pattern]) + getPubSubMessage() | customCommand(['PUNSUBSCRIBE', pattern])",
      },
      description: "Pattern Pub/Sub via customCommand and getPubSubMessage.",
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
      equivalent: { glide: "GlideClusterClient.createClient(options)" },
      description: "Create a cluster client.",
    },
    {
      category: "strings",
      symbol: "get(key)",
      equivalent: { glide: "get(key)" },
      description: "Get a key.",
    },
    {
      category: "strings",
      symbol: "set(key, value, options?)",
      equivalent: { glide: "set(key, value, options?)" },
      description: "Set a key.",
    },
    {
      category: "keys",
      symbol: "del(...keys)",
      equivalent: { glide: "del(...keys)" },
      description: "Delete keys.",
    },
    {
      category: "keys",
      symbol: "expire(key, seconds)",
      equivalent: { glide: "expire(key, seconds)" },
      description: "Set TTL.",
    },
    {
      category: "hashes",
      symbol: "hset(key, field, value)|hset(key, object)",
      equivalent: { glide: "hset(...)" },
      description: "Hash set.",
    },
    {
      category: "hashes",
      symbol: "hget(key, field)",
      equivalent: { glide: "hget(key, field)" },
      description: "Hash get.",
    },
    {
      category: "pubsub",
      symbol: "publish(channel, message)",
      equivalent: { glide: "publish(channel, message)" },
      description: "PubSub publish.",
    },
    {
      category: "pubsub",
      symbol: "subscribe(channel, listener)",
      equivalent: {
        glide: "customCommand(['SUBSCRIBE', channel]) + getPubSubMessage()",
      },
      description: "PubSub subscribe.",
    },
    {
      category: "scripts",
      symbol: "eval(script, keys, args)",
      equivalent: { glide: "invokeScript(script, keys, args)" },
      description: "EVAL script.",
    },
    {
      category: "lists",
      symbol: "lpush(key, value|values)",
      equivalent: { glide: "lpush(key, value|values)" },
      description: "List push.",
    },
    {
      category: "lists",
      symbol: "brpop(key, timeout)",
      equivalent: { glide: "brpop(key, timeout)" },
      description: "Blocking list pop.",
    },
    {
      category: "geo",
      symbol: "geoadd(key, items)",
      equivalent: { glide: "geoadd(key, items)" },
      description: "Add geospatial items.",
    },
    {
      category: "geo",
      symbol: "geosearch(key, opts)",
      equivalent: { glide: "geosearch(key, opts)" },
      description: "Search geospatial index.",
    },
    {
      category: "bitmaps",
      symbol: "setbit(key, offset, value)",
      equivalent: { glide: "setbit(key, offset, value)" },
      description: "Set bit.",
    },
    {
      category: "bitmaps",
      symbol: "getbit(key, offset)",
      equivalent: { glide: "getbit(key, offset)" },
      description: "Get bit.",
    },
    {
      category: "bitmaps",
      symbol: "bitcount(key, start?, end?)",
      equivalent: { glide: "bitcount(key, start?, end?)" },
      description: "Count set bits.",
    },
    {
      category: "hyperloglog",
      symbol: "pfadd(key, elements)",
      equivalent: { glide: "pfadd(key, elements)" },
      description: "Add to HyperLogLog.",
    },
    {
      category: "hyperloglog",
      symbol: "pfcount(key|keys)",
      equivalent: { glide: "pfcount(key|keys)" },
      description: "Estimate cardinality.",
    },
    {
      category: "hyperloglog",
      symbol: "pfmerge(destKey, sourceKeys)",
      equivalent: { glide: "pfmerge(destKey, sourceKeys)" },
      description: "Merge HLLs.",
    },
    {
      category: "json",
      symbol: "GlideJson.set(client, key, path, value)",
      equivalent: { glide: "GlideJson.set(client, key, path, value)" },
      description: "Set JSON value.",
    },
    {
      category: "json",
      symbol: "GlideJson.get(client, key, { path })",
      equivalent: { glide: "GlideJson.get(client, key, { path })" },
      description: "Get JSON value.",
    },
    {
      category: "strings",
      symbol: "incr | decr | mGet | mSet | append | strLen",
      equivalent: { glide: "incr | decr | mGet | mSet | append | strLen" },
      description: "Common string operations.",
    },
    {
      category: "keys",
      symbol: "exists | ttl | persist | rename | scan",
      equivalent: { glide: "exists | ttl | persist | rename | scan" },
      description: "Key utilities and scan.",
    },
    {
      category: "hashes",
      symbol:
        "hGetAll | hMGet | hMSet | hIncrBy | hDel | hExists | hLen | hKeys | hVals | hScan",
      equivalent: {
        glide:
          "hGetAll | hMGet | hMSet | hIncrBy | hDel | hExists | hLen | hKeys | hVals | hScan",
      },
      description: "Hash utilities.",
    },
    {
      category: "lists",
      symbol: "lRange | lLen | lPop | rPop | rPush | lTrim",
      equivalent: { glide: "lRange | lLen | lPop | rPop | rPush | lTrim" },
      description: "List utilities.",
    },
    {
      category: "sets",
      symbol: "sRem | sCard | sPop | sRandMember | sDiff | sInter | sUnion",
      equivalent: {
        glide: "sRem | sCard | sPop | sRandMember | sDiff | sInter | sUnion",
      },
      description: "Set utilities.",
    },
    {
      category: "zsets",
      symbol:
        "zCard | zScore | zIncrBy | zRank | zRevRank | zCount | zRemRangeByScore | zRemRangeByRank | zPopMax | zPopMin",
      equivalent: {
        glide:
          "zCard | zScore | zIncrBy | zRank | zRevRank | zCount | zRemRangeByScore | zRemRangeByRank | zPopMax | zPopMin",
      },
      description: "Sorted set utilities.",
    },
    {
      category: "geo",
      symbol: "geoDist | geoPos | geoHash",
      equivalent: { glide: "geoDist | geoPos | geoHash" },
      description: "Geo utilities.",
    },
    {
      category: "bitmaps",
      symbol: "bitOp | bitPos",
      equivalent: { glide: "bitOp | bitPos" },
      description: "Bitmap ops.",
    },
    {
      category: "scripts",
      symbol: "evalSha | scriptLoad | scriptExists | scriptFlush",
      equivalent: { glide: "scriptLoad | scriptExists | scriptFlush" },
      description: "Scripting helpers.",
    },
    {
      category: "pubsub",
      symbol: "pSubscribe | pUnsubscribe",
      equivalent: {
        glide:
          "customCommand(['PSUBSCRIBE', pattern]) + getPubSubMessage() | customCommand(['PUNSUBSCRIBE', pattern])",
      },
      description: "Pattern Pub/Sub via customCommand and getPubSubMessage.",
    },
  ],
};

export function findEquivalent(
  sourceClient: Exclude<ApiClient, "glide">,
  symbol: string,
): ApiMappingEntry[] {
  // First check hand-crafted datasets
  const dataset =
    sourceClient === "ioredis" ? IOREDIS_DATASET : NODE_REDIS_DATASET;
  const norm = symbol.toLowerCase();
  let results = dataset.entries.filter((e) =>
    e.symbol.toLowerCase().includes(norm),
  );

  // If no results, check comprehensive mappings
  if (results.length === 0) {
    const comprehensiveDataset =
      sourceClient === "ioredis"
        ? COMPREHENSIVE_IOREDIS_MAPPINGS
        : COMPREHENSIVE_NODE_REDIS_MAPPINGS;
    results = comprehensiveDataset.entries.filter((e) =>
      e.symbol.toLowerCase().includes(norm),
    );
  }

  return results;
}

export function searchAll(keyword: string): ApiMappingEntry[] {
  const kw = keyword.toLowerCase();
  const all = [
    ...IOREDIS_DATASET.entries,
    ...NODE_REDIS_DATASET.entries,
    ...GLIDE_SURFACE.entries,
    ...COMPREHENSIVE_IOREDIS_MAPPINGS.entries,
    ...COMPREHENSIVE_NODE_REDIS_MAPPINGS.entries,
    ...COMPREHENSIVE_GLIDE_MAPPINGS.entries,
  ];

  // Deduplicate by symbol
  const seen = new Set<string>();
  const unique: ApiMappingEntry[] = [];

  all.forEach((entry) => {
    if (!seen.has(entry.symbol)) {
      seen.add(entry.symbol);
      unique.push(entry);
    }
  });

  return unique.filter(
    (e) =>
      e.symbol.toLowerCase().includes(kw) ||
      e.category.toLowerCase().includes(kw) ||
      e.description.toLowerCase().includes(kw),
  );
}

// Export all GLIDE methods for validation
export { getAllGlideMethods } from "./comprehensive-mappings.js";
