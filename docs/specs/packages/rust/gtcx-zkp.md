# Crate Spec — `gtcx-zkp`

**Classification:** Security-sensitive — all changes require Cryptographic Security Engineer co-review and human approval before merge.

---

## Purpose

Zero-knowledge proof system for the GTCX protocol. Provides proof circuits for compliance, provenance, quality, and identity attribute claims — enabling participants to prove properties about data without revealing the underlying values.

The production ZKP stack runs here in Rust. TypeScript wrappers in `@gtcx/crypto` (`zkp.ts`) are development stubs only.

---

## Proof Circuit Inventory

| Circuit            | Proof Type      | Description                                                     |
| ------------------ | --------------- | --------------------------------------------------------------- |
| GCI threshold      | Groth16 (BN254) | Prove a GCI score meets a threshold without revealing the score |
| Asset ownership    | Groth16 (BN254) | Prove ownership of an asset without revealing identity          |
| Location region    | Groth16 (BN254) | Prove location is within a region without revealing coordinates |
| Amount range       | Bulletproofs    | Prove a value is within a range without revealing it            |
| Identity attribute | Schnorr         | Prove possession of an identity attribute without revealing PII |

Hash commitment proofs (Blake3-based) are the lightweight baseline used throughout the protocol where full ZKP circuits are not required.

---

## ZKP Stack

| Library                                                                      | Role                                      |
| ---------------------------------------------------------------------------- | ----------------------------------------- |
| `ark-groth16`                                                                | Groth16 prover and verifier (BN254 curve) |
| `ark-bn254`                                                                  | BN254 elliptic curve arithmetic           |
| `ark-r1cs-std`                                                               | R1CS constraint system gadgets            |
| `ark-crypto-primitives`                                                      | SHA-256 gadgets, Merkle tree constraints  |
| `bulletproofs`                                                               | Bulletproofs range proofs                 |
| `curve25519-dalek`                                                           | Curve25519 arithmetic for Bulletproofs    |
| `merlin`                                                                     | Fiat-Shamir transcript for Bulletproofs   |
| `ark-ff`, `ark-ec`, `ark-relations`, `ark-snark`, `ark-serialize`, `ark-std` | Arkworks foundation                       |

---

## Public API

### Hash Commitment Proofs

Blake3-based commitments — the lightweight proof primitive used when full ZKP circuits are not required:

| Function                                     | Description                     |
| -------------------------------------------- | ------------------------------- |
| `create_commitment(value, salt)`             | Create a Blake3 hash commitment |
| `verify_commitment(commitment, value, salt)` | Verify a commitment             |

### Groth16 Circuits

| Function                                                         | Description                       |
| ---------------------------------------------------------------- | --------------------------------- |
| `prove_gci_threshold(score, threshold, proving_key)`             | Generate a GCI threshold proof    |
| `verify_gci_threshold(proof, threshold, verifying_key)`          | Verify a GCI threshold proof      |
| `prove_asset_ownership(asset_id, owner_key, proving_key)`        | Generate an asset ownership proof |
| `verify_asset_ownership(proof, asset_commitment, verifying_key)` | Verify an asset ownership proof   |
| `prove_location_region(lat, lon, region, proving_key)`           | Generate a location region proof  |
| `verify_location_region(proof, region, verifying_key)`           | Verify a location region proof    |

### Bulletproofs

| Function                        | Description            |
| ------------------------------- | ---------------------- |
| `prove_range(value, min, max)`  | Generate a range proof |
| `verify_range(proof, min, max)` | Verify a range proof   |

### Schnorr Identity Attribute

| Function                                   | Description                          |
| ------------------------------------------ | ------------------------------------ |
| `prove_attribute(attribute, identity_key)` | Generate an identity attribute proof |
| `verify_attribute(proof, public_key)`      | Verify an identity attribute proof   |

---

## Dependencies

| Crate                 | Role                             |
| --------------------- | -------------------------------- |
| `gtcx-crypto` (local) | Hash commitments, key types      |
| `thiserror`           | Error types                      |
| `tracing`             | Observability                    |
| `serde`               | Serialization                    |
| Arkworks suite        | Groth16, R1CS, BN254, primitives |
| `bulletproofs`        | Range proofs                     |
| `curve25519-dalek`    | Bulletproofs curve arithmetic    |
| `merlin`              | Fiat-Shamir transcript           |

---

## Trusted Setup

Groth16 circuits require a trusted setup (proving key + verifying key generation). The GTCX trusted setup artifacts are versioned and stored separately from this crate. Do not regenerate trusted setup artifacts without a documented ceremony and Cryptographic Security Engineer sign-off.

---

## Scheduled Validation

Heavy proof generation and verification tests are excluded from the standard CI gate (they would make PR checks too slow). They run weekly:

```bash
cargo test -p gtcx-zkp --release -- --ignored
```

---

## Non-Goals

- Does not implement core cryptographic primitives — delegates to `gtcx-crypto`
- Does not expose NAPI bindings directly — that is `gtcx-node`
- Does not manage proving key storage or distribution — a deployment concern
- Does not implement Plonk or STARKs — those are tracked in the roadmap

---

## Security Constraints

- Never use `#[allow(unsafe_code)]` in this crate
- Trusted setup artifacts must never be modified or regenerated without a formal ceremony
- Proof verification must be performed by the verifying party — never trust a proof that the prover also verified
- Bulletproofs transcripts must use Merlin — never reuse or seed transcripts manually

---

## Implementation

`rust/gtcx-zkp/src/`

---

## Reference

- [`docs/specs/packages/rust/gtcx-crypto.md`](./gtcx-crypto.md) — foundation crate
- [`docs/security/security-framework.md`](../../../security/security-framework.md) — ZKP layer description and approved libraries
- [`docs/specs/core-spec.md`](../../core-spec.md) — system overview
- [`docs/devops/ci-cd/ci-cd.md`](../../../devops/ci-cd/ci-cd.md) — scheduled ZKP validation
