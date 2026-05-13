# CLAUDE.md — gtcx-core

> **Agent:** Claude (Anthropic)
> **Canonical instructions:** `AGENTS.md` (agent-agnostic, always read first)
> **Status:** Current
> **Date:** 2026-05-12

---

## What This Repo Is

`gtcx-core` is the shared cryptographic and protocol foundation for the GTCX ecosystem. It exports 18 public TypeScript packages (`@gtcx/*`), maintains 4 shared config workspace packages under `packages/config`, and ships 6 Rust crates (`gtcx-*`) consumed by downstream GTCX repos. No product surface, no UI, no users — pure primitives. Signing, identity, verification, sync, networking, ZKP.

Breaking changes here break everything downstream.

## Session Start Protocol

**Read `AGENTS.md` first** — it is the canonical agent instructions for all AI agents (Claude, Kimi, Gemini, Codex, Cursor, Copilot).

Then read in this order:

1. `docs/agents/onboarding/orientation.md` — codebase orientation and where things live
2. `docs/agents/safety-rules.json` — structured safety rules (machine-readable)
3. `docs/agents/routing-rules.json` — machine-readable role routing
4. The role file for your current work (`docs/agents/roles/`)
5. The relevant package spec before touching any package (`docs/specs/packages/`)

## Product Name

This repo is `gtcx-core`. Do not use other GTCX product names (TradePass, ANISA, PANX, AGX, etc.) in any code, docs, or comments in this repo.

## Governance

All agent work in this repo operates through `1-agentic` — GTCX's internal AI development platform. `docs/agents/` is the per-repo expression of `1-agentic` for `gtcx-core`: roles, safety rules, and task playbooks scoped to this codebase.

`1-agentic` itself runs on Baseline (`ai-1-baseline`). The SOP connects to `1-agentic` — not to Baseline directly. Archetype definitions for the four roles live in `1-agentic`; the role files in `docs/agents/roles/` extend those with repo-specific scope and constraints.

## Agent Team

| Role                             | File                                            |
| -------------------------------- | ----------------------------------------------- |
| Protocol Architect               | `docs/agents/roles/protocol-architect.md`       |
| Cryptographic Security Engineer  | `docs/agents/roles/crypto-security-engineer.md` |
| Frontier Infrastructure Engineer | `docs/agents/roles/frontier-infra-engineer.md`  |
| Quality & Evidence Lead          | `docs/agents/roles/quality-evidence-lead.md`    |

## Security-Sensitive Packages

These packages require the Cryptographic Security Engineer role and human review before any change ships:

- `@gtcx/crypto`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`, `@gtcx/crypto-native`
- `rust/gtcx-crypto`, `rust/gtcx-zkp`

## Quality Gates (run before every commit)

```bash
pnpm architecture:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Full gate sequence: `docs/devops/runbooks/quality-runbook.md`

## Hard Rules

- Never skip CI gates (`--no-verify`)
- Never push to `main` without explicit instruction
- Never force push
- Never commit `.env` files or secrets
- Never implement custom cryptographic primitives
- Never modify the threat control matrix without Cryptographic Security Engineer review
- Never mark an ADR `Accepted` — that is a human decision

## Key Paths

| Need                   | Location                                        |
| ---------------------- | ----------------------------------------------- |
| Architecture decisions | `docs/decisions/`                               |
| System architecture    | `docs/architecture/`                            |
| Package specs          | `docs/specs/packages/`                          |
| Security framework     | `docs/security/`                                |
| Quality runbook        | `docs/devops/runbooks/quality-runbook.md`       |
| Release checklist      | `docs/devops/release-mgmt/release-checklist.md` |
| Roadmap                | `docs/agile/`                                   |
