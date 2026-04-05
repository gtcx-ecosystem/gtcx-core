# NIST 800-53 Rev 5 Control Mapping — gtcx-core

**Version:** 1.0.0
**Date:** 2026-04-05
**Scope:** Library-level controls implemented in gtcx-core
**Framework:** NIST SP 800-53 Rev 5

---

## Scope

gtcx-core is a foundation library, not a deployed service. This mapping documents controls implemented at the library level that downstream platforms inherit. Platform-level controls (network segmentation, access provisioning, physical security) are the responsibility of the deploying system.

---

## Control Mapping

### AC — Access Control

| Control | Title                      | Implementation                                          | Evidence                                                                 |
| ------- | -------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| AC-3    | Access Enforcement         | Zone-based permission system with role checks           | `packages/security/src/auth/permissions.ts`                              |
| AC-6    | Least Privilege            | Services use dependency injection; no ambient authority | `packages/services/src/*.ts` — all services accept injected dependencies |
| AC-10   | Concurrent Session Control | Token TTL enforcement with configurable expiry          | `packages/security/src/auth/tokens.ts`                                   |
| AC-12   | Session Termination        | Token expiration checks on every verification call      | `packages/security/src/auth/tokens.ts:verifyTokenSignature()`            |

### AU — Audit and Accountability

| Control | Title                           | Implementation                                                                  | Evidence                                                                           |
| ------- | ------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| AU-2    | Event Logging                   | Type-safe event bus emits all domain events (registration, trading, compliance) | `packages/events/src/event-bus.ts`, `packages/events/src/types.ts`                 |
| AU-3    | Content of Audit Records        | Structured JSON logs with correlation IDs, timestamps, source, version          | `packages/logging/src/index.ts`                                                    |
| AU-6    | Audit Record Review             | KPI collection and export; CI-generated quality metrics                         | `tools/collect-kpi-history.mjs`, `tools/export-quality-kpis.mjs`                   |
| AU-8    | Time Stamps                     | All events include `timestamp: Date.now()` (millisecond precision)              | `packages/events/src/types.ts:DomainEvent`                                         |
| AU-9    | Protection of Audit Information | Hash-chained proof bundles; tamper-evident via SHA-256 chains                   | `packages/verification/src/proofs/bundler.ts`, `rust/gtcx-crypto/src/chain.rs`     |
| AU-10   | Non-repudiation                 | Ed25519/Secp256k1 digital signatures on all attestations                        | `packages/crypto/src/signing.ts`, `packages/workproof/src/workproof/operations.ts` |
| AU-11   | Audit Record Retention          | Offline event buffer with configurable max size and overflow tracking           | `packages/events/src/offline-buffer.ts`                                            |

### IA — Identification and Authentication

| Control | Title                                                        | Implementation                                                                  | Evidence                                                           |
| ------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| IA-2    | Identification and Authentication                            | DID-based identity (`did:gtcx:*`) with cryptographic key binding                | `packages/identity/src/did.ts`                                     |
| IA-5    | Authenticator Management                                     | Key generation via OS CSPRNG; key derivation with validated salt (min 16 bytes) | `packages/crypto/src/keys.ts`, `packages/identity/src/identity.ts` |
| IA-5(2) | PKI-Based Authentication                                     | Ed25519/Secp256k1 key pairs with public key fingerprinting                      | `packages/identity/src/identity.ts:createIdentity()`               |
| IA-7    | Cryptographic Module Authentication                          | JWT tokens with Ed25519 signature verification, issuer/audience validation      | `packages/security/src/auth/tokens.ts`                             |
| IA-8    | Identification and Authentication (Non-Organizational Users) | DID resolver infrastructure with pluggable adapters                             | `packages/identity/src/resolver.ts`                                |

### SC — System and Communications Protection

| Control | Title                                          | Implementation                                                             | Evidence                                                      |
| ------- | ---------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| SC-8    | Transmission Confidentiality and Integrity     | HMAC request signing for API calls; mTLS support in API client             | `packages/api-client/src/index.ts`                            |
| SC-12   | Cryptographic Key Establishment and Management | HD key derivation (BIP-32 style); purpose-based key separation             | `rust/gtcx-crypto/src/keys/mod.rs`                            |
| SC-13   | Cryptographic Protection                       | SHA-256 (FIPS 180-4), Secp256k1 ECDSA (FIPS 186-4), Ed25519 (RFC 8032)     | See `_sop/2-docs/3-engineering/7-security/fips-assessment.md` |
| SC-17   | Public Key Infrastructure Certificates         | W3C Verifiable Credential certificate generation with cryptographic proofs | `packages/verification/src/certificates/generator.ts`         |
| SC-28   | Protection of Information at Rest              | Encrypted offline storage interface with lockout protection (fail-closed)  | `packages/security/src/offline/secure-storage.ts`             |

### SI — System and Information Integrity

| Control | Title                                         | Implementation                                                                     | Evidence                                                              |
| ------- | --------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| SI-2    | Flaw Remediation                              | Automated CVE scanning (Trivy) on every CI build; SBOM (CycloneDX) generated       | `.github/workflows/ci.yml` (security job)                             |
| SI-4    | System Monitoring                             | Performance budget enforcement with trend detection; API surface drift detection   | `tools/check-performance-budgets.mjs`, `tools/check-api-surface.mjs`  |
| SI-7    | Software, Firmware, and Information Integrity | Provenance manifest with SHA-256 hashes of all evidence artifacts                  | `tools/generate-provenance-manifest.mjs`                              |
| SI-10   | Information Input Validation                  | Zod schema validation at all trust boundaries; recursive prototype pollution check | `packages/domain/src/schemas.ts`, `packages/security/src/validation/` |

### CM — Configuration Management

| Control | Title                          | Implementation                                                              | Evidence                                                       |
| ------- | ------------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------- |
| CM-2    | Baseline Configuration         | API surface baseline tracking; performance budget baselines                 | `quality/api-surface-baseline.json`, `benchmarks/history.json` |
| CM-3    | Configuration Change Control   | Architecture boundary enforcement blocks unauthorized cross-package imports | `tools/check-package-boundaries.mjs`                           |
| CM-4    | Impact Analyses                | API surface diff on every PR; semver enforcement on release                 | `.github/workflows/release.yml` (api:check step)               |
| CM-5    | Access Restrictions for Change | CODEOWNERS requires approval for all security-sensitive packages            | `.github/CODEOWNERS`                                           |
| CM-7    | Least Functionality            | Packages have `sideEffects: false`; minimal dependency graph enforced       | All `package.json` files                                       |
| CM-8    | System Component Inventory     | SBOM (CycloneDX) generated on every CI build                                | `.github/workflows/ci.yml` (SBOM step)                         |

### SA — System and Services Acquisition

| Control | Title                                     | Implementation                                                                   | Evidence                                                           |
| ------- | ----------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| SA-10   | Developer Configuration Management        | Conventional commits enforced; Husky pre-commit hooks run lint-staged            | `.husky/pre-commit`, `package.json` (lint-staged config)           |
| SA-11   | Developer Testing and Evaluation          | 2,700+ tests; 11 quality gates; critical package coverage 83-98%                 | `pnpm test`, `pnpm test:coverage:critical`                         |
| SA-12   | Supply Chain Protection                   | Dependencies pinned; pnpm overrides for known CVE patches; Trivy scanner         | `package.json` (pnpm.overrides), `.github/workflows/ci.yml`        |
| SA-15   | Development Process, Standards, and Tools | 13 ADRs documenting all architectural decisions; 4 agent roles with safety rules | `_sop/2-docs/3-engineering/6-decisions/`, `_sop/1-agents/2-roles/` |

---

## Controls Not Applicable at Library Level

The following control families require platform-level or organizational implementation and are outside the scope of gtcx-core:

- **AT** (Awareness and Training) — Organizational policy
- **CA** (Assessment, Authorization, and Monitoring) — ATO process
- **CP** (Contingency Planning) — Infrastructure
- **IR** (Incident Response) — Organizational process (though SECURITY.md defines disclosure)
- **MA** (Maintenance) — Infrastructure
- **MP** (Media Protection) — Physical
- **PE** (Physical and Environmental Protection) — Facility
- **PL** (Planning) — Organizational
- **PM** (Program Management) — Organizational
- **PS** (Personnel Security) — HR
- **PT** (PII Processing and Transparency) — Library processes no PII
- **RA** (Risk Assessment) — Documented in threat-control-matrix.md
- **SC-1 through SC-7** — Network-level; platform responsibility

---

## References

- NIST SP 800-53 Rev 5 — Security and Privacy Controls
- `_sop/2-docs/3-engineering/7-security/threat-control-matrix.md` — 12 threat controls
- `_sop/2-docs/3-engineering/7-security/fips-assessment.md` — FIPS compliance pathway
- `_sop/2-docs/3-engineering/7-security/security-framework.md` — Security architecture
