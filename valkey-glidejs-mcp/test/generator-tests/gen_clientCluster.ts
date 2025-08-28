
// Generated code from gen.clientCluster
import { GlideClusterClient } from '@valkey/valkey-glide';
const cluster = await GlideClusterClient.createClient({
  addresses: [
    { host: '127.0.0.1', port: 7000 },
    { host: '127.0.0.1', port: 7001 },
  ]
});
console.log(await cluster.get('hello'));
