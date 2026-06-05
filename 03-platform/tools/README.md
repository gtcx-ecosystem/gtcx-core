# Tools

Quality and automation scripts for the gtcx-core workspace.

| Script                             | Purpose                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `capture-benchmark-results.mjs`    | Captures Criterion benchmark results from Rust targets and writes them to `benchmarks/latest-results.json`          |
| `check-api-surface.mjs`            | Detects API surface changes across packages, compares against a baseline, and optionally enforces semver compliance |
| `check-governance.mjs`             | Validates repository governance requirements (CODEOWNERS, CI workflows, required files)                             |
| `check-markdown-links.mjs`         | Scans tracked markdown files for broken internal links                                                              |
| `check-package-boundaries.mjs`     | Enforces inter-package import restrictions to maintain the dependency graph                                         |
| `check-performance-budgets.mjs`    | Validates latest benchmark results against defined performance budgets and trend regressions                        |
| `check-secrets.mjs`                | Scans tracked text files for high-confidence committed secret patterns                                              |
| `check-threat-matrix.mjs`          | Parses the threat-control matrix doc and validates that all threat entries have required fields                     |
| `collect-kpi-history.mjs`          | Fetches CI workflow run history and issue metrics from GitHub for KPI tracking                                      |
| `export-quality-kpis.mjs`          | Aggregates quality KPIs (test coverage, benchmarks, remediation, provenance) into a single report                   |
| `generate-ga-evidence-summary.mjs` | Regenerates or checks `01-docs/release/ga-release/ga-release-evidence-summary.md` from the GA evidence log          |
| `generate-provenance-manifest.mjs` | Generates SHA-256 provenance manifest for critical build artifacts                                                  |
| `network-mesh-demo.mjs`            | Demonstrates the `@gtcx/network` mesh networking package with peer discovery and messaging                          |
| `update-benchmark-history.mjs`     | Appends latest benchmark results to the rolling history file                                                        |
| `verify-branch-protection.sh`      | Verifies GitHub branch protection rules via the `gh` CLI                                                            |
| `uat/zkp-uat.mjs`                  | User acceptance test for ZKP engine and unified compliance service integration                                      |
