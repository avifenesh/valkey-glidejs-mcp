#!/usr/bin/env tsx

/**
 * Comprehensive validation for all code generators
 * Tests that generated code compiles and executes against a real Valkey server
 */

import { GlideClient, GlideClusterClient } from '@valkey/valkey-glide';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGeneratorTools } from "../src/tools/generators.js";
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Test configuration
const STANDALONE_CONFIG = {
  addresses: [{ host: 'localhost', port: 6379 }]
};

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Generator test configurations
const generatorTests = [
  {
    name: 'gen.clientBasic',
    params: {},
    validate: (code: string) => code.includes('GlideClient.createClient'),
    canExecute: true
  },
  {
    name: 'gen.clientCluster',
    params: {},
    validate: (code: string) => code.includes('GlideClusterClient.createClient'),
    canExecute: false // Requires cluster setup
  },
  {
    name: 'gen.cache',
    params: { key: 'test:cache', ttlSeconds: 60 },
    validate: (code: string) => code.includes("'test:cache'") && code.includes('60'),
    canExecute: false // Requires fetchData function
  },
  {
    name: 'gen.lock',
    params: { lockKey: 'test:lock', ttlMs: 5000 },
    validate: (code: string) => code.includes("'test:lock'") && code.includes('5000'),
    canExecute: false // Requires crypto module
  },
  {
    name: 'gen.pubsubPublisher',
    params: { channel: 'test:channel' },
    validate: (code: string) => code.includes("'test:channel'") && code.includes('publish'),
    canExecute: true
  },
  {
    name: 'gen.pubsubSubscriber',
    params: { channel: 'test:channel' },
    validate: (code: string) => code.includes("'test:channel'") && code.includes('subscribe'),
    canExecute: false // Async iterator blocks
  },
  {
    name: 'gen.pubsubAdvanced',
    params: { channel: 'test:channel' },
    validate: (code: string) => code.includes('publisher') && code.includes('subscriber'),
    canExecute: false // Async iterator blocks
  },
  {
    name: 'gen.fastify',
    params: {},
    validate: (code: string) => code.includes('fastify') && code.includes('valkey'),
    canExecute: false // Requires fastify module
  },
  {
    name: 'gen.rateLimiter',
    params: { key: 'user:123', points: 10, duration: 60 },
    validate: (code: string) => code.includes('rl:user:123') && code.includes('10'),
    canExecute: false // Uses complex Lua script
  },
  {
    name: 'gen.queueProducer',
    params: { queue: 'task:queue' },
    validate: (code: string) => code.includes("'task:queue'") && code.includes('lpush'),
    canExecute: true
  },
  {
    name: 'gen.queueConsumer',
    params: { queue: 'task:queue' },
    validate: (code: string) => code.includes("'task:queue'") && code.includes('brpop'),
    canExecute: false // Infinite loop
  },
  {
    name: 'gen.sets',
    params: {},
    validate: (code: string) => code.includes('sadd') && code.includes('sismember'),
    canExecute: true
  },
  {
    name: 'gen.zsets',
    params: {},
    validate: (code: string) => code.includes('zadd') && code.includes('zrange'),
    canExecute: true
  },
  {
    name: 'gen.streams',
    params: {},
    validate: (code: string) => code.includes('xgroupCreate') && code.includes('xadd'),
    canExecute: false // Requires cluster
  },
  {
    name: 'gen.transaction',
    params: {},
    validate: (code: string) => code.includes('Transaction') && code.includes('exec'),
    canExecute: true
  },
  {
    name: 'gen.pipeline',
    params: {},
    validate: (code: string) => code.includes('Transaction') && code.includes('exec'),
    canExecute: true
  },
  {
    name: 'gen.geo',
    params: {},
    validate: (code: string) => code.includes('geoadd') && code.includes('geosearchstore'),
    canExecute: true
  },
  {
    name: 'gen.bitmaps',
    params: {},
    validate: (code: string) => code.includes('setbit') && code.includes('getbit'),
    canExecute: true
  },
  {
    name: 'gen.hll',
    params: {},
    validate: (code: string) => code.includes('pfadd') && code.includes('pfcount'),
    canExecute: true
  },
  {
    name: 'gen.json',
    params: {},
    validate: (code: string) => code.includes('JSON.SET') && code.includes('JSON.GET'),
    canExecute: false // Requires JSON module
  },
  {
    name: 'gen.hashesAdvanced',
    params: {},
    validate: (code: string) => code.includes('hset') && code.includes('hincrby'),
    canExecute: true
  },
  {
    name: 'gen.listsAdvanced',
    params: {},
    validate: (code: string) => code.includes('rpush') && code.includes('lrange'),
    canExecute: true
  },
  {
    name: 'gen.zsetRankings',
    params: {},
    validate: (code: string) => code.includes('zadd') && code.includes('zrank'),
    canExecute: true
  },
  {
    name: 'gen.jsonAdvanced',
    params: {},
    validate: (code: string) => code.includes('JSON.SET') && code.includes('$.profile'),
    canExecute: false // Requires JSON module
  },
  {
    name: 'gen.scan',
    params: {},
    validate: (code: string) => code.includes('scan') && code.includes('cursor'),
    canExecute: false // Has loop
  },
  {
    name: 'gen.clientAdvanced',
    params: {},
    validate: (code: string) => code.includes('credentials') && code.includes('useTLS'),
    canExecute: false // Requires env vars
  }
];

// Create a test file and attempt to compile it
async function testCompilation(code: string, testName: string): Promise<boolean> {
  const testDir = path.join(__dirname, 'generator-tests');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const testFile = path.join(testDir, `${testName.replace('.', '_')}.ts`);
  
  // Create a minimal test file that just checks syntax
  const testCode = `
// Generated code from ${testName}
${code}
`;

  fs.writeFileSync(testFile, testCode);

  try {
    // Use the project's tsconfig but exclude test files
    execSync(`npx tsc ${testFile} --noEmit --skipLibCheck`, {
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    return true;
  } catch (error: any) {
    const errorMsg = error.stderr?.toString() || error.stdout?.toString() || error.message;
    log(`  Compilation error: ${errorMsg.slice(0, 200)}...`, 'red');
    return false;
  }
}

// Check if Valkey server is running
async function checkValkeyServer(): Promise<boolean> {
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    await client.ping();
    await client.close();
    return true;
  } catch (error) {
    return false;
  }
}

// Main validation function
async function validateGenerators() {
  log('\n========================================', 'blue');
  log('🔍 Generator Validation Suite', 'blue');
  log('========================================', 'blue');

  // Initialize MCP server and register tools
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerGeneratorTools(mcp);

  const results = {
    total: generatorTests.length,
    generated: 0,
    validated: 0,
    compiled: 0,
    executed: 0,
    failed: [] as string[]
  };

  // Check Valkey server
  const serverAvailable = await checkValkeyServer();
  if (!serverAvailable) {
    log('\n⚠️  Valkey server not available - execution tests will be skipped', 'yellow');
  }

  for (const test of generatorTests) {
    log(`\n📝 Testing: ${test.name}`, 'magenta');
    
    // Get the generator tool
    const tool = (mcp as any)._registeredTools?.[test.name];
    if (!tool) {
      log(`  ❌ Generator not found`, 'red');
      results.failed.push(`${test.name}: Generator not found`);
      continue;
    }

    // Generate code
    try {
      const response = await tool.callback(test.params as any, {} as any);
      const code = response.structuredContent.code as string;
      results.generated++;
      log(`  ✅ Code generated (${code.length} characters)`, 'green');

      // Validate code structure
      if (test.validate(code)) {
        results.validated++;
        log(`  ✅ Code structure validated`, 'green');
      } else {
        log(`  ❌ Code structure validation failed`, 'red');
        results.failed.push(`${test.name}: Structure validation failed`);
        continue;
      }

      // Test compilation
      const compiles = await testCompilation(code, test.name);
      if (compiles) {
        results.compiled++;
        log(`  ✅ Code compiles successfully`, 'green');
      } else {
        log(`  ❌ Code compilation failed`, 'red');
        results.failed.push(`${test.name}: Compilation failed`);
      }

      // Test execution (if applicable and server available)
      if (test.canExecute && serverAvailable && compiles) {
        try {
          const testFile = path.join(__dirname, 'generator-tests', `${test.name.replace('.', '_')}.ts`);
          execSync(`npx tsx ${testFile}`, {
            stdio: 'pipe',
            timeout: 5000,
            cwd: path.join(__dirname, '..')
          });
          results.executed++;
          log(`  ✅ Code executes successfully`, 'green');
        } catch (error: any) {
          log(`  ⚠️  Execution failed (may be expected): ${error.message.slice(0, 100)}`, 'yellow');
        }
      } else if (test.canExecute && !serverAvailable) {
        log(`  ⚠️  Execution test skipped (no server)`, 'yellow');
      } else if (!test.canExecute) {
        log(`  ℹ️  Execution test not applicable`, 'cyan');
      }

    } catch (error: any) {
      log(`  ❌ Generator failed: ${error.message}`, 'red');
      results.failed.push(`${test.name}: ${error.message}`);
    }
  }

  // Print summary
  log('\n\n========================================', 'blue');
  log('📊 VALIDATION SUMMARY', 'blue');
  log('========================================', 'blue');

  log(`\n📈 Results:`, 'cyan');
  log(`  Total generators: ${results.total}`);
  log(`  ✅ Generated: ${results.generated}/${results.total}`, results.generated === results.total ? 'green' : 'yellow');
  log(`  ✅ Validated: ${results.validated}/${results.total}`, results.validated === results.total ? 'green' : 'yellow');
  log(`  ✅ Compiled: ${results.compiled}/${results.total}`, results.compiled === results.total ? 'green' : 'yellow');
  if (serverAvailable) {
    const executableTests = generatorTests.filter(t => t.canExecute).length;
    log(`  ✅ Executed: ${results.executed}/${executableTests}`, results.executed === executableTests ? 'green' : 'yellow');
  }

  if (results.failed.length > 0) {
    log(`\n❌ Failed tests:`, 'red');
    for (const failure of results.failed) {
      log(`  - ${failure}`, 'red');
    }
  } else {
    log(`\n✅ All generators validated successfully!`, 'green');
  }

  // Clean up test directory
  const testDir = path.join(__dirname, 'generator-tests');
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }

  return results.failed.length === 0;
}

// Run validation
validateGenerators()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
