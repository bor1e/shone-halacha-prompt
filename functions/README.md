# Shone Halacha Functions

This directory contains the Firebase Functions for the Shone Halacha application.

## Versioning

This package has its own semantic versioning system that operates independently from the main application.

### Commit Conventions

Use function-specific commit prefixes to trigger releases:

```bash
# Function features (minor version bump)
git commit -m "feat(functions): add advanced/concise prompt support"
git commit -m "feat(functions): implement new API endpoint"

# Function fixes (patch version bump)
git commit -m "fix(functions): resolve API timeout issue"
git commit -m "fix(functions): handle edge case in prompt generation"

# Function documentation (patch version bump)
git commit -m "docs(functions): update prompt documentation"

# Function refactoring (patch version bump)
git commit -m "refactor(functions): improve error handling"

# Breaking changes (major version bump)
git commit -m "feat(functions)!: breaking change description"
```

### Release Process

1. **Automatic Detection**: The CI/CD pipeline detects changes in the `functions/` directory
2. **Conditional Release**: Only releases functions when `functions/` files are modified
3. **Independent Versioning**: Functions can have different version numbers than the frontend
4. **GitHub Releases**: Creates separate releases for function changes

### Development

```bash
# Install dependencies
npm install

# Build functions
npm run build

# Run locally
npm run serve

# Deploy to Firebase
npm run deploy
```

### Configuration

- **Package Name**: `shone-halacha-functions`
- **Version**: Managed by semantic-release
- **Release Config**: `.releaserc.json`
- **Build Output**: `lib/` directory

### Dependencies

- **Firebase Functions**: Serverless backend
- **Google Generative AI**: AI processing
- **CORS**: Cross-origin support
- **TypeScript**: Type safety

### Environment Variables

- `GEMINI_KEY`: Google Gemini API key (required)
- `NODE_ENV`: Environment setting 