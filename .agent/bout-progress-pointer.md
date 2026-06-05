## Bout progress gauge + task backlog (all agents)

**Normative:** [agent-bout-progress-gauge.md](01-docs/04-ops/agent-bout-progress-gauge.md) · [agent-task-backlog-format.md](01-docs/04-ops/agent-task-backlog-format.md)

**Per repo:** `.baseline/bout-progress.config.json` — dimensions **A** (engineering), **B** (workflow, product repos), **C** (GTM buyer S0–S6).

```bash
pnpm agent:bout-progress              # standup composite + buyer stage
pnpm agent:bout-progress --json
pnpm agent:reconcile-bout-progress    # sync A from latest.json
```

**Status Update:** include `### Progress gauge` block (auto text from `pnpm agent:bout-progress`). Use **task IDs** (`EOS-UX-052`, `CORE-004`) — not “next slices”.

**Product repo example:** [bout-progress-exploration-os.config.json](01-docs/04-ops/03-platform/examples/bout-progress-exploration-os.config.json) — copy to exploration-os `.baseline/`.

**GTM stage assessment:** Cursor `/gtm` or `~/.claude/GTM.md` — buyer truth separate from bout composite.
