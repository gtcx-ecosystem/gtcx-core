---
id: TEAM-CORE
title: 'GTCX Core — Agile Team'
version: '1.0'
effective_date: '2026-05-27'
owner: 'core@gtcx.io'
---

# GTCX Core — Agile Team

> **Team Charter:** Build the foundational runtime, shared libraries, Prisma data model, and cross-cutting services that all other GTCX repos depend on. Stability and backward compatibility are non-negotiable.  
> **Squad Size:** 2–3 people (target: 5)  
> **Last Updated:** 2026-05-27

## Roles & Responsibilities

### Product Manager

| Field                | Value                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| **Name**             | @amanianai                                                                                          |
| **Type**             | Full-time (shared)                                                                                  |
| **Responsibilities** | Core runtime roadmap, breaking change policy, cross-repo dependency management, versioning strategy |
| **Accountable For**  | Zero breaking changes without migration path, dependency graph health                               |
| **Current Status**   | 🟢 Staffed                                                                                          |

### Scrum Master / Agile Lead

| Field                | Value                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Name**             | @amanianai (acting)                                                                      |
| **Type**             | Agent-assisted                                                                           |
| **Responsibilities** | Coordinate cross-repo dependency updates, manage release train, block downstream impacts |
| **Accountable For**  | Release cadence, downstream migration timeline                                           |
| **Current Status**   | 🟡 Recruiting                                                                            |

### Engineering Lead — Runtime

| Field                | Value                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| **Name**             | @amanianai                                                                                      |
| **Type**             | Full-time                                                                                       |
| **Responsibilities** | Core library design, shared utilities, Prisma base schema, cross-repo interfaces, API contracts |
| **Accountable For**  | Runtime stability, API contract compliance, semver correctness                                  |
| **Current Status**   | 🟢 Staffed                                                                                      |

### Engineering Lead — Data Model

| Field                | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Name**             | TBD                                                                                |
| **Type**             | —                                                                                  |
| **Responsibilities** | Prisma schema evolution, migration strategy, data model governance, multi-tenancy  |
| **Accountable For**  | Schema consistency across all repos, migration rollback capability, data integrity |
| **Current Status**   | 🔴 Vacant — PM covering                                                            |

### QA / Quality Lead

| Field                | Value                                                                               |
| -------------------- | ----------------------------------------------------------------------------------- |
| **Name**             | @amanianai (acting)                                                                 |
| **Type**             | Agent-assisted                                                                      |
| **Responsibilities** | Integration tests for shared libraries, contract testing, breaking change detection |
| **Accountable For**  | Test coverage for all public APIs, backward compatibility verification              |
| **Current Status**   | 🟡 Recruiting                                                                       |

### DevOps / Platform Engineer

| Field                | Value                                                                  |
| -------------------- | ---------------------------------------------------------------------- |
| **Name**             | @amanianai (acting)                                                    |
| **Type**             | Shared resource                                                        |
| **Responsibilities** | Package publishing pipeline, monorepo tooling, CI/CD for core releases |
| **Accountable For**  | Publish success rate, downstream repo update notifications             |
| **Current Status**   | 🟣 Shared                                                              |

### Security / Compliance Officer

| Field                | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Name**             | @amanianai (acting)                                                                |
| **Type**             | Shared resource                                                                    |
| **Responsibilities** | Base schema security review, PII handling in shared models, audit trail primitives |
| **Accountable For**  | No PII leakage in shared types, audit primitives available to all repos            |
| **Current Status**   | 🟣 Shared                                                                          |

---

## Team Health

| Metric                      | Target     | Current   | Trend |
| --------------------------- | ---------- | --------- | ----- |
| Shared libraries published  | 5+         | 3         | ↗️    |
| Prisma models downstream    | All repos  | 3 repos   | ↗️    |
| Breaking changes (last 90d) | 0          | 2         | ➡️    |
| Downstream migration lag    | < 1 sprint | 2 sprints | ↘️    |
| Test coverage               | > 80%      | 45%       | ↗️    |

---

## Hiring Priority

| Priority | Role                | When    | Why                                              |
| -------- | ------------------- | ------- | ------------------------------------------------ |
| P1       | Data Model Engineer | Q2 2026 | Prisma schema governance needs dedicated owner   |
| P1       | QA Engineer         | Q3 2026 | Contract testing and backward compatibility      |
| P2       | DevOps Engineer     | Q3 2026 | Core release train needs dedicated automation    |
| P3       | Security Engineer   | Q4 2026 | Security review for shared authentication models |
