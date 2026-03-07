# Agent Checklist — gtcx-core

Pre-flight, development, and pre-commit checklists for AI agents. Run the relevant checklist before every significant action in this repo.

---

## Pre-Flight — Before Any Task

### Context

- [ ] Read `CLAUDE.md` (auto-loaded) — confirm repo identity, key paths, and pnpm commands
- [ ] Read memory files at `.claude/projects/…/memory/` — load confirmed patterns
- [ ] If continuing prior work: read the last handoff in `_sop/4-sessions/6-session-handoff/`
- [ ] Identify which agent role applies to this task — read the role file before acting

### State

- [ ] `git status` — no unexpected uncommitted changes
- [ ] `git log --oneline -5` — understand recent history
- [ ] Confirm working on the correct branch

### Safety

- [ ] Identify if the task touches a security-sensitive package (`@gtcx/crypto`, `@gtcx/crypto-native`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`, `rust/gtcx-crypto`, `rust/gtcx-zkp`) — if yes, stop and confirm Cryptographic Security Engineer co-review is available
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

- [ ] Read the relevant package spec in `_sop/2-docs/5-specs/4-backend/packages/` before modifying a package
- [ ] Check `_sop/2-docs/3-engineering/2-system-design/overview.md` for dependency rules before adding an import
- [ ] No new `@gtcx/*` internal imports that create circular dependencies
- [ ] Native bindings only called through `@gtcx/crypto-native` — never `require`d directly

### Testing

- [ ] New behavior has a test
- [ ] Do not modify a test to make code pass — fix the code
- [ ] If a test is skipped, add a comment with the reason and a ticket reference

---

## Pre-Commit — Before Every Commit

### Quality Gates

Run in order — fix failures before proceeding:

```bash
pnpm architecture:check   # Gate 1 — no circular deps, no boundary violations
pnpm lint                 # Gate 2 — ESLint + Clippy
pnpm typecheck            # Gate 3 — TypeScript strict
pnpm test                 # Gate 4 — full test suite
pnpm build                # Gate 5 — all packages build clean
```

For changes to security-sensitive packages, also run:

```bash
pnpm api:check               # Gate 6 — no unintentional API surface changes
pnpm security:threat-matrix  # Gate 8 — escalate to human if this fails
```

### Git Hygiene

- [ ] `git diff --staged` — review exactly what is being committed
- [ ] No `.env` files, key material, or secrets staged
- [ ] Commit is atomic — one logical change, independently passable
- [ ] Commit message: `type(scope): subject` — lowercase, imperative, no period
- [ ] No `--no-verify` — if a hook fails, fix it

---

## Post-Task

- [ ] All 5 baseline gates pass clean
- [ ] If an API surface changed: `pnpm api:check` reviewed and baseline update requested from human if intentional
- [ ] Session handoff written if work is incomplete: `_sop/4-sessions/6-session-handoff/YYYY-MM-DD-handoff.md`
- [ ] Memory files updated if a new confirmed pattern was discovered

---

## Red Flags — Stop and Recover

Stop immediately if any of these are true:

- Suggesting a file path or function that doesn't exist in the repo
- About to modify `@gtcx/crypto` without Cryptographic Security Engineer co-review
- About to use `--no-verify` on a commit hook
- About to push to `main` without explicit human instruction
- CI gate failing and the proposed fix is to bypass the gate rather than fix the root cause
- Proposing an architecture that contradicts an existing ADR

When a red flag appears: run the Quick Recovery protocol in `_sop/1-agents/1-onboarding/context-recovery.md`.

---

## Reference

- [`safety-rules.md`](safety-rules.md) — three-tier authority structure
- [`../1-onboarding/context-recovery.md`](../1-onboarding/context-recovery.md) — recovery protocol
- [`../../2-docs/4-devops/2-runbooks/quality-runbook.md`](../../2-docs/4-devops/2-runbooks/quality-runbook.md) — full gate sequence
- [`../../2-docs/3-engineering/7-security/security-framework.md`](../../2-docs/3-engineering/7-security/security-framework.md) — security constraints
