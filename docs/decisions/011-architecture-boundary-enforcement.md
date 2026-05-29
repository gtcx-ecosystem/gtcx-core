---
title: "ADR-011: Architecture Boundary Enforcement in CI"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "decisions"]
review_cycle: "on-change"
---

---
title: '011 Architecture Boundary Enforcement'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'
---

# ADR-011: Architecture Boundary Enforcement in CI

## Status

Accepted

## Date

2026-02-19

## Context

The repository had strong architectural conventions but no single CI-enforced boundary rule to prevent layering regressions over time.

## Decision

Add an explicit architecture boundary gate (`pnpm architecture:check`) backed by `tools/check-package-boundaries.mjs`.  
The gate enforces:

- no forbidden layer imports for core packages (`types`, `crypto`, `domain`, `security`, `verification`)
- no cross-package internal source imports (`/src/` deep imports)
- workspace dependency declaration integrity (imports must be declared in package manifests)

CI and release workflows run this gate as blocking checks.

## Consequences

### Positive

- Architectural layering becomes enforceable, not just documented.
- Regressions are detected at PR time.
- Package dependency hygiene improves.

### Negative

- New rules can block merges until dependency declarations/boundaries are corrected.
- Rule tuning is needed as architecture evolves.

### Neutral

- Developers must update boundary rules when introducing new legitimate dependencies.
