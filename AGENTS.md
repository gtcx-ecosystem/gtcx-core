# Agent Instructions — GTCX Core

> **For:** Claude, Kimi, Gemini, Codex, Cursor, GitHub Copilot, and any future AI agent
> **Status:** Current
> **Date:** 2026-05-12
> **Owner:** Protocol Architect

---

## 1. Who You Are

You are an autonomous software engineering agent working on `gtcx-core`, the cryptographic and protocol foundation of the GTCX ecosystem. You have full filesystem, git, and bash access.

Your primary goal: **help ship secure, lightweight, well-documented code that serves African commodity producers and their regulators.**

---

## 2. Repo Identity

| Field                  | Value                                                                      |
| ---------------------- | -------------------------------------------------------------------------- |
| **Name**               | `gtcx-core`                                                                |
| **Purpose**            | Bank-grade cryptographic and protocol foundation (TypeScript + Rust)       |
| **Ecosystem position** | Upstream foundation consumed by 4+ downstream repos                        |
| **Primary users**      | African miners, buying station agents, compliance officers, export brokers |
| **Honest score**       | 8.63/10 core (up from 8.56)                                                |
| **FIPS status**        | 140-3 verified (CMVP #4816)                                                |
| **SLSA**               | Build L3 aspirational, Source L2 enforced                                  |

---

## 3. Session Start Protocol

**Read these in order — no exceptions:**

1. **This file** (`AGENTS.md`) — you are here
2. **Machine-readable docs standard** — `docs/agents/docs-standard-machine-readable.md`
3. **Lightweight app standard** — `docs/agents/docs-standard-lightweight.md`
4. **Safety rules** — `docs/agents/safety-rules.json`
5. **Routing rules** — `docs/agents/routing-rules.json`
6. **Repo overview** — `docs/overview/README.md`
7. **Latest master audit** — `docs/audit/master-audit-2026-05-12.md`

**Then:**

- Run `pnpm ops:check` to verify repo state
- Check `git status --short` — working tree must be clean before starting

---

## 4. Agent-Specific Overrides

| Agent   | Override File                     | What It Contains                                                            |
| ------- | --------------------------------- | --------------------------------------------------------------------------- |
| Claude  | `CLAUDE.md`                       | Claude-specific session protocol, `.claude/settings.local.json` permissions |
| Kimi    | `KIMI.md`                         | Kimi-specific CLI instructions, skill loading protocol                      |
| Gemini  | `GEMINI.md`                       | Gemini-specific context window strategy, multimodal notes                   |
| Codex   | `CODEX.md`                        | Codex-specific inline completion hints, tab-trigger patterns                |
| Cursor  | `.cursor/rules.md`                | Cursor IDE rules, composer instructions                                     |
| Copilot | `.github/copilot/instructions.md` | Copilot inline completion context                                           |

**Rule:** `AGENTS.md` is canonical. Agent-specific files only override when explicitly stated. If there's a conflict, `AGENTS.md` wins.

---

## 5. Architecture

```text
┌─ Downstream: gtcx-markets, gtcx-protocols, gtcx-infrastructure, gtcx-intelligence
├─ TypeScript: packages/* (21 packages)
├─ Rust: rust/* (6 crates)
└─ Platform: Node ≥20, pnpm 9.15, Rust 1.91+, OpenSSL FIPS / AWS-LC
```

**Dependency direction:** TypeScript packages flow one way. No circular deps. Run `pnpm architecture:check` before any cross-package change.

---

## 6. Security-Sensitive Packages

Changes to these require `crypto-security-engineer` review:

- `packages/crypto/`, `packages/crypto-native/`
- `packages/security/`, `packages/verification/`, `packages/identity/`
- `rust/gtcx-crypto/`, `rust/gtcx-zkp/`

**Never:**

- Skip CI gates
- Commit secrets
- Use `unsafe` in Rust without ADR
- Let raw AI output approve consequential actions

---

## 7. Verification Gates (must pass before commit)

```bash
pnpm format:check
pnpm lint
pnpm architecture:check
pnpm docs:check-links
pnpm quality:governance:check
```

**New gates (M2+):**

```bash
pnpm docs:check-frontmatter
pnpm bundle:check-budgets
```

---

## 8. Commit Style

```
type(scope): description

- type: feat, fix, docs, refactor, test, chore
- scope: package name or rust crate
- description: imperative, lowercase, no period
```

---

## 9. Cross-Agent Handoff Protocol

If you need to hand off to another agent:

1. **Write `docs/agents/sessions/<YYYY-MM-DD>-handoff-<agent-from>-<agent-to>.md`**
2. **Include:**
   - What was done (with commit SHAs)
   - What is in progress
   - Blockers and decisions made
   - Files touched
   - Next steps with estimated effort
3. **Update `docs/agents/sessions/INDEX.md`**
4. **Tag the handoff:** `handoff`, `<agent-from>`, `<agent-to>`, `<scope>`

**Read handoffs on session start:** Check `docs/agents/sessions/INDEX.md` for recent handoffs.

---

## 10. Machine-Readable First

All docs you create must have YAML frontmatter per `docs/agents/docs-standard-machine-readable.md`.

All code must respect bundle size budgets per `docs/agents/docs-standard-lightweight.md`.

All rules must be structured JSON per `docs/agents/safety-rules.json`.

All tasks must route through `docs/agents/routing-rules.json`.

<!-- AGENT-SYNC:START -->
<!-- AUTOGENERATED FROM .agent/*.md — DO NOT EDIT THIS SECTION.
     Edit the source partials and run `pnpm agent:sync`. -->

## Repository

`gtcx-core` — TODO: one-line purpose.

## Stack

TODO: language(s), framework(s), package manager, runtime.

## Non-Negotiables

1. **Conventional commits** — `type(scope): subject`, lowercase, imperative.
2. **No emojis** unless explicitly requested.
3. **No going in circles** — read this file + the repo's own docs before exploring.

## Build & Run

```bash
TODO: install / build / test / dev commands
```

## Audits (cross-repo)

To run any forensic audit on this repo (master-audit, full-audit, 10-10-roadmap, repo-overview, doc-cleanup, doc-standard, verification-audit, docs-machine-readable):

1. Read `../gtcx-agentic/audit/AGENT-START.md` — the canonical entry point lists every command, its prompt file, and the output path.
2. Read the specific command file (`../gtcx-agentic/audit/commands/<command>.md`).
3. Read the prompt file referenced there (`../gtcx-agentic/audit/prompts/<category>/<file>.md`).
4. Execute the prompt against this repo.
5. Write the output to the path the command specifies (typically `docs/audit/<command>-<YYYY-MM-DD>.md`).

The audit registry is provider-agnostic — the same prompts work for Claude, Codex, Gemini, Kimi, Deepseek, Grok, etc.
<!-- AGENT-SYNC:END -->

## Coordination Contract

This repo participates in the GTCX ecosystem coordination system managed by `baseline-os`.

| Field | Value |
|-------|-------|
| Repo ID | `gtcx-core` |
| Tier | Tier 1 (Core) |
| Human Lead | TBD — update this |
| Agent Roles | Builder, Reviewer, Coordinator |
| QA Gates | `typecheck`, `test`, `arch-check`, `spec-drift` |

### Reporting Work

Report work items to the coordination hub:

```bash
cd /path/to/baseline-os
pnpm ecosystem:repo:report-work --repo=gtcx-core --item="Description" --status=in-progress
```

Valid statuses: `pending`, `in-progress`, `blocked`, `completed`, `deferred`.

### Querying Blockers

Check `baseline-os/workstream/coordination/coordination-report-latest.md` for cross-repo blockers.

### Trust Requirements

- Builders: trust ≥ 70 (Permissioned)
- Reviewers: trust ≥ 80 (Authorized)
- Coordinators: trust ≥ 85 (Authorized)
- Cross-repo changes require human approval

---

*Coordination contract added: 2026-05-26*
