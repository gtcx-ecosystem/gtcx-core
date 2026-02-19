# Governance and Evidence Policy

Last updated: 2026-02-19

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
4. `pnpm perf:check-budgets`
5. `pnpm test:coverage:critical`
6. `pnpm api:check`
7. `pnpm provenance:generate`
8. `pnpm quality:kpi:export`

## Evidence Artifacts

Every CI and release run must publish:

1. `artifacts/provenance-manifest.json`
2. `quality/kpi-metrics.json`

Required evidence fields:

1. Commit and branch identity.
2. Lockfile and API baseline hashes.
3. Hashes for governance/security/performance evidence files.
4. The enforced quality gate command set.
5. KPI values and coverage/performance derivations from run artifacts.

## Monthly Audit

1. Verify required branch protection settings are unchanged.
2. Verify CODEOWNERS coverage matches policy scope.
3. Sample one CI and one release run; confirm provenance artifact availability.
4. Record drift or policy exceptions in the remediation tracker.
