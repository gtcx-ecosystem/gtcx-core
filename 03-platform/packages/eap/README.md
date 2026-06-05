# @gtcx/eap — External Access Plane (Phase B skeleton)

Control plane for **outbound** API credentials (Protocol 23). Complements Baseline Vault (inbound only).

## Scope (EAP-02 — shipped skeleton)

- `createEapAdminService()` — issue / revoke / list fingerprints
- `AwsSecretsManagerWriter` — writes `gtcx/eap/<env>/clients/<client_id>`
- `syncApiKeyToIntelligenceBundle()` — merges into `gtcx/intelligence/<env>/auth-keys`
- HTTP admin: `pnpm eap:admin` (port 4070, `EAP_ADMIN_TOKEN` optional)
- Redacted `gtcx.eap.issuance.v1` evidence builder

## Usage

```typescript
import { createEapAdminService } from '@gtcx/eap/admin';

const eap = createEapAdminService({ environment: 'staging' });
const issued = await eap.issueApiKey({
  tenantId: 'gtcx-internal-smoke',
  clientId: 'smoke-2026-06',
  tier: 'E0',
  scopes: ['intelligence:health'],
  actor: 'human://gtcx/security',
  approvalArtifactRef: 'docs/audit/evidence/eap-approval-smoke.json',
});
// issued.credentialFingerprint — never log issued.secret in production logs
```

See `gtcx-docs/docs/governance/protocols/23-external-access-credentials/`.
