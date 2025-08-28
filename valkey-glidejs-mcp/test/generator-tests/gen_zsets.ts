
// Generated code from gen.zsets
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.zadd('lb', { alice: 10, bob: 20 });
console.log(await client.zrangeWithScores('lb', { start: 0, stop: -1 }));
await client.zrem('lb', ['alice']);
