## Valkey Glide MCP (Node.js)

Model Context Protocol server to assist with:

- Migration from ioredis/node-redis to Glide
- API equivalence lookups and diffs
- Use-case generators (caching, locking, Pub/Sub, rate limiter, Fastify)
- Docs navigation and recommendations
- Static verification of migrated code

### Run

```bash
npm i
npm run dev
```

The server uses stdio transport and registers tools on startup.

### Tools

- health
- docs.listSources
- docs.recommend { topic }
- docs.fetch { url, refresh? }
- data.enrich { sources? }
- api.findEquivalent { source, symbol }
- api.search { query }
- api.categories {}
- api.byCategory { category }
- migrate.naive { from, code }
- gen.cache { key, ttlSeconds }
- gen.lock { lockKey, ttlMs }
- gen.clientBasic {}
- gen.clientCluster {}
- gen.pubsubPublisher { channel }
- gen.pubsubSubscriber { channel }
- gen.pubsubAdvanced { channel }
- gen.fastify {}
- gen.rateLimiter { key, points, duration }
- verify.static { code }

### Tests

```bash
npm test
```

### Deep Dive: From zero to a rich dataset

1) Create a client

```ts
import { createClient } from '@valkey/glide';
const client = await createClient({ host: 'localhost', port: 6379 });
```

2) Use Pub/Sub with dedicated connections

```ts
import { createClient } from '@valkey/glide';
const publisher = await createClient({ host: 'localhost', port: 6379 });
const subscriber = await createClient({ host: 'localhost', port: 6379 });
(async () => {
  for await (const msg of subscriber.subscribe('news')) {
    console.log('message', msg);
  }
})();
await publisher.publish('news', JSON.stringify({ hello: 'world' }));
```

3) Enrich local knowledge from curated sources

- docs.listSources to see curated links
- data.enrich to parse the two Glide wiki pages for prepared content

4) Browse APIs and generate snippets

- api.categories and api.byCategory
- gen.clientBasic, gen.clientCluster, gen.pubsubAdvanced, gen.cache, gen.lock, gen.rateLimiter, gen.fastify

5) Migrate from ioredis/node-redis

- api.findEquivalent and api.diff to compare behaviors
- migrate.naive to get a quick first-pass diff

### Notes

- The migration tool is a scaffold; AST transforms can be added next.
- API datasets are curated and intended to be expanded from official docs.
