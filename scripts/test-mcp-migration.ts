#!/usr/bin/env tsx

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

/**
 * Test script to use our MCP server for migration
 */

async function testMCPMigration() {
  // Start our MCP server
  const transport = new StdioClientTransport({
    command: 'tsx',
    args: ['src/server.ts']
  });

  const client = new Client({
    name: 'migration-tester',
    version: '1.0.0'
  }, {
    capabilities: {}
  });

  try {
    await client.connect(transport);
    console.log('✅ Connected to MCP server');

    // Test cases from real-world patterns
    const testCases = [
      {
        name: 'Session Management',
        code: `
import Redis from 'ioredis';
const redis = new Redis();
await redis.setex('user:123', 3600, JSON.stringify({name: 'John'}));
const user = await redis.get('user:123');
        `
      },
      {
        name: 'Distributed Lock',
        code: `
import Redis from 'ioredis';
const redis = new Redis();
const result = await redis.set('lock:resource', 'value', 'PX', 5000, 'NX');
        `
      },
      {
        name: 'Pipeline Operations',
        code: `
import Redis from 'ioredis';
const redis = new Redis();
const pipeline = redis.pipeline();
pipeline.incr('counter');
pipeline.expire('counter', 60);
const results = await pipeline.exec();
        `
      },
      {
        name: 'Pub/Sub',
        code: `
import Redis from 'ioredis';
const redis = new Redis();
await redis.publish('channel', 'message');
redis.subscribe('channel');
        `
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n📝 Testing: ${testCase.name}`);
      
      try {
        const result = await client.callTool('migrate.naive', {
          from: 'ioredis',
          code: testCase.code
        });
        
        if (result.content && result.content[0]) {
          const migratedCode = result.content[0].text;
          console.log('✅ Migration successful');
          console.log('📄 Migrated code:');
          console.log(migratedCode.split('\n').slice(0, 10).map(line => `  ${line}`).join('\n'));
          
          // Check for expected GLIDE patterns
          const hasGlideImport = migratedCode.includes('@valkey/valkey-glide');
          const hasCreateClient = migratedCode.includes('createClient');
          
          console.log(`   Import: ${hasGlideImport ? '✅' : '❌'}`);
          console.log(`   Client: ${hasCreateClient ? '✅' : '❌'}`);
        } else {
          console.log('❌ No migration result returned');
        }
      } catch (error) {
        console.log(`❌ Migration failed: ${error}`);
      }
    }

  } catch (error) {
    console.error('❌ Failed to connect to MCP server:', error);
  } finally {
    await client.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testMCPMigration().catch(console.error);
}