# valkey-glidejs-mcp

[![npm version](https://badge.fury.io/js/valkey-glidejs-mcp.svg)](https://www.npmjs.com/package/valkey-glidejs-mcp)

A Model Context Protocol (MCP) server that helps AI assistants work with [Valkey GLIDE](https://github.com/valkey-io/valkey-glide), the high-performance Redis/Valkey client.

## What it does

This MCP server gives AI assistants like Claude the ability to:
- Generate correct GLIDE client code
- Migrate code from ioredis/node-redis to GLIDE
- Provide working examples for Redis data structures
- Answer questions about GLIDE APIs with 100% coverage (296 methods)

## Installation

### For Claude Desktop

1. Install the package globally:
```bash
npm install -g valkey-glidejs-mcp
```

2. Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):
```json
{
  "mcpServers": {
    "valkey-glide": {
      "command": "npx",
      "args": ["valkey-glidejs-mcp"]
    }
  }
}
```

3. Restart Claude Desktop

## What you can ask

Once installed, you can ask Claude to:

- **"Create a Valkey GLIDE client"** - Get basic connection code
- **"Migrate this ioredis code to GLIDE"** - Convert existing code
- **"Show me how to use Redis streams with GLIDE"** - Get specific examples
- **"Create a distributed lock with GLIDE"** - Generate pattern implementations
- **"Set up a rate limiter using GLIDE"** - Build common patterns

## Available Tools

The MCP server provides these tools to AI assistants:

### Code Generation
- Basic client setup (standalone & cluster)
- Pub/Sub patterns
- Distributed locks
- Rate limiters
- Caching patterns
- All Redis data structures (strings, hashes, lists, sets, sorted sets, streams, geo, bitmaps, HyperLogLog)

### Migration
- Convert ioredis/node-redis code to GLIDE
- Validate migrated code
- Find GLIDE equivalents for other client methods

### API Information
- Search GLIDE methods
- Browse by category (strings, hashes, lists, etc.)
- Get detailed API documentation

## GLIDE Client Basics

```typescript
import { GlideClient } from '@valkey/valkey-glide';

// Create client
const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});

// Basic operations
await client.set('key', 'value');
const value = await client.get('key');

// Cleanup
await client.close();
```

## Important Notes

- GLIDE uses different API patterns than ioredis/node-redis
- `geoadd` expects a Map, not an array
- `scan` returns `[cursor, keys[]]` not an object
- Transactions use a Transaction class
- Cluster requires `GlideClusterClient`

## Development

### Build from source
```bash
git clone https://github.com/avifenesh/valkey-glidejs-mcp.git
cd valkey-glidejs-mcp
npm install
npm run build
```

### Run tests
```bash
npm test
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on commits and development workflow.

## License

MIT

## Links

- [Valkey GLIDE Documentation](https://github.com/valkey-io/valkey-glide)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [NPM Package](https://www.npmjs.com/package/valkey-glidejs-mcp)