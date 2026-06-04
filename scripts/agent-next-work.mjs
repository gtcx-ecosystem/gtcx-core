#!/usr/bin/env node
/**
 * Protocol 22 — deterministic next-work selection for gtcx-core.
 * Reads docs/audit/moat-dimension-roadmap-10-10.md; emits JSON to stdout.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { enrichWithPersona } from '../../gtcx-agentic/scripts/lib/suggest-persona.mjs';
import {
  attachExecutionBout,
  readRepoContext,
  writeBoutState,
} from './lib/agent-execution-bout.mjs';
import {
  OPS_DOCS_QUEUE,
  TIER5_MILESTONES,
  parseCompletedOpsDocs,
  parseCompletedTier5,
} from './lib/agent-work-queues.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const THIS_REPO = 'gtcx-core';
const ROADMAP_PATH = join(REPO_ROOT, 'docs/audit/moat-dimension-roadmap-10-10.md');
const SESSION_PATH = join(REPO_ROOT, '.baseline/memory/session.md');
const TIER5_WORKPLAN_PATH = join(REPO_ROOT, 'docs/operations/tier-5-workplan-2026-06.md');

/** Dimensions ordered by selection priority. */
const DIMENSION_ORDER = [
  { id: 'D1', critical: true, name: 'Circuit Correctness' },
  { id: 'D2', critical: false, name: 'Bulletproofs Range' },
  { id: 'D3', critical: false, name: 'Trusted Setup' },
  { id: 'D4', critical: false, name: 'Backward Compat' },
  { id: 'D5', critical: false, name: 'RNG / Entropy' },
  { id: 'D6', critical: true, name: 'KAT / Interop' },
  { id: 'D7', critical: false, name: 'Side-Channel' },
  { id: 'D8', critical: false, name: 'Formal Verification', external: true },
  { id: 'D9', critical: false, name: 'Third-Party Audit', external: true },
  { id: 'D10', critical: false, name: 'Primitive Compliance' },
];

function parseRoadmapScores(md) {
  const scores = new Map();
  // Look for "**Current:** N/10" under each Dimension header
  const dimRe = /## Dimension (\d+):[\s\S]*?\*\*Current:\*\*\s*(\d+(?:\.\d+)?)\/10/g;
  let m;
  while ((m = dimRe.exec(md)) !== null) {
    scores.set(`D${m[1]}`, parseFloat(m[2]));
  }
  // Also try "D1 = 9" or "D1: 9" style
  if (scores.size === 0) {
    const altRe = /\|\s*D(\d+)\s*\|\s*(\d+(?:\.\d+)?)\s*\|/g;
    while ((m = altRe.exec(md)) !== null) {
      scores.set(`D${m[1]}`, parseFloat(m[2]));
    }
  }
  return scores;
}

function parseInProgressSession(md) {
  const dtf = /in_progress[\s\S]*?(DTF-5\.\d+\.\d+)/i.exec(md);
  if (dtf) {
    return { track: 'T5', milestone: dtf[1] };
  }
  const re = /in_progress[\s\S]*?(D\d+)[\s\S]*?(M\d+\.\d+)/i;
  const m = re.exec(md);
  if (m) {
    return { dimension: m[1], milestone: m[2] };
  }
  return null;
}

function selectTier5NextWork(session) {
  let workplan = '';
  try {
    workplan = readFileSync(TIER5_WORKPLAN_PATH, 'utf-8');
  } catch {
    // optional
  }

  const completed = parseCompletedTier5(session, workplan);

  const inProgress = parseInProgressSession(session);
  if (inProgress?.track === 'T5') {
    const item = TIER5_MILESTONES.find((x) => x.id === inProgress.milestone);
    if (item && !completed.has(item.id)) {
      return formatTier5Selection(item, 'resume', `Resuming ${item.id} from session`);
    }
  }

  for (const item of TIER5_MILESTONES) {
    if (completed.has(item.id)) continue;
    if (item.deferred) continue;
    if (item.workClass === 'external') {
      continue;
    }
    return formatTier5Selection(
      item,
      'tier-5',
      `Defensibility Tier 5 — next code milestone (${item.id})`
    );
  }

  return null;
}

function formatTier5Selection(item, tier, reason) {
  return {
    next: {
      track: 'T5',
      milestone: item.id,
      sprint: item.sprint,
      title: item.title,
      workplan: 'docs/operations/tier-5-workplan-2026-06.md',
      framework: 'DTF-001',
    },
    selection: { tier, reason },
  };
}

function selectNextWork() {
  let roadmap = '';
  try {
    roadmap = readFileSync(ROADMAP_PATH, 'utf-8');
  } catch {
    return {
      error: `Roadmap not found at ${ROADMAP_PATH}`,
      next: null,
      selection: null,
    };
  }

  let session = '';
  try {
    session = readFileSync(SESSION_PATH, 'utf-8');
  } catch {
    // session file optional
  }

  // Tier 1: Resume in-progress (Tier 5 or moat dimension)
  const inProgress = parseInProgressSession(session);
  if (inProgress?.track === 'T5') {
    const tier5 = selectTier5NextWork(session);
    if (tier5) return tier5;
  }
  if (inProgress?.dimension) {
    const dim = DIMENSION_ORDER.find((d) => d.id === inProgress.dimension);
    return {
      next: {
        dimension: inProgress.dimension,
        milestone: inProgress.milestone,
        name: dim?.name ?? 'Unknown',
      },
      selection: {
        tier: 'resume',
        reason: `Resuming ${inProgress.milestone} from session pointer`,
      },
    };
  }

  // Tier 2-3: Select lowest-score implementable dimension
  const scores = parseRoadmapScores(roadmap);

  const candidates = DIMENSION_ORDER.filter((d) => !d.external)
    .map((d) => ({
      ...d,
      score: scores.get(d.id) ?? 0,
    }))
    .filter((d) => d.score < 10)
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      if (a.critical !== b.critical) return a.critical ? -1 : 1;
      return a.id.localeCompare(b.id);
    });

  if (candidates.length === 0) {
    const tier5 = selectTier5NextWork(session);
    if (tier5) return tier5;
    return selectExecutionRoadmapFallback(session);
  }

  for (const candidate of candidates) {
    // Score 10 means all implementable milestones are complete
    if (candidate.score >= 10) {
      continue;
    }

    const nextMilestone = guessNextMilestone(candidate.id, candidate.score);

    // Skip external or release-gated milestones — no internal agent work available
    if (nextMilestone.external || nextMilestone.releaseGated) {
      continue;
    }

    return {
      next: {
        dimension: candidate.id,
        milestone: nextMilestone.id,
        name: candidate.name,
        title: nextMilestone.title,
      },
      selection: {
        tier: candidate.critical ? 'critical-path' : 'backlog',
        reason: `Lowest-score implementable dimension: ${candidate.id} (${candidate.score}/10)`,
      },
    };
  }

  const tier5 = selectTier5NextWork(session);
  if (tier5) return tier5;
  return selectExecutionRoadmapFallback(session);
}

function selectOpsDocsFallback(session = '') {
  const completed = parseCompletedOpsDocs(session);
  for (const item of OPS_DOCS_QUEUE) {
    if (completed.has(item.id)) continue;
    return {
      next: {
        track: 'ops-docs',
        milestone: item.id,
        sprint: item.sprint,
        title: item.title,
        paths: item.paths,
        workplan: 'docs/audit/README.md',
      },
      selection: {
        tier: 'ops-docs',
        reason:
          'Tier 5 technical complete; external ceremony blocked — next automatable ops-docs (Protocol 22 Development frame)',
      },
    };
  }
  return null;
}

function certifiedPackManifestReady() {
  const latest = join(
    REPO_ROOT,
    'docs/audit/evidence/certified-pack-manifest-latest.json'
  );
  try {
    readFileSync(latest, 'utf8');
    return true;
  } catch {
    return false;
  }
}

/** When automatable in-repo work is exhausted — commercial ceiling + Class R hygiene (P26). */
function selectBacklogClearGuidance() {
  const commercialDoc =
    'docs/operations/coordination/from-gtcx-core-tier5-commercial-unblock-2026-06-06.md';
  const blockerDoc =
    'docs/operations/coordination/core-004-xr402-blocker-2026-06-04.md';
  const packDone = certifiedPackManifestReady();

  return {
    ok: true,
    backlogClear: !packDone ? false : true,
    automatableExhausted: packDone,
    certificationCeiling: 'tier-5-commercial',
    frame: 'development',
    protocol: '22-agent-work-selection',
    message: packDone
      ? 'Tier 5 technical complete. Commercial ceiling: DTF-5.5.4 LOI (Class S). DTF-5.5.2 pipeline shipped.'
      : 'Run DTF-5.5.2 certified pack pipeline (Class R) before commercial witness-only mode.',
    witness: commercialDoc,
    next: packDone
      ? {
          storyId: 'DTF-5.5.4',
          title: 'Design-partner LOI or regulator letter',
          status: 'awaiting-human',
          blocked: true,
          blocker: 'Class S — GTM / Legal / sovereign program',
          owner: 'Human / GTM',
          implementationClass: 'external',
        }
      : {
          storyId: 'DTF-5.5.2',
          title: 'Certified pack pipeline (content-addressed manifest)',
          status: 'in_progress',
          blocked: false,
          owner: 'gtcx-core',
          implementationClass: 'ops-docs',
        },
    nextPriority: packDone
      ? {
          owner: 'Human / GTM',
          action:
            'DTF-5.5.4 — file redacted LOI or regulator letter in docs/audit/evidence/ (Class S); intelligence/protocols witness only',
          outbound: commercialDoc,
          because: 'Tier 5 commercial gate 5-C2 — engineering pipeline (5.5.2) complete',
        }
      : {
          owner: 'gtcx-core',
          action:
            'Class R: pnpm certified-pack:build-manifest && pnpm certified-pack:verify-manifest (in-session)',
          outbound: 'docs/operations/certified-pack-pipeline.md',
          because: 'DTF-5.5.2 automatable commercial pipeline before LOI gate',
        },
    humanOnly: [
      {
        storyId: 'DTF-5.5.4',
        title: 'Design-partner LOI or regulator letter',
        authorityClass: 'S',
        owner: 'Human / GTM',
      },
    ],
    repoCompletable: packDone
      ? {
          storyId: 'CORE-004',
          action: 'Optional Class R: publish ZKP transcript under artifacts/trusted-setup/',
          priority: 'P3',
        }
      : {
          storyId: 'DTF-5.5.2',
          action: 'pnpm certified-pack:build-manifest && pnpm certified-pack:verify-manifest',
          priority: 'P2',
        },
    deferred: [
      'DTF-5.5.3 predicate-gated export keys (optional)',
      'Production manifest Ed25519 via CSP ceremony (Legal)',
      blockerDoc,
    ],
    selection: {
      tier: packDone ? 'external-attestation' : 'ops-docs',
      reason: packDone
        ? 'DTF-5.5.2 pipeline done; Tier 5 commercial waits on LOI/regulator letter (5.5.4).'
        : 'Execute DTF-5.5.2 certified pack manifest before commercial witness mode.',
    },
    statusUpdate: {
      done: packDone
        ? 'DTF-5.5.2 certified pack manifest built + verified (Class R)'
        : 'DTF-5.5.1 strict packs + DTF-5.5.5 evidence index',
      nextPriority: packDone
        ? '**Human / GTM** — DTF-5.5.4 LOI or regulator letter (Class S only)'
        : '**gtcx-core** — run certified-pack build + verify (Class R)',
      approvalNeeded: packDone ? '**DTF-5.5.4** LOI/regulator letter (Class S)' : undefined,
      deferred: 'DTF-5.5.3 optional; CORE-004 transcript publish (Class R, parallel)',
    },
    communicationPolicy: {
      protocol: '26-agent-proceed-confirmation',
      version: '1.1.0',
      forbiddenReplyPatterns: [
        'Say if you want',
        'Say which blocked track',
        'Your call',
        'Two options',
        'Which do you prefer',
        'anything on the P1 list',
      ],
    },
    agentInstructions: [
      'DTF-5.5.2 = Class R — run certified-pack commands in-session; never list 5.5.2 under Approval needed.',
      'DTF-5.5.4 = Class S only — LOI/regulator letter; agents witness, do not sign.',
      'Use executionBout: drain Class R stories before bout check-in — no stop after one story.',
      'Do not ask the operator which story or repo to pick.',
      `Witness: ${commercialDoc}`,
    ],
  };
}

/** Track B / cross-repo when algorithmic moat has no in-repo code or ops-docs left. */
function selectExecutionRoadmapFallback(session = '') {
  const ops = selectOpsDocsFallback(session);
  if (ops) return ops;

  return selectBacklogClearGuidance();
}

function guessNextMilestone(dimId, score) {
  const map = {
    D1: {
      8: { id: 'M1.4', title: 'Property-based tests (proptest)' },
      9: { id: 'M1.5', title: 'Differential testing (snarkjs / arkworks ref)' },
      10: { id: 'M1.6', title: 'All milestones complete', external: true },
    },
    D2: {
      8: { id: 'M2.1', title: 'Boundary tests' },
      9: { id: 'M2.2', title: 'Fuzzing / randomized witness gen' },
      10: { id: 'M2.3', title: 'All milestones complete', external: true },
    },
    D3: {
      9: { id: 'M3.2', title: 'Trusted-setup verification (release-gated)', releaseGated: true },
      10: { id: 'M3.3', title: 'All milestones complete', external: true },
    },
    D4: {
      9: { id: 'M4.1', title: 'End-to-end integration test' },
      10: { id: 'M4.2', title: 'All milestones complete', external: true },
    },
    D5: {
      9: { id: 'M5.1', title: 'Entropy source audit' },
      10: { id: 'M5.2', title: 'All milestones complete', external: true },
    },
    D6: {
      6: { id: 'M6.3', title: 'CI KAT verification gate' },
      8: { id: 'M6.4', title: 'Cross-implementation validation (snarkjs)' },
      10: { id: 'M6.5', title: 'All milestones complete', external: true },
    },
    D7: {
      6: { id: 'M7.2', title: 'uint64_is_ge audit' },
      8: { id: 'M7.4', title: 'Microbenchmarks (dudect / ctgrind)' },
      9: { id: 'M7.5', title: 'Third-party side-channel assessment', external: true },
      10: { id: 'M7.6', title: 'All milestones complete', external: true },
    },
    D10: {
      8: { id: 'M10.2', title: 'Runtime FIPS enforcement (GTCX_FIPS_STRICT=1)' },
      9: { id: 'M10.3', title: 'Regulator attestation (external)', external: true },
      10: { id: 'M10.4', title: 'All milestones complete', external: true },
    },
  };
  const dimMap = map[dimId];
  if (!dimMap) return { id: '?', title: 'Unknown', external: false, releaseGated: false };
  // Sort keys descending so higher brackets match first (e.g., 9 before 8)
  const sortedKeys = Object.keys(dimMap).sort((a, b) => parseFloat(b) - parseFloat(a));
  const scoreKey = sortedKeys.find((k) => score >= parseFloat(k));
  return dimMap[scoreKey] ?? { id: '?', title: 'Unknown', external: false, releaseGated: false };
}

const result = selectNextWork();
const storyId =
  result.next?.milestone ?? result.next?.handoff ?? result.next?.storyId ?? '';
const title = result.next?.title ?? '';
const ctx = readRepoContext(REPO_ROOT);
const base = { ok: true, repo: THIS_REPO, ...result };
const withBout = attachExecutionBout(base, {
  repoRoot: REPO_ROOT,
  nextWork: base,
  session: ctx.session,
  workplan: ctx.workplan,
});
writeBoutState(REPO_ROOT, withBout.executionBout);
console.log(
  JSON.stringify(
    enrichWithPersona(withBout, { repo: THIS_REPO, storyId, title }),
    null,
    2,
  ),
);
