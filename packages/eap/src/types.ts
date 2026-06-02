export type EapTier = 'E0' | 'E1' | 'E2' | 'E3' | 'E4';
export type EapEnvironment = 'sandbox' | 'staging' | 'production';
export type CredentialStatus = 'active' | 'revoked';

export interface TenantRecord {
  tenantId: string;
  displayName: string;
  createdAt: string;
}

export interface ClientCredentialRecord {
  tenantId: string;
  clientId: string;
  tier: EapTier;
  environment: EapEnvironment;
  scopes: string[];
  status: CredentialStatus;
  credentialFingerprint: string;
  secretStorageArn: string;
  issuedAt: string;
  revokedAt?: string;
}

export interface IssueApiKeyInput {
  tenantId: string;
  clientId: string;
  tier: EapTier;
  scopes: string[];
  actor: string;
  approvalArtifactRef?: string | null;
}

export interface IssueApiKeyResult {
  tenantId: string;
  clientId: string;
  tier: EapTier;
  environment: EapEnvironment;
  credentialFingerprint: string;
  secretStorageArn: string;
  /** Present once at issue time — callers must persist to SM, not logs. */
  secret: string;
  evidencePath: string;
}

export interface RevokeInput {
  tenantId: string;
  clientId: string;
  actor: string;
}

export interface ListFingerprintsResult {
  credentials: Array<{
    clientId: string;
    tenantId: string;
    tier: EapTier;
    status: CredentialStatus;
    credentialFingerprint: string;
    issuedAt: string;
  }>;
}

export interface EapIssuanceEvidence {
  schema: 'gtcx.eap.issuance.v1';
  event: 'issue' | 'rotate' | 'revoke';
  timestamp: string;
  environment: EapEnvironment;
  tier: EapTier;
  tenant_id: string;
  client_id: string;
  credential_fingerprint: string;
  scopes: string[];
  issuer: { service: 'eap'; actor: string };
  approval: { required: boolean; artifact_ref: string | null };
  secret_storage: { provider: 'aws_secrets_manager'; arn: string };
  services_synced: string[];
  redaction: { secret_included: false };
}
