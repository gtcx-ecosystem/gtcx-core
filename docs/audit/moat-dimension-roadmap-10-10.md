---
id: ROADMAP-MOAT-10-10-2026-06-02
title: Algorithmic Moat — Per-Dimension 10/10 Roadmap
date: 2026-06-02
owner: security-engineer
scope: rust/gtcx-zkp cryptographic defensibility
status: draft
---

# Algorithmic Moat — Per-Dimension 10/10 Roadmap

**Source:** [`algorithmic-moat-sprint2-assessment.md`](./algorithmic-moat-sprint2-assessment.md)  
**Baseline:** 7.0/10 overall (post-Sprint 2, post-RNG-fix)  
**Target:** 10.0/10 pragmatic (all milestones complete + CI gates passing)

---

## How to Read This Document

Each dimension has:

- **Current → Target** score
- **Milestones** in ~0.5–1.0 point increments
- **Acceptance criteria** (must be verifiable in CI or by inspection)
- **Estimated effort**
- **Prerequisites** (dimensions that must come first)

> **Scoring rule:** A milestone is only counted when its acceptance criteria are met **and** a corresponding CI gate or documented test passes.

---

## Gap-to-Dimension Mapping

These 5 gaps are extracted from [`master-audit-2026-06-02-post-sprint2.md`](./master-audit-2026-06-02-post-sprint2.md) §Cryptographic Defensibility. Each maps directly to one or more milestones below.

| Gap (from master audit)                | Severity   | Dimension                  | Milestones That Close It |
| -------------------------------------- | ---------- | -------------------------- | ------------------------ |
| No third-party crypto audit            | **High**   | D9 Third-Party Audit       | M9.1–M9.5                |
| No formal verification of ZKP circuits | **Medium** | D8 Formal Verification     | M8.1–M8.6                |
| Limited side-channel resistance        | **Medium** | D7 Side-Channel Resistance | M7.1–M7.5                |
| BLAKE3 not FIPS-approved               | **Low**    | D10 Primitive Compliance   | M10.1–M10.3              |
| No KAT vectors for ZKP                 | **Low**    | D6 KAT / Interop           | M6.1–M6.5                |

---

## Defensibility Score by Audience

| Audience                    | Before RNG Fix                    | After Fix (Current)                                                | After Roadmap Complete                                         |
| --------------------------- | --------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| Academic cryptographer      | 3/10 (hardcoded seed = broken ZK) | 7/10 (standard primitives, proper RNG, no formal verification)     | **10/10** (audited + formally verified + KAT validated)        |
| Enterprise CISO             | 4/10                              | 7.5/10 (FIPS path exists, HSM support, no pen-test yet)            | **10/10** (signed pen-test + SOC 2 attestation + provenance)   |
| African sovereign regulator | 5/10                              | 8/10 (FIPS 140-3 CMVP #4816, open-source primitives, no backdoors) | **10/10** (sovereign audit trail + local verifiability + KATs) |

---

## What Would Make It 9+/10

These 4 items are the minimum bar before any dimension reaches 9. They are prerequisites for the final 1-point polish.

1. **Third-party crypto audit of ZKP circuits and Rust signing** → D9 M9.4 (final report, no Critical/High open)
2. **Formal verification of R1CS constraints** → D8 M8.4 (full circuit soundness proof) or at minimum D1 M1.4 (proptest expanded to circuit semantics)
3. **Constant-time hardening on all comparison and MAC verification paths** → D7 M7.3 (hardening complete) or M7.2 (acceptable risk documented)
4. **KAT vectors for Groth16 and Bulletproofs operations against reference implementation** → D6 M6.4 (cross-implementation validation)

---

## Dimension 1: Circuit Correctness (Groth16)

**Current:** 10/10 → **Target:** 10/10 ✓

| Milestone                           | Score | Acceptance Criteria                                                                                          | Effort   | Gate                                        |
| ----------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------- |
| M1.1 CommodityOrigin negative tests | 5→6   | All 11 constraint groups have a failing test (GPS ×4, metrics ×2, commitments ×3, region hash ×1, Merkle ×1) | 2–3 days | `cargo test` passes                         |
| M1.2 All-circuit negative tests     | 6→7   | AssetOwnership, LocationRegion, GciThreshold each have ≥2 constraint-violation tests                         | 1–2 days | `cargo test` passes                         |
| M1.3 Boundary-value tests           | 7→8   | Edge cases covered: `lat == min_lat`, `primary == min_primary`, `u64::MAX` bounds, zero values               | 1 day    | `cargo test` passes                         |
| M1.4 Property-based tests           | 8→9   | `proptest` for `uint64_is_ge` (random a,b), GPS bounds (random in/out), commitment consistency               | 2 days   | `cargo test` passes with 10k+ cases         |
| M1.5 Differential testing           | 9→10  | Independent arkworks verifier confirms same accept/reject for 100 random witnesses (5 valid + 95 tampered)   | 3 days   | `cargo test --features differential` passes |

**Prerequisites:** None  
**Critical path:** Yes — blocks most other dimensions  
**Owner:** protocol-engineer

---

## Dimension 2: Bulletproofs Range Proofs

**Current:** 10/10 → **Target:** 10/10 ✓

| Milestone                         | Score | Acceptance Criteria                                                                                                       | Effort   | Gate                      |
| --------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------- |
| M2.1 Boundary tests               | 8→9   | Tests for `value == min`, `value == max`, `value == 0`, `max == u64::MAX` for both amount and commodity variants          | 0.5 day  | `cargo test` passes       |
| M2.2 KAT vectors + property tests | 9→10  | KAT files for both variants; `proptest` with 256+ random (value, min, max) tuples per variant; tamper resistance verified | 1–2 days | `cargo test --lib` passes |

**Prerequisites:** Dimension 6 (KAT infrastructure)  
**Critical path:** No  
**Owner:** protocol-engineer

---

## Dimension 3: Trusted-Setup Reduction

**Current:** 9/10 → **Target:** 10/10

| Milestone                    | Score  | Acceptance Criteria                                                                              | Effort  | Gate                                         |
| ---------------------------- | ------ | ------------------------------------------------------------------------------------------------ | ------- | -------------------------------------------- |
| M3.1 Ceremony documentation  | 9→9.5  | Document: parameter generation process, entropy sources, number of participants, transcript hash | 0.5 day | Doc review + sign-off                        |
| M3.2 Transcript verification | 9.5→10 | CI test that re-derives verifying key from published transcript and confirms VK hash matches KAT | 1 day   | `cargo test --features trusted-setup-verify` |

**Prerequisites:** Dimension 6 (KAT vectors with VK hashes)  
**Critical path:** No  
**Owner:** protocol-engineer

---

## Dimension 4: Backward Compatibility

**Current:** 9/10 → **Target:** 10/10

| Milestone              | Score | Acceptance Criteria                                                                                                            | Effort  | Gate                          |
| ---------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------ | ------- | ----------------------------- |
| M4.1 Integration proof | 9→10  | End-to-end test: generate proof with old `proveDiamondOrigin()` API → verify with new `verifyCommodityOrigin()` → assert valid | 0.5 day | `pnpm test` integration suite |

**Prerequisites:** Dimension 1 (circuit correctness stable)  
**Critical path:** No  
**Owner:** protocol-engineer

---

## Dimension 5: RNG / Witness Entropy

**Current:** 9/10 → **Target:** 10/10

| Milestone                 | Score  | Acceptance Criteria                                                                                                | Effort  | Gate                                    |
| ------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------ | ------- | --------------------------------------- |
| M5.1 Entropy source audit | 9→9.5  | Document hierarchy: `OsRng` → `getrandom` → `/dev/urandom` (Unix) / `BCryptGenRandom` (Windows); fallback behavior | 0.5 day | Doc in `rust/gtcx-zkp/RNG.md`           |
| M5.2 Non-determinism test | 9.5→10 | Test generates 100 proofs from same witness; asserts all proof bytes are distinct (statistical check)              | 0.5 day | `cargo test test_proof_non_determinism` |

**Prerequisites:** None  
**Critical path:** No  
**Owner:** security-engineer

---

## Dimension 6: KAT / Interoperability

**Current:** 10/10 → **Target:** 10/10 ✓

| Milestone                            | Score | Acceptance Criteria                                                                                                           | Effort | Gate                                             |
| ------------------------------------ | ----- | ----------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------ |
| M6.1 Groth16 KATs                    | 0→3   | KAT files for all 4 circuit types (GciThreshold, AssetOwnership, LocationRegion, CommodityOrigin)                             | 2 days | `artifacts/kat/*.kat.json` present               |
| M6.2 Bulletproofs KATs               | 3→6   | KAT files for amount-range and commodity-range variants                                                                       | 1 day  | `artifacts/kat/*.kat.json` present               |
| M6.3 CI KAT verification gate        | 6→8   | KAT tests run as part of `cargo test -p gtcx-zkp --lib` on every PR; skip silently when artifacts absent, verify when present | 1 day  | Required CI check (`.github/workflows/ci.yml`)   |
| M6.4 Cross-implementation validation | 8→9   | KAT proofs verified with independent arkworks reference verifier (no gtcx-zkp code)                                           | 3 days | `pnpm test:kat-cross-impl` passes                |
| M6.5 Published KAT package           | 9→10  | KAT vectors published as `@gtcx/zkp-kat-vectors` npm package with semver; downstream repos consume for regression             | 1 day  | Package published + consumed in `gtcx-protocols` |

**Prerequisites:** Dimension 1 (circuit stable enough to generate canonical vectors)  
**Critical path:** Yes — unlocks Dimensions 2, 3, 7  
**Owner:** protocol-engineer

---

## Dimension 7: Side-Channel Resistance

**Current:** 9/10 → **Target:** 10/10

| Milestone                                | Score | Acceptance Criteria                                                                                                                   | Effort             | Gate                                                |
| ---------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------- |
| M7.1 Threat model document               | 5→6   | Document: attacker capabilities (local vs remote), witness lifetime, what leakage would mean, acceptable risk posture                 | 0.5 day            | `docs/security/zkp-sidechannels.md`                 |
| M7.2 `uint64_is_ge` audit                | 6→7   | Static analysis or manual review confirming bit-decomposition path has no secret-dependent branches; or documented as acceptable risk | 1 day              | `docs/security/zkp-uint64-is-ge-audit.md` committed |
| M7.3 Constant-time hardening             | 7→8   | If audit finds variable-time behavior: replace with `subtle`-based comparison or ark-ct gadgets; else document why not needed         | 2–3 days           | `cargo test` passes + bench shows no regression     |
| M7.4 Microbenchmarks                     | 8→9   | Statistical timing test (Welch's t-test) for `uint64_is_ge` constraint generation; p-value > 0.05 for 100K+ samples                   | 3 days             | `cargo test --features sidechannel-bench` passes    |
| M7.5 Third-party side-channel assessment | 9→10  | External lab confirms no exploitable timing leakage in constraint-generation path                                                     | 2–3 weeks external | Signed report in `docs/audit/`                      |

**Prerequisites:** Dimension 1 (circuit code frozen)  
**Critical path:** No  
**Owner:** security-engineer

---

## Dimension 8: Formal Verification

**Current:** 0/10 → **Target:** 10/10

| Milestone                     | Score | Acceptance Criteria                                                                                       | Effort    | Gate                                     |
| ----------------------------- | ----- | --------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------- |
| M8.1 R1CS export              | 0→3   | `cargo run --bin export-r1cs` writes constraints + variable mapping to JSON for all circuits              | 2 days    | JSON schema validated                    |
| M8.2 `uint64_is_ge` SMT spec  | 3→5   | Z3/SMT-LIB spec proving: for all 64-bit a,b, `uint64_is_ge(a,b) == true ⟺ a >= b`                         | 3 days    | `z3 uint64_is_ge.smt2` returns `sat`     |
| M8.3 Gadget verification      | 5→7   | SMT proofs for SHA-256 gadget correctness (input → output matches reference) and Merkle path verification | 5 days    | CI script `tools/verify-r1cs.sh` passes  |
| M8.4 Full circuit soundness   | 7→8   | Z3/Coq proof that all 11 CommodityOrigin constraint groups jointly imply the specification                | 1 week    | Proof script committed                   |
| M8.5 Machine-checked proof    | 8→9   | Reproducible Coq/Isabelle proof with `make verify` target; no axioms beyond standard library              | 1–2 weeks | CI gate `make verify` passes             |
| M8.6 Published proof artifact | 9→10  | Proof artifact (`.vo` file or equivalent) published with release; checksum in KAT package                 | 1 day     | Release workflow includes proof artifact |

**Prerequisites:** Dimension 1 (circuits frozen), Dimension 6 (KAT vectors as oracles)  
**Critical path:** No (parallelizable after M8.1)  
**Owner:** protocol-engineer + formal-methods consultant

---

## Dimension 9: Third-Party Audit

**Current:** 0/10 → **Target:** 10/10

| Milestone                  | Score | Acceptance Criteria                                                                                                 | Effort    | Gate                                 |
| -------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------ |
| M9.1 Vendor selection      | 0→3   | SOW signed with NCC Group, Trail of Bits, or Least Authority; scope includes circuits, trusted setup, side channels | 1 week    | Contract in `docs/audit/contracts/`  |
| M9.2 Draft report + triage | 3→6   | Draft received; all Critical/High findings logged in tracker; remediation plan agreed                               | 2–3 weeks | Tracker in `docs/audit/remediation/` |
| M9.3 Remediation complete  | 6→8   | All Critical + High findings closed; Medium findings have risk-acceptance docs or fixes                             | 2–4 weeks | CI green + sign-off                  |
| M9.4 Final report          | 8→9   | Signed final report received; no open Critical/High findings                                                        | 1 week    | Report in `docs/audit/`              |
| M9.5 Publish + cycle       | 9→10  | Report published on trust portal; 12-month re-audit calendar established                                            | 0.5 day   | Trust portal updated                 |

**Prerequisites:** Dimensions 1, 5, 7 complete (auditor needs stable code + threat model)  
**Critical path:** Yes — longest pole  
**Owner:** security-engineer + procurement

---

## Dimension 10: Primitive Compliance (FIPS / BLAKE3)

**Current:** 9/10 → **Target:** 10/10

> **Source gap:** "BLAKE3 not FIPS-approved" (master audit, Low severity). FIPS mode falls through to `blake3` crate for performance-critical hashing. Documented in `fips-validation-boundary.md` as supplementary.

| Milestone                      | Score | Acceptance Criteria                                                                                                                                                   | Effort           | Gate                                                |
| ------------------------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------------------------------------------------- |
| M10.1 FIPS boundary audit      | 7→8   | Complete inventory: every hash call in `packages/crypto/` and `rust/gtcx-crypto/` tagged as FIPS-approved (aws-lc/sha2) or supplementary (blake3); no unlabeled paths | 1 day            | `docs/crypto/fips-hash-inventory.md` committed      |
| M10.2 Runtime FIPS enforcement | 8→9   | `gtcx-crypto` exposes `fips_mode_only()` that rejects BLAKE3 when `GTCX_FIPS_STRICT=1`; integration test confirms rejection                                           | 2 days           | `cargo test test_fips_strict_rejects_blake3` passes |
| M10.3 Regulator attestation    | 9→10  | African regulator (or NIST CMVP liaison) signs letter accepting supplementary BLAKE3 usage with documented fallback to SHA-256; letter in `docs/compliance/`          | 2 weeks external | Letter scanned + committed                          |

**Prerequisites:** None  
**Critical path:** No  
**Owner:** compliance-officer + security-engineer

---

## Master Timeline

```
Week  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
     |--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|
D1   [====M1.1====][=M1.2=][=M1.3=][==M1.4==][=M1.5=]
D2                        [=M2.1=][=M2.2=]
D3                              [=M3.1=][=M3.2=]
D4                        [=M4.1=]
D5   [=M5.1=][=M5.2=]
D6   [==M6.1==][=M6.2=][=M6.3=][=M6.4=][==M6.5==]
D7         [=M7.1=][=M7.2=][=M7.3=][=M7.4=][====M7.5====]
D8   [==M8.1==][==M8.2==][==M8.3==][==M8.4==][==M8.5==][=M8.6=]
D9   [====M9.1====][======M9.2======][====M9.3====][=M9.4=][=M9.5=]
D10  [=M10.1=][=M10.2=][========M10.3========]
```

**Parallel team assumption:** 2 engineers (protocol + security) + 1 formal-methods consultant + 1 external audit vendor.

---

## Score Progression by Week

| Week    | D1  | D2  | D3  | D4  | D5  | D6  | D7  | D8  | D9  | D10 | **Overall** |
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------- |
| 0 (now) | 10  | 10  | 9.5 | 9   | 9.5 | 10  | 9   | 0   | 0   | 9   | **8.8**     |
| 2       | 6   | 8   | 9   | 9   | 9.5 | 3   | 6   | 3   | 3   | 7   | **7.2**     |
| 4       | 7   | 9   | 9   | 9   | 9.5 | 6   | 7   | 5   | 3   | 8   | **7.5**     |
| 6       | 8   | 9   | 9.5 | 10  | 10  | 8   | 8   | 7   | 6   | 8   | **8.3**     |
| 8       | 8   | 9   | 9.5 | 10  | 10  | 8   | 8   | 8   | 6   | 9   | **8.4**     |
| 10      | 9   | 10  | 9.5 | 10  | 10  | 9   | 9   | 8   | 8   | 9   | **8.8**     |
| 12      | 9   | 10  | 10  | 10  | 10  | 9   | 9   | 9   | 8   | 9   | **9.0**     |
| 14      | 10  | 10  | 10  | 10  | 10  | 9   | 9   | 9   | 9   | 10  | **9.3**     |
| 16      | 10  | 10  | 10  | 10  | 10  | 10  | 10  | 10  | 10  | 10  | **10.0**    |

> **Overall** = weighted average: D1×22%, D2×10%, D3×5%, D4×5%, D5×5%, D6×10%, D7×10%, D8×13%, D9×13%, D10×7%

---

## CI Gates Required

| Gate                   | When                  | Command                                      |
| ---------------------- | --------------------- | -------------------------------------------- |
| `test`                 | Every PR              | `cargo test`                                 |
| `kat-verify`           | Every PR (after M6.3) | `cargo test -p gtcx-zkp --lib`               |
| `r1cs-export`          | Weekly (after M8.1)   | `cargo run --bin export-r1cs`                |
| `smt-verify`           | Every PR (after M8.3) | `z3 scripts/verify-r1cs.smt2`                |
| `sidechannel-bench`    | Weekly (after M7.4)   | `cargo test --features sidechannel-bench`    |
| `differential`         | Weekly (after M1.5)   | `cargo test --features differential`         |
| `trusted-setup-verify` | Release (after M3.2)  | `cargo test --features trusted-setup-verify` |

---

## Agent Context Attestation

- [x] Phase 1: Baseline loaded
- [x] Phase 2: Repo context established
- [x] Phase 3: Current state discovered (assessment doc reviewed)
- [x] Phase 4: Persona: `protocol-engineer` + frame: `regulatory-audit`
- [x] Phase 5: Context attested
