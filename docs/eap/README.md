---
title: 'External Access Plane (EAP) — Build Entry'
status: 'draft'
date: '2026-06-02'
owner: 'gtcx-core'
tier: 'critical'
tags: ['eap', 'security', 'api-keys']
review_cycle: 'on-change'
---

# External Access Plane — gtcx-core build entry

**ADR-001:** EAP control plane is implemented in this repo (Phase B).

## Canonical specs

| Doc                        | Location                                                               |
| -------------------------- | ---------------------------------------------------------------------- |
| Protocol 23                | `gtcx-docs/docs/governance/protocols/23-external-access-credentials/`  |
| Implementation guide       | `gtcx-docs/.../implementation-guide.md`                                |
| Issuance evidence contract | `gtcx-docs/.../eap-issuance-evidence-contract.md`                      |
| ADR-001                    | `gtcx-docs/docs/architecture/adr/001-eap-control-plane-and-storage.md` |

## Phase B deliverables (EAP-02)

Package: **`packages/eap`** (`@gtcx/eap`) — skeleton shipped:

- `createEapAdminService()` — issue / revoke / list fingerprints
- In-memory tenant + client registry
- `StubSecretWriter` (replace with AWS SDK in EAP-03)
- Redacted issuance evidence builder (`gtcx.eap.issuance.v1`)

```bash
pnpm --filter @gtcx/eap test
```

## Out of scope here

Inbound agent credentials — `gtcx-agentic` + Baseline Vault (Protocol 19).
