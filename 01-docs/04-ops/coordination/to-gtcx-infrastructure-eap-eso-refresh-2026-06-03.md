---
title: 'Outbound — EAP auth-keys bundle synced; request ESO force-refresh'
status: current
date: 2026-06-03
owner: gtcx-core
role: protocol-architect
document_id: COORD-OUT-INFRA-001
to: gtcx-infrastructure
from: gtcx-core
protocol: gtcx-docs/01-docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: on-change
tier: standard
tags: ['coordination', 'outbound', 'eap', 'eso', 'infrastructure']
---

# Outbound — EAP auth-keys bundle synced; request ESO force-refresh

**From:** gtcx-core  
**To:** gtcx-infrastructure  
**Topic:** EAP Phase B auth-keys bundle synchronization → ESO refresh  
**Work ID:** CORE-001  
**Priority:** P1  
**Status:** gtcx-core done → awaiting infrastructure ack

---

## What gtcx-core did

Executed `pnpm eap:sync-bundle` for staging environment:

```bash
cd 03-platform/packages/eap
EAP_ENVIRONMENT=staging AWS_REGION=us-east-1 pnpm eap:sync-bundle
```

Result:

```json
{
  "secret_name": "gtcx/intelligence/staging/auth-keys",
  "keys_found": 2,
  "keys_skipped": 0,
  "auth_api_keys_count": 2,
  "auth_key_roles_count": 2,
  "ok": true
}
```

### Secret details

| Field          | Value                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------- |
| Secret name    | `gtcx/intelligence/staging/auth-keys`                                                             |
| ARN            | `arn:aws:secretsmanager:us-east-1:348389439381:secret:gtcx/intelligence/staging/auth-keys-6GRMKa` |
| VersionId      | `4d01fb8c-9770-409c-ad73-ddff9887bc45`                                                            |
| CreatedDate    | `2026-06-03T07:39:24.118000+02:00`                                                                |
| Source secrets | `gtcx/eap/staging/clients/*`                                                                      |

### Bundle contents

Redacted — two active API keys and role mappings. Inspect only via AWS Secrets Manager or staging pod env (never paste raw values into coordination docs).

---

## What gtcx-infrastructure did

1. ✅ **Force-refreshed ESO** — annotation + deployment restart triggered reconciliation
2. ✅ **Verified** staging pods read updated `AUTH_API_KEYS` and `AUTH_KEY_ROLES`
3. ✅ **Root cause found:** ESO SecretStore region `af-south-1`; gtcx-core EAP sync wrote to `us-east-1`. Secret in `af-south-1` updated to match.

### Verification results (2026-06-03T09:20Z)

```bash
kubectl get secret intelligence-secrets -n intelligence -o jsonpath='{.data.AUTH_API_KEYS}' | base64 -d
# → [REDACTED — matches SM bundle; 2 keys]

kubectl exec -n intelligence deployment/intelligence-orchestrator -- env | grep AUTH
# → AUTH_API_KEYS and AUTH_KEY_ROLES present; values match synced bundle
```

**Auth verified:** `/policy/rules` 401 without key → 200 with valid key.

---

## Impact

Unblocks **XR-201** (intelligence-staging auth gate) → **XR-202** (INT-S3-08 re-smoke).

---

## Related

- gtcx-core coordination: `01-docs/04-ops/coordination/remaining-cross-repo-work-2026-06-02.md` § CORE-001
- Ecosystem bridge: `gtcx-protocols/01-docs/04-ops/coordination/cross-repo-agent-bridge.md`
- Intelligence tracker: `gtcx-intelligence/01-docs/04-ops/coordination/remaining-cross-repo-work-2026-06-02.md` § INT-S3-08
