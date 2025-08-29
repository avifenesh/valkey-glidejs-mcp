// Auto-generated comprehensive GLIDE API mappings
// Generated from GLIDE TypeScript definitions
// Total methods covered: 296

import { ApiDataset } from './mappings.js';

export const COMPREHENSIVE_IOREDIS_MAPPINGS: ApiDataset = {
  "client": "ioredis",
  "version": "5.x",
  "entries": [
    {
      "category": "server",
      "symbol": "redis.configurePubsub(...)",
      "equivalent": {
        "glide": "client.configurePubsub(...)"
      },
      "description": "Execute configurePubsub command",
      "examples": {
        "source": "await redis.configurePubsub(...)",
        "glide": "await client.configurePubsub(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.toProtobufRoute(...)",
      "equivalent": {
        "glide": "client.toProtobufRoute(...)"
      },
      "description": "Execute toProtobufRoute command",
      "examples": {
        "source": "await redis.toProtobufRoute(...)",
        "glide": "await client.toProtobufRoute(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.processResponse(...)",
      "equivalent": {
        "glide": "client.processResponse(...)"
      },
      "description": "Execute processResponse command",
      "examples": {
        "source": "await redis.processResponse(...)",
        "glide": "await client.processResponse(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.processPush(...)",
      "equivalent": {
        "glide": "client.processPush(...)"
      },
      "description": "Execute processPush command",
      "examples": {
        "source": "await redis.processPush(...)",
        "glide": "await client.processPush(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.getCallbackIndex(...)",
      "equivalent": {
        "glide": "client.getCallbackIndex(...)"
      },
      "description": "Execute getCallbackIndex command",
      "examples": {
        "source": "await redis.getCallbackIndex(...)",
        "glide": "await client.getCallbackIndex(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.ensureClientIsOpen(...)",
      "equivalent": {
        "glide": "client.ensureClientIsOpen(...)"
      },
      "description": "Execute ensureClientIsOpen command",
      "examples": {
        "source": "await redis.ensureClientIsOpen(...)",
        "glide": "await client.ensureClientIsOpen(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.createWritePromise(...)",
      "equivalent": {
        "glide": "client.createWritePromise(...)"
      },
      "description": "Execute createWritePromise command",
      "examples": {
        "source": "await redis.createWritePromise(...)",
        "glide": "await client.createWritePromise(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.createUpdateConnectionPasswordPromise(...)",
      "equivalent": {
        "glide": "client.createUpdateConnectionPasswordPromise(...)"
      },
      "description": "Execute createUpdateConnectionPasswordPromise command",
      "examples": {
        "source": "await redis.createUpdateConnectionPasswordPromise(...)",
        "glide": "await client.createUpdateConnectionPasswordPromise(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.createScriptInvocationPromise(...)",
      "equivalent": {
        "glide": "client.createScriptInvocationPromise(...)"
      },
      "description": "Execute createScriptInvocationPromise command",
      "examples": {
        "source": "await redis.createScriptInvocationPromise(...)",
        "glide": "await client.createScriptInvocationPromise(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.writeOrBufferCommandRequest(...)",
      "equivalent": {
        "glide": "client.writeOrBufferCommandRequest(...)"
      },
      "description": "Execute writeOrBufferCommandRequest command",
      "examples": {
        "source": "await redis.writeOrBufferCommandRequest(...)",
        "glide": "await client.writeOrBufferCommandRequest(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.writeOrBufferRequest(...)",
      "equivalent": {
        "glide": "client.writeOrBufferRequest(...)"
      },
      "description": "Execute writeOrBufferRequest command",
      "examples": {
        "source": "await redis.writeOrBufferRequest(...)",
        "glide": "await client.writeOrBufferRequest(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.processResultWithSetCommands(...)",
      "equivalent": {
        "glide": "client.processResultWithSetCommands(...)"
      },
      "description": "Execute processResultWithSetCommands command",
      "examples": {
        "source": "await redis.processResultWithSetCommands(...)",
        "glide": "await client.processResultWithSetCommands(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.cancelPubSubFuturesWithExceptionSafe(...)",
      "equivalent": {
        "glide": "client.cancelPubSubFuturesWithExceptionSafe(...)"
      },
      "description": "Execute cancelPubSubFuturesWithExceptionSafe command",
      "examples": {
        "source": "await redis.cancelPubSubFuturesWithExceptionSafe(...)",
        "glide": "await client.cancelPubSubFuturesWithExceptionSafe(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.isPubsubConfigured(...)",
      "equivalent": {
        "glide": "client.isPubsubConfigured(...)"
      },
      "description": "Execute isPubsubConfigured command",
      "examples": {
        "source": "await redis.isPubsubConfigured(...)",
        "glide": "await client.isPubsubConfigured(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.getPubsubCallbackAndContext(...)",
      "equivalent": {
        "glide": "client.getPubsubCallbackAndContext(...)"
      },
      "description": "Execute getPubsubCallbackAndContext command",
      "examples": {
        "source": "await redis.getPubsubCallbackAndContext(...)",
        "glide": "await client.getPubsubCallbackAndContext(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.getPubSubMessage(...)",
      "equivalent": {
        "glide": "client.getPubSubMessage(...)"
      },
      "description": "Execute getPubSubMessage command",
      "examples": {
        "source": "await redis.getPubSubMessage(...)",
        "glide": "await client.getPubSubMessage(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.tryGetPubSubMessage(...)",
      "equivalent": {
        "glide": "client.tryGetPubSubMessage(...)"
      },
      "description": "Execute tryGetPubSubMessage command",
      "examples": {
        "source": "await redis.tryGetPubSubMessage(...)",
        "glide": "await client.tryGetPubSubMessage(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.notificationToPubSubMessageSafe(...)",
      "equivalent": {
        "glide": "client.notificationToPubSubMessageSafe(...)"
      },
      "description": "Execute notificationToPubSubMessageSafe command",
      "examples": {
        "source": "await redis.notificationToPubSubMessageSafe(...)",
        "glide": "await client.notificationToPubSubMessageSafe(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.completePubSubFuturesSafe(...)",
      "equivalent": {
        "glide": "client.completePubSubFuturesSafe(...)"
      },
      "description": "Execute completePubSubFuturesSafe command",
      "examples": {
        "source": "await redis.completePubSubFuturesSafe(...)",
        "glide": "await client.completePubSubFuturesSafe(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.get(key)",
      "equivalent": {
        "glide": "client.get(key)"
      },
      "description": "Execute get command",
      "examples": {
        "source": "await redis.get(key)",
        "glide": "await client.get(key)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.getex(...)",
      "equivalent": {
        "glide": "client.getex(...)"
      },
      "description": "Execute getex command",
      "examples": {
        "source": "await redis.getex(...)",
        "glide": "await client.getex(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.getdel(...)",
      "equivalent": {
        "glide": "client.getdel(...)"
      },
      "description": "Execute getdel command",
      "examples": {
        "source": "await redis.getdel(...)",
        "glide": "await client.getdel(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.getrange(...)",
      "equivalent": {
        "glide": "client.getrange(...)"
      },
      "description": "Execute getrange command",
      "examples": {
        "source": "await redis.getrange(...)",
        "glide": "await client.getrange(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.set(key, value, options?)",
      "equivalent": {
        "glide": "client.set(key, value, options?)"
      },
      "description": "Execute set command",
      "examples": {
        "source": "await redis.set(key, value, options?)",
        "glide": "await client.set(key, value, options?)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.del(key)",
      "equivalent": {
        "glide": "client.del(key)"
      },
      "description": "Execute del command",
      "examples": {
        "source": "await redis.del(key)",
        "glide": "await client.del(key)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.dump(key)",
      "equivalent": {
        "glide": "client.dump(key)"
      },
      "description": "Execute dump command",
      "examples": {
        "source": "await redis.dump(key)",
        "glide": "await client.dump(key)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.restore(...)",
      "equivalent": {
        "glide": "client.restore(...)"
      },
      "description": "Execute restore command",
      "examples": {
        "source": "await redis.restore(...)",
        "glide": "await client.restore(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.mget(...)",
      "equivalent": {
        "glide": "client.mget(...)"
      },
      "description": "Execute mget command",
      "examples": {
        "source": "await redis.mget(...)",
        "glide": "await client.mget(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.mset(...)",
      "equivalent": {
        "glide": "client.mset(...)"
      },
      "description": "Execute mset command",
      "examples": {
        "source": "await redis.mset(...)",
        "glide": "await client.mset(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.msetnx(...)",
      "equivalent": {
        "glide": "client.msetnx(...)"
      },
      "description": "Execute msetnx command",
      "examples": {
        "source": "await redis.msetnx(...)",
        "glide": "await client.msetnx(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.incr(...)",
      "equivalent": {
        "glide": "client.incr(...)"
      },
      "description": "Execute incr command",
      "examples": {
        "source": "await redis.incr(...)",
        "glide": "await client.incr(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.incrBy(...)",
      "equivalent": {
        "glide": "client.incrBy(...)"
      },
      "description": "Execute incrBy command",
      "examples": {
        "source": "await redis.incrBy(...)",
        "glide": "await client.incrBy(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.incrByFloat(...)",
      "equivalent": {
        "glide": "client.incrByFloat(...)"
      },
      "description": "Execute incrByFloat command",
      "examples": {
        "source": "await redis.incrByFloat(...)",
        "glide": "await client.incrByFloat(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.decr(...)",
      "equivalent": {
        "glide": "client.decr(...)"
      },
      "description": "Execute decr command",
      "examples": {
        "source": "await redis.decr(...)",
        "glide": "await client.decr(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.decrBy(...)",
      "equivalent": {
        "glide": "client.decrBy(...)"
      },
      "description": "Execute decrBy command",
      "examples": {
        "source": "await redis.decrBy(...)",
        "glide": "await client.decrBy(...)"
      }
    },
    {
      "category": "bitmap",
      "symbol": "redis.bitop(...)",
      "equivalent": {
        "glide": "client.bitop(...)"
      },
      "description": "Execute bitop command",
      "examples": {
        "source": "await redis.bitop(...)",
        "glide": "await client.bitop(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.getbit(...)",
      "equivalent": {
        "glide": "client.getbit(...)"
      },
      "description": "Execute getbit command",
      "examples": {
        "source": "await redis.getbit(...)",
        "glide": "await client.getbit(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.setbit(...)",
      "equivalent": {
        "glide": "client.setbit(...)"
      },
      "description": "Execute setbit command",
      "examples": {
        "source": "await redis.setbit(...)",
        "glide": "await client.setbit(...)"
      }
    },
    {
      "category": "bitmap",
      "symbol": "redis.bitpos(...)",
      "equivalent": {
        "glide": "client.bitpos(...)"
      },
      "description": "Execute bitpos command",
      "examples": {
        "source": "await redis.bitpos(...)",
        "glide": "await client.bitpos(...)"
      }
    },
    {
      "category": "bitmap",
      "symbol": "redis.bitfield(...)",
      "equivalent": {
        "glide": "client.bitfield(...)"
      },
      "description": "Execute bitfield command",
      "examples": {
        "source": "await redis.bitfield(...)",
        "glide": "await client.bitfield(...)"
      }
    },
    {
      "category": "bitmap",
      "symbol": "redis.bitfieldReadOnly(...)",
      "equivalent": {
        "glide": "client.bitfieldReadOnly(...)"
      },
      "description": "Execute bitfieldReadOnly command",
      "examples": {
        "source": "await redis.bitfieldReadOnly(...)",
        "glide": "await client.bitfieldReadOnly(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hget(key, field)",
      "equivalent": {
        "glide": "client.hget(key, field)"
      },
      "description": "Execute hget command",
      "examples": {
        "source": "await redis.hget(key, field)",
        "glide": "await client.hget(key, field)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hset(key, field, value)",
      "equivalent": {
        "glide": "client.hset(key, field, value)"
      },
      "description": "Execute hset command",
      "examples": {
        "source": "await redis.hset(key, field, value)",
        "glide": "await client.hset(key, field, value)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hkeys(key)",
      "equivalent": {
        "glide": "client.hkeys(key)"
      },
      "description": "Execute hkeys command",
      "examples": {
        "source": "await redis.hkeys(key)",
        "glide": "await client.hkeys(key)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hsetnx(...)",
      "equivalent": {
        "glide": "client.hsetnx(...)"
      },
      "description": "Execute hsetnx command",
      "examples": {
        "source": "await redis.hsetnx(...)",
        "glide": "await client.hsetnx(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hdel(key, ...fields)",
      "equivalent": {
        "glide": "client.hdel(key, ...fields)"
      },
      "description": "Execute hdel command",
      "examples": {
        "source": "await redis.hdel(key, ...fields)",
        "glide": "await client.hdel(key, ...fields)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hmget(key, fields)",
      "equivalent": {
        "glide": "client.hmget(key, fields)"
      },
      "description": "Execute hmget command",
      "examples": {
        "source": "await redis.hmget(key, fields)",
        "glide": "await client.hmget(key, fields)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hexists(...)",
      "equivalent": {
        "glide": "client.hexists(...)"
      },
      "description": "Execute hexists command",
      "examples": {
        "source": "await redis.hexists(...)",
        "glide": "await client.hexists(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hgetall(key)",
      "equivalent": {
        "glide": "client.hgetall(key)"
      },
      "description": "Execute hgetall command",
      "examples": {
        "source": "await redis.hgetall(key)",
        "glide": "await client.hgetall(key)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hincrBy(...)",
      "equivalent": {
        "glide": "client.hincrBy(...)"
      },
      "description": "Execute hincrBy command",
      "examples": {
        "source": "await redis.hincrBy(...)",
        "glide": "await client.hincrBy(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hincrByFloat(...)",
      "equivalent": {
        "glide": "client.hincrByFloat(...)"
      },
      "description": "Execute hincrByFloat command",
      "examples": {
        "source": "await redis.hincrByFloat(...)",
        "glide": "await client.hincrByFloat(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hlen(...)",
      "equivalent": {
        "glide": "client.hlen(...)"
      },
      "description": "Execute hlen command",
      "examples": {
        "source": "await redis.hlen(...)",
        "glide": "await client.hlen(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hvals(key)",
      "equivalent": {
        "glide": "client.hvals(key)"
      },
      "description": "Execute hvals command",
      "examples": {
        "source": "await redis.hvals(key)",
        "glide": "await client.hvals(key)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hstrlen(...)",
      "equivalent": {
        "glide": "client.hstrlen(...)"
      },
      "description": "Execute hstrlen command",
      "examples": {
        "source": "await redis.hstrlen(...)",
        "glide": "await client.hstrlen(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hrandfield(...)",
      "equivalent": {
        "glide": "client.hrandfield(...)"
      },
      "description": "Execute hrandfield command",
      "examples": {
        "source": "await redis.hrandfield(...)",
        "glide": "await client.hrandfield(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hscan(...)",
      "equivalent": {
        "glide": "client.hscan(...)"
      },
      "description": "Execute hscan command",
      "examples": {
        "source": "await redis.hscan(...)",
        "glide": "await client.hscan(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hrandfieldCount(...)",
      "equivalent": {
        "glide": "client.hrandfieldCount(...)"
      },
      "description": "Execute hrandfieldCount command",
      "examples": {
        "source": "await redis.hrandfieldCount(...)",
        "glide": "await client.hrandfieldCount(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "redis.hrandfieldWithValues(...)",
      "equivalent": {
        "glide": "client.hrandfieldWithValues(...)"
      },
      "description": "Execute hrandfieldWithValues command",
      "examples": {
        "source": "await redis.hrandfieldWithValues(...)",
        "glide": "await client.hrandfieldWithValues(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.lpush(key, ...elements)",
      "equivalent": {
        "glide": "client.lpush(key, ...elements)"
      },
      "description": "Execute lpush command",
      "examples": {
        "source": "await redis.lpush(key, ...elements)",
        "glide": "await client.lpush(key, ...elements)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.lpushx(...)",
      "equivalent": {
        "glide": "client.lpushx(...)"
      },
      "description": "Execute lpushx command",
      "examples": {
        "source": "await redis.lpushx(...)",
        "glide": "await client.lpushx(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.lpop(key, count?)",
      "equivalent": {
        "glide": "client.lpop(key, count?)"
      },
      "description": "Execute lpop command",
      "examples": {
        "source": "await redis.lpop(key, count?)",
        "glide": "await client.lpop(key, count?)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.lpopCount(...)",
      "equivalent": {
        "glide": "client.lpopCount(...)"
      },
      "description": "Execute lpopCount command",
      "examples": {
        "source": "await redis.lpopCount(...)",
        "glide": "await client.lpopCount(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.lrange(key, start, stop)",
      "equivalent": {
        "glide": "client.lrange(key, start, stop)"
      },
      "description": "Execute lrange command",
      "examples": {
        "source": "await redis.lrange(key, start, stop)",
        "glide": "await client.lrange(key, start, stop)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.llen(...)",
      "equivalent": {
        "glide": "client.llen(...)"
      },
      "description": "Execute llen command",
      "examples": {
        "source": "await redis.llen(...)",
        "glide": "await client.llen(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.lmove(...)",
      "equivalent": {
        "glide": "client.lmove(...)"
      },
      "description": "Execute lmove command",
      "examples": {
        "source": "await redis.lmove(...)",
        "glide": "await client.lmove(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.blmove(...)",
      "equivalent": {
        "glide": "client.blmove(...)"
      },
      "description": "Execute blmove command",
      "examples": {
        "source": "await redis.blmove(...)",
        "glide": "await client.blmove(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.lset(key, index, element)",
      "equivalent": {
        "glide": "client.lset(key, index, element)"
      },
      "description": "Execute lset command",
      "examples": {
        "source": "await redis.lset(key, index, element)",
        "glide": "await client.lset(key, index, element)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.ltrim(...)",
      "equivalent": {
        "glide": "client.ltrim(...)"
      },
      "description": "Execute ltrim command",
      "examples": {
        "source": "await redis.ltrim(...)",
        "glide": "await client.ltrim(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.lrem(...)",
      "equivalent": {
        "glide": "client.lrem(...)"
      },
      "description": "Execute lrem command",
      "examples": {
        "source": "await redis.lrem(...)",
        "glide": "await client.lrem(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.rpush(key, ...elements)",
      "equivalent": {
        "glide": "client.rpush(key, ...elements)"
      },
      "description": "Execute rpush command",
      "examples": {
        "source": "await redis.rpush(key, ...elements)",
        "glide": "await client.rpush(key, ...elements)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.rpushx(...)",
      "equivalent": {
        "glide": "client.rpushx(...)"
      },
      "description": "Execute rpushx command",
      "examples": {
        "source": "await redis.rpushx(...)",
        "glide": "await client.rpushx(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.rpop(key, count?)",
      "equivalent": {
        "glide": "client.rpop(key, count?)"
      },
      "description": "Execute rpop command",
      "examples": {
        "source": "await redis.rpop(key, count?)",
        "glide": "await client.rpop(key, count?)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.rpopCount(...)",
      "equivalent": {
        "glide": "client.rpopCount(...)"
      },
      "description": "Execute rpopCount command",
      "examples": {
        "source": "await redis.rpopCount(...)",
        "glide": "await client.rpopCount(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.sadd(key, ...members)",
      "equivalent": {
        "glide": "client.sadd(key, ...members)"
      },
      "description": "Execute sadd command",
      "examples": {
        "source": "await redis.sadd(key, ...members)",
        "glide": "await client.sadd(key, ...members)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.srem(key, ...members)",
      "equivalent": {
        "glide": "client.srem(key, ...members)"
      },
      "description": "Execute srem command",
      "examples": {
        "source": "await redis.srem(key, ...members)",
        "glide": "await client.srem(key, ...members)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.sscan(...)",
      "equivalent": {
        "glide": "client.sscan(...)"
      },
      "description": "Execute sscan command",
      "examples": {
        "source": "await redis.sscan(...)",
        "glide": "await client.sscan(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.smembers(key)",
      "equivalent": {
        "glide": "client.smembers(key)"
      },
      "description": "Execute smembers command",
      "examples": {
        "source": "await redis.smembers(key)",
        "glide": "await client.smembers(key)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.smove(...)",
      "equivalent": {
        "glide": "client.smove(...)"
      },
      "description": "Execute smove command",
      "examples": {
        "source": "await redis.smove(...)",
        "glide": "await client.smove(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.scard(key)",
      "equivalent": {
        "glide": "client.scard(key)"
      },
      "description": "Execute scard command",
      "examples": {
        "source": "await redis.scard(key)",
        "glide": "await client.scard(key)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.sinter(...keys)",
      "equivalent": {
        "glide": "client.sinter(...keys)"
      },
      "description": "Execute sinter command",
      "examples": {
        "source": "await redis.sinter(...keys)",
        "glide": "await client.sinter(...keys)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.sintercard(...)",
      "equivalent": {
        "glide": "client.sintercard(...)"
      },
      "description": "Execute sintercard command",
      "examples": {
        "source": "await redis.sintercard(...)",
        "glide": "await client.sintercard(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.sinterstore(...)",
      "equivalent": {
        "glide": "client.sinterstore(...)"
      },
      "description": "Execute sinterstore command",
      "examples": {
        "source": "await redis.sinterstore(...)",
        "glide": "await client.sinterstore(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.sdiff(...keys)",
      "equivalent": {
        "glide": "client.sdiff(...keys)"
      },
      "description": "Execute sdiff command",
      "examples": {
        "source": "await redis.sdiff(...keys)",
        "glide": "await client.sdiff(...keys)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.sdiffstore(...)",
      "equivalent": {
        "glide": "client.sdiffstore(...)"
      },
      "description": "Execute sdiffstore command",
      "examples": {
        "source": "await redis.sdiffstore(...)",
        "glide": "await client.sdiffstore(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.sunion(...keys)",
      "equivalent": {
        "glide": "client.sunion(...keys)"
      },
      "description": "Execute sunion command",
      "examples": {
        "source": "await redis.sunion(...keys)",
        "glide": "await client.sunion(...keys)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.sunionstore(...)",
      "equivalent": {
        "glide": "client.sunionstore(...)"
      },
      "description": "Execute sunionstore command",
      "examples": {
        "source": "await redis.sunionstore(...)",
        "glide": "await client.sunionstore(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.sismember(key, member)",
      "equivalent": {
        "glide": "client.sismember(key, member)"
      },
      "description": "Execute sismember command",
      "examples": {
        "source": "await redis.sismember(key, member)",
        "glide": "await client.sismember(key, member)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.smismember(...)",
      "equivalent": {
        "glide": "client.smismember(...)"
      },
      "description": "Execute smismember command",
      "examples": {
        "source": "await redis.smismember(...)",
        "glide": "await client.smismember(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.spop(...)",
      "equivalent": {
        "glide": "client.spop(...)"
      },
      "description": "Execute spop command",
      "examples": {
        "source": "await redis.spop(...)",
        "glide": "await client.spop(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.spopCount(...)",
      "equivalent": {
        "glide": "client.spopCount(...)"
      },
      "description": "Execute spopCount command",
      "examples": {
        "source": "await redis.spopCount(...)",
        "glide": "await client.spopCount(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.srandmember(...)",
      "equivalent": {
        "glide": "client.srandmember(...)"
      },
      "description": "Execute srandmember command",
      "examples": {
        "source": "await redis.srandmember(...)",
        "glide": "await client.srandmember(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "redis.srandmemberCount(...)",
      "equivalent": {
        "glide": "client.srandmemberCount(...)"
      },
      "description": "Execute srandmemberCount command",
      "examples": {
        "source": "await redis.srandmemberCount(...)",
        "glide": "await client.srandmemberCount(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.exists(key)",
      "equivalent": {
        "glide": "client.exists(key)"
      },
      "description": "Execute exists command",
      "examples": {
        "source": "await redis.exists(key)",
        "glide": "await client.exists(key)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.unlink(...)",
      "equivalent": {
        "glide": "client.unlink(...)"
      },
      "description": "Execute unlink command",
      "examples": {
        "source": "await redis.unlink(...)",
        "glide": "await client.unlink(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.expire(...)",
      "equivalent": {
        "glide": "client.expire(...)"
      },
      "description": "Execute expire command",
      "examples": {
        "source": "await redis.expire(...)",
        "glide": "await client.expire(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.expireAt(...)",
      "equivalent": {
        "glide": "client.expireAt(...)"
      },
      "description": "Execute expireAt command",
      "examples": {
        "source": "await redis.expireAt(...)",
        "glide": "await client.expireAt(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.expiretime(...)",
      "equivalent": {
        "glide": "client.expiretime(...)"
      },
      "description": "Execute expiretime command",
      "examples": {
        "source": "await redis.expiretime(...)",
        "glide": "await client.expiretime(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.pexpire(...)",
      "equivalent": {
        "glide": "client.pexpire(...)"
      },
      "description": "Execute pexpire command",
      "examples": {
        "source": "await redis.pexpire(...)",
        "glide": "await client.pexpire(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.pexpireAt(...)",
      "equivalent": {
        "glide": "client.pexpireAt(...)"
      },
      "description": "Execute pexpireAt command",
      "examples": {
        "source": "await redis.pexpireAt(...)",
        "glide": "await client.pexpireAt(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.pexpiretime(...)",
      "equivalent": {
        "glide": "client.pexpiretime(...)"
      },
      "description": "Execute pexpiretime command",
      "examples": {
        "source": "await redis.pexpiretime(...)",
        "glide": "await client.pexpiretime(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.ttl(key)",
      "equivalent": {
        "glide": "client.ttl(key)"
      },
      "description": "Execute ttl command",
      "examples": {
        "source": "await redis.ttl(key)",
        "glide": "await client.ttl(key)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.invokeScript(...)",
      "equivalent": {
        "glide": "client.invokeScript(...)"
      },
      "description": "Execute invokeScript command",
      "examples": {
        "source": "await redis.invokeScript(...)",
        "glide": "await client.invokeScript(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.scriptShow(...)",
      "equivalent": {
        "glide": "client.scriptShow(...)"
      },
      "description": "Execute scriptShow command",
      "examples": {
        "source": "await redis.scriptShow(...)",
        "glide": "await client.scriptShow(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xrange(...)",
      "equivalent": {
        "glide": "client.xrange(...)"
      },
      "description": "Execute xrange command",
      "examples": {
        "source": "await redis.xrange(...)",
        "glide": "await client.xrange(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xrevrange(...)",
      "equivalent": {
        "glide": "client.xrevrange(...)"
      },
      "description": "Execute xrevrange command",
      "examples": {
        "source": "await redis.xrevrange(...)",
        "glide": "await client.xrevrange(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zadd(key, membersScores)",
      "equivalent": {
        "glide": "client.zadd(key, membersScores)"
      },
      "description": "Execute zadd command",
      "examples": {
        "source": "await redis.zadd(key, membersScores)",
        "glide": "await client.zadd(key, membersScores)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zaddIncr(...)",
      "equivalent": {
        "glide": "client.zaddIncr(...)"
      },
      "description": "Execute zaddIncr command",
      "examples": {
        "source": "await redis.zaddIncr(...)",
        "glide": "await client.zaddIncr(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zrem(key, ...members)",
      "equivalent": {
        "glide": "client.zrem(key, ...members)"
      },
      "description": "Execute zrem command",
      "examples": {
        "source": "await redis.zrem(key, ...members)",
        "glide": "await client.zrem(key, ...members)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zcard(...)",
      "equivalent": {
        "glide": "client.zcard(...)"
      },
      "description": "Execute zcard command",
      "examples": {
        "source": "await redis.zcard(...)",
        "glide": "await client.zcard(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zintercard(...)",
      "equivalent": {
        "glide": "client.zintercard(...)"
      },
      "description": "Execute zintercard command",
      "examples": {
        "source": "await redis.zintercard(...)",
        "glide": "await client.zintercard(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zdiff(...)",
      "equivalent": {
        "glide": "client.zdiff(...)"
      },
      "description": "Execute zdiff command",
      "examples": {
        "source": "await redis.zdiff(...)",
        "glide": "await client.zdiff(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zdiffWithScores(...)",
      "equivalent": {
        "glide": "client.zdiffWithScores(...)"
      },
      "description": "Execute zdiffWithScores command",
      "examples": {
        "source": "await redis.zdiffWithScores(...)",
        "glide": "await client.zdiffWithScores(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zdiffstore(...)",
      "equivalent": {
        "glide": "client.zdiffstore(...)"
      },
      "description": "Execute zdiffstore command",
      "examples": {
        "source": "await redis.zdiffstore(...)",
        "glide": "await client.zdiffstore(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zscore(key, member)",
      "equivalent": {
        "glide": "client.zscore(key, member)"
      },
      "description": "Execute zscore command",
      "examples": {
        "source": "await redis.zscore(key, member)",
        "glide": "await client.zscore(key, member)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zunionstore(...)",
      "equivalent": {
        "glide": "client.zunionstore(...)"
      },
      "description": "Execute zunionstore command",
      "examples": {
        "source": "await redis.zunionstore(...)",
        "glide": "await client.zunionstore(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.zmscore(...)",
      "equivalent": {
        "glide": "client.zmscore(...)"
      },
      "description": "Execute zmscore command",
      "examples": {
        "source": "await redis.zmscore(...)",
        "glide": "await client.zmscore(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zcount(...)",
      "equivalent": {
        "glide": "client.zcount(...)"
      },
      "description": "Execute zcount command",
      "examples": {
        "source": "await redis.zcount(...)",
        "glide": "await client.zcount(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zrange(key, start, stop, options?)",
      "equivalent": {
        "glide": "client.zrange(key, start, stop, options?)"
      },
      "description": "Execute zrange command",
      "examples": {
        "source": "await redis.zrange(key, start, stop, options?)",
        "glide": "await client.zrange(key, start, stop, options?)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zrangeWithScores(...)",
      "equivalent": {
        "glide": "client.zrangeWithScores(...)"
      },
      "description": "Execute zrangeWithScores command",
      "examples": {
        "source": "await redis.zrangeWithScores(...)",
        "glide": "await client.zrangeWithScores(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zrangeStore(...)",
      "equivalent": {
        "glide": "client.zrangeStore(...)"
      },
      "description": "Execute zrangeStore command",
      "examples": {
        "source": "await redis.zrangeStore(...)",
        "glide": "await client.zrangeStore(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zinterstore(...)",
      "equivalent": {
        "glide": "client.zinterstore(...)"
      },
      "description": "Execute zinterstore command",
      "examples": {
        "source": "await redis.zinterstore(...)",
        "glide": "await client.zinterstore(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zinter(...)",
      "equivalent": {
        "glide": "client.zinter(...)"
      },
      "description": "Execute zinter command",
      "examples": {
        "source": "await redis.zinter(...)",
        "glide": "await client.zinter(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zinterWithScores(...)",
      "equivalent": {
        "glide": "client.zinterWithScores(...)"
      },
      "description": "Execute zinterWithScores command",
      "examples": {
        "source": "await redis.zinterWithScores(...)",
        "glide": "await client.zinterWithScores(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zunion(...)",
      "equivalent": {
        "glide": "client.zunion(...)"
      },
      "description": "Execute zunion command",
      "examples": {
        "source": "await redis.zunion(...)",
        "glide": "await client.zunion(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zunionWithScores(...)",
      "equivalent": {
        "glide": "client.zunionWithScores(...)"
      },
      "description": "Execute zunionWithScores command",
      "examples": {
        "source": "await redis.zunionWithScores(...)",
        "glide": "await client.zunionWithScores(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zrandmember(...)",
      "equivalent": {
        "glide": "client.zrandmember(...)"
      },
      "description": "Execute zrandmember command",
      "examples": {
        "source": "await redis.zrandmember(...)",
        "glide": "await client.zrandmember(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zrandmemberWithCount(...)",
      "equivalent": {
        "glide": "client.zrandmemberWithCount(...)"
      },
      "description": "Execute zrandmemberWithCount command",
      "examples": {
        "source": "await redis.zrandmemberWithCount(...)",
        "glide": "await client.zrandmemberWithCount(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zrandmemberWithCountWithScores(...)",
      "equivalent": {
        "glide": "client.zrandmemberWithCountWithScores(...)"
      },
      "description": "Execute zrandmemberWithCountWithScores command",
      "examples": {
        "source": "await redis.zrandmemberWithCountWithScores(...)",
        "glide": "await client.zrandmemberWithCountWithScores(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.strlen(...)",
      "equivalent": {
        "glide": "client.strlen(...)"
      },
      "description": "Execute strlen command",
      "examples": {
        "source": "await redis.strlen(...)",
        "glide": "await client.strlen(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.type(key)",
      "equivalent": {
        "glide": "client.type(key)"
      },
      "description": "Execute type command",
      "examples": {
        "source": "await redis.type(key)",
        "glide": "await client.type(key)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zpopmin(...)",
      "equivalent": {
        "glide": "client.zpopmin(...)"
      },
      "description": "Execute zpopmin command",
      "examples": {
        "source": "await redis.zpopmin(...)",
        "glide": "await client.zpopmin(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.bzpopmin(...)",
      "equivalent": {
        "glide": "client.bzpopmin(...)"
      },
      "description": "Execute bzpopmin command",
      "examples": {
        "source": "await redis.bzpopmin(...)",
        "glide": "await client.bzpopmin(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zpopmax(...)",
      "equivalent": {
        "glide": "client.zpopmax(...)"
      },
      "description": "Execute zpopmax command",
      "examples": {
        "source": "await redis.zpopmax(...)",
        "glide": "await client.zpopmax(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.bzpopmax(...)",
      "equivalent": {
        "glide": "client.bzpopmax(...)"
      },
      "description": "Execute bzpopmax command",
      "examples": {
        "source": "await redis.bzpopmax(...)",
        "glide": "await client.bzpopmax(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.pttl(...)",
      "equivalent": {
        "glide": "client.pttl(...)"
      },
      "description": "Execute pttl command",
      "examples": {
        "source": "await redis.pttl(...)",
        "glide": "await client.pttl(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zremRangeByRank(...)",
      "equivalent": {
        "glide": "client.zremRangeByRank(...)"
      },
      "description": "Execute zremRangeByRank command",
      "examples": {
        "source": "await redis.zremRangeByRank(...)",
        "glide": "await client.zremRangeByRank(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zremRangeByLex(...)",
      "equivalent": {
        "glide": "client.zremRangeByLex(...)"
      },
      "description": "Execute zremRangeByLex command",
      "examples": {
        "source": "await redis.zremRangeByLex(...)",
        "glide": "await client.zremRangeByLex(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zremRangeByScore(...)",
      "equivalent": {
        "glide": "client.zremRangeByScore(...)"
      },
      "description": "Execute zremRangeByScore command",
      "examples": {
        "source": "await redis.zremRangeByScore(...)",
        "glide": "await client.zremRangeByScore(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.zlexcount(...)",
      "equivalent": {
        "glide": "client.zlexcount(...)"
      },
      "description": "Execute zlexcount command",
      "examples": {
        "source": "await redis.zlexcount(...)",
        "glide": "await client.zlexcount(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zrank(key, member)",
      "equivalent": {
        "glide": "client.zrank(key, member)"
      },
      "description": "Execute zrank command",
      "examples": {
        "source": "await redis.zrank(key, member)",
        "glide": "await client.zrank(key, member)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zrankWithScore(...)",
      "equivalent": {
        "glide": "client.zrankWithScore(...)"
      },
      "description": "Execute zrankWithScore command",
      "examples": {
        "source": "await redis.zrankWithScore(...)",
        "glide": "await client.zrankWithScore(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zrevrank(...)",
      "equivalent": {
        "glide": "client.zrevrank(...)"
      },
      "description": "Execute zrevrank command",
      "examples": {
        "source": "await redis.zrevrank(...)",
        "glide": "await client.zrevrank(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zrevrankWithScore(...)",
      "equivalent": {
        "glide": "client.zrevrankWithScore(...)"
      },
      "description": "Execute zrevrankWithScore command",
      "examples": {
        "source": "await redis.zrevrankWithScore(...)",
        "glide": "await client.zrevrankWithScore(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xadd(key, entries, options?)",
      "equivalent": {
        "glide": "client.xadd(key, entries, options?)"
      },
      "description": "Execute xadd command",
      "examples": {
        "source": "await redis.xadd(key, entries, options?)",
        "glide": "await client.xadd(key, entries, options?)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xdel(...)",
      "equivalent": {
        "glide": "client.xdel(...)"
      },
      "description": "Execute xdel command",
      "examples": {
        "source": "await redis.xdel(...)",
        "glide": "await client.xdel(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xtrim(...)",
      "equivalent": {
        "glide": "client.xtrim(...)"
      },
      "description": "Execute xtrim command",
      "examples": {
        "source": "await redis.xtrim(...)",
        "glide": "await client.xtrim(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xread(keys, options?)",
      "equivalent": {
        "glide": "client.xread(keys, options?)"
      },
      "description": "Execute xread command",
      "examples": {
        "source": "await redis.xread(keys, options?)",
        "glide": "await client.xread(keys, options?)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xreadgroup(group, consumer, keys, options?)",
      "equivalent": {
        "glide": "client.xreadgroup(group, consumer, keys, options?)"
      },
      "description": "Execute xreadgroup command",
      "examples": {
        "source": "await redis.xreadgroup(group, consumer, keys, options?)",
        "glide": "await client.xreadgroup(group, consumer, keys, options?)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xlen(...)",
      "equivalent": {
        "glide": "client.xlen(...)"
      },
      "description": "Execute xlen command",
      "examples": {
        "source": "await redis.xlen(...)",
        "glide": "await client.xlen(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xpending(...)",
      "equivalent": {
        "glide": "client.xpending(...)"
      },
      "description": "Execute xpending command",
      "examples": {
        "source": "await redis.xpending(...)",
        "glide": "await client.xpending(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xpendingWithOptions(...)",
      "equivalent": {
        "glide": "client.xpendingWithOptions(...)"
      },
      "description": "Execute xpendingWithOptions command",
      "examples": {
        "source": "await redis.xpendingWithOptions(...)",
        "glide": "await client.xpendingWithOptions(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xinfoConsumers(...)",
      "equivalent": {
        "glide": "client.xinfoConsumers(...)"
      },
      "description": "Execute xinfoConsumers command",
      "examples": {
        "source": "await redis.xinfoConsumers(...)",
        "glide": "await client.xinfoConsumers(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xinfoGroups(...)",
      "equivalent": {
        "glide": "client.xinfoGroups(...)"
      },
      "description": "Execute xinfoGroups command",
      "examples": {
        "source": "await redis.xinfoGroups(...)",
        "glide": "await client.xinfoGroups(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xclaim(...)",
      "equivalent": {
        "glide": "client.xclaim(...)"
      },
      "description": "Execute xclaim command",
      "examples": {
        "source": "await redis.xclaim(...)",
        "glide": "await client.xclaim(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.xautoclaim(...)",
      "equivalent": {
        "glide": "client.xautoclaim(...)"
      },
      "description": "Execute xautoclaim command",
      "examples": {
        "source": "await redis.xautoclaim(...)",
        "glide": "await client.xautoclaim(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.xautoclaimJustId(...)",
      "equivalent": {
        "glide": "client.xautoclaimJustId(...)"
      },
      "description": "Execute xautoclaimJustId command",
      "examples": {
        "source": "await redis.xautoclaimJustId(...)",
        "glide": "await client.xautoclaimJustId(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xclaimJustId(...)",
      "equivalent": {
        "glide": "client.xclaimJustId(...)"
      },
      "description": "Execute xclaimJustId command",
      "examples": {
        "source": "await redis.xclaimJustId(...)",
        "glide": "await client.xclaimJustId(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xgroupCreate(...)",
      "equivalent": {
        "glide": "client.xgroupCreate(...)"
      },
      "description": "Execute xgroupCreate command",
      "examples": {
        "source": "await redis.xgroupCreate(...)",
        "glide": "await client.xgroupCreate(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xgroupDestroy(...)",
      "equivalent": {
        "glide": "client.xgroupDestroy(...)"
      },
      "description": "Execute xgroupDestroy command",
      "examples": {
        "source": "await redis.xgroupDestroy(...)",
        "glide": "await client.xgroupDestroy(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xinfoStream(...)",
      "equivalent": {
        "glide": "client.xinfoStream(...)"
      },
      "description": "Execute xinfoStream command",
      "examples": {
        "source": "await redis.xinfoStream(...)",
        "glide": "await client.xinfoStream(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xgroupCreateConsumer(...)",
      "equivalent": {
        "glide": "client.xgroupCreateConsumer(...)"
      },
      "description": "Execute xgroupCreateConsumer command",
      "examples": {
        "source": "await redis.xgroupCreateConsumer(...)",
        "glide": "await client.xgroupCreateConsumer(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xgroupDelConsumer(...)",
      "equivalent": {
        "glide": "client.xgroupDelConsumer(...)"
      },
      "description": "Execute xgroupDelConsumer command",
      "examples": {
        "source": "await redis.xgroupDelConsumer(...)",
        "glide": "await client.xgroupDelConsumer(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xack(...)",
      "equivalent": {
        "glide": "client.xack(...)"
      },
      "description": "Execute xack command",
      "examples": {
        "source": "await redis.xack(...)",
        "glide": "await client.xack(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "redis.xgroupSetId(...)",
      "equivalent": {
        "glide": "client.xgroupSetId(...)"
      },
      "description": "Execute xgroupSetId command",
      "examples": {
        "source": "await redis.xgroupSetId(...)",
        "glide": "await client.xgroupSetId(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.lindex(key, index)",
      "equivalent": {
        "glide": "client.lindex(key, index)"
      },
      "description": "Execute lindex command",
      "examples": {
        "source": "await redis.lindex(key, index)",
        "glide": "await client.lindex(key, index)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.linsert(...)",
      "equivalent": {
        "glide": "client.linsert(...)"
      },
      "description": "Execute linsert command",
      "examples": {
        "source": "await redis.linsert(...)",
        "glide": "await client.linsert(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.persist(...)",
      "equivalent": {
        "glide": "client.persist(...)"
      },
      "description": "Execute persist command",
      "examples": {
        "source": "await redis.persist(...)",
        "glide": "await client.persist(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.rename(...)",
      "equivalent": {
        "glide": "client.rename(...)"
      },
      "description": "Execute rename command",
      "examples": {
        "source": "await redis.rename(...)",
        "glide": "await client.rename(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.renamenx(...)",
      "equivalent": {
        "glide": "client.renamenx(...)"
      },
      "description": "Execute renamenx command",
      "examples": {
        "source": "await redis.renamenx(...)",
        "glide": "await client.renamenx(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.brpop(...)",
      "equivalent": {
        "glide": "client.brpop(...)"
      },
      "description": "Execute brpop command",
      "examples": {
        "source": "await redis.brpop(...)",
        "glide": "await client.brpop(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "redis.blpop(...)",
      "equivalent": {
        "glide": "client.blpop(...)"
      },
      "description": "Execute blpop command",
      "examples": {
        "source": "await redis.blpop(...)",
        "glide": "await client.blpop(...)"
      }
    },
    {
      "category": "hyperloglog",
      "symbol": "redis.pfadd(...)",
      "equivalent": {
        "glide": "client.pfadd(...)"
      },
      "description": "Execute pfadd command",
      "examples": {
        "source": "await redis.pfadd(...)",
        "glide": "await client.pfadd(...)"
      }
    },
    {
      "category": "hyperloglog",
      "symbol": "redis.pfcount(...)",
      "equivalent": {
        "glide": "client.pfcount(...)"
      },
      "description": "Execute pfcount command",
      "examples": {
        "source": "await redis.pfcount(...)",
        "glide": "await client.pfcount(...)"
      }
    },
    {
      "category": "hyperloglog",
      "symbol": "redis.pfmerge(...)",
      "equivalent": {
        "glide": "client.pfmerge(...)"
      },
      "description": "Execute pfmerge command",
      "examples": {
        "source": "await redis.pfmerge(...)",
        "glide": "await client.pfmerge(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.objectEncoding(...)",
      "equivalent": {
        "glide": "client.objectEncoding(...)"
      },
      "description": "Execute objectEncoding command",
      "examples": {
        "source": "await redis.objectEncoding(...)",
        "glide": "await client.objectEncoding(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.objectFreq(...)",
      "equivalent": {
        "glide": "client.objectFreq(...)"
      },
      "description": "Execute objectFreq command",
      "examples": {
        "source": "await redis.objectFreq(...)",
        "glide": "await client.objectFreq(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.objectIdletime(...)",
      "equivalent": {
        "glide": "client.objectIdletime(...)"
      },
      "description": "Execute objectIdletime command",
      "examples": {
        "source": "await redis.objectIdletime(...)",
        "glide": "await client.objectIdletime(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.objectRefcount(...)",
      "equivalent": {
        "glide": "client.objectRefcount(...)"
      },
      "description": "Execute objectRefcount command",
      "examples": {
        "source": "await redis.objectRefcount(...)",
        "glide": "await client.objectRefcount(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.fcall(...)",
      "equivalent": {
        "glide": "client.fcall(...)"
      },
      "description": "Execute fcall command",
      "examples": {
        "source": "await redis.fcall(...)",
        "glide": "await client.fcall(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.fcallReadonly(...)",
      "equivalent": {
        "glide": "client.fcallReadonly(...)"
      },
      "description": "Execute fcallReadonly command",
      "examples": {
        "source": "await redis.fcallReadonly(...)",
        "glide": "await client.fcallReadonly(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.lpos(...)",
      "equivalent": {
        "glide": "client.lpos(...)"
      },
      "description": "Execute lpos command",
      "examples": {
        "source": "await redis.lpos(...)",
        "glide": "await client.lpos(...)"
      }
    },
    {
      "category": "bitmap",
      "symbol": "redis.bitcount(...)",
      "equivalent": {
        "glide": "client.bitcount(...)"
      },
      "description": "Execute bitcount command",
      "examples": {
        "source": "await redis.bitcount(...)",
        "glide": "await client.bitcount(...)"
      }
    },
    {
      "category": "geo",
      "symbol": "redis.geoadd(...)",
      "equivalent": {
        "glide": "client.geoadd(...)"
      },
      "description": "Execute geoadd command - NOTE: GLIDE expects a Map, not array/object",
      "examples": {
        "source": "await redis.geoadd('key', { long: 13.361, lat: 38.115, member: 'Palermo' })",
        "glide": "await client.geoadd('key', new Map([['Palermo', { longitude: 13.361, latitude: 38.115 }]]))"
      }
    },
    {
      "category": "geo",
      "symbol": "redis.geosearch(...)",
      "equivalent": {
        "glide": "client.geosearch(...)"
      },
      "description": "Execute geosearch command",
      "examples": {
        "source": "await redis.geosearch(...)",
        "glide": "await client.geosearch(...)"
      }
    },
    {
      "category": "geo",
      "symbol": "redis.geosearchstore(...)",
      "equivalent": {
        "glide": "client.geosearchstore(...)"
      },
      "description": "Execute geosearchstore command",
      "examples": {
        "source": "await redis.geosearchstore(...)",
        "glide": "await client.geosearchstore(...)"
      }
    },
    {
      "category": "geo",
      "symbol": "redis.geopos(...)",
      "equivalent": {
        "glide": "client.geopos(...)"
      },
      "description": "Execute geopos command",
      "examples": {
        "source": "await redis.geopos(...)",
        "glide": "await client.geopos(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.zmpop(...)",
      "equivalent": {
        "glide": "client.zmpop(...)"
      },
      "description": "Execute zmpop command",
      "examples": {
        "source": "await redis.zmpop(...)",
        "glide": "await client.zmpop(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.bzmpop(...)",
      "equivalent": {
        "glide": "client.bzmpop(...)"
      },
      "description": "Execute bzmpop command",
      "examples": {
        "source": "await redis.bzmpop(...)",
        "glide": "await client.bzmpop(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zincrby(...)",
      "equivalent": {
        "glide": "client.zincrby(...)"
      },
      "description": "Execute zincrby command",
      "examples": {
        "source": "await redis.zincrby(...)",
        "glide": "await client.zincrby(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "redis.zscan(...)",
      "equivalent": {
        "glide": "client.zscan(...)"
      },
      "description": "Execute zscan command",
      "examples": {
        "source": "await redis.zscan(...)",
        "glide": "await client.zscan(...)"
      }
    },
    {
      "category": "geo",
      "symbol": "redis.geodist(...)",
      "equivalent": {
        "glide": "client.geodist(...)"
      },
      "description": "Execute geodist command",
      "examples": {
        "source": "await redis.geodist(...)",
        "glide": "await client.geodist(...)"
      }
    },
    {
      "category": "geo",
      "symbol": "redis.geohash(...)",
      "equivalent": {
        "glide": "client.geohash(...)"
      },
      "description": "Execute geohash command",
      "examples": {
        "source": "await redis.geohash(...)",
        "glide": "await client.geohash(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.lcs(...)",
      "equivalent": {
        "glide": "client.lcs(...)"
      },
      "description": "Execute lcs command",
      "examples": {
        "source": "await redis.lcs(...)",
        "glide": "await client.lcs(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.lcsLen(...)",
      "equivalent": {
        "glide": "client.lcsLen(...)"
      },
      "description": "Execute lcsLen command",
      "examples": {
        "source": "await redis.lcsLen(...)",
        "glide": "await client.lcsLen(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.lcsIdx(...)",
      "equivalent": {
        "glide": "client.lcsIdx(...)"
      },
      "description": "Execute lcsIdx command",
      "examples": {
        "source": "await redis.lcsIdx(...)",
        "glide": "await client.lcsIdx(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.touch(...)",
      "equivalent": {
        "glide": "client.touch(...)"
      },
      "description": "Execute touch command",
      "examples": {
        "source": "await redis.touch(...)",
        "glide": "await client.touch(...)"
      }
    },
    {
      "category": "transactions",
      "symbol": "redis.watch(...)",
      "equivalent": {
        "glide": "client.watch(...)"
      },
      "description": "Execute watch command",
      "examples": {
        "source": "await redis.watch(...)",
        "glide": "await client.watch(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.wait(...)",
      "equivalent": {
        "glide": "client.wait(...)"
      },
      "description": "Execute wait command",
      "examples": {
        "source": "await redis.wait(...)",
        "glide": "await client.wait(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.setrange(...)",
      "equivalent": {
        "glide": "client.setrange(...)"
      },
      "description": "Execute setrange command",
      "examples": {
        "source": "await redis.setrange(...)",
        "glide": "await client.setrange(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.append(...)",
      "equivalent": {
        "glide": "client.append(...)"
      },
      "description": "Execute append command",
      "examples": {
        "source": "await redis.append(...)",
        "glide": "await client.append(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.lmpop(...)",
      "equivalent": {
        "glide": "client.lmpop(...)"
      },
      "description": "Execute lmpop command",
      "examples": {
        "source": "await redis.lmpop(...)",
        "glide": "await client.lmpop(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.blmpop(...)",
      "equivalent": {
        "glide": "client.blmpop(...)"
      },
      "description": "Execute blmpop command",
      "examples": {
        "source": "await redis.blmpop(...)",
        "glide": "await client.blmpop(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "redis.pubsubChannels(...)",
      "equivalent": {
        "glide": "client.pubsubChannels(...)"
      },
      "description": "Execute pubsubChannels command",
      "examples": {
        "source": "await redis.pubsubChannels(...)",
        "glide": "await client.pubsubChannels(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "redis.pubsubNumPat(...)",
      "equivalent": {
        "glide": "client.pubsubNumPat(...)"
      },
      "description": "Execute pubsubNumPat command",
      "examples": {
        "source": "await redis.pubsubNumPat(...)",
        "glide": "await client.pubsubNumPat(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "redis.pubsubNumSub(...)",
      "equivalent": {
        "glide": "client.pubsubNumSub(...)"
      },
      "description": "Execute pubsubNumSub command",
      "examples": {
        "source": "await redis.pubsubNumSub(...)",
        "glide": "await client.pubsubNumSub(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.sort(...)",
      "equivalent": {
        "glide": "client.sort(...)"
      },
      "description": "Execute sort command",
      "examples": {
        "source": "await redis.sort(...)",
        "glide": "await client.sort(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.sortReadOnly(...)",
      "equivalent": {
        "glide": "client.sortReadOnly(...)"
      },
      "description": "Execute sortReadOnly command",
      "examples": {
        "source": "await redis.sortReadOnly(...)",
        "glide": "await client.sortReadOnly(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.sortStore(...)",
      "equivalent": {
        "glide": "client.sortStore(...)"
      },
      "description": "Execute sortStore command",
      "examples": {
        "source": "await redis.sortStore(...)",
        "glide": "await client.sortStore(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.createClientRequest(...)",
      "equivalent": {
        "glide": "client.createClientRequest(...)"
      },
      "description": "Execute createClientRequest command",
      "examples": {
        "source": "await redis.createClientRequest(...)",
        "glide": "await client.createClientRequest(...)"
      }
    },
    {
      "category": "server",
      "symbol": "redis.configureAdvancedConfigurationBase(...)",
      "equivalent": {
        "glide": "client.configureAdvancedConfigurationBase(...)"
      },
      "description": "Execute configureAdvancedConfigurationBase command",
      "examples": {
        "source": "await redis.configureAdvancedConfigurationBase(...)",
        "glide": "await client.configureAdvancedConfigurationBase(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.connectToServer(...)",
      "equivalent": {
        "glide": "client.connectToServer(...)"
      },
      "description": "Execute connectToServer command",
      "examples": {
        "source": "await redis.connectToServer(...)",
        "glide": "await client.connectToServer(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.close(...)",
      "equivalent": {
        "glide": "client.close(...)"
      },
      "description": "Execute close command",
      "examples": {
        "source": "await redis.close(...)",
        "glide": "await client.close(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.__createClientInternal(...)",
      "equivalent": {
        "glide": "client.__createClientInternal(...)"
      },
      "description": "Execute __createClientInternal command",
      "examples": {
        "source": "await redis.__createClientInternal(...)",
        "glide": "await client.__createClientInternal(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.GetSocket(...)",
      "equivalent": {
        "glide": "client.GetSocket(...)"
      },
      "description": "Execute GetSocket command",
      "examples": {
        "source": "await redis.GetSocket(...)",
        "glide": "await client.GetSocket(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.createClientInternal(...)",
      "equivalent": {
        "glide": "client.createClientInternal(...)"
      },
      "description": "Execute createClientInternal command",
      "examples": {
        "source": "await redis.createClientInternal(...)",
        "glide": "await client.createClientInternal(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.updateConnectionPassword(...)",
      "equivalent": {
        "glide": "client.updateConnectionPassword(...)"
      },
      "description": "Execute updateConnectionPassword command",
      "examples": {
        "source": "await redis.updateConnectionPassword(...)",
        "glide": "await client.updateConnectionPassword(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "redis.getStatistics(...)",
      "equivalent": {
        "glide": "client.getStatistics(...)"
      },
      "description": "Execute getStatistics command",
      "examples": {
        "source": "await redis.getStatistics(...)",
        "glide": "await client.getStatistics(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.createClient(...)",
      "equivalent": {
        "glide": "client.createClient(...)"
      },
      "description": "Execute createClient command",
      "examples": {
        "source": "await redis.createClient(...)",
        "glide": "await client.createClient(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.__createClient(...)",
      "equivalent": {
        "glide": "client.__createClient(...)"
      },
      "description": "Execute __createClient command",
      "examples": {
        "source": "await redis.__createClient(...)",
        "glide": "await client.__createClient(...)"
      }
    },
    {
      "category": "transactions",
      "symbol": "redis.exec(...)",
      "equivalent": {
        "glide": "client.exec(...)"
      },
      "description": "Execute exec command",
      "examples": {
        "source": "await redis.exec(...)",
        "glide": "await client.exec(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.customCommand(...)",
      "equivalent": {
        "glide": "client.customCommand(...)"
      },
      "description": "Execute customCommand command",
      "examples": {
        "source": "await redis.customCommand(...)",
        "glide": "await client.customCommand(...)"
      }
    },
    {
      "category": "connection",
      "symbol": "redis.ping(...)",
      "equivalent": {
        "glide": "client.ping(...)"
      },
      "description": "Execute ping command",
      "examples": {
        "source": "await redis.ping(...)",
        "glide": "await client.ping(...)"
      }
    },
    {
      "category": "server",
      "symbol": "redis.info(...)",
      "equivalent": {
        "glide": "client.info(...)"
      },
      "description": "Execute info command",
      "examples": {
        "source": "await redis.info(...)",
        "glide": "await client.info(...)"
      }
    },
    {
      "category": "connection",
      "symbol": "redis.select(...)",
      "equivalent": {
        "glide": "client.select(...)"
      },
      "description": "Execute select command",
      "examples": {
        "source": "await redis.select(...)",
        "glide": "await client.select(...)"
      }
    },
    {
      "category": "connection",
      "symbol": "redis.clientGetName(...)",
      "equivalent": {
        "glide": "client.clientGetName(...)"
      },
      "description": "Execute clientGetName command",
      "examples": {
        "source": "await redis.clientGetName(...)",
        "glide": "await client.clientGetName(...)"
      }
    },
    {
      "category": "server",
      "symbol": "redis.configRewrite(...)",
      "equivalent": {
        "glide": "client.configRewrite(...)"
      },
      "description": "Execute configRewrite command",
      "examples": {
        "source": "await redis.configRewrite(...)",
        "glide": "await client.configRewrite(...)"
      }
    },
    {
      "category": "server",
      "symbol": "redis.configResetStat(...)",
      "equivalent": {
        "glide": "client.configResetStat(...)"
      },
      "description": "Execute configResetStat command",
      "examples": {
        "source": "await redis.configResetStat(...)",
        "glide": "await client.configResetStat(...)"
      }
    },
    {
      "category": "connection",
      "symbol": "redis.clientId(...)",
      "equivalent": {
        "glide": "client.clientId(...)"
      },
      "description": "Execute clientId command",
      "examples": {
        "source": "await redis.clientId(...)",
        "glide": "await client.clientId(...)"
      }
    },
    {
      "category": "server",
      "symbol": "redis.configGet(...)",
      "equivalent": {
        "glide": "client.configGet(...)"
      },
      "description": "Execute configGet command",
      "examples": {
        "source": "await redis.configGet(...)",
        "glide": "await client.configGet(...)"
      }
    },
    {
      "category": "server",
      "symbol": "redis.configSet(...)",
      "equivalent": {
        "glide": "client.configSet(...)"
      },
      "description": "Execute configSet command",
      "examples": {
        "source": "await redis.configSet(...)",
        "glide": "await client.configSet(...)"
      }
    },
    {
      "category": "connection",
      "symbol": "redis.echo(...)",
      "equivalent": {
        "glide": "client.echo(...)"
      },
      "description": "Execute echo command",
      "examples": {
        "source": "await redis.echo(...)",
        "glide": "await client.echo(...)"
      }
    },
    {
      "category": "server",
      "symbol": "redis.time(...)",
      "equivalent": {
        "glide": "client.time(...)"
      },
      "description": "Execute time command",
      "examples": {
        "source": "await redis.time(...)",
        "glide": "await client.time(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.copy(...)",
      "equivalent": {
        "glide": "client.copy(...)"
      },
      "description": "Execute copy command",
      "examples": {
        "source": "await redis.copy(...)",
        "glide": "await client.copy(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.move(...)",
      "equivalent": {
        "glide": "client.move(...)"
      },
      "description": "Execute move command",
      "examples": {
        "source": "await redis.move(...)",
        "glide": "await client.move(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.lolwut(...)",
      "equivalent": {
        "glide": "client.lolwut(...)"
      },
      "description": "Execute lolwut command",
      "examples": {
        "source": "await redis.lolwut(...)",
        "glide": "await client.lolwut(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.functionDelete(...)",
      "equivalent": {
        "glide": "client.functionDelete(...)"
      },
      "description": "Execute functionDelete command",
      "examples": {
        "source": "await redis.functionDelete(...)",
        "glide": "await client.functionDelete(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.functionLoad(...)",
      "equivalent": {
        "glide": "client.functionLoad(...)"
      },
      "description": "Execute functionLoad command",
      "examples": {
        "source": "await redis.functionLoad(...)",
        "glide": "await client.functionLoad(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.functionFlush(...)",
      "equivalent": {
        "glide": "client.functionFlush(...)"
      },
      "description": "Execute functionFlush command",
      "examples": {
        "source": "await redis.functionFlush(...)",
        "glide": "await client.functionFlush(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.functionList(...)",
      "equivalent": {
        "glide": "client.functionList(...)"
      },
      "description": "Execute functionList command",
      "examples": {
        "source": "await redis.functionList(...)",
        "glide": "await client.functionList(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.functionStats(...)",
      "equivalent": {
        "glide": "client.functionStats(...)"
      },
      "description": "Execute functionStats command",
      "examples": {
        "source": "await redis.functionStats(...)",
        "glide": "await client.functionStats(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.functionKill(...)",
      "equivalent": {
        "glide": "client.functionKill(...)"
      },
      "description": "Execute functionKill command",
      "examples": {
        "source": "await redis.functionKill(...)",
        "glide": "await client.functionKill(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.functionDump(...)",
      "equivalent": {
        "glide": "client.functionDump(...)"
      },
      "description": "Execute functionDump command",
      "examples": {
        "source": "await redis.functionDump(...)",
        "glide": "await client.functionDump(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.functionRestore(...)",
      "equivalent": {
        "glide": "client.functionRestore(...)"
      },
      "description": "Execute functionRestore command",
      "examples": {
        "source": "await redis.functionRestore(...)",
        "glide": "await client.functionRestore(...)"
      }
    },
    {
      "category": "server",
      "symbol": "redis.flushall(...)",
      "equivalent": {
        "glide": "client.flushall(...)"
      },
      "description": "Execute flushall command",
      "examples": {
        "source": "await redis.flushall(...)",
        "glide": "await client.flushall(...)"
      }
    },
    {
      "category": "server",
      "symbol": "redis.flushdb(...)",
      "equivalent": {
        "glide": "client.flushdb(...)"
      },
      "description": "Execute flushdb command",
      "examples": {
        "source": "await redis.flushdb(...)",
        "glide": "await client.flushdb(...)"
      }
    },
    {
      "category": "server",
      "symbol": "redis.dbsize(...)",
      "equivalent": {
        "glide": "client.dbsize(...)"
      },
      "description": "Execute dbsize command",
      "examples": {
        "source": "await redis.dbsize(...)",
        "glide": "await client.dbsize(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "redis.publish(...)",
      "equivalent": {
        "glide": "client.publish(...)"
      },
      "description": "Execute publish command",
      "examples": {
        "source": "await redis.publish(...)",
        "glide": "await client.publish(...)"
      }
    },
    {
      "category": "server",
      "symbol": "redis.lastsave(...)",
      "equivalent": {
        "glide": "client.lastsave(...)"
      },
      "description": "Execute lastsave command",
      "examples": {
        "source": "await redis.lastsave(...)",
        "glide": "await client.lastsave(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.randomKey(...)",
      "equivalent": {
        "glide": "client.randomKey(...)"
      },
      "description": "Execute randomKey command",
      "examples": {
        "source": "await redis.randomKey(...)",
        "glide": "await client.randomKey(...)"
      }
    },
    {
      "category": "transactions",
      "symbol": "redis.unwatch(...)",
      "equivalent": {
        "glide": "client.unwatch(...)"
      },
      "description": "Execute unwatch command",
      "examples": {
        "source": "await redis.unwatch(...)",
        "glide": "await client.unwatch(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.scriptExists(...)",
      "equivalent": {
        "glide": "client.scriptExists(...)"
      },
      "description": "Execute scriptExists command",
      "examples": {
        "source": "await redis.scriptExists(...)",
        "glide": "await client.scriptExists(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.scriptFlush(...)",
      "equivalent": {
        "glide": "client.scriptFlush(...)"
      },
      "description": "Execute scriptFlush command",
      "examples": {
        "source": "await redis.scriptFlush(...)",
        "glide": "await client.scriptFlush(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.scriptKill(...)",
      "equivalent": {
        "glide": "client.scriptKill(...)"
      },
      "description": "Execute scriptKill command",
      "examples": {
        "source": "await redis.scriptKill(...)",
        "glide": "await client.scriptKill(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.scan(...)",
      "equivalent": {
        "glide": "client.scan(...)"
      },
      "description": "Execute scan command - NOTE: GLIDE returns [cursor, keys[]] array",
      "examples": {
        "source": "const result = await redis.scan(cursor); // returns {cursor, keys}",
        "glide": "const [newCursor, keys] = await client.scan(cursor); // returns [cursor, keys[]]"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.scanOptionsToProto(...)",
      "equivalent": {
        "glide": "client.scanOptionsToProto(...)"
      },
      "description": "Execute scanOptionsToProto command",
      "examples": {
        "source": "await redis.scanOptionsToProto(...)",
        "glide": "await client.scanOptionsToProto(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.createClusterScanPromise(...)",
      "equivalent": {
        "glide": "client.createClusterScanPromise(...)"
      },
      "description": "Execute createClusterScanPromise command",
      "examples": {
        "source": "await redis.createClusterScanPromise(...)",
        "glide": "await client.createClusterScanPromise(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.fcallWithRoute(...)",
      "equivalent": {
        "glide": "client.fcallWithRoute(...)"
      },
      "description": "Execute fcallWithRoute command",
      "examples": {
        "source": "await redis.fcallWithRoute(...)",
        "glide": "await client.fcallWithRoute(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "redis.fcallReadonlyWithRoute(...)",
      "equivalent": {
        "glide": "client.fcallReadonlyWithRoute(...)"
      },
      "description": "Execute fcallReadonlyWithRoute command",
      "examples": {
        "source": "await redis.fcallReadonlyWithRoute(...)",
        "glide": "await client.fcallReadonlyWithRoute(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "redis.pubsubShardChannels(...)",
      "equivalent": {
        "glide": "client.pubsubShardChannels(...)"
      },
      "description": "Execute pubsubShardChannels command",
      "examples": {
        "source": "await redis.pubsubShardChannels(...)",
        "glide": "await client.pubsubShardChannels(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "redis.pubsubShardNumSub(...)",
      "equivalent": {
        "glide": "client.pubsubShardNumSub(...)"
      },
      "description": "Execute pubsubShardNumSub command",
      "examples": {
        "source": "await redis.pubsubShardNumSub(...)",
        "glide": "await client.pubsubShardNumSub(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.invokeScriptWithRoute(...)",
      "equivalent": {
        "glide": "client.invokeScriptWithRoute(...)"
      },
      "description": "Execute invokeScriptWithRoute command",
      "examples": {
        "source": "await redis.invokeScriptWithRoute(...)",
        "glide": "await client.invokeScriptWithRoute(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.toArg(...)",
      "equivalent": {
        "glide": "client.toArg(...)"
      },
      "description": "Execute toArg command",
      "examples": {
        "source": "await redis.toArg(...)",
        "glide": "await client.toArg(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.toArgs(...)",
      "equivalent": {
        "glide": "client.toArgs(...)"
      },
      "description": "Execute toArgs command",
      "examples": {
        "source": "await redis.toArgs(...)",
        "glide": "await client.toArgs(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.addAndReturn(...)",
      "equivalent": {
        "glide": "client.addAndReturn(...)"
      },
      "description": "Execute addAndReturn command",
      "examples": {
        "source": "await redis.addAndReturn(...)",
        "glide": "await client.addAndReturn(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "redis.expireTime(...)",
      "equivalent": {
        "glide": "client.expireTime(...)"
      },
      "description": "Execute expireTime command",
      "examples": {
        "source": "await redis.expireTime(...)",
        "glide": "await client.expireTime(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.pexpireTime(...)",
      "equivalent": {
        "glide": "client.pexpireTime(...)"
      },
      "description": "Execute pexpireTime command",
      "examples": {
        "source": "await redis.pexpireTime(...)",
        "glide": "await client.pexpireTime(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.create(...)",
      "equivalent": {
        "glide": "client.create(...)"
      },
      "description": "Execute create command",
      "examples": {
        "source": "await redis.create(...)",
        "glide": "await client.create(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.dropindex(...)",
      "equivalent": {
        "glide": "client.dropindex(...)"
      },
      "description": "Execute dropindex command",
      "examples": {
        "source": "await redis.dropindex(...)",
        "glide": "await client.dropindex(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.list(...)",
      "equivalent": {
        "glide": "client.list(...)"
      },
      "description": "Execute list command",
      "examples": {
        "source": "await redis.list(...)",
        "glide": "await client.list(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.aggregate(...)",
      "equivalent": {
        "glide": "client.aggregate(...)"
      },
      "description": "Execute aggregate command",
      "examples": {
        "source": "await redis.aggregate(...)",
        "glide": "await client.aggregate(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.explain(...)",
      "equivalent": {
        "glide": "client.explain(...)"
      },
      "description": "Execute explain command",
      "examples": {
        "source": "await redis.explain(...)",
        "glide": "await client.explain(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.explaincli(...)",
      "equivalent": {
        "glide": "client.explaincli(...)"
      },
      "description": "Execute explaincli command",
      "examples": {
        "source": "await redis.explaincli(...)",
        "glide": "await client.explaincli(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.search(...)",
      "equivalent": {
        "glide": "client.search(...)"
      },
      "description": "Execute search command",
      "examples": {
        "source": "await redis.search(...)",
        "glide": "await client.search(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.profileSearch(...)",
      "equivalent": {
        "glide": "client.profileSearch(...)"
      },
      "description": "Execute profileSearch command",
      "examples": {
        "source": "await redis.profileSearch(...)",
        "glide": "await client.profileSearch(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.profileAggregate(...)",
      "equivalent": {
        "glide": "client.profileAggregate(...)"
      },
      "description": "Execute profileAggregate command",
      "examples": {
        "source": "await redis.profileAggregate(...)",
        "glide": "await client.profileAggregate(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.aliasadd(...)",
      "equivalent": {
        "glide": "client.aliasadd(...)"
      },
      "description": "Execute aliasadd command",
      "examples": {
        "source": "await redis.aliasadd(...)",
        "glide": "await client.aliasadd(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.aliasdel(...)",
      "equivalent": {
        "glide": "client.aliasdel(...)"
      },
      "description": "Execute aliasdel command",
      "examples": {
        "source": "await redis.aliasdel(...)",
        "glide": "await client.aliasdel(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.aliasupdate(...)",
      "equivalent": {
        "glide": "client.aliasupdate(...)"
      },
      "description": "Execute aliasupdate command",
      "examples": {
        "source": "await redis.aliasupdate(...)",
        "glide": "await client.aliasupdate(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.aliaslist(...)",
      "equivalent": {
        "glide": "client.aliaslist(...)"
      },
      "description": "Execute aliaslist command",
      "examples": {
        "source": "await redis.aliaslist(...)",
        "glide": "await client.aliaslist(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.arrinsert(...)",
      "equivalent": {
        "glide": "client.arrinsert(...)"
      },
      "description": "Execute arrinsert command",
      "examples": {
        "source": "await redis.arrinsert(...)",
        "glide": "await client.arrinsert(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.arrpop(...)",
      "equivalent": {
        "glide": "client.arrpop(...)"
      },
      "description": "Execute arrpop command",
      "examples": {
        "source": "await redis.arrpop(...)",
        "glide": "await client.arrpop(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.arrlen(...)",
      "equivalent": {
        "glide": "client.arrlen(...)"
      },
      "description": "Execute arrlen command",
      "examples": {
        "source": "await redis.arrlen(...)",
        "glide": "await client.arrlen(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.arrtrim(...)",
      "equivalent": {
        "glide": "client.arrtrim(...)"
      },
      "description": "Execute arrtrim command",
      "examples": {
        "source": "await redis.arrtrim(...)",
        "glide": "await client.arrtrim(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.arrindex(...)",
      "equivalent": {
        "glide": "client.arrindex(...)"
      },
      "description": "Execute arrindex command",
      "examples": {
        "source": "await redis.arrindex(...)",
        "glide": "await client.arrindex(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.toggle(...)",
      "equivalent": {
        "glide": "client.toggle(...)"
      },
      "description": "Execute toggle command",
      "examples": {
        "source": "await redis.toggle(...)",
        "glide": "await client.toggle(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.forget(...)",
      "equivalent": {
        "glide": "client.forget(...)"
      },
      "description": "Execute forget command",
      "examples": {
        "source": "await redis.forget(...)",
        "glide": "await client.forget(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.clear(...)",
      "equivalent": {
        "glide": "client.clear(...)"
      },
      "description": "Execute clear command",
      "examples": {
        "source": "await redis.clear(...)",
        "glide": "await client.clear(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.resp(...)",
      "equivalent": {
        "glide": "client.resp(...)"
      },
      "description": "Execute resp command",
      "examples": {
        "source": "await redis.resp(...)",
        "glide": "await client.resp(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.strappend(...)",
      "equivalent": {
        "glide": "client.strappend(...)"
      },
      "description": "Execute strappend command",
      "examples": {
        "source": "await redis.strappend(...)",
        "glide": "await client.strappend(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.arrappend(...)",
      "equivalent": {
        "glide": "client.arrappend(...)"
      },
      "description": "Execute arrappend command",
      "examples": {
        "source": "await redis.arrappend(...)",
        "glide": "await client.arrappend(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.debugMemory(...)",
      "equivalent": {
        "glide": "client.debugMemory(...)"
      },
      "description": "Execute debugMemory command",
      "examples": {
        "source": "await redis.debugMemory(...)",
        "glide": "await client.debugMemory(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.debugFields(...)",
      "equivalent": {
        "glide": "client.debugFields(...)"
      },
      "description": "Execute debugFields command",
      "examples": {
        "source": "await redis.debugFields(...)",
        "glide": "await client.debugFields(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.numincrby(...)",
      "equivalent": {
        "glide": "client.numincrby(...)"
      },
      "description": "Execute numincrby command",
      "examples": {
        "source": "await redis.numincrby(...)",
        "glide": "await client.numincrby(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.nummultby(...)",
      "equivalent": {
        "glide": "client.nummultby(...)"
      },
      "description": "Execute nummultby command",
      "examples": {
        "source": "await redis.nummultby(...)",
        "glide": "await client.nummultby(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.objlen(...)",
      "equivalent": {
        "glide": "client.objlen(...)"
      },
      "description": "Execute objlen command",
      "examples": {
        "source": "await redis.objlen(...)",
        "glide": "await client.objlen(...)"
      }
    },
    {
      "category": "general",
      "symbol": "redis.objkeys(...)",
      "equivalent": {
        "glide": "client.objkeys(...)"
      },
      "description": "Execute objkeys command",
      "examples": {
        "source": "await redis.objkeys(...)",
        "glide": "await client.objkeys(...)"
      }
    }
  ]
};

export const COMPREHENSIVE_NODE_REDIS_MAPPINGS: ApiDataset = {
  "client": "node-redis",
  "version": "4.x",
  "entries": [
    {
      "category": "server",
      "symbol": "client.configurePubsub(...)",
      "equivalent": {
        "glide": "client.configurePubsub(...)"
      },
      "description": "Execute configurePubsub command",
      "examples": {
        "source": "await client.configurePubsub(...)",
        "glide": "await client.configurePubsub(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.toProtobufRoute(...)",
      "equivalent": {
        "glide": "client.toProtobufRoute(...)"
      },
      "description": "Execute toProtobufRoute command",
      "examples": {
        "source": "await client.toProtobufRoute(...)",
        "glide": "await client.toProtobufRoute(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.processResponse(...)",
      "equivalent": {
        "glide": "client.processResponse(...)"
      },
      "description": "Execute processResponse command",
      "examples": {
        "source": "await client.processResponse(...)",
        "glide": "await client.processResponse(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.processPush(...)",
      "equivalent": {
        "glide": "client.processPush(...)"
      },
      "description": "Execute processPush command",
      "examples": {
        "source": "await client.processPush(...)",
        "glide": "await client.processPush(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.getCallbackIndex(...)",
      "equivalent": {
        "glide": "client.getCallbackIndex(...)"
      },
      "description": "Execute getCallbackIndex command",
      "examples": {
        "source": "await client.getCallbackIndex(...)",
        "glide": "await client.getCallbackIndex(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.ensureClientIsOpen(...)",
      "equivalent": {
        "glide": "client.ensureClientIsOpen(...)"
      },
      "description": "Execute ensureClientIsOpen command",
      "examples": {
        "source": "await client.ensureClientIsOpen(...)",
        "glide": "await client.ensureClientIsOpen(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.createWritePromise(...)",
      "equivalent": {
        "glide": "client.createWritePromise(...)"
      },
      "description": "Execute createWritePromise command",
      "examples": {
        "source": "await client.createWritePromise(...)",
        "glide": "await client.createWritePromise(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.createUpdateConnectionPasswordPromise(...)",
      "equivalent": {
        "glide": "client.createUpdateConnectionPasswordPromise(...)"
      },
      "description": "Execute createUpdateConnectionPasswordPromise command",
      "examples": {
        "source": "await client.createUpdateConnectionPasswordPromise(...)",
        "glide": "await client.createUpdateConnectionPasswordPromise(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.createScriptInvocationPromise(...)",
      "equivalent": {
        "glide": "client.createScriptInvocationPromise(...)"
      },
      "description": "Execute createScriptInvocationPromise command",
      "examples": {
        "source": "await client.createScriptInvocationPromise(...)",
        "glide": "await client.createScriptInvocationPromise(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.writeOrBufferCommandRequest(...)",
      "equivalent": {
        "glide": "client.writeOrBufferCommandRequest(...)"
      },
      "description": "Execute writeOrBufferCommandRequest command",
      "examples": {
        "source": "await client.writeOrBufferCommandRequest(...)",
        "glide": "await client.writeOrBufferCommandRequest(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.writeOrBufferRequest(...)",
      "equivalent": {
        "glide": "client.writeOrBufferRequest(...)"
      },
      "description": "Execute writeOrBufferRequest command",
      "examples": {
        "source": "await client.writeOrBufferRequest(...)",
        "glide": "await client.writeOrBufferRequest(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.processResultWithSetCommands(...)",
      "equivalent": {
        "glide": "client.processResultWithSetCommands(...)"
      },
      "description": "Execute processResultWithSetCommands command",
      "examples": {
        "source": "await client.processResultWithSetCommands(...)",
        "glide": "await client.processResultWithSetCommands(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.cancelPubSubFuturesWithExceptionSafe(...)",
      "equivalent": {
        "glide": "client.cancelPubSubFuturesWithExceptionSafe(...)"
      },
      "description": "Execute cancelPubSubFuturesWithExceptionSafe command",
      "examples": {
        "source": "await client.cancelPubSubFuturesWithExceptionSafe(...)",
        "glide": "await client.cancelPubSubFuturesWithExceptionSafe(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.isPubsubConfigured(...)",
      "equivalent": {
        "glide": "client.isPubsubConfigured(...)"
      },
      "description": "Execute isPubsubConfigured command",
      "examples": {
        "source": "await client.isPubsubConfigured(...)",
        "glide": "await client.isPubsubConfigured(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.getPubsubCallbackAndContext(...)",
      "equivalent": {
        "glide": "client.getPubsubCallbackAndContext(...)"
      },
      "description": "Execute getPubsubCallbackAndContext command",
      "examples": {
        "source": "await client.getPubsubCallbackAndContext(...)",
        "glide": "await client.getPubsubCallbackAndContext(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.getPubSubMessage(...)",
      "equivalent": {
        "glide": "client.getPubSubMessage(...)"
      },
      "description": "Execute getPubSubMessage command",
      "examples": {
        "source": "await client.getPubSubMessage(...)",
        "glide": "await client.getPubSubMessage(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.tryGetPubSubMessage(...)",
      "equivalent": {
        "glide": "client.tryGetPubSubMessage(...)"
      },
      "description": "Execute tryGetPubSubMessage command",
      "examples": {
        "source": "await client.tryGetPubSubMessage(...)",
        "glide": "await client.tryGetPubSubMessage(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.notificationToPubSubMessageSafe(...)",
      "equivalent": {
        "glide": "client.notificationToPubSubMessageSafe(...)"
      },
      "description": "Execute notificationToPubSubMessageSafe command",
      "examples": {
        "source": "await client.notificationToPubSubMessageSafe(...)",
        "glide": "await client.notificationToPubSubMessageSafe(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.completePubSubFuturesSafe(...)",
      "equivalent": {
        "glide": "client.completePubSubFuturesSafe(...)"
      },
      "description": "Execute completePubSubFuturesSafe command",
      "examples": {
        "source": "await client.completePubSubFuturesSafe(...)",
        "glide": "await client.completePubSubFuturesSafe(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.get(key)",
      "equivalent": {
        "glide": "client.get(key)"
      },
      "description": "Execute get command",
      "examples": {
        "source": "await client.get(key)",
        "glide": "await client.get(key)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.getex(...)",
      "equivalent": {
        "glide": "client.getex(...)"
      },
      "description": "Execute getex command",
      "examples": {
        "source": "await client.getex(...)",
        "glide": "await client.getex(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.getdel(...)",
      "equivalent": {
        "glide": "client.getdel(...)"
      },
      "description": "Execute getdel command",
      "examples": {
        "source": "await client.getdel(...)",
        "glide": "await client.getdel(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.getrange(...)",
      "equivalent": {
        "glide": "client.getrange(...)"
      },
      "description": "Execute getrange command",
      "examples": {
        "source": "await client.getrange(...)",
        "glide": "await client.getrange(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.set(key, value, options?)",
      "equivalent": {
        "glide": "client.set(key, value, options?)"
      },
      "description": "Execute set command",
      "examples": {
        "source": "await client.set(key, value, options?)",
        "glide": "await client.set(key, value, options?)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.del(key)",
      "equivalent": {
        "glide": "client.del(key)"
      },
      "description": "Execute del command",
      "examples": {
        "source": "await client.del(key)",
        "glide": "await client.del(key)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.dump(key)",
      "equivalent": {
        "glide": "client.dump(key)"
      },
      "description": "Execute dump command",
      "examples": {
        "source": "await client.dump(key)",
        "glide": "await client.dump(key)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.restore(...)",
      "equivalent": {
        "glide": "client.restore(...)"
      },
      "description": "Execute restore command",
      "examples": {
        "source": "await client.restore(...)",
        "glide": "await client.restore(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.mget(...)",
      "equivalent": {
        "glide": "client.mget(...)"
      },
      "description": "Execute mget command",
      "examples": {
        "source": "await client.mget(...)",
        "glide": "await client.mget(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.mset(...)",
      "equivalent": {
        "glide": "client.mset(...)"
      },
      "description": "Execute mset command",
      "examples": {
        "source": "await client.mset(...)",
        "glide": "await client.mset(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.msetnx(...)",
      "equivalent": {
        "glide": "client.msetnx(...)"
      },
      "description": "Execute msetnx command",
      "examples": {
        "source": "await client.msetnx(...)",
        "glide": "await client.msetnx(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.incr(...)",
      "equivalent": {
        "glide": "client.incr(...)"
      },
      "description": "Execute incr command",
      "examples": {
        "source": "await client.incr(...)",
        "glide": "await client.incr(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.incrBy(...)",
      "equivalent": {
        "glide": "client.incrBy(...)"
      },
      "description": "Execute incrBy command",
      "examples": {
        "source": "await client.incrBy(...)",
        "glide": "await client.incrBy(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.incrByFloat(...)",
      "equivalent": {
        "glide": "client.incrByFloat(...)"
      },
      "description": "Execute incrByFloat command",
      "examples": {
        "source": "await client.incrByFloat(...)",
        "glide": "await client.incrByFloat(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.decr(...)",
      "equivalent": {
        "glide": "client.decr(...)"
      },
      "description": "Execute decr command",
      "examples": {
        "source": "await client.decr(...)",
        "glide": "await client.decr(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.decrBy(...)",
      "equivalent": {
        "glide": "client.decrBy(...)"
      },
      "description": "Execute decrBy command",
      "examples": {
        "source": "await client.decrBy(...)",
        "glide": "await client.decrBy(...)"
      }
    },
    {
      "category": "bitmap",
      "symbol": "client.bitop(...)",
      "equivalent": {
        "glide": "client.bitop(...)"
      },
      "description": "Execute bitop command",
      "examples": {
        "source": "await client.bitop(...)",
        "glide": "await client.bitop(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.getbit(...)",
      "equivalent": {
        "glide": "client.getbit(...)"
      },
      "description": "Execute getbit command",
      "examples": {
        "source": "await client.getbit(...)",
        "glide": "await client.getbit(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.setbit(...)",
      "equivalent": {
        "glide": "client.setbit(...)"
      },
      "description": "Execute setbit command",
      "examples": {
        "source": "await client.setbit(...)",
        "glide": "await client.setbit(...)"
      }
    },
    {
      "category": "bitmap",
      "symbol": "client.bitpos(...)",
      "equivalent": {
        "glide": "client.bitpos(...)"
      },
      "description": "Execute bitpos command",
      "examples": {
        "source": "await client.bitpos(...)",
        "glide": "await client.bitpos(...)"
      }
    },
    {
      "category": "bitmap",
      "symbol": "client.bitfield(...)",
      "equivalent": {
        "glide": "client.bitfield(...)"
      },
      "description": "Execute bitfield command",
      "examples": {
        "source": "await client.bitfield(...)",
        "glide": "await client.bitfield(...)"
      }
    },
    {
      "category": "bitmap",
      "symbol": "client.bitfieldReadOnly(...)",
      "equivalent": {
        "glide": "client.bitfieldReadOnly(...)"
      },
      "description": "Execute bitfieldReadOnly command",
      "examples": {
        "source": "await client.bitfieldReadOnly(...)",
        "glide": "await client.bitfieldReadOnly(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hget(key, field)",
      "equivalent": {
        "glide": "client.hget(key, field)"
      },
      "description": "Execute hget command",
      "examples": {
        "source": "await client.hget(key, field)",
        "glide": "await client.hget(key, field)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hset(key, field, value)",
      "equivalent": {
        "glide": "client.hset(key, field, value)"
      },
      "description": "Execute hset command",
      "examples": {
        "source": "await client.hset(key, field, value)",
        "glide": "await client.hset(key, field, value)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hkeys(key)",
      "equivalent": {
        "glide": "client.hkeys(key)"
      },
      "description": "Execute hkeys command",
      "examples": {
        "source": "await client.hkeys(key)",
        "glide": "await client.hkeys(key)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hsetnx(...)",
      "equivalent": {
        "glide": "client.hsetnx(...)"
      },
      "description": "Execute hsetnx command",
      "examples": {
        "source": "await client.hsetnx(...)",
        "glide": "await client.hsetnx(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hdel(key, ...fields)",
      "equivalent": {
        "glide": "client.hdel(key, ...fields)"
      },
      "description": "Execute hdel command",
      "examples": {
        "source": "await client.hdel(key, ...fields)",
        "glide": "await client.hdel(key, ...fields)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hmget(key, fields)",
      "equivalent": {
        "glide": "client.hmget(key, fields)"
      },
      "description": "Execute hmget command",
      "examples": {
        "source": "await client.hmget(key, fields)",
        "glide": "await client.hmget(key, fields)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hexists(...)",
      "equivalent": {
        "glide": "client.hexists(...)"
      },
      "description": "Execute hexists command",
      "examples": {
        "source": "await client.hexists(...)",
        "glide": "await client.hexists(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hgetall(key)",
      "equivalent": {
        "glide": "client.hgetall(key)"
      },
      "description": "Execute hgetall command",
      "examples": {
        "source": "await client.hgetall(key)",
        "glide": "await client.hgetall(key)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hincrBy(...)",
      "equivalent": {
        "glide": "client.hincrBy(...)"
      },
      "description": "Execute hincrBy command",
      "examples": {
        "source": "await client.hincrBy(...)",
        "glide": "await client.hincrBy(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hincrByFloat(...)",
      "equivalent": {
        "glide": "client.hincrByFloat(...)"
      },
      "description": "Execute hincrByFloat command",
      "examples": {
        "source": "await client.hincrByFloat(...)",
        "glide": "await client.hincrByFloat(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hlen(...)",
      "equivalent": {
        "glide": "client.hlen(...)"
      },
      "description": "Execute hlen command",
      "examples": {
        "source": "await client.hlen(...)",
        "glide": "await client.hlen(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hvals(key)",
      "equivalent": {
        "glide": "client.hvals(key)"
      },
      "description": "Execute hvals command",
      "examples": {
        "source": "await client.hvals(key)",
        "glide": "await client.hvals(key)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hstrlen(...)",
      "equivalent": {
        "glide": "client.hstrlen(...)"
      },
      "description": "Execute hstrlen command",
      "examples": {
        "source": "await client.hstrlen(...)",
        "glide": "await client.hstrlen(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hrandfield(...)",
      "equivalent": {
        "glide": "client.hrandfield(...)"
      },
      "description": "Execute hrandfield command",
      "examples": {
        "source": "await client.hrandfield(...)",
        "glide": "await client.hrandfield(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hscan(...)",
      "equivalent": {
        "glide": "client.hscan(...)"
      },
      "description": "Execute hscan command",
      "examples": {
        "source": "await client.hscan(...)",
        "glide": "await client.hscan(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hrandfieldCount(...)",
      "equivalent": {
        "glide": "client.hrandfieldCount(...)"
      },
      "description": "Execute hrandfieldCount command",
      "examples": {
        "source": "await client.hrandfieldCount(...)",
        "glide": "await client.hrandfieldCount(...)"
      }
    },
    {
      "category": "hashes",
      "symbol": "client.hrandfieldWithValues(...)",
      "equivalent": {
        "glide": "client.hrandfieldWithValues(...)"
      },
      "description": "Execute hrandfieldWithValues command",
      "examples": {
        "source": "await client.hrandfieldWithValues(...)",
        "glide": "await client.hrandfieldWithValues(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.lpush(key, ...elements)",
      "equivalent": {
        "glide": "client.lpush(key, ...elements)"
      },
      "description": "Execute lpush command",
      "examples": {
        "source": "await client.lpush(key, ...elements)",
        "glide": "await client.lpush(key, ...elements)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.lpushx(...)",
      "equivalent": {
        "glide": "client.lpushx(...)"
      },
      "description": "Execute lpushx command",
      "examples": {
        "source": "await client.lpushx(...)",
        "glide": "await client.lpushx(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.lpop(key, count?)",
      "equivalent": {
        "glide": "client.lpop(key, count?)"
      },
      "description": "Execute lpop command",
      "examples": {
        "source": "await client.lpop(key, count?)",
        "glide": "await client.lpop(key, count?)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.lpopCount(...)",
      "equivalent": {
        "glide": "client.lpopCount(...)"
      },
      "description": "Execute lpopCount command",
      "examples": {
        "source": "await client.lpopCount(...)",
        "glide": "await client.lpopCount(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.lrange(key, start, stop)",
      "equivalent": {
        "glide": "client.lrange(key, start, stop)"
      },
      "description": "Execute lrange command",
      "examples": {
        "source": "await client.lrange(key, start, stop)",
        "glide": "await client.lrange(key, start, stop)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.llen(...)",
      "equivalent": {
        "glide": "client.llen(...)"
      },
      "description": "Execute llen command",
      "examples": {
        "source": "await client.llen(...)",
        "glide": "await client.llen(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.lmove(...)",
      "equivalent": {
        "glide": "client.lmove(...)"
      },
      "description": "Execute lmove command",
      "examples": {
        "source": "await client.lmove(...)",
        "glide": "await client.lmove(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.blmove(...)",
      "equivalent": {
        "glide": "client.blmove(...)"
      },
      "description": "Execute blmove command",
      "examples": {
        "source": "await client.blmove(...)",
        "glide": "await client.blmove(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.lset(key, index, element)",
      "equivalent": {
        "glide": "client.lset(key, index, element)"
      },
      "description": "Execute lset command",
      "examples": {
        "source": "await client.lset(key, index, element)",
        "glide": "await client.lset(key, index, element)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.ltrim(...)",
      "equivalent": {
        "glide": "client.ltrim(...)"
      },
      "description": "Execute ltrim command",
      "examples": {
        "source": "await client.ltrim(...)",
        "glide": "await client.ltrim(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.lrem(...)",
      "equivalent": {
        "glide": "client.lrem(...)"
      },
      "description": "Execute lrem command",
      "examples": {
        "source": "await client.lrem(...)",
        "glide": "await client.lrem(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.rpush(key, ...elements)",
      "equivalent": {
        "glide": "client.rpush(key, ...elements)"
      },
      "description": "Execute rpush command",
      "examples": {
        "source": "await client.rpush(key, ...elements)",
        "glide": "await client.rpush(key, ...elements)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.rpushx(...)",
      "equivalent": {
        "glide": "client.rpushx(...)"
      },
      "description": "Execute rpushx command",
      "examples": {
        "source": "await client.rpushx(...)",
        "glide": "await client.rpushx(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.rpop(key, count?)",
      "equivalent": {
        "glide": "client.rpop(key, count?)"
      },
      "description": "Execute rpop command",
      "examples": {
        "source": "await client.rpop(key, count?)",
        "glide": "await client.rpop(key, count?)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.rpopCount(...)",
      "equivalent": {
        "glide": "client.rpopCount(...)"
      },
      "description": "Execute rpopCount command",
      "examples": {
        "source": "await client.rpopCount(...)",
        "glide": "await client.rpopCount(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.sadd(key, ...members)",
      "equivalent": {
        "glide": "client.sadd(key, ...members)"
      },
      "description": "Execute sadd command",
      "examples": {
        "source": "await client.sadd(key, ...members)",
        "glide": "await client.sadd(key, ...members)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.srem(key, ...members)",
      "equivalent": {
        "glide": "client.srem(key, ...members)"
      },
      "description": "Execute srem command",
      "examples": {
        "source": "await client.srem(key, ...members)",
        "glide": "await client.srem(key, ...members)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.sscan(...)",
      "equivalent": {
        "glide": "client.sscan(...)"
      },
      "description": "Execute sscan command",
      "examples": {
        "source": "await client.sscan(...)",
        "glide": "await client.sscan(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.smembers(key)",
      "equivalent": {
        "glide": "client.smembers(key)"
      },
      "description": "Execute smembers command",
      "examples": {
        "source": "await client.smembers(key)",
        "glide": "await client.smembers(key)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.smove(...)",
      "equivalent": {
        "glide": "client.smove(...)"
      },
      "description": "Execute smove command",
      "examples": {
        "source": "await client.smove(...)",
        "glide": "await client.smove(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.scard(key)",
      "equivalent": {
        "glide": "client.scard(key)"
      },
      "description": "Execute scard command",
      "examples": {
        "source": "await client.scard(key)",
        "glide": "await client.scard(key)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.sinter(...keys)",
      "equivalent": {
        "glide": "client.sinter(...keys)"
      },
      "description": "Execute sinter command",
      "examples": {
        "source": "await client.sinter(...keys)",
        "glide": "await client.sinter(...keys)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.sintercard(...)",
      "equivalent": {
        "glide": "client.sintercard(...)"
      },
      "description": "Execute sintercard command",
      "examples": {
        "source": "await client.sintercard(...)",
        "glide": "await client.sintercard(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.sinterstore(...)",
      "equivalent": {
        "glide": "client.sinterstore(...)"
      },
      "description": "Execute sinterstore command",
      "examples": {
        "source": "await client.sinterstore(...)",
        "glide": "await client.sinterstore(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.sdiff(...keys)",
      "equivalent": {
        "glide": "client.sdiff(...keys)"
      },
      "description": "Execute sdiff command",
      "examples": {
        "source": "await client.sdiff(...keys)",
        "glide": "await client.sdiff(...keys)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.sdiffstore(...)",
      "equivalent": {
        "glide": "client.sdiffstore(...)"
      },
      "description": "Execute sdiffstore command",
      "examples": {
        "source": "await client.sdiffstore(...)",
        "glide": "await client.sdiffstore(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.sunion(...keys)",
      "equivalent": {
        "glide": "client.sunion(...keys)"
      },
      "description": "Execute sunion command",
      "examples": {
        "source": "await client.sunion(...keys)",
        "glide": "await client.sunion(...keys)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.sunionstore(...)",
      "equivalent": {
        "glide": "client.sunionstore(...)"
      },
      "description": "Execute sunionstore command",
      "examples": {
        "source": "await client.sunionstore(...)",
        "glide": "await client.sunionstore(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.sismember(key, member)",
      "equivalent": {
        "glide": "client.sismember(key, member)"
      },
      "description": "Execute sismember command",
      "examples": {
        "source": "await client.sismember(key, member)",
        "glide": "await client.sismember(key, member)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.smismember(...)",
      "equivalent": {
        "glide": "client.smismember(...)"
      },
      "description": "Execute smismember command",
      "examples": {
        "source": "await client.smismember(...)",
        "glide": "await client.smismember(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.spop(...)",
      "equivalent": {
        "glide": "client.spop(...)"
      },
      "description": "Execute spop command",
      "examples": {
        "source": "await client.spop(...)",
        "glide": "await client.spop(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.spopCount(...)",
      "equivalent": {
        "glide": "client.spopCount(...)"
      },
      "description": "Execute spopCount command",
      "examples": {
        "source": "await client.spopCount(...)",
        "glide": "await client.spopCount(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.srandmember(...)",
      "equivalent": {
        "glide": "client.srandmember(...)"
      },
      "description": "Execute srandmember command",
      "examples": {
        "source": "await client.srandmember(...)",
        "glide": "await client.srandmember(...)"
      }
    },
    {
      "category": "sets",
      "symbol": "client.srandmemberCount(...)",
      "equivalent": {
        "glide": "client.srandmemberCount(...)"
      },
      "description": "Execute srandmemberCount command",
      "examples": {
        "source": "await client.srandmemberCount(...)",
        "glide": "await client.srandmemberCount(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.exists(key)",
      "equivalent": {
        "glide": "client.exists(key)"
      },
      "description": "Execute exists command",
      "examples": {
        "source": "await client.exists(key)",
        "glide": "await client.exists(key)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.unlink(...)",
      "equivalent": {
        "glide": "client.unlink(...)"
      },
      "description": "Execute unlink command",
      "examples": {
        "source": "await client.unlink(...)",
        "glide": "await client.unlink(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.expire(...)",
      "equivalent": {
        "glide": "client.expire(...)"
      },
      "description": "Execute expire command",
      "examples": {
        "source": "await client.expire(...)",
        "glide": "await client.expire(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.expireAt(...)",
      "equivalent": {
        "glide": "client.expireAt(...)"
      },
      "description": "Execute expireAt command",
      "examples": {
        "source": "await client.expireAt(...)",
        "glide": "await client.expireAt(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.expiretime(...)",
      "equivalent": {
        "glide": "client.expiretime(...)"
      },
      "description": "Execute expiretime command",
      "examples": {
        "source": "await client.expiretime(...)",
        "glide": "await client.expiretime(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.pexpire(...)",
      "equivalent": {
        "glide": "client.pexpire(...)"
      },
      "description": "Execute pexpire command",
      "examples": {
        "source": "await client.pexpire(...)",
        "glide": "await client.pexpire(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.pexpireAt(...)",
      "equivalent": {
        "glide": "client.pexpireAt(...)"
      },
      "description": "Execute pexpireAt command",
      "examples": {
        "source": "await client.pexpireAt(...)",
        "glide": "await client.pexpireAt(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.pexpiretime(...)",
      "equivalent": {
        "glide": "client.pexpiretime(...)"
      },
      "description": "Execute pexpiretime command",
      "examples": {
        "source": "await client.pexpiretime(...)",
        "glide": "await client.pexpiretime(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.ttl(key)",
      "equivalent": {
        "glide": "client.ttl(key)"
      },
      "description": "Execute ttl command",
      "examples": {
        "source": "await client.ttl(key)",
        "glide": "await client.ttl(key)"
      }
    },
    {
      "category": "general",
      "symbol": "client.invokeScript(...)",
      "equivalent": {
        "glide": "client.invokeScript(...)"
      },
      "description": "Execute invokeScript command",
      "examples": {
        "source": "await client.invokeScript(...)",
        "glide": "await client.invokeScript(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.scriptShow(...)",
      "equivalent": {
        "glide": "client.scriptShow(...)"
      },
      "description": "Execute scriptShow command",
      "examples": {
        "source": "await client.scriptShow(...)",
        "glide": "await client.scriptShow(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xrange(...)",
      "equivalent": {
        "glide": "client.xrange(...)"
      },
      "description": "Execute xrange command",
      "examples": {
        "source": "await client.xrange(...)",
        "glide": "await client.xrange(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xrevrange(...)",
      "equivalent": {
        "glide": "client.xrevrange(...)"
      },
      "description": "Execute xrevrange command",
      "examples": {
        "source": "await client.xrevrange(...)",
        "glide": "await client.xrevrange(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zadd(key, membersScores)",
      "equivalent": {
        "glide": "client.zadd(key, membersScores)"
      },
      "description": "Execute zadd command",
      "examples": {
        "source": "await client.zadd(key, membersScores)",
        "glide": "await client.zadd(key, membersScores)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zaddIncr(...)",
      "equivalent": {
        "glide": "client.zaddIncr(...)"
      },
      "description": "Execute zaddIncr command",
      "examples": {
        "source": "await client.zaddIncr(...)",
        "glide": "await client.zaddIncr(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zrem(key, ...members)",
      "equivalent": {
        "glide": "client.zrem(key, ...members)"
      },
      "description": "Execute zrem command",
      "examples": {
        "source": "await client.zrem(key, ...members)",
        "glide": "await client.zrem(key, ...members)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zcard(...)",
      "equivalent": {
        "glide": "client.zcard(...)"
      },
      "description": "Execute zcard command",
      "examples": {
        "source": "await client.zcard(...)",
        "glide": "await client.zcard(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zintercard(...)",
      "equivalent": {
        "glide": "client.zintercard(...)"
      },
      "description": "Execute zintercard command",
      "examples": {
        "source": "await client.zintercard(...)",
        "glide": "await client.zintercard(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zdiff(...)",
      "equivalent": {
        "glide": "client.zdiff(...)"
      },
      "description": "Execute zdiff command",
      "examples": {
        "source": "await client.zdiff(...)",
        "glide": "await client.zdiff(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zdiffWithScores(...)",
      "equivalent": {
        "glide": "client.zdiffWithScores(...)"
      },
      "description": "Execute zdiffWithScores command",
      "examples": {
        "source": "await client.zdiffWithScores(...)",
        "glide": "await client.zdiffWithScores(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zdiffstore(...)",
      "equivalent": {
        "glide": "client.zdiffstore(...)"
      },
      "description": "Execute zdiffstore command",
      "examples": {
        "source": "await client.zdiffstore(...)",
        "glide": "await client.zdiffstore(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zscore(key, member)",
      "equivalent": {
        "glide": "client.zscore(key, member)"
      },
      "description": "Execute zscore command",
      "examples": {
        "source": "await client.zscore(key, member)",
        "glide": "await client.zscore(key, member)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zunionstore(...)",
      "equivalent": {
        "glide": "client.zunionstore(...)"
      },
      "description": "Execute zunionstore command",
      "examples": {
        "source": "await client.zunionstore(...)",
        "glide": "await client.zunionstore(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.zmscore(...)",
      "equivalent": {
        "glide": "client.zmscore(...)"
      },
      "description": "Execute zmscore command",
      "examples": {
        "source": "await client.zmscore(...)",
        "glide": "await client.zmscore(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zcount(...)",
      "equivalent": {
        "glide": "client.zcount(...)"
      },
      "description": "Execute zcount command",
      "examples": {
        "source": "await client.zcount(...)",
        "glide": "await client.zcount(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zrange(key, start, stop, options?)",
      "equivalent": {
        "glide": "client.zrange(key, start, stop, options?)"
      },
      "description": "Execute zrange command",
      "examples": {
        "source": "await client.zrange(key, start, stop, options?)",
        "glide": "await client.zrange(key, start, stop, options?)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zrangeWithScores(...)",
      "equivalent": {
        "glide": "client.zrangeWithScores(...)"
      },
      "description": "Execute zrangeWithScores command",
      "examples": {
        "source": "await client.zrangeWithScores(...)",
        "glide": "await client.zrangeWithScores(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zrangeStore(...)",
      "equivalent": {
        "glide": "client.zrangeStore(...)"
      },
      "description": "Execute zrangeStore command",
      "examples": {
        "source": "await client.zrangeStore(...)",
        "glide": "await client.zrangeStore(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zinterstore(...)",
      "equivalent": {
        "glide": "client.zinterstore(...)"
      },
      "description": "Execute zinterstore command",
      "examples": {
        "source": "await client.zinterstore(...)",
        "glide": "await client.zinterstore(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zinter(...)",
      "equivalent": {
        "glide": "client.zinter(...)"
      },
      "description": "Execute zinter command",
      "examples": {
        "source": "await client.zinter(...)",
        "glide": "await client.zinter(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zinterWithScores(...)",
      "equivalent": {
        "glide": "client.zinterWithScores(...)"
      },
      "description": "Execute zinterWithScores command",
      "examples": {
        "source": "await client.zinterWithScores(...)",
        "glide": "await client.zinterWithScores(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zunion(...)",
      "equivalent": {
        "glide": "client.zunion(...)"
      },
      "description": "Execute zunion command",
      "examples": {
        "source": "await client.zunion(...)",
        "glide": "await client.zunion(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zunionWithScores(...)",
      "equivalent": {
        "glide": "client.zunionWithScores(...)"
      },
      "description": "Execute zunionWithScores command",
      "examples": {
        "source": "await client.zunionWithScores(...)",
        "glide": "await client.zunionWithScores(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zrandmember(...)",
      "equivalent": {
        "glide": "client.zrandmember(...)"
      },
      "description": "Execute zrandmember command",
      "examples": {
        "source": "await client.zrandmember(...)",
        "glide": "await client.zrandmember(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zrandmemberWithCount(...)",
      "equivalent": {
        "glide": "client.zrandmemberWithCount(...)"
      },
      "description": "Execute zrandmemberWithCount command",
      "examples": {
        "source": "await client.zrandmemberWithCount(...)",
        "glide": "await client.zrandmemberWithCount(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zrandmemberWithCountWithScores(...)",
      "equivalent": {
        "glide": "client.zrandmemberWithCountWithScores(...)"
      },
      "description": "Execute zrandmemberWithCountWithScores command",
      "examples": {
        "source": "await client.zrandmemberWithCountWithScores(...)",
        "glide": "await client.zrandmemberWithCountWithScores(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.strlen(...)",
      "equivalent": {
        "glide": "client.strlen(...)"
      },
      "description": "Execute strlen command",
      "examples": {
        "source": "await client.strlen(...)",
        "glide": "await client.strlen(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.type(key)",
      "equivalent": {
        "glide": "client.type(key)"
      },
      "description": "Execute type command",
      "examples": {
        "source": "await client.type(key)",
        "glide": "await client.type(key)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zpopmin(...)",
      "equivalent": {
        "glide": "client.zpopmin(...)"
      },
      "description": "Execute zpopmin command",
      "examples": {
        "source": "await client.zpopmin(...)",
        "glide": "await client.zpopmin(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.bzpopmin(...)",
      "equivalent": {
        "glide": "client.bzpopmin(...)"
      },
      "description": "Execute bzpopmin command",
      "examples": {
        "source": "await client.bzpopmin(...)",
        "glide": "await client.bzpopmin(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zpopmax(...)",
      "equivalent": {
        "glide": "client.zpopmax(...)"
      },
      "description": "Execute zpopmax command",
      "examples": {
        "source": "await client.zpopmax(...)",
        "glide": "await client.zpopmax(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.bzpopmax(...)",
      "equivalent": {
        "glide": "client.bzpopmax(...)"
      },
      "description": "Execute bzpopmax command",
      "examples": {
        "source": "await client.bzpopmax(...)",
        "glide": "await client.bzpopmax(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.pttl(...)",
      "equivalent": {
        "glide": "client.pttl(...)"
      },
      "description": "Execute pttl command",
      "examples": {
        "source": "await client.pttl(...)",
        "glide": "await client.pttl(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zremRangeByRank(...)",
      "equivalent": {
        "glide": "client.zremRangeByRank(...)"
      },
      "description": "Execute zremRangeByRank command",
      "examples": {
        "source": "await client.zremRangeByRank(...)",
        "glide": "await client.zremRangeByRank(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zremRangeByLex(...)",
      "equivalent": {
        "glide": "client.zremRangeByLex(...)"
      },
      "description": "Execute zremRangeByLex command",
      "examples": {
        "source": "await client.zremRangeByLex(...)",
        "glide": "await client.zremRangeByLex(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zremRangeByScore(...)",
      "equivalent": {
        "glide": "client.zremRangeByScore(...)"
      },
      "description": "Execute zremRangeByScore command",
      "examples": {
        "source": "await client.zremRangeByScore(...)",
        "glide": "await client.zremRangeByScore(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.zlexcount(...)",
      "equivalent": {
        "glide": "client.zlexcount(...)"
      },
      "description": "Execute zlexcount command",
      "examples": {
        "source": "await client.zlexcount(...)",
        "glide": "await client.zlexcount(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zrank(key, member)",
      "equivalent": {
        "glide": "client.zrank(key, member)"
      },
      "description": "Execute zrank command",
      "examples": {
        "source": "await client.zrank(key, member)",
        "glide": "await client.zrank(key, member)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zrankWithScore(...)",
      "equivalent": {
        "glide": "client.zrankWithScore(...)"
      },
      "description": "Execute zrankWithScore command",
      "examples": {
        "source": "await client.zrankWithScore(...)",
        "glide": "await client.zrankWithScore(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zrevrank(...)",
      "equivalent": {
        "glide": "client.zrevrank(...)"
      },
      "description": "Execute zrevrank command",
      "examples": {
        "source": "await client.zrevrank(...)",
        "glide": "await client.zrevrank(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zrevrankWithScore(...)",
      "equivalent": {
        "glide": "client.zrevrankWithScore(...)"
      },
      "description": "Execute zrevrankWithScore command",
      "examples": {
        "source": "await client.zrevrankWithScore(...)",
        "glide": "await client.zrevrankWithScore(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xadd(key, entries, options?)",
      "equivalent": {
        "glide": "client.xadd(key, entries, options?)"
      },
      "description": "Execute xadd command",
      "examples": {
        "source": "await client.xadd(key, entries, options?)",
        "glide": "await client.xadd(key, entries, options?)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xdel(...)",
      "equivalent": {
        "glide": "client.xdel(...)"
      },
      "description": "Execute xdel command",
      "examples": {
        "source": "await client.xdel(...)",
        "glide": "await client.xdel(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xtrim(...)",
      "equivalent": {
        "glide": "client.xtrim(...)"
      },
      "description": "Execute xtrim command",
      "examples": {
        "source": "await client.xtrim(...)",
        "glide": "await client.xtrim(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xread(keys, options?)",
      "equivalent": {
        "glide": "client.xread(keys, options?)"
      },
      "description": "Execute xread command",
      "examples": {
        "source": "await client.xread(keys, options?)",
        "glide": "await client.xread(keys, options?)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xreadgroup(group, consumer, keys, options?)",
      "equivalent": {
        "glide": "client.xreadgroup(group, consumer, keys, options?)"
      },
      "description": "Execute xreadgroup command",
      "examples": {
        "source": "await client.xreadgroup(group, consumer, keys, options?)",
        "glide": "await client.xreadgroup(group, consumer, keys, options?)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xlen(...)",
      "equivalent": {
        "glide": "client.xlen(...)"
      },
      "description": "Execute xlen command",
      "examples": {
        "source": "await client.xlen(...)",
        "glide": "await client.xlen(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xpending(...)",
      "equivalent": {
        "glide": "client.xpending(...)"
      },
      "description": "Execute xpending command",
      "examples": {
        "source": "await client.xpending(...)",
        "glide": "await client.xpending(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xpendingWithOptions(...)",
      "equivalent": {
        "glide": "client.xpendingWithOptions(...)"
      },
      "description": "Execute xpendingWithOptions command",
      "examples": {
        "source": "await client.xpendingWithOptions(...)",
        "glide": "await client.xpendingWithOptions(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xinfoConsumers(...)",
      "equivalent": {
        "glide": "client.xinfoConsumers(...)"
      },
      "description": "Execute xinfoConsumers command",
      "examples": {
        "source": "await client.xinfoConsumers(...)",
        "glide": "await client.xinfoConsumers(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xinfoGroups(...)",
      "equivalent": {
        "glide": "client.xinfoGroups(...)"
      },
      "description": "Execute xinfoGroups command",
      "examples": {
        "source": "await client.xinfoGroups(...)",
        "glide": "await client.xinfoGroups(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xclaim(...)",
      "equivalent": {
        "glide": "client.xclaim(...)"
      },
      "description": "Execute xclaim command",
      "examples": {
        "source": "await client.xclaim(...)",
        "glide": "await client.xclaim(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.xautoclaim(...)",
      "equivalent": {
        "glide": "client.xautoclaim(...)"
      },
      "description": "Execute xautoclaim command",
      "examples": {
        "source": "await client.xautoclaim(...)",
        "glide": "await client.xautoclaim(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.xautoclaimJustId(...)",
      "equivalent": {
        "glide": "client.xautoclaimJustId(...)"
      },
      "description": "Execute xautoclaimJustId command",
      "examples": {
        "source": "await client.xautoclaimJustId(...)",
        "glide": "await client.xautoclaimJustId(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xclaimJustId(...)",
      "equivalent": {
        "glide": "client.xclaimJustId(...)"
      },
      "description": "Execute xclaimJustId command",
      "examples": {
        "source": "await client.xclaimJustId(...)",
        "glide": "await client.xclaimJustId(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xgroupCreate(...)",
      "equivalent": {
        "glide": "client.xgroupCreate(...)"
      },
      "description": "Execute xgroupCreate command",
      "examples": {
        "source": "await client.xgroupCreate(...)",
        "glide": "await client.xgroupCreate(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xgroupDestroy(...)",
      "equivalent": {
        "glide": "client.xgroupDestroy(...)"
      },
      "description": "Execute xgroupDestroy command",
      "examples": {
        "source": "await client.xgroupDestroy(...)",
        "glide": "await client.xgroupDestroy(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xinfoStream(...)",
      "equivalent": {
        "glide": "client.xinfoStream(...)"
      },
      "description": "Execute xinfoStream command",
      "examples": {
        "source": "await client.xinfoStream(...)",
        "glide": "await client.xinfoStream(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xgroupCreateConsumer(...)",
      "equivalent": {
        "glide": "client.xgroupCreateConsumer(...)"
      },
      "description": "Execute xgroupCreateConsumer command",
      "examples": {
        "source": "await client.xgroupCreateConsumer(...)",
        "glide": "await client.xgroupCreateConsumer(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xgroupDelConsumer(...)",
      "equivalent": {
        "glide": "client.xgroupDelConsumer(...)"
      },
      "description": "Execute xgroupDelConsumer command",
      "examples": {
        "source": "await client.xgroupDelConsumer(...)",
        "glide": "await client.xgroupDelConsumer(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xack(...)",
      "equivalent": {
        "glide": "client.xack(...)"
      },
      "description": "Execute xack command",
      "examples": {
        "source": "await client.xack(...)",
        "glide": "await client.xack(...)"
      }
    },
    {
      "category": "streams",
      "symbol": "client.xgroupSetId(...)",
      "equivalent": {
        "glide": "client.xgroupSetId(...)"
      },
      "description": "Execute xgroupSetId command",
      "examples": {
        "source": "await client.xgroupSetId(...)",
        "glide": "await client.xgroupSetId(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.lindex(key, index)",
      "equivalent": {
        "glide": "client.lindex(key, index)"
      },
      "description": "Execute lindex command",
      "examples": {
        "source": "await client.lindex(key, index)",
        "glide": "await client.lindex(key, index)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.linsert(...)",
      "equivalent": {
        "glide": "client.linsert(...)"
      },
      "description": "Execute linsert command",
      "examples": {
        "source": "await client.linsert(...)",
        "glide": "await client.linsert(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.persist(...)",
      "equivalent": {
        "glide": "client.persist(...)"
      },
      "description": "Execute persist command",
      "examples": {
        "source": "await client.persist(...)",
        "glide": "await client.persist(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.rename(...)",
      "equivalent": {
        "glide": "client.rename(...)"
      },
      "description": "Execute rename command",
      "examples": {
        "source": "await client.rename(...)",
        "glide": "await client.rename(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.renamenx(...)",
      "equivalent": {
        "glide": "client.renamenx(...)"
      },
      "description": "Execute renamenx command",
      "examples": {
        "source": "await client.renamenx(...)",
        "glide": "await client.renamenx(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.brpop(...)",
      "equivalent": {
        "glide": "client.brpop(...)"
      },
      "description": "Execute brpop command",
      "examples": {
        "source": "await client.brpop(...)",
        "glide": "await client.brpop(...)"
      }
    },
    {
      "category": "lists",
      "symbol": "client.blpop(...)",
      "equivalent": {
        "glide": "client.blpop(...)"
      },
      "description": "Execute blpop command",
      "examples": {
        "source": "await client.blpop(...)",
        "glide": "await client.blpop(...)"
      }
    },
    {
      "category": "hyperloglog",
      "symbol": "client.pfadd(...)",
      "equivalent": {
        "glide": "client.pfadd(...)"
      },
      "description": "Execute pfadd command",
      "examples": {
        "source": "await client.pfadd(...)",
        "glide": "await client.pfadd(...)"
      }
    },
    {
      "category": "hyperloglog",
      "symbol": "client.pfcount(...)",
      "equivalent": {
        "glide": "client.pfcount(...)"
      },
      "description": "Execute pfcount command",
      "examples": {
        "source": "await client.pfcount(...)",
        "glide": "await client.pfcount(...)"
      }
    },
    {
      "category": "hyperloglog",
      "symbol": "client.pfmerge(...)",
      "equivalent": {
        "glide": "client.pfmerge(...)"
      },
      "description": "Execute pfmerge command",
      "examples": {
        "source": "await client.pfmerge(...)",
        "glide": "await client.pfmerge(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.objectEncoding(...)",
      "equivalent": {
        "glide": "client.objectEncoding(...)"
      },
      "description": "Execute objectEncoding command",
      "examples": {
        "source": "await client.objectEncoding(...)",
        "glide": "await client.objectEncoding(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.objectFreq(...)",
      "equivalent": {
        "glide": "client.objectFreq(...)"
      },
      "description": "Execute objectFreq command",
      "examples": {
        "source": "await client.objectFreq(...)",
        "glide": "await client.objectFreq(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.objectIdletime(...)",
      "equivalent": {
        "glide": "client.objectIdletime(...)"
      },
      "description": "Execute objectIdletime command",
      "examples": {
        "source": "await client.objectIdletime(...)",
        "glide": "await client.objectIdletime(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.objectRefcount(...)",
      "equivalent": {
        "glide": "client.objectRefcount(...)"
      },
      "description": "Execute objectRefcount command",
      "examples": {
        "source": "await client.objectRefcount(...)",
        "glide": "await client.objectRefcount(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.fcall(...)",
      "equivalent": {
        "glide": "client.fcall(...)"
      },
      "description": "Execute fcall command",
      "examples": {
        "source": "await client.fcall(...)",
        "glide": "await client.fcall(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.fcallReadonly(...)",
      "equivalent": {
        "glide": "client.fcallReadonly(...)"
      },
      "description": "Execute fcallReadonly command",
      "examples": {
        "source": "await client.fcallReadonly(...)",
        "glide": "await client.fcallReadonly(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.lpos(...)",
      "equivalent": {
        "glide": "client.lpos(...)"
      },
      "description": "Execute lpos command",
      "examples": {
        "source": "await client.lpos(...)",
        "glide": "await client.lpos(...)"
      }
    },
    {
      "category": "bitmap",
      "symbol": "client.bitcount(...)",
      "equivalent": {
        "glide": "client.bitcount(...)"
      },
      "description": "Execute bitcount command",
      "examples": {
        "source": "await client.bitcount(...)",
        "glide": "await client.bitcount(...)"
      }
    },
    {
      "category": "geo",
      "symbol": "client.geoadd(...)",
      "equivalent": {
        "glide": "client.geoadd(...)"
      },
      "description": "Execute geoadd command",
      "examples": {
        "source": "await client.geoadd(...)",
        "glide": "await client.geoadd(...)"
      }
    },
    {
      "category": "geo",
      "symbol": "client.geosearch(...)",
      "equivalent": {
        "glide": "client.geosearch(...)"
      },
      "description": "Execute geosearch command",
      "examples": {
        "source": "await client.geosearch(...)",
        "glide": "await client.geosearch(...)"
      }
    },
    {
      "category": "geo",
      "symbol": "client.geosearchstore(...)",
      "equivalent": {
        "glide": "client.geosearchstore(...)"
      },
      "description": "Execute geosearchstore command",
      "examples": {
        "source": "await client.geosearchstore(...)",
        "glide": "await client.geosearchstore(...)"
      }
    },
    {
      "category": "geo",
      "symbol": "client.geopos(...)",
      "equivalent": {
        "glide": "client.geopos(...)"
      },
      "description": "Execute geopos command",
      "examples": {
        "source": "await client.geopos(...)",
        "glide": "await client.geopos(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.zmpop(...)",
      "equivalent": {
        "glide": "client.zmpop(...)"
      },
      "description": "Execute zmpop command",
      "examples": {
        "source": "await client.zmpop(...)",
        "glide": "await client.zmpop(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.bzmpop(...)",
      "equivalent": {
        "glide": "client.bzmpop(...)"
      },
      "description": "Execute bzmpop command",
      "examples": {
        "source": "await client.bzmpop(...)",
        "glide": "await client.bzmpop(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zincrby(...)",
      "equivalent": {
        "glide": "client.zincrby(...)"
      },
      "description": "Execute zincrby command",
      "examples": {
        "source": "await client.zincrby(...)",
        "glide": "await client.zincrby(...)"
      }
    },
    {
      "category": "sorted-sets",
      "symbol": "client.zscan(...)",
      "equivalent": {
        "glide": "client.zscan(...)"
      },
      "description": "Execute zscan command",
      "examples": {
        "source": "await client.zscan(...)",
        "glide": "await client.zscan(...)"
      }
    },
    {
      "category": "geo",
      "symbol": "client.geodist(...)",
      "equivalent": {
        "glide": "client.geodist(...)"
      },
      "description": "Execute geodist command",
      "examples": {
        "source": "await client.geodist(...)",
        "glide": "await client.geodist(...)"
      }
    },
    {
      "category": "geo",
      "symbol": "client.geohash(...)",
      "equivalent": {
        "glide": "client.geohash(...)"
      },
      "description": "Execute geohash command",
      "examples": {
        "source": "await client.geohash(...)",
        "glide": "await client.geohash(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.lcs(...)",
      "equivalent": {
        "glide": "client.lcs(...)"
      },
      "description": "Execute lcs command",
      "examples": {
        "source": "await client.lcs(...)",
        "glide": "await client.lcs(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.lcsLen(...)",
      "equivalent": {
        "glide": "client.lcsLen(...)"
      },
      "description": "Execute lcsLen command",
      "examples": {
        "source": "await client.lcsLen(...)",
        "glide": "await client.lcsLen(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.lcsIdx(...)",
      "equivalent": {
        "glide": "client.lcsIdx(...)"
      },
      "description": "Execute lcsIdx command",
      "examples": {
        "source": "await client.lcsIdx(...)",
        "glide": "await client.lcsIdx(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.touch(...)",
      "equivalent": {
        "glide": "client.touch(...)"
      },
      "description": "Execute touch command",
      "examples": {
        "source": "await client.touch(...)",
        "glide": "await client.touch(...)"
      }
    },
    {
      "category": "transactions",
      "symbol": "client.watch(...)",
      "equivalent": {
        "glide": "client.watch(...)"
      },
      "description": "Execute watch command",
      "examples": {
        "source": "await client.watch(...)",
        "glide": "await client.watch(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.wait(...)",
      "equivalent": {
        "glide": "client.wait(...)"
      },
      "description": "Execute wait command",
      "examples": {
        "source": "await client.wait(...)",
        "glide": "await client.wait(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.setrange(...)",
      "equivalent": {
        "glide": "client.setrange(...)"
      },
      "description": "Execute setrange command",
      "examples": {
        "source": "await client.setrange(...)",
        "glide": "await client.setrange(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.append(...)",
      "equivalent": {
        "glide": "client.append(...)"
      },
      "description": "Execute append command",
      "examples": {
        "source": "await client.append(...)",
        "glide": "await client.append(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.lmpop(...)",
      "equivalent": {
        "glide": "client.lmpop(...)"
      },
      "description": "Execute lmpop command",
      "examples": {
        "source": "await client.lmpop(...)",
        "glide": "await client.lmpop(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.blmpop(...)",
      "equivalent": {
        "glide": "client.blmpop(...)"
      },
      "description": "Execute blmpop command",
      "examples": {
        "source": "await client.blmpop(...)",
        "glide": "await client.blmpop(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "client.pubsubChannels(...)",
      "equivalent": {
        "glide": "client.pubsubChannels(...)"
      },
      "description": "Execute pubsubChannels command",
      "examples": {
        "source": "await client.pubsubChannels(...)",
        "glide": "await client.pubsubChannels(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "client.pubsubNumPat(...)",
      "equivalent": {
        "glide": "client.pubsubNumPat(...)"
      },
      "description": "Execute pubsubNumPat command",
      "examples": {
        "source": "await client.pubsubNumPat(...)",
        "glide": "await client.pubsubNumPat(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "client.pubsubNumSub(...)",
      "equivalent": {
        "glide": "client.pubsubNumSub(...)"
      },
      "description": "Execute pubsubNumSub command",
      "examples": {
        "source": "await client.pubsubNumSub(...)",
        "glide": "await client.pubsubNumSub(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.sort(...)",
      "equivalent": {
        "glide": "client.sort(...)"
      },
      "description": "Execute sort command",
      "examples": {
        "source": "await client.sort(...)",
        "glide": "await client.sort(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.sortReadOnly(...)",
      "equivalent": {
        "glide": "client.sortReadOnly(...)"
      },
      "description": "Execute sortReadOnly command",
      "examples": {
        "source": "await client.sortReadOnly(...)",
        "glide": "await client.sortReadOnly(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.sortStore(...)",
      "equivalent": {
        "glide": "client.sortStore(...)"
      },
      "description": "Execute sortStore command",
      "examples": {
        "source": "await client.sortStore(...)",
        "glide": "await client.sortStore(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.createClientRequest(...)",
      "equivalent": {
        "glide": "client.createClientRequest(...)"
      },
      "description": "Execute createClientRequest command",
      "examples": {
        "source": "await client.createClientRequest(...)",
        "glide": "await client.createClientRequest(...)"
      }
    },
    {
      "category": "server",
      "symbol": "client.configureAdvancedConfigurationBase(...)",
      "equivalent": {
        "glide": "client.configureAdvancedConfigurationBase(...)"
      },
      "description": "Execute configureAdvancedConfigurationBase command",
      "examples": {
        "source": "await client.configureAdvancedConfigurationBase(...)",
        "glide": "await client.configureAdvancedConfigurationBase(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.connectToServer(...)",
      "equivalent": {
        "glide": "client.connectToServer(...)"
      },
      "description": "Execute connectToServer command",
      "examples": {
        "source": "await client.connectToServer(...)",
        "glide": "await client.connectToServer(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.close(...)",
      "equivalent": {
        "glide": "client.close(...)"
      },
      "description": "Execute close command",
      "examples": {
        "source": "await client.close(...)",
        "glide": "await client.close(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.__createClientInternal(...)",
      "equivalent": {
        "glide": "client.__createClientInternal(...)"
      },
      "description": "Execute __createClientInternal command",
      "examples": {
        "source": "await client.__createClientInternal(...)",
        "glide": "await client.__createClientInternal(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.GetSocket(...)",
      "equivalent": {
        "glide": "client.GetSocket(...)"
      },
      "description": "Execute GetSocket command",
      "examples": {
        "source": "await client.GetSocket(...)",
        "glide": "await client.GetSocket(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.createClientInternal(...)",
      "equivalent": {
        "glide": "client.createClientInternal(...)"
      },
      "description": "Execute createClientInternal command",
      "examples": {
        "source": "await client.createClientInternal(...)",
        "glide": "await client.createClientInternal(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.updateConnectionPassword(...)",
      "equivalent": {
        "glide": "client.updateConnectionPassword(...)"
      },
      "description": "Execute updateConnectionPassword command",
      "examples": {
        "source": "await client.updateConnectionPassword(...)",
        "glide": "await client.updateConnectionPassword(...)"
      }
    },
    {
      "category": "strings",
      "symbol": "client.getStatistics(...)",
      "equivalent": {
        "glide": "client.getStatistics(...)"
      },
      "description": "Execute getStatistics command",
      "examples": {
        "source": "await client.getStatistics(...)",
        "glide": "await client.getStatistics(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.createClient(...)",
      "equivalent": {
        "glide": "client.createClient(...)"
      },
      "description": "Execute createClient command",
      "examples": {
        "source": "await client.createClient(...)",
        "glide": "await client.createClient(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.__createClient(...)",
      "equivalent": {
        "glide": "client.__createClient(...)"
      },
      "description": "Execute __createClient command",
      "examples": {
        "source": "await client.__createClient(...)",
        "glide": "await client.__createClient(...)"
      }
    },
    {
      "category": "transactions",
      "symbol": "client.exec(...)",
      "equivalent": {
        "glide": "client.exec(...)"
      },
      "description": "Execute exec command",
      "examples": {
        "source": "await client.exec(...)",
        "glide": "await client.exec(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.customCommand(...)",
      "equivalent": {
        "glide": "client.customCommand(...)"
      },
      "description": "Execute customCommand command",
      "examples": {
        "source": "await client.customCommand(...)",
        "glide": "await client.customCommand(...)"
      }
    },
    {
      "category": "connection",
      "symbol": "client.ping(...)",
      "equivalent": {
        "glide": "client.ping(...)"
      },
      "description": "Execute ping command",
      "examples": {
        "source": "await client.ping(...)",
        "glide": "await client.ping(...)"
      }
    },
    {
      "category": "server",
      "symbol": "client.info(...)",
      "equivalent": {
        "glide": "client.info(...)"
      },
      "description": "Execute info command",
      "examples": {
        "source": "await client.info(...)",
        "glide": "await client.info(...)"
      }
    },
    {
      "category": "connection",
      "symbol": "client.select(...)",
      "equivalent": {
        "glide": "client.select(...)"
      },
      "description": "Execute select command",
      "examples": {
        "source": "await client.select(...)",
        "glide": "await client.select(...)"
      }
    },
    {
      "category": "connection",
      "symbol": "client.clientGetName(...)",
      "equivalent": {
        "glide": "client.clientGetName(...)"
      },
      "description": "Execute clientGetName command",
      "examples": {
        "source": "await client.clientGetName(...)",
        "glide": "await client.clientGetName(...)"
      }
    },
    {
      "category": "server",
      "symbol": "client.configRewrite(...)",
      "equivalent": {
        "glide": "client.configRewrite(...)"
      },
      "description": "Execute configRewrite command",
      "examples": {
        "source": "await client.configRewrite(...)",
        "glide": "await client.configRewrite(...)"
      }
    },
    {
      "category": "server",
      "symbol": "client.configResetStat(...)",
      "equivalent": {
        "glide": "client.configResetStat(...)"
      },
      "description": "Execute configResetStat command",
      "examples": {
        "source": "await client.configResetStat(...)",
        "glide": "await client.configResetStat(...)"
      }
    },
    {
      "category": "connection",
      "symbol": "client.clientId(...)",
      "equivalent": {
        "glide": "client.clientId(...)"
      },
      "description": "Execute clientId command",
      "examples": {
        "source": "await client.clientId(...)",
        "glide": "await client.clientId(...)"
      }
    },
    {
      "category": "server",
      "symbol": "client.configGet(...)",
      "equivalent": {
        "glide": "client.configGet(...)"
      },
      "description": "Execute configGet command",
      "examples": {
        "source": "await client.configGet(...)",
        "glide": "await client.configGet(...)"
      }
    },
    {
      "category": "server",
      "symbol": "client.configSet(...)",
      "equivalent": {
        "glide": "client.configSet(...)"
      },
      "description": "Execute configSet command",
      "examples": {
        "source": "await client.configSet(...)",
        "glide": "await client.configSet(...)"
      }
    },
    {
      "category": "connection",
      "symbol": "client.echo(...)",
      "equivalent": {
        "glide": "client.echo(...)"
      },
      "description": "Execute echo command",
      "examples": {
        "source": "await client.echo(...)",
        "glide": "await client.echo(...)"
      }
    },
    {
      "category": "server",
      "symbol": "client.time(...)",
      "equivalent": {
        "glide": "client.time(...)"
      },
      "description": "Execute time command",
      "examples": {
        "source": "await client.time(...)",
        "glide": "await client.time(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.copy(...)",
      "equivalent": {
        "glide": "client.copy(...)"
      },
      "description": "Execute copy command",
      "examples": {
        "source": "await client.copy(...)",
        "glide": "await client.copy(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.move(...)",
      "equivalent": {
        "glide": "client.move(...)"
      },
      "description": "Execute move command",
      "examples": {
        "source": "await client.move(...)",
        "glide": "await client.move(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.lolwut(...)",
      "equivalent": {
        "glide": "client.lolwut(...)"
      },
      "description": "Execute lolwut command",
      "examples": {
        "source": "await client.lolwut(...)",
        "glide": "await client.lolwut(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.functionDelete(...)",
      "equivalent": {
        "glide": "client.functionDelete(...)"
      },
      "description": "Execute functionDelete command",
      "examples": {
        "source": "await client.functionDelete(...)",
        "glide": "await client.functionDelete(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.functionLoad(...)",
      "equivalent": {
        "glide": "client.functionLoad(...)"
      },
      "description": "Execute functionLoad command",
      "examples": {
        "source": "await client.functionLoad(...)",
        "glide": "await client.functionLoad(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.functionFlush(...)",
      "equivalent": {
        "glide": "client.functionFlush(...)"
      },
      "description": "Execute functionFlush command",
      "examples": {
        "source": "await client.functionFlush(...)",
        "glide": "await client.functionFlush(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.functionList(...)",
      "equivalent": {
        "glide": "client.functionList(...)"
      },
      "description": "Execute functionList command",
      "examples": {
        "source": "await client.functionList(...)",
        "glide": "await client.functionList(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.functionStats(...)",
      "equivalent": {
        "glide": "client.functionStats(...)"
      },
      "description": "Execute functionStats command",
      "examples": {
        "source": "await client.functionStats(...)",
        "glide": "await client.functionStats(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.functionKill(...)",
      "equivalent": {
        "glide": "client.functionKill(...)"
      },
      "description": "Execute functionKill command",
      "examples": {
        "source": "await client.functionKill(...)",
        "glide": "await client.functionKill(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.functionDump(...)",
      "equivalent": {
        "glide": "client.functionDump(...)"
      },
      "description": "Execute functionDump command",
      "examples": {
        "source": "await client.functionDump(...)",
        "glide": "await client.functionDump(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.functionRestore(...)",
      "equivalent": {
        "glide": "client.functionRestore(...)"
      },
      "description": "Execute functionRestore command",
      "examples": {
        "source": "await client.functionRestore(...)",
        "glide": "await client.functionRestore(...)"
      }
    },
    {
      "category": "server",
      "symbol": "client.flushall(...)",
      "equivalent": {
        "glide": "client.flushall(...)"
      },
      "description": "Execute flushall command",
      "examples": {
        "source": "await client.flushall(...)",
        "glide": "await client.flushall(...)"
      }
    },
    {
      "category": "server",
      "symbol": "client.flushdb(...)",
      "equivalent": {
        "glide": "client.flushdb(...)"
      },
      "description": "Execute flushdb command",
      "examples": {
        "source": "await client.flushdb(...)",
        "glide": "await client.flushdb(...)"
      }
    },
    {
      "category": "server",
      "symbol": "client.dbsize(...)",
      "equivalent": {
        "glide": "client.dbsize(...)"
      },
      "description": "Execute dbsize command",
      "examples": {
        "source": "await client.dbsize(...)",
        "glide": "await client.dbsize(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "client.publish(...)",
      "equivalent": {
        "glide": "client.publish(...)"
      },
      "description": "Execute publish command",
      "examples": {
        "source": "await client.publish(...)",
        "glide": "await client.publish(...)"
      }
    },
    {
      "category": "server",
      "symbol": "client.lastsave(...)",
      "equivalent": {
        "glide": "client.lastsave(...)"
      },
      "description": "Execute lastsave command",
      "examples": {
        "source": "await client.lastsave(...)",
        "glide": "await client.lastsave(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.randomKey(...)",
      "equivalent": {
        "glide": "client.randomKey(...)"
      },
      "description": "Execute randomKey command",
      "examples": {
        "source": "await client.randomKey(...)",
        "glide": "await client.randomKey(...)"
      }
    },
    {
      "category": "transactions",
      "symbol": "client.unwatch(...)",
      "equivalent": {
        "glide": "client.unwatch(...)"
      },
      "description": "Execute unwatch command",
      "examples": {
        "source": "await client.unwatch(...)",
        "glide": "await client.unwatch(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.scriptExists(...)",
      "equivalent": {
        "glide": "client.scriptExists(...)"
      },
      "description": "Execute scriptExists command",
      "examples": {
        "source": "await client.scriptExists(...)",
        "glide": "await client.scriptExists(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.scriptFlush(...)",
      "equivalent": {
        "glide": "client.scriptFlush(...)"
      },
      "description": "Execute scriptFlush command",
      "examples": {
        "source": "await client.scriptFlush(...)",
        "glide": "await client.scriptFlush(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.scriptKill(...)",
      "equivalent": {
        "glide": "client.scriptKill(...)"
      },
      "description": "Execute scriptKill command",
      "examples": {
        "source": "await client.scriptKill(...)",
        "glide": "await client.scriptKill(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.scan(...)",
      "equivalent": {
        "glide": "client.scan(...)"
      },
      "description": "Execute scan command",
      "examples": {
        "source": "await client.scan(...)",
        "glide": "await client.scan(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.scanOptionsToProto(...)",
      "equivalent": {
        "glide": "client.scanOptionsToProto(...)"
      },
      "description": "Execute scanOptionsToProto command",
      "examples": {
        "source": "await client.scanOptionsToProto(...)",
        "glide": "await client.scanOptionsToProto(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.createClusterScanPromise(...)",
      "equivalent": {
        "glide": "client.createClusterScanPromise(...)"
      },
      "description": "Execute createClusterScanPromise command",
      "examples": {
        "source": "await client.createClusterScanPromise(...)",
        "glide": "await client.createClusterScanPromise(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.fcallWithRoute(...)",
      "equivalent": {
        "glide": "client.fcallWithRoute(...)"
      },
      "description": "Execute fcallWithRoute command",
      "examples": {
        "source": "await client.fcallWithRoute(...)",
        "glide": "await client.fcallWithRoute(...)"
      }
    },
    {
      "category": "scripting",
      "symbol": "client.fcallReadonlyWithRoute(...)",
      "equivalent": {
        "glide": "client.fcallReadonlyWithRoute(...)"
      },
      "description": "Execute fcallReadonlyWithRoute command",
      "examples": {
        "source": "await client.fcallReadonlyWithRoute(...)",
        "glide": "await client.fcallReadonlyWithRoute(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "client.pubsubShardChannels(...)",
      "equivalent": {
        "glide": "client.pubsubShardChannels(...)"
      },
      "description": "Execute pubsubShardChannels command",
      "examples": {
        "source": "await client.pubsubShardChannels(...)",
        "glide": "await client.pubsubShardChannels(...)"
      }
    },
    {
      "category": "pubsub",
      "symbol": "client.pubsubShardNumSub(...)",
      "equivalent": {
        "glide": "client.pubsubShardNumSub(...)"
      },
      "description": "Execute pubsubShardNumSub command",
      "examples": {
        "source": "await client.pubsubShardNumSub(...)",
        "glide": "await client.pubsubShardNumSub(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.invokeScriptWithRoute(...)",
      "equivalent": {
        "glide": "client.invokeScriptWithRoute(...)"
      },
      "description": "Execute invokeScriptWithRoute command",
      "examples": {
        "source": "await client.invokeScriptWithRoute(...)",
        "glide": "await client.invokeScriptWithRoute(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.toArg(...)",
      "equivalent": {
        "glide": "client.toArg(...)"
      },
      "description": "Execute toArg command",
      "examples": {
        "source": "await client.toArg(...)",
        "glide": "await client.toArg(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.toArgs(...)",
      "equivalent": {
        "glide": "client.toArgs(...)"
      },
      "description": "Execute toArgs command",
      "examples": {
        "source": "await client.toArgs(...)",
        "glide": "await client.toArgs(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.addAndReturn(...)",
      "equivalent": {
        "glide": "client.addAndReturn(...)"
      },
      "description": "Execute addAndReturn command",
      "examples": {
        "source": "await client.addAndReturn(...)",
        "glide": "await client.addAndReturn(...)"
      }
    },
    {
      "category": "generic",
      "symbol": "client.expireTime(...)",
      "equivalent": {
        "glide": "client.expireTime(...)"
      },
      "description": "Execute expireTime command",
      "examples": {
        "source": "await client.expireTime(...)",
        "glide": "await client.expireTime(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.pexpireTime(...)",
      "equivalent": {
        "glide": "client.pexpireTime(...)"
      },
      "description": "Execute pexpireTime command",
      "examples": {
        "source": "await client.pexpireTime(...)",
        "glide": "await client.pexpireTime(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.create(...)",
      "equivalent": {
        "glide": "client.create(...)"
      },
      "description": "Execute create command",
      "examples": {
        "source": "await client.create(...)",
        "glide": "await client.create(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.dropindex(...)",
      "equivalent": {
        "glide": "client.dropindex(...)"
      },
      "description": "Execute dropindex command",
      "examples": {
        "source": "await client.dropindex(...)",
        "glide": "await client.dropindex(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.list(...)",
      "equivalent": {
        "glide": "client.list(...)"
      },
      "description": "Execute list command",
      "examples": {
        "source": "await client.list(...)",
        "glide": "await client.list(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.aggregate(...)",
      "equivalent": {
        "glide": "client.aggregate(...)"
      },
      "description": "Execute aggregate command",
      "examples": {
        "source": "await client.aggregate(...)",
        "glide": "await client.aggregate(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.explain(...)",
      "equivalent": {
        "glide": "client.explain(...)"
      },
      "description": "Execute explain command",
      "examples": {
        "source": "await client.explain(...)",
        "glide": "await client.explain(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.explaincli(...)",
      "equivalent": {
        "glide": "client.explaincli(...)"
      },
      "description": "Execute explaincli command",
      "examples": {
        "source": "await client.explaincli(...)",
        "glide": "await client.explaincli(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.search(...)",
      "equivalent": {
        "glide": "client.search(...)"
      },
      "description": "Execute search command",
      "examples": {
        "source": "await client.search(...)",
        "glide": "await client.search(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.profileSearch(...)",
      "equivalent": {
        "glide": "client.profileSearch(...)"
      },
      "description": "Execute profileSearch command",
      "examples": {
        "source": "await client.profileSearch(...)",
        "glide": "await client.profileSearch(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.profileAggregate(...)",
      "equivalent": {
        "glide": "client.profileAggregate(...)"
      },
      "description": "Execute profileAggregate command",
      "examples": {
        "source": "await client.profileAggregate(...)",
        "glide": "await client.profileAggregate(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.aliasadd(...)",
      "equivalent": {
        "glide": "client.aliasadd(...)"
      },
      "description": "Execute aliasadd command",
      "examples": {
        "source": "await client.aliasadd(...)",
        "glide": "await client.aliasadd(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.aliasdel(...)",
      "equivalent": {
        "glide": "client.aliasdel(...)"
      },
      "description": "Execute aliasdel command",
      "examples": {
        "source": "await client.aliasdel(...)",
        "glide": "await client.aliasdel(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.aliasupdate(...)",
      "equivalent": {
        "glide": "client.aliasupdate(...)"
      },
      "description": "Execute aliasupdate command",
      "examples": {
        "source": "await client.aliasupdate(...)",
        "glide": "await client.aliasupdate(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.aliaslist(...)",
      "equivalent": {
        "glide": "client.aliaslist(...)"
      },
      "description": "Execute aliaslist command",
      "examples": {
        "source": "await client.aliaslist(...)",
        "glide": "await client.aliaslist(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.arrinsert(...)",
      "equivalent": {
        "glide": "client.arrinsert(...)"
      },
      "description": "Execute arrinsert command",
      "examples": {
        "source": "await client.arrinsert(...)",
        "glide": "await client.arrinsert(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.arrpop(...)",
      "equivalent": {
        "glide": "client.arrpop(...)"
      },
      "description": "Execute arrpop command",
      "examples": {
        "source": "await client.arrpop(...)",
        "glide": "await client.arrpop(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.arrlen(...)",
      "equivalent": {
        "glide": "client.arrlen(...)"
      },
      "description": "Execute arrlen command",
      "examples": {
        "source": "await client.arrlen(...)",
        "glide": "await client.arrlen(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.arrtrim(...)",
      "equivalent": {
        "glide": "client.arrtrim(...)"
      },
      "description": "Execute arrtrim command",
      "examples": {
        "source": "await client.arrtrim(...)",
        "glide": "await client.arrtrim(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.arrindex(...)",
      "equivalent": {
        "glide": "client.arrindex(...)"
      },
      "description": "Execute arrindex command",
      "examples": {
        "source": "await client.arrindex(...)",
        "glide": "await client.arrindex(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.toggle(...)",
      "equivalent": {
        "glide": "client.toggle(...)"
      },
      "description": "Execute toggle command",
      "examples": {
        "source": "await client.toggle(...)",
        "glide": "await client.toggle(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.forget(...)",
      "equivalent": {
        "glide": "client.forget(...)"
      },
      "description": "Execute forget command",
      "examples": {
        "source": "await client.forget(...)",
        "glide": "await client.forget(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.clear(...)",
      "equivalent": {
        "glide": "client.clear(...)"
      },
      "description": "Execute clear command",
      "examples": {
        "source": "await client.clear(...)",
        "glide": "await client.clear(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.resp(...)",
      "equivalent": {
        "glide": "client.resp(...)"
      },
      "description": "Execute resp command",
      "examples": {
        "source": "await client.resp(...)",
        "glide": "await client.resp(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.strappend(...)",
      "equivalent": {
        "glide": "client.strappend(...)"
      },
      "description": "Execute strappend command",
      "examples": {
        "source": "await client.strappend(...)",
        "glide": "await client.strappend(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.arrappend(...)",
      "equivalent": {
        "glide": "client.arrappend(...)"
      },
      "description": "Execute arrappend command",
      "examples": {
        "source": "await client.arrappend(...)",
        "glide": "await client.arrappend(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.debugMemory(...)",
      "equivalent": {
        "glide": "client.debugMemory(...)"
      },
      "description": "Execute debugMemory command",
      "examples": {
        "source": "await client.debugMemory(...)",
        "glide": "await client.debugMemory(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.debugFields(...)",
      "equivalent": {
        "glide": "client.debugFields(...)"
      },
      "description": "Execute debugFields command",
      "examples": {
        "source": "await client.debugFields(...)",
        "glide": "await client.debugFields(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.numincrby(...)",
      "equivalent": {
        "glide": "client.numincrby(...)"
      },
      "description": "Execute numincrby command",
      "examples": {
        "source": "await client.numincrby(...)",
        "glide": "await client.numincrby(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.nummultby(...)",
      "equivalent": {
        "glide": "client.nummultby(...)"
      },
      "description": "Execute nummultby command",
      "examples": {
        "source": "await client.nummultby(...)",
        "glide": "await client.nummultby(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.objlen(...)",
      "equivalent": {
        "glide": "client.objlen(...)"
      },
      "description": "Execute objlen command",
      "examples": {
        "source": "await client.objlen(...)",
        "glide": "await client.objlen(...)"
      }
    },
    {
      "category": "general",
      "symbol": "client.objkeys(...)",
      "equivalent": {
        "glide": "client.objkeys(...)"
      },
      "description": "Execute objkeys command",
      "examples": {
        "source": "await client.objkeys(...)",
        "glide": "await client.objkeys(...)"
      }
    }
  ]
};

export const COMPREHENSIVE_GLIDE_MAPPINGS: ApiDataset = {
  "client": "glide",
  "version": "2.0.x",
  "entries": [
    {
      "category": "server",
      "symbol": "configurePubsub",
      "equivalent": {
        "glide": "client.configurePubsub(...)"
      },
      "description": "GLIDE method: configurePubsub"
    },
    {
      "category": "general",
      "symbol": "toProtobufRoute",
      "equivalent": {
        "glide": "client.toProtobufRoute(...)"
      },
      "description": "GLIDE method: toProtobufRoute"
    },
    {
      "category": "general",
      "symbol": "processResponse",
      "equivalent": {
        "glide": "client.processResponse(...)"
      },
      "description": "GLIDE method: processResponse"
    },
    {
      "category": "general",
      "symbol": "processPush",
      "equivalent": {
        "glide": "client.processPush(...)"
      },
      "description": "GLIDE method: processPush"
    },
    {
      "category": "strings",
      "symbol": "getCallbackIndex",
      "equivalent": {
        "glide": "client.getCallbackIndex(...)"
      },
      "description": "GLIDE method: getCallbackIndex"
    },
    {
      "category": "general",
      "symbol": "ensureClientIsOpen",
      "equivalent": {
        "glide": "client.ensureClientIsOpen(...)"
      },
      "description": "GLIDE method: ensureClientIsOpen"
    },
    {
      "category": "general",
      "symbol": "createWritePromise",
      "equivalent": {
        "glide": "client.createWritePromise(...)"
      },
      "description": "GLIDE method: createWritePromise"
    },
    {
      "category": "general",
      "symbol": "createUpdateConnectionPasswordPromise",
      "equivalent": {
        "glide": "client.createUpdateConnectionPasswordPromise(...)"
      },
      "description": "GLIDE method: createUpdateConnectionPasswordPromise"
    },
    {
      "category": "general",
      "symbol": "createScriptInvocationPromise",
      "equivalent": {
        "glide": "client.createScriptInvocationPromise(...)"
      },
      "description": "GLIDE method: createScriptInvocationPromise"
    },
    {
      "category": "general",
      "symbol": "writeOrBufferCommandRequest",
      "equivalent": {
        "glide": "client.writeOrBufferCommandRequest(...)"
      },
      "description": "GLIDE method: writeOrBufferCommandRequest"
    },
    {
      "category": "general",
      "symbol": "writeOrBufferRequest",
      "equivalent": {
        "glide": "client.writeOrBufferRequest(...)"
      },
      "description": "GLIDE method: writeOrBufferRequest"
    },
    {
      "category": "general",
      "symbol": "processResultWithSetCommands",
      "equivalent": {
        "glide": "client.processResultWithSetCommands(...)"
      },
      "description": "GLIDE method: processResultWithSetCommands"
    },
    {
      "category": "general",
      "symbol": "cancelPubSubFuturesWithExceptionSafe",
      "equivalent": {
        "glide": "client.cancelPubSubFuturesWithExceptionSafe(...)"
      },
      "description": "GLIDE method: cancelPubSubFuturesWithExceptionSafe"
    },
    {
      "category": "general",
      "symbol": "isPubsubConfigured",
      "equivalent": {
        "glide": "client.isPubsubConfigured(...)"
      },
      "description": "GLIDE method: isPubsubConfigured"
    },
    {
      "category": "strings",
      "symbol": "getPubsubCallbackAndContext",
      "equivalent": {
        "glide": "client.getPubsubCallbackAndContext(...)"
      },
      "description": "GLIDE method: getPubsubCallbackAndContext"
    },
    {
      "category": "strings",
      "symbol": "getPubSubMessage",
      "equivalent": {
        "glide": "client.getPubSubMessage(...)"
      },
      "description": "GLIDE method: getPubSubMessage"
    },
    {
      "category": "general",
      "symbol": "tryGetPubSubMessage",
      "equivalent": {
        "glide": "client.tryGetPubSubMessage(...)"
      },
      "description": "GLIDE method: tryGetPubSubMessage"
    },
    {
      "category": "general",
      "symbol": "notificationToPubSubMessageSafe",
      "equivalent": {
        "glide": "client.notificationToPubSubMessageSafe(...)"
      },
      "description": "GLIDE method: notificationToPubSubMessageSafe"
    },
    {
      "category": "general",
      "symbol": "completePubSubFuturesSafe",
      "equivalent": {
        "glide": "client.completePubSubFuturesSafe(...)"
      },
      "description": "GLIDE method: completePubSubFuturesSafe"
    },
    {
      "category": "strings",
      "symbol": "get",
      "equivalent": {
        "glide": "client.get(key)"
      },
      "description": "GLIDE method: get"
    },
    {
      "category": "strings",
      "symbol": "getex",
      "equivalent": {
        "glide": "client.getex(...)"
      },
      "description": "GLIDE method: getex"
    },
    {
      "category": "strings",
      "symbol": "getdel",
      "equivalent": {
        "glide": "client.getdel(...)"
      },
      "description": "GLIDE method: getdel"
    },
    {
      "category": "strings",
      "symbol": "getrange",
      "equivalent": {
        "glide": "client.getrange(...)"
      },
      "description": "GLIDE method: getrange"
    },
    {
      "category": "strings",
      "symbol": "set",
      "equivalent": {
        "glide": "client.set(key, value, options?)"
      },
      "description": "GLIDE method: set"
    },
    {
      "category": "strings",
      "symbol": "del",
      "equivalent": {
        "glide": "client.del(key)"
      },
      "description": "GLIDE method: del"
    },
    {
      "category": "generic",
      "symbol": "dump",
      "equivalent": {
        "glide": "client.dump(key)"
      },
      "description": "GLIDE method: dump"
    },
    {
      "category": "generic",
      "symbol": "restore",
      "equivalent": {
        "glide": "client.restore(...)"
      },
      "description": "GLIDE method: restore"
    },
    {
      "category": "strings",
      "symbol": "mget",
      "equivalent": {
        "glide": "client.mget(...)"
      },
      "description": "GLIDE method: mget"
    },
    {
      "category": "strings",
      "symbol": "mset",
      "equivalent": {
        "glide": "client.mset(...)"
      },
      "description": "GLIDE method: mset"
    },
    {
      "category": "strings",
      "symbol": "msetnx",
      "equivalent": {
        "glide": "client.msetnx(...)"
      },
      "description": "GLIDE method: msetnx"
    },
    {
      "category": "strings",
      "symbol": "incr",
      "equivalent": {
        "glide": "client.incr(...)"
      },
      "description": "GLIDE method: incr"
    },
    {
      "category": "strings",
      "symbol": "incrBy",
      "equivalent": {
        "glide": "client.incrBy(...)"
      },
      "description": "GLIDE method: incrBy"
    },
    {
      "category": "strings",
      "symbol": "incrByFloat",
      "equivalent": {
        "glide": "client.incrByFloat(...)"
      },
      "description": "GLIDE method: incrByFloat"
    },
    {
      "category": "strings",
      "symbol": "decr",
      "equivalent": {
        "glide": "client.decr(...)"
      },
      "description": "GLIDE method: decr"
    },
    {
      "category": "strings",
      "symbol": "decrBy",
      "equivalent": {
        "glide": "client.decrBy(...)"
      },
      "description": "GLIDE method: decrBy"
    },
    {
      "category": "bitmap",
      "symbol": "bitop",
      "equivalent": {
        "glide": "client.bitop(...)"
      },
      "description": "GLIDE method: bitop"
    },
    {
      "category": "strings",
      "symbol": "getbit",
      "equivalent": {
        "glide": "client.getbit(...)"
      },
      "description": "GLIDE method: getbit"
    },
    {
      "category": "strings",
      "symbol": "setbit",
      "equivalent": {
        "glide": "client.setbit(...)"
      },
      "description": "GLIDE method: setbit"
    },
    {
      "category": "bitmap",
      "symbol": "bitpos",
      "equivalent": {
        "glide": "client.bitpos(...)"
      },
      "description": "GLIDE method: bitpos"
    },
    {
      "category": "bitmap",
      "symbol": "bitfield",
      "equivalent": {
        "glide": "client.bitfield(...)"
      },
      "description": "GLIDE method: bitfield"
    },
    {
      "category": "bitmap",
      "symbol": "bitfieldReadOnly",
      "equivalent": {
        "glide": "client.bitfieldReadOnly(...)"
      },
      "description": "GLIDE method: bitfieldReadOnly"
    },
    {
      "category": "hashes",
      "symbol": "hget",
      "equivalent": {
        "glide": "client.hget(key, field)"
      },
      "description": "GLIDE method: hget"
    },
    {
      "category": "hashes",
      "symbol": "hset",
      "equivalent": {
        "glide": "client.hset(key, field, value)"
      },
      "description": "GLIDE method: hset"
    },
    {
      "category": "hashes",
      "symbol": "hkeys",
      "equivalent": {
        "glide": "client.hkeys(key)"
      },
      "description": "GLIDE method: hkeys"
    },
    {
      "category": "hashes",
      "symbol": "hsetnx",
      "equivalent": {
        "glide": "client.hsetnx(...)"
      },
      "description": "GLIDE method: hsetnx"
    },
    {
      "category": "hashes",
      "symbol": "hdel",
      "equivalent": {
        "glide": "client.hdel(key, ...fields)"
      },
      "description": "GLIDE method: hdel"
    },
    {
      "category": "hashes",
      "symbol": "hmget",
      "equivalent": {
        "glide": "client.hmget(key, fields)"
      },
      "description": "GLIDE method: hmget"
    },
    {
      "category": "hashes",
      "symbol": "hexists",
      "equivalent": {
        "glide": "client.hexists(...)"
      },
      "description": "GLIDE method: hexists"
    },
    {
      "category": "hashes",
      "symbol": "hgetall",
      "equivalent": {
        "glide": "client.hgetall(key)"
      },
      "description": "GLIDE method: hgetall"
    },
    {
      "category": "hashes",
      "symbol": "hincrBy",
      "equivalent": {
        "glide": "client.hincrBy(...)"
      },
      "description": "GLIDE method: hincrBy"
    },
    {
      "category": "hashes",
      "symbol": "hincrByFloat",
      "equivalent": {
        "glide": "client.hincrByFloat(...)"
      },
      "description": "GLIDE method: hincrByFloat"
    },
    {
      "category": "hashes",
      "symbol": "hlen",
      "equivalent": {
        "glide": "client.hlen(...)"
      },
      "description": "GLIDE method: hlen"
    },
    {
      "category": "hashes",
      "symbol": "hvals",
      "equivalent": {
        "glide": "client.hvals(key)"
      },
      "description": "GLIDE method: hvals"
    },
    {
      "category": "hashes",
      "symbol": "hstrlen",
      "equivalent": {
        "glide": "client.hstrlen(...)"
      },
      "description": "GLIDE method: hstrlen"
    },
    {
      "category": "hashes",
      "symbol": "hrandfield",
      "equivalent": {
        "glide": "client.hrandfield(...)"
      },
      "description": "GLIDE method: hrandfield"
    },
    {
      "category": "hashes",
      "symbol": "hscan",
      "equivalent": {
        "glide": "client.hscan(...)"
      },
      "description": "GLIDE method: hscan"
    },
    {
      "category": "hashes",
      "symbol": "hrandfieldCount",
      "equivalent": {
        "glide": "client.hrandfieldCount(...)"
      },
      "description": "GLIDE method: hrandfieldCount"
    },
    {
      "category": "hashes",
      "symbol": "hrandfieldWithValues",
      "equivalent": {
        "glide": "client.hrandfieldWithValues(...)"
      },
      "description": "GLIDE method: hrandfieldWithValues"
    },
    {
      "category": "lists",
      "symbol": "lpush",
      "equivalent": {
        "glide": "client.lpush(key, ...elements)"
      },
      "description": "GLIDE method: lpush"
    },
    {
      "category": "lists",
      "symbol": "lpushx",
      "equivalent": {
        "glide": "client.lpushx(...)"
      },
      "description": "GLIDE method: lpushx"
    },
    {
      "category": "lists",
      "symbol": "lpop",
      "equivalent": {
        "glide": "client.lpop(key, count?)"
      },
      "description": "GLIDE method: lpop"
    },
    {
      "category": "lists",
      "symbol": "lpopCount",
      "equivalent": {
        "glide": "client.lpopCount(...)"
      },
      "description": "GLIDE method: lpopCount"
    },
    {
      "category": "lists",
      "symbol": "lrange",
      "equivalent": {
        "glide": "client.lrange(key, start, stop)"
      },
      "description": "GLIDE method: lrange"
    },
    {
      "category": "lists",
      "symbol": "llen",
      "equivalent": {
        "glide": "client.llen(...)"
      },
      "description": "GLIDE method: llen"
    },
    {
      "category": "lists",
      "symbol": "lmove",
      "equivalent": {
        "glide": "client.lmove(...)"
      },
      "description": "GLIDE method: lmove"
    },
    {
      "category": "lists",
      "symbol": "blmove",
      "equivalent": {
        "glide": "client.blmove(...)"
      },
      "description": "GLIDE method: blmove"
    },
    {
      "category": "lists",
      "symbol": "lset",
      "equivalent": {
        "glide": "client.lset(key, index, element)"
      },
      "description": "GLIDE method: lset"
    },
    {
      "category": "lists",
      "symbol": "ltrim",
      "equivalent": {
        "glide": "client.ltrim(...)"
      },
      "description": "GLIDE method: ltrim"
    },
    {
      "category": "lists",
      "symbol": "lrem",
      "equivalent": {
        "glide": "client.lrem(...)"
      },
      "description": "GLIDE method: lrem"
    },
    {
      "category": "lists",
      "symbol": "rpush",
      "equivalent": {
        "glide": "client.rpush(key, ...elements)"
      },
      "description": "GLIDE method: rpush"
    },
    {
      "category": "lists",
      "symbol": "rpushx",
      "equivalent": {
        "glide": "client.rpushx(...)"
      },
      "description": "GLIDE method: rpushx"
    },
    {
      "category": "lists",
      "symbol": "rpop",
      "equivalent": {
        "glide": "client.rpop(key, count?)"
      },
      "description": "GLIDE method: rpop"
    },
    {
      "category": "lists",
      "symbol": "rpopCount",
      "equivalent": {
        "glide": "client.rpopCount(...)"
      },
      "description": "GLIDE method: rpopCount"
    },
    {
      "category": "sets",
      "symbol": "sadd",
      "equivalent": {
        "glide": "client.sadd(key, ...members)"
      },
      "description": "GLIDE method: sadd"
    },
    {
      "category": "sets",
      "symbol": "srem",
      "equivalent": {
        "glide": "client.srem(key, ...members)"
      },
      "description": "GLIDE method: srem"
    },
    {
      "category": "sets",
      "symbol": "sscan",
      "equivalent": {
        "glide": "client.sscan(...)"
      },
      "description": "GLIDE method: sscan"
    },
    {
      "category": "sets",
      "symbol": "smembers",
      "equivalent": {
        "glide": "client.smembers(key)"
      },
      "description": "GLIDE method: smembers"
    },
    {
      "category": "sets",
      "symbol": "smove",
      "equivalent": {
        "glide": "client.smove(...)"
      },
      "description": "GLIDE method: smove"
    },
    {
      "category": "sets",
      "symbol": "scard",
      "equivalent": {
        "glide": "client.scard(key)"
      },
      "description": "GLIDE method: scard"
    },
    {
      "category": "sets",
      "symbol": "sinter",
      "equivalent": {
        "glide": "client.sinter(...keys)"
      },
      "description": "GLIDE method: sinter"
    },
    {
      "category": "sets",
      "symbol": "sintercard",
      "equivalent": {
        "glide": "client.sintercard(...)"
      },
      "description": "GLIDE method: sintercard"
    },
    {
      "category": "sets",
      "symbol": "sinterstore",
      "equivalent": {
        "glide": "client.sinterstore(...)"
      },
      "description": "GLIDE method: sinterstore"
    },
    {
      "category": "sets",
      "symbol": "sdiff",
      "equivalent": {
        "glide": "client.sdiff(...keys)"
      },
      "description": "GLIDE method: sdiff"
    },
    {
      "category": "sets",
      "symbol": "sdiffstore",
      "equivalent": {
        "glide": "client.sdiffstore(...)"
      },
      "description": "GLIDE method: sdiffstore"
    },
    {
      "category": "sets",
      "symbol": "sunion",
      "equivalent": {
        "glide": "client.sunion(...keys)"
      },
      "description": "GLIDE method: sunion"
    },
    {
      "category": "sets",
      "symbol": "sunionstore",
      "equivalent": {
        "glide": "client.sunionstore(...)"
      },
      "description": "GLIDE method: sunionstore"
    },
    {
      "category": "sets",
      "symbol": "sismember",
      "equivalent": {
        "glide": "client.sismember(key, member)"
      },
      "description": "GLIDE method: sismember"
    },
    {
      "category": "sets",
      "symbol": "smismember",
      "equivalent": {
        "glide": "client.smismember(...)"
      },
      "description": "GLIDE method: smismember"
    },
    {
      "category": "sets",
      "symbol": "spop",
      "equivalent": {
        "glide": "client.spop(...)"
      },
      "description": "GLIDE method: spop"
    },
    {
      "category": "sets",
      "symbol": "spopCount",
      "equivalent": {
        "glide": "client.spopCount(...)"
      },
      "description": "GLIDE method: spopCount"
    },
    {
      "category": "sets",
      "symbol": "srandmember",
      "equivalent": {
        "glide": "client.srandmember(...)"
      },
      "description": "GLIDE method: srandmember"
    },
    {
      "category": "sets",
      "symbol": "srandmemberCount",
      "equivalent": {
        "glide": "client.srandmemberCount(...)"
      },
      "description": "GLIDE method: srandmemberCount"
    },
    {
      "category": "strings",
      "symbol": "exists",
      "equivalent": {
        "glide": "client.exists(key)"
      },
      "description": "GLIDE method: exists"
    },
    {
      "category": "generic",
      "symbol": "unlink",
      "equivalent": {
        "glide": "client.unlink(...)"
      },
      "description": "GLIDE method: unlink"
    },
    {
      "category": "generic",
      "symbol": "expire",
      "equivalent": {
        "glide": "client.expire(...)"
      },
      "description": "GLIDE method: expire"
    },
    {
      "category": "generic",
      "symbol": "expireAt",
      "equivalent": {
        "glide": "client.expireAt(...)"
      },
      "description": "GLIDE method: expireAt"
    },
    {
      "category": "generic",
      "symbol": "expiretime",
      "equivalent": {
        "glide": "client.expiretime(...)"
      },
      "description": "GLIDE method: expiretime"
    },
    {
      "category": "general",
      "symbol": "pexpire",
      "equivalent": {
        "glide": "client.pexpire(...)"
      },
      "description": "GLIDE method: pexpire"
    },
    {
      "category": "general",
      "symbol": "pexpireAt",
      "equivalent": {
        "glide": "client.pexpireAt(...)"
      },
      "description": "GLIDE method: pexpireAt"
    },
    {
      "category": "general",
      "symbol": "pexpiretime",
      "equivalent": {
        "glide": "client.pexpiretime(...)"
      },
      "description": "GLIDE method: pexpiretime"
    },
    {
      "category": "generic",
      "symbol": "ttl",
      "equivalent": {
        "glide": "client.ttl(key)"
      },
      "description": "GLIDE method: ttl"
    },
    {
      "category": "general",
      "symbol": "invokeScript",
      "equivalent": {
        "glide": "client.invokeScript(...)"
      },
      "description": "GLIDE method: invokeScript"
    },
    {
      "category": "scripting",
      "symbol": "scriptShow",
      "equivalent": {
        "glide": "client.scriptShow(...)"
      },
      "description": "GLIDE method: scriptShow"
    },
    {
      "category": "streams",
      "symbol": "xrange",
      "equivalent": {
        "glide": "client.xrange(...)"
      },
      "description": "GLIDE method: xrange"
    },
    {
      "category": "streams",
      "symbol": "xrevrange",
      "equivalent": {
        "glide": "client.xrevrange(...)"
      },
      "description": "GLIDE method: xrevrange"
    },
    {
      "category": "sorted-sets",
      "symbol": "zadd",
      "equivalent": {
        "glide": "client.zadd(key, membersScores)"
      },
      "description": "GLIDE method: zadd"
    },
    {
      "category": "sorted-sets",
      "symbol": "zaddIncr",
      "equivalent": {
        "glide": "client.zaddIncr(...)"
      },
      "description": "GLIDE method: zaddIncr"
    },
    {
      "category": "sorted-sets",
      "symbol": "zrem",
      "equivalent": {
        "glide": "client.zrem(key, ...members)"
      },
      "description": "GLIDE method: zrem"
    },
    {
      "category": "sorted-sets",
      "symbol": "zcard",
      "equivalent": {
        "glide": "client.zcard(...)"
      },
      "description": "GLIDE method: zcard"
    },
    {
      "category": "sorted-sets",
      "symbol": "zintercard",
      "equivalent": {
        "glide": "client.zintercard(...)"
      },
      "description": "GLIDE method: zintercard"
    },
    {
      "category": "sorted-sets",
      "symbol": "zdiff",
      "equivalent": {
        "glide": "client.zdiff(...)"
      },
      "description": "GLIDE method: zdiff"
    },
    {
      "category": "sorted-sets",
      "symbol": "zdiffWithScores",
      "equivalent": {
        "glide": "client.zdiffWithScores(...)"
      },
      "description": "GLIDE method: zdiffWithScores"
    },
    {
      "category": "sorted-sets",
      "symbol": "zdiffstore",
      "equivalent": {
        "glide": "client.zdiffstore(...)"
      },
      "description": "GLIDE method: zdiffstore"
    },
    {
      "category": "sorted-sets",
      "symbol": "zscore",
      "equivalent": {
        "glide": "client.zscore(key, member)"
      },
      "description": "GLIDE method: zscore"
    },
    {
      "category": "sorted-sets",
      "symbol": "zunionstore",
      "equivalent": {
        "glide": "client.zunionstore(...)"
      },
      "description": "GLIDE method: zunionstore"
    },
    {
      "category": "general",
      "symbol": "zmscore",
      "equivalent": {
        "glide": "client.zmscore(...)"
      },
      "description": "GLIDE method: zmscore"
    },
    {
      "category": "sorted-sets",
      "symbol": "zcount",
      "equivalent": {
        "glide": "client.zcount(...)"
      },
      "description": "GLIDE method: zcount"
    },
    {
      "category": "sorted-sets",
      "symbol": "zrange",
      "equivalent": {
        "glide": "client.zrange(key, start, stop, options?)"
      },
      "description": "GLIDE method: zrange"
    },
    {
      "category": "sorted-sets",
      "symbol": "zrangeWithScores",
      "equivalent": {
        "glide": "client.zrangeWithScores(...)"
      },
      "description": "GLIDE method: zrangeWithScores"
    },
    {
      "category": "sorted-sets",
      "symbol": "zrangeStore",
      "equivalent": {
        "glide": "client.zrangeStore(...)"
      },
      "description": "GLIDE method: zrangeStore"
    },
    {
      "category": "sorted-sets",
      "symbol": "zinterstore",
      "equivalent": {
        "glide": "client.zinterstore(...)"
      },
      "description": "GLIDE method: zinterstore"
    },
    {
      "category": "sorted-sets",
      "symbol": "zinter",
      "equivalent": {
        "glide": "client.zinter(...)"
      },
      "description": "GLIDE method: zinter"
    },
    {
      "category": "sorted-sets",
      "symbol": "zinterWithScores",
      "equivalent": {
        "glide": "client.zinterWithScores(...)"
      },
      "description": "GLIDE method: zinterWithScores"
    },
    {
      "category": "sorted-sets",
      "symbol": "zunion",
      "equivalent": {
        "glide": "client.zunion(...)"
      },
      "description": "GLIDE method: zunion"
    },
    {
      "category": "sorted-sets",
      "symbol": "zunionWithScores",
      "equivalent": {
        "glide": "client.zunionWithScores(...)"
      },
      "description": "GLIDE method: zunionWithScores"
    },
    {
      "category": "sorted-sets",
      "symbol": "zrandmember",
      "equivalent": {
        "glide": "client.zrandmember(...)"
      },
      "description": "GLIDE method: zrandmember"
    },
    {
      "category": "sorted-sets",
      "symbol": "zrandmemberWithCount",
      "equivalent": {
        "glide": "client.zrandmemberWithCount(...)"
      },
      "description": "GLIDE method: zrandmemberWithCount"
    },
    {
      "category": "sorted-sets",
      "symbol": "zrandmemberWithCountWithScores",
      "equivalent": {
        "glide": "client.zrandmemberWithCountWithScores(...)"
      },
      "description": "GLIDE method: zrandmemberWithCountWithScores"
    },
    {
      "category": "strings",
      "symbol": "strlen",
      "equivalent": {
        "glide": "client.strlen(...)"
      },
      "description": "GLIDE method: strlen"
    },
    {
      "category": "generic",
      "symbol": "type",
      "equivalent": {
        "glide": "client.type(key)"
      },
      "description": "GLIDE method: type"
    },
    {
      "category": "sorted-sets",
      "symbol": "zpopmin",
      "equivalent": {
        "glide": "client.zpopmin(...)"
      },
      "description": "GLIDE method: zpopmin"
    },
    {
      "category": "sorted-sets",
      "symbol": "bzpopmin",
      "equivalent": {
        "glide": "client.bzpopmin(...)"
      },
      "description": "GLIDE method: bzpopmin"
    },
    {
      "category": "sorted-sets",
      "symbol": "zpopmax",
      "equivalent": {
        "glide": "client.zpopmax(...)"
      },
      "description": "GLIDE method: zpopmax"
    },
    {
      "category": "sorted-sets",
      "symbol": "bzpopmax",
      "equivalent": {
        "glide": "client.bzpopmax(...)"
      },
      "description": "GLIDE method: bzpopmax"
    },
    {
      "category": "generic",
      "symbol": "pttl",
      "equivalent": {
        "glide": "client.pttl(...)"
      },
      "description": "GLIDE method: pttl"
    },
    {
      "category": "sorted-sets",
      "symbol": "zremRangeByRank",
      "equivalent": {
        "glide": "client.zremRangeByRank(...)"
      },
      "description": "GLIDE method: zremRangeByRank"
    },
    {
      "category": "sorted-sets",
      "symbol": "zremRangeByLex",
      "equivalent": {
        "glide": "client.zremRangeByLex(...)"
      },
      "description": "GLIDE method: zremRangeByLex"
    },
    {
      "category": "sorted-sets",
      "symbol": "zremRangeByScore",
      "equivalent": {
        "glide": "client.zremRangeByScore(...)"
      },
      "description": "GLIDE method: zremRangeByScore"
    },
    {
      "category": "general",
      "symbol": "zlexcount",
      "equivalent": {
        "glide": "client.zlexcount(...)"
      },
      "description": "GLIDE method: zlexcount"
    },
    {
      "category": "sorted-sets",
      "symbol": "zrank",
      "equivalent": {
        "glide": "client.zrank(key, member)"
      },
      "description": "GLIDE method: zrank"
    },
    {
      "category": "sorted-sets",
      "symbol": "zrankWithScore",
      "equivalent": {
        "glide": "client.zrankWithScore(...)"
      },
      "description": "GLIDE method: zrankWithScore"
    },
    {
      "category": "sorted-sets",
      "symbol": "zrevrank",
      "equivalent": {
        "glide": "client.zrevrank(...)"
      },
      "description": "GLIDE method: zrevrank"
    },
    {
      "category": "sorted-sets",
      "symbol": "zrevrankWithScore",
      "equivalent": {
        "glide": "client.zrevrankWithScore(...)"
      },
      "description": "GLIDE method: zrevrankWithScore"
    },
    {
      "category": "streams",
      "symbol": "xadd",
      "equivalent": {
        "glide": "client.xadd(key, entries, options?)"
      },
      "description": "GLIDE method: xadd"
    },
    {
      "category": "streams",
      "symbol": "xdel",
      "equivalent": {
        "glide": "client.xdel(...)"
      },
      "description": "GLIDE method: xdel"
    },
    {
      "category": "streams",
      "symbol": "xtrim",
      "equivalent": {
        "glide": "client.xtrim(...)"
      },
      "description": "GLIDE method: xtrim"
    },
    {
      "category": "streams",
      "symbol": "xread",
      "equivalent": {
        "glide": "client.xread(keys, options?)"
      },
      "description": "GLIDE method: xread"
    },
    {
      "category": "streams",
      "symbol": "xreadgroup",
      "equivalent": {
        "glide": "client.xreadgroup(group, consumer, keys, options?)"
      },
      "description": "GLIDE method: xreadgroup"
    },
    {
      "category": "streams",
      "symbol": "xlen",
      "equivalent": {
        "glide": "client.xlen(...)"
      },
      "description": "GLIDE method: xlen"
    },
    {
      "category": "streams",
      "symbol": "xpending",
      "equivalent": {
        "glide": "client.xpending(...)"
      },
      "description": "GLIDE method: xpending"
    },
    {
      "category": "streams",
      "symbol": "xpendingWithOptions",
      "equivalent": {
        "glide": "client.xpendingWithOptions(...)"
      },
      "description": "GLIDE method: xpendingWithOptions"
    },
    {
      "category": "streams",
      "symbol": "xinfoConsumers",
      "equivalent": {
        "glide": "client.xinfoConsumers(...)"
      },
      "description": "GLIDE method: xinfoConsumers"
    },
    {
      "category": "streams",
      "symbol": "xinfoGroups",
      "equivalent": {
        "glide": "client.xinfoGroups(...)"
      },
      "description": "GLIDE method: xinfoGroups"
    },
    {
      "category": "streams",
      "symbol": "xclaim",
      "equivalent": {
        "glide": "client.xclaim(...)"
      },
      "description": "GLIDE method: xclaim"
    },
    {
      "category": "general",
      "symbol": "xautoclaim",
      "equivalent": {
        "glide": "client.xautoclaim(...)"
      },
      "description": "GLIDE method: xautoclaim"
    },
    {
      "category": "general",
      "symbol": "xautoclaimJustId",
      "equivalent": {
        "glide": "client.xautoclaimJustId(...)"
      },
      "description": "GLIDE method: xautoclaimJustId"
    },
    {
      "category": "streams",
      "symbol": "xclaimJustId",
      "equivalent": {
        "glide": "client.xclaimJustId(...)"
      },
      "description": "GLIDE method: xclaimJustId"
    },
    {
      "category": "streams",
      "symbol": "xgroupCreate",
      "equivalent": {
        "glide": "client.xgroupCreate(...)"
      },
      "description": "GLIDE method: xgroupCreate"
    },
    {
      "category": "streams",
      "symbol": "xgroupDestroy",
      "equivalent": {
        "glide": "client.xgroupDestroy(...)"
      },
      "description": "GLIDE method: xgroupDestroy"
    },
    {
      "category": "streams",
      "symbol": "xinfoStream",
      "equivalent": {
        "glide": "client.xinfoStream(...)"
      },
      "description": "GLIDE method: xinfoStream"
    },
    {
      "category": "streams",
      "symbol": "xgroupCreateConsumer",
      "equivalent": {
        "glide": "client.xgroupCreateConsumer(...)"
      },
      "description": "GLIDE method: xgroupCreateConsumer"
    },
    {
      "category": "streams",
      "symbol": "xgroupDelConsumer",
      "equivalent": {
        "glide": "client.xgroupDelConsumer(...)"
      },
      "description": "GLIDE method: xgroupDelConsumer"
    },
    {
      "category": "streams",
      "symbol": "xack",
      "equivalent": {
        "glide": "client.xack(...)"
      },
      "description": "GLIDE method: xack"
    },
    {
      "category": "streams",
      "symbol": "xgroupSetId",
      "equivalent": {
        "glide": "client.xgroupSetId(...)"
      },
      "description": "GLIDE method: xgroupSetId"
    },
    {
      "category": "lists",
      "symbol": "lindex",
      "equivalent": {
        "glide": "client.lindex(key, index)"
      },
      "description": "GLIDE method: lindex"
    },
    {
      "category": "lists",
      "symbol": "linsert",
      "equivalent": {
        "glide": "client.linsert(...)"
      },
      "description": "GLIDE method: linsert"
    },
    {
      "category": "generic",
      "symbol": "persist",
      "equivalent": {
        "glide": "client.persist(...)"
      },
      "description": "GLIDE method: persist"
    },
    {
      "category": "generic",
      "symbol": "rename",
      "equivalent": {
        "glide": "client.rename(...)"
      },
      "description": "GLIDE method: rename"
    },
    {
      "category": "generic",
      "symbol": "renamenx",
      "equivalent": {
        "glide": "client.renamenx(...)"
      },
      "description": "GLIDE method: renamenx"
    },
    {
      "category": "lists",
      "symbol": "brpop",
      "equivalent": {
        "glide": "client.brpop(...)"
      },
      "description": "GLIDE method: brpop"
    },
    {
      "category": "lists",
      "symbol": "blpop",
      "equivalent": {
        "glide": "client.blpop(...)"
      },
      "description": "GLIDE method: blpop"
    },
    {
      "category": "hyperloglog",
      "symbol": "pfadd",
      "equivalent": {
        "glide": "client.pfadd(...)"
      },
      "description": "GLIDE method: pfadd"
    },
    {
      "category": "hyperloglog",
      "symbol": "pfcount",
      "equivalent": {
        "glide": "client.pfcount(...)"
      },
      "description": "GLIDE method: pfcount"
    },
    {
      "category": "hyperloglog",
      "symbol": "pfmerge",
      "equivalent": {
        "glide": "client.pfmerge(...)"
      },
      "description": "GLIDE method: pfmerge"
    },
    {
      "category": "generic",
      "symbol": "objectEncoding",
      "equivalent": {
        "glide": "client.objectEncoding(...)"
      },
      "description": "GLIDE method: objectEncoding"
    },
    {
      "category": "generic",
      "symbol": "objectFreq",
      "equivalent": {
        "glide": "client.objectFreq(...)"
      },
      "description": "GLIDE method: objectFreq"
    },
    {
      "category": "generic",
      "symbol": "objectIdletime",
      "equivalent": {
        "glide": "client.objectIdletime(...)"
      },
      "description": "GLIDE method: objectIdletime"
    },
    {
      "category": "generic",
      "symbol": "objectRefcount",
      "equivalent": {
        "glide": "client.objectRefcount(...)"
      },
      "description": "GLIDE method: objectRefcount"
    },
    {
      "category": "scripting",
      "symbol": "fcall",
      "equivalent": {
        "glide": "client.fcall(...)"
      },
      "description": "GLIDE method: fcall"
    },
    {
      "category": "scripting",
      "symbol": "fcallReadonly",
      "equivalent": {
        "glide": "client.fcallReadonly(...)"
      },
      "description": "GLIDE method: fcallReadonly"
    },
    {
      "category": "general",
      "symbol": "lpos",
      "equivalent": {
        "glide": "client.lpos(...)"
      },
      "description": "GLIDE method: lpos"
    },
    {
      "category": "bitmap",
      "symbol": "bitcount",
      "equivalent": {
        "glide": "client.bitcount(...)"
      },
      "description": "GLIDE method: bitcount"
    },
    {
      "category": "geo",
      "symbol": "geoadd",
      "equivalent": {
        "glide": "client.geoadd(...)"
      },
      "description": "GLIDE method: geoadd"
    },
    {
      "category": "geo",
      "symbol": "geosearch",
      "equivalent": {
        "glide": "client.geosearch(...)"
      },
      "description": "GLIDE method: geosearch"
    },
    {
      "category": "geo",
      "symbol": "geosearchstore",
      "equivalent": {
        "glide": "client.geosearchstore(...)"
      },
      "description": "GLIDE method: geosearchstore"
    },
    {
      "category": "geo",
      "symbol": "geopos",
      "equivalent": {
        "glide": "client.geopos(...)"
      },
      "description": "GLIDE method: geopos"
    },
    {
      "category": "general",
      "symbol": "zmpop",
      "equivalent": {
        "glide": "client.zmpop(...)"
      },
      "description": "GLIDE method: zmpop"
    },
    {
      "category": "general",
      "symbol": "bzmpop",
      "equivalent": {
        "glide": "client.bzmpop(...)"
      },
      "description": "GLIDE method: bzmpop"
    },
    {
      "category": "sorted-sets",
      "symbol": "zincrby",
      "equivalent": {
        "glide": "client.zincrby(...)"
      },
      "description": "GLIDE method: zincrby"
    },
    {
      "category": "sorted-sets",
      "symbol": "zscan",
      "equivalent": {
        "glide": "client.zscan(...)"
      },
      "description": "GLIDE method: zscan"
    },
    {
      "category": "geo",
      "symbol": "geodist",
      "equivalent": {
        "glide": "client.geodist(...)"
      },
      "description": "GLIDE method: geodist"
    },
    {
      "category": "geo",
      "symbol": "geohash",
      "equivalent": {
        "glide": "client.geohash(...)"
      },
      "description": "GLIDE method: geohash"
    },
    {
      "category": "general",
      "symbol": "lcs",
      "equivalent": {
        "glide": "client.lcs(...)"
      },
      "description": "GLIDE method: lcs"
    },
    {
      "category": "general",
      "symbol": "lcsLen",
      "equivalent": {
        "glide": "client.lcsLen(...)"
      },
      "description": "GLIDE method: lcsLen"
    },
    {
      "category": "general",
      "symbol": "lcsIdx",
      "equivalent": {
        "glide": "client.lcsIdx(...)"
      },
      "description": "GLIDE method: lcsIdx"
    },
    {
      "category": "generic",
      "symbol": "touch",
      "equivalent": {
        "glide": "client.touch(...)"
      },
      "description": "GLIDE method: touch"
    },
    {
      "category": "transactions",
      "symbol": "watch",
      "equivalent": {
        "glide": "client.watch(...)"
      },
      "description": "GLIDE method: watch"
    },
    {
      "category": "general",
      "symbol": "wait",
      "equivalent": {
        "glide": "client.wait(...)"
      },
      "description": "GLIDE method: wait"
    },
    {
      "category": "strings",
      "symbol": "setrange",
      "equivalent": {
        "glide": "client.setrange(...)"
      },
      "description": "GLIDE method: setrange"
    },
    {
      "category": "strings",
      "symbol": "append",
      "equivalent": {
        "glide": "client.append(...)"
      },
      "description": "GLIDE method: append"
    },
    {
      "category": "general",
      "symbol": "lmpop",
      "equivalent": {
        "glide": "client.lmpop(...)"
      },
      "description": "GLIDE method: lmpop"
    },
    {
      "category": "general",
      "symbol": "blmpop",
      "equivalent": {
        "glide": "client.blmpop(...)"
      },
      "description": "GLIDE method: blmpop"
    },
    {
      "category": "pubsub",
      "symbol": "pubsubChannels",
      "equivalent": {
        "glide": "client.pubsubChannels(...)"
      },
      "description": "GLIDE method: pubsubChannels"
    },
    {
      "category": "pubsub",
      "symbol": "pubsubNumPat",
      "equivalent": {
        "glide": "client.pubsubNumPat(...)"
      },
      "description": "GLIDE method: pubsubNumPat"
    },
    {
      "category": "pubsub",
      "symbol": "pubsubNumSub",
      "equivalent": {
        "glide": "client.pubsubNumSub(...)"
      },
      "description": "GLIDE method: pubsubNumSub"
    },
    {
      "category": "general",
      "symbol": "sort",
      "equivalent": {
        "glide": "client.sort(...)"
      },
      "description": "GLIDE method: sort"
    },
    {
      "category": "general",
      "symbol": "sortReadOnly",
      "equivalent": {
        "glide": "client.sortReadOnly(...)"
      },
      "description": "GLIDE method: sortReadOnly"
    },
    {
      "category": "general",
      "symbol": "sortStore",
      "equivalent": {
        "glide": "client.sortStore(...)"
      },
      "description": "GLIDE method: sortStore"
    },
    {
      "category": "general",
      "symbol": "createClientRequest",
      "equivalent": {
        "glide": "client.createClientRequest(...)"
      },
      "description": "GLIDE method: createClientRequest"
    },
    {
      "category": "server",
      "symbol": "configureAdvancedConfigurationBase",
      "equivalent": {
        "glide": "client.configureAdvancedConfigurationBase(...)"
      },
      "description": "GLIDE method: configureAdvancedConfigurationBase"
    },
    {
      "category": "general",
      "symbol": "connectToServer",
      "equivalent": {
        "glide": "client.connectToServer(...)"
      },
      "description": "GLIDE method: connectToServer"
    },
    {
      "category": "general",
      "symbol": "close",
      "equivalent": {
        "glide": "client.close(...)"
      },
      "description": "GLIDE method: close"
    },
    {
      "category": "general",
      "symbol": "__createClientInternal",
      "equivalent": {
        "glide": "client.__createClientInternal(...)"
      },
      "description": "GLIDE method: __createClientInternal"
    },
    {
      "category": "strings",
      "symbol": "GetSocket",
      "equivalent": {
        "glide": "client.GetSocket(...)"
      },
      "description": "GLIDE method: GetSocket"
    },
    {
      "category": "general",
      "symbol": "createClientInternal",
      "equivalent": {
        "glide": "client.createClientInternal(...)"
      },
      "description": "GLIDE method: createClientInternal"
    },
    {
      "category": "general",
      "symbol": "updateConnectionPassword",
      "equivalent": {
        "glide": "client.updateConnectionPassword(...)"
      },
      "description": "GLIDE method: updateConnectionPassword"
    },
    {
      "category": "strings",
      "symbol": "getStatistics",
      "equivalent": {
        "glide": "client.getStatistics(...)"
      },
      "description": "GLIDE method: getStatistics"
    },
    {
      "category": "general",
      "symbol": "createClient",
      "equivalent": {
        "glide": "client.createClient(...)"
      },
      "description": "GLIDE method: createClient"
    },
    {
      "category": "general",
      "symbol": "__createClient",
      "equivalent": {
        "glide": "client.__createClient(...)"
      },
      "description": "GLIDE method: __createClient"
    },
    {
      "category": "transactions",
      "symbol": "exec",
      "equivalent": {
        "glide": "client.exec(...)"
      },
      "description": "GLIDE method: exec"
    },
    {
      "category": "general",
      "symbol": "customCommand",
      "equivalent": {
        "glide": "client.customCommand(...)"
      },
      "description": "GLIDE method: customCommand"
    },
    {
      "category": "connection",
      "symbol": "ping",
      "equivalent": {
        "glide": "client.ping(...)"
      },
      "description": "GLIDE method: ping"
    },
    {
      "category": "server",
      "symbol": "info",
      "equivalent": {
        "glide": "client.info(...)"
      },
      "description": "GLIDE method: info"
    },
    {
      "category": "connection",
      "symbol": "select",
      "equivalent": {
        "glide": "client.select(...)"
      },
      "description": "GLIDE method: select"
    },
    {
      "category": "connection",
      "symbol": "clientGetName",
      "equivalent": {
        "glide": "client.clientGetName(...)"
      },
      "description": "GLIDE method: clientGetName"
    },
    {
      "category": "server",
      "symbol": "configRewrite",
      "equivalent": {
        "glide": "client.configRewrite(...)"
      },
      "description": "GLIDE method: configRewrite"
    },
    {
      "category": "server",
      "symbol": "configResetStat",
      "equivalent": {
        "glide": "client.configResetStat(...)"
      },
      "description": "GLIDE method: configResetStat"
    },
    {
      "category": "connection",
      "symbol": "clientId",
      "equivalent": {
        "glide": "client.clientId(...)"
      },
      "description": "GLIDE method: clientId"
    },
    {
      "category": "server",
      "symbol": "configGet",
      "equivalent": {
        "glide": "client.configGet(...)"
      },
      "description": "GLIDE method: configGet"
    },
    {
      "category": "server",
      "symbol": "configSet",
      "equivalent": {
        "glide": "client.configSet(...)"
      },
      "description": "GLIDE method: configSet"
    },
    {
      "category": "connection",
      "symbol": "echo",
      "equivalent": {
        "glide": "client.echo(...)"
      },
      "description": "GLIDE method: echo"
    },
    {
      "category": "server",
      "symbol": "time",
      "equivalent": {
        "glide": "client.time(...)"
      },
      "description": "GLIDE method: time"
    },
    {
      "category": "generic",
      "symbol": "copy",
      "equivalent": {
        "glide": "client.copy(...)"
      },
      "description": "GLIDE method: copy"
    },
    {
      "category": "general",
      "symbol": "move",
      "equivalent": {
        "glide": "client.move(...)"
      },
      "description": "GLIDE method: move"
    },
    {
      "category": "general",
      "symbol": "lolwut",
      "equivalent": {
        "glide": "client.lolwut(...)"
      },
      "description": "GLIDE method: lolwut"
    },
    {
      "category": "scripting",
      "symbol": "functionDelete",
      "equivalent": {
        "glide": "client.functionDelete(...)"
      },
      "description": "GLIDE method: functionDelete"
    },
    {
      "category": "scripting",
      "symbol": "functionLoad",
      "equivalent": {
        "glide": "client.functionLoad(...)"
      },
      "description": "GLIDE method: functionLoad"
    },
    {
      "category": "scripting",
      "symbol": "functionFlush",
      "equivalent": {
        "glide": "client.functionFlush(...)"
      },
      "description": "GLIDE method: functionFlush"
    },
    {
      "category": "scripting",
      "symbol": "functionList",
      "equivalent": {
        "glide": "client.functionList(...)"
      },
      "description": "GLIDE method: functionList"
    },
    {
      "category": "scripting",
      "symbol": "functionStats",
      "equivalent": {
        "glide": "client.functionStats(...)"
      },
      "description": "GLIDE method: functionStats"
    },
    {
      "category": "scripting",
      "symbol": "functionKill",
      "equivalent": {
        "glide": "client.functionKill(...)"
      },
      "description": "GLIDE method: functionKill"
    },
    {
      "category": "scripting",
      "symbol": "functionDump",
      "equivalent": {
        "glide": "client.functionDump(...)"
      },
      "description": "GLIDE method: functionDump"
    },
    {
      "category": "scripting",
      "symbol": "functionRestore",
      "equivalent": {
        "glide": "client.functionRestore(...)"
      },
      "description": "GLIDE method: functionRestore"
    },
    {
      "category": "server",
      "symbol": "flushall",
      "equivalent": {
        "glide": "client.flushall(...)"
      },
      "description": "GLIDE method: flushall"
    },
    {
      "category": "server",
      "symbol": "flushdb",
      "equivalent": {
        "glide": "client.flushdb(...)"
      },
      "description": "GLIDE method: flushdb"
    },
    {
      "category": "server",
      "symbol": "dbsize",
      "equivalent": {
        "glide": "client.dbsize(...)"
      },
      "description": "GLIDE method: dbsize"
    },
    {
      "category": "pubsub",
      "symbol": "publish",
      "equivalent": {
        "glide": "client.publish(...)"
      },
      "description": "GLIDE method: publish"
    },
    {
      "category": "server",
      "symbol": "lastsave",
      "equivalent": {
        "glide": "client.lastsave(...)"
      },
      "description": "GLIDE method: lastsave"
    },
    {
      "category": "generic",
      "symbol": "randomKey",
      "equivalent": {
        "glide": "client.randomKey(...)"
      },
      "description": "GLIDE method: randomKey"
    },
    {
      "category": "transactions",
      "symbol": "unwatch",
      "equivalent": {
        "glide": "client.unwatch(...)"
      },
      "description": "GLIDE method: unwatch"
    },
    {
      "category": "scripting",
      "symbol": "scriptExists",
      "equivalent": {
        "glide": "client.scriptExists(...)"
      },
      "description": "GLIDE method: scriptExists"
    },
    {
      "category": "scripting",
      "symbol": "scriptFlush",
      "equivalent": {
        "glide": "client.scriptFlush(...)"
      },
      "description": "GLIDE method: scriptFlush"
    },
    {
      "category": "scripting",
      "symbol": "scriptKill",
      "equivalent": {
        "glide": "client.scriptKill(...)"
      },
      "description": "GLIDE method: scriptKill"
    },
    {
      "category": "generic",
      "symbol": "scan",
      "equivalent": {
        "glide": "client.scan(...)"
      },
      "description": "GLIDE method: scan"
    },
    {
      "category": "generic",
      "symbol": "scanOptionsToProto",
      "equivalent": {
        "glide": "client.scanOptionsToProto(...)"
      },
      "description": "GLIDE method: scanOptionsToProto"
    },
    {
      "category": "general",
      "symbol": "createClusterScanPromise",
      "equivalent": {
        "glide": "client.createClusterScanPromise(...)"
      },
      "description": "GLIDE method: createClusterScanPromise"
    },
    {
      "category": "scripting",
      "symbol": "fcallWithRoute",
      "equivalent": {
        "glide": "client.fcallWithRoute(...)"
      },
      "description": "GLIDE method: fcallWithRoute"
    },
    {
      "category": "scripting",
      "symbol": "fcallReadonlyWithRoute",
      "equivalent": {
        "glide": "client.fcallReadonlyWithRoute(...)"
      },
      "description": "GLIDE method: fcallReadonlyWithRoute"
    },
    {
      "category": "pubsub",
      "symbol": "pubsubShardChannels",
      "equivalent": {
        "glide": "client.pubsubShardChannels(...)"
      },
      "description": "GLIDE method: pubsubShardChannels"
    },
    {
      "category": "pubsub",
      "symbol": "pubsubShardNumSub",
      "equivalent": {
        "glide": "client.pubsubShardNumSub(...)"
      },
      "description": "GLIDE method: pubsubShardNumSub"
    },
    {
      "category": "general",
      "symbol": "invokeScriptWithRoute",
      "equivalent": {
        "glide": "client.invokeScriptWithRoute(...)"
      },
      "description": "GLIDE method: invokeScriptWithRoute"
    },
    {
      "category": "general",
      "symbol": "toArg",
      "equivalent": {
        "glide": "client.toArg(...)"
      },
      "description": "GLIDE method: toArg"
    },
    {
      "category": "general",
      "symbol": "toArgs",
      "equivalent": {
        "glide": "client.toArgs(...)"
      },
      "description": "GLIDE method: toArgs"
    },
    {
      "category": "general",
      "symbol": "addAndReturn",
      "equivalent": {
        "glide": "client.addAndReturn(...)"
      },
      "description": "GLIDE method: addAndReturn"
    },
    {
      "category": "generic",
      "symbol": "expireTime",
      "equivalent": {
        "glide": "client.expireTime(...)"
      },
      "description": "GLIDE method: expireTime"
    },
    {
      "category": "general",
      "symbol": "pexpireTime",
      "equivalent": {
        "glide": "client.pexpireTime(...)"
      },
      "description": "GLIDE method: pexpireTime"
    },
    {
      "category": "general",
      "symbol": "create",
      "equivalent": {
        "glide": "client.create(...)"
      },
      "description": "GLIDE method: create"
    },
    {
      "category": "general",
      "symbol": "dropindex",
      "equivalent": {
        "glide": "client.dropindex(...)"
      },
      "description": "GLIDE method: dropindex"
    },
    {
      "category": "general",
      "symbol": "list",
      "equivalent": {
        "glide": "client.list(...)"
      },
      "description": "GLIDE method: list"
    },
    {
      "category": "general",
      "symbol": "aggregate",
      "equivalent": {
        "glide": "client.aggregate(...)"
      },
      "description": "GLIDE method: aggregate"
    },
    {
      "category": "general",
      "symbol": "explain",
      "equivalent": {
        "glide": "client.explain(...)"
      },
      "description": "GLIDE method: explain"
    },
    {
      "category": "general",
      "symbol": "explaincli",
      "equivalent": {
        "glide": "client.explaincli(...)"
      },
      "description": "GLIDE method: explaincli"
    },
    {
      "category": "general",
      "symbol": "search",
      "equivalent": {
        "glide": "client.search(...)"
      },
      "description": "GLIDE method: search"
    },
    {
      "category": "general",
      "symbol": "profileSearch",
      "equivalent": {
        "glide": "client.profileSearch(...)"
      },
      "description": "GLIDE method: profileSearch"
    },
    {
      "category": "general",
      "symbol": "profileAggregate",
      "equivalent": {
        "glide": "client.profileAggregate(...)"
      },
      "description": "GLIDE method: profileAggregate"
    },
    {
      "category": "general",
      "symbol": "aliasadd",
      "equivalent": {
        "glide": "client.aliasadd(...)"
      },
      "description": "GLIDE method: aliasadd"
    },
    {
      "category": "general",
      "symbol": "aliasdel",
      "equivalent": {
        "glide": "client.aliasdel(...)"
      },
      "description": "GLIDE method: aliasdel"
    },
    {
      "category": "general",
      "symbol": "aliasupdate",
      "equivalent": {
        "glide": "client.aliasupdate(...)"
      },
      "description": "GLIDE method: aliasupdate"
    },
    {
      "category": "general",
      "symbol": "aliaslist",
      "equivalent": {
        "glide": "client.aliaslist(...)"
      },
      "description": "GLIDE method: aliaslist"
    },
    {
      "category": "general",
      "symbol": "arrinsert",
      "equivalent": {
        "glide": "client.arrinsert(...)"
      },
      "description": "GLIDE method: arrinsert"
    },
    {
      "category": "general",
      "symbol": "arrpop",
      "equivalent": {
        "glide": "client.arrpop(...)"
      },
      "description": "GLIDE method: arrpop"
    },
    {
      "category": "general",
      "symbol": "arrlen",
      "equivalent": {
        "glide": "client.arrlen(...)"
      },
      "description": "GLIDE method: arrlen"
    },
    {
      "category": "general",
      "symbol": "arrtrim",
      "equivalent": {
        "glide": "client.arrtrim(...)"
      },
      "description": "GLIDE method: arrtrim"
    },
    {
      "category": "general",
      "symbol": "arrindex",
      "equivalent": {
        "glide": "client.arrindex(...)"
      },
      "description": "GLIDE method: arrindex"
    },
    {
      "category": "general",
      "symbol": "toggle",
      "equivalent": {
        "glide": "client.toggle(...)"
      },
      "description": "GLIDE method: toggle"
    },
    {
      "category": "general",
      "symbol": "forget",
      "equivalent": {
        "glide": "client.forget(...)"
      },
      "description": "GLIDE method: forget"
    },
    {
      "category": "general",
      "symbol": "clear",
      "equivalent": {
        "glide": "client.clear(...)"
      },
      "description": "GLIDE method: clear"
    },
    {
      "category": "general",
      "symbol": "resp",
      "equivalent": {
        "glide": "client.resp(...)"
      },
      "description": "GLIDE method: resp"
    },
    {
      "category": "general",
      "symbol": "strappend",
      "equivalent": {
        "glide": "client.strappend(...)"
      },
      "description": "GLIDE method: strappend"
    },
    {
      "category": "general",
      "symbol": "arrappend",
      "equivalent": {
        "glide": "client.arrappend(...)"
      },
      "description": "GLIDE method: arrappend"
    },
    {
      "category": "general",
      "symbol": "debugMemory",
      "equivalent": {
        "glide": "client.debugMemory(...)"
      },
      "description": "GLIDE method: debugMemory"
    },
    {
      "category": "general",
      "symbol": "debugFields",
      "equivalent": {
        "glide": "client.debugFields(...)"
      },
      "description": "GLIDE method: debugFields"
    },
    {
      "category": "general",
      "symbol": "numincrby",
      "equivalent": {
        "glide": "client.numincrby(...)"
      },
      "description": "GLIDE method: numincrby"
    },
    {
      "category": "general",
      "symbol": "nummultby",
      "equivalent": {
        "glide": "client.nummultby(...)"
      },
      "description": "GLIDE method: nummultby"
    },
    {
      "category": "general",
      "symbol": "objlen",
      "equivalent": {
        "glide": "client.objlen(...)"
      },
      "description": "GLIDE method: objlen"
    },
    {
      "category": "general",
      "symbol": "objkeys",
      "equivalent": {
        "glide": "client.objkeys(...)"
      },
      "description": "GLIDE method: objkeys"
    }
  ]
};

// Export helper to get all GLIDE methods
export function getAllGlideMethods(): Set<string> {
  return new Set(["configurePubsub","toProtobufRoute","processResponse","processPush","getCallbackIndex","ensureClientIsOpen","createWritePromise","createUpdateConnectionPasswordPromise","createScriptInvocationPromise","writeOrBufferCommandRequest","writeOrBufferRequest","processResultWithSetCommands","cancelPubSubFuturesWithExceptionSafe","isPubsubConfigured","getPubsubCallbackAndContext","getPubSubMessage","tryGetPubSubMessage","notificationToPubSubMessageSafe","completePubSubFuturesSafe","get","getex","getdel","getrange","set","del","dump","restore","mget","mset","msetnx","incr","incrBy","incrByFloat","decr","decrBy","bitop","getbit","setbit","bitpos","bitfield","bitfieldReadOnly","hget","hset","hkeys","hsetnx","hdel","hmget","hexists","hgetall","hincrBy","hincrByFloat","hlen","hvals","hstrlen","hrandfield","hscan","hrandfieldCount","hrandfieldWithValues","lpush","lpushx","lpop","lpopCount","lrange","llen","lmove","blmove","lset","ltrim","lrem","rpush","rpushx","rpop","rpopCount","sadd","srem","sscan","smembers","smove","scard","sinter","sintercard","sinterstore","sdiff","sdiffstore","sunion","sunionstore","sismember","smismember","spop","spopCount","srandmember","srandmemberCount","exists","unlink","expire","expireAt","expiretime","pexpire","pexpireAt","pexpiretime","ttl","invokeScript","scriptShow","xrange","xrevrange","zadd","zaddIncr","zrem","zcard","zintercard","zdiff","zdiffWithScores","zdiffstore","zscore","zunionstore","zmscore","zcount","zrange","zrangeWithScores","zrangeStore","zinterstore","zinter","zinterWithScores","zunion","zunionWithScores","zrandmember","zrandmemberWithCount","zrandmemberWithCountWithScores","strlen","type","zpopmin","bzpopmin","zpopmax","bzpopmax","pttl","zremRangeByRank","zremRangeByLex","zremRangeByScore","zlexcount","zrank","zrankWithScore","zrevrank","zrevrankWithScore","xadd","xdel","xtrim","xread","xreadgroup","xlen","xpending","xpendingWithOptions","xinfoConsumers","xinfoGroups","xclaim","xautoclaim","xautoclaimJustId","xclaimJustId","xgroupCreate","xgroupDestroy","xinfoStream","xgroupCreateConsumer","xgroupDelConsumer","xack","xgroupSetId","lindex","linsert","persist","rename","renamenx","brpop","blpop","pfadd","pfcount","pfmerge","objectEncoding","objectFreq","objectIdletime","objectRefcount","fcall","fcallReadonly","lpos","bitcount","geoadd","geosearch","geosearchstore","geopos","zmpop","bzmpop","zincrby","zscan","geodist","geohash","lcs","lcsLen","lcsIdx","touch","watch","wait","setrange","append","lmpop","blmpop","pubsubChannels","pubsubNumPat","pubsubNumSub","sort","sortReadOnly","sortStore","createClientRequest","configureAdvancedConfigurationBase","connectToServer","close","__createClientInternal","GetSocket","createClientInternal","updateConnectionPassword","getStatistics","createClient","__createClient","exec","customCommand","ping","info","select","clientGetName","configRewrite","configResetStat","clientId","configGet","configSet","echo","time","copy","move","lolwut","functionDelete","functionLoad","functionFlush","functionList","functionStats","functionKill","functionDump","functionRestore","flushall","flushdb","dbsize","publish","lastsave","randomKey","unwatch","scriptExists","scriptFlush","scriptKill","scan","scanOptionsToProto","createClusterScanPromise","fcallWithRoute","fcallReadonlyWithRoute","pubsubShardChannels","pubsubShardNumSub","invokeScriptWithRoute","toArg","toArgs","addAndReturn","expireTime","pexpireTime","create","dropindex","list","aggregate","explain","explaincli","search","profileSearch","profileAggregate","aliasadd","aliasdel","aliasupdate","aliaslist","arrinsert","arrpop","arrlen","arrtrim","arrindex","toggle","forget","clear","resp","strappend","arrappend","debugMemory","debugFields","numincrby","nummultby","objlen","objkeys"]);
}
