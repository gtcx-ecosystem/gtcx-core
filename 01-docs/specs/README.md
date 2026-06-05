---
title: 'Backend Specs'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'specs']
review_cycle: 'on-change'
---

# Backend Specs

Backend architecture specifications and implementation standards.

## Contents

| File                                                                 | Description                                                                    |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [`backend-architecture.md`](../architecture/backend-architecture.md) | Runtime, framework, project structure, middleware stack, and database patterns |

## What belongs here

- Backend architecture decisions for a specific product
- Runtime and framework choices
- Project structure and folder conventions
- Middleware stack and request lifecycle
- Database access patterns and caching strategy
- Background jobs and error handling standards

## What does NOT belong here

- API design contracts (→ `4-engineering/2-system-design/`)
- Infrastructure and deployment (→ `5-devops/`)
- Frontend implementation (→ `3-frontend/`)
- Test strategy (→ `6-testing/`)
