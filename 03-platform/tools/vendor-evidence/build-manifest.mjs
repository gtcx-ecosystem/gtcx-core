#!/usr/bin/env node
/**
 * FA-S6-02 — Content-addressed pen-test vendor evidence pack manifest (Class R).
 * Input for EXT-INF-002; does not claim live-stack pen-test complete.
 */
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const evidenceLatest = path.join(
  root,
  '01-docs/05-audit/evidence/vendor-pen-test-pack-manifest-latest.json'
);
const artifactsManifest = path.join(root, 'artifacts/vendor-evidence/pen-test-pack-manifest.json');

const STATIC_PATHS = [
  '01-docs/09-security/threat-control-matrix.md',
  '01-docs/09-security/threat-model.md',
  '01-docs/09-security/pen-test-scope.md',
  '01-docs/09-security/pen-test-rfp-2026.md',
  '01-docs/09-security/attack-tree-signing.md',
  '01-docs/09-security/native-binding-audit-checklist.md',
  '01-docs/09-security/internal-security-assessment.md',
  '01-docs/05-audit/fuzz-campaign-evidence-2026-05-21.md',
  '01-docs/05-audit/ci-confirmation-2026-06-01.md',
  '01-docs/05-audit/evidence/certified-pack-manifest-latest.json',
  '01-docs/05-audit/evidence/zkp-profile-load-latest.json',
  '01-docs/governance/trust-portal-zkp-circuit-registry.md',
  '03-platform/packages/crypto/circuit-registry.manifest.json',
  'artifacts/provenance-manifest.json',
];

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function safeGit(cmd) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function listKatEntries() {
  const katDir = path.join(root, 'artifacts/kat');
  if (!fs.existsSync(katDir)) return [];
  return fs
    .readdirSync(katDir)
    .filter((f) => f.endsWith('.kat.json'))
    .sort()
    .map((file) => path.join('artifacts/kat', file));
}

function fileEntry(relativePath, category) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) {
    console.error(`[vendor-evidence] missing required path: ${relativePath}`);
    process.exit(1);
  }
  const stat = fs.statSync(absolute);
  return {
    category,
    path: relativePath.replace(/\\/g, '/'),
    sha256: sha256File(absolute),
    bytes: stat.size,
  };
}

function main() {
  const artifacts = [
    ...listKatEntries().map((p) => fileEntry(p, 'kat')),
    ...STATIC_PATHS.map((p) => fileEntry(p, 'security-evidence')),
  ];

  const body = {
    schema: 'gtcx.vendorPenTestPackManifest.v1',
    storyId: 'FA-S6-02',
    generatedAt: new Date().toISOString(),
    repoHead: safeGit('git rev-parse HEAD'),
    purpose:
      'Library-scope pen-test vendor intake — KAT, fuzz, threat matrix, CI confirmation (gtcx-core only)',
    owner: 'gtcx-core',
    externalGate: {
      storyId: 'EXT-INF-002',
      owner: 'gtcx-infrastructure',
      requirement: 'Live-stack pen-test SOW + vendor report',
      status: 'open',
    },
    artifactCount: artifacts.length,
    artifacts,
    gates: [
      'pnpm security:threat-matrix',
      'pnpm vendor-evidence:verify-manifest',
      'pnpm test:kat-cross-impl',
    ],
    deliveryNote:
      'Ship manifest JSON + referenced paths to pen-test vendor; infra owns live-stack scope.',
  };

  fs.mkdirSync(path.dirname(artifactsManifest), { recursive: true });
  fs.mkdirSync(path.dirname(evidenceLatest), { recursive: true });
  const json = `${JSON.stringify(body, null, 2)}\n`;
  fs.writeFileSync(artifactsManifest, json);
  fs.writeFileSync(evidenceLatest, json);

  console.log(
    JSON.stringify(
      {
        ok: true,
        artifactCount: artifacts.length,
        artifactsManifest: path.relative(root, artifactsManifest),
        evidenceLatest: path.relative(root, evidenceLatest),
      },
      null,
      2
    )
  );
}

main();
