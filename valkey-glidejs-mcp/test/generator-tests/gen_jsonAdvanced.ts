
// Generated code from gen.jsonAdvanced
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.customCommand(['JSON.SET', 'user:2', '$', JSON.stringify({ profile: { visits: 1, tags: [] } })]);
await client.customCommand(['JSON.SET', 'user:2', '$.profile.tags', JSON.stringify(['a','b'])]);
console.log(await client.customCommand(['JSON.GET', 'user:2', '$.profile']));
