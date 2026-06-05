#!/usr/bin/env node
/**
 * execute-roadmap + auto-dev-data — sync machine-readable hub state for gtcx-core.
 * Writes docs/audit/auto-dev-data.json and refreshes docs/audit/auto-dev-state.md.
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AUTO_DEV_JSON = join(ROOT, 'docs/audit/auto-dev-data.json');
const AUTO_DEV_MD = join(ROOT, 'docs/audit/auto-dev-state.md');
const LATEST_JSON = join(ROOT, 'docs/audit/latest.json');
const ROADMAP = join(ROOT, 'docs/audit/execution-roadmap.md');
const LAUNCH_FOCUS = join(ROOT, '.baseline/launch-focus.json');

function safeGit(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function readJson(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function runGate(label, cmd) {
  const result = spawnSync(cmd, { shell: true, cwd: ROOT, stdio: 'pipe' });
  return { label, exitCode: result.status ?? 1 };
}

function parseRoadmapMeta(md) {
  const lastReconciled = md.match(/last_reconciled:\s*(\S+)/)?.[1] ?? null;
  const activePhase =
    md.match(/\*\*Active phase:\*\*\s*\*\*([^*]+)\*\*/)?.[1]?.trim() ?? 'unknown';
  return { lastReconciled, activePhase };
}

function fetchP22() {
  const out = execSync('node scripts/agent-next-work.mjs --json', {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return JSON.parse(out);
}

function oiX02WitnessStatus() {
  const inboundAck = join(
    ROOT,
    'docs/operations/coordination/from-gtcx-infrastructure-er-1-08-hub-ack-2026-06-04.md',
  );
  if (existsSync(inboundAck)) return 'done';
  const outbound = join(
    ROOT,
    'docs/operations/coordination/to-gtcx-infrastructure-er-1-08-hub-ack-2026-06-03.md',
  );
  return existsSync(outbound) ? 'outbound-filed' : 'open';
}

function extInf002WitnessStatus() {
  const inboundAck = join(
    ROOT,
    'docs/operations/coordination/from-gtcx-infrastructure-ext-inf-002-ack-2026-06-07.md',
  );
  if (existsSync(inboundAck)) return 'outbound-acknowledged';
  const manifest = join(ROOT, 'docs/audit/evidence/vendor-pen-test-pack-manifest-latest.json');
  return existsSync(manifest) ? 'outbound-filed' : 'open';
}

function buildCrossRepoWitness() {
  const extInfManifest = join(
    ROOT,
    'docs/audit/evidence/vendor-pen-test-pack-manifest-latest.json',
  );
  const extInfStatus = extInf002WitnessStatus();
  return [
    {
      storyId: 'OI-X02',
      status: oiX02WitnessStatus(),
      owner: 'gtcx-infrastructure',
      path:
        oiX02WitnessStatus() === 'done'
          ? 'docs/operations/coordination/from-gtcx-infrastructure-er-1-08-hub-ack-2026-06-04.md'
          : 'docs/operations/coordination/to-gtcx-infrastructure-er-1-08-hub-ack-2026-06-03.md',
    },
    {
      storyId: 'EXT-INF-002',
      status: extInfStatus,
      owner: 'gtcx-infrastructure',
      coreInputReady: existsSync(extInfManifest),
      manifest: 'docs/audit/evidence/vendor-pen-test-pack-manifest-latest.json',
      path:
        extInfStatus === 'outbound-acknowledged'
          ? 'docs/operations/coordination/from-gtcx-infrastructure-ext-inf-002-ack-2026-06-07.md'
          : 'docs/operations/coordination/to-gtcx-infrastructure-ext-inf-002-vendor-pack-2026-06-05.md',
    },
  ];
}

function buildAutoDevData(p22, latest, launchFocus, roadmapMeta, gates) {
  const lanes = latest?.lanes ?? {};
  return {
    schema: 'gtcx.autoDevData.v1',
    repo: 'gtcx-core',
    updated: new Date().toISOString(),
    protocol: 'execute-roadmap',
    baselineCommit: safeGit('git rev-parse HEAD'),
    p22: {
      backlogClear: Boolean(p22.backlogClear),
      automatableExhausted: Boolean(p22.automatableExhausted),
      role: p22.backlogClear ? 'witness_only' : 'implement',
      certificationCeiling: p22.certificationCeiling ?? 'tier-5-commercial',
      nextStoryId: p22.next?.storyId ?? null,
      nextStoryTitle: p22.next?.title ?? null,
      nextStoryStatus: p22.next?.status ?? p22.next?.implementationClass ?? null,
      message: p22.message ?? null,
    },
    launchFocus: launchFocus
      ? {
          sessionMode: launchFocus.sessionMode,
          workSetCounts: launchFocus.workSetCounts,
          statePath: launchFocus.statePath,
        }
      : null,
    executionRoadmap: {
      path: 'docs/audit/execution-roadmap.md',
      lastReconciled: roadmapMeta.lastReconciled,
      activePhase: roadmapMeta.activePhase,
      phases: {
        'FA-S1-P0': 'done',
        'S-T5-1-4': 'done',
        'LAUNCH-PLAN': 'done',
        'FA-S6-core': 'done',
        'S-T5-5-commercial': 'blocked',
      },
    },
    lanes: {
      engineeringCompletenessQuality: {
        internalSignoff: lanes.engineeringCompletenessQuality?.readinessOutcome?.internalSignoff,
        completionAudit: lanes.engineeringCompletenessQuality?.readinessOutcome?.completionAudit,
        index: lanes.engineeringCompletenessQuality?.index,
      },
      internalCompliance: {
        composite: lanes.internalCompliance?.readinessOutcome?.composite,
        index: lanes.internalCompliance?.index,
      },
      industryCompliance: {
        tier: lanes.industryCompliance?.industryComplianceTier,
        status: lanes.industryCompliance?.industryComplianceStatus?.register,
        index: lanes.industryCompliance?.index,
      },
      bankGrade: {
        certifiedComposite: lanes.bankGrade?.readinessOutcome?.certifiedComposite,
        index: lanes.bankGrade?.index,
      },
      gtmReadiness: {
        library: lanes.gtmReadiness?.gtmReadinessTier?.library,
        integratorPilot: lanes.gtmReadiness?.gtmReadinessTier?.integratorPilot,
        ecosystemSovereign: lanes.gtmReadiness?.gtmReadinessTier?.ecosystemSovereign,
        index: lanes.gtmReadiness?.index,
      },
      globalComplianceRating: latest?.globalComplianceRating ?? null,
    },
    humanOnly: (p22.humanOnly ?? []).map((h) => ({
      storyId: h.storyId,
      title: h.title,
      authorityClass: h.authorityClass ?? 'S',
      owner: h.owner ?? 'Human',
    })),
    crossRepoWitness: buildCrossRepoWitness(),
    stories: {
      'LAUNCH-PLAN-01': 'done',
      'LAUNCH-PLAN-02': 'done',
      'LAUNCH-PLAN-03': 'done',
      'LAUNCH-PLAN-04': 'done',
      'LAUNCH-PLAN-05': 'done',
      'FA-S6-01': 'done',
      'FA-S6-02': 'done',
      'FA-S6-03': 'blocked',
      'FA-S6-04': 'blocked',
      'ER-AUTO-DEV-01': 'done',
      'DTF-5.5.4': 'blocked',
      'CORE-004-CEREMONY': 'blocked',
    },
    verificationGates: Object.fromEntries(gates.map((g) => [g.label, { exitCode: g.exitCode }])),
    paths: {
      latestJson: 'docs/audit/latest.json',
      autoDevState: 'docs/audit/auto-dev-state.md',
      autoDevData: 'docs/audit/auto-dev-data.json',
      autoDevTier5: 'docs/audit/auto-dev-state-tier5-commercial.md',
      agentWorkSelection: 'docs/operations/agent-work-selection.md',
      witness: p22.witness ?? null,
    },
  };
}

function buildAutoDevMd(data, p22) {
  const stamp = data.updated.slice(0, 10);
  const humanRows = (data.humanOnly ?? [])
    .filter((h) => !['FA-S6-03', 'FA-S6-04'].includes(h.storyId))
    .map((h) => `| ${h.storyId} | **blocked** | ${h.owner} |`)
    .join('\n');
  const gateRows = Object.entries(data.verificationGates ?? {})
    .map(([k, v]) => `| \`${k}\` | **${v.exitCode === 0 ? '0' : v.exitCode}** |`)
    .join('\n');
  const witnessRows = (data.crossRepoWitness ?? [])
    .map((w) => {
      const detail =
        w.storyId === 'EXT-INF-002' && w.coreInputReady ? ' (core pack ready)' : '';
      return `| ${w.storyId} | ${w.status}${detail} | ${w.owner} |`;
    })
    .join('\n');

  return `---
title: 'Auto-Dev State — gtcx-core'
status: current
updated: '${stamp}'
date: '${stamp}'
owner: gtcx-core
protocol: execute-roadmap
tier: evidence
tags: ['audit', 'agent']
review_cycle: on-change
---

# Auto-dev state — gtcx-core (${stamp})

**Machine-readable:** [\`auto-dev-data.json\`](./auto-dev-data.json)  
**Execution plan:** [\`execution-roadmap.md\`](./execution-roadmap.md)  
**Readiness SSOT:** [\`latest.json\`](./latest.json) · engineering signoff **${data.lanes.engineeringCompletenessQuality?.internalSignoff ?? '—'}**

## Next work (computed)

Run \`pnpm agent:next-work\` for authoritative selection. **${p22.message ?? ''}**

| Field | Value |
| ----- | ----- |
| backlogClear | **${data.p22.backlogClear}** |
| role | ${data.p22.role} |
| certificationCeiling | ${data.p22.certificationCeiling} |
| nextStoryId | **${data.p22.nextStoryId ?? '—'}** |
| launchFocus mode | **${data.launchFocus?.sessionMode ?? '—'}** |

## Active phase

**${data.executionRoadmap.activePhase}** — automatable repo work **exhausted**; Class S wall.

| Story | Status | Owner |
| ----- | ------ | ----- |
| FA-S6-02 vendor pen-test pack | **done** | gtcx-core |
| ER-AUTO-DEV-01 auto-dev-data sync | **done** | gtcx-core |
| FA-S6-03 Zimbabwe / LOI tracker | **blocked** | gtm-lead |
| FA-S6-04 CORE-004 ceremony | **blocked** | custodian |
| DTF-5.5.4 LOI / regulator letter | **blocked** | Human / GTM |
| CORE-004-CEREMONY transcript | **blocked** | Custodian |
${humanRows}

## Lane scores (summary)

| Lane | Metric | Value |
| ---- | ------ | ----- |
| 1 Engineering | internal signoff | **${data.lanes.engineeringCompletenessQuality?.internalSignoff ?? '—'}** |
| 2 Internal | composite | **${data.lanes.internalCompliance?.composite ?? '—'}** |
| 4 Bank-grade | certified composite | **${data.lanes.bankGrade?.certifiedComposite ?? '—'}** |
| 5 GTM | library tier | **${data.lanes.gtmReadiness?.library ?? '—'}** |
| GCR | tier | **${data.lanes.globalComplianceRating?.tier ?? '—'}** (${data.lanes.globalComplianceRating?.status ?? '—'}) |

## Verification (execute-roadmap UAT)

| Command | Exit |
| ------- | ---- |
${gateRows}

## Cross-repo witness

| ID | Status | Owner |
| -- | ------ | ----- |
${witnessRows}

## Resume

1. \`pnpm agent:reconcile-auto-dev\` — refresh JSON + this file after roadmap changes
2. \`pnpm agent:reconcile-launch\` — refresh tier5 commercial mirror
3. Human: **DTF-5.5.4** LOI · **CORE-004-CEREMONY** transcript publish

**Do not hand-edit** \`auto-dev-data.json\` — run \`pnpm agent:reconcile-auto-dev\`.
`;
}

function patchLatestJson() {
  const latest = readJson(LATEST_JSON);
  if (!latest) return;
  latest.autoDevData = 'docs/audit/auto-dev-data.json';
  latest.autoDevState = 'docs/audit/auto-dev-state.md';
  latest.updated = new Date().toISOString().slice(0, 10);
  writeFileSync(LATEST_JSON, `${JSON.stringify(latest, null, 2)}\n`);
}

function patchRoadmapStamp(note) {
  if (!existsSync(ROADMAP)) return;
  let md = readFileSync(ROADMAP, 'utf8');
  const stamp = new Date().toISOString().slice(0, 10);
  md = md.replace(/last_reconciled:\s*\S+/, `last_reconciled: ${stamp}`);
  if (md.includes('reconciliation_note:')) {
    md = md.replace(
      /reconciliation_note:\s*>-\s*\n(?:\s+[^\n]+\n?)*/,
      `reconciliation_note: >-\n  ${note}\n`,
    );
  }
  writeFileSync(ROADMAP, md);
}

function main() {
  const p22 = fetchP22();
  const latest = readJson(LATEST_JSON);
  const launchFocus = readJson(LAUNCH_FOCUS);
  const roadmapMd = existsSync(ROADMAP) ? readFileSync(ROADMAP, 'utf8') : '';
  const roadmapMeta = parseRoadmapMeta(roadmapMd);

  const gates = [
    runGate('pnpm agent:protocols:check', 'pnpm agent:protocols:check'),
    runGate('pnpm readiness:lanes:check', 'pnpm readiness:lanes:check'),
    runGate('pnpm vendor-evidence:verify-manifest', 'pnpm vendor-evidence:verify-manifest'),
    runGate('pnpm docs:check-frontmatter', 'pnpm docs:check-frontmatter'),
  ];

  const data = buildAutoDevData(p22, latest, launchFocus, roadmapMeta, gates);
  writeFileSync(AUTO_DEV_JSON, `${JSON.stringify(data, null, 2)}\n`);
  writeFileSync(AUTO_DEV_MD, buildAutoDevMd(data, p22));
  patchLatestJson();

  const note = `execute-roadmap + auto-dev-data ${data.updated.slice(0, 10)} — ER-AUTO-DEV-01 synced; FA-S6 core done; Class S wall.`;
  patchRoadmapStamp(note);

  console.log(
    JSON.stringify(
      {
        ok: true,
        wrote: [AUTO_DEV_JSON, AUTO_DEV_MD, LATEST_JSON],
        p22Head: data.p22.nextStoryId,
        backlogClear: data.p22.backlogClear,
        gates: data.verificationGates,
      },
      null,
      2,
    ),
  );
}

main();
