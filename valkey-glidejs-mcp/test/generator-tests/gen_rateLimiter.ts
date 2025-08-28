
// Generated code from gen.rateLimiter
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const lua = 'local key=KEYS[1]; local max=tonumber(ARGV[1]); local window=tonumber(ARGV[2]); local now=redis.call("TIME")[1]; local cnt=redis.call("INCR", key); if cnt==1 then redis.call("EXPIRE", key, window); end; if cnt>max then return 0 else return max-cnt end';
const remaining = await client.customCommand(['EVAL', lua, '1', 'rl:user:123', '10', '60']);
if (remaining === 0) throw new Error('rate limit exceeded');
