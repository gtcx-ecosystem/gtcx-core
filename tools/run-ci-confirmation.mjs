#!/usr/bin/env node

import { execSync } from 'node:child_process';

const gates = [
  { name: 'architecture:check', cmd: 'pnpm architecture:check' },
  { name: 'quality:governance:check', cmd: 'pnpm quality:governance:check' },
  { name: 'security:secret-scan', cmd: 'pnpm security:secret-scan' },
  { name: 'security:threat-matrix', cmd: 'pnpm security:threat-matrix' },
  { name: 'lint', cmd: 'pnpm lint' },
  { name: 'format:check', cmd: 'pnpm format:check' },
  { name: 'typecheck', cmd: 'pnpm typecheck' },
  { name: 'build', cmd: 'pnpm build' },
  { name: 'test', cmd: 'pnpm test' },
  { name: 'test:coverage:critical', cmd: 'pnpm test:coverage:critical' },
  { name: 'api:check', cmd: 'pnpm api:check' },
  { name: 'provenance:generate', cmd: 'pnpm provenance:generate' },
  { name: 'ai:evaluate', cmd: 'pnpm ai:evaluate --output artifacts/ai-scorecard.json' },
  { name: 'check-ai-scorecard', cmd: 'node ./tools/check-ai-scorecard.mjs' },
  { name: 'release:ga:evidence:check', cmd: 'pnpm release:ga:evidence:check' },
  { name: 'docs:check-links', cmd: 'pnpm docs:check-links' },
  { name: 'docs:check-frontmatter', cmd: 'pnpm docs:check-frontmatter' },
  { name: 'provenance:check-npm', cmd: 'pnpm provenance:check-npm', allowFail: true },
];

const results = [];

for (const gate of gates) {
  const start = Date.now();
  try {
    execSync(gate.cmd, { stdio: 'pipe', encoding: 'utf8' });
    results.push({
      gate: gate.name,
      status: 'PASS',
      duration_ms: Date.now() - start,
    });
  } catch (error) {
    const stderr = error instanceof Error && 'stderr' in error ? String(error.stderr) : '';
    const stdout = error instanceof Error && 'stdout' in error ? String(error.stdout) : '';
    results.push({
      gate: gate.name,
      status: gate.allowFail ? 'WARN' : 'FAIL',
      duration_ms: Date.now() - start,
      output: (stderr || stdout || String(error)).slice(-2000),
    });
    if (!gate.allowFail) {
      console.error(`CI confirmation failed at: ${gate.name}`);
      console.error(results.at(-1)?.output);
      process.exit(1);
    }
  }
  console.log(`[${results.at(-1)?.status}] ${gate.name} (${results.at(-1)?.duration_ms}ms)`);
}

const payload = {
  confirmed_at: new Date().toISOString(),
  git_head: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
  gates: results,
};

process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
