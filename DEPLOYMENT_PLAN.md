# MCP Server Deployment Plan - v0.1.1

## Phase 1: Pre-Deployment Testing Plan

### 1.1 Test MCP Server Code Generation
- [ ] Start MCP server locally
- [ ] Use each generator tool to create code
- [ ] Test migration from ioredis sample
- [ ] Test migration from node-redis sample
- [ ] Verify all 44 tools work correctly

### 1.2 Validate Generated Code Execution
- [ ] Set up local Valkey/Redis server
- [ ] Create test script with generated code
- [ ] Test basic operations (get, set, del)
- [ ] Test data structures (lists, sets, hashes)
- [ ] Test pub/sub functionality
- [ ] Test transactions
- [ ] Verify cluster client code

### 1.3 Integration Testing
- [ ] Test with actual @valkey/valkey-glide package
- [ ] Verify all imports resolve correctly
- [ ] Check TypeScript compilation of generated code
- [ ] Run generated code against Valkey server

## Phase 2: Repository Preparation

### 2.1 Clean Repository
- [ ] Remove test artifacts and temporary files
- [ ] Clean validation test files
- [ ] Remove generated reports from tracking
- [ ] Clean node_modules if needed

### 2.2 Configure .gitignore
```
node_modules/
dist/
*.log
*.tmp
.env
.DS_Store
coverage/
*.tgz
test-results/
validation-reports/
api-coverage-report.json
behavior-differences.json
glide-api-inventory.json
```

### 2.3 Configure .npmignore
```
# Source files
src/
scripts/
test/
examples-validation/

# Development files
*.ts
!*.d.ts
tsconfig.json
.gitignore
.npmignore

# Documentation and reports
*.md
!README.md
validation-reports/
test-results/
VALIDATION_REPORT.*
COMPREHENSIVE_VALIDATION_REPORT.*
DEPLOYMENT_PLAN.*
FINAL_VALIDATION_REPORT.*

# Git and CI
.git/
.github/

# Temporary files
*.tmp
*.log
.DS_Store
```

## Phase 3: Version and Release

### 3.1 Update Version
- [ ] Ensure package.json has version 0.1.1
- [ ] Update CHANGELOG if exists
- [ ] Commit all changes

### 3.2 Git Operations
```bash
# Stage all changes
git add .

# Commit
git commit -m "feat: Complete GLIDE API coverage with comprehensive mappings

- 100% API coverage for all 588 GLIDE methods
- Comprehensive migration mappings from ioredis/node-redis
- Fixed migration tools to use correct GlideClient API
- Added behavior difference documentation
- Validated all code generators produce valid TypeScript"

# Create tag
git tag -a v0.1.1 -m "Release v0.1.1: Complete API coverage"

# Push to main
git push origin main

# Push tag
git push origin v0.1.1
```

### 3.3 NPM Publication
```bash
# Build the package
npm run build

# Test the package locally
npm pack
npm install -g valkey-glidejs-mcp-0.1.1.tgz

# Publish to npm
npm publish
```

## Phase 4: Post-Deployment Validation

### 4.1 Test from NPM
```bash
# Install from npm
npm install -g valkey-glidejs-mcp

# Test the server starts
valkey-glidejs-mcp

# Test with MCP client
```

### 4.2 Validate Generated Code Works
- [ ] Generate sample code using deployed version
- [ ] Create test project with generated code
- [ ] Verify it compiles and runs
- [ ] Test against actual Valkey server

## Testing Scripts

### Test Script 1: Basic Operations
```typescript
import { GlideClient } from '@valkey/valkey-glide';

async function testBasicOps() {
  const client = await GlideClient.createClient({
    addresses: [{ host: 'localhost', port: 6379 }]
  });

  // Test string operations
  await client.set('test:key', 'value');
  const value = await client.get('test:key');
  console.assert(value === 'value', 'String ops failed');

  // Test hash operations
  await client.hset('test:hash', 'field', 'value');
  const hval = await client.hget('test:hash', 'field');
  console.assert(hval === 'value', 'Hash ops failed');

  // Cleanup
  await client.del('test:key', 'test:hash');
  console.log('✅ Basic operations test passed');
}
```

### Test Script 2: Migration Validation
```typescript
// Original ioredis code
import Redis from 'ioredis';
const redis = new Redis();
await redis.set('key', 'value');

// Should migrate to:
import { GlideClient } from '@valkey/valkey-glide';
const client = await GlideClient.createClient({
  addresses: [{ host: 'localhost', port: 6379 }]
});
await client.set('key', 'value');
```

## Success Criteria

✅ All 44 MCP tools respond correctly
✅ Generated code compiles without errors
✅ Generated code executes against Valkey
✅ Migration tools produce working code
✅ Package installs cleanly from npm
✅ No test files or artifacts in published package
✅ Package size is reasonable (<1MB)

## Rollback Plan

If issues are found:
1. `npm unpublish valkey-glidejs-mcp@0.1.1` (within 72 hours)
2. Fix issues
3. Bump to v0.1.2
4. Re-test and re-deploy

## Timeline

- Phase 1: 30 minutes (testing)
- Phase 2: 15 minutes (preparation)
- Phase 3: 10 minutes (deployment)
- Phase 4: 20 minutes (validation)
- **Total: ~75 minutes**