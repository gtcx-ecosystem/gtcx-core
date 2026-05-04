#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const packagesDir = path.join(rootDir, 'packages');

const importRegexes = [
  /\bimport\s+(?:type\s+)?(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g,
  /\bexport\s+(?:type\s+)?(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g,
  /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
];

const forbiddenImports = {
  '@gtcx/types': ['@gtcx/*'],
  '@gtcx/crypto': [
    '@gtcx/domain',
    '@gtcx/services',
    '@gtcx/verification',
    '@gtcx/security',
    '@gtcx/workproof',
    '@gtcx/sync',
    '@gtcx/api-client',
    '@gtcx/connectivity',
    '@gtcx/events',
  ],
  '@gtcx/domain': [
    '@gtcx/services',
    '@gtcx/workproof',
    '@gtcx/api-client',
    '@gtcx/connectivity',
    '@gtcx/sync',
  ],
  '@gtcx/security': [
    '@gtcx/services',
    '@gtcx/workproof',
    '@gtcx/api-client',
    '@gtcx/connectivity',
    '@gtcx/sync',
    '@gtcx/domain',
  ],
  '@gtcx/verification': [
    '@gtcx/services',
    '@gtcx/domain',
    '@gtcx/security',
    '@gtcx/workproof',
    '@gtcx/sync',
    '@gtcx/api-client',
    '@gtcx/connectivity',
  ],
};

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listFilesRecursively(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'dist' || entry.name === 'node_modules') continue;
      listFilesRecursively(fullPath, out);
      continue;
    }
    if (!/\.(ts|tsx|js|jsx)$/.test(entry.name)) continue;
    if (/(\.test|\.spec)\.(ts|tsx|js|jsx)$/.test(entry.name)) continue;
    out.push(fullPath);
  }
  return out;
}

function getWorkspaceImportBase(specifier) {
  if (!specifier.startsWith('@gtcx/')) return null;
  const parts = specifier.split('/');
  if (parts.length < 2) return null;
  return `${parts[0]}/${parts[1]}`;
}

function computeLineNumber(contents, index) {
  return contents.slice(0, index).split('\n').length;
}

const packageDirs = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(packagesDir, entry.name))
  .filter((dir) => fs.existsSync(path.join(dir, 'package.json')));

const packagesByName = new Map();
const allowedDepsByPackage = new Map();
const sourceFilesByPackage = new Map();

for (const pkgDir of packageDirs) {
  const pkgJson = readJson(path.join(pkgDir, 'package.json'));
  const pkgName = pkgJson.name;
  if (typeof pkgName !== 'string') continue;

  packagesByName.set(pkgName, { dir: pkgDir, json: pkgJson });

  const allowed = new Set([
    pkgName,
    ...Object.keys(pkgJson.dependencies ?? {}),
    ...Object.keys(pkgJson.peerDependencies ?? {}),
    ...Object.keys(pkgJson.devDependencies ?? {}),
    ...Object.keys(pkgJson.optionalDependencies ?? {}),
  ]);
  allowedDepsByPackage.set(pkgName, allowed);

  const srcDir = path.join(pkgDir, 'src');
  const files = listFilesRecursively(srcDir);
  sourceFilesByPackage.set(pkgName, files);
}

const violations = [];

for (const [pkgName, files] of sourceFilesByPackage.entries()) {
  const allowedDeps = allowedDepsByPackage.get(pkgName);
  const forbidden = forbiddenImports[pkgName] ?? [];

  for (const filePath of files) {
    const contents = fs.readFileSync(filePath, 'utf8');

    for (const regex of importRegexes) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(contents)) !== null) {
        const specifier = match[1];
        const baseImport = getWorkspaceImportBase(specifier);
        if (!baseImport) continue;

        const line = computeLineNumber(contents, match.index);
        const relFile = toPosix(path.relative(rootDir, filePath));

        if (specifier.includes('/src/')) {
          violations.push(
            `${relFile}:${line} imports internal source path "${specifier}" (use package exports)`
          );
          continue;
        }

        if (baseImport === pkgName) continue;
        if (!packagesByName.has(baseImport)) continue;

        if (!allowedDeps.has(baseImport)) {
          violations.push(
            `${relFile}:${line} imports "${baseImport}" but it is not declared in package.json`
          );
          continue;
        }

        const isForbidden = forbidden.some((rule) => rule === '@gtcx/*' || rule === baseImport);
        if (isForbidden) {
          violations.push(
            `${relFile}:${line} imports "${baseImport}" which violates boundary rules for ${pkgName}`
          );
        }
      }
    }
  }
}

if (violations.length > 0) {
  console.error(`Architecture boundary check failed (${violations.length} violation(s)):\n`);
  for (const violation of violations.sort()) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(
  `Architecture boundary check passed (${sourceFilesByPackage.size} packages, ${[...sourceFilesByPackage.values()].reduce((sum, files) => sum + files.length, 0)} source files).`
);
