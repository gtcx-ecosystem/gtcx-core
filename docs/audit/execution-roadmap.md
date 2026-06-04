---
last_reconciled: 2026-06-04
reconciliation_note: >-
  Launch-focus reconcile 2026-06-04 — mode implement; implement 2 / plan 5.
  Repo hygiene execute 9.8 (2026-06-04). Agent hub snapshot + universal rollout synced.
  CORE-004 blocked XR-402. FA-AGT complete; in-repo automatable slice done.
sources:
  - docs/audit/full-audit-2026-06-04.md
  - docs/audit/repo-hygiene-2026-06-04.md
  - docs/audit/moat-completion-reconciliation-2026-06-03.md
  - docs/operations/tier-5-workplan-2026-06.md
  - docs/operations/coordination/remaining-cross-repo-work-2026-06-02.md
  - docs/gtm/gtm-reality-check-2026-06-02.md
---

# Execution roadmap — gtcx-core

**Unified index:** [moat-completion-reconciliation-2026-06-03.md](./moat-completion-reconciliation-2026-06-03.md)  
**Latest audit:** [full-audit-2026-06-04.md](./full-audit-2026-06-04.md) · GitHub [#27](https://github.com/gtcx-ecosystem/gtcx-core/issues/27)  
**Tier 5 register:** [tier-5-workplan-2026-06.md](../operations/tier-5-workplan-2026-06.md)  
**Active phase:** **S-T5-5** commercial (external) + **CORE-004** ceremony-blocked  
**Protocol 22:** `pnpm agent:next-work` → **CORE-004** **blocked** (XR-402); in-repo automatable slice **done**  
**Last in-repo sprint:** **FA-AGT** complete (2026-06-04)

---

## Executive summary (2026-06-05)

| Track                            | State         | Next                                                      |
| -------------------------------- | ------------- | --------------------------------------------------------- |
| Internal engineering (S1–S5)     | **done**      | —                                                         |
| Algorithmic moat D1–D6 (in-repo) | **done**      | D3 M3.2 ceremony-gated                                    |
| **DTF Tier 5 technical**         | **~88%**      | DTF-5.5.1 strict packs done; 5.5.2+ commercial (external) |
| Bank-grade / sovereign pilot     | **Not Ready** | External pen-test, testnet, hub (not core-only)           |
| **P0 blocker**                   | **Closed**    | FA-P0-1 — integration test in `tests/integration/`        |

**Risk (audit):** Do not equate npm library maturity with sovereign pilot clearance.  
**Opportunity (audit):** Profile packs + KAT portability on one R1CS + WorkProof→verification chain.

---

## Phase map (historical + active)

| Phase   | Theme                                      | Status                                  |
| ------- | ------------------------------------------ | --------------------------------------- |
| P1–P4   | Doc truth, trust artifacts, DevEx, signoff | **done**                                |
| P5      | Supply chain (`@gtcx/ai-eval` provenance)  | **done**                                |
| **FA**  | Full-audit reconciliation (2026-06-04)     | **done** — FA-S1 complete               |
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

| Sprint | Theme                                  | Status   | Exit milestone                    |
| ------ | -------------------------------------- | -------- | --------------------------------- |
| S-T5-1 | gh-gold witness + profile + NAPI + KAT | **done** | DTF-5.1.4                         |
| S-T5-2 | zw-diamond + verification + KATs       | **done** | DTF-5.2.3; 6/6 groth16 cross-impl |
| S-T5-3 | gh-cocoa + jurisdiction fixtures       | **done** | DTF-5.3.3 UAT protocol            |
| S-T5-4 | Circuit registry + perf                | **done** | Tier 5 technical candidate        |
| S-T5-5 | Commercial / certified packs           | pending  | DTF-5.5.4 external                |

### Completed (2026-06-03 → 2026-06-04)

| ID              | Title                                        | Commit / evidence                                                              |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------------ |
| DTF-5.1.1–5.1.4 | Witness, gh-gold profile, NAPI, KAT          | `803d212`, `baa13e5`                                                           |
| DTF-5.2.1       | zw-diamond-origin profile                    | `803d212`                                                                      |
| DTF-5.2.2       | Verification ZK bundle integration           | `6c313ea`                                                                      |
| DTF-5.3.2       | Five-jurisdiction proof fixtures             | `tests/integration/tier5-jurisdiction-proofs.test.ts`                          |
| DTF-5.3.3       | Minerals board UAT protocol + L0 evidence    | `docs/operations/minerals-board-uat-protocol.md`                               |
| DTF-5.4.1       | CircuitRegistry semver + lifecycle           | `packages/crypto/src/circuit-registry.ts`                                      |
| DTF-5.4.2       | Load test 1603 verify/min (12 workers)       | `docs/audit/evidence/zkp-profile-load-2026-06-03.json`                         |
| DTF-5.4.3       | Trust portal circuit ID + off-circuit policy | `docs/governance/trust-portal.md` § ZKP circuit registry                       |
| DTF-5.4.4       | Protocols E2E per circuit profile ID         | gtcx-protocols `73eaff2b` · core `fc041a6` (`verifyGroth16CommodityOriginKat`) |
| DTF-5.5.1       | Jurisdiction pack Zod strict CI              | `pnpm jurisdiction:validate-packs` · `EngagementJurisdictionPackSchema`        |

### Next commercial (S-T5-5 — not in-repo code)

| ID        | Title                                 | Owner                      | Status                                                                                                      |
| --------- | ------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| DTF-5.5.2 | Certified pack pipeline               | Legal + protocol-architect | **done** 2026-06-06 — [`certified-pack-manifest-latest.json`](evidence/certified-pack-manifest-latest.json) |
| DTF-5.5.4 | Design-partner LOI / regulator letter | GTM                        | **awaiting-human** (Class S)                                                                                |
| DTF-5.5.5 | Evidence index entry                  | quality-evidence-lead      | **done**                                                                                                    |

Technical milestones DTF-5.1.1–5.5.1 and DTF-5.4.4 are **done** — see Completed table above.

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

| ID                 | Item                               | Owner               | Status       | gtcx-core role                                |
| ------------------ | ---------------------------------- | ------------------- | ------------ | --------------------------------------------- |
| OI-X01             | ER-1-08 hub ack                    | gtcx-core           | **done**     | Protocols log; evidence on record             |
| OI-X02             | ER-1-08 hub ack                    | gtcx-infrastructure | **pending**  | File outbound ticket only                     |
| OI-X06 / INT-S8-04 | cost-router v1.1                   | baseline-os         | **external** | No implementation in core                     |
| EXT-INF-002        | Live pen-test                      | gtcx-infrastructure | **open**     | Evidence pack input (FA-S6)                   |
| CORE-004           | Trusted-setup transcript           | gtcx-core           | **partial**  | Verify CI green; transcript publish (Class R) |
| CORE-005–006       | Pen-test SOW / formal verification | baseline-os         | **blocked**  | Track only                                    |

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

| Item                             | Owner                 | Reason                                            |
| -------------------------------- | --------------------- | ------------------------------------------------- |
| Pen-test report (live stack)     | gtcx-infrastructure   | EXT-INF-002; vendor not selected                  |
| SOC 2 Type 1                     | quality-evidence-lead | CPA engagement                                    |
| Zimbabwe sandbox email           | gtm-lead              | Human approval                                    |
| Trusted-setup ceremony           | human + gtcx-core     | XR-402 / CORE-004                                 |
| D8 formal verification           | baseline-os           | CORE-006                                          |
| D9 third-party crypto audit      | baseline-os           | CORE-005                                          |
| DTF-5.4.4 protocols E2E          | gtcx-protocols        | **done** — witness `73eaff2b` (protocols hub log) |
| DTF-5.5.4 LOI / regulator letter | GTM                   | Tier 5 commercial gate                            |

---

## Verification ladder (active work)

```bash
# P0 — must pass before claiming FA-S1 done
pnpm typecheck && pnpm build

# Per DTF / ZKP milestone
pnpm format:check && pnpm lint && pnpm architecture:check
pnpm test
pnpm test:kat-cross-impl   # when KAT touched
cd rust && cargo test -p gtcx-zkp --lib
```

---

## Agent selection

```bash
pnpm agent:next-work          # expect DTF-5.5.2 or CORE-004 blocked
pnpm agent:work-selection:check
pnpm agent:protocols:check
```

Refresh `.baseline/memory/session.md` after each milestone.

---

_Last updated: 2026-06-04 — execute-roadmap reconcile; FA-AGT done; S-T5-5 / CORE-004 external_
