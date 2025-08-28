
// Generated code from gen.lock
import { GlideClient, Script } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
const token = crypto.randomUUID();
const acquired = await client.set('test:lock', token, { 
  conditionalSet: 'onlyIfDoesNotExist',
  expiry: { type: 'EX', count: Math.floor(5000 / 1000) }
});
if (!acquired) throw new Error('lock busy');
try {
  // critical section
} finally {
  // Atomic release using Lua script
  const releaseScript = new Script(
    'if server.call("get", ARGV[1]) == ARGV[2] then return server.call("del", ARGV[1]) else return 0 end'
  );
  await client.invokeScript(releaseScript, { args: ['test:lock', token] });
}
