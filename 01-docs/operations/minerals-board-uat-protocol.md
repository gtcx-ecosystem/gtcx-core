---
title: 'Minerals Board UAT Protocol — Tier 5 (DTF-5.3.3)'
status: current
date: 2026-06-04
owner: quality-evidence-lead
document_id: DTF-5.3.3
role: quality-evidence-lead
tier: standard
tags: ['uat', 'tier-5', 'defensibility', 'jurisdiction', 'evidence']
review_cycle: on-change
framework: DTF-001
sprint: S-T5-3
---

# Minerals Board UAT Protocol (DTF-5.3.3)

> **Purpose:** Repeatable user-acceptance protocol for sovereign minerals regulators and buying-station pilots validating **CommodityOrigin** profile proofs — without PII in CI or lab evidence.
> **Scope:** Library readiness and Tier-5 technical path only; **not** national pilot clearance (see [full-audit-2026-06-04.md](../audit/full-audit-2026-06-04.md)).
> **Prerequisites:** DTF-5.3.1 (`gh-cocoa-origin`), DTF-5.3.2 (five-jurisdiction fixtures).

---

## 1. Audience and roles

| Role                                | Responsibility                                                           |
| ----------------------------------- | ------------------------------------------------------------------------ |
| **Quality & Evidence Lead**         | Owns protocol version, evidence JSON, UAT log entry                      |
| **Protocol Engineer**               | Witness → verification bundle chain; fixture updates                     |
| **Cryptographic Security Engineer** | Profile pack / cert-mask sign-off for named circuits                     |
| **Regulator observer** (external)   | Confirms disclosure bounds; does not receive raw mine GPS in verifier UI |
| **Buying-station agent** (pilot)    | Issues redacted WorkProof; optional field run                            |

**Engagement jurisdictions (fixtures):** Zimbabwe (ZW), Ghana (GH), Namibia (NA), Botswana (BW), DR Congo (CD).

---

## 2. What is under test

One underlying R1CS (`CommodityOriginCircuit`) with **policy packs** (not separate circuits):

| Profile ID          | Commodity | Regulatory narrative (lab)           |
| ------------------- | --------- | ------------------------------------ |
| `gh-gold-origin`    | Gold      | Export / buying license predicate    |
| `gh-cocoa-origin`   | Cocoa     | Origin + grade (EUDR / traceability) |
| `zw-diamond-origin` | Diamond   | Regional certification (Kimberley)   |
| `commodity-origin`  | Generic   | NA/CD until DTF-5.4 registry packs   |

**Chain under test:** WorkProof credential subject → `buildCommodityOriginWitness` → (named profiles) `commodityOriginWitnessToProfileInput` → proof bundle with `commodityOriginZkProof`.

**Redacted fixtures:** `tests/integration/fixtures/tier5-jurisdiction-proof-fixtures.ts`  
**Automated UAT gate:** `tests/integration/tier5-jurisdiction-proofs.test.ts`

---

## 3. UAT modes

| Mode               | When                                                     | Evidence                                             |
| ------------------ | -------------------------------------------------------- | ---------------------------------------------------- |
| **Lab (L0)**       | Every release / PR touching workproof, verification, zkp | CI test output + JSON template (§6)                  |
| **Simulator (L1)** | Pre-pilot with regulator sandbox                         | Redacted fixtures + KAT cross-impl report            |
| **Sovereign (L2)** | Design-partner board sign-off                            | Board-signed PDF + redacted JSON; **no PII in repo** |

This document defines **L0** completely and **L1** checklist; **L2** is external (DTF-5.5.4).

---

## 4. Scenario matrix

| ID        | Board / context                         | Profile             | Pass criteria                                                                     |
| --------- | --------------------------------------- | ------------------- | --------------------------------------------------------------------------------- |
| UAT-GH-01 | Ghana Minerals Commission (gold)        | `gh-gold-origin`    | Verifier confirms bundle structure; mine ID not in public inputs; license bit set |
| UAT-GH-02 | Ghana cocoa (COCOBOD / LICOR narrative) | `gh-cocoa-origin`   | Grade + grams semantics; origin-authenticated mask                                |
| UAT-ZW-01 | Zimbabwe MMMD / KPDA (diamond)          | `zw-diamond-origin` | Regional cert flag; clarity + centi-carats semantics                              |
| UAT-BW-01 | Botswana (diamond, regional pack)       | `zw-diamond-origin` | Same pack as ZW lab path; jurisdiction metadata in test only                      |
| UAT-NA-01 | Namibia (gold, generic until registry)  | `commodity-origin`  | Witness + crypto bundle; no named ZK ref until NA pack ships                      |
| UAT-CD-01 | DRC (gold, generic until registry)      | `commodity-origin`  | Same as NA-01                                                                     |
| UAT-X-01  | Cross-jurisdiction                      | All above           | `tier5-jurisdiction-proofs` — 14 tests pass                                       |
| UAT-X-02  | KAT portability                         | groth16 profiles    | `pnpm test:kat-cross-impl` — 6/6 PASS                                             |

**Negative cases (lab):** Run `cargo test -p gtcx-zkp circuit_profiles` — profile negative tests must pass (wrong bounds, missing cert mask).

---

## 5. Execution procedure (L0 lab UAT)

Run from repo root (`gtcx-core`):

```bash
# Witness + bundle integration (DTF-5.3.2)
cd tests/integration && pnpm test tier5-jurisdiction-proofs

# Profile negatives (Rust)
cargo test -p gtcx-zkp circuit_profiles

# KAT cross-implementation (6 Groth16 vectors)
pnpm test:kat-cross-impl

# Quality gates
pnpm typecheck
pnpm architecture:check
```

**Record:** Copy command outputs (exit codes, test counts) into evidence JSON (§6). Do not paste raw proving keys or production VK paths.

---

## 6. Evidence artifact

**Template (machine-readable):** [minerals-board-uat-evidence-template.json](../audit/evidence/minerals-board-uat-evidence-template.json)

**Completed run naming:** `01-docs/05-audit/evidence/minerals-board-uat-YYYY-MM-DD.json`

**Log entry:** Append to [uat-evidence-log.md](../agile/testing/uat-evidence-log.md) at sprint close.

### Required fields (summary)

| Field       | Description                                         |
| ----------- | --------------------------------------------------- |
| `schema`    | `gtcx.minerals-board-uat.v1`                        |
| `uat_level` | `L0` \| `L1` \| `L2`                                |
| `scenarios` | Array of `{ id, status, profileId?, evidenceRef? }` |
| `commands`  | `{ command, exitCode }[]`                           |
| `redaction` | Confirm no PII / no production secrets              |
| `sign_off`  | Optional external board contact (redacted id only)  |

---

## 7. Acceptance criteria (DTF-5.3.3 done)

- [x] Protocol document published (`01-docs/04-ops/minerals-board-uat-protocol.md`)
- [x] JSON evidence template published (`01-docs/05-audit/evidence/minerals-board-uat-evidence-template.json`)
- [x] Scenarios reference Tier-5 fixtures and integration tests
- [x] L0 command list documented
- [ ] L1/L2 run (external — not required for S-T5-3 code exit)

**S-T5-3 engineering exit:** DTF-5.3.3 ops-docs + DTF-5.3.1–5.3.2 code + lab L0 evidence optional on first publish.

---

## 8. References

| Resource             | Path                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Tier-5 workplan      | [tier-5-workplan-2026-06.md](./tier-5-workplan-2026-06.md)                                        |
| Execution roadmap    | [execution-roadmap.md](../audit/execution-roadmap.md)                                             |
| Full-audit Sprint 3  | [full-audit-2026-06-04.md](../audit/full-audit-2026-06-04.md) §6                                  |
| ZKP circuit profiles | [zkp-circuit-profiles.md](../specs/03-platform/packages/zkp-circuit-profiles.md)                  |
| Moat UAT scenarios   | [algorithmic-moat-program-2026-06-02.md](../agile/roadmap/algorithmic-moat-program-2026-06-02.md) |
| Release checklist    | [release-checklist.md](../devops/release-mgmt/release-checklist.md)                               |

---

_DTF-5.3.3 — closes S-T5-3 ops-docs track; unblocks S-T5-4 (CircuitRegistry)._
