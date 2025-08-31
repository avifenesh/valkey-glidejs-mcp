#!/usr/bin/env node
import { spawn } from 'child_process';
import fs from 'fs';

const logFile = fs.createWriteStream('mcp-debug.log', { flags: 'a' });

const server = spawn('node', ['dist/server.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Log stdin (from client to server)
process.stdin.on('data', (data) => {
  const timestamp = new Date().toISOString();
  logFile.write(`[${timestamp}] CLIENT->SERVER:\n${data}\n\n`);
  server.stdin.write(data);
});

// Log stdout (from server to client)
server.stdout.on('data', (data) => {
  const timestamp = new Date().toISOString();
  logFile.write(`[${timestamp}] SERVER->CLIENT:\n${data}\n\n`);
  process.stdout.write(data);
});

// Log stderr
server.stderr.on('data', (data) => {
  const timestamp = new Date().toISOString();
  logFile.write(`[${timestamp}] SERVER ERROR:\n${data}\n\n`);
  process.stderr.write(data);
});

server.on('close', (code) => {
  logFile.write(`Server closed with code ${code}\n`);
  process.exit(code);
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit(0);
});