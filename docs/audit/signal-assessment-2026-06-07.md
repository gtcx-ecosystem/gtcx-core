---
title: 'SIGNAL Full Assessment — gtcx-core'
status: current
date: 2026-06-07
owner: gtcx-core
command: signal-full
framework: gtcx-docs/docs/governance/frameworks/SIGNAL.md
scope: gtcx-core (cryptographic foundation + agentic witness layer)
overall_signal: L1-high
target_signal: L3-low
baseline_commit: 3d8a87f
---

# SIGNAL Full Assessment (2026-06-07)

**Scope:** `gtcx-core` — TypeScript/Rust cryptographic foundation, Protocol 22–28 agent substrate, audit evidence packs.  
**Framework:** [SIGNAL.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/frameworks/SIGNAL.md) — overall level = **lowest** dimension.  
**Axes note:** No production **user-facing LLM** path in this repo (**SIGNAL-P ≈ L0**). Assessment scores **SIGNAL-E** — agentic engineering, crypto safeguards, and cross-repo witness infrastructure. Product AI maturity lives in `gtcx-intelligence`, `gtcx-infrastructure` (compliance-gateway), `gtcx-mobile`.

**Evidence anchors:** `docs/audit/latest.json` (engineering signoff **10/10**, bank-grade **8.9**), `pnpm agent:protocols:check` exit 0, CI `agent:next-work` + `agent:protocols:check`, Protocol 27 V-ladder in `AGENTS.md`, `backlogClear: true` witness wall.

---

# PHASE 1 — SIGNAL AUDIT

## Scorecard

| Dimension            | Level       | Gap to Next                                 | Primary Blocker                                                                               |
| -------------------- | ----------- | ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Systems Architecture | **L2 high** | L3 — orchestrator + inter-agent tracing     | P22/launch-focus control plane in-repo; no distributed trace across agent handoffs            |
| Tooling              | **L2 high** | L3 — LangSmith/OTel per agent boundary      | 20+ `agent:*` gates, turbo/vitest/cargo CI; no LLM observability stack (N/A for core paths)   |
| Process              | **L2 high** | L3 — semver prompts + agent integration CI  | P22–P28 production-real + attestation; markdown prompts not semver-per-engine                 |
| Safeguards           | **L2 high** | L3 — per-agent fallback + scoped IAM        | `safety-rules.json`, P28 Class S/A/R, crypto CODEOWNER gates; no OPA/Presidio on agent writes |
| Monitoring           | **L2 mid**  | L2 high — agent run SLO + failure taxonomy  | `auto-dev-data.json`, bout-progress, readiness lanes; no per-agent error/cost dashboard       |
| Team & Ownership     | **L1 high** | L2 — named Human Lead + AI reliability link | **AGENTS.md Human Lead: TBD**; ecosystem owner not mirrored in coordination table             |
| **Overall SIGNAL**   | **L1 high** | **L3 low** (two levels)                     | **Team & Ownership**                                                                          |

> Conservative rule: Team at L1 high caps overall below L2 until core human lead and agentic reliability ownership are production-real in this repo.

## Dimension detail

### Systems Architecture — L2 high

**Evidence (production-real):**

- Protocol 22 selector (`scripts/agent-next-work.mjs`) — `backlogClear`, `automatableExhausted`, Class S wall, commercial ceiling.
- Launch focus SoR (`.baseline/launch-focus.json`) — witness/implement/human work sets; `pnpm agent:reconcile-launch`.
- Execution bout (`agent-execution-bout.mjs`) — Class R drain before check-in; bout-progress gauge.
- Cross-repo coordination bridge + inbound/outbound tickets (OI-X02, EXT-INF-002 closed/acknowledged).
- baseline-os shims: `pnpm session`, `next`, `gates`, `hub` (`package.json`).
- 21 TypeScript packages + 6 Rust crates; one-way dependency graph (`pnpm architecture:check`).

**Gaps to L3:**

- No orchestrator service routing named agents (personas are doc-selected, not service-routed).
- No durable agent task queue (Temporal/BullMQ) in foundation repo.
- No distributed trace trees across agent handoffs (baseline `GTCX_AGENT_TRACE_ID` lives in protocols slice, not wired here).

### Tooling — L2 high

**Evidence:**

- Agent ops cluster: `agent:session-start`, `agent:next-work`, `agent:protocols:check`, `agent:cross-repo-deps:check`, `agent:git-push`, `agent:reconcile-auto-dev`, `agent:attestation:check`.
- CI (`.github/workflows/ci.yml`): `agent:next-work` smoke, `agent:protocols:check`, full V-ladder gates.
- Evidence pipelines: `certified-pack:*`, `vendor-evidence:*`, `ops:trusted-setup:verify-publish`.
- Machine-readable audit: `docs/audit/latest.json`, `auto-dev-data.json`, five-lane readiness model.
- Rust + TS test matrix; turbo orchestration; `pnpm quality:governance:check`.

**Gaps to L3:**

- No LangSmith/Braintrust/Helicone (appropriate — no in-repo LLM inference path).
- No promptfoo eval on agent-touching PRs (forensic prompts in gtcx-docs framework, not semver-per-agent here).
- `agent:universal:check` delegates to gtcx-agentic — not a full integration test suite in core CI.

### Process — L2 high

**Evidence:**

- Mandatory startup (AGENTS.md §1.6): baseline → session → P22 → P24 → P26+P28 → P27 V-ladder.
- Work register (`docs/operations/agent-work-selection.md`) with Class R/S and DTF-5.5.4 commercial ceiling rules.
- Proceed Brief + authority class (Protocol 26/28); commit attestation for agent-path changes.
- Execute-roadmap + tier-5 workplan reconcile discipline; coordination witness docs (DTF-5.5.4 tracker).
- Conventional commits; husky; `docs:check-frontmatter` 303+ files.

**Gaps to L3:**

- Agent instructions are markdown partials (`.agent/*`), not semver-tagged per engine.
- No dedicated `pnpm test:agent-integration` in core CI (protocols has SIGNAL-007 pattern).
- `witness_only` ceiling enforced by selector logic, not OPA/policy gate.

### Safeguards — L2 high

**Evidence:**

- `docs/agents/safety-rules.json` — SR-002 no raw AI approval; SR-001 never skip CI; structured enforcement.
- Security-sensitive package list + crypto-security-engineer role gate.
- P28 authority classes (S/A/R) in proceed brief and launch-focus human lanes.
- Crypto fail-closed: no mock primitives; FIPS enforcement paths; trusted-setup verify gate.
- Cross-repo deps check prevents silent sibling drift; agent git-push via node spawn (IDE-safe).

**Gaps to L3:**

- No OPA policy layer for Class A agent writes (sketch in protocols, not core).
- No per-agent IAM scoping or kill-switch feature flags in foundation repo.
- No automated agent failure taxonomy in core coordination log (protocols SIGNAL-006 template).

### Monitoring — L2 mid

**Evidence:**

- `docs/audit/latest.json` — lane indexes, GCR/IC tiers, verification gate registry.
- `auto-dev-state.md` + `pnpm agent:reconcile-auto-dev` — machine posture after roadmap changes.
- Bout progress gauge (`agent:bout-progress`) — engineering vs GTM buyer dimensions.
- `pnpm readiness:lanes:check`, `pnpm ops:check` in baseline session chain.

**Gaps to L2 high / L3:**

- No per-agent error-rate or handoff-latency SLOs.
- No weekly agent eval report for witness-doc accuracy.
- No live dashboard linking core agent runs to baseline `cost-stats` (LLM N/A; agent time/cost uninstrumented).
- Industry compliance IC-T0 (0/12) caps GCR narrative — separate from SIGNAL-E but affects buyer monitoring story.

### Team & Ownership — L1 high

**Evidence:**

- Four role files under `docs/agents/roles/` (protocol-architect, crypto-security-engineer, etc.).
- Coordination contract: Builder/Reviewer/Coordinator trust thresholds in AGENTS.md.
- Ecosystem AI reliability charter filed in protocols (`ai-reliability-owner-2026-06-06.md`).
- gtcx-agentic human gate register lists DTF-5.5.4 awaiting-human with core witness link.

**Gaps to L2:**

- **Human Lead: TBD** (`AGENTS.md` coordination table).
- No core-specific AI/agent reliability owner named in-repo.
- Class S gates (DTF-5.5.4, CORE-004-CEREMONY) have owners documented but no on-call linkage from core.

## Key findings

| Theme                         | Assessment                                                                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Primary constraint**        | **Team & Ownership** — Human Lead unset; ecosystem AI owner not mirrored in core AGENTS.md                                             |
| **Highest-leverage move**     | Name core Human Lead + link protocols AI reliability owner; add agent failure taxonomy to bridge                                       |
| **Transition unlock (L1→L2)** | Written ownership row in AGENTS.md + agent PR witness checklist enforced on agent-touch PRs                                            |
| **Transition unlock (L2→L3)** | Distributed tracing across agent boundaries (`GTCX_AGENT_TRACE_ID` on coordination tickets)                                            |
| **Strengths**                 | Deepest Protocol 22–28 enforcement in foundation layer; crypto fail-closed; evidence pack discipline; P27 in-session execution culture |
| **Risks**                     | Overall capped at L1 while Process/Tooling are L2 high; Class S commercial wall (DTF-5.5.4) misread as "stop engineering"              |

---

# PHASE 2 — TASKS

## Summary table

| ID              | Title                                                                    | Type       | Priority | Effort | Dimension(s)           |
| --------------- | ------------------------------------------------------------------------ | ---------- | -------- | ------ | ---------------------- |
| SIGNAL-CORE-001 | Name Human Lead + mirror ecosystem AI reliability owner                  | Unlock     | P0       | XS     | Team                   |
| SIGNAL-CORE-002 | Agent PR witness checklist + CI comment on agent-path PRs                | Unlock     | P0       | S      | Process, Monitoring    |
| SIGNAL-CORE-003 | Agent failure taxonomy in cross-repo bridge/log                          | Unlock     | P0       | XS     | Safeguards, Monitoring |
| SIGNAL-CORE-004 | `pnpm test:agent-integration` smoke in CI                                | Advance    | P1       | M      | Systems, Process       |
| SIGNAL-CORE-005 | Trace_id on outbound coordination tickets                                | Foundation | P1       | M      | Systems                |
| SIGNAL-CORE-006 | Semver agent partials manifest (`.agent/` → `agent-prompts@x.y.z`)       | Foundation | P2       | M      | Process                |
| SIGNAL-CORE-007 | Agent run metrics JSON in `auto-dev-data` (session duration, gate exits) | Advance    | P1       | S      | Monitoring             |
| SIGNAL-CORE-008 | OPA sketch for P28 Class A crypto-path writes                            | Foundation | P3       | L      | Safeguards             |
| SIGNAL-CORE-009 | Weekly witness-doc accuracy sample (coordination link check)             | Strengthen | P2       | S      | Monitoring, Process    |
| SIGNAL-CORE-010 | Link SIGNAL assessment to `latest.json` + `pnpm check:signal-posture`    | Strengthen | P2       | XS     | Monitoring             |

---

## P0 — Unlock

### [SIGNAL-CORE-001] Name Human Lead + mirror ecosystem AI reliability owner

- **Type:** Unlock
- **Dimension(s):** Team
- **Level impact:** Team **L1 high → L2 low** — raises overall ceiling toward L2
- **Current:** `AGENTS.md` coordination table: **Human Lead: TBD**
- **Target:** Named lead + link [`ai-reliability-owner-2026-06-06.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/ai-reliability-owner-2026-06-06.md)
- **Implementation:** Update `AGENTS.md` §Coordination Contract; append bridge Latest row; optional outbound to protocols hub
- **Effort:** XS | **Priority:** P0 | **Dependencies:** None

### [SIGNAL-CORE-002] Agent PR witness checklist

- **Type:** Unlock
- **Dimension(s):** Process, Monitoring
- **Level impact:** Process **L2 high → L2 full**; Monitoring **L2 mid → L2 high**
- **Current:** P27 requires in-session gates; not uniformly evidenced on agent-touch PRs
- **Target:** PR template + checklist: V-ladder exits, attestation block, evidence paths
- **Implementation:** Add `docs/operations/agent-pr-checklist.md` (mirror protocols SIGNAL-003); link from `.github/pull_request_template.md`
- **Effort:** S | **Priority:** P0 | **Dependencies:** SIGNAL-CORE-001

### [SIGNAL-CORE-003] Agent failure taxonomy in coordination log

- **Type:** Unlock
- **Dimension(s):** Safeguards, Monitoring
- **Level impact:** Safeguards **L2 high → L2 full**
- **Current:** Bridge Latest rows are narrative; no failure class column
- **Target:** Taxonomy columns: `witness-drift`, `gate-fail`, `class-s-violation`, `cross-repo-stale`
- **Implementation:** Copy protocols SIGNAL-006 template into `cross-repo-agent-bridge.md` §Failure taxonomy
- **Effort:** XS | **Priority:** P0 | **Dependencies:** None

---

## P1 — Advance

### [SIGNAL-CORE-004] Agent integration test smoke in CI

- **Type:** Advance | **Priority:** P1 | **Effort:** M
- **Dimension(s):** Systems, Process
- **Level impact:** Systems **L2 high → L3 low** (criterion #10 L2→L3)
- **Implementation:** `scripts/test-agent-integration.mjs` — session-start JSON, next-work JSON, launch-focus schema, protocols check; wire in `ci.yml`

### [SIGNAL-CORE-005] Trace_id on coordination tickets

- **Type:** Foundation | **Priority:** P1 | **Effort:** M
- **Dimension(s):** Systems
- **Level impact:** Systems **L2 high → L3 low** (L2→L3 unlock #3)
- **Implementation:** Propagate `GTCX_AGENT_TRACE_ID` from `agent:session-start --json` into outbound ticket frontmatter; baseline-os trace root outbound (protocols SIGNAL-007 sibling)

### [SIGNAL-CORE-007] Agent run metrics in auto-dev-data

- **Type:** Advance | **Priority:** P1 | **Effort:** S
- **Dimension(s):** Monitoring
- **Implementation:** Extend `reconcile-auto-dev-data.mjs` with last session gate exits + duration from `session-last-start.json`

---

## P2/P3 — Foundation / Strengthen

### [SIGNAL-CORE-006] Semver agent partials manifest

- **Type:** Foundation | **Priority:** P2 | **Effort:** M | **Dimension(s):** Process

### [SIGNAL-CORE-008] OPA sketch for P28 Class A crypto writes

- **Type:** Foundation | **Priority:** P3 | **Effort:** L | **Dimension(s):** Safeguards

### [SIGNAL-CORE-009] Weekly witness-doc link check

- **Type:** Strengthen | **Priority:** P2 | **Effort:** S | **Dimension(s):** Monitoring

### [SIGNAL-CORE-010] SIGNAL posture in validate ladder

- **Type:** Strengthen | **Priority:** P2 | **Effort:** XS | **Dimension(s):** Monitoring
- **Implementation:** Add `signal-assessment` pointer to `latest.json`; optional `pnpm check:signal-posture` script

---

## Sprint Zero (top 5)

1. **SIGNAL-CORE-001** — Name Human Lead + AI reliability link
2. **SIGNAL-CORE-003** — Failure taxonomy (XS quick win)
3. **SIGNAL-CORE-002** — Agent PR witness checklist
4. **SIGNAL-CORE-007** — Agent run metrics in auto-dev-data
5. **SIGNAL-CORE-005** — trace_id pilot on next outbound ticket

---

# PHASE 3 — ROADMAP

**Current overall:** **L1 high**  
**Target:** **L3 low** (two full levels: L2, then L3)

---

## Level projection

| Dimension            | Now         | After Phase 1 (L2) | After Phase 2 (L3) |
| -------------------- | ----------- | ------------------ | ------------------ |
| Systems Architecture | L2 high     | L2 high            | **L3 low**         |
| Tooling              | L2 high     | **L2 full**        | **L3 low**         |
| Process              | L2 high     | **L2 full**        | **L3 low**         |
| Safeguards           | L2 high     | **L2 full**        | L2 high            |
| Monitoring           | L2 mid      | **L2 high**        | **L2 high**        |
| Team & Ownership     | L1 high     | **L2 low**         | **L2 mid**         |
| **Overall**          | **L1 high** | **L2 low**         | **L3 low**         |

---

## PHASE 1 — Advancing to L2 (Integrated agentic engineering)

**Duration:** 3–5 weeks  
**Unlock (L1→L2):** Named ownership + prompts/process in Git with PR review for agent paths

| #   | L1→L2 criterion (adapted for SIGNAL-E)                                | Core task                                 |
| --- | --------------------------------------------------------------------- | ----------------------------------------- |
| 1   | AI tooling in use by agents (>50% sessions use `agent:session-start`) | Already met — enforce via CI smoke        |
| 2   | Acceptable use / agent policy documented                              | Link GOV-AI-001 in AGENTS.md              |
| 3   | No PII in agent outputs without scrub                                 | Crypto repo — redact in coordination only |
| 4   | Agent-path PR review process                                          | **SIGNAL-CORE-002**                       |
| 5   | Named AI reliability / human lead                                     | **SIGNAL-CORE-001**                       |
| 6   | Agent failures classified                                             | **SIGNAL-CORE-003**                       |
| 7   | Posture machine-readable                                              | **SIGNAL-CORE-007**, **SIGNAL-CORE-010**  |

### Implementation-ready checklist (Phase 1)

- [ ] **Week 1:** SIGNAL-CORE-001 — update `AGENTS.md` Human Lead + AI owner link; bridge row
- [ ] **Week 1:** SIGNAL-CORE-003 — failure taxonomy section in bridge (30 min)
- [ ] **Week 2:** SIGNAL-CORE-002 — `agent-pr-checklist.md` + PR template link; attest in one agent PR
- [ ] **Week 2:** SIGNAL-CORE-007 — extend `auto-dev-data.json` with `lastSessionGates`
- [ ] **Week 3:** SIGNAL-CORE-010 — `latest.json` `signalAssessment` pointer; document in readiness lanes guide
- [ ] **Week 4:** Re-run `signal-full`; verify Team ≥ L2 low
- [ ] **Week 5:** Re-assessment checkpoint (below)

### Re-assessment checkpoint (end Phase 1)

```bash
pnpm agent:session-start --json | jq '.nextWork.backlogClear'
pnpm agent:protocols:check                    # exit 0
pnpm docs:check-frontmatter                   # exit 0
pnpm readiness:lanes:check                    # exit 0
grep -v 'TBD' AGENTS.md | grep 'Human Lead'   # named lead present
```

**Gate to Phase 2:** Team ≥ L2 low; Process ≥ L2 full; Monitoring ≥ L2 high; overall SIGNAL ≥ **L2 low**.

---

## PHASE 2 — Advancing to L3 (Orchestrated agent boundaries)

**Duration:** 6–10 weeks after Phase 1 gate  
**Unlock:** Distributed tracing across agent boundaries (L2→L3 checklist #3)

| #   | L2→L3 criterion                | Core task                                                                                       |
| --- | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| 1   | Two+ named agent engines       | protocol-architect + crypto-security-engineer + quality-evidence-lead personas (doc → topology) |
| 2   | Orchestrator routes tasks      | Document P22 + launch-focus as control plane; link baseline-os `next`                           |
| 3   | Inter-agent tracing            | **SIGNAL-CORE-005** — trace_id on all outbound tickets                                          |
| 4   | Per-agent prompt version       | **SIGNAL-CORE-006** — semver `.agent/` manifest                                                 |
| 5   | Durable task queue             | Defer to gtcx-agentic / baseline-os (not foundation repo)                                       |
| 6   | Fallback model                 | N/A for core (no LLM) — substitute: gate fallback scripts documented                            |
| 7   | Agent failure incidents        | Taxonomy + 3 logged samples in bridge                                                           |
| 8   | AI reliability owner           | **SIGNAL-CORE-001** sustained                                                                   |
| 9   | Per-agent cost/quality metrics | **SIGNAL-CORE-007** + bout-progress weekly export                                               |
| 10  | Agent integration tests in CI  | **SIGNAL-CORE-004**                                                                             |

### Implementation-ready checklist (Phase 2)

- [ ] **Week 1–2:** SIGNAL-CORE-004 — CI job `test:agent-integration` exit 0
- [ ] **Week 3–4:** SIGNAL-CORE-005 — trace_id on 3 coordination outbounds; evidence JSON
- [ ] **Week 5–6:** SIGNAL-CORE-006 — `agent-prompts-manifest.json` with semver tags
- [ ] **Week 7:** `docs/architecture/agent-topology-foundation-2026-Q3.md` — named engines + handoffs
- [ ] **Week 8–10:** Cross-repo trace spanning core → protocols ticket in staging evidence
- [ ] **Week 10:** Re-assessment checkpoint

### Re-assessment checkpoint (end Phase 2)

```bash
pnpm test:agent-integration                   # exit 0 (new)
pnpm agent:cross-repo-deps:check              # exit 0
# Manual: 1 outbound ticket with trace_id + hub log correlation
# Manual: agent-topology doc reviewed by crypto-security-engineer role
```

**Gate to Phase 3 (L4 prep):** Systems ≥ L3 low; Tooling/Process ≥ L3 low; overall SIGNAL ≥ **L3 low**.

---

## PHASE 3 — Advancing to L4 (preview — autonomous engineering workflows)

**Duration:** 3–6 months after Phase 2 gate  
**Unlock:** Policy layer (OPA) with automated human escalation

| Workstream          | Tasks                                                               | Outcome                         |
| ------------------- | ------------------------------------------------------------------- | ------------------------------- |
| Policy              | SIGNAL-CORE-008 + P28 Class A for trusted-setup publish             | Ceremony writes policy-gated    |
| Autonomous agent PR | Agent opens PR → full V-ladder → evidence bundle → human merge only | One workflow E2E                |
| Safeguards          | Kill-switch for `agent:git-push` in staging drill                   | Documented rollback             |
| Human parallel      | DTF-5.5.4 LOI + CORE-004-CEREMONY                                   | Class S — not agent-automatable |

---

## Critical path

```
SIGNAL-CORE-001 (owner)
  → SIGNAL-CORE-002 (PR witness)
    → SIGNAL-CORE-003 (taxonomy)
      → SIGNAL-CORE-007 (metrics)
        → SIGNAL-CORE-005 (trace_id)
          → SIGNAL-CORE-004 (integration CI)
            → L3 re-assessment
```

## Quick wins (< 1 week)

| Task                                 | Effort | Outcome                         |
| ------------------------------------ | ------ | ------------------------------- |
| SIGNAL-CORE-001                      | XS     | Unblocks overall L2 ceiling     |
| SIGNAL-CORE-003                      | XS     | Safeguards + monitoring signal  |
| SIGNAL-CORE-010                      | XS     | Machine-readable SIGNAL pointer |
| Update `latest.json` assessment date | XS     | Audit lane freshness            |

---

## Cross-repo dependencies

| Sibling             | SIGNAL item                 | Role                          |
| ------------------- | --------------------------- | ----------------------------- |
| gtcx-protocols      | SIGNAL-007 trace root       | trace_id SoR                  |
| gtcx-agentic        | human gate register         | DTF-5.5.4 awaiting-human      |
| gtcx-infrastructure | SIGNAL-INF-002              | LLM dashboard (SIGNAL-P path) |
| baseline-os         | `cost-stats`, session chain | Monitoring feed               |

**Do not duplicate** infra LLM observability in gtcx-core — link only.
