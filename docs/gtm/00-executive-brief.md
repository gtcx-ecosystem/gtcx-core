---
title: '00 Executive Brief'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'
---

# Executive Brief — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

## What It Is

gtcx-core is the cryptographic and protocol foundation for the GTCX ecosystem — a global trade verification platform built for commodity supply chains in the Global South. It provides signing, identity, verification, and zero-knowledge proof primitives consumed by 6+ downstream products.

It is a **library**, not a service. No network listeners, no databases, no user data. Pure cryptographic infrastructure.

## Why It Matters

Every verification proof, every digital identity, every trade certificate in the GTCX ecosystem traces its trust back to gtcx-core. Breaking changes here break everything downstream. Security failures here compromise the entire verification protocol.

## By the Numbers

| Metric                        | Value                  |
| ----------------------------- | ---------------------- |
| TypeScript packages           | 21                     |
| Rust crates                   | 6                      |
| Lines of source code          | 31,713                 |
| Test cases                    | 2,260+                 |
| CI quality gates              | 21 (all passing)       |
| Architecture decisions (ADRs) | 14                     |
| Security documents            | 16                     |
| Compliance documents          | 7                      |
| Critical package coverage     | 89-96% statements      |
| Performance metrics tracked   | 14 (all within budget) |
| Known vulnerabilities         | 0                      |
| Commits since Jan 2026        | 298                    |

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
- **Rust (planned):** AWS-LC (CMVP #4816)

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

1. Fuzz campaigns not yet run at scale (targets written, awaiting 24-hour execution)
2. Rust FIPS backend (aws-lc-rs) — trait designed, not yet implemented
3. HSM key storage — trait designed, not yet implemented
4. External penetration test — replaced by internal assessment (acceptable for sandbox)
5. Downstream consumer validation — no formal report yet
6. `@gtcx` npm scope — not yet claimed

These are 4-5 days of engineering work plus one regulator meeting. The code is ready. The governance is ready. The remaining work is execution.
