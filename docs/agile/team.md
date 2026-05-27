---
id: TEAM-CORE
title: 'GTCX Core — Agile Team'
version: '1.0'
date: '2026-05-27'
status: current
owner: protocol-architect
role: protocol-architect
tier: strategic
tags:
  - agile
  - team
  - charter
review_cycle: quarterly
---

# GTCX Core — Agile Team

> **Team Charter:** Build the foundational runtime, shared libraries, Prisma data model, and cross-cutting services that all other GTCX repos depend on. Stability and backward compatibility are non-negotiable. This squad is the single owner of all work for gtcx-core — **leading** the technical direction, **managing** the backlog and sprint commitments, **documenting** architecture and decisions, **organizing** ceremonies and stakeholder communication, **verifying** quality through testing and review, and **ensuring** the highest standard of deliverables across every commit.  
> **Squad Size:** 2–3 people (target: 5)  
> **Last Updated:** 2026-05-27

## Responsibilities by Function

This squad owns the full lifecycle of work for `gtcx-core`:

| Function           | What It Means                                                                      | Primary Owner         |
| ------------------ | ---------------------------------------------------------------------------------- | --------------------- |
| **Lead**           | Technical direction for shared libraries, Prisma base schema, API contracts        | Engineering Lead      |
| **Manage**         | Backlog grooming, sprint planning, ClickUp task sync, stakeholder updates          | Product Manager       |
| **Document**       | API contracts, migration guides, shared type definitions, integration docs         | Engineering Lead + PM |
| **Organize**       | Sprint ceremonies, cross-repo dependency sync, release train coordination          | Scrum Master          |
| **Verify**         | Contract testing, backward compatibility checks, integration validation            | QA Lead               |
| **Ensure Quality** | Zero breaking changes without migration path, semver correctness, release sign-off | Whole Squad           |

## ClickUp Work Management

This squad manages all `gtcx-core` work in ClickUp. Source of truth for sprint commitments and backlog priority is git (`docs/agile/`), but ClickUp is the operational execution layer.

| Activity         | ClickUp Action                                                  | Owner                     |
| ---------------- | --------------------------------------------------------------- | ------------------------- |
| Sprint planning  | Create sprint list, assign tasks, set due dates                 | Scrum Master              |
| Daily standup    | Update task status, log blockers, move cards                    | All squad members         |
| Backlog grooming | Tag priorities, estimate effort, link to epics                  | Product Manager           |
| Task creation    | Create ClickUp tasks from sprint commitments and backlog items  | Scrum Master              |
| Status sync      | Bi-directional sync between git sprint docs and ClickUp         | Scrum Master + Automation |
| Release tracking | Mark tasks complete, update milestones, notify downstream repos | Product Manager           |

**ClickUp List ID:** TBD (set during onboarding)

## Roles & Responsibilities

### Product Manager

| Field                | Value                                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Name**             | @amanianai                                                                                                                                                                                                   |
| **Type**             | Full-time (shared)                                                                                                                                                                                           |
| **Responsibilities** | Own the backlog and roadmap for gtcx-core. Manage breaking change policy and cross-repo dependency management. Ensure ClickUp reflects current priorities. Document versioning strategy and migration paths. |
| **Accountable For**  | Sprint completion rate, zero breaking changes without migration path, dependency graph health, ClickUp list hygiene                                                                                          |
| **Current Status**   | 🟢 Staffed                                                                                                                                                                                                   |

### Scrum Master / Agile Lead

| Field                | Value                                                                                                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | @amanianai (acting)                                                                                                                                                                                  |
| **Type**             | Agent-assisted                                                                                                                                                                                       |
| **Responsibilities** | Facilitate all ceremonies. Manage ClickUp task creation and status sync. Coordinate cross-repo dependency updates. Manage release train and downstream migration timeline. Document sprint outcomes. |
| **Accountable For**  | Sprint health, blocker resolution time, team velocity, ClickUp completeness, downstream migration lag                                                                                                |
| **Current Status**   | 🟡 Recruiting                                                                                                                                                                                        |

### Engineering Lead — Runtime

| Field                | Value                                                                                                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | @amanianai                                                                                                                                                                                                                |
| **Type**             | Full-time                                                                                                                                                                                                                 |
| **Responsibilities** | Lead technical direction for core library design, shared utilities, Prisma base schema, and cross-repo interfaces. Document API contracts and design patterns. Organize technical reviews. Verify backward compatibility. |
| **Accountable For**  | System reliability, technical debt, code review throughput, runtime stability, API contract compliance                                                                                                                    |
| **Current Status**   | 🟢 Staffed                                                                                                                                                                                                                |

### Engineering Lead — Data Model

| Field                | Value                                                                                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | TBD                                                                                                                                                                                      |
| **Type**             | —                                                                                                                                                                                        |
| **Responsibilities** | Lead Prisma schema evolution and migration strategy. Document data model governance and multi-tenancy patterns. Organize schema review ceremonies. Verify migration rollback capability. |
| **Accountable For**  | Schema consistency across all repos, migration rollback capability, data integrity, semver correctness                                                                                   |
| **Current Status**   | 🔴 Vacant — PM covering                                                                                                                                                                  |

### QA / Quality Lead

| Field                | Value                                                                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | @amanianai (acting)                                                                                                                                                                             |
| **Type**             | Agent-assisted                                                                                                                                                                                  |
| **Responsibilities** | Define test strategy for shared libraries. Verify all releases through contract testing and backward compatibility checks. Document test plans and coverage. Ensure no breaking changes escape. |
| **Accountable For**  | Test coverage for all public APIs, backward compatibility verification, defect escape rate, release confidence                                                                                  |
| **Current Status**   | 🟡 Recruiting                                                                                                                                                                                   |

### DevOps / Platform Engineer

| Field                | Value                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | @amanianai (acting)                                                                                                                                           |
| **Type**             | Shared resource                                                                                                                                               |
| **Responsibilities** | Manage package publishing pipeline and monorepo tooling. Organize core release train. Verify downstream repo update notifications. Document CI/CD procedures. |
| **Accountable For**  | Publish success rate, downstream repo update notifications, deployment frequency, runbook coverage                                                            |
| **Current Status**   | 🟣 Shared                                                                                                                                                     |

### Security / Compliance Officer

| Field                | Value                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | @amanianai (acting)                                                                                                                   |
| **Type**             | Shared resource                                                                                                                       |
| **Responsibilities** | Manage base schema security review. Verify PII handling in shared models. Document audit trail primitives. Organize security reviews. |
| **Accountable For**  | No PII leakage in shared types, audit primitives available to all repos, compliance gap closure                                       |
| **Current Status**   | 🟣 Shared                                                                                                                             |

---

## RACI Matrix

| Activity                     | PM    | SM    | Eng Runtime | Eng Data | QA    | DevOps | Security |
| ---------------------------- | ----- | ----- | ----------- | -------- | ----- | ------ | -------- |
| **Lead** technical direction | C     | I     | **A**       | **A**    | C     | I      | I        |
| **Manage** backlog & ClickUp | **A** | **R** | C           | C        | I     | I      | I        |
| **Document** architecture    | C     | I     | **A**       | **A**    | I     | C      | I        |
| **Organize** ceremonies      | C     | **A** | C           | C        | C     | I      | I        |
| **Verify** code quality      | I     | C     | C           | C        | **A** | I      | C        |
| **Ensure** release quality   | C     | C     | C           | C        | C     | **A**  | C        |
| Sprint planning              | **A** | **R** | C           | C        | C     | I      | I        |
| Daily standup                | C     | **A** | C           | C        | C     | I      | I        |
| Code review                  | I     | I     | **A**       | **A**    | C     | I      | C        |
| Test strategy                | C     | C     | C           | C        | **A** | I      | C        |
| Deployment                   | I     | I     | C           | C        | C     | **A**  | C        |
| Incident response            | C     | C     | **A**       | **A**    | C     | **A**  | C        |
| Stakeholder demo             | **A** | C     | C           | C        | C     | I      | I        |

---

## Team Health

| Metric                      | Target     | Current   | Trend |
| --------------------------- | ---------- | --------- | ----- |
| Shared libraries published  | 5+         | 3         | ↗️    |
| Prisma models downstream    | All repos  | 3 repos   | ↗️    |
| Breaking changes (last 90d) | 0          | 2         | ➡️    |
| Downstream migration lag    | < 1 sprint | 2 sprints | ↘️    |
| Test coverage               | > 80%      | 45%       | ↗️    |
| ClickUp task sync accuracy  | > 95%      | —         | —     |
| Documentation coverage      | > 80%      | 50%       | ↗️    |

---

## Communication

| Channel          | Purpose                                        | Cadence            |
| ---------------- | ---------------------------------------------- | ------------------ |
| Daily standup    | Blockers, progress, plans, ClickUp updates     | Daily 09:00 UTC    |
| Sprint planning  | Commitments, estimation, ClickUp tasking       | Bi-weekly Monday   |
| Sprint review    | Demo, stakeholder feedback                     | Bi-weekly Thursday |
| Retrospective    | Process improvement, quality reflection        | Bi-weekly Friday   |
| Slack #gtcx-core | Async updates, alerts                          | Continuous         |
| ClickUp          | Task tracking, status updates, blocker logging | Continuous         |

---

## Hiring Priority

| Priority | Role                | When    | Why                                                                            |
| -------- | ------------------- | ------- | ------------------------------------------------------------------------------ |
| P1       | Data Model Engineer | Q2 2026 | Prisma schema governance needs dedicated owner; ClickUp management needs owner |
| P1       | QA Engineer         | Q3 2026 | Contract testing and backward compatibility                                    |
| P2       | DevOps Engineer     | Q3 2026 | Core release train needs dedicated automation                                  |
| P3       | Security Engineer   | Q4 2026 | Security review for shared authentication models                               |
