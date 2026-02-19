# GTCX Core Benchmarks

Performance benchmarks for core cryptographic operations, measured with [Criterion.rs](https://github.com/bheisler/criterion.rs).

## Environment

- **CPU**: Apple M-series (ARM64)
- **Rust**: 1.82 stable, release profile (LTO enabled)
- **Date**: 2026-02-17

## Ed25519 Operations

| Operation               | Mean Time |
| ----------------------- | --------- |
| Key generation          | 23.1 µs   |
| Sign                    | 22.7 µs   |
| Verify                  | 31.2 µs   |
| Sign + Verify roundtrip | 53.5 µs   |

## Hashing (256-byte input)

| Algorithm | Mean Time | Throughput |
| --------- | --------- | ---------- |
| SHA-256   | 876 ns    | ~278 MB/s  |
| SHA-512   | 663 ns    | ~368 MB/s  |
| Blake3    | 287 ns    | ~850 MB/s  |

Blake3 is **3x faster** than SHA-256 for typical payloads, which is why it's used for internal Merkle tree construction and commitment schemes (see [ADR-001](adr/001-rust-for-cryptography.md)).

## Scaling (SHA-256)

| Input Size | Mean Time |
| ---------- | --------- |
| 32 B       | ~350 ns   |
| 256 B      | ~876 ns   |
| 1 KB       | ~2.8 µs   |
| 4 KB       | ~10.2 µs  |

## Running Benchmarks

```bash
# All benchmarks
pnpm bench

# Specific benchmark
cd rust && cargo bench --bench signing
cd rust && cargo bench --bench hashing
```

Results are saved to `rust/target/criterion/` with HTML reports at `rust/target/criterion/report/index.html`.

## CI Budget Gates

Performance budgets are tracked in:

- `benchmarks/performance-budgets.json`
- `benchmarks/latest-results.json`
- `benchmarks/history.json`

CI updates history and validates budget/trend policy:

```bash
pnpm perf:update-history
pnpm perf:check-budgets
```

`pnpm perf:check-budgets` writes `benchmarks/performance-report.json` with:

- absolute budget pass/fail per metric
- trend baseline comparison status
- warnings/failures and sample counts

Strict trend mode can be enabled with:

```bash
PERF_ENFORCE_TREND=true pnpm perf:check-budgets
```

Use strict trend mode after enough historical samples exist per metric (`trend.minSamples` in `benchmarks/performance-budgets.json`).

When benchmark results change intentionally, update `benchmarks/latest-results.json`, then run history + budget checks and confirm report results stay within policy.
