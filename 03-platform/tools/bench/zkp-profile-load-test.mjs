#!/usr/bin/env node
/**
 * DTF-5.4.2 — Run Groth16 profile load test (release) and write audit evidence JSON.
 *
 * Gate: verify mode >= 1000 proofs/min (minerals-board verifier SLA).
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const rustDir = path.join(rootDir, 'rust');
const evidenceDir = path.join(rootDir, '01-docs/05-audit/evidence');
const date = new Date().toISOString().slice(0, 10);
const outPath = path.join(evidenceDir, `zkp-profile-load-${date}.json`);
const latestPath = path.join(evidenceDir, 'zkp-profile-load-latest.json');

const duration = process.env.ZKP_LOAD_DURATION_SECS ?? '60';
const targetPpm = process.env.ZKP_LOAD_TARGET_PPM ?? '1000';
const mode = process.env.ZKP_LOAD_MODE ?? 'verify';
const workers = process.env.ZKP_LOAD_WORKERS ?? '';
const katDir = path.join(rootDir, 'artifacts/kat');

function run() {
  fs.mkdirSync(evidenceDir, { recursive: true });

  const cmd = [
    'cargo',
    'run',
    '--release',
    '-p',
    'gtcx-zkp',
    '--bin',
    'zkp-profile-load-test',
    '--',
    `--mode=${mode}`,
    `--duration=${duration}`,
    `--target-ppm=${targetPpm}`,
    ...(workers ? [`--workers=${workers}`] : []),
    `--kat-dir=${katDir}`,
    `--out=${outPath}`,
  ].join(' ');

  console.log(`Running: ${cmd}`);
  execSync(cmd, { cwd: rustDir, stdio: 'inherit', env: process.env });

  if (fs.existsSync(outPath)) {
    fs.copyFileSync(outPath, latestPath);
    const evidence = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    console.log(
      `Evidence: ${outPath} — ${evidence.proofs_per_minute} proofs/min (pass=${evidence.pass})`
    );
  }
}

run();
