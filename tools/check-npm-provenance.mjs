#!/usr/bin/env node

import { execSync } from 'node:child_process';

const PACKAGES = [
  'types',
  'crypto',
  'crypto-native',
  'schemas',
  'utils',
  'domain',
  'security',
  'verification',
  'identity',
  'api-client',
  'connectivity',
  'logging',
  'network',
  'sync',
  'resilience',
  'telemetry',
  'runtime',
  'events',
  'workproof',
  'services',
  'ai',
];

const strict = process.argv.includes('--strict');
const json = process.argv.includes('--json');

function viewAttestations(name) {
  try {
    const out = execSync(`npm view @gtcx/${name} --json`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const data = JSON.parse(out);
    const attestations = data.dist?.attestations;
    return {
      name: `@gtcx/${name}`,
      version: data.version,
      hasAttestation: Boolean(attestations?.url || attestations?.provenance),
      attestations: attestations ?? null,
    };
  } catch (error) {
    return {
      name: `@gtcx/${name}`,
      version: null,
      hasAttestation: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function main() {
  const results = PACKAGES.map(viewAttestations);
  const withAttestation = results.filter((r) => r.hasAttestation);
  const missing = results.filter((r) => !r.hasAttestation);

  if (json) {
    process.stdout.write(
      JSON.stringify(
        {
          total: results.length,
          with_attestation: withAttestation.length,
          missing: missing.map((r) => r.name),
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
      const version = row.version ?? 'n/a';
      console.log(`  [${status}] ${row.name}@${version}`);
    }
  }

  if (missing.length === 0) {
    console.log('All published packages have npm provenance attestations.');
    return;
  }

  const message =
    `${missing.length} package(s) lack npm registry attestations. ` +
    'Changesets uses `pnpm publish` — set NPM_CONFIG_PROVENANCE=true (not changeset --provenance). ' +
    'Requires GitHub Actions id-token:write + repository field in package.json. ' +
    'Republish via `gh workflow run release.yml -f provenance_republish=true`.';

  if (strict) {
    console.error(message);
    process.exit(1);
  }

  console.warn(`WARN: ${message}`);
}

main();
