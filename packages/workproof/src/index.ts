// ============================================================================
// @gtcx/workproof
// TradeCV/WorkProof v2.1 — Portable Professional Identity & Cryptographic
// Employment Attestation Layer for the GTCX Protocol
// ============================================================================

// ─── Evidence ────────────────────────────────────────────────────────────────
export {
  AIQualityAssessment,
  AIQualityAssessmentInferred,
  AIQualityAssessmentSchema,
  CaptureModeSchema,
  WorkProofEvidenceItem,
  WorkProofEvidenceItemInferred,
  WorkProofEvidenceItemSchema,
  WorkProofEvidenceType,
  WorkProofEvidenceTypeInferred,
  WorkProofEvidenceTypeSchema,
  WorkProofNewEvidenceTypeSchema,
} from './evidence';

// ─── Predicates ──────────────────────────────────────────────────────────────
export {
  BooleanValue,
  BooleanValueSchema,
  CommunityPredicateType,
  CompliancePredicateType,
  EntityPredicateType,
  EnumValue,
  EnumValueSchema,
  FinancialPredicateType,
  HashAlgorithmSchema,
  HashValue,
  HashValueSchema,
  IdentityPredicateType,
  LearningPredicateType,
  LocalizedValue,
  LocalizedValueSchema,
  LocationPredicateType,
  NumericValue,
  NumericValueSchema,
  PREDICATE_CATEGORIES,
  PerformancePredicateType,
  PredicateCategory,
  PredicateCategorySchema,
  PredicateValue,
  PredicateValueSchema,
  ProductionPredicateType,
  RangeValue,
  RangeValueSchema,
  VerificationMethodSchema,
  WORKPROOF_PREDICATE_URIS,
  WORKPROOF_PREDICATES,
  WorkProofPredicateType,
  WorkProofPredicateTypeSchema,
} from './predicates';

// ─── WorkProof Core ──────────────────────────────────────────────────────────
export {
  CreateWorkProofInput,
  WorkProof,
  WorkProofClaim,
  WorkProofClaimSchema,
  WorkProofCredentialSubject,
  WorkProofCredentialSubjectSchema,
  WorkProofSchema,
  WorkProofType,
  WorkProofTypeSchema,
  WorkProofVerificationResult,
  createWorkProof,
  verifyWorkProof,
} from './workproof';

// ─── AI Validation ───────────────────────────────────────────────────────────
export {
  AIPredicateValidation,
  AIPredicateValidationSchema,
  ValidationAgent,
  ValidationAgentRole,
  ValidationAgentRoleSchema,
  ValidationAgentSchema,
  WorkProofAIValidationResult,
  WorkProofAIValidationResultSchema,
} from './ai';

// ─── TradeCV ─────────────────────────────────────────────────────────────────
export {
  CareerTrajectorySchema,
  CommunityStats,
  CommunityStatsSchema,
  ComplianceTierSchema,
  FinancialStats,
  FinancialStatsSchema,
  GCITrendSchema,
  LearningStats,
  LearningStatsSchema,
  NetworkPositionSchema,
  ProductionStats,
  ProductionStatsSchema,
  RiskProfileSchema,
  TradeCV,
  TradeCVAffiliation,
  TradeCVAffiliationSchema,
  TradeCVDerivedMetrics,
  TradeCVDerivedMetricsSchema,
  TradeCVPredictions,
  TradeCVPredictionsSchema,
  TradeCVProfile,
  TradeCVProfileSchema,
  TradeCVSchema,
  TradeCVSummary,
  TradeCVSummarySchema,
  TradeCVVisualRepresentation,
  TradeCVVisualRepresentationSchema,
} from './tradecv';

// ─── Disclosure ──────────────────────────────────────────────────────────────
export {
  DisclosureLevel,
  DisclosureLevelSchema,
  SelectiveDisclosureRequest,
  SelectiveDisclosureRequestSchema,
  SelectiveDisclosureResponse,
  SelectiveDisclosureResponseSchema,
  ThresholdClaim,
  ThresholdClaimSchema,
  ThresholdOperator,
  ThresholdOperatorSchema,
  ThresholdResult,
  ThresholdResultSchema,
} from './disclosure';

// ─── Offline ─────────────────────────────────────────────────────────────────
export {
  ConflictResolutionStrategySchema,
  OfflineMetadata,
  OfflineMetadataSchema,
  OfflineWorkProof,
  OfflineWorkProofSchema,
  SyncConflict,
  SyncConflictSchema,
  SyncQueueEntry,
  SyncQueueEntrySchema,
  SyncQueuePrioritySchema,
  SyncStatus,
  SyncStatusSchema,
} from './offline';

// ─── Trust Registry ──────────────────────────────────────────────────────────
export {
  AdmissionCriteria,
  AdmissionCriteriaSchema,
  IssuerTrustLevel,
  IssuerTrustLevelSchema,
  TrustRegistry,
  TrustRegistryEntry,
  TrustRegistryEntrySchema,
  TrustRegistrySchema,
} from './trust';
