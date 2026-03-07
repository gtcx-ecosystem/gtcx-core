# Cryptographic Verification Architecture

| Attribute | Value                                                                |
| --------- | -------------------------------------------------------------------- |
| Scope     | Architectural decision — cryptographic infrastructure vs. blockchain |
| Status    | Active                                                               |

## Decision Summary

GTCX uses cryptographic verification infrastructure rather than a blockchain ledger for trust and provenance. The core security properties — immutability, tamper evidence, non-repudiation, and auditability — are delivered by cryptographic primitives, not the ledger itself.

## Security Equivalence

| Security Property | Blockchain Mechanism       | GTCX Mechanism                               |
| ----------------- | -------------------------- | -------------------------------------------- |
| Immutability      | Chained block hashes       | Hash-chained audit logs and event chains     |
| Tamper evidence   | Transaction signatures     | Ed25519 signatures on events and credentials |
| Auditability      | Public ledger inspection   | Signed event logs + Merkle proofs            |
| Non-repudiation   | On-chain signature history | Per-event signatures bound to TradePass DIDs |
| Privacy           | Limited (public ledger)    | ZK proofs for selective disclosure           |

## Core Primitives

| Primitive      | Algorithm                      | Usage                                                     |
| -------------- | ------------------------------ | --------------------------------------------------------- |
| Signing        | Ed25519                        | Event signing, credential proofs, identity assertions     |
| Hashing        | SHA-256, Blake3                | Content addressing, hash chains, Merkle trees             |
| ZK proofs      | Groth16, Bulletproofs, Schnorr | Range proofs, ownership proofs, identity attribute proofs |
| Key derivation | HKDF-SHA-256 (planned)         | Per-context key derivation                                |

## Zero-Knowledge Proofs

- **Groth16**: GCI threshold, asset ownership, location region proofs (Rust, active).
- **Bulletproofs**: Amount range proofs (Rust, active).
- **Schnorr**: Identity attribute possession proofs (Rust, active).

All proofs are generated in `rust/gtcx-zkp` and verified by callers via exported APIs.

## Native Binding Path

- Native bindings are loaded via `@gtcx/crypto-native` when available.
- JS fallback remains available for portability.
- Performance budgets and evidence are tracked in `benchmarks/` and `quality/`.

## Chain Optionality

The architecture remains chain-agnostic. If anchoring to a public ledger becomes required, Merkle roots can be published without schema changes. No user-facing behavior needs to change.

## References

- `SOP/2-docs/3-engineering/security/security-framework.md`
- `crypto-research.md`
- `SOP/2-docs/2-specs/eventcore.md`
- `zkp-circuit-plan.md`
