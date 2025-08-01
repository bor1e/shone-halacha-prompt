#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "🔧 Setting up Git hooks..."

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Create hooks directory if it doesn't exist
if [ ! -d ".git/hooks" ]; then
    mkdir -p .git/hooks
    print_status "Created .git/hooks directory"
fi

# Copy pre-push hook
if [ -f "scripts/hooks/pre-push" ]; then
    cp scripts/hooks/pre-push .git/hooks/pre-push
    chmod +x .git/hooks/pre-push
    print_status "Installed pre-push hook"
else
    print_error "pre-push hook not found in scripts/hooks/"
    exit 1
fi

print_status "Git hooks setup complete! 🎉"
echo ""
echo "The following hooks are now active:"
echo "  📝 pre-push: Runs linting, tests, and build checks before pushing"
echo ""
echo "You can also run quality checks manually with:"
echo "  npm run pre-push" 