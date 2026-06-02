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

---

## Executive Summary

The 2026-06-02 master audit confirmed GTCX Core's operational moat is strong (8.5/10) but the algorithmic layer is **copyable in 90 days** (Ed25519 + arkworks Groth16 are open-source primitives). This program closes that gap by graduating four algorithmic strategies from **scaffolding** → **shipped circuits** with real proofs on real commodities.

| Strategy                         | Moat Type                | Current State                | Target State                          | Timeline     |
| -------------------------------- | ------------------------ | ---------------------------- | ------------------------------------- | ------------ |
| **S1** Commodity ZKP Circuits    | Domain-specific circuits | Hash-commitment placeholders | Jurisdiction-aware commodity proofs   | Sprints 1–4  |
| **S2** Proof-Carrying Data (PCD) | Recursive composition    | Offline queue only           | Recursive proof accumulation per sync | Sprints 3–7  |
| **S3** Predicate-Gated Keystore  | HSM firmware extension   | Cloud KMS scaffolding        | Predicate-enforced signing            | Sprints 5–9  |
| **S4** Post-Quantum Hybrid       | Future-proofing          | None                         | ML-DSA hybrid signatures              | Sprints 8–12 |

**Program score target:** Raise bank-grade composite from **8.5 → 9.2** by closing algorithmic copyability.

---

## Strategy 1: Commodity ZKP Circuits

### PRD

**Problem:** WorkProof predicates (`packages/workproof/src/predicates/definitions/`) describe _what_ to prove ("Origin Authenticated"), but the ZKP layer (`rust/gtcx-zkp/`) only proves generic hash commitments. A regulator asking "prove this gold came from Ghana without revealing the mine" has no circuit.

**Solution:** Per-commodity, per-jurisdiction Groth16 circuits that encode:

1. **Regulatory topology** (COCOBOD license → export permit → customs declaration)
2. **Sensor fusion** (GPS coordinates within approved polygon + weight within range + purity above threshold)
3. **Temporal validity** (certificate not expired + renewal chain intact)

**Success metric:** Zimbabwe Minerals Commission can verify a "Ghana-origin gold" proof in <500ms without seeing the mine ID or transporter route.

**Non-goals:**

- Not replacing WorkProof predicates — circuits _consume_ predicates as witness inputs
- Not implementing full Plonky2 — Groth16 is sufficient for 2026-Q3

### Architecture

```
workproof predicate (TypeScript)
    │
    ▼
witness builder (TypeScript) — maps predicate evidence → circuit witness
    │
    ▼
Groth16 circuit (Rust, arkworks) — per-commodity R1CS
    │
    ▼
proof + public inputs → verification (Rust/TypeScript via NAPI)
```

### Circuit Inventory (Sprint 1–4)

| Circuit                   | Commodity | Jurisdiction | Witness                                        | Public Inputs                                  |
| ------------------------- | --------- | ------------ | ---------------------------------------------- | ---------------------------------------------- |
| `gh-gold-origin`          | Gold      | Ghana        | mine_id, gps_coords, cocobod_license           | origin_region_hash, purity_range, weight_range |
| `zw-diamond-origin`       | Diamonds  | Zimbabwe     | mine_id, kpanda_cert, gps_coords               | kimberley_process_flag, origin_region_hash     |
| `gh-cocoa-origin`         | Cocoa     | Ghana        | farm_id, gps_coords, licor_cert                | origin_region_hash, organic_flag, weight_range |
| `generic-commodity-range` | Any       | Any          | quantity, unit, min_acceptable, max_acceptable | commitment_to_range, unit_hash                 |

### Sprint Plan

**Sprint 1 (Week 1–2): Witness Builder + Ghana Gold Circuit**

- Story: `feat(zkp): witness builder for WorkProof predicates`
- Story: `feat(zkp): gh-gold-origin Groth16 circuit`
- Story: `feat(zkp): NAPI bindings for circuit prove/verify`
- QA: Property tests — random valid/invalid witnesses

**Sprint 2 (Week 3–4): Zimbabwe Diamond + Range Circuit**

- Story: `feat(zkp): zw-diamond-origin circuit with KPDA integration`
- Story: `feat(zkp): generic-commodity-range Bulletproofs circuit`
- QA: Cross-package integration test with `packages/verification`

**Sprint 3 (Week 5–6): Cocoa + Multi-Jurisdiction Test Fixtures**

- Story: `feat(zkp): gh-cocoa-origin circuit`
- Story: `test(integration): five-jurisdiction proof fixtures`
- QA: UAT with dummy COCOBOD/LICOR data

**Sprint 4 (Week 7–8): Circuit Registry + Performance Hardening**

- Story: `feat(zkp): circuit registry with versioning`
- Story: `perf(zkp): <500ms prove, <100ms verify per circuit`
- QA: Load test — 1000 proofs/minute

---

## Strategy 2: Proof-Carrying Data (PCD) for Supply Chain

### PRD

**Problem:** `packages/domain/src/internal/offline-queue.ts` replays events in sequence, but each event is independently signed. A downstream verifier must check N signatures to trust a chain of N events.

**Solution:** Each sync event carries a **succinct recursive proof** that accumulates all prior valid events. Verifier checks ONE proof for the entire chain.

**Success metric:** 100-event supply chain verified in <50ms with a single 256-byte proof.

**Non-goals:**

- Not replacing the offline queue — PCD _wraps_ queue events
- Not building a blockchain — no consensus, just proof accumulation

### Architecture

```
Event 1: miner signs production proof
    │
    ▼
Event 2: transporter signs handoff proof + verifies Event 1 proof
    │
    ▼
Event 3: refiner signs processing proof + verifies Event 2 proof (which includes Event 1)
    │
    ▼
Final proof: single recursive proof covering Events 1–N
```

**Technical approach:** Nova/Supernova recursive folding scheme (arkworks ecosystem) or lightweight SNARK recursion.

### Sprint Plan

**Sprint 3 (Week 5–6): PCD Scaffold + Folding Scheme Research**

- Story: `spike(pcd): evaluate Nova vs Supernova vs custom recursion for GTCX events`
- Story: `feat(pcd): event transcript hashing standard`

**Sprint 4 (Week 7–8): Two-Event Accumulator**

- Story: `feat(pcd): prove two events in one folded proof`
- QA: Property tests — invalid event breaks accumulation

**Sprint 5 (Week 9–10): N-Event Chain + Offline Integration**

- Story: `feat(pcd): recursive accumulation for N events`
- Story: `feat(domain): PCD wrapper for offline queue events`
- QA: Integration test — 100-event chain, intermittent connectivity

**Sprint 6 (Week 11–12): Verifier API + Downstream SDK**

- Story: `feat(api-client): PCD chain verification endpoint`
- Story: `feat(verification): PCD-aware certificate templates`
- QA: UAT — mobile verifier app checks chain in <50ms

**Sprint 7 (Week 13–14): Performance + Circuit Optimization**

- Story: `perf(pcd): <50ms verification for 100-event chain`
- Story: `feat(pcd): circuit versioning for protocol upgrades`

---

## Strategy 3: Predicate-Gated Keystore

### PRD

**Problem:** `rust/gtcx-crypto/src/cloud_kms_keystore.rs` is scaffolding (<100 lines, trait only). The HSM can sign anything. There's no enforcement that a signature requires a valid WorkProof predicate.

**Solution:** **Predicate-gated signing** — the keystore (HSM or software) will not sign unless the caller provides a proof that all required predicates are satisfied.

**Success metric:** A key in the `gh-gold-origin` key group cannot sign without a valid COCOBOD license predicate.

**Non-goals:**

- Not replacing PKCS#11/AWS KMS — it _extends_ them
- Not doing on-chain verification — predicate proof is checked locally in the keystore

### Architecture

```
Signing request
    │
    ▼
Predicate proof (Groth16) attached to request
    │
    ▼
Keystore: verify predicate proof → check key policy → sign
    │
    ▼
Signature returned
```

**Key policy DSL:**

```yaml
key_group: gh-gold-export
required_predicates:
  - CommodityProduced
  - OriginAuthenticated
  - MethodCompliant
min_confidence: 0.8
jurisdiction: GH
```

### Sprint Plan

**Sprint 5 (Week 9–10): Keystore Policy DSL + Software Implementation**

- Story: `feat(keystore): predicate policy DSL parser`
- Story: `feat(keystore): software predicate-gated signer`
- QA: Unit tests — missing predicate = signing rejected

**Sprint 6 (Week 11–12): Cloud KMS Integration**

- Story: `feat(keystore): AWS KMS predicate-gated signing via IAM conditions`
- Story: `feat(keystore): PKCS#11 predicate verification hook`

**Sprint 7 (Week 13–14): HSM Firmware Extension (Design)**

- Story: `design(keystore): HSM predicate verification firmware spec`
- Story: `feat(keystore): simulated HSM predicate gate for testing`

**Sprint 8 (Week 15–16): Key Rotation + Policy Update**

- Story: `feat(keystore): predicate policy versioning and migration`
- Story: `feat(keystore): key rotation with predicate re-verification`
- QA: UAT — key rotation doesn't break existing proofs

**Sprint 9 (Week 17–18): Performance + FIPS Compliance**

- Story: `perf(keystore): <10ms predicate verification per signing`
- Story: `compliance(keystore): FIPS 140-3 validation for predicate-gated path`

---

## Strategy 4: Post-Quantum Hybrid Signatures

### PRD

**Problem:** Commodity certificates have multi-year validity. Standard Ed25519/ECDSA may not survive quantum cryptanalysis. GTCX needs a **hybrid classical+PQC** signature scheme with graceful upgrade.

**Solution:** ML-DSA (Dilithium, NIST FIPS 204) + Ed25519 hybrid signatures. Each certificate carries both signatures. Verifiers accept either during transition, both after transition.

**Success metric:** First hybrid-signed WorkProof issued by 2026-Q4. Graceful downgrade path documented.

**Non-goals:**

- Not replacing Ed25519 immediately — hybrid mode for 2–3 years
- Not implementing PQC KEM (key encapsulation) — focus on signatures

### Architecture

```
Classical: Ed25519 sign(message) → sig_classical
PQC: ML-DSA sign(message) → sig_pqc
Hybrid: (sig_classical, sig_pqc) → encoded together
Verify: accept if sig_classical valid OR sig_pqc valid (transition)
        require both valid (post-transition)
```

### Sprint Plan

**Sprint 8 (Week 15–16): ML-DSA Integration Research + Crate**

- Story: `spike(pqc): evaluate pqc_dilithium vs custom ML-DSA implementation`
- Story: `feat(pqc): ML-DSA signing crate in Rust`

**Sprint 9 (Week 17–18): Hybrid Signer + NAPI Bindings**

- Story: `feat(pqc): hybrid Ed25519+ML-DSA signer`
- Story: `feat(crypto-native): NAPI bindings for hybrid sign/verify`
- QA: Compatibility test — classical-only verifier accepts hybrid cert

**Sprint 10 (Week 19–20): WorkProof Hybrid Integration**

- Story: `feat(workproof): hybrid proof type in VC envelope`
- Story: `feat(workproof): certificate template with PQC flag`
- QA: End-to-end — create hybrid WorkProof → verify with both schemes

**Sprint 11 (Week 21–22): Graceful Degradation + Policy**

- Story: `feat(pqc): transition policy engine (classical → hybrid → pqc-only)`
- Story: `feat(pqc): key migration path for existing Ed25519 keys`

**Sprint 12 (Week 23–24): Standardization + Publication**

- Story: `docs(pqc): GTCX PQC signature standard RFC`
- Story: `feat(pqc): reference implementation published with provenance`
- QA: Third-party interop test with another ML-DSA implementation

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
