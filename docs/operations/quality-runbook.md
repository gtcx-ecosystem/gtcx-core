# Quality Gates Runbook

**Updated**: 2026-02-21

This runbook lists the required repo quality gates and the recommended triage order when something fails.

## Mandatory Gates (Repo Root)

```bash
pnpm architecture:check
pnpm quality:governance:check
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:coverage:critical
pnpm build
pnpm api:check
pnpm quality:kpi:collect
pnpm quality:kpi:export
pnpm provenance:generate
pnpm docs
pnpm docs:check-links
pnpm security:threat-matrix
pnpm perf:update-history
pnpm perf:check-budgets
```

## Rust Gates

```bash
cd rust
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace --lib
```

## Heavy Proof Validation (Scheduled)

```bash
cargo test -p gtcx-zkp --release -- --ignored
```

## Failure Triage Order

1. Architecture boundary failures (`pnpm architecture:check`).
2. Type and lint errors.
3. Tests and coverage regressions.
4. API baseline / docs link checks.
5. Performance budgets / threat matrix.

## Evidence Artifacts

- `quality/api-surface-report.json`
- `quality/kpi-metrics.json`
- `benchmarks/history.json`
- `benchmarks/performance-report.json`
- `artifacts/provenance-manifest.json`

## Notes

- For release readiness, also run `pnpm check:dist`.
- Update `docs/quality` evidence references if any gate fails or changes.
