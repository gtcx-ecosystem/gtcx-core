---
title: "Risk Tier Gates"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "agents"]
review_cycle: "on-change"
---

---
title: 'Risk Tier Gates'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'
---

# Risk Tier Gates

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

This doc explains how to use [quality/package-risk-tiers.json](../../../quality/package-risk-tiers.json) during development and review.

---

## Source of Truth

`quality/package-risk-tiers.json` is the machine-readable source of truth for:

- package risk tier
- required gates
- required evidence artifacts
- approval expectations

Agents and reviewers should use the manifest first, then this doc for interpretation.

---

## Tier Summary

| Tier                 | Typical scope                                            | Minimum expectation                                                          |
| -------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `security-sensitive` | Crypto, verification, identity, auth, native trust paths | Run full trust-path gates, add regression coverage, produce release evidence |
| `foundational`       | Shared contracts, base types, domain foundations         | Preserve API stability and dependency boundaries                             |
| `release-sensitive`  | Consumer-facing integration or operational behavior      | Validate downstream behavior, performance, and release evidence              |
| `internal-tooling`   | Build, lint, packaging, repo automation                  | Validate workspace-wide build/tooling impact                                 |

---

## Required Workflow

1. Identify every changed package.
2. Look up its tier in `quality/package-risk-tiers.json`.
3. Run the union of all required gates across the touched tiers.
4. Produce the union of required artifacts across the touched tiers.
5. Apply the strictest approval expectation in the touched set.

If one change touches both `security-sensitive` and `internal-tooling`, treat the task as `security-sensitive`.

---

## Evidence Expectations

Use [agent-evidence-template.md](./agent-evidence-template.md) when:

- any `security-sensitive` package changes
- any `release-sensitive` package changes
- API surface changes intentionally
- trust behavior, offline behavior, or release posture changes

---

## Reference

- [trust-contract-matrix.md](../../architecture/trust-contract-matrix.md)
- [safety-rules.md](./safety-rules.md)
- [quality-runbook.md](../../devops/runbooks/quality-runbook.md)
