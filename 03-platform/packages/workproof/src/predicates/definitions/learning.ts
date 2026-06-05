import type { PredicateDefinition } from '@gtcx/verification';

import { WORKPROOF_PREDICATE_URIS } from '../uri';

export const ModuleCompleted: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.ModuleCompleted,
  name: 'Module Completed',
  description: 'Training module finished with satisfactory completion',
  domain: 'composite',
  version: '2.1.0',
  schema: { type: 'string' },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'CertifierID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.9, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.7 },
  temporal: { validDuration: 'P5Y', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['training completion assessment'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.AssessmentPassed],
    contextTemplate: 'Module completed: {{value}}',
  },
};
export const AssessmentPassed: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.AssessmentPassed,
  name: 'Assessment Passed',
  description: 'Knowledge or skill assessment passed',
  domain: 'composite',
  version: '2.1.0',
  schema: { type: 'number', min: 0, max: 100 },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'CertifierID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.9, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.7 },
  temporal: { validDuration: 'P5Y', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['assessment score analysis'],
    relatedPredicates: [
      WORKPROOF_PREDICATE_URIS.ModuleCompleted,
      WORKPROOF_PREDICATE_URIS.CertificationEarned,
    ],
    contextTemplate: 'Assessment passed: {{value}}%',
  },
};
export const CertificationEarned: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.CertificationEarned,
  name: 'Certification Earned',
  description: 'Formal certification or credential issued',
  domain: 'composite',
  version: '2.1.0',
  schema: { type: 'string' },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'CertifierID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.95, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.8 },
  temporal: {
    validDuration: 'P3Y',
    renewalRequired: true,
    monitoringType: 'event_triggered',
    triggers: ['certification.expired'],
  },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['certification document verification'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.AssessmentPassed],
    contextTemplate: 'Certification earned: {{value}}',
  },
};
export const SkillDemonstrated: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.SkillDemonstrated,
  name: 'Skill Demonstrated',
  description: 'Competency verified through practical demonstration',
  domain: 'composite',
  version: '2.1.0',
  schema: { type: 'string' },
  evidence: { required: ['photo_evidence'], optional: ['witness_attestation'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'CertifierID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.8,
    evidenceWeights: { photo_evidence: 0.5, witness_attestation: 0.5 },
    minimumThreshold: 0.6,
  },
  temporal: { validDuration: 'P2Y', renewalRequired: true },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['skill demonstration video/photo analysis'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.CertificationEarned],
    contextTemplate: 'Skill demonstrated: {{value}}',
  },
};
export const MentorshipProvided: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.MentorshipProvided,
  name: 'Mentorship Provided',
  description: 'Teaching or mentoring others verified',
  domain: 'composite',
  version: '2.1.0',
  schema: { type: 'number', min: 0 },
  evidence: { required: ['witness_attestation'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
    selfAttestation: false,
    minimumAttestors: 2,
  },
  confidence: {
    baseScore: 0.7,
    evidenceWeights: { witness_attestation: 1.0 },
    minimumThreshold: 0.5,
  },
  temporal: { validDuration: 'P1Y', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['mentorship session records'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.MentorshipReceived],
    contextTemplate: '{{value}} hours of mentorship provided',
  },
};
