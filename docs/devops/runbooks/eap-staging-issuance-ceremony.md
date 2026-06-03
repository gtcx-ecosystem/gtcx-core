---
title: 'EAP staging issuance ceremony (ER-1-08)'
status: current
date: 2026-06-03
owner: protocol-architect
document_id: RUNBOOK-EAP-STAGING-001
review_cycle: quarterly
tags: ['eap', 'protocol-23', 'staging', 'runbook']
---

# EAP staging issuance ceremony (ER-1-08)

**Purpose:** Issue and revoke a staging external-access key via `@gtcx/eap`, publish redacted `eap-issuance-*.json` evidence, and sync the intelligence auth-keys bundle.

**Normative:** [Protocol 23 — External Access Credentials](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/23-external-access-credentials/protocol.md)

---

## Prerequisites

- AWS credentials with Secrets Manager write on `gtcx/eap/staging/clients/*` and `gtcx/intelligence/staging/auth-keys`
- `pnpm install` at gtcx-core root

---

## One-shot ceremony (recommended)

```bash
cd packages/eap
export EAP_ENVIRONMENT=staging
export EAP_PERSIST_EVIDENCE=1
export EAP_CEREMONY_CLIENT_ID=er-1-08-staging-proof   # optional

# 1) Issue + revoke + write evidence under gtcx-core/docs/audit/evidence/
AWS_REGION=us-east-1 pnpm eap:ceremony

# 2) Rebuild intelligence bundle (us-east-1 writer — programmatic default)
AWS_REGION=us-east-1 pnpm eap:sync-bundle

# 3) If ESO SecretStore is af-south-1, mirror bundle there (infra runbook)
#    See docs/operations/coordination/to-gtcx-infrastructure-eap-eso-refresh-2026-06-03.md
```

**Stub (CI / no AWS):**

```bash
EAP_USE_STUB=1 EAP_PERSIST_EVIDENCE=1 EAP_SKIP_SYNC=1 pnpm eap:ceremony
```

---

## HTTP admin alternative

```bash
EAP_PERSIST_EVIDENCE=1 pnpm eap:admin   # port 4070

curl -sS -X POST http://127.0.0.1:4070/v1/admin/credentials/issue \
  -H 'content-type: application/json' \
  -d '{"tenantId":"gtcx-internal-smoke","clientId":"er-1-08-staging-proof","tier":"E0","scopes":["intelligence:health"],"actor":"human://gtcx/security"}'

curl -sS -X POST http://127.0.0.1:4070/v1/admin/credentials/revoke \
  -H 'content-type: application/json' \
  -d '{"tenantId":"gtcx-internal-smoke","clientId":"er-1-08-staging-proof","actor":"human://gtcx/security"}'
```

Responses omit raw secrets (`secret_redacted: true`). Evidence files are written when `EAP_PERSIST_EVIDENCE=1`.

---

## Validate evidence

```bash
node ../gtcx-protocols/tools/validate-eap-issuance-evidence.mjs ../../docs/audit/evidence
```

Expect exit **0**.

---

## Region / secret system-of-record

| Asset               | Canonical path                         | Writer region (gtcx-core default)                                  | Runtime SoR (pods)                                             |
| ------------------- | -------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| EAP client secrets  | `gtcx/eap/staging/clients/<client_id>` | **us-east-1** (`AWS_REGION` on `eap:ceremony` / `eap:sync-bundle`) | —                                                              |
| Intelligence bundle | `gtcx/intelligence/staging/auth-keys`  | **us-east-1** (sync CLI)                                           | **af-south-1** (ESO SecretStore — must match for staging pods) |

When regions diverge, infra mirrors `auth-keys` into `af-south-1` after core sync. Do not paste raw key material into coordination docs.

---

## Handoff to gtcx-intelligence

After `eap:sync-bundle` and infra ESO refresh:

> **Keys synced / ready for AUTH smoke** — run `pnpm check:eap-issuance-evidence` and staging `x-api-key` smoke per INT-S3-08.

Evidence glob for Protocols EAP-05: `gtcx-intelligence/docs/audit/evidence/eap-issuance-*.json` (canonical); gtcx-core copies under `docs/audit/evidence/` for issuance **ceremony** proof.
