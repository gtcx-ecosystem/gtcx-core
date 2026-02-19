#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const packagesDir = path.join(rootDir, 'packages');
const baselinePath = path.join(rootDir, 'quality/api-surface-baseline.json');
const shouldUpdate = process.argv.includes('--update');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sha256(contents) {
  return crypto.createHash('sha256').update(contents).digest('hex');
}

function listPackageDirs() {
  return fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(packagesDir, entry.name))
    .filter((dir) => fs.existsSync(path.join(dir, 'package.json')));
}

function computeCurrentHashes() {
  const hashes = {};
  for (const pkgDir of listPackageDirs()) {
    const pkgJson = readJson(path.join(pkgDir, 'package.json'));
    const pkgName = pkgJson.name;
    const typesRel = pkgJson.types;
    if (!pkgName || !typesRel) continue;

    const typesAbs = path.join(pkgDir, typesRel);
    if (!fs.existsSync(typesAbs)) {
      throw new Error(
        `Missing type declaration for ${pkgName}: ${path.relative(rootDir, typesAbs)}. Run pnpm build first.`
      );
    }

    const raw = fs.readFileSync(typesAbs, 'utf8').replace(/\r\n/g, '\n');
    hashes[pkgName] = {
      hash: sha256(raw),
      typesPath: path.relative(rootDir, typesAbs),
    };
  }
  return hashes;
}

const current = computeCurrentHashes();

if (shouldUpdate) {
  fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
  fs.writeFileSync(
    baselinePath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        packages: current,
      },
      null,
      2
    )}\n`
  );
  console.log(`API surface baseline updated: ${path.relative(rootDir, baselinePath)}`);
  process.exit(0);
}

if (!fs.existsSync(baselinePath)) {
  console.error(
    `Missing API baseline file ${path.relative(rootDir, baselinePath)}. Run "pnpm api:update-baseline".`
  );
  process.exit(1);
}

const baseline = readJson(baselinePath).packages ?? {};
const changes = [];

for (const [pkg, currentInfo] of Object.entries(current)) {
  const baselineInfo = baseline[pkg];
  if (!baselineInfo) {
    changes.push(`${pkg}: new package in API surface snapshot`);
    continue;
  }
  if (baselineInfo.hash !== currentInfo.hash) {
    changes.push(`${pkg}: API hash changed (${baselineInfo.hash.slice(0, 12)} -> ${currentInfo.hash.slice(0, 12)})`);
  }
}

for (const pkg of Object.keys(baseline)) {
  if (!current[pkg]) {
    changes.push(`${pkg}: package missing from current API snapshot`);
  }
}

if (changes.length > 0) {
  console.error('API surface check failed:\n');
  for (const change of changes) {
    console.error(`- ${change}`);
  }
  console.error('\nIf changes are expected, run: pnpm api:update-baseline');
  process.exit(1);
}

console.log(`API surface check passed (${Object.keys(current).length} packages).`);
