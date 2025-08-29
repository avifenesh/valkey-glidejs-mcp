## [v0.4.3] - 2025-08-29

### :white_check_mark: Tests

- [`c5a69f9`](https://github.com/avifenesh/valkey-glidejs-mcp/commit/c5a69f92f13dab8c812cc669256e51c6fae2b67d) - add comprehensive validation test suite _(commit by [@avifenesh](https://github.com/avifenesh))_

### :flying_saucer: Other Changes

- [`dc7626a`](https://github.com/avifenesh/valkey-glidejs-mcp/commit/dc7626aab143aee3f83a74d205da3e572c421526) - Add README.md file

Signed-off-by: Avi Fenesh <55848801+avifenesh@users.noreply.github.com> _(commit by [@avifenesh](https://github.com/avifenesh))_

## [v0.4.1] - 2025-08-29

### :sparkles: New Features

- [`8d45a48`](https://github.com/avifenesh/valkey-glidejs-mcp/commit/8d45a480eac2a7104dea64e66a904e4ea16b37ae) - significantly improve migration tool TODO handling _(commit by [@avifenesh](https://github.com/avifenesh))_

### :bug: Bug Fixes

- [`9cdbb84`](https://github.com/avifenesh/valkey-glidejs-mcp/commit/9cdbb8490336581af1d6a7643c2a4bc68c6b93b9) - use native GLIDE methods for blocking operations instead of customCommand _(commit by [@avifenesh](https://github.com/avifenesh))_

## [0.2.1](https://github.com/avifenesh/valkey-glidejs-mcp/compare/v0.2.0...v0.2.1) (2025-08-29)

### Bug Fixes

- correct CI workflow paths after repository restructure ([46df699](https://github.com/avifenesh/valkey-glidejs-mcp/commit/46df69941a2f87d5146b891f306bf480446e9bcd))

## [0.2.0] - 2025-08-29

### 🚀 Major Features

#### Enhanced Migration Tool

- **Production-Ready Migration**: Achieve 100% success rate on tested real-world patterns
- **Smart Configuration Mapping**: Automatically convert ioredis connection options to GLIDE format
  - Maps `retryDelayOnFailover` → `connectionRetryStrategy.baseDelay`
  - Maps `maxRetriesPerRequest` → `connectionRetryStrategy.numberOfRetries`
  - Preserves host/port configurations with proper addresses array format

#### Advanced Pattern Support

- **Transaction Operations**: Convert ioredis pipelines to GLIDE Transactions with proper variable tracking
- **Conditional SET Operations**: Handle `SET key value PX ttl NX` patterns → GLIDE conditional set options
- **Lua Script Migration**: Convert `redis.eval()` to GLIDE Script objects with proper key/argument handling
- **Pub/Sub Migration**: Provide migration guidance from ioredis events to GLIDE callback configuration
- **Blocking Operations**: Map blocking commands like `brpoplpush` to GLIDE custom commands

#### Runtime Validation

- **Real Valkey Testing**: All migrations tested against live Valkey instances
- **Zero Runtime Errors**: Fixed critical issues with variable references and API usage
- **Production Patterns**: Tested with distributed locks, rate limiters, job queues, caching patterns

### 🔧 Technical Improvements

#### Code Quality

- **Variable Tracking**: Proper pipeline variable name extraction and reference fixing
- **API Correctness**: Use correct GLIDE APIs (`set()` with options instead of non-existent `conditionalSet()`)
- **Client Lifecycle**: Proper client creation and cleanup (`disconnect()` → `close()`)
- **Import Management**: Include all required classes (GlideClient, Transaction, Script)

#### Testing Infrastructure

- **Comprehensive Test Suite**: 7 real-world migration patterns tested
- **Runtime Validation**: Execute migrated code against live Valkey database
- **Quality Metrics**: 100% success rate on all test patterns

### 🐛 Bug Fixes

- Fixed variable reference errors in transaction execution
- Fixed incorrect GLIDE API usage for conditional operations
- Fixed client variable name mismatches in generated code
- Fixed client disconnection method calls

### 📚 Documentation

- Updated README with enhanced migration features
- Added comprehensive pattern examples
- Documented 100% success rate achievements

### 🔄 Migration Patterns Supported

1. **Session Management**: Express session stores with TTL
2. **Distributed Locks**: Redlock pattern with proper conditional sets
3. **Rate Limiting**: Sliding window and token bucket patterns
4. **Pub/Sub Systems**: Event-driven architectures with pattern subscriptions
5. **Caching**: Cache-aside pattern with multi-operations
6. **Job Queues**: Background job processing with blocking operations
7. **Transaction Batching**: Atomic operations with pipeline conversion

## [0.1.3](https://github.com/avifenesh/valkey-glidejs-mcp/compare/v0.1.2...v0.1.3) (2025-08-29)

### Bug Fixes

- mark Cursor and GitHub Copilot as supported ([3c48b3b](https://github.com/avifenesh/valkey-glidejs-mcp/commit/3c48b3bf556d3ec187c862d6b130b5ac34d2f2ee))

## [0.1.2](https://github.com/avifenesh/valkey-glidejs-mcp/compare/v0.1.1...v0.1.2) (2025-08-29)

### Bug Fixes

- correct geoadd Map format and document scan array return ([156ccfd](https://github.com/avifenesh/valkey-glidejs-mcp/commit/156ccfd6027c0459237aaab60f1b3ef4c32ddff0))

## [0.1.1](https://github.com/avifenesh/valkey-glidejs-mcp/compare/v0.1.0...v0.1.1) (2025-08-28)

### Features

- Add API validation infrastructure and fix API mappings ([256438b](https://github.com/avifenesh/valkey-glidejs-mcp/commit/256438b7c107b7674945cfd90eb0e97bdad2cff3))
- **commands:** ingest ValKey wiki into assistant-friendly COMMANDS_INDEX/BY_FAMILY with method signatures and validation ([c7b349f](https://github.com/avifenesh/valkey-glidejs-mcp/commit/c7b349f598569e28e92dd9c972a39beeefb3a45a))
- Complete GLIDE API coverage with comprehensive mappings ([b212987](https://github.com/avifenesh/valkey-glidejs-mcp/commit/b212987473aa93953d54ee6132146193aebf4225))
- **glide:** expand datasets, add families/generators, strict validation against Glide Node (122/122), docs + tests ([57a00bf](https://github.com/avifenesh/valkey-glidejs-mcp/commit/57a00bfeb468dbf680fbe638a74db04487ee6797))
- update dependencies and improve TypeScript compilation error handling ([5ce0e0b](https://github.com/avifenesh/valkey-glidejs-mcp/commit/5ce0e0bcf90c5135715aca5bf6d319f8ef97dd8c))

### Bug Fixes

- correct import path to @valkey/valkey-glide instead of @valkey/glide ([7e2ae81](https://github.com/avifenesh/valkey-glidejs-mcp/commit/7e2ae8112379c748afff80a885f5a0bf4d27080e))
  [v0.4.1]: https://github.com/avifenesh/valkey-glidejs-mcp/compare/v0.4.0...v0.4.1
  [v0.4.3]: https://github.com/avifenesh/valkey-glidejs-mcp/compare/v0.4.2...v0.4.3
