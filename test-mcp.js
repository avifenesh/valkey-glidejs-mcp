#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const mcp = new McpServer({ name: "test-mcp", version: "0.1.0" });

// Test tool with parameters
mcp.tool(
  "test.withParams",
  "Test tool with parameters",
  {
    name: z.string().describe("Your name"),
    age: z.number().optional().describe("Your age"),
  },
  async ({ name, age }) => {
    return {
      content: [
        { type: "text", text: `Hello ${name}, age: ${age}` },
      ],
    };
  }
);

// Test tool without parameters
mcp.tool(
  "test.noParams",
  "Test tool without parameters",
  {},
  async () => {
    return {
      content: [{ type: "text", text: "No params works!" }],
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