#!/usr/bin/env node
/**
 * GTCX session start — `pnpm agent:start` (alias: `pnpm agent:session-start`)
 * P22 next-work + launch focus + execution bout + progress gauge + session.md.
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildProgressGauge } from './lib/agent-bout-progress-gauge.mjs';

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

let crossRepoDeps = { ok: true };
try {
  const raw = run('node scripts/check-cross-repo-dependencies.mjs');
  crossRepoDeps = JSON.parse(raw);
} catch (error) {
  crossRepoDeps = { ok: false, error: String(error.message ?? error) };
}

const now = new Date().toISOString();
const stamp = now.slice(0, 19).replace('T', ' ');

const nextLabel =
  nextWork?.next?.milestone ??
  nextWork?.next?.handoff ??
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

const executionBout = nextWork?.executionBout ?? null;
const launchFocus = nextWork?.launchFocus ?? null;
const progressGauge = buildProgressGauge(ROOT);

const output = {
  startedAt: now,
  gitStatus,
  nextWork,
  executionBout,
  launchFocus,
  progressGauge,
  proceedBrief: {
    ...proceedBrief,
    launchOutcome: launchFocus?.northStar?.outcome,
    sessionMode: launchFocus?.sessionMode,
    workSetSummary: launchFocus?.workSetCounts,
    boutScope:
      executionBout?.stories?.length > 0
        ? `Drain ${executionBout.stories.length} Class R story(ies) before bout check-in`
        : 'No Class R stories in bout — witness / Class S check-in',
    boutDoc: 'docs/operations/agent-execution-bout.md',
  },
  crossRepoDeps,
  sessionPath: '.baseline/memory/session.md',
  boutStatePath: '.baseline/execution-bout.json',
  launchFocusPath: '.baseline/launch-focus.json',
  boutProgressConfigPath: '.baseline/bout-progress.config.json',
  template: 'docs/operations/agent-proceed-brief-template.md',
  attestation: 'docs/operations/agent-attestation-template.md',
};

if (JSON_OUT) {
  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

log('=== GTCX agent:start ===\n');
if (launchFocus) {
  log('--- LAUNCH FOCUS (GTM — read first; no audit needed) ---\n');
  log(`**Outcome:** ${launchFocus.northStar.outcome}`);
  log(
    `**GTM:** ${launchFocus.northStar.gtmTier.library} library · sovereign ${launchFocus.northStar.gtmTier.ecosystemSovereign}`,
  );
  log(`**Session mode:** ${launchFocus.sessionMode.toUpperCase()}`);
  log(
    `**Work set:** ${launchFocus.workSetCounts.implement} implement · ${launchFocus.workSetCounts.plan} plan · ${launchFocus.workSetCounts.human} human`,
  );
  const show = launchFocus.activeWorkSet?.slice(0, 10) ?? [];
  for (const w of show) {
    log(`  - ${w.storyId}: ${w.title}`);
  }
  log(`**State:** .baseline/launch-focus.json\n`);
}
log('Git status:\n', gitStatus || '(clean)\n');
if (!crossRepoDeps.ok) {
  log('Cross-repo deps (P24): issues — run `pnpm agent:cross-repo-deps:check --strict`');
} else {
  log('Cross-repo deps (P24): ok');
}
log('Next work (P22):', JSON.stringify(nextWork?.next ?? nextWork, null, 2));
log('\n--- Proceed Brief (P26 + P28) — emit to operator, then IMPLEMENT ---\n');
log(`**Active persona:** ${proceedBrief.activePersona} · **Frame:** ${proceedBrief.frame}`);
if (proceedBrief.personaDocUrl) log(`**Persona doc:** ${proceedBrief.personaDocUrl}`);
log(`**Next:** ${proceedBrief.nextAction}`);
log(`**Story / work ID:** ${proceedBrief.storyId}`);
log(`**Because:** ${proceedBrief.because}`);
log(`**Authority class:** ${proceedBrief.authorityClass}`);
log(`**Authorization artifact:** ${proceedBrief.authorizationArtifact}`);
log(`**Blocked:** ${blocked ? 'yes' : 'no'}`);
log(`**Override:** stop | correct: | story ID`);
if (executionBout) {
  log('\n--- Execution bout (intrinsic — drain before check-in) ---\n');
  log(`**Scope:** ${output.proceedBrief.boutScope}`);
  log(`**Current:** ${executionBout.currentStoryId ?? 'none'}`);
  log(`**Class R in plan:** ${executionBout.stories?.length ?? 0}`);
  log(`**Bout complete:** ${executionBout.boutComplete}`);
  log(`**State:** .baseline/execution-bout.json`);
  log(`**Normative:** ${executionBout.normativeDoc ?? 'docs/operations/agent-execution-bout.md'}`);
  if (executionBout.stories?.length) {
    for (const s of executionBout.stories.slice(0, 8)) {
      log(`  - [${s.status}] ${s.storyId}`);
    }
    if (executionBout.stories.length > 8) {
      log(`  - … +${executionBout.stories.length - 8} more`);
    }
  }
  log('\n**Policy:** micro-commit per story · progress report every 2 stories · no stop until bout complete');
}
if (progressGauge) {
  log('\n--- Progress gauge (bout composite — not buyer GA) ---\n');
  log(progressGauge.reportMarkdown);
  log(`\n**Detail:** pnpm agent:bout-progress · ${progressGauge.normativeDoc}`);
}
log('\n**FORBIDDEN replies (P26 v1.1.0):** Your call · Two options · 1./2. menus · "switch to other repo?"');
if (nextWork?.backlogClear && nextWork?.statusUpdate) {
  const su = nextWork.statusUpdate;
  log('\n--- Status Update skeleton (P26 — backlog clear) ---\n');
  if (su.done) log(`**Done:** ${su.done}`);
  if (su.nextPriority) log(`**Next priority:** ${su.nextPriority}`);
  if (su.approvalNeeded) log(`**Approval needed:** ${su.approvalNeeded}`);
  if (su.deferred) log(`**Deferred:** ${su.deferred}`);
  log('\nClose with Status Update ONLY — no "Say if you want" after Approval needed.\n');
}
log('\nSession updated:', SESSION_PATH);
log('Before claiming done: run V-ladder (AGENTS.md §7) and include attestation in PR/commit.\n');
