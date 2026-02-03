/**
 * @gtcx/security - Session Management
 *
 * Session handling utilities with offline support.
 * Implements P8 (Offline-First) and P9 (Security) principles.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

// =============================================================================
// SESSION SCHEMAS
// =============================================================================

/**
 * Session state enum
 */
export const SessionStateSchema = z.enum([
  'ACTIVE',
  'EXPIRED',
  'REVOKED',
  'LOCKED',
  'OFFLINE',
]);

/**
 * Session metadata
 */
export const SessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  tradePassId: z.string().optional(),

  // Timing
  createdAt: z.string().datetime(),
  lastActiveAt: z.string().datetime(),
  expiresAt: z.string().datetime(),

  // State
  state: SessionStateSchema,

  // Device binding
  deviceId: z.string().optional(),
  deviceType: z.enum(['MOBILE', 'WEB', 'DESKTOP', 'API']).optional(),
  userAgent: z.string().optional(),

  // Location (for fraud detection)
  ipAddress: z.string().optional(),
  geoLocation: z
    .object({
      country: z.string(),
      region: z.string().optional(),
      city: z.string().optional(),
    })
    .optional(),

  // Offline support (P8)
  offlineCapable: z.boolean().default(false),
  offlineExpiresAt: z.string().datetime().optional(),
  offlineSyncedAt: z.string().datetime().optional(),

  // Security
  failedAttempts: z.number().int().min(0).default(0),
  lockedUntil: z.string().datetime().optional(),
});

export type SessionState = z.infer<typeof SessionStateSchema>;
export type Session = z.infer<typeof SessionSchema>;

// =============================================================================
// SESSION CONFIGURATION
// =============================================================================

export interface SessionConfig {
  // Timing
  maxAgeSeconds: number; // Default: 24 hours
  idleTimeoutSeconds: number; // Default: 30 minutes
  absoluteTimeoutSeconds: number; // Default: 7 days

  // Offline (P8)
  offlineMaxAgeSeconds: number; // Default: 72 hours
  offlineSyncIntervalSeconds: number; // Default: 1 hour

  // Security
  maxFailedAttempts: number; // Default: 5
  lockoutDurationSeconds: number; // Default: 15 minutes
  deviceBindingRequired: boolean; // Default: true

  // Rotation
  rotationIntervalSeconds: number; // Default: 1 hour
}

export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  maxAgeSeconds: 24 * 60 * 60, // 24 hours
  idleTimeoutSeconds: 30 * 60, // 30 minutes
  absoluteTimeoutSeconds: 7 * 24 * 60 * 60, // 7 days
  offlineMaxAgeSeconds: 72 * 60 * 60, // 72 hours
  offlineSyncIntervalSeconds: 60 * 60, // 1 hour
  maxFailedAttempts: 5,
  lockoutDurationSeconds: 15 * 60, // 15 minutes
  deviceBindingRequired: true,
  rotationIntervalSeconds: 60 * 60, // 1 hour
};

// =============================================================================
// SESSION UTILITIES
// =============================================================================

/**
 * Check if session is valid (not expired, not revoked, not locked)
 */
export function isSessionValid(
  session: Session,
  config: SessionConfig = DEFAULT_SESSION_CONFIG
): SessionValidationResult {
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  const lastActiveAt = new Date(session.lastActiveAt);

  // Check state
  if (session.state === 'REVOKED') {
    return { valid: false, reason: 'SESSION_REVOKED' };
  }

  if (session.state === 'LOCKED') {
    if (session.lockedUntil && new Date(session.lockedUntil) > now) {
      return { valid: false, reason: 'SESSION_LOCKED' };
    }
    // Lock has expired, but session needs to be unlocked explicitly
    return { valid: false, reason: 'SESSION_LOCKED' };
  }

  // Check expiration
  if (expiresAt < now) {
    return { valid: false, reason: 'SESSION_EXPIRED' };
  }

  // Check idle timeout
  const idleMs = now.getTime() - lastActiveAt.getTime();
  if (idleMs > config.idleTimeoutSeconds * 1000) {
    return { valid: false, reason: 'IDLE_TIMEOUT' };
  }

  return { valid: true };
}

export interface SessionValidationResult {
  valid: boolean;
  reason?:
    | 'SESSION_EXPIRED'
    | 'SESSION_REVOKED'
    | 'SESSION_LOCKED'
    | 'IDLE_TIMEOUT'
    | 'DEVICE_MISMATCH'
    | 'OFFLINE_EXPIRED';
}

/**
 * Check if session is valid for offline use (P8)
 */
export function isSessionValidOffline(
  session: Session,
  config: SessionConfig = DEFAULT_SESSION_CONFIG
): SessionValidationResult {
  if (!session.offlineCapable) {
    return { valid: false, reason: 'SESSION_EXPIRED' };
  }

  const now = new Date();

  // Check offline-specific expiration
  if (session.offlineExpiresAt) {
    if (new Date(session.offlineExpiresAt) < now) {
      return { valid: false, reason: 'OFFLINE_EXPIRED' };
    }
  }

  // Check max offline age from last sync
  if (session.offlineSyncedAt) {
    const syncedAt = new Date(session.offlineSyncedAt);
    const offlineMs = now.getTime() - syncedAt.getTime();
    if (offlineMs > config.offlineMaxAgeSeconds * 1000) {
      return { valid: false, reason: 'OFFLINE_EXPIRED' };
    }
  }

  // Check basic session state
  if (session.state === 'REVOKED') {
    return { valid: false, reason: 'SESSION_REVOKED' };
  }

  return { valid: true };
}

/**
 * Check if session needs rotation
 */
export function sessionNeedsRotation(
  session: Session,
  config: SessionConfig = DEFAULT_SESSION_CONFIG
): boolean {
  const now = new Date();
  const lastActiveAt = new Date(session.lastActiveAt);
  const ageMs = now.getTime() - lastActiveAt.getTime();

  return ageMs > config.rotationIntervalSeconds * 1000;
}

/**
 * Record failed authentication attempt
 */
export function recordFailedAttempt(
  session: Session,
  config: SessionConfig = DEFAULT_SESSION_CONFIG
): Session {
  const failedAttempts = session.failedAttempts + 1;

  if (failedAttempts >= config.maxFailedAttempts) {
    const lockedUntil = new Date(
      Date.now() + config.lockoutDurationSeconds * 1000
    ).toISOString();

    return {
      ...session,
      failedAttempts,
      state: 'LOCKED',
      lockedUntil,
    };
  }

  return {
    ...session,
    failedAttempts,
  };
}

/**
 * Reset failed attempts after successful auth
 */
export function resetFailedAttempts(session: Session): Session {
  return {
    ...session,
    failedAttempts: 0,
    state: session.state === 'LOCKED' ? 'ACTIVE' : session.state,
    lockedUntil: undefined,
  };
}

/**
 * Prepare session for offline use (P8)
 */
export function prepareSessionForOffline(
  session: Session,
  config: SessionConfig = DEFAULT_SESSION_CONFIG
): Session {
  const now = new Date();
  const offlineExpiresAt = new Date(
    now.getTime() + config.offlineMaxAgeSeconds * 1000
  ).toISOString();

  return {
    ...session,
    offlineCapable: true,
    offlineExpiresAt,
    offlineSyncedAt: now.toISOString(),
    state: 'OFFLINE',
  };
}

/**
 * Sync offline session back to online
 */
export function syncSessionOnline(session: Session): Session {
  return {
    ...session,
    state: 'ACTIVE',
    offlineSyncedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };
}
