
// Generated code from gen.bitmaps
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.setbit('featureFlags', 42, 1);
console.log(await client.getbit('featureFlags', 42));
console.log(await client.bitcount('featureFlags'));
