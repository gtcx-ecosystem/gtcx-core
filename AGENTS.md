# Agent Instructions — GTCX Core

> **For:** Claude, Kimi, Gemini, Codex, Cursor, GitHub Copilot, and any future AI agent
> **Status:** Current
> **Date:** 2026-05-12
## 1.5 GTCX Institutional Baseline

This repo operates within the GTCX ecosystem. All agents must reference the canonical organizational baseline:

| Resource | Canonical Path | Document ID |
|----------|---------------|-------------|
| Baseline Overview | `gtcx-docs/docs/governance/institutional/README.md` | INST-001 |
| Baseline JSON | `gtcx-docs/docs/governance/institutional/gtcx-baseline.json` | INST-002 |
| Agent Startup Protocol | `gtcx-docs/docs/governance/institutional/agent-startup-protocol.md` | INST-003 |
| Personas | `gtcx-docs/docs/governance/institutional/personas/` | INST-P-001–007 |
| Lexicon | `gtcx-docs/docs/governance/institutional/lexicon/` | INST-L-001–003 |
| Frames | `gtcx-docs/docs/governance/institutional/frames/` | INST-F-001–004 |
| Deliverables | `gtcx-docs/docs/governance/institutional/deliverables/` | INST-D-001–006 |
| Conventions | `gtcx-docs/docs/governance/institutional/conventions/` | INST-C-001–003 |

**Registry:** See `gtcx-docs/docs/governance/REGISTRY.md` for the full document index.

## 1.6 Agent Startup Protocol (MANDATORY)

Before making any code changes, architectural decisions, or recommendations, complete this sequence:

### Phase 1: Load Baseline (30 sec)
1. Read this `AGENTS.md` file (stack, commands, constraints)
2. Read `.baseline/definition.json` (repo config, terminology, authority)
3. Read institutional baseline: `gtcx-docs/docs/governance/institutional/README.md` *(if accessible)*

### Phase 2: Establish Repo Context (1 min)
4. Read `.baseline/memory/session.md` — last session, incomplete work, next steps
5. Read `.baseline/memory/patterns.md` — confirmed architectural patterns
6. Read `.baseline/memory/pitfalls.md` — known issues, anti-patterns, blockers
7. Read `.baseline/memory/dependencies.md` — cross-repo dependencies

*If .baseline/memory/ files are missing or empty, create them with discovered content.*

### Phase 3: Discover Current State (30 sec)
8. Run `git status` — uncommitted changes, modified files
9. Run `git log --oneline -10` — recent work, current branch
10. Check `workstream/` or `.baseline/memory/session.md` for active tasks

### Phase 4: Select Persona & Frame (30 sec)
11. Map task to persona: developer (default), trade-analyst, compliance-officer, field-inspector, protocol-engineer, platform-architect, product-strategist, security-engineer
12. Verify trust score ≥ persona threshold
13. Select frame: development (default), trading-floor, field-operations, regulatory-audit

### Phase 5: Attest & Begin (30 sec)
14. Summarize context in 3–5 sentences
15. Add attestation block to commit/PR:
```markdown
## Agent Context Attestation
- [x] Phase 1: Baseline loaded
- [x] Phase 2: Repo context established
- [x] Phase 3: Current state discovered
- [x] Phase 4: Persona & frame selected
- [x] Phase 5: Context attested
```

### Context Refresh (every 2 hours or task switch)
- Re-read `.baseline/memory/session.md`
- Re-check `git status`
- Re-read `.baseline/memory/pitfalls.md`
- Update `session.md` if state changed

**Full protocol:** `gtcx-docs/docs/governance/institutional/agent-startup-protocol.md`

---

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
2. **Machine-readable docs standard** — `gtcx-docs/docs/governance/protocols/18-machine-readable-docs/protocol.md`
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

`gtcx-core` — shared TypeScript and Rust protocol foundation for cryptography, identity, verification, resilience, and downstream GTCX integrations.

## Stack

- TypeScript packages under `packages/*`, built with `tsup`, tested with `vitest`, orchestrated by `turbo`.
- Rust crates under `rust/*`, built and tested with Cargo.
- Package manager: `pnpm@9.15.0`.
- Runtime baseline: Node.js 20+ and Rust 1.91+.

## Non-Negotiables

1. **Conventional commits** — `type(scope): subject`, lowercase, imperative.
2. **No emojis** unless explicitly requested.
3. **No going in circles** — read this file + the repo's own docs before exploring.

## Build & Run

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm architecture:check
pnpm docs:check-links
pnpm docs:check-frontmatter
pnpm bundle:check-budgets
```

## Audits (cross-repo)

To run any forensic audit on this repo (master-audit, full-audit, 10-10-roadmap, repo-overview, doc-cleanup, doc-standard, verification-audit, docs-machine-readable):

1. Read `../gtcx-docs/tools/audit/audit-framework/AGENT-START.md` — the canonical entry point lists every command, its prompt file, and the output path.
2. Read the specific command file (`../gtcx-docs/tools/audit/audit-framework/commands/<command>.md`).
3. Read the prompt file referenced there (`../gtcx-docs/tools/audit/audit-framework/prompts/<category>/<file>.md`).
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
\n## Credential Access\n\nThe credential vault is managed by **gtcx-agentic** (consumes `@baselineos/vault` from baseline-os).\n\nAgents access credentials via the MCP tool:\n\n```\nTool: baseline_vault\n  action: "list"     → show available credentials and trust requirements\n  action: "get"      → retrieve a value (requires: name, agentId)\n  action: "status"   → vault health check\n```\n\nThe vault is centrally located at `~/.baseline/vault` (SQLite, AES-256 encrypted).\nTrust-score gated. All access is audited.\n\nStandard env vars: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `DATABASE_URL`, `REDIS_URL`, `BASELINE_MASTER_KEY`.\n\nNever commit secrets. Never ask users for credentials in chat.\nRead Protocol 19 (`gtcx-docs/docs/governance/protocols/19-agent-credential-access/protocol.md`) for the full standard.