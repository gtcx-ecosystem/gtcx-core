#!/usr/bin/env node
/**
 * DTF-5.5.2 — Build content-addressed certified pack manifest (Class R).
 * Optional Ed25519 signature when GTCX_CERTIFIED_PACK_SIGNING_SEED_HEX is set (Protocol 19 — never commit).
 */
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const packsDir = path.join(root, 'artifacts/certified-pack/packs');
const artifactsManifest = path.join(root, 'artifacts/certified-pack/manifest.json');
const evidenceLatest = path.join(
  root,
  '01-docs/05-audit/evidence/certified-pack-manifest-latest.json'
);
const templatePath = path.join(
  root,
  '01-docs/05-audit/evidence/certified-pack-manifest-template.json'
);

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

function exportPacks() {
  execSync('pnpm exec tsx 03-platform/tools/certified-pack/export-packs.ts', {
    cwd: root,
    stdio: 'inherit',
  });
}

function listPackEntries() {
  if (!fs.existsSync(packsDir)) return [];
  return fs
    .readdirSync(packsDir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((file) => {
      const absolute = path.join(packsDir, file);
      const raw = fs.readFileSync(absolute, 'utf8');
      return {
        jurisdictionCode: file.replace('-engagement-pack.json', '').toUpperCase(),
        path: path.relative(root, absolute),
        sha256: sha256File(absolute),
        bytes: Buffer.byteLength(raw, 'utf8'),
      };
    });
}

function signingBlock() {
  if (!process.env.GTCX_CERTIFIED_PACK_SIGNING_SEED_HEX) {
    return {
      signed: false,
      reason:
        'hash-only manifest (optional: set GTCX_CERTIFIED_PACK_SIGNING_SEED_HEX for Ed25519; Class A with vault)',
    };
  }
  return {
    signed: false,
    reason:
      'signing hook reserved — use gtcx-protocols CSP authority key ceremony for production delivery',
  };
}

function main() {
  exportPacks();
  const packs = listPackEntries();
  if (packs.length !== 5) {
    console.error(`[certified-pack] expected 5 engagement packs, got ${packs.length}`);
    process.exit(1);
  }

  const body = {
    schema: 'gtcx.certifiedPackManifest.v1',
    storyId: 'DTF-5.5.2',
    generatedAt: new Date().toISOString(),
    repoHead: safeGit('git rev-parse HEAD'),
    packCount: packs.length,
    packs,
    gates: ['pnpm jurisdiction:validate-packs', 'pnpm certified-pack:verify-manifest'],
    commercialGate: {
      storyId: 'DTF-5.5.4',
      requirement: 'Design-partner LOI or regulator letter (Class S — GTM/Legal)',
      status: 'awaiting-human',
    },
  };

  const manifest = { ...body, signing: signingBlock() };

  fs.mkdirSync(path.dirname(artifactsManifest), { recursive: true });
  fs.mkdirSync(path.dirname(evidenceLatest), { recursive: true });
  const json = `${JSON.stringify(manifest, null, 2)}\n`;
  fs.writeFileSync(artifactsManifest, json);
  fs.writeFileSync(evidenceLatest, json);
  if (!fs.existsSync(templatePath)) {
    fs.writeFileSync(
      templatePath,
      `${JSON.stringify({ ...body, signing: { signed: false, reason: 'template' } }, null, 2)}\n`
    );
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        packCount: packs.length,
        artifactsManifest: path.relative(root, artifactsManifest),
        evidenceLatest: path.relative(root, evidenceLatest),
        signed: manifest.signing.signed,
      },
      null,
      2
    )
  );
}

main();
