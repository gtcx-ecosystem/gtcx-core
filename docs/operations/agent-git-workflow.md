---
title: 'Agent git workflow — commit and push (normative)'
status: current
date: 2026-06-04
owner: gtcx-core
role: protocol-architect
document_id: OPS-AGENT-GIT-001
protocol: P4 + P26 + P27
tier: critical
tags: ['agents', 'git', 'protocol-26', 'protocol-27', 'micro-commit']
review_cycle: on-change
related:
  - agent-execution-bout.md
  - agent-universal-instructions.md
  - agent-status-update-template.md
---

# Agent git workflow — commit and push

**Problem:** Agents ask operators _"should I commit?"_, _"say push if you want"_, or _"commit or leave as WIP?"_ — forbidden by [Protocol 26](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/26-agent-proceed-confirmation/protocol.md) and [Protocol 27](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/27-agent-execution-obligation/protocol.md).

**This doc:** Single SoR for **when agents commit and push** without asking.

---

## Precedence (highest wins)

| Priority | Source                               | Effect                                                                  |
| -------- | ------------------------------------ | ----------------------------------------------------------------------- |
| 1        | Explicit operator override in-thread | `"do not commit"`, `"do not push"`, story ID override                   |
| 2        | Protocol 28 authority class          | Class **S** / **A** — no irreversible git on gated actions              |
| 3        | Repo safety                          | No force-push `main`, no `--no-verify`, no secrets in commits           |
| 4        | **This protocol**                    | Default commit/push behavior                                            |
| 5        | Tool-specific hints                  | `execute-roadmap` reconcile-only may defer commit until ship slice done |

---

## Commit — default **ON** (never ask)

| When                                                    | Action                                                                             |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Class **R** story done + applicable V-ladder gates pass | **Micro-commit** immediately — one concern per commit                              |
| Bout policy (`microCommitPerStory`)                     | Commit before `agent:next-work` refresh                                            |
| Mid-story WIP                                           | **Do not** commit half-finished work; finish story first                           |
| Operator said **do not commit**                         | Leave WIP; note in Status Update **Done** — `commits deferred (operator override)` |
| `execute-roadmap` reconcile-only (no implementation)    | May defer until implementation slice; **do not** ask operator to choose            |

### Commit format

```
type(scope): imperative subject

Optional body — why, not what.

## Agent Context Attestation   # when husky requires (gtcx-core agent-path)
```

- Conventional commits per [Protocol 4](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/4-git-workflow/protocol.md)
- Report in Status Update: `commit <sha>` — not _"ready to commit"_

### Forbidden (commit)

- "Should I commit?"
- "Want me to commit?"
- "Say if you want … committed or left as WIP"
- "I'll commit if you'd like"
- Ending turn with uncommitted Class R work **without** operator `do not commit`

---

## Push — default **ON at bout check-in** (never ask)

| When                                                                                           | Action                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bout check-in or session end; branch **ahead** of remote; operator did **not** say do not push | `git push -u origin HEAD` — report exit code                                                                                                                                                                     |
| Cross-repo handoff needs remote witness (coordination ticket, infra consumption)               | Push after commit; link branch or SHA in outbound doc                                                                                                                                                            |
| No commits ahead                                                                               | Skip push silently                                                                                                                                                                                               |
| Operator said **do not push**                                                                  | Commits stay local; Status Update notes `pushed: no (operator override)`                                                                                                                                         |
| Harness denies `git push`                                                                      | [Permission Unblock Report](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/27-agent-execution-obligation/protocol.md) → retry `pnpm ecosystem:push-all` or `node` child_process |

### Push safety

| Rule                                   |                                                               |
| -------------------------------------- | ------------------------------------------------------------- |
| **Never** force-push `main` / `master` | Warn if operator explicitly requests                          |
| **Never** push without commits         |                                                               |
| **Never** push secrets                 | Pre-commit hook is SoR                                        |
| Direct push to `main`                  | **Only** when operator explicitly instructs (rare); prefer PR |

### Forbidden (push)

- "Say push if you want"
- "If you want all on origin"
- "I can push when you're ready"
- Push queue table with no `git push` execution
- Asking push vs PR vs WIP as a menu

---

## Rhythm (bout + session)

```text
story → gates → micro-commit → session.md → agent:next-work
  … repeat while Class R remains …
bout check-in → full Status Update → git push (if ahead) → optional gh pr create (if asked)
```

| Checkpoint                   | Commit                       | Push              |
| ---------------------------- | ---------------------------- | ----------------- |
| Per story                    | **yes**                      | no                |
| Bout check-in                | if pending gates-fixed files | **yes** (default) |
| `execute-roadmap` ship slice | yes per story                | at slice end      |

---

## Status Update evidence

**Done** section must include when applicable:

```markdown
- <story> — `pnpm test` exit 0 · commit `a1b2c3d` · `git push -u origin HEAD` exit 0
```

If push skipped by override:

```markdown
- <story> — commit `a1b2c3d` · push skipped (operator do-not-push)
```

---

## Operator overrides (session-scoped)

| Phrase                          | Commit    | Push                  |
| ------------------------------- | --------- | --------------------- |
| _(default)_                     | auto      | auto at bout check-in |
| `do not commit`                 | off       | unchanged             |
| `do not push`                   | unchanged | off                   |
| `do not commit` + `do not push` | off       | off                   |
| `commit and push` / `push`      | on        | on now                |

Overrides apply until the operator revokes them in-thread.

---

## Commands (agents run — not operators)

```bash
git status --short
git diff --stat
git log --oneline -5
git add <paths>
git commit -m "$(cat <<'EOF'
type(scope): subject
EOF
)"
git push -u origin HEAD    # bout check-in default
gh pr create               # only when operator asked for PR
```

---

## Cross-references

| Doc                                                                  | Role                        |
| -------------------------------------------------------------------- | --------------------------- |
| [agent-execution-bout.md](./agent-execution-bout.md)                 | microCommitPerStory         |
| [agent-universal-instructions.md](./agent-universal-instructions.md) | forbidden operator messages |
| [agent-status-update-template.md](./agent-status-update-template.md) | Done evidence               |
| P26 Proceed Brief                                                    | no path-approval menus      |
| P27 Execution                                                        | run git in-session          |

---

_Normative for all agents in gtcx-core. Rollout sibling repos via gtcx-agentic `ecosystem:rollout-universal`._
