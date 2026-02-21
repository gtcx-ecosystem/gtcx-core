# @gtcx/security — Internal Audit Snapshot

**Status**: Active (2026-02-21)

This is a lightweight internal audit snapshot for `@gtcx/security`. It records what exists, what has been validated, and what remains to be verified.

## Inventory (Current)

- `validation/` — Zod schemas + sanitizers
- `auth/` — permissions, sessions, token utilities
- `offline/` — secure storage base, credential cache, tamper detection
- `audit/` — security event types + logger

## Verified Behaviors

- Unit tests exist under `packages/security/tests/*`.
- Offline storage APIs enforce lock/unlock and encryption provider usage.
- Audit logger supports structured event emission.

## Known Gaps / Follow‑ups

- Formal external security audit not yet performed.
- Platform‑specific AES provider must be supplied by runtime.
- Threat model validation is tracked in `docs/security/threat-control-matrix.md`.

## References

- `docs/specs/security-framework.md`
- `packages/security/src/index.ts`
