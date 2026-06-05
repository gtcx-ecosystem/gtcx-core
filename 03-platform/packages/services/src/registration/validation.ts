/**
 * Registration validation logic — schema + business rules.
 */

import { AssetRegistrationDataSchema, safeParse, type ValidationResult } from '@gtcx/domain';

import { ValidationError } from './types';
import type { RegistrationConfig } from './types';

export function validateRegistrationData(
  data: unknown,
  config: RegistrationConfig
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Schema validation
  const schemaResult = safeParse(AssetRegistrationDataSchema, data);
  if (!schemaResult.success) {
    return {
      isValid: false,
      errors: schemaResult.error.issues.map((issue) => issue.message),
      warnings: [],
    };
  }

  const validData = schemaResult.data;

  // Business rule validation

  // GPS accuracy check
  if (
    validData.discoveryLocation.accuracy &&
    validData.discoveryLocation.accuracy > config.minGpsAccuracy
  ) {
    errors.push(
      `GPS accuracy (${validData.discoveryLocation.accuracy}m) exceeds maximum allowed (${config.minGpsAccuracy}m)`
    );
  }

  // Photo count check
  if (validData.photos.length < config.minPhotos) {
    errors.push(`Minimum ${config.minPhotos} photos required, got ${validData.photos.length}`);
  }

  if (validData.photos.length > config.maxPhotos) {
    errors.push(`Maximum ${config.maxPhotos} photos allowed, got ${validData.photos.length}`);
  }

  // Discovery age check
  if (validData.discoveryDate) {
    const discoveryDate = new Date(validData.discoveryDate);
    const maxAge = config.maxDiscoveryAgeDays * 24 * 60 * 60 * 1000;
    const age = Date.now() - discoveryDate.getTime();

    if (age > maxAge) {
      errors.push(`Discovery date exceeds maximum age of ${config.maxDiscoveryAgeDays} days`);
    }
  }

  // Weight validation with warnings
  if (validData.estimatedWeight > 10000) {
    warnings.push('Large weight detected - consider verification by multiple parties');
  }

  // Purity warnings
  if (validData.purity && validData.purity > 99) {
    warnings.push('Very high purity claimed - lab verification recommended');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export interface ValidationContext {
  commodityType: string;
  producerId: string;
  sessionId: string;
}

export function createValidationError(messages: string[]): ValidationError {
  return new ValidationError(`Validation failed: ${messages.join(', ')}`);
}

export function createBusinessValidationError(errors: string[]): ValidationError {
  return new ValidationError(`Business validation failed: ${errors.join(', ')}`);
}
