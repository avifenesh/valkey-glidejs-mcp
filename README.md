# valkey-glidejs-mcp

[![npm version](https://badge.fury.io/js/valkey-glidejs-mcp.svg)](https://www.npmjs.com/package/valkey-glidejs-mcp)

A Model Context Protocol (MCP) server that helps AI assistants work with [Valkey GLIDE](https://github.com/valkey-io/valkey-glide), the high-performance Valkey/Redis-compatible client.

## What it does

This MCP server gives AI assistants (Claude, Continue, Cline, Zed, etc.) the ability to:
- Generate correct GLIDE client code
- Migrate code from ioredis/node-redis to GLIDE
- Provide working examples for Valkey data structures
- Answer questions about GLIDE APIs with 100% coverage (296 methods)

## Installation

### Prerequisites
```bash
npm install -g valkey-glidejs-mcp
```

### For Claude Desktop

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

### For Continue (VS Code/JetBrains)

Add to your Continue configuration (`~/.continue/config.json`):

```json
{
  "models": [
    // Your model configuration
  ],
  "mcpServers": [
    {
      "name": "valkey-glide",
      "command": "npx",
      "args": ["valkey-glidejs-mcp"]
    }
  ]
}
```

### For Cline (VS Code Extension)

1. Open VS Code Settings (Cmd/Ctrl + ,)
2. Search for "Cline MCP"
3. Add to MCP Servers configuration:

```json
{
  "valkey-glide": {
    "command": "npx",
    "args": ["valkey-glidejs-mcp"]
  }
}
```

### For Zed Editor

Add to your Zed settings (`~/.config/zed/settings.json`):

```json
{
  "assistant": {
    "version": "2",
    "mcp_servers": {
      "valkey-glide": {
        "command": "npx",
        "args": ["valkey-glidejs-mcp"]
      }
    }
  }
}
```

### For Cursor

Add to your Cursor settings (`~/.cursor/settings.json` or through Settings UI):

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

### For Open Interpreter

```bash
# Start with MCP support
interpreter --mcp valkey-glidejs-mcp
```

### For Custom MCP Clients

Connect using stdio transport:

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['valkey-glidejs-mcp']
});

const client = new Client({ name: 'my-client', version: '1.0.0' }, { capabilities: {} });
await client.connect(transport);

// Use the tools
const result = await client.callTool('gen.clientBasic', {});
console.log(result);
```

## What you can ask

Once installed, you can ask your AI assistant to:

- **"Create a Valkey GLIDE client"** - Get basic connection code
- **"Migrate this ioredis code to GLIDE"** - Convert existing code
- **"Show me how to use Valkey streams with GLIDE"** - Get specific examples
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
- All Valkey data structures (strings, hashes, lists, sets, sorted sets, streams, geo, bitmaps, HyperLogLog)

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