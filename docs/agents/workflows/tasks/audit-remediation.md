---
title: 'Task Playbook: Audit Remediation'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'agents']
review_cycle: 'on-change'
---

---

title: 'Audit Remediation'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'

---

# Task Playbook: Audit Remediation

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Owner:** Quality & Evidence Lead + affected package owner  
**Safety tier:** Autonomous investigation / approval depends on touched tier

---

## When to Run This

Run when closing findings from internal audits, security reviews, QA review, or release-readiness reviews.

---

## Workflow

1. State the finding as a concrete invariant or failure mode.
2. Confirm whether the issue is code, docs, evidence, or external-validation scope.
3. Fix code and tests first if the issue is behavioral.
4. Update architecture/spec/release docs if the issue is contract or process drift.
5. Record residual risk explicitly if the remaining blocker is external.
6. Update the active status doc in `,auto-dev-state.md` when the repo posture changes.

---

## Deliverables

- code/tests for behavioral issues
- doc alignment for contract/process issues
- evidence summary for completed remediation
- explicit note when the only remaining blocker is external validation

---

## Hard Rules

- Never leave an audit note “open” if the issue is actually resolved.
- Never mark a code-side finding complete without regression coverage.
- Never hide external blockers inside a generic “future work” list.

---

## Reference

- [auto-dev-state.md](../../../audit/auto-dev-state.md)
- [10-10-readiness-sprint-roadmap.md](../../../agile/roadmap/10-10-readiness-sprint-roadmap.md)
- [agent-evidence-template.md](../agent-evidence-template.md)
