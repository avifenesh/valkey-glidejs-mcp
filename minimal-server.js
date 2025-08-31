#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const mcp = new McpServer({ name: "minimal-test", version: "1.0.0" });

// Test 1: Tool with no parameters
mcp.tool(
  "test.noparams",
  "Test tool with no parameters",
  {},
  async () => {
    return {
      content: [{ type: "text", text: "No params works!" }],
    };
  }
);

// Test 2: Tool with parameters using tool() method
mcp.tool(
  "test.withparams",
  "Test tool with parameters",
  {
    name: z.string().describe("Your name"),
  },
  async ({ name }) => {
    return {
      content: [{ type: "text", text: `Hello ${name}!` }],
    };
  }
);

// Test 3: Tool with parameters using registerTool() method
mcp.registerTool(
  "test.register",
  {
    description: "Test with registerTool",
    inputSchema: {
      message: z.string().describe("A message"),
    },
  },
  async ({ message }) => {
    return {
      content: [{ type: "text", text: `You said: ${message}` }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await mcp.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});