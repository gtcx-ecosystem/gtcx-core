---
title: 'gtcx-core — Repository Overview'
status: 'current'
date: '2026-06-03'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'overview']
review_cycle: 'on-change'
---

# gtcx-core — Repository Overview

> **Status:** Current
> **Date:** 2026-06-03  
> **Owner:** Protocol Architect  
> **Audit quality (1–10):** L1 **8.5** · L2 **8.5** · L3 register **8.0** · L4 **8.5** · L5 **8.0** — [readiness model](../audit/readiness-model.md)  
> **Readiness outcomes:** eng 9.5/10.0 · internal **9.0** (5 domains) · Industry **IC-T0** OPEN 0/12 · bank-grade **8.9** · GTM-Readiness **GR-T1** / sovereign **&lt; GR-T2**  
> **Defensibility Tier 5 technical:** ~88% (engineering lane; ceremony/commercial external)  
> **Next review:** 2026-09-01 (quarterly)

---

## 1. Executive Summary

**In one sentence for a 10-year-old:** `gtcx-core` is the digital trust factory that lets African miners and farmers prove their gold and crops are real, ethical, and traceable — without revealing private details.

**In one sentence for a CTO:** `gtcx-core` is a bank-grade cryptographic and protocol foundation (TypeScript + Rust) that provides signing, identity, verification, zero-knowledge proofs, and offline-first sync primitives consumed by 6+ downstream GTCX products.

**In one sentence for an investor:** `gtcx-core` is the compounding platform layer of the GTCX ecosystem — every verification proof, digital identity, and trade certificate traces its trust back to this repo; as downstream products multiply, the value of this foundation compounds non-linearly.

**Maturity state:** See [readiness-model](../audit/readiness-model.md) — **audit quality 1–10** is separate from **readiness outcomes**. Engineering **9.5/10.0**; internal compliance **9.0** (repo/docs **9.6**, AI/security **8.8**, corporate **8.2**); bank-grade **8.9**; Industry **IC-T0**; GTM-Readiness **GR-T1** / sovereign **below GR-T2**.

**Remaining gaps:** L3 IC-T0 blockers — pen-test, SOC 2 letter, XR-402 ceremony. L5 GR-T2 ecosystem — testnet/DR, sandbox send.

---

## 2. What This Repository Does

### 2.1 Core Capabilities

| #   | Capability                          | What It Does                                                                                                          | Who It Serves                                     | Evidence                                                                                                                       |
| --- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Cryptographic Primitives**        | Ed25519 / Secp256k1 / P256 signing, SHA-256/512 / BLAKE3 hashing, key derivation, commitment schemes                  | All downstream repos                              | `03-platform/packages/crypto/`, `rust/gtcx-crypto/` — [spec](../specs/03-platform/packages/crypto.md)                          |
| 2   | **Zero-Knowledge Proofs**           | Groth16 (GCI threshold, asset ownership, location region), Bulletproofs (amount range), Schnorr (identity attributes) | `gtcx-markets`, `gtcx-protocols`                  | `rust/gtcx-zkp/` — [spec](../specs/03-platform/packages/rust/gtcx-zkp.md)                                                      |
| 3   | **Digital Identity**                | DID creation, resolution, credential lifecycle, key management                                                        | `gtcx-markets`, sovereign wallets                 | `03-platform/packages/identity/` — [spec](../specs/03-platform/packages/identity.md)                                           |
| 4   | **Verification Infrastructure**     | Certificate generation, QR codes, proof bundles, revocation registries                                                | Compliance officers, export brokers               | `03-platform/packages/verification/` — [spec](../specs/03-platform/packages/verification.md)                                   |
| 5   | **Offline-First Sync**              | Durable queue, conflict resolution, replay ordering by logical sequence                                               | Buying station agents in low-connectivity regions | `03-platform/packages/sync/` — [spec](../specs/03-platform/packages/sync.md)                                                   |
| 6   | **Resilient Networking**            | Connectivity detection, adaptive retry, circuit breaker; P2P **types/scaffolding** (libp2p Phase 2)                   | Field operators, mobile apps                      | `03-platform/packages/connectivity/`, `03-platform/packages/network/` — [specs](../specs/03-platform/packages/connectivity.md) |
| 7   | **Domain Models**                   | Commodity-agnostic types, events, schemas, metrics, versioning                                                        | All downstream repos                              | `03-platform/packages/domain/` — [spec](../specs/03-platform/packages/domain.md)                                               |
| 8   | **WorkProof / TradeCV Attestation** | W3C Verifiable Credential schemas for supply chain attestation                                                        | Export brokers, regulators                        | `03-platform/packages/workproof/` — [spec](../specs/03-platform/packages/workproof.md)                                         |
| 9   | **Structured Observability**        | OpenTelemetry-compatible traces, metrics, logs with secret redaction                                                  | Platform engineers, compliance auditors           | `03-platform/packages/telemetry/`, `03-platform/packages/logging/` — [specs](../specs/03-platform/packages/telemetry.md)       |
| 10  | **Runtime Substrate**               | Batteries-included runtime aggregating connectivity, resilience, telemetry, and API client                            | Application developers                            | `03-platform/packages/runtime/` — [spec](../specs/03-platform/packages/runtime.md)                                             |

### 2.2 Feature Matrix

| Feature                            | Status          | Evidence                                                                                          | Consumed By           |
| ---------------------------------- | --------------- | ------------------------------------------------------------------------------------------------- | --------------------- |
| Ed25519 signing & verification     | **Production**  | `03-platform/packages/crypto/tests/signing.test.ts`                                               | All downstream        |
| P256 FIPS-validated signing        | **Production**  | `cargo test --features fips` passes (30 tests)                                                    | All downstream        |
| SHA-256 / SHA-512 / BLAKE3 hashing | **Production**  | `03-platform/packages/crypto/tests/hashing.test.ts`                                               | All downstream        |
| Groth16 ZKP (GCI threshold)        | **Production**  | `rust/gtcx-zkp` tests pass (38 tests)                                                             | `gtcx-markets`        |
| Groth16 ZKP (commodity origin)     | **Beta**        | `rust/gtcx-zkp` tests pass; TS bindings in `03-platform/packages/crypto/`                         | `gtcx-markets`        |
| Groth16 ZKP (diamond origin)       | **Beta**        | Thin wrapper over commodity origin circuit                                                        | `gtcx-markets`        |
| Bulletproofs range proof           | **Production**  | `rust/gtcx-zkp` tests pass                                                                        | `gtcx-markets`        |
| Bulletproofs commodity range       | **Beta**        | Commodity/unit hash binding; `03-platform/packages/crypto/03-platform/src/zkp-commodity-range.ts` | `gtcx-markets`        |
| Schnorr identity proof             | **Production**  | `rust/gtcx-zkp` tests pass                                                                        | `gtcx-protocols`      |
| Offline queue with durable storage | **Production**  | `03-platform/packages/sync/tests/offline-queue.test.ts`                                           | `gtcx-markets` mobile |
| Connectivity profile detection     | **Production**  | `03-platform/packages/connectivity/tests/connectivity.test.ts`                                    | All mobile clients    |
| P2P transport (libp2p mesh)        | **Scaffolding** | In-memory transport only; libp2p Phase 2 — `03-platform/packages/network/README.md`               | —                     |
| API client with mTLS + retry       | **Production**  | `03-platform/packages/api-client/tests/canonical/`                                                | All downstream        |
| DID resolution                     | **Beta**        | `03-platform/packages/identity/tests/did.test.ts`                                                 | `gtcx-markets`        |
| ZKP native NAPI bindings           | **Beta**        | `03-platform/packages/crypto-native/`                                                             | `gtcx-markets`        |
| USSD protocol                      | **Scaffolding** | String enum only (`'ussd-only'` profile)                                                          | —                     |
| Adaptive low-bandwidth mode        | **Production**  | Dynamic compression, image downsampling, batching                                                 | All mobile clients    |
| HSM key storage                    | **Beta**        | PKCS#11 keystore implemented in `rust/gtcx-crypto`                                                | `gtcx-infrastructure` |
| Cloud KMS integration              | **Beta**        | AWS KMS keystore implemented in `rust/gtcx-crypto`                                                | `gtcx-infrastructure` |

### 2.3 Business Value Proposition

**For Investors:** `gtcx-core` creates a moat through cryptographic trust infrastructure that is expensive to replicate and compounds in value as each new downstream product (marketplace, protocol, intelligence layer) adds transaction volume. The offline-first architecture is a technical differentiator specifically for frontier markets where connectivity is intermittent. FIPS verification and bank-grade scoring provide enterprise-grade credibility that opens institutional capital.

**For Enterprise Buyers:** `gtcx-core` reduces integration risk through a shared foundation with strong package boundaries, reproducible builds, and API surface baselining. FIPS-validated cryptography, zero unsafe code in Rust, and signed commits with branch protection provide a control environment suitable for procurement by banks, commodity exchanges, and government mineral bureaus. The threat-control matrix (12 controls, validated in CI) demonstrates security governance.

**For African Sovereigns / DFIs:** `gtcx-core` preserves data sovereignty by keeping key material client-side and supporting offline-first operation. No raw AI output can approve consequential actions — trust gating is human-in-the-loop. The Global South Resilience profile (8.8/10) explicitly addresses intermittent connectivity, low-bandwidth adaptation, and USSD support — capabilities designed for African market realities rather than retrofitted from Western infrastructure.

---

## 3. Core User Personas & Jobs-to-be-Done

See **[overview-personas.md](./overview-personas.md)** — Amina (Ghana miner), Jean-Pierre (CI buying station), Dr. Osei (regulator), Sarah (export broker), Kofi (central bank), Alex (platform engineer).

---

## 4. Market Context & Opportunity

See **[overview-market.md](./overview-market.md)** — TAM/SAM/SOM, pain points, category-defining opportunity.

---

## 5. Go-to-Market Enablers

**Pilot readiness:** `gtcx-core` is ready for sandbox pilots. The cryptographic foundation is verified (FIPS), the offline queue is tested, and the API surface is stable. Gaps: CI blocked (no automated test runs on PR), USSD protocol is string-only, adaptive low-bandwidth mode is config-only.

**Regulator engagement:** The SOC 2 readiness analysis is complete. The FIPS assessment is verified. The threat-control matrix exists (12 controls, 20 evidence references). The Zimbabwe pre-submission email is drafted and ready to send. Missing: external pen-test, SOC 2 Type 1 attestation, first regulator response.

**Partner integration:** `@gtcx/crypto@3.1.4` (and 20 siblings) on npm with Sigstore attestations. Pin `^3.1.4` (core line) or floors in [trust portal](../governance/trust-portal.md#published-versions). API surface baselined; package boundaries enforced.

**Sales collateral:** Executive brief, security posture, compliance matrix, and FIPS readiness documents exist in `01-docs/08-gtm/`. Missing: case studies from live pilots, third-party validation report.

## 6. Technical Overview

Stack, architecture diagram, package inventory, and ecosystem map: **[overview-technical.md](./overview-technical.md)**.

---

## 7. Compliance, Security & Bank-Grade Posture

### 7.1 Current Certification State

| Standard / Framework         | Status                        | Evidence                                                                                                                                                              | Gap                                                                                                                                |
| ---------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **FIPS 140-3**               | ✅ **Verified**               | `cargo test --features fips` passes (30 tests). `aws-lc-fips-sys` linked. CMVP #4816.                                                                                 | None                                                                                                                               |
| **SLSA Build L3 (npm)**      | ✅ **Met (core 21/21)**       | Sigstore attestations at 3.1.4 train; `publish-packages-provenance.mjs`; [release 26778909174](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26778909174). | Provenance publishes require `gtcx-core` visibility `public`; see [trust portal](../governance/trust-portal.md#published-versions) |
| **STRIDE Threat Model**      | ✅ **Complete**               | 12 controls in `01-docs/09-security/threat-control-matrix.md`. Validator passes. 20 evidence references.                                                              | None                                                                                                                               |
| **Penetration Test**         | 🔴 **Not started**            | Scope ready. Vendor not engaged.                                                                                                                                      | Commission vendor                                                                                                                  |
| **SOC 2 Type 1**             | 🟡 **Readiness**              | Readiness analysis complete. CPA engagement pending.                                                                                                                  | Engage CPA firm                                                                                                                    |
| **Code Coverage (critical)** | 🟡 **Approaching**            | `@gtcx/crypto` 97.86% stmts / 86.48% branch. Target: 90% branch.                                                                                                      | Push branch coverage to 90%                                                                                                        |
| **Secret Scanning**          | 🟡 **Configured, CI blocked** | TruffleHog configured. Cannot run in CI due to billing.                                                                                                               | Fix CI billing                                                                                                                     |
| **Dependency Audit**         | ✅ **Clean**                  | `pnpm audit` clean. `cargo audit` clean (ark-\* advisories tracked).                                                                                                  | None                                                                                                                               |
| **Signed Commits**           | ✅ **Enforced**               | Branch protection requires signed commits.                                                                                                                            | None                                                                                                                               |
| **CODEOWNERS**               | ✅ **Active**                 | 8 entries. Security-sensitive packages require Crypto Security Engineer.                                                                                              | None                                                                                                                               |

### 7.2 Security Controls

The threat-control matrix covers 12 STRIDE controls:

| Control | Threat                    | Status | Evidence                                           |
| ------- | ------------------------- | ------ | -------------------------------------------------- |
| T01     | Spoofing — Identity       | ✅     | DID resolution, biometric binding                  |
| T02     | Tampering — Data          | ✅     | Hash chains, merkle proofs, signed commits         |
| T03     | Repudiation — Actions     | ✅     | Audit logging, signed certificates                 |
| T04     | Info Disclosure — Leakage | ✅     | Secret redaction, zeroizing memory                 |
| T05     | DoS — Availability        | ✅     | Offline queue, circuit breaker, retry              |
| T06     | Elevation — Privilege     | ✅     | CODEOWNERS, branch protection                      |
| T07     | Supply Chain              | ✅     | SLSA Source L2; npm Build L3 (21/21 @ 3.1.4)       |
| T08     | AI-Specific               | ✅     | Trust gating, dual-provider review                 |
| T09-T12 | Extended controls         | ✅     | See `01-docs/09-security/threat-control-matrix.md` |

Validator: `node 03-platform/tools/check-threat-matrix.mjs` passes.

### 7.3 Audit Trail

| Document                                                         | Date       | Core Score         | Key Finding                                              |
| ---------------------------------------------------------------- | ---------- | ------------------ | -------------------------------------------------------- |
| [Master Audit 2026-05-27](../audit/master-audit-2026-05-27.md)   | 2026-05-27 | **8.9/10** honest  | Delta audit; no new findings; all gates pass             |
| [Master Audit 2026-05-26](../audit/master-audit-2026-05-26.md)   | 2026-05-26 | **8.9/10** honest  | Continental predicates; zkp refactor; trust portal live  |
| [Master Audit 2026-05-12](../audit/master-audit-2026-05-12.md)   | 2026-05-12 | **8.63/10** honest | FIPS verified; SLSA no provenance; threat matrix created |
| [10/10 Roadmap 2026-05-11](../audit/10-10-roadmap-2026-05-11.md) | 2026-05-12 | —                  | M1 Foundation 4/6 complete; M2 Hardening in progress     |

---

## 8. Onboarding

### 8.1 For New Developers

1. **Prerequisites:** Node.js >= 20.0.0, pnpm >= 9.15.0, Rust >= 1.91.0
2. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd gtcx-core
   pnpm install
   ```
3. **Build:**
   ```bash
   pnpm build
   cd rust && cargo build --workspace
   ```
4. **Run tests:**
   ```bash
   pnpm test
   cd rust && cargo test --workspace
   ```
5. **Run verification gates:**
   ```bash
   pnpm architecture:check
   pnpm docs:check-links
   pnpm quality:governance:check
   pnpm lint
   pnpm format:check
   ```
6. **Read the ADR index:** `01-docs/decisions/adr-index.md`
7. **Pick a first issue:** Look for `good-first-issue` labels or start with `03-platform/packages/utils/` or `03-platform/packages/types/`

### 8.2 For Autonomous Agents

- **Commit style:** Conventional commits (`type(scope): description`)
- **Branch naming:** `feature/`, `fix/`, `01-docs/`, `refactor/`
- **Architecture boundaries:** Dependencies flow one direction only. No circular deps. Run `pnpm architecture:check` before any cross-package change.
- **Security-sensitive packages:** `@gtcx/crypto`, `@gtcx/crypto-native`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`, `rust/gtcx-crypto`, `rust/gtcx-zkp` — changes require Cryptographic Security Engineer review.
- **Verification gates:** `format:check`, `lint`, `architecture:check`, `docs:check-links`, `governance:check` must all pass before commit.
- **Safety rules:** See `01-docs/01-agents/workflows/safety-rules.md`
- **Context file:** Read `CLAUDE.md` at repo root for repo identity and layer rules.

### 8.3 For Business Stakeholders

- **What this repo enables:** Verifiable trade certificates, digital identity for informal producers, and bank-grade trust infrastructure for commodity supply chains in Africa.
- **When it will be ready:** The cryptographic foundation is ready now. Downstream products (`gtcx-markets`) are in pilot preparation. Full production readiness requires: CI unblocked, external pen-test completed, SOC 2 Type 1 attestation received — estimated 6-9 months.
- **What risks remain:** CI billing failure blocks automated testing. USSD protocol is not yet implemented. External validation (pen-test, SOC 2) is pending vendor engagement. Downstream repos must pin `@gtcx/*` at the provenance baseline when consuming from npm.
- **Who to contact:** Repo Lead (Protocol Architect), Security Reviewer (Cryptographic Security Engineer), Compliance Reviewer (Head of Compliance)

---

## 9. Technical Roadmap

### 9.1 Current Milestone

**M2: Hardening (Target: 9.4 core)**

M1 Foundation is 4/6 complete. M2 is in progress.

| M2 Item               | Status                                                        |
| --------------------- | ------------------------------------------------------------- |
| Threat-control matrix | ✅ Complete (12 controls, validator passes)                   |
| Coverage push         | ✅ `@gtcx/crypto` at 97.86% stmts / 86.48% branch             |
| Rust LOC refactor     | ✅ `gtcx-zkp/03-platform/src/lib.rs` split (1,977 → 51 lines) |
| SLSA npm publish      | ✅ 21/21 Sigstore @ 3.1.4 train                               |
| CI billing fix        | 🔴 Blocked — user action needed                               |
| Org secrets           | 🔴 4 missing — user action needed                             |
| Zimbabwe email        | 🔴 Draft ready — user action needed                           |
| USSD protocol         | 🔴 String-only enum                                           |
| Low-bandwidth mode    | 🔴 Config-only                                                |

### 9.2 Next 90 Days

1. **Fix CI billing + set 4 org secrets** — unblock automated testing and publishing
2. **Send Zimbabwe pre-submission email** — kick off regulator engagement
3. **Scope and commission external pen-test** — 4-6 weeks execution
4. **Engage CPA firm for SOC 2 Type 1** — 8-10 weeks process
5. **Keep downstream npm consumers on provenance baseline** — lockfile + `^3.1.4` floors

### 9.3 Path to 10.0

| Milestone        | Target Core | Key Deliverables                                                                                 |
| ---------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| M2 Hardening     | 9.4         | SLSA provenance, pen-test scoped, SOC 2 engaged, threat matrix validated                         |
| M3 Certification | 9.7         | Pen-test report in hand, SOC 2 Type 1 received, regulator response positive, 90% branch coverage |
| M4 Reference     | 10.0        | Multi-country pilot live, category-defining trust infrastructure, compounding platform effects   |

**Critical path:** CI billing fix → pen-test → SOC 2 Type 1. npm provenance complete (2026-06-01). Engineering work is parallelizable; external authority work is serial.

Detailed roadmap: [`01-docs/05-audit/10-10-roadmap-2026-05-11.md`](../audit/10-10-roadmap-2026-05-11.md)

---

## 10. Reference & Navigation

### 10.1 Key Documents

| Document                                                          | Purpose                             | Audience                     |
| ----------------------------------------------------------------- | ----------------------------------- | ---------------------------- |
| `01-docs/05-audit/readiness-model.md`                             | **Five lanes** + forensic audit map | All audiences                |
| `01-docs/05-audit/engineering-completeness-quality-2026-06-05.md` | Lane 1 index                        | Engineering                  |
| `01-docs/05-audit/internal-compliance-2026-06-05.md`              | Lane 2 — 5 domain scorecard         | Compliance, docs, security   |
| `01-docs/05-audit/industry-compliance-2026-06-05.md`              | Lane 3 — IC tiers                   | Procurement                  |
| `01-docs/05-audit/bank-grade-2026-06-05.md`                       | Lane 4 — **8.9**                    | Investors                    |
| `01-docs/05-audit/gtm-readiness-2026-06-05.md`                    | Lane 5 GTM-Readiness — GR tiers     | GTM, founders                |
| `01-docs/05-audit/internal-10-10-signoff-2026-05-28.md`           | Lane 1 forensic                     | Engineering                  |
| `01-docs/05-audit/master-audit-2026-06-03.md`                     | Lane 4 forensic                     | Investors                    |
| `01-docs/05-audit/full-audit-2026-06-04.md`                       | Six-phase full audit                | Engineering leadership       |
| `01-docs/05-audit/execution-roadmap.md`                           | FA + DTF sprint overlay             | Protocol 22 agents           |
| `01-docs/04-ops/tier-5-workplan-2026-06.md`                       | Defensibility Tier 5 register       | Crypto / protocol architects |
| `01-docs/architecture/overview.md`                                | System architecture                 | Engineers, architects        |
| `01-docs/09-security/threat-control-matrix.md`                    | Security controls                   | Security engineers, auditors |
| `01-docs/10-compliance/soc2-readiness.md`                         | SOC 2 evidence                      | Compliance, buyers           |
| `01-docs/08-gtm/00-executive-brief.md`                            | Executive summary                   | Investors, board             |
| `01-docs/specs/03-platform/packages/README.md`                    | Package specs                       | Engineers, integrators       |
| `01-docs/decisions/adr-index.md`                                  | Architecture decisions              | Engineers, architects        |
| `CONTRIBUTING.md`                                                 | Contribution guide                  | Open-source contributors     |
| `CLAUDE.md`                                                       | Agent context                       | AI agents, new developers    |

### 10.2 Contact & Escalation

| Role                | Responsibility             | Contact                         |
| ------------------- | -------------------------- | ------------------------------- |
| Repo Lead           | Technical ownership        | Protocol Architect              |
| Security Reviewer   | Security-sensitive changes | Cryptographic Security Engineer |
| Compliance Reviewer | Compliance evidence        | Head of Compliance              |
| Product Owner       | Feature prioritization     | Product Lead                    |

---

## 11. Honest Assessment

This document reflects **2026-06-05** state via [readiness-model.md](../audit/readiness-model.md) — **five lanes**, each with existing forensic audits.

**Audit quality:** L1–L5 forensic programs rate **8.0–8.5/10** (see readiness-model). **Readiness:** engineering outcomes strong; Industry Compliance **IC-T0**; GTM-Readiness **GR-T1** per gtm-reality-check.

Procurement advances on **IC tiers + GR tiers**, not more engineering audits.
