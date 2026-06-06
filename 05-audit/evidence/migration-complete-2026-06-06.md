---
title: 'Migration complete — gtcx-core layout v3'
status: current
date: 2026-06-06
owner: gtcx-core
role: protocol-architect
tier: standard
review_cycle: on-change
---

# Migration complete — gtcx-core

**Repo:** gtcx-core  
**Date:** 2026-06-06  
**Score:** **100/100 GREEN** (`migrationComplete: true`)

## Scorecard evidence

| Field        | Value                                                                   |
| ------------ | ----------------------------------------------------------------------- |
| Score        | 100/100 GREEN                                                           |
| Agentic JSON | `gtcx-agentic/05-audit/evidence/migration-health-gtcx-core-latest.json` |
| Dimensions   | S 15/15 · P 20/20 · L 15/15 · O 10/10 · B 15/15 · T 25/25               |

## Phase 1 gates (this repo)

| Command                                        | Exit |
| ---------------------------------------------- | ---- |
| `pnpm check:workspace-root-cleanliness:strict` | 0    |
| `pnpm config:stubs:check`                      | 0    |
| `pnpm layout:migrate:v6:check`                 | 0    |
| `pnpm ops:check`                               | 0    |
| `pnpm pm:sync`                                 | 0    |
| `pnpm workspace:check`                         | 0    |

## gtcx-agentic checks (`--repo gtcx-core`)

| Command                                           | Exit |
| ------------------------------------------------- | ---- |
| `ecosystem:check-repo-document-manifest --strict` | 0    |
| `ecosystem:check:governance-spine --strict`       | 0    |

## Phase 4 gates

| Command          | Exit |
| ---------------- | ---- |
| `pnpm lint`      | 0    |
| `pnpm typecheck` | 0    |
| `pnpm test`      | 0    |
| `pnpm ops:check` | 0    |

## Migration changes (surgical)

- Protocol 31 closed root: removed root `vitest.workspace.ts` stub sync; SoR `config/toolchain/vitest.workspace.ts`
- Added `layout:migrate:v6:check` + `03-platform/scripts/layout-drift-check.mjs`
- P33 governance spine: README Governance/Agents sections; tier B frontmatter; AGENTS.md spine footer
- ESLint shared config paths updated to `03-platform/packages/*`

## Status (2026-06-06 L2 convergence)

All migration-scope work is committed and pushed to `origin/main`.

| Commit     | Purpose                                         |
| ---------- | ----------------------------------------------- |
| `b5663ff5` | Converge audit/agent doc trees + sor-map        |
| `35167fc6` | Land layout v3 doc paths, hub stubs, agent sync |
| `d5e71db6` | Layout v3 + governance spine migration          |

**L2 ergonomics (2026-06-06):** Single SoR paths — `01-docs/05-audit/`, `01-docs/01-agents/`, `01-docs/04-ops/`; legacy redirects only; hub READMEs on all hubs.

## Phase 5 gates (L2 convergence)

| Command                      | Exit |
| ---------------------------- | ---- |
| `pnpm readiness:lanes:check` | 0    |
| `pnpm agent:protocols:check` | 0    |
| `pnpm workspace:check`       | 0    |

## Deferred (non-blocking)

- `Makefile.local` — optional P33 recommendation
- L2/L3 tier labels in agentic migration scorecard (ecosystem-wide)

## Primary migration commit

**SHA:** `d5e71db6` · **L2 land:** `b5663ff5` on `main`
