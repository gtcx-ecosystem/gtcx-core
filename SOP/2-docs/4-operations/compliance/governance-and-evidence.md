# Governance and Evidence Policy

## Branch Protection Policy (`main`)

Required settings:

1. Require pull request before merging.
2. Require CODEOWNER approval.
3. Require status checks to pass before merging.
4. Do not allow bypassing required checks except designated admins.

Required workflow checks:

- `CI` (`.github/workflows/ci.yml`)
- `Crypto Native CI` (`.github/workflows/crypto-native-ci.yml`)
- `Release` (`.github/workflows/release.yml`)
- `Rust Release` (`.github/workflows/rust-release.yml`)

## CODEOWNERS Scope

CODEOWNERS must cover at minimum:

- `/.github/workflows/`
- `/quality/`
- `/packages/crypto/`
- `/packages/security/`
- `/packages/services/`
- `/packages/verification/`
- `/rust/`

## Required Governance Gates

| Gate              | Command                         |
| ----------------- | ------------------------------- |
| Architecture      | `pnpm architecture:check`       |
| Governance policy | `pnpm quality:governance:check` |
| Threat matrix     | `pnpm security:threat-matrix`   |
| Perf history      | `pnpm perf:update-history`      |
| Perf budgets      | `pnpm perf:check-budgets`       |
| Critical coverage | `pnpm test:coverage:critical`   |
| API surface       | `pnpm api:check`                |
| KPI collect       | `pnpm quality:kpi:collect`      |
| KPI export        | `pnpm quality:kpi:export`       |
| Provenance        | `pnpm provenance:generate`      |

## Evidence Artifacts

Every CI and release run publishes:

- `artifacts/provenance-manifest.json`
- `quality/kpi-metrics.json`
- `quality/api-surface-report.json`
- `benchmarks/performance-report.json`

## API Semver Enforcement

1. Release workflow must run `pnpm api:check` with `API_ENFORCE_SEMVER=true`.
2. Reference baseline set with `API_BASELINE_REF` to the previous mainline SHA.
3. Policy:
   - Breaking diff → `major` version bump required
   - Additive diff → `minor` or `major` version bump required

## Monthly Audit

1. Verify branch protection settings remain intact.
2. Verify CODEOWNERS coverage matches policy scope.
3. Sample one CI and one release run; confirm provenance artifacts exist.

## References

- `SOP/2-docs/4-operations/compliance/enterprise-quality-standard.md`
- `SOP/2-docs/1-architecture/decisions/011-architecture-boundary-enforcement.md`
- `SOP/2-docs/1-architecture/decisions/013-api-baseline-and-performance-budget-gates.md`
