## Agent git workflow — commit and push (P4 + P26 + P27)

**Normative:** [agent-git-workflow.md](docs/operations/agent-git-workflow.md)

| Action                                        | Default                             | Ask operator? |
| --------------------------------------------- | ----------------------------------- | ------------- |
| **Commit** Class R story (gates pass)         | **yes** — micro-commit              | **never**     |
| **Push** at bout check-in (branch ahead)      | **yes** — `git push -u origin HEAD` | **never**     |
| Operator said `do not commit` / `do not push` | respect for session                 | —             |

**Forbidden:** "Should I commit?", "Say push if you want", "commit or WIP?", push delegation tables.

**Report:** Status Update **Done** — `commit <sha>` · `git push` exit code (not "ready to commit").
