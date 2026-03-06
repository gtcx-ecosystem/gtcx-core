# GTCX Cryptographic Systems — Master Roadmap

**Status**: Active | **Last Updated**: 2026-02-03 | **Owner**: Crypto Engineering

## Executive Summary

Phased implementation plan for all cryptographic subsystems in the GTCX ecosystem. Six major workstreams: KORA verification pipeline, AMANI privacy engine, PANX consensus protocol, zero-knowledge proof infrastructure, peer-to-peer networking, and identity/key management.

Phase 0 (cryptographic foundation — `gtcx-crypto` crate) is complete and provides primitives on which all subsequent phases build.

## Phase Overview

| Phase | Epic                       | Status      | Depends On | Target  |
| ----- | -------------------------- | ----------- | ---------- | ------- |
| 0     | Cryptographic Foundation   | DONE        | —          | —       |
| 1     | KORA Verification Pipeline | NOT STARTED | Phase 0    | Q1 2026 |
| 2     | AMANI Privacy Engine       | NOT STARTED | Phase 0    | Q2 2026 |
| 3     | Network Layer              | NOT STARTED | Phase 0    | Q2 2026 |
| 4     | PANX Consensus             | NOT STARTED | Phase 0, 3 | Q3 2026 |
| 5     | ZK Proof System            | NOT STARTED | Phase 0    | Q3 2026 |
| 6     | Identity & Key Management  | NOT STARTED | Phase 0, 5 | Q4 2026 |

Phases 1, 2, 3, and 5 can begin in parallel once Phase 0 is stable. Phase 4 requires Phase 3. Phase 6 requires Phase 5.

## Phase 0: Cryptographic Foundation — DONE

**Location**: `rust/gtcx-crypto/`

| Module    | Description                                        |
| --------- | -------------------------------------------------- |
| `signing` | Ed25519 digital signatures with batch verification |
| `hashing` | SHA-256 and Blake3 hashing with streaming support  |
| `keys`    | HD key derivation (BIP-32 compatible)              |
| `audit`   | Hash-chained audit logs with tamper detection      |

Security properties: `#![deny(unsafe_code)]`, `Zeroizing<T>` for all key material, batch Ed25519 verification, comprehensive test suite with RFC test vectors.

## Epic Index

| Epic                       | File                     | Phase | Stories | Points  | Repo      |
| -------------------------- | ------------------------ | ----- | ------- | ------- | --------- |
| KORA Verification Pipeline | E01-kora-verification    | 1     | 20      | 55      | sensei-ai |
| AMANI Privacy Engine       | E02-amani-privacy-engine | 2     | 22      | 58      | sensei-ai |
| Network Layer              | E03-network-layer        | 3     | 18      | 38      | gtcx-core |
| PANX Consensus             | E04-panx-consensus       | 4     | 18      | 42      | gtcx-core |
| ZK Proof System            | E05-zkp-system           | 5     | 17      | 53      | gtcx-core |
| Identity & Key Management  | E06-identity-system      | 6     | 15      | 29      | gtcx-core |
| **Totals**                 |                          |       | **110** | **275** |           |

> **Repo Ownership**: E01 (KORA) and E02 (AMANI) target the `sensei-ai` repository. E03-E06 target `gtcx-core` Rust crates and TypeScript packages.

## Integration Sprints

| Sprint | Name                          | When            | Points | What Gets Wired                                                 |
| ------ | ----------------------------- | --------------- | ------ | --------------------------------------------------------------- |
| INT-1  | KORA + Crypto Wiring          | After Sprint 2  | 8      | Merkle proofs → certificates, Ed25519 → certificate signing     |
| INT-2  | Network + Consensus Handshake | After Sprint 14 | 10     | Validator IDs → node identity, PBFT → message envelope          |
| INT-3  | ZK + Identity Binding         | After Sprint 20 | 10     | BBS+ → TradePass credentials, GCI proofs → compliance           |
| INT-4  | Full System Integration       | After Gate 6    | 16     | All four end-to-end flows + adversarial cross-cutting scenarios |

**Total integration effort**: 44 story points across 5 sprints.

## Team Allocation

| Role                   | FTE  | Responsibility                                                 |
| ---------------------- | ---- | -------------------------------------------------------------- |
| Crypto Lead            | 1.0  | Architecture decisions, security review, all crypto PRs        |
| Rust Engineer (Senior) | 1.0  | Merkle trees, PBFT, ZK circuits, key management                |
| Rust Engineer (Mid)    | 1.0  | Networking, transport, CRDT, serialization                     |
| Python Engineer        | 0.5  | Federated learning agent, privacy budget, Rust/Python bindings |
| Security Reviewer      | 0.25 | Dedicated review of all cryptographic PRs                      |
| DevOps                 | 0.25 | CI pipeline for fuzz testing, benchmarks                       |

**Minimum viable**: 2.5 FTE | **Recommended**: 4.0 FTE (three parallel tracks, ~48 weeks)

## Risk Register

| ID  | Risk                               | Likelihood | Impact | Mitigation                                                      |
| --- | ---------------------------------- | ---------- | ------ | --------------------------------------------------------------- |
| R1  | Rust crypto expertise availability | High       | High   | Cross-train; specialized contractors for initial implementation |
| R2  | Paillier performance at scale      | Medium     | High   | Benchmark early in Phase 2; evaluate batching strategies        |
| R3  | arkworks API stability             | Medium     | Medium | Pin exact dependency versions; thin abstraction layer           |
| R4  | libp2p breaking changes            | Medium     | Medium | Pin to specific release for Phase 3                             |
| R5  | Regulatory requirements shifting   | Low        | High   | Quarterly regulatory tracking; configurable policy layers       |
| R6  | Patent filing timelines            | Medium     | High   | Coordinate with legal at Phase 2 and Phase 5 kickoffs           |

## Project Summary

| Metric            | Value                                  |
| ----------------- | -------------------------------------- |
| Epics             | 6 + 4 integration sprints              |
| User stories      | 110 epic + 17 integration = 127 total  |
| Story points      | 275 epic + 44 integration = 319 total  |
| Sprints           | ~19 epic + 5 integration = ~24 sprints |
| Calendar duration | ~48 weeks (4.0 FTE parallel)           |

## References

- `SOP/2-docs/2-specs/packages/rust/gtcx-crypto.md`
- `SOP/2-docs/2-specs/packages/rust/gtcx-zkp.md`
- `SOP/2-docs/1-architecture/decisions/001-rust-for-cryptography.md`
- `SOP/2-docs/1-architecture/decisions/010-pbft-weighted-consensus.md`
