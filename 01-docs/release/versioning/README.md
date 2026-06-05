---
title: 'Release Versioning'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'release']
review_cycle: 'on-change'
---

# Release Versioning

Versioning policy for `@gtcx/*` packages — how breaking, additive, and patch changes map to npm semver releases, and how the `changesets` workflow enforces the policy at PR time.

| File                                             | Purpose                                                                                                        |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| [`versioning-policy.md`](./versioning-policy.md) | Canonical semver discipline for the 21 published packages, linked-group rules, time-bound sign-off conventions |

**Audience:** every PR author touching package source; downstream consumers planning version pins; release engineers running `pnpm release`.

Operational counterparts: [`01-docs/release/api-change-migration-policy.md`](../api-change-migration-policy.md) for migration guidance and [`01-docs/devops/release-mgmt/npm-publish-runbook.md`](../../devops/release-mgmt/npm-publish-runbook.md) for execution.
