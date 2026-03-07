# Release — gtcx-core

Release content for `gtcx-core` lives in the SOP. This folder is a navigational entry point.

## Where to Find Release Content

| Topic             | Location                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| Versioning policy | [`SOP/2-docs/3-engineering/guides/git-workflow.md`](../2-docs/3-engineering/guides/git-workflow.md)                 |
| Release checklist | [`SOP/2-docs/4-operations/compliance/release-checklist.md`](../2-docs/4-operations/compliance/release-checklist.md) |
| Cut release task  | [`SOP/1-agents/tasks/cut-release.md`](../1-agents/tasks/cut-release.md)                                             |
| Quality runbook   | [`SOP/2-docs/4-operations/runbooks/quality-runbook.md`](../2-docs/4-operations/runbooks/quality-runbook.md)         |

## Release Gate Summary

Before any release, all of the following must pass:

```bash
pnpm architecture:check
pnpm api:check
pnpm perf:check-budgets
pnpm test
pnpm build
```

Full sequence: [`../2-docs/4-operations/runbooks/quality-runbook.md`](../2-docs/4-operations/runbooks/quality-runbook.md)

## References

- `SOP/1-agents/tasks/cut-release.md`
- `SOP/2-docs/4-operations/compliance/release-checklist.md`
