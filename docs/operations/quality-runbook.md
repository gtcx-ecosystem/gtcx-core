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
pnpm api:check
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

1. Generate evidence manifest: `pnpm provenance:generate`.
2. Confirm manifest exists at `artifacts/provenance-manifest.json`.
3. CI artifact name: `ci-provenance-manifest`.
4. Release artifact name: `release-provenance-manifest`.
