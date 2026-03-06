# GTCX Core Benchmarks

How benchmarks are captured and enforced. Numeric results live in `benchmarks/latest-results.json` and are not hard-coded here to avoid drift.

## Running Benchmarks

TypeScript:

```bash
pnpm bench
```

Rust signing and hashing:

```bash
cd rust
cargo bench --bench signing
cargo bench --bench hashing
cargo bench -p gtcx-zkp --bench zkp
```

Results are written to `rust/target/criterion/` with HTML reports at `rust/target/criterion/report/index.html`.

## Budget Gates

| Artifact            | Path                                  |
| ------------------- | ------------------------------------- |
| Performance budgets | `benchmarks/performance-budgets.json` |
| Latest results      | `benchmarks/latest-results.json`      |
| History             | `benchmarks/history.json`             |

Update history and validate:

```bash
pnpm perf:update-history
pnpm perf:check-budgets
```

Strict trend mode (required for release):

```bash
PERF_ENFORCE_TREND=true pnpm perf:check-budgets
```

## ZKP Performance Budgets

See `SOP/2-docs/1-architecture/zkp-circuit-plan.md` for proof generation and verification targets per circuit type (Schnorr, Bulletproofs, Groth16).

ZKP benchmarks are captured from `rust/gtcx-zkp/benches/zkp.rs`.

## References

- `SOP/2-docs/1-architecture/zkp-circuit-plan.md`
- `SOP/2-docs/1-architecture/decisions/013-api-baseline-and-performance-budget-gates.md`
