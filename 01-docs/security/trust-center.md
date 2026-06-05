---
title: 'Trust Center — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'security']
review_cycle: 'on-change'
---

---

title: 'Trust Center'
status: 'current'
date: '2026-05-24'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['security', 'trust', 'governance', 'redirect']
review_cycle: 'on-change'

---

# Trust Center — gtcx-core

> **Status:** Current
> **Date:** 2026-05-24
> **Owner:** Protocol Architect

This file satisfies the [Protocol 1 v2.0](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/system-sop/1-protocols/1-docs-structure/protocol.md) structural requirement for `01-docs/09-security/trust-center.md`. The canonical trust-portal artifact for `gtcx-core` lives at [`01-docs/governance/trust-portal.md`](../governance/trust-portal.md) — that file is the single source of truth.

This redirect exists so:

1. The Protocol 1 v2.0 mandatory-files audit passes (`01-docs/09-security/trust-center.md` exists).
2. A consumer searching `01-docs/09-security/` for "trust" finds the right destination without duplication.
3. The canonical content stays in one file; future edits don't need synchronization.

## What you're looking for

| Looking for                                           | Go to                                                                                                                                                                                                                  |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Evidence index for vendor risk / regulator review     | [`01-docs/governance/trust-portal.md`](../governance/trust-portal.md)                                                                                                                                                  |
| How to report a security issue                        | [`01-docs/09-security/vulnerability-disclosure.md`](./vulnerability-disclosure.md)                                                                                                                                     |
| Published package versions (post-Sprint 2.3)          | [`01-docs/governance/trust-portal.md#published-versions`](../governance/trust-portal.md#published-versions)                                                                                                            |
| Threat model                                          | [`01-docs/09-security/threat-model.md`](./threat-model.md)                                                                                                                                                             |
| FIPS posture                                          | [`01-docs/09-security/fips-validation-boundary.md`](./fips-validation-boundary.md)                                                                                                                                     |
| Pen test scope and engagement state                   | [`01-docs/09-security/pen-test-scope.md`](./pen-test-scope.md), [`01-docs/09-security/pen-test-engagement-log.md`](./pen-test-engagement-log.md)                                                                       |
| Current readiness composite (9.5/10 as of 2026-05-21) | [`01-docs/05-audit/internal-completion-audit-2026-05-21.md`](../audit/internal-completion-audit-2026-05-21.md)                                                                                                         |
| External hosted version of the trust portal           | Live at [gtcx-protocol.gitbook.io/gtcx-open-source](https://gtcx-protocol.gitbook.io/gtcx-open-source/governance/trust-portal) — see [`01-docs/04-ops/trust-portal-hosting.md`](../operations/trust-portal-hosting.md) |

## Why this isn't a duplicate doc

`gtcx-core` had `01-docs/governance/trust-portal.md` before Protocol 1 v2.0 was adopted. The v2.0 file path is `01-docs/09-security/trust-center.md`. Rather than rename and break inbound links from `gtcx-mobile`, `gtcx-protocols`, `compliance-os`, and other repos that already cite the governance path, this file points to the canonical location and is updated only when the path or scope changes — not on every edit to the trust portal itself.

The Protocol 1 v2.0 §External-Facing Docs Rules note that external docs must not link to internal-only paths. The governance/trust-portal.md is the right external surface; this file's only job is structural compliance.
