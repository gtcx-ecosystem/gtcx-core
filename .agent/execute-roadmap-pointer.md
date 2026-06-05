## Execute roadmap (planning / reconcile only)

Use when audits must be **reconciled** into a living plan — not for session-by-session implementation drain.

1. Read `../gtcx-docs/tools/roadmap/roadmap-framework/AGENT-START.md`
2. Command `execute-roadmap` — update `01-docs/05-audit/execution-roadmap.md`
3. **Then ship** via **execution bout** (intrinsic): `01-docs/04-ops/agent-execution-bout.md` · `pnpm agent:session-start`

**Do not** stop after planning. **Do not** use execute-roadmap as a substitute for `pnpm agent:next-work` + bout drain.

**Git:** reconcile-only passes may defer commit until ship slice; implementation follows [agent-git-workflow.md](01-docs/04-ops/agent-git-workflow.md) (micro-commit per story; push after each commit; never ask operator).
