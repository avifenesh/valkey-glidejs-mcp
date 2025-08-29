# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server for Valkey GLIDE, providing code generation assistance and migration guidance for the high-performance GLIDE client. The project consists of two main parts:
- Root level: Repository management and documentation
- `valkey-glidejs-mcp/`: The actual MCP server package that gets published to npm

## Development Commands

### Working in the main package directory (`valkey-glidejs-mcp/`)

```bash
# Build the TypeScript project
npm run build

# Run in development mode with hot reload (uses tsx)
npm run dev

# Run tests (uses tsx --test with test/*.test.ts files)
npm test

# Start the production server
npm start

# Validate GLIDE API mappings
npm run validate:glide

# Ingest command documentation
npm run ingest:commands
```

### Testing

- Test files are located in `valkey-glidejs-mcp/test/` with `.test.ts` extension
- Uses Node.js native test runner with tsx
- Run a specific test: `tsx --test test/specific.test.ts`
- Tests cover all MCP tools including API mappings, generators, migration, and validation

## Architecture

### MCP Server Structure (`valkey-glidejs-mcp/src/`)

The server follows a modular tool registration pattern:

- **server.ts**: Entry point that creates MCP server and registers all tools via individual tool modules
- **tools/**: Each file exports a `register*Tools()` function that adds tools to the MCP server
  - `api.ts`: API discovery and mapping tools (search, findEquivalent, categories, families)
  - `generators.ts`: Code generation templates for various patterns (clients, pub/sub, data structures)
  - `migrate.ts`: Migration tools for converting ioredis/node-redis code to GLIDE
  - `validate.ts`: Validation tools for API mappings and generated code
  - `verify.ts`: Static code verification
  - `docs.ts`: Documentation fetching and recommendation
  - `data.ts`: Data enrichment and parsing
  - `commands.ts`: Command ingestion from markdown
  - `health.ts`: Health check endpoint
- **data/api/**: Contains mapping datasets and search functions
  - `mappings.ts`: Core mapping logic between different Redis clients and GLIDE

### Tool Registration Pattern

Each tool module follows this pattern:
```typescript
export function registerToolType(mcp: McpServer) {
  mcp.tool("tool.name", zodSchema, async (args) => {
    // Tool implementation
    return { structuredContent: {...}, content: [...] };
  });
}
```

### Key Data Structures

- **API Mappings**: Maps methods from ioredis/node-redis to GLIDE equivalents
- **Command Families**: Organizes Redis commands by functional groups (strings, lists, sets, etc.)
- **Templates**: Code generation templates using string interpolation for various use cases

## TypeScript Configuration

- Target: ES2022
- Module: ES2022 with Node resolution
- Strict mode enabled
- Source maps and declarations generated
- Output to `dist/` directory

## Publishing

The package is published to npm as `valkey-glidejs-mcp`. The main entry point is `dist/server.js` which also serves as the CLI binary.

## MCP Protocol Integration

The server uses stdio transport for MCP communication. Tools are registered on startup and handle:
- Code migration from other Redis clients
- API discovery and mapping
- Code generation for common patterns
- Documentation retrieval
- Static validation

All tools return structured content with both machine-readable data and human-readable text representations.