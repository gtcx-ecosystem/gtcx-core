## Launch focus (GTM — every session, no audit required)

**Normative:** `01-docs/04-ops/agent-launch-focus.md` · **SoR:** `.baseline/launch-focus.json`

**North star:** Finish **gtcx-core** foundation so **markets / intelligence / infrastructure** can launch apps → GTM closes sovereign deals (GR-T2+).

| Mode          | Meaning                                                                |
| ------------- | ---------------------------------------------------------------------- |
| **implement** | Drain `workSet.implement` (bout)                                       |
| **plan**      | No code queue — drain `workSet.plan` (reconcile roadmaps/coordination) |
| **witness**   | Human gates only                                                       |

```bash
pnpm agent:session-start --json
pnpm agent:reconcile-launch
```

**Forbidden:** Asking operator to run forensic audit or execute-roadmap to discover priorities.
