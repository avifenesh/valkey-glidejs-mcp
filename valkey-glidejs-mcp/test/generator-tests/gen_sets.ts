
// Generated code from gen.sets
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.sadd('tags', ['a', 'b']);
console.log(await client.sismember('tags', 'a'));
console.log(await client.smembers('tags'));
