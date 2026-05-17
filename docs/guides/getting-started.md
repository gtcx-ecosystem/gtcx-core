---
title: 'Getting Started'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'guides']
review_cycle: 'on-change'
---

# Getting Started

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

Use this guide when you need to get productive in `gtcx-core` quickly.

## First 15 Minutes

1. Read [`../../CLAUDE.md`](../../CLAUDE.md).
2. Read [`../agents/onboarding/orientation.md`](../agents/onboarding/orientation.md).
3. Install dependencies and run the core gates:

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

4. Open the relevant package spec in [`../specs/packages/`](../specs/packages/).

## What This Does NOT Cover

- Release procedures. See [`../operations/runbook.md`](../operations/runbook.md).
- Security review expectations. See [`../security/security-framework.md`](../security/security-framework.md).
