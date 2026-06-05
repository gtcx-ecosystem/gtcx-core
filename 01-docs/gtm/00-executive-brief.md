---
title: 'Executive Brief — gtcx-core'
status: current
date: 2026-06-05
owner: gtcx-core
role: protocol-architect
document_id: GTM-EXEC-BRIEF-001
tier: standard
tags: ['documentation', 'gtm', 'executive-brief']
review_cycle: on-change
---

# Executive Brief — gtcx-core

> **Readiness (2026-06-05):** Lane 5 **GR-T1** (library integrator) · sovereign ecosystem **below GR-T2** · [gtm-readiness index](../audit/gtm-readiness-2026-06-05.md). Do not cite bank-grade **8.9** as engineering or GTM status — [readiness model](../audit/readiness-model.md).

> **Status:** Current · **Owner:** Protocol Architect

## What It Is

gtcx-core is the cryptographic and protocol foundation for the GTCX ecosystem — a global trade verification platform built for commodity supply chains in the Global South. It provides signing, identity, verification, and zero-knowledge proof primitives consumed by 6+ downstream products.

It is a **library**, not a service. No network listeners, no databases, no user data. Pure cryptographic infrastructure.

## Why It Matters

Every verification proof, every digital identity, every trade certificate in the GTCX ecosystem traces its trust back to gtcx-core. Breaking changes here break everything downstream. Security failures here compromise the entire verification protocol.

## By the Numbers

| Metric                        | Value                           |
| ----------------------------- | ------------------------------- |
| TypeScript packages           | 21                              |
| Rust crates                   | 6                               |
| Lines of source code          | 31,713                          |
| Test cases                    | 2,360+                          |
| CI quality gates              | 21 (all passing)                |
| Architecture decisions (ADRs) | 14                              |
| Security documents            | 16                              |
| Compliance documents          | 7                               |
| Critical package coverage     | 89-96% statements               |
| Performance metrics tracked   | 14 (all within budget)          |
| Known vulnerabilities         | 3 (mitigated, upstream pending) |
| Commits since Jan 2026        | 305                             |

## Cryptographic Foundation

| Algorithm   | Purpose                  | Library                                                       | Audit Status    |
| ----------- | ------------------------ | ------------------------------------------------------------- | --------------- |
| Ed25519     | Digital signatures       | @noble/curves (Cure53 audit), ed25519-dalek (multiple audits) | Audited         |
| Secp256k1   | Bitcoin/Ethereum interop | @noble/curves, k256 (NCC Group audit)                         | Audited         |
| SHA-256/512 | Hashing                  | @noble/hashes, sha2 crate                                     | NIST-approved   |
| BLAKE3      | Fast hashing             | @noble/hashes, blake3 crate                                   | Peer-reviewed   |
| Groth16     | Zero-knowledge proofs    | ark-groth16 (arkworks)                                        | Academic review |
| AES-256-GCM | Encryption at rest       | node:crypto, ring                                             | NIST-approved   |

All cryptographic operations delegate to audited, established libraries. No custom primitives. `#![deny(unsafe_code)]` enforced across all Rust crates.

## FIPS 140-3 Compliance

FIPS validation is inherited from platform cryptographic modules:

- **TypeScript:** OpenSSL 3.x FIPS Provider (CMVP #4282)
- **Rust:** AWS-LC (CMVP #4816) — `aws-lc-fips-sys` 0.13.14; 30 tests pass with `--features fips`

See [03-fips-readiness.md](./03-fips-readiness.md) for the full validation boundary statement.

## Security Posture

- Full STRIDE threat model with 18 threats and mapped mitigations
- Signing attack tree with 20 leaf nodes
- 12 threat controls validated in CI on every PR
- 6 cargo-fuzz targets for panic safety across all crypto operations
- CodeQL SAST, Trivy vulnerability scanning, cargo-audit on every PR
- Zero unsafe code in Rust (compiler-enforced)
- Default secret redaction in all traced operations

See [01-security-posture.md](./01-security-posture.md) for the complete assessment.

## What's Not Done (Honestly)

**In this repo (library):** Nothing blocking **GR-T1** developer adoption. npm Sigstore **21/21 @ 3.1.4** (2026-06-01). Legacy GTM label: **S1 MVP** — see [gtm-reality-check](./gtm-reality-check-2026-06-02.md) for S↔GR-T mapping.

**Ecosystem / sovereign pilot (owned cross-repo — see [16-ecosystem-gtm-alignment](./16-ecosystem-gtm-alignment.md)):**

1. **External penetration test on the live stack** — scope and RFP in [gtcx-infrastructure](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/regulatory/pentest-scope-rfp.md); **EXT-INF-002** SOW signature pending
2. **SOC 2 Type I** — readiness checklist in infrastructure; CPA engagement; **not** on African sandbox critical path ([Global South plan](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/plans/global-south-10x-plan.md))
3. **ZWCMP / Zimbabwe regulator motion** — canonical email: [`sandbox-intro-email-template.md`](./sandbox-intro-email-template.md); **EXT-INF-013–015**; human send not executed
4. **Live testnet + DR proof** — gtcx-infrastructure Global South Gap 1 (regulators grade running systems)

ADR-012 Stage 0 is complete in core; protocol ratification continues in `gtcx-protocols`.
