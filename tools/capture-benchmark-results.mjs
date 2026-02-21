#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const criterionDir = path.join(rootDir, 'rust/target/criterion');
const latestPath = path.join(rootDir, 'benchmarks/latest-results.json');

const sourceArg = process.argv.find((arg) => arg.startsWith('--source='));
const source = sourceArg ? sourceArg.slice('--source='.length) : 'criterion:rust/gtcx-crypto';

const metricSpecs = [
  {
    key: 'ed25519.key_generation_us',
    estimatesPath: 'ed25519_keygen/new/estimates.json',
    normalize: (ns) => ns / 1000,
  },
  {
    key: 'ed25519.sign_us',
    estimatesPath: 'ed25519_sign/new/estimates.json',
    normalize: (ns) => ns / 1000,
  },
  {
    key: 'ed25519.verify_us',
    estimatesPath: 'ed25519_verify/new/estimates.json',
    normalize: (ns) => ns / 1000,
  },
  {
    key: 'ed25519.roundtrip_us',
    estimatesPath: 'ed25519_sign_verify_roundtrip/new/estimates.json',
    normalize: (ns) => ns / 1000,
  },
  {
    key: 'hash.sha256_256b_ns',
    estimatesPath: 'hash_comparison_256b/sha256/new/estimates.json',
    normalize: (ns) => ns,
  },
  {
    key: 'hash.sha512_256b_ns',
    estimatesPath: 'hash_comparison_256b/sha512/new/estimates.json',
    normalize: (ns) => ns,
  },
  {
    key: 'hash.blake3_256b_ns',
    estimatesPath: 'hash_comparison_256b/blake3/new/estimates.json',
    normalize: (ns) => ns,
  },
  {
    key: 'zkp.groth16_gci_prove_ms',
    estimatesPath: 'zkp_groth16_gci_prove/new/estimates.json',
    normalize: (ns) => ns / 1_000_000,
  },
  {
    key: 'zkp.groth16_gci_verify_ms',
    estimatesPath: 'zkp_groth16_gci_verify/new/estimates.json',
    normalize: (ns) => ns / 1_000_000,
  },
  {
    key: 'zkp.bulletproofs_amount_range_prove_ms',
    estimatesPath: 'zkp_bulletproofs_amount_range_prove/new/estimates.json',
    normalize: (ns) => ns / 1_000_000,
  },
  {
    key: 'zkp.bulletproofs_amount_range_verify_ms',
    estimatesPath: 'zkp_bulletproofs_amount_range_verify/new/estimates.json',
    normalize: (ns) => ns / 1_000_000,
  },
  {
    key: 'zkp.schnorr_identity_prove_ms',
    estimatesPath: 'zkp_schnorr_identity_prove/new/estimates.json',
    normalize: (ns) => ns / 1_000_000,
  },
  {
    key: 'zkp.schnorr_identity_verify_ms',
    estimatesPath: 'zkp_schnorr_identity_verify/new/estimates.json',
    normalize: (ns) => ns / 1_000_000,
  },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function round(value, digits = 4) {
  const base = 10 ** digits;
  return Math.round(value * base) / base;
}

if (!fs.existsSync(criterionDir)) {
  console.error(`Criterion output not found: ${path.relative(rootDir, criterionDir)}`);
  console.error('Run benchmark commands first (for example: `cd rust && cargo bench -p gtcx-crypto --bench signing --bench hashing`).');
  process.exit(1);
}

const metrics = {};
for (const spec of metricSpecs) {
  const estimatesAbsolutePath = path.join(criterionDir, spec.estimatesPath);
  if (!fs.existsSync(estimatesAbsolutePath)) {
    console.error(`Missing benchmark estimates file: ${path.relative(rootDir, estimatesAbsolutePath)}`);
    process.exit(1);
  }

  const estimates = readJson(estimatesAbsolutePath);
  const pointEstimateNs = Number(estimates?.mean?.point_estimate);
  if (!Number.isFinite(pointEstimateNs) || pointEstimateNs <= 0) {
    console.error(`Invalid point estimate in ${path.relative(rootDir, estimatesAbsolutePath)}`);
    process.exit(1);
  }

  metrics[spec.key] = round(spec.normalize(pointEstimateNs));
}

const latest = {
  recordedAt: new Date().toISOString(),
  source,
  metrics,
};

fs.writeFileSync(latestPath, `${JSON.stringify(latest, null, 2)}\n`);
console.log(`Benchmark snapshot captured: ${path.relative(rootDir, latestPath)}`);
