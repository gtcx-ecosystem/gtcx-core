---
title: 'Audit evidence — gtcx-core'
status: current
date: 2026-06-03
owner: quality-evidence-lead
document_id: EVIDENCE-CORE-001
review_cycle: quarterly
tags: ['evidence', 'eap', 'audit']
---

# Audit evidence (gtcx-core)

Redacted evidence artifacts for cross-repo program closure. **No raw secrets.**

| Pattern               | Owner story                            | Validator                                             |
| --------------------- | -------------------------------------- | ----------------------------------------------------- |
| `eap-issuance-*.json` | ER-1-08 / Protocol 23 Phase B issuance | `gtcx-protocols` → `pnpm check:eap-issuance-evidence` |

**Canonical runtime smoke and deployment proofs** may also live in `gtcx-intelligence/docs/audit/evidence/` per [deployment-proof-index](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/audit/evidence/deployment-proof-index.md).
