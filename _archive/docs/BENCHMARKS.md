# GTCX Core Benchmarks

This document describes how benchmarks are captured and enforced. Numeric results live in `benchmarks/latest-results.json` and are intentionally not hard‑coded here to avoid drift.

## Running Benchmarks

```bash
pnpm bench
```

Specific Rust benches:

```bash
cd rust
cargo bench --bench signing
cargo bench --bench hashing
cargo bench -p gtcx-zkp --bench zkp
```

Results are written to `rust/target/criterion/` with HTML reports at `rust/target/criterion/report/index.html`.

## Budget Gates

Performance budgets and trend enforcement are managed by:

- `benchmarks/performance-budgets.json`
- `benchmarks/latest-results.json`
- `benchmarks/history.json`

Update history and validate budgets:

```bash
pnpm perf:update-history
pnpm perf:check-budgets
```

Strict trend mode:

```bash
PERF_ENFORCE_TREND=true pnpm perf:check-budgets
```

## ZKP Benchmarks

ZKP metrics (Groth16, Bulletproofs, Schnorr) are captured from `rust/gtcx-zkp/benches/zkp.rs`.
