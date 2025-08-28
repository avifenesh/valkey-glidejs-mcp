#!/usr/bin/env tsx

/**
 * Simple test to check TypeScript compilation issues
 */

import { GlideClient } from '@valkey/valkey-glide';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGeneratorTools } from "../src/tools/generators.js";
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Test a single generator
async function testSingleGenerator() {
  console.log('Testing single generator compilation...');
  
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);
  
  const tool = (mcp as any)._registeredTools?.["gen.clientBasic"];
  const response = await tool.callback({} as any, {} as any);
  const code = response.structuredContent.code as string;
  
  console.log('Generated code:');
  console.log('---');
  console.log(code);
  console.log('---');
  
  // Write to test file
  const testFile = path.join(__dirname, 'simple-test.ts');
  fs.writeFileSync(testFile, code);
  
  try {
    // Use project's tsconfig.json
    execSync(`npx tsc ${testFile} --noEmit`, {
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ Compilation successful!');
  } catch (error: any) {
    console.log('❌ Compilation failed:');
    console.log(error.stderr?.toString() || error.stdout?.toString() || error.message);
  } finally {
    // Clean up
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  }
}

testSingleGenerator().catch(console.error);
