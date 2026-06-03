---
title: 'Agent Work Selection Manifest'
status: current
date: 2026-06-02
owner: protocol-architect
role: protocol-architect
tier: standard
tags: ['agents', 'roadmap', 'protocol-22', 'work-selection']
review_cycle: on-change
document_id: OPS-AWS-001
protocol: gtcx-docs/docs/governance/protocols/22-agent-work-selection/
---

# Agent Work Selection — gtcx-core

> **Protocol:** [Protocol 22 — Agent Work Selection](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/22-agent-work-selection/protocol.md)
>
> Agents compute next work from the 10/10 cryptographic defensibility roadmap. **Never ask the operator to choose.**

## Canonical paths

| Artifact         | Path                                                |
| ---------------- | --------------------------------------------------- |
| 10/10 roadmap    | `docs/audit/moat-dimension-roadmap-10-10.md`        |
| Assessment       | `docs/audit/algorithmic-moat-sprint2-assessment.md` |
| Session pointer  | `.baseline/memory/session.md`                       |
| Selection script | `scripts/agent-next-work.mjs`                       |

## Commands

```bash
npm run agent:next-work
```

## Active frame

**Development** (default). In this frame, evidence-capture milestones (UAT, pen-test reports, ministry letters) are skipped; the next automatable code/docs milestone is selected.

## Selection algorithm

Apply tiers in order. Within a tier, sort by: score ascending, critical path yes before no, dimension number ascending. Skip done, deferred, blocked, and external-only milestones.

| Tier                   | Rule                                                                             |
| ---------------------- | -------------------------------------------------------------------------------- |
| 1 — Resume             | Any milestone marked `in_progress` in `.baseline/memory/session.md`              |
| 2 — Critical path code | Lowest-score dimension on critical path with implementable pending milestone     |
| 3 — Non-critical code  | Lowest-score dimension not on critical path with implementable pending milestone |
| 4 — Ops-docs           | Author `docs/` when no code milestones remain                                    |
| 5 — External           | Flag for human handoff (D8, D9, third-party letters) — **do not start**          |

## External-blocked dimensions

These dimensions require external vendors/consultants. Agents must not start them without explicit human authorization:

- **D8 Formal Verification** — requires Z3/Coq consultant (2–3 weeks)
- **D9 Third-Party Audit** — requires vendor SOW + engagement (4–6 weeks)
- **D10 M10.3** — requires regulator sign-off letter (2 weeks external)

## Dimension quick-reference

| Dim | Score | Critical | Next implementable milestone                          |
| --- | ----- | -------- | ----------------------------------------------------- |
| D1  | 9     | Yes      | M1.5 Differential testing (snarkjs / arkworks ref)    |
| D2  | 9     | No       | M2.2 Fuzzing / randomized witness gen                 |
| D3  | 9.5   | No       | — (M3.2 trusted-setup verification is release-gated)  |
| D4  | 9     | No       | — (M4.2 end-to-end integration test)                  |
| D5  | 9.5   | No       | — (M5.3 `getrandom` fallback audit)                   |
| D6  | 8     | Yes      | M6.4 Cross-implementation validation (snarkjs)        |
| D7  | 8     | No       | M7.4 Microbenchmarks (`dudect` / `ctgrind`)           |
| D8  | 0     | No       | **EXTERNAL** — Z3/Coq consultant                      |
| D9  | 0     | No       | **EXTERNAL** — audit vendor                           |
| D10 | 8     | No       | M10.2 Runtime FIPS enforcement (`GTCX_FIPS_STRICT=1`) |

## Implementation classes

| Class            | Examples                                             | Action                        |
| ---------------- | ---------------------------------------------------- | ----------------------------- |
| code             | ZKP circuits, Rust crates, TS packages, CI workflows | Select                        |
| ops-docs         | Audit reports, inventory docs, threat models         | Select (when no code remains) |
| evidence-capture | UAT logs, pen-test reports, ministry letters         | Skip — human-owned            |
| external         | Consultant engagement, vendor SOW, formal proofs     | Skip — flag for handoff       |

## Forbidden

- Asking the user which dimension or milestone to pick when this manifest and roadmap exist.
- Starting D8 or D9 without explicit human authorization.
- Silently skipping a milestone that is implementable in the current frame.

## After completing a milestone

1. Update dimension score in `docs/audit/moat-dimension-roadmap-10-10.md`.
2. Update `docs/audit/algorithmic-moat-sprint2-assessment.md` if scores changed materially.
3. Refresh `.baseline/memory/session.md` with completed milestone and computed next milestone.
4. Run quality gates (`cargo test`, `pnpm architecture:check`, `pnpm docs:check-frontmatter`, etc.).
5. Micro-commit with conventional commit style.
6. Re-run `npm run agent:next-work` and continue without asking.
