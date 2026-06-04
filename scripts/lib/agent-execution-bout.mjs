/**
 * Execution bout — intrinsic multi-story agent work (P22 extension).
 * Provisioned on every agent:session-start and agent:next-work.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  OPS_DOCS_QUEUE,
  TIER5_MILESTONES,
  parseCompletedOpsDocs,
  parseCompletedTier5,
} from './agent-work-queues.mjs';

export const BOUT_SCHEMA = 'gtcx.executionBout.v1';
export const BOUT_DOC = 'docs/operations/agent-execution-bout.md';
export const BOUT_STATE_PATH = '.baseline/execution-bout.json';

const IMPLEMENTABLE = new Set(['code', 'ops-docs']);

function storyFromP22Next(next) {
  if (!next) return null;
  const storyId =
    next.milestone ?? next.handoff ?? next.storyId ?? next.dimension ?? null;
  if (!storyId) return null;
  if (next.blocked || next.external) return null;
  return {
    storyId: String(storyId),
    title: next.title ?? storyId,
    sprint: next.sprint ?? null,
    workClass: next.workClass ?? 'code',
    authorityClass: 'S',
    source: 'p22-head',
  };
}

function tier5PendingStories(session, workplan) {
  const completed = parseCompletedTier5(session, workplan);
  const stories = [];
  for (const item of TIER5_MILESTONES) {
    if (completed.has(item.id)) continue;
    if (item.deferred) continue;
    if (item.workClass === 'external') continue;
    if (!IMPLEMENTABLE.has(item.workClass)) continue;
    stories.push({
      storyId: item.id,
      title: item.title,
      sprint: item.sprint,
      workClass: item.workClass,
      authorityClass: 'S',
      source: 'tier-5-workplan',
    });
  }
  return stories;
}

function opsPendingStories(session) {
  const completed = parseCompletedOpsDocs(session);
  return OPS_DOCS_QUEUE.filter((item) => !completed.has(item.id)).map((item) => ({
    storyId: item.id,
    title: item.title,
    sprint: item.sprint,
    workClass: item.workClass,
    authorityClass: 'S',
    source: 'ops-queue',
  }));
}

function repoCompletableStory(nextWork) {
  const rc = nextWork?.repoCompletable;
  if (!rc?.storyId) return null;
  return {
    storyId: rc.storyId,
    title: rc.action ?? rc.storyId,
    sprint: null,
    workClass: 'ops-docs',
    authorityClass: 'S',
    priority: rc.priority ?? 'P3',
    source: 'repo-completable',
  };
}

function humanOnlyStories(nextWork) {
  const list = nextWork?.humanOnly ?? [];
  return list.map((h) => ({
    storyId: h.storyId,
    title: h.title,
    authorityClass: h.authorityClass ?? 'S',
    workClass: 'external',
    source: 'human-only',
  }));
}

function dedupeStories(stories) {
  const seen = new Set();
  const out = [];
  for (const s of stories) {
    if (seen.has(s.storyId)) continue;
    seen.add(s.storyId);
    out.push(s);
  }
  return out;
}

function markCurrent(stories, currentId) {
  return stories.map((s) => ({
    ...s,
    status: s.storyId === currentId ? 'current' : 'pending',
  }));
}

/**
 * @param {object} ctx
 * @param {string} ctx.repoRoot
 * @param {object} ctx.nextWork — P22 result (before persona enrich)
 * @param {string} [ctx.session]
 * @param {string} [ctx.workplan]
 */
function storiesFromLaunchFocus(launchFocus) {
  const bucket =
    launchFocus?.sessionMode === 'plan'
      ? launchFocus?.workSet?.plan
      : launchFocus?.workSet?.implement;
  if (!bucket?.length) return [];
  return bucket.map((item) => ({
    storyId: item.storyId,
    title: item.title,
    sprint: item.sprint ?? null,
    workClass: item.workClass ?? 'ops-docs',
    authorityClass: item.authorityClass ?? 'S',
    source: item.lane ?? 'launch-focus',
    command: item.command,
    paths: item.paths,
  }));
}

export function buildExecutionBout(ctx) {
  const { repoRoot, nextWork, session = '', workplan = '', launchFocus } = ctx;
  const head = storyFromP22Next(nextWork?.next);
  const currentStoryId =
    head?.storyId ?? nextWork?.next?.storyId ?? launchFocus?.activeWorkSet?.[0]?.storyId ?? null;

  const fromLaunch = storiesFromLaunchFocus(launchFocus);
  const implementable = dedupeStories(
    fromLaunch.length > 0
      ? [...(head ? [head] : []), ...fromLaunch]
      : [
          ...(head ? [head] : []),
          ...tier5PendingStories(session, workplan),
          ...opsPendingStories(session),
          ...(nextWork?.backlogClear ? [repoCompletableStory(nextWork)].filter(Boolean) : []),
        ],
  );

  const humanOnly = humanOnlyStories(nextWork);
  const classRRemaining = implementable.filter((s) => s.status !== 'done');
  const boutComplete = classRRemaining.length === 0;
  const classSBlocks = humanOnly.length > 0 && boutComplete;

  const bout = {
    schema: BOUT_SCHEMA,
    statePath: BOUT_STATE_PATH,
    normativeDoc: BOUT_DOC,
    docPath: BOUT_DOC,
    id: `bout-${new Date().toISOString().slice(0, 10)}-auto`,
    mode: 'auto',
    provisionedAt: new Date().toISOString(),
    repo: 'gtcx-core',
    frame: nextWork?.frame ?? 'development',
    launchMode: launchFocus?.sessionMode ?? 'implement',
    backlogClear: Boolean(nextWork?.backlogClear) && launchFocus?.sessionMode !== 'plan',
    stories: markCurrent(implementable, currentStoryId),
    humanOnly,
    currentStoryId,
    remainingCount: implementable.filter((s) => s.status === 'pending').length,
    stopWhen: ['plan_complete', 'class_s_only', 'gate_failure', 'operator_stop'],
    reportEveryStories: 2,
    policy: {
      microCommitPerStory: true,
      endOfTurn: 'bout_check_in_only',
      continueAfterBacklogClear: true,
      reRunNextWorkAfterEachStory: true,
      progressReportInChat: true,
      fullStatusUpdateAt: 'bout_check_in',
    },
    checkInWhen: [
      'all Class R stories in plan are done',
      'next P22 head is Class S / external only',
      'verification gate failed (fix or blocker report)',
      'operator said stop',
    ],
    agentInstructions: [
      launchFocus?.sessionMode === 'plan'
        ? 'PLAN bout — drain workSet.plan (reconcile roadmaps/coordination) before check-in.'
        : 'Execution bout is provisioned — drain Class R stories in `stories[]` before bout check-in.',
      'After each story: micro-commit, update session.md row, re-run `pnpm agent:next-work`.',
      `Progress Status Update in chat every ${2} completed stories (short Done bullets).`,
      'Do NOT end the session after one story while `remainingCount` > 0.',
      'Do NOT ask operator to pick stories — P22 selects head; bout lists the drain queue.',
      'Full Status Update + optional push only at bout check-in.',
      `Normative: ${BOUT_DOC}`,
    ],
    forbidden: [
      'stop after single story when bout has Class R remaining',
      'Say if you want to continue',
      'backlogClear means go idle (it means commercial ceiling — keep draining repoCompletable)',
    ],
    boutComplete,
    classSBlocks,
  };

  if (boutComplete && classSBlocks) {
    bout.agentInstructions.push(
      'Bout plan empty for Class R — check-in with humanOnly as Approval needed; witness only.',
    );
  }

  return bout;
}

export function attachExecutionBout(nextWork, ctx) {
  const bout = buildExecutionBout({ ...ctx, launchFocus: ctx.launchFocus ?? nextWork?.launchFocus });
  const merged = { ...nextWork, executionBout: bout };

  if (nextWork?.backlogClear && Array.isArray(nextWork.agentInstructions)) {
    merged.agentInstructions = [
      ...bout.agentInstructions,
      ...nextWork.agentInstructions.filter(
        (line) => !/then STOP/i.test(line) && !/Emit Status Update with exactly ONE/i.test(line),
      ),
      'Emit progress Status Updates during bout; ONE full check-in Status Update when bout completes.',
    ];
  }

  return merged;
}

export function writeBoutState(repoRoot, bout) {
  const path = join(repoRoot, BOUT_STATE_PATH);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(bout, null, 2)}\n`);
}

export function readRepoContext(repoRoot) {
  const sessionPath = join(repoRoot, '.baseline/memory/session.md');
  const workplanPath = join(repoRoot, 'docs/operations/tier-5-workplan-2026-06.md');
  let session = '';
  let workplan = '';
  if (existsSync(sessionPath)) session = readFileSync(sessionPath, 'utf8');
  if (existsSync(workplanPath)) workplan = readFileSync(workplanPath, 'utf8');
  return { session, workplan };
}
