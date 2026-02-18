// ============================================================================
// EVIDENCE SCHEMAS
// Zod schemas for WorkProof evidence types
// ============================================================================

import { EvidenceTypeSchema } from '@gtcx/verification';
import { z } from 'zod';

/** New evidence types added by WorkProof (beyond @gtcx/verification's 11) */
export const WorkProofNewEvidenceTypeSchema = z.enum([
  'satellite_image',
  'financial_record',
  'voice_recording',
  'video_capture',
  'community_attestation',
  'traditional_authority',
  'sensor_data',
  'system_log',
]);

/** Combined evidence type: existing 11 + 8 new */
export const WorkProofEvidenceTypeSchema = z.union([
  EvidenceTypeSchema,
  WorkProofNewEvidenceTypeSchema,
]);

export const AIQualityAssessmentSchema = z.object({
  qualityScore: z.number().min(0).max(1),
  clarityScore: z.number().min(0).max(1),
  authenticityScore: z.number().min(0).max(1),
  relevanceScore: z.number().min(0).max(1),
  assessmentModel: z.string().min(1),
  assessedAt: z.number().int().positive(),
});

export const CaptureModeSchema = z.enum(['online', 'offline', 'sms']);

export const WorkProofEvidenceItemSchema = z.object({
  type: WorkProofEvidenceTypeSchema,
  hash: z.string().min(1),
  timestamp: z.number().int().positive(),
  uri: z.string().optional(),
  mimeType: z.string().optional(),
  captureMode: CaptureModeSchema.optional(),
  deviceId: z.string().optional(),
  aiQuality: AIQualityAssessmentSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type WorkProofEvidenceTypeInferred = z.infer<typeof WorkProofEvidenceTypeSchema>;
export type AIQualityAssessmentInferred = z.infer<typeof AIQualityAssessmentSchema>;
export type WorkProofEvidenceItemInferred = z.infer<typeof WorkProofEvidenceItemSchema>;
