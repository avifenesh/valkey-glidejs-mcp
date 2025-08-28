# Valkey Glide MCP

[![npm version](https://badge.fury.io/js/valkey-glide-mcp.svg)](https://badge.fury.io/js/valkey-glide-mcp)
[![Node.js CI](https://github.com/avifenesh/valkey-glide-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/avifenesh/valkey-glide-mcp/actions/workflows/ci.yml)

A Model Context Protocol (MCP) server that provides expert knowledge and code generation assistance for [Valkey GLIDE](https://valkey.io/valkey-glide/), the high-performance Valkey client.

## Overview

This MCP server helps AI assistants generate code and provide migration guidance for Valkey GLIDE applications. Whether you're migrating from other Redis/Valkey clients or building new applications from scratch, this server provides expert knowledge about GLIDE APIs, best practices, and code patterns through the MCP protocol.

## Features

- **🔄 Migration Assistance**: Migrate from ioredis/node-redis to Valkey GLIDE with automated code transformations
- **🧠 API Knowledge**: Complete knowledge of GLIDE APIs, methods, and configuration options
- **🏗️ Code Generation**: Generate GLIDE client code for various use cases and patterns
- **📚 Documentation**: Curated documentation sources and recommendations
- **✅ Validation**: Static verification of migrated code
- **🔍 API Discovery**: Search and explore GLIDE command families and categories

## Installation

### Via npm

```bash
npm install -g valkey-glide-mcp
```

### From Source

```bash
git clone https://github.com/avifenesh/valkey-glide-mcp.git
cd valkey-glide-mcp/valkey-glide-mcp
npm install
npm run build
```

## Usage

### As MCP Server

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "valkey-glide": {
      "command": "valkey-glide-mcp",
      "args": []
    }
  }
}
```

### Development Mode

```bash
npm run dev
```

The server uses stdio transport and registers tools on startup.

## Available Tools

### Migration Tools

- `migrate.naive { from, code }` - Transform ioredis/node-redis code to GLIDE
- `verify.static { code }` - Validate migrated code

### API Discovery

- `api.search { query }` - Search for GLIDE methods and commands
- `api.findEquivalent { source, symbol }` - Find GLIDE equivalent for other client methods
- `api.categories {}` - List all command categories
- `api.byCategory { category }` - Get commands by category
- `api.families {}` - List all command families
- `api.byFamily { family }` - Get commands by family

### Code Generators

- `gen.clientBasic {}` - Generate basic GLIDE client setup
- `gen.clientCluster {}` - Generate cluster client setup
- `gen.cache { key, ttlSeconds }` - Generate caching patterns
- `gen.lock { lockKey, ttlMs }` - Generate distributed lock patterns
- `gen.rateLimiter { key, points, duration }` - Generate rate limiting patterns
- `gen.pubsubPublisher { channel }` - Generate Pub/Sub publisher
- `gen.pubsubSubscriber { channel }` - Generate Pub/Sub subscriber
- `gen.pubsubAdvanced { channel }` - Generate advanced Pub/Sub patterns
- `gen.fastify {}` - Generate Fastify integration code

### Data Structure Generators

- `gen.sets {}` - Generate Redis Sets examples
- `gen.zsets {}` - Generate Sorted Sets examples
- `gen.streams {}` - Generate Redis Streams examples
- `gen.hashes {}` - Generate Hash examples
- `gen.lists {}` - Generate List examples
- `gen.geo {}` - Generate Geospatial examples
- `gen.bitmaps {}` - Generate Bitmap examples
- `gen.hll {}` - Generate HyperLogLog examples
- `gen.json {}` - Generate JSON examples

### Documentation

- `docs.listSources` - List curated documentation sources
- `docs.recommend { topic }` - Get topic-specific documentation
- `docs.fetch { url, refresh? }` - Fetch and cache documentation content
- `data.enrich { sources? }` - Parse and enrich documentation data

### Utilities

- `health` - Check server health status

## Quick Start Example

### 1. Create a Basic Client

```typescript
import { createClient } from "@valkey/glide";

const client = await createClient({
  host: "localhost",
  port: 6379,
});

// Use the client
await client.set("key", "value");
const value = await client.get("key");
console.log(value); // 'value'
```

### 2. Pub/Sub with Dedicated Connections

```typescript
import { createClient } from "@valkey/glide";

const publisher = await createClient({ host: "localhost", port: 6379 });
const subscriber = await createClient({ host: "localhost", port: 6379 });

// Subscribe to messages
(async () => {
  for await (const msg of subscriber.subscribe("news")) {
    console.log("Received:", msg);
  }
})();

// Publish a message
await publisher.publish("news", JSON.stringify({ hello: "world" }));
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
```

### Linting and Formatting

```bash
npm run prettier
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Related Projects

- [Valkey GLIDE](https://github.com/valkey-io/valkey-glide) - High-performance Valkey client
- [Model Context Protocol](https://github.com/modelcontextprotocol/python-sdk) - Protocol for AI assistant integrations
