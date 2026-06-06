#!/usr/bin/env node
/**
 * L3 agent bootstrap — sor-map, paths, repo-kind, governance spine (library profile).
 */
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import {
  ALLOWLIST_PATH,
  GOVERNANCE_SPINE_PATH,
  OPS_MANIFEST_PATH,
  REPO_KIND_PATH,
  REPO_ROOT,
  SOR_MAP_PATH,
  assertSorPathsExist,
  loadSorMap,
} from '../../config/paths.mjs';

const failures = [];

function requireFile(rel, label) {
  if (!existsSync(join(REPO_ROOT, rel))) failures.push(`missing ${label}: ${rel}`);
}

requireFile('config/sor-map.json', 'sor-map');
requireFile('config/paths.mjs', 'paths module');
requireFile('config/repo-kind.json', 'repo-kind');
requireFile('config/governance-spine.json', 'governance spine');
requireFile('03-platform/README.md', 'platform hub README');
requireFile('01-docs/README.md', 'docs IA');
requireFile('05-audit/AGENT-START.md', 'audit entry');
requireFile('01-docs/05-audit/latest.json', 'audit machine state');
requireFile('01-docs/01-agents/README.md', 'agents hub');
requireFile('00-archive/README.md', 'archive hub README');
requireFile('02-ops/README.md', 'ops hub README');
requireFile('04-deploy/README.md', 'deploy hub README');
requireFile('06-workstream/README.md', 'workstream hub README');
requireFile('05-audit/README.md', 'audit hub README');

assertSorPathsExist(failures);

const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8'));
const scripts = pkg.scripts ?? {};
for (const name of ['layout:strings:check', 'agent:bootstrap:check', 'layout:migrate:v6:check']) {
  if (!scripts[name]) failures.push(`package.json missing script: ${name}`);
}

const sor = loadSorMap();
if (sor.repo !== 'gtcx-core') failures.push('sor-map.repo must be gtcx-core');
if (sor.repoKind !== 'library') failures.push('sor-map.repoKind must be library');

const kind = JSON.parse(readFileSync(REPO_KIND_PATH, 'utf8'));
if (kind.kind !== 'library') failures.push('repo-kind.kind must be library');
if (kind.migrationTier !== 'stable') failures.push('repo-kind.migrationTier must be stable');

if (existsSync(GOVERNANCE_SPINE_PATH)) {
  const spine = JSON.parse(readFileSync(GOVERNANCE_SPINE_PATH, 'utf8'));
  if (spine.repo !== 'gtcx-core') failures.push('governance-spine.repo must be gtcx-core');
}

if (existsSync(OPS_MANIFEST_PATH)) {
  const ops = JSON.parse(readFileSync(OPS_MANIFEST_PATH, 'utf8'));
  if (ops.hubs?.deploy !== '04-deploy' && ops.code?.deploy !== '04-deploy') {
    failures.push('ops.manifest missing 04-deploy hub mapping');
  }
}

if (existsSync(ALLOWLIST_PATH)) {
  const allow = JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8'));
  if (allow.migration_tier !== 'stable') {
    failures.push(
      `root-allowlist migration_tier must be stable (got ${allow.migration_tier ?? 'unset'})`
    );
  }
}

const nextWork = spawnSync('node', ['03-platform/scripts/agent-next-work.mjs'], {
  cwd: REPO_ROOT,
  encoding: 'utf8',
  env: { ...process.env, FORCE_COLOR: '0' },
});
if (nextWork.status !== 0) {
  failures.push('agent:next-work failed — check 01-docs/05-audit/execution-roadmap.md');
} else {
  try {
    const payload = JSON.parse(nextWork.stdout);
    if (!payload.next?.storyId && !payload.blocker && !payload.selection?.storyId) {
      failures.push('agent:next-work JSON missing next story selection');
    }
  } catch {
    failures.push('agent:next-work did not emit valid JSON');
  }
}

if (failures.length) {
  console.error('agent:bootstrap:check FAILED');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('agent:bootstrap:check OK');
console.log(`  sor-map: ${SOR_MAP_PATH.replace(`${REPO_ROOT}/`, '')}`);
console.log(`  repoKind: library (Tier ${sor.repoTier ?? 1})`);
