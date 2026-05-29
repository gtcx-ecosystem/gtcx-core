---
title: "Agent Checklist — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "agents"]
review_cycle: "on-change"
---

---
title: 'Agent Checklist'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'
---

# Agent Checklist — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

Pre-flight, development, and pre-commit checklists for AI agents. Run the relevant checklist before every significant action in this repo.

---

## Pre-Flight — Before Any Task

### Context

- [ ] Read `CLAUDE.md` (auto-loaded) — confirm repo identity, key paths, and pnpm commands
- [ ] Read the relevant package spec in `docs/specs/packages/` before changing package behavior
- [ ] If continuing prior work: read `,auto-dev-state.md`
- [ ] Identify which agent role applies to this task — read the role file before acting

### State

- [ ] `git status` — no unexpected uncommitted changes
- [ ] `git log --oneline -5` — understand recent history
- [ ] Confirm working on the correct branch

### Safety

- [ ] Identify the package risk tier in `quality/package-risk-tiers.json`
- [ ] If the task touches a `security-sensitive` package, confirm Cryptographic Security Engineer review posture is available
- [ ] Confirm the task is in the Autonomous tier or that human approval has been given — see `safety-rules.md`

---

## Development — During Work

### Code Quality

- [ ] TypeScript strict mode — no `any` without justification
- [ ] No `console.log` in production code — use `@gtcx/logging`
- [ ] No commented-out code
- [ ] `secureWipe()` called on any buffer holding key material before release
- [ ] `constantTimeEqual()` used for all secret value comparisons — never `===`

### Pattern Compliance

- [ ] Check `docs/architecture/overview.md` for dependency rules before adding an import
- [ ] No new `@gtcx/*` internal imports that create circular dependencies
- [ ] Native bindings only called through `@gtcx/crypto-native` — never `require`d directly

### Testing

- [ ] New behavior has a test
- [ ] Do not modify a test to make code pass — fix the code
- [ ] If a test is skipped, add a comment with the reason and a ticket reference

---

## Pre-Commit — Before Every Commit

### Quality Gates

Run the gates required by the package risk tier. The baseline sequence is:

```bash
pnpm architecture:check   # Gate 1 — no circular deps, no boundary violations
pnpm lint                 # Gate 2 — ESLint + Clippy
pnpm typecheck            # Gate 3 — TypeScript strict
pnpm test                 # Gate 4 — full test suite
pnpm build                # Gate 5 — all packages build clean
```

Then add the tier-specific gates from `docs/agents/workflows/risk-tier-gates.md`.
Examples:

```bash
pnpm test:coverage:critical
pnpm api:check
pnpm perf:check-budgets
pnpm security:threat-matrix
```

For `security-sensitive` and `release-sensitive` work, prepare evidence using `docs/agents/workflows/agent-evidence-template.md`.

### Git Hygiene

- [ ] `git diff --staged` — review exactly what is being committed
- [ ] No `.env` files, key material, or secrets staged
- [ ] Commit is atomic — one logical change, independently passable
- [ ] Commit message: `type(scope): subject` — lowercase, imperative, no period
- [ ] No `--no-verify` — if a hook fails, fix it

---

## Post-Task

- [ ] Required tier-specific gates passed clean
- [ ] If an API surface changed: `pnpm api:check` reviewed and baseline update requested from human if intentional
- [ ] If the task was `security-sensitive` or `release-sensitive`: evidence recorded using the standard template
- [ ] Current-state docs updated if the work changed roadmap, architecture, or release posture

---

## Red Flags — Stop and Recover

Stop immediately if any of these are true:

- Suggesting a file path or function that doesn't exist in the repo
- About to modify a `security-sensitive` package without the required review posture
- About to use `--no-verify` on a commit hook
- About to push to `main` without explicit human instruction
- CI gate failing and the proposed fix is to bypass the gate rather than fix the root cause
- Proposing an architecture that contradicts an existing ADR

When a red flag appears: run the Quick Recovery protocol in `docs/agents/onboarding/context-recovery.md`.

---

## Reference

- [`safety-rules.md`](safety-rules.md) — three-tier authority structure
- [`risk-tier-gates.md`](risk-tier-gates.md) — tier-specific gate and artifact mapping
- [`agent-evidence-template.md`](agent-evidence-template.md) — evidence format for high-risk work
- [`../onboarding/context-recovery.md`](../onboarding/context-recovery.md) — recovery protocol
- [`../../devops/runbooks/quality-runbook.md`](../../devops/runbooks/quality-runbook.md) — full gate sequence
- [`../../security/security-framework.md`](../../security/security-framework.md) — security constraints
