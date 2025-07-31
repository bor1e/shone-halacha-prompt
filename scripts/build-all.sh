#!/bin/bash

# Build all language versions
echo "Building all language versions..."

# Clean previous builds
rm -rf dist/

# Build each language version
echo "Building German (default)..."
ng build --configuration production-de

echo "Building English..."
ng build --configuration production-en

echo "Building French..."
ng build --configuration production-fr

echo "Building Hebrew..."
ng build --configuration production-he

echo "Building Russian..."
ng build --configuration production-ru

echo "Build complete! All language versions are ready for deployment."
echo "Directory structure:"
ls -la dist/shone-halacha-prompting/

echo "Run 'firebase deploy --only hosting' to deploy to Firebase."