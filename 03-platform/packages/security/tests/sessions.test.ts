import { describe, it, expect } from 'vitest';

import {
  isSessionValid,
  isSessionValidOffline,
  sessionNeedsRotation,
  recordFailedAttempt,
  resetFailedAttempts,
  prepareSessionForOffline,
  syncSessionOnline,
  DEFAULT_SESSION_CONFIG,
} from '../src/auth/sessions';
import type { Session, SessionConfig } from '../src/auth/sessions';

// =============================================================================
// HELPERS
// =============================================================================

function createSession(overrides: Partial<Session> = {}): Session {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    userId: 'user-001',
    createdAt: now.toISOString(),
    lastActiveAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    state: 'ACTIVE',
    offlineCapable: false,
    failedAttempts: 0,
    ...overrides,
  } as Session;
}

// =============================================================================
// isSessionValid — EXPIRY, REVOKED, LOCKED, IDLE TIMEOUT
// =============================================================================

describe('isSessionValid', () => {
  it('should accept a valid active session', () => {
    const result = isSessionValid(createSession());
    expect(result.valid).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('should reject a REVOKED session', () => {
    const session = createSession({ state: 'REVOKED' });
    const result = isSessionValid(session);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('SESSION_REVOKED');
  });

  it('should reject a LOCKED session even when lockedUntil is in the past', () => {
    const session = createSession({
      state: 'LOCKED',
      lockedUntil: new Date(Date.now() - 60_000).toISOString(),
    });
    const result = isSessionValid(session);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('SESSION_LOCKED');
  });

  it('should reject a LOCKED session when lockedUntil is in the future', () => {
    const session = createSession({
      state: 'LOCKED',
      lockedUntil: new Date(Date.now() + 60_000).toISOString(),
    });
    const result = isSessionValid(session);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('SESSION_LOCKED');
  });

  it('should reject a LOCKED session without lockedUntil', () => {
    const session = createSession({ state: 'LOCKED' });
    const result = isSessionValid(session);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('SESSION_LOCKED');
  });

  it('should reject an expired session', () => {
    const session = createSession({
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    const result = isSessionValid(session);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('SESSION_EXPIRED');
  });

  it('should reject a session that exceeds idle timeout', () => {
    const session = createSession({
      lastActiveAt: new Date(
        Date.now() - (DEFAULT_SESSION_CONFIG.idleTimeoutSeconds + 60) * 1000
      ).toISOString(),
    });
    const result = isSessionValid(session);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('IDLE_TIMEOUT');
  });

  it('should accept a session within idle timeout', () => {
    const session = createSession({
      lastActiveAt: new Date(
        Date.now() - (DEFAULT_SESSION_CONFIG.idleTimeoutSeconds - 60) * 1000
      ).toISOString(),
    });
    const result = isSessionValid(session);
    expect(result.valid).toBe(true);
  });

  it('should use a custom config for idle timeout', () => {
    const customConfig: SessionConfig = {
      ...DEFAULT_SESSION_CONFIG,
      idleTimeoutSeconds: 10, // 10 seconds
    };
    const session = createSession({
      lastActiveAt: new Date(Date.now() - 15_000).toISOString(), // 15s ago
    });
    const result = isSessionValid(session, customConfig);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('IDLE_TIMEOUT');
  });
});

// =============================================================================
// isSessionValidOffline
// =============================================================================

describe('isSessionValidOffline', () => {
  it('should reject non-offline-capable session', () => {
    const session = createSession({ offlineCapable: false });
    const result = isSessionValidOffline(session);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('SESSION_EXPIRED');
  });

  it('should accept a valid offline-capable session', () => {
    const now = new Date();
    const session = createSession({
      offlineCapable: true,
      offlineExpiresAt: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      offlineSyncedAt: now.toISOString(),
      state: 'OFFLINE',
    });
    const result = isSessionValidOffline(session);
    expect(result.valid).toBe(true);
  });

  it('should reject when offline expiry has passed', () => {
    const session = createSession({
      offlineCapable: true,
      offlineExpiresAt: new Date(Date.now() - 1000).toISOString(),
      offlineSyncedAt: new Date().toISOString(),
      state: 'OFFLINE',
    });
    const result = isSessionValidOffline(session);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('OFFLINE_EXPIRED');
  });

  it('should reject when offline sync is too old', () => {
    const session = createSession({
      offlineCapable: true,
      offlineExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      offlineSyncedAt: new Date(
        Date.now() - (DEFAULT_SESSION_CONFIG.offlineMaxAgeSeconds + 3600) * 1000
      ).toISOString(),
      state: 'OFFLINE',
    });
    const result = isSessionValidOffline(session);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('OFFLINE_EXPIRED');
  });

  it('should reject REVOKED session even if offline-capable', () => {
    const now = new Date();
    const session = createSession({
      offlineCapable: true,
      offlineExpiresAt: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      offlineSyncedAt: now.toISOString(),
      state: 'REVOKED',
    });
    const result = isSessionValidOffline(session);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('SESSION_REVOKED');
  });

  it('should accept offline session without offlineSyncedAt', () => {
    const session = createSession({
      offlineCapable: true,
      offlineExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      state: 'OFFLINE',
    });
    const result = isSessionValidOffline(session);
    expect(result.valid).toBe(true);
  });

  it('should accept offline session without offlineExpiresAt', () => {
    const session = createSession({
      offlineCapable: true,
      offlineSyncedAt: new Date().toISOString(),
      state: 'OFFLINE',
    });
    const result = isSessionValidOffline(session);
    expect(result.valid).toBe(true);
  });
});

// =============================================================================
// sessionNeedsRotation
// =============================================================================

describe('sessionNeedsRotation', () => {
  it('should return false for recently active session', () => {
    const session = createSession();
    expect(sessionNeedsRotation(session)).toBe(false);
  });

  it('should return true when lastActiveAt exceeds rotation interval', () => {
    const session = createSession({
      lastActiveAt: new Date(
        Date.now() - (DEFAULT_SESSION_CONFIG.rotationIntervalSeconds + 60) * 1000
      ).toISOString(),
    });
    expect(sessionNeedsRotation(session)).toBe(true);
  });

  it('should respect custom rotation interval', () => {
    const customConfig: SessionConfig = {
      ...DEFAULT_SESSION_CONFIG,
      rotationIntervalSeconds: 60, // 1 minute
    };
    const session = createSession({
      lastActiveAt: new Date(Date.now() - 120_000).toISOString(), // 2 min ago
    });
    expect(sessionNeedsRotation(session, customConfig)).toBe(true);
  });

  it('should return false when lastActiveAt is within rotation interval', () => {
    const customConfig: SessionConfig = {
      ...DEFAULT_SESSION_CONFIG,
      rotationIntervalSeconds: 3600,
    };
    const session = createSession({
      lastActiveAt: new Date(Date.now() - 1800_000).toISOString(), // 30 min ago
    });
    expect(sessionNeedsRotation(session, customConfig)).toBe(false);
  });
});

// =============================================================================
// recordFailedAttempt — CONCURRENT LIMITS, LOCKOUT
// =============================================================================

describe('recordFailedAttempt', () => {
  it('should increment failedAttempts', () => {
    const session = createSession({ failedAttempts: 0 });
    const updated = recordFailedAttempt(session);
    expect(updated.failedAttempts).toBe(1);
    expect(updated.state).toBe('ACTIVE');
  });

  it('should lock after reaching max failed attempts', () => {
    const session = createSession({
      failedAttempts: DEFAULT_SESSION_CONFIG.maxFailedAttempts - 1,
    });
    const locked = recordFailedAttempt(session);
    expect(locked.state).toBe('LOCKED');
    expect(locked.lockedUntil).toBeDefined();
    expect(locked.failedAttempts).toBe(DEFAULT_SESSION_CONFIG.maxFailedAttempts);
  });

  it('should set lockedUntil to lockoutDurationSeconds in the future', () => {
    const before = Date.now();
    const session = createSession({
      failedAttempts: DEFAULT_SESSION_CONFIG.maxFailedAttempts - 1,
    });
    const locked = recordFailedAttempt(session);
    const lockedUntil = new Date(locked.lockedUntil!).getTime();
    const expectedMin = before + DEFAULT_SESSION_CONFIG.lockoutDurationSeconds * 1000;
    expect(lockedUntil).toBeGreaterThanOrEqual(expectedMin - 1000); // 1s tolerance
    expect(lockedUntil).toBeLessThanOrEqual(expectedMin + 2000);
  });

  it('should use custom config for maxFailedAttempts', () => {
    const customConfig: SessionConfig = {
      ...DEFAULT_SESSION_CONFIG,
      maxFailedAttempts: 2,
      lockoutDurationSeconds: 60,
    };
    const session = createSession({ failedAttempts: 1 });
    const locked = recordFailedAttempt(session, customConfig);
    expect(locked.state).toBe('LOCKED');
  });

  it('should preserve other session fields', () => {
    const session = createSession({
      failedAttempts: 0,
      userId: 'user-xyz',
      deviceId: 'device-abc',
    });
    const updated = recordFailedAttempt(session);
    expect(updated.userId).toBe('user-xyz');
    expect(updated.deviceId).toBe('device-abc');
    expect(updated.id).toBe(session.id);
  });
});

// =============================================================================
// resetFailedAttempts — FORCED LOGOUT RECOVERY
// =============================================================================

describe('resetFailedAttempts', () => {
  it('should reset failedAttempts to 0', () => {
    const session = createSession({ failedAttempts: 3 });
    const reset = resetFailedAttempts(session);
    expect(reset.failedAttempts).toBe(0);
  });

  it('should transition LOCKED state back to ACTIVE', () => {
    const session = createSession({
      state: 'LOCKED',
      failedAttempts: 5,
      lockedUntil: new Date(Date.now() + 60_000).toISOString(),
    });
    const reset = resetFailedAttempts(session);
    expect(reset.state).toBe('ACTIVE');
    expect(reset.lockedUntil).toBeUndefined();
  });

  it('should not change state if session was not LOCKED', () => {
    const session = createSession({ state: 'OFFLINE', failedAttempts: 2 });
    const reset = resetFailedAttempts(session);
    expect(reset.state).toBe('OFFLINE');
    expect(reset.failedAttempts).toBe(0);
  });

  it('should preserve other session fields', () => {
    const session = createSession({
      state: 'LOCKED',
      failedAttempts: 5,
      userId: 'user-001',
    });
    const reset = resetFailedAttempts(session);
    expect(reset.userId).toBe('user-001');
    expect(reset.id).toBe(session.id);
  });
});

// =============================================================================
// prepareSessionForOffline — RENEWAL
// =============================================================================

describe('prepareSessionForOffline', () => {
  it('should set offlineCapable to true', () => {
    const session = createSession({ offlineCapable: false });
    const offline = prepareSessionForOffline(session);
    expect(offline.offlineCapable).toBe(true);
  });

  it('should set state to OFFLINE', () => {
    const session = createSession({ state: 'ACTIVE' });
    const offline = prepareSessionForOffline(session);
    expect(offline.state).toBe('OFFLINE');
  });

  it('should set offlineExpiresAt based on config', () => {
    const before = Date.now();
    const session = createSession();
    const offline = prepareSessionForOffline(session);
    const offlineExpiry = new Date(offline.offlineExpiresAt!).getTime();
    const expected = before + DEFAULT_SESSION_CONFIG.offlineMaxAgeSeconds * 1000;
    expect(offlineExpiry).toBeGreaterThanOrEqual(expected - 1000);
    expect(offlineExpiry).toBeLessThanOrEqual(expected + 2000);
  });

  it('should set offlineSyncedAt to now', () => {
    const before = Date.now();
    const session = createSession();
    const offline = prepareSessionForOffline(session);
    const syncedAt = new Date(offline.offlineSyncedAt!).getTime();
    expect(syncedAt).toBeGreaterThanOrEqual(before - 100);
    expect(syncedAt).toBeLessThanOrEqual(Date.now() + 100);
  });

  it('should use custom offlineMaxAgeSeconds', () => {
    const customConfig: SessionConfig = {
      ...DEFAULT_SESSION_CONFIG,
      offlineMaxAgeSeconds: 3600, // 1 hour
    };
    const before = Date.now();
    const session = createSession();
    const offline = prepareSessionForOffline(session, customConfig);
    const offlineExpiry = new Date(offline.offlineExpiresAt!).getTime();
    const expected = before + 3600 * 1000;
    expect(offlineExpiry).toBeGreaterThanOrEqual(expected - 1000);
    expect(offlineExpiry).toBeLessThanOrEqual(expected + 2000);
  });
});

// =============================================================================
// syncSessionOnline
// =============================================================================

describe('syncSessionOnline', () => {
  it('should set state to ACTIVE', () => {
    const session = createSession({ state: 'OFFLINE', offlineCapable: true });
    const synced = syncSessionOnline(session);
    expect(synced.state).toBe('ACTIVE');
  });

  it('should update offlineSyncedAt', () => {
    const session = createSession({
      state: 'OFFLINE',
      offlineSyncedAt: new Date(Date.now() - 60_000).toISOString(),
    });
    const before = Date.now();
    const synced = syncSessionOnline(session);
    const syncedAt = new Date(synced.offlineSyncedAt!).getTime();
    expect(syncedAt).toBeGreaterThanOrEqual(before - 100);
  });

  it('should update lastActiveAt', () => {
    const session = createSession({
      state: 'OFFLINE',
      lastActiveAt: new Date(Date.now() - 3600_000).toISOString(),
    });
    const before = Date.now();
    const synced = syncSessionOnline(session);
    const lastActive = new Date(synced.lastActiveAt).getTime();
    expect(lastActive).toBeGreaterThanOrEqual(before - 100);
  });

  it('should preserve other session fields', () => {
    const session = createSession({
      state: 'OFFLINE',
      userId: 'user-sync',
      offlineCapable: true,
    });
    const synced = syncSessionOnline(session);
    expect(synced.userId).toBe('user-sync');
    expect(synced.id).toBe(session.id);
    expect(synced.offlineCapable).toBe(true);
  });
});
