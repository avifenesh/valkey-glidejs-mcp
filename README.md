# valkey-glidejs-mcp

[![npm version](https://badge.fury.io/js/valkey-glide-mcp.svg)](https://badge.fury.io/js/valkey-glide-mcp)
[![Node.js CI](https://github.com/avifenesh/valkey-glide-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/avifenesh/valkey-glide-mcp/actions/workflows/ci.yml)

A Model Context Protocol (MCP) knowledge server for Valkey GLIDE, providing code generation assistance and migration guidance for building applications with the high-performance GLIDE client.

## Overview

This repository contains the MCP server implementation that helps AI assistants generate code and provide migration guidance for Valkey GLIDE applications. Whether you're migrating from other Redis/Valkey clients or building new applications from scratch, this server provides expert knowledge about GLIDE APIs, best practices, and code patterns through the MCP protocol.

## Features

- **Code Generation**: Generate GLIDE client code for various use cases and patterns
- **Migration Assistance**: Help migrate from other Redis/Valkey clients (node-redis, ioredis, etc.)
- **Best Practices**: Provide guidance on optimal GLIDE usage and performance patterns
- **API Knowledge**: Complete knowledge of GLIDE APIs, methods, and configuration options
- **MCP Integration**: Seamless integration with AI assistants via Model Context Protocol

## Quick Start

### Installation

```bash
npm install -g valkey-glide-mcp
```

### Usage

Add to your MCP client configuration:

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

## Documentation

For detailed documentation, API reference, and examples, see the [package README](./valkey-glide-mcp/README.md).

## Development

The main package is located in the `valkey-glide-mcp/` directory:

```bash
cd valkey-glide-mcp
npm install
npm run dev
```

## Contributing

Contributions and feedback are welcome! Please feel free to submit issues and pull requests.

## License

MIT
