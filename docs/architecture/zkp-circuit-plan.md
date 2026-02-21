# ZKP Circuit Plan

**Updated**: 2026-02-21  
**Purpose**: Define circuit selection strategy and performance budgets for the ZKP system.

## Scope

This plan covers the ZKP proof types defined in `docs/specs/security-framework.md` and maps them to current and target proving systems. It also sets performance budgets used for benchmarking.

## Circuit Selection Matrix

| Proof Type           | Current System | Target System | Use Case                              | Public Inputs                                | Witness (Private)                 |
| -------------------- | -------------- | ------------- | ------------------------------------- | -------------------------------------------- | --------------------------------- |
| `gci_threshold`      | Groth16        | Bulletproofs  | GCI score >= threshold                | threshold, score commitment, entity hash     | score, randomness                 |
| `location_region`    | Groth16        | Groth16/Plonk | Location within licensed region       | region hash, location commitment, timestamp  | coordinates, randomness           |
| `asset_ownership`    | Groth16        | Groth16/Plonk | Ownership proof without asset details | asset commitment, owner hash, ownership root | asset id, merkle path, randomness |
| `amount_range`       | Bulletproofs   | Bulletproofs  | Amount within range                   | min, max, amount commitment                  | amount, randomness                |
| `identity_attribute` | Schnorr        | Schnorr       | Attribute possession (identity)       | attribute hash, subject hash                 | attribute value                   |

## Performance Budgets

Budgets are targets for median runtime on validator-class hardware and will be refined during benchmarks.

| System        | Proof Generation Target | Proof Verification Target |
| ------------- | ----------------------- | ------------------------- |
| Schnorr       | <= 200ms                | <= 20ms                   |
| Bulletproofs  | <= 2s                   | <= 50ms                   |
| Groth16/Plonk | <= 5s                   | <= 100ms                  |

## Phased Implementation

1. **Phase A (Completed):** Hash-commitment engine in `@gtcx/crypto` for placeholder flows.
2. **Phase B (Active):** Arkworks circuits in `rust/gtcx-zkp` for GCI threshold, asset ownership, location region, amount range, and identity attribute proofs.
3. **Phase C (Active):** Native bindings via `@gtcx/crypto-native` once `gtcx-node` artifacts are built in CI.

## Verification Hooks

- Compliance workflows must accept or reject proofs deterministically.
- Proof metadata and validation status are recorded for auditability.

## References

- `docs/specs/security-framework.md` (Section 8.4)
- `docs/architecture/core-architecture-overview.md`
