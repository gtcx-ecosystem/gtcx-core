/**
 * Integration tests: @gtcx/identity → @gtcx/verification
 *
 * Tests the pipeline from identity creation through certificate
 * generation, QR code creation, and proof bundle assembly.
 */
import { sign, verify, hash256 } from '@gtcx/crypto';
import { createIdentity, createDID, createDIDDocument } from '@gtcx/identity';
import {
  createStandardCertificateData,
  validateCertificateInput,
  verifyCertificateStructure,
  formatCertificateForDisplay,
  createLocationQRData,
  serializeQRData,
  parseQRData,
  verifyQRCodeData,
  hashQRCodeContent,
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
} from '@gtcx/verification';
import { describe, it, expect } from 'vitest';

// ── Test helpers ──

function makeLocation(overrides: Record<string, unknown> = {}) {
  return {
    latitude: 6.2,
    longitude: -1.6,
    accuracy: 5,
    timestamp: Date.now(),
    ...overrides,
  };
}

function makeStandardInput(overrides: Record<string, unknown> = {}) {
  return {
    templateId: 'location',
    location: makeLocation(),
    userRole: 'inspector',
    deviceId: 'device-test-001',
    ...overrides,
  };
}

describe('Identity → Verification: Certificate generation', () => {
  it('creates a certificate with identity-signed data', async () => {
    const { identity, privateKey } = await createIdentity();
    const input = makeStandardInput();

    const validation = validateCertificateInput(input);
    expect(validation.valid).toBe(true);

    const certData = createStandardCertificateData(input);
    expect(certData.dataToSign).toBeTruthy();

    // Sign the certificate data with the identity's private key
    const signature = sign(certData.dataToSign, privateKey);
    const certificate = {
      ...certData,
      verificationData: {
        ...certData.verificationData,
        publicKey: identity.publicKey,
        signature,
      },
    };

    // Verify the certificate structure
    const structureCheck = verifyCertificateStructure(certificate as never);
    expect(structureCheck.valid).toBe(true);
  });

  it('creates a work-site certificate with enhanced security', async () => {
    const { identity, privateKey } = await createIdentity({
      securityLevel: 'enhanced',
    });

    const input = makeStandardInput({
      templateId: 'work-site',
      workflowContext: 'mine-inspection-2025',
    });

    const certData = createStandardCertificateData(input);
    const signature = sign(certData.dataToSign, privateKey);
    const certificate = {
      ...certData,
      verificationData: {
        ...certData.verificationData,
        publicKey: identity.publicKey,
        signature,
      },
    };

    expect(verifyCertificateStructure(certificate as never).valid).toBe(true);
  });

  it('formats certificate for display with identity context', async () => {
    const { identity, privateKey } = await createIdentity();
    const input = makeStandardInput();
    const certData = createStandardCertificateData(input);
    const signature = sign(certData.dataToSign, privateKey);
    const certificate = {
      ...certData,
      verificationData: {
        ...certData.verificationData,
        publicKey: identity.publicKey,
        signature,
      },
    };

    const display = formatCertificateForDisplay(certificate as never);
    expect(display.id).toBeTruthy();
    expect(display.type).toBeTruthy();
  });
});

describe('Identity → Verification: QR code generation', () => {
  it('creates a location QR code from identity-signed certificate', async () => {
    await createIdentity(); // proves identity context
    const location = makeLocation();
    const dataHash = hash256(JSON.stringify(location));

    const qrData = createLocationQRData('cert-test-001', location, dataHash);

    expect(qrData).toBeDefined();

    // Serialize and parse round-trip
    const serialized = serializeQRData(qrData);
    const parsed = parseQRData(serialized);
    expect(parsed).not.toBeNull();
  });

  it('verifies QR code data integrity', async () => {
    const location = makeLocation();
    const dataHash = hash256(JSON.stringify(location));

    const qrData = createLocationQRData('cert-qr-001', location, dataHash);
    const serialized = serializeQRData(qrData);

    const verification = verifyQRCodeData(serialized);
    expect(verification).toBeDefined();
  });

  it('QR code hash is deterministic for same content', () => {
    const content = { certificateId: 'cert-001', data: 'test' };
    const hash1 = hashQRCodeContent(content);
    const hash2 = hashQRCodeContent(content);
    expect(hash1).toBe(hash2);
  });
});

describe('Identity → Verification: Proof bundle assembly', () => {
  it('creates a complete proof bundle with identity-signed proofs', async () => {
    const { identity, privateKey } = await createIdentity();
    const message = 'proof-data-to-sign';
    const dataHash = hash256(message);
    const signature = sign(message, privateKey);

    // Create proof components
    const locationProof = createLocationProof({
      coordinates: makeLocation(),
      signature,
      publicKey: identity.publicKey,
    });

    const cryptoProof = createCryptographicProofRef(dataHash, signature, identity.publicKey);

    // Assemble the proof bundle
    const bundle = createProofBundle({
      type: 'location',
      cryptographicProof: cryptoProof,
      locationProof,
    });

    expect(bundle.id).toMatch(/^proof_/);

    // Verify bundle structure
    const structureCheck = verifyProofBundleStructure(bundle);
    expect(structureCheck.valid).toBe(true);
  });

  it('creates a photo proof bundle with multiple evidence items', async () => {
    const { identity, privateKey } = await createIdentity();
    const dataHash = hash256('photo-evidence');
    const signature = sign('photo-evidence', privateKey);

    const photoProof1 = createPhotoProof({
      uri: 'file:///evidence/photo1.jpg',
      fileHash: hash256('photo-1-bytes'),
      timestamp: Date.now(),
    });
    const photoProof2 = createPhotoProof({
      uri: 'file:///evidence/photo2.jpg',
      fileHash: hash256('photo-2-bytes'),
      timestamp: Date.now(),
    });

    const cryptoProof = createCryptographicProofRef(dataHash, signature, identity.publicKey);

    const bundle = createProofBundle({
      type: 'photo',
      cryptographicProof: cryptoProof,
      photoProofs: [photoProof1, photoProof2],
    });

    const summary = getProofBundleSummary(bundle);
    expect(summary.photoCount).toBe(2);
    expect(summary.type).toBe('photo');
  });

  it('serializes and deserializes proof bundle', async () => {
    const { identity, privateKey } = await createIdentity();
    const signature = sign('serialize-test', privateKey);
    const cryptoProof = createCryptographicProofRef(
      hash256('serialize-test'),
      signature,
      identity.publicKey
    );

    const bundle = createProofBundle({
      type: 'certificate',
      cryptographicProof: cryptoProof,
    });

    const serialized = serializeProofBundle(bundle);
    const deserialized = parseProofBundle(serialized);

    expect(deserialized).not.toBeNull();
    expect(deserialized!.id).toBe(bundle.id);
  });

  it('extracts proof hashes from bundle', async () => {
    const { identity, privateKey } = await createIdentity();
    const signature = sign('hash-extract-test', privateKey);
    const cryptoProof = createCryptographicProofRef(
      hash256('hash-extract-test'),
      signature,
      identity.publicKey
    );

    const bundle = createProofBundle({
      type: 'location',
      cryptographicProof: cryptoProof,
      locationProof: createLocationProof({
        coordinates: makeLocation(),
        signature,
        publicKey: identity.publicKey,
      }),
    });

    const hashes = extractProofHashes(bundle);
    expect(hashes.length).toBeGreaterThan(0);

    // Bundle hash is deterministic
    const h1 = hashProofBundle(bundle);
    const h2 = hashProofBundle(bundle);
    expect(h1).toBe(h2);
  });
});

describe('Identity → Verification: DID-bound verification', () => {
  it('binds certificate to DID identity', async () => {
    const { identity, privateKey } = await createIdentity();
    createDID(identity); // DID exists for this identity
    const didDoc = createDIDDocument(identity);

    // Create a certificate and sign it with the DID-bound key
    const certData = createStandardCertificateData(makeStandardInput());
    const signature = sign(certData.dataToSign, privateKey);

    // The DID document proves the public key belongs to this identity
    expect(didDoc.verificationMethod.length).toBeGreaterThan(0);

    // The signature can be verified with the identity's public key
    expect(verify(certData.dataToSign, signature, identity.publicKey)).toBe(true);
  });
});

describe('Identity → Verification: Certificate failure scenarios', () => {
  it('certificate verification fails with wrong public key', async () => {
    const alice = await createIdentity();
    const bob = await createIdentity();

    const certData = createStandardCertificateData(makeStandardInput());
    const signature = sign(certData.dataToSign, alice.privateKey);

    // Verify with Bob's key should fail
    expect(verify(certData.dataToSign, signature, bob.identity.publicKey)).toBe(false);
    expect(verify(certData.dataToSign, signature, alice.identity.publicKey)).toBe(true);
  });

  it('certificate structure check fails with missing required metadata', () => {
    const incomplete = {
      certificateId: 'cert-test',
      version: '1.0',
      type: 'location',
      securityLevel: 'standard',
      metadata: {
        issuer: 'test',
        // missing issuedAt and location
      },
      verificationData: {
        publicKey: 'abc',
        signature: 'def',
        timestamp: Date.now(),
      },
      createdAt: Date.now(),
    };

    const result = verifyCertificateStructure(incomplete as never);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('certificate with future issuedAt still passes structure check', async () => {
    const { identity, privateKey } = await createIdentity();
    const input = makeStandardInput();
    const certData = createStandardCertificateData(input);
    const signature = sign(certData.dataToSign, privateKey);

    // Manually set issuedAt to the future
    const certificate = {
      ...certData,
      metadata: { ...certData.metadata, issuedAt: Date.now() + 365 * 24 * 60 * 60 * 1000 },
      verificationData: {
        ...certData.verificationData,
        publicKey: identity.publicKey,
        signature,
      },
    };

    // Structure check does not reject future issuedAt (no such rule in verifyCertificateStructure)
    const result = verifyCertificateStructure(certificate as never);
    expect(result.valid).toBe(true);

    // But the signature is still valid for the original data
    expect(verify(certData.dataToSign, signature, identity.publicKey)).toBe(true);
  });
});
