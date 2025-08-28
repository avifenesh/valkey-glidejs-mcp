
// Generated code from gen.pubsubPublisher
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.publish('test:channel', JSON.stringify({ hello: 'world' }));
