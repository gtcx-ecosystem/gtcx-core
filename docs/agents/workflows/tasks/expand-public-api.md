# Task Playbook: Expand a Public API

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Owner:** Protocol Architect posture + package owner  
**Safety tier:** Requires human review when API surface changes

---

## When to Run This

Run when adding, renaming, re-exporting, or removing a public symbol in any `@gtcx/*` package or Rust-backed public boundary.

---

## Workflow

1. Confirm the API change is intentional and semver-compatible with the target release.
2. Update the package spec and any affected architecture docs.
3. Add or update tests proving the new public shape is usable through public exports.
4. Run `pnpm api:check` and review `quality/api-surface-report.json`.
5. If the diff is intentional, obtain human approval before `pnpm api:update-baseline`.
6. Record migration expectations in `docs/release/api-change-migration-policy.md` or the relevant package spec.

---

## Hard Rules

- Never update the API baseline as a convenience step.
- Never add a public export without a consumer-facing justification.
- Never remove or rename a public export without explicit migration guidance.

---

## Reference

- [api-change-migration-policy.md](../../../release/api-change-migration-policy.md)
- [risk-tier-gates.md](../risk-tier-gates.md)
- [safety-rules.md](../safety-rules.md)
