---
title: "CodeQL Tuning"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "security"]
review_cycle: "on-change"
---

---
title: 'Codeql Tuning'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'
---

# CodeQL Tuning

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Cryptographic Security Engineer

**Last updated:** 2026-05-06

## Purpose

This document explains the tuned CodeQL ruleset for the `gtcx-core` monorepo. The goal is to block genuine security issues in CI while avoiding noise from rules that are inapplicable to library/framework code.

## Configuration File

`.github/codeql/codeql-config.yml`

## Scope

- **Included paths:** `packages/`, `rust/`
- **Excluded paths:** `dist/`, `node_modules/`, `tests/`, `rust/target/`
- **Query packs:** `security-extended`, `security-and-quality`

## Excluded Rules

| Rule ID                           | Reason for Exclusion                                                                                |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| `js/missing-rate-limiting`        | Rate limiting is enforced at the API gateway / ingress layer, not inside reusable library packages. |
| `js/unsafe-dynamic-method-access` | Intentional in the plugin architecture (e.g., protocol registration).                               |
| `ts/unsafe-assignment-from-any`   | Covered by the stricter `any`-annotation budget gate (`tools/check-governance.mjs`).                |

## CI Behavior

- CodeQL analysis runs on every PR and push to `main`.
- `continue-on-error: true` has been **removed** — findings now block the pipeline.
- If a new exclusion is needed, update `.github/codeql/codeql-config.yml` and reference this document in the PR description.

## Related

- `.github/workflows/ci.yml` — CodeQL job definition
- `,remediation-plan-2026-05-06.md` — Phase 4.3 (CodeQL Gating)
