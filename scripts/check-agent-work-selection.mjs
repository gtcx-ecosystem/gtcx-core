#!/usr/bin/env node
/**
 * Verifies Protocol 22 (AGENT-WORK-SEL) is wired for gtcx-core.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const errors = [];

function requireFile(relPath, label) {
  const abs = join(ROOT, relPath);
  if (!existsSync(abs)) {
    errors.push(`Missing ${label}: ${relPath}`);
    return null;
  }
  return readFileSync(abs, 'utf8');
}

const manifest = requireFile(
  'docs/operations/agent-work-selection.md',
  'work-selection manifest',
);
requireFile('scripts/agent-next-work.mjs', 'selection script');
const autoDev = requireFile('docs/audit/auto-dev-state.md', 'session pointer');

const pkgRaw = requireFile('package.json', 'package.json');
if (pkgRaw) {
  const pkg = JSON.parse(pkgRaw);
  if (!pkg.scripts?.['agent:next-work']) {
    errors.push('package.json missing script: agent:next-work');
  }
  if (!pkg.scripts?.['agent:work-selection:check']) {
    errors.push('package.json missing script: agent:work-selection:check');
  }
}

const agents = requireFile('AGENTS.md', 'AGENTS.md');
if (agents) {
  if (!agents.includes('Protocol 22')) {
    errors.push('AGENTS.md missing Protocol 22 reference');
  }
  if (!agents.includes('Phase 5.4')) {
    errors.push('AGENTS.md missing Phase 5.4 work selection');
  }
}

if (manifest && !manifest.includes('OPS-AWS-001')) {
  errors.push('Manifest missing document_id OPS-AWS-001');
}

if (autoDev && !/Next work/i.test(autoDev)) {
  errors.push('auto-dev-state.md missing "Next work" section');
}

if (errors.length > 0) {
  console.error('Protocol 22 adoption check failed:\n');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log('Protocol 22 adoption check passed (gtcx-core).');
