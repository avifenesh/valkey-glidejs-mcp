
// Generated code from gen.listsAdvanced
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.rpush('jobs', ['a','b','c']);
console.log(await client.lrange('jobs', 0, -1));
await client.ltrim('jobs', 1, -1);
