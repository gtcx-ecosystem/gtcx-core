/**
 * @gtcx/security - Authentication Tokens
 *
 * JWT and credential handling utilities.
 * Implements P9 (Security) principle.
 *
 * NOTE: This module provides utilities for working with tokens.
 * Actual cryptographic signing uses @gtcx/crypto.
 *
 * @packageDocumentation
 */

import { verify } from '@gtcx/crypto';
import { z } from 'zod';

// =============================================================================
// TOKEN SCHEMAS
// =============================================================================

/**
 * JWT Header schema
 */
export const JWTHeaderSchema = z.object({
  alg: z.enum(['EdDSA', 'ES256K']),
  typ: z.literal('JWT'),
  kid: z.string().optional(),
});

/**
 * Standard JWT claims
 */
export const JWTClaimsSchema = z.object({
  // Registered claims
  iss: z.string().optional(), // Issuer
  sub: z.string().optional(), // Subject
  aud: z.union([z.string(), z.array(z.string())]).optional(), // Audience
  exp: z.number().optional(), // Expiration time
  nbf: z.number().optional(), // Not before
  iat: z.number().optional(), // Issued at
  jti: z.string().optional(), // JWT ID
});

/**
 * GTCX-specific token claims
 */
export const GTCXTokenClaimsSchema = JWTClaimsSchema.extend({
  // GTCX-specific claims
  tradePassId: z.string().optional(),
  roles: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
  tier: z.enum(['UNVERIFIED', 'BASIC', 'STANDARD', 'PREMIUM', 'SOVEREIGN']).optional(),
  offline: z.boolean().optional(), // Token valid for offline use
  offlineExpiry: z.number().optional(), // Separate expiry for offline use
});

// =============================================================================
// TOKEN TYPES
// =============================================================================

export type JWTHeader = z.infer<typeof JWTHeaderSchema>;
export type JWTClaims = z.infer<typeof JWTClaimsSchema>;
export type GTCXTokenClaims = z.infer<typeof GTCXTokenClaimsSchema>;

export interface Token {
  header: JWTHeader;
  claims: GTCXTokenClaims;
  signature: string;
  raw: string;
}

export interface TokenValidationResult {
  valid: boolean;
  expired: boolean;
  notYetValid: boolean;
  claims?: GTCXTokenClaims;
  error?: string;
}

// =============================================================================
// TOKEN UTILITIES
// =============================================================================

/**
 * Decode a JWT without verifying signature
 * Use this only for inspection - always verify before trusting!
 */
export function decodeToken(token: string): Token | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [headerB64, claimsB64, signature] = parts;

    const header = JSON.parse(base64UrlDecode(headerB64!));
    const claims = JSON.parse(base64UrlDecode(claimsB64!));

    const validatedHeader = JWTHeaderSchema.parse(header);
    const validatedClaims = GTCXTokenClaimsSchema.parse(claims);

    return {
      header: validatedHeader,
      claims: validatedClaims,
      signature: signature!,
      raw: token,
    };
  } catch {
    return null;
  }
}

/**
 * Check if token claims are temporally valid (not expired, not before nbf)
 */
export function isTokenTemporallyValid(
  claims: JWTClaims,
  clockSkewSeconds = 60
): { valid: boolean; expired: boolean; notYetValid: boolean } {
  const now = Math.floor(Date.now() / 1000);

  // Check expiration
  const expired = claims.exp !== undefined && now > claims.exp + clockSkewSeconds;

  // Check not-before
  const notYetValid = claims.nbf !== undefined && now < claims.nbf - clockSkewSeconds;

  return {
    valid: !expired && !notYetValid,
    expired,
    notYetValid,
  };
}

/**
 * Check if token is valid for offline use
 */
export function isTokenValidOffline(claims: GTCXTokenClaims, maxOfflineHours = 72): boolean {
  if (!claims.offline) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);

  // Use offline-specific expiry if provided
  if (claims.offlineExpiry !== undefined) {
    return now < claims.offlineExpiry;
  }

  // Otherwise check if within max offline window from issuance
  if (claims.iat !== undefined) {
    const maxOfflineSeconds = maxOfflineHours * 60 * 60;
    return now < claims.iat + maxOfflineSeconds;
  }

  return false;
}

/**
 * Create unsigned token payload (for signing with @gtcx/crypto)
 */
export function createTokenPayload(claims: GTCXTokenClaims, options: TokenOptions = {}): string {
  const { algorithm = 'EdDSA', keyId, expiresInSeconds = 3600, offlineExpiresInSeconds } = options;

  const now = Math.floor(Date.now() / 1000);

  const header: JWTHeader = {
    alg: algorithm,
    typ: 'JWT',
    ...(keyId && { kid: keyId }),
  };

  const fullClaims: GTCXTokenClaims = {
    ...claims,
    iat: now,
    exp: now + expiresInSeconds,
    ...(offlineExpiresInSeconds && {
      offline: true,
      offlineExpiry: now + offlineExpiresInSeconds,
    }),
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const claimsB64 = base64UrlEncode(JSON.stringify(fullClaims));

  return `${headerB64}.${claimsB64}`;
}

export interface TokenOptions {
  algorithm?: 'EdDSA' | 'ES256K';
  keyId?: string;
  expiresInSeconds?: number;
  offlineExpiresInSeconds?: number;
}

/**
 * Assemble token from payload and signature.
 *
 * @param payload - The base64url-encoded header.claims string
 * @param signature - Raw signature bytes (Uint8Array/Buffer) or an already
 *   base64url-encoded string. Raw bytes are preferred to avoid double-encoding.
 */
export function assembleToken(payload: string, signature: string | Uint8Array): string {
  if (signature instanceof Uint8Array) {
    // Raw bytes — encode once
    const base64 = Buffer.from(signature).toString('base64');
    const encoded = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return `${payload}.${encoded}`;
  }

  // String signature — check if it's already base64url-encoded
  // (base64url uses only alphanumeric, '-', and '_'; no '+', '/', or '=')
  const isBase64Url = /^[A-Za-z0-9_-]+$/.test(signature);
  if (isBase64Url) {
    // Already encoded — use as-is
    return `${payload}.${signature}`;
  }

  // Not base64url — encode it
  return `${payload}.${base64UrlEncode(signature)}`;
}

/**
 * Verify a token's cryptographic signature and temporal validity.
 *
 * @param token - The full JWT string (header.claims.signature)
 * @param publicKeyHex - Hex-encoded Ed25519 public key of the issuer
 * @param clockSkewSeconds - Allowed clock skew in seconds (default 60)
 */
export function verifyTokenSignature(
  token: string,
  publicKeyHex: string,
  clockSkewSeconds = 60
): TokenValidationResult {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, expired: false, notYetValid: false, error: 'Invalid token format' };
  }

  const payload = `${parts[0]}.${parts[1]}`;
  const signatureHex = parts[2]!;

  // Verify cryptographic signature
  let sigValid: boolean;
  try {
    sigValid = verify(payload, signatureHex, publicKeyHex);
  } catch {
    return {
      valid: false,
      expired: false,
      notYetValid: false,
      error: 'Signature verification failed',
    };
  }

  if (!sigValid) {
    return { valid: false, expired: false, notYetValid: false, error: 'Invalid signature' };
  }

  // Decode and validate claims
  const decoded = decodeToken(token);
  if (!decoded) {
    return {
      valid: false,
      expired: false,
      notYetValid: false,
      error: 'Failed to decode token claims',
    };
  }

  // Check temporal validity
  const temporal = isTokenTemporallyValid(decoded.claims, clockSkewSeconds);

  return {
    valid: temporal.valid,
    expired: temporal.expired,
    notYetValid: temporal.notYetValid,
    claims: decoded.claims,
    ...(temporal.expired ? { error: 'Token has expired' } : {}),
    ...(temporal.notYetValid ? { error: 'Token is not yet valid' } : {}),
  };
}

// =============================================================================
// BASE64URL UTILITIES
// =============================================================================

function base64UrlEncode(input: string): string {
  const base64 = Buffer.from(input).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  return Buffer.from(base64, 'base64').toString('utf8');
}
