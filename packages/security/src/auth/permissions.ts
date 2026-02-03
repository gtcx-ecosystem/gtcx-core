/**
 * @gtcx/security - Authentication & Authorization
 * 
 * Token management, session handling, and permission checking.
 * Implements P9 (Security by Design).
 */

import { z } from 'zod';
import { logSecurityEvent } from '../audit/events';

// =============================================================================
// PERMISSIONS
// =============================================================================

/**
 * Permission format: resource:action[:scope]
 */
export type Permission = string;

/**
 * Standard GTCX permissions
 */
export const Permissions = {
  // TradePass
  TRADEPASS_ISSUE: 'tradepass:issue',
  TRADEPASS_VERIFY: 'tradepass:verify',
  TRADEPASS_REVOKE: 'tradepass:revoke',
  TRADEPASS_READ: 'tradepass:read',
  
  // GeoTag
  GEOTAG_CREATE: 'geotag:create',
  GEOTAG_VERIFY: 'geotag:verify',
  GEOTAG_READ: 'geotag:read',
  
  // VaultMark
  VAULTMARK_CREATE: 'vaultmark:create',
  VAULTMARK_TRANSFER: 'vaultmark:transfer',
  VAULTMARK_VERIFY: 'vaultmark:verify',
  VAULTMARK_READ: 'vaultmark:read',
  
  // PvP Settlement
  PVP_INITIATE: 'pvp:initiate',
  PVP_APPROVE: 'pvp:approve',
  PVP_SETTLE: 'pvp:settle',
  PVP_READ: 'pvp:read',
  
  // GCI Compliance
  GCI_EVALUATE: 'gci:evaluate',
  GCI_CERTIFY: 'gci:certify',
  GCI_READ: 'gci:read',
  
  // PANX Oracle
  PANX_SUBMIT: 'panx:submit',
  PANX_READ: 'panx:read',
  
  // Admin
  ADMIN_ALL: 'admin:*',
  ADMIN_USERS: 'admin:users',
  ADMIN_CONFIG: 'admin:config',
  ADMIN_AUDIT: 'admin:audit',
} as const;

/**
 * Role definitions with permission sets
 */
export const Roles = {
  /** Individual commodity producer */
  producer: [
    Permissions.TRADEPASS_READ,
    Permissions.GEOTAG_CREATE,
    Permissions.GEOTAG_READ,
    Permissions.VAULTMARK_READ,
    Permissions.PVP_READ,
    Permissions.GCI_READ,
    Permissions.PANX_READ,
  ],
  
  /** Field inspector/verifier */
  inspector: [
    Permissions.TRADEPASS_VERIFY,
    Permissions.TRADEPASS_READ,
    Permissions.GEOTAG_VERIFY,
    Permissions.GEOTAG_READ,
    Permissions.VAULTMARK_VERIFY,
    Permissions.VAULTMARK_READ,
    Permissions.GCI_EVALUATE,
    Permissions.GCI_READ,
  ],
  
  /** Vault operator */
  vault_operator: [
    Permissions.VAULTMARK_CREATE,
    Permissions.VAULTMARK_TRANSFER,
    Permissions.VAULTMARK_VERIFY,
    Permissions.VAULTMARK_READ,
    Permissions.PVP_INITIATE,
    Permissions.PVP_READ,
  ],
  
  /** Government regulator */
  regulator: [
    Permissions.TRADEPASS_ISSUE,
    Permissions.TRADEPASS_VERIFY,
    Permissions.TRADEPASS_REVOKE,
    Permissions.TRADEPASS_READ,
    Permissions.GCI_CERTIFY,
    Permissions.GCI_EVALUATE,
    Permissions.GCI_READ,
    Permissions.ADMIN_AUDIT,
  ],
  
  /** Platform operator */
  operator: [
    Permissions.TRADEPASS_ISSUE,
    Permissions.TRADEPASS_VERIFY,
    Permissions.TRADEPASS_REVOKE,
    Permissions.TRADEPASS_READ,
    Permissions.GEOTAG_VERIFY,
    Permissions.GEOTAG_READ,
    Permissions.VAULTMARK_CREATE,
    Permissions.VAULTMARK_VERIFY,
    Permissions.VAULTMARK_READ,
    Permissions.PVP_APPROVE,
    Permissions.PVP_SETTLE,
    Permissions.PVP_READ,
    Permissions.GCI_EVALUATE,
    Permissions.GCI_CERTIFY,
    Permissions.GCI_READ,
    Permissions.PANX_SUBMIT,
    Permissions.PANX_READ,
  ],
  
  /** System administrator */
  admin: [
    Permissions.ADMIN_ALL,
  ],
} as const;

export type RoleName = keyof typeof Roles;

// =============================================================================
// PERMISSION CHECKING
// =============================================================================

export interface PermissionContext {
  /** User's permissions (or roles to expand) */
  permissions?: Permission[];
  /** User's roles */
  roles?: RoleName[];
  /** Resource owner (for ownership checks) */
  ownerId?: string;
  /** Current user ID */
  actorId?: string;
  /** Additional context */
  metadata?: Record<string, unknown>;
}

/**
 * Check if actor has required permission
 */
export function hasPermission(
  required: Permission,
  context: PermissionContext
): boolean {
  const userPermissions = expandPermissions(context);
  
  // Check for wildcard admin
  if (userPermissions.includes(Permissions.ADMIN_ALL)) {
    return true;
  }
  
  // Check for exact match
  if (userPermissions.includes(required)) {
    return true;
  }
  
  // Check for wildcard in same resource
  const [resource] = required.split(':');
  if (userPermissions.includes(`${resource}:*`)) {
    return true;
  }
  
  return false;
}

/**
 * Expand roles into permissions
 */
export function expandPermissions(context: PermissionContext): Permission[] {
  const permissions = new Set<Permission>(context.permissions ?? []);
  
  for (const role of context.roles ?? []) {
    const rolePermissions = Roles[role];
    if (rolePermissions) {
      for (const perm of rolePermissions) {
        permissions.add(perm);
      }
    }
  }
  
  return Array.from(permissions);
}

/**
 * Validate permission with logging
 */
export async function validatePermission(options: {
  actor: string;
  action: Permission;
  resource: string;
  context: PermissionContext;
}): Promise<boolean> {
  const allowed = hasPermission(options.action, options.context);
  
  await logSecurityEvent({
    timestamp: new Date().toISOString(),
    eventType: allowed ? 'ACCESS_GRANTED' : 'ACCESS_DENIED',
    severity: allowed ? 'INFO' : 'WARN',
    outcome: allowed ? 'SUCCESS' : 'BLOCKED',
    actor: options.actor,
    action: options.action,
    resource: options.resource,
    metadata: {
      roles: options.context.roles,
      permissionCount: expandPermissions(options.context).length,
    },
  });
  
  return allowed;
}

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

export const SessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  deviceId: z.string().optional(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  lastActiveAt: z.string().datetime(),
  metadata: z.record(z.unknown()).optional(),
});

export type Session = z.infer<typeof SessionSchema>;

export interface CreateSessionOptions {
  userId: string;
  deviceId?: string;
  roles?: RoleName[];
  permissions?: Permission[];
  /** Max age in milliseconds (default: 24 hours) */
  maxAge?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Create a new session
 */
export function createSession(options: CreateSessionOptions): Session {
  const now = new Date();
  const maxAge = options.maxAge ?? 24 * 60 * 60 * 1000; // 24 hours default
  
  return {
    id: crypto.randomUUID(),
    userId: options.userId,
    deviceId: options.deviceId,
    roles: options.roles ?? [],
    permissions: expandPermissions({
      roles: options.roles,
      permissions: options.permissions,
    }),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + maxAge).toISOString(),
    lastActiveAt: now.toISOString(),
    metadata: options.metadata,
  };
}

/**
 * Check if session is valid
 */
export function isSessionValid(session: Session): boolean {
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  return now < expiresAt;
}

/**
 * Extend session (update lastActiveAt, optionally extend expiry)
 */
export function extendSession(
  session: Session,
  options?: { extendExpiry?: boolean; maxAge?: number }
): Session {
  const now = new Date();
  const extended = {
    ...session,
    lastActiveAt: now.toISOString(),
  };
  
  if (options?.extendExpiry) {
    const maxAge = options.maxAge ?? 24 * 60 * 60 * 1000;
    extended.expiresAt = new Date(now.getTime() + maxAge).toISOString();
  }
  
  return extended;
}

// =============================================================================
// TOKEN UTILITIES
// =============================================================================

/**
 * Token payload structure
 */
export const TokenPayloadSchema = z.object({
  /** Subject (user ID) */
  sub: z.string(),
  /** Issuer */
  iss: z.string().optional(),
  /** Audience */
  aud: z.string().optional(),
  /** Issued at (Unix timestamp) */
  iat: z.number(),
  /** Expires at (Unix timestamp) */
  exp: z.number(),
  /** JWT ID */
  jti: z.string().uuid().optional(),
  /** Session ID */
  sid: z.string().uuid().optional(),
  /** Custom claims */
  claims: z.record(z.unknown()).optional(),
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;

/**
 * Create token payload (signing handled by @gtcx/crypto)
 */
export function createTokenPayload(options: {
  subject: string;
  issuer?: string;
  audience?: string;
  expiresIn: number; // seconds
  sessionId?: string;
  claims?: Record<string, unknown>;
}): TokenPayload {
  const now = Math.floor(Date.now() / 1000);
  
  return {
    sub: options.subject,
    iss: options.issuer,
    aud: options.audience,
    iat: now,
    exp: now + options.expiresIn,
    jti: crypto.randomUUID(),
    sid: options.sessionId,
    claims: options.claims,
  };
}

/**
 * Validate token payload (signature verification handled by @gtcx/crypto)
 */
export function validateTokenPayload(
  payload: unknown
): { valid: true; payload: TokenPayload } | { valid: false; reason: string } {
  // Parse payload
  const parsed = TokenPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { valid: false, reason: 'INVALID_PAYLOAD' };
  }
  
  const { data } = parsed;
  const now = Math.floor(Date.now() / 1000);
  
  // Check expiration
  if (data.exp < now) {
    return { valid: false, reason: 'TOKEN_EXPIRED' };
  }
  
  // Check not-before (if token has iat, ensure it's not in the future)
  if (data.iat > now + 60) { // Allow 60s clock skew
    return { valid: false, reason: 'TOKEN_NOT_YET_VALID' };
  }
  
  return { valid: true, payload: data };
}

// =============================================================================
// LOCKOUT TRACKING
// =============================================================================

export interface LockoutConfig {
  /** Maximum failed attempts before lockout */
  maxAttempts: number;
  /** Lockout duration in milliseconds */
  lockoutDuration: number;
  /** Window for counting attempts in milliseconds */
  attemptWindow: number;
}

export const DEFAULT_LOCKOUT_CONFIG: LockoutConfig = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  attemptWindow: 5 * 60 * 1000,    // 5 minutes
};

export interface LockoutState {
  attempts: number;
  firstAttemptAt: string;
  lockedUntil?: string;
}

/**
 * Check if account is locked
 */
export function isLocked(state: LockoutState | undefined): boolean {
  if (!state?.lockedUntil) return false;
  return new Date() < new Date(state.lockedUntil);
}

/**
 * Record failed attempt, return new state
 */
export function recordFailedAttempt(
  state: LockoutState | undefined,
  config: LockoutConfig = DEFAULT_LOCKOUT_CONFIG
): LockoutState {
  const now = new Date();
  
  // If no state or window expired, start fresh
  if (!state || now.getTime() - new Date(state.firstAttemptAt).getTime() > config.attemptWindow) {
    return {
      attempts: 1,
      firstAttemptAt: now.toISOString(),
    };
  }
  
  // Increment attempts
  const newAttempts = state.attempts + 1;
  
  // Check if should lock
  if (newAttempts >= config.maxAttempts) {
    return {
      ...state,
      attempts: newAttempts,
      lockedUntil: new Date(now.getTime() + config.lockoutDuration).toISOString(),
    };
  }
  
  return {
    ...state,
    attempts: newAttempts,
  };
}

/**
 * Clear lockout state (on successful auth)
 */
export function clearLockout(): LockoutState | undefined {
  return undefined;
}
