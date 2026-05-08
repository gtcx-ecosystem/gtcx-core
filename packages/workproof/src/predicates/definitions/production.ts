import type { PredicateDefinition } from '@gtcx/verification';

import { WORKPROOF_PREDICATE_URIS } from '../uri';

export const CommodityProduced: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.CommodityProduced,
    name: 'Commodity Produced',
    description: 'Physical commodity production verified through evidence',
    domain: 'asset',
    version: '2.1.0',
    schema: {
      type: 'object',
      properties: {
        commodity: { type: 'string' },
        quantity: { type: 'number', min: 0 },
        unit: { type: 'string' },
      },
    },
    evidence: { required: ['photo_evidence', 'gps_location'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
      selfAttestation: false,
    },
    confidence: {
      baseScore: 0.8,
      evidenceWeights: { photo_evidence: 0.5, gps_location: 0.3, witness_attestation: 0.2 },
      minimumThreshold: 0.6,
    },
    temporal: { validDuration: 'P30D', renewalRequired: false },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['commodity visual recognition', 'quantity estimation'],
      relatedPredicates: [
        WORKPROOF_PREDICATE_URIS.QuantityVerified,
        WORKPROOF_PREDICATE_URIS.OriginAuthenticated,
      ],
      contextTemplate: '{{commodity}} produced: {{quantity}} {{unit}}',
    },
  };
export const QuantityVerified: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.QuantityVerified,
    name: 'Quantity Verified',
    description: 'Production quantity independently confirmed',
    domain: 'asset',
    version: '2.1.0',
    schema: { type: 'number', min: 0 },
    evidence: { required: ['photo_evidence'], optional: ['assay_report'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'CertifierID' }],
      selfAttestation: false,
    },
    confidence: {
      baseScore: 0.85,
      evidenceWeights: { photo_evidence: 0.4, assay_report: 0.6 },
      minimumThreshold: 0.7,
    },
    temporal: { validDuration: 'P30D', renewalRequired: false },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['weight measurement', 'visual estimation cross-check'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.CommodityProduced],
      contextTemplate: 'Quantity verified: {{value}}',
    },
  };
export const QualityGraded: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.QualityGraded,
    name: 'Quality Graded',
    description: 'Quality assessment completed by authorized grader',
    domain: 'asset',
    version: '2.1.0',
    schema: { type: 'enum', values: ['high', 'medium', 'low'] },
    evidence: { required: ['assay_report'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'CertifierID' }],
      selfAttestation: false,
    },
    confidence: { baseScore: 0.9, evidenceWeights: { assay_report: 1.0 }, minimumThreshold: 0.8 },
    temporal: { validDuration: 'P30D', renewalRequired: false },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['assay report analysis'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.CommodityProduced],
      contextTemplate: 'Quality grade: {{value}}',
    },
  };
export const OriginAuthenticated: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.OriginAuthenticated,
    name: 'Origin Authenticated',
    description: 'Commodity provenance verified to specific extraction site',
    domain: 'asset',
    version: '2.1.0',
    schema: { type: 'boolean' },
    evidence: { required: ['gps_location', 'photo_evidence'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'ProducerID' }],
      selfAttestation: false,
    },
    confidence: {
      baseScore: 0.85,
      evidenceWeights: { gps_location: 0.5, photo_evidence: 0.3, site_audit: 0.2 },
      minimumThreshold: 0.7,
    },
    temporal: { validDuration: 'P30D', renewalRequired: false },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['GPS matches registered site', 'satellite imagery correlation'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.SiteVerified],
      contextTemplate: 'Origin authenticated at site {{siteId}}',
    },
  };
export const MethodCompliant: PredicateDefinition = {
    uri: WORKPROOF_PREDICATE_URIS.MethodCompliant,
    name: 'Method Compliant',
    description: 'Production method meets required standards',
    domain: 'compliance',
    version: '2.1.0',
    schema: { type: 'boolean' },
    evidence: { required: ['photo_evidence'], optional: ['site_audit'] },
    attestation: {
      allowedAttestors: [{ type: 'credential', value: 'CertifierID' }],
      selfAttestation: false,
    },
    confidence: {
      baseScore: 0.8,
      evidenceWeights: { photo_evidence: 0.5, site_audit: 0.5 },
      minimumThreshold: 0.6,
    },
    temporal: { validDuration: 'P90D', renewalRequired: true, monitoringType: 'periodic' },
    ai: {
      embeddingModel: 'text-embedding-3-large',
      reasoningHints: ['production method visual analysis'],
      relatedPredicates: [WORKPROOF_PREDICATE_URIS.EnvironmentalCompliance],
      contextTemplate: 'Production method compliant',
    },
  };
