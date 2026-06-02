import type { EapIssuanceEvidence, EapEnvironment, EapTier } from './types.js';

export function buildIssuanceEvidence(params: {
  event: EapIssuanceEvidence['event'];
  environment: EapEnvironment;
  tier: EapTier;
  tenantId: string;
  clientId: string;
  credentialFingerprint: string;
  scopes: string[];
  actor: string;
  approvalArtifactRef: string | null;
  secretStorageArn: string;
  servicesSynced: string[];
}): EapIssuanceEvidence {
  return {
    schema: 'gtcx.eap.issuance.v1',
    event: params.event,
    timestamp: new Date().toISOString(),
    environment: params.environment,
    tier: params.tier,
    tenant_id: params.tenantId,
    client_id: params.clientId,
    credential_fingerprint: params.credentialFingerprint,
    scopes: params.scopes,
    issuer: { service: 'eap', actor: params.actor },
    approval: {
      required: params.tier !== 'E0',
      artifact_ref: params.approvalArtifactRef,
    },
    secret_storage: {
      provider: 'aws_secrets_manager',
      arn: params.secretStorageArn,
    },
    services_synced: params.servicesSynced,
    redaction: { secret_included: false },
  };
}

export function evidenceFilename(event: string, clientId: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const slug = clientId.replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
  return `eap-issuance-${date}-${event}-${slug}.json`;
}
