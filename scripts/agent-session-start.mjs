#!/usr/bin/env node
/**
 * Provider-agnostic session start — run from any terminal / LLM CLI before work.
 * Phases 5.4–5.6 bootstrap: git state, next-work, session.md touch, Proceed Brief skeleton.
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SESSION_PATH = join(ROOT, '.baseline/memory/session.md');
const SESSION_META = join(ROOT, '.baseline/memory/session-last-start.json');
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
try {
  const raw = run('node scripts/agent-next-work.mjs');
  nextWork = JSON.parse(raw);
} catch (error) {
  nextWork = { error: String(error.message ?? error) };
}

const now = new Date().toISOString();
const stamp = now.slice(0, 19).replace('T', ' ');

const nextLabel =
  nextWork?.next?.milestone ??
  nextWork?.next?.handoff ??
  nextWork?.next?.dimension ??
  'unknown';

const blocked = Boolean(nextWork?.next?.blocked);
const authorityClass = blocked ? 'R' : 'S';

const bootstrap = `
## Session bootstrap (${stamp} UTC)

- **Command:** \`pnpm agent:session-start\`
- **Next work:** ${nextLabel}${nextWork?.next?.title ? ` — ${nextWork.next.title}` : ''}
- **Blocked:** ${blocked ? 'yes' : 'no'}${nextWork?.next?.blocker ? ` (${nextWork.next.blocker})` : ''}
- **Git:** ${gitStatus.split('\n').filter(Boolean).length} changed path(s)

`;

mkdirSync(dirname(SESSION_PATH), { recursive: true });
let sessionBody = '';
if (existsSync(SESSION_PATH)) {
  sessionBody = readFileSync(SESSION_PATH, 'utf8');
  // Replace prior bootstrap section or prepend
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

const proceedBrief = {
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

log('=== GTCX agent session start (provider-agnostic) ===\n');
log('Git status:\n', gitStatus || '(clean)\n');
log('Next work (P22):', JSON.stringify(nextWork?.next ?? nextWork, null, 2));
log('\n--- Proceed Brief (P26 + P28) — copy to operator ---\n');
log(`**Next action:** ${proceedBrief.nextAction}`);
log(`**Story / work ID:** ${proceedBrief.storyId}`);
log(`**Because:** ${proceedBrief.because}`);
log(`**Authority class:** ${proceedBrief.authorityClass}`);
log(`**Authorization artifact:** ${proceedBrief.authorizationArtifact}`);
log(`**Blocked:** ${blocked ? 'yes' : 'no'}`);
log('\nSession updated:', SESSION_PATH);
log('Before claiming done: run V-ladder (AGENTS.md §7) and include attestation in PR/commit.\n');
