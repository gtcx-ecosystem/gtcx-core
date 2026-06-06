---
title: 'SIGNAL Full Assessment — gtcx-core'
status: current
date: 2026-06-05
owner: gtcx-core
command: signal-full
framework: gtcx-docs/01-docs/governance/frameworks/SIGNAL.md
scope: gtcx-core (cryptographic foundation + agentic witness layer)
overall_signal: L1-high
target_signal: L3-low
baseline_commit: b1d226f
supersedes: 01-docs/05-audit/signal-assessment-2026-06-07.md
---

# SIGNAL Full Assessment (2026-06-05)

**Scope:** `gtcx-core` — TypeScript/Rust cryptographic foundation, Protocol 22–28 agent substrate, audit evidence packs.  
**Framework:** [SIGNAL.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/01-docs/governance/frameworks/SIGNAL.md) — overall level = **lowest** dimension.  
**Axes note:** No production **user-facing LLM** path in this repo (**SIGNAL-P ≈ L0**). Assessment scores **SIGNAL-E** — agentic engineering, crypto safeguards, and cross-repo witness infrastructure.

**Evidence anchors (this run):**

| Check                                          | Result     | Notes                                    |
| ---------------------------------------------- | ---------- | ---------------------------------------- |
| `git log -1`                                   | `b1d226f`  | WIT-S1 execute-roadmap reconcile         |
| `pnpm check:workspace-root-cleanliness:strict` | exit 0     | ER-HYG-01 closed                         |
| `pnpm vendor-evidence:verify-manifest`         | exit 0     | ER-VEND-01 closed                        |
| `pnpm agent:protocols:check`                   | **exit 0** | SIGNAL-CORE-011 closed — import resolver |
| `.baseline/launch-focus.json`                  | valid      | witness mode, 3 human gates              |
| `AGENTS.md` Human Lead                         | **TBD**    | overall ceiling unchanged                |

---

# PHASE 1 — SIGNAL AUDIT

## Scorecard

| Dimension            | Level       | Gap to Next                                 | Primary Blocker                                                                          |
| -------------------- | ----------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Systems Architecture | **L2 high** | L3 — orchestrator + inter-agent tracing     | P22/launch-focus control plane in-repo; no distributed trace across agent handoffs       |
| Tooling              | **L2 high** | L3 — LangSmith/OTel per agent boundary      | Protocols gate restored; cross-repo resolver                                             |
| Process              | **L2 high** | L3 — semver prompts + agent integration CI  | P22–P28 + attestation; WIT-S1 witness discipline; markdown prompts not semver-per-engine |
| Safeguards           | **L2 high** | L3 — per-agent fallback + scoped IAM        | `safety-rules.json`, P28 Class S/A/R, capability posture doc; no OPA on agent writes     |
| Monitoring           | **L2 mid**  | L2 high — agent run SLO + failure taxonomy  | `auto-dev-data.json`, bout-progress, readiness lanes; gate exit not dashboarded          |
| Team & Ownership     | **L1 high** | L2 — named Human Lead + AI reliability link | **AGENTS.md Human Lead: TBD**                                                            |
| **Overall SIGNAL**   | **L1 high** | **L3 low** (two levels)                     | **Team & Ownership**                                                                     |

> Conservative rule: Team at L1 high caps overall below L2 until Human Lead and agentic reliability ownership are production-real in this repo.

## Dimension detail

### Systems Architecture — L2 high

**Evidence:**

- Protocol 22 selector — `backlogClear: true`, `witness_only`, commercial ceiling DTF-5.5.4.
- Launch focus SoR (`.baseline/launch-focus.json`) — northStar, witness session, human work set.
- Execution bout + execute-roadmap WIT-S1 closed (ER-HYG-01, ER-DTF554-01, ER-VEND-01).
- Cross-repo coordination bridge + DTF-554 LOI packet + witness index (awaiting-human).
- baseline-os session chain: Phase 0b autonomy + capability manifest.
- 21 TS packages + 6 Rust crates; `pnpm architecture:check`.

**Gaps to L3:** No orchestrator service routing named agents; no durable agent task queue in foundation repo; no distributed trace trees on coordination handoffs.

### Tooling — L2 mid (downgraded from L2 high)

**Evidence:**

- Agent ops: `agent:session-start`, `agent:environment:check`, `agent:protocols:check`, `agent:reconcile-auto-dev`, attestation gates.
- CI `.github/workflows/ci.yml` — agent smoke + V-ladder (committed; local drift possible).
- Evidence: `certified-pack:*`, `vendor-evidence:*`, trusted-setup verify.
- Agent capability posture + environment autonomy wired (baseline-os SSOT).

**Gaps / regression:**

- **`pnpm agent:protocols:check` exit 1** — import `gtcx-agentic/03-platform/scripts/lib/suggest-persona.mjs` broken (actual path `13-03-platform/scripts/lib/`).
- Cross-repo coupling without pinned semver contract on agentic script layout.
- No LangSmith/promptfoo (N/A for in-repo LLM).

### Process — L2 high

**Evidence:**

- AGENTS.md §1.6 startup: P22 → P24 → P26+P28 → P27 V-ladder.
- Agent capability posture forbids deferring gates to human (P27 culture).
- Execute-roadmap reconcile discipline; WIT-S1 sprint closure documented.
- DTF-554 Class S packet prepared; human-gates manifest synced.

**Gaps to L3:** Agent partials (`.agent/*`) not semver-tagged; no `test:agent-integration` in core CI; witness ceiling by selector logic not OPA.

### Safeguards — L2 high

**Evidence:**

- `01-docs/01-agents/safety-rules.json` — SR-001/002 enforced.
- P28 authority classes in proceed brief + launch-focus human lanes.
- Crypto fail-closed; FIPS paths; trusted-setup verify gate.
- Agent environment autonomy checker (Phase 0b).

**Gaps to L3:** No OPA for Class A writes; no per-agent IAM kill-switch in foundation repo; failure taxonomy not in bridge yet.

### Monitoring — L2 mid

**Evidence:**

- `01-docs/05-audit/latest.json` — five-lane readiness, GCR/IC tiers.
- `auto-dev-data.json` — P22 posture, launchFocus summary, execution roadmap meta.
- Bout progress gauge; `pnpm readiness:lanes:check`, `pnpm ops:check`.

**Gaps:** No per-agent error-rate SLOs; no gate-exit telemetry in auto-dev-data; IC-T0 (0/12) caps buyer monitoring narrative.

### Team & Ownership — L1 high

**Evidence:**

- Four role files under `01-docs/01-agents/roles/`.
- Coordination contract trust thresholds in AGENTS.md.
- Ecosystem AI reliability charter in protocols (not mirrored in core table).

**Gaps:** **Human Lead: TBD**; no core-named AI/agent reliability owner; Class S gates lack on-call linkage from core.

## Key findings

| Theme                         | Assessment                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Primary constraint**        | **Team & Ownership** — Human Lead unset                                                                                        |
| **Highest-leverage move**     | Name Human Lead + fix agentic import path (restores protocols gate)                                                            |
| **Transition unlock (L1→L2)** | Written ownership in AGENTS.md + stable `agent:protocols:check` exit 0                                                         |
| **Transition unlock (L2→L3)** | Distributed tracing on coordination tickets (`GTCX_AGENT_TRACE_ID`)                                                            |
| **Strengths**                 | Deepest P22–28 enforcement in foundation; WIT-S1 evidence closure; capability/autonomy posture; crypto fail-closed             |
| **Risks**                     | Protocols gate regression on sibling layout drift; overall capped at L1 while other dims L2; Class S wall misread as stop-work |

---

# PHASE 2 — TASKS

## Summary table

| ID              | Title                                          | Type       | Priority | Effort | Dimension(s)           |
| --------------- | ---------------------------------------------- | ---------- | -------- | ------ | ---------------------- |
| SIGNAL-CORE-001 | Name Human Lead + mirror AI reliability owner  | Unlock     | P0       | XS     | Team                   |
| SIGNAL-CORE-011 | Fix suggest-persona import path (gtcx-agentic) | Unlock     | P0       | XS     | Tooling, Process       |
| SIGNAL-CORE-002 | Agent PR witness checklist + CI comment        | Unlock     | P0       | S      | Process, Monitoring    |
| SIGNAL-CORE-003 | Agent failure taxonomy in bridge               | Unlock     | P0       | XS     | Safeguards, Monitoring |
| SIGNAL-CORE-004 | `pnpm test:agent-integration` smoke in CI      | Advance    | P1       | M      | Systems, Process       |
| SIGNAL-CORE-005 | trace_id on outbound coordination tickets      | Foundation | P1       | M      | Systems                |
| SIGNAL-CORE-007 | Agent run metrics in auto-dev-data             | Advance    | P1       | S      | Monitoring             |
| SIGNAL-CORE-006 | Semver agent partials manifest                 | Foundation | P2       | M      | Process                |
| SIGNAL-CORE-009 | Weekly witness-doc link check                  | Strengthen | P2       | S      | Monitoring             |
| SIGNAL-CORE-010 | SIGNAL pointer in latest.json + check script   | Strengthen | P2       | XS     | Monitoring             |
| SIGNAL-CORE-008 | OPA sketch for P28 Class A crypto writes       | Foundation | P3       | L      | Safeguards             |

---

## P0 — Unlock

### [SIGNAL-CORE-001] Name Human Lead + mirror ecosystem AI reliability owner

- **Type:** Unlock | **Priority:** P0 | **Effort:** XS
- **Dimension(s):** Team
- **Level impact:** Team L1 high → L2 low; raises overall ceiling toward L2
- **Current:** `AGENTS.md` — **Human Lead: TBD**
- **Target:** Named lead + link protocols `ai-reliability-owner-2026-06-06.md`
- **Implementation:** Update AGENTS.md §Coordination Contract; bridge Latest row
- **Dependencies:** Human/founder decision

### [SIGNAL-CORE-011] Fix suggest-persona cross-repo import path

- **Type:** Unlock | **Priority:** P0 | **Effort:** XS
- **Dimension(s):** Tooling, Process
- **Level impact:** Tooling L2 mid → L2 high
- **Current:** `agent-next-work.mjs` imports missing `gtcx-agentic/03-platform/scripts/lib/suggest-persona.mjs`
- **Target:** Import resolves to `13-03-platform/scripts/lib/suggest-persona.mjs` or re-export shim; `pnpm agent:protocols:check` exit 0
- **Implementation:** Fix import in `03-platform/scripts/agent-next-work.mjs` + `agent:cross-repo-deps:check` guard; mirror fix in gtcx-agentic if shim preferred
- **Dependencies:** None

### [SIGNAL-CORE-002] Agent PR witness checklist

- **Type:** Unlock | **Priority:** P0 | **Effort:** S
- **Dimension(s):** Process, Monitoring
- **Level impact:** Process L2 high → L2 full; Monitoring L2 mid → L2 high
- **Current:** P27 requires in-session gates; uneven PR evidence
- **Target:** PR template + checklist: V-ladder exits, attestation, evidence paths
- **Implementation:** `01-docs/04-ops/agent-pr-checklist.md`; link from PR template
- **Dependencies:** SIGNAL-CORE-001 (owner attribution)

### [SIGNAL-CORE-003] Agent failure taxonomy in coordination log

- **Type:** Unlock | **Priority:** P0 | **Effort:** XS
- **Dimension(s):** Safeguards, Monitoring
- **Implementation:** Add taxonomy to `cross-repo-agent-bridge.md`: `witness-drift`, `gate-fail`, `class-s-violation`, `cross-repo-stale`, `import-drift`

---

## P1 — Advance

### [SIGNAL-CORE-004] Agent integration test smoke in CI

- **Type:** Advance | **Priority:** P1 | **Effort:** M
- **Level impact:** Systems L2 high → L3 low (L2→L3 criterion #10)
- **Implementation:** `03-platform/scripts/test-agent-integration.mjs` — session-start JSON, launch-focus schema, protocols check; wire in `ci.yml`

### [SIGNAL-CORE-005] trace_id on coordination tickets

- **Type:** Foundation | **Priority:** P1 | **Effort:** M
- **Level impact:** Systems L2 high → L3 low (L2→L3 criterion #3)
- **Implementation:** Propagate `GTCX_AGENT_TRACE_ID` from `agent:session-start --json` into outbound ticket frontmatter

### [SIGNAL-CORE-007] Agent run metrics in auto-dev-data

- **Type:** Advance | **Priority:** P1 | **Effort:** S
- **Implementation:** Extend `reconcile-auto-dev-data.mjs` with last session gate exits + duration

---

## P2/P3

- **SIGNAL-CORE-006** — Semver `.agent/` manifest (P2, M)
- **SIGNAL-CORE-009** — Weekly witness-doc link check (P2, S)
- **SIGNAL-CORE-010** — `latest.json` signalAssessment pointer (P2, XS)
- **SIGNAL-CORE-008** — OPA sketch Class A crypto writes (P3, L)

---

## Sprint Zero (top 5)

1. **SIGNAL-CORE-011** — Restore protocols gate (XS, immediate)
2. **SIGNAL-CORE-001** — Name Human Lead (XS, human)
3. **SIGNAL-CORE-003** — Failure taxonomy (XS)
4. **SIGNAL-CORE-002** — Agent PR checklist (S)
5. **SIGNAL-CORE-007** — Gate metrics in auto-dev-data (S)

---

# PHASE 3 — ROADMAP

**Current overall:** **L1 high**  
**Target:** **L3 low** (two full levels above current)

## Level projection

| Dimension            | Now         | After Phase 1 (L2) | After Phase 2 (L3) |
| -------------------- | ----------- | ------------------ | ------------------ |
| Systems Architecture | L2 high     | L2 high            | **L3 low**         |
| Tooling              | L2 mid      | **L2 full**        | **L3 low**         |
| Process              | L2 high     | **L2 full**        | **L3 low**         |
| Safeguards           | L2 high     | **L2 full**        | L2 high            |
| Monitoring           | L2 mid      | **L2 high**        | **L2 high**        |
| Team & Ownership     | L1 high     | **L2 low**         | **L2 mid**         |
| **Overall**          | **L1 high** | **L2 low**         | **L3 low**         |

---

## PHASE 1 — Advancing to L2 (Integrated agentic engineering)

**Duration:** 3–5 weeks  
**Key unlock (SIGNAL-E adapted):** Named ownership + agent paths in Git with PR review + stable protocol gates

| #   | Criterion (adapted)                   | Task                             |
| --- | ------------------------------------- | -------------------------------- |
| 1   | Agent tooling in >50% sessions        | Met — enforce CI smoke           |
| 2   | Agent policy documented               | GOV-AI-001 link in AGENTS.md     |
| 3   | No PII in agent outputs without scrub | Coordination redaction only      |
| 4   | Agent-path PR review                  | SIGNAL-CORE-002                  |
| 5   | Named human + AI reliability owner    | SIGNAL-CORE-001                  |
| 6   | Agent failures classified             | SIGNAL-CORE-003                  |
| 7   | Posture machine-readable              | SIGNAL-CORE-007, SIGNAL-CORE-010 |
| 8   | Protocol gates exit 0 on main         | **SIGNAL-CORE-011**              |

### Implementation-ready checklist (Phase 1)

**Week 1**

- [ ] SIGNAL-CORE-011 — fix import; `pnpm agent:protocols:check` exit 0; `pnpm agent:cross-repo-deps:check` exit 0
- [ ] SIGNAL-CORE-001 — update AGENTS.md Human Lead (requires human)
- [ ] SIGNAL-CORE-003 — failure taxonomy in bridge (30 min)

**Week 2**

- [ ] SIGNAL-CORE-002 — `agent-pr-checklist.md` + PR template link
- [ ] SIGNAL-CORE-007 — `lastSessionGates` in auto-dev-data.json

**Week 3**

- [ ] SIGNAL-CORE-010 — `latest.json` `signalAssessment` pointer
- [ ] Re-run `signal-full`; confirm Tooling ≥ L2 full

**Week 4–5**

- [ ] Re-assessment checkpoint (below)

### Re-assessment checkpoint (end Phase 1)

```bash
pnpm agent:protocols:check                    # exit 0
pnpm agent:session-start --json | jq '.nextWork.backlogClear'
pnpm readiness:lanes:check                    # exit 0
grep -v 'TBD' AGENTS.md | grep 'Human Lead'   # named lead present
```

**Gate to Phase 2:** Team ≥ L2 low; Tooling/Process ≥ L2 full; Monitoring ≥ L2 high; overall ≥ **L2 low**.

---

## PHASE 2 — Advancing to L3 (Orchestrated agent boundaries)

**Duration:** 6–10 weeks after Phase 1 gate  
**Key unlock:** Distributed tracing across agent boundaries

| #   | L2→L3 criterion               | Task                                         |
| --- | ----------------------------- | -------------------------------------------- |
| 1   | Two+ named agent engines      | Persona roles → topology doc                 |
| 2   | Orchestrator routes tasks     | Document P22 + launch-focus as control plane |
| 3   | Inter-agent tracing           | SIGNAL-CORE-005                              |
| 4   | Per-agent prompt version      | SIGNAL-CORE-006                              |
| 5   | Durable task queue            | Defer to gtcx-agentic / baseline-os          |
| 10  | Agent integration tests in CI | SIGNAL-CORE-004                              |

### Re-assessment checkpoint (end Phase 2)

```bash
pnpm test:agent-integration                   # exit 0
pnpm agent:cross-repo-deps:check              # exit 0
# Manual: outbound ticket with trace_id + hub correlation
```

**Gate to Phase 3 preview:** Systems/Tooling/Process ≥ L3 low; overall ≥ **L3 low**.

---

## PHASE 3 — L4 preview (autonomous engineering workflows)

Policy layer (OPA) + Class A ceremony gating (SIGNAL-CORE-008); autonomous agent PR with human merge only; Class S gates (DTF-5.5.4 LOI, CORE-004-CEREMONY) remain human-only.

---

## Critical path

```
SIGNAL-CORE-011 (gate restore)
  → SIGNAL-CORE-001 (owner)
    → SIGNAL-CORE-003 (taxonomy)
      → SIGNAL-CORE-002 (PR witness)
        → SIGNAL-CORE-007 (metrics)
          → SIGNAL-CORE-005 (trace_id)
            → SIGNAL-CORE-004 (integration CI)
              → L3 re-assessment
```

## Quick wins (< 1 week)

| Task            | Effort | Outcome                             |
| --------------- | ------ | ----------------------------------- |
| SIGNAL-CORE-011 | XS     | Protocols gate exit 0               |
| SIGNAL-CORE-003 | XS     | Safeguards + monitoring signal      |
| SIGNAL-CORE-010 | XS     | Machine-readable SIGNAL pointer     |
| SIGNAL-CORE-001 | XS     | Unblocks overall L2 ceiling (human) |

---

## Cross-repo dependencies

| Sibling             | Item                      | Role                      |
| ------------------- | ------------------------- | ------------------------- |
| gtcx-agentic        | suggest-persona path      | P0 gate restore           |
| gtcx-protocols      | SIGNAL-007 trace root     | trace_id SoR              |
| baseline-os         | session chain, cost-stats | Monitoring feed           |
| gtcx-infrastructure | LLM dashboard             | SIGNAL-P path (link only) |
