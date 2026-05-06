# Release Evidence — 2026-05-06

## Scope

Security and verification hardening for `@gtcx/security` and `@gtcx/verification`, plus release-grade gate validation across the TypeScript and Rust workspace.

## Code Changes Covered

1. Traced certificate generation now uses real signing via `@gtcx/crypto.sign`.
2. Traced certificate verification no longer accepts placeholder or presence-only signatures.
3. Token signature assembly and verification now share a single hex encoding contract.
4. Offline secure-storage lockouts now expire from persisted timestamps.
5. Verification template requirements now match the exported public input and type surface.
6. Standalone integration tests now resolve live workspace source instead of stale `dist/` artifacts.
7. Repo-local Typedoc warnings were removed by exporting missing public types and replacing unsupported doc tags.
8. Verification revocation and tracing adapter coverage were added to restore the critical coverage gate.
9. Offline queue replay now uses logical sequence ordering instead of wall-clock timestamps, with restart and backward-clock regression coverage.
10. Agentic governance artifacts now include risk-tier gate mapping, an evidence template, and task playbooks for security fixes, API expansion, and audit remediation.
11. Enterprise supportability artifacts now define runtime expectations, migration policy, release artifact expectations, and downstream production-readiness checks.

## Gates Passed

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage:critical`
- `pnpm build`
- `pnpm architecture:check`
- `pnpm api:check`
- `pnpm api:check:release`
- `pnpm quality:governance:check`
- `pnpm security:threat-matrix`
- `pnpm run docs`
- `pnpm perf:check-budgets`
- `pnpm docs:check-links`
- `pnpm provenance:generate`
- `pnpm --filter @gtcx/integration-tests test`
- `cargo fmt --all -- --check`
- `cargo clippy --workspace --all-targets -- -D warnings`
- `cargo test --workspace --lib`
- `cargo test -p gtcx-zkp --release -- --ignored`

## Gate Outcome

All code-addressable release gates now pass.

The final docs blocker was resolved by upgrading TypeDoc from `0.28.17` to `0.28.19`, which explicitly supports workspace TypeScript `6.0.x`.

## Artifacts Produced

- [quality/api-surface-report.json](./api-surface-report.json)
- [quality/api-surface-baseline.json](./api-surface-baseline.json)
- [artifacts/provenance-manifest.json](../artifacts/provenance-manifest.json)
- [docs/audits/auto-dev-state.md](../docs/audits/auto-dev-state.md)
- [docs/audits/10-10-roadmap-2026-05-06.md](../docs/audits/10-10-roadmap-2026-05-06.md)
- [docs/release/enterprise-release-artifact-pack.md](../docs/release/enterprise-release-artifact-pack.md)
- [docs/release/downstream-production-readiness-checklist.md](../docs/release/downstream-production-readiness-checklist.md)

## Residual Non-Code Work

1. Pen test / external security review
2. Downstream consumer validation against the published verification surface
3. Final human release signoff and versioning workflow
