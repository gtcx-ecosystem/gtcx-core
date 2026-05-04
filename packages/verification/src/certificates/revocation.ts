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
