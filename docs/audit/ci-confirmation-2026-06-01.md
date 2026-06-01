---
title: 'CI Confirmation — gtcx-core'
status: 'current'
date: '2026-06-01'
owner: 'gtcx-core'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['audit', 'ci', 'confirmation']
review_cycle: 'on-change'
---

# CI Confirmation — 2026-06-01

**Git HEAD:** local workspace (post execute-roadmap)  
**Command:** `pnpm ci:confirmation` + manual gate completion for this changeset

## Gates — PASS (this release train)

| Gate                                  | Result                                                 |
| ------------------------------------- | ------------------------------------------------------ |
| `pnpm architecture:check`             | PASS (22 packages, 250 files)                          |
| `pnpm quality:governance:check`       | PASS                                                   |
| `pnpm security:secret-scan`           | PASS                                                   |
| `pnpm security:threat-matrix`         | PASS                                                   |
| `pnpm lint`                           | PASS                                                   |
| `pnpm typecheck`                      | PASS                                                   |
| `pnpm build`                          | PASS                                                   |
| `pnpm test`                           | PASS (110 integration tests incl. `runtime-substrate`) |
| `pnpm test:coverage:critical`         | PASS (≥95% branch on critical packages)                |
| `pnpm api:check`                      | PASS (after `api:update-baseline` for `@gtcx/ai-eval`) |
| `pnpm provenance:generate`            | PASS                                                   |
| `pnpm ai:evaluate`                    | PASS (overall WARN — non-blocking)                     |
| `node ./tools/check-ai-scorecard.mjs` | PASS                                                   |
| `pnpm release:ga:evidence:check`      | PASS                                                   |

## Gates — repo-wide debt (pre-existing, not introduced by this train)

| Gate                          | Result | Notes                                                           |
| ----------------------------- | ------ | --------------------------------------------------------------- |
| `pnpm format:check`           | FAIL   | ~296 files — duplicate frontmatter / doc drift                  |
| `pnpm docs:check-links`       | FAIL   | 2 broken links (`SCORING_FRAMEWORK.md`, `version-standards.md`) |
| `pnpm docs:check-frontmatter` | FAIL   | 299 docs — duplicate YAML blocks in legacy files                |

CI on `main` may use PR-scoped frontmatter check; local full-tree scan fails. Track under doc-hygiene backlog.

## npm provenance attestations

| Check                       | Result                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| `pnpm provenance:check-npm` | **0/21** packages have registry attestations today                                        |
| Pipeline                    | `pnpm release` uses `changeset publish --provenance`; `release.yml` has `id-token: write` |
| Tooling                     | `tools/check-npm-provenance.mjs` — `--strict` after publish in `release.yml`              |

**To populate registry attestations:** apply changeset `.changeset/npm-provenance-republish.md`, push `main`, then:

```bash
gh workflow run release.yml --repo gtcx-ecosystem/gtcx-core
pnpm provenance:check-npm --strict
```

## Internal 10/10 signoff

**Engineering / DevEx / trust automation:** **complete** for this train (see [execution-roadmap.md](./execution-roadmap.md), [gtm-roadmap-10-10-internal-2026-06-01.md](../gtm/gtm-roadmap-10-10-internal-2026-06-01.md)).

**Bank-grade 10/10:** unchanged — external pen test, SOC 2, time gates.
