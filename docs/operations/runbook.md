---
title: 'Operations Runbook'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'operations']
review_cycle: 'on-change'
---

---

title: 'Runbook'
status: 'current'
date: '2026-05-17'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['docs', 'operations']
review_cycle: 'on-change'

---

# Operations Runbook

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

This is the operator entrypoint for `gtcx-core`. Use it to find the correct procedure before running gates, triaging incidents, or preparing a release.

| Need                             | Document                                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Repo prerequisite state          | [`repo-bootstrap.md`](./repo-bootstrap.md)                                                                     |
| Quality gate order and CI triage | [`../devops/runbooks/quality-runbook.md`](../devops/runbooks/quality-runbook.md)                               |
| Incident handling                | [`../devops/runbooks/incident-runbook.md`](../devops/runbooks/incident-runbook.md)                             |
| Release signoff                  | [`../devops/release-mgmt/release-checklist.md`](../devops/release-mgmt/release-checklist.md)                   |
| GA evidence pack                 | [`../release/ga-release/ga-release-evidence-summary.md`](../release/ga-release/ga-release-evidence-summary.md) |

## What This Does NOT Cover

- Contributor onboarding. See [`../agents/onboarding/orientation.md`](../agents/onboarding/orientation.md).
- Package architecture. See [`../architecture/overview.md`](../architecture/overview.md).
