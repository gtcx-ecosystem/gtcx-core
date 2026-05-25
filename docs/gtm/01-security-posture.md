---
title: '01 Security Posture'
status: 'current'
date: '2026-05-25'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'
---

# Security Posture — gtcx-core

> **Status:** Current
> **Date:** 2026-05-25
> **Owner:** Protocol Architect

**Summary:** No critical vulnerabilities. Three medium-risk items under active management. Defense-in-depth across 6 automated analysis methods.

---

## Assessment Methods

| Method                   | Tool                                              | Frequency        | Status               |
| ------------------------ | ------------------------------------------------- | ---------------- | -------------------- |
| Static analysis (SAST)   | CodeQL (security-extended + security-and-quality) | Every PR         | Running              |
| Dependency vulnerability | pnpm audit, cargo audit, cargo deny, Trivy        | Every PR         | 3 mitigated          |
| Secret scanning          | Custom scanner (tools/check-secrets.mjs)          | Every PR         | 0 findings           |
| Fuzz testing             | cargo-fuzz (6 targets)                            | Weekly (planned) | 9.9M runs, 0 crashes |
| Threat modeling          | STRIDE + attack trees                             | Quarterly        | Current              |
| Architecture enforcement | Package boundary check, API surface drift         | Every PR         | 0 violations         |

## Key Security Properties

| Property                 | How It's Enforced                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------- |
| No custom crypto         | All ops delegate to audited libraries (@noble/\*, ed25519-dalek, k256)             |
| No unsafe Rust           | `#![deny(unsafe_code)]` on all 6 crates, verified in CI                            |
| No secret leakage        | `redactSecrets()` default sanitizer; all 28 traced ops use logInput:false for keys |
| Constant-time comparison | `timingSafeEqual` (Node.js), `ct_eq` (Rust) — no timing oracles                    |
| Key zeroization          | `secureWipe()` (TypeScript), `Zeroize` + `ZeroizeOnDrop` (Rust)                    |
| CSPRNG only              | `Math.random()` banned via ESLint; all randomness from OS CSPRNG                   |
| Supply chain integrity   | Exact-version pinning, provenance manifest, SBOM generation                        |

## Threat Model Summary

18 threats identified across STRIDE categories. Full analysis: [../security/threat-model.md](../security/threat-model.md)

**Top risks and mitigations:**

| Risk                                | Level      | Mitigation                                              |
| ----------------------------------- | ---------- | ------------------------------------------------------- |
| Supply chain compromise             | Critical   | Trivy + cargo-audit + exact-pin + SBOM + provenance     |
| ZKP JS fallback accepted as real ZK | Critical   | `GTCX_REQUIRE_NATIVE=true` enforcement                  |
| Key leakage via logs                | High → Low | Default `redactSecrets()` sanitizer (closed 2026-05-08) |
| DID document poisoning              | Medium     | Zod schema validation on DID resolution                 |
| Offline queue replay                | Medium     | Logical sequence ordering + duplicate detection         |

## Attack Tree

Signature forgery tree with 4 primary branches, 20 leaf nodes. Every leaf has a mitigation or accepted risk with rationale.

Full analysis: [../security/attack-tree-signing.md](../security/attack-tree-signing.md)

## Fuzz Targets

| Target                      | Module                   | Property                             |
| --------------------------- | ------------------------ | ------------------------------------ |
| fuzz_signature_verification | Ed25519 verify           | No panic on malformed input          |
| fuzz_key_generation         | Ed25519 + secp256k1 keys | No panic; valid keys roundtrip       |
| fuzz_secp256k1_verification | secp256k1 verify         | No panic; valid sigs always verify   |
| fuzz_hashing                | SHA-256/512/BLAKE3       | Output length invariant; determinism |
| fuzz_chain_integrity        | Hash-chain audit trail   | Corruption always detected           |
| fuzz_key_derivation         | Public key derivation    | Determinism; no panic                |

## Open Items

| ID     | Item                                                        | Priority  | Owner                    |
| ------ | ----------------------------------------------------------- | --------- | ------------------------ |
| SA-001 | ~~Add secondary CODEOWNER~~ — done (gtcx-agent, 2026-05-09) | Closed    | Team                     |
| SA-003 | ~~Claim `@gtcx` npm scope~~ — done (org: gtcx-protocol)     | Closed    | Team                     |
| SA-007 | rustls-webpki RUSTSEC-2026-0098/0099/0104 — mitigated in CI | Open (P2) | Team                     |
| SA-008 | External pen-test — RFP drafted, vendor selection pending   | Open (P1) | crypto-security-engineer |

## Source Documents

- [Internal Security Assessment](../security/internal-security-assessment.md)
- [Threat Model](../security/threat-model.md)
- [Attack Tree — Signing](../security/attack-tree-signing.md)
- [Threat Control Matrix](../security/threat-control-matrix.md)
- [Key Ceremony](../security/key-ceremony.md)
- [Security Framework](../security/security-framework.md)
- [NIST 800-53 Mapping](../security/nist-800-53-mapping.md)
