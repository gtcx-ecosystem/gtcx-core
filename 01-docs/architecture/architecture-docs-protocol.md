---
title: 'Protocol: Architecture Documentation'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'architecture']
review_cycle: 'on-change'
---

---

title: 'Architecture Docs Protocol'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'

---

# Protocol: Architecture Documentation

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

## Version

1.0

## Summary

Defines the minimum architecture documentation required for any system or service.

## Required Documents

| Document                | Required When                      | Location                            |
| ----------------------- | ---------------------------------- | ----------------------------------- |
| System design           | Any multi-component system         | `01-docs/architecture/`             |
| ADR                     | Any significant technical decision | `01-docs/architecture/decisions/`   |
| Data model              | Persistent data is introduced      | `01-docs/architecture/data-models/` |
| Deployment architecture | First production deployment        | `01-docs/architecture/deployment/`  |
| Monitoring              | Production monitoring is enabled   | `01-docs/architecture/monitoring/`  |

## ADR Rules

- One ADR per decision
- ADRs are immutable once accepted
- Supersede with a new ADR, do not edit old ADRs

## Quality Bar

- Diagrams reflect actual system boundaries
- Decisions include alternatives and trade-offs
- Security and reliability assumptions are explicit

## Reference

- [ADR Template](../decisions/adr-template.md)
- [System Architecture Spec Template](./system-architecture-spec.md)

## Metadata

- **Owner**: Architecture Lead
- **Effective Date**: [YYYY-MM-DD]
- **Last Reviewed**: [YYYY-MM-DD]
- **Next Review**: [YYYY-MM-DD]
