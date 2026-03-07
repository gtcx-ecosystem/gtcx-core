# ZKP Circuit Plan

| Attribute | Value                                                                 |
| --------- | --------------------------------------------------------------------- |
| Status    | Active                                                                |
| Purpose   | Circuit selection strategy and performance budgets for the ZKP system |

## Scope

This plan covers the ZKP proof types in `SOP/2-docs/3-engineering/security/security-framework.md` and maps them to current and target proving systems. Performance budgets are used for benchmarking in `benchmarks/`.

## Circuit Selection Matrix

| Proof Type           | Current System | Target System | Use Case                              | Public Inputs                                | Witness (Private)                 |
| -------------------- | -------------- | ------------- | ------------------------------------- | -------------------------------------------- | --------------------------------- |
| `gci_threshold`      | Groth16        | Bulletproofs  | GCI score >= threshold                | threshold, score commitment, entity hash     | score, randomness                 |
| `location_region`    | Groth16        | Groth16/Plonk | Location within licensed region       | region hash, location commitment, timestamp  | coordinates, randomness           |
| `asset_ownership`    | Groth16        | Groth16/Plonk | Ownership proof without asset details | asset commitment, owner hash, ownership root | asset id, merkle path, randomness |
| `amount_range`       | Bulletproofs   | Bulletproofs  | Amount within range                   | min, max, amount commitment                  | amount, randomness                |
| `identity_attribute` | Schnorr        | Schnorr       | Attribute possession (identity)       | attribute hash, subject hash                 | attribute value                   |

## Performance Budgets

Targets for median runtime on validator-class hardware. Refined during benchmarks.

| System        | Proof Generation Target | Proof Verification Target |
| ------------- | ----------------------- | ------------------------- |
| Schnorr       | <= 200ms                | <= 20ms                   |
| Bulletproofs  | <= 2s                   | <= 50ms                   |
| Groth16/Plonk | <= 5s                   | <= 100ms                  |

## Phased Implementation

| Phase | Status    | Description                                                                          |
| ----- | --------- | ------------------------------------------------------------------------------------ |
| A     | Completed | `HashCommitmentZkpEngine` in `@gtcx/crypto` for placeholder flows                    |
| B     | Active    | Arkworks circuits in `rust/gtcx-zkp` for all 5 proof types                           |
| C     | Active    | Native bindings via `@gtcx/crypto-native` once `gtcx-node` artifacts are built in CI |

## Verification Hooks

- Compliance workflows must accept or reject proofs deterministically.
- Proof metadata and validation status are recorded for auditability.
- Breaking circuit changes (verifying key rotation) require an ADR.

## References

- `SOP/2-docs/3-engineering/security/security-framework.md`
- `cryptographic-verification.md`
- `SOP/2-docs/2-specs/packages/rust/gtcx-zkp.md`
- `benchmarks/`
