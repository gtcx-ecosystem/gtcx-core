import type { CredentialType } from './primitives';
// ============================================================================
// PREDICATE FOUNDATION (per Predicate Architecture)
// ============================================================================

/**
 * Predicate URI structure
 * Format: tradepass://{domain}/{category}/{predicate}
 *
 * @example "tradepass://compliance/sanctions/status"
 * @example "tradepass://asset/origin/verified"
 */
export type PredicateURI = `tradepass://${string}/${string}/${string}`;

/**
 * Predicate domains - top-level namespaces
 */
export type PredicateDomain =
  | 'identity' // Person, organization, device verification
  | 'compliance' // Sanctions, PEP, AML, licensing, environmental, labor
  | 'asset' // Existence, origin, quality, custody, provenance
  | 'location' // Current, historical, residence, jurisdiction
  | 'relationship' // Entity relationships, authorization chains
  | 'temporal' // Time-based validity, expiration
  | 'financial' // Transaction capacity, credit status
  | 'entity' // Formal registration and recognition of legal entities
  | 'composite'; // Bundled verification requirements

/**
 * Predicate definition structure
 * Each predicate is a first-class entity, not just a string
 */
export interface PredicateDefinition {
  /** Unique predicate URI */
  uri: PredicateURI;
  /** Human-readable name */
  name: string;
  /** Description of what this predicate verifies */
  description: string;
  /** Domain this predicate belongs to */
  domain: PredicateDomain;
  /** Version for evolution */
  version: string;
  /** Schema for the predicate value */
  schema: PredicateSchema;
  /** Evidence requirements */
  evidence: EvidenceRequirements;
  /** Attestation rules */
  attestation: AttestationRules;
  /** Confidence scoring */
  confidence: ConfidenceRules;
  /** Temporal validity */
  temporal: TemporalRules;
  /** AI metadata for reasoning */
  ai: AIMetadata;
}

/**
 * Predicate value schema
 */
export interface PredicateSchema {
  type: 'boolean' | 'enum' | 'string' | 'number' | 'date' | 'object';
  values?: string[]; // For enum type
  min?: number; // For number type
  max?: number; // For number type
  pattern?: string; // For string type (regex)
  properties?: Record<string, PredicateSchema>; // For object type
}

/**
 * Evidence requirements for a predicate
 */
export interface EvidenceRequirements {
  required: EvidenceType[];
  optional?: EvidenceType[];
  alternatives?: EvidenceType[][]; // Any one of these sets is acceptable
}

/**
 * Evidence types
 */
export type EvidenceType =
  | 'government_id'
  | 'biometric_face'
  | 'biometric_fingerprint'
  | 'corporate_registry'
  | 'sanctions_screening'
  | 'site_audit'
  | 'assay_report'
  | 'photo_evidence'
  | 'gps_location'
  | 'document_hash'
  | 'witness_attestation'
  | 'biometric_attestation'
  | 'mining_license'
  | 'sovereign_registry_record'
  | 'cooperative_registry_record'
  | 'traceability_record'
  | 'regional_certification_record'
  | 'protocol_signatory_record'
  | 'price_feed_record'
  | 'conflict_screening_record'
  | 'satellite_imagery_record'
  | 'hardware_seal_record';

/**
 * Attestation rules
 */
export interface AttestationRules {
  allowedAttestors: AttestorPattern[];
  selfAttestation: boolean;
  multiSignatureRequired?: boolean;
  minimumAttestors?: number;
}

/**
 * Attestor pattern for matching
 */
export interface AttestorPattern {
  type: 'exact' | 'pattern' | 'credential';
  value: string; // DID or pattern like "did:tp:gov:*"
  credentialRequired?: CredentialType;
}

/**
 * Confidence scoring rules
 */
export interface ConfidenceRules {
  baseScore: number;
  evidenceWeights: Record<string, number>;
  minimumThreshold: number;
  decayModel?: 'linear' | 'exponential' | 'none';
  halfLife?: number; // In days, for decay
}

/**
 * Temporal validity rules
 */
export interface TemporalRules {
  validDuration: string; // ISO 8601 duration, e.g., "P1Y" for 1 year
  renewalRequired: boolean;
  monitoringType?: 'continuous' | 'periodic' | 'event_triggered';
  triggers?: string[]; // Events that trigger revalidation
}

/**
 * AI metadata for reasoning
 */
export interface AIMetadata {
  embeddingModel: string;
  reasoningHints: string[];
  relatedPredicates: PredicateURI[];
  contradictoryPredicates?: PredicateURI[];
  contextTemplate: string;
}

// ============================================================================
