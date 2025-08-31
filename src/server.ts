#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerHealthTool } from "./tools/health.js";
import { registerDocsTools } from "./tools/docs.js";
import { registerApiTools } from "./tools/api.js";
import { registerEnhancedApiTools } from "./tools/enhanced-api.js";
import { registerMigrationTools } from "./tools/migrate.js";
// import { registerGeneratorTools } from "./tools/generators.js"; // DISABLED - has params
import { registerNoParamGeneratorTools } from "./tools/generators-no-params.js";
import { registerEnhancedGeneratorTools } from "./tools/enhanced-generators.js";
import { registerVerifyTools } from "./tools/verify.js";
import { registerDataTools } from "./tools/data.js";
import { registerValidationTools } from "./tools/validate.js";
import { registerCommandsTools } from "./tools/commands.js";
import { registerDebugTools } from "./tools/debug.js";
import { registerTestTools } from "./tools/test-basic.js";

const mcp = new McpServer({ name: "valkey-glidejs-mcp", version: "0.1.0" });

// ============================================================
// TEMPORARY: Tools with parameters are disabled due to Claude MCP bug
// Issue: "keyValidator._parse is not a function" error
// These will be re-enabled once Claude's MCP client is fixed
// ============================================================

// Debug tools (has params) - DISABLED
// registerDebugTools(mcp);

// Test tools (has params) - DISABLED  
// registerTestTools(mcp);

// Health check - NO PARAMS - WORKING
registerHealthTool(mcp);

// Docs tools (has params) - DISABLED
// registerDocsTools(mcp);

// API tools (has params) - DISABLED
// registerApiTools(mcp);

// Enhanced API tools - NO PARAMS - WORKING
registerEnhancedApiTools(mcp);

// Migration tools (has params) - DISABLED
// registerMigrationTools(mcp);

// Generator tools - ONLY NO-PARAM ONES
registerNoParamGeneratorTools(mcp);

// Enhanced generator tools - NO PARAMS - WORKING
registerEnhancedGeneratorTools(mcp);

// Verify tools (has params) - DISABLED
// registerVerifyTools(mcp);

// Data tools (has params) - DISABLED
// registerDataTools(mcp);

// Validation tools (has params) - DISABLED
// registerValidationTools(mcp);

// Commands tools (has params) - DISABLED
// registerCommandsTools(mcp);

async function main() {
  const transport = new StdioServerTransport();
  await mcp.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
