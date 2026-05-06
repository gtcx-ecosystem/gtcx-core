# Release-Candidate Evidence Pack

**Last reviewed:** 2026-05-06

Use this file to assemble real release-candidate evidence before final signoff. Do not mark an item complete from intent or configuration alone; attach the actual command output, workflow run, or artifact path.

## Required Evidence

| Gate                     | Evidence Source                                       | Artifact / Output                                                    | Status                                 |
| ------------------------ | ----------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------- |
| Dependency audit — npm   | `pnpm audit --audit-level=high`                       | Command output or CI release job log                                 | Pending release-candidate attachment   |
| Dependency audit — Rust  | `cargo audit`                                         | Command output or Rust release job log                               | Pending release-candidate attachment   |
| Secret scan              | `pnpm security:secret-scan`                           | Command output or CI/release job log                                 | Wired; local evidence can be attached  |
| SAST                     | `.github/workflows/ci.yml` CodeQL job                 | GitHub CodeQL result for the release candidate                       | Pending; requires GitHub Code Security |
| SBOM                     | `.github/workflows/ci.yml` security job               | `trivy-sbom` artifact / `trivy-sbom.cdx.json`                        | Pending release-candidate attachment   |
| Trivy vulnerability scan | `.github/workflows/ci.yml` security job               | `trivy-results.sarif` uploaded to code scanning                      | Pending release-candidate attachment   |
| API surface              | `pnpm api:check`, release workflow artifact           | `release-api-surface-report` / `quality/api-surface-report.json`     | Pending release-candidate attachment   |
| Performance budgets      | `pnpm perf:check-budgets`, release workflow artifact  | `release-performance-report` / `benchmarks/performance-report.json`  | Pending release-candidate attachment   |
| KPI metrics              | `pnpm quality:kpi:export`, release workflow artifact  | `release-quality-kpis` / `quality/kpi-metrics.json`                  | Pending release-candidate attachment   |
| Provenance               | `pnpm provenance:generate`, release workflow artifact | `release-provenance-manifest` / `artifacts/provenance-manifest.json` | Pending release-candidate attachment   |
| Heavy ZKP                | `.github/workflows/zkp-heavy.yml`                     | Latest successful workflow run within 7 days of release              | Pending release-candidate attachment   |

## Attachment Rules

1. Prefer immutable GitHub Actions run URLs or uploaded artifact names for CI-derived evidence.
2. For local evidence, record the command, date, commit SHA, and exact pass/fail outcome in `docs/release/ga-release/ga-release-evidence-log.md`.
3. Regenerate `docs/release/ga-release/ga-release-evidence-summary.md` after adding evidence.
4. Do not use this file as a substitute for external pen test, downstream validation, SOC2 evidence, ISO evidence, or final signoff.

## Repository Settings Prerequisite

The 2026-05-06 CI run confirmed Trivy and SBOM generation work, but GitHub SARIF/code scanning upload is blocked until GitHub Code Security is enabled for `gtcx-ecosystem/gtcx-core`. Until that repository setting is active, release candidates must attach the `trivy-sarif` and `trivy-sbom` workflow artifacts directly and keep SAST marked pending.
