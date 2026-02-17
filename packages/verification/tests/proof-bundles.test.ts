import { describe, it, expect } from 'vitest';

import {
  generateProofBundleId,
  createLocationProof,
  createPhotoProof,
  createCryptographicProofRef,
  createProofBundle,
  verifyProofBundleStructure,
  serializeProofBundle,
  parseProofBundle,
  hashProofBundle,
  extractProofHashes,
  getProofBundleSummary,
} from '../src/proofs/bundler';
import type {
  ProofBundle,
  CertificateLocation,
  CryptographicProofRef,
  LocationProofRef,
  PhotoProofRef,
  Certificate,
} from '../src/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeLocation(overrides: Partial<CertificateLocation> = {}): CertificateLocation {
  return {
    latitude: 6.2,
    longitude: -1.6,
    altitude: 300,
    accuracy: 5,
    timestamp: Date.now(),
    ...overrides,
  };
}

function makeCryptoProof(overrides: Partial<CryptographicProofRef> = {}): CryptographicProofRef {
  return {
    algorithm: 'Ed25519-SHA256',
    dataHash: 'abc123datahash',
    signature: 'sig456',
    publicKey: 'pk789',
    ...overrides,
  };
}

function makeLocationProof(): LocationProofRef {
  return createLocationProof({
    coordinates: makeLocation(),
    signature: 'loc_sig',
    publicKey: 'loc_pk',
  });
}

function makePhotoProof(): PhotoProofRef {
  return createPhotoProof({
    uri: 'file:///photos/evidence.jpg',
    fileHash: 'photohash123',
    timestamp: Date.now(),
  });
}

function makeValidBundle(overrides: Partial<ProofBundle> = {}): ProofBundle {
  return {
    id: 'proof_test_1',
    type: 'workflow',
    timestamp: Date.now(),
    proofs: {
      cryptographicProof: makeCryptoProof(),
    },
    ...overrides,
  };
}

function makeMinimalCertificate(): Certificate {
  return {
    certificateId: 'CERT_TEST',
    version: '1.0',
    type: 'location',
    securityLevel: 'standard',
    metadata: {
      issuer: 'test',
      issuedAt: Date.now(),
      userRole: 'producer',
      deviceId: 'dev-1',
      location: makeLocation(),
    },
    verificationData: {
      publicKey: 'pk',
      signature: 'sig',
      timestamp: Date.now(),
    },
    createdAt: Date.now(),
  };
}

// ---------------------------------------------------------------------------
// generateProofBundleId
// ---------------------------------------------------------------------------

describe('generateProofBundleId', () => {
  it('returns a string starting with "proof_"', () => {
    const id = generateProofBundleId();
    expect(id).toMatch(/^proof_/);
  });

  it('returns unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateProofBundleId()));
    expect(ids.size).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// createLocationProof
// ---------------------------------------------------------------------------

describe('createLocationProof', () => {
  it('creates a valid location proof reference', () => {
    const coords = makeLocation();
    const proof = createLocationProof({
      coordinates: coords,
      signature: 'test_sig',
      publicKey: 'test_pk',
    });

    expect(proof.id).toMatch(/^loc_/);
    expect(proof.coordinates).toEqual(coords);
    expect(proof.hash).toBeTruthy();
    expect(typeof proof.hash).toBe('string');
  });

  it('produces deterministic hash for same coordinates', () => {
    const coords = makeLocation({ timestamp: 1000 });
    const proof1 = createLocationProof({
      coordinates: coords,
      signature: 'sig',
      publicKey: 'pk',
    });
    const proof2 = createLocationProof({
      coordinates: coords,
      signature: 'sig',
      publicKey: 'pk',
    });
    expect(proof1.hash).toBe(proof2.hash);
  });
});

// ---------------------------------------------------------------------------
// createPhotoProof
// ---------------------------------------------------------------------------

describe('createPhotoProof', () => {
  it('creates a valid photo proof reference', () => {
    const ts = Date.now();
    const proof = createPhotoProof({
      uri: 'file:///photo.jpg',
      fileHash: 'filehash_abc',
      timestamp: ts,
    });

    expect(proof.id).toMatch(/^photo_/);
    expect(proof.uri).toBe('file:///photo.jpg');
    expect(proof.hash).toBe('filehash_abc');
    expect(proof.timestamp).toBe(ts);
  });
});

// ---------------------------------------------------------------------------
// createCryptographicProofRef
// ---------------------------------------------------------------------------

describe('createCryptographicProofRef', () => {
  it('creates a valid cryptographic proof reference with defaults', () => {
    const proof = createCryptographicProofRef('hash1', 'sig1', 'pk1');
    expect(proof.algorithm).toBe('Ed25519-SHA256');
    expect(proof.dataHash).toBe('hash1');
    expect(proof.signature).toBe('sig1');
    expect(proof.publicKey).toBe('pk1');
  });

  it('allows custom algorithm', () => {
    const proof = createCryptographicProofRef('h', 's', 'p', 'DILITHIUM-3');
    expect(proof.algorithm).toBe('DILITHIUM-3');
  });
});

// ---------------------------------------------------------------------------
// createProofBundle
// ---------------------------------------------------------------------------

describe('createProofBundle', () => {
  it('creates a valid bundle with minimal input', () => {
    const bundle = createProofBundle({
      type: 'workflow',
      cryptographicProof: makeCryptoProof(),
    });

    expect(bundle.id).toMatch(/^proof_/);
    expect(bundle.type).toBe('workflow');
    expect(bundle.timestamp).toBeGreaterThan(0);
    expect(bundle.proofs.cryptographicProof).toEqual(makeCryptoProof());
    expect(bundle.proofs.locationProof).toBeUndefined();
    expect(bundle.proofs.photoProofs).toBeUndefined();
  });

  it('includes optional location proof', () => {
    const locProof = makeLocationProof();
    const bundle = createProofBundle({
      type: 'location',
      cryptographicProof: makeCryptoProof(),
      locationProof: locProof,
    });
    expect(bundle.proofs.locationProof).toEqual(locProof);
  });

  it('includes optional photo proofs', () => {
    const photoProof = makePhotoProof();
    const bundle = createProofBundle({
      type: 'photo',
      cryptographicProof: makeCryptoProof(),
      photoProofs: [photoProof],
    });
    expect(bundle.proofs.photoProofs).toHaveLength(1);
    expect(bundle.proofs.photoProofs![0]).toEqual(photoProof);
  });

  it('includes optional certificate', () => {
    const cert = makeMinimalCertificate();
    const bundle = createProofBundle({
      type: 'certificate',
      cryptographicProof: makeCryptoProof(),
      certificate: cert,
    });
    expect(bundle.certificate).toEqual(cert);
  });
});

// ---------------------------------------------------------------------------
// verifyProofBundleStructure
// ---------------------------------------------------------------------------

describe('verifyProofBundleStructure', () => {
  it('accepts a valid workflow bundle', () => {
    const bundle = makeValidBundle();
    const result = verifyProofBundleStructure(bundle);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects bundle missing id', () => {
    const result = verifyProofBundleStructure(makeValidBundle({ id: '' }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing bundle ID');
  });

  it('rejects bundle missing type', () => {
    const result = verifyProofBundleStructure(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      makeValidBundle({ type: '' as any })
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing bundle type');
  });

  it('rejects bundle missing timestamp', () => {
    const result = verifyProofBundleStructure(makeValidBundle({ timestamp: 0 }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing timestamp');
  });

  it('rejects bundle missing cryptographic proof', () => {
    const result = verifyProofBundleStructure(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      makeValidBundle({ proofs: { cryptographicProof: undefined as any } })
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing cryptographic proof');
  });

  it('rejects cryptographic proof with missing fields', () => {
    const result = verifyProofBundleStructure(
      makeValidBundle({
        proofs: {
          cryptographicProof: {
            algorithm: '',
            dataHash: '',
            signature: '',
            publicKey: '',
          },
        },
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing algorithm in cryptographic proof');
    expect(result.errors).toContain('Missing dataHash in cryptographic proof');
    expect(result.errors).toContain('Missing signature in cryptographic proof');
    expect(result.errors).toContain('Missing publicKey in cryptographic proof');
  });

  it('rejects location bundle without locationProof', () => {
    const result = verifyProofBundleStructure(makeValidBundle({ type: 'location' }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Location bundle requires locationProof');
  });

  it('accepts location bundle with locationProof', () => {
    const result = verifyProofBundleStructure(
      makeValidBundle({
        type: 'location',
        proofs: {
          cryptographicProof: makeCryptoProof(),
          locationProof: makeLocationProof(),
        },
      })
    );
    expect(result.valid).toBe(true);
  });

  it('rejects photo bundle without photoProofs', () => {
    const result = verifyProofBundleStructure(makeValidBundle({ type: 'photo' }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Photo bundle requires at least one photoProof');
  });

  it('rejects photo bundle with empty photoProofs array', () => {
    const result = verifyProofBundleStructure(
      makeValidBundle({
        type: 'photo',
        proofs: {
          cryptographicProof: makeCryptoProof(),
          photoProofs: [],
        },
      })
    );
    expect(result.valid).toBe(false);
  });

  it('rejects certificate bundle without certificate', () => {
    const result = verifyProofBundleStructure(makeValidBundle({ type: 'certificate' }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Certificate bundle requires certificate');
  });

  it('accepts certificate bundle with certificate', () => {
    const result = verifyProofBundleStructure(
      makeValidBundle({
        type: 'certificate',
        certificate: makeMinimalCertificate(),
      })
    );
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// serializeProofBundle / parseProofBundle
// ---------------------------------------------------------------------------

describe('serializeProofBundle / parseProofBundle round-trip', () => {
  it('successfully round-trips a valid bundle', () => {
    const original = makeValidBundle();
    const serialized = serializeProofBundle(original);
    const parsed = parseProofBundle(serialized);

    expect(parsed).toEqual(original);
  });

  it('serializes with pretty printing (2 space indent)', () => {
    const serialized = serializeProofBundle(makeValidBundle());
    // Pretty-printed JSON contains newlines
    expect(serialized).toContain('\n');
  });

  it('parseProofBundle returns null for invalid JSON', () => {
    expect(parseProofBundle('not valid json')).toBeNull();
  });

  it('parseProofBundle returns null for empty string', () => {
    expect(parseProofBundle('')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// hashProofBundle
// ---------------------------------------------------------------------------

describe('hashProofBundle', () => {
  it('returns a deterministic hex hash', () => {
    const bundle = makeValidBundle({ timestamp: 1000 });
    const hash1 = hashProofBundle(bundle);
    const hash2 = hashProofBundle(bundle);
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]+$/);
  });

  it('returns different hashes for different bundles', () => {
    const bundle1 = makeValidBundle({ id: 'a', timestamp: 1000 });
    const bundle2 = makeValidBundle({ id: 'b', timestamp: 1000 });
    expect(hashProofBundle(bundle1)).not.toBe(hashProofBundle(bundle2));
  });
});

// ---------------------------------------------------------------------------
// extractProofHashes
// ---------------------------------------------------------------------------

describe('extractProofHashes', () => {
  it('returns the cryptographic proof dataHash', () => {
    const bundle = makeValidBundle();
    const hashes = extractProofHashes(bundle);
    expect(hashes).toContain('abc123datahash');
  });

  it('includes location proof hash when present', () => {
    const locProof = makeLocationProof();
    const bundle = makeValidBundle({
      proofs: {
        cryptographicProof: makeCryptoProof(),
        locationProof: locProof,
      },
    });
    const hashes = extractProofHashes(bundle);
    expect(hashes).toContain(locProof.hash);
    expect(hashes.length).toBe(2);
  });

  it('includes all photo proof hashes', () => {
    const photo1 = makePhotoProof();
    const photo2 = createPhotoProof({
      uri: 'file:///photo2.jpg',
      fileHash: 'photohash_second',
      timestamp: Date.now(),
    });
    const bundle = makeValidBundle({
      proofs: {
        cryptographicProof: makeCryptoProof(),
        photoProofs: [photo1, photo2],
      },
    });
    const hashes = extractProofHashes(bundle);
    expect(hashes).toContain(photo1.hash);
    expect(hashes).toContain(photo2.hash);
    expect(hashes.length).toBe(3); // crypto + 2 photos
  });

  it('returns only crypto hash when no other proofs are present', () => {
    const bundle = makeValidBundle();
    const hashes = extractProofHashes(bundle);
    expect(hashes).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// getProofBundleSummary
// ---------------------------------------------------------------------------

describe('getProofBundleSummary', () => {
  it('returns correct summary for minimal bundle', () => {
    const bundle = makeValidBundle();
    const summary = getProofBundleSummary(bundle);

    expect(summary.id).toBe(bundle.id);
    expect(summary.type).toBe('workflow');
    expect(summary.timestamp).toBeTruthy();
    // ISO string check
    expect(summary.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(summary.hasLocation).toBe(false);
    expect(summary.photoCount).toBe(0);
    expect(summary.hasCertificate).toBe(false);
    expect(summary.hasQRCode).toBe(false);
  });

  it('reflects location, photos, certificate, and QR code presence', () => {
    const bundle = makeValidBundle({
      proofs: {
        cryptographicProof: makeCryptoProof(),
        locationProof: makeLocationProof(),
        photoProofs: [makePhotoProof(), makePhotoProof()],
      },
      certificate: makeMinimalCertificate(),
      qrCode: {
        id: 'qr_1',
        data: {
          certificateId: 'CERT_1',
          verifyUrl: 'https://verify.gtcx.io/verify/CERT_1',
          hash: 'h',
          timestamp: Date.now(),
          type: 'certificate',
        },
        qrCodeUri: 'data:image/png;base64,...',
        dataString: '{}',
        size: 256,
        timestamp: Date.now(),
      },
    });

    const summary = getProofBundleSummary(bundle);
    expect(summary.hasLocation).toBe(true);
    expect(summary.photoCount).toBe(2);
    expect(summary.hasCertificate).toBe(true);
    expect(summary.hasQRCode).toBe(true);
  });
});
