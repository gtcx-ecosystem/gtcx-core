import type { PredicateURI } from './predicates';
import type { CertificateType, CertificateSecurityLevel } from './primitives';
// ============================================================================
// CERTIFICATE TEMPLATE TYPES
// ============================================================================

/**
 * Validation rule for certificate fields
 */
export interface ValidationRule {
  field: string;
  min?: number | undefined;
  max?: number | undefined;
  value?: (boolean | string | number) | undefined;
  message: string;
}

/**
 * Certificate template definition
 */
export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  type: CertificateType;
  securityLevel: CertificateSecurityLevel;
  requiredFields: string[];
  optionalFields: string[];
  validationRules: ValidationRule[];
  /** Predicates that must be satisfied for this certificate */
  requiredPredicates?: PredicateURI[] | undefined;
}
