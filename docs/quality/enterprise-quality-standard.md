# Enterprise Quality Standard (GTCX Core)

**Updated**: 2026-02-21

## Purpose

This document defines the continuous enforcement standard required to keep `gtcx-core` at 10/10 enterprise-grade quality. It is the authoritative source for required gates, evidence, and audit cadence.

## Mandatory Gates (CI-Enforced)

- Lint: `pnpm lint`
- Format: `pnpm format:check`
- Typecheck: `pnpm typecheck`
- Unit/integration tests: `pnpm test`
- Coverage (critical packages): `pnpm test:coverage:critical`
- Build: `pnpm build`
- Architecture boundaries: `pnpm architecture:check`
- Governance policy: `pnpm quality:governance:check`
- Threat matrix validation: `pnpm security:threat-matrix`
- Performance budgets: `PERF_ENFORCE_TREND=true pnpm perf:check-budgets`
- API surface: `pnpm api:check`
- Provenance: `pnpm provenance:generate`
- Docs + links: `pnpm docs`, `pnpm docs:check-links`
- Rust quality: `cargo fmt --check`, `cargo clippy -D warnings`, `cargo test --workspace --lib`

## Heavy Proof Validation (Scheduled)

- ZKP heavy proofs must run on schedule via `.github/workflows/zkp-heavy.yml`.
- Any failures require a remediation ticket before release.

## PR Evidence Requirements

Each PR must include evidence links in the description:

- Tests (unit/integration)
- Perf budget check status
- API surface check status (if applicable)
- Any security or governance exceptions (with ticket ID)

## Release Checklist (Required)

See `docs/quality/release-checklist.md`.

## Production Requirements

- Native crypto bindings must be used in production; enforce with `GTCX_REQUIRE_NATIVE=1`.
- JS fallback is acceptable only for dev/test environments.

## Audit Cadence

- Monthly: re-run 10/10 audit review and update `docs/quality/10-10-audit-report.md`.
- Weekly: verify heavy ZKP workflow completes successfully.

## Governance

Changes to this standard require approval from CODEOWNERS and must include evidence of gate impact.
