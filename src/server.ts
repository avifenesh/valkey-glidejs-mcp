#!/usr/bin/env node
/**
 * OPTIMIZED MCP SERVER - Reduced from 42 tools to 4 smart tools
 *
 * BEFORE: 42 tools across 18 files causing AI agent confusion
 * AFTER: 4 intelligent tools with smart routing
 *
 * Smart Tools:
 * 1. "api" - Unified API exploration (replaces 19 API tools)
 * 2. "generate" - Intelligent code generation (replaces 12 generation tools)
 * 3. "migrate" - Smart migration engine (replaces 3 migration tools)
 * 4. "system" - System utilities (replaces 8 system tools)
 *
 * Benefits:
 * - 90% reduction in tool count (42 → 4)
 * - Context-aware routing
 * - Preserved functionality
 * - Reduced AI agent cognitive load
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import unified tools
import { registerUnifiedApiExplorer } from "./tools/core/api-explorer.js";
import { registerUnifiedCodeGenerator } from "./tools/core/code-generator.js";
import { registerSmartMigrationEngine } from "./tools/core/migration-engine.js";
import { registerSystemTools } from "./tools/core/system-tools.js";

// For compatibility, also import original data mapping
import { findEquivalent, searchAll } from "./data/api/mappings.js";

const mcp = new McpServer({
  name: "valkey-glidejs-mcp",
  version: "2.0.0",
});

// ============================================================
// OPTIMIZED TOOL REGISTRATION - 4 SMART TOOLS ONLY
// ============================================================

console.error("🚀 Starting MCP Server with 4 smart tools...");

// 1. API Explorer - Handles all API-related requests intelligently
registerUnifiedApiExplorer(mcp);
console.error("✅ Registered API Explorer (unified API tools)");

// 2. Code Generator - Intelligent code generation with context awareness
registerUnifiedCodeGenerator(mcp);
console.error("✅ Registered Code Generator (unified generation tools)");

// 3. Migration Engine - Smart migration with pattern detection
registerSmartMigrationEngine(mcp);
console.error("✅ Registered Migration Engine (smart migration)");

// 4. System Tools - Health, validation, docs, debug utilities
registerSystemTools(mcp);
console.error("✅ Registered System Tools (system utilities)");

// ============================================================
// SERVER STARTUP
// ============================================================

async function main() {
  const transport = new StdioServerTransport();

  console.error("🎯 MCP Server ready with 4 smart tools:");
  console.error("   • 'api' - API exploration, search, comparison");
  console.error("   • 'generate' - Code generation for all patterns");
  console.error("   • 'migrate' - Intelligent Redis → GLIDE migration");
  console.error("   • 'system' - Health, validation, docs, debug");
  console.error("");
  console.error("🔗 Server ready on stdio transport...");

  await mcp.connect(transport);
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.error("\n🛑 Shutting down MCP server...");
  process.exit(0);
});

main().catch((error) => {
  console.error("❌ Failed to start MCP server:", error);
  process.exit(1);
});
