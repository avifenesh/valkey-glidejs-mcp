#!/usr/bin/env node

/**
 * GLIDE MCP Server Launcher
 * Production-ready launcher for the Valkey GLIDE MCP server
 */

import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = resolve(__dirname, "src", "server.ts");

// Launch the server with tsx
const server = spawn("npx", ["tsx", serverPath], {
  stdio: "inherit",
  cwd: __dirname,
});

server.on("error", (error) => {
  console.error("Failed to start GLIDE MCP server:", error.message);
  process.exit(1);
});

server.on("close", (code) => {
  if (code !== 0) {
    console.error(`GLIDE MCP server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  server.kill("SIGINT");
});

process.on("SIGTERM", () => {
  server.kill("SIGTERM");
});
