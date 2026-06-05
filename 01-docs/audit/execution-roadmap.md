---
last_reconciled: 2026-06-05
reconciliation_note: >-
  execute-roadmap + auto-dev-data 2026-06-05 — ER-AUTO-DEV-01 synced; FA-S6 core done; Class S wall.
sources:
  - 01-docs/05-audit/engineering-audit-2026-06-05.md
  - 01-docs/05-audit/bank-grade-audit-2026-06-07.md
  - 01-docs/05-audit/repo-hygiene-2026-06-05.md
  - 01-docs/05-audit/signal-assessment-2026-06-07.md
  - 01-docs/05-audit/full-audit-2026-06-04.md
  - 01-docs/05-audit/moat-completion-reconciliation-2026-06-03.md
  - 01-docs/04-ops/tier-5-workplan-2026-06.md
  - 01-docs/04-ops/coordination/dtf-554-commercial-gate-tracker-2026-06-07.md
  - 01-docs/04-ops/coordination/dtf-554-loi-h554-packet-2026-06-05.md
  - 01-docs/04-ops/coordination/core-004-engineering-closeout-2026-06-06.md
---

# Execution roadmap — gtcx-core

**Unified index:** [moat-completion-reconciliation-2026-06-03.md](./moat-completion-reconciliation-2026-06-03.md)  
**Latest lane-1 forensic:** [engineering-audit-2026-06-05.md](./engineering-audit-2026-06-05.md) · [bank-grade-audit-2026-06-07.md](./bank-grade-audit-2026-06-07.md)  
**Tier 5 register:** [tier-5-workplan-2026-06.md](../operations/tier-5-workplan-2026-06.md)  
**Active phase:** **WIT-S1** witness + Class S prep — automatable backlog clear  
**Protocol 22:** `pnpm agent:next-work` → **DTF-5.5.4** / **CORE-004-CEREMONY** (Class S); witness mode  
**Last in-repo sprint:** **WIT-S1** hygiene + LOI packet + vendor manifest (2026-06-05 execute-roadmap pass 2)

---

## Executive summary (2026-06-05 pass 2)

| Track                           | State               | Next                                                       |
| ------------------------------- | ------------------- | ---------------------------------------------------------- |
| **Lane 1 signoff @ HEAD**       | **10.0**            | Hold — core gates green                                    |
| **Repo hygiene strict checker** | **PASS**            | ER-HYG-01 @ `b1ab9c2`; forensic audit doc 7.4 until re-run |
| **DTF Tier 5 technical**        | **~88%**            | DTF-5.5.2 done                                             |
| **DTF-5.5.4 (Class S)**         | agent prep **done** | GTM/Legal sign LOI — H-554 packet `15edf3e`                |
| **CORE-004 engineering**        | **done**            | Ceremony publish — custodian Class S                       |
| Bank-grade / sovereign pilot    | **Not Ready**       | EXT-INF-002 SOW; composite **8.9**                         |
| **FA-S6 vendor pack**           | **done**            | ER-VEND-01 — `vendor-evidence:verify-manifest` exit **0**  |
| **P0 allowlist drift**          | **Closed**          | ER-HYG-01                                                  |

**Risk (audit):** Do not equate npm library maturity with sovereign pilot clearance.  
**Opportunity:** Class R witness gaps closed; **only human LOI signature** blocks Tier 5 commercial claims.

---

## Phase map (historical + active)

| Phase   | Theme                                      | Status                                  |
| ------- | ------------------------------------------ | --------------------------------------- |
| P1–P4   | Doc truth, trust artifacts, DevEx, signoff | **done**                                |
| P5      | Supply chain (`@gtcx/ai-eval` provenance)  | **done**                                |
| **FA**  | Full-audit reconciliation (2026-06-04)     | **done** — FA-S1 complete               |
| **ENG** | Engineering gate restoration (2026-06-05)  | **done** — ENG-S1 complete              |
| **T5**  | Defensibility Tier 5 technical             | **S-T5-4 done** — handoff to commercial |
| **EXT** | Pen-test, SOC 2, ceremony, GTM             | **deferred**                            |

---

## P0 — Build graph (FA-S1) — **complete**

**Source:** [full-audit-2026-06-04.md](./full-audit-2026-06-04.md) Phase 1 High finding.

| Story   | Title                                            | Owner              | Status   | Evidence / gate                           |
| ------- | ------------------------------------------------ | ------------------ | -------- | ----------------------------------------- |
| FA-P0-1 | Break workproof ↔ verification turbo build cycle | frontier-infra     | **done** | Root `pnpm typecheck` exit 0 (2026-06-04) |
| FA-P0-2 | README: split library readiness vs DTF Tier 5    | protocol-architect | **done** | `README.md` (2026-06-04)                  |
| FA-P0-3 | Reconcile package count in specs README          | protocol-architect | **done** | 24 packages per `architecture:check`      |
| FA-P0-4 | format:check hygiene (agent-sync drift)          | chore              | **done** | `pnpm format:check` exit 0 (2026-06-03)   |

**FA-S1:** **Complete** (FA-P0-1–4, DTF-5.2.3).

---

## DTF Tier 5 — sprint status

| Sprint | Theme                                  | Status      | Exit milestone                    |
| ------ | -------------------------------------- | ----------- | --------------------------------- |
| S-T5-1 | gh-gold witness + profile + NAPI + KAT | **done**    | DTF-5.1.4                         |
| S-T5-2 | zw-diamond + verification + KATs       | **done**    | DTF-5.2.3; 6/6 groth16 cross-impl |
| S-T5-3 | gh-cocoa + jurisdiction fixtures       | **done**    | DTF-5.3.3 UAT protocol            |
| S-T5-4 | Circuit registry + perf                | **done**    | Tier 5 technical candidate        |
| S-T5-5 | Commercial / certified packs           | **blocked** | DTF-5.5.4 Class S                 |

---

## FA-S6 — Vendor evidence pack (full-audit week 6)

**Source:** [full-audit-2026-06-04.md](./full-audit-2026-06-04.md) Sprint 6 · **Status:** core-side **complete**; live pen-test remains **EXT-INF-002** (infra).

| Story          | Title                                           | Owner                 | Status      | Acceptance / UAT                                                                      |
| -------------- | ----------------------------------------------- | --------------------- | ----------- | ------------------------------------------------------------------------------------- |
| FA-S6-01       | Tier-5 technical evidence index (DTF-5.5.5)     | quality-evidence-lead | **done**    | [evidence/README.md](./evidence/README.md) register                                   |
| FA-S6-02       | KAT + fuzz + threat matrix vendor pack manifest | quality-evidence-lead | **done**    | `pnpm vendor-evidence:build-manifest` · `pnpm vendor-evidence:verify-manifest` exit 0 |
| FA-S6-03       | Zimbabwe sandbox email + LOI tracker            | gtm-lead              | **blocked** | Human / GTM (Class S) — H-554 packet assembled; signature pending                     |
| FA-S6-04       | CORE-004 ceremony publish                       | custodian + gtcx-core | **blocked** | Class S — `transcript.seed` + `pnpm ops:trusted-setup:verify-publish`                 |
| ER-AUTO-DEV-01 | `auto-dev-data.json` + `auto-dev-state.md` sync | quality-evidence-lead | **done**    | `pnpm agent:reconcile-auto-dev` · JSON validates · mirrors `latest.json` + P22        |

**Delivery:** Ship `01-docs/05-audit/evidence/vendor-pen-test-pack-manifest-latest.json` to **gtcx-infrastructure** for EXT-INF-002 vendor SOW — does **not** mark pen-test done.

### Completed (2026-06-03 → 2026-06-04)

| ID              | Title                                        | Commit / evidence                                                              |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------------ |
| DTF-5.1.1–5.1.4 | Witness, gh-gold profile, NAPI, KAT          | `803d212`, `baa13e5`                                                           |
| DTF-5.2.1       | zw-diamond-origin profile                    | `803d212`                                                                      |
| DTF-5.2.2       | Verification ZK bundle integration           | `6c313ea`                                                                      |
| DTF-5.3.2       | Five-jurisdiction proof fixtures             | `tests/integration/tier5-jurisdiction-proofs.test.ts`                          |
| DTF-5.3.3       | Minerals board UAT protocol + L0 evidence    | `01-docs/04-ops/minerals-board-uat-protocol.md`                                |
| DTF-5.4.1       | CircuitRegistry semver + lifecycle           | `03-platform/packages/crypto/03-platform/src/circuit-registry.ts`              |
| DTF-5.4.2       | Load test 1603 verify/min (12 workers)       | `01-docs/05-audit/evidence/zkp-profile-load-2026-06-03.json`                   |
| DTF-5.4.3       | Trust portal circuit ID + off-circuit policy | `01-docs/governance/trust-portal.md` § ZKP circuit registry                    |
| DTF-5.4.4       | Protocols E2E per circuit profile ID         | gtcx-protocols `73eaff2b` · core `fc041a6` (`verifyGroth16CommodityOriginKat`) |
| DTF-5.5.1       | Jurisdiction pack Zod strict CI              | `pnpm jurisdiction:validate-packs` · `EngagementJurisdictionPackSchema`        |

### Next commercial (S-T5-5 — not in-repo code)

| ID        | Title                                 | Owner                      | Status                                                                                                                                           |
| --------- | ------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| DTF-5.5.2 | Certified pack pipeline               | Legal + protocol-architect | **done** 2026-06-06 — [`certified-pack-manifest-latest.json`](evidence/certified-pack-manifest-latest.json)                                      |
| DTF-5.5.4 | Design-partner LOI / regulator letter | GTM                        | **awaiting-human** (Class S) — agent prep **done** [`dtf-554-loi-h554-packet`](../operations/coordination/dtf-554-loi-h554-packet-2026-06-05.md) |
| DTF-5.5.5 | Evidence index entry                  | quality-evidence-lead      | **done**                                                                                                                                         |

Technical milestones DTF-5.1.1–5.5.1 and DTF-5.4.4 are **done** — see Completed table above.

---

**Hygiene:** Strict checker **PASS** @ `b1ab9c2` — forensic [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md) still shows 7.4 (pre-remediation); re-audit optional.

---

## WIT-S1 — Witness sprint (2026-06-05 pass 2)

**Source:** execute-roadmap reconcile after repo-hygiene P1 + DTF-5.5.4 packet + vendor manifest drift  
**Goal:** Close Class **R** witness gaps while Class S wall unchanged.

| Story          | Title                                            | Owner                 | Status   | Acceptance / UAT                                                                          |
| -------------- | ------------------------------------------------ | --------------------- | -------- | ----------------------------------------------------------------------------------------- |
| ER-HYG-01      | Root allowlist + P29 scaffold tracked            | protocol-architect    | **done** | `pnpm check:workspace-root-cleanliness:strict` exit **0** — `b1ab9c2`                     |
| ER-DTF554-01   | H-554 LOI packet + witness index + agentic raise | protocol-architect    | **done** | Packet + outbound + manifest `oneLineAsk` — `15edf3e`                                     |
| ER-VEND-01     | Refresh vendor pen-test pack manifest hashes     | quality-evidence-lead | **done** | `pnpm vendor-evidence:build-manifest` · `pnpm vendor-evidence:verify-manifest` exit **0** |
| ER-AUTO-DEV-02 | `auto-dev-data.json` sync after WIT-S1           | quality-evidence-lead | **done** | `pnpm agent:reconcile-auto-dev` exit **0**                                                |

**Blockers (Class S — unchanged):** DTF-5.5.4 human signature · CORE-004-CEREMONY · EXT-INF-002 SOW

---

## ENG-S1 — Engineering gate restoration (2026-06-05)

**Source:** [engineering-audit-2026-06-05.md](./engineering-audit-2026-06-05.md) · signoff **10.0** restored / completion **9.5**  
**Goal:** Restore lane-1 **10.0 signoff** — **achieved** 2026-06-05 execute-roadmap.  
**Authority:** Class **S** (agent self-execute) — not commercial Class S wall items.

| Story     | Title                                           | Owner              | Status   | Acceptance / UAT                                                                        |
| --------- | ----------------------------------------------- | ------------------ | -------- | --------------------------------------------------------------------------------------- |
| ER-ENG-01 | `@gtcx/zkp-kat-vectors` bundle budget alignment | frontier-infra     | **done** | `pnpm bundle:check-budgets` exit 0 — budget **204,800 B** (6-circuit DTF-5.2 rationale) |
| ER-ENG-02 | API surface baseline refresh (additive Tier-5)  | protocol-architect | **done** | `pnpm api:update-baseline` · `pnpm api:check` exit 0 (24 packages)                      |
| ER-ENG-03 | Manifest / baseline format hygiene              | chore              | **done** | `pnpm format:check` exit 0 — commit `a7373dc`                                           |

### ER-ENG-01: Bundle budget

**Files:** `benchmarks/bundle-size-budgets.json`, `03-platform/packages/zkp-kat-vectors/`

**Acceptance**

```bash
pnpm build && pnpm bundle:check-budgets
```

**UAT / QA**

- [x] Automated: gzip `@gtcx/zkp-kat-vectors` 191,188 B ≤ 204,800 B budget
- [x] Manual: Budget rationale documents 6-circuit KAT set (gh-gold + zw-diamond expansion)

**Blockers:** —

### ER-ENG-02: API baseline

**Files:** `quality/api-surface-baseline.json`, `03-platform/packages/crypto/`, `03-platform/packages/eap/`, `03-platform/packages/zkp-kat-vectors/`

**Acceptance**

```bash
pnpm api:update-baseline   # after export review
pnpm api:check
```

**UAT / QA**

- [x] Automated: `pnpm api:check` exit 0
- [x] Manual: Added exports are intentional (`CommodityOriginKatLike`, EAP evidence helpers, KAT vector exports)

**Blockers:** —

### Deduplicated open issues (reconcile 2026-06-05)

| ID       | Severity | Source                                    | Status       | Story / deferral                            |
| -------- | -------- | ----------------------------------------- | ------------ | ------------------------------------------- |
| ENG-P1   | High     | engineering-audit-2026-06-05              | **closed**   | ER-ENG-01 done                              |
| ENG-P2   | Medium   | engineering-audit-2026-06-05              | **closed**   | ER-ENG-02 done                              |
| ENG-P3   | Low      | engineering-audit-2026-06-05              | **closed**   | ER-ENG-03 done                              |
| BG-P1-01 | High     | bank-grade-audit-2026-06-07               | **blocked**  | EXT-INF-002 SOW — infra Class S             |
| HY-P0-1  | Critical | repo-hygiene-2026-06-05                   | **closed**   | ER-HYG-01 — strict PASS @ b1ab9c2           |
| BG-P1-02 | High     | bank-grade-audit-2026-06-07               | **blocked**  | DTF-5.5.4 — agent prep done; human sign     |
| BG-P1-03 | High     | bank-grade-audit-2026-06-07               | **blocked**  | CORE-004-CEREMONY — FA-S6-04                |
| BG-P1-04 | High     | bank-grade-audit-2026-06-07               | **deferred** | IC-T0 ecosystem — lane 3                    |
| BG-P2-01 | Medium   | bank-grade + signal-assessment-2026-06-07 | **blocked**  | ER-SIG-01 — Human Lead naming (Class R)     |
| BG-P2-02 | Medium   | signal-assessment-2026-06-07              | **deferred** | SIGNAL L1→L2 — ownership + reliability link |
| FA-P0-1  | Critical | full-audit-2026-06-04                     | **closed**   | Turbo cycle fixed                           |

### Optional — SIGNAL ownership (Class R)

| Story     | Title                          | Owner      | Status      | Acceptance / UAT                     |
| --------- | ------------------------------ | ---------- | ----------- | ------------------------------------ |
| ER-SIG-01 | Name Human Lead in `AGENTS.md` | Leadership | **blocked** | Human names owner; `pnpm agent:sync` |

Does not block ENG-S1; unblocks SIGNAL L1→L2 team dimension per [signal-assessment-2026-06-07.md](./signal-assessment-2026-06-07.md).

---

## Full-audit sprint program (6 weeks)

Aligned with [full-audit-2026-06-04.md](./full-audit-2026-06-04.md) §6.3.

| Week | Sprint | Primary deliverable                          | Layer mix    |
| ---- | ------ | -------------------------------------------- | ------------ |
| 1    | FA-S1  | Root gates green; README truth               | Remediation  |
| 2    | FA-S2  | DTF-5.2.3 KATs                               | Innovation   |
| 3    | FA-S3  | DTF-5.3 cocoa + fixtures                     | Innovation   |
| 4    | FA-S4  | Ecosystem hub / ER-1-08 closure              | Coordination |
| 5    | FA-S5  | DTF-5.4 registry + perf JSON                 | Innovation   |
| 6    | FA-S6  | Vendor evidence pack (no fake pen-test done) | Evidence     |

---

## FA-AGT — Agent protocol hygiene (**done** 2026-06-04)

| Story     | Title                                   | Owner              | Status   | Acceptance / UAT                                                                                        |
| --------- | --------------------------------------- | ------------------ | -------- | ------------------------------------------------------------------------------------------------------- |
| FA-AGT-01 | Hub snapshot + universal ops docs sync  | protocol-architect | **done** | `pnpm agent:protocols:check` exit 0                                                                     |
| FA-AGT-02 | Frontmatter: allow `gtcx-agentic` owner | protocol-architect | **done** | `pnpm docs:check-frontmatter` exit 0                                                                    |
| FA-AGT-03 | P24 blocker note for CORE-004 / XR-402  | protocol-architect | **done** | [core-004-xr402-blocker-2026-06-04.md](../operations/coordination/core-004-xr402-blocker-2026-06-04.md) |

**Hygiene (done):** [repo-hygiene-2026-06-04.md](./repo-hygiene-2026-06-04.md) post-remediation **9.8**.

---

## Ecosystem open items (gtcx-core lens)

| ID                 | Item                               | Owner               | Status                    | gtcx-core role                                                                                                                                                      |
| ------------------ | ---------------------------------- | ------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OI-X01             | ER-1-08 hub ack                    | gtcx-core           | **done**                  | Protocols log; evidence on record                                                                                                                                   |
| OI-X02             | ER-1-08 hub ack                    | gtcx-infrastructure | **done** 2026-06-04       | Inbound [`from-gtcx-infrastructure-er-1-08-hub-ack-2026-06-04.md`](../operations/coordination/from-gtcx-infrastructure-er-1-08-hub-ack-2026-06-04.md)               |
| OI-X06 / INT-S8-04 | cost-router v1.1                   | baseline-os         | **external**              | No implementation in core                                                                                                                                           |
| EXT-INF-002        | Live pen-test                      | gtcx-infrastructure | **outbound-acknowledged** | Pack ack [`from-gtcx-infrastructure-ext-inf-002-ack-2026-06-07.md`](../operations/coordination/from-gtcx-infrastructure-ext-inf-002-ack-2026-06-07.md); SOW Class S |
| CORE-004           | Trusted-setup transcript           | gtcx-core           | **engineering-done**      | Class R closed — [`core-004-engineering-closeout-2026-06-06.md`](../operations/coordination/core-004-engineering-closeout-2026-06-06.md); ceremony Class S          |
| CORE-005–006       | Pen-test SOW / formal verification | baseline-os         | **blocked**               | Track only                                                                                                                                                          |

---

## Historical sprints (internal 10/10) — **done**

<details>
<summary>Sprints 1–5 (collapsed)</summary>

### Sprint 1–4 — **done**

See [ci-confirmation-2026-06-01.md](./ci-confirmation-2026-06-01.md). Stories S1-01–S4-03 complete.

### Sprint 5 — **done**

| Story | Title                            | Status |
| ----- | -------------------------------- | ------ |
| S5-01 | `@gtcx/ai-eval@0.1.4` provenance | done   |

`pnpm provenance:check-npm:strict` → **22/22** (2026-06-03).

</details>

---

## Deferred (external + human)

| Item                             | Owner                 | Reason                                                                                                                                            |
| -------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pen-test report (live stack)     | gtcx-infrastructure   | EXT-INF-002; vendor SOW Class S (pack ack done)                                                                                                   |
| SOC 2 Type 1                     | quality-evidence-lead | CPA engagement                                                                                                                                    |
| Zimbabwe sandbox email           | gtm-lead              | Human approval                                                                                                                                    |
| Trusted-setup ceremony           | human + gtcx-core     | CORE-004 ZKP transcript (XR-402 KMS **done**)                                                                                                     |
| D8 formal verification           | baseline-os           | CORE-006                                                                                                                                          |
| D9 third-party crypto audit      | baseline-os           | CORE-005                                                                                                                                          |
| DTF-5.4.4 protocols E2E          | gtcx-protocols        | **done** — witness `73eaff2b` (protocols hub log)                                                                                                 |
| DTF-5.5.4 LOI / regulator letter | GTM                   | Tier 5 commercial — H-554 packet ready; **human signature** — [tracker](../operations/coordination/dtf-554-commercial-gate-tracker-2026-06-07.md) |
| Human Lead naming                | Leadership            | SIGNAL Team cap — `AGENTS.md` TBD                                                                                                                 |
| Industry Compliance IC-T0        | Ecosystem / Legal     | 0/12 register — caps GCR narrative                                                                                                                |

---

## Verification ladder (active work)

```bash
# ENG-S1 — gate restoration (lane-1 signoff)
pnpm bundle:check-budgets && pnpm api:check

# Core quality (must stay green)
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm architecture:check

# Per DTF / ZKP milestone
pnpm test:kat-cross-impl   # when KAT touched
cd rust && cargo test -p gtcx-zkp --lib
pnpm readiness:lanes:check
```

---

## Agent selection

```bash
pnpm agent:next-work          # commercial ceiling DTF-5.5.4 Class S; drain ENG-S1 if repoCompletable
pnpm agent:reconcile-auto-dev # after roadmap reconcile
pnpm vendor-evidence:verify-manifest
pnpm ops:trusted-setup:verify-publish  # after transcript.seed published
pnpm agent:work-selection:check
pnpm agent:protocols:check
```

**Priority:** witness Class S items only — automatable backlog clear.

Refresh `.baseline/memory/session.md` after each milestone.

---

## Reconcile report (Phase 4 — 2026-06-05 pass 2)

| Category        | Count | Notes                                                      |
| --------------- | ----: | ---------------------------------------------------------- |
| Stories added   |     4 | WIT-S1 ER-HYG-01, ER-DTF554-01, ER-VEND-01, ER-AUTO-DEV-02 |
| Stories pending |     0 | —                                                          |
| Stories done    |     4 | WIT-S1 complete (Class R witness)                          |
| Stories blocked |     4 | DTF-5.5.4 human sign, CORE-004-CEREMONY, FA-S6-04, EXT-INF |
| Deferred        |     3 | IC-T0, SIGNAL L2 path, SOC 2                               |

**Next story ID:** **DTF-5.5.4** (Class S — GTM/Legal sign LOI per H-554 packet)

**Human one-line ask:** Sign design-partner LOI or regulator letter naming pilot scope + pack SHA-256 set — [`dtf-554-loi-h554-packet-2026-06-05.md`](../operations/coordination/dtf-554-loi-h554-packet-2026-06-05.md)

---

## Reconcile report (Phase 2 — 2026-06-05 pass 1)

| Category        | Count | Notes                                                  |
| --------------- | ----: | ------------------------------------------------------ |
| Stories added   |     3 | ENG-S1 ER-ENG-01..03                                   |
| Stories pending |     0 | —                                                      |
| Stories done    |     3 | ER-ENG-01, ER-ENG-02, ER-ENG-03                        |
| Stories blocked |     4 | DTF-5.5.4, CORE-004-CEREMONY, FA-S6-03/04, EXT-INF SOW |
| Deferred        |     3 | IC-T0, SIGNAL L2 path, SOC 2                           |

**Next story ID:** **DTF-5.5.4** (Class S human) · witness mode — no automatable backlog

---

_Last updated: 2026-06-05 — execute-roadmap pass 2; WIT-S1 complete; Class S wall — human LOI signature pending_
