---
title: 'Trusted Setup Ceremony — gtcx-zkp Groth16 Circuits'
status: 'current'
date: '2026-06-02'
owner: 'gtcx-core'
role: 'crypto-security-engineer'
agent_id: 'agent://gtcx-core/2026-06-02/trusted-setup'
trust_score: 75
autonomy_level: 'authorized'
tier: 'critical'
tags: ['documentation', 'security', 'zkp', 'groth16', 'trusted-setup']
review_cycle: 'on-change'
---

---

title: 'Trusted Setup Ceremony'
status: 'current'
date: '2026-06-02'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security', 'zkp', 'trusted-setup']
review_cycle: 'on-change'

---

# Trusted Setup Ceremony — gtcx-zkp Groth16 Circuits

**Document ID:** GTCX-CORE-ZKP-TS-001
**Version:** 1.0
**Date:** 2026-06-02
**Status:** Active
**Classification:** Internal

---

## 1. Overview

Groth16 zero-knowledge proofs require a **trusted setup** per circuit: a one-time generation of a proving key (`pk`) and verifying key (`vk`). If the setup randomness (the "toxic waste") is leaked, an attacker can forge proofs for that circuit.

This document describes the trusted setup process for the four Groth16 circuits in `gtcx-zkp`.

**Important:** This crate implements the setup generation code. The actual trusted setup artifacts are versioned and stored separately. Do not regenerate trusted setup artifacts without a documented ceremony and Cryptographic Security Engineer sign-off.

---

## 2. Parameter Generation Process

### 2.1 Circuit-Specific Setup

`gtcx-zkp` uses **circuit-specific setup** (not universal). Each circuit variant invokes `ark_groth16::Groth16::<Bn254>::circuit_specific_setup` with a dummy witness:

```rust
let mut rng = zk_rng();
let circuit_impl = CommodityOriginCircuit {
    commodity_type: Some(sample.commodity_type),
    mine_id: Some(sample.mine_id),
    // ... all witness fields populated with sample data
};
let (pk, vk) = Groth16::<Bn254>::circuit_specific_setup(circuit_impl, &mut rng)?;
```

**Why dummy witnesses are safe:** `circuit_specific_setup` only uses the circuit structure (constraint system), not the witness values. Any valid dummy assignment produces the same `pk`/`vk` pair. The sample data is discarded immediately after key generation.

### 2.2 Entropy Sources

Randomness for the setup is drawn from the operating system's CSPRNG:

```rust
pub(crate) fn zk_rng() -> ark_std::rand::rngs::StdRng {
    let mut seed = [0u8; 32];
    ark_std::rand::rngs::OsRng.fill_bytes(&mut seed);
    ark_std::rand::rngs::StdRng::from_seed(seed)
}
```

| Source              | Quality                  | Guarantee                                                              |
| ------------------- | ------------------------ | ---------------------------------------------------------------------- |
| `OsRng`             | Cryptographically secure | OS-provided (`/dev/urandom`, `getrandom()`, `BCryptGenRandom`)         |
| Seed length         | 256 bits                 | Matches BN254 scalar field security level                              |
| `StdRng` (ChaCha12) | CSPRNG                   | Deterministic expansion from 256-bit seed; not used for long sequences |

**Entropy requirement:** The security of the trusted setup rests entirely on the 256-bit seed drawn from `OsRng`. The seed must be unguessable. `OsRng` is the single source of entropy; no user-provided entropy, no multi-party contribution protocol, and no hardware RNG are used.

### 2.3 Number of Participants

| Parameter                     | Value                                                                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Participants per circuit      | **1**                                                                                                                                        |
| Multi-party computation (MPC) | Not implemented                                                                                                                              |
| Rationale                     | Circuit-specific setup is simpler than universal setup; a single honest participant who securely destroys the randomness seed is sufficient. |

**Risk acceptance:** The one-person ceremony model is accepted because:

1. The setup is executed on an air-gapped, single-tenant machine.
2. The seed is never persisted; it lives only in RAM during key generation.
3. The machine is wiped after the ceremony.
4. If the toxic waste were leaked, the impact is bounded to **proof forgery for that specific circuit variant only** — not key theft or signature forgery.

For a higher assurance posture, a future MPC ceremony (e.g., using the `phase2` framework) may be adopted. This is tracked in the roadmap.

---

## 3. Transcript Hash

After key generation, the verifying key is hashed to produce a canonical identifier:

```rust
let vk_hash = hex::encode(Sha256::digest(&vk_bytes));
```

| Property      | Value                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| Hash function | SHA-256                                                                                                         |
| Input         | Canonical compressed bytes of the verifying key                                                                 |
| Output        | 32-byte digest, hex-encoded                                                                                     |
| Purpose       | Uniquely identifies a trusted setup artifact; enables downstream detection of key tampering or version mismatch |

The transcript hash is published alongside the artifact in the KAT (Known Answer Test) vectors. Verifiers must check that the `vk_hash` they trust matches the artifact they load.

---

## 4. Circuit Types

Each circuit has **independent** proving and verifying keys. Keys are not interchangeable across circuits.

| Circuit             | Type Enum                             | Description                                                     | Constraints (approx.)        |
| ------------------- | ------------------------------------- | --------------------------------------------------------------- | ---------------------------- |
| **GciThreshold**    | `Groth16CircuitType::GciThreshold`    | Prove GCI score >= threshold without revealing score            | Smallest (~hundreds)         |
| **AssetOwnership**  | `Groth16CircuitType::AssetOwnership`  | Prove asset ownership via Merkle membership                     | Medium (~thousands)          |
| **LocationRegion**  | `Groth16CircuitType::LocationRegion`  | Prove GPS coordinates lie within licensed bounds                | Medium (~thousands)          |
| **CommodityOrigin** | `Groth16CircuitType::CommodityOrigin` | Prove mine is approved, in region, and meets quality thresholds | Largest (~tens of thousands) |

### 4.1 Key Separation

```rust
pub struct Groth16Keys {
    pub circuit: Groth16CircuitType,
    pub proving_key: Vec<u8>,
    pub verifying_key: Vec<u8>,
}
```

The `circuit` field is checked at proof time:

```rust
if keys.circuit != Groth16CircuitType::CommodityOrigin {
    return Err(ZkpError::UnsupportedCircuit(...));
}
```

This prevents cross-circuit key misuse.

---

## 5. Key Sizes

| Key                           | Size                                                   | Source                                                                                 |
| ----------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Verifying key (all circuits)  | **~41 KB** (41,224 bytes observed for CommodityOrigin) | KAT generation (`generate-kat` binary)                                                 |
| Proving key (GciThreshold)    | ~hundreds of KB                                        | Estimated from constraint count                                                        |
| Proving key (AssetOwnership)  | ~1–3 MB                                                | Estimated from constraint count                                                        |
| Proving key (LocationRegion)  | ~1–3 MB                                                | Estimated from constraint count                                                        |
| Proving key (CommodityOrigin) | **~5–20 MB**                                           | Estimated; largest due to multiple SHA-256 gadgets, 6× `uint64_is_ge`, and Merkle path |

**Why proving keys vary:** Groth16 proving key size grows linearly with the number of R1CS constraints. The CommodityOrigin circuit includes:

- 3× SHA-256 commitment constraints
- 1× SHA-256 region hash constraint
- 1× Merkle membership path (multiple SHA-256 compressions)
- 6× `uint64_is_ge` comparisons (64 bits each)

All of these expand the constraint system and therefore the proving key.

---

## 6. Artifact Storage and Distribution

| Concern          | Policy                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| Storage location | Versioned artifact repository (separate from source code)                                                |
| Access control   | Cryptographic Security Engineer and CI release pipeline only                                             |
| Integrity check  | SHA-256 of `vk_bytes` published in KAT and registry                                                      |
| Rotation         | New circuit version → new ceremony → new artifact set                                                    |
| Audit trail      | Ceremony date, participant identity, machine ID, and `vk_hash` logged in `docs/security/key-ceremony.md` |

---

## 7. Security Constraints

1. **Never reuse setup randomness** across circuit versions.
2. **Never modify `pk` or `vk` bytes** after generation — any change invalidates the setup.
3. **Verify `vk_hash` at load time** in production deployments.
4. **Do not run the ceremony on a multi-tenant host** — the seed must not be exposed to other processes.
5. **Wipe RAM after ceremony** — reboot or use secure memory clearing tools.

---

## 8. Reproduction (Development Only)

Developers can regenerate keys for testing:

```bash
cargo run --bin generate-kat -- artifacts/kat/
```

**Warning:** Keys generated this way are for development and CI only. They must not be used in production.

---

## 9. References

- [FIPS Validation Boundary Statement](../../docs/security/fips-validation-boundary.md)
- [Security Framework](../../docs/security/security-framework.md)
- [Crate Spec — gtcx-zkp](../../docs/specs/packages/rust/gtcx-zkp.md)
- `src/groth16/ops.rs` — key generation implementation
- `src/types.rs` — `Groth16Keys`, `Groth16CircuitType`
- `src/bin/generate-kat.rs` — KAT generation and `vk_hash` computation
- arkworks `ark-groth16` documentation — circuit-specific setup semantics
