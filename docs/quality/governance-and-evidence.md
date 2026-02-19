# Governance and Evidence Policy

Last updated: 2026-02-20

## Branch Protection Policy (`main`)

Required settings:

1. Require pull request before merging.
2. Require at least one CODEOWNER approval.
3. Require status checks to pass before merging.
4. Do not allow bypassing required checks except designated admins.

Required status checks:

1. `CI / ci`
2. `CI / rust`
3. `CI / security`
4. `CI / docker`

## CODEOWNERS Scope

CODEOWNERS must cover at least:

1. `/.github/workflows/`
2. `/quality/`
3. `/packages/crypto/`
4. `/packages/domain/`
5. `/packages/security/`
6. `/packages/services/`
7. `/packages/verification/`
8. `/rust/`

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

Every CI and release run must publish:

1. `artifacts/provenance-manifest.json`
2. `artifacts/ci-history.json`
3. `quality/kpi-metrics.json`
4. `quality/api-surface-report.json`
5. `benchmarks/performance-report.json`

Required evidence fields:

1. Commit and branch identity.
2. Lockfile and API baseline hashes.
3. Hashes for governance/security/performance evidence files.
4. The enforced quality gate command set.
5. KPI values and 30-day workflow/issue derivations from run artifacts.
6. API diff classification and semver policy outcomes.
7. Performance trend evaluation mode and outcomes.

## API Semver Enforcement

1. Release workflow must run `pnpm api:check` with `API_ENFORCE_SEMVER=true`.
2. Reference baseline must be set with `API_BASELINE_REF` to the previous mainline SHA.
3. Policy requirements:
   breaking diff => `major` bump (version delta or changeset)
   additive diff => `minor` or `major` bump (version delta or changeset)

## Monthly Audit

1. Verify required branch protection settings are unchanged.
   Command: `pnpm quality:verify-branch-protection`.
2. Verify CODEOWNERS coverage matches policy scope.
3. Sample one CI and one release run; confirm provenance artifact availability.
4. Record drift or policy exceptions in the remediation tracker.

## Performance Trend Enforcement

1. Trend history must be updated before budget checks (`pnpm perf:update-history`).
2. Strict trend mode is required in CI and release workflows.
3. Strict mode command requirement: `PERF_ENFORCE_TREND=true pnpm perf:check-budgets`.
