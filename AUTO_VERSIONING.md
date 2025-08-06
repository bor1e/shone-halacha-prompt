# Auto-Versioning with Conventional Commits

This project uses [semantic-release](https://semantic-release.gitbook.io/) to automatically version and release based on conventional commits.

## How It Works

1. **Conventional Commits**: All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
2. **Automatic Versioning**: When merged to `main`, semantic-release analyzes commit messages and determines the next version
3. **Automatic Releases**: Creates GitHub releases with changelogs and tags

## Commit Types

| Type | Description | Version Impact |
|------|-------------|----------------|
| `feat` | New features | Minor version bump |
| `fix` | Bug fixes | Patch version bump |
| `docs` | Documentation changes | No version bump |
| `style` | Code style changes (formatting, etc.) | No version bump |
| `refactor` | Code refactoring | No version bump |
| `perf` | Performance improvements | Patch version bump |
| `test` | Adding or updating tests | No version bump |
| `build` | Build system changes | No version bump |
| `ci` | CI/CD changes | No version bump |
| `chore` | Maintenance tasks | No version bump |
| `revert` | Reverting previous commits | Patch version bump |

## Breaking Changes

To indicate a breaking change, add `!:` after the type and scope:

```
feat!: breaking change description
fix(scope)!: breaking change description
```

This will trigger a major version bump.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup Husky hooks:
   ```bash
   npm run setup-husky
   ```

3. Make your first conventional commit:
   ```bash
   git add .
   git commit -m "feat: add auto-versioning system"
   ```

## Workflow

1. **Development**: Work on feature branches
2. **Commits**: Use conventional commit format
3. **Merge**: When merged to `main`, semantic-release:
   - Analyzes commits since last release
   - Determines next version
   - Creates GitHub release
   - Updates package.json
   - Generates changelog
   - Deploys to Firebase

## Examples

### Feature
```bash
git commit -m "feat: add WhatsApp export functionality"
```

### Bug Fix
```bash
git commit -m "fix: resolve WhatsApp formatting issues"
```

### Breaking Change
```bash
git commit -m "feat!: change API response format"
```

### With Scope
```bash
git commit -m "fix(whatsapp): handle nested formatting correctly"
```

### With Body
```bash
git commit -m "feat: add new language support

- Add French language support
- Add Hebrew language support
- Update translation files"
```

## Configuration Files

- `.releaserc.json`: Semantic-release configuration
- `commitlint.config.js`: Commit message validation rules
- `.husky/`: Git hooks for validation
- `.github/workflows/firebase-hosting-merge.yml`: CI/CD workflow

## Troubleshooting

### Skip Commit Validation
```bash
git commit --no-verify -m "your message"
```

### Skip Release
Add `[skip ci]` to commit message:
```bash
git commit -m "docs: update README [skip ci]"
```

### Manual Release
```bash
npm run semantic-release
``` 