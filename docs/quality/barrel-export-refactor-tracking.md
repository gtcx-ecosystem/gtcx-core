---
title: 'Barrel Export Refactor Tracking'
status: draft
date: '2026-05-27'
owner: protocol-architect
role: protocol-architect
tier: standard
tags:
  - quality
  - refactoring
  - tree-shaking
  - tracking
review_cycle: monthly
---

# Barrel Export (`export *`) Refactor Tracking

> **Status:** Tracked — not blocking 10.0, must be completed post-certification
> **Date:** 2026-05-27
> **Owner:** Engineering Lead
> **Severity:** P2

## Problem

`export * from './module'` defeats tree-shaking in downstream bundlers. When a consumer imports one symbol from a package, the bundler cannot eliminate unused exports because the barrel re-exports everything indiscriminately.

This increases bundle size for mobile and low-bandwidth deployments — a first-class concern for Global South users.

## Current State

| Package            | File           | Barrel Lines | Explicit Exports Needed                                           |
| ------------------ | -------------- | ------------ | ----------------------------------------------------------------- |
| `@gtcx/api-client` | `src/index.ts` | 3            | `export { TypeA, TypeB, TypeC } from './types'` etc.              |
| `@gtcx/network`    | `src/index.ts` | 4            | `export { PeerDiscovery, PeerInfo } from './peer-discovery'` etc. |
| `@gtcx/schemas`    | `src/index.ts` | 2            | `export { CoreSchema, ProvenanceSchema }` etc.                    |
| `@gtcx/sync`       | `src/index.ts` | 1            | `export { SyncState, SyncConfig } from './types'`                 |
| `@gtcx/types`      | `src/index.ts` | 4            | `export { ProtocolDef, ModelDef, ApiDef, CommonType }` etc.       |

**Total:** 14 `export *` barrel statements across 5 packages.

## Refactor Approach

For each barrel file:

1. Run `pnpm build --filter <package>`
2. Inspect `dist/index.d.ts` to see every symbol currently exported
3. Replace `export * from './module'` with explicit `export { Symbol1, Symbol2 } from './module'`
4. Verify downstream consumers still compile (`pnpm typecheck` in consuming repos)
5. Verify bundle size improves (compare `dist/index.js` gzip before/after)

## Acceptance Criteria

- [ ] Zero `export * from` statements in all `packages/*/src/index.ts`
- [ ] All explicit exports have JSDoc `@public` or `@beta` tags
- [ ] API surface baseline updated (`pnpm api:update-baseline`)
- [ ] Downstream smoke tests pass (`pnpm test` in `gtcx-protocols`, `gtcx-app`)
- [ ] Bundle size regression test shows no increase (or documented decrease)

## Scheduling

| Phase | Packages                         | Target Sprint | Owner            |
| ----- | -------------------------------- | ------------- | ---------------- |
| 1     | `@gtcx/types`, `@gtcx/sync`      | S47           | Engineering Lead |
| 2     | `@gtcx/schemas`, `@gtcx/network` | S48           | Engineering Lead |
| 3     | `@gtcx/api-client`               | S49           | Engineering Lead |

## Risk

- **Breaking change risk:** If downstream consumers rely on barrel-exported symbols that are not in the explicit export list, their builds will fail.
- **Mitigation:** Run `grep -r "from '@gtcx/types'" ../gtcx-protocols ../gtcx-app` to discover all consumed symbols before refactoring.

---

_Tracking issue created: 2026-05-27_
_Not blocking 10.0 — scheduled post-external validation_
