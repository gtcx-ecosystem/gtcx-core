---
title: "Release Management"
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

# Release Management

Release process, changelog, legal sign-off, and rollback procedures.

## Contents

| Path                             | Description                                        |
| -------------------------------- | -------------------------------------------------- |
| [`legal/`](legal/)               | Legal review and sign-off requirements per release |
| [`publishing.md`](publishing.md) | Package publishing to npm and Cargo registries     |

## What belongs here

- Release process and checklist
- Changelog standards and format
- Legal, compliance, and security sign-off gates
- Rollback procedures and criteria
- Release notes templates
- Version numbering conventions

## What does NOT belong here

- CI/CD pipeline configuration (→ `3-ci-cd-pipelines/`)
- QA sign-off criteria (→ `4-quality-assurance/`)
- Incident response after release (→ `2-runbooks/`)
