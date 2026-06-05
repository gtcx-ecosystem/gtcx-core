---
title: 'Algorithmic Moat Program — gtcx-core'
status: 'current'
date: '2026-06-02'
owner: 'gtcx-core'
role: 'protocol-architect'
tier: 'critical'
tags: ['roadmap', 'algorithmic-moat', 'zkp', 'pqc', 'pcd', 'keystore']
review_cycle: 'weekly'
---

# Algorithmic Moat Program — gtcx-core

> **Status:** Launched 2026-06-02
> **Owner:** Protocol Architect
> **Target:** Make the crypto/algorithms themselves a defensible moat (not just operational depth)
> **Duration:** 12 sprints (24 weeks)
> **Dependencies:** pen-test vendor selection (external); repo public visibility (for provenance)  
> **Operator work plan:** [`01-docs/04-ops/tier-5-workplan-2026-06.md`](../../operations/tier-5-workplan-2026-06.md) (DTF-5.x register, Protocol 22)

---

## Executive Summary

The 2026-06-02 master audit confirmed operational moat is strong; post–AM-1 hardening, the ZKP stack is **Defensibility Tier 2** (~6–12 months to replicate — see [DTF-001](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/frameworks/defensibility-tiers/v1.0.0)). This program targets **Tier 5** (domain-encoded jurisdiction circuits, 12–18+ months) by graduating four strategies from **scaffolding** → **shipped named circuits** with real proofs on real commodities.

| Strategy                         | Moat Type                | Current State                | Target State                          | Timeline     |
| -------------------------------- | ------------------------ | ---------------------------- | ------------------------------------- | ------------ |
| **S1** Commodity ZKP Circuits    | Domain-specific circuits | Hash-commitment placeholders | Jurisdiction-aware commodity proofs   | Sprints 1–4  |
| **S2** Proof-Carrying Data (PCD) | Recursive composition    | Offline queue only           | Recursive proof accumulation per sync | Sprints 3–7  |
| **S3** Predicate-Gated Keystore  | HSM firmware extension   | Cloud KMS scaffolding        | Predicate-enforced signing            | Sprints 5–9  |
| **S4** Post-Quantum Hybrid       | Future-proofing          | None                         | ML-DSA hybrid signatures              | Sprints 8–12 |

**Program score target:** Raise bank-grade composite from **8.5 → 9.2** by closing algorithmic copyability.

---

---

## Strategy detail (split for doc-standard length)

| Strategy                               | Document                                                               |
| -------------------------------------- | ---------------------------------------------------------------------- |
| S1–S4 PRDs, architecture, sprint plans | [Strategy detail](./algorithmic-moat-program-2026-06-02-strategies.md) |

---

## Consolidated Sprint Roadmap

| Sprint | Week  | S1 Circuits                        | S2 PCD                              | S3 Keystore                  | S4 PQC                        | Cross-Cutting           |
| ------ | ----- | ---------------------------------- | ----------------------------------- | ---------------------------- | ----------------------------- | ----------------------- |
| 1      | 1–2   | Witness builder + gh-gold circuit  | —                                   | —                            | —                             | Repo setup, CI gates    |
| 2      | 3–4   | zw-diamond + range circuits        | —                                   | —                            | —                             | Integration tests       |
| 3      | 5–6   | gh-cocoa + 5-jurisdiction fixtures | Folding scheme spike                | —                            | —                             | Doc updates             |
| 4      | 7–8   | Circuit registry + perf            | Two-event accumulator               | —                            | —                             | Security review         |
| 5      | 9–10  | —                                  | —                                   | Policy DSL + software signer | —                             | Mid-program review      |
| 6      | 11–12 | —                                  | N-event chain + offline integration | Cloud KMS integration        | —                             | Performance baseline    |
| 7      | 13–14 | —                                  | Verifier API + mobile SDK           | HSM design + simulated       | —                             | UAT with pilot partners |
| 8      | 15–16 | —                                  | Performance optimization            | Key rotation                 | ML-DSA spike + crate          | FIPS consultation       |
| 9      | 17–18 | —                                  | —                                   | Performance + FIPS           | Hybrid signer + NAPI          | External audit prep     |
| 10     | 19–20 | —                                  | —                                   | —                            | WorkProof hybrid integration  | Pilot deployment        |
| 11     | 22–22 | —                                  | —                                   | —                            | Transition policy + migration | Security hardening      |
| 12     | 23–24 | —                                  | —                                   | —                            | Standardization + publication | Program closeout        |

---

## QA / UAT Plan

### Per-Strategy QA Gates

| Strategy    | Unit Tests  | Property Tests                 | Integration Tests               | Performance Gate            | Security Review        |
| ----------- | ----------- | ------------------------------ | ------------------------------- | --------------------------- | ---------------------- |
| S1 Circuits | 100% branch | Random valid/invalid witnesses | Cross-package with verification | <500ms prove, <100ms verify | Cryptography engineer  |
| S2 PCD      | 100% branch | Invalid event breaks chain     | 100-event offline queue         | <50ms verify 100 events     | Protocol engineer      |
| S3 Keystore | 100% branch | Missing predicate = reject     | Cloud KMS integration           | <10ms predicate check       | Security engineer      |
| S4 PQC      | 100% branch | Classical-only verifier compat | End-to-end WorkProof            | <200ms hybrid sign          | External cryptographer |

### UAT Scenarios

1. **Ghana Minerals Commission:** Verify gh-gold-origin proof without seeing mine ID
2. **Zimbabwe KPDA:** Verify zw-diamond-origin proof with kimberley process flag
3. **Mobile buying station:** Sync 50 events offline, verify final PCD proof in <50ms
4. **Export broker:** Sign shipment with predicate-gated key (COCOBOD license required)
5. **Regulator 2028:** Verify hybrid PQC certificate with only ML-DSA verifier

---

## Risk Register

| Risk                                          | Probability | Impact | Mitigation                                               |
| --------------------------------------------- | ----------- | ------ | -------------------------------------------------------- |
| arkworks 0.5 migration breaks circuits        | Medium      | High   | Pin 0.4.x; migration tracker in `rust/.cargo/audit.toml` |
| Nova/Supernova too immature for PCD           | Medium      | High   | Fallback: custom Groth16 recursion with trusted setup    |
| HSM firmware predicate gate blocked by vendor | High        | High   | Software gate + AWS KMS conditions as interim            |
| ML-DSA FIPS 204 not yet finalized             | Medium      | Medium | Track NIST; use final-draft parameter sets               |
| Pilot partner availability for UAT            | High        | High   | Build simulator fixtures; sovereign engagement sprint    |

---

## Acceptance Criteria (Program Level)

- [ ] All 4 circuit families prove + verify with <500ms / <100ms
- [ ] PCD verifies 100-event chain in <50ms
- [ ] Predicate-gated signing rejects 100% of unauthorized requests
- [ ] Hybrid PQC certificates backward-compatible with classical verifiers
- [ ] Bank-grade composite score ≥ 9.2/10
- [ ] Zero `unsafe` Rust added
- [ ] 100% branch coverage on new Rust code
