---
title: "DevOps"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "devops"]
review_cycle: "on-change"
---

# DevOps

Environment configuration, deployment runbooks, CI/CD pipelines, QA processes, analytics, monitoring, and release management.

## Contents

| Path                             | Description                                                      |
| -------------------------------- | ---------------------------------------------------------------- |
| [`environments/`](environments/) | Environment topology, configuration profiles, secrets management |
| [`runbooks/`](runbooks/)         | Incident response, escalation procedures, on-call rotation       |
| [`ci-cd/`](ci-cd/)               | Pipeline configuration, deployment workflows, build standards    |
| [`qa/`](qa/)                     | QA processes, test coverage requirements, sign-off gates         |
| [`analytics/`](analytics/)       | Platform analytics, usage tracking, KPI instrumentation          |
| [`monitoring/`](monitoring/)     | Observability, alerting, SLOs, dashboards                        |
| [`release-mgmt/`](release-mgmt/) | Release process, changelog, legal sign-off, rollback procedures  |

## What belongs here

- Environment configuration and infrastructure topology
- Deployment and incident response runbooks
- CI/CD pipeline definitions and standards
- QA gates, testing requirements, and coverage targets
- Product analytics and usage tracking setup
- Monitoring, alerting, and SLO definitions
- Release process and changelog management

## What does NOT belong here

- System architecture (see `docs/architecture/`)
- Security architecture (see `docs/security/`)
- Technology stack decisions (see `docs/stack/`)
- Compliance standards (see `docs/compliance/`)
