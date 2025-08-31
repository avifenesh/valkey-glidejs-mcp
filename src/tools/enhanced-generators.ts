import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerEnhancedGeneratorTools(mcp: McpServer) {
  // ================================================
  // ENHANCED GENERATOR TOOLS - NO PARAMETERS NEEDED
  // ================================================

  // Complete application example
  mcp.tool(
    "gen.app.caching",
    "Generate a complete caching application example with GLIDE",
    {},
    async () => {
      const code = `
// Complete Caching Service with GLIDE
import { GlideClient } from '@valkey/valkey-glide';

class CacheService {
  private client: GlideClient;
  private defaultTTL = 3600; // 1 hour default

  async connect() {
    this.client = await GlideClient.createClient({
      addresses: [{ host: 'localhost', port: 6379 }]
    });
  }

  async get(key: string): Promise<any> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(\`Cache get error for \${key}:\`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      await this.client.set(key, serialized, {
        expiry: { type: 'EX', count: ttl || this.defaultTTL }
      });
      return true;
    } catch (error) {
      console.error(\`Cache set error for \${key}:\`, error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.client.del([key]);
      return result > 0;
    } catch (error) {
      console.error(\`Cache delete error for \${key}:\`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists([key]);
      return result > 0;
    } catch (error) {
      console.error(\`Cache exists error for \${key}:\`, error);
      return false;
    }
  }

  async getTTL(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error(\`Cache TTL error for \${key}:\`, error);
      return -1;
    }
  }

  async clearPattern(pattern: string): Promise<number> {
    let deleted = 0;
    const stream = this.client.scan({
      match: pattern,
      count: 100
    });

    for await (const keys of stream) {
      if (keys.length > 0) {
        deleted += await this.client.del(keys);
      }
    }
    return deleted;
  }

  async close() {
    await this.client.close();
  }
}

// Usage Example
async function main() {
  const cache = new CacheService();
  await cache.connect();

  // Store user data
  await cache.set('user:123', {
    id: 123,
    name: 'John Doe',
    email: 'john@example.com'
  }, 3600);

  // Retrieve user data
  const user = await cache.get('user:123');
  console.log('User:', user);

  // Check if key exists
  const exists = await cache.exists('user:123');
  console.log('Exists:', exists);

  // Get TTL
  const ttl = await cache.getTTL('user:123');
  console.log('TTL:', ttl);

  // Clear all user cache
  const deleted = await cache.clearPattern('user:*');
  console.log('Deleted keys:', deleted);

  await cache.close();
}

main().catch(console.error);
`;

      return {
        content: [
          { type: "text", text: "Generated complete caching service with GLIDE:" },
          { type: "text", text: code }
        ],
      };
    }
  );

  // Session management example
  mcp.tool(
    "gen.app.session",
    "Generate a session management system with GLIDE",
    {},
    async () => {
      const code = `
// Session Management System with GLIDE
import { GlideClient } from '@valkey/valkey-glide';
import crypto from 'crypto';

interface SessionData {
  userId: string;
  createdAt: number;
  lastAccess: number;
  data: Record<string, any>;
}

class SessionManager {
  private client: GlideClient;
  private sessionTTL = 86400; // 24 hours
  private prefix = 'session:';

  async connect() {
    this.client = await GlideClient.createClient({
      addresses: [{ host: 'localhost', port: 6379 }]
    });
  }

  generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async create(userId: string, data: Record<string, any> = {}): Promise<string> {
    const sessionId = this.generateSessionId();
    const session: SessionData = {
      userId,
      createdAt: Date.now(),
      lastAccess: Date.now(),
      data
    };

    await this.client.set(
      this.prefix + sessionId,
      JSON.stringify(session),
      { expiry: { type: 'EX', count: this.sessionTTL } }
    );

    return sessionId;
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const key = this.prefix + sessionId;
    const data = await this.client.get(key);
    
    if (!data) return null;

    const session = JSON.parse(data) as SessionData;
    
    // Update last access time
    session.lastAccess = Date.now();
    await this.client.set(
      key,
      JSON.stringify(session),
      { expiry: { type: 'EX', count: this.sessionTTL } }
    );

    return session;
  }

  async update(sessionId: string, data: Partial<SessionData['data']>): Promise<boolean> {
    const session = await this.get(sessionId);
    if (!session) return false;

    session.data = { ...session.data, ...data };
    session.lastAccess = Date.now();

    await this.client.set(
      this.prefix + sessionId,
      JSON.stringify(session),
      { expiry: { type: 'EX', count: this.sessionTTL } }
    );

    return true;
  }

  async destroy(sessionId: string): Promise<boolean> {
    const result = await this.client.del([this.prefix + sessionId]);
    return result > 0;
  }

  async extend(sessionId: string, additionalSeconds: number): Promise<boolean> {
    const key = this.prefix + sessionId;
    const result = await this.client.expire(key, this.sessionTTL + additionalSeconds);
    return result === 1;
  }

  async getUserSessions(userId: string): Promise<string[]> {
    const sessions: string[] = [];
    const stream = this.client.scan({
      match: this.prefix + '*',
      count: 100
    });

    for await (const keys of stream) {
      for (const key of keys) {
        const data = await this.client.get(key);
        if (data) {
          const session = JSON.parse(data) as SessionData;
          if (session.userId === userId) {
            sessions.push(key.replace(this.prefix, ''));
          }
        }
      }
    }

    return sessions;
  }

  async cleanup(): Promise<number> {
    // This is handled automatically by TTL, but you can force cleanup
    let cleaned = 0;
    const stream = this.client.scan({
      match: this.prefix + '*',
      count: 100
    });

    for await (const keys of stream) {
      for (const key of keys) {
        const ttl = await this.client.ttl(key);
        if (ttl === -1) { // No TTL set (shouldn't happen)
          await this.client.del([key]);
          cleaned++;
        }
      }
    }

    return cleaned;
  }

  async close() {
    await this.client.close();
  }
}

// Express middleware example
export function sessionMiddleware(sessionManager: SessionManager) {
  return async (req: any, res: any, next: any) => {
    const sessionId = req.cookies?.sessionId;
    
    if (sessionId) {
      const session = await sessionManager.get(sessionId);
      if (session) {
        req.session = session;
      }
    }
    
    next();
  };
}

// Usage Example
async function main() {
  const sessions = new SessionManager();
  await sessions.connect();

  // Create a session
  const sessionId = await sessions.create('user123', {
    theme: 'dark',
    language: 'en'
  });
  console.log('Created session:', sessionId);

  // Get session
  const session = await sessions.get(sessionId);
  console.log('Session data:', session);

  // Update session data
  await sessions.update(sessionId, {
    lastPage: '/dashboard'
  });

  // Extend session
  await sessions.extend(sessionId, 3600);

  // Get all sessions for a user
  const userSessions = await sessions.getUserSessions('user123');
  console.log('User sessions:', userSessions);

  // Destroy session
  await sessions.destroy(sessionId);

  await sessions.close();
}

main().catch(console.error);
`;

      return {
        content: [
          { type: "text", text: "Generated session management system with GLIDE:" },
          { type: "text", text: code }
        ],
      };
    }
  );

  // Rate limiter example
  mcp.tool(
    "gen.app.ratelimit",
    "Generate a rate limiting system with GLIDE",
    {},
    async () => {
      const code = `
// Rate Limiting System with GLIDE
import { GlideClient } from '@valkey/valkey-glide';

class RateLimiter {
  private client: GlideClient;

  async connect() {
    this.client = await GlideClient.createClient({
      addresses: [{ host: 'localhost', port: 6379 }]
    });
  }

  // Fixed window rate limiter
  async fixedWindow(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();
    const window = Math.floor(now / (windowSeconds * 1000));
    const redisKey = \`rate:fixed:\${key}:\${window}\`;

    const current = await this.client.incr(redisKey);
    
    if (current === 1) {
      await this.client.expire(redisKey, windowSeconds);
    }

    const resetAt = (window + 1) * windowSeconds * 1000;
    const allowed = current <= limit;
    const remaining = Math.max(0, limit - current);

    return { allowed, remaining, resetAt };
  }

  // Sliding window rate limiter
  async slidingWindow(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const minTime = now - windowMs;
    const redisKey = \`rate:sliding:\${key}\`;

    // Remove old entries
    await this.client.zremRangeByScore(
      redisKey,
      { min: 0, max: minTime }
    );

    // Count current entries
    const current = await this.client.zcard(redisKey);

    if (current < limit) {
      // Add new entry
      await this.client.zadd(redisKey, { [now.toString()]: now });
      await this.client.expire(redisKey, windowSeconds);
      
      return { allowed: true, remaining: limit - current - 1 };
    }

    return { allowed: false, remaining: 0 };
  }

  // Token bucket rate limiter
  async tokenBucket(
    key: string,
    capacity: number,
    refillRate: number,
    tokensRequested: number = 1
  ): Promise<{ allowed: boolean; tokensRemaining: number }> {
    const now = Date.now();
    const bucketKey = \`rate:bucket:\${key}\`;
    const lastRefillKey = \`rate:bucket:\${key}:lastrefill\`;

    // Get current tokens and last refill time
    const [tokens, lastRefill] = await Promise.all([
      this.client.get(bucketKey),
      this.client.get(lastRefillKey)
    ]);

    let currentTokens = tokens ? parseFloat(tokens) : capacity;
    const lastRefillTime = lastRefill ? parseInt(lastRefill) : now;

    // Calculate tokens to add based on time passed
    const timePassed = (now - lastRefillTime) / 1000;
    const tokensToAdd = timePassed * refillRate;
    currentTokens = Math.min(capacity, currentTokens + tokensToAdd);

    if (currentTokens >= tokensRequested) {
      currentTokens -= tokensRequested;
      
      // Update tokens and last refill time
      await Promise.all([
        this.client.set(bucketKey, currentTokens.toString()),
        this.client.set(lastRefillKey, now.toString())
      ]);

      return { allowed: true, tokensRemaining: currentTokens };
    }

    return { allowed: false, tokensRemaining: currentTokens };
  }

  // Distributed rate limiter with Lua script
  async distributedLimit(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const script = \`
      local key = KEYS[1]
      local limit = tonumber(ARGV[1])
      local window = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])
      
      local current = redis.call('GET', key)
      if current == false then
        current = 0
      else
        current = tonumber(current)
      end
      
      if current < limit then
        local new_value = redis.call('INCR', key)
        if new_value == 1 then
          redis.call('EXPIRE', key, window)
        end
        local ttl = redis.call('TTL', key)
        return {1, limit - new_value, ttl}
      else
        local ttl = redis.call('TTL', key)
        return {0, 0, ttl}
      end
    \`;

    const result = await this.client.eval(script, {
      keys: [\`rate:dist:\${key}\`],
      args: [limit.toString(), windowSeconds.toString(), Date.now().toString()]
    }) as number[];

    return {
      allowed: result[0] === 1,
      remaining: result[1],
      resetAt: Date.now() + (result[2] * 1000)
    };
  }

  // IP-based rate limiting
  async limitIP(
    ip: string,
    limit: number = 100,
    windowSeconds: number = 60
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    return this.fixedWindow(\`ip:\${ip}\`, limit, windowSeconds);
  }

  // API key rate limiting
  async limitAPI(
    apiKey: string,
    limit: number = 1000,
    windowSeconds: number = 3600
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    return this.fixedWindow(\`api:\${apiKey}\`, limit, windowSeconds);
  }

  // User action rate limiting
  async limitUserAction(
    userId: string,
    action: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    return this.fixedWindow(\`user:\${userId}:\${action}\`, limit, windowSeconds);
  }

  async close() {
    await this.client.close();
  }
}

// Express middleware example
export function rateLimitMiddleware(
  limiter: RateLimiter,
  options: { limit: number; window: number; keyFn?: (req: any) => string }
) {
  return async (req: any, res: any, next: any) => {
    const key = options.keyFn ? options.keyFn(req) : req.ip;
    const result = await limiter.fixedWindow(key, options.limit, options.window);

    res.setHeader('X-RateLimit-Limit', options.limit);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', result.resetAt);

    if (!result.allowed) {
      res.status(429).json({
        error: 'Too Many Requests',
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000)
      });
      return;
    }

    next();
  };
}

// Usage Example
async function main() {
  const limiter = new RateLimiter();
  await limiter.connect();

  // Test fixed window rate limiting
  console.log('\\n=== Fixed Window Rate Limiting ===');
  for (let i = 0; i < 5; i++) {
    const result = await limiter.fixedWindow('user:123', 3, 10);
    console.log(\`Request \${i + 1}:\`, result);
  }

  // Test sliding window rate limiting
  console.log('\\n=== Sliding Window Rate Limiting ===');
  for (let i = 0; i < 5; i++) {
    const result = await limiter.slidingWindow('user:456', 3, 10);
    console.log(\`Request \${i + 1}:\`, result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Test token bucket rate limiting
  console.log('\\n=== Token Bucket Rate Limiting ===');
  for (let i = 0; i < 5; i++) {
    const result = await limiter.tokenBucket('user:789', 10, 1, 2);
    console.log(\`Request \${i + 1} (2 tokens):\`, result);
  }

  // Test IP rate limiting
  console.log('\\n=== IP Rate Limiting ===');
  const ipResult = await limiter.limitIP('192.168.1.1', 100, 60);
  console.log('IP limit result:', ipResult);

  // Test API key rate limiting
  console.log('\\n=== API Key Rate Limiting ===');
  const apiResult = await limiter.limitAPI('sk-abc123', 1000, 3600);
  console.log('API limit result:', apiResult);

  await limiter.close();
}

main().catch(console.error);
`;

      return {
        content: [
          { type: "text", text: "Generated comprehensive rate limiting system with GLIDE:" },
          { type: "text", text: code }
        ],
      };
    }
  );

  // Job queue example
  mcp.tool(
    "gen.app.queue",
    "Generate a job queue system with GLIDE",
    {},
    async () => {
      const code = `
// Job Queue System with GLIDE
import { GlideClient } from '@valkey/valkey-glide';

interface Job {
  id: string;
  type: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  processedAt?: number;
  completedAt?: number;
  error?: string;
}

class JobQueue {
  private client: GlideClient;
  private queuePrefix = 'queue:';
  private jobPrefix = 'job:';
  private processingTimeout = 30000; // 30 seconds

  async connect() {
    this.client = await GlideClient.createClient({
      addresses: [{ host: 'localhost', port: 6379 }]
    });
  }

  async enqueue(
    queueName: string,
    type: string,
    payload: any,
    options: { priority?: number; delay?: number; maxAttempts?: number } = {}
  ): Promise<string> {
    const jobId = \`\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
    const job: Job = {
      id: jobId,
      type,
      payload,
      status: 'pending',
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: Date.now()
    };

    // Store job data
    await this.client.set(
      this.jobPrefix + jobId,
      JSON.stringify(job),
      { expiry: { type: 'EX', count: 86400 } } // 24 hours
    );

    // Add to queue
    const queueKey = this.queuePrefix + queueName;
    const score = options.priority || Date.now() + (options.delay || 0);
    await this.client.zadd(queueKey, { [jobId]: score });

    return jobId;
  }

  async dequeue(queueName: string): Promise<Job | null> {
    const queueKey = this.queuePrefix + queueName;
    const processingKey = queueKey + ':processing';
    const now = Date.now();

    // Move job from queue to processing
    const script = \`
      local queue_key = KEYS[1]
      local processing_key = KEYS[2]
      local now = tonumber(ARGV[1])
      local timeout = tonumber(ARGV[2])
      
      -- Get next available job
      local jobs = redis.call('ZRANGEBYSCORE', queue_key, 0, now, 'LIMIT', 0, 1)
      if #jobs == 0 then
        return nil
      end
      
      local job_id = jobs[1]
      
      -- Remove from queue
      redis.call('ZREM', queue_key, job_id)
      
      -- Add to processing set with timeout
      redis.call('ZADD', processing_key, now + timeout, job_id)
      
      return job_id
    \`;

    const jobId = await this.client.eval(script, {
      keys: [queueKey, processingKey],
      args: [now.toString(), this.processingTimeout.toString()]
    }) as string | null;

    if (!jobId) return null;

    // Get job data
    const jobData = await this.client.get(this.jobPrefix + jobId);
    if (!jobData) return null;

    const job = JSON.parse(jobData) as Job;
    job.status = 'processing';
    job.processedAt = now;
    job.attempts++;

    // Update job status
    await this.client.set(
      this.jobPrefix + jobId,
      JSON.stringify(job),
      { expiry: { type: 'EX', count: 86400 } }
    );

    return job;
  }

  async complete(queueName: string, jobId: string, result?: any): Promise<void> {
    const processingKey = this.queuePrefix + queueName + ':processing';
    const completedKey = this.queuePrefix + queueName + ':completed';

    // Remove from processing
    await this.client.zrem(processingKey, [jobId]);

    // Add to completed
    await this.client.zadd(completedKey, { [jobId]: Date.now() });

    // Update job status
    const jobData = await this.client.get(this.jobPrefix + jobId);
    if (jobData) {
      const job = JSON.parse(jobData) as Job;
      job.status = 'completed';
      job.completedAt = Date.now();
      if (result) {
        job.payload = { ...job.payload, result };
      }
      
      await this.client.set(
        this.jobPrefix + jobId,
        JSON.stringify(job),
        { expiry: { type: 'EX', count: 86400 } }
      );
    }
  }

  async fail(queueName: string, jobId: string, error: string): Promise<void> {
    const processingKey = this.queuePrefix + queueName + ':processing';
    const failedKey = this.queuePrefix + queueName + ':failed';
    const queueKey = this.queuePrefix + queueName;

    // Remove from processing
    await this.client.zrem(processingKey, [jobId]);

    // Get job data
    const jobData = await this.client.get(this.jobPrefix + jobId);
    if (!jobData) return;

    const job = JSON.parse(jobData) as Job;
    job.error = error;

    if (job.attempts < job.maxAttempts) {
      // Retry with exponential backoff
      const delay = Math.pow(2, job.attempts) * 1000;
      await this.client.zadd(queueKey, { [jobId]: Date.now() + delay });
    } else {
      // Max attempts reached, move to failed
      job.status = 'failed';
      await this.client.zadd(failedKey, { [jobId]: Date.now() });
    }

    // Update job
    await this.client.set(
      this.jobPrefix + jobId,
      JSON.stringify(job),
      { expiry: { type: 'EX', count: 86400 } }
    );
  }

  async recoverStalled(queueName: string): Promise<number> {
    const processingKey = this.queuePrefix + queueName + ':processing';
    const queueKey = this.queuePrefix + queueName;
    const now = Date.now();

    // Find stalled jobs
    const stalled = await this.client.zrangeByScore(
      processingKey,
      { min: 0, max: now }
    );

    if (stalled.length === 0) return 0;

    // Move back to queue
    for (const jobId of stalled) {
      await this.client.zrem(processingKey, [jobId]);
      await this.client.zadd(queueKey, { [jobId]: now });
    }

    return stalled.length;
  }

  async getQueueStats(queueName: string): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    const [pending, processing, completed, failed] = await Promise.all([
      this.client.zcard(this.queuePrefix + queueName),
      this.client.zcard(this.queuePrefix + queueName + ':processing'),
      this.client.zcard(this.queuePrefix + queueName + ':completed'),
      this.client.zcard(this.queuePrefix + queueName + ':failed')
    ]);

    return { pending, processing, completed, failed };
  }

  async getJob(jobId: string): Promise<Job | null> {
    const jobData = await this.client.get(this.jobPrefix + jobId);
    return jobData ? JSON.parse(jobData) : null;
  }

  async close() {
    await this.client.close();
  }
}

// Worker class
class QueueWorker {
  private queue: JobQueue;
  private handlers: Map<string, (payload: any) => Promise<any>> = new Map();
  private running = false;
  private queueName: string;

  constructor(queue: JobQueue, queueName: string) {
    this.queue = queue;
    this.queueName = queueName;
  }

  register(type: string, handler: (payload: any) => Promise<any>) {
    this.handlers.set(type, handler);
  }

  async start() {
    this.running = true;
    console.log(\`Worker started for queue: \${this.queueName}\`);

    while (this.running) {
      try {
        // Recover stalled jobs periodically
        await this.queue.recoverStalled(this.queueName);

        // Get next job
        const job = await this.queue.dequeue(this.queueName);
        
        if (!job) {
          // No jobs available, wait
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        console.log(\`Processing job \${job.id} of type \${job.type}\`);

        // Get handler
        const handler = this.handlers.get(job.type);
        if (!handler) {
          await this.queue.fail(this.queueName, job.id, \`No handler for job type: \${job.type}\`);
          continue;
        }

        // Process job
        try {
          const result = await handler(job.payload);
          await this.queue.complete(this.queueName, job.id, result);
          console.log(\`Job \${job.id} completed successfully\`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          await this.queue.fail(this.queueName, job.id, errorMessage);
          console.error(\`Job \${job.id} failed:\`, errorMessage);
        }
      } catch (error) {
        console.error('Worker error:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  stop() {
    this.running = false;
    console.log('Worker stopped');
  }
}

// Usage Example
async function main() {
  const queue = new JobQueue();
  await queue.connect();

  // Enqueue some jobs
  await queue.enqueue('emails', 'send-welcome', {
    to: 'user@example.com',
    name: 'John Doe'
  });

  await queue.enqueue('emails', 'send-newsletter', {
    to: 'subscriber@example.com',
    subject: 'Weekly Update'
  }, { priority: 1 });

  await queue.enqueue('processing', 'generate-report', {
    reportId: 'report-123',
    format: 'pdf'
  }, { delay: 5000 }); // Delay 5 seconds

  // Check queue stats
  const stats = await queue.getQueueStats('emails');
  console.log('Queue stats:', stats);

  // Create and start worker
  const worker = new QueueWorker(queue, 'emails');
  
  worker.register('send-welcome', async (payload) => {
    console.log('Sending welcome email to:', payload.to);
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { messageId: 'msg-123' };
  });

  worker.register('send-newsletter', async (payload) => {
    console.log('Sending newsletter to:', payload.to);
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { messageId: 'msg-456' };
  });

  // Start worker
  worker.start();

  // Run for 10 seconds then stop
  setTimeout(async () => {
    worker.stop();
    await queue.close();
    process.exit(0);
  }, 10000);
}

main().catch(console.error);
`;

      return {
        content: [
          { type: "text", text: "Generated comprehensive job queue system with GLIDE:" },
          { type: "text", text: code }
        ],
      };
    }
  );

  // Leaderboard system
  mcp.tool(
    "gen.app.leaderboard",
    "Generate a leaderboard system with GLIDE",
    {},
    async () => {
      const code = `
// Leaderboard System with GLIDE
import { GlideClient } from '@valkey/valkey-glide';

interface LeaderboardEntry {
  userId: string;
  score: number;
  rank?: number;
  metadata?: Record<string, any>;
}

class LeaderboardService {
  private client: GlideClient;
  private prefix = 'leaderboard:';

  async connect() {
    this.client = await GlideClient.createClient({
      addresses: [{ host: 'localhost', port: 6379 }]
    });
  }

  // Add or update score
  async setScore(
    leaderboardId: string,
    userId: string,
    score: number
  ): Promise<void> {
    const key = this.prefix + leaderboardId;
    await this.client.zadd(key, { [userId]: score });
  }

  // Increment score
  async incrementScore(
    leaderboardId: string,
    userId: string,
    increment: number
  ): Promise<number> {
    const key = this.prefix + leaderboardId;
    return await this.client.zincrby(key, increment, userId);
  }

  // Get user rank (0-indexed)
  async getRank(
    leaderboardId: string,
    userId: string,
    reverse: boolean = true
  ): Promise<number | null> {
    const key = this.prefix + leaderboardId;
    const rank = reverse
      ? await this.client.zrevrank(key, userId)
      : await this.client.zrank(key, userId);
    return rank;
  }

  // Get user score
  async getScore(
    leaderboardId: string,
    userId: string
  ): Promise<number | null> {
    const key = this.prefix + leaderboardId;
    return await this.client.zscore(key, userId);
  }

  // Get top N users
  async getTop(
    leaderboardId: string,
    count: number,
    withScores: boolean = true
  ): Promise<LeaderboardEntry[]> {
    const key = this.prefix + leaderboardId;
    const result = await this.client.zrangeWithScores(
      key,
      { start: 0, end: count - 1 },
      { reverse: true }
    );

    return Object.entries(result).map(([userId, score], index) => ({
      userId,
      score,
      rank: index + 1
    }));
  }

  // Get users around a specific user
  async getAround(
    leaderboardId: string,
    userId: string,
    count: number = 5
  ): Promise<LeaderboardEntry[]> {
    const key = this.prefix + leaderboardId;
    
    // Get user rank
    const userRank = await this.zrevrank(key, userId);
    if (userRank === null) return [];

    // Calculate range
    const start = Math.max(0, userRank - count);
    const end = userRank + count;

    const result = await this.client.zrangeWithScores(
      key,
      { start, end },
      { reverse: true }
    );

    return Object.entries(result).map(([id, score], index) => ({
      userId: id,
      score,
      rank: start + index + 1
    }));
  }

  // Get users in score range
  async getByScoreRange(
    leaderboardId: string,
    minScore: number,
    maxScore: number
  ): Promise<LeaderboardEntry[]> {
    const key = this.prefix + leaderboardId;
    const result = await this.client.zrangeByScoreWithScores(
      key,
      { min: minScore, max: maxScore },
      { reverse: true }
    );

    return Object.entries(result).map(([userId, score]) => ({
      userId,
      score
    }));
  }

  // Remove user from leaderboard
  async removeUser(
    leaderboardId: string,
    userId: string
  ): Promise<boolean> {
    const key = this.prefix + leaderboardId;
    const removed = await this.client.zrem(key, [userId]);
    return removed > 0;
  }

  // Get total users in leaderboard
  async getCount(leaderboardId: string): Promise<number> {
    const key = this.prefix + leaderboardId;
    return await this.client.zcard(key);
  }

  // Get percentile rank
  async getPercentile(
    leaderboardId: string,
    userId: string
  ): Promise<number | null> {
    const rank = await this.getRank(leaderboardId, userId);
    if (rank === null) return null;

    const total = await this.getCount(leaderboardId);
    if (total === 0) return null;

    return Math.round(((total - rank - 1) / total) * 100);
  }

  // Merge leaderboards
  async merge(
    sourceIds: string[],
    destinationId: string,
    weights?: number[]
  ): Promise<void> {
    const sourceKeys = sourceIds.map(id => this.prefix + id);
    const destKey = this.prefix + destinationId;

    // Use ZUNIONSTORE to merge
    await this.client.zunionstore(
      destKey,
      sourceKeys,
      { weights, aggregate: 'SUM' }
    );
  }

  // Reset leaderboard
  async reset(leaderboardId: string): Promise<void> {
    const key = this.prefix + leaderboardId;
    await this.client.del([key]);
  }

  // Archive leaderboard
  async archive(leaderboardId: string): Promise<void> {
    const key = this.prefix + leaderboardId;
    const archiveKey = this.prefix + 'archive:' + leaderboardId + ':' + Date.now();
    await this.client.rename(key, archiveKey);
  }

  // Multi-dimensional leaderboard
  async setMultiScore(
    userId: string,
    scores: Record<string, number>
  ): Promise<void> {
    const promises = Object.entries(scores).map(([dimension, score]) =>
      this.setScore(dimension, userId, score)
    );
    await Promise.all(promises);
  }

  // Get user's position across multiple leaderboards
  async getMultiRank(
    userId: string,
    leaderboardIds: string[]
  ): Promise<Record<string, number | null>> {
    const results: Record<string, number | null> = {};
    
    for (const id of leaderboardIds) {
      results[id] = await this.getRank(id, userId);
    }
    
    return results;
  }

  // Time-based leaderboards
  async createTimeBasedKey(base: string, period: 'daily' | 'weekly' | 'monthly'): string {
    const now = new Date();
    let suffix: string;

    switch (period) {
      case 'daily':
        suffix = now.toISOString().split('T')[0];
        break;
      case 'weekly':
        const week = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
        suffix = \`week-\${week}\`;
        break;
      case 'monthly':
        suffix = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}\`;
        break;
    }

    return \`\${base}:\${suffix}\`;
  }

  async close() {
    await this.client.close();
  }
}

// Usage Example
async function main() {
  const leaderboard = new LeaderboardService();
  await leaderboard.connect();

  // Create some scores
  const users = [
    { id: 'user1', score: 1500 },
    { id: 'user2', score: 2000 },
    { id: 'user3', score: 1800 },
    { id: 'user4', score: 2200 },
    { id: 'user5', score: 1600 },
    { id: 'user6', score: 1900 },
    { id: 'user7', score: 2100 },
    { id: 'user8', score: 1700 },
  ];

  // Add scores to global leaderboard
  console.log('Adding scores to leaderboard...');
  for (const user of users) {
    await leaderboard.setScore('global', user.id, user.score);
  }

  // Get top 5
  const top5 = await leaderboard.getTop('global', 5);
  console.log('\\nTop 5 players:');
  top5.forEach(entry => {
    console.log(\`  #\${entry.rank} \${entry.userId}: \${entry.score} points\`);
  });

  // Get user rank
  const userRank = await leaderboard.getRank('global', 'user3');
  const userScore = await leaderboard.getScore('global', 'user3');
  console.log(\`\\nuser3 rank: #\${(userRank || 0) + 1} with \${userScore} points\`);

  // Get percentile
  const percentile = await leaderboard.getPercentile('global', 'user3');
  console.log(\`user3 is in the top \${100 - (percentile || 0)}%\`);

  // Increment score
  await leaderboard.incrementScore('global', 'user3', 300);
  const newRank = await leaderboard.getRank('global', 'user3');
  console.log(\`\\nAfter +300 points, user3 new rank: #\${(newRank || 0) + 1}\`);

  // Get users around user3
  const around = await leaderboard.getAround('global', 'user3', 2);
  console.log('\\nUsers around user3:');
  around.forEach(entry => {
    console.log(\`  #\${entry.rank} \${entry.userId}: \${entry.score} points\`);
  });

  // Time-based leaderboards
  const dailyKey = await leaderboard.createTimeBasedKey('scores', 'daily');
  await leaderboard.setScore(dailyKey, 'user1', 100);
  console.log(\`\\nCreated daily leaderboard: \${dailyKey}\`);

  // Multi-dimensional scores
  await leaderboard.setMultiScore('user1', {
    'kills': 50,
    'assists': 30,
    'objectives': 10
  });

  const multiRanks = await leaderboard.getMultiRank('user1', ['kills', 'assists', 'objectives']);
  console.log('\\nuser1 ranks across dimensions:', multiRanks);

  // Get total count
  const total = await leaderboard.getCount('global');
  console.log(\`\\nTotal players in leaderboard: \${total}\`);

  await leaderboard.close();
}

main().catch(console.error);
`;

      return {
        content: [
          { type: "text", text: "Generated comprehensive leaderboard system with GLIDE:" },
          { type: "text", text: code }
        ],
      };
    }
  );
}