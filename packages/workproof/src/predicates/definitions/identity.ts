import type { PredicateDefinition } from '@gtcx/verification';

import { WORKPROOF_PREDICATE_URIS } from '../uri';

export const IdentityVerified: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.IdentityVerified,
    name: 'Identity Verified',
    description: 'Subject identity verified through official documentation and/or biometrics',
    domain: 'identity',
    version: '2.1.0',
    schema: { type: 'boolean' },
    evidence: {
      required: ['government_id'],
      optional: ['biometric_face', 'biometric_fingerprint'],
    },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
      selfAttestation: false,
    },
    confidence: {
      baseScore: 0.9,
      evidenceWeights: { government_id: 0.7, biometric_face: 0.2, biometric_fingerprint: 0.1 },
      minimumThreshold: 0.7,
    },
    temporal: { validDuration: 'P1Y', renewalRequired: true, monitoringType: 'periodic' },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['government document', 'biometric match'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.RoleHeld],
      contextTemplate: 'Identity verified via {{evidenceType}}',
    },
  };
export const RoleHeld: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.RoleHeld,
    name: 'Role Held',
    description: 'Employment role assigned and active',
    domain: 'identity',
    version: '2.1.0',
    schema: { type: 'string' },
    evidence: { required: ['document_hash'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
      selfAttestation: false,
    },
    confidence: { baseScore: 0.85, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.6 },
    temporal: {
      validDuration: 'P6M',
      renewalRequired: true,
      monitoringType: 'event_triggered',
      triggers: ['role.granted', 'role.revoked'],
    },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['role assignment document'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.EmploymentActive],
      contextTemplate: 'Role {{value}} assigned',
    },
  };
export const EmploymentActive: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.EmploymentActive,
    name: 'Employment Active',
    description: 'Subject is actively employed by an operating company',
    domain: 'identity',
    version: '2.1.0',
    schema: { type: 'boolean' },
    evidence: { required: ['document_hash'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
      selfAttestation: false,
    },
    confidence: { baseScore: 0.9, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.7 },
    temporal: { validDuration: 'P1M', renewalRequired: true, monitoringType: 'continuous' },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['active employment contract'],
      relatedPredicates: [
        WORKPROOF_PREDICATE_URIS.RoleHeld,
        WORKPROOF_PREDICATE_URIS.TenureAchieved,
      ],
      contextTemplate: 'Employment active since {{effectiveAt}}',
    },
  };
export const TenureAchieved: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.TenureAchieved,
    name: 'Tenure Achieved',
    description: 'Employment duration milestone reached',
    domain: 'identity',
    version: '2.1.0',
    schema: { type: 'number', min: 1 },
    evidence: { required: ['document_hash'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
      selfAttestation: false,
    },
    confidence: { baseScore: 0.95, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.8 },
    temporal: { validDuration: 'P5Y', renewalRequired: false },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['employment history timeline'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.EmploymentActive],
      contextTemplate: '{{value}} months tenure achieved',
    },
  };
export const CommunityMembership: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.CommunityMembership,
    name: 'Community Membership',
    description: 'Community or cooperative affiliation verified',
    domain: 'identity',
    version: '2.1.0',
    schema: { type: 'string' },
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
    temporal: { validDuration: 'P1Y', renewalRequired: true, monitoringType: 'periodic' },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['community affiliation records'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.PeerEndorsement],
      contextTemplate: 'Member of {{value}}',
    },
  };
