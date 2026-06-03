---
title: 'Monitoring'
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

# Monitoring

Observability, alerting, SLO definitions, and dashboard standards.

## Contents

| File                                       | Description                                                                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| [monitoring-setup.md](monitoring-setup.md) | Observability strategy, required metrics (RED/USE), SLO definitions, alerting rules, logging standards, dashboard conventions |

## What belongs here

- Observability strategy and tooling
- Alerting rules and escalation policies
- SLO/SLA definitions and error budget tracking
- Dashboard standards and required metrics
- Log retention and structured logging standards

## What does NOT belong here

- CI/CD pipeline configuration (→ `3-ci-cd-pipelines/`)
- Incident response runbooks (→ `2-runbooks/`)
- Analytics and usage tracking (→ `5-analytics/`)
