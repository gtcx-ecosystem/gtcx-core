---
title: 'Agent bout progress gauge (engineering vs buyer truth)'
status: current
date: 2026-06-04
owner: gtcx-core
role: protocol-architect
document_id: OPS-AGENT-BOUT-PROGRESS
tier: standard
tags: ['agents', 'gtm', 'progress', 'protocol-22']
review_cycle: on-change
---

# Bout progress gauge

**Problem:** Agents report “almost done” when repo hygiene is high but **buyers** are still at pilot-only (S2). Operators need a **developer-friendly** standup number that does not confuse engineering 9.5/10 with GTM stage S3.

**Solution:** Separate dimensions, weighted **bout composite** for this session’s work, and **GTM buyer stage** (S0–S6) from `~/.claude/GTM.md` / Cursor `/gtm` command.

## Three scores (never merge without labels)

| ID    | Dimension        | Measures                                 | Typical source                     |
| ----- | ---------------- | ---------------------------------------- | ---------------------------------- |
| **A** | Repo engineering | Code, CI, docs hygiene, gates            | `docs/audit/latest.json` lane 1    |
| **B** | Product workflow | End-to-end pilot loop (assess → finance) | E2E workflow audit (product repos) |
| **C** | GTM buyer stage  | Who can adopt **today** (S0–S6)          | GTM reality check / `GR-T*` tiers  |

**Anti-drift:** A = audit quality or internal signoff only. C = buyer truth. UI-only bouts move B slightly; C needs legal, pen-test, CSP — not Multia tiles.

## Bout composite (standups)

```
composite = Σ (weight[d] × score[d])   // each score 0–10
afterBout = composite + Σ (weight[d] × boutDelta[d])   // realistic if active tasks land
```

Config: `.baseline/bout-progress.config.json` (schema `gtcx.boutProgress.v1`).

**Report in Status Update** every progress report (every 2 stories) and at bout check-in:

```markdown
### Progress gauge

| Dimension              | Today       | After bout (realistic) | Ceiling  |
| ---------------------- | ----------- | ---------------------- | -------- |
| A. Repo engineering    | 9.5         | 9.6                    | 10       |
| C. GTM buyer (library) | 5.5 (GR-T1) | 5.6                    | S3 ≈ 7.5 |

**Bout composite:** 6.3 / 10 → **6.4** if active tasks complete.
**Buyer stage:** S2 partial — pilot checklist exists; LOI/pen-test/CSP block S3.
```

## GTM buyer stage (S0–S6)

Use Cursor `/gtm` or `~/.claude/GTM.md`. Map to 0–10 for composite **only when labeled**:

| Stage      | Name               | Score (approx) |
| ---------- | ------------------ | -------------- |
| S0         | Prototype          | 2              |
| S1         | MVP                | 4              |
| S2 partial | Pilot (controlled) | 5.5            |
| S2         | Pilot ready        | 6              |
| S3         | GA                 | 7.5            |
| S4         | Enterprise         | 8.5            |
| S5+        | Gov / Defense      | 9–10           |

A stage is **Ready** only if **all** criteria pass; “staging” or “building” = Not Ready.

## Commands

```bash
pnpm agent:bout-progress          # human-readable gauge
pnpm agent:bout-progress --json     # machine output
pnpm agent:reconcile-bout-progress  # refresh A from latest.json
pnpm agent:bout-progress:check      # CI — config valid
```

## Per-repo setup

1. Copy `.baseline/bout-progress.config.json` (see `docs/operations/examples/`).
2. Add **tasks** with IDs like `EOS-UX-052` — not “W1 slice” alone (wave = traceability only).
3. Wire weights: product repos often `0.2×A + 0.5×B + 0.3×C`; foundation repos `0.4×A + 0.6×C` (no B).

## Related

- [agent-task-backlog-format.md](agent-task-backlog-format.md) — task table columns
- [agent-execution-bout.md](agent-execution-bout.md) — drain queue
- [agent-status-update-template.md](agent-status-update-template.md) — Progress gauge section
