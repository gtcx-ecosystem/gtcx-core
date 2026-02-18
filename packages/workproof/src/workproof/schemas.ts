// ============================================================================
// WORKPROOF SCHEMAS
// Zod schemas for the core WorkProof W3C VC model
// ============================================================================

import { ClaimProofSchema, PredicateURISchema } from '@gtcx/verification';
import { z } from 'zod';

import { WorkProofEvidenceItemSchema } from '../evidence/schemas';
import { WorkProofPredicateTypeSchema, PredicateValueSchema } from '../predicates/schemas';

/** The 12 canonical WorkProof types */
export const WorkProofTypeSchema = z.enum([
  'ProductionEvent',
  'PaymentReceived',
  'TrainingCompletion',
  'CertificationEarned',
  'ComplianceVerification',
  'RoleAssignment',
  'LoanRepayment',
  'MilestoneAchievement',
  'GCISnapshot',
  'TenureMark',
  'CommunityEndorsement',
  'TraditionalAuthorityAttestation',
]);

export const WorkProofClaimSchema = z.object({
  predicateType: WorkProofPredicateTypeSchema,
  predicateURI: PredicateURISchema,
  value: PredicateValueSchema,
  evidence: z.array(WorkProofEvidenceItemSchema).min(1),
  confidence: z.number().min(0).max(1),
  issuedAt: z.number().int().positive(),
  validUntil: z.number().int().positive().optional(),
  proof: ClaimProofSchema,
});

export const WorkProofCredentialSubjectSchema = z.object({
  id: z.string().min(1),
  proofType: WorkProofTypeSchema,
  tradepassId: z.string().min(1),
  issuerId: z.string().min(1),
  issuerRole: z.string().min(1),
  commodityContext: z.string().optional(),
  siteId: z.string().optional(),
  claims: z.array(WorkProofClaimSchema).min(1),
  metadata: z.record(z.unknown()).optional(),
});

export const WorkProofSchema = z.object({
  '@context': z.array(z.string()).min(1),
  type: z
    .array(z.string())
    .refine((t) => t.includes('VerifiableCredential') && t.includes('WorkProof'), {
      message: "type must include 'VerifiableCredential' and 'WorkProof'",
    }),
  issuer: z.union([z.string(), z.object({ id: z.string(), name: z.string().optional() })]),
  issuanceDate: z.string().datetime(),
  expirationDate: z.string().datetime().optional(),
  credentialSubject: WorkProofCredentialSubjectSchema,
  proof: z
    .object({
      type: z.string().min(1),
      created: z.string().min(1),
      verificationMethod: z.string().min(1),
      proofPurpose: z.string().min(1),
      proofValue: z.string().min(1),
    })
    .optional(),
  workProofVersion: z.literal('2.1'),
});
