
// Generated code from gen.json
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.customCommand(['JSON.SET', 'user:1', '$', JSON.stringify({ name: 'Avi', age: 30 })]);
console.log(await client.customCommand(['JSON.GET', 'user:1', '$.name']));
