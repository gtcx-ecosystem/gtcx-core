/**
 * Shared work queues for P22 (agent-next-work) and execution bout planning.
 */
export const TIER5_MILESTONES = [
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
    title: 'Five-jurisdiction integration fixtures (redacted)',
    sprint: 'S-T5-3',
    workClass: 'code',
  },
  {
    id: 'DTF-5.3.3',
    title: 'Minerals board UAT protocol (evidence template)',
    sprint: 'S-T5-3',
    workClass: 'ops-docs',
  },
  {
    id: 'DTF-5.4.1',
    title: 'CircuitRegistry with semver + deprecation',
    sprint: 'S-T5-4',
    workClass: 'code',
  },
  {
    id: 'DTF-5.4.2',
    title: 'Load test 1000 proofs/min + evidence JSON',
    sprint: 'S-T5-4',
    workClass: 'code',
  },
  {
    id: 'DTF-5.4.3',
    title: 'Trust portal circuit ID column',
    sprint: 'S-T5-4',
    workClass: 'ops-docs',
  },
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
  {
    id: 'DTF-5.5.2',
    title: 'Certified pack pipeline (signed manifest)',
    sprint: 'S-T5-5',
    workClass: 'ops-docs',
  },
  {
    id: 'DTF-5.5.3',
    title: 'Predicate-gated export keys (optional)',
    sprint: 'S-T5-5',
    workClass: 'code',
    deferred: true,
  },
  {
    id: 'DTF-5.5.4',
    title: 'Design-partner LOI or regulator letter',
    sprint: 'S-T5-5',
    workClass: 'external',
    authorityClass: 'S',
  },
  {
    id: 'DTF-5.5.5',
    title: 'Evidence index entry (Tier 5 technical exit)',
    sprint: 'S-T5-5',
    workClass: 'ops-docs',
  },
];

export const OPS_DOCS_QUEUE = [
  {
    id: 'OPS-AUDIT-FM',
    title: 'Merge duplicate frontmatter on historical audit files',
    sprint: 'HYGIENE',
    workClass: 'ops-docs',
    paths: [
      '01-docs/05-audit/full-audit-2026-05-09.md',
      '01-docs/05-audit/master-audit-2026-05-27.md',
      '01-docs/05-audit/master-audit-2026-05-12.md',
      '01-docs/05-audit/10-10-roadmap-2026-05-25.md',
    ],
  },
];

export function parseCompletedTier5(session, workplan) {
  const done = new Set();
  const re = /(?:DTF-5\.\d+\.\d+|FA-P0-\d+|OPS-[A-Z0-9-]+)[^\n]*\|\s*\*\*done\*\*/gi;
  const idRe = /(?:DTF-5\.\d+\.\d+|FA-P0-\d+|OPS-[A-Z0-9-]+)/;
  let m;
  for (const src of [session, workplan].filter(Boolean)) {
    while ((m = re.exec(src)) !== null) {
      const id = m[0].match(idRe)?.[0];
      if (id) done.add(id);
    }
  }
  return done;
}

export function parseCompletedOpsDocs(session) {
  const done = new Set();
  const re = /(OPS-[A-Z0-9-]+)[^\n|]*\|[^\n]*\*\*done\*\*/gi;
  let m;
  while ((m = re.exec(session)) !== null) {
    done.add(m[1].toUpperCase());
  }
  return done;
}

export function parseCompletedLaunchPlan(session) {
  const done = new Set();
  const re = /(LAUNCH-PLAN-\d{2})[^\n|]*\|[^\n]*\*\*done\*\*/gi;
  let m;
  while ((m = re.exec(session)) !== null) {
    done.add(m[1].toUpperCase());
  }
  return done;
}

const LAUNCH_PLAN_IDS = [
  'LAUNCH-PLAN-01',
  'LAUNCH-PLAN-02',
  'LAUNCH-PLAN-03',
  'LAUNCH-PLAN-04',
  'LAUNCH-PLAN-05',
];

export function isLaunchPlanComplete(session) {
  const completed = parseCompletedLaunchPlan(session);
  return LAUNCH_PLAN_IDS.every((id) => completed.has(id));
}
