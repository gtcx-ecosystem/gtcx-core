#!/usr/bin/env node
/**
 * Protocol 22–28 adoption enforcement for gtcx-core.
 * Manifest: docs/agents/agent-protocols-manifest.json
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const failures = [];

function read(rel) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) return null;
  return readFileSync(abs, 'utf8');
}

function requireFile(rel, label) {
  if (!existsSync(join(ROOT, rel))) {
    failures.push(`Missing ${label}: ${rel}`);
    return null;
  }
  return read(rel);
}

function requireContains(rel, patterns, label) {
  const text = requireFile(rel, label);
  if (!text) return;
  for (const pattern of patterns) {
    const ok = typeof pattern === 'string' ? text.includes(pattern) : pattern.test(text);
    if (!ok) failures.push(`${rel}: missing required content — ${String(pattern)}`);
  }
}

function runScript(name) {
  try {
    execSync(`pnpm ${name}`, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' });
  } catch (error) {
    const out = [error.stdout, error.stderr].filter(Boolean).join('\n');
    failures.push(`${name} failed:\n${out.trim()}`);
  }
}

const manifestRaw = requireFile('docs/agents/agent-protocols-manifest.json', 'protocols manifest');
if (!manifestRaw) {
  report();
  process.exit(1);
}

const manifest = JSON.parse(manifestRaw);
const pkg = JSON.parse(requireFile('package.json', 'package.json'));

if (!pkg.scripts?.['agent:protocols:check']) {
  failures.push('package.json missing script: agent:protocols:check');
}
if (!pkg.scripts?.['agent:next-work']) {
  failures.push('package.json missing script: agent:next-work');
}
if (!pkg.scripts?.['agent:work-selection:check']) {
  failures.push('package.json missing script: agent:work-selection:check');
}

requireFile('docs/agents/agent-protocols-enforcement.md', 'enforcement guide');
requireFile('.cursor/rules/agent-protocols-enforcement.mdc', 'cursor agent protocols rule');

const agents = read('AGENTS.md') ?? '';
const base = read('.agent/base.md') ?? '';

// --- P22 ---
const p22 = manifest.protocols.find((p) => p.id === 'P22');
if (p22?.status === 'established') {
  requireFile(p22.localManifest, 'P22 manifest');
  requireFile(p22.localBrief, 'P22 brief');
  requireFile('scripts/agent-next-work.mjs', 'P22 script');
  requireContains('AGENTS.md', ['Phase 5.4', 'Protocol 22', 'agent:next-work'], 'AGENTS P22');
  requireContains('.agent/base.md', ['agent:next-work', 'agent:work-selection:check'], 'base P22');
  if (pkg.scripts?.['agent:work-selection:check']) {
    runScript('agent:work-selection:check');
  }
}

// --- P24 ---
requireFile('docs/operations/coordination/cross-repo-agent-bridge.md', 'P24 bridge');
requireContains('AGENTS.md', ['Phase 5.5', 'Protocol 24'], 'AGENTS P24');
requireFile('.agent/coordination-pointer.md', 'P24 pointer');

// --- P26 ---
requireFile('docs/operations/agent-proceed-brief-template.md', 'P26 template');
requireContains('AGENTS.md', ['Phase 5.6', 'Protocol 26', 'Proceed Brief'], 'AGENTS P26');

// --- P27 ---
const p27 = manifest.protocols.find((p) => p.id === 'P27');
if (p27) {
  requireFile(p27.cursorRule, 'P27 cursor rule');
  requireContains('AGENTS.md', ['Phase 5.7', 'Protocol 27', 'Permission Unblock'], 'AGENTS P27');
  requireContains('AGENTS.md', ['readiness:lanes:check', 'quality:governance:check'], 'AGENTS P27 gates');
  requireContains('AGENTS.md', ['pnpm format:check', 'agent:protocols:check'], 'AGENTS P27 V-ladder');

  const scanDirs = ['docs/agents', 'docs/operations'];
  for (const dir of scanDirs) {
    const absDir = join(ROOT, dir);
    if (!existsSync(absDir)) continue;
    for (const file of readdirSync(absDir, { recursive: true })) {
      if (typeof file !== 'string' || !file.endsWith('.md')) continue;
      if (file.includes('agent-protocols-enforcement')) continue;
      const content = read(join(dir, file));
      if (!content) continue;
      for (const forbidden of p27.forbiddenPatterns ?? []) {
        if (content.includes(forbidden)) {
          failures.push(
            `${join(dir, file)}: forbidden Protocol 27 pattern "${forbidden}" (use Permission Unblock Report instead)`,
          );
        }
      }
    }
  }
}

// --- P28 ---
requireContains('AGENTS.md', ['Authority class', 'Protocol 28'], 'AGENTS P28');

// --- CI wiring ---
const ci = read('.github/workflows/ci.yml');
if (ci) {
  if (!/agent:next-work/.test(ci)) failures.push('ci.yml: missing agent:next-work step');
  if (!/agent:work-selection:check|agent:protocols:check/.test(ci)) {
    failures.push('ci.yml: missing agent protocol adoption check');
  }
} else {
  failures.push('Missing .github/workflows/ci.yml');
}

// --- Governance runs readiness ---
if (read('tools/check-governance.mjs')) {
  const gov = read('tools/check-governance.mjs');
  if (!gov?.includes('readiness:lanes:check')) {
    failures.push('check-governance.mjs must run readiness:lanes:check');
  }
  if (!gov?.includes('agent:check')) {
    failures.push('check-governance.mjs must run agent:check');
  }
}

// --- Synced agent targets include protocols pointer ---
const targets = JSON.parse(requireFile('.agent/targets.json', 'targets.json'));
const needsProtocols = ['AGENTS.md', 'CLAUDE.md', 'KIMI.md', 'CODEX.md', '.cursor/rules/main.mdc'];
for (const target of targets.targets ?? []) {
  if (needsProtocols.includes(target.path)) {
    if (!target.partials?.includes('protocols-enforcement-pointer.md')) {
      failures.push(`targets.json: ${target.path} missing protocols-enforcement-pointer.md partial`);
    }
  }
}

function report() {
  if (failures.length > 0) {
    console.error('Agent protocols enforcement failed:\n');
    for (const f of failures) {
      console.error(`  - ${f}`);
    }
    console.error(`\nFix: docs/agents/agent-protocols-enforcement.md · ${manifest.enforceCommand}`);
    process.exit(1);
  }
  console.log(
    `Agent protocols enforcement passed (P22–P28 wiring; hub: ${manifest.hubRepo}).`,
  );
}

report();
