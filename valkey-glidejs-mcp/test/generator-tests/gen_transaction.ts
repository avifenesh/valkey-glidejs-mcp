
// Generated code from gen.transaction
import { GlideClient, Transaction } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const tx = new Transaction();
tx.set('a', '1');
tx.incr('a');
const results = await client.exec(tx);
console.log(results);
