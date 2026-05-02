# Release

Package release process for `gtcx-core` — npm publishing, versioning, and compliance.

## Structure

| Folder                               | Purpose                                                           |
| ------------------------------------ | ----------------------------------------------------------------- |
| [1-ga-release/](1-ga-release/)       | Active release records — which packages published, what gates ran |
| [2-alpha-testing/](2-alpha-testing/) | N/A — packages use semantic versioning, not alpha cohort programs |
| [3-legal/](3-legal/)                 | Export control and IP review for crypto distribution              |
| [4-licenses/](4-licenses/)           | Dependency license audit — per-release compliance records         |
| [5-versioning/](5-versioning/)       | Semver policy, Changesets workflow, pre-release naming            |

## Key Process Docs

- Release workflow: `docs/deployment/deployment.md`
- Release checklist: `docs/devops/release-mgmt/release-checklist.md`
- CI gates: `docs/devops/ci-cd/ci-cd.md`
- ADRs: `docs/decisions/`
