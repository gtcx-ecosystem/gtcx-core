import { describe, expect, it } from 'vitest';

import {
  sanitizeGenerateCertificateInput,
  sanitizeGenerateCertificateOutput,
  sanitizeVerifyCertificateInput,
  sanitizeGenerateQRCodeOutput,
  sanitizeCreateProofBundleInput,
  sanitizeCreateProofBundleOutput,
} from '../src/traced';
import type { Certificate, GeneratedQRCode, ProofBundle } from '../src/types';

describe('traced sanitizers', () => {
  describe('sanitizeGenerateCertificateInput', () => {
    it('extracts safe fields from certificate input', () => {
      const input = [
        {
          type: 'standard' as const,
          securityLevel: 'standard' as const,
          location: { latitude: 1, longitude: 2, name: 'Test' },
          assetData: { id: 'asset-1' },
          claims: [{ id: 'claim-1' }],
          privateKey: 'super-secret-key',
          publicKey: 'pub-key',
        },
      ];
      const result = sanitizeGenerateCertificateInput(input);
      expect(result).toEqual({
        type: 'standard',
        securityLevel: 'standard',
        hasAssetData: true,
        claimCount: 1,
        hasPrivateKey: true,
      });
      expect(result).not.toHaveProperty('privateKey');
    });

    it('handles missing optional fields', () => {
      const input = [
        {
          type: 'standard' as const,
          securityLevel: 'standard' as const,
          location: { latitude: 0, longitude: 0, name: '' },
          privateKey: '',
          publicKey: '',
        },
      ];
      const result = sanitizeGenerateCertificateInput(input);
      expect(result).toEqual({
        type: 'standard',
        securityLevel: 'standard',
        hasAssetData: false,
        claimCount: 0,
        hasPrivateKey: false,
      });
    });
  });

  describe('sanitizeGenerateCertificateOutput', () => {
    it('extracts safe fields from certificate output', () => {
      const cert = {
        certificateId: 'cert-1',
        type: 'standard',
        securityLevel: 'standard',
        metadata: { issuedAt: 123456 },
      } as Certificate;
      const result = sanitizeGenerateCertificateOutput(cert);
      expect(result).toEqual({
        certificateId: 'cert-1',
        type: 'standard',
        securityLevel: 'standard',
        issuedAt: 123456,
      });
    });

    it('handles missing metadata', () => {
      const result = sanitizeGenerateCertificateOutput({} as Certificate);
      expect(result).toEqual({
        certificateId: undefined,
        type: undefined,
        securityLevel: undefined,
        issuedAt: undefined,
      });
    });
  });

  describe('sanitizeVerifyCertificateInput', () => {
    it('extracts safe fields from certificate array', () => {
      const certs = [
        {
          certificateId: 'cert-1',
          type: 'standard',
          securityLevel: 'standard',
        } as Certificate,
      ];
      const result = sanitizeVerifyCertificateInput(certs);
      expect(result).toEqual({
        certificateId: 'cert-1',
        type: 'standard',
        securityLevel: 'standard',
      });
    });
  });

  describe('sanitizeGenerateQRCodeOutput', () => {
    it('extracts safe fields from QR code output', () => {
      const qr = {
        id: 'qr-1',
        data: { type: 'certificate' },
        size: 256,
      } as GeneratedQRCode;
      const result = sanitizeGenerateQRCodeOutput(qr);
      expect(result).toEqual({
        id: 'qr-1',
        type: 'certificate',
        size: 256,
      });
    });
  });

  describe('sanitizeCreateProofBundleInput', () => {
    it('extracts safe fields from proof bundle input', () => {
      const input = [
        {
          type: 'location' as const,
          location: { latitude: 1, longitude: 2, name: 'Test' },
          photoHashes: ['hash1', 'hash2'],
          certificate: { certificateId: 'cert-1' } as Certificate,
          claims: [{ id: 'claim-1' }],
        },
      ];
      const result = sanitizeCreateProofBundleInput(input);
      expect(result).toEqual({
        type: 'location',
        hasLocation: true,
        photoCount: 2,
        hasCertificate: true,
        claimCount: 1,
      });
    });
  });

  describe('sanitizeCreateProofBundleOutput', () => {
    it('extracts safe fields from proof bundle output', () => {
      const bundle = {
        id: 'bundle-1',
        type: 'location',
        certificate: { certificateId: 'cert-1' },
        qrCode: { id: 'qr-1' },
      } as ProofBundle;
      const result = sanitizeCreateProofBundleOutput(bundle);
      expect(result).toEqual({
        id: 'bundle-1',
        type: 'location',
        hasCertificate: true,
        hasQRCode: true,
      });
    });
  });
});
