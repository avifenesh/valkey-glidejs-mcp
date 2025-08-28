
// Generated code from gen.cache
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const cached = await client.get('test:cache');
if (cached !== null) { return cached; }
const fresh = await fetchData();
await client.set('test:cache', JSON.stringify(fresh), { expiry: { type: 'EX', count: 60 } });
return fresh;
