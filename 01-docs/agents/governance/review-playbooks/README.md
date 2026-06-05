---
title: 'Review Playbooks'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'agents']
review_cycle: 'on-change'
---

# Review Playbooks

Domain-specific review playbooks for AI codeowner agents reviewing pull requests on `gtcx-core`. Each playbook codifies the questions the agent must ask, the evidence it must cite, and the failure modes it must catch for a specific package category.

| File                                   | Domain                                                                                                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`crypto.md`](./crypto.md)             | Cryptographic packages (`@gtcx/crypto`, `@gtcx/crypto-native`, `rust/gtcx-crypto`) — review checklist for new exports, NAPI boundary changes, FIPS-mode preservation |
| [`security.md`](./security.md)         | Security packages (`@gtcx/security`) — review checklist for audit logger changes, secret-sanitization preservation, threat-matrix impact                             |
| [`verification.md`](./verification.md) | Verification packages (`@gtcx/verification`, `@gtcx/workproof`) — review checklist for certificate-flow changes, ZKP integrations, attestation schema evolution      |

**Audience:** AI codeowner agents acting on PRs; human reviewers cross-checking that the AI followed the prescribed playbook.

Operational pattern: a PR touching files in a covered domain triggers the corresponding playbook; the agent posts findings as a PR comment citing the playbook section consulted. Failures here are structurally forbidden from approving the PR — see [`../README.md`](../README.md).
