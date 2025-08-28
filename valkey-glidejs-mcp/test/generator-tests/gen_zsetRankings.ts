
// Generated code from gen.zsetRankings
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.zadd('lb', { alice: 100, bob: 120 });
console.log('rank alice', await client.zrank('lb', 'alice'));
console.log('top', await client.zrevrangeWithScores('lb', 0, 2));
