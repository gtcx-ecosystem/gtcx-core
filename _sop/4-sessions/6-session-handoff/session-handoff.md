# Session Handoff — gtcx-core

Protocol for handing off in-progress work between agent sessions. Required whenever a session ends with work incomplete or decisions pending.

---

## When to Write a Handoff

- Any session that ends with in-progress code changes
- Any session where a significant architectural or security decision was made but not yet implemented
- Any session where a CI gate failure was investigated but not yet resolved
- Before context compression makes prior decisions unrecoverable

---

## Naming Convention

```
_sop/4-sessions/6-session-handoff/YYYY-MM-DD-handoff.md
```

One file per session. If multiple sessions occur in one day, append `-2`, `-3`.

---

## Required Sections

Every handoff document must contain all of the following:

### Files in Progress

Exact file paths with line numbers if relevant. Include what state each file is in (complete, partial, needs review).

### Work Completed This Session

What was finished and committed. Reference commit hashes if available.

### Decisions Made

Every architectural, security, or process decision made this session with the reasoning. Future sessions must not relitigate decisions without new information.

### Known Issues / Gotchas

Anything discovered this session that the next agent must know: wrong paths, failing tests, tricky edge cases, areas where context was lost and had to be reconstructed.

### Blocked Items

What could not be completed and why. Include what needs to be resolved before work can continue.

### Next Steps

Numbered, specific, and immediately actionable. The next session should be able to read this list and begin working within 2 minutes.

---

## Template

```markdown
# Session Handoff — YYYY-MM-DD

## Files in Progress

- `packages/crypto/src/keys.ts` (lines 42–67) — partial refactor, compiles but tests not updated

## Work Completed

- `doc: add package spec for @gtcx/crypto` (abc1234)
- `fix: correct stale path refs in _sop/1-agents/` (def5678)

## Decisions Made

- Decision: use `constantTimeEqual` for all commitment comparisons — reasoning: timing attacks possible with `===` on hash values
- Decision: `@gtcx/ai` stub returns wrapped fn unchanged — full impl deferred to gtcx-intelligence

## Known Issues / Gotchas

- `pnpm architecture:check` fails on circular dep in `@gtcx/events` → `@gtcx/domain` → `@gtcx/events`; under investigation

## Blocked

- Gate 8 (`security:threat-matrix`) — awaiting Cryptographic Security Engineer review of the new signing surface

## Next Steps

1. Fix circular dep in `@gtcx/events` — read `tools/check-package-boundaries.mjs` first
2. Re-run all 9 gates — verify clean before opening PR
3. Update API surface baseline: `pnpm api:update-baseline` (requires human approval)
```

---

## Reference

- [`../../../1-agents/1-onboarding/context-recovery.md`](../../../1-agents/1-onboarding/context-recovery.md) — recovery protocol for the next session
- [`../../../1-agents/4-workflows/safety-rules.md`](../../../1-agents/4-workflows/safety-rules.md) — authority tiers
