#!/bin/bash

# Setup Husky hooks for conventional commits
echo "Setting up Husky hooks..."

# Install Husky
npx husky install

# Make sure the hooks are executable
chmod +x .husky/commit-msg
chmod +x .husky/pre-commit

echo "Husky hooks setup complete!"
echo "Now all commits will be validated for conventional commit format." 