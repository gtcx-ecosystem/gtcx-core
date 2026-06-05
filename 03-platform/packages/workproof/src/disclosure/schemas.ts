// ============================================================================
// DISCLOSURE SCHEMAS
// Zod schemas for selective disclosure types
// ============================================================================

import { z } from 'zod';

import { WorkProofPredicateTypeSchema } from '../predicates/schemas';

export const ThresholdOperatorSchema = z.enum(['gt', 'gte', 'lt', 'lte', 'eq', 'range']);

export const DisclosureLevelSchema = z.enum([
  'full',
  'summary',
  'category',
  'threshold',
  'single_credential',
]);

export const ThresholdClaimSchema = z
  .object({
    property: WorkProofPredicateTypeSchema,
    operator: ThresholdOperatorSchema,
    threshold: z.union([z.number(), z.tuple([z.number(), z.number()])]),
    unit: z.string().optional(),
  })
  .refine(
    (v) => {
      if (v.operator === 'range') return Array.isArray(v.threshold);
      return typeof v.threshold === 'number';
    },
    { message: 'range operator requires [min, max] tuple; others require single number' }
  );

export const SelectiveDisclosureRequestSchema = z.object({
  requestId: z.string().min(1),
  requestorDID: z.string().min(1),
  subjectDID: z.string().min(1),
  disclosureLevel: DisclosureLevelSchema,
  requestedCategories: z.array(z.string()).optional(),
  requestedPredicates: z.array(WorkProofPredicateTypeSchema).optional(),
  thresholdClaims: z.array(ThresholdClaimSchema).optional(),
  purpose: z.string().min(1),
  expiresAt: z.number().int().positive(),
});

export const ThresholdResultSchema = z.object({
  claim: ThresholdClaimSchema,
  satisfied: z.boolean(),
  zkProofUri: z.string().optional(),
});

export const SelectiveDisclosureResponseSchema = z.object({
  requestId: z.string().min(1),
  disclosureLevel: DisclosureLevelSchema,
  thresholdResults: z.array(ThresholdResultSchema).optional(),
  generatedAt: z.number().int().positive(),
  signature: z.string().optional(),
});
