# Governance and Evidence Policy

**Updated**: 2026-02-21

## Branch Protection Policy (`main`)

Required settings:

1. Require pull request before merging.
2. Require CODEOWNER approval.
3. Require status checks to pass before merging.
4. Do not allow bypassing required checks except designated admins.

Required workflow checks (current):

- `CI` (`.github/workflows/ci.yml`)
- `Crypto Native CI` (`.github/workflows/crypto-native-ci.yml`)
- `Release` (`.github/workflows/release.yml`)
- `Rust Release` (`.github/workflows/rust-release.yml`)

## CODEOWNERS Scope

CODEOWNERS must cover at least:

- `/.github/workflows/`
- `/quality/`
- `/packages/crypto/`
- `/packages/security/`
- `/packages/services/`
- `/packages/verification/`
- `/rust/`

## Required Governance Gates

Blocking scripts:

1. `pnpm architecture:check`
2. `pnpm quality:governance:check`
3. `pnpm security:threat-matrix`
4. `pnpm perf:update-history`
5. `pnpm perf:check-budgets`
6. `pnpm test:coverage:critical`
7. `pnpm api:check`
8. `pnpm quality:kpi:collect`
9. `pnpm quality:kpi:export`
10. `pnpm provenance:generate`

## Evidence Artifacts

Every CI and release run should publish:

- `artifacts/provenance-manifest.json`
- `quality/kpi-metrics.json`
- `quality/api-surface-report.json`
- `benchmarks/performance-report.json`

## API Semver Enforcement

1. Release workflow must run `pnpm api:check` with `API_ENFORCE_SEMVER=true`.
2. Reference baseline must be set with `API_BASELINE_REF` to the previous mainline SHA.
3. Policy requirements:
   - breaking diff => `major` bump
   - additive diff => `minor` or `major` bump

## Monthly Audit

1. Verify branch protection settings remain intact.
2. Verify CODEOWNERS coverage matches policy scope.
3. Sample one CI and one release run; confirm provenance artifacts exist.
