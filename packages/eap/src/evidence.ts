import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

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

/** Default evidence directory under gtcx-core (override with `EAP_EVIDENCE_DIR`). */
export function defaultEvidenceDir(): string {
  return (
    process.env['EAP_EVIDENCE_DIR'] ?? join(process.cwd(), '..', '..', 'docs', 'audit', 'evidence')
  );
}

/** Persist redacted issuance JSON for Protocol 23 / ER-1-08. */
export async function writeIssuanceEvidenceFile(
  evidenceDir: string,
  evidence: EapIssuanceEvidence,
  filename: string
): Promise<string> {
  const fullPath = join(evidenceDir, filename);
  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  return fullPath;
}
