# Release Process

This project uses **manual tag-based releases** instead of automatic version bumping.

## Manual Release Steps

### 1. Update Version
```bash
# Update package.json version manually
npm version patch|minor|major --no-git-tag-version
```

### 2. Update Documentation
```bash
# Update CHANGELOG.md with new version details
# Update README.md if needed
git add .
git commit -m "chore: prepare release v0.7.1"
```

### 3. Create and Push Tag
```bash
# Create annotated tag
git tag -a v0.7.1 -m "v0.7.1 - Release Title

• Feature 1
• Feature 2  
• Bug fixes"

# Push commits and tag
git push origin main
git push origin v0.7.1
```

## What Happens Automatically

When you push a tag matching `v*.*.*` pattern:

1. **CI Tests** (`ci-publish.yml`):
   - Runs tests on Node 18.x, 20.x
   - Publishes to npm if tests pass

2. **Release Creation** (`changelog.yml`):
   - Generates GitHub release with changelog
   - Updates CHANGELOG.md automatically
   - Includes installation and MCP configuration instructions

## Tag Format

- Use semantic versioning: `v1.2.3`
- Include meaningful tag messages
- Tag message should include release highlights

## Emergency Releases

For urgent fixes, use workflow dispatch:
```bash
# Trigger manual publish without tag
# Go to GitHub Actions → "CI and Publish to npm" → "Run workflow"
# Set "Publish to npm after tests" to "true"
```

## Workflow Status

- ✅ **CI** (`ci.yml`) - Runs on PRs and pushes to main
- ✅ **Publish** (`ci-publish.yml`) - Triggers on tags and manual dispatch  
- ✅ **Changelog** (`changelog.yml`) - Triggers on tags
- ❌ **Version Bump** (`version-bump.yml`) - **DISABLED** (manual only)