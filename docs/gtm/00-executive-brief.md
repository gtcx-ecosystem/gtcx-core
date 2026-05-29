---
title: "Executive Brief — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "gtm"]
review_cycle: "on-change"
---

---
title: '00 Executive Brief'
status: 'current'
date: '2026-05-25'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'
---

# Executive Brief — gtcx-core

> **Status:** Current
> **Date:** 2026-05-25
> **Owner:** Protocol Architect

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

1. **External penetration test** — RFP drafted, 5-vendor longlist identified, awaiting selection (P1)
2. **SOC 2 Type 1** — Readiness prep complete (78-85% TSC), CPA engagement pending (P1)
3. **SLSA provenance publish** — NPM_TOKEN confirmed, workflow ready, awaiting Wed-Fri operational window (P2)
4. **Upstream rustls-webpki fix** — 3 RUSTSEC advisories mitigated via CI exceptions; AWS SDK upstream fix pending (P2)
5. **DR runbook drill** — Runbook complete, never drilled; first drill scheduled Q2 (P2)
6. **ADR-012 Stage 1** — Stage 0 complete (47 predicates, migration helper); cross-repo handoff delivered to gtcx-protocols (P2)

These represent 2-3 weeks of coordination plus engineering execution. The code is ready. The governance is ready. The remaining work is external validation and operational follow-through.
