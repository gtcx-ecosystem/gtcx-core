#!/usr/bin/env node
/**
 * GTCX session start — one command: `pnpm agent:start`
 * P22 next-work + session.md touch + Proceed Brief skeleton (P26/P28).
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();
const SESSION_PATH = join(ROOT, '.baseline/memory/session.md');
const SESSION_META = join(ROOT, '.baseline/memory/session-last-start.json');
const NEXT_WORK_SCRIPT = join(ROOT, 'scripts/agent-next-work.mjs');
const QUIET = process.argv.includes('--quiet');
const JSON_OUT = process.argv.includes('--json');

function run(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function log(...parts) {
  if (!QUIET && !JSON_OUT) console.log(...parts);
}

let gitStatus = '';
try {
  gitStatus = run('git status --short');
} catch {
  gitStatus = '(git unavailable)';
}

let nextWork = null;
if (!existsSync(NEXT_WORK_SCRIPT)) {
  nextWork = { error: `Missing ${NEXT_WORK_SCRIPT} — add Protocol 22 next-work script` };
} else {
  try {
    const raw = run('node scripts/agent-next-work.mjs');
    nextWork = JSON.parse(raw);
  } catch (error) {
    nextWork = { error: String(error.message ?? error) };
  }
}

const now = new Date().toISOString();
const stamp = now.slice(0, 19).replace('T', ' ');

const nextLabel =
  nextWork?.next?.milestone ??
  nextWork?.next?.handoff ??
  nextWork?.next?.storyId ??
  nextWork?.next?.dimension ??
  'unknown';

const blocked = Boolean(nextWork?.next?.blocked);
const authorityClass = blocked ? 'S' : 'R';

const bootstrap = `
## Session bootstrap (${stamp} UTC)

- **Command:** \`pnpm agent:start\`
- **Next work:** ${nextLabel}${nextWork?.next?.title ? ` — ${nextWork.next.title}` : ''}
- **Blocked:** ${blocked ? 'yes' : 'no'}${nextWork?.next?.blocker ? ` (${nextWork.next.blocker})` : ''}
- **Git:** ${gitStatus.split('\n').filter(Boolean).length} changed path(s)

`;

mkdirSync(dirname(SESSION_PATH), { recursive: true });
let sessionBody = '';
if (existsSync(SESSION_PATH)) {
  sessionBody = readFileSync(SESSION_PATH, 'utf8');
  const marker = '## Session bootstrap (';
  if (sessionBody.includes(marker)) {
    const before = sessionBody.slice(0, sessionBody.indexOf(marker));
    const afterMatch = sessionBody.slice(sessionBody.indexOf(marker)).match(/\n## (?!Session bootstrap)/);
    const after = afterMatch ? sessionBody.slice(sessionBody.indexOf(marker) + afterMatch.index) : '';
    sessionBody = `${before.trimEnd()}\n${bootstrap}${after.trimStart() ? `\n${after.trimStart()}` : ''}`;
  } else {
    sessionBody = `${sessionBody.trimEnd()}\n${bootstrap}`;
  }
} else {
  sessionBody = `---\nsession_id: '${now.slice(0, 10)}-session'\nagent: 'terminal'\n---\n${bootstrap}`;
}
writeFileSync(SESSION_PATH, sessionBody.endsWith('\n') ? sessionBody : `${sessionBody}\n`);

writeFileSync(
  SESSION_META,
  `${JSON.stringify(
    {
      startedAt: now,
      nextWork,
      gitChanged: gitStatus.split('\n').filter(Boolean).length,
      authorityClass,
    },
    null,
    2,
  )}\n`,
);

const persona = nextWork?.persona;
const proceedBrief = {
  activePersona: persona?.institutional ?? nextWork?.proceedBrief?.activePersona ?? 'developer',
  frame: persona?.frame ?? nextWork?.frame ?? 'development',
  personaDocUrl: persona?.docUrl ?? nextWork?.proceedBrief?.personaDocUrl,
  nextAction: nextWork?.next?.title ?? nextLabel,
  storyId: nextLabel,
  because: nextWork?.selection?.reason ?? 'Protocol 22 manifest',
  authorityClass,
  authorizationArtifact: blocked ? 'human or owner-repo gate required' : 'none',
  inputs: [
    'docs/operations/agent-work-selection.md',
    '.baseline/memory/session.md',
    'baseline-os/workstream/coordination/coordination-report-latest.md',
  ],
  blocked,
};

const output = {
  startedAt: now,
  gitStatus,
  nextWork,
  proceedBrief,
  sessionPath: '.baseline/memory/session.md',
  template: 'docs/operations/agent-proceed-brief-template.md',
  attestation: 'docs/operations/agent-attestation-template.md',
};

if (JSON_OUT) {
  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

log('=== GTCX agent:start ===\n');
log('Git status:\n', gitStatus || '(clean)\n');
log('Next work (P22):', JSON.stringify(nextWork?.next ?? nextWork, null, 2));
log('\n--- Proceed Brief (P26) — emit to operator, then IMPLEMENT ---\n');
log(`**Active persona:** ${proceedBrief.activePersona} · **Frame:** ${proceedBrief.frame}`);
if (proceedBrief.personaDocUrl) log(`**Persona doc:** ${proceedBrief.personaDocUrl}`);
log(`**Next:** ${proceedBrief.nextAction}`);
log(`**Story / work ID:** ${proceedBrief.storyId}`);
log(`**Because:** ${proceedBrief.because}`);
log(`**Authority class:** ${proceedBrief.authorityClass}`);
log(`**Blocked:** ${blocked ? 'yes' : 'no'}`);
log(`**Override:** stop | correct: | story ID`);
log('\nSession updated:', SESSION_PATH);
log('Close turns with Status Update (Done → Next priority). Forbidden: Say if you want · menus.\n');
