## Execution bout (intrinsic — prefer over execute-roadmap for shipping)

**Normative:** `docs/operations/agent-execution-bout.md` · state: `.baseline/execution-bout.json`

Every `pnpm agent:session-start` and `pnpm agent:next-work` provisions `executionBout` (Class R drain queue). **Drain the bout before check-in** — micro-commit per story; progress Status Update every 2 stories; full check-in at bout end.

```bash
pnpm agent:session-start --json   # includes executionBout
pnpm agent:bout                   # human summary
```

`backlogClear` ≠ stop — continue `repoCompletable` Class R items in the bout plan.

**Planning only:** `execute-roadmap` (gtcx-docs framework) reconciles audits into `docs/audit/execution-roadmap.md` — does not replace the bout loop for implementation.
