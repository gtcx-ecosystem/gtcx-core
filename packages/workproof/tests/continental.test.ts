import { describe, expect, it } from 'vitest';

import { WorkProofEvidenceItemSchema } from '../src/evidence/schemas';
import { WORKPROOF_PREDICATES, WORKPROOF_PREDICATE_URIS } from '../src/predicates/registry';
import { PREDICATE_CATEGORIES } from '../src/predicates/types';
import type { ContinentalPredicateType } from '../src/predicates/types';

const CONTINENTAL_TYPES: ContinentalPredicateType[] = [
  'MiningLicenseValid',
  'GoldBuyingLicenseValid',
  'CooperativeRegistered',
  'Traceability3tTagged',
  'RegionalCertificationIcglrRcm',
  'RegionalProtocolSignatory',
  'PricePreciousMetalFix',
  'ConflictZoneCleared',
  'OriginSatelliteVerified',
  'PhysicalSealAttested',
];

const EVIDENCE_MAP: Record<ContinentalPredicateType, string[]> = {
  MiningLicenseValid: ['sovereign_registry_record'],
  GoldBuyingLicenseValid: ['sovereign_registry_record'],
  CooperativeRegistered: ['cooperative_registry_record'],
  Traceability3tTagged: ['traceability_record'],
  RegionalCertificationIcglrRcm: ['regional_certification_record'],
  RegionalProtocolSignatory: ['protocol_signatory_record'],
  PricePreciousMetalFix: ['price_feed_record'],
  ConflictZoneCleared: ['conflict_screening_record'],
  OriginSatelliteVerified: ['satellite_imagery_record'],
  PhysicalSealAttested: ['hardware_seal_record'],
};

describe('Continental predicates — registration', () => {
  it('registers all 10 continental predicates in WORKPROOF_PREDICATES', () => {
    for (const type of CONTINENTAL_TYPES) {
      expect(WORKPROOF_PREDICATES[type]).toBeDefined();
    }
  });

  it('assigns all continental predicates to the Continental category', () => {
    for (const type of CONTINENTAL_TYPES) {
      expect(PREDICATE_CATEGORIES[type]).toBe('Continental');
    }
  });

  it('has matching URIs in WORKPROOF_PREDICATE_URIS', () => {
    for (const type of CONTINENTAL_TYPES) {
      expect(WORKPROOF_PREDICATE_URIS[type]).toBeDefined();
      expect(WORKPROOF_PREDICATES[type].uri).toBe(WORKPROOF_PREDICATE_URIS[type]);
    }
  });

  it('expands the registry to 57 predicates total', () => {
    expect(Object.keys(WORKPROOF_PREDICATES).length).toBe(57);
  });
});

describe('Continental predicates — schema and evidence', () => {
  it('all continental predicates have version 1.0.0', () => {
    for (const type of CONTINENTAL_TYPES) {
      expect(WORKPROOF_PREDICATES[type].version).toBe('1.0.0');
    }
  });

  it('all continental predicates use text-embedding-3-large', () => {
    for (const type of CONTINENTAL_TYPES) {
      expect(WORKPROOF_PREDICATES[type].ai.embeddingModel).toBe('text-embedding-3-large');
    }
  });

  it('MiningLicenseValid requires sovereign_registry_record', () => {
    expect(WORKPROOF_PREDICATES.MiningLicenseValid.evidence.required).toContain(
      'sovereign_registry_record'
    );
  });

  it('GoldBuyingLicenseValid requires sovereign_registry_record', () => {
    expect(WORKPROOF_PREDICATES.GoldBuyingLicenseValid.evidence.required).toContain(
      'sovereign_registry_record'
    );
  });

  it('CooperativeRegistered requires cooperative_registry_record', () => {
    expect(WORKPROOF_PREDICATES.CooperativeRegistered.evidence.required).toContain(
      'cooperative_registry_record'
    );
  });

  it('Traceability3tTagged requires traceability_record', () => {
    expect(WORKPROOF_PREDICATES.Traceability3tTagged.evidence.required).toContain(
      'traceability_record'
    );
  });

  it('RegionalCertificationIcglrRcm requires regional_certification_record', () => {
    expect(WORKPROOF_PREDICATES.RegionalCertificationIcglrRcm.evidence.required).toContain(
      'regional_certification_record'
    );
  });

  it('RegionalProtocolSignatory requires protocol_signatory_record', () => {
    expect(WORKPROOF_PREDICATES.RegionalProtocolSignatory.evidence.required).toContain(
      'protocol_signatory_record'
    );
  });

  it('PricePreciousMetalFix requires price_feed_record', () => {
    expect(WORKPROOF_PREDICATES.PricePreciousMetalFix.evidence.required).toContain(
      'price_feed_record'
    );
  });

  it('ConflictZoneCleared requires conflict_screening_record', () => {
    expect(WORKPROOF_PREDICATES.ConflictZoneCleared.evidence.required).toContain(
      'conflict_screening_record'
    );
  });

  it('OriginSatelliteVerified requires satellite_imagery_record', () => {
    expect(WORKPROOF_PREDICATES.OriginSatelliteVerified.evidence.required).toContain(
      'satellite_imagery_record'
    );
  });

  it('PhysicalSealAttested requires hardware_seal_record', () => {
    expect(WORKPROOF_PREDICATES.PhysicalSealAttested.evidence.required).toContain(
      'hardware_seal_record'
    );
  });
});

describe('Continental predicates — sample evidence validation', () => {
  it.each(CONTINENTAL_TYPES)('validates sample evidence for %s', (type) => {
    const requiredTypes = EVIDENCE_MAP[type];
    const items = requiredTypes.map((t) => ({
      type: t,
      hash: 'sha256:abc123def456',
      timestamp: 1704067200000,
    }));
    for (const item of items) {
      const result = WorkProofEvidenceItemSchema.safeParse(item);
      expect(result.success).toBe(true);
    }
  });
});

describe('Continental predicates — jurisdiction-specific fixtures', () => {
  const jurisdictions = [
    { country: 'Zimbabwe', code: 'ZW', authority: 'Zim Mines' },
    { country: 'Democratic Republic of Congo', code: 'CD', authority: 'SAESSCAM' },
    { country: 'Ghana', code: 'GH', authority: 'MinCom' },
  ];

  it.each(CONTINENTAL_TYPES)('accepts evidence with jurisdiction metadata for %s', (type) => {
    const requiredTypes = EVIDENCE_MAP[type];
    for (const jurisdiction of jurisdictions) {
      const items = requiredTypes.map((t) => ({
        type: t,
        hash: `sha256:${jurisdiction.code.toLowerCase()}123def456`,
        timestamp: 1704067200000,
        metadata: {
          jurisdiction: jurisdiction.country,
          jurisdictionCode: jurisdiction.code,
          issuingAuthority: jurisdiction.authority,
          registryUrl: `https://registry.${jurisdiction.country.toLowerCase().replace(/ /g, '-')}.gov`,
          verifiedAt: '2026-01-15T00:00:00Z',
        },
      }));
      for (const item of items) {
        const result = WorkProofEvidenceItemSchema.safeParse(item);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.metadata?.jurisdiction).toBe(jurisdiction.country);
          expect(result.data.metadata?.jurisdictionCode).toBe(jurisdiction.code);
        }
      }
    }
  });

  it('MiningLicenseValid validates with Zimbabwe mining license metadata', () => {
    const item = {
      type: 'sovereign_registry_record',
      hash: 'sha256:zw-mining-001',
      timestamp: 1704067200000,
      metadata: {
        jurisdiction: 'Zimbabwe',
        jurisdictionCode: 'ZW',
        licenseNumber: 'ML-2024-0042',
        licenseType: 'gold',
        issuedBy: 'Ministry of Mines and Mining Development',
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        mineLocation: 'Mazowe District',
      },
    };
    const result = WorkProofEvidenceItemSchema.safeParse(item);
    expect(result.success).toBe(true);
  });

  it('Traceability3tTagged validates with DRC iTSCi metadata', () => {
    const item = {
      type: 'traceability_record',
      hash: 'sha256:cd-itsci-789',
      timestamp: 1704067200000,
      metadata: {
        jurisdiction: 'Democratic Republic of Congo',
        jurisdictionCode: 'CD',
        traceabilitySystem: 'iTSCi',
        mineral: 'cassiterite',
        tagNumber: 'CD-TAG-2024-1123',
        mineOfOrigin: 'Bisie',
        exporter: 'Societe Miniere de Bisunzu',
        shipmentDate: '2024-03-15',
      },
    };
    const result = WorkProofEvidenceItemSchema.safeParse(item);
    expect(result.success).toBe(true);
  });

  it('CooperativeRegistered validates with Ghana cooperative metadata', () => {
    const item = {
      type: 'cooperative_registry_record',
      hash: 'sha256:gh-cooperative-456',
      timestamp: 1704067200000,
      metadata: {
        jurisdiction: 'Ghana',
        jurisdictionCode: 'GH',
        cooperativeName: 'Obuasi Small-Scale Miners Association',
        registrationNumber: 'GHA-COOP-2019-0047',
        registeredWith: 'Minerals Commission of Ghana',
        district: 'Obuasi Municipal',
        region: 'Ashanti',
        memberCount: 124,
      },
    };
    const result = WorkProofEvidenceItemSchema.safeParse(item);
    expect(result.success).toBe(true);
  });
});
