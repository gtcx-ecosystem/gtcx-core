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

## Status (2026-06-06 review)

All migration-scope work is committed and pushed to `origin/main`.

| Commit     | Purpose                                         |
| ---------- | ----------------------------------------------- |
| `35167fc6` | Land layout v3 doc paths, hub stubs, agent sync |
| `d5e71db6` | Layout v3 + governance spine migration          |
| `393b52bd` | Repo-hygiene audit refresh                      |

**gtcx-agentic registry:** `gtcx-core` in `config/ecosystem-governance-spine.json` at `origin/main` (`4f6e0fe`).

## Deferred (non-migration — still open)

- `pnpm readiness:lanes:check` — audit indexes not fully migrated to `01-docs/05-audit/` (lane gate, not migration scorecard)
- Hub README stubs: `00-archive/`, `03-platform/` (repo-hygiene P1)
- `Makefile.local` — optional P33 recommendation
- gtcx-agentic local session artifacts (MCP JSON, session-hygiene evidence) — runtime, not committed

## Primary migration commit

**SHA:** `d5e71db6` · **Land commit:** `35167fc6` on `main`
