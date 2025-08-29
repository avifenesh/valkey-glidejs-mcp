# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2024-08-29

### Fixed
- Fixed geo example to use Map format instead of object for geoadd
- Updated comprehensive mappings with detailed examples for geoadd and scan operations
- Documented that GLIDE scan returns [cursor, keys[]] array format

### Changed
- Enhanced API documentation with GLIDE-specific behavior notes

## [0.1.1] - 2024-08-28

### Added
- Comprehensive API mappings with 100% GLIDE API coverage (296 methods)
- Auto-generated comprehensive mappings from TypeScript definitions
- Full test coverage for all GLIDE operations
- Cluster client support with GlideClusterClient

### Fixed
- Migration tool now uses correct GlideClient.createClient() API
- Fixed package name references to @valkey/valkey-glide
- Corrected API usage patterns in examples

## [0.1.0] - 2024-08-28

### Added
- Initial release of valkey-glidejs-mcp
- Model Context Protocol (MCP) server for Valkey GLIDE
- Migration tool for converting ioredis/node-redis code to GLIDE
- Code generation tools for common Redis patterns
- API verification and mapping tools
- Basic GLIDE client examples and templates

[0.1.2]: https://github.com/avifenesh/valkey-glidejs-mcp/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/avifenesh/valkey-glidejs-mcp/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/avifenesh/valkey-glidejs-mcp/releases/tag/v0.1.0