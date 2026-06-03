---
title: 'Outbound — EAP auth-keys bundle synced; request ESO force-refresh'
status: current
date: 2026-06-03
owner: gtcx-core
role: protocol-architect
document_id: COORD-OUT-INFRA-001
to: gtcx-infrastructure
from: gtcx-core
protocol: gtcx-docs/docs/governance/protocols/24-cross-repo-coordination/protocol.md
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
cd packages/eap
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

```json
{
  "AUTH_API_KEYS": "gtcx_fxT0AMptSONeWWRmAdBR2y5iU3xtdB35,gtcx_SR9w3S2jR3_12oAoqKwUV2zQEkDgXt0y",
  "AUTH_KEY_ROLES": "gtcx_fxT0AMptSONeWWRmAdBR2y5iU3xtdB35:intelligence,gtcx_SR9w3S2jR3_12oAoqKwUV2zQEkDgXt0y:intelligence"
}
```

---

## What gtcx-infrastructure needs to do

1. **Force-refresh ESO** so the K8s secret `gtcx-intelligence-staging-auth-keys` picks up the new VersionId
2. **Verify** staging pods read `AUTH_API_KEYS` and `AUTH_KEY_ROLES` correctly
3. **Acknowledge** in this ticket or via `baseline-os` `pnpm ecosystem:repo:report-work`

### Verification commands

```bash
# Check K8s secret
kubectl get secret gtcx-intelligence-staging-auth-keys -n intelligence -o jsonpath='{.data.AUTH_API_KEYS}' | base64 -d

# Check pod env
kubectl exec -n intelligence deployment/intelligence-sdk -- env | grep AUTH
```

---

## Impact

Unblocks **XR-201** (intelligence-staging auth gate) → **XR-202** (INT-S3-08 re-smoke).

---

## Related

- gtcx-core coordination: `docs/operations/coordination/remaining-cross-repo-work-2026-06-02.md` § CORE-001
- Ecosystem bridge: `gtcx-protocols/docs/operations/coordination/cross-repo-agent-bridge.md`
- Intelligence tracker: `gtcx-intelligence/docs/operations/coordination/remaining-cross-repo-work-2026-06-02.md` § INT-S3-08
