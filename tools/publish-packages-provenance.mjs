#!/usr/bin/env node
/**
 * Publish @gtcx/* packages with npm provenance (SLSA).
 *
 * Changesets invokes `pnpm publish`, which does not attach npm registry attestations
 * on pnpm 9.x. This script uses `pnpm pack` + `npm publish --provenance` instead.
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_PACKAGE_DIRS } from './public-packages.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');

function readLocalPackage(shortName) {
  const dir = join(ROOT, 'packages', shortName);
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  return { dir, name: pkg.name, version: pkg.version };
}

function localDependencies(shortName) {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'packages', shortName, 'package.json'), 'utf8'));
  const merged = {
    ...pkg.dependencies,
    ...pkg.peerDependencies,
    ...pkg.optionalDependencies,
  };
  return Object.keys(merged)
    .filter((dep) => dep.startsWith('@gtcx/'))
    .map((dep) => dep.slice('@gtcx/'.length))
    .filter((dep) => PUBLIC_PACKAGE_DIRS.includes(dep));
}

function publishOrder() {
  const order = [];
  const visited = new Set();

  const visit = (shortName) => {
    if (visited.has(shortName)) return;
    visited.add(shortName);
    for (const dep of localDependencies(shortName)) {
      visit(dep);
    }
    order.push(shortName);
  };

  for (const shortName of PUBLIC_PACKAGE_DIRS) {
    visit(shortName);
  }

  return order;
}

function npmVersionOnRegistry(packageName, version) {
  try {
    execSync(`npm view ${packageName}@${version} version`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return true;
  } catch {
    return false;
  }
}

function publishOne(shortName) {
  const { dir, name, version } = readLocalPackage(shortName);

  if (npmVersionOnRegistry(name, version)) {
    console.log(`skip ${name}@${version} (already on npm)`);
    return false;
  }

  console.log(`publish ${name}@${version} with npm provenance`);
  execSync('pnpm pack', { cwd: dir, stdio: 'inherit' });

  const tarball = readdirSync(dir).find((file) => file.endsWith('.tgz'));
  if (!tarball) {
    throw new Error(`pnpm pack produced no .tgz in ${dir}`);
  }

  const tarballPath = join(dir, tarball);
  try {
    execSync(`npm publish "${tarballPath}" --provenance --access public`, {
      cwd: dir,
      stdio: 'inherit',
      env: process.env,
    });
  } finally {
    if (existsSync(tarballPath)) {
      unlinkSync(tarballPath);
    }
  }

  return true;
}

function main() {
  let published = 0;

  for (const shortName of publishOrder()) {
    if (publishOne(shortName)) {
      published += 1;
    }
  }

  if (published === 0) {
    console.error(
      'No packages published. Run `pnpm version-packages`, commit bumps, push, then re-run release.'
    );
    process.exit(1);
  }

  console.log(`Published ${published} package(s) with npm provenance.`);
}

main();
