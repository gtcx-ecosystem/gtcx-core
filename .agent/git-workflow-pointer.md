## Agent git workflow — micro-commit and preserve (P4 + P24 + P26 + P27)

**Normative:** [agent-git-workflow.md](docs/operations/agent-git-workflow.md)

| Action           | Practice                                                                             |
| ---------------- | ------------------------------------------------------------------------------------ |
| **Commit**       | Micro-commit **immediately** after each Class R story (gates pass) — **never ask**   |
| **Push**         | **After every micro-commit** — `pnpm agent:git-push` when IDE blocks bare `git push` |
| **Run commands** | P27 ladder D1→D6 — agents execute gates/probes/git; never defer to operator          |
| **Owner repo**   | Git writes **only** in owner checkout (P24); wrong repo → handoff, switch workspace  |

**IDE vs CLI:** Yolo (`~/.cursor/cli-config.json`) applies to **Cursor CLI**; Composer uses `pnpm agent:git-push`.

**Forbidden:** "Should I commit?", "Say push if you want", "run in your terminal".

**Cross-repo deps (session):** `pnpm agent:cross-repo-deps:check`

**Report:** Status Update **Done** — `commit <sha>` · `pnpm agent:git-push` exit code.
