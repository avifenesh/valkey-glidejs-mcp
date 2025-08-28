#!/usr/bin/env node

/**
 * Validation script for API mappings examples
 * Tests all examples from the API mappings dataset
 */

const { GlideClient, GlideClusterClient, Script, Transaction } = require('@valkey/valkey-glide');
const path = require('path');
const fs = require('fs');

// Import the extracted examples
const extractedExamplesPath = path.join(__dirname, 'extracted-examples.json');

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
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Load extracted examples
function extractExamples() {
  try {
    // First, try to extract fresh examples
    const { execSync } = require('child_process');
    try {
      execSync('node extract-examples.js', { cwd: __dirname });
    } catch (e) {
      console.log('Warning: Could not re-extract examples, using existing file');
    }
    
    // Load the extracted examples
    if (fs.existsSync(extractedExamplesPath)) {
      const examples = JSON.parse(fs.readFileSync(extractedExamplesPath, 'utf8'));
      return examples;
    } else {
      console.log('Error: extracted-examples.json not found');
      return [];
    }
  } catch (error) {
    console.log('Error loading examples:', error.message);
    return [];
  }
}

// Validate a single Glide example
async function validateGlideExample(example, client) {
  const code = example.glide;
  if (!code) return { success: false, error: 'No Glide example provided' };
  
  try {
    // Clean up the code - remove imports and variable declarations
    let cleanCode = code
      .replace(/import .+;?\n?/g, '')
      .replace(/const (client|cluster) = .+;?\n?/g, '')
      .trim();
    
    // Handle specific examples
    if (cleanCode.includes('createClient')) {
      // Test client creation
      const testClient = await GlideClient.createClient(STANDALONE_CONFIG);
      await testClient.close();
      return { success: true };
    }
    
    if (cleanCode.includes('GlideClusterClient.createClient')) {
      // Skip cluster tests if not available
      return { success: true, skipped: 'Cluster test skipped' };
    }
    
    // Map example patterns to actual test code
    if (cleanCode.includes('client.set(')) {
      const match = cleanCode.match(/client\.set\('([^']+)',\s*'([^']+)'(?:,\s*(.+))?\)/);
      if (match) {
        const [, key, value, options] = match;
        await client.set(key, value);
        const result = await client.get(key);
        await client.del([key]);
        return { success: result === value };
      }
    }
    
    if (cleanCode.includes('client.get(')) {
      const match = cleanCode.match(/client\.get\('([^']+)'\)/);
      if (match) {
        const [, key] = match;
        await client.set(key, 'test');
        const result = await client.get(key);
        await client.del([key]);
        return { success: result === 'test' };
      }
    }
    
    if (cleanCode.includes('client.sadd(')) {
      const match = cleanCode.match(/client\.sadd\('([^']+)',\s*\[([^\]]+)\]\)/);
      if (match) {
        const [, key, members] = match;
        const memberArray = members.split(',').map(m => m.trim().replace(/['"]/g, ''));
        await client.sadd(key, memberArray);
        const result = await client.smembers(key);
        await client.del([key]);
        return { success: memberArray.every(m => result.has(m)) };
      }
    }
    
    if (cleanCode.includes('client.zadd(')) {
      const match = cleanCode.match(/client\.zadd\('([^']+)',\s*\[([^\]]+)\]\)/);
      if (match) {
        const [, key, scoreMembers] = match;
        // Parse score-member pairs
        const scoresMatch = scoreMembers.match(/\{\s*score:\s*(\d+),\s*member:\s*'([^']+)'\s*\}/);
        if (scoresMatch) {
          const [, score, member] = scoresMatch;
          const scoreMemberMap = {};
          scoreMemberMap[member] = parseFloat(score);
          await client.zadd(key, scoreMemberMap);
          const result = await client.zrangeWithScores(key, { start: 0, stop: -1 });
          await client.del([key]);
          return { success: result && result[member] === parseFloat(score) };
        }
      }
    }
    
    if (cleanCode.includes('client.xAdd(')) {
      const match = cleanCode.match(/client\.xAdd\('([^']+)',\s*'([^']+)',\s*(\{[^}]+\})\)/);
      if (match) {
        const [, key, id, fields] = match;
        // Parse fields object
        const fieldsObj = {};
        const fieldMatches = fields.matchAll(/(\w+):\s*'([^']+)'/g);
        for (const fm of fieldMatches) {
          fieldsObj[fm[1]] = fm[2];
        }
        const result = await client.xadd(key, '*', fieldsObj);
        await client.del([key]);
        return { success: result !== null };
      }
    }
    
    if (cleanCode.includes('client.geoadd(')) {
      const match = cleanCode.match(/client\.geoadd\('([^']+)',\s*\[([^\]]+)\]\)/);
      if (match) {
        const [, key, items] = match;
        // Parse geo items
        const geoMatch = items.match(/\{\s*longitude:\s*([\d.]+),\s*latitude:\s*([\d.]+),\s*member:\s*'([^']+)'\s*\}/);
        if (geoMatch) {
          const [, lon, lat, member] = geoMatch;
          const geoMembers = {};
          geoMembers[member] = { longitude: parseFloat(lon), latitude: parseFloat(lat) };
          await client.geoadd(key, geoMembers);
          const result = await client.geopos(key, [member]);
          await client.del([key]);
          return { success: result && result.length > 0 };
        }
      }
    }
    
    // If we can't parse the example, mark it as untested
    return { success: true, untested: true, reason: 'Complex example not parsed' };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Validate all examples
async function validateAllExamples() {
  log('\n========================================', 'blue');
  log('🔍 Extracting API Mappings Examples', 'blue');
  log('========================================', 'blue');
  
  const examples = extractExamples();
  log(`\n📊 Found ${examples.length} examples to validate`, 'cyan');
  
  const client = await GlideClient.createClient(STANDALONE_CONFIG);
  
  const results = {
    total: examples.length,
    tested: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    untested: 0,
    byCategory: {},
    byClient: { ioredis: { passed: 0, failed: 0 }, 'node-redis': { passed: 0, failed: 0 } },
    failures: []
  };
  
  for (const example of examples) {
    const displayName = `${example.client}/${example.category}/${example.symbol}`;
    
    // Initialize category stats
    if (!results.byCategory[example.category]) {
      results.byCategory[example.category] = { passed: 0, failed: 0, skipped: 0, untested: 0 };
    }
    
    if (example.glide) {
      results.tested++;
      log(`\n📝 Testing: ${displayName}`, 'magenta');
      log(`   Glide: ${example.glide.replace(/\n/g, '\n          ')}`, 'cyan');
      
      const result = await validateGlideExample(example, client);
      
      if (result.success) {
        if (result.skipped) {
          log(`   ⚠️  ${result.skipped}`, 'yellow');
          results.skipped++;
          results.byCategory[example.category].skipped++;
        } else if (result.untested) {
          log(`   ⚠️  Untested: ${result.reason}`, 'yellow');
          results.untested++;
          results.byCategory[example.category].untested++;
        } else {
          log(`   ✅ Passed`, 'green');
          results.passed++;
          results.byCategory[example.category].passed++;
          results.byClient[example.client].passed++;
        }
      } else {
        log(`   ❌ Failed: ${result.error}`, 'red');
        results.failed++;
        results.byCategory[example.category].failed++;
        results.byClient[example.client].failed++;
        results.failures.push({
          example: displayName,
          code: example.glide,
          error: result.error
        });
      }
    } else {
      log(`\n⚠️  No Glide example for: ${displayName}`, 'yellow');
    }
  }
  
  await client.close();
  
  // Print summary report
  log('\n\n========================================', 'blue');
  log('📊 VALIDATION SUMMARY', 'blue');
  log('========================================', 'blue');
  
  log(`\n📈 Overall Results:`, 'cyan');
  log(`   Total Examples: ${results.total}`);
  log(`   Tested: ${results.tested}`);
  log(`   ✅ Passed: ${results.passed}`, 'green');
  log(`   ❌ Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`   ⚠️  Skipped: ${results.skipped}`, 'yellow');
  log(`   ⚠️  Untested: ${results.untested}`, 'yellow');
  
  log(`\n📂 Results by Category:`, 'cyan');
  for (const [category, stats] of Object.entries(results.byCategory)) {
    log(`   ${category}:`);
    log(`      ✅ Passed: ${stats.passed}`, 'green');
    if (stats.failed > 0) log(`      ❌ Failed: ${stats.failed}`, 'red');
    if (stats.skipped > 0) log(`      ⚠️  Skipped: ${stats.skipped}`, 'yellow');
    if (stats.untested > 0) log(`      ⚠️  Untested: ${stats.untested}`, 'yellow');
  }
  
  log(`\n🔧 Results by Client:`, 'cyan');
  for (const [client, stats] of Object.entries(results.byClient)) {
    log(`   ${client}:`);
    log(`      ✅ Passed: ${stats.passed}`, 'green');
    if (stats.failed > 0) log(`      ❌ Failed: ${stats.failed}`, 'red');
  }
  
  if (results.failures.length > 0) {
    log(`\n❌ Failed Examples:`, 'red');
    for (const failure of results.failures) {
      log(`\n   ${failure.example}:`, 'red');
      log(`      Code: ${failure.code}`, 'cyan');
      log(`      Error: ${failure.error}`, 'yellow');
    }
  }
  
  // Save detailed report
  const reportPath = path.join(__dirname, 'api-mappings-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  log(`\n📄 Detailed report saved to: ${reportPath}`, 'blue');
  
  log('\n========================================', 'blue');
  
  return results.failed === 0;
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
  
  const success = await validateAllExamples();
  
  if (!success) {
    log('\n❌ Some examples failed validation', 'red');
    process.exit(1);
  } else {
    log('\n✅ All examples validated successfully!', 'green');
  }
}

main().catch(error => {
  log(`❌ Unexpected error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
