---
title: 'Technology Stack'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'stack']
review_cycle: 'on-change'
---

# Technology Stack

Templates for documenting technology choices and baseline standards.

## Contents

| File                                                               | Description                                                                |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| [tech-stack.md](tech-stack.md)                                     | Full stack overview — backend, frontend, AI/ML, infrastructure, and DevOps |
| [dependency-boundaries.md](dependency-boundaries.md)               | Approved dependency sources, prohibited packages, and review rules         |
| [versioning-policy.md](../release/versioning/versioning-policy.md) | Version pinning and upgrade standards                                      |

## What belongs here

- Technology stack decisions and rationale
- Approved and prohibited dependency sources
- Version pinning and upgrade cadence policies
- Package manager and build tooling standards

## What does NOT belong here

- Deployment configuration (→ `../devops/release-mgmt/`)
- Per-service specs (→ `6-specs/`)
- Architecture decisions (→ `6-decisions/`)
