# 🚀 Valkey GLIDE MCP Server

[![npm version](https://badge.fury.io/js/valkey-glidejs-mcp.svg)](https://www.npmjs.com/package/valkey-glidejs-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

**A streamlined Model Context Protocol (MCP) server for [Valkey GLIDE](https://github.com/valkey-io/valkey-glide)** - providing intelligent migration assistance, code generation, and complete API coverage for AI assistants.

## ✨ Smart Tool Architecture

### 🔧 4 Intelligent Tools

| Tool           | Purpose                  | Key Features                             |
| -------------- | ------------------------ | ---------------------------------------- |
| **`api`**      | API exploration & search | Context-aware search, smart filtering    |
| **`generate`** | Code generation          | Pattern detection, parameter inference   |
| **`migrate`**  | Migration engine         | Complexity assessment, automatic routing |
| **`system`**   | System utilities         | Health, validation, docs, debugging      |

### 🧠 Intelligent Features

- **Smart Parameter Detection**: Tools automatically understand your intent
- **Context-Aware Routing**: Responses adapt based on query complexity
- **Unified Interfaces**: Consistent experience across all operations

## ✨ Features at a Glance

🎯 **Complete API Coverage**: **673 methods** across all GLIDE-supported commands  
🔄 **Smart Migration**: **100% success rate** on 65+ tested migration patterns  
⚡ **Comprehensive Commands**: Support for **296 commands** supported by GLIDE  
🏗️ **Intelligent Generation**: Context-aware code templates for all use cases  
✅ **Runtime Validated**: All migrations tested against live Valkey instances  
🔧 **Production Ready**: Based on actual GitHub repositories, not toy examples
🧠 **AI-Optimized**: Streamlined tool interface reduces cognitive load

## 🎯 What This Tool Does

This MCP server transforms AI assistants (Claude, Continue, Cline, Zed, etc.) into Valkey GLIDE experts by providing:

- **🔄 Universal Migration**: Seamlessly convert **any** ioredis/node-redis code to GLIDE
- **🏗️ Smart Code Generation**: Generate production-ready GLIDE code for **any** pattern
- **📚 Complete API Knowledge**: Instant access to **all** 673 GLIDE methods and their usage
- **🎯 Pattern Recognition**: Handle complex real-world scenarios (locks, rate limiting, pub/sub, transactions)
- **✅ Validation Tools**: Verify code correctness and API compliance

## 🚀 Quick Start

### One-Command Installation

```bash
# Install globally (recommended)
npm install -g valkey-glidejs-mcp

# Or use with npx (no installation)
npx valkey-glidejs-mcp@latest
```

### 🔧 Setup for AI Assistants

<details>
<summary><strong>📱 Claude Desktop / Claude Code</strong></summary>

**Option 1: Using Claude Code CLI (Recommended)**

```bash
# Current published package has missing files - use local development method:
clone https://github.com/avifenesh/valkey-glidejs-mcp.git
cd valkey-glidejs-mcp
npm install
# Then use in Claude:
claude mcp add --scope user valkey-glide npx tsx /path/to/valkey-glidejs-mcp/src/server.ts
```

**Alternative (once fixed package is published):**

```bash
claude mcp add --scope user valkey-glidejs-mcp npx valkey-glidejs-mcp@latest
```

**Option 2: Manual Configuration**
Add to your Claude Desktop config file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**Current Workaround (until package fix):**

```json
{
  "mcpServers": {
    "valkey-glide": {
      "command": "npx",
      "args": ["tsx", "/full/path/to/valkey-glidejs-mcp/src/server.ts"]
    }
  }
}
```

**Future (once package is fixed):**

```json
{
  "mcpServers": {
    "valkey-glide": {
      "command": "npx",
      "args": ["valkey-glidejs-mcp@latest"]
    }
  }
}
```

Then restart Claude Desktop.

</details>

<details>
<summary><strong>🔌 Other MCP-Compatible Tools</strong></summary>

**Configuration:**

- **Command**: `npx` or `valkey-glidejs-mcp` (if globally installed)
- **Args**: `["valkey-glidejs-mcp@latest"]` (only if using `npx`)
- **Transport**: `stdio`

**Supported Tools:** Continue, Cline, Zed, and any MCP-compatible AI assistant

</details>

## 💬 What You Can Ask

Describe what you need - the system automatically routes to the right functionality:

### 🔄 Migration

```
"Migrate this ioredis code to GLIDE"
"Convert my node-redis app to use GLIDE"
"How do I migrate Redis pipelines to GLIDE batch operations?"
```

### 🏗️ Code Generation

```
"Create a GLIDE client for my app"
"Generate a distributed lock with GLIDE"
"Build a rate limiter using GLIDE and streams"
"Show me pub/sub patterns with GLIDE"
```

### 📚 API Documentation

```
"What GLIDE methods work with sorted sets?"
"How do I use GLIDE for geospatial operations?"
"Show me all available GLIDE string commands"
"Find GLIDE equivalent for ioredis.get()"
```

### 🔧 System Operations

```
"Check server health"
"Validate this GLIDE code"
"Show documentation for caching patterns"
"Debug this Redis connection"
```

## 🔧 Smart Tool Architecture

### 🧠 Intelligent Tool Consolidation

4 smart tools with context-aware routing for optimal AI agent experience:

| Smart Tool     | Capabilities                              | Intelligence Features                                                                 |
| -------------- | ----------------------------------------- | ------------------------------------------------------------------------------------- |
| **`api`**      | Search, equivalents, categories, browsing | • Query complexity detection<br>• Smart result filtering<br>• Context-aware responses |
| **`generate`** | Clients, patterns, applications, advanced | • Parameter inference<br>• Pattern recognition<br>• Complexity-based routing          |
| **`migrate`**  | ioredis, node-redis transformations       | • Source detection<br>• Pattern analysis<br>• Smart transformations                   |
| **`system`**   | Health, validation, docs, debugging       | • Action inference<br>• Error detection<br>• Help routing                             |

### 🔄 Universal Migration Engine (`migrate` tool)

**Complete Client Support**: Handles **both** ioredis and node-redis with 65+ tested migration patterns

- ✅ **URL Parsing**: Automatic redis:// and rediss:// URL handling with TLS/auth extraction
- ✅ **Smart Config Mapping**: Intelligent conversion of connection options and retry strategies
- ✅ **Batch Processing**: Converts deprecated pipelines to GLIDE Batch with non-atomic execution
- ✅ **Transaction Translation**: Converts multi/exec to GLIDE Batch with atomic guarantees
- ✅ **Script Migration**: Transforms `redis.eval()` to GLIDE Script objects with proper scoping
- ✅ **Pub/Sub Conversion**: Complete event-driven pattern migration with examples
- ✅ **Native Operations**: Direct mapping to GLIDE's native blocking and atomic operations

### 🏗️ Intelligent Code Generation (`generate` tool)

**Production-Ready Templates** for every Valkey use case:

- **Client Setup**: Standalone, cluster, and advanced configurations
- **Data Structures**: Strings, hashes, lists, sets, sorted sets, streams, geo, bitmaps, HyperLogLog, JSON
- **Advanced Patterns**: Distributed locks, rate limiters, caching, pub/sub, transactions
- **Real-World Scenarios**: Session management, job queues, idempotency, circuit breakers

### 📚 Complete API Coverage (`api` tool)

**673 Methods** with comprehensive documentation:

- 🔍 **Smart Search**: Find any method by name, category, or functionality
- 📋 **Category Browsing**: Organized by command families (strings, lists, sets, etc.)
- 📖 **Detailed Docs**: Usage examples, parameters, and return types for every method
- ✅ **Validation Tools**: Verify API usage and code correctness

### 🔧 System Utilities (`system` tool)

**Unified Management**: Health, validation, documentation, and debugging

- ❤️ **Health Monitoring**: Server status and performance metrics
- 🔍 **Code Validation**: Static analysis and GLIDE compliance checking
- 📖 **Documentation**: Context-aware help and examples
- 🐛 **Debugging**: Parameter validation and error diagnosis

## 🏃‍♂️ Quick Example

```typescript
import { GlideClient } from "@valkey/valkey-glide";

// Create client with smart configuration
const client = await GlideClient.createClient({
  addresses: [{ host: "localhost", port: 6379 }],
  // GLIDE automatically handles retries and optimization
});

// All operations are fully typed and validated
await client.set("user:1001", JSON.stringify({ name: "Alice", age: 30 }));
const userData = await client.get("user:1001");

// Advanced operations work seamlessly
await client.zadd("leaderboard", { alice: 95, bob: 87, charlie: 92 });
// Retrieve top 3 scores in reverse order using a range-by-index query
const topPlayers = await client.zrange(
  "leaderboard",
  { start: 0, end: 2, type: "byIndex" },
  { reverse: true },
);

// Clean shutdown
client.close();
```

## 📊 Performance & Quality Metrics

| Metric                 | Value           | Description                      |
| ---------------------- | --------------- | -------------------------------- |
| **API Coverage**       | 673 methods     | Complete GLIDE API surface       |
| **Command Support**    | 296 commands    | GLIDE-supported commands         |
| **Migration Success**  | 100%            | Tested on 65+ migration patterns |
| **Test Coverage**      | 65+ patterns    | Real GitHub repository code      |
| **Runtime Validation** | ✅ Live testing | Against actual Valkey instances  |
| **Smart Tools**        | 4 unified tools | Context-aware routing            |

## 🎯 Key Differences from ioredis/node-redis

| Aspect           | ioredis/node-redis | GLIDE                | Migration Help      |
| ---------------- | ------------------ | -------------------- | ------------------- |
| **Geo Commands** | Arrays             | Maps                 | ✅ Auto-converted   |
| **Scan Results** | Objects            | `[cursor, keys[]]`   | ✅ Format adjusted  |
| **Batching**     | Pipeline chains    | Batch(false)         | ✅ Non-atomic exec  |
| **Transactions** | Multi/exec         | Batch(true)          | ✅ Atomic execution |
| **Clustering**   | Same client        | `GlideClusterClient` | ✅ Auto-detected    |
| **Scripts**      | Direct eval        | Script objects       | ✅ Properly scoped  |

## 💻 Development & Contributing

### Build from Source

```bash
# Clone and setup
git clone https://github.com/avifenesh/valkey-glidejs-mcp.git
cd valkey-glidejs-mcp
npm install
npm run build

# Run comprehensive tests (65+ migration patterns)
npm test

# Validate API mappings
npm run validate:glide

# Ingest latest command documentation
npm run ingest:commands
```

### Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- 📝 Commit message guidelines
- 🔄 Development workflow
- 🧪 Testing requirements
- 📚 Documentation standards

## 📄 License & Links

**License**: MIT

**Resources:**

- 📦 [NPM Package](https://www.npmjs.com/package/valkey-glidejs-mcp)
- 📖 [Valkey GLIDE Documentation](https://github.com/valkey-io/valkey-glide)
- 🔗 [Model Context Protocol](https://modelcontextprotocol.io)
- 🐛 [Issues & Feedback](https://github.com/avifenesh/valkey-glidejs-mcp/issues)

---

<div align="center">

**Made with ❤️ for the Valkey community**

_Empowering AI assistants with complete Valkey GLIDE knowledge_

</div>
