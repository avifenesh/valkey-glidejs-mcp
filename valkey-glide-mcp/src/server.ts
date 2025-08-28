#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerHealthTool } from "./tools/health.js";
import { registerDocsTools } from "./tools/docs.js";
import { registerApiTools } from "./tools/api.js";
import { registerMigrationTools } from "./tools/migrate.js";
import { registerGeneratorTools } from "./tools/generators.js";
import { registerVerifyTools } from "./tools/verify.js";
import { registerDataTools } from "./tools/data.js";
import { registerValidationTools } from "./tools/validate.js";
import { registerCommandsTools } from "./tools/commands.js";

const mcp = new McpServer({ name: "valkey-glide-mcp", version: "0.1.0" });

registerHealthTool(mcp);
registerDocsTools(mcp);
registerApiTools(mcp);
registerMigrationTools(mcp);
registerGeneratorTools(mcp);
registerVerifyTools(mcp);
registerDataTools(mcp);
registerValidationTools(mcp);
registerCommandsTools(mcp);

async function main() {
  const transport = new StdioServerTransport();
  await mcp.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
