// ============================================================================
// TRUST REGISTRY SCHEMAS
// Zod schemas for trust registry types
// ============================================================================

import { z } from 'zod';

import { WorkProofTypeSchema } from '../workproof/schemas';

export const IssuerTrustLevelSchema = z.enum(['sovereign', 'licensed', 'accredited', 'community']);

export const AdmissionCriteriaSchema = z.object({
  requiredDocuments: z.array(z.string()),
  minimumOperationalYears: z.number().int().nonnegative().optional(),
  jurisdictions: z.array(z.string().min(2)).min(1),
  commodityRestrictions: z.array(z.string()).optional(),
});

export const TrustRegistryEntrySchema = z.object({
  issuerDID: z.string().min(1),
  issuerName: z.string().min(1),
  trustLevel: IssuerTrustLevelSchema,
  admissionCriteria: AdmissionCriteriaSchema,
  isActive: z.boolean(),
  admittedAt: z.number().int().positive(),
  expiresAt: z.number().int().positive().optional(),
  revokedAt: z.number().int().positive().optional(),
  revokeReason: z.string().optional(),
  supportedProofTypes: z.array(WorkProofTypeSchema).min(1),
  metadata: z.record(z.unknown()).optional(),
});

export const TrustRegistrySchema = z.object({
  registryId: z.string().min(1),
  version: z.string().min(1),
  updatedAt: z.number().int().positive(),
  entries: z.array(TrustRegistryEntrySchema),
});
