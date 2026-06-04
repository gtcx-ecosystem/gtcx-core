#!/usr/bin/env node
/**
 * Protocol 22 — deterministic next-work selection for gtcx-core.
 * Reads docs/audit/moat-dimension-roadmap-10-10.md; emits JSON to stdout.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const ROADMAP_PATH = join(REPO_ROOT, 'docs/audit/moat-dimension-roadmap-10-10.md');
const SESSION_PATH = join(REPO_ROOT, '.baseline/memory/session.md');
const TIER5_WORKPLAN_PATH = join(REPO_ROOT, 'docs/operations/tier-5-workplan-2026-06.md');

/** Defensibility Tier 5 + full-audit P0 — ordered implementable milestones (DTF-001). */
const TIER5_MILESTONES = [
  {
    id: 'FA-P0-1',
    title: 'Break workproof/verification turbo cycle (root typecheck)',
    sprint: 'FA-S1',
    workClass: 'code',
  },
  {
    id: 'FA-P0-2',
    title: 'README: library readiness vs DTF Tier 5 split',
    sprint: 'FA-S1',
    workClass: 'ops-docs',
  },
  {
    id: 'DTF-5.1.1',
    title: 'Witness builder: WorkProof → typed witness',
    sprint: 'S-T5-1',
    workClass: 'code',
  },
  {
    id: 'DTF-5.1.2',
    title: 'Commodity-origin R1CS + gh-gold-origin profile + negative tests',
    sprint: 'S-T5-1',
    workClass: 'code',
  },
  {
    id: 'DTF-5.1.3',
    title: 'NAPI prove/verify for gh-gold-origin',
    sprint: 'S-T5-1',
    workClass: 'code',
  },
  {
    id: 'DTF-5.1.4',
    title: 'KAT groth16-gh-gold-origin + CI',
    sprint: 'S-T5-1',
    workClass: 'code',
  },
  {
    id: 'DTF-5.2.1',
    title: 'zw-diamond-origin circuit',
    sprint: 'S-T5-2',
    workClass: 'code',
  },
  {
    id: 'DTF-5.2.2',
    title: 'Verification package integration test',
    sprint: 'S-T5-2',
    workClass: 'code',
  },
  {
    id: 'DTF-5.2.3',
    title: 'KATs for diamond + range circuits',
    sprint: 'S-T5-2',
    workClass: 'code',
  },
  {
    id: 'DTF-5.3.1',
    title: 'gh-cocoa-origin circuit',
    sprint: 'S-T5-3',
    workClass: 'code',
  },
  {
    id: 'DTF-5.3.2',
    title: 'Five-jurisdiction integration fixtures',
    sprint: 'S-T5-3',
    workClass: 'code',
  },
  {
    id: 'DTF-5.3.3',
    title: 'Minerals board UAT protocol template',
    sprint: 'S-T5-3',
    workClass: 'ops-docs',
  },
  {
    id: 'DTF-5.4.1',
    title: 'CircuitRegistry with semver',
    sprint: 'S-T5-4',
    workClass: 'code',
  },
  {
    id: 'DTF-5.4.2',
    title: 'Load test 1000 proofs/min',
    sprint: 'S-T5-4',
    workClass: 'code',
  },
  {
    id: 'DTF-5.4.3',
    title: 'Trust portal circuit IDs',
    sprint: 'S-T5-4',
    workClass: 'ops-docs',
  },
  // gtcx-protocols owner — handoff when reached
  {
    id: 'DTF-5.4.4',
    title: 'gtcx-protocols E2E per circuit ID',
    sprint: 'S-T5-4',
    workClass: 'external',
    owner: 'gtcx-protocols',
  },
  {
    id: 'DTF-5.5.1',
    title: 'Jurisdiction pack Zod CI hardening',
    sprint: 'S-T5-5',
    workClass: 'code',
  },
];

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

function parseCompletedTier5(session, workplan) {
  const done = new Set();
  const re = /(?:DTF-5\.\d+\.\d+|FA-P0-\d+)[^\n]*\|\s*\*\*done\*\*/gi;
  const idRe = /(?:DTF-5\.\d+\.\d+|FA-P0-\d+)/;
  let m;
  const sources = [session, workplan].filter(Boolean);
  for (const src of sources) {
    while ((m = re.exec(src)) !== null) {
      const id = m[0].match(idRe)?.[0];
      if (id) done.add(id);
    }
  }
  return done;
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
    if (item.workClass === 'external') {
      return {
        next: {
          track: 'T5',
          handoff: item.id,
          title: item.title,
          owner: item.owner ?? 'gtcx-protocols',
          milestone: item.id,
          blocked: true,
          blocker: 'Owner repo implementation required',
        },
        selection: {
          tier: 'external',
          reason: `Tier 5 milestone ${item.id} — implement in owner repo per Protocol 24`,
        },
      };
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

/** Ops-docs queue when Tier 5 code complete (Development frame — skip external tier 6). */
const OPS_DOCS_QUEUE = [
  {
    id: 'OPS-AUDIT-FM',
    title: 'Merge duplicate frontmatter on historical audit files',
    sprint: 'HYGIENE',
    workClass: 'ops-docs',
    paths: [
      'docs/audit/full-audit-2026-05-09.md',
      'docs/audit/master-audit-2026-05-27.md',
      'docs/audit/master-audit-2026-05-12.md',
      'docs/audit/10-10-roadmap-2026-05-25.md',
    ],
  },
];

function parseCompletedOpsDocs(session) {
  const done = new Set();
  const re = /(OPS-[A-Z0-9-]+)[^\n]*\|\s*\*\*done\*\*/gi;
  let m;
  while ((m = re.exec(session)) !== null) {
    done.add(m[1].toUpperCase());
  }
  return done;
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

/** Track B / cross-repo when algorithmic moat has no in-repo code or ops-docs left. */
function selectExecutionRoadmapFallback(session = '') {
  const ops = selectOpsDocsFallback(session);
  if (ops) return ops;

  return {
    next: {
      track: 'B',
      handoff: 'CORE-004',
      title: 'D3 M3.2 trusted-setup transcript verify',
      owner: 'gtcx-core',
      blocked: true,
      blocker: 'XR-402 trusted-setup ceremony — release-gated',
    },
    selection: {
      tier: 'external',
      reason:
        'Automatable code and ops-docs exhausted. CORE-004 ceremony blocked — file P24 Blocker Report; do not ask operator to pick backlog.',
    },
  };
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
console.log(JSON.stringify(result, null, 2));
