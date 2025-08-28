
// Generated code from gen.pipeline
import { GlideClient, Transaction } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const pipeline = new Transaction();
pipeline.set('p1', 'v1');
pipeline.get('p1');
const results = await client.exec(pipeline);
console.log(results);
