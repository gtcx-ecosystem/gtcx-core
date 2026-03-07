# Release Checklist (gtcx-core)

Complete this checklist for every release. All items must be checked before publishing.

## Pre-Release Gates

- [ ] `pnpm lint`
- [ ] `pnpm format:check`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm test:coverage:critical`
- [ ] `pnpm build`
- [ ] `pnpm architecture:check`
- [ ] `pnpm quality:governance:check`
- [ ] `pnpm security:threat-matrix`
- [ ] `pnpm perf:update-history` + `pnpm perf:check-budgets`
- [ ] `pnpm api:check`
- [ ] `pnpm provenance:generate`
- [ ] `pnpm docs` + `pnpm docs:check-links`
- [ ] `cargo fmt --check`
- [ ] `cargo clippy -D warnings`
- [ ] `cargo test --workspace --lib`
- [ ] Heavy ZKP workflow completed within last 7 days (or run `cargo test -p gtcx-zkp --release -- --ignored`)

## Release Artifacts

- [ ] `quality/api-surface-report.json`
- [ ] `benchmarks/performance-report.json`
- [ ] `artifacts/provenance-manifest.json`

## Signoff

- [ ] CODEOWNERS approval
- [ ] Release notes updated
- [ ] UAT evidence log updated (`SOP/3-agile/`)

## References

- `SOP/2-docs/4-operations/runbooks/quality-runbook.md`
- `SOP/2-docs/3-engineering/testing/quality-standards.md`
