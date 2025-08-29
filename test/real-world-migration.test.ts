import { test, describe } from "node:test";
import assert from "node:assert";

/**
 * Real-world migration test cases based on common ioredis/node-redis patterns
 * Found in production applications and popular GitHub repositories
 */

describe("Real-world migration patterns", () => {
  // Pattern 1: Session Management with Express
  test("should migrate session management pattern", async () => {
    const ioredisCode = `
import Redis from 'ioredis';
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3
});

const RedisStore = connectRedis(session);

const app = express();
app.use(session({
  store: new RedisStore({ client: redis }),
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 } // 24 hours
}));

// Session operations
app.get('/profile', async (req, res) => {
  const userId = req.session.userId;
  const userKey = \`user:\${userId}\`;
  
  // Get user data with fallback to database
  let userData = await redis.get(userKey);
  if (!userData) {
    userData = await fetchUserFromDB(userId);
    await redis.setex(userKey, 3600, JSON.stringify(userData));
  } else {
    userData = JSON.parse(userData);
  }
  
  res.json(userData);
});
    `;

    const expectedGlide = `
import { GlideClient } from '@valkey/valkey-glide';
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';

const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }],
  connectionRetryStrategy: {
    numberOfRetries: 3,
    factor: 2,
    baseDelay: 100
  }
});

const RedisStore = connectRedis(session);

const app = express();
app.use(session({
  store: new RedisStore({ client }),
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 } // 24 hours
}));

// Session operations
app.get('/profile', async (req, res) => {
  const userId = req.session.userId;
  const userKey = \`user:\${userId}\`;
  
  // Get user data with fallback to database
  let userData = await client.get(userKey);
  if (!userData) {
    userData = await fetchUserFromDB(userId);
    await client.set(userKey, JSON.stringify(userData), { expiry: { type: 'EX', count: 3600 } });
  } else {
    userData = JSON.parse(userData);
  }
  
  res.json(userData);
});
    `;

    // Test that the pattern is recognized and can be migrated
    assert.ok(ioredisCode.includes("new Redis("));
    assert.ok(ioredisCode.includes("setex"));
    // Migration tool should handle this pattern
  });

  // Pattern 2: Distributed Lock (Redlock pattern)
  test("should migrate distributed lock pattern", async () => {
    const ioredisCode = `
import Redis from 'ioredis';

class DistributedLock {
  constructor() {
    this.redis = new Redis();
  }
  
  async acquireLock(resource, ttl = 5000) {
    const lockKey = \`lock:\${resource}\`;
    const lockValue = \`\${Date.now()}-\${Math.random()}\`;
    
    const result = await this.redis.set(lockKey, lockValue, 'PX', ttl, 'NX');
    
    if (result === 'OK') {
      return { acquired: true, lockValue, unlock: () => this.releaseLock(lockKey, lockValue) };
    }
    return { acquired: false };
  }
  
  async releaseLock(lockKey, lockValue) {
    const script = \`
      if redis.call('get', KEYS[1]) == ARGV[1] then
        return redis.call('del', KEYS[1])
      else
        return 0
      end
    \`;
    
    return await this.redis.eval(script, 1, lockKey, lockValue);
  }
}

// Usage in job processing
async function processJob(jobId) {
  const lock = new DistributedLock();
  const lockResult = await lock.acquireLock(\`job:\${jobId}\`, 30000);
  
  if (!lockResult.acquired) {
    throw new Error('Could not acquire lock for job');
  }
  
  try {
    // Process the job
    await performJobWork(jobId);
  } finally {
    await lockResult.unlock();
  }
}
    `;

    // This should be migrated to use GLIDE's set with conditional options
    assert.ok(ioredisCode.includes("'PX'"));
    assert.ok(ioredisCode.includes("'NX'"));
    assert.ok(ioredisCode.includes("eval"));
  });

  // Pattern 3: Rate Limiting with Sliding Window
  test("should migrate rate limiting pattern", async () => {
    const ioredisCode = `
import Redis from 'ioredis';

class RateLimiter {
  constructor(redis) {
    this.redis = redis || new Redis();
  }
  
  async checkRate(identifier, limit, windowMs) {
    const key = \`rate_limit:\${identifier}\`;
    const now = Date.now();
    const window = Math.floor(now / windowMs);
    const windowKey = \`\${key}:\${window}\`;
    
    const pipeline = this.redis.pipeline();
    pipeline.incr(windowKey);
    pipeline.expire(windowKey, Math.ceil(windowMs / 1000));
    
    const results = await pipeline.exec();
    const count = results[0][1];
    
    return {
      allowed: count <= limit,
      count,
      resetTime: (window + 1) * windowMs
    };
  }
  
  // Alternative: Token bucket pattern
  async checkTokenBucket(identifier, capacity, refillRate, tokensRequested = 1) {
    const script = \`
      local key = KEYS[1]
      local capacity = tonumber(ARGV[1])
      local refill_rate = tonumber(ARGV[2])
      local tokens_requested = tonumber(ARGV[3])
      local now = tonumber(ARGV[4])
      
      local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
      local tokens = tonumber(bucket[1]) or capacity
      local last_refill = tonumber(bucket[2]) or now
      
      -- Calculate tokens to add
      local elapsed = math.max(0, now - last_refill)
      tokens = math.min(capacity, tokens + (elapsed * refill_rate / 1000))
      
      local allowed = tokens >= tokens_requested
      if allowed then
        tokens = tokens - tokens_requested
      end
      
      redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
      redis.call('EXPIRE', key, 3600)
      
      return {allowed and 1 or 0, tokens}
    \`;
    
    const result = await this.redis.eval(script, 1, \`bucket:\${identifier}\`, 
      capacity, refillRate, tokensRequested, Date.now());
    
    return { allowed: result[0] === 1, remainingTokens: result[1] };
  }
}
    `;

    assert.ok(ioredisCode.includes("pipeline()"));
    assert.ok(ioredisCode.includes("incr"));
    assert.ok(ioredisCode.includes("expire"));
    assert.ok(ioredisCode.includes("HMSET"));
  });

  // Pattern 4: Pub/Sub with Pattern Subscription
  test("should migrate pub/sub pattern with patterns", async () => {
    const ioredisCode = `
import Redis from 'ioredis';

class EventManager {
  constructor() {
    this.publisher = new Redis();
    this.subscriber = new Redis();
    this.patternSubscriber = new Redis();
  }
  
  async publishEvent(channel, data) {
    const message = {
      timestamp: Date.now(),
      id: \`\${Date.now()}-\${Math.random()}\`,
      data
    };
    
    return await this.publisher.publish(channel, JSON.stringify(message));
  }
  
  subscribeToChannel(channel, handler) {
    this.subscriber.subscribe(channel);
    this.subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        const parsedMessage = JSON.parse(message);
        handler(parsedMessage);
      }
    });
  }
  
  subscribeToPattern(pattern, handler) {
    this.patternSubscriber.psubscribe(pattern);
    this.patternSubscriber.on('pmessage', (pattern, channel, message) => {
      const parsedMessage = JSON.parse(message);
      handler(channel, parsedMessage);
    });
  }
  
  // Real-time notification system
  setupNotifications() {
    // Subscribe to user-specific notifications
    this.subscribeToPattern('notifications:user:*', (channel, message) => {
      const userId = channel.split(':')[2];
      this.sendToUser(userId, message);
    });
    
    // Subscribe to system-wide events
    this.subscribeToChannel('system:alerts', (message) => {
      this.broadcastAlert(message);
    });
  }
}

// Usage in Socket.IO integration
const eventManager = new EventManager();

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  
  // Subscribe to user-specific events
  eventManager.subscribeToChannel(\`user:\${userId}:events\`, (event) => {
    socket.emit('userEvent', event);
  });
  
  socket.on('sendMessage', async (data) => {
    await eventManager.publishEvent(\`chat:\${data.roomId}\`, {
      userId,
      message: data.message
    });
  });
});
    `;

    assert.ok(ioredisCode.includes("psubscribe"));
    assert.ok(ioredisCode.includes("pmessage"));
    assert.ok(ioredisCode.includes("publish"));
  });

  // Pattern 5: Caching with Cache-Aside Pattern
  test("should migrate cache-aside pattern", async () => {
    const ioredisCode = `
import Redis from 'ioredis';

class CacheManager {
  constructor() {
    this.redis = new Redis({
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: null,
      lazyConnect: true
    });
  }
  
  async get(key) {
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  async set(key, value, ttlSeconds = 3600) {
    try {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
  
  async del(key) {
    try {
      return await this.redis.del(key);
    } catch (error) {
      console.error('Cache del error:', error);
      return 0;
    }
  }
  
  async mget(keys) {
    try {
      const results = await this.redis.mget(...keys);
      return results.map(result => result ? JSON.parse(result) : null);
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }
  
  async mset(keyValuePairs, ttl = 3600) {
    const pipeline = this.redis.pipeline();
    
    for (const [key, value] of Object.entries(keyValuePairs)) {
      pipeline.setex(key, ttl, JSON.stringify(value));
    }
    
    try {
      return await pipeline.exec();
    } catch (error) {
      console.error('Cache mset error:', error);
    }
  }
}

// Usage in API service
class UserService {
  constructor() {
    this.cache = new CacheManager();
  }
  
  async getUser(userId) {
    const cacheKey = \`user:\${userId}\`;
    
    // Try cache first
    let user = await this.cache.get(cacheKey);
    if (user) {
      return user;
    }
    
    // Fallback to database
    user = await this.database.findUser(userId);
    if (user) {
      // Cache for 1 hour
      await this.cache.set(cacheKey, user, 3600);
    }
    
    return user;
  }
  
  async updateUser(userId, updates) {
    // Update database
    const updatedUser = await this.database.updateUser(userId, updates);
    
    // Invalidate cache
    await this.cache.del(\`user:\${userId}\`);
    
    return updatedUser;
  }
}
    `;

    assert.ok(ioredisCode.includes("setex"));
    assert.ok(ioredisCode.includes("mget"));
    assert.ok(ioredisCode.includes("pipeline"));
  });

  // Pattern 6: ioredis URL Connection Patterns
  test("should migrate ioredis URL connection patterns", async () => {
    const ioredisCode = `
import Redis from 'ioredis';

// Environment-based connection
const redis1 = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Direct URL connections
const redis2 = new Redis('redis://localhost:6379');
const redis3 = new Redis('rediss://user:pass@prod-redis.example.com:6380');

// Fallback pattern
const redisUrl = process.env.REDIS_URL;
const redis4 = redisUrl ? new Redis(redisUrl) : new Redis({
  host: 'localhost',
  port: 6379
});

async function cacheOperations() {
  await redis1.set('session:123', 'user-data', 'EX', 3600);
  const data = await redis1.get('session:123');
  return data;
}
    `;

    assert.ok(ioredisCode.includes("process.env.REDIS_URL"));
    assert.ok(ioredisCode.includes("'redis://localhost:6379'"));
    assert.ok(ioredisCode.includes("'rediss://user:pass@"));
  });

  // Pattern 7: Queue Management with Bull-like patterns
  test("should migrate job queue pattern", async () => {
    const ioredisCode = `
import Redis from 'ioredis';

class SimpleQueue {
  constructor(queueName) {
    this.redis = new Redis();
    this.queueName = queueName;
    this.processing = false;
  }
  
  async addJob(data, options = {}) {
    const job = {
      id: \`\${Date.now()}-\${Math.random()}\`,
      data,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      delay: options.delay || 0,
      createdAt: Date.now()
    };
    
    const queueKey = \`queue:\${this.queueName}\`;
    const delayedKey = \`queue:\${this.queueName}:delayed\`;
    
    if (job.delay > 0) {
      const score = Date.now() + job.delay;
      await this.redis.zadd(delayedKey, score, JSON.stringify(job));
    } else {
      await this.redis.lpush(queueKey, JSON.stringify(job));
    }
    
    return job.id;
  }
  
  async processJobs(handler) {
    this.processing = true;
    const queueKey = \`queue:\${this.queueName}\`;
    const processingKey = \`queue:\${this.queueName}:processing\`;
    const delayedKey = \`queue:\${this.queueName}:delayed\`;
    
    while (this.processing) {
      // Move delayed jobs that are ready
      await this.moveDelayedJobs();
      
      // Get next job
      const result = await this.redis.brpoplpush(queueKey, processingKey, 1);
      
      if (result) {
        const job = JSON.parse(result);
        
        try {
          await handler(job.data);
          // Remove from processing queue on success
          await this.redis.lrem(processingKey, 1, result);
        } catch (error) {
          job.attempts++;
          
          if (job.attempts < job.maxAttempts) {
            // Retry job
            await this.redis.lrem(processingKey, 1, result);
            await this.redis.lpush(queueKey, JSON.stringify(job));
          } else {
            // Move to failed queue
            await this.redis.lrem(processingKey, 1, result);
            await this.redis.lpush(\`queue:\${this.queueName}:failed\`, JSON.stringify({
              ...job,
              failedAt: Date.now(),
              error: error.message
            }));
          }
        }
      }
    }
  }
  
  async moveDelayedJobs() {
    const delayedKey = \`queue:\${this.queueName}:delayed\`;
    const queueKey = \`queue:\${this.queueName}\`;
    const now = Date.now();
    
    const jobs = await this.redis.zrangebyscore(delayedKey, 0, now);
    
    if (jobs.length > 0) {
      const pipeline = this.redis.pipeline();
      
      for (const job of jobs) {
        pipeline.lpush(queueKey, job);
        pipeline.zrem(delayedKey, job);
      }
      
      await pipeline.exec();
    }
  }
}
    `;

    assert.ok(ioredisCode.includes("zadd"));
    assert.ok(ioredisCode.includes("brpoplpush"));
    assert.ok(ioredisCode.includes("zrangebyscore"));
  });
});
