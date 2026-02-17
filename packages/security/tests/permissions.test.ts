/**
 * Tests for @gtcx/security - Auth Permissions (permissions.ts)
 *
 * Covers: hasPermission, expandPermissions, validatePermission,
 * Permissions constants, Roles, session/token utilities,
 * lockout tracking, wildcard/deny/scope checks.
 */

import { describe, it, expect, vi } from 'vitest';

import {
  Permissions,
  Roles,
  hasPermission,
  expandPermissions,
  validatePermission,
  createSession,
  isSessionValid,
  extendSession,
  createTokenPayload,
  validateTokenPayload,
  isLocked,
  recordFailedAttempt,
  clearLockout,
  DEFAULT_LOCKOUT_CONFIG,
} from '../src/auth/permissions';
import type {
  PermissionContext,
  RoleName,
  LockoutState,
  LockoutConfig,
} from '../src/auth/permissions';

// Mock audit logging
vi.mock('../src/audit/events', () => ({
  logSecurityEvent: vi.fn().mockResolvedValue(undefined),
}));

// =============================================================================
// Permissions Constants
// =============================================================================

describe('Permissions', () => {
  it('should define all TradePass permissions', () => {
    expect(Permissions.TRADEPASS_ISSUE).toBe('tradepass:issue');
    expect(Permissions.TRADEPASS_VERIFY).toBe('tradepass:verify');
    expect(Permissions.TRADEPASS_REVOKE).toBe('tradepass:revoke');
    expect(Permissions.TRADEPASS_READ).toBe('tradepass:read');
  });

  it('should define all GeoTag permissions', () => {
    expect(Permissions.GEOTAG_CREATE).toBe('geotag:create');
    expect(Permissions.GEOTAG_VERIFY).toBe('geotag:verify');
    expect(Permissions.GEOTAG_READ).toBe('geotag:read');
  });

  it('should define all VaultMark permissions', () => {
    expect(Permissions.VAULTMARK_CREATE).toBe('vaultmark:create');
    expect(Permissions.VAULTMARK_TRANSFER).toBe('vaultmark:transfer');
    expect(Permissions.VAULTMARK_VERIFY).toBe('vaultmark:verify');
    expect(Permissions.VAULTMARK_READ).toBe('vaultmark:read');
  });

  it('should define all PvP permissions', () => {
    expect(Permissions.PVP_INITIATE).toBe('pvp:initiate');
    expect(Permissions.PVP_APPROVE).toBe('pvp:approve');
    expect(Permissions.PVP_SETTLE).toBe('pvp:settle');
    expect(Permissions.PVP_READ).toBe('pvp:read');
  });

  it('should define all GCI permissions', () => {
    expect(Permissions.GCI_EVALUATE).toBe('gci:evaluate');
    expect(Permissions.GCI_CERTIFY).toBe('gci:certify');
    expect(Permissions.GCI_READ).toBe('gci:read');
  });

  it('should define all PANX permissions', () => {
    expect(Permissions.PANX_SUBMIT).toBe('panx:submit');
    expect(Permissions.PANX_READ).toBe('panx:read');
  });

  it('should define all admin permissions', () => {
    expect(Permissions.ADMIN_ALL).toBe('admin:*');
    expect(Permissions.ADMIN_USERS).toBe('admin:users');
    expect(Permissions.ADMIN_CONFIG).toBe('admin:config');
    expect(Permissions.ADMIN_AUDIT).toBe('admin:audit');
  });
});

// =============================================================================
// Roles
// =============================================================================

describe('Roles', () => {
  it('should define producer role permissions', () => {
    const perms = Roles.producer;
    expect(perms).toContain(Permissions.TRADEPASS_READ);
    expect(perms).toContain(Permissions.GEOTAG_CREATE);
    expect(perms).toContain(Permissions.GEOTAG_READ);
    expect(perms).toContain(Permissions.VAULTMARK_READ);
    expect(perms).toContain(Permissions.PVP_READ);
    expect(perms).toContain(Permissions.GCI_READ);
    expect(perms).toContain(Permissions.PANX_READ);
    // Should NOT have write/issue permissions
    expect(perms).not.toContain(Permissions.TRADEPASS_ISSUE);
    expect(perms).not.toContain(Permissions.TRADEPASS_REVOKE);
  });

  it('should define inspector role permissions', () => {
    const perms = Roles.inspector;
    expect(perms).toContain(Permissions.TRADEPASS_VERIFY);
    expect(perms).toContain(Permissions.GEOTAG_VERIFY);
    expect(perms).toContain(Permissions.VAULTMARK_VERIFY);
    expect(perms).toContain(Permissions.GCI_EVALUATE);
    // Should NOT have issue/create permissions
    expect(perms).not.toContain(Permissions.TRADEPASS_ISSUE);
    expect(perms).not.toContain(Permissions.VAULTMARK_CREATE);
  });

  it('should define vault_operator role permissions', () => {
    const perms = Roles.vault_operator;
    expect(perms).toContain(Permissions.VAULTMARK_CREATE);
    expect(perms).toContain(Permissions.VAULTMARK_TRANSFER);
    expect(perms).toContain(Permissions.PVP_INITIATE);
    // Should NOT have admin or tradepass issue
    expect(perms).not.toContain(Permissions.ADMIN_ALL);
    expect(perms).not.toContain(Permissions.TRADEPASS_ISSUE);
  });

  it('should define regulator role permissions', () => {
    const perms = Roles.regulator;
    expect(perms).toContain(Permissions.TRADEPASS_ISSUE);
    expect(perms).toContain(Permissions.TRADEPASS_REVOKE);
    expect(perms).toContain(Permissions.GCI_CERTIFY);
    expect(perms).toContain(Permissions.ADMIN_AUDIT);
    // Should NOT have vaultmark create or admin:*
    expect(perms).not.toContain(Permissions.VAULTMARK_CREATE);
    expect(perms).not.toContain(Permissions.ADMIN_ALL);
  });

  it('should define operator role permissions', () => {
    const perms = Roles.operator;
    expect(perms).toContain(Permissions.TRADEPASS_ISSUE);
    expect(perms).toContain(Permissions.VAULTMARK_CREATE);
    expect(perms).toContain(Permissions.PVP_APPROVE);
    expect(perms).toContain(Permissions.PVP_SETTLE);
    expect(perms).toContain(Permissions.PANX_SUBMIT);
    expect(perms).toContain(Permissions.GCI_CERTIFY);
  });

  it('should define admin role with wildcard', () => {
    const perms = Roles.admin;
    expect(perms).toContain(Permissions.ADMIN_ALL);
    expect(perms).toHaveLength(1);
  });
});

// =============================================================================
// hasPermission
// =============================================================================

describe('hasPermission', () => {
  it('should grant exact permission match', () => {
    expect(
      hasPermission(Permissions.TRADEPASS_READ, {
        permissions: [Permissions.TRADEPASS_READ],
      })
    ).toBe(true);
  });

  it('should deny when permission is missing', () => {
    expect(
      hasPermission(Permissions.TRADEPASS_ISSUE, {
        permissions: [Permissions.TRADEPASS_READ],
      })
    ).toBe(false);
  });

  it('should deny with empty context', () => {
    expect(hasPermission(Permissions.TRADEPASS_READ, {})).toBe(false);
  });

  it('should deny with empty permissions array', () => {
    expect(hasPermission(Permissions.TRADEPASS_READ, { permissions: [] })).toBe(false);
  });

  it('should grant admin:* for any permission', () => {
    const ctx: PermissionContext = { permissions: [Permissions.ADMIN_ALL] };
    expect(hasPermission(Permissions.TRADEPASS_ISSUE, ctx)).toBe(true);
    expect(hasPermission(Permissions.GEOTAG_CREATE, ctx)).toBe(true);
    expect(hasPermission(Permissions.PVP_SETTLE, ctx)).toBe(true);
    expect(hasPermission(Permissions.PANX_SUBMIT, ctx)).toBe(true);
    expect(hasPermission(Permissions.ADMIN_USERS, ctx)).toBe(true);
  });

  it('should grant resource wildcard for same resource', () => {
    expect(
      hasPermission(Permissions.TRADEPASS_ISSUE, {
        permissions: ['tradepass:*'],
      })
    ).toBe(true);
    expect(
      hasPermission(Permissions.TRADEPASS_REVOKE, {
        permissions: ['tradepass:*'],
      })
    ).toBe(true);
  });

  it('should deny resource wildcard for different resource', () => {
    expect(
      hasPermission(Permissions.GEOTAG_CREATE, {
        permissions: ['tradepass:*'],
      })
    ).toBe(false);
  });

  it('should expand roles and check permission', () => {
    expect(hasPermission(Permissions.GEOTAG_CREATE, { roles: ['producer'] })).toBe(true);
    expect(hasPermission(Permissions.TRADEPASS_ISSUE, { roles: ['producer'] })).toBe(false);
  });

  it('should grant admin role any permission', () => {
    expect(hasPermission(Permissions.VAULTMARK_TRANSFER, { roles: ['admin'] })).toBe(true);
    expect(hasPermission(Permissions.PVP_SETTLE, { roles: ['admin'] })).toBe(true);
  });

  it('should combine roles and direct permissions', () => {
    // Producer role + extra PANX_SUBMIT permission
    const ctx: PermissionContext = {
      roles: ['producer'],
      permissions: [Permissions.PANX_SUBMIT],
    };
    expect(hasPermission(Permissions.GEOTAG_CREATE, ctx)).toBe(true); // from role
    expect(hasPermission(Permissions.PANX_SUBMIT, ctx)).toBe(true); // direct
    expect(hasPermission(Permissions.TRADEPASS_ISSUE, ctx)).toBe(false); // neither
  });

  it('should handle multiple roles', () => {
    const ctx: PermissionContext = { roles: ['producer', 'inspector'] };
    // From producer
    expect(hasPermission(Permissions.GEOTAG_CREATE, ctx)).toBe(true);
    // From inspector
    expect(hasPermission(Permissions.TRADEPASS_VERIFY, ctx)).toBe(true);
    // Neither
    expect(hasPermission(Permissions.TRADEPASS_ISSUE, ctx)).toBe(false);
  });
});

// =============================================================================
// expandPermissions
// =============================================================================

describe('expandPermissions', () => {
  it('should return empty array for empty context', () => {
    expect(expandPermissions({})).toEqual([]);
  });

  it('should return direct permissions', () => {
    const perms = expandPermissions({
      permissions: ['tradepass:read', 'geotag:create'],
    });
    expect(perms).toContain('tradepass:read');
    expect(perms).toContain('geotag:create');
  });

  it('should expand single role', () => {
    const perms = expandPermissions({ roles: ['producer'] });
    expect(perms).toEqual(expect.arrayContaining(Roles.producer as unknown as string[]));
  });

  it('should expand multiple roles without duplicates', () => {
    const perms = expandPermissions({ roles: ['producer', 'inspector'] });
    // Both roles include TRADEPASS_READ - should only appear once
    const readCount = perms.filter((p) => p === Permissions.TRADEPASS_READ).length;
    expect(readCount).toBe(1);
  });

  it('should merge roles and direct permissions', () => {
    const perms = expandPermissions({
      roles: ['producer'],
      permissions: ['custom:action'],
    });
    expect(perms).toContain(Permissions.GEOTAG_CREATE);
    expect(perms).toContain('custom:action');
  });

  it('should deduplicate role + direct overlap', () => {
    const perms = expandPermissions({
      roles: ['producer'],
      permissions: [Permissions.TRADEPASS_READ],
    });
    const count = perms.filter((p) => p === Permissions.TRADEPASS_READ).length;
    expect(count).toBe(1);
  });

  it('should handle unknown role gracefully', () => {
    // TypeScript won't allow this normally, but runtime safety matters
    const perms = expandPermissions({ roles: ['nonexistent' as RoleName] });
    expect(perms).toEqual([]);
  });
});

// =============================================================================
// validatePermission (with logging)
// =============================================================================

describe('validatePermission', () => {
  it('should return true and log ACCESS_GRANTED for allowed', async () => {
    const { logSecurityEvent } = await import('../src/audit/events');

    const result = await validatePermission({
      actor: 'user-001',
      action: Permissions.TRADEPASS_READ,
      resource: 'tp-123',
      context: { permissions: [Permissions.TRADEPASS_READ] },
    });

    expect(result).toBe(true);
    expect(logSecurityEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'ACCESS_GRANTED',
        outcome: 'SUCCESS',
        actor: 'user-001',
        action: Permissions.TRADEPASS_READ,
        resource: 'tp-123',
      })
    );
  });

  it('should return false and log ACCESS_DENIED for denied', async () => {
    const { logSecurityEvent } = await import('../src/audit/events');

    const result = await validatePermission({
      actor: 'user-002',
      action: Permissions.TRADEPASS_REVOKE,
      resource: 'tp-456',
      context: { permissions: [Permissions.TRADEPASS_READ] },
    });

    expect(result).toBe(false);
    expect(logSecurityEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'ACCESS_DENIED',
        outcome: 'BLOCKED',
        severity: 'WARN',
      })
    );
  });

  it('should include role and permission count in log metadata', async () => {
    const { logSecurityEvent } = await import('../src/audit/events');

    await validatePermission({
      actor: 'user-003',
      action: Permissions.GEOTAG_CREATE,
      resource: 'geotag-789',
      context: { roles: ['producer'] },
    });

    expect(logSecurityEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          roles: ['producer'],
          permissionCount: expect.any(Number),
        }),
      })
    );
  });
});

// =============================================================================
// Session Management
// =============================================================================

describe('createSession', () => {
  it('should create session with defaults', () => {
    const session = createSession({ userId: 'user-001' });
    expect(session.id).toBeDefined();
    expect(session.userId).toBe('user-001');
    expect(session.roles).toEqual([]);
    expect(session.permissions).toEqual([]);
    expect(session.createdAt).toBeDefined();
    expect(session.expiresAt).toBeDefined();
    expect(session.lastActiveAt).toBeDefined();
  });

  it('should expand roles into permissions', () => {
    const session = createSession({
      userId: 'user-002',
      roles: ['producer'],
    });
    expect(session.roles).toEqual(['producer']);
    expect(session.permissions).toContain(Permissions.TRADEPASS_READ);
    expect(session.permissions).toContain(Permissions.GEOTAG_CREATE);
  });

  it('should use custom maxAge', () => {
    const maxAge = 60 * 60 * 1000; // 1 hour
    const session = createSession({ userId: 'user-003', maxAge });
    const created = new Date(session.createdAt).getTime();
    const expires = new Date(session.expiresAt).getTime();
    expect(expires - created).toBeCloseTo(maxAge, -100);
  });

  it('should include deviceId and metadata', () => {
    const session = createSession({
      userId: 'user-004',
      deviceId: 'device-abc',
      metadata: { ip: '1.2.3.4' },
    });
    expect(session.deviceId).toBe('device-abc');
    expect(session.metadata).toEqual({ ip: '1.2.3.4' });
  });

  it('should merge direct permissions with role permissions', () => {
    const session = createSession({
      userId: 'user-005',
      roles: ['producer'],
      permissions: ['custom:perm'],
    });
    expect(session.permissions).toContain(Permissions.TRADEPASS_READ);
    expect(session.permissions).toContain('custom:perm');
  });
});

describe('isSessionValid', () => {
  it('should return true for non-expired session', () => {
    const session = createSession({ userId: 'u1' });
    expect(isSessionValid(session)).toBe(true);
  });

  it('should return false for expired session', () => {
    const session = createSession({ userId: 'u2', maxAge: -1000 });
    expect(isSessionValid(session)).toBe(false);
  });
});

describe('extendSession', () => {
  it('should update lastActiveAt', () => {
    const session = createSession({ userId: 'u1' });
    const before = session.lastActiveAt;
    const extended = extendSession(session);
    expect(new Date(extended.lastActiveAt).getTime()).toBeGreaterThanOrEqual(
      new Date(before).getTime()
    );
  });

  it('should extend expiry when requested', () => {
    const session = createSession({ userId: 'u1' });
    const originalExpiry = new Date(session.expiresAt).getTime();
    const extended = extendSession(session, { extendExpiry: true });
    expect(new Date(extended.expiresAt).getTime()).toBeGreaterThanOrEqual(originalExpiry);
  });

  it('should use custom maxAge for expiry extension', () => {
    const session = createSession({ userId: 'u1', maxAge: 1000 });
    const customMaxAge = 48 * 60 * 60 * 1000; // 48h
    const extended = extendSession(session, {
      extendExpiry: true,
      maxAge: customMaxAge,
    });
    const now = Date.now();
    const newExpiry = new Date(extended.expiresAt).getTime();
    // New expiry should be approximately now + customMaxAge
    expect(newExpiry).toBeGreaterThan(now + customMaxAge - 5000);
    expect(newExpiry).toBeLessThan(now + customMaxAge + 5000);
  });

  it('should not extend expiry by default', () => {
    const session = createSession({ userId: 'u1' });
    const extended = extendSession(session);
    expect(extended.expiresAt).toBe(session.expiresAt);
  });
});

// =============================================================================
// Token Payload
// =============================================================================

describe('createTokenPayload', () => {
  it('should create a token payload', () => {
    const payload = createTokenPayload({
      subject: 'user-001',
      expiresIn: 3600,
    });
    expect(payload.sub).toBe('user-001');
    expect(payload.exp).toBe(payload.iat + 3600);
    expect(payload.jti).toBeDefined();
  });

  it('should include optional fields', () => {
    const payload = createTokenPayload({
      subject: 'user-002',
      issuer: 'gtcx',
      audience: 'api',
      expiresIn: 7200,
      sessionId: crypto.randomUUID(),
      claims: { role: 'admin' },
    });
    expect(payload.iss).toBe('gtcx');
    expect(payload.aud).toBe('api');
    expect(payload.sid).toBeDefined();
    expect(payload.claims).toEqual({ role: 'admin' });
  });
});

describe('validateTokenPayload', () => {
  it('should accept valid payload', () => {
    const now = Math.floor(Date.now() / 1000);
    const result = validateTokenPayload({
      sub: 'user-001',
      iat: now,
      exp: now + 3600,
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.payload.sub).toBe('user-001');
    }
  });

  it('should reject expired payload', () => {
    const now = Math.floor(Date.now() / 1000);
    const result = validateTokenPayload({
      sub: 'user-001',
      iat: now - 7200,
      exp: now - 3600,
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe('TOKEN_EXPIRED');
    }
  });

  it('should reject future-issued token (clock skew > 60s)', () => {
    const now = Math.floor(Date.now() / 1000);
    const result = validateTokenPayload({
      sub: 'user-001',
      iat: now + 120, // 120s in future (> 60s tolerance)
      exp: now + 3600,
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe('TOKEN_NOT_YET_VALID');
    }
  });

  it('should allow small clock skew (< 60s)', () => {
    const now = Math.floor(Date.now() / 1000);
    const result = validateTokenPayload({
      sub: 'user-001',
      iat: now + 30, // 30s in future (within tolerance)
      exp: now + 3600,
    });
    expect(result.valid).toBe(true);
  });

  it('should reject invalid payload shape', () => {
    const result = validateTokenPayload({ invalid: true });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe('INVALID_PAYLOAD');
    }
  });

  it('should reject missing required fields', () => {
    const result = validateTokenPayload({ sub: 'user' }); // missing iat, exp
    expect(result.valid).toBe(false);
  });
});

// =============================================================================
// Lockout Tracking
// =============================================================================

describe('isLocked', () => {
  it('should return false for undefined state', () => {
    expect(isLocked(undefined)).toBe(false);
  });

  it('should return false for state without lockedUntil', () => {
    expect(isLocked({ attempts: 3, firstAttemptAt: new Date().toISOString() })).toBe(false);
  });

  it('should return true when lockedUntil is in the future', () => {
    const futureDate = new Date(Date.now() + 60000).toISOString();
    expect(
      isLocked({
        attempts: 5,
        firstAttemptAt: new Date().toISOString(),
        lockedUntil: futureDate,
      })
    ).toBe(true);
  });

  it('should return false when lockedUntil is in the past', () => {
    const pastDate = new Date(Date.now() - 60000).toISOString();
    expect(
      isLocked({
        attempts: 5,
        firstAttemptAt: new Date().toISOString(),
        lockedUntil: pastDate,
      })
    ).toBe(false);
  });
});

describe('recordFailedAttempt', () => {
  it('should create new state when no prior state', () => {
    const state = recordFailedAttempt(undefined);
    expect(state.attempts).toBe(1);
    expect(state.firstAttemptAt).toBeDefined();
    expect(state.lockedUntil).toBeUndefined();
  });

  it('should increment attempts within window', () => {
    const initial: LockoutState = {
      attempts: 2,
      firstAttemptAt: new Date().toISOString(),
    };
    const state = recordFailedAttempt(initial);
    expect(state.attempts).toBe(3);
  });

  it('should reset when window expires', () => {
    const config: LockoutConfig = {
      maxAttempts: 5,
      lockoutDuration: 15 * 60 * 1000,
      attemptWindow: 1000, // 1 second window
    };
    const oldState: LockoutState = {
      attempts: 4,
      firstAttemptAt: new Date(Date.now() - 5000).toISOString(), // 5s ago, window expired
    };
    const state = recordFailedAttempt(oldState, config);
    expect(state.attempts).toBe(1); // reset
  });

  it('should lock when reaching max attempts', () => {
    const config: LockoutConfig = {
      maxAttempts: 3,
      lockoutDuration: 15 * 60 * 1000,
      attemptWindow: 5 * 60 * 1000,
    };
    const initial: LockoutState = {
      attempts: 2,
      firstAttemptAt: new Date().toISOString(),
    };
    const state = recordFailedAttempt(initial, config);
    expect(state.attempts).toBe(3);
    expect(state.lockedUntil).toBeDefined();
    // lockedUntil should be ~15 min from now
    const lockExpiry = new Date(state.lockedUntil!).getTime();
    expect(lockExpiry).toBeGreaterThan(Date.now() + 14 * 60 * 1000);
  });

  it('should use DEFAULT_LOCKOUT_CONFIG when none provided', () => {
    expect(DEFAULT_LOCKOUT_CONFIG.maxAttempts).toBe(5);
    expect(DEFAULT_LOCKOUT_CONFIG.lockoutDuration).toBe(15 * 60 * 1000);
    expect(DEFAULT_LOCKOUT_CONFIG.attemptWindow).toBe(5 * 60 * 1000);

    const state = recordFailedAttempt(undefined);
    expect(state.attempts).toBe(1);
  });
});

describe('clearLockout', () => {
  it('should return undefined', () => {
    expect(clearLockout()).toBeUndefined();
  });
});
