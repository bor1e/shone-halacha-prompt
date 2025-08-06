#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get git information
const { execSync } = require('child_process');
let commitHash = 'unknown';
let buildDate = new Date().toISOString().split('T')[0];

try {
  commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (error) {
  console.warn('Could not get git commit hash:', error.message);
}

// Generate version info
const versionInfo = {
  version: packageJson.version,
  buildDate: buildDate,
  commitHash: commitHash,
  environment: process.env.NODE_ENV || 'development'
};

// Create the version file
const versionFilePath = path.join(__dirname, '..', 'src', 'app', 'version.ts');
const versionFileContent = `// This file is auto-generated. Do not edit manually.
export const VERSION_INFO = ${JSON.stringify(versionInfo, null, 2)};
`;

fs.writeFileSync(versionFilePath, versionFileContent);

console.log('Version info generated:', versionInfo); 