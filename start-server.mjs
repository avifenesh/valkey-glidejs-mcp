#!/usr/bin/env node

/**
 * GLIDE MCP Server Launcher
 * Production-ready launcher for the Valkey GLIDE MCP server
 */

import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tsEntry = resolve(__dirname, "src", "server.ts");
const jsEntry = resolve(__dirname, "dist", "server.js");

// Prefer built output if available, otherwise fall back to tsx
const hasBuilt = existsSync(jsEntry);
const entryPath = hasBuilt ? jsEntry : tsEntry;
const args = hasBuilt ? [entryPath] : ["tsx", entryPath];
const cmd = hasBuilt ? "node" : "npx";

const server = spawn(cmd, args, {
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
