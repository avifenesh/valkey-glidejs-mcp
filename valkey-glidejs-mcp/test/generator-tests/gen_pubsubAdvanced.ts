
// Generated code from gen.pubsubAdvanced
import { GlideClient } from '@valkey/valkey-glide';
// Use dedicated clients for subscriber and publisher
const publisher = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const subscriber = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});

// Async iterator style
(async () => {
  for await (const message of subscriber.subscribe('test:channel')) {
    console.log('received', message);
  }
})();

await publisher.publish('test:channel', JSON.stringify({ type: 'greeting', payload: 'hello' }));
