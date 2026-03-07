# Compliance Requirements — gtcx-core

**Document ID**: GTCX-CORE-COMPLIANCE-001
**Version**: 1.0
**Date**: March 2026
**Status**: Active

---

## Scope

`gtcx-core` is a cryptographic primitives library. Compliance obligations fall into three categories:

1. **Library compliance** — the packages themselves must meet security and supply-chain standards
2. **Consumption compliance** — downstream services using `gtcx-core` can satisfy their own regulatory obligations via the standards implemented here
3. **Government-grade deployment** — packages may be used in government-regulated or FIPS-required environments

---

## Platform Compliance

### ISO 27001

| Control Area           | Implementation                                                           |
| ---------------------- | ------------------------------------------------------------------------ |
| Access control         | Repository access via GitHub CODEOWNERS and required reviews             |
| Cryptographic controls | Ed25519, SHA-256, Blake3 — all with RFC test vectors                     |
| Secure development     | `#![deny(unsafe_code)]`, Zeroizing key material, no `unwrap()` in libs   |
| Asset inventory        | Package manifest in `pnpm-workspace.yaml`, crate list in `rust/`         |
| Incident response      | `_sop/2-docs/4-devops/` runbooks; escalation per safety-rules.md         |
| Change management      | All changes via PR with required reviews; ADRs for architectural changes |

### SOC 2 Type II

| Trust Service Criteria     | gtcx-core Controls                                                    |
| -------------------------- | --------------------------------------------------------------------- |
| Security (CC6)             | Ed25519 signing, Blake3/SHA-256, `Zeroizing<T>` on all key material   |
| Processing Integrity (CC8) | Deterministic crypto operations; RFC test vectors enforce correctness |
| Availability (CC7)         | No runtime service — library availability = npm registry availability |
| Confidentiality (CC9)      | No PII collected; keys zeroized on drop                               |

### Supply Chain (SBOM + Provenance)

Per release (or on any release containing crypto changes):

- Software Bill of Materials (SBOM) generated for all npm packages
- Provenance attestation attached to npm publish (via GitHub Actions OIDC)
- Cargo audit run on every PR (`cargo audit`)
- npm audit run on every PR (`pnpm audit`)

### Export Control

The crypto primitives in `gtcx-core` (Ed25519, secp256k1, ZKP circuits) are subject to export control review for certain distribution contexts. Before publishing to a new registry, region, or government partner, trigger an export control policy review.

---

## Government-Grade Deployment (Recommended)

For deployments in regulated or public-sector environments:

| Requirement                 | Standard       | Status                                           |
| --------------------------- | -------------- | ------------------------------------------------ |
| FIPS 140-3 validated crypto | FIPS 140-3     | Planned — Phase 7                                |
| HSM-backed key management   | NIST SP 800-57 | Planned — Phase 7                                |
| Tamper-evident audit logs   | ISO 27001      | Implemented (hash-chain audit in `@gtcx/crypto`) |
| Secure boot support         | Platform-level | Evaluating (hardware repo)                       |

---

## Credential Standards

`gtcx-core` implements or will implement the following credential standards (Phase 7):

| Standard                         | Package / Crate               | Status      |
| -------------------------------- | ----------------------------- | ----------- |
| W3C Verifiable Credentials DM    | `@gtcx/credentials`           | Planned     |
| W3C DID (Decentralized IDs)      | `@gtcx/identity`              | Implemented |
| Ed25519 signing (JWT / LD-Proof) | `@gtcx/crypto`, `gtcx-crypto` | Implemented |
| BBS+ credentials                 | `@gtcx/credentials`           | Phase 7     |
| JSON-LD context                  | `@gtcx/credentials`           | Phase 7     |

---

## Data Retention

`gtcx-core` is a library — it does not store user data. Consuming services are responsible for their own data retention policies. The library exposes:

- Hash-chained audit log primitives (`@gtcx/crypto`) — consumers set their own retention
- No PII fields in any exported type
- Key material zeroized on drop — no persistence

---

## Security Review Requirements

| Change Type                       | Required Review                              |
| --------------------------------- | -------------------------------------------- |
| Any crypto primitive change       | Cryptographic Security Engineer (required)   |
| New dependency in crypto packages | Cryptographic Security Engineer (required)   |
| API surface change                | Protocol Architect + Quality & Evidence Lead |
| Release with crypto changes       | SBOM + provenance artifacts required         |

---

**Document Status**: Active
**Review Cycle**: Quarterly
**Owner**: Protocol Architect + Cryptographic Security Engineer
