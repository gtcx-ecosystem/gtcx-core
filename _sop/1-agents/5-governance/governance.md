# Agent Governance — gtcx-core

How agentic work in this repo is governed, authorized, and audited.

---

## Governing Standard

All agent work in `gtcx-core` operates through `1-agentic` — GTCX's internal AI development platform. `1-agentic` runs on the Baseline Protocol (`ai-1-baseline`).

```
ai-1-baseline    — Open-source AI governance specification
      ↓
1-agentic        — GTCX internal AI development platform (runs on Baseline)
      ↓
_sop/1-agents/   — Per-repo expression for gtcx-core: roles, safety rules, playbooks
```

`_sop/1-agents/` does not connect to Baseline directly. Its connection point is `1-agentic`.

---

## What Is Governed Here

This folder defines the governance model as it applies to `gtcx-core`. The four components:

| Component                       | Location                                    | Status      |
| ------------------------------- | ------------------------------------------- | ----------- |
| Role definitions                | `_sop/1-agents/2-roles/`                    | Operational |
| Safety rules                    | `_sop/1-agents/4-workflows/safety-rules.md` | Operational |
| Task playbooks                  | `_sop/1-agents/4-workflows/tasks/`          | Operational |
| Coordination protocol           | `_sop/1-agents/3-structure/coordination.md` | Operational |
| Technical wiring to `1-agentic` | —                                           | Planned     |

---

## Decision Authority

Three tiers of authority govern all work:

### Tier 1 — Autonomous

Actions that agents may take without approval. Defined in `_sop/1-agents/4-workflows/safety-rules.md` under "Autonomous".

Examples: reading files, running CI gates, writing documentation, writing tests, committing completed work.

### Tier 2 — Requires Human Approval

Actions that require explicit human authorization before proceeding. Defined in `_sop/1-agents/4-workflows/safety-rules.md` under "Requires Human Approval".

Examples: changes to security-sensitive packages, new packages or crates, publishing releases, API baseline updates.

### Tier 3 — Never

Actions that are prohibited regardless of instruction. Defined in `_sop/1-agents/4-workflows/safety-rules.md` under "Never".

Examples: `--no-verify`, custom cryptographic primitives, marking ADRs `Accepted`, committing secrets.

---

## Audit Trail

All agent work must be traceable. Commit discipline is mandatory:

- Conventional commit format: `type(scope): subject` — lowercase, imperative, no period
- Commit after each meaningful, self-contained unit of work — never accumulate multiple tasks
- PR descriptions must document the root cause and decision rationale
- Any architectural decision must be recorded in an ADR before the code is merged

---

## Safety Rule Changes

The safety rules in `_sop/1-agents/4-workflows/safety-rules.md` may be updated:

- Documentation and orientation changes — autonomous
- Safety rule changes — require human review before taking effect

When safety rules conflict with a specific instruction, the safety rules take precedence. Escalate the conflict to human review.

---

## 1-agentic Integration

Technical wiring between this repo and `1-agentic` is planned. When integration is complete, governance enforcement will transition from documentation-as-policy to machine-enforced policies.

Current state and integration requirements: [`_sop/1-agents/1-onboarding/1-agentic-integration.md`](../1-onboarding/1-agentic-integration.md)

---

## Reference

- [`_sop/1-agents/4-workflows/safety-rules.md`](../4-workflows/safety-rules.md) — decision authority tiers
- [`_sop/1-agents/3-structure/coordination.md`](../3-structure/coordination.md) — role coordination and decision matrix
- [`_sop/1-agents/1-onboarding/1-agentic-integration.md`](../1-onboarding/1-agentic-integration.md) — integration status
- `1-agentic` — GTCX internal AI development platform
- `ai-1-baseline` — Baseline Protocol specification
