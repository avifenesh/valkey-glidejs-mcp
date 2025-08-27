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
- api.findEquivalent { source, symbol }
- api.search { query }
- migrate.naive { from, code }
- gen.cache { key, ttlSeconds }
- gen.lock { lockKey, ttlMs }
- gen.pubsubPublisher { channel }
- gen.pubsubSubscriber { channel }
- gen.fastify {}
- gen.rateLimiter { key, points, duration }
- verify.static { code }

### Tests

```bash
npm test
```

### Notes

- The migration tool is a scaffold; AST transforms can be added next.
- API datasets are curated and intended to be expanded from official docs.
