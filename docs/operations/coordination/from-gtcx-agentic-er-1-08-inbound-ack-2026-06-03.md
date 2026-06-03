---
title: 'Inbound ack — ER-1-08 EAP Phase B staging proof (gtcx-core)'
status: current
date: 2026-06-03
owner: gtcx-core
role: protocol-architect
document_id: COORD-IN-AGENTIC-ER108
from: gtcx-agentic
to: gtcx-core
reply_to: ER-1-08
protocol: gtcx-docs/docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: on-change
tier: standard
tags: ['coordination', 'inbound-ack', 'eap', 'er-1-08']
---

# Inbound ack — ER-1-08 EAP Phase B staging proof

**From:** gtcx-core  
**Re:** ER-1-08 (EAP Phase B) — staging proof closure  
**Status:** gtcx-core acceptance evidence posted (issuance + revoke + region SoR + intel handoff)

---

## 1 — Issue + revoke runbook / ceremony

| Resource   | Path                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| Runbook    | [docs/devops/runbooks/eap-staging-issuance-ceremony.md](../../devops/runbooks/eap-staging-issuance-ceremony.md) |
| CLI        | `cd packages/eap && EAP_PERSIST_EVIDENCE=1 pnpm eap:ceremony`                                                   |
| HTTP admin | `pnpm eap:admin` — `POST /v1/admin/credentials/issue` and `/revoke`                                             |

Ceremony client id for this proof row: `er-1-08-staging-proof` (tenant `gtcx-internal-smoke`, redacted in evidence).

---

## 2 — Redacted issuance artifacts (gtcx-core)

| Event  | File                                                                                                                                                            |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| issue  | [docs/audit/evidence/eap-issuance-2026-06-03-issue-er-1-08-staging-proof.json](../../audit/evidence/eap-issuance-2026-06-03-issue-er-1-08-staging-proof.json)   |
| revoke | [docs/audit/evidence/eap-issuance-2026-06-03-revoke-er-1-08-staging-proof.json](../../audit/evidence/eap-issuance-2026-06-03-revoke-er-1-08-staging-proof.json) |

**Validator (exit 0):**

```bash
node ../gtcx-protocols/tools/validate-eap-issuance-evidence.mjs docs/audit/evidence
```

No raw secrets in artifacts (`redaction.secret_included: false`).

**Related (bundle sync, not issuance):** [to-gtcx-infrastructure-eap-eso-refresh-2026-06-03.md](./to-gtcx-infrastructure-eap-eso-refresh-2026-06-03.md)

**Canonical intelligence copy (prior smoke):** `gtcx-intelligence/docs/audit/evidence/eap-issuance-2026-06-02-issue-smoke-2026-06-rotated.json`

---

## 3 — Region / secret system-of-record

| Secret              | Path                                   | gtcx-core writer                              | Staging runtime SoR                                              |
| ------------------- | -------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------- |
| EAP client          | `gtcx/eap/staging/clients/<client_id>` | **us-east-1** (`AWS_REGION` on ceremony/sync) | —                                                                |
| Intelligence bundle | `gtcx/intelligence/staging/auth-keys`  | **us-east-1** (`pnpm eap:sync-bundle`)        | **af-south-1** (ESO SecretStore — infra mirrors after core sync) |

Root-cause note: ESO reads `af-south-1`; programmatic sync defaults `us-east-1`. Both must converge before AUTH smoke — see infra outbound ack above.

---

## 4 — Handoff to gtcx-intelligence

**Keys synced / ready for AUTH smoke** after:

1. `AWS_REGION=us-east-1 EAP_ENVIRONMENT=staging pnpm eap:sync-bundle` (gtcx-core)
2. Infra ESO force-refresh + `af-south-1` mirror (gtcx-infrastructure — completed 2026-06-03 per outbound thread)

**Intelligence verification row:**

```bash
cd gtcx-intelligence
pnpm check:eap-issuance-evidence
# staging: valid x-api-key → 200; missing/revoked → 401 (INT-S3-08)
```

Report **command + exit code** on the bridge when smoke completes.

---

## 5 — gtcx-protocols EAP-05 validator

| Item                              | Value                                                          |
| --------------------------------- | -------------------------------------------------------------- |
| Validator                         | `gtcx-protocols/tools/validate-eap-issuance-evidence.mjs`      |
| CI command                        | `pnpm check:eap-issuance-evidence` (protocols repo root)       |
| Canonical glob (intelligence SoR) | `gtcx-intelligence/docs/audit/evidence/eap-issuance-*.json`    |
| gtcx-core ceremony glob           | `gtcx-core/docs/audit/evidence/eap-issuance-*.json` (this ack) |

Cross-repo check from protocols:

```bash
pnpm check:eap-issuance-evidence -- ../gtcx-intelligence/docs/audit/evidence
pnpm check:eap-issuance-evidence -- ../gtcx-core/docs/audit/evidence
```

No contract change required — existing glob covers `eap-issuance-*.json` with schema `gtcx.eap.issuance.v1`.

---

## ER-1-08 checklist (gtcx-core owner)

| #   | Ask                       | Status                                                     |
| --- | ------------------------- | ---------------------------------------------------------- |
| 1   | Issue + revoke ceremony   | **done** — runbook + `pnpm eap:ceremony`                   |
| 2   | Redacted issuance JSON    | **done** — `docs/audit/evidence/eap-issuance-2026-06-03-*` |
| 3   | Region SoR                | **done** — table above                                     |
| 4   | Intelligence handoff line | **done** — §4                                              |
| 5   | Protocols validator       | **done** — §5; validator exit 0 on core evidence dir       |

**gtcx-agentic:** safe to mark ER-1-08 closed on program tracker when intelligence posts AUTH smoke exit code.

---

## Protocols hub log row (append to SoR)

**Repo:** `gtcx-protocols` · **File:** `docs/operations/coordination/cross-repo-agent-log.md`

| Timestamp (UTC)   | Repo      | Work ID | Status | Summary                                                                                                                | Evidence                                                                                              |
| ----------------- | --------- | ------- | ------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 2026-06-04T23:00Z | gtcx-core | ER-1-08 | done   | EAP staging issue/revoke ceremony; redacted `eap-issuance-2026-06-03-*` under `docs/audit/evidence/`; region SoR in §3 | `docs/operations/coordination/from-gtcx-agentic-er-1-08-inbound-ack-2026-06-03.md` · commit `ba63d0d` |

**Posture:** gtcx-core owner work is **done** — no further automatable implementation in this repo. Remaining ER-1-08 exit is **hub coordination** (sibling acks on the protocols log + intelligence AUTH smoke witness), not agentic code.
