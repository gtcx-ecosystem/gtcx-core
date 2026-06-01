#!/usr/bin/env node
/**
 * Publish @gtcx/* packages with npm provenance (SLSA).
 *
 * Changesets invokes `pnpm publish`, which does not attach npm registry attestations
 * on pnpm 9.x. This script uses `pnpm pack` + `npm publish --provenance` instead.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { registryAttestationStatus } from './npm-provenance-utils.mjs';
import { PUBLIC_PACKAGE_DIRS } from './public-packages.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const MANIFEST_PATH = join(ROOT, 'artifacts', 'npm-publish-manifest.json');

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

function publishOne(shortName) {
  const { dir, name, version } = readLocalPackage(shortName);
  const status = registryAttestationStatus(name, version);

  if (status.state === 'ok') {
    console.log(`skip ${name}@${version} (already on npm with provenance)`);
    return { published: false, skipped: true, name, version, shortName };
  }

  if (status.state === 'missing') {
    throw new Error(
      `${name}@${version} is already on npm without provenance attestations. ` +
        'Bump the package version (changeset), commit, push, then re-run release.'
    );
  }

  if (status.state === 'error') {
    throw new Error(`npm registry lookup failed for ${name}@${version}: ${status.message}`);
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

  return { published: true, skipped: false, name, version, shortName };
}

function writeManifest(rows) {
  mkdirSync(join(ROOT, 'artifacts'), { recursive: true });
  const published = rows.filter((row) => row.published);
  writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        published,
        skipped: rows.filter((row) => row.skipped),
      },
      null,
      2
    ) + '\n'
  );
  console.log(`Wrote publish manifest: ${MANIFEST_PATH}`);
}

function main() {
  const rows = [];

  for (const shortName of publishOrder()) {
    rows.push(publishOne(shortName));
  }

  writeManifest(rows);

  const published = rows.filter((row) => row.published);
  const skipped = rows.filter((row) => row.skipped);

  if (published.length === 0 && skipped.length === 0) {
    console.error('No packages processed.');
    process.exit(1);
  }

  if (published.length === 0) {
    console.error(
      'No packages published (all skipped with existing provenance). ' +
        'If you expected a republish, bump versions first.'
    );
    process.exit(1);
  }

  console.log(
    `Published ${published.length} package(s) with npm provenance` +
      (skipped.length > 0 ? `; skipped ${skipped.length} already attested.` : '.')
  );
}

main();
