# Engineering Documentation

Developer-facing documentation for `gtcx-core`.

## Contents

| Section                  | Documents                                                                |
| ------------------------ | ------------------------------------------------------------------------ |
| [guides/](./guides/)     | Developer setup, build and test, first integration, validator deployment |
| [security/](./security/) | Security framework, threat control matrix                                |
| [testing/](./testing/)   | Quality standards                                                        |
| [devops/](./devops/)     | CI/CD pipeline                                                           |

## Doc Stewardship

- Update docs when a public API changes, a spec changes, a CI gate changes, or a new package/crate is added.
- Weekly: verify `SOP/2-docs/2-specs/` and `SOP/2-docs/2-specs/packages/` against code changes.
- Monthly: review `SOP/2-docs/4-operations/` and threat matrix.
- Release: verify all quality checklists are current.
- PRs touching code must update affected docs.
