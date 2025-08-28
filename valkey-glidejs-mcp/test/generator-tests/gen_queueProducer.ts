
// Generated code from gen.queueProducer
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.lpush('task:queue', [JSON.stringify({ id: Date.now(), payload: 'work' })]);
