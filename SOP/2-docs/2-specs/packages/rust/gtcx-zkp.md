# gtcx-zkp (Rust)

Zero-knowledge proof generation and verification for `gtcx-core`. Implements Groth16, Bulletproofs, and Schnorr circuits using the Arkworks library suite.

## Scope

| Proof Type           | System       | Use Case                              | Public Inputs                                | Witness (Private)                 |
| -------------------- | ------------ | ------------------------------------- | -------------------------------------------- | --------------------------------- |
| `gci_threshold`      | Groth16      | GCI score >= threshold                | threshold, score commitment, entity hash     | score, randomness                 |
| `location_region`    | Groth16      | Location within licensed region       | region hash, location commitment, timestamp  | coordinates, randomness           |
| `asset_ownership`    | Groth16      | Ownership proof without asset details | asset commitment, owner hash, ownership root | asset id, merkle path, randomness |
| `amount_range`       | Bulletproofs | Amount within range                   | min, max, amount commitment                  | amount, randomness                |
| `identity_attribute` | Schnorr      | Attribute possession (identity)       | attribute hash, subject hash                 | attribute value                   |

## TypeScript Placeholder

Until native bindings are wired, `@gtcx/crypto` exports `HashCommitmentZkpEngine` — a compatible API surface for development and testing.

## Performance Budgets

| System        | Proof Generation Target | Proof Verification Target |
| ------------- | ----------------------- | ------------------------- |
| Schnorr       | <= 200ms                | <= 20ms                   |
| Bulletproofs  | <= 2s                   | <= 50ms                   |
| Groth16/Plonk | <= 5s                   | <= 100ms                  |

Budgets are targets for median runtime on validator-class hardware, refined during benchmarks.

## Implementation Phases

| Phase | Status    | Description                                                                          |
| ----- | --------- | ------------------------------------------------------------------------------------ |
| A     | Completed | Hash-commitment engine in `@gtcx/crypto` for placeholder flows                       |
| B     | Active    | Arkworks circuits in `rust/gtcx-zkp` for all 5 proof types                           |
| C     | Active    | Native bindings via `@gtcx/crypto-native` once `gtcx-node` artifacts are built in CI |

## Notes

- Proof metadata and validation status are recorded for auditability — compliance workflows must accept or reject proofs deterministically.
- Migration from Groth16 to Bulletproofs is planned for `gci_threshold` — see circuit selection matrix in architecture docs.
- Verifying keys must be stable across minor version bumps; breaking circuit changes require an ADR.

## References

- `SOP/2-docs/1-architecture/zkp-circuit-plan.md`
- `SOP/2-docs/2-specs/packages/crypto.md`
- `SOP/2-docs/3-engineering/security/security-framework.md`
- `rust/gtcx-zkp/`
