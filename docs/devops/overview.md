---
title: "DevOps Overview"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "devops"]
review_cycle: "on-change"
---

---
title: 'Overview'
status: 'current'
date: '2026-05-17'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['docs', 'operations']
review_cycle: 'on-change'
---

# DevOps Overview

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

`docs/devops/` holds the engineering operations details that support this library repo: CI/CD, release management, monitoring, QA, and environment-specific guidance.

| Area                               | Purpose                              |
| ---------------------------------- | ------------------------------------ |
| [`ci-cd/`](./ci-cd/)               | Pipeline design and gate sequencing  |
| [`runbooks/`](./runbooks/)         | Quality and incident procedures      |
| [`release-mgmt/`](./release-mgmt/) | Release and signoff artifacts        |
| [`monitoring/`](./monitoring/)     | Telemetry and observability setup    |
| [`qa/`](./qa/)                     | QA process and evidence expectations |

## What This Does NOT Cover

- Operator entrypoint. See [`../operations/runbook.md`](../operations/runbook.md).
- Repo onboarding. See [`../agents/onboarding/orientation.md`](../agents/onboarding/orientation.md).
