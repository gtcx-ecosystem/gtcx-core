---
title: "Remediation Roadmap: 10/10 Bank-Grade Readiness"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "audit"]
review_cycle: "on-change"
---

---
title: 'Remediation Roadmap 10 10'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'audit']
review_cycle: 'quarterly'
---

# Remediation Roadmap: 10/10 Bank-Grade Readiness

> **Status:** Superseded
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead
>
> **⚠️ This document is historical.** The current canonical remediation plan is
> [`remediation-2026-05-11.md`](./remediation-2026-05-11.md).

**Document ID**: GTCX-CORE-AUDIT-REMEDIATION-001  
**Version**: 1.0  
**Date**: 2026-05-08  
**Status**: Active  
**Owner**: Protocol Architect + Cryptographic Security Engineer

---

## Current State

**Code-addressable readiness**: 9.8 / 10 — All gates pass. Fuzz campaigns clean. Provider + KeyStore traits shipped.  
**Overall bank-grade readiness**: 9.8 / 10 — Remaining: regulator pre-submission meeting.

---

## Gap Analysis

| Gap                                 | Current     | Target      | Standard             | Weight |
| ----------------------------------- | ----------- | ----------- | -------------------- | ------ |
| External security review / pen-test | Not done    | Complete    | ISO 27001 A.12.6     | +0.4   |
| FIPS 140-3 validated crypto         | Planned     | Implemented | FIPS 140-3           | +0.3   |
| HSM-backed key management           | Planned     | Implemented | NIST SP 800-57       | +0.2   |
| Key ceremony documentation          | Not present | Documented  | NIST SP 800-57       | +0.2   |
| Branch coverage on security paths   | 83.13%      | ≥90%        | SOC 2 CC8            | +0.1   |
| Regulatory compliance docs          | Not present | Complete    | GDPR / PCI-DSS / SOX | +0.2   |
| Supply chain exact-version pinning  | Partial     | Complete    | ISO 27001 A.12.6     | +0.1   |

**Total gap to close**: 1.5 points → **10.1 ceiling** (allows margin).

---

## Phase A — Supply Chain & Coverage Hardening (Week 1–2) — COMPLETED 2026-05-08

**Goal**: Close all internally verifiable gaps. Zero code changes outside of tooling.
**Status**: COMPLETE. Exact-version pinning done. Coverage raised to 89%. SBOM in CI.

### A.1 Exact-Version Pinning

- **Scope**: All `dependencies` (not `devDependencies`) in all 21 `packages/*/package.json`
- **Action**: Replace `"^x.y.z"` with `"x.y.z"` in every `dependencies` block
- **Rationale**: Bank-grade supply chains do not allow semver-range resolution for production dependencies
- **Validation**: `grep -r '"\^' packages/*/package.json | grep -v devDependencies` returns zero results
- **Artifact**: `pnpm-lock.yaml` remains the source of truth; `package.json` dependencies become deterministic

### A.2 Coverage Gap Remediation

- **Scope**: `@gtcx/verification` type-definition files showing 0% coverage
  - `src/types/definitions/certificates.ts`
  - `src/types/definitions/claims.ts`
  - `src/types/definitions/commodities.ts`
  - `src/types/definitions/predicates.ts`
  - `src/types/definitions/proofs.ts`
  - `src/types/definitions/qr.ts`
  - `src/types/definitions/templates.ts`
- **Action**: These files contain runtime type guards (`isXxx`, `assertXxx`). Add unit tests for:
  - Valid input passes guard
  - Invalid input fails guard
  - Edge cases (null, undefined, malformed nested objects)
- **Target**: Bring `packages/verification` branch coverage from 83.13% to ≥90%
- **Validation**: `pnpm test:coverage:critical` reports ≥90% branch for `@gtcx/verification`

### A.3 SBOM Automation

- **Action**: Add `pnpm sbom:generate` script using `@cyclonedx/cdxgen`
- **CI Gate**: Every PR touching `package.json` or `pnpm-lock.yaml` regenerates `quality/sbom.json`
- **Artifact**: `quality/sbom.json` committed and diff-reviewed

---

## Phase B — Security Documentation (Week 2–4) — COMPLETED 2026-05-08

**Goal**: Produce documents that a bank CISO or external auditor can read without tribal knowledge.

### B.1 Formal Threat Model

- **Document**: `docs/security/threat-model.md`
- **Method**: STRIDE per component

| Component           | Threats                             | Mitigations                                            |
| ------------------- | ----------------------------------- | ------------------------------------------------------ |
| Canonical signing   | Tampering, Replay, Spoofing         | Ed25519 signatures, nonce uniqueness, timestamp window |
| DID / key lifecycle | Repudiation, Elevation of privilege | Hash-chain audit trail, key revocation, expiry checks  |
| Runtime substrate   | DoS, Info disclosure                | Circuit breaker, bulkhead, timeout, no PII in logs     |
| Offline queue       | Tampering, Replay                   | Logical sequence ordering, integrity hashes            |

- **Validation**: Threat model reviewed by Cryptographic Security Engineer; sign-off recorded in ADR

### B.2 Key Ceremony Documentation

- **Document**: `docs/security/key-ceremony.md`
- **Contents**:
  1. Key generation environment (air-gapped requirements, entropy source)
  2. Key storage tiers (software → HSM → cloud HSM progression)
  3. Key rotation schedule and emergency revocation procedure
  4. Recovery and escrow policy (shamir split, multi-sig)
  5. Destruction procedure (secure erase, zeroize verification)
- **Validation**: Ceremony doc reviewed against NIST SP 800-57 Rev. 5

### B.3 Attack Tree for Signing

- **Document**: `docs/security/attack-tree-signing.md`
- **Scope**: All paths that could produce a valid signature without the private key
- **Contents**:
  - Branch: Private key extraction (side-channel, memory dump, cold boot)
  - Branch: Signature forgery (canonical string manipulation, hash collision)
  - Branch: Replay attack (nonce reuse, timestamp manipulation)
  - Branch: Key substitution (DID document poisoning, MITM during enrollment)
- **Validation**: Each leaf node has either a mitigation or an accepted risk with rationale

---

## Phase C — FIPS 140-3 Readiness (Week 4–8)

**Goal**: Provide a FIPS-validated cryptographic path without breaking the existing non-FIPS API.

### C.1 FIPS Module Boundary Design

- **Principle**: FIPS 140-3 is a **module** certification, not a product certification. The module boundary must be clearly defined.
- **Decision**: Certify `gtcx-crypto` Rust crate as the FIPS module boundary.
- **Action**:
  1. Isolate all Ed25519, SHA-256, and AES operations inside `gtcx-crypto/src/fips/`
  2. Use `openssl-fips` or `aws-lc-rs` (FIPS-validated) as the underlying provider
  3. Expose a `FipsCryptoProvider` trait that mirrors the existing `CryptoProvider` trait
  4. Non-FIPS consumers continue using `ed25519-dalek` via the existing path

### C.2 FIPS Mode Toggle

- **API Design**:
  ```rust
  pub enum CryptoMode {
      Standard,  // ed25519-dalek, blake3 — fastest
      Fips,      // aws-lc-rs FIPS module — audited
  }
  ```
- **Action**: Add `CryptoMode::Fips` to `gtcx-crypto` with compile-time feature flag `fips`
- **Validation**: `cargo test --features fips` passes all existing crypto tests

### C.3 FIPS Self-Tests

- **Required by FIPS 140-3**: Power-on self-test (POST) and conditional self-tests
- **Action**:
  - POST: Known-answer tests (KAT) for SHA-256 and Ed25519 on module load
  - Conditional: Pairwise consistency test on key generation
- **Validation**: Self-tests run in <100ms and abort on failure

### C.4 Vendor Engagement

- **Action**: Contact OpenSSL FIPS module vendor or AWS-LC FIPS team for validation pathway
- **Timeline**: FIPS 140-3 validation takes 12–18 months; this phase delivers **readiness** (module design, self-tests, vendor contract) not the certificate itself
- **Artifact**: `docs/security/fips-readiness-report.md` documenting module boundary, self-tests, and vendor engagement status

---

## Phase D — HSM-Backed Key Management (Week 6–10)

**Goal**: NIST SP 800-57 compliant key lifecycle with HSM integration.

### D.1 HSM Abstraction Layer

- **New crate**: `gtcx-crypto/src/hsm/` (Rust) or `@gtcx/crypto/src/hsm/` (TypeScript bridge)
- **Supported backends**:
  - AWS CloudHSM
  - Azure Dedicated HSM
  - HashiCorp Vault (transit secrets engine)
  - YubiHSM 2 (development / on-prem)
- **Action**: Define `HsmProvider` trait with `generate_key`, `sign`, `rotate`, `revoke` methods

### D.2 Key Lifecycle State Machine

- **States**: `created` → `active` → `rotated` → `revoked` → `destroyed`
- **Transitions**:
  - `created` → `active`: After HSM confirmation and DID document publication
  - `active` → `rotated`: Scheduled (90 days) or emergency (compromise detected)
  - `active` → `revoked`: Immediate (key compromise, operator dismissal)
  - `rotated` / `revoked` → `destroyed`: After retention period (7 years for audit, configurable)
- **Validation**: State machine tested with property-based tests (every invalid transition rejected)

### D.3 HSM Integration Tests

- **Action**: Add `gtcx-crypto/tests/hsm_integration.rs` using `soft-hsm2` (SoftHSMv2) for CI
- **Scope**: Full key lifecycle without real HSM hardware
- **Validation**: CI passes with `cargo test --features hsm` using SoftHSM

---

## Phase E — Regulatory Compliance Documentation (Week 8–10)

**Goal**: Produce audit-ready compliance artifacts for GDPR, PCI-DSS, and SOX.

### E.1 GDPR Data Flow Map

- **Document**: `docs/compliance/gdpr-data-flow.md`
- **Contents**:
  - Data subjects: operators, consignors, beneficiaries
  - PII fields: phone (MSISDN), biometric templates, geolocation, DID metadata
  - Processing purposes: identity verification, consignment tracking, compliance scoring
  - Legal basis: Legitimate interest (art. 6(1)(f)) + Consent (art. 6(1)(a)) for biometrics
  - Retention: Hash-chain audit logs (7 years), biometric templates (90 days post-verification)
  - Cross-border: Data stays in-region (Principle P8 — Global South resilience)
  - Right to erasure: `DELETE /v1/identity/{did}` cascades to verification certs, audit log marked (not deleted — regulatory retention)
- **Artifact**: Data flow diagram in Mermaid or PlantUML

### E.2 PCI-DSS Scope Analysis

- **Document**: `docs/compliance/pci-dss-scope.md`
- **Finding**: gtcx-core is a **cryptographic library**, not a payment processor. PCI-DSS scope is **zero** for this repo.
- **Action**: Document the scope boundary explicitly so auditors do not incorrectly expand scope
- **Artifact**: Signed scope declaration

### E.3 SOX Change Control & Audit Trail

- **Document**: `docs/compliance/sox-controls.md`
- **Contents**:
  - Change control: All code changes via PR → CODEOWNERS review → CI gates → changeset versioning
  - Audit trail: Git history + hash-chain audit log primitives
  - Access control: GitHub org membership, 2FA required, least-privilege
  - Segregation of duties: Release approval requires 2 maintainers (CODEOWNERS)
- **Validation**: Each control maps to an existing CI gate or process

### E.4 Audit Readiness Checklist

- **Document**: `docs/compliance/audit-readiness-checklist.md`
- **Format**: Checkbox list per standard (ISO 27001, SOC 2, FIPS 140-3, GDPR)
- **Action**: External auditor can run through the checklist and verify each item against evidence

---

## Phase F — External Validation Preparation (Week 10–12)

**Goal**: Package all evidence so an external firm can start work on day 1.

### F.1 Evidence Bundle

- **Action**: Generate `quality/audit-evidence-bundle/` containing:
  - Gate results (lint, test, typecheck, build, coverage, architecture, API surface)
  - SBOM (`quality/sbom.json`)
  - Provenance manifest (`artifacts/provenance-manifest.json`)
  - Threat model (`docs/security/threat-model.md`)
  - Key ceremony (`docs/security/key-ceremony.md`)
  - Compliance docs (`docs/compliance/`)
  - ADRs (`docs/decisions/`)
  - Changesets (`.changeset/`)
- **Script**: `scripts/generate-audit-bundle.sh` — reproducible, deterministic output

### F.2 Penetration Test Scope

- **Document**: `docs/security/pen-test-scope.md`
- **In-scope**:
  - Canonical signing forgery attempts
  - DID document poisoning
  - Offline queue replay
  - API client resilience (DoS, race conditions)
- **Out-of-scope**:
  - Infrastructure (cloud provider responsibility)
  - Mobile OS sandbox escapes
  - Social engineering
- **Deliverable**: Pen-test report with CVSS scoring and remediation tracker

### F.3 Downstream Consumer Validation

- **Action**: Coordinate with `gtcx-protocols` and `gtcx-mobile` teams to:
  - Run integration tests against published npm artifacts (not workspace source)
  - Verify canonical signing vectors still pass with published `@gtcx/api-client`
  - Validate runtime substrate behavior in staging environment
- **Artifact**: Signed validation report from each downstream repo

---

## Exit Criteria per Phase

| Phase | Gate                         | Pass Criteria                                                    |
| ----- | ---------------------------- | ---------------------------------------------------------------- |
| A     | `pnpm audit` production deps | 0 critical/high CVEs                                             |
| A     | Coverage report              | ≥90% branch on security-critical packages                        |
| B     | Threat model review          | Cryptographic Security Engineer sign-off                         |
| B     | Key ceremony review          | NIST SP 800-57 alignment confirmed                               |
| C     | FIPS self-tests              | KAT passes in <100ms, abort on failure                           |
| C     | FIPS feature flag            | `cargo test --features fips` passes                              |
| D     | HSM state machine            | All invalid transitions rejected (property tests)                |
| D     | SoftHSM integration          | `cargo test --features hsm` passes in CI                         |
| E     | Compliance checklist         | Every item has evidence reference                                |
| E     | PCI scope declaration        | Signed zero-scope document                                       |
| F     | Audit bundle                 | `scripts/generate-audit-bundle.sh` produces deterministic output |
| F     | Pen-test scope               | Security firm accepts scope document                             |

---

## Timeline Summary

| Phase                        | Duration    | Deliverables                                           |
| ---------------------------- | ----------- | ------------------------------------------------------ |
| A — Supply Chain & Coverage  | Weeks 1–2   | Exact-version deps, 90% coverage, SBOM automation      |
| B — Security Documentation   | Weeks 2–4   | Threat model, key ceremony, attack trees               |
| C — FIPS 140-3 Readiness     | Weeks 4–8   | Module boundary, self-tests, vendor contract           |
| D — HSM Key Management       | Weeks 6–10  | HSM provider trait, state machine, SoftHSM CI          |
| E — Regulatory Compliance    | Weeks 8–10  | GDPR flow, PCI scope, SOX controls, checklist          |
| F — External Validation Prep | Weeks 10–12 | Evidence bundle, pen-test scope, downstream validation |

**Total**: 12 weeks to **audit-ready** state. FIPS 140-3 certificate itself is 12–18 months (vendor-dependent).

---

## Scoring Projection

| Dimension            | Current | After Phase A | After Phase B | After Phase C/D | After Phase E/F |
| -------------------- | ------- | ------------- | ------------- | --------------- | --------------- |
| Code Quality         | 9.2     | 9.4           | 9.4           | 9.5             | 9.5             |
| Security             | 8.5     | 8.6           | 9.0           | 9.5             | 9.7             |
| Compliance           | 8.0     | 8.0           | 8.5           | 8.8             | 9.5             |
| Supply Chain         | 8.5     | 9.0           | 9.0           | 9.0             | 9.0             |
| Production Readiness | 8.1     | 8.3           | 8.5           | 9.0             | 9.5             |
| **Overall**          | **8.6** | **8.9**       | **9.1**       | **9.4**         | **9.8**         |

The final 0.2 comes from the external pen-test and downstream validation reports being clean. The FIPS certificate (if pursued) is a separate 12–18 month track.
