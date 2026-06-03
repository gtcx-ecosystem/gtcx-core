import {
  buildIssuanceEvidence,
  defaultEvidenceDir,
  evidenceFilename,
  writeIssuanceEvidenceFile,
} from './evidence.js';
import { fingerprintSecret, generateApiKeySecret } from './fingerprint.js';
import { InMemoryEapRegistry } from './registry.js';
import { StubSecretWriter, type SecretWriter } from './secrets.js';
import type {
  EapEnvironment,
  IssueApiKeyInput,
  IssueApiKeyResult,
  ListFingerprintsResult,
  RevokeInput,
} from './types.js';

export interface EapAdminServiceOptions {
  environment: EapEnvironment;
  registry?: InMemoryEapRegistry;
  secretWriter?: SecretWriter;
  servicesSynced?: string[];
  /** When set, issue/revoke write redacted `eap-issuance-*.json` artifacts. */
  evidenceDir?: string;
}

export class EapAdminService {
  private readonly environment: EapEnvironment;
  private readonly registry: InMemoryEapRegistry;
  private readonly secretWriter: SecretWriter;
  private readonly servicesSynced: string[];
  private readonly evidenceDir?: string;

  constructor(options: EapAdminServiceOptions) {
    this.environment = options.environment;
    this.registry = options.registry ?? new InMemoryEapRegistry();
    this.secretWriter = options.secretWriter ?? new StubSecretWriter();
    this.servicesSynced = options.servicesSynced ?? [`gtcx-intelligence/${options.environment}`];
    if (options.evidenceDir !== undefined) {
      this.evidenceDir = options.evidenceDir;
    }
  }

  getRegistry(): InMemoryEapRegistry {
    return this.registry;
  }

  async issueApiKey(input: IssueApiKeyInput): Promise<IssueApiKeyResult> {
    const existing = this.registry.getCredential(input.tenantId, input.clientId);
    if (existing?.status === 'active') {
      throw new Error(`Credential already active for client ${input.clientId}`);
    }

    if (!this.registry.getTenant(input.tenantId)) {
      this.registry.upsertTenant({
        tenantId: input.tenantId,
        displayName: input.tenantId,
        createdAt: new Date().toISOString(),
      });
    }

    const secret = generateApiKeySecret();
    const credentialFingerprint = fingerprintSecret(secret);
    const { arn } = await this.secretWriter.writeClientSecret({
      environment: this.environment,
      clientId: input.clientId,
      secret,
      fingerprint: credentialFingerprint,
      tenantId: input.tenantId,
      tier: input.tier,
    });

    const issuedAt = new Date().toISOString();
    this.registry.saveCredential({
      tenantId: input.tenantId,
      clientId: input.clientId,
      tier: input.tier,
      environment: this.environment,
      scopes: input.scopes,
      status: 'active',
      credentialFingerprint,
      secretStorageArn: arn,
      issuedAt,
    });

    const evidence = buildIssuanceEvidence({
      event: 'issue',
      environment: this.environment,
      tier: input.tier,
      tenantId: input.tenantId,
      clientId: input.clientId,
      credentialFingerprint,
      scopes: input.scopes,
      actor: input.actor,
      approvalArtifactRef: input.approvalArtifactRef ?? null,
      secretStorageArn: arn,
      servicesSynced: this.servicesSynced,
    });

    const evidencePath = evidenceFilename('issue', input.clientId);
    if (this.evidenceDir) {
      await writeIssuanceEvidenceFile(this.evidenceDir, evidence, evidencePath);
    }

    return {
      tenantId: input.tenantId,
      clientId: input.clientId,
      tier: input.tier,
      environment: this.environment,
      credentialFingerprint,
      secretStorageArn: arn,
      secret,
      evidencePath,
    };
  }

  async revoke(input: RevokeInput): Promise<{ revoked: boolean; evidencePath: string }> {
    const record = this.registry.getCredential(input.tenantId, input.clientId);
    if (!record || record.status === 'revoked') {
      throw new Error(`No active credential for client ${input.clientId}`);
    }

    record.status = 'revoked';
    record.revokedAt = new Date().toISOString();
    this.registry.saveCredential(record);

    const evidence = buildIssuanceEvidence({
      event: 'revoke',
      environment: this.environment,
      tier: record.tier,
      tenantId: input.tenantId,
      clientId: input.clientId,
      credentialFingerprint: record.credentialFingerprint,
      scopes: record.scopes,
      actor: input.actor,
      approvalArtifactRef: null,
      secretStorageArn: record.secretStorageArn,
      servicesSynced: this.servicesSynced,
    });

    const evidencePath = evidenceFilename('revoke', input.clientId);
    if (this.evidenceDir) {
      await writeIssuanceEvidenceFile(this.evidenceDir, evidence, evidencePath);
    }

    return {
      revoked: true,
      evidencePath,
    };
  }

  listFingerprints(tenantId?: string): ListFingerprintsResult {
    const credentials = this.registry.listCredentials(tenantId).map((c) => ({
      clientId: c.clientId,
      tenantId: c.tenantId,
      tier: c.tier,
      status: c.status,
      credentialFingerprint: c.credentialFingerprint,
      issuedAt: c.issuedAt,
    }));
    return { credentials };
  }
}

export function createEapAdminService(options: EapAdminServiceOptions): EapAdminService {
  const evidenceDir =
    options.evidenceDir ??
    (process.env['EAP_PERSIST_EVIDENCE'] === '1' ? defaultEvidenceDir() : undefined);
  return new EapAdminService({
    ...options,
    ...(evidenceDir !== undefined ? { evidenceDir } : {}),
  });
}

export type { IssueApiKeyInput, IssueApiKeyResult, ListFingerprintsResult, RevokeInput };
