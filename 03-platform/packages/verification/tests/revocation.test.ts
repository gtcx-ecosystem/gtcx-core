import { describe, it, expect, beforeEach } from 'vitest';

import {
  RevocationRegistry,
  assertNotRevoked,
  checkRevocationStatus,
  type Certificate,
  type CertificateLocation,
} from '../src/certificates';

function makeLocation(overrides: Partial<CertificateLocation> = {}): CertificateLocation {
  return {
    latitude: 6.2,
    longitude: -1.6,
    accuracy: 5,
    timestamp: Date.now(),
    ...overrides,
  };
}

function makeCertificate(overrides: Partial<Certificate> = {}): Certificate {
  return {
    certificateId: 'CERT-REV-001',
    version: '1.0',
    type: 'location',
    securityLevel: 'standard',
    metadata: {
      issuer: 'GTCX Test',
      issuedAt: Date.now(),
      userRole: 'producer',
      deviceId: 'device-001',
      location: makeLocation(),
    },
    verificationData: {
      publicKey: 'pk-test',
      signature: 'sig-test',
      timestamp: Date.now(),
    },
    createdAt: Date.now(),
    ...overrides,
  };
}

describe('revocation registry', () => {
  beforeEach(() => {
    RevocationRegistry.getInstance().clear();
  });

  it('reports certificates as active when not present in the registry', () => {
    const status = RevocationRegistry.getInstance().check('missing-cert');
    expect(status).toEqual({ revoked: false });
  });

  it('persists revocation details in the registry', () => {
    RevocationRegistry.getInstance().revoke('cert-123', 'manual review failed');

    const status = RevocationRegistry.getInstance().check('cert-123');
    expect(status.revoked).toBe(true);
    expect(status.reason).toBe('manual review failed');
    expect(status.revokedAt).toBeTypeOf('number');
    expect(status.revocationId).toMatch(/^REV-\d+-[0-9A-F]{8}$/);
  });
});

describe('checkRevocationStatus', () => {
  beforeEach(() => {
    RevocationRegistry.getInstance().clear();
  });

  it('prefers inline revocation metadata when present', async () => {
    const certificate = makeCertificate({
      metadata: {
        issuer: 'GTCX Test',
        issuedAt: Date.now(),
        userRole: 'producer',
        deviceId: 'device-001',
        location: makeLocation(),
        revocation: {
          revoked: true,
          revokedAt: 123,
          reason: 'inline status',
        },
      },
    });

    await expect(checkRevocationStatus(certificate)).resolves.toEqual({
      revoked: true,
      revokedAt: 123,
      reason: 'inline status',
    });
  });

  it('falls back to the shared registry when metadata has no revocation info', async () => {
    const certificate = makeCertificate();
    RevocationRegistry.getInstance().revoke(certificate.certificateId, 'registry status');

    const status = await checkRevocationStatus(certificate);
    expect(status.revoked).toBe(true);
    expect(status.reason).toBe('registry status');
  });
});

describe('assertNotRevoked', () => {
  beforeEach(() => {
    RevocationRegistry.getInstance().clear();
  });

  it('does not throw for active certificates', async () => {
    await expect(assertNotRevoked(makeCertificate())).resolves.toBeUndefined();
  });

  it('throws a verification error for revoked certificates', async () => {
    const certificate = makeCertificate();
    RevocationRegistry.getInstance().revoke(certificate.certificateId, 'fraud investigation');

    await expect(assertNotRevoked(certificate)).rejects.toThrow(
      /fraud investigation|Certificate CERT-REV-001 has been revoked/
    );
  });
});
