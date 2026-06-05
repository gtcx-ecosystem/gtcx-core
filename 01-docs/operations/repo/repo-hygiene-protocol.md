---
title: 'Repo Hygiene Protocol — gtcx-core'
status: 'current'
date: '2026-06-03'
owner: 'gtcx-core'
role: 'protocol-architect'
tier: 'standard'
tags: ['operations', 'repo-hygiene', 'governance']
review_cycle: 'on-change'
related:
  - 01-docs/04-ops/repo/root-allowlist.json
  - 01-docs/05-audit/repo-hygiene-2026-06-05.md
canonical_protocol: gtcx-docs/tools/audit/audit-framework/prompts/hygiene/repo-hygiene-protocol-prompt.md
---

# Repo Hygiene Protocol — gtcx-core

> **Workspace type:** Monorepo (pnpm + Turborepo, 24 TypeScript packages + 4 config packages, 6 Rust crates).
> **Machine allowlist:** [`root-allowlist.json`](root-allowlist.json) — single source of truth for CI checks.
> **Canonical protocol:** `gtcx-docs/tools/audit/audit-framework/prompts/hygiene/repo-hygiene-protocol-prompt.md` (this file is the repo-specific overlay).

## Purpose

Keep the repository root predictable for humans and agents. Only intentional files live at root; everything else belongs under `01-docs/`, `03-platform/packages/`, `rust/`, `03-platform/scripts/`, `03-platform/tools/`, `tests/`, `deploy/`, `benchmarks/`, `quality/`, or `artifacts/`.

## Tier A — Front door (required)

| File        | Purpose                               |
| ----------- | ------------------------------------- |
| `README.md` | Human onboarding                      |
| `AGENTS.md` | Agent onboarding (canonical for LLMs) |

## Tier B — Agent sync

| File             | Purpose                                                     |
| ---------------- | ----------------------------------------------------------- |
| `CLAUDE.md`      | Claude-specific extension of AGENTS.md (agent-sync managed) |
| `GEMINI.md`      | Gemini-specific extension (agent-sync managed)              |
| `CONVENTIONS.md` | Cross-agent conventions (agent-sync managed)                |
| `CODEX.md`       | Codex-specific extension                                    |
| `KIMI.md`        | Kimi-specific extension                                     |

These files are generated/maintained by the agent-sync pipeline where noted. Do not edit mirrors by hand — modify the source in `.agent/` instead.

## Tier C — Legal / GitHub

| File / Dir        | Purpose                                     |
| ----------------- | ------------------------------------------- |
| `LICENSE`         | MIT                                         |
| `SECURITY.md`     | Vulnerability disclosure policy             |
| `CONTRIBUTING.md` | Contribution guidelines                     |
| `CHANGELOG.md`    | Release history (Keep a Changelog format)   |
| `.github/`        | Workflows, CODEOWNERS, issue + PR templates |

## Tier D — Monorepo spine

| File                   | Purpose                    |
| ---------------------- | -------------------------- |
| `package.json`         | Root workspace manifest    |
| `pnpm-workspace.yaml`  | pnpm workspace definitions |
| `pnpm-lock.yaml`       | Lockfile (committed)       |
| `turbo.json`           | Turborepo task graph (stub — sync from `config/toolchain/`) |
| `tsconfig.json`        | Root TypeScript stub → `config/toolchain/tsconfig.base.json` |
| `eslint.config.js`     | ESLint flat config                                         |
| `commitlint.config.js` | Conventional commit lint                                   |
| `baseline.config.ts`   | BaselineOS RAG config                                      |
| `hygiene.config.json`  | gtcx-hygiene root policy                                   |

TypeDoc, Vitest workspace, and Docker live under **`config/toolchain/`** and **`04-ship/docker/`** — not at repo root.

## Tier E — Quality / CI dotfiles

| File / Dir                        | Purpose                                                           |
| --------------------------------- | ----------------------------------------------------------------- |
| `.gitignore`                      | Source of truth for what's not tracked                            |
| `.gitattributes`                  | Line-ending and diff attributes                                   |
| `.dockerignore`                   | Docker build context filter                                       |
| `.editorconfig`                   | Cross-editor formatting                                           |
| `.prettierrc` + `.prettierignore` | Format configuration                                              |
| `.env.example`                    | Documented env-var template                                       |
| `.husky/`                         | Git hooks (pre-commit secret scan + protocol-source verification) |

## Tier F — Baseline / agent tooling

| Dir           | Purpose                          |
| ------------- | -------------------------------- |
| `.agent/`     | Agent-sync source-of-truth files |
| `.baseline/`  | BaselineOS checkpoint state      |
| `.cursor/`    | Cursor-specific config           |
| `.changeset/` | Changesets release management    |
| `.claude/`    | Claude-specific config           |
| `.gemini/`    | Gemini-specific config           |
| `.kimi/`      | Kimi-specific config             |

## Tier G — Top-level structural directories

| Dir                     | Purpose                                              | README required             |
| ----------------------- | ---------------------------------------------------- | --------------------------- |
| `agents/`               | Terminal-specific agent routing (discoverable index) | ✓                           |
| `bin/`                  | Repo CLI entrypoints (`agent start` without pnpm)    | ✓                           |
| `workspace/`            | P29 operational SoR (JSON manifests, nine domains)   | ✓                           |
| `03-platform/packages/` | Shared `@gtcx/*` libraries + config presets          | ✓ — plus per-package README |
| `rust/`                 | Six `gtcx-*` Rust crates                             | ✓                           |
| `01-docs/`              | All documentation                                    | ✓                           |
| `03-platform/scripts/`  | Repo-wide automation scripts                         | ✓                           |
| `03-platform/tools/`    | Quality gates, checkers, operator utilities          | ✓                           |
| `tests/`                | Integration tests                                    | ✓                           |
| `deploy/`               | Deployment manifests                                 | ✓                           |
| `benchmarks/`           | Performance baselines and CI reports                 | ✓                           |
| `quality/`              | KPI exports and quality artifacts                    | ✓                           |
| `artifacts/`            | Intentional CI/KAT fixtures (`artifacts/kat/`)       | ✓                           |

## Tier H — Human-owned (never agent-remediate)

| Path       | Rule                                                                                                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_delete/` | If present, maintainer removes manually. **Agents must not** delete, move, empty, or add remediation tasks. Audits list as out-of-scope. _(Not currently present in this repo.)_ |

## Gitignored trees (out-of-scope for axes 1, 4)

| Path                                           | Status     | Notes                                                        |
| ---------------------------------------------- | ---------- | ------------------------------------------------------------ |
| `_archive/`                                    | gitignored | Historical tree; must not be committed at root               |
| `audit/`                                       | gitignored | Local scratch; canonical audit corpus is `01-docs/05-audit/` |
| `node_modules/`, `.pnpm-store/`, `.turbo/`     | gitignored | Dependency and turbo caches                                  |
| `rust/target/`, `03-platform/packages/*/dist/` | gitignored | Build outputs                                                |
| `baseline.config.json`                         | gitignored | Local BaselineOS override; `baseline.config.ts` is tracked   |
| `.npmrc`                                       | gitignored | Local registry auth                                          |

## Forbidden root names

| Pattern                          | Why                                | Where it should go                                |
| -------------------------------- | ---------------------------------- | ------------------------------------------------- |
| `audit/` (tracked content)       | Conflicts with `01-docs/05-audit/` | Move to `01-docs/05-audit/_historical/` or delete |
| Uppercase docs not in Tier A/B/C | Naming convention violation        | `01-docs/<area>/kebab-case.md`                    |
| Scratch JSON, logs, output files | Not architectural                  | `.local/` (gitignored)                            |

## Enforcement

```bash
pnpm check:workspace-root-cleanliness:strict
```

Checker: `03-platform/scripts/ops/check-workspace-root-cleanliness.py` (adopted from `gtcx-protocols` / `compliance-os`).

## Audit command

Any agent or CI can run:

```text
/repo-hygiene
```

Registry: `gtcx-docs/tools/audit/audit-framework/commands/repo-hygiene.md`

To execute remediation (apply fixes to 10/10 DoD):

```text
/execute-repo-hygiene
```
