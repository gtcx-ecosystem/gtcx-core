#!/usr/bin/env node
/**
 * FA-S6-02 — Verify vendor pen-test pack manifest matches on-disk artifacts.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const manifestPath =
  process.argv[2] ??
  path.join(root, 'docs/audit/evidence/vendor-pen-test-pack-manifest-latest.json');

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function main() {
  if (!fs.existsSync(manifestPath)) {
    console.error(`[vendor-evidence] missing manifest: ${manifestPath}`);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.schema !== 'gtcx.vendorPenTestPackManifest.v1') {
    console.error('[vendor-evidence] invalid schema');
    process.exit(1);
  }
  for (const item of manifest.artifacts ?? []) {
    const absolute = path.join(root, item.path);
    if (!fs.existsSync(absolute)) {
      console.error(`[vendor-evidence] missing artifact: ${item.path}`);
      process.exit(1);
    }
    const hash = sha256File(absolute);
    if (hash !== item.sha256) {
      console.error(`[vendor-evidence] hash mismatch: ${item.path}`);
      process.exit(1);
    }
  }
  console.log(
    JSON.stringify(
      {
        ok: true,
        artifactCount: manifest.artifacts?.length ?? 0,
        manifest: path.relative(root, manifestPath),
        externalGate: manifest.externalGate?.status ?? 'unknown',
      },
      null,
      2
    )
  );
}

main();
