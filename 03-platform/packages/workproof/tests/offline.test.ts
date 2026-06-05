import { describe, it, expect } from 'vitest';

import {
  SyncStatusSchema,
  ConflictResolutionStrategySchema,
  OfflineMetadataSchema,
  OfflineWorkProofSchema,
  SyncQueueEntrySchema,
  SyncQueuePrioritySchema,
  SyncConflictSchema,
} from '../src/offline/schemas';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const validClaim = {
  predicateType: 'IdentityVerified' as const,
  predicateURI: 'tradepass://workproof/identity/verified',
  value: { kind: 'boolean', value: true },
  evidence: [{ type: 'government_id' as const, hash: 'sha256:abc123', timestamp: 1704067200000 }],
  confidence: 0.95,
  issuedAt: 1704067200000,
  proof: {
    type: 'Ed25519Signature2020' as const,
    created: '2024-01-01T00:00:00Z',
    verificationMethod: 'did:gtcx:issuer#key-1',
    proofValue: 'z123abc',
  },
};

const validOfflineMetadata = {
  generatedOffline: true as const,
  deviceId: 'device-001',
  localSequenceNumber: 0,
  syncStatus: 'pending' as const,
  syncAttempts: 0,
};

const validOfflineWorkProof = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiableCredential', 'WorkProof'],
  issuer: 'did:gtcx:issuer-001',
  issuanceDate: '2024-01-01T00:00:00Z',
  credentialSubject: {
    id: 'did:gtcx:subject-001',
    proofType: 'ProductionEvent' as const,
    tradepassId: 'tp-001',
    issuerId: 'issuer-001',
    issuerRole: 'certifier',
    claims: [validClaim],
  },
  workProofVersion: '2.1' as const,
  offlineMetadata: validOfflineMetadata,
};

// ---------------------------------------------------------------------------
// SyncStatusSchema
// ---------------------------------------------------------------------------

describe('SyncStatusSchema', () => {
  it.each(['pending', 'syncing', 'synced', 'conflict'] as const)(
    'accepts sync status "%s"',
    (status) => {
      const result = SyncStatusSchema.safeParse(status);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toBe(status);
    }
  );

  it('rejects an invalid sync status', () => {
    const result = SyncStatusSchema.safeParse('unknown');
    expect(result.success).toBe(false);
  });

  it('rejects an empty string', () => {
    const result = SyncStatusSchema.safeParse('');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// ConflictResolutionStrategySchema
// ---------------------------------------------------------------------------

describe('ConflictResolutionStrategySchema', () => {
  it.each(['server_wins', 'client_wins', 'manual'] as const)(
    'accepts conflict resolution strategy "%s"',
    (strategy) => {
      const result = ConflictResolutionStrategySchema.safeParse(strategy);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toBe(strategy);
    }
  );

  it('rejects an invalid strategy', () => {
    const result = ConflictResolutionStrategySchema.safeParse('auto_merge');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// OfflineMetadataSchema
// ---------------------------------------------------------------------------

describe('OfflineMetadataSchema', () => {
  it('accepts valid offline metadata and checks parsed fields', () => {
    const result = OfflineMetadataSchema.safeParse(validOfflineMetadata);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.generatedOffline).toBe(true);
      expect(result.data.deviceId).toBe('device-001');
      expect(result.data.localSequenceNumber).toBe(0);
      expect(result.data.syncStatus).toBe('pending');
      expect(result.data.syncAttempts).toBe(0);
    }
  });

  it('rejects generatedOffline = false (must be literal true)', () => {
    const result = OfflineMetadataSchema.safeParse({
      ...validOfflineMetadata,
      generatedOffline: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('invalid_value');
  });

  it('accepts localSequenceNumber at 0', () => {
    const result = OfflineMetadataSchema.safeParse({
      ...validOfflineMetadata,
      localSequenceNumber: 0,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.localSequenceNumber).toBe(0);
  });

  it('rejects negative localSequenceNumber', () => {
    const result = OfflineMetadataSchema.safeParse({
      ...validOfflineMetadata,
      localSequenceNumber: -1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer localSequenceNumber', () => {
    const result = OfflineMetadataSchema.safeParse({
      ...validOfflineMetadata,
      localSequenceNumber: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('accepts syncAttempts at 0', () => {
    const result = OfflineMetadataSchema.safeParse({ ...validOfflineMetadata, syncAttempts: 0 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.syncAttempts).toBe(0);
  });

  it('rejects negative syncAttempts', () => {
    const result = OfflineMetadataSchema.safeParse({ ...validOfflineMetadata, syncAttempts: -1 });
    expect(result.success).toBe(false);
  });

  it('accepts optional lastSyncAttempt when provided', () => {
    const result = OfflineMetadataSchema.safeParse({
      ...validOfflineMetadata,
      lastSyncAttempt: 1704067200000,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.lastSyncAttempt).toBe(1704067200000);
  });

  it('accepts optional conflictResolutionStrategy', () => {
    const result = OfflineMetadataSchema.safeParse({
      ...validOfflineMetadata,
      conflictResolutionStrategy: 'server_wins',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.conflictResolutionStrategy).toBe('server_wins');
  });
});

// ---------------------------------------------------------------------------
// OfflineWorkProofSchema
// ---------------------------------------------------------------------------

describe('OfflineWorkProofSchema', () => {
  it('accepts a valid OfflineWorkProof and checks both layers of fields', () => {
    const result = OfflineWorkProofSchema.safeParse(validOfflineWorkProof);
    expect(result.success).toBe(true);
    if (result.success) {
      // WorkProof layer
      expect(result.data['@context']).toEqual(['https://www.w3.org/2018/credentials/v1']);
      expect(result.data.type).toContain('VerifiableCredential');
      expect(result.data.workProofVersion).toBe('2.1');
      expect(result.data.credentialSubject.proofType).toBe('ProductionEvent');
      // Offline layer
      expect(result.data.offlineMetadata.generatedOffline).toBe(true);
      expect(result.data.offlineMetadata.deviceId).toBe('device-001');
      expect(result.data.offlineMetadata.syncStatus).toBe('pending');
    }
  });

  it('rejects OfflineWorkProof without offlineMetadata', () => {
    const noMeta = { ...validOfflineWorkProof };
    delete (noMeta as Record<string, unknown>)['offlineMetadata'];
    const result = OfflineWorkProofSchema.safeParse(noMeta);
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// SyncQueueEntrySchema
// ---------------------------------------------------------------------------

describe('SyncQueueEntrySchema', () => {
  it.each(['high', 'normal', 'low'] as const)('accepts priority "%s"', (priority) => {
    const entry = {
      queueId: 'q-001',
      workProof: validOfflineWorkProof,
      enqueuedAt: 1704067200000,
      priority,
    };
    const result = SyncQueueEntrySchema.safeParse(entry);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.queueId).toBe('q-001');
      expect(result.data.priority).toBe(priority);
      expect(result.data.enqueuedAt).toBe(1704067200000);
    }
  });

  it('rejects invalid priority', () => {
    const result = SyncQueuePrioritySchema.safeParse('urgent');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// SyncConflictSchema
// ---------------------------------------------------------------------------

describe('SyncConflictSchema', () => {
  it('accepts a valid conflict with required fields', () => {
    const conflict = {
      queueId: 'q-001',
      localWorkProof: validOfflineWorkProof,
      conflictReason: 'Duplicate work proof detected on server',
      detectedAt: 1704067200000,
    };
    const result = SyncConflictSchema.safeParse(conflict);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.queueId).toBe('q-001');
      expect(result.data.conflictReason).toBe('Duplicate work proof detected on server');
      expect(result.data.serverWorkProofId).toBeUndefined();
    }
  });

  it('accepts optional serverWorkProofId', () => {
    const conflict = {
      queueId: 'q-002',
      localWorkProof: validOfflineWorkProof,
      serverWorkProofId: 'wp-server-001',
      conflictReason: 'Version mismatch',
      detectedAt: 1704067200000,
    };
    const result = SyncConflictSchema.safeParse(conflict);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.serverWorkProofId).toBe('wp-server-001');
  });

  it('rejects empty conflictReason', () => {
    const result = SyncConflictSchema.safeParse({
      queueId: 'q-003',
      localWorkProof: validOfflineWorkProof,
      conflictReason: '',
      detectedAt: 1704067200000,
    });
    expect(result.success).toBe(false);
  });
});
