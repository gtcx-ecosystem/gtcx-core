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

| Pattern                                     | Owner story                            | Validator                                                                                         |
| ------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `eap-issuance-*.json`                       | ER-1-08 / Protocol 23 Phase B issuance | `gtcx-protocols` → `pnpm check:eap-issuance-evidence`                                             |
| `minerals-board-uat-*.json`                 | DTF-5.3.3 regulator UAT (L0–L2)        | Manual review + [minerals-board-uat-protocol.md](../../operations/minerals-board-uat-protocol.md) |
| `minerals-board-uat-evidence-template.json` | DTF-5.3.3 schema template              | Copy to dated run artifact                                                                        |

**Canonical runtime smoke and deployment proofs** may also live in `gtcx-intelligence/docs/audit/evidence/` per [deployment-proof-index](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/audit/evidence/deployment-proof-index.md).
