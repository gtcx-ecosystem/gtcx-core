import { describe, it, expect, beforeEach } from 'vitest';

import { CredentialCache } from '../src/offline/credential-cache';
import type { CachedCredential } from '../src/offline/credential-cache';

// =============================================================================
// HELPERS
// =============================================================================

function createCredential(overrides: Partial<CachedCredential> = {}): CachedCredential {
  const now = new Date();
  return {
    id: 'cred-001',
    type: 'TRADEPASS',
    holderId: 'user-001',
    holderPublicKey: 'abc123',
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    offlineExpiresAt: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(),
    signatureChain: [
      {
        signature: 'sig1',
        signerPublicKey: 'key1',
        signedAt: now.toISOString(),
      },
    ],
    dataHash: 'abcd1234',
    lastRevocationCheckAt: now.toISOString(),
    syncedAt: now.toISOString(),
    syncRequired: false,
    ...overrides,
  };
}

// =============================================================================
// isCredentialValidOffline — CACHE EXPIRY
// =============================================================================

describe('isCredentialValidOffline', () => {
  let cache: CredentialCache;

  beforeEach(() => {
    cache = new CredentialCache({
      maxOfflineHours: 72,
      revocationCheckIntervalHours: 24,
      maxCachedCredentials: 100,
      autoCleanupEnabled: true,
    });
  });

  it('should accept a valid credential', () => {
    const cred = createCredential();
    const result = cache.isCredentialValidOffline(cred);
    expect(result.valid).toBe(true);
    expect(result.reason).toBeUndefined();
    expect(result.warning).toBeUndefined();
  });

  it('should reject credential with expired offlineExpiresAt', () => {
    const cred = createCredential({
      offlineExpiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    const result = cache.isCredentialValidOffline(cred);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('OFFLINE_EXPIRED');
  });

  it('should reject credential with expired expiresAt', () => {
    const cred = createCredential({
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    const result = cache.isCredentialValidOffline(cred);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('EXPIRED');
  });

  it('should warn on stale revocation check', () => {
    const cred = createCredential({
      lastRevocationCheckAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    });
    const result = cache.isCredentialValidOffline(cred);
    expect(result.valid).toBe(true);
    expect(result.warning).toBe('REVOCATION_CHECK_STALE');
    expect(result.message).toBeDefined();
  });

  it('should respect custom revocationCheckIntervalHours', () => {
    const shortCache = new CredentialCache({
      revocationCheckIntervalHours: 1, // 1 hour
    });
    const cred = createCredential({
      lastRevocationCheckAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    });
    const result = shortCache.isCredentialValidOffline(cred);
    expect(result.valid).toBe(true);
    expect(result.warning).toBe('REVOCATION_CHECK_STALE');
  });

  it('should check offline expiry before regular expiry', () => {
    // Both expired, but offline expiry is checked first
    const cred = createCredential({
      offlineExpiresAt: new Date(Date.now() - 2000).toISOString(),
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    const result = cache.isCredentialValidOffline(cred);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('OFFLINE_EXPIRED');
  });
});

// =============================================================================
// calculateOfflineExpiry
// =============================================================================

describe('calculateOfflineExpiry', () => {
  it('should add maxOfflineHours to the issued date', () => {
    const cache = new CredentialCache({ maxOfflineHours: 72 });
    const issuedAt = new Date('2024-01-01T00:00:00Z');
    const expiry = cache.calculateOfflineExpiry(issuedAt);
    expect(expiry.getTime()).toBe(issuedAt.getTime() + 72 * 60 * 60 * 1000);
  });

  it('should respect custom maxOfflineHours', () => {
    const cache = new CredentialCache({ maxOfflineHours: 24 });
    const issuedAt = new Date('2024-06-15T12:00:00Z');
    const expiry = cache.calculateOfflineExpiry(issuedAt);
    expect(expiry.getTime()).toBe(issuedAt.getTime() + 24 * 60 * 60 * 1000);
  });
});

// =============================================================================
// needsSync — REFRESH STATUS
// =============================================================================

describe('needsSync', () => {
  let cache: CredentialCache;

  beforeEach(() => {
    cache = new CredentialCache();
  });

  it('should return true when syncRequired is true', () => {
    const cred = createCredential({ syncRequired: true });
    expect(cache.needsSync(cred)).toBe(true);
  });

  it('should return true when approaching offline expiry (within 24h buffer)', () => {
    const cred = createCredential({
      offlineExpiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      syncRequired: false,
    });
    expect(cache.needsSync(cred)).toBe(true);
  });

  it('should return false when plenty of time until offline expiry', () => {
    const cred = createCredential({
      offlineExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      syncRequired: false,
    });
    expect(cache.needsSync(cred)).toBe(false);
  });

  it('should return true at exactly the 24h boundary', () => {
    const cred = createCredential({
      offlineExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000 - 1).toISOString(),
      syncRequired: false,
    });
    expect(cache.needsSync(cred)).toBe(true);
  });
});

// =============================================================================
// prepareForOffline
// =============================================================================

describe('prepareForOffline', () => {
  it('should set offlineExpiresAt, syncedAt, and syncRequired', () => {
    const cache = new CredentialCache({ maxOfflineHours: 48 });
    const now = new Date();
    const cred = {
      id: 'cred-prep',
      type: 'SESSION' as const,
      holderId: 'user-002',
      holderPublicKey: 'pub-key',
      issuedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      signatureChain: [{ signature: 's1', signerPublicKey: 'k1', signedAt: now.toISOString() }],
      dataHash: 'hash123',
      lastRevocationCheckAt: now.toISOString(),
    };
    const prepared = cache.prepareForOffline(cred);
    expect(prepared.syncRequired).toBe(false);
    expect(prepared.syncedAt).toBeDefined();
    expect(prepared.offlineExpiresAt).toBeDefined();
    // offlineExpiresAt should be issuedAt + maxOfflineHours
    const expectedExpiry = new Date(now.getTime() + 48 * 60 * 60 * 1000).getTime();
    expect(new Date(prepared.offlineExpiresAt).getTime()).toBe(expectedExpiry);
  });
});

// =============================================================================
// markSynced — REFRESH / EXTEND EXPIRY
// =============================================================================

describe('markSynced', () => {
  let cache: CredentialCache;

  beforeEach(() => {
    cache = new CredentialCache({ maxOfflineHours: 72 });
  });

  it('should reset syncRequired to false', () => {
    const cred = createCredential({ syncRequired: true });
    const synced = cache.markSynced(cred);
    expect(synced.syncRequired).toBe(false);
  });

  it('should update syncedAt to now', () => {
    const before = Date.now();
    const cred = createCredential({
      syncedAt: new Date(Date.now() - 60_000).toISOString(),
    });
    const synced = cache.markSynced(cred);
    expect(new Date(synced.syncedAt).getTime()).toBeGreaterThanOrEqual(before - 100);
  });

  it('should update lastRevocationCheckAt to now', () => {
    const before = Date.now();
    const cred = createCredential({
      lastRevocationCheckAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    });
    const synced = cache.markSynced(cred);
    expect(new Date(synced.lastRevocationCheckAt).getTime()).toBeGreaterThanOrEqual(before - 100);
  });

  it('should extend offlineExpiresAt from now', () => {
    const oldExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
    const cred = createCredential({ offlineExpiresAt: oldExpiry });
    const synced = cache.markSynced(cred);
    expect(new Date(synced.offlineExpiresAt).getTime()).toBeGreaterThan(
      new Date(oldExpiry).getTime()
    );
  });
});

// =============================================================================
// findExpiredCredentials — BULK PURGE
// =============================================================================

describe('findExpiredCredentials', () => {
  let cache: CredentialCache;

  beforeEach(() => {
    cache = new CredentialCache();
  });

  it('should return empty array when no credentials are expired', () => {
    const creds = [createCredential(), createCredential({ id: 'cred-002' })];
    expect(cache.findExpiredCredentials(creds)).toHaveLength(0);
  });

  it('should find credentials with expired expiresAt', () => {
    const expired = createCredential({
      id: 'expired-1',
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    const valid = createCredential({ id: 'valid-1' });
    const result = cache.findExpiredCredentials([expired, valid]);
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('expired-1');
  });

  it('should find credentials with expired offlineExpiresAt', () => {
    const expired = createCredential({
      id: 'offline-expired',
      offlineExpiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    const result = cache.findExpiredCredentials([expired]);
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('offline-expired');
  });

  it('should return all expired credentials for bulk purge', () => {
    const creds = [
      createCredential({
        id: 'exp-1',
        expiresAt: new Date(Date.now() - 1000).toISOString(),
      }),
      createCredential({
        id: 'exp-2',
        offlineExpiresAt: new Date(Date.now() - 1000).toISOString(),
      }),
      createCredential({ id: 'valid' }),
      createCredential({
        id: 'exp-3',
        expiresAt: new Date(Date.now() - 60_000).toISOString(),
        offlineExpiresAt: new Date(Date.now() - 30_000).toISOString(),
      }),
    ];
    const result = cache.findExpiredCredentials(creds);
    expect(result).toHaveLength(3);
    expect(result.map((c) => c.id).sort()).toEqual(['exp-1', 'exp-2', 'exp-3']);
  });

  it('should return empty for empty input', () => {
    expect(cache.findExpiredCredentials([])).toHaveLength(0);
  });
});

// =============================================================================
// hasValidSignatureChain
// =============================================================================

describe('hasValidSignatureChain', () => {
  let cache: CredentialCache;

  beforeEach(() => {
    cache = new CredentialCache();
  });

  it('should return true for credential with valid signature chain', () => {
    const cred = createCredential();
    expect(cache.hasValidSignatureChain(cred)).toBe(true);
  });

  it('should return false for empty signature chain', () => {
    const cred = createCredential({ signatureChain: [] });
    expect(cache.hasValidSignatureChain(cred)).toBe(false);
  });

  it('should return false if a signature entry is missing signature', () => {
    const cred = createCredential({
      signatureChain: [
        {
          signature: '',
          signerPublicKey: 'key1',
          signedAt: new Date().toISOString(),
        },
      ],
    });
    expect(cache.hasValidSignatureChain(cred)).toBe(false);
  });

  it('should return false if a signature entry is missing signerPublicKey', () => {
    const cred = createCredential({
      signatureChain: [
        {
          signature: 'sig1',
          signerPublicKey: '',
          signedAt: new Date().toISOString(),
        },
      ],
    });
    expect(cache.hasValidSignatureChain(cred)).toBe(false);
  });

  it('should return false if a signature entry is missing signedAt', () => {
    const cred = createCredential({
      signatureChain: [
        {
          signature: 'sig1',
          signerPublicKey: 'key1',
          signedAt: '',
        },
      ],
    });
    expect(cache.hasValidSignatureChain(cred)).toBe(false);
  });

  it('should validate all entries in a multi-entry chain', () => {
    const now = new Date().toISOString();
    const cred = createCredential({
      signatureChain: [
        { signature: 'sig1', signerPublicKey: 'key1', signedAt: now },
        { signature: 'sig2', signerPublicKey: 'key2', signedAt: now },
        { signature: 'sig3', signerPublicKey: 'key3', signedAt: now },
      ],
    });
    expect(cache.hasValidSignatureChain(cred)).toBe(true);
  });

  it('should return false if any entry in multi-entry chain is invalid', () => {
    const now = new Date().toISOString();
    const cred = createCredential({
      signatureChain: [
        { signature: 'sig1', signerPublicKey: 'key1', signedAt: now },
        { signature: '', signerPublicKey: 'key2', signedAt: now }, // invalid
        { signature: 'sig3', signerPublicKey: 'key3', signedAt: now },
      ],
    });
    expect(cache.hasValidSignatureChain(cred)).toBe(false);
  });
});
