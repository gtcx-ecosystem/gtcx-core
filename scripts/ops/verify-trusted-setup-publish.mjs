#!/usr/bin/env node
/**
 * CORE-004 — verify ceremony artifacts after custodian publishes transcript.seed.
 * Exit 0 when transcript + manifest exist and KAT pin test passes.
 */
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TRANSCRIPT = join(ROOT, 'artifacts', 'trusted-setup', 'transcript.seed');
const MANIFEST = join(ROOT, 'artifacts', 'trusted-setup', 'manifest.json');

function fail(msg) {
  console.error(`verify-trusted-setup-publish: ${msg}`);
  process.exit(1);
}

if (!existsSync(TRANSCRIPT)) {
  fail(`missing ${TRANSCRIPT} — run sovereign ceremony per core-004-ceremony-publish-checklist.md`);
}

const bytes = readFileSync(TRANSCRIPT);
if (bytes.length !== 32) {
  fail(`transcript.seed must be 32 bytes, got ${bytes.length}`);
}

if (!existsSync(MANIFEST)) {
  fail(`missing ${MANIFEST} — copy docs/audit/evidence/trusted-setup-manifest.template.json`);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
} catch (e) {
  fail(`manifest.json invalid JSON: ${e.message}`);
}

const sha = createHash('sha256').update(bytes).digest('hex');
if (manifest.transcript_sha256 && manifest.transcript_sha256 !== '<sha256 of artifacts/trusted-setup/transcript.seed>') {
  if (manifest.transcript_sha256 !== sha) {
    fail(`manifest transcript_sha256 mismatch (expected ${sha})`);
  }
} else {
  console.warn('verify-trusted-setup-publish: manifest transcript_sha256 still placeholder — fill before release');
}

console.log('verify-trusted-setup-publish: transcript OK (32 bytes, sha256=' + sha.slice(0, 16) + '…)');

try {
  execSync(
    'cargo test -p gtcx-zkp --features trusted-setup-verify --release -- groth16_kat_pins_match_published_transcript',
    { cwd: join(ROOT, 'rust'), stdio: 'inherit' },
  );
} catch {
  fail('KAT pin test failed — re-run KAT generation or fix manifest pins');
}

console.log('verify-trusted-setup-publish: OK — CORE-004 publish gate passed');
