#!/usr/bin/env node
/**
 * Agent protocols bundle — P1–P28 wiring, hub drift, coordination, attestation hooks.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { readRepoFile, runPnpmScript } from './lib/agent-check-utils.mjs';
import { resolveAgenticScriptRel } from './lib/resolve-agentic-script.mjs';

const ROOT = process.cwd();
const failures = [];

function requireFile(rel, label) {
  if (!existsSync(join(ROOT, rel))) {
    failures.push(`Missing ${label}: ${rel}`);
    return null;
  }
  return readFileSync(join(ROOT, rel), 'utf8');
}

function requireContains(rel, patterns, label) {
  const text = requireFile(rel, label);
  if (!text) return;
  for (const pattern of patterns) {
    const ok = typeof pattern === 'string' ? text.includes(pattern) : pattern.test(text);
    if (!ok) failures.push(`${rel}: missing required content — ${String(pattern)}`);
  }
}

function runNode(rel, args = '') {
  try {
    execSync(`node ${rel} ${args}`.trim(), { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' });
  } catch (error) {
    const out = [error.stdout, error.stderr].filter(Boolean).join('\n');
    failures.push(`${rel} ${args} failed:\n${out.trim()}`);
  }
}

function runScript(name) {
  const result = runPnpmScript(name, ROOT);
  if (!result.ok) failures.push(`${name} failed:\n${result.output}`);
}

const manifestRaw = requireFile(
  '01-docs/01-agents/agent-protocols-manifest.json',
  'protocols manifest'
);
if (!manifestRaw) reportAndExit();

const manifest = JSON.parse(manifestRaw);
const pkg = JSON.parse(requireFile('package.json', 'package.json'));

const requiredScripts = [
  'agent:protocols:check',
  'agent:universal:check',
  'agent:next-work',
  'agent:session-start',
  'agent:bout',
  'agent:bout:check',
  'agent:reconcile-launch',
  'agent:launch:check',
  'agent:work-selection:check',
  'agent:coordination:check',
  'agent:hub-drift:check',
  'agent:attestation:check',
  'agent:foundation-protocols:check',
  'kimi:skills:check',
  'kimi:skills:sync',
  'agent:bout-progress:check',
  'agent:reconcile-bout-progress',
];

for (const s of requiredScripts) {
  if (!pkg.scripts?.[s]) failures.push(`package.json missing script: ${s}`);
}

requireFile('01-docs/01-agents/agent-protocols-enforcement.md', 'enforcement guide');
requireFile('01-docs/01-agents/agent-protocols-hub-snapshot.json', 'hub snapshot');
requireFile('01-docs/04-ops/agent-attestation-template.md', 'attestation template');
requireFile('03-platform/scripts/agent-session-start.mjs', 'session-start script');
requireFile('01-docs/04-ops/agent-execution-bout.md', 'execution bout normative doc');
requireFile('01-docs/04-ops/agent-launch-focus.md', 'launch focus normative doc');
requireFile('03-platform/scripts/lib/agent-launch-focus.mjs', 'launch focus library');
requireFile('.agent/launch-focus-pointer.md', 'launch focus pointer');
requireContains('AGENTS.md', ['agent-launch-focus.md'], 'AGENTS launch focus');
requireFile('03-platform/scripts/lib/agent-execution-bout.mjs', 'execution bout library');
requireFile('.agent/execution-bout-pointer.md', 'execution bout pointer');
requireFile('.cursor/rules/agent-execution-bout.mdc', 'execution bout cursor rule');
requireContains('AGENTS.md', ['agent-execution-bout.md'], 'AGENTS execution bout');
requireFile('.cursor/rules/agent-protocols-enforcement.mdc', 'cursor agent protocols rule');
requireFile('.agent/session-start-pointer.md', 'session-start pointer');
requireFile('01-docs/04-ops/agent-universal-instructions.md', 'universal instructions (any LLM)');
requireFile('01-docs/04-ops/agent-git-workflow.md', 'agent git workflow');
requireFile('.agent/git-workflow-pointer.md', 'git workflow pointer');
requireContains('AGENTS.md', ['agent-universal-instructions.md'], 'AGENTS universal');
requireContains('AGENTS.md', ['agent-git-workflow.md'], 'AGENTS git workflow');

const universalRel = resolveAgenticScriptRel('check-universal-agent-enforcement.mjs');
if (universalRel) {
  runNode(universalRel, '--repo-only');
} else {
  failures.push(
    'Missing gtcx-agentic check-universal-agent-enforcement.mjs (03-platform/scripts/ or 13-03-platform/scripts/)'
  );
}

// operator-delegation scan: delegated to gtcx-agentic check-universal-agent-enforcement --repo-only

// --- P22 ---
const p22 = manifest.protocols.find((p) => p.id === 'P22');
if (p22?.status === 'established') {
  requireFile(p22.localManifest, 'P22 manifest');
  requireFile(p22.localBrief, 'P22 brief');
  requireFile('03-platform/scripts/agent-next-work.mjs', 'P22 script');
  requireContains('AGENTS.md', ['Phase 5.4', 'Protocol 22', 'agent:next-work'], 'AGENTS P22');
  requireContains(
    '.agent/base.md',
    ['agent:session-start', 'agent:next-work'],
    'base session start'
  );
  runScript('agent:work-selection:check');
  runScript('agent:bout:check');
  runScript('agent:launch:check');
  requireFile('.agent/kimi-skills-pointer.md', 'Kimi skills pointer');
  requireFile('03-platform/scripts/sync-kimi-project-skills.mjs', 'Kimi skills sync');
  runScript('kimi:skills:check');
  requireFile('.agent/bout-progress-pointer.md', 'bout progress pointer');
  requireFile('01-docs/04-ops/agent-bout-progress-gauge.md', 'bout progress gauge doc');
  requireFile('.baseline/bout-progress.config.json', 'bout progress config');
  runScript('agent:bout-progress:check');
}

// --- P24 ---
requireFile('01-docs/04-ops/coordination/cross-repo-agent-bridge.md', 'P24 bridge');
requireContains('AGENTS.md', ['Phase 5.5', 'Protocol 24'], 'AGENTS P24');
requireFile('.agent/coordination-pointer.md', 'P24 pointer');
runNode('03-platform/scripts/check-coordination-hygiene.mjs', '--strict');

// --- P26 / P28 ---
const p26 = manifest.protocols.find((p) => p.id === 'P26');
requireFile('01-docs/04-ops/agent-proceed-brief-template.md', 'P26 template');
requireContains('AGENTS.md', ['Phase 5.6', 'Protocol 26', 'Proceed Brief'], 'AGENTS P26');
requireContains('AGENTS.md', ['Authority class', 'Protocol 28'], 'AGENTS P28');
requireContains('AGENTS.md', ['agent:session-start'], 'AGENTS session start');
if (p26?.cursorRule) {
  requireFile(p26.cursorRule, 'P26 cursor rule');
  const p26Rule = readRepoFile(p26.cursorRule);
  if (p26Rule && (!p26Rule.includes('Your call') || !p26Rule.includes('Two options'))) {
    failures.push(`${p26.cursorRule}: missing P26 v1.1.0 menu-forbidden phrases`);
  }
}

// --- P27 ---
const p27 = manifest.protocols.find((p) => p.id === 'P27');
if (p27) {
  requireFile(p27.cursorRule, 'P27 cursor rule');
  requireContains('AGENTS.md', ['Phase 5.7', 'Protocol 27', 'Permission Unblock'], 'AGENTS P27');
  requireContains(
    'AGENTS.md',
    ['pnpm format:check', 'agent:protocols:check'],
    'AGENTS P27 V-ladder'
  );

  const p26Forbidden = p26?.forbiddenPatterns ?? [];
  const p27Forbidden = p27.forbiddenPatterns ?? [];
  const skipDocs = new Set([
    'agent-universal-instructions.md',
    'agent-git-workflow.md',
    'agent-protocols-enforcement.md',
    'agent-proceed-brief-template.md',
  ]);
  function lineDocumentsBan(line) {
    return /never\s|Forbidden|FORBIDDEN|do not |don't |not ask|Hard-forbidden|forbids |— not |\(never /i.test(
      line
    );
  }
  function findImperativeForbidden(content, patterns) {
    const hits = [];
    for (const line of content.split('\n')) {
      if (lineDocumentsBan(line)) continue;
      for (const phrase of patterns) {
        if (line.includes(phrase)) hits.push(phrase);
      }
    }
    return [...new Set(hits)];
  }
  for (const dir of ['01-docs/01-agents', '01-docs/04-ops']) {
    const absDir = join(ROOT, dir);
    if (!existsSync(absDir)) continue;
    for (const file of readdirSync(absDir, { recursive: true })) {
      if (typeof file !== 'string' || !file.endsWith('.md')) continue;
      if (skipDocs.has(file) || file.includes('agent-protocols-enforcement')) continue;
      const content = readRepoFile(join(dir, file));
      if (!content) continue;
      const rel = join(dir, file);
      for (const forbidden of findImperativeForbidden(content, p26Forbidden)) {
        failures.push(`${rel}: forbidden P26 pattern "${forbidden}"`);
      }
      for (const forbidden of findImperativeForbidden(content, p27Forbidden)) {
        failures.push(`${rel}: forbidden P27 pattern "${forbidden}"`);
      }
    }
  }
}

// --- Foundation P1–P21 ---
runScript('agent:foundation-protocols:check');

// --- Hub drift ---
runScript('agent:hub-drift:check');

// --- CI ---
const ci = readRepoFile('.github/workflows/ci.yml');
const attestationWf = readRepoFile('.github/workflows/agent-attestation.yml');
if (ci) {
  if (!/agent:next-work/.test(ci)) failures.push('ci.yml: missing agent:next-work');
  if (!/agent:protocols:check/.test(ci)) failures.push('ci.yml: missing agent:protocols:check');
  if (!/agent:session-start/.test(ci)) failures.push('ci.yml: missing agent:session-start smoke');
} else {
  failures.push('Missing .github/workflows/ci.yml');
}
if (!attestationWf?.includes('agent:attestation:check')) {
  failures.push('agent-attestation.yml: missing agent:attestation:check job');
}

const gov = readRepoFile('03-platform/tools/check-governance.mjs');
if (gov && !gov.includes('agent:protocols:check')) {
  failures.push('check-governance.mjs must run agent:protocols:check');
}

// --- Agent sync partials ---
const targets = JSON.parse(requireFile('.agent/targets.json', 'targets.json'));
const needsPartials = [
  'protocols-enforcement-pointer.md',
  'session-start-pointer.md',
  'universal-agent-behavior.md',
  'protocol-26-proceed-pointer.md',
  'protocol-27-execution-pointer.md',
];
const llmTargets = [
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  'KIMI.md',
  'CODEX.md',
  '.cursor/rules/main.mdc',
  '.kimi/AGENTS.md',
  '.github/copilot/instructions.md',
];
for (const target of targets.targets ?? []) {
  if (!llmTargets.includes(target.path)) continue;
  for (const partial of needsPartials) {
    if (!target.partials?.includes(partial)) {
      failures.push(`targets.json: ${target.path} missing ${partial}`);
    }
  }
}

function reportAndExit() {
  if (failures.length) {
    console.error('Agent protocols enforcement failed:\n');
    for (const f of failures) console.error(`  - ${f}`);
    console.error(
      `\nFix: 01-docs/01-agents/agent-protocols-enforcement.md · ${manifest.enforceCommand}`
    );
    process.exit(1);
  }
  console.log(`Agent protocols enforcement passed (P1–P28 wiring; hub: ${manifest.hubRepo}).`);
}

reportAndExit();
