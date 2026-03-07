# Engineering Documentation

Developer-facing documentation for `gtcx-core`.

## Contents

| Section                                            | Documents                                                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [`code-standards.md`](./code-standards.md)         | TypeScript and Rust coding rules, error handling, AI-generated code policy                     |
| [`naming-conventions.md`](./naming-conventions.md) | Files, folders, branches, commits, packages, env vars                                          |
| [`guides/`](./guides/)                             | Developer setup, build and test, code review, git workflow, AI-assisted dev, first integration |
| [`security/`](./security/)                         | Security framework, threat control matrix                                                      |
| [`testing/`](./testing/)                           | Quality standards, testing guide (patterns, coverage, Vitest)                                  |
| [`devops/`](./devops/)                             | CI/CD pipeline                                                                                 |

## Doc Stewardship

- Update docs when a public API changes, a spec changes, a CI gate changes, or a new package/crate is added.
- Weekly: verify `SOP/2-docs/2-specs/` and `SOP/2-docs/2-specs/packages/` against code changes.
- Monthly: review `SOP/2-docs/4-operations/` and threat matrix.
- Release: verify all quality checklists are current.
- PRs touching code must update affected docs.
