import type { PredicateDefinition } from '@gtcx/verification';

import { WORKPROOF_PREDICATE_URIS } from '../uri';

export const InspectionPassed: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.InspectionPassed,
  name: 'Inspection Passed',
  description: 'Regulatory or third-party inspection cleared',
  domain: 'compliance',
  version: '2.1.0',
  schema: { type: 'boolean' },
  evidence: { required: ['document_hash'], optional: ['photo_evidence'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.95,
    evidenceWeights: { document_hash: 0.8, photo_evidence: 0.2 },
    minimumThreshold: 0.8,
  },
  temporal: { validDuration: 'P1Y', renewalRequired: true, monitoringType: 'periodic' },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['inspection report analysis'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.StandardMet],
    contextTemplate: 'Inspection passed on {{effectiveAt}}',
  },
};
export const StandardMet: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.StandardMet,
  name: 'Standard Met',
  description: 'Specific compliance standard requirement satisfied',
  domain: 'compliance',
  version: '2.1.0',
  schema: { type: 'string' },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'CertifierID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.9, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.7 },
  temporal: { validDuration: 'P1Y', renewalRequired: true, monitoringType: 'periodic' },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['standard reference validation'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.InspectionPassed],
    contextTemplate: 'Standard {{value}} met',
  },
};
export const GCIScoreRecorded: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.GCIScoreRecorded,
  name: 'GCI Score Recorded',
  description: 'Compliance score snapshot from GCI engine',
  domain: 'compliance',
  version: '2.1.0',
  schema: { type: 'number', min: 0, max: 100 },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'pattern', value: 'did:gtcx:gci:*' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.95, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.9 },
  temporal: { validDuration: 'P30D', renewalRequired: false, monitoringType: 'periodic' },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['GCI score trend analysis'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.InspectionPassed,
      WORKPROOF_PREDICATE_URIS.ViolationFree,
    ],
    contextTemplate: 'GCI score: {{value}}/100',
  },
};
export const ViolationFree: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.ViolationFree,
  name: 'Violation Free',
  description: 'No compliance violations recorded during specified period',
  domain: 'compliance',
  version: '2.1.0',
  schema: { type: 'boolean' },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.85, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.7 },
  temporal: { validDuration: 'P90D', renewalRequired: true, monitoringType: 'continuous' },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['violation database check'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.GCIScoreRecorded],
    contextTemplate: 'Violation-free period confirmed',
  },
};
export const LicenseValid: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.LicenseValid,
  name: 'License Valid',
  description: 'Operating license current and valid',
  domain: 'compliance',
  version: '2.1.0',
  schema: { type: 'boolean' },
  evidence: { required: ['government_id', 'mining_license'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.95,
    evidenceWeights: { government_id: 0.5, mining_license: 0.5 },
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
    reasoningHints: ['license expiry date check'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.InspectionPassed],
    contextTemplate: 'License valid until {{expiresAt}}',
  },
};
