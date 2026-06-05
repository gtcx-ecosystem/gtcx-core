import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function readRepoFile(rel, absolute = false) {
  const abs = absolute ? rel : join(process.cwd(), rel);
  if (!existsSync(abs)) return null;
  return readFileSync(abs, 'utf8');
}

export function runPnpmScript(name, cwd = process.cwd()) {
  try {
    execSync(`pnpm ${name}`, { cwd, stdio: 'pipe', encoding: 'utf8' });
    return { ok: true };
  } catch (error) {
    const out = [error.stdout, error.stderr].filter(Boolean).join('\n');
    return { ok: false, output: out.trim() };
  }
}

export const AGENT_ATTESTATION_PHASES = [
  'Phase 1: Baseline loaded',
  'Phase 2: Repo context established',
  'Phase 3: Current state discovered',
  'Phase 4: Persona & frame selected',
  'Phase 5: Context attested',
  'Phase 5.4:',
  'Phase 5.5:',
  'Phase 5.6:',
  'Phase 5.7:',
];

export const AGENT_PATH_GLOBS = [
  '01-docs/01-agents/',
  '.agent/',
  'AGENTS.md',
  '03-platform/tools/check-agent',
  '03-platform/tools/check-hub-protocol',
  '03-platform/tools/check-foundation-protocol',
  '03-platform/scripts/agent-',
  '03-platform/scripts/check-agent',
  '03-platform/scripts/check-coordination',
];

export function textRequiresAttestation(text) {
  return AGENT_PATH_GLOBS.some((g) => text.includes(g.replace(/\/$/, '')));
}

export function parseAttestation(text) {
  const header = '## Agent Context Attestation';
  if (!text.includes(header)) {
    return { ok: false, missing: ['attestation block header'] };
  }
  const block = text.slice(text.indexOf(header));
  const missing = [];
  for (const phase of AGENT_ATTESTATION_PHASES) {
    const line = block.split('\n').find((l) => l.includes(phase));
    if (!line || !/\[x\]/i.test(line)) {
      missing.push(phase);
    }
  }
  return { ok: missing.length === 0, missing };
}
