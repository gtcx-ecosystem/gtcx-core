import type { PredicateDefinition } from '@gtcx/verification';

import { WORKPROOF_PREDICATE_URIS } from '../uri';

export const ConsistencyMaintained: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.ConsistencyMaintained,
  name: 'Consistency Maintained',
  description: 'Regular reporting/activity pattern achieved',
  domain: 'temporal',
  version: '2.1.0',
  schema: { type: 'number', min: 0, max: 1 },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'pattern', value: 'did:gtcx:*' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.9, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.7 },
  temporal: { validDuration: 'P30D', renewalRequired: false, monitoringType: 'continuous' },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['activity frequency analysis', 'reporting gap detection'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.ReliabilityScore],
    contextTemplate: 'Consistency score: {{value}}',
  },
};
export const QualityThresholdMet: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.QualityThresholdMet,
  name: 'Quality Threshold Met',
  description: 'Quality standard consistently achieved',
  domain: 'temporal',
  version: '2.1.0',
  schema: { type: 'boolean' },
  evidence: { required: ['assay_report'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'CertifierID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.9, evidenceWeights: { assay_report: 1.0 }, minimumThreshold: 0.8 },
  temporal: { validDuration: 'P90D', renewalRequired: true, monitoringType: 'periodic' },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['quality trend analysis'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.QualityGraded],
    contextTemplate: 'Quality threshold met',
  },
};
export const ProductivityTarget: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.ProductivityTarget,
  name: 'Productivity Target',
  description: 'Production target reached for specified period',
  domain: 'temporal',
  version: '2.1.0',
  schema: { type: 'number', min: 0 },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.85, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.7 },
  temporal: { validDuration: 'P30D', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['production volume tracking'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.CommodityProduced],
    contextTemplate: 'Productivity target: {{value}}',
  },
};
export const ReliabilityScore: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.ReliabilityScore,
  name: 'Reliability Score',
  description: 'Computed reliability metric based on activity patterns',
  domain: 'temporal',
  version: '2.1.0',
  schema: { type: 'number', min: 0, max: 1 },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'pattern', value: 'did:gtcx:*' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.85, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.7 },
  temporal: { validDuration: 'P30D', renewalRequired: false, monitoringType: 'continuous' },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['reliability pattern computation'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.ConsistencyMaintained],
    contextTemplate: 'Reliability score: {{value}}',
  },
};
