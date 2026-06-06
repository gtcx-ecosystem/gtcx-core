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
| `pnpm architecture:check`                      | 0    |
| `pnpm bundle:check-budgets`                    | 0    |
| `pnpm api:check`                               | 0    |
| `pnpm certified-pack:verify-manifest`          | 0    |
| `pnpm lint` / `typecheck` / `test` / `build`   | 0    |

## Tool path retarget (ENG-P0)

Quality gates now resolve v3 paths via `config/paths.mjs`:

- `03-platform/packages/` (not root `packages/`)
- `03-platform/benchmarks/` (not root `benchmarks/`)
- `01-docs/security/threat-control-matrix.md` (with legacy fallback)
- Manifest tools use repo root (`../../..` from `03-platform/tools/*/`)

## Deferred (non-blocking)

- `pnpm security:threat-matrix` — T09–T12 evidence gaps (lane 2/compliance, not layout v3)
- `pnpm vendor-evidence:verify-manifest` — artifact paths under `00-archive/` (rebuild pending)
- `pnpm docs:check-links` — README legacy link cleanup
