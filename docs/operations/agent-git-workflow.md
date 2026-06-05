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

**Practice:** **Micro-commit always** · **push after each commit** on the working branch · **never ask** the operator about commit/push menus.

> **Scrub note (2026-06-04):** An earlier draft listed `"do not commit"` / `"do not push"` session overrides — removed. That text was a mistaken merge of conflicting tool hints (`execute-roadmap` reconcile-only, old Cursor rules). **Default is preserve work**, not defer it.

---

## Non-negotiables

| Rule                | Detail                                                             |
| ------------------- | ------------------------------------------------------------------ |
| **Micro-commit**    | One concern per commit, immediately after Class R story + gates    |
| **Push**            | After every micro-commit when branch is ahead — preserve on origin |
| **Never ask**       | No commit/push/WIP menus (P26 / P27)                               |
| **Owner repo only** | Commit/push **only** in the git root that owns the files (P24)     |
| **Branch safety**   | Prefer `feature/*` / `fix/*`; no force-push `main`                 |

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

Wrong-repo work: durable handoff (`docs/gtm/inbound-tickets/to-<owner>-*.md`) — then continue in owner checkout.

---

## Commit rhythm

```text
story → V-ladder gates → git add (scoped) → micro-commit → git push -u origin HEAD
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

| When                                    | Push?                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------ |
| After every micro-commit (branch ahead) | **yes** — `git push -u origin HEAD`                                                        |
| No new commits                          | skip                                                                                       |
| `main` without operator PR flow         | **prefer PR** — push feature branch, `gh pr create` when slice is review-ready             |
| Harness denies push                     | Permission Unblock Report → `pnpm ecosystem:push-all` (gtcx-agentic) or node child_process |

### Forbidden phrases

- "Say push if you want"
- "I can push when you're ready"
- Push delegation tables without executing `git push`

### Safety

- Never `--no-verify`, never force-push `main`
- Never commit secrets (pre-commit hook)
- Report: `commit <sha>` · `git push` exit `<code>` in Status Update **Done**

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

- FA-S6-02 — `pnpm vendor-evidence:verify-manifest` exit 0 · commit `a1b2c3d` · `git push -u origin HEAD` exit 0
```

---

## Cross-references

| Doc                                                                                               | Role                          |
| ------------------------------------------------------------------------------------------------- | ----------------------------- |
| [agent-execution-bout.md](./agent-execution-bout.md)                                              | `microCommitPerStory`         |
| [cross-repo-agent-bridge.md](./coordination/cross-repo-agent-bridge.md)                           | Latest updates                |
| [remaining-cross-repo-work-2026-06-02.md](./coordination/remaining-cross-repo-work-2026-06-02.md) | Open obligations              |
| P24                                                                                               | Owner repo for implementation |
| P26 / P27                                                                                         | No menus; run git in-session  |

---

_Normative for gtcx-core. Ecosystem rollout: gtcx-agentic `ecosystem:rollout-universal`._
