---
title: 'API Reference Contract'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'reference']
review_cycle: 'on-change'
---

---

title: 'Api Reference'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'

---

# API Reference Contract

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Generated API reference is intentionally kept out of the tracked `01-docs/` tree.

## How to Generate

```bash
pnpm docs
```

The Typedoc output is written to `artifacts/api-docs/`, which is ignored by git.

## Why

- Generated symbol pages violate the ecosystem naming convention by design.
- Generated docs should be reproducible from source, not treated as canonical source-of-truth material.
- The authoritative human-oriented API descriptions live in [`../specs/03-platform/packages/`](../specs/03-platform/packages/) and the package READMEs.

## What This Does NOT Cover

- Package semantics and integration rules. See [`../specs/core-spec.md`](../specs/core-spec.md) and [`../specs/03-platform/packages/README.md`](../specs/03-platform/packages/README.md).
