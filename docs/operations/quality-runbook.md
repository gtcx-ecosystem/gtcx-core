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
8. CI artifact names: `ci-provenance-manifest`, `ci-quality-kpis`, `ci-api-surface-report`.
9. Release artifact names: `release-provenance-manifest`, `release-quality-kpis`, `release-api-surface-report`.

## Release Semver Policy

1. Use release-mode API checks with semver enforcement:
   `API_ENFORCE_SEMVER=true API_BASELINE_REF=<previous-main-sha> pnpm api:check`.
2. Breaking API diffs require a `major` version bump or `major` changeset.
3. Additive API diffs require a `minor` or `major` version bump (or matching changeset).
