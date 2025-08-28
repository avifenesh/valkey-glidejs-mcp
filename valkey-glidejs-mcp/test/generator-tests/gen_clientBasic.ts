
// Generated code from gen.clientBasic
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.set('hello', 'world');
console.log(await client.get('hello'));
