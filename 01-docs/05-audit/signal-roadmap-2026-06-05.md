---
title: 'SIGNAL Roadmap — gtcx-core'
status: current
date: 2026-06-05
owner: gtcx-core
command: signal-roadmap
source_assessment: 01-docs/05-audit/signal-assessment-2026-06-05.md
framework: gtcx-docs/01-docs/governance/frameworks/SIGNAL.md
axis: SIGNAL-E
current_overall: L1-high
target_overall: L3-low
baseline_commit: b1d226f
---

# SIGNAL Roadmap — gtcx-core (SIGNAL-E)

**Current overall:** L1 high · **Target:** L3 low (two full levels)  
**Assessment:** [`signal-assessment-2026-06-05.md`](./signal-assessment-2026-06-05.md)

SIGNAL-P in this repo ≈ L0 (no user-facing LLM). All phases advance **SIGNAL-E** only. Standard L1→L2 / L2→L3 checklists are adapted below; criterion numbers reference [SIGNAL.md transition tables](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/01-docs/governance/frameworks/SIGNAL.md).

---

## Level projection

| Dimension            | Current     | After Phase 1 | After Phase 2 | Target     |
| -------------------- | ----------- | ------------- | ------------- | ---------- |
| Systems Architecture | L2 high     | L2 high       | **L3 low**    | L3 low     |
| Tooling              | L2 mid      | **L2 full**   | **L3 low**    | L3 low     |
| Process              | L2 high     | **L2 full**   | **L3 low**    | L3 low     |
| Safeguards           | L2 high     | **L2 full**   | L2 high       | L2 high    |
| Monitoring           | L2 mid      | **L2 high**   | **L2 high**   | L2 high    |
| Team & Ownership     | L1 high     | **L2 low**    | **L2 mid**    | L2 mid     |
| **Overall SIGNAL**   | **L1 high** | **L2 low**    | **L3 low**    | **L3 low** |

---

## PHASE 1 — Advancing to L2 — Target: L1 high → L2 low

**Duration:** 45 days (executable this sprint: Days 1–14)  
**Objective:** Agent instructions and gates are version-controlled, reviewed, owned, and machine-verifiable — integrated engineering intelligence, not ad-hoc augmentation.

### SIGNAL-E adaptation — L1→L2 checklist

| #   | Framework criterion            | gtcx-core adaptation                        | Task                               |
| --- | ------------------------------ | ------------------------------------------- | ---------------------------------- |
| 1   | AI feature in production       | P22 + launch-focus + CI agent smoke         | Already met — verify in checkpoint |
| 2   | **Prompts in Git + PR review** | **`.agent/*` + agent-path PR checklist**    | **SIGNAL-CORE-002 (unlock)**       |
| 3   | Error handling + fallback      | Gate fail-closed + capability posture       | Met — document in checklist        |
| 4   | Latency/error dashboarded      | Gate exits in auto-dev-data                 | SIGNAL-CORE-007                    |
| 5   | Secrets in secrets mgmt        | Protocol 19 vault policy                    | Met — link in AGENTS.md            |
| 6   | Eval suite exists              | protocols + readiness lanes as eval proxy   | SIGNAL-CORE-010                    |
| 7   | Feature flags                  | launch-focus sessionMode + P28 Class S/A/R  | Met — witness mode active          |
| 8   | Cost tracked monthly           | Session duration + baseline cost-stats link | SIGNAL-CORE-007                    |
| —   | **Team: named owner**          | Human Lead + AI reliability mirror          | SIGNAL-CORE-001                    |
| —   | **Gate integrity**             | protocols check exit 0                      | SIGNAL-CORE-011 (Day 0)            |

**Transition unlock (framework):** Prompts in version control with PR review → **SIGNAL-CORE-002**  
**Day 0 prerequisite (blocks DoD verification):** **SIGNAL-CORE-011**

---

### Tasks (execution order)

#### Day 0 — Prerequisite (before unlock DoD)

**[SIGNAL-CORE-011] Fix suggest-persona cross-repo import** — XS — P0

- **Why:** Tooling L2 mid; `agent:protocols:check` exit 1 breaks L1→L2 criterion verification
- **Definition of done:**
  - `03-platform/scripts/agent-next-work.mjs` resolves `suggest-persona` import
  - `pnpm agent:protocols:check` → exit 0
  - `pnpm agent:cross-repo-deps:check` → exit 0
  - CI green on agent-path smoke job

**Implementation (this sprint):**

1. Change import to `gtcx-agentic/13-03-platform/scripts/lib/suggest-persona.mjs` OR add shim at legacy path in gtcx-agentic
2. Extend `03-platform/scripts/agent-cross-repo-deps-check.mjs` to assert import path exists
3. Run V-ladder; commit in gtcx-core (+ agentic if shim)

---

#### Transition unlock — complete before other Phase 1 tasks

**[SIGNAL-CORE-002] Agent PR witness checklist** — S — P0

- **Why:** Maps to L1→L2 criterion **#2** (key unlock) + criterion **#4** partial
- **Definition of done:**
  - `01-docs/04-ops/agent-pr-checklist.md` exists with V-ladder table, attestation block, evidence paths
  - `.github/pull_request_template.md` links checklist for agent-touch paths
  - One merged PR demonstrates checklist + attestation (can be this work)
  - `pnpm agent:attestation:check --pr` documented in checklist

**Implementation (this sprint, after 011):**

1. Copy structure from `01-docs/04-ops/agent-attestation-template.md`
2. Add section: agent-touch globs (`01-docs/01-agents/**`, `03-platform/scripts/agent-*`, `.agent/**`, `.cursor/rules/**`)
3. PR template bullet: "Agent path? Complete agent-pr-checklist"
4. Merge via PR with attestation block

---

#### Parallel unlock — Team dimension (required for overall L2)

**[SIGNAL-CORE-001] Name Human Lead + mirror AI reliability owner** — XS — P0

- **Why:** Team L1 high caps overall at L1; maps to org-ops ownership for agent SLOs
- **Definition of done:**
  - `AGENTS.md` Coordination Contract: Human Lead is a named person (not TBD)
  - Row links protocols `ai-reliability-owner-2026-06-06.md`
  - `01-docs/04-ops/coordination/cross-repo-agent-bridge.md` Latest table updated
  - `grep 'Human Lead' AGENTS.md` shows no TBD

**Blocker:** Human/founder decision — file outbound ticket if name pending > 7 days

---

#### Week 2 — Safeguards + monitoring

**[SIGNAL-CORE-003] Agent failure taxonomy in bridge** — XS — P0

- **Why:** L1→L2 adapted safeguard — classify agent failures before L3 incidents
- **Definition of done:**
  - `cross-repo-agent-bridge.md` §Failure taxonomy with columns: class, agent/persona, gate, remediation
  - Classes: `witness-drift`, `gate-fail`, `class-s-violation`, `cross-repo-stale`, `import-drift`
  - At least one sample row (import-drift from SIGNAL-CORE-011)

**[SIGNAL-CORE-007] Agent run metrics in auto-dev-data** — S — P1

- **Why:** L1→L2 criteria **#4** and **#8**
- **Definition of done:**
  - `01-docs/05-audit/auto-dev-data.json` includes `lastSessionGates: { command, exitCode }[]`
  - `sessionDurationMs` from `.baseline/session-last-start.json` (or equivalent)
  - `pnpm agent:reconcile-auto-dev` regenerates fields
  - `auto-dev-state.md` renders gate summary table

---

#### Week 3 — Machine-readable posture

**[SIGNAL-CORE-010] SIGNAL pointer in latest.json** — XS — P2

- **Why:** L1→L2 criterion **#6** (eval/posture proxy)
- **Definition of done:**
  - `01-docs/05-audit/latest.json` has `signalAssessment: { path, date, overall, target }`
  - Optional: `pnpm check:signal-posture` exits 0 when assessment fresh (< 90 days)

**[SIGNAL-CORE-009] Weekly witness-doc link check** — S — P2

- **Why:** Monitoring L2 mid → L2 high; witness mode sustained
- **Definition of done:**
  - Script or CI job validates links in `01-docs/06-coordination/outbound/*.md` and witness indexes
  - Wired as weekly cron or `pnpm docs:check-links` scoped path
  - One run logged in bridge Latest row

---

#### Week 4–6 — Harden + document met criteria

**[SIGNAL-CORE-L2-DOC] Link GOV-AI-001 in AGENTS.md** — XS — P2

- **Why:** L0→L1 criterion #2 adapted — acceptable use documented
- **Definition of done:** AGENTS.md §4 or governance table links gtcx-docs GOV-AI-001 / agent credential protocol

---

### Re-assessment checkpoint (end Phase 1)

**Do not start Phase 2 until ALL pass.**

| Criterion                           | How to verify                                              | Pass condition                                                       |
| ----------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| L1→L2 #1 Agent substrate production | `pnpm agent:session-start --json`                          | `launchFocus.sessionMode` present                                    |
| L1→L2 #2 Prompts in Git + PR review | File + PR history                                          | Checklist merged; one agent PR with attestation                      |
| L1→L2 #4 Gate telemetry             | `jq .lastSessionGates 01-docs/05-audit/auto-dev-data.json` | Non-empty array                                                      |
| L1→L2 #6 Eval/posture proxy         | `pnpm readiness:lanes:check` + latest.json                 | exit 0; signalAssessment present                                     |
| Team L2 low                         | `grep Human Lead AGENTS.md`                                | Named lead, no TBD                                                   |
| Tooling L2 full                     | `pnpm agent:protocols:check`                               | exit 0                                                               |
| Overall ≥ L2 low                    | Manual scorecard                                           | Team ≥ L2 low; no dimension below L2 low except Systems (L2 high OK) |

```bash
pnpm agent:protocols:check                    # exit 0
pnpm agent:session-start --json | jq '.launchFocus.sessionMode'
pnpm readiness:lanes:check                    # exit 0
pnpm ops:check                                # exit 0
grep -v TBD AGENTS.md | grep 'Human Lead'
jq '.signalAssessment.overall' 01-docs/05-audit/latest.json
```

**Remediation if not met:** Stay in Phase 1; open bridge row with failure class; no Phase 2 tasks until re-run passes. If Human Lead blocked > 14 days, escalate Class R outbound to founder; do not fake L2 overall.

**Phase 1 gate:** Overall SIGNAL ≥ **L2 low**

---

## PHASE 2 — Advancing to L3 — Target: L2 low → L3 low

**Duration:** 60 days after Phase 1 gate  
**Objective:** Named agent engines coordinate through a documented control plane with traceable handoffs and CI integration tests.

**Transition unlock (framework L2→L3 #3):** Distributed tracing across agent boundaries → **SIGNAL-CORE-005**

### Task briefs

| ID                     | Title                          | Effort | Maps to                                     |
| ---------------------- | ------------------------------ | ------ | ------------------------------------------- |
| SIGNAL-CORE-005        | trace_id on outbound tickets   | M      | L2→L3 #3 (unlock — start Phase 2 with this) |
| SIGNAL-CORE-004        | test:agent-integration in CI   | M      | L2→L3 #10                                   |
| SIGNAL-CORE-006        | Semver `.agent/` manifest      | M      | L2→L3 #4                                    |
| SIGNAL-CORE-L3-TOPO    | Agent topology doc             | S      | L2→L3 #1, #2                                |
| SIGNAL-CORE-L3-INC     | Three logged failure incidents | XS     | L2→L3 #7                                    |
| SIGNAL-CORE-L3-METRICS | Per-persona bout export        | S      | L2→L3 #9                                    |

**Deferred (not in gtcx-core):** L2→L3 #5 task queue → gtcx-agentic/baseline-os; #6 fallback model → N/A (no LLM).

### Phase 2 checkpoint

```bash
pnpm test:agent-integration                   # exit 0
pnpm agent:cross-repo-deps:check              # exit 0
# Manual: ≥3 outbound tickets with trace_id in frontmatter
# Manual: 01-docs/architecture/agent-topology-foundation-2026-Q3.md reviewed
```

**Gate:** Systems, Tooling, Process ≥ L3 low; overall ≥ **L3 low**

---

## PHASE 3 — Advancing to L4 (brief)

**Duration:** 90+ days after Phase 2 gate · **Out of current target scope**

**Unlock:** OPA + automated human escalation (L3→L4 #2) → SIGNAL-CORE-008

Autonomous agent PR workflow, ceremony kill-switch drill, Class S gates remain human-only (DTF-5.5.4, CORE-004-CEREMONY).

---

## Critical path

```
SIGNAL-CORE-011 (Day 0)
  → SIGNAL-CORE-002 (L1→L2 unlock)
    → SIGNAL-CORE-001 (Team — parallel but gates overall L2)
      → SIGNAL-CORE-003
        → SIGNAL-CORE-007
          → Phase 1 checkpoint
            → SIGNAL-CORE-005 (L2→L3 unlock)
              → SIGNAL-CORE-004
                → SIGNAL-CORE-006
                  → Phase 2 checkpoint
```

Any delay on **011** or **001** delays overall level advancement.

---

## Quick wins (< 1 week)

| Task            | Effort | Dimension moved        | Visible outcome              |
| --------------- | ------ | ---------------------- | ---------------------------- |
| SIGNAL-CORE-011 | XS     | Tooling L2 mid → high  | protocols check green        |
| SIGNAL-CORE-003 | XS     | Safeguards, Monitoring | Taxonomy live in bridge      |
| SIGNAL-CORE-010 | XS     | Monitoring             | latest.json signalAssessment |
| SIGNAL-CORE-001 | XS     | Team                   | Human Lead named (human)     |

---

## Cross-repo dependencies

| Repo           | Phase | Dependency                             |
| -------------- | ----- | -------------------------------------- |
| gtcx-agentic   | 1     | suggest-persona path or shim           |
| gtcx-protocols | 2     | trace_id SoR, AI reliability owner doc |
| baseline-os    | 2     | cost-stats feed, session trace root    |
