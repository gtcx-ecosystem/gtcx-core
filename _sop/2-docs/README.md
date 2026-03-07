# \_sop/2-docs — Documentation

Engineering docs, devops runbooks, package specs, and architecture for `gtcx-core`.

---

## Contents

| Folder                                      | Purpose                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| [`3-engineering/`](3-engineering/README.md) | System design, tech stack, compliance, ADRs, security                    |
| [`4-devops/`](4-devops/README.md)           | CI/CD, environments, runbooks, QA, monitoring, release management        |
| [`5-specs/`](5-specs/README.md)             | Package specs (all 18 TS packages + 6 Rust crates), backend architecture |

## Key Paths

| Need                   | Location                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| Architecture decisions | [`3-engineering/6-decisions/`](3-engineering/6-decisions/README.md)                            |
| System architecture    | [`3-engineering/2-system-design/overview.md`](3-engineering/2-system-design/overview.md)       |
| Security framework     | [`3-engineering/7-security/`](3-engineering/7-security/README.md)                              |
| Package specs          | [`5-specs/4-backend/packages/`](5-specs/4-backend/packages/README.md)                          |
| Rust crate specs       | [`5-specs/4-backend/packages/rust/`](5-specs/4-backend/packages/rust/)                         |
| Quality runbook        | [`4-devops/2-runbooks/quality-runbook.md`](4-devops/2-runbooks/quality-runbook.md)             |
| Release checklist      | [`4-devops/7-release-mgmt/release-checklist.md`](4-devops/7-release-mgmt/release-checklist.md) |

## What Does NOT Belong Here

- `1-product/` and `2-company/` content — `gtcx-core` has no product surface, no brand, no customers
- Session notes — those live in `_sop/4-sessions/`
- Release artifacts — those live in `_sop/5-release/`
