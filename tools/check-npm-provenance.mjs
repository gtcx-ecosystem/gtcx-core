#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_PACKAGE_DIRS } from './public-packages.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const strict = process.argv.includes('--strict');
const json = process.argv.includes('--json');

function localVersion(shortName) {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'packages', shortName, 'package.json'), 'utf8'));
  return pkg.version;
}

function viewAttestations(shortName) {
  const name = `@gtcx/${shortName}`;
  const version = localVersion(shortName);

  try {
    const out = execSync(`npm view ${name}@${version} --json`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const data = JSON.parse(out);
    const attestations = data.dist?.attestations;
    return {
      name,
      version,
      hasAttestation: Boolean(attestations?.url || attestations?.provenance),
      attestations: attestations ?? null,
    };
  } catch (error) {
    return {
      name,
      version,
      hasAttestation: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function main() {
  const results = PUBLIC_PACKAGE_DIRS.map(viewAttestations);
  const withAttestation = results.filter((r) => r.hasAttestation);
  const missing = results.filter((r) => !r.hasAttestation);

  if (json) {
    process.stdout.write(
      JSON.stringify(
        {
          total: results.length,
          with_attestation: withAttestation.length,
          missing: missing.map((r) => `${r.name}@${r.version}`),
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
      const status = row.hasAttestation ? 'OK' : 'MISSING';
      console.log(`  [${status}] ${row.name}@${row.version}`);
    }
  }

  if (missing.length === 0) {
    console.log('All published packages have npm provenance attestations.');
    return;
  }

  const message =
    `${missing.length} package(s) lack npm registry attestations at the version in package.json. ` +
    'Use `node ./tools/publish-packages-provenance.mjs` (npm publish --provenance), not changeset/pnpm publish. ' +
    'Requires GitHub Actions id-token:write + repository in package.json.';

  if (strict) {
    console.error(message);
    process.exit(1);
  }

  console.warn(`WARN: ${message}`);
}

main();
