---
title: 'Agent git workflow — micro-commit and preserve (normative)'
status: current
date: 2026-06-04
owner: gtcx-core
role: protocol-architect
document_id: OPS-AGENT-GIT-001
protocol: P4 + P24 + P26 + P27
tier: critical
tags: ['agents', 'git', 'micro-commit', 'protocol-24', 'protocol-27']
review_cycle: on-change
related:
  - agent-execution-bout.md
  - agent-status-update-template.md
  - coordination/cross-repo-agent-bridge.md
---

# Agent git workflow — micro-commit and preserve

**Problem:** Agents ask _"should I commit?"_ or _"say push if you want"_ — wasting operator time and leaving work un-preserved.

**Practice:** **Micro-commit always** · **push after each commit** on the working branch · **run commands in-session** (P27) · **never ask** the operator about commit/push menus.

> **Scrub note (2026-06-04):** An earlier draft listed `"do not commit"` / `"do not push"` session overrides — removed. **Default is preserve work**, not defer it.

---

## Non-negotiables

| Rule                | Detail                                                                |
| ------------------- | --------------------------------------------------------------------- |
| **Micro-commit**    | One concern per commit, immediately after Class R story + gates       |
| **Push**            | After every micro-commit when branch is ahead — preserve on origin    |
| **Run commands**    | Agents execute gates, probes, and git — not operator checklists (P27) |
| **Never ask**       | No commit/push/WIP menus (P26 / P27)                                  |
| **Owner repo only** | Commit/push **only** in the git root that owns the files (P24)        |
| **Branch safety**   | Prefer `feature/*` / `fix/*`; no force-push `main`                    |

---

## Agent command execution (P27)

**You run commands.** The operator does not substitute for your shell.

| Ladder | When bare Shell fails | Action                                                                                |
| ------ | --------------------- | ------------------------------------------------------------------------------------- |
| **D1** | Default               | Run via agent Shell tool                                                              |
| **D2** | Long-running          | Background shell + poll                                                               |
| **D3** | IDE blocks `git push` | `pnpm agent:git-push` (node child_process)                                            |
| **D4** | Wrong repo            | Switch to owner checkout (P24)                                                        |
| **D5** | Ecosystem-wide        | `pnpm --dir ../gtcx-agentic ecosystem:push-all` or `ecosystem:git-push --repo <name>` |
| **D6** | All paths fail        | Permission Unblock Report — then retry when unblocked                                 |

### Forbidden (P27)

- "Verify locally: `pnpm test`"
- "Run this in your terminal and paste output"
- "Let me know when you've pushed"
- Stopping after one blocked Shell attempt without D3–D5

---

## IDE Agent vs Cursor CLI (permissions)

Two surfaces — **different permission systems**. Yolo CLI config does **not** automatically unblock IDE Composer.

| Surface                              | Config                                                                         | Push                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **Cursor CLI** (`agent` in terminal) | `~/.cursor/cli-config.json` — `approvalMode: unrestricted`, sandbox `disabled` | Bare `git push` works                                               |
| **Cursor IDE Agent** (Composer chat) | IDE harness + repo `.cursor/permissions.json`                                  | Bare `Shell(git push)` often **denied** — use `pnpm agent:git-push` |

Repo overlays (CLI):

- `gtcx-core/.cursor/cli.json` — allows `Shell(git push **)` for CLI sessions
- `~/.cursor/cli-config.json` — global yolo; denies only force-push / hard reset

**Do not** tell the operator yolo is "broken" when IDE push fails — use D3.

---

## Repo ownership gate (before `git add`)

Run **before** any commit in a session:

```bash
git rev-parse --show-toplevel
node -p "require('./package.json').name"   # must match owner repo (e.g. gtcx-core)
git remote get-url origin
```

| Check                                                   | Fail action                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| CWD git root ≠ intended owner repo                      | **Stop git** — switch workspace to owner repo (P24)          |
| Implementing XR-\* / product code in gtcx-docs hub only | **No commit here** — file inbound ticket; code in owner repo |
| Cross-repo change spans 2+ repos                        | **Micro-commit per repo** — never one commit across repos    |

Wrong-repo work: durable handoff (`01-docs/08-gtm/inbound-tickets/to-<owner>-*.md`) — then continue in owner checkout.

---

## Commit rhythm

```text
story → V-ladder gates → git add (scoped) → micro-commit → pnpm agent:git-push
  → update session.md → agent:next-work → repeat
```

| When                                            | Commit?                                      |
| ----------------------------------------------- | -------------------------------------------- |
| Class R story done, gates pass                  | **yes — immediately**                        |
| Mid-story partial                               | **no** — finish story first                  |
| Docs-only coordination (Class R)                | **yes** — one concern per ticket/bridge row  |
| `execute-roadmap` reconcile + ship in same pass | commit per shipped story, not one giant dump |

### Format

```
type(scope): imperative subject
```

gtcx-core agent-path commits: include **Agent Context Attestation** when husky requires.

### Forbidden phrases

- "Should I commit?" / "Want me to commit?"
- "Commit or leave as WIP?"
- "Say if you want … committed"
- Ending session with uncommitted Class R work

---

## Push rhythm

| When                                    | Push?                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| After every micro-commit (branch ahead) | **yes** — run push ladder (below)                                              |
| No new commits                          | skip                                                                           |
| `main` without operator PR flow         | **prefer PR** — push feature branch, `gh pr create` when slice is review-ready |

### Push ladder (IDE-safe)

```bash
# 1. Try (CLI / permissive IDE)
git push -u origin HEAD

# 2. IDE Agent fallback (normative for Composer)
pnpm agent:git-push

# 3. Ecosystem — all repos ahead of origin
pnpm --dir ../gtcx-agentic ecosystem:push-all

# Dry-run first when unsure
pnpm agent:git-push -- --dry-run
pnpm --dir ../gtcx-agentic ecosystem:push-all:dry-run
```

### Forbidden phrases

- "Say push if you want"
- "I can push when you're ready"
- Push delegation without running the ladder

### Safety

- Never `--no-verify`, never force-push `main`
- Never commit secrets (pre-commit hook)
- Report: `commit <sha>` · `pnpm agent:git-push` exit `<code>` in Status Update **Done**

---

## Cross-repo dependency checks (regular)

**Light (every session)** — owner repo:

```bash
pnpm agent:cross-repo-deps:check
```

**Full (weekly / before ecosystem handoff)** — from `baseline-os` when sibling checkout exists:

```bash
cd ../baseline-os && pnpm ecosystem:deps:sync && pnpm ecosystem:alignment:check
```

| Check                                     | What it validates                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `agent:cross-repo-deps:check`             | `dependencies.md`, open items in `remaining-cross-repo-work`, P24 inbound docs, bridge freshness |
| `agent:coordination:check --strict`       | Blocked P0 has durable coordination record                                                       |
| `ecosystem:deps:sync` (baseline-os)       | Unified dependency graph across ecosystem                                                        |
| `ecosystem:alignment:check` (baseline-os) | Repo alignment vs workstream index                                                               |

Refresh `.baseline/memory/dependencies.md` when blockers change — not chat-only.

---

## Status Update evidence

```markdown
### Done

- FA-S6-02 — `pnpm vendor-evidence:verify-manifest` exit 0 · commit `a1b2c3d` · `pnpm agent:git-push` exit 0
```

---

## Cross-references

| Doc                                                                                               | Role                                    |
| ------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [agent-execution-bout.md](./agent-execution-bout.md)                                              | `microCommitPerStory`                   |
| [cross-repo-agent-bridge.md](./coordination/cross-repo-agent-bridge.md)                           | Latest updates                          |
| [remaining-cross-repo-work-2026-06-02.md](./coordination/remaining-cross-repo-work-2026-06-02.md) | Open obligations                        |
| P24                                                                                               | Owner repo for implementation           |
| P26 / P27                                                                                         | No menus; run commands + git in-session |
| `gtcx-agentic/03-platform/scripts/ecosystem/push-all-repos.mjs`                                   | Ecosystem push via node spawn           |

---

_Normative for gtcx-core. Ecosystem rollout: gtcx-agentic `ecosystem:rollout-universal`._
