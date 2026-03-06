# Quality Gates Runbook

Required quality gates and triage order for `gtcx-core`. Run this sequence before every release and after any gate failure in CI.

## TypeScript / pnpm Gates (Required Order)

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

This must complete successfully within 7 days before any release. Failures require a remediation ticket.

## Failure Triage Order

1. Architecture boundary failures (`pnpm architecture:check`)
2. Type and lint errors
3. Tests and coverage regressions
4. API baseline / docs link checks
5. Performance budgets / threat matrix

## Evidence Artifacts

| Artifact           | Path                                 |
| ------------------ | ------------------------------------ |
| API surface report | `quality/api-surface-report.json`    |
| KPI metrics        | `quality/kpi-metrics.json`           |
| Perf history       | `benchmarks/history.json`            |
| Perf report        | `benchmarks/performance-report.json` |
| Provenance         | `artifacts/provenance-manifest.json` |

## Notes

- For release readiness, also run `pnpm check:dist`.
- Update `SOP/2-docs/4-operations/compliance/` evidence references if any gate fails or changes.

## References

- `SOP/2-docs/3-engineering/testing/quality-standards.md`
- `SOP/2-docs/4-operations/compliance/release-checklist.md`
