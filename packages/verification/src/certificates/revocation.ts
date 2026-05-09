/**
 * @gtcx/verification - Revocation Registry
 *
 * Manages certificate revocation status.
 * Future-proofed for decentralized registry integration.
 */

import { randomBytes } from 'node:crypto';

import { type Certificate } from '../types';

import { VerificationError } from './errors';

export interface RevocationStatus {
  revoked: boolean;
  revokedAt?: number | undefined;
  reason?: string | undefined;
  revocationId?: string | undefined;
}

export interface RevocationEntry extends RevocationStatus {
  certificateId: string;
}

/**
 * Revocation Registry Implementation
 *
 * In a production environment, this would interface with a
 * distributed ledger or a secure central registry.
 */
export class RevocationRegistry {
  private static instance: RevocationRegistry;
  private registry = new Map<string, RevocationEntry>();

  private constructor() {}

  public static getInstance(): RevocationRegistry {
    if (!RevocationRegistry.instance) {
      RevocationRegistry.instance = new RevocationRegistry();
    }
    return RevocationRegistry.instance;
  }

  /**
   * Mark a certificate as revoked
   */
  public revoke(certificateId: string, reason: string): void {
    const randomSuffix = randomBytes(4).toString('hex').toUpperCase();
    this.registry.set(certificateId, {
      certificateId,
      revoked: true,
      revokedAt: Date.now(),
      reason,
      revocationId: `REV-${Date.now()}-${randomSuffix}`,
    });
  }

  /**
   * Check if a certificate is revoked
   */
  public check(certificateId: string): RevocationStatus {
    const entry = this.registry.get(certificateId);
    if (entry) {
      return {
        revoked: entry.revoked,
        revokedAt: entry.revokedAt,
        reason: entry.reason,
        revocationId: entry.revocationId,
      };
    }
    return { revoked: false };
  }

  /**
   * Clear the registry (useful for tests)
   */
  public clear(): void {
    this.registry.clear();
  }
}

/**
 * Check if a certificate has been revoked.
 *
 * Proxies to the RevocationRegistry.
 *
 * @param certificate - Certificate to check
 * @returns Revocation status
 */
export async function checkRevocationStatus(certificate: Certificate): Promise<RevocationStatus> {
  // 1. Check metadata for inline revocation info
  const metadata = certificate.metadata as unknown as Record<string, unknown>;
  const revocation = metadata['revocation'] as RevocationStatus | undefined;

  if (revocation?.revoked) {
    return {
      revoked: true,
      revokedAt: revocation.revokedAt,
      reason: revocation.reason,
    };
  }

  // 2. Check the global registry
  return RevocationRegistry.getInstance().check(certificate.certificateId);
}

/**
 * Assert that a certificate is NOT revoked.
 *
 * @throws {VerificationError} if certificate is revoked
 */
export async function assertNotRevoked(certificate: Certificate): Promise<void> {
  const status = await checkRevocationStatus(certificate);
  if (status.revoked) {
    throw new VerificationError(
      `Certificate ${certificate.certificateId} has been revoked: ${status.reason ?? 'No reason provided'}`,
      'VERIFICATION_FAILED',
      { revokedAt: status.revokedAt, reason: status.reason }
    );
  }
}

// ============================================================================
// RevocationChecker — pluggable revocation backend (closes SA-004 / AT-002)
// ============================================================================

/**
 * Pluggable revocation backend.
 *
 * Implementations consult the source of truth for revocation status —
 * an HTTP status-list endpoint (RFC 5280 §5), a distributed ledger,
 * an internal database, or an AI-driven anomaly detector.
 *
 * Implementations SHOULD return within a reasonable timeout (≤ 5s).
 * Callers MUST treat timeouts and errors as "potentially revoked" — never
 * as "not revoked". The fail-closed posture is the security-correct default
 * because a transient backend failure must not silently downgrade trust.
 */
export interface RevocationChecker {
  /**
   * Check whether a certificate has been revoked.
   *
   * @param certificate - The certificate whose status is being queried.
   * @returns Resolves with the revocation status. Implementations that
   *          cannot answer authoritatively SHOULD return `{ revoked: true,
   *          reason: '<backend-error>' }` rather than `{ revoked: false }`.
   */
  check(certificate: Certificate): Promise<RevocationStatus>;
}

/**
 * In-memory revocation checker backed by the singleton {@link RevocationRegistry}.
 *
 * Suitable for testing and single-process environments. Not durable — registry
 * state is lost on process restart. Production deployments must supply their
 * own {@link RevocationChecker} that consults a persistent source.
 */
export function createInMemoryRevocationChecker(): RevocationChecker {
  return {
    check: (certificate) => checkRevocationStatus(certificate),
  };
}

/**
 * Revocation checker that always reports "revoked" for every certificate.
 *
 * Use during incident response when the real revocation backend cannot be
 * trusted, or as the default in environments where revocation is mandatory
 * but no backend is yet wired up. Fail-closed by construction.
 */
export function createDenyAllRevocationChecker(
  reason = 'deny-all checker active'
): RevocationChecker {
  return {
    check: async () => ({ revoked: true, reason }),
  };
}

/**
 * Revocation checker that always reports "not revoked" for every certificate.
 *
 * **DO NOT use in production.** This bypasses the entire revocation pathway
 * and silently reintroduces SA-004. Provided exclusively for tests where
 * revocation is out of scope. The function name and this docstring are the
 * load-bearing safeguards — there is no env-flag guard because tests need
 * to exercise the verify path without a network round-trip.
 *
 * If you find yourself reaching for this in production code, the right
 * answer is `createDenyAllRevocationChecker()` until your real backend
 * is ready.
 *
 * @deprecated for production use only. Tests may use freely.
 */
export function createNoopRevocationChecker(): RevocationChecker {
  return {
    check: async () => ({ revoked: false }),
  };
}
