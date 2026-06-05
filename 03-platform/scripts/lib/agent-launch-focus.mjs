/**
 * Launch focus — GTM north star + full work set (implement / plan / witness / human).
 * Provisioned every session so agents do not need ad-hoc audits to know priorities.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

import {
  OPS_DOCS_QUEUE,
  TIER5_MILESTONES,
  parseCompletedOpsDocs,
  parseCompletedTier5,
  parseCompletedLaunchPlan,
} from './agent-work-queues.mjs';

export const LAUNCH_SCHEMA = 'gtcx.launchFocus.v1';
export const LAUNCH_DOC = '01-docs/04-ops/agent-launch-focus.md';
export const LAUNCH_STATE_PATH = '.baseline/launch-focus.json';

const NORTH_STAR = {
  outcome:
    'Finish foundation evidence and coordination so downstream apps (markets, intelligence, infrastructure) can launch — GTM closes GR-T2+ sovereign deals.',
  gtcxCoreRole:
    'Ship npm foundation + proof artifacts; do not build product UI here. Unblock sibling repos via packages, KATs, coordination tickets.',
  notTheGoal:
    'Re-run forensic audits or story menus to discover priorities — launch-focus.json is SoR.',
};

function readUtf8(repoRoot, rel) {
  const p = join(repoRoot, rel);
  if (!existsSync(p)) return '';
  return readFileSync(p, 'utf8');
}

function parseGtmTiers(latestJson) {
  try {
    const j = JSON.parse(latestJson);
    const gtm = j?.lanes?.gtmReadiness?.gtmReadinessTier ?? {};
    return {
      library: gtm.library ?? 'GR-T1',
      integratorPilot: gtm.integratorPilot ?? 'GR-T2-partial',
      ecosystemSovereign: gtm.ecosystemSovereign ?? 'below-GR-T2',
      index: j?.lanes?.gtmReadiness?.index ?? '01-docs/05-audit/gtm-readiness-2026-06-05.md',
    };
  } catch {
    return {
      library: 'GR-T1',
      integratorPilot: 'GR-T2-partial',
      ecosystemSovereign: 'below-GR-T2',
      index: '01-docs/05-audit/gtm-readiness-2026-06-05.md',
    };
  }
}

/** Parse | ID | ... | status | rows from execution-roadmap / trackers. */
function parseOpenItems(md, source) {
  const items = [];
  const rowRe =
    /\|\s*([A-Z][A-Z0-9-]+(?:-[A-Z0-9]+)*)\s*\|[^|\n]*\|[^|\n]*\|\s*(\*\*)?(partial|pending|open|awaiting-human|blocked)(\*\*)?/gi;
  let m;
  while ((m = rowRe.exec(md)) !== null) {
    const id = m[1];
    const status = m[3].toLowerCase();
    if (['done', 'complete', 'closed'].some((x) => status.includes(x))) continue;
    items.push({ storyId: id, status, source });
  }
  return items;
}

function tier5Implementable(session, workplan) {
  const completed = parseCompletedTier5(session, workplan);
  return TIER5_MILESTONES.filter(
    (item) =>
      !completed.has(item.id) &&
      !item.deferred &&
      item.workClass !== 'external' &&
      ['code', 'ops-docs'].includes(item.workClass)
  ).map((item) => ({
    storyId: item.id,
    title: item.title,
    sprint: item.sprint,
    workClass: item.workClass,
    authorityClass: 'R',
    lane: 'tier-5-technical',
    because: 'Defensibility Tier 5 — path to GTM technical credibility',
  }));
}

function opsImplementable(session) {
  const completed = parseCompletedOpsDocs(session);
  return OPS_DOCS_QUEUE.filter((item) => !completed.has(item.id)).map((item) => ({
    storyId: item.id,
    title: item.title,
    sprint: item.sprint,
    workClass: item.workClass,
    authorityClass: 'R',
    lane: 'hygiene',
    because: 'Engineering hygiene — keeps launch claims defensible',
  }));
}

const PLANNING_QUEUE = [
  {
    storyId: 'LAUNCH-PLAN-01',
    title: 'Reconcile machine launch state (auto-dev + launch-focus)',
    workClass: 'ops-docs',
    authorityClass: 'R',
    command: 'pnpm agent:reconcile-launch',
    lane: 'launch-planning',
  },
  {
    storyId: 'LAUNCH-PLAN-02',
    title: 'Refresh execution-roadmap open items + executive summary',
    workClass: 'ops-docs',
    authorityClass: 'R',
    paths: ['01-docs/05-audit/execution-roadmap.md'],
    lane: 'launch-planning',
  },
  {
    storyId: 'LAUNCH-PLAN-03',
    title: 'Update cross-repo bridge Latest row (GTM critical path)',
    workClass: 'ops-docs',
    authorityClass: 'R',
    paths: ['01-docs/04-ops/coordination/cross-repo-agent-bridge.md'],
    lane: 'launch-planning',
  },
  {
    storyId: 'LAUNCH-PLAN-04',
    title: 'File or refresh infra outbound OI-X02 (ER-1-08 hub ack)',
    workClass: 'ops-docs',
    authorityClass: 'R',
    paths: ['01-docs/04-ops/coordination/remaining-cross-repo-work-2026-06-02.md'],
    lane: 'cross-repo-gtm',
  },
  {
    storyId: 'LAUNCH-PLAN-05',
    title: 'Probe readiness lanes + fix index drift blocking GTM claims',
    workClass: 'ops-docs',
    authorityClass: 'R',
    command: 'pnpm readiness:lanes:check',
    lane: 'launch-planning',
  },
];

const CORE_004_ENGINEERING_DONE =
  '01-docs/04-ops/coordination/core-004-engineering-closeout-2026-06-06.md';

function core004EngineeringDone(repoRoot) {
  return existsSync(join(repoRoot, CORE_004_ENGINEERING_DONE));
}

const LAUNCH_IMPLEMENT_STATIC = [
  {
    storyId: 'CORE-004',
    title: 'Trusted-setup transcript publish + KAT pin closeout',
    workClass: 'ops-docs',
    authorityClass: 'R',
    lane: 'ceremony',
    because: 'D3 / sovereign ZKP defensibility — Class R engineering publish (legal sign separate)',
    paths: [
      '01-docs/04-ops/coordination/core-004-xr402-blocker-2026-06-04.md',
      '01-docs/04-ops/coordination/core-004-ceremony-publish-checklist.md',
      'artifacts/trusted-setup/README.md',
    ],
  },
];

function humanGates(nextWork, workplan, executionMd) {
  const human = [];
  if (workplan.includes('DTF-5.5.4') && workplan.includes('awaiting-human')) {
    human.push({
      storyId: 'DTF-5.5.4',
      title: 'Design-partner LOI or regulator letter',
      authorityClass: 'S',
      owner: 'GTM / Legal',
      lane: 'tier-5-commercial',
    });
  }
  for (const h of nextWork?.humanOnly ?? []) {
    human.push({
      storyId: h.storyId,
      title: h.title,
      authorityClass: h.authorityClass ?? 'S',
      owner: h.owner ?? 'Human / GTM',
      lane: 'p22-human',
    });
  }
  if (executionMd.includes('EXT-INF-002')) {
    human.push({
      storyId: 'EXT-INF-002',
      title: 'Live-stack pen-test (vendor) — infrastructure owner',
      authorityClass: 'S',
      owner: 'gtcx-infrastructure',
      lane: 'ecosystem-gtm',
    });
  }
  return human;
}

function witnessItems(human, nextWork) {
  const witness = [];
  if (nextWork?.witness) {
    witness.push({
      storyId: 'WITNESS-COORD',
      title: 'Maintain coordination witness doc',
      path: nextWork.witness,
      authorityClass: 'A',
    });
  }
  return witness;
}

function dedupeById(list) {
  const seen = new Set();
  return list.filter((x) => {
    if (seen.has(x.storyId)) return false;
    seen.add(x.storyId);
    return true;
  });
}

/**
 * @param {string} repoRoot
 */
export function buildLaunchFocus(repoRoot) {
  const session = readUtf8(repoRoot, '.baseline/memory/session.md');
  const workplan = readUtf8(repoRoot, '01-docs/04-ops/tier-5-workplan-2026-06.md');
  const executionMd = readUtf8(repoRoot, '01-docs/05-audit/execution-roadmap.md');
  const remainingMd = readUtf8(
    repoRoot,
    '01-docs/04-ops/coordination/remaining-cross-repo-work-2026-06-02.md'
  );
  const latestJson = readUtf8(repoRoot, '01-docs/05-audit/latest.json');

  const gtmTier = parseGtmTiers(latestJson);
  const parsedOpen = [
    ...parseOpenItems(executionMd, 'execution-roadmap'),
    ...parseOpenItems(remainingMd, 'remaining-cross-repo'),
  ];

  const oiX02OutboundFiled = existsSync(
    join(
      repoRoot,
      '01-docs/04-ops/coordination/to-gtcx-infrastructure-er-1-08-hub-ack-2026-06-03.md'
    )
  );
  const oiX02InboundAck = existsSync(
    join(
      repoRoot,
      '01-docs/04-ops/coordination/from-gtcx-infrastructure-er-1-08-hub-ack-2026-06-04.md'
    )
  );
  const oiX02AwaitingAck = oiX02OutboundFiled && !oiX02InboundAck;

  const implement = dedupeById([
    ...tier5Implementable(session, workplan),
    ...opsImplementable(session),
    ...LAUNCH_IMPLEMENT_STATIC.filter((s) => {
      if (s.storyId === 'CORE-004') {
        return (
          !core004EngineeringDone(repoRoot) &&
          executionMd.includes('CORE-004') &&
          executionMd.includes('partial')
        );
      }
      return true;
    }),
    ...parsedOpen
      .filter((p) => p.storyId === 'CORE-004')
      .map((p) => ({
        storyId: p.storyId,
        title: 'Close CORE-004 ceremony evidence',
        workClass: 'ops-docs',
        authorityClass: 'R',
        lane: 'ecosystem-open',
        because: `Open on execution-roadmap: ${p.status}`,
      })),
  ]);

  const human = dedupeById(humanGates({}, workplan, executionMd));
  const completedPlan = parseCompletedLaunchPlan(session);
  const plan = PLANNING_QUEUE.filter((item) => !completedPlan.has(item.storyId));
  const witness = [
    ...witnessItems(human, {}),
    ...(oiX02AwaitingAck
      ? [
          {
            storyId: 'OI-X02',
            title: 'Await infra hub ack — core outbound filed 2026-06-03',
            path: '01-docs/04-ops/coordination/to-gtcx-infrastructure-er-1-08-hub-ack-2026-06-03.md',
            authorityClass: 'A',
            owner: 'gtcx-infrastructure',
          },
        ]
      : []),
  ];

  let sessionMode = 'implement';
  if (implement.length === 0) sessionMode = 'plan';
  if (implement.length === 0 && plan.length > 0) sessionMode = 'plan';
  if (implement.length === 0 && human.length > 0 && plan.every((p) => false)) {
    sessionMode = 'witness';
  }

  const activeWorkSet =
    sessionMode === 'plan' ? plan : sessionMode === 'implement' ? implement : [];

  return {
    schema: LAUNCH_SCHEMA,
    normativeDoc: LAUNCH_DOC,
    statePath: LAUNCH_STATE_PATH,
    provisionedAt: new Date().toISOString(),
    repo: 'gtcx-core',
    northStar: { ...NORTH_STAR, gtmTier },
    sessionMode,
    activePhase: {
      id: 'launch-gtm',
      label: 'Launch downstream apps — foundation → GR-T2+ sovereign GTM',
      executionRoadmap: '01-docs/05-audit/execution-roadmap.md',
      gtmIndex: gtmTier.index,
    },
    workSet: {
      implement,
      plan,
      witness,
      human,
    },
    activeWorkSet,
    workSetCounts: {
      implement: implement.length,
      plan: plan.length,
      witness: witness.length,
      human: human.length,
    },
    sources: [
      '01-docs/05-audit/execution-roadmap.md',
      '01-docs/04-ops/tier-5-workplan-2026-06.md',
      '01-docs/04-ops/coordination/remaining-cross-repo-work-2026-06-02.md',
      '01-docs/05-audit/latest.json',
      '01-docs/08-gtm/gtm-reality-check-2026-06-02.md',
    ],
    forbidden: [
      'Ask operator to run forensic audit before starting work',
      'Ask operator to run execute-roadmap to discover priorities',
      'Story menus or "your call" when launch-focus is provisioned',
      'Treat gtcx-core as the deployable app — foundation only',
    ],
    agentInstructions: buildInstructions(sessionMode, implement.length, plan.length),
  };
}

function buildInstructions(sessionMode, implementCount, planCount) {
  const lines = [
    'Launch focus is provisioned — read northStar + workSet before any audit/roadmap prompt.',
    'Goal: finish foundation + coordination so sibling repos can ship apps and GTM can close deals.',
  ];
  if (sessionMode === 'implement') {
    lines.push(
      `Session mode IMPLEMENT — drain workSet.implement (${implementCount} items) via execution bout.`
    );
  } else if (sessionMode === 'plan') {
    lines.push(
      `Session mode PLAN — no code queue; execute workSet.plan (${planCount} items) to advance launch state.`,
      'Planning is Class R — reconcile roadmaps, coordination, auto-dev-state; do not go idle.'
    );
  } else {
    lines.push('Session mode WITNESS — human gates only; maintain indexes and outbound acks.');
  }
  lines.push('Full work set is in launch-focus.json — not a single story.');
  lines.push(`Normative: ${LAUNCH_DOC}`);
  return lines;
}

export function attachLaunchFocus(nextWork, repoRoot) {
  const launchFocus = buildLaunchFocus(repoRoot);
  launchFocus.workSet.human = dedupeById(
    humanGates(
      nextWork,
      readUtf8(repoRoot, '01-docs/04-ops/tier-5-workplan-2026-06.md'),
      readUtf8(repoRoot, '01-docs/05-audit/execution-roadmap.md')
    )
  );
  launchFocus.workSetCounts.human = launchFocus.workSet.human.length;
  const merged = {
    ...nextWork,
    launchFocus,
    selection: {
      ...nextWork.selection,
      launchMode: launchFocus.sessionMode,
      reason: `${nextWork.selection?.reason ?? 'P22'} · launch: ${launchFocus.sessionMode} (${launchFocus.workSetCounts.implement} implement / ${launchFocus.workSetCounts.plan} plan)`,
    },
  };

  if (launchFocus.workSetCounts.implement > 0) {
    merged.backlogClear = false;
    merged.automatableExhausted = false;
    merged.message = `Launch implement queue: ${launchFocus.workSetCounts.implement} Class R items toward GTM.`;
    const head = launchFocus.workSet.implement[0];
    const p22Blocked =
      merged.next?.blocked === true ||
      merged.next?.implementationClass === 'external' ||
      merged.next?.status === 'awaiting-human';
    if (head && p22Blocked) {
      merged.commercialCeiling = {
        storyId: merged.next?.storyId ?? 'DTF-5.5.4',
        title: merged.next?.title ?? 'Design-partner LOI or regulator letter',
        authorityClass: 'S',
        owner: merged.next?.owner ?? 'Human / GTM',
      };
      merged.next = {
        storyId: head.storyId,
        title: head.title,
        track: 'launch',
        milestone: head.storyId,
        workClass: head.workClass ?? 'ops-docs',
        blocked: false,
        owner: 'gtcx-core',
        implementationClass: head.workClass ?? 'ops-docs',
      };
      merged.nextPriority = {
        owner: 'gtcx-core',
        action: head.title,
        because: `${head.storyId} — Class R implement queue (DTF-5.5.4 LOI is parallel Class S only)`,
        outbound: head.paths?.[0] ?? LAUNCH_DOC,
      };
      merged.statusUpdate = {
        ...(merged.statusUpdate ?? {}),
        nextPriority: `**gtcx-core** — ${head.storyId} (${head.title})`,
        approvalNeeded: '**DTF-5.5.4** LOI/regulator letter (Class S)',
      };
      merged.agentInstructions = [
        ...(merged.agentInstructions ?? []),
        'P22 head DTF-5.5.4 is commercial ceiling only — drain workSet.implement first; never sign LOI as agent.',
      ];
    }
  }

  if (launchFocus.sessionMode === 'plan') {
    merged.next = {
      storyId: launchFocus.workSet.plan[0]?.storyId ?? 'LAUNCH-PLAN-01',
      title: launchFocus.workSet.plan[0]?.title ?? 'Advance launch planning state',
      track: 'launch',
      milestone: launchFocus.workSet.plan[0]?.storyId,
      workClass: 'ops-docs',
      blocked: false,
    };
    merged.backlogClear = false;
    merged.message =
      'Implement queue empty — PLAN mode: reconcile launch state and GTM critical path (no audit required).';
    merged.agentInstructions = [
      ...launchFocus.agentInstructions,
      'Drain workSet.plan via execution bout — same loop as implement mode.',
    ];
  }

  return merged;
}

export function writeLaunchFocusState(repoRoot, launchFocus) {
  const path = join(repoRoot, LAUNCH_STATE_PATH);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(launchFocus, null, 2)}\n`);
}
