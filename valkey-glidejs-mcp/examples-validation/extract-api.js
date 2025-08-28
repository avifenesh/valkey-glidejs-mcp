#!/usr/bin/env node

/**
 * Script to extract and analyze the actual API from @valkey/valkey-glide
 * This will help us validate our code generation patterns
 */

const fs = require('fs');
const path = require('path');

async function extractAPI() {
    console.log('=== Extracting @valkey/valkey-glide API ===\n');
    
    try {
        // Import the actual package
        const glide = require('@valkey/valkey-glide');
        
        console.log('Available exports from @valkey/valkey-glide:');
        console.log('-'.repeat(50));
        
        // List all exports
        for (const [key, value] of Object.entries(glide)) {
            const type = typeof value;
            if (type === 'function') {
                console.log(`  ${key}: [Function]`);
            } else if (type === 'object' && value !== null) {
                console.log(`  ${key}: [Object/Class]`);
            } else {
                console.log(`  ${key}: [${type}]`);
            }
        }
        
        console.log('\n' + '='.repeat(50));
        
        // Test creating clients to see their methods
        console.log('\nTesting GlideClient methods:');
        console.log('-'.repeat(50));
        
        // Create a dummy client to inspect methods
        const clientPrototype = glide.GlideClient.prototype;
        const methods = Object.getOwnPropertyNames(clientPrototype)
            .filter(name => typeof clientPrototype[name] === 'function' && name !== 'constructor')
            .sort();
            
        console.log('GlideClient instance methods:');
        methods.forEach(method => {
            console.log(`  - ${method}()`);
        });
        
        console.log('\n' + '='.repeat(50));
        
        // Check GlideClusterClient methods
        console.log('\nTesting GlideClusterClient methods:');
        console.log('-'.repeat(50));
        
        const clusterPrototype = glide.GlideClusterClient.prototype;
        const clusterMethods = Object.getOwnPropertyNames(clusterPrototype)
            .filter(name => typeof clusterPrototype[name] === 'function' && name !== 'constructor')
            .sort();
            
        console.log('GlideClusterClient instance methods:');
        clusterMethods.forEach(method => {
            console.log(`  - ${method}()`);
        });
        
        // Check for specific methods we use in our generators
        console.log('\n' + '='.repeat(50));
        console.log('\nValidating specific methods used in our generators:');
        console.log('-'.repeat(50));
        
        const methodsToCheck = [
            'sadd', 'sAdd',
            'zadd', 'zAdd',
            'hset', 'hSet',
            'lpush', 'lPush',
            'rpush', 'rPush',
            'set', 'get', 'del',
            'exec', 'customCommand'
        ];
        
        methodsToCheck.forEach(method => {
            const hasInClient = method in clientPrototype;
            const hasInCluster = method in clusterPrototype;
            console.log(`  ${method}: Client=${hasInClient}, Cluster=${hasInCluster}`);
        });
        
        // Check static methods
        console.log('\n' + '='.repeat(50));
        console.log('\nStatic methods:');
        console.log('-'.repeat(50));
        
        console.log('GlideClient static methods:');
        const clientStatics = Object.getOwnPropertyNames(glide.GlideClient)
            .filter(name => typeof glide.GlideClient[name] === 'function')
            .sort();
        clientStatics.forEach(method => {
            console.log(`  - GlideClient.${method}()`);
        });
        
        console.log('\nGlideClusterClient static methods:');
        const clusterStatics = Object.getOwnPropertyNames(glide.GlideClusterClient)
            .filter(name => typeof glide.GlideClusterClient[name] === 'function')
            .sort();
        clusterStatics.forEach(method => {
            console.log(`  - GlideClusterClient.${method}()`);
        });
        
    } catch (error) {
        console.error('Error extracting API:', error.message);
        console.error('\nMake sure @valkey/valkey-glide is installed:');
        console.error('  npm install @valkey/valkey-glide');
    }
}

// Run the extraction
extractAPI();
