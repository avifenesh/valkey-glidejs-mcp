#!/usr/bin/env node
import { spawn } from 'child_process';

const server = spawn('node', ['minimal-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Initialize connection
const initMessage = JSON.stringify({
  jsonrpc: "2.0",
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: {
      name: "test-client",
      version: "1.0.0"
    }
  },
  id: 1
}) + '\n';

console.log('Sending initialize...');
server.stdin.write(initMessage);

server.stdout.on('data', (data) => {
  console.log('Server response:', data.toString());
  
  // Parse response
  try {
    const lines = data.toString().trim().split('\n');
    for (const line of lines) {
      const response = JSON.parse(line);
      
      // If initialize succeeded, list tools
      if (response.id === 1 && response.result) {
        console.log('Initialize succeeded, listing tools...');
        const listTools = JSON.stringify({
          jsonrpc: "2.0",
          method: "tools/list",
          params: {},
          id: 2
        }) + '\n';
        server.stdin.write(listTools);
      }
      
      // If tools listed, call one with parameters
      if (response.id === 2 && response.result) {
        console.log('Tools:', JSON.stringify(response.result.tools, null, 2));
        
        // Try calling the tool with parameters
        const callTool = JSON.stringify({
          jsonrpc: "2.0",
          method: "tools/call",
          params: {
            name: "test.withparams",
            arguments: {
              name: "TestUser"
            }
          },
          id: 3
        }) + '\n';
        console.log('Calling tool with params...');
        server.stdin.write(callTool);
      }
      
      // Check tool call result
      if (response.id === 3) {
        console.log('Tool call result:', JSON.stringify(response, null, 2));
        process.exit(0);
      }
    }
  } catch (e) {
    // Ignore parse errors for partial data
  }
});

server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});

setTimeout(() => {
  console.log('Timeout - killing server');
  server.kill();
  process.exit(1);
}, 5000);