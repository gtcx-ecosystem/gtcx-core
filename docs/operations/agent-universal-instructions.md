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

**Canonical (BaselineOS — orchestrates gtcx-docs + repo + gates + gtcx-agile ingest):**

```bash
cd <owner-repo>
baseline start
# or: baseline session -r .
# or: baseline start --skip-gates   # fast open
```

Build once if needed: `cd ../baseline-os && pnpm --filter baselineos build`

**Chain:** Phase 0 config preflight → **Phase 0b agent autonomy (P27)** → gtcx-docs INST-003 → repo session (via `run-repo-session` / `bin/agent`) → **audit context card** → repo gates → optional `--ingest` via gtcx-agile/baseline-os work-next.

**Agent environment autonomy (`agentAutonomy` in JSON — Phase 0b):** Before implementing, verify Cursor shell allowlists (`.cursor/cli.json`, `.cursor/permissions.json`) and PATH cover `pnpm`, `node`, `git`, `gh`, `baseline` (+ `cargo` when Rust, `python3` for hygiene). Levels: `full` · `partial` · `blocked` · `terminal`. If `partial` or `blocked`, emit **Permission Unblock Report** (`docs/04-operations/agent-permission-unblock.md`) — do not defer V-ladder to the human. Standalone: `pnpm agent:environment:check`

**Agent capability posture (`agentCapabilities` in JSON):** Assume **full execution power** in the owner repo unless `canExecute` is false. You CAN run gates, git, gh, cross-repo handoffs, forensic audits, and background servers — **execute first**. Timid deferral ("verify locally", "I cannot", story menus) is a protocol violation, not politeness. Read `docs/04-operations/agent-capability-posture.md`. Standalone: `pnpm agent:capabilities:check`

**Audit context card (`sessionContext` in JSON):** At open, identify **master/bank-grade** scores from `docs/05-audit/indexes/latest.json` · last **full/engineering** forensic insight · **GTM status** (lane 5 GR tiers + `.baseline/launch-focus.json`) · **repo hygiene** + **document hygiene** (lane 2 domains + `repo-hygiene-*.md` / `docs-standard-compliance-*.md`) · **UX** audit (worldclass-ux / ux-audit when surface exists) · **SEF** status (Protocol 20 when `sef:check` or `docs/sef/`) · **human agent blockers** (repo-owned gates → raise via **gtcx-agentic** SoR) · **cross-repo dependencies** (`.baseline/memory/dependencies.md`, P24). Read listed `readPaths` before implementing.

**Do not treat `pnpm agent:start` alone as session complete.** It runs repo P22 bootstrap (baseline-os `repo-session-core` or repo-specific `agent-session-start.mjs`). It does **not** run INST-003 or repo gates. Use **`baseline start`** for the full L1 chain.

**Repo-native minimum (P22 bootstrap only):**

```bash
cd <owner-repo>
agent start
# or: pnpm agent:start
```

Optional: `agent start --json` or `baseline start --json` for automation.

Legacy alias: `pnpm agent:session-start` (= `agent:start`).

**Command lookup (mnemonic: session → next → gates → hub):**

| Remember | Run                                  |
| -------- | ------------------------------------ |
| start    | `pnpm session` or `baseline session` |
| next     | `pnpm next`                          |
| gates    | `pnpm gates`                         |
| hub      | `pnpm hub`                           |

Index: `baseline-os/docs/cli/agent-cheatsheet.md` · repo copy: `docs/04-operations/agent-command-lookup.md`

Read after start:

| File                                                | Purpose                               |
| --------------------------------------------------- | ------------------------------------- |
| `.baseline/memory/session.md`                       | Session pointer                       |
| `docs/04-operations/agents/agent-work-selection.md` | P22 manifest (when present)           |
| `AGENTS.md`                                         | Repo-specific gates (synced partials) |

### Ecosystem learning card (normative — every repo)

| Step | Resource                                                                                                                                                                   |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | [Unblock playbook](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/06-coordination/archive/ecosystem-unblock-playbook-2026-06.md) (F1–F10)                 |
| 2    | [P26 + post-pilot gating](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/06-coordination/archive/agent-status-update-and-post-pilot-gating-2026-06-06.md) |
| 3    | [Human-external register](https://github.com/gtcx-ecosystem/gtcx-agentic/blob/main/docs/06-coordination/archive/human-external-blocker-register-2026-06.md)                |
| 4    | [Cross-repo bridge](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/06-coordination/archive/cross-repo-agent-bridge.md) — Latest updates                   |
| 5    | This repo auto-dev-state + work-selection                                                                                                                                  |

**End of turn:** Status Update (§3b) + one [log row](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/06-coordination/archive/cross-repo-agent-log.md). **`backlogClear` on protocols does not stop IR here.** Never execute **H-03** / **XR-518 apply** from non-owner repos.

---

## 2. Protocol 22 — pick work (no menus)

1. Run `agent:next-work` (or `agent:session-start`).
2. Implement the returned **story ID** in **this repo**.
3. **Never** ask the operator to choose among stories, repos, or numbered options.

### Execution bout (intrinsic — drain before check-in)

Repos with bout wiring provision `executionBout` on every `agent:session-start` / `agent:next-work`. **gtcx-core** normative: `docs/04-operations/agent-execution-bout.md` · state: `.baseline/execution-bout.json`.

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

### Human gates — navigation (mandatory)

Read [`human-gate-navigation.md`](human-gate-navigation.md) before treating any gate as repo-wide **blocked**.

**EXT-INF-002 / H-05 / INT-S12-01 (pen-test SOW):**

| Fact       | Value                                                            |
| ---------- | ---------------------------------------------------------------- |
| Class      | **S** — human signs SOW                                          |
| `blocksIR` | **`false`** — implement + witness queue **continues**            |
| Blocks     | **Claims** only (`pen-test complete`) — not merges, not P22 head |
| P26        | **Approval needed** — never **Deferred** unless `dependsOn`      |
| Wrong      | "Blocked on EXT-INF" · "wait for pen-test before coding"         |

| Section             | Purpose                                               |
| ------------------- | ----------------------------------------------------- |
| **Done**            | What completed this turn, with evidence               |
| **Next priority**   | One recommended follow-on (agent executes Class R)    |
| **Approval needed** | Human gates only — parallel; never menus or "I can …" |

Full template: `docs/04-operations/agent-status-update-template.md` (rolled out with universal instructions).

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
3. `node` / child_process (IDE harness workaround — see **Git push D3** below)
4. Owner-repo cwd (P24)
5. `pnpm --dir ../gtcx-agentic ecosystem:push-all` (multi-repo; also uses child_process)
6. **Permission Unblock Report**
7. Human (Class S or physical-only)

### Git push D3 (Cursor / IDE harness)

Bare `git push` may return `Permission denied: Command blocked by permissions configuration` even when the operator approves push. **Try D3 before asking the human:**

```bash
# Single repo (from repo root)
node -e "require('child_process').execSync('git push origin main',{stdio:'inherit'})"

# Current branch, set upstream
node -e "require('child_process').execSync('git push -u origin HEAD',{stdio:'inherit'})"
```

Ecosystem-wide (all repos ahead of origin): `pnpm --dir ../gtcx-agentic ecosystem:push-all`

Report the **wrapper command + exit code**, not “please push locally.”

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
