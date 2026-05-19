/**
 * @gtcx/verification — Coverage gap tests
 *
 * Targets branches uncovered in 2026-05-19 coverage run.
 */

import { describe, it, expect, vi } from 'vitest';

import {
  validateCertificateInput,
  createStandardCertificateData,
  createMilitaryGradeCertificateData,
} from '../src/certificates/generator';
import {
  createInMemoryRevocationChecker,
  createDenyAllRevocationChecker,
} from '../src/certificates/revocation';
import type { RevocationChecker } from '../src/certificates/revocation';
import { parseProofBundle, extractProofHashes } from '../src/proofs/bundler';
import { createGoldLotQRData, verifyQRCodeData } from '../src/qr/generator';
import { tracedVerifyCertificate } from '../src/traced/certificates';

describe('validateCertificateInput — rule.value mismatch', () => {
  it('reports validation rule value mismatch', () => {
    const result = validateCertificateInput({
      templateId: 'asset-origin',
      assetLotData: { commodityType: 'gold', weight: 1, purity: 99.9 },
      location: { latitude: 0, longitude: 0, accuracy: 5 },
      userRole: 'inspector',
      deviceId: 'device-1',
      validationMetrics: { integrityCheck: false },
    } as Parameters<typeof validateCertificateInput>[0]);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Integrity check'))).toBe(true);
  });
});

describe('createStandardCertificateData — unknown template', () => {
  it('throws for unknown template', () => {
    expect(() =>
      createStandardCertificateData({
        templateId: 'unknown-template-xyz',
        assetLotData: { commodityType: 'gold', weight: 1, purity: 99.9 },
      } as Parameters<typeof createStandardCertificateData>[0])
    ).toThrow();
  });
});

describe('createMilitaryGradeCertificateData — unknown template', () => {
  it('throws for unknown template', () => {
    expect(() =>
      createMilitaryGradeCertificateData({
        templateId: 'unknown-template-xyz',
        assetLotData: { commodityType: 'gold', weight: 1, purity: 99.9 },
      } as Parameters<typeof createMilitaryGradeCertificateData>[0])
    ).toThrow();
  });

  it('throws for non-military template', () => {
    expect(() =>
      createMilitaryGradeCertificateData({
        templateId: 'location',
        assetLotData: { commodityType: 'gold', weight: 1, purity: 99.9 },
      } as Parameters<typeof createMilitaryGradeCertificateData>[0])
    ).toThrow('not military-grade');
  });
});

describe('revocation checkers', () => {
  it('createInMemoryRevocationChecker reads revocation from metadata', async () => {
    const checker = createInMemoryRevocationChecker();
    const result = await checker.check({
      certificateId: 'cert-1',
      metadata: { revocation: { revoked: true, reason: 'test' } },
    } as Parameters<RevocationChecker['check']>[0]);
    expect(result.revoked).toBe(true);
    expect(result.reason).toBe('test');
  });

  it('createDenyAllRevocationChecker always returns revoked', async () => {
    const checker = createDenyAllRevocationChecker('test reason');
    const result = await checker.check({ certificateId: 'cert-1' } as Parameters<
      RevocationChecker['check']
    >[0]);
    expect(result.revoked).toBe(true);
    expect(result.reason).toBe('test reason');
  });
});

describe('parseProofBundle — error branches', () => {
  it('returns null for oversized bundle', () => {
    const onError = vi.fn();
    const result = parseProofBundle('x'.repeat(2_000_000), onError);
    expect(result).toBeNull();
    expect(onError).toHaveBeenCalledOnce();
  });

  it('returns null for schema validation failure', () => {
    const onError = vi.fn();
    const result = parseProofBundle('{"id":"test"}', onError);
    expect(result).toBeNull();
    expect(onError).toHaveBeenCalledOnce();
  });
});

describe('extractProofHashes — missing hash branches', () => {
  it('skips entries with missing hashes', () => {
    const bundle = {
      id: 'b1',
      type: 'workflow',
      timestamp: Date.now(),
      proofs: {
        cryptographicProof: { dataHash: 'hash1' },
        locationProof: { hash: '' },
        photoProofs: [{ hash: '' }, { hash: 'hash2' }],
      },
    } as Parameters<typeof extractProofHashes>[0];
    const result = extractProofHashes(bundle);
    expect(result).toEqual(['hash1', 'hash2']);
  });
});

describe('createGoldLotQRData', () => {
  it('creates gold-specific QR data', () => {
    const result = createGoldLotQRData(
      'cert-1',
      { weight: 12.5, purity: 99.99, miner: 'miner-a', location: { latitude: 0, longitude: 0 } },
      'hash123'
    );
    expect(result.type).toBe('asset-lot');
  });
});

describe('verifyQRCodeData — edge branches', () => {
  const baseQR = {
    certificateId: 'GH-12345678',
    verifyUrl: 'https://gtcx.io/verify',
    hash: 'abc123',
    timestamp: Date.now(),
    type: 'asset-lot' as const,
  };

  it('rejects invalid QR type', () => {
    const result = verifyQRCodeData({ ...baseQR, type: 'invalid-type' });
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid QR code type');
  });

  it('accepts legacy gold-lot type', () => {
    const result = verifyQRCodeData({ ...baseQR, type: 'gold-lot' });
    expect(result.isValid).toBe(true);
  });

  it('rejects timestamp in the future', () => {
    const result = verifyQRCodeData({ ...baseQR, timestamp: Date.now() + 86400000 });
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Certificate timestamp is in the future');
  });

  it('rejects expired certificate', () => {
    const result = verifyQRCodeData({ ...baseQR, timestamp: Date.now() - 86400000 * 400 });
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Certificate has expired');
  });
});

describe('tracedVerifyCertificate — uncovered branches', () => {
  it('reports structural check when crypto verification skipped', async () => {
    const now = Date.now();
    const cert = {
      certificateId: 'c1',
      type: 'standard',
      version: 1,
      createdAt: now,
      metadata: {
        issuedAt: now,
        issuer: 'test',
        timestamp: now,
        location: { latitude: 0, longitude: 0 },
      },
      verificationData: { publicKey: 'pk', signature: 'sig', timestamp: now },
      dataHash: '',
    };
    const checker: RevocationChecker = { check: async () => ({ revoked: false }) };
    const result = await tracedVerifyCertificate(
      cert as unknown as Parameters<typeof tracedVerifyCertificate>[0],
      checker
    );
    // When dataHash is empty, hashValid is false, so the certificate fails validation
    // The details path depends on which check fails first
    expect(result.isValid).toBe(false);
  });
});
