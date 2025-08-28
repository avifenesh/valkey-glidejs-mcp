#!/usr/bin/env node

/**
 * Simple test to check if one generator compiles successfully
 */

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGeneratorTools } from "../src/tools/generators.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function testOneGenerator() {
  console.log('🔍 Testing single generator compilation...');
  
  try {
    // Initialize MCP server and get one generator
    const mcp = new McpServer({ name: "test", version: "0.0.0" });
    registerGeneratorTools(mcp);
    
    const tool = mcp._registeredTools?.["gen.clientBasic"];
    if (!tool) {
      console.log('❌ Generator not found');
      return false;
    }
    
    // Generate code
    const response = await tool.callback({}, {});
    const code = response.structuredContent.code;
    
    console.log('✅ Code generated:');
    console.log('---');
    console.log(code);
    console.log('---');
    
    // Write to test file
    const testFile = join(__dirname, 'test-gen.ts');
    writeFileSync(testFile, code);
    
    try {
      // Try to compile
      execSync(`npx tsc ${testFile} --noEmit --skipLibCheck`, {
        stdio: 'pipe',
        cwd: join(__dirname, '..')
      });
      console.log('✅ Compilation successful!');
      return true;
    } catch (error) {
      console.log('❌ Compilation failed:');
      console.log(error.stderr?.toString() || error.stdout?.toString() || error.message);
      return false;
    } finally {
      // Clean up
      if (existsSync(testFile)) {
        unlinkSync(testFile);
      }
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    return false;
  }
}

testOneGenerator()
  .then(success => {
    console.log(success ? '\n🎉 SUCCESS: Generator compilation works!' : '\n💥 FAILED: Generator compilation broken');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
