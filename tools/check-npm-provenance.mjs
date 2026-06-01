#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { registryAttestationStatus } from './npm-provenance-utils.mjs';
import { PUBLIC_PACKAGE_DIRS } from './public-packages.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const strict = process.argv.includes('--strict');
const json = process.argv.includes('--json');
const manifestArg = process.argv.find((arg) => arg.startsWith('--manifest='));
const manifestPath = manifestArg?.slice('--manifest='.length);

function localVersion(shortName) {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'packages', shortName, 'package.json'), 'utf8'));
  return pkg.version;
}

function packagesToCheck() {
  if (manifestPath) {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    return manifest.published.map((row) => ({
      shortName: row.shortName,
      name: row.name,
      version: row.version,
    }));
  }

  return PUBLIC_PACKAGE_DIRS.map((shortName) => ({
    shortName,
    name: `@gtcx/${shortName}`,
    version: localVersion(shortName),
  }));
}

function viewAttestations(shortName, name, version) {
  const status = registryAttestationStatus(name, version);

  if (status.state === 'ok') {
    return {
      name,
      version,
      shortName,
      hasAttestation: true,
      attestations: status.attestations,
    };
  }

  if (status.state === 'not_published') {
    return {
      name,
      version,
      shortName,
      hasAttestation: false,
      notPublished: true,
    };
  }

  if (status.state === 'missing') {
    return {
      name,
      version,
      shortName,
      hasAttestation: false,
      attestations: status.attestations,
    };
  }

  return {
    name,
    version,
    shortName,
    hasAttestation: false,
    error: status.message,
  };
}

function main() {
  const targets = packagesToCheck();
  const results = targets.map(({ shortName, name, version }) =>
    viewAttestations(shortName, name, version)
  );
  const withAttestation = results.filter((r) => r.hasAttestation);
  const missing = results.filter((r) => !r.hasAttestation);
  const notPublished = missing.filter((r) => r.notPublished);

  if (json) {
    process.stdout.write(
      JSON.stringify(
        {
          total: results.length,
          with_attestation: withAttestation.length,
          missing: missing.map((r) => `${r.name}@${r.version}`),
          not_published: notPublished.map((r) => `${r.name}@${r.version}`),
          results,
        },
        null,
        2
      ) + '\n'
    );
  } else {
    console.log(
      `npm provenance: ${withAttestation.length}/${results.length} packages have registry attestations`
    );
    for (const row of results) {
      let status = row.hasAttestation ? 'OK' : 'MISSING';
      if (row.notPublished) {
        status = 'NOT_PUBLISHED';
      }
      console.log(`  [${status}] ${row.name}@${row.version}`);
    }
  }

  if (missing.length === 0) {
    console.log('All published packages have npm provenance attestations.');
    return;
  }

  if (notPublished.length > 0 && strict) {
    if (notPublished.length === results.length) {
      console.error(
        `All ${results.length} @gtcx/* packages are NOT_PUBLISHED at package.json versions yet. ` +
          'If the release workflow is still running, wait for the Publish step to finish (~20–25 min), ' +
          'then re-run: pnpm provenance:check-npm:strict'
      );
    } else {
      console.error(
        `${notPublished.length} package(s) are not on npm at the version in package.json. ` +
          'Publish step may have skipped or failed; do not treat verify as green.'
      );
    }
    process.exit(1);
  }

  const message =
    `${missing.length - notPublished.length} package(s) lack npm registry attestations at the version in package.json. ` +
    'Use `node ./tools/publish-packages-provenance.mjs` (pnpm publish --provenance). ' +
    'Requires id-token:write, repository in package.json, and a **public** GitHub source repo (private repos: npm E422).';

  if (strict) {
    console.error(message);
    process.exit(1);
  }

  console.warn(`WARN: ${message}`);
}

main();
