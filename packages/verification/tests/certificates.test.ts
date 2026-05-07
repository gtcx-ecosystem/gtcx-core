import { describe, it, expect } from 'vitest';

import {
  generateCertificateId,
  validateCertificateInput,
  createCertificateMetadata,
  createDefaultEnvironmentalFactors,
  createDefaultValidationMetrics,
  createStandardCertificateData,
  createMilitaryGradeCertificateData,
  verifyCertificateStructure,
  isCertificateExpired,
  getCertificateAge,
  getCertificateCommodityType,
  formatCertificateForDisplay,
  VerificationError,
  type CreateCertificateInput,
} from '../src/certificates/generator';
import type {
  Certificate,
  CertificateLocation,
  MilitaryGradeCertificate,
  CustodyEntry,
  SettlementRecord,
} from '../src/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeLocation(overrides: Partial<CertificateLocation> = {}): CertificateLocation {
  return {
    latitude: 6.2,
    longitude: -1.6,
    accuracy: 5,
    timestamp: Date.now(),
    ...overrides,
  };
}

function makeValidInput(overrides: Partial<CreateCertificateInput> = {}): CreateCertificateInput {
  return {
    templateId: 'location',
    location: makeLocation(),
    userRole: 'producer',
    deviceId: 'device-001',
    ...overrides,
  };
}

function makeValidCertificate(overrides: Partial<Certificate> = {}): Certificate {
  return {
    certificateId: 'CERT_TEST_001',
    version: '1.0',
    type: 'location',
    securityLevel: 'standard',
    metadata: {
      issuer: 'GTCX Test',
      issuedAt: Date.now(),
      userRole: 'producer',
      deviceId: 'dev-1',
      location: makeLocation(),
    },
    verificationData: {
      publicKey: 'pk_test_123',
      signature: 'sig_test_456',
      timestamp: Date.now(),
    },
    createdAt: Date.now(),
    ...overrides,
  };
}

function makeCustodyData(): CustodyEntry {
  return {
    id: 'custody-001',
    chainId: 'chain-001',
    fromHolder: 'holder-a',
    toHolder: 'holder-b',
    timestamp: Date.now(),
    location: {
      facilityId: 'vault-001',
      facilityName: 'Central Vault',
      facilityType: 'vault',
      coordinates: { latitude: 6.2, longitude: -1.6 },
    },
    action: 'transfer',
    evidence: {
      photos: ['photo-1'],
      documents: ['doc-1'],
      notes: 'handoff verified',
    },
    verification: {
      verifierId: 'verifier-001',
      verifiedAt: Date.now(),
      method: 'documentation',
      result: 'verified',
      signature: 'sig-001',
    },
  };
}

function makeSettlementData(): SettlementRecord {
  return {
    id: 'settlement-001',
    tradeMatchId: 'match-001',
    status: 'completed',
    paymentLeg: {
      from: 'buyer-001',
      to: 'seller-001',
      amount: 1000,
      currency: 'USD',
      method: 'bank_transfer',
      confirmedAt: Date.now(),
      proof: 'payment-proof-001',
    },
    assetLeg: {
      from: 'seller-001',
      to: 'buyer-001',
      lotId: 'lot-001',
      custodyTransferId: 'custody-001',
      deliveryMethod: 'vault_transfer',
      confirmedAt: Date.now(),
      proof: 'asset-proof-001',
    },
    timeline: {
      initiatedAt: Date.now() - 1_000,
      paymentDeadline: Date.now() + 3_600_000,
      assetDeadline: Date.now() + 7_200_000,
      completedAt: Date.now(),
    },
    verification: {
      paymentVerified: true,
      paymentVerifiedBy: 'ops-001',
      paymentVerifiedAt: Date.now(),
      assetVerified: true,
      assetVerifiedBy: 'ops-002',
      assetVerifiedAt: Date.now(),
      finalSignoff: 'signoff-001',
    },
  };
}

// ---------------------------------------------------------------------------
// generateCertificateId
// ---------------------------------------------------------------------------

describe('generateCertificateId', () => {
  it('returns a unique ID containing the type prefix', () => {
    const id = generateCertificateId('asset-origin');
    expect(id).toMatch(/^ASSET_ORIGIN_/);
  });

  it('uses custom prefix when provided', () => {
    const id = generateCertificateId('location', 'MIL');
    expect(id).toContain('MIL');
  });

  it('generates unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateCertificateId('location')));
    expect(ids.size).toBe(50);
  });

  it('converts hyphens to underscores in type code', () => {
    const id = generateCertificateId('chain-of-custody');
    expect(id).toMatch(/^CHAIN_OF_CUSTODY_/);
  });
});

// ---------------------------------------------------------------------------
// validateCertificateInput
// ---------------------------------------------------------------------------

describe('validateCertificateInput', () => {
  it('accepts valid input for "location" template', () => {
    const result = validateCertificateInput(makeValidInput());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('throws for input with unknown template', () => {
    // getEffectiveTemplate throws when template is not found
    expect(() =>
      validateCertificateInput(makeValidInput({ templateId: 'nonexistent-template' }))
    ).toThrow(/not found/);
  });

  it('rejects input missing required fields for work-site', () => {
    const result = validateCertificateInput(makeValidInput({ templateId: 'work-site' }));
    // work-site requires workflowContext
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('workflowContext'))).toBe(true);
  });

  it('reports validation rule violations', () => {
    const result = validateCertificateInput(
      makeValidInput({
        templateId: 'location',
        location: makeLocation({ accuracy: 50 }), // max is 20
      })
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('accuracy'))).toBe(true);
  });

  it('accepts valid input for "photo" template', () => {
    const result = validateCertificateInput(
      makeValidInput({
        templateId: 'photo',
        photoHash: 'feedfacedeadbeef1234567890abcdef',
      })
    );
    expect(result.valid).toBe(true);
  });

  it('accepts valid input for "custody-transfer" template', () => {
    const result = validateCertificateInput(
      makeValidInput({
        templateId: 'custody-transfer',
        location: makeLocation({ accuracy: 3 }),
        assetLotData: {
          commodityType: 'gold',
          estimatedWeight: 10,
          unit: 'kg',
        },
        custodyData: makeCustodyData(),
        validationMetrics: {
          isJammed: false,
          isSpoofed: false,
          confidenceLevel: 0.96,
          integrityCheck: true,
        },
      })
    );
    expect(result.valid).toBe(true);
  });

  it('accepts valid input for "settlement" template', () => {
    const result = validateCertificateInput(
      makeValidInput({
        templateId: 'settlement',
        location: makeLocation({ accuracy: 3 }),
        assetLotData: {
          commodityType: 'gold',
          estimatedWeight: 10,
          unit: 'kg',
        },
        settlementData: makeSettlementData(),
        validationMetrics: {
          isJammed: false,
          isSpoofed: false,
          confidenceLevel: 0.99,
          integrityCheck: true,
        },
      })
    );
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// createCertificateMetadata
// ---------------------------------------------------------------------------

describe('createCertificateMetadata', () => {
  it('creates metadata with correct fields', () => {
    const input = makeValidInput();
    const metadata = createCertificateMetadata(input);

    expect(metadata.issuer).toBe('GTCX Verification System');
    expect(metadata.issuedAt).toBeGreaterThan(0);
    expect(metadata.userRole).toBe('producer');
    expect(metadata.deviceId).toBe('device-001');
    expect(metadata.location).toEqual(input.location);
  });

  it('uses custom issuer when provided', () => {
    const metadata = createCertificateMetadata(makeValidInput(), 'Custom Issuer');
    expect(metadata.issuer).toBe('Custom Issuer');
  });

  it('includes default environmental factors when not provided', () => {
    const metadata = createCertificateMetadata(makeValidInput());
    expect(metadata.environmentalFactors).toBeDefined();
    expect(metadata.environmentalFactors?.satelliteCount).toBe(0);
  });

  it('includes default validation metrics when not provided', () => {
    const metadata = createCertificateMetadata(makeValidInput());
    expect(metadata.validationMetrics).toBeDefined();
    expect(metadata.validationMetrics?.confidenceLevel).toBe(0.5);
  });

  it('preserves expiresAt when provided', () => {
    const expiresAt = Date.now() + 86400000;
    const metadata = createCertificateMetadata(makeValidInput({ expiresAt }));
    expect(metadata.expiresAt).toBe(expiresAt);
  });
});

// ---------------------------------------------------------------------------
// createDefaultEnvironmentalFactors
// ---------------------------------------------------------------------------

describe('createDefaultEnvironmentalFactors', () => {
  it('returns valid defaults', () => {
    const factors = createDefaultEnvironmentalFactors();
    expect(factors.satelliteCount).toBe(0);
    expect(factors.signalStrength).toBe(0);
    expect(factors.atmosphericConditions).toBe('unknown');
    expect(factors.multipathIndicator).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// createDefaultValidationMetrics
// ---------------------------------------------------------------------------

describe('createDefaultValidationMetrics', () => {
  it('returns valid defaults', () => {
    const metrics = createDefaultValidationMetrics();
    expect(metrics.isJammed).toBe(false);
    expect(metrics.isSpoofed).toBe(false);
    expect(metrics.confidenceLevel).toBe(0.5);
    expect(metrics.integrityCheck).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// createStandardCertificateData
// ---------------------------------------------------------------------------

describe('createStandardCertificateData', () => {
  it('creates a valid standard certificate structure', () => {
    const cert = createStandardCertificateData(makeValidInput());

    expect(cert.certificateId).toMatch(/^LOCATION_/);
    expect(cert.version).toBe('1.0');
    expect(cert.type).toBe('location');
    expect(cert.securityLevel).toBe('standard');
    expect(cert.dataHash).toBeTruthy();
    expect(cert.dataToSign).toBeTruthy();
    expect(cert.metadata.issuer).toBeTruthy();
    expect(cert.createdAt).toBeGreaterThan(0);
  });

  it('throws for unknown template', () => {
    expect(() => createStandardCertificateData(makeValidInput({ templateId: 'nope' }))).toThrow(
      /not found/
    );
  });

  it('throws when validation fails', () => {
    expect(() =>
      createStandardCertificateData(
        makeValidInput({
          templateId: 'location',
          location: makeLocation({ accuracy: 100 }),
        })
      )
    ).toThrow(/Validation failed/);
  });

  it('supports the photo template when photoHash is provided', () => {
    const cert = createStandardCertificateData(
      makeValidInput({
        templateId: 'photo',
        photoHash: 'feedfacedeadbeef1234567890abcdef',
      })
    );

    expect(cert.type).toBe('photo');
    expect(cert.dataHash).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// createMilitaryGradeCertificateData
// ---------------------------------------------------------------------------

describe('createMilitaryGradeCertificateData', () => {
  const militaryInput: CreateCertificateInput = {
    templateId: 'asset-origin',
    location: makeLocation({ accuracy: 3 }),
    userRole: 'producer',
    deviceId: 'device-mil',
    assetLotData: {
      commodityType: 'gold',
      estimatedWeight: 10,
      unit: 'troy_oz',
    },
    validationMetrics: {
      isJammed: false,
      isSpoofed: false,
      confidenceLevel: 0.95,
      integrityCheck: true,
    },
  };

  it('creates a valid military-grade certificate structure', () => {
    const cert = createMilitaryGradeCertificateData(militaryInput);

    expect(cert.certificateId).toMatch(/^ASSET_ORIGIN_MIL_/);
    expect(cert.version).toBe('2.0');
    expect(cert.securityLevel).toBe('post-quantum');
    expect(cert.dataToSign).toBeTruthy();
    expect(cert.dataForPostQuantumHash).toBeTruthy();
    expect(cert.certificateData).toBeDefined();
    expect(cert.metadata.issuer).toContain('Military');
  });

  it('throws for non-military template', () => {
    expect(() =>
      createMilitaryGradeCertificateData(makeValidInput({ templateId: 'location' }))
    ).toThrow(/not military-grade/);
  });

  it('supports the custody-transfer template when custodyData is provided', () => {
    const cert = createMilitaryGradeCertificateData({
      templateId: 'custody-transfer',
      location: makeLocation({ accuracy: 3 }),
      userRole: 'custodian',
      deviceId: 'device-custody',
      assetLotData: {
        commodityType: 'gold',
        estimatedWeight: 10,
        unit: 'kg',
      },
      custodyData: makeCustodyData(),
      validationMetrics: {
        isJammed: false,
        isSpoofed: false,
        confidenceLevel: 0.96,
        integrityCheck: true,
      },
    });

    expect(cert.type).toBe('custody-transfer');
    expect(cert.certificateData.custodyData).toBeDefined();
  });

  it('supports the settlement template when settlementData is provided', () => {
    const cert = createMilitaryGradeCertificateData({
      templateId: 'settlement',
      location: makeLocation({ accuracy: 3 }),
      userRole: 'trader',
      deviceId: 'device-settlement',
      assetLotData: {
        commodityType: 'gold',
        estimatedWeight: 10,
        unit: 'kg',
      },
      settlementData: makeSettlementData(),
      validationMetrics: {
        isJammed: false,
        isSpoofed: false,
        confidenceLevel: 0.99,
        integrityCheck: true,
      },
    });

    expect(cert.type).toBe('settlement');
    expect(cert.certificateData.settlementData).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// verifyCertificateStructure
// ---------------------------------------------------------------------------

describe('verifyCertificateStructure', () => {
  it('accepts a valid certificate', () => {
    const result = verifyCertificateStructure(makeValidCertificate());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects certificate missing certificateId', () => {
    const result = verifyCertificateStructure(makeValidCertificate({ certificateId: '' }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing certificate ID');
  });

  it('rejects certificate missing version', () => {
    const result = verifyCertificateStructure(makeValidCertificate({ version: '' }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing version');
  });

  it('rejects certificate missing type', () => {
    const result = verifyCertificateStructure(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      makeValidCertificate({ type: '' as any })
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing type');
  });

  it('rejects certificate missing metadata', () => {
    const result = verifyCertificateStructure(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      makeValidCertificate({ metadata: undefined as any })
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing metadata');
  });

  it('rejects certificate with missing issuer inside metadata', () => {
    const cert = makeValidCertificate();
    cert.metadata.issuer = '';
    const result = verifyCertificateStructure(cert);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing issuer');
  });

  it('rejects certificate missing verificationData', () => {
    const result = verifyCertificateStructure(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      makeValidCertificate({ verificationData: undefined as any })
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing verification data');
  });

  it('rejects certificate with missing publicKey', () => {
    const cert = makeValidCertificate();
    cert.verificationData.publicKey = '';
    const result = verifyCertificateStructure(cert);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing public key');
  });

  it('rejects expired certificate', () => {
    const cert = makeValidCertificate();
    cert.metadata.expiresAt = Date.now() - 10000;
    const result = verifyCertificateStructure(cert);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Certificate has expired');
  });

  it('accepts certificate that has not expired yet', () => {
    const cert = makeValidCertificate();
    cert.metadata.expiresAt = Date.now() + 86400000;
    const result = verifyCertificateStructure(cert);
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isCertificateExpired
// ---------------------------------------------------------------------------

describe('isCertificateExpired', () => {
  it('returns false when no expiresAt is set', () => {
    const cert = makeValidCertificate();
    delete cert.metadata.expiresAt;
    expect(isCertificateExpired(cert)).toBe(false);
  });

  it('returns false when certificate is still valid', () => {
    const cert = makeValidCertificate();
    cert.metadata.expiresAt = Date.now() + 86400000;
    expect(isCertificateExpired(cert)).toBe(false);
  });

  it('returns true when certificate has expired', () => {
    const cert = makeValidCertificate();
    cert.metadata.expiresAt = Date.now() - 1000;
    expect(isCertificateExpired(cert)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// getCertificateAge
// ---------------------------------------------------------------------------

describe('getCertificateAge', () => {
  it('returns a positive number for a certificate created in the past', () => {
    const cert = makeValidCertificate({ createdAt: Date.now() - 5000 });
    const age = getCertificateAge(cert);
    expect(age).toBeGreaterThanOrEqual(5000);
  });

  it('returns approximately zero for a just-created certificate', () => {
    const cert = makeValidCertificate({ createdAt: Date.now() });
    const age = getCertificateAge(cert);
    expect(age).toBeGreaterThanOrEqual(0);
    expect(age).toBeLessThan(1000);
  });
});

// ---------------------------------------------------------------------------
// getCertificateCommodityType
// ---------------------------------------------------------------------------

describe('getCertificateCommodityType', () => {
  it('extracts commodity type from MilitaryGradeCertificate', () => {
    const milCert = {
      ...makeValidCertificate({ securityLevel: 'military' }),
      postQuantumHash: 'qr_hash',
      multiSignature: { ed25519: 'sig' },
      certificateData: {
        assetLotData: {
          commodityType: 'cobalt',
          estimatedWeight: 100,
          unit: 'kg',
        },
      },
    } as unknown as MilitaryGradeCertificate;
    expect(getCertificateCommodityType(milCert)).toBe('cobalt');
  });

  it('returns undefined for standard certificate without certificateData', () => {
    const cert = makeValidCertificate();
    expect(getCertificateCommodityType(cert)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// VerificationError
// ---------------------------------------------------------------------------

describe('VerificationError', () => {
  it('sets cause when provided in options', () => {
    const cause = new Error('underlying failure');
    const err = new VerificationError('verification failed', 'VERIFICATION_FAILED', {}, { cause });
    expect(err.cause).toBe(cause);
    expect(err.message).toBe('verification failed');
    expect(err.name).toBe('VerificationError');
  });

  it('does not set cause when options are omitted', () => {
    const err = new VerificationError('verification failed');
    expect(err.cause).toBeUndefined();
    expect(err.message).toBe('verification failed');
  });
});

// ---------------------------------------------------------------------------
// createStandardCertificateData — negative paths
// ---------------------------------------------------------------------------

describe('createStandardCertificateData', () => {
  it('throws when template is not found', () => {
    const input = makeValidInput({ templateId: 'nonexistent-template' as any });
    expect(() => createStandardCertificateData(input)).toThrow(VerificationError);
  });
});

// ---------------------------------------------------------------------------
// createMilitaryGradeCertificateData — negative paths
// ---------------------------------------------------------------------------

describe('createMilitaryGradeCertificateData', () => {
  it('throws when template is not found', () => {
    const input = makeValidInput({ templateId: 'nonexistent-template' as any });
    expect(() => createMilitaryGradeCertificateData(input)).toThrow(VerificationError);
  });
});

// ---------------------------------------------------------------------------
// formatCertificateForDisplay — military-grade path
// ---------------------------------------------------------------------------

describe('formatCertificateForDisplay', () => {
  it('extracts commodity type from military-grade certificate', () => {
    const milCert = {
      ...makeValidCertificate({ securityLevel: 'military' }),
      postQuantumHash: 'pqhash',
      multiSignature: { ed25519: 'sig' },
      certificateData: {
        assetLotData: {
          commodityType: 'lithium',
          estimatedWeight: 50,
          unit: 'kg',
        },
      },
    } as unknown as MilitaryGradeCertificate;

    const display = formatCertificateForDisplay(milCert);
    expect(display.commodityType).toBe('lithium');
  });
});
