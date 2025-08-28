
// Generated code from gen.hashesAdvanced
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.hset('user:1', { name: 'Avi', age: '30' });
await client.hincrby('user:1', 'age', 1);
console.log(await client.hgetall('user:1'));
