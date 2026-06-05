---
title: 'Supportability Policy'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'release']
review_cycle: 'on-change'
---

---

title: 'Supportability Policy'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'

---

# Supportability Policy

**Status:** Active  
**Scope:** `gtcx-core` workspace packages and Rust crates

---

## Purpose

Define the support expectations that downstream teams can rely on without source-diving.

---

## Runtime Matrix

| Surface                 | Expectation                                                                 |
| ----------------------- | --------------------------------------------------------------------------- |
| Node.js runtime         | Use the repo-supported version from the current workspace toolchain         |
| TypeScript consumers    | Public API is the npm export surface tracked by `pnpm api:check`            |
| Rust-backed native path | Preferred for production cryptographic workloads where native is available  |
| JS fallback path        | Supported where documented; not a silent substitute when native is required |

---

## Native Crypto Expectations

- Production consumers should make an explicit decision about native-vs-fallback behavior.
- If a deployment requires native crypto, enforce that requirement at integration time instead of assuming it.
- Any fallback semantics that materially affect security posture must be documented and test-covered.

---

## Semver and Deprecation

- Breaking public API changes require a major version bump and migration guidance.
- Additive public exports require at least a minor version bump.
- Patch releases must not change public behavior except for bug fixes that restore documented contracts.
- Deprecations should document: introduced version, deprecated version, removal target, and migration path.

---

## Security Advisories

- Security-sensitive defects require explicit release evidence and human review before release.
- External disclosure and advisory handling follow the repo security process and release checklist.
- Downstream consumers must be told whether the issue is exploitable in JS fallback, native mode, or both.

---

## What This Policy Does Not Promise

- It does not replace downstream product validation.
- It does not guarantee field-device fitness without consumer integration testing.
- It does not replace external pen testing or crypto review for high-assurance deployments.
