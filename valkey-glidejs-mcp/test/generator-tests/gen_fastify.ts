
// Generated code from gen.fastify
import Fastify from 'fastify';
import fastifyValkeyGlide from 'fastify-valkey-glide';

const app = Fastify();
await app.register(fastifyValkeyGlide, { 
  addresses: [{ host: 'localhost', port: 6379 }] 
});
app.get('/cache', async (req, reply) => {
  const cached = await app.valkey.get('foo');
  return { cached };
});
await app.listen({ port: 3000 });
