#!/usr/bin/env node
/**
 * GLIDE MCP Server Validation Script
 * Validates server components and tool registration
 */

import { writeFileSync } from "fs";

const logMessage = (msg: string) => {
  console.error(msg);
  writeFileSync("validation.log", msg + "\n", { flag: "a" });
};

async function main() {
  logMessage("🔍 Starting GLIDE MCP Server validation...");

  try {
    // Test 1: Core dependencies
    logMessage("📦 Testing core dependencies...");
    await import("@modelcontextprotocol/sdk/server/mcp.js");
    logMessage("✅ MCP SDK available");

    // Test 2: API mappings
    logMessage("🗺️  Testing API mappings...");
    const { searchAll, findEquivalent } = await import(
      "../src/data/api/mappings.js"
    );
    const searchResults = searchAll("get");
    const mappingResults = findEquivalent("ioredis", "get");
    logMessage(
      `✅ API mappings working: ${searchResults.length} search results, ${mappingResults.length} mappings`,
    );

    // Test 3: Tool imports
    logMessage("🔧 Testing tool imports...");
    await import("../src/tools/core/system-tools.js");
    await import("../src/tools/core/api-explorer.js");
    await import("../src/tools/core/code-generator.js");
    await import("../src/tools/core/migration-engine.js");
    logMessage("✅ All 4 smart tools imported successfully");

    // Test 4: Server creation
    logMessage("🚀 Testing server creation...");
    const { McpServer } = await import(
      "@modelcontextprotocol/sdk/server/mcp.js"
    );
    const server = new McpServer({ name: "validation-test", version: "0.7.0" });
    logMessage("✅ MCP Server created successfully");

    const result = {
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
      version: "0.7.0",
      toolsValidated: 4,
      apiMappingsFound: searchResults.length,
      message: "All validation tests passed",
    };

    writeFileSync("validation-result.json", JSON.stringify(result, null, 2));
    logMessage("🎉 Validation completed successfully!");
  } catch (error) {
    const errorResult = {
      timestamp: new Date().toISOString(),
      status: "ERROR",
      error: error.message,
    };

    writeFileSync(
      "validation-error.json",
      JSON.stringify(errorResult, null, 2),
    );
    logMessage(`❌ Validation failed: ${error.message}`);
    process.exit(1);
  }
}

main();
