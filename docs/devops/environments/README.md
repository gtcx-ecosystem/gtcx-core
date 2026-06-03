---
title: 'Environments'
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

# Environments

Environment topology, configuration profiles, and secrets management.

## Contents

| File                                           | Description                                                                      |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| [environment-config.md](environment-config.md) | Environment topology, configuration profiles, secrets management, access control |

## What belongs here

- Environment definitions (development, staging, production)
- Infrastructure topology diagrams
- Configuration profiles per environment
- Secrets management approach and tooling
- Environment-specific feature flag defaults
- Access control per environment

## What does NOT belong here

- CI/CD pipeline configuration (→ `3-ci-cd-pipelines/`)
- Deployment runbooks (→ `2-runbooks/`)
- Monitoring setup (→ `6-monitoring/`)
