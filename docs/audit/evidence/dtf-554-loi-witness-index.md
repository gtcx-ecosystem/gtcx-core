---
title: 'DTF-5.5.4 LOI — evidence witness index'
status: awaiting-human
date: 2026-06-05
owner: gtcx-core
storyId: DTF-5.5.4
authorityClass: S
document_id: EVIDENCE-DTF554-001
tags: ['evidence', 'loi', 'tier-5', 'witness']
---

# DTF-5.5.4 — LOI / regulator letter witness index

**Commercial gate:** Defensibility Tier 5 criterion **5-C2**  
**Agent boundary:** index only — **do not** commit unsigned LOI PDFs with commercial terms.

## Status

| Field              | Value                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| Gate               | **awaiting-human**                                                                                             |
| Engineering prereq | `pnpm certified-pack:verify-manifest` exit **0**                                                               |
| Packet             | [`dtf-554-loi-h554-packet-2026-06-05.md`](../../operations/coordination/dtf-554-loi-h554-packet-2026-06-05.md) |

## Filing table (Legal completes when signed)

| filedAt   | documentType            | jurisdiction | redactedPath                          | manifestHead         | legalApprover |
| --------- | ----------------------- | ------------ | ------------------------------------- | -------------------- | ------------- |
| _pending_ | LOI or regulator letter | _e.g. GH_    | `dtf-554-loi-YYYY-MM-DD-redacted.pdf` | _git HEAD at filing_ | _name_        |

**Filename pattern:** `dtf-554-loi-YYYY-MM-DD-redacted.pdf` (or `.md` index pointing to vault if PDF cannot live in git).

## Closure (agent witness — after human files row)

1. Update this table + set frontmatter `status: current`
2. Set `commercialGate.status` → `done` in [`certified-pack-manifest-latest.json`](./certified-pack-manifest-latest.json)
3. `pnpm hub` + coordination bridge row
