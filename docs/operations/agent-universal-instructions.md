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

**One-shot (BaselineOS CLI — full status + P22 + gates):**

```bash
cd <owner-repo>
# After: cd ../baseline-os && pnpm --filter baselineos build
node ../baseline-os/packages/baselineos/dist/cli/bin.js session
# or: baseline session -r .
```

Chains INST-003 report → `pnpm agent:session-start` → repo gates. Use **`--skip-gates`** for a fast open.

**Repo-native (minimum):**

```bash
cd <owner-repo>
pnpm agent:start
```

Optional: `pnpm agent:start --json` for automation.

Legacy alias: `pnpm agent:session-start` (= `agent:start`).

Read after start:

| File                                      | Purpose                               |
| ----------------------------------------- | ------------------------------------- |
| `.baseline/memory/session.md`             | Session pointer                       |
| `docs/operations/agent-work-selection.md` | P22 manifest (when present)           |
| `AGENTS.md`                               | Repo-specific gates (synced partials) |

### Ecosystem learning card (normative — every repo)

| Step | Resource                                                                                                                                                                   |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | [Unblock playbook](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/ecosystem-unblock-playbook-2026-06.md) (F1–F10)                 |
| 2    | [P26 + post-pilot gating](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/agent-status-update-and-post-pilot-gating-2026-06-06.md) |
| 3    | [Human-external register](https://github.com/gtcx-ecosystem/gtcx-agentic/blob/main/docs/operations/coordination/human-external-blocker-register-2026-06.md)                |
| 4    | [Cross-repo bridge](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/cross-repo-agent-bridge.md) — Latest updates                   |
| 5    | This repo auto-dev-state + work-selection                                                                                                                                  |

**End of turn:** Status Update (§3b) + one [log row](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/cross-repo-agent-log.md). **`backlogClear` on protocols does not stop IR here.** Never execute **H-03** / **XR-518 apply** from non-owner repos.

---

## 2. Protocol 22 — pick work (no menus)

1. Run `agent:next-work` (or `agent:session-start`).
2. Implement the returned **story ID** in **this repo**.
3. **Never** ask the operator to choose among stories, repos, or numbered options.

### Execution bout (intrinsic — drain before check-in)

Repos with bout wiring provision `executionBout` on every `agent:session-start` / `agent:next-work`. **gtcx-core** normative: `docs/operations/agent-execution-bout.md` · state: `.baseline/execution-bout.json`.

| Rhythm          | Action                                               |
| --------------- | ---------------------------------------------------- |
| Per story       | Implement → gates → micro-commit → `agent:next-work` |
| Every 2 stories | Short progress Status Update in chat                 |
| Bout end        | Full Status Update; optional push                    |

**`backlogClear` ≠ stop.** Continue while the bout lists Class R work.

**`execute-roadmap`** is for **planning/reconcile** only — not session implementation drain.

### Launch focus (GTM north star — gtcx-core and wired repos)

**SoR:** `.baseline/launch-focus.json` on session start. Full **work set** (implement / plan / human) — not one story. **PLAN mode** when implement queue empty: reconcile roadmaps and coordination (Class R), do not go idle or ask for audits.

---

## 3. Phase 4 — Persona (mandatory)

1. `pnpm agent:next-work` JSON includes **`persona.institutional`**, **`persona.docUrl`**, **`frame`**.
2. **Read** the persona doc (not only the ID).
3. Emit in every **Proceed Brief** and **Status Update**:

```markdown
**Active persona:** <institutional> · **Frame:** <development | regulatory-audit | …>
**Persona doc:** <persona.docUrl>
```

4. Re-run on **task switch** (new story ID or repo).

---

## 4. Protocol 26 — Proceed Brief (no approval menus)

Emit exactly this shape, then **start work**:

```markdown
## Proceed Brief

**Active persona:** <from agent:next-work JSON>
**Frame:** <from JSON>
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
- **Say if you want** / committed next or / left as local WIP
- Which do you prefer? / Do you want A or B?
- Asking **approval of the path** you already selected (Class **R**)

**Confirmation ≠ approval:** Human may **stop** or **correct** — not pick backlog items.

**Uncommitted Class R work:** commit in-session (micro-commit) — do not ask operator to choose commit vs WIP.

---

## 3b. Status Update (progress / handoff / end of turn)

After substantive work (not at cold session start), close with this frame:

```markdown
## Status Update

### Done

- <outcome> — <command exit N · commit · probe>

### Next priority

- **Owner:** <repo | role>
- **Action:** <single imperative>
- **Because:** <story / hub / witness>

### Approval needed

- <Class A/S gates only — omit section if none>
```

| Section             | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| **Done**            | What completed this turn, with evidence            |
| **Next priority**   | One recommended follow-on (agent executes Class R) |
| **Approval needed** | Human gates only — never menus or "I can …"        |

Full template: `docs/operations/agent-status-update-template.md` (rolled out with universal instructions).

**Start vs report:** Proceed Brief (§3) **before** work · Status Update (§3b) **after** work.

---

## 4. Protocol 27 — run commands yourself

| You run                                                  | You do not ask                         |
| -------------------------------------------------------- | -------------------------------------- |
| `pnpm test`, lint, validate                              | "run locally"                          |
| `aws` / `kubectl` / `terraform` / `scripts/staging/*.sh` | **"Your action needed"** + paste block |
| `npx expo start` (background), Metro health              | "focus your terminal"                  |
| `adb reverse`, `am start`                                | "press r/a" only                       |
| `git push` when commits ready                            | "Say push if you want"                 |

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

**Maintainer gate (CI):** `pnpm ecosystem:rollout-universal:check` in gtcx-agentic. Agents run `ecosystem:rollout-universal` in-session when updating templates (P27) — never tell the operator to run sync/rollout.

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
