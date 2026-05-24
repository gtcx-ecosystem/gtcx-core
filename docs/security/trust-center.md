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

This file satisfies the [Protocol 1 v2.0](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/system-sop/1-protocols/1-docs-structure/protocol.md) structural requirement for `docs/security/trust-center.md`. The canonical trust-portal artifact for `gtcx-core` lives at [`docs/governance/trust-portal.md`](../governance/trust-portal.md) — that file is the single source of truth.

This redirect exists so:

1. The Protocol 1 v2.0 mandatory-files audit passes (`docs/security/trust-center.md` exists).
2. A consumer searching `docs/security/` for "trust" finds the right destination without duplication.
3. The canonical content stays in one file; future edits don't need synchronization.

## What you're looking for

| Looking for                                           | Go to                                                                                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Evidence index for vendor risk / regulator review     | [`docs/governance/trust-portal.md`](../governance/trust-portal.md)                                                                   |
| How to report a security issue                        | [`docs/security/vulnerability-disclosure.md`](./vulnerability-disclosure.md)                                                         |
| Published package versions (post-Sprint 2.3)          | [`docs/governance/trust-portal.md#published-versions`](../governance/trust-portal.md#published-versions)                             |
| Threat model                                          | [`docs/security/threat-model.md`](./threat-model.md)                                                                                 |
| FIPS posture                                          | [`docs/security/fips-validation-boundary.md`](./fips-validation-boundary.md)                                                         |
| Pen test scope and engagement state                   | [`docs/security/pen-test-scope.md`](./pen-test-scope.md), [`docs/security/pen-test-engagement-log.md`](./pen-test-engagement-log.md) |
| Current readiness composite (9.5/10 as of 2026-05-21) | [`docs/audit/internal-completion-audit-2026-05-21.md`](../audit/internal-completion-audit-2026-05-21.md)                             |
| External hosted version of the trust portal           | Pending GitBook deployment — see [`docs/operations/trust-portal-hosting.md`](../operations/trust-portal-hosting.md)                  |

## Why this isn't a duplicate doc

`gtcx-core` had `docs/governance/trust-portal.md` before Protocol 1 v2.0 was adopted. The v2.0 file path is `docs/security/trust-center.md`. Rather than rename and break inbound links from `gtcx-mobile`, `gtcx-protocols`, `compliance-os`, and other repos that already cite the governance path, this file points to the canonical location and is updated only when the path or scope changes — not on every edit to the trust portal itself.

The Protocol 1 v2.0 §External-Facing Docs Rules note that external docs must not link to internal-only paths. The governance/trust-portal.md is the right external surface; this file's only job is structural compliance.
