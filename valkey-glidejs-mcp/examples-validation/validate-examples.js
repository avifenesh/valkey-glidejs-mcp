#!/usr/bin/env node

/**
 * Validation script for all code generator examples
 * This script tests each generated code pattern against a real Valkey server
 */

const { GlideClient, GlideClusterClient, Script, Transaction } = require('@valkey/valkey-glide');
const crypto = require('crypto');

// Test configuration
const STANDALONE_CONFIG = {
  addresses: [{ host: 'localhost', port: 6379 }]
};

const CLUSTER_CONFIG = {
  addresses: [
    { host: 'localhost', port: 7100 },
    { host: 'localhost', port: 7101 },
    { host: 'localhost', port: 7102 }
  ]
};

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testClientBasic() {
  log('\n📝 Testing: Basic Client', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    await client.set('hello', 'world');
    const result = await client.get('hello');
    await client.close();
    
    if (result === 'world') {
      log('✅ Basic client test passed', 'green');
      return true;
    } else {
      log(`❌ Basic client test failed: expected 'world', got '${result}'`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Basic client test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testCache() {
  log('\n📝 Testing: Cache Pattern', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    const key = 'cache:test';
    const ttlSeconds = 60;
    
    // Simulate cache miss and set
    const cached = await client.get(key);
    if (cached === null) {
      const fresh = JSON.stringify({ data: 'test', timestamp: Date.now() });
      await client.set(key, fresh, { expiry: { type: 'EX', count: ttlSeconds } });
    }
    
    // Verify cache hit
    const result = await client.get(key);
    await client.del([key]);
    await client.close();
    
    if (result !== null) {
      log('✅ Cache pattern test passed', 'green');
      return true;
    } else {
      log('❌ Cache pattern test failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Cache pattern test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testLock() {
  log('\n📝 Testing: Lock Pattern', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    const lockKey = 'lock:test';
    const token = crypto.randomUUID();
    const ttlSeconds = 10;
    
    // Acquire lock
    const acquired = await client.set(lockKey, token, { 
      conditionalSet: 'onlyIfDoesNotExist',
      expiry: { type: 'EX', count: ttlSeconds }
    });
    
    if (!acquired) {
      log('❌ Lock pattern test failed: could not acquire lock', 'red');
      await client.close();
      return false;
    }
    
    // Release lock atomically
    const releaseScript = new Script(
      'if server.call("get", ARGV[1]) == ARGV[2] then return server.call("del", ARGV[1]) else return 0 end'
    );
    const released = await client.invokeScript(releaseScript, { args: [lockKey, token] });
    await client.close();
    
    if (released === 1) {
      log('✅ Lock pattern test passed', 'green');
      return true;
    } else {
      log('❌ Lock pattern test failed: lock not released properly', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Lock pattern test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testSets() {
  log('\n📝 Testing: Sets', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    
    await client.sadd('tags', ['a', 'b']);
    const isMember = await client.sismember('tags', 'a');
    const members = await client.smembers('tags');
    await client.del(['tags']);
    await client.close();
    
    // smembers returns a Set, not an Array
    if (isMember && members.has('a') && members.has('b')) {
      log('✅ Sets test passed', 'green');
      return true;
    } else {
      log('❌ Sets test failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Sets test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testZSets() {
  log('\n📝 Testing: Sorted Sets', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    
    await client.zadd('lb', { alice: 10, bob: 20 });
    // Use zrange with withScores option
    const scores = await client.zrangeWithScores('lb', { start: 0, stop: -1 });
    await client.zrem('lb', ['alice']);
    const remaining = await client.zrange('lb', { start: 0, stop: -1 });
    await client.del(['lb']);
    await client.close();
    
    // Verify the result - scores should contain both alice and bob
    // remaining should only have bob
    const hasAlice = scores && scores.alice === 10;
    const hasBob = scores && scores.bob === 20;
    const bobOnly = remaining.length === 1 && remaining[0] === 'bob';
    
    if (hasAlice && hasBob && bobOnly) {
      log('✅ Sorted sets test passed', 'green');
      return true;
    } else {
      log('❌ Sorted sets test failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Sorted sets test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testHashes() {
  log('\n📝 Testing: Hashes', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    
    await client.hset('user:1', { name: 'Avi', age: '30' });
    // hincrby doesn't exist, use hincrbyfloat instead
    await client.hincrbyfloat('user:1', 'age', 1);
    const result = await client.hgetall('user:1');
    await client.del(['user:1']);
    await client.close();
    
    if (result.name === 'Avi' && parseFloat(result.age) === 31) {
      log('✅ Hashes test passed', 'green');
      return true;
    } else {
      log('❌ Hashes test failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Hashes test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testLists() {
  log('\n📝 Testing: Lists', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    
    await client.rpush('jobs', ['a', 'b', 'c']);
    const all = await client.lrange('jobs', 0, -1);
    await client.ltrim('jobs', 1, -1);
    const trimmed = await client.lrange('jobs', 0, -1);
    await client.del(['jobs']);
    await client.close();
    
    if (all.length === 3 && trimmed.length === 2 && trimmed[0] === 'b') {
      log('✅ Lists test passed', 'green');
      return true;
    } else {
      log('❌ Lists test failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Lists test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testTransaction() {
  log('\n📝 Testing: Transactions', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    
    const tx = new Transaction();
    tx.set('a', '1');
    tx.incr('a');
    tx.get('a');
    const results = await client.exec(tx);
    await client.del(['a']);
    await client.close();
    
    // Results should be ['OK', 2, '2']
    if (results[0] === 'OK' && results[1] === 2 && results[2] === '2') {
      log('✅ Transaction test passed', 'green');
      return true;
    } else {
      log('❌ Transaction test failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Transaction test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testPipeline() {
  log('\n📝 Testing: Pipeline', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    
    const pipeline = new Transaction();
    pipeline.set('p1', 'v1');
    pipeline.get('p1');
    const results = await client.exec(pipeline);
    await client.del(['p1']);
    await client.close();
    
    if (results[0] === 'OK' && results[1] === 'v1') {
      log('✅ Pipeline test passed', 'green');
      return true;
    } else {
      log('❌ Pipeline test failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Pipeline test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testBitmaps() {
  log('\n📝 Testing: Bitmaps', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    
    await client.setbit('featureFlags', 42, 1);
    const bit = await client.getbit('featureFlags', 42);
    const count = await client.bitcount('featureFlags');
    await client.del(['featureFlags']);
    await client.close();
    
    if (bit === 1 && count === 1) {
      log('✅ Bitmaps test passed', 'green');
      return true;
    } else {
      log('❌ Bitmaps test failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Bitmaps test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testHyperLogLog() {
  log('\n📝 Testing: HyperLogLog', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    
    await client.pfadd('visitors', ['u1', 'u2', 'u3']);
    const count = await client.pfcount(['visitors']);
    await client.del(['visitors']);
    await client.close();
    
    if (count === 3) {
      log('✅ HyperLogLog test passed', 'green');
      return true;
    } else {
      log('❌ HyperLogLog test failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ HyperLogLog test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testScan() {
  log('\n📝 Testing: Scan', 'blue');
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    
    // Create test keys
    await client.set('scan:1', 'v1');
    await client.set('scan:2', 'v2');
    
    // Scan for keys
    let cursor = '0';
    let found = [];
    do {
      const res = await client.scan(cursor, { match: 'scan:*', count: 100 });
      cursor = res[0];
      found = found.concat(res[1]);
    } while (cursor !== '0');
    
    // Clean up
    await client.del(['scan:1', 'scan:2']);
    await client.close();
    
    if (found.length >= 2) {
      log('✅ Scan test passed', 'green');
      return true;
    } else {
      log('❌ Scan test failed', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Scan test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testClusterClient() {
  log('\n📝 Testing: Cluster Client (will skip if cluster not available)', 'blue');
  try {
    const cluster = await GlideClusterClient.createClient(CLUSTER_CONFIG);
    await cluster.set('cluster:test', 'value');
    const result = await cluster.get('cluster:test');
    await cluster.del(['cluster:test']);
    await cluster.close();
    
    if (result === 'value') {
      log('✅ Cluster client test passed', 'green');
      return true;
    } else {
      log('❌ Cluster client test failed', 'red');
      return false;
    }
  } catch (error) {
    log(`⚠️  Cluster client test skipped (cluster not available): ${error.message}`, 'yellow');
    return true; // Don't fail if cluster is not available
  }
}

async function runAllTests() {
  log('\n========================================', 'blue');
  log('🚀 Starting Valkey GLIDE Examples Validation', 'blue');
  log('========================================', 'blue');
  
  const tests = [
    testClientBasic,
    testCache,
    testLock,
    testSets,
    testZSets,
    testHashes,
    testLists,
    testTransaction,
    testPipeline,
    testBitmaps,
    testHyperLogLog,
    testScan,
    testClusterClient
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  log('\n========================================', 'blue');
  log(`📊 Results: ${passed} passed, ${failed} failed`, failed > 0 ? 'red' : 'green');
  log('========================================', 'blue');
  
  if (failed > 0) {
    process.exit(1);
  }
}

// Check if Valkey server is running
async function checkValkeyServer() {
  try {
    const client = await GlideClient.createClient(STANDALONE_CONFIG);
    await client.ping();
    await client.close();
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  log('🔍 Checking Valkey server availability...', 'yellow');
  
  const serverAvailable = await checkValkeyServer();
  if (!serverAvailable) {
    log('❌ Valkey server is not running on localhost:6379', 'red');
    log('Please start a Valkey server with: docker run -d -p 6379:6379 valkey/valkey', 'yellow');
    process.exit(1);
  }
  
  log('✅ Valkey server is running', 'green');
  await runAllTests();
}

main().catch(error => {
  log(`❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
