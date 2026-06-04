---
title: 'Agent sync coverage — which LLM files get readiness pointers'
status: current
date: 2026-06-05
owner: gtcx-core
role: protocol-architect
tier: standard
tags: ['agents', 'sync', 'cursor', 'kimi', 'codex']
review_cycle: on-change
---

# Agent sync coverage

**Source:** `.agent/*.md` → `pnpm agent:sync` (see `.agent/targets.json`)

**Canonical readiness guide (all agents):** [readiness-and-audit-lanes.md](./readiness-and-audit-lanes.md)

---

## Synced via `pnpm agent:sync` (AGENT-SYNC block)

| File                              | Provider                 | `readiness-pointer` | `audit-pointer` | Notes                          |
| --------------------------------- | ------------------------ | ------------------- | --------------- | ------------------------------ |
| `AGENTS.md`                       | **All (canonical)**      | yes                 | yes             | + human §3, §7.45 outside sync |
| `CLAUDE.md`                       | Anthropic Claude         | yes                 | yes             | + Claude-specific above sync   |
| `GEMINI.md`                       | Google Gemini            | yes                 | yes             |                                |
| `KIMI.md`                         | Moonshot Kimi (IDE/docs) | yes                 | yes             | + Kimi-specific above sync     |
| `CODEX.md`                        | OpenAI Codex             | yes                 | yes             | + Codex-specific above sync    |
| `CONVENTIONS.md`                  | Ecosystem conventions    | yes                 | yes             |                                |
| `.cursor/rules/main.mdc`          | **Cursor Composer**      | yes                 | yes             | `alwaysApply` workspace rule   |
| `.github/copilot/instructions.md` | **GitHub Copilot**       | yes                 | yes             | Human §1–5 above sync          |

**Verify:** `pnpm agent:check` (exit 0 = in sync)

---

## Manual pointers (not full AGENT-SYNC)

| File                                                       | Provider                     | Readiness pointer                           |
| ---------------------------------------------------------- | ---------------------------- | ------------------------------------------- |
| `.cursor/rules.md`                                         | Cursor (legacy composer doc) | Points to `readiness-and-audit-lanes.md`    |
| `.cursor/rules/protocol-27-agent-execution-obligation.mdc` | Cursor                       | Protocol 27 gates                           |
| `.cursor/rules/ecosystem-false-blocks.mdc`                 | Cursor                       | IR vs XC playbook                           |
| `.kimi/AGENTS.md`                                          | **Kimi Code CLI**            | Read `../AGENTS.md` + readiness paths below |
| `docs/governance/model-cards/*.md`                         | Model cards                  | Not session entry — governance only         |

---

## Kimi Code CLI (`.kimi/`)

Kimi CLI loads **`.kimi/AGENTS.md`** first, then **`../AGENTS.md`**.

Before citing readiness scores in Kimi CLI:

1. `docs/agents/readiness-and-audit-lanes.md`
2. `docs/audit/latest.json`
3. `pnpm readiness:lanes:check` after audit edits

---

## Cursor (this IDE)

| Entry                    | Role                                          |
| ------------------------ | --------------------------------------------- |
| `.cursor/rules/main.mdc` | Synced lane table + build commands            |
| `.cursor/rules.md`       | Composer hints; defers to `AGENTS.md`         |
| User rules / skills      | Operator-specific; do not override lane names |

---

## Not in this repo

| Provider                 | Where instructions live                   |
| ------------------------ | ----------------------------------------- |
| Deepseek, Grok, etc.     | Read repo `AGENTS.md` (provider-agnostic) |
| `gtcx-agentic` vault MCP | Protocol 19 — credentials only            |

---

## When you change readiness scores

1. Update lane indexes + `docs/audit/latest.json`
2. `pnpm readiness:lanes:check`
3. If lane table text changes: edit `.agent/readiness-pointer.md` only
4. `pnpm agent:sync` + `pnpm agent:check`
