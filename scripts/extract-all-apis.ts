#!/usr/bin/env tsx
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface ApiMethod {
  name: string;
  file: string;
  category?: string;
  parameters?: string[];
  returnType?: string;
  isAsync?: boolean;
}

interface ApiInventory {
  baseClient: ApiMethod[];
  glideClient: ApiMethod[];
  glideClusterClient: ApiMethod[];
  commands: ApiMethod[];
  transaction: ApiMethod[];
  glideFt: ApiMethod[];
  glideJson: ApiMethod[];
  total: number;
}

function extractMethodsFromFile(filePath: string): ApiMethod[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const methods: ApiMethod[] = [];
  const fileName = path.basename(filePath, '.d.ts');

  function visit(node: ts.Node) {
    // Extract methods from interfaces and classes
    if (ts.isMethodSignature(node) || ts.isMethodDeclaration(node)) {
      const name = node.name?.getText(sourceFile);
      if (name) {
        const method: ApiMethod = {
          name,
          file: fileName,
          isAsync: false
        };

        // Check if return type is a Promise
        if (node.type) {
          const returnType = node.type.getText(sourceFile);
          method.returnType = returnType;
          method.isAsync = returnType.includes('Promise');
        }

        // Extract parameters
        method.parameters = node.parameters.map(p => 
          p.name.getText(sourceFile)
        );

        methods.push(method);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return methods;
}

function categorizeMethod(methodName: string): string {
  const categories: Record<string, string[]> = {
    'strings': ['get', 'set', 'mget', 'mset', 'del', 'exists', 'incr', 'decr', 'append', 'strlen'],
    'hashes': ['hget', 'hset', 'hmget', 'hmset', 'hdel', 'hexists', 'hkeys', 'hvals', 'hlen', 'hincrby'],
    'lists': ['lpush', 'rpush', 'lpop', 'rpop', 'llen', 'lrange', 'lindex', 'lset', 'ltrim', 'lrem'],
    'sets': ['sadd', 'srem', 'smembers', 'sismember', 'scard', 'sinter', 'sunion', 'sdiff'],
    'sortedsets': ['zadd', 'zrem', 'zrange', 'zrank', 'zscore', 'zcount', 'zincrby', 'zcard'],
    'geo': ['geoadd', 'geodist', 'geohash', 'geopos', 'georadius', 'geosearch'],
    'streams': ['xadd', 'xread', 'xlen', 'xrange', 'xdel', 'xgroup', 'xreadgroup', 'xack'],
    'pubsub': ['publish', 'subscribe', 'psubscribe', 'unsubscribe', 'punsubscribe'],
    'transactions': ['multi', 'exec', 'discard', 'watch', 'unwatch'],
    'scripting': ['eval', 'evalsha', 'script'],
    'connection': ['ping', 'echo', 'select', 'auth', 'quit'],
    'server': ['info', 'config', 'flushdb', 'flushall', 'dbsize', 'time'],
    'bitmap': ['setbit', 'getbit', 'bitcount', 'bitpos', 'bitop'],
    'hyperloglog': ['pfadd', 'pfcount', 'pfmerge'],
    'json': ['json.set', 'json.get', 'json.del', 'json.type', 'json.strlen']
  };

  const lowerName = methodName.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => lowerName.includes(kw))) {
      return category;
    }
  }
  return 'general';
}

async function main() {
  const apiDir = '/Users/avifen/valkey-glidejs-mcp/valkey-glidejs-mcp/examples-validation/api';
  const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.d.ts'));
  
  const inventory: ApiInventory = {
    baseClient: [],
    glideClient: [],
    glideClusterClient: [],
    commands: [],
    transaction: [],
    glideFt: [],
    glideJson: [],
    total: 0
  };

  console.log('Extracting GLIDE API methods from type definitions...\n');

  for (const file of files) {
    const filePath = path.join(apiDir, file);
    const methods = extractMethodsFromFile(filePath);
    
    // Categorize by file
    switch (file) {
      case 'BaseClient.d.ts':
        inventory.baseClient = methods;
        break;
      case 'GlideClient.d.ts':
        inventory.glideClient = methods;
        break;
      case 'GlideClusterClient.d.ts':
        inventory.glideClusterClient = methods;
        break;
      case 'Commands.d.ts':
        inventory.commands = methods;
        break;
      case 'Transaction.d.ts':
        inventory.transaction = methods;
        break;
      case 'GlideFt.d.ts':
        inventory.glideFt = methods;
        break;
      case 'GlideJson.d.ts':
        inventory.glideJson = methods;
        break;
    }

    console.log(`📄 ${file}: Found ${methods.length} methods`);
  }

  // Add categories to methods
  Object.values(inventory).forEach(methods => {
    if (Array.isArray(methods)) {
      methods.forEach(method => {
        method.category = categorizeMethod(method.name);
      });
    }
  });

  // Calculate total
  inventory.total = Object.values(inventory)
    .filter(v => Array.isArray(v))
    .reduce((sum, methods) => sum + methods.length, 0);

  console.log(`\n✅ Total GLIDE API methods extracted: ${inventory.total}`);

  // Save inventory
  const outputPath = '/Users/avifen/valkey-glidejs-mcp/valkey-glidejs-mcp/glide-api-inventory.json';
  fs.writeFileSync(outputPath, JSON.stringify(inventory, null, 2));
  console.log(`\n💾 API inventory saved to: ${outputPath}`);

  // Generate summary report
  console.log('\n📊 API Summary by File:');
  console.log('━'.repeat(50));
  console.log(`BaseClient:         ${inventory.baseClient.length} methods`);
  console.log(`GlideClient:        ${inventory.glideClient.length} methods`);
  console.log(`GlideClusterClient: ${inventory.glideClusterClient.length} methods`);
  console.log(`Commands:           ${inventory.commands.length} methods`);
  console.log(`Transaction:        ${inventory.transaction.length} methods`);
  console.log(`GlideFt:            ${inventory.glideFt.length} methods`);
  console.log(`GlideJson:          ${inventory.glideJson.length} methods`);
  console.log('━'.repeat(50));
  console.log(`TOTAL:              ${inventory.total} methods`);

  // Category breakdown
  const categoryCount: Record<string, number> = {};
  Object.values(inventory).forEach(methods => {
    if (Array.isArray(methods)) {
      methods.forEach(method => {
        categoryCount[method.category || 'uncategorized'] = 
          (categoryCount[method.category || 'uncategorized'] || 0) + 1;
      });
    }
  });

  console.log('\n📊 API Methods by Category:');
  console.log('━'.repeat(50));
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`${category.padEnd(15)} ${count} methods`);
    });

  return inventory;
}

if (import.meta.url.startsWith('file:')) {
  main().catch(console.error);
}

export { extractMethodsFromFile, categorizeMethod, ApiInventory, ApiMethod };