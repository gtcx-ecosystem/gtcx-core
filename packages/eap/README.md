# @gtcx/eap — External Access Plane (Phase B skeleton)

Control plane for **outbound** API credentials (Protocol 23). Complements Baseline Vault (inbound only).

## Scope (EAP-02)

- Admin API: issue / revoke / list fingerprints
- In-memory registry (Postgres in production)
- AWS Secrets Manager writer interface (stub logs ARN path)
- Redacted `eap-issuance-*.json` evidence emitter

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
