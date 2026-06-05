---
repo: gtcx-infrastructure
date: '2026-06-02'
type: inbound-request
priority: P1
status: 'ready-for-execution'
---

# Inbound: EAP Auth-Keys Bundle Sync for Staging

## Ask

Run EAP sync to populate `gtcx/intelligence/staging/auth-keys` with the
`AUTH_API_KEYS + AUTH_KEY_ROLES` bundle.

## What gtcx-core Implemented

### New function: `rebuildIntelligenceBundleFromEapSecrets()`

- **File:** `03-platform/packages/eap/03-platform/src/sync-intelligence.ts`
- **What it does:**
  1. Lists all secrets in AWS Secrets Manager matching `gtcx/eap/staging/clients/*`
  2. Reads each secret, extracts `api_key`
  3. Builds `AuthKeysBundle` (`AUTH_API_KEYS` + `AUTH_KEY_ROLES`)
  4. Writes bundle to `gtcx/intelligence/staging/auth-keys`
- **Output:** `{ secretName, bundle, keysFound, keysSkipped }`

### New CLI script

- **File:** `03-platform/packages/eap/03-platform/src/cli-sync-bundle.ts`
- **Script:** `pnpm eap:sync-bundle` (from `03-platform/packages/eap/`)
- **Env vars:**
  - `EAP_ENVIRONMENT` (default: `staging`)
  - `AWS_REGION` (default: `us-east-1`)
  - Standard AWS credential chain (IAM role, env vars, or profile)

## Execution Steps

```bash
cd 03-platform/packages/eap
EAP_ENVIRONMENT=staging AWS_REGION=us-east-1 pnpm eap:sync-bundle
```

Expected output:

```json
{
  "secret_name": "gtcx/intelligence/staging/auth-keys",
  "keys_found": 12,
  "keys_skipped": 0,
  "auth_api_keys_count": 12,
  "auth_key_roles_count": 12,
  "ok": true
}
```

## What Infrastructure Does Next

After gtcx-core runs the sync and confirms the bundle is written:

1. **Force ESO refresh** so the K8s secret `gtcx-intelligence-staging-auth-keys`
   picks up the new value from AWS Secrets Manager.
2. **Verify** staging pods can read `AUTH_API_KEYS` and `AUTH_KEY_ROLES` from
   the mounted secret.
3. **Acknowledge** in this ticket when ESO sync is confirmed.

## Rollback

If the bundle is corrupt, re-run the sync. The function rebuilds from scratch
by scanning all EAP client secrets — it is idempotent.

## References

- `03-platform/packages/eap/03-platform/src/sync-intelligence.ts` — `rebuildIntelligenceBundleFromEapSecrets()`
- `03-platform/packages/eap/03-platform/src/cli-sync-bundle.ts` — CLI entry point
- `03-platform/packages/eap/package.json` — `eap:sync-bundle` script
