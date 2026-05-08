import type { PredicateDefinition } from '@gtcx/verification';

import { WORKPROOF_PREDICATE_URIS } from '../uri';

export const PeerEndorsement: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.PeerEndorsement,
  name: 'Peer Endorsement',
  description: 'Fellow producer attestation of work quality or character',
  domain: 'relationship',
  version: '2.1.0',
  schema: { type: 'string' },
  evidence: { required: ['witness_attestation'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
    selfAttestation: false,
    minimumAttestors: 3,
  },
  confidence: {
    baseScore: 0.6,
    evidenceWeights: { witness_attestation: 1.0 },
    minimumThreshold: 0.4,
  },
  temporal: { validDuration: 'P1Y', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['social graph analysis', 'endorsement authenticity'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.CommunityMembership],
    contextTemplate: 'Peer endorsement: {{value}}',
  },
};
export const ElderAttestation: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.ElderAttestation,
  name: 'Elder Attestation',
  description: 'Traditional authority or elder verification',
  domain: 'relationship',
  version: '2.1.0',
  schema: { type: 'string' },
  evidence: { required: ['witness_attestation'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
    selfAttestation: false,
  },
  confidence: {
    baseScore: 0.7,
    evidenceWeights: { witness_attestation: 1.0 },
    minimumThreshold: 0.5,
  },
  temporal: { validDuration: 'P2Y', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['traditional authority verification', 'cultural protocol compliance'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.PeerEndorsement],
    contextTemplate: 'Elder attestation: {{value}}',
  },
};
export const CooperativeMembership: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.CooperativeMembership,
  name: 'Cooperative Membership',
  description: 'Active membership in registered cooperative',
  domain: 'relationship',
  version: '2.1.0',
  schema: { type: 'string' },
  evidence: { required: ['document_hash'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
    selfAttestation: false,
  },
  confidence: { baseScore: 0.9, evidenceWeights: { document_hash: 1.0 }, minimumThreshold: 0.7 },
  temporal: { validDuration: 'P1Y', renewalRequired: true, monitoringType: 'periodic' },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['cooperative registration check'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.CommunityMembership],
    contextTemplate: 'Cooperative member: {{value}}',
  },
};
export const CommunityContribution: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.CommunityContribution,
  name: 'Community Contribution',
  description: 'Verified contribution to community activities',
  domain: 'relationship',
  version: '2.1.0',
  schema: { type: 'string' },
  evidence: { required: ['witness_attestation'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
    selfAttestation: false,
    minimumAttestors: 2,
  },
  confidence: {
    baseScore: 0.6,
    evidenceWeights: { witness_attestation: 1.0 },
    minimumThreshold: 0.4,
  },
  temporal: { validDuration: 'P1Y', renewalRequired: false },
  ai: {
    embeddingModel: 'text-embedding-3-large',
    reasoningHints: ['community activity records'],
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.PeerEndorsement],
    contextTemplate: 'Community contribution: {{value}}',
  },
};
export const MentorshipReceived: PredicateDefinition = {
  uri: WORKPROOF_PREDICATE_URIS.MentorshipReceived,
  name: 'Mentorship Received',
  description: 'Learning from community mentor verified',
  domain: 'relationship',
  version: '2.1.0',
  schema: { type: 'number', min: 0 },
  evidence: { required: ['witness_attestation'] },
  attestation: {
    allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
    selfAttestation: false,
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
    relatedPredicates: [WORKPROOF_PREDICATE_URIS.MentorshipProvided],
    contextTemplate: '{{value}} hours of mentorship received',
  },
};
