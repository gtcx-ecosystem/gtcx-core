#!/usr/bin/env node
/**
 * ER-1-08 / EAP Phase B — staging issue + revoke ceremony with redacted evidence.
 *
 * Usage (stub, no AWS):
 *   EAP_USE_STUB=1 EAP_PERSIST_EVIDENCE=1 pnpm eap:ceremony
 *
 * Usage (staging AWS):
 *   EAP_ENVIRONMENT=staging AWS_REGION=us-east-1 EAP_PERSIST_EVIDENCE=1 pnpm eap:ceremony
 *   EAP_ENVIRONMENT=staging AWS_REGION=af-south-1 pnpm eap:sync-bundle
 */
import { createEapAdminService } from './admin.js';
import { AwsSecretsManagerWriter } from './aws-secrets.js';
import { defaultEvidenceDir } from './evidence.js';
import { rebuildIntelligenceBundleFromEapSecrets } from './sync-intelligence.js';

const environment = (process.env['EAP_ENVIRONMENT'] ?? 'staging') as
  | 'staging'
  | 'production'
  | 'sandbox';

const clientId = process.env['EAP_CEREMONY_CLIENT_ID'] ?? 'er-1-08-staging-proof';
const tenantId = process.env['EAP_CEREMONY_TENANT_ID'] ?? 'gtcx-internal-smoke';
const evidenceDir = process.env['EAP_EVIDENCE_DIR'] ?? defaultEvidenceDir();

const serviceOptions: Parameters<typeof createEapAdminService>[0] = {
  environment,
  evidenceDir,
  servicesSynced: [`gtcx-intelligence/${environment}`],
};

if (process.env['EAP_USE_STUB'] !== '1') {
  serviceOptions.secretWriter = new AwsSecretsManagerWriter({ environment });
}

const eap = createEapAdminService(serviceOptions);

const issued = await eap.issueApiKey({
  tenantId,
  clientId,
  tier: 'E0',
  scopes: ['intelligence:health'],
  actor: 'human://gtcx/core-er-1-08-ceremony',
  approvalArtifactRef: null,
});

console.log(
  JSON.stringify(
    {
      step: 'issue',
      clientId: issued.clientId,
      credentialFingerprint: issued.credentialFingerprint,
      evidencePath: issued.evidencePath,
      secretStorageArn: issued.secretStorageArn,
      ok: true,
    },
    null,
    2
  )
);

if (process.env['EAP_SKIP_SYNC'] !== '1' && process.env['EAP_USE_STUB'] !== '1') {
  const region = process.env['AWS_REGION'] ?? 'us-east-1';
  const sync = await rebuildIntelligenceBundleFromEapSecrets({
    environment,
    region,
  });
  console.log(JSON.stringify({ step: 'sync-bundle', ...sync }, null, 2));
}

const revoked = await eap.revoke({
  tenantId,
  clientId,
  actor: 'human://gtcx/core-er-1-08-ceremony',
});

console.log(
  JSON.stringify(
    {
      step: 'revoke',
      revoked: revoked.revoked,
      evidencePath: revoked.evidencePath,
      ok: true,
    },
    null,
    2
  )
);
