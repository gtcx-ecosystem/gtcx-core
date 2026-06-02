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

## npm provenance attestations — **DONE (2026-06-01)**

| Check                              | Result                                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm provenance:check-npm:strict` | **21/21** at provenance-baseline versions in `package.json` (e.g. `@gtcx/types@3.1.4`)        |
| Release run                        | [26778909174](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26778909174) — success |
| Publish path                       | `tools/publish-packages-provenance.mjs` (`pnpm pack` + `npm publish --provenance`)            |
| Source repo                        | `gtcx-ecosystem/gtcx-core` **public** (required by npm)                                       |

**Provenance baseline:** pin versions in [trust portal](../governance/trust-portal.md#published-versions) or run `pnpm provenance:check-npm:strict` after clone. Older npm releases (e.g. `3.1.3`) lack registry attestations.

## Downstream npm consumers — **DONE (2026-06-01)**

| Repo                  | Packages pinned                                                                                             | Verified                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `gtcx-protocols`      | `@gtcx/crypto`, `@gtcx/types` `^3.1.4`; tradepass `@gtcx/verification` `^3.1.4`, `@gtcx/workproof` `^1.0.4` | Lockfile @ 3.1.4 / 1.0.4; `npm view @gtcx/crypto@3.1.4 dist.attestations` |
| `gtcx-infrastructure` | `tools/replay-protection` — `@gtcx/crypto` `^3.1.4`                                                         | Lockfile @ 3.1.4                                                          |

Guide: [07-downstream-integration.md](../gtm/07-downstream-integration.md). External docs: gtcx-docs GitBook `supply-chain/gtcx-core-npm.md`.

<details>
<summary>Release train debug log (collapsed)</summary>

- [26753651033](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26753651033) — `format:check` before publish
- [26760156283](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26760156283) — GA evidence / scorecard
- [26761642015](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26761642015) — npm auth E401
- [26774707785](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26774707785) — `pnpm publish` without attestations
- [26775554752](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26775554752) — no-op publish (versions already on npm)
- [26776762740](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26776762740) — E422 private repo
- [26777614348](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26777614348) — fail-fast private-repo check

</details>

## Internal 10/10 signoff

**Engineering / DevEx / trust automation:** **complete** for this train (see [execution-roadmap.md](./execution-roadmap.md), [gtm-roadmap-10-10-internal-2026-06-01.md](../gtm/gtm-roadmap-10-10-internal-2026-06-01.md)).

**Bank-grade 10/10:** unchanged — external pen test, SOC 2, time gates.
