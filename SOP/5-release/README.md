# Release — gtcx-core

Release planning, versioning policy, and release readiness for `gtcx-core`.

## Contents

| Document                                         | Description                                                   |
| ------------------------------------------------ | ------------------------------------------------------------- |
| [`versioning.md`](./versioning.md)               | Semver policy, monorepo versioning rules, tagging conventions |
| [`release-checklist.md`](./release-checklist.md) | Step-by-step release gate sequence                            |

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
