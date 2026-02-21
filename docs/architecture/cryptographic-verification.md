# Cryptographic Verification Architecture

## Document Control

| Attribute   | Value                                                                |
| ----------- | -------------------------------------------------------------------- |
| **Scope**   | Architectural decision — cryptographic infrastructure vs. blockchain |
| **Status**  | Active                                                               |
| **Related** | `../specs/security-framework.md`, `crypto-research.md`               |

---

## 1. Decision Summary

GTCX uses cryptographic verification infrastructure rather than blockchain for trust and provenance. The core security properties (immutability, tamper evidence, non-repudiation, and auditability) are delivered by cryptographic primitives, not the ledger itself.

## 2. Security Equivalence (Primitive-Level)

| Security Property | Blockchain Mechanism       | GTCX Mechanism                               |
| ----------------- | -------------------------- | -------------------------------------------- |
| Immutability      | Chained block hashes       | Hash-chained audit logs and event chains     |
| Tamper evidence   | Transaction signatures     | Ed25519 signatures on events and credentials |
| Auditability      | Public ledger inspection   | Signed event logs + Merkle proofs            |
| Non-repudiation   | On-chain signature history | Per-event signatures bound to TradePass DIDs |
| Privacy           | Limited (public ledger)    | ZK proofs for selective disclosure           |

## 3. Core Primitives Used in gtcx-core

| Primitive      | Algorithm                      | Usage                                                     |
| -------------- | ------------------------------ | --------------------------------------------------------- |
| Signing        | Ed25519                        | Event signing, credential proofs, identity assertions     |
| Hashing        | SHA-256, Blake3                | Content addressing, hash chains, Merkle trees             |
| ZK proofs      | Groth16, Bulletproofs, Schnorr | Range proofs, ownership proofs, identity attribute proofs |
| Key derivation | HKDF-SHA-256 (planned)         | Per-context key derivation                                |

## 4. Zero-Knowledge Proofs (Current)

- **Groth16**: GCI threshold, asset ownership, location region proofs (Rust).
- **Bulletproofs**: Amount range proofs (Rust).
- **Schnorr**: Identity attribute possession proofs (Rust).

Proofs are generated in Rust (`rust/gtcx-zkp`) and verified by callers via exported APIs.

## 5. Implementation Notes

- Native bindings are loaded via `@gtcx/crypto-native` when available.
- JS fallback remains available for portability.
- Performance budgets and evidence are tracked in `benchmarks/` and `quality/`.

## 6. Optionality for Future Chains

The architecture remains chain-agnostic. If anchoring to a public ledger becomes required, Merkle roots can be published without schema changes. No user-facing behavior needs to change.

## 7. Related Documents

- `../specs/security-framework.md`
- `crypto-research.md`
- `../specs/eventcore.md`
