#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Try to get version from semantic-release environment variables first (CI/CD)
let version = packageJson.version;
if (process.env.SEMANTIC_RELEASE_VERSION) {
    version = process.env.SEMANTIC_RELEASE_VERSION;
    console.log('Using version from semantic-release:', version);
} else {
    // Try to get version from git tags (semantic versioning)
    try {
        // Get the latest git tag
        const latestTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
        if (latestTag) {
            // Remove 'v' prefix if present
            version = latestTag.replace(/^v/, '');
            console.log('Using version from git tag:', version);
        }
    } catch (error) {
        console.log('No git tags found, using package.json version:', version);
    }
}

// Get git information
let commitHash = 'unknown';
let buildDate = new Date().toISOString().split('T')[0];

try {
    commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (error) {
    console.warn('Could not get git commit hash:', error.message);
}

// Generate version info
const versionInfo = {
    version: version,
    buildDate: buildDate,
    commitHash: commitHash
};

// Create the version file in environments folder
const versionFilePath = path.join(__dirname, '..', 'src', 'environments', 'version.ts');
const versionFileContent = `// This file is auto-generated during build. Do not edit manually.
export const VERSION_INFO = ${JSON.stringify(versionInfo, null, 2)};
`;

fs.writeFileSync(versionFilePath, versionFileContent);

console.log('Version info generated for build:', versionInfo); 