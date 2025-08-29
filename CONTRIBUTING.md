# Contributing to valkey-glidejs-mcp

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification. This leads to more readable messages that are easy to follow when looking through the project history and enables automatic changelog generation.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies

### Examples

```bash
# Feature
feat(generators): add support for cluster transactions

# Bug fix
fix(migrate): correct geoadd migration to use Map format

# Breaking change
feat!: change API to use Map for geo operations

BREAKING CHANGE: geoadd now requires a Map instead of an object

# Documentation
docs(readme): update installation instructions

# Chore
chore(deps): update dependencies
```

### Scope

The scope should be the name of the module affected (e.g., `migrate`, `generators`, `verify`, `api`).

### Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end

### Version Bumping

Based on your commit types, versions will be automatically bumped:

- `fix:` → Patch release (0.0.X)
- `feat:` → Minor release (0.X.0)
- `feat!:` or `BREAKING CHANGE:` → Major release (X.0.0)

## Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes
4. Commit using conventional commits
5. Push to your fork
6. Open a Pull Request

## Testing

Before submitting a PR, ensure:

- All tests pass: `npm test`
- Code is properly formatted: `npm run format`
- TypeScript compiles: `npm run build`

## Release Process

Releases are automated via GitHub Actions:

1. Commits to `main` trigger version bump based on conventional commits
2. A new tag triggers changelog generation and GitHub release creation
3. The release triggers automatic npm publication
