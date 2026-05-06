# Release

Release governance for `gtcx-core` — semver decisions, evidence artifacts, downstream readiness, and compliance-adjacent packaging records.

## Structure

| File / Folder                                                                                  | Purpose                                                               |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [ga-release/](./ga-release/)                                                                   | Release status, evidence summaries, and GA checklists                 |
| [versioning/](./versioning/)                                                                   | Semver and API change policy                                          |
| [licenses/](./licenses/)                                                                       | Dependency license compliance records                                 |
| [supportability-policy.md](./supportability-policy.md)                                         | Runtime matrix, native crypto expectations, advisories, support scope |
| [downstream-production-readiness-checklist.md](./downstream-production-readiness-checklist.md) | Consumer-side production validation checklist                         |
| [downstream-validation-report-template.md](./downstream-validation-report-template.md)         | Template for consumer validation evidence                             |
| [enterprise-release-artifact-pack.md](./enterprise-release-artifact-pack.md)                   | Standard release evidence pack for enterprise review                  |
| [external-validation-findings-log.md](./external-validation-findings-log.md)                   | External security review or pen-test findings log                     |
| [final-signoff-artifact-template.md](./final-signoff-artifact-template.md)                     | Final human signoff record                                            |
| [api-change-migration-policy.md](./api-change-migration-policy.md)                             | Expectations for additive and breaking API changes                    |

## Key Process Docs

- Release workflow: [../deployment/deployment.md](../deployment/deployment.md)
- Release checklist: [../devops/release-mgmt/release-checklist.md](../devops/release-mgmt/release-checklist.md)
- CI gates: [../devops/ci-cd/ci-cd.md](../devops/ci-cd/ci-cd.md)
- ADRs: [../decisions/](../decisions/)
