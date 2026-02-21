# Release Checklist (GTCX Core)

**Updated**: 2026-02-21

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
- [ ] `PERF_ENFORCE_TREND=true pnpm perf:check-budgets`
- [ ] `pnpm api:check`
- [ ] `pnpm provenance:generate`
- [ ] `pnpm docs`
- [ ] `pnpm docs:check-links`
- [ ] Rust: `cargo fmt --check`, `cargo clippy -D warnings`, `cargo test --workspace --lib`
- [ ] Heavy ZKP workflow completed within the last 7 days

## Release Artifacts

- [ ] `quality/api-surface-report.json`
- [ ] `benchmarks/performance-report.json`
- [ ] `artifacts/provenance-manifest.json`
- [ ] SBOM: `trivy-sbom.cdx.json`

## Signoff

- [ ] CODEOWNERS approval
- [ ] Release notes updated
