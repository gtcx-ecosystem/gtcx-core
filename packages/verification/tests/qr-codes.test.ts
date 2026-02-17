import { describe, it, expect } from 'vitest';

import {
  generateQRCodeId,
  createLocationQRData,
  createPhotoQRData,
  createAssetLotQRData,
  createCertificateQRData,
  createQRCodeStructure,
  serializeQRData,
  parseQRData,
  verifyQRCodeData,
  hashQRCodeContent,
  getQRCodeCommodityType,
} from '../src/qr/generator';
import type { QRCodeData } from '../src/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeValidQRCodeData(overrides: Partial<QRCodeData> = {}): QRCodeData {
  return {
    certificateId: 'CERT_TEST_123',
    verifyUrl: 'https://verify.gtcx.io/verify/CERT_TEST_123',
    hash: 'abcdef1234567890',
    timestamp: Date.now(),
    type: 'location',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// generateQRCodeId
// ---------------------------------------------------------------------------

describe('generateQRCodeId', () => {
  it('returns a string starting with "qr_"', () => {
    const id = generateQRCodeId();
    expect(id).toMatch(/^qr_/);
  });

  it('returns unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateQRCodeId()));
    expect(ids.size).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// createLocationQRData
// ---------------------------------------------------------------------------

describe('createLocationQRData', () => {
  it('produces a valid QR data structure with type "location"', () => {
    const location = { latitude: 6.2, longitude: -1.6 };
    const hash = 'a1b2c3d4e5f60000000000000000000000';
    const data = createLocationQRData('CERT_LOC_1', location, hash);

    expect(data.certificateId).toBe('CERT_LOC_1');
    expect(data.type).toBe('location');
    expect(data.verifyUrl).toContain('CERT_LOC_1');
    expect(data.hash).toBe(hash.substring(0, 16));
    expect(data.timestamp).toBeGreaterThan(0);
    expect(data.metadata?.location).toEqual(location);
  });

  it('respects custom verifyBaseUrl config', () => {
    const data = createLocationQRData(
      'CERT_LOC_2',
      { latitude: 0, longitude: 0 },
      'deadbeef00000000',
      { verifyBaseUrl: 'https://custom.example.com' }
    );
    expect(data.verifyUrl).toMatch(/^https:\/\/custom\.example\.com\/verify\//);
  });
});

// ---------------------------------------------------------------------------
// createPhotoQRData
// ---------------------------------------------------------------------------

describe('createPhotoQRData', () => {
  it('produces a valid QR data structure with type "photo"', () => {
    const photoHash = 'feedfacedeadbeef1234567890abcdef';
    const data = createPhotoQRData('CERT_PHOTO_1', photoHash);

    expect(data.type).toBe('photo');
    expect(data.certificateId).toBe('CERT_PHOTO_1');
    expect(data.hash).toBe(photoHash.substring(0, 16));
    expect(data.verifyUrl).toContain('CERT_PHOTO_1');
  });

  it('includes location metadata when provided', () => {
    const loc = { latitude: 10, longitude: 20 };
    const data = createPhotoQRData('CERT_PHOTO_2', 'aabbccdd00000000', loc);
    expect(data.metadata?.location).toEqual(loc);
  });

  it('omits metadata when no location is provided', () => {
    const data = createPhotoQRData('CERT_PHOTO_3', 'aabbccdd00000000');
    expect(data.metadata).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// createAssetLotQRData
// ---------------------------------------------------------------------------

describe('createAssetLotQRData', () => {
  it('produces a valid QR data structure with type "asset-lot"', () => {
    const data = createAssetLotQRData(
      'CERT_ASSET_1',
      {
        weight: 15.5,
        unit: 'troy_oz',
        purity: 99.5,
        commodityType: 'gold',
        producerId: 'miner-001',
        operatorRole: 'producer',
        location: { latitude: 6.2, longitude: -1.6 },
      },
      'hash0000111122223333'
    );

    expect(data.type).toBe('asset-lot');
    expect(data.certificateId).toBe('CERT_ASSET_1');
    expect(data.metadata?.assetWeight).toBe(15.5);
    expect(data.metadata?.assetUnit).toBe('troy_oz');
    expect(data.metadata?.purity).toBe(99.5);
    expect(data.metadata?.commodityType).toBe('gold');
    expect(data.metadata?.producerId).toBe('miner-001');
    expect(data.metadata?.operatorRole).toBe('producer');
    expect(data.metadata?.location).toEqual({ latitude: 6.2, longitude: -1.6 });
  });

  it('works for non-gold commodities like cocoa', () => {
    const data = createAssetLotQRData(
      'CERT_ASSET_2',
      {
        weight: 500,
        unit: 'kg',
        commodityType: 'cocoa',
        location: { latitude: 5.5, longitude: -3.9 },
      },
      'hash0000111122223333'
    );

    expect(data.metadata?.commodityType).toBe('cocoa');
    expect(data.metadata?.assetUnit).toBe('kg');
  });
});

// ---------------------------------------------------------------------------
// createCertificateQRData
// ---------------------------------------------------------------------------

describe('createCertificateQRData', () => {
  it('produces a valid QR data structure with type "certificate"', () => {
    const issuedAt = Date.now();
    const data = createCertificateQRData(
      {
        certificateId: 'CERT_QR_1',
        issuedAt,
        location: { latitude: 1, longitude: 2 },
        assetLotData: {
          estimatedWeight: 10,
          unit: 'troy_oz',
          purity: 95,
          commodityType: 'gold',
          producerId: 'p-1',
          operatorRole: 'producer',
        },
      },
      'proofhash000011112222'
    );

    expect(data.type).toBe('certificate');
    expect(data.certificateId).toBe('CERT_QR_1');
    expect(data.timestamp).toBe(issuedAt);
    expect(data.metadata?.assetWeight).toBe(10);
    expect(data.metadata?.commodityType).toBe('gold');
    expect(data.metadata?.location).toEqual({ latitude: 1, longitude: 2 });
  });

  it('handles legacy goldLotData', () => {
    const data = createCertificateQRData(
      {
        certificateId: 'CERT_LEGACY',
        issuedAt: Date.now(),
        goldLotData: {
          estimatedWeight: 20,
          purity: 92,
          miner: 'miner-legacy',
        },
      },
      'proofhash000011112222'
    );

    expect(data.metadata?.assetWeight).toBe(20);
    expect(data.metadata?.commodityType).toBe('gold');
    expect(data.metadata?.producerId).toBe('miner-legacy');
  });

  it('omits metadata when no optional data is provided', () => {
    const data = createCertificateQRData(
      { certificateId: 'CERT_EMPTY', issuedAt: Date.now() },
      'proofhash000011112222'
    );
    expect(data.metadata).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// createQRCodeStructure
// ---------------------------------------------------------------------------

describe('createQRCodeStructure', () => {
  it('wraps QR data correctly', () => {
    const qrData = makeValidQRCodeData();
    const structure = createQRCodeStructure(qrData);

    expect(structure.id).toMatch(/^qr_/);
    expect(structure.data).toEqual(qrData);
    expect(structure.dataString).toBe(JSON.stringify(qrData));
    expect(structure.size).toBe(256); // default
    expect(structure.timestamp).toBeGreaterThan(0);
  });

  it('accepts a custom size', () => {
    const structure = createQRCodeStructure(makeValidQRCodeData(), 512);
    expect(structure.size).toBe(512);
  });
});

// ---------------------------------------------------------------------------
// serializeQRData / parseQRData
// ---------------------------------------------------------------------------

describe('serializeQRData / parseQRData round-trip', () => {
  it('successfully round-trips valid QR data', () => {
    const original = makeValidQRCodeData({ type: 'photo' });
    const serialized = serializeQRData(original);
    const parsed = parseQRData(serialized);

    expect(parsed).toEqual(original);
  });

  it('parseQRData returns null for invalid JSON', () => {
    expect(parseQRData('not json')).toBeNull();
  });

  it('parseQRData returns null for empty string', () => {
    expect(parseQRData('')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// verifyQRCodeData
// ---------------------------------------------------------------------------

describe('verifyQRCodeData', () => {
  it('validates a well-formed QR data object', () => {
    const data = makeValidQRCodeData();
    const result = verifyQRCodeData(data);
    expect(result.isValid).toBe(true);
    expect(result.data).toEqual(data);
  });

  it('validates a serialized JSON string', () => {
    const data = makeValidQRCodeData();
    const result = verifyQRCodeData(JSON.stringify(data));
    expect(result.isValid).toBe(true);
  });

  it('rejects invalid JSON string', () => {
    const result = verifyQRCodeData('broken{{{');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects data with missing required fields', () => {
    const result = verifyQRCodeData({
      certificateId: '',
      verifyUrl: '',
      hash: '',
      timestamp: 0,
      type: 'location',
    } as QRCodeData);
    expect(result.isValid).toBe(false);
  });

  it('rejects certificate with invalid ID format', () => {
    const data = makeValidQRCodeData({ certificateId: 'invalid id with spaces' });
    const result = verifyQRCodeData(data);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Invalid certificate ID format');
  });

  it('rejects certificate with future timestamp', () => {
    const data = makeValidQRCodeData({ timestamp: Date.now() + 1_000_000 });
    const result = verifyQRCodeData(data);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('future');
  });

  it('rejects expired certificate when older than maxCertificateAge', () => {
    const twoYearsAgo = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000;
    const data = makeValidQRCodeData({ timestamp: twoYearsAgo });
    const result = verifyQRCodeData(data);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('expired');
  });

  it('accepts all valid QRCodeType values', () => {
    for (const type of ['location', 'photo', 'certificate', 'asset-lot'] as const) {
      const data = makeValidQRCodeData({ type });
      const result = verifyQRCodeData(data);
      expect(result.isValid).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// hashQRCodeContent
// ---------------------------------------------------------------------------

describe('hashQRCodeContent', () => {
  it('returns a deterministic hex string', () => {
    const hash1 = hashQRCodeContent('hello world');
    const hash2 = hashQRCodeContent('hello world');
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]+$/);
  });

  it('returns different hashes for different inputs', () => {
    expect(hashQRCodeContent('a')).not.toBe(hashQRCodeContent('b'));
  });

  it('handles object inputs by stringifying', () => {
    const obj = { foo: 'bar' };
    const hash1 = hashQRCodeContent(obj);
    const hash2 = hashQRCodeContent(JSON.stringify(obj));
    expect(hash1).toBe(hash2);
  });
});

// ---------------------------------------------------------------------------
// getQRCodeCommodityType
// ---------------------------------------------------------------------------

describe('getQRCodeCommodityType', () => {
  it('extracts commodity type from metadata', () => {
    const data = makeValidQRCodeData({
      metadata: { commodityType: 'gold' },
    });
    expect(getQRCodeCommodityType(data)).toBe('gold');
  });

  it('returns undefined when no metadata', () => {
    const data = makeValidQRCodeData();
    delete data.metadata;
    expect(getQRCodeCommodityType(data)).toBeUndefined();
  });

  it('returns undefined when metadata has no commodityType', () => {
    const data = makeValidQRCodeData({
      metadata: { location: { latitude: 0, longitude: 0 } },
    });
    expect(getQRCodeCommodityType(data)).toBeUndefined();
  });
});
