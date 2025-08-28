
// Generated code from gen.streams
import { GlideClusterClient } from '@valkey/valkey-glide';
const client = await GlideClusterClient.createClient({ 
  addresses: [{ host: 'localhost', port: 7000 }] 
});

// Create stream and consumer group
await client.xgroupCreate('tasks', 'workers', '$', { mkStream: true });

// Producer: Add tasks to stream
await client.xadd('tasks', [['task', 'process-order-123']]);

// Consumer: Read and process tasks
const result = await client.xreadgroup(
  'workers',
  'worker-1', 
  { 'tasks': '>' },
  { count: 5, block: 5000 }
);

if (result?.length) {
  const streamData = result.find(stream => stream.key === 'tasks');
  if (streamData) {
    const messageIds = Object.keys(streamData.value);
    // Acknowledge processed tasks
    await client.xack('tasks', 'workers', messageIds);
    console.log('Processed:', streamData.value);
  }
}
