
// Generated code from gen.hll
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.pfadd('visitors', ['u1','u2','u3']);
console.log(await client.pfcount(['visitors']));
