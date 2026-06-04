---
title: 'Agent universal instructions (any LLM)'
status: current
date: 2026-06-05
owner: gtcx-agentic
role: protocol-architect
document_id: OPS-AGENT-UNIVERSAL
tier: critical
tags: ['agents', 'protocol-22', 'protocol-26', 'protocol-27', 'terminal']
review_cycle: on-change
---

# Agent universal instructions (ANY LLM)

> **Audience:** Claude Code, Cursor (`agent` CLI + IDE), Kimi CLI, Gemini, Codex, GitHub Copilot, and any agent with shell access.
> **Not IDE-specific.** Same rules in terminal and GUI.

---

## 1. Session start (every repo, every session)

```bash
cd <owner-repo>
pnpm agent:session-start
```

Fallbacks if script missing:

```bash
node scripts/agent-session-start.mjs
node scripts/agent-next-work.mjs
node scripts/agent-next-work.mjs --json
```

Read after start:

| File                                      | Purpose                               |
| ----------------------------------------- | ------------------------------------- |
| `.baseline/memory/session.md`             | Session pointer                       |
| `docs/operations/agent-work-selection.md` | P22 manifest (when present)           |
| `AGENTS.md`                               | Repo-specific gates (synced partials) |

---

## 2. Protocol 22 — pick work (no menus)

1. Run `agent:next-work` (or `agent:session-start`).
2. Implement the returned **story ID** in **this repo**.
3. **Never** ask the operator to choose among stories, repos, or numbered options.

---

## 3. Protocol 26 — Proceed Brief (no approval menus)

Emit exactly this shape, then **start work**:

```markdown
## Proceed Brief

**Next:** <single action from agent:next-work>
**Because:** <selection.reason>
**Authority class:** R | A | S
**Blocked until:** none | <artifact>
**Override:** stop | correct: | story ID
```

### Hard-forbidden operator messages

- Your call / Your call on …
- Two options / 1. … 2. …
- Say push if you want / if you want all on origin
- Which do you prefer? / Do you want A or B?
- Asking **approval of the path** you already selected (Class **R**)

**Confirmation ≠ approval:** Human may **stop** or **correct** — not pick backlog items.

---

## 4. Protocol 27 — run commands yourself

| You run                                     | You do not ask         |
| ------------------------------------------- | ---------------------- |
| `pnpm test`, lint, validate                 | "run locally"          |
| `npx expo start` (background), Metro health | "focus your terminal"  |
| `adb reverse`, `am start`                   | "press r/a" only       |
| `git push` when commits ready               | "Say push if you want" |

Report: **command + exit code** per step.

### Diagnosis ladder (before delegating to human)

1. Shell (foreground)
2. Background Shell + `block_until_ms`
3. `node` / child_process (IDE harness workaround)
4. Owner-repo cwd (P24)
5. `pnpm --dir ../gtcx-agentic ecosystem:push-all`
6. **Permission Unblock Report**
7. Human (Class S or physical-only)

---

## 5. Provider entry points (same content)

All synced from `gtcx-agentic` templates via `pnpm agent:sync`:

| Provider    | File                                                               |
| ----------- | ------------------------------------------------------------------ |
| Agnostic    | `AGENTS.md`                                                        |
| Claude      | `CLAUDE.md`, `.claude/CLAUDE.md`                                   |
| Kimi        | `KIMI.md`, `.kimi/AGENTS.md`                                       |
| Gemini      | `GEMINI.md`                                                        |
| Codex       | `CODEX.md`                                                         |
| Cursor      | `.cursor/rules/main.mdc`, `protocol-26-*.mdc`, `protocol-27-*.mdc` |
| Copilot     | `.github/copilot/instructions.md`                                  |
| Conventions | `CONVENTIONS.md`                                                   |

**SoR for templates:** `gtcx-agentic/scripts/sync/templates/.agent/`

**Ecosystem rollout:** `pnpm --dir gtcx-agentic ecosystem:rollout-universal`

---

## 6. Normative hub (gtcx-docs)

| Protocol | Path                                                                      |
| -------- | ------------------------------------------------------------------------- |
| P22      | `docs/governance/protocols/22-agent-work-selection/protocol.md`           |
| P26      | `docs/governance/protocols/26-agent-proceed-confirmation/protocol.md`     |
| P27      | `docs/governance/protocols/27-agent-execution-obligation/protocol.md`     |
| P28      | `docs/governance/protocols/28-agent-authority-classification/protocol.md` |

---

_Rollout: gtcx-agentic `ecosystem:rollout-universal` · Cursor rules P26/P27 in every repo `.cursor/rules/`_
