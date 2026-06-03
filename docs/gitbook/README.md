---
title: 'GitBook — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'gitbook']
review_cycle: 'on-change'
---

# GitBook — gtcx-core

> **Status:** Structurally exempt — gtcx-core is a pure library repo with no end-user product UI.

Per [Protocol 1 v2.0 §The Standard](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/system-sop/1-protocols/1-docs-structure/protocol.md), `docs/gitbook/` is the canonical home for _external-facing product docs_. For a foundation library with no end-user surface, there is no product to document at this layer.

Where the equivalent content lives:

| What a `gitbook/` would normally hold           | Where it actually lives for gtcx-core                                                                                                                                                                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product user guides                             | N/A — gtcx-core has no end-user product. The 14+ consumer products in the ecosystem each maintain their own `gitbook/` (see e.g. `gtcx-platforms`, `gtcx-mobile`).                                                                                                        |
| API reference                                   | TypeDoc-generated docs at [`artifacts/api-docs/`](../../artifacts/api-docs/) (built by `pnpm docs`); per-package npm registry pages once Sprint 2.3 publishes.                                                                                                            |
| Trust / compliance content for external readers | [`docs/governance/trust-portal.md`](../governance/trust-portal.md) — the canonical external-facing evidence index.                                                                                                                                                        |
| Security disclosure flow                        | [`docs/security/vulnerability-disclosure.md`](../security/vulnerability-disclosure.md).                                                                                                                                                                                   |
| Architecture for external readers               | [`docs/architecture/system-overview.md`](../architecture/system-overview.md), [`ecosystem-integration.md`](../architecture/ecosystem-integration.md), [`business-logic.md`](../architecture/business-logic.md), [`adoption-model.md`](../architecture/adoption-model.md). |

When to populate this directory:

- If gtcx-core gains a user-facing product surface (CLI tool aimed at end users, hosted developer portal, etc.).
- If a future engagement requires a single curated public landing page that aggregates the trust portal + adoption guide + getting-started flow.

Until then, this README is the directory's intentional content. The directory is _structurally present_ to satisfy Protocol 1 v2.0's expected layout, not because there's product documentation here.
