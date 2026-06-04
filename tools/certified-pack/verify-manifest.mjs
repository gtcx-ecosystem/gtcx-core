#!/usr/bin/env node
/**
 * DTF-5.5.2 — Verify certified pack manifest matches on-disk packs.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const manifestPath =
  process.argv[2] ??
  path.join(root, 'docs/audit/evidence/certified-pack-manifest-latest.json');

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function main() {
  if (!fs.existsSync(manifestPath)) {
    console.error(`[certified-pack] missing manifest: ${manifestPath}`);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.schema !== 'gtcx.certifiedPackManifest.v1') {
    console.error('[certified-pack] invalid schema');
    process.exit(1);
  }
  for (const pack of manifest.packs ?? []) {
    const absolute = path.join(root, pack.path);
    if (!fs.existsSync(absolute)) {
      console.error(`[certified-pack] missing pack file: ${pack.path}`);
      process.exit(1);
    }
    const hash = sha256File(absolute);
    if (hash !== pack.sha256) {
      console.error(`[certified-pack] hash mismatch: ${pack.path}`);
      process.exit(1);
    }
  }
  console.log(
    JSON.stringify(
      { ok: true, packCount: manifest.packs?.length ?? 0, manifest: manifestPath },
      null,
      2
    )
  );
}

main();
