
// Generated code from gen.geo
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({ 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
await client.geoadd('places', { Palermo: { longitude: 13.361389, latitude: 38.115556 } });
const near = await client.geosearchstore('places_result', 'places', 
  { position: { longitude: 13.361389, latitude: 38.115556 }, radius: 200, unit: 'km' }
);
console.log(near);
