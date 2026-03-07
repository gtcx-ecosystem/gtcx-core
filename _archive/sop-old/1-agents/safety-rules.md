# Safety Rules — gtcx-core

What agents and team members can do autonomously vs. what requires explicit human authorization.

Governed by the Baseline Protocol. These rules apply to all AI-assisted work in this repo.

## Autonomous — No Approval Required

- Read any file in the repo
- Run quality gates (`pnpm lint`, `pnpm test`, `pnpm build`, etc.)
- Write or update documentation in `SOP/`
- Write new tests for existing behavior
- Fix failing tests where the fix is clearly scoped to the failing case
- Update package docs in `SOP/2-docs/2-specs/packages/`
- Propose ADRs (status: Proposed — human approval required before Accepted)
- Commit completed work — commit frequently after each meaningful, self-contained unit of work. Use conventional commit format. Never accumulate multiple tasks into a single commit

## Requires Human Approval Before Proceeding

- Any change to `@gtcx/crypto`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`
- Any change to a Rust crate (`rust/gtcx-crypto`, `rust/gtcx-zkp`, `rust/gtcx-node`)
- Any new package or Rust crate added to the workspace
- Any change to `pnpm-workspace.yaml`, `turbo.json`, or root `package.json`
- Any change to `.github/workflows/`
- Any change to `tools/check-package-boundaries.mjs` (architecture gate)
- Any change to `quality/api-surface-baseline.json` (API contract)
- Any change to `benchmarks/performance-budgets.json`
- Marking an ADR status as Accepted
- Running `pnpm api:update-baseline`
- Any destructive git operation

## Never — Hard Rules

- Never skip CI gates (`--no-verify`, bypassing hooks)
- Never push to `main` without explicit instruction
- Never force push
- Never commit `.env` files or secrets
- Never implement custom cryptographic primitives
- Never remove or downgrade a security control
- Never mark a release checklist item complete without running the actual gate
- Never modify the threat control matrix without Cryptographic Security Engineer review

## Escalation

If uncertain whether an action requires approval: stop, state the action, and ask.

The cost of pausing is zero. The cost of an unauthorized change to a cryptographic primitive is unbounded.
