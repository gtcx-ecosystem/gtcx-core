// ============================================================================
// EVIDENCE TYPES
// Extended evidence types for WorkProof attestations
// Builds on EvidenceType from @gtcx/verification (11 base types + 8 new)
// ============================================================================

import type { EvidenceType } from '@gtcx/verification';

/**
 * Extended evidence types for WorkProof.
 * Includes all 11 existing EvidenceType values from @gtcx/verification
 * plus 8 new types specific to employment attestation.
 */
export type WorkProofEvidenceType =
  | EvidenceType
  | 'satellite_image'
  | 'financial_record'
  | 'voice_recording'
  | 'video_capture'
  | 'community_attestation'
  | 'traditional_authority'
  | 'sensor_data'
  | 'system_log';

/**
 * AI-powered quality assessment of evidence.
 * Attached to each evidence item during generation or validation.
 */
export interface AIQualityAssessment {
  qualityScore: number; // 0-1 overall quality
  clarityScore: number; // 0-1 image/audio clarity
  authenticityScore: number; // 0-1 tampering detection
  relevanceScore: number; // 0-1 relevance to predicate
  assessmentModel: string; // model used, e.g. "gemini-1.5-pro"
  assessedAt: number; // unix ms
}

/**
 * Evidence item within a WorkProof claim.
 * Extends ClaimEvidence from @gtcx/verification with AI quality and richer metadata.
 */
export interface WorkProofEvidenceItem {
  type: WorkProofEvidenceType;
  hash: string; // SHA-256 of content
  timestamp: number; // capture time, unix ms
  uri?: string; // content URI (IPFS CID, S3, etc.)
  mimeType?: string; // e.g. "image/webp", "audio/mpeg"
  captureMode?: 'online' | 'offline' | 'sms';
  deviceId?: string; // VIA device that captured
  aiQuality?: AIQualityAssessment;
  metadata?: Record<string, unknown>;
}
