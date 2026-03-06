#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const outDir = path.join(rootDir, 'artifacts');
const outPath = path.join(outDir, 'provenance-manifest.json');

function sha256File(filePath) {
  const raw = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function fileEvidence(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  const exists = fs.existsSync(absolutePath);
  return {
    path: relativePath,
    exists,
    sha256: exists ? sha256File(absolutePath) : null,
  };
}

function safeExec(command) {
  try {
    return execSync(command, { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

const lockfilePath = path.join(rootDir, 'pnpm-lock.yaml');
const apiBaselinePath = path.join(rootDir, 'quality/api-surface-baseline.json');
const qualityEvidencePaths = [
  '.github/CODEOWNERS',
  '.github/workflows/ci.yml',
  '.github/workflows/release.yml',
  'benchmarks/performance-budgets.json',
  'benchmarks/latest-results.json',
  'benchmarks/history.json',
  'benchmarks/performance-report.json',
  'SOP/2-docs/3-engineering/security/threat-control-matrix.md',
  'SOP/2-docs/4-operations/compliance/10-10-remediation-tracker.md',
  'quality/api-surface-baseline.json',
];

const manifest = {
  generatedAt: new Date().toISOString(),
  commit: safeExec('git rev-parse HEAD'),
  branch: safeExec('git rev-parse --abbrev-ref HEAD'),
  nodeVersion: process.version,
  lockfile: {
    path: path.relative(rootDir, lockfilePath),
    sha256: fs.existsSync(lockfilePath) ? sha256File(lockfilePath) : null,
  },
  apiBaseline: {
    path: path.relative(rootDir, apiBaselinePath),
    sha256: fs.existsSync(apiBaselinePath) ? sha256File(apiBaselinePath) : null,
  },
  qualityGates: [
    'pnpm architecture:check',
    'pnpm quality:governance:check',
    'pnpm security:threat-matrix',
    'pnpm perf:update-history',
    'pnpm perf:check-budgets',
    'pnpm lint',
    'pnpm format:check',
    'pnpm typecheck',
    'pnpm test',
    'pnpm test:coverage:critical',
    'pnpm build',
    'pnpm api:check',
    'pnpm api:check:release',
    'pnpm quality:kpi:collect',
    'pnpm quality:kpi:export',
    'pnpm run docs',
    'pnpm docs:check-links',
  ],
  evidenceArtifacts: qualityEvidencePaths.map((relativePath) => fileEvidence(relativePath)),
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Provenance manifest generated: ${path.relative(rootDir, outPath)}`);
