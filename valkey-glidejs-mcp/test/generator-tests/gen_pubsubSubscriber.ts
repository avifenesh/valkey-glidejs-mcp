
// Generated code from gen.pubsubSubscriber
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
for await (const msg of client.subscribe('test:channel')) {
  console.log('message', msg);
}
