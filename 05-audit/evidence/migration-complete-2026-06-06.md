---
title: 'Migration complete — gtcx-core layout v3'
status: current
date: 2026-06-06
owner: gtcx-core
role: protocol-architect
tier: standard
review_cycle: on-change
---

# Migration complete — gtcx-core (L1/L2/L3)

**Repo:** gtcx-core  
**Date:** 2026-06-06  
**Score:** **100/100 GREEN** · **L2 100/100** · **L3 100/100** · `worldClass: true`

## Tier scorecard (Protocol 30 / layout v3)

| Tier | Name            | Score   | Complete |
| ---- | --------------- | ------- | -------- |
| L1   | Structure       | 100/100 | yes      |
| L2   | Ergonomics      | 100/100 | yes      |
| L3   | Agent bootstrap | 100/100 | yes      |

**Agentic JSON:** `gtcx-agentic/05-audit/evidence/migration-health-gtcx-core-latest.json`  
**Local witness:** `05-audit/evidence/migration-health-gtcx-core-latest.json`

## L3 artifacts shipped

| Artifact                | Path                           |
| ----------------------- | ------------------------------ |
| sor-map                 | `config/sor-map.json`          |
| paths module            | `config/paths.mjs`             |
| repo-kind               | `config/repo-kind.json`        |
| governance spine mirror | `config/governance-spine.json` |
| Bootstrap gate          | `pnpm agent:bootstrap:check`   |
| Strings gate            | `pnpm layout:strings:check`    |

## L2 ergonomics

| Requirement                | Evidence                                      |
| -------------------------- | --------------------------------------------- |
| `layout:migrate:v6:check`  | exit 0                                        |
| `layout:strings:check`     | exit 0                                        |
| `03-platform/README.md`    | present                                       |
| `01-docs/README.md` IA map | Layout v3 section                             |
| `migration_tier: stable`   | `01-docs/operations/repo/root-allowlist.json` |
| No `04-ship/` hub          | verified                                      |

## Phase gates (post L2/L3 closure)

| Command                                        | Exit |
| ---------------------------------------------- | ---- |
| `pnpm check:workspace-root-cleanliness:strict` | 0    |
| `pnpm layout:migrate:v6:check`                 | 0    |
| `pnpm layout:strings:check`                    | 0    |
| `pnpm agent:bootstrap:check`                   | 0    |
| `pnpm docs:check-links`                        | 0    |
| `pnpm security:threat-matrix`                  | 0    |
| `pnpm vendor-evidence:verify-manifest`         | 0    |
| `pnpm architecture:check`                      | 0    |
| `pnpm bundle:check-budgets`                    | 0    |
| `pnpm api:check`                               | 0    |
| `pnpm certified-pack:verify-manifest`          | 0    |
| `pnpm lint` / `typecheck` / `test` / `build`   | 0    |

**Re-scored:** 2026-06-06T17:51:17Z (`pnpm --dir ../gtcx-agentic ecosystem:migration:score -- --repo gtcx-core`) — L2 **100/100**, L3 **100/100**, `worldClass: true`.

## Tool path retarget (ENG-P0)

Quality gates now resolve v3 paths via `config/paths.mjs`:

- `03-platform/packages/` (not root `packages/`)
- `03-platform/benchmarks/` (not root `benchmarks/`)
- `01-docs/security/threat-control-matrix.md` (with legacy fallback)
- Manifest tools use repo root (`../../..` from `03-platform/tools/*/`)

## Compliance lane (non-layout — closed 2026-06-06)

Deferred compliance gates from the initial L2/L3 close are now green at `d1c3999a`:

- `pnpm security:threat-matrix` — T09–T12 evidence paths retargeted
- `pnpm vendor-evidence:verify-manifest` — manifest rebuilt for `00-archive/artifacts/`
- `pnpm docs:check-links` — v3 legacy resolution + README retarget
- Stray `03-platform/artifacts/` removed (export path is `00-archive/artifacts/`)
