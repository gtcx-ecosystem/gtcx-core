# ZKP Circuit Plan

**Updated**: 2026-02-21  
**Purpose**: Define the circuit selection strategy and performance budgets for the ZKP system.

## Scope

This plan covers the ZKP proof types defined in `docs/specs/security-framework.md` and maps them
onto concrete proving systems (Schnorr, Bulletproofs, Groth16/Plonk). It also sets initial
performance budgets for proof generation and verification to guide implementation and benchmarking.

## Circuit Selection Matrix

| Proof Type           | System        | Use Case                              | Public Inputs                                | Witness (Private)                 |
| -------------------- | ------------- | ------------------------------------- | -------------------------------------------- | --------------------------------- |
| `gci_threshold`      | Bulletproofs  | GCI score >= threshold                | threshold, score commitment, entity hash     | score, randomness                 |
| `location_region`    | Groth16/Plonk | Location within licensed region       | region hash, location commitment, timestamp  | coordinates, randomness           |
| `asset_ownership`    | Groth16/Plonk | Ownership proof without asset details | asset commitment, owner hash, ownership root | asset id, merkle path, randomness |
| `amount_range`       | Bulletproofs  | Amount within range                   | min, max, amount commitment                  | amount, randomness                |
| `identity_attribute` | Schnorr       | Attribute possession (identity)       | attribute hash, subject hash                 | attribute value                   |

## Performance Budgets

Budgets are targets for **median** runtime on validator-class hardware (x86_64, 8 cores).
They are consistent with `docs/specs/security-framework.md` and will be refined during benchmarks.

| System        | Proof Generation Target | Proof Verification Target |
| ------------- | ----------------------- | ------------------------- |
| Schnorr       | <= 200ms                | <= 20ms                   |
| Bulletproofs  | <= 2s                   | <= 50ms                   |
| Groth16/Plonk | <= 5s                   | <= 100ms                  |

## Phased Implementation

1. **Phase A (Now):** Placeholder hash-commitment engine in `@gtcx/crypto` to unblock flows.
2. **Phase B:** Arkworks circuits in `rust/gtcx-zkp` for the above proof types.
3. **Phase C:** Optional NAPI bindings for Node/TypeScript consumers.

## Verification Hooks

- Compliance workflows must accept or reject proofs deterministically.
- Proof metadata and validation status are recorded in compliance records for auditability.

## References

- `docs/specs/security-framework.md` (Section 8.4)
- `docs/architecture/core-architecture-overview.md`
