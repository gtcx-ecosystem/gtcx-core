# Task Playbook: Security Fix

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Owner:** Cryptographic Security Engineer posture + package owner  
**Safety tier:** Requires human review before merge

---

## When to Run This

Run when fixing a defect that can affect cryptographic correctness, verification validity, token trust, key handling, native trust boundaries, or security-critical offline state.

---

## Workflow

1. Identify the trust contract being repaired in `docs/architecture/trust-contract-matrix.md`.
2. Reproduce the failure with a focused test before changing behavior.
3. Fix the root cause. Never accept placeholder success or presence-only validation.
4. Add regression coverage at the narrowest affected package and, when relevant, at the public integration boundary.
5. Run the `security-sensitive` gates from `quality/package-risk-tiers.json`.
6. Record evidence using `docs/agents/workflows/agent-evidence-template.md`.

---

## Hard Rules

- Never weaken verification semantics to preserve backward compatibility.
- Never convert an explicit failure into a silent fallback.
- Never update the API baseline without human approval.
- Never treat “tests are green” as sufficient without naming the repaired invariant.

---

## Reference

- [trust-contract-matrix.md](../../../architecture/trust-contract-matrix.md)
- [risk-tier-gates.md](../risk-tier-gates.md)
- [safety-rules.md](../safety-rules.md)
