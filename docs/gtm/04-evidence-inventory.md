# Evidence Inventory — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Every piece of machine-generated and human-authored evidence, with location and freshness.**

---

## Machine-Generated Evidence (Reproducible)

Run any of these commands to regenerate fresh evidence:

| Evidence                | Command                                   | Artifact                                                 | Last Generated |
| ----------------------- | ----------------------------------------- | -------------------------------------------------------- | -------------- |
| Architecture boundaries | `pnpm architecture:check`                 | stdout (21 packages, 0 violations)                       | 2026-05-08     |
| Lint                    | `pnpm lint`                               | stdout (39/39 pass)                                      | 2026-05-08     |
| Typecheck               | `pnpm typecheck`                          | stdout (39/39 pass)                                      | 2026-05-08     |
| Test suite              | `pnpm test`                               | stdout (45/45 pass)                                      | 2026-05-08     |
| Critical coverage       | `pnpm test:coverage:critical`             | stdout (5 packages, all above threshold)                 | 2026-05-08     |
| Build                   | `pnpm build`                              | stdout (22/22 pass)                                      | 2026-05-08     |
| API surface             | `pnpm api:check`                          | `quality/api-surface-report.json`                        | 2026-05-08     |
| Dependency audit (npm)  | `pnpm audit --audit-level=high`           | stdout (0 vulnerabilities)                               | 2026-05-08     |
| Secret scan             | `pnpm security:secret-scan`               | stdout (774 files, 0 findings)                           | 2026-05-08     |
| Threat matrix           | `pnpm security:threat-matrix`             | stdout (12 controls, 12 evidence refs)                   | 2026-05-08     |
| Performance budgets     | `pnpm perf:check-budgets`                 | `benchmarks/performance-report.json`                     | 2026-05-08     |
| KPI metrics             | `pnpm quality:kpi:export`                 | `quality/kpi-metrics.json`                               | 2026-05-08     |
| Provenance manifest     | `pnpm provenance:generate`                | `artifacts/provenance-manifest.json`                     | 2026-05-08     |
| GA evidence summary     | `pnpm release:ga:evidence:check`          | `docs/release/ga-release/ga-release-evidence-summary.md` | 2026-05-08     |
| Rust fmt                | `cargo fmt --all -- --check`              | stdout                                                   | CI             |
| Rust clippy             | `cargo clippy --workspace -- -D warnings` | stdout                                                   | CI             |
| Rust unsafe check       | grep `deny(unsafe_code)` per crate        | stdout                                                   | CI             |
| Cargo audit             | `cargo audit`                             | stdout                                                   | CI             |
| Cargo deny              | `cargo deny check`                        | stdout                                                   | CI             |
| SBOM                    | Trivy filesystem scan                     | `trivy-sbom.cdx.json` (CI artifact)                      | CI             |
| CodeQL                  | GitHub code scanning                      | SARIF (GitHub Security tab)                              | CI             |

## Stored Artifacts

| Artifact             | Path                                     | Description                                       |
| -------------------- | ---------------------------------------- | ------------------------------------------------- |
| API surface baseline | `quality/api-surface-baseline.json`      | SHA-256 hashes of all public exports              |
| API surface report   | `quality/api-surface-report.json`        | Drift analysis against baseline                   |
| KPI metrics          | `quality/kpi-metrics.json`               | Coverage, test stats, quality indicators          |
| Package risk tiers   | `quality/package-risk-tiers.json`        | 4-tier risk stratification with gate requirements |
| Release evidence     | `quality/release-2026-05-06-evidence.md` | Human-readable gate summary                       |
| Performance budgets  | `benchmarks/performance-budgets.json`    | 14 metric budgets with regression tolerance       |
| Performance results  | `benchmarks/latest-results.json`         | Most recent benchmark run                         |
| Performance history  | `benchmarks/history.json`                | Historical trend data                             |
| Performance report   | `benchmarks/performance-report.json`     | Budget pass/fail with trend analysis              |
| Provenance manifest  | `artifacts/provenance-manifest.json`     | Build provenance with SHA-256 integrity hashes    |

## Security Documents

| Document                     | Path                                              | Purpose                                          |
| ---------------------------- | ------------------------------------------------- | ------------------------------------------------ |
| Threat model                 | `docs/security/threat-model.md`                   | STRIDE analysis, attack scenarios, risk heat map |
| Attack tree                  | `docs/security/attack-tree-signing.md`            | Signature forgery paths with mitigations         |
| Threat control matrix        | `docs/security/threat-control-matrix.md`          | 12 controls mapped to packages                   |
| Internal security assessment | `docs/security/internal-security-assessment.md`   | Formal assessment (pen test equivalent)          |
| Key ceremony                 | `docs/security/key-ceremony.md`                   | NIST SP 800-57 key lifecycle procedures          |
| FIPS validation boundary     | `docs/security/fips-validation-boundary.md`       | Inherited FIPS 140-3 boundary with CMVP certs    |
| FIPS assessment              | `docs/security/fips-assessment.md`                | Detailed technical FIPS analysis                 |
| Security framework           | `docs/security/security-framework.md`             | Security architecture overview                   |
| Security policy              | `docs/security/security-policy.md`                | Responsible disclosure, SLAs                     |
| NIST 800-53 mapping          | `docs/security/nist-800-53-mapping.md`            | Control family alignment                         |
| Defense readiness            | `docs/security/defense-readiness.md`              | Operational security posture                     |
| CodeQL tuning                | `docs/security/codeql-tuning.md`                  | SAST configuration rationale                     |
| Native binding audit         | `docs/security/native-binding-audit-checklist.md` | NAPI-RS safety checklist                         |

## Compliance Documents

| Document                  | Path                                           | Purpose                                   |
| ------------------------- | ---------------------------------------------- | ----------------------------------------- |
| Compliance requirements   | `docs/compliance/compliance-requirements.md`   | ISO 27001, SOC 2, GDPR, Basel III         |
| GDPR assessment           | `docs/compliance/gdpr-assessment.md`           | Zero-PII determination, DPIA not required |
| PCI-DSS scope             | `docs/compliance/pci-dss-scope.md`             | Formal zero-scope declaration             |
| SOX controls              | `docs/compliance/sox-controls.md`              | ITGC mapping to CI gates                  |
| SOC 2 evidence pipeline   | `docs/compliance/soc2-evidence-pipeline.md`    | Evidence collection workflow              |
| Spec-to-code traceability | `docs/compliance/spec-to-code-traceability.md` | Requirements traceability matrix          |

## Release & Operations

| Document                     | Path                                                 | Purpose                                |
| ---------------------------- | ---------------------------------------------------- | -------------------------------------- |
| Release checklist            | `docs/devops/release-mgmt/release-checklist.md`      | 26 mandatory pre-release checks        |
| Quality runbook              | `docs/devops/runbooks/quality-runbook.md`            | CI triage order and gate sequence      |
| Incident runbook             | `docs/devops/runbooks/incident-runbook.md`           | Incident response procedures           |
| Test plan                    | `docs/testing/test-plan.md`                          | Test strategy and critical paths       |
| Quality standards            | `docs/testing/quality-standards.md`                  | Mandatory CI gates and PR requirements |
| GA release status            | `docs/release/ga-release/ga-release-status.md`       | Current 7.8/10 → 10/10 tracker         |
| Production readiness roadmap | `docs/release/production-readiness-10-10-roadmap.md` | Sprint plan to 10/10                   |
| Remediation roadmap          | `docs/audit/remediation-2026-05-11.md`               | Phase A-F remediation plan             |
| Versioning policy            | `docs/release/versioning/versioning-policy.md`       | Semver enforcement rules               |
| License compliance           | `docs/release/licenses/license-compliance.md`        | OSS license audit                      |
