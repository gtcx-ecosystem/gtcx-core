#!/usr/bin/env node
/**
 * Foundation protocols P1–P21 — verify local gates and pointers exist in gtcx-core.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { readRepoFile } from './lib/agent-check-utils.mjs';
import { resolveHubRoot } from './lib/hub-protocols.mjs';

const ROOT = process.cwd();
const failures = [];

const manifest = JSON.parse(
  readRepoFile('docs/agents/agent-protocols-manifest.json') ?? '{}',
);
const pkg = JSON.parse(readRepoFile('package.json') ?? '{}');

function requireScript(scriptName, label) {
  if (!pkg.scripts?.[scriptName]) {
    failures.push(`P foundation: missing package.json script ${scriptName} (${label})`);
    return false;
  }
  return true;
}

function requireFile(rel, label) {
  if (!existsSync(join(ROOT, rel))) {
    failures.push(`P foundation: missing ${label}: ${rel}`);
    return false;
  }
  return true;
}

for (const entry of manifest.foundationProtocols ?? []) {
  const { id, title, localGate, localPath, hubOnly } = entry;

  if (hubOnly) continue;

  if (localGate) {
    requireScript(localGate, `${id} ${title}`);
  }
  if (localPath) {
    const abs = join(ROOT, localPath);
    if (!existsSync(abs)) {
      failures.push(`P foundation: missing ${id} ${title}: ${localPath}`);
    }
  }
}

// Hub folders exist when sibling checkout present
const snapshot = JSON.parse(readRepoFile('docs/agents/agent-protocols-hub-snapshot.json') ?? '{}');
const hubRoot = resolveHubRoot(ROOT, manifest, snapshot);
if (hubRoot) {
  for (const entry of manifest.foundationProtocols ?? []) {
    if (!entry.slug) continue;
    const rel = join('docs/governance/protocols', entry.slug, 'protocol.md');
    if (!existsSync(join(hubRoot, rel)) && !entry.optional) {
      failures.push(`Hub missing ${entry.id} at ${rel}`);
    }
  }
}

// Structural gates always required for core
const coreGates = [
  ['format:check', 'P5 code standards'],
  ['lint', 'P5 code standards'],
  ['typecheck', 'P5 code standards'],
  ['test', 'P6 testing'],
  ['architecture:check', 'P3 naming / boundaries'],
  ['docs:check-frontmatter', 'P1/P18 docs'],
  ['docs:check-links', 'P1 docs structure'],
  ['quality:governance:check', 'P9/P11 governance'],
  ['security:secret-scan', 'P8 security'],
  ['check:workspace-root-cleanliness', 'P14 folder hygiene'],
];

for (const [script, label] of coreGates) {
  requireScript(script, label);
}

if (existsSync(join(ROOT, '.github/workflows/ci.yml'))) {
  // P7 CI/CD
} else {
  failures.push('P7: missing .github/workflows/ci.yml');
}

if (existsSync(join(ROOT, '.husky/commit-msg'))) {
  // P4 git workflow — commitlint
} else {
  failures.push('P4: missing .husky/commit-msg (conventional commits)');
}

if (failures.length) {
  console.error('Foundation protocols check failed:\n');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `Foundation protocols check passed (${manifest.foundationProtocols?.length ?? 0} entries, P1–P21 wiring).`,
);
