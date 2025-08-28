
// Generated code from gen.queueConsumer
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
while (true) {
  const res = await client.brpop(['task:queue'], 10);
  if (!res) continue; // timeout
  const [key, msg] = res;
  // process msg
}
