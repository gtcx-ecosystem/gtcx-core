#!/usr/bin/env node
/**
 * Protocol 24 — regular cross-repo dependency hygiene for gtcx-core.
 *
 * Usage:
 *   pnpm agent:cross-repo-deps:check
 *   node 03-platform/scripts/check-cross-repo-dependencies.mjs --strict
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const strict = process.argv.includes('--strict');
const warnings = [];
const errors = [];

function read(rel) {
  const abs = join(ROOT, rel);
  return existsSync(abs) ? readFileSync(abs, 'utf8') : '';
}

function repoIdentity() {
  try {
    const pkg = JSON.parse(read('package.json'));
    const top = execSync('git rev-parse --show-toplevel', {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    return { name: pkg.name, top, ok: top === ROOT };
  } catch {
    return { name: null, top: null, ok: false };
  }
}

function openCrossRepoItems(md) {
  const items = [];
  for (const line of md.split('\n')) {
    if (!line.startsWith('|')) continue;
    if (/^\|\s*ID\s*\|/i.test(line) || /^---/.test(line)) continue;
    if (!/\*\*open\*\*|\*\*outbound-filed\*\*|\*\*blocked\*\*|\*\*pending\*\*/i.test(line)) {
      continue;
    }
    const cols = line.split('|').map((c) => c.trim());
    const id = cols[1];
    if (id && !/^—$/.test(id)) items.push({ id, line });
  }
  return items;
}

function depsMentionsId(deps, id) {
  if (!deps) return false;
  const key = id.split('/')[0].trim();
  return deps.includes(key);
}

function bridgeUpdatedWithinDays(days = 14) {
  const bridge = read('01-docs/04-ops/coordination/cross-repo-agent-bridge.md');
  const m = bridge.match(/\|\s*(\d{4}-\d{2}-\d{2})\s*\|/);
  if (!m) return { ok: false, reason: 'no Latest updates row' };
  const latest = new Date(`${m[1]}T12:00:00Z`);
  const age = (Date.now() - latest.getTime()) / (86400 * 1000);
  return { ok: age <= days, ageDays: Math.floor(age), latest: m[1] };
}

function baselineCoordinationProbe() {
  const candidates = [
    join(ROOT, '../baseline-os/workstream/coordination/coordination-report-latest.md'),
    join(ROOT, '../../baseline-os/workstream/coordination/coordination-report-latest.md'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      return { ok: true, path: p.replace(`${ROOT}/`, '') };
    }
  }
  return { ok: false };
}

function siblingReposPresent() {
  const parent = join(ROOT, '..');
  if (!existsSync(parent)) return [];
  return readdirSync(parent).filter((name) => {
    if (name.startsWith('.')) return false;
    const p = join(parent, name);
    try {
      return statSync(p).isDirectory() && existsSync(join(p, 'package.json'));
    } catch {
      return false;
    }
  });
}

function checkSuggestPersonaImport() {
  const candidates = [
    join(ROOT, '../gtcx-agentic/13-03-platform/scripts/lib/suggest-persona.mjs'),
    join(ROOT, '../gtcx-agentic/03-platform/scripts/lib/suggest-persona.mjs'),
    join(ROOT, '../baseline-os/03-platform/scripts/ecosystem/lib/suggest-persona.mjs'),
  ];
  if (candidates.some((p) => existsSync(p))) return;
  errors.push(
    'suggest-persona.mjs missing — expected gtcx-agentic/13-03-platform/scripts/lib or 03-platform/scripts/lib shim'
  );
}

// --- checks ---
checkSuggestPersonaImport();

const identity = repoIdentity();
if (!identity.ok) {
  errors.push('git toplevel !== cwd — run from repo root');
}
if (identity.name && identity.name !== 'gtcx-core') {
  warnings.push(`package.json name is ${identity.name}; expected gtcx-core in this repo`);
}

const remaining = read('01-docs/04-ops/coordination/remaining-cross-repo-work-2026-06-02.md');
const deps = read('.baseline/memory/dependencies.md');
const open = openCrossRepoItems(remaining);

for (const item of open) {
  if (!depsMentionsId(deps, item.id) && !depsMentionsId(remaining, item.id)) {
    warnings.push(
      `Open cross-repo item ${item.id} — add to .baseline/memory/dependencies.md (Protocol 24)`
    );
  }
}

if (!existsSync('.baseline/memory/dependencies.md')) {
  warnings.push('Missing .baseline/memory/dependencies.md');
}

const bridge = bridgeUpdatedWithinDays(21);
if (!bridge.ok) {
  warnings.push(
    `Bridge Latest updates stale or missing (${bridge.reason ?? `~${bridge.ageDays}d since ${bridge.latest}`}) — refresh cross-repo-agent-bridge.md`
  );
}

const baseline = baselineCoordinationProbe();
if (!baseline.ok && siblingReposPresent().length >= 3) {
  warnings.push(
    'baseline-os coordination-report-latest.md not found — clone sibling baseline-os for ecosystem rollup'
  );
}

// coordination hygiene (strict propagates)
try {
  execSync(`node 03-platform/scripts/check-coordination-hygiene.mjs${strict ? ' --strict' : ''}`, {
    cwd: ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
  });
} catch (e) {
  const out = [e.stdout, e.stderr].filter(Boolean).join('\n').trim();
  if (out) warnings.push(out);
  else warnings.push('check-coordination-hygiene.mjs failed');
}

const allIssues = [...errors, ...warnings];
if (allIssues.length === 0) {
  console.log(
    JSON.stringify(
      {
        ok: true,
        repo: identity.name,
        openCrossRepoItems: open.length,
        bridgeLatest: bridge.latest ?? null,
        baselineCoordination: baseline.ok,
      },
      null,
      2
    )
  );
  process.exit(0);
}

console.error('Cross-repo dependency check issues:\n');
for (const issue of allIssues) console.error(`  - ${issue}`);
console.error('\nFix: 01-docs/04-ops/agent-git-workflow.md § Cross-repo dependency checks');
process.exit(strict || errors.length > 0 ? 1 : 0);
