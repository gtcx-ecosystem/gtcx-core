---
title: 'Testing'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'testing']
review_cycle: 'on-change'
---

# Testing

QA strategy, test coverage requirements, and testing frameworks.

## Contents

| File                         | Description                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| [test-plan.md](test-plan.md) | Test pyramid, test cases, critical user flows, performance targets, defect management, release gate |

## What belongs here

- **Testing strategy** — Unit, integration, and end-to-end testing philosophy and scope
- **Coverage requirements** — Minimum thresholds, reporting tools, and enforcement policies
- **Framework conventions** — Vitest, Playwright, and other framework-specific patterns and setup
- **Test data management** — Fixtures, factories, seed scripts, and environment isolation
- **QA checklists** — Pre-release verification steps, regression testing, and sign-off criteria

## What does NOT belong here

- **Product acceptance criteria** — User stories, feature requirements, and definition of done. See `../1-product/`.
- **Compliance audits** — Regulatory testing, certification evidence, and audit trails. See `../../4-engineering/5-compliance/`.
