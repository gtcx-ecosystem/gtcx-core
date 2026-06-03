// ============================================================================
// ENTITY SCHEMAS
// Predicates, claims, certificates, templates, and proof bundles.
// ============================================================================

import { z } from 'zod';

import {
  CertificateSecurityLevelSchema,
  CertificateTypeSchema,
  CredentialTypeSchema,
  EvidenceTypeSchema,
  PredicateDomainSchema,
} from './enums';
import {
  AssetLotDataSchema,
  CertificateLocationSchema,
  EnvironmentalFactorsSchema,
  GeneratedQRCodeSchema,
  ResourceContextSchema,
  ValidationMetricsSchema,
} from './primitives';

// ============================================================================
// PREDICATE SCHEMAS
// ============================================================================

export const PredicateURISchema = z.string().regex(/^tradepass:\/\/[^/]+\/[^/]+\/[^/]+$/);

export const PredicateSchemaSchema: z.ZodType<unknown> = z.object({
  type: z.enum(['boolean', 'enum', 'string', 'number', 'date', 'object']),
  values: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  properties: z
    .record(
      z.string(),
      z.lazy(() => PredicateSchemaSchema)
    )
    .optional(),
});

export const AttestorPatternSchema = z.object({
  type: z.enum(['exact', 'pattern', 'credential']),
  value: z.string().min(1),
  credentialRequired: CredentialTypeSchema.optional(),
});

export const EvidenceRequirementsSchema = z.object({
  required: z.array(EvidenceTypeSchema),
  optional: z.array(EvidenceTypeSchema).optional(),
  alternatives: z.array(z.array(EvidenceTypeSchema)).optional(),
});

export const AttestationRulesSchema = z.object({
  allowedAttestors: z.array(AttestorPatternSchema),
  selfAttestation: z.boolean(),
  multiSignatureRequired: z.boolean().optional(),
  minimumAttestors: z.number().int().positive().optional(),
});

export const ConfidenceRulesSchema = z.object({
  baseScore: z.number().min(0).max(1),
  evidenceWeights: z.record(z.string(), z.number()),
  minimumThreshold: z.number().min(0).max(1),
  decayModel: z.enum(['linear', 'exponential', 'none']).optional(),
  halfLife: z.number().positive().optional(),
});

export const TemporalRulesSchema = z.object({
  validDuration: z.string(),
  renewalRequired: z.boolean(),
  monitoringType: z.enum(['continuous', 'periodic', 'event_triggered']).optional(),
  triggers: z.array(z.string()).optional(),
});

export const AIMetadataSchema = z.object({
  embeddingModel: z.string().min(1),
  reasoningHints: z.array(z.string().min(1)),
  relatedPredicates: z.array(PredicateURISchema),
  contradictoryPredicates: z.array(PredicateURISchema).optional(),
  contextTemplate: z.string().min(1),
});

export const PredicateDefinitionSchema = z.object({
  uri: PredicateURISchema,
  name: z.string().min(1),
  description: z.string().min(1),
  domain: PredicateDomainSchema,
  version: z.string().min(1),
  schema: PredicateSchemaSchema,
  evidence: EvidenceRequirementsSchema,
  attestation: AttestationRulesSchema,
  confidence: ConfidenceRulesSchema,
  temporal: TemporalRulesSchema,
  ai: AIMetadataSchema,
});

// ============================================================================
// CLAIM SCHEMAS
// ============================================================================

export const ClaimProofSchema = z.object({
  type: z.enum(['Ed25519Signature2020', 'EcdsaSecp256k1Signature2019']),
  created: z.string().min(1),
  verificationMethod: z.string().min(1),
  proofValue: z.string().min(1),
});

export const ClaimEvidenceSchema = z.object({
  type: EvidenceTypeSchema,
  hash: z.string().min(1),
  timestamp: z.number().int().positive(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ClaimSchema = z.object({
  id: z.string().min(1),
  subject: z.string().min(1),
  predicate: PredicateURISchema,
  value: z.unknown(),
  evidence: z.array(ClaimEvidenceSchema),
  attestor: z.string().min(1),
  confidence: z.number().min(0).max(1),
  issuedAt: z.number().int().positive(),
  validUntil: z.number().int().positive().optional(),
  proof: ClaimProofSchema,
});

// ============================================================================
// CERTIFICATE SCHEMAS
// ============================================================================

export const CertificateMetadataSchema = z.object({
  issuer: z.string().min(1),
  issuedAt: z.number().int().positive(),
  expiresAt: z.number().int().positive().optional(),
  userRole: z.string().min(1),
  deviceId: z.string().min(1),
  location: CertificateLocationSchema,
  resourceContext: ResourceContextSchema.optional(),
  geologicalContext: z
    .object({
      goldPotential: z.enum(['high', 'medium', 'low', 'none']),
      formation: z.string().optional(),
      confidence: z.number(),
    })
    .optional(),
  environmentalFactors: EnvironmentalFactorsSchema.optional(),
  validationMetrics: ValidationMetricsSchema.optional(),
});

export const MultiSignatureSchema = z.object({
  ed25519: z.string().min(1),
  secp256k1: z.string().min(1).optional(),
});

export const CertificateVerificationDataSchema = z.object({
  publicKey: z.string().min(1),
  signature: z.string().min(1),
  timestamp: z.number().int().positive(),
  entropyQuality: z.number().min(0).max(1).optional(),
});

export const BaseCertificateSchema = z.object({
  certificateId: z.string().min(1),
  version: z.string().min(1),
  type: CertificateTypeSchema,
  securityLevel: CertificateSecurityLevelSchema,
  metadata: CertificateMetadataSchema,
  verificationData: CertificateVerificationDataSchema,
  createdAt: z.number().int().positive(),
});

export const PhotoEvidenceRefSchema = z.object({
  id: z.string().min(1),
  hash: z.string().min(1),
  timestamp: z.number().int().positive(),
});

export const ComplianceDataSchema = z.object({
  permitNumber: z.string().optional(),
  inspectorId: z.string().optional(),
  complianceLevel: z.string().optional(),
  notes: z.string().optional(),
  gciScore: z.number().min(0).max(100).optional(),
  claims: z.array(ClaimSchema).optional(),
});

export const StandardCertificateSchema = BaseCertificateSchema.extend({
  securityLevel: z.enum(['standard', 'enhanced']),
  dataHash: z.string().min(1),
  signature: z.string().min(1),
});

export const MilitaryGradeCertificateSchema = BaseCertificateSchema.extend({
  securityLevel: z.enum(['military', 'post-quantum']),
  postQuantumHash: z.string().min(1),
  multiSignature: MultiSignatureSchema,
  certificateData: z.object({
    assetLotData: AssetLotDataSchema.optional(),
    goldLotData: z
      .object({
        estimatedWeight: z.number(),
        quality: z.enum(['high', 'medium', 'low']).optional(),
        purity: z.number().optional(),
        miner: z.string().optional(),
        discoveryDate: z.string().optional(),
      })
      .optional(),
    photoEvidence: z.array(PhotoEvidenceRefSchema).optional(),
    workflowContext: z.string().optional(),
    complianceData: ComplianceDataSchema.optional(),
    claims: z.array(ClaimSchema).optional(),
  }),
});

export const CertificateVerificationResultSchema = z.object({
  isValid: z.boolean(),
  certificate: BaseCertificateSchema.optional(),
  confidence: z.number().min(0).max(1),
  details: z.string(),
  checks: z.object({
    hashValid: z.boolean(),
    signatureValid: z.boolean(),
    timestampValid: z.boolean(),
    notExpired: z.boolean(),
    notRevoked: z.boolean(),
  }),
});

// ============================================================================
// TEMPLATE SCHEMAS
// ============================================================================

export const ValidationRuleSchema = z.object({
  field: z.string().min(1),
  min: z.number().optional(),
  max: z.number().optional(),
  value: z.union([z.boolean(), z.string(), z.number()]).optional(),
  message: z.string().min(1),
});

export const CertificateTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  type: CertificateTypeSchema,
  securityLevel: CertificateSecurityLevelSchema,
  requiredFields: z.array(z.string()),
  optionalFields: z.array(z.string()),
  validationRules: z.array(ValidationRuleSchema),
  requiredPredicates: z.array(PredicateURISchema).optional(),
});

// ============================================================================
// PROOF BUNDLE SCHEMAS
// ============================================================================

export const CryptographicProofRefSchema = z.object({
  algorithm: z.string().min(1),
  dataHash: z.string().min(1),
  signature: z.string().min(1),
  publicKey: z.string().min(1),
});

export const LocationProofRefSchema = z.object({
  id: z.string().min(1),
  coordinates: CertificateLocationSchema,
  hash: z.string().min(1),
});

export const PhotoProofRefSchema = z.object({
  id: z.string().min(1),
  uri: z.string().min(1),
  hash: z.string().min(1),
  timestamp: z.number().int().positive(),
});

export const CommodityOriginProfileIdSchema = z.enum(['gh-gold-origin', 'zw-diamond-origin']);

export const CommodityOriginZkProofRefSchema = z.object({
  profileId: CommodityOriginProfileIdSchema,
  system: z.literal('groth16'),
  proofType: z.literal('commodity_origin'),
  proof: z.string().min(2),
  verifyingKey: z.string().min(2),
  publicInputsJson: z.string().min(2),
});

export const ProofBundleSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['location', 'photo', 'workflow', 'certificate']),
  timestamp: z.number().int().positive(),
  proofs: z.object({
    cryptographicProof: CryptographicProofRefSchema,
    locationProof: LocationProofRefSchema.optional(),
    photoProofs: z.array(PhotoProofRefSchema).optional(),
    commodityOriginZkProof: CommodityOriginZkProofRefSchema.optional(),
  }),
  certificate: BaseCertificateSchema.optional(),
  qrCode: GeneratedQRCodeSchema.optional(),
  claims: z.array(ClaimSchema).optional(),
});
