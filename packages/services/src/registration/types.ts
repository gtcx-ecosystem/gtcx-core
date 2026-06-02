/**
 * Registration domain types and constants.
 */

import type { WorkflowStep } from '@gtcx/domain';

/** Service validation error. Shared across all GTCX services. */
export class ValidationError extends Error {
  readonly service: string;
  constructor(message: string, options?: { cause?: unknown; service?: string }) {
    super(message, options);
    this.name = 'ValidationError';
    this.service = options?.service ?? 'registration';
  }
}

export interface RegistrationConfig {
  /** Minimum GPS accuracy required in meters */
  minGpsAccuracy: number;
  /** Minimum photos required */
  minPhotos: number;
  /** Maximum photos allowed */
  maxPhotos: number;
  /** Maximum age of discovery in days */
  maxDiscoveryAgeDays: number;
  /** Custom workflow steps (optional override) */
  workflowSteps?: WorkflowStep[] | undefined;
  /** Required photo categories */
  requiredPhotoCategories?: string[] | undefined;
  /** Verification endpoint base URL */
  verifyBaseUrl?: string | undefined;
}

const DEFAULT_VERIFY_URL = process.env['GTCX_VERIFY_URL'] || 'https://verify.gtcx.trade';

export const DEFAULT_CONFIG: RegistrationConfig = {
  minGpsAccuracy: 10,
  minPhotos: 2,
  maxPhotos: 10,
  maxDiscoveryAgeDays: 30,
  verifyBaseUrl: DEFAULT_VERIFY_URL,
};
