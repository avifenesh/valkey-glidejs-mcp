# valkey-glidejs-mcp

[![npm version](https://badge.fury.io/js/valkey-glidejs-mcp.svg)](https://www.npmjs.com/package/valkey-glidejs-mcp)

A Model Context Protocol (MCP) server that helps AI assistants work with [Valkey GLIDE](https://github.com/valkey-io/valkey-glide), the high-performance Valkey/Redis-compatible client.

## What it does

This MCP server gives AI assistants (Claude, Continue, Cline, Zed, etc.) the ability to:

- **Enhanced Migration**: Production-ready migration from ioredis/node-redis to GLIDE with 100% success rate on 51 tested patterns
- **Smart Code Generation**: Generate correct GLIDE client code with proper configuration mapping
- **Real-world Pattern Support**: Handle complex patterns like distributed locks, rate limiting, pub/sub, transactions
- **Complete API Coverage**: Answer questions about GLIDE APIs with 100% coverage (296 methods)
- **Runtime Validation**: All migrations tested against real Valkey instances

## Installation

### Prerequisites

```bash
npm install -g valkey-glidejs-mcp
```

### For Claude Desktop / Claude Code

**Option 1: Using Claude Code CLI (Recommended)**

```bash
claude mcp add --scope user valkey-glidejs-mcp valkey-glidejs-mcp
```

**Option 2: Manual Configuration**
Add to your Claude Desktop configuration:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

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

Then restart Claude Desktop.

### For Other MCP-Compatible Tools

Most MCP-compatible tools support adding servers. Use this configuration:

- **Command**: `npx` or `valkey-glidejs-mcp` (if globally installed)
- **Args**: `["valkey-glidejs-mcp"]` (only if using `npx`)
- **Transport**: `stdio`

### For Custom MCP Clients

Connect using stdio transport with the MCP SDK. See [MCP documentation](https://modelcontextprotocol.io) for implementation details.

## What you can ask

Once installed, you can ask your AI assistant to:

- **"Create a Valkey GLIDE client"** - Get basic connection code
- **"Migrate this ioredis code to GLIDE"** - Convert existing code
- **"Show me how to use Valkey streams with GLIDE"** - Get specific examples
- **"Create a distributed lock with GLIDE"** - Generate pattern implementations
- **"Set up a rate limiter using GLIDE"** - Build common patterns

## Available Tools

The MCP server provides these tools to AI assistants:

### Enhanced Migration (🆕 v0.4.0)

- **Dual Client Support**: Migrates both ioredis and node-redis to GLIDE with 51 comprehensive test patterns
- **URL Connection Parsing**: Handles redis:// and rediss:// URLs with automatic TLS and auth extraction
- **Smart Configuration Mapping**: Converts connection options to GLIDE format with retry strategies
- **Transaction Support**: Converts pipelines to GLIDE Transactions with proper variable tracking
- **Native Blocking Operations**: Uses GLIDE's native `blpop`, `brpop`, `bzpopmin`, `bzpopmax`, `blmove` methods
- **Script Migration**: Converts `redis.eval()` to GLIDE Script objects with module-level definitions
- **Comprehensive Pub/Sub Guidance**: Complete migration examples with before/after patterns
- **Real-world Patterns**: Based on actual GitHub repository patterns, not assumptions

### Code Generation

- Basic client setup (standalone & cluster)
- Pub/Sub patterns
- Distributed locks
- Rate limiters
- Caching patterns
- All Valkey data structures (strings, hashes, lists, sets, sorted sets, streams, geo, bitmaps, HyperLogLog)

### API Information

- Search GLIDE methods
- Browse by category (strings, hashes, lists, etc.)
- Get detailed API documentation with 100% GLIDE API coverage (296 methods)

## GLIDE Client Basics

```typescript
import { GlideClient } from "@valkey/valkey-glide";

// Create client
const client = await GlideClient.createClient({
  addresses: [{ host: "localhost", port: 6379 }],
});

// Basic operations
await client.set("key", "value");
const value = await client.get("key");

// Cleanup
client.close();
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
