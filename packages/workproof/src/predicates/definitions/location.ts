import type { PredicateDefinition } from '@gtcx/verification';

import { WORKPROOF_PREDICATE_URIS } from '../uri';

export const SiteVerified: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.SiteVerified,
    name: 'Site Verified',
    description: 'Production site confirmed through GPS and/or satellite imagery',
    domain: 'location',
    version: '2.1.0',
    schema: { type: 'boolean' },
    evidence: { required: ['gps_location'], optional: ['photo_evidence'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
      selfAttestation: false,
    },
    confidence: {
      baseScore: 0.9,
      evidenceWeights: { gps_location: 0.7, photo_evidence: 0.3 },
      minimumThreshold: 0.7,
    },
    temporal: { validDuration: 'P1Y', renewalRequired: true, monitoringType: 'periodic' },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['GPS coordinates within registered boundary'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.GeofenceCompliant],
      contextTemplate: 'Site verified at {{coordinates}}',
    },
  };
export const GeofenceCompliant: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.GeofenceCompliant,
    name: 'Geofence Compliant',
    description: 'Activity within authorized geographic boundary',
    domain: 'location',
    version: '2.1.0',
    schema: { type: 'boolean' },
    evidence: { required: ['gps_location'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'AuthorityID' }],
      selfAttestation: false,
    },
    confidence: { baseScore: 0.95, evidenceWeights: { gps_location: 1.0 }, minimumThreshold: 0.8 },
    temporal: { validDuration: 'P1D', renewalRequired: false, monitoringType: 'continuous' },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['geofence boundary check'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.SiteVerified],
      contextTemplate: 'Within authorized geofence',
    },
  };
export const LocationConsistent: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.LocationConsistent,
    name: 'Location Consistent',
    description: 'Location history aligns with reported production activities',
    domain: 'location',
    version: '2.1.0',
    schema: { type: 'number', min: 0, max: 1 },
    evidence: { required: ['gps_location'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
      selfAttestation: false,
    },
    confidence: {
      baseScore: 0.8,
      evidenceWeights: { gps_location: 1.0 },
      minimumThreshold: 0.6,
      decayModel: 'linear',
      halfLife: 30,
    },
    temporal: { validDuration: 'P7D', renewalRequired: false, monitoringType: 'continuous' },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['location trajectory analysis', 'travel time feasibility'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.SiteVerified],
      contextTemplate: 'Location consistency score: {{value}}',
    },
  };
export const EnvironmentalCompliance: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.EnvironmentalCompliance,
    name: 'Environmental Compliance',
    description: 'Environmental standards met at production site',
    domain: 'compliance',
    version: '2.1.0',
    schema: { type: 'boolean' },
    evidence: { required: ['site_audit'], optional: ['photo_evidence'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'CertifierID' }],
      selfAttestation: false,
    },
    confidence: {
      baseScore: 0.85,
      evidenceWeights: { site_audit: 0.7, photo_evidence: 0.3 },
      minimumThreshold: 0.7,
    },
    temporal: { validDuration: 'P6M', renewalRequired: true, monitoringType: 'periodic' },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['satellite deforestation check', 'water body proximity'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.MethodCompliant],
      contextTemplate: 'Environmental compliance verified',
    },
  };
