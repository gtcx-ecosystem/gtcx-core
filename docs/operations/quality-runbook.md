# Quality Gates Runbook

Last updated: 2026-02-19

## Mandatory Gates

Run from repo root:

```bash
pnpm architecture:check
pnpm quality:governance:check
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:coverage:critical
pnpm build
API_BASELINE_REF=<git-ref> pnpm api:check
pnpm quality:kpi:collect
pnpm quality:kpi:export
pnpm provenance:generate
pnpm run docs
pnpm docs:check-links
pnpm security:threat-matrix
pnpm perf:update-history
pnpm perf:check-budgets
```

Rust gates:

```bash
cd rust
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace --lib
```

## Failure Triage Order

1. Fix architecture boundary failures first.
2. Fix type and lint failures.
3. Fix test and coverage regressions.
4. Fix API baseline and docs checks.
5. Fix performance/security policy gates.

## Evidence Artifacts

1. Collect rolling KPI history: `pnpm quality:kpi:collect`.
2. Export KPI metrics: `pnpm quality:kpi:export`.
3. Generate evidence manifest: `pnpm provenance:generate`.
4. Confirm history exists at `artifacts/ci-history.json`.
5. Confirm manifest exists at `artifacts/provenance-manifest.json`.
6. Confirm API diff report exists at `quality/api-surface-report.json`.
7. Confirm KPI metrics exist at `quality/kpi-metrics.json`.
8. Confirm benchmark trend history exists at `benchmarks/history.json`.
9. Confirm benchmark performance report exists at `benchmarks/performance-report.json`.
10. CI artifact names: `ci-provenance-manifest`, `ci-quality-kpis`, `ci-api-surface-report`, `ci-performance-report`.
11. Release artifact names: `release-provenance-manifest`, `release-quality-kpis`, `release-api-surface-report`, `release-performance-report`.

## Release Semver Policy

1. Use release-mode API checks with semver enforcement:
   `API_ENFORCE_SEMVER=true API_BASELINE_REF=<previous-main-sha> pnpm api:check`.
2. Breaking API diffs require a `major` version bump or `major` changeset.
3. Additive API diffs require a `minor` or `major` version bump (or matching changeset).

## Performance Trend Policy

1. Use `pnpm perf:update-history` before `pnpm perf:check-budgets` in all local and CI release validations.
2. Trend checks are warning-mode until enough historical samples exist per metric (`minSamples` in `benchmarks/performance-budgets.json`).
3. After readiness is confirmed for all metrics, enforce strict mode in CI/release with `PERF_ENFORCE_TREND=true`.
