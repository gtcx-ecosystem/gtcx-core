---
title: 'Repo Hygiene Protocol — gtcx-core'
status: 'current'
date: '2026-06-06'
owner: 'gtcx-core'
role: 'protocol-architect'
tier: 'standard'
tags: ['operations', 'repo-hygiene', 'governance']
review_cycle: 'on-change'
related:
  - 01-docs/04-ops/repo/root-allowlist.json
  - config/sor-map.json
  - 01-docs/05-audit/repo-hygiene-2026-06-05.md
canonical_protocol: gtcx-docs/03-platform/tools/audit/audit-framework/prompts/hygiene/repo-hygiene-protocol-prompt.md
---

# Repo Hygiene Protocol — gtcx-core

> **Workspace type:** Foundation library monorepo (pnpm + Turborepo, TypeScript packages + Rust crates).
> **Machine allowlist:** [`root-allowlist.json`](root-allowlist.json) v3.2.0 — closed-root SSOT for CI.
> **Path SoR:** [`config/sor-map.json`](../../../config/sor-map.json) — one canonical path per concern.
> **Canonical protocol:** `gtcx-docs/03-platform/tools/audit/audit-framework/prompts/hygiene/repo-hygiene-protocol-prompt.md` (this file is the repo overlay).

## Purpose

Keep the repository root predictable for humans and agents. Only intentional files live at root; everything else belongs under the **seven hubs** (`00-archive` … `06-workstream`) plus `config/` and the documented `rust/` foundation exception.

## Tier A — Front door (required)

| File        | Purpose                               |
| ----------- | ------------------------------------- |
| `README.md` | Human onboarding                      |
| `AGENTS.md` | Agent onboarding (canonical for LLMs) |

## Tier B — Agent sync extensions

| File        | Purpose                                      |
| ----------- | -------------------------------------------- |
| `CLAUDE.md` | Claude extension (agent-sync managed blocks) |
| `GEMINI.md` | Gemini extension                             |
| `CODEX.md`  | Codex extension                              |
| `KIMI.md`   | Kimi extension                               |

Edit synced blocks via `.agent/` partials — run `pnpm agent:sync`.

## Tier C — Legal / GitHub

| File / Dir     | Purpose                          |
| -------------- | -------------------------------- |
| `LICENSE`      | MIT                              |
| `NOTICE`       | Attribution notices              |
| `CHANGELOG.md` | Release history                  |
| `.github/`     | Workflows, CODEOWNERS, templates |

Community policy lives in **`01-docs/04-ops/repo/`** (`CONTRIBUTING.md`, `SECURITY.md`) — not at root (P31).

## Tier D — Monorepo spine

| File                   | Purpose                                                  |
| ---------------------- | -------------------------------------------------------- |
| `package.json`         | Root workspace manifest                                  |
| `pnpm-workspace.yaml`  | pnpm workspace definitions                               |
| `pnpm-lock.yaml`       | Lockfile (committed)                                     |
| `turbo.json`           | Turborepo stub → sync from `config/toolchain/turbo.json` |
| `tsconfig.json`        | TypeScript stub → `config/toolchain/tsconfig.base.json`  |
| `eslint.config.js`     | ESLint flat config                                       |
| `commitlint.config.js` | Conventional commit lint                                 |
| `baseline.config.ts`   | BaselineOS RAG config                                    |
| `hygiene.config.json`  | gtcx-hygiene root policy                                 |
| `Makefile`             | Optional local shortcuts (prefer `pnpm` targets)         |

TypeDoc, Vitest workspace, and Makefile canonical copies live under **`config/toolchain/`** — not at repo root.

Docker and deploy manifests live under **`04-deploy/`** — not `04-ship/` at root.

## Tier E — Quality / CI dotfiles

| File / Dir                        | Purpose                     |
| --------------------------------- | --------------------------- |
| `.gitignore`                      | Source of truth for ignores |
| `.gitattributes`                  | Line-ending attributes      |
| `.dockerignore`                   | Docker build context filter |
| `.editorconfig`                   | Cross-editor formatting     |
| `.prettierrc` + `.prettierignore` | Format configuration        |
| `.env.example`                    | Documented env-var template |
| `.husky/`                         | Git hooks                   |

## Tier F — Baseline / agent tooling (dot dirs)

| Dir           | Purpose                     |
| ------------- | --------------------------- |
| `.agent/`     | Agent-sync partials SoR     |
| `.baseline/`  | BaselineOS checkpoint state |
| `.cursor/`    | Cursor config               |
| `.claude/`    | Claude config               |
| `.gemini/`    | Gemini config               |
| `.kimi/`      | Kimi config                 |
| `.changeset/` | Changesets release mgmt     |

## Tier G — Seven hubs (+ `rust/` exception)

| Hub / path       | Purpose                                          | README |
| ---------------- | ------------------------------------------------ | ------ |
| `00-archive/`    | Historical artifacts, generated API docs         | ✓      |
| `01-docs/`       | Narrative documentation                          | ✓      |
| `02-ops/`        | PM, GTM, coordination, compliance ops domains    | ✓      |
| `03-platform/`   | Packages, scripts, tools, assets                 | ✓      |
| `04-deploy/`     | Deploy manifests, Docker, infra-as-code stubs    | ✓      |
| `05-audit/`      | Ops audit evidence entry (not narrative indexes) | ✓      |
| `06-workstream/` | Active workstream scratch / coordination         | ✓      |
| `config/`        | Toolchain stubs, ops manifest, sor-map           | ✓      |
| `rust/`          | Six `gtcx-*` crates (foundation exception — P31) | ✓      |

**Inside `01-docs/` (doc domains — not root hubs):**

| Domain        | Canonical path       | Legacy redirect   |
| ------------- | -------------------- | ----------------- |
| Audit indexes | `01-docs/05-audit/`  | `01-docs/audit/`  |
| Agent docs    | `01-docs/01-agents/` | `01-docs/agents/` |

## Forbidden root names

| Pattern                                   | Why                 | Where it belongs                   |
| ----------------------------------------- | ------------------- | ---------------------------------- |
| `packages/`, `scripts/`, `tools/` at root | Closed root (P31)   | `03-platform/`                     |
| `deploy/`, `04-ship/` at root             | Closed root         | `04-deploy/`                       |
| Tracked `audit/` scratch                  | Conflicts with hubs | `05-audit/` or `01-docs/05-audit/` |
| `vitest.workspace.ts` at root             | Tier D stub only    | `config/toolchain/`                |

## Enforcement

```bash
pnpm check:workspace-root-cleanliness:strict
pnpm layout:migrate:v6:check
pnpm readiness:lanes:check
pnpm ops:check
```

Checker: `03-platform/scripts/ops/check-workspace-root-cleanliness.py`

## Audit command

```text
/repo-hygiene
```

Registry: `gtcx-docs/03-platform/tools/audit/audit-framework/commands/repo-hygiene.md`
