---
title: 'Runbooks'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'devops']
review_cycle: 'on-change'
---

# Runbooks

Incident response, escalation procedures, and on-call rotation.

## Contents

| File                                       | Description                                                           |
| ------------------------------------------ | --------------------------------------------------------------------- |
| [incident-runbook.md](incident-runbook.md) | Incident classification, response playbooks, escalation, post-mortem  |
| [quality-runbook.md](quality-runbook.md)   | Quality gate sequence, failure triage, and release evidence artifacts |

## What belongs here

- Incident response playbooks
- Escalation procedures
- On-call rotation schedules
- Service recovery procedures
- Post-mortem templates

## What does NOT belong here

- Monitoring architecture → `01-docs/devops/monitoring/`
- Deployment automation → `01-docs/devops/release-mgmt/`
