import type { PredicateDefinition } from '@gtcx/verification';

import { WORKPROOF_PREDICATE_URIS } from '../uri';

export const MiningLicenseValid: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.MiningLicenseValid,
  name: 'Mining License Valid',
  description: 'Mining license is current and valid per sovereign registry',
  domain: 'compliance',
  version: '1.0.0',
  schema: { type: 'boolean' },
  evidence: { required: ['sovereign_registry_record'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.95,
    evidenceWeights: { sovereign_registry_record: 1.0 },
    minimumThreshold: 0.9,
  },
  temporal: {
    validDuration: 'P1Y',
    renewalRequired: true,
    monitoringType: 'event_triggered',
    triggers: ['permit.expired', 'permit.revoked'],
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['mining license', 'extractive permit', 'sovereign registry'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.LicenseValid,
      WORKPROOF_PREDICATE_URIS.InspectionPassed,
    ],
    contextTemplate: 'Mining license valid until {{expiresAt}}',
  },
};

export const GoldBuyingLicenseValid: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.GoldBuyingLicenseValid,
  name: 'Gold Buying License Valid',
  description: 'Gold buying license is current and valid per sovereign registry',
  domain: 'compliance',
  version: '1.0.0',
  schema: { type: 'boolean' },
  evidence: { required: ['sovereign_registry_record'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.95,
    evidenceWeights: { sovereign_registry_record: 1.0 },
    minimumThreshold: 0.9,
  },
  temporal: {
    validDuration: 'P1Y',
    renewalRequired: true,
    monitoringType: 'event_triggered',
    triggers: ['permit.expired', 'permit.revoked'],
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['gold buying license', 'precious metals dealer', 'sovereign registry'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.LicenseValid,
      WORKPROOF_PREDICATE_URIS.MiningLicenseValid,
    ],
    contextTemplate: 'Gold buying license valid until {{expiresAt}}',
  },
};

export const CooperativeRegistered: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.CooperativeRegistered,
  name: 'Cooperative Registered',
  description: 'Cooperative entity is registered with the cooperative registry',
  domain: 'entity',
  version: '1.0.0',
  schema: { type: 'boolean' },
  evidence: { required: ['cooperative_registry_record'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.9,
    evidenceWeights: { cooperative_registry_record: 1.0 },
    minimumThreshold: 0.75,
  },
  temporal: {
    validDuration: 'P1Y',
    renewalRequired: true,
    monitoringType: 'periodic',
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['cooperative registration', 'collective entity', 'registry record'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.EntityRegistered,
      WORKPROOF_PREDICATE_URIS.CommunityMembership,
    ],
    contextTemplate: 'Cooperative registered in {{jurisdiction}}',
  },
};

export const Traceability3tTagged: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.Traceability3tTagged,
  name: 'Traceability 3T Tagged',
  description: 'Mineral shipment is tagged under a 3T traceability system',
  domain: 'compliance',
  version: '1.0.0',
  schema: { type: 'boolean' },
  evidence: { required: ['traceability_record'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.9,
    evidenceWeights: { traceability_record: 1.0 },
    minimumThreshold: 0.8,
  },
  temporal: {
    validDuration: 'P1Y',
    renewalRequired: true,
    monitoringType: 'periodic',
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: [
      '3T minerals',
      'tin tungsten tantalum',
      'traceability tag',
      'supply chain tracking',
    ],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.OriginAuthenticated,
      WORKPROOF_PREDICATE_URIS.MethodCompliant,
    ],
    contextTemplate: 'Traceability tag verified for 3T shipment',
  },
};

export const RegionalCertificationIcglrRcm: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.RegionalCertificationIcglrRcm,
  name: 'Regional Certification ICGLR RCM',
  description:
    'Entity or shipment holds a valid ICGLR Regional Certification Mechanism certification',
  domain: 'compliance',
  version: '1.0.0',
  schema: { type: 'string' },
  evidence: { required: ['regional_certification_record'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'CertifierID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.95,
    evidenceWeights: { regional_certification_record: 1.0 },
    minimumThreshold: 0.85,
  },
  temporal: {
    validDuration: 'P1Y',
    renewalRequired: true,
    monitoringType: 'event_triggered',
    triggers: ['certification.revoked', 'certification.suspended'],
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['ICGLR', 'RCM', 'regional certification', 'conflict-free'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.StandardMet,
      WORKPROOF_PREDICATE_URIS.AccreditationHeld,
    ],
    contextTemplate: 'Regional certification {{value}} held',
  },
};

export const RegionalProtocolSignatory: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.RegionalProtocolSignatory,
  name: 'Regional Protocol Signatory',
  description: 'Entity is a signatory to a relevant regional protocol',
  domain: 'compliance',
  version: '1.0.0',
  schema: { type: 'boolean' },
  evidence: { required: ['protocol_signatory_record'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.9,
    evidenceWeights: { protocol_signatory_record: 1.0 },
    minimumThreshold: 0.8,
  },
  temporal: {
    validDuration: 'P2Y',
    renewalRequired: false,
    monitoringType: 'periodic',
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['protocol signatory', 'regional agreement', 'treaty participation'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.StandardMet,
      WORKPROOF_PREDICATE_URIS.RegionalCertificationIcglrRcm,
    ],
    contextTemplate: 'Signatory to regional protocol',
  },
};

export const PricePreciousMetalFix: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.PricePreciousMetalFix,
  name: 'Price Precious Metal Fix',
  description: 'Precious metal price is recorded against an authoritative fix',
  domain: 'financial',
  version: '1.0.0',
  schema: { type: 'number', min: 0 },
  evidence: { required: ['price_feed_record'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'FinanceID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.95,
    evidenceWeights: { price_feed_record: 1.0 },
    minimumThreshold: 0.8,
  },
  temporal: {
    validDuration: 'P1D',
    renewalRequired: false,
    monitoringType: 'continuous',
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['precious metal price', 'fix price', 'commodity price feed', 'LBMA'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.PaymentReceived,
      WORKPROOF_PREDICATE_URIS.CommodityProduced,
    ],
    contextTemplate: 'Precious metal fix: {{value}} {{unit}}',
  },
};

export const ConflictZoneCleared: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.ConflictZoneCleared,
  name: 'Conflict Zone Cleared',
  description: 'Entity or shipment has cleared conflict zone screening',
  domain: 'compliance',
  version: '1.0.0',
  schema: { type: 'boolean' },
  evidence: { required: ['conflict_screening_record'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.95,
    evidenceWeights: { conflict_screening_record: 1.0 },
    minimumThreshold: 0.9,
  },
  temporal: {
    validDuration: 'P3M',
    renewalRequired: true,
    monitoringType: 'continuous',
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['conflict zone screening', 'security assessment', 'red line clearance'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.SanctionsCleared,
      WORKPROOF_PREDICATE_URIS.ViolationFree,
    ],
    contextTemplate: 'Conflict zone cleared on {{effectiveAt}}',
  },
};

export const OriginSatelliteVerified: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.OriginSatelliteVerified,
  name: 'Origin Satellite Verified',
  description: 'Origin location verified through satellite imagery analysis',
  domain: 'location',
  version: '1.0.0',
  schema: { type: 'boolean' },
  evidence: { required: ['satellite_imagery_record'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.9,
    evidenceWeights: { satellite_imagery_record: 1.0 },
    minimumThreshold: 0.8,
  },
  temporal: {
    validDuration: 'P6M',
    renewalRequired: true,
    monitoringType: 'periodic',
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: [
      'satellite imagery',
      'origin verification',
      'remote sensing',
      'geospatial analysis',
    ],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.SiteVerified,
      WORKPROOF_PREDICATE_URIS.OriginAuthenticated,
    ],
    contextTemplate: 'Origin verified via satellite imagery',
  },
};

export const PhysicalSealAttested: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.PhysicalSealAttested,
  name: 'Physical Seal Attested',
  description: 'Physical tamper-evident seal has been attested',
  domain: 'compliance',
  version: '1.0.0',
  schema: { type: 'boolean' },
  evidence: { required: ['hardware_seal_record'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.9,
    evidenceWeights: { hardware_seal_record: 1.0 },
    minimumThreshold: 0.8,
  },
  temporal: {
    validDuration: 'P1Y',
    renewalRequired: true,
    monitoringType: 'periodic',
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: [
      'physical seal',
      'tamper-evident seal',
      'hardware attestation',
      'custody seal',
    ],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.InspectionPassed,
      WORKPROOF_PREDICATE_URIS.LicenseValid,
    ],
    contextTemplate: 'Physical seal attested on {{effectiveAt}}',
  },
};
