#!/bin/bash

# Build all language versions
echo "Building all language versions..."

# Build each language
npm run build:de
npm run build:en
npm run build:fr
npm run build:he
npm run build:ru

# Create the browser directory structure for Firebase hosting
echo "Organizing builds for Firebase hosting..."

# Create the main browser directory
mkdir -p dist/shone-halacha-prompting/browser

# Move each language build to the correct location
mv dist/shone-halacha-prompting/browser/de dist/shone-halacha-prompting/browser/
mv dist/shone-halacha-prompting/browser/en dist/shone-halacha-prompting/browser/
mv dist/shone-halacha-prompting/browser/fr dist/shone-halacha-prompting/browser/
mv dist/shone-halacha-prompting/browser/he dist/shone-halacha-prompting/browser/
mv dist/shone-halacha-prompting/browser/ru dist/shone-halacha-prompting/browser/

echo "Build complete! All language versions are ready for deployment."
echo "Run 'firebase deploy --only hosting' to deploy to Firebase." 