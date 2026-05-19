// ============================================================================
// CERTIFICATE GENERATOR - UNIVERSAL (Platform-Agnostic)
// Generates certificate data structures
// Platform adapters handle storage and signing
// COMMODITY-AGNOSTIC ARCHITECTURE
// ============================================================================

import { randomUUID } from 'node:crypto';

import { hash256 } from '@gtcx/crypto';

import {
  migrateLegacyLotData,
  type Certificate,
  type StandardCertificate,
  type MilitaryGradeCertificate,
  type CertificateType,
  type CertificateMetadata,
  type CertificateLocation,
  type AssetLotData,
  type GoldLotData,
  type PhotoEvidenceRef,
  type ComplianceData,
  type EnvironmentalFactors,
  type ValidationMetrics,
  type ResourceContext,
  type GeologicalContext,
  type CommodityType,
  type CustodyEntry,
  type SettlementRecord,
} from '../types';

import { VerificationError } from './errors';
import { getEffectiveTemplate } from './templates';

export { VerificationError };

// ============================================================================
// CERTIFICATE ID GENERATION
// ============================================================================

/**
 * Generate unique certificate ID
 */
export function generateCertificateId(type: CertificateType, prefix: string = 'GH'): string {
  const typeCode = type.toUpperCase().replace(/-/g, '_');
  const timestamp = Date.now();
  const uuid = randomUUID().substring(0, 6).toUpperCase();
  return `${typeCode}_${prefix}_${timestamp}_${uuid}`;
}

// ============================================================================
// CERTIFICATE DATA CREATION
// ============================================================================

/**
 * Input for creating a certificate - COMMODITY-AGNOSTIC
 */
export interface CreateCertificateInput {
  templateId: string;
  location: CertificateLocation;
  userRole: string;
  deviceId: string;
  /** Primary: commodity-agnostic asset lot data */
  assetLotData?: AssetLotData | undefined;
  /** @deprecated Use assetLotData instead */
  goldLotData?: GoldLotData | undefined;
  /** Commodity type (optional, can be inferred from assetLotData) */
  commodityType?: CommodityType | undefined;
  photoHash?: string | undefined;
  photoEvidence?: PhotoEvidenceRef[] | undefined;
  workflowContext?: string | undefined;
  complianceData?: ComplianceData | undefined;
  custodyData?: CustodyEntry | undefined;
  settlementData?: SettlementRecord | undefined;
  /** Primary: commodity-agnostic resource context */
  resourceContext?: ResourceContext | undefined;
  /** @deprecated Use resourceContext instead */
  geologicalContext?: GeologicalContext | undefined;
  environmentalFactors?: EnvironmentalFactors | undefined;
  validationMetrics?: ValidationMetrics | undefined;
  expiresAt?: number | undefined;
}

/**
 * Normalize input to use new commodity-agnostic fields
 */
function normalizeInput(input: CreateCertificateInput): CreateCertificateInput {
  const normalized = { ...input };

  // Migrate legacy lot data to universal AssetLotData if needed
  if (input.goldLotData && !input.assetLotData) {
    normalized.assetLotData = migrateLegacyLotData(input.goldLotData, input.commodityType);
  }

  // Migrate geologicalContext to resourceContext if needed
  if (input.geologicalContext && !input.resourceContext) {
    const commodityType = normalized.assetLotData?.commodityType ?? 'gold';
    normalized.resourceContext = {
      commodityPotential: input.geologicalContext.goldPotential,
      commodityType,
      formation: input.geologicalContext.formation,
      confidence: input.geologicalContext.confidence,
    };
  }

  return normalized;
}

/**
 * Validate certificate input against template rules
 */
export function validateCertificateInput(input: CreateCertificateInput): {
  valid: boolean;
  errors: string[];
} {
  const normalizedInput = normalizeInput(input);
  const commodityType = normalizedInput.assetLotData?.commodityType;
  const template = getEffectiveTemplate(input.templateId, commodityType);
  const errors: string[] = [];

  // Check required fields
  for (const field of template.requiredFields) {
    const value = getNestedValue(normalizedInput, field);
    if (value === undefined || value === null) {
      errors.push(`Required field '${field}' is missing`);
    }
  }

  // Check validation rules
  for (const rule of template.validationRules) {
    const value = getNestedValue(normalizedInput, rule.field);

    if (value === undefined || value === null) continue;

    if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
      errors.push(rule.message);
    }

    if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
      errors.push(rule.message);
    }

    if (rule.value !== undefined && value !== rule.value) {
      errors.push(rule.message);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Create certificate metadata
 */
export function createCertificateMetadata(
  input: CreateCertificateInput,
  issuer: string = 'GTCX Verification System'
): CertificateMetadata {
  const normalizedInput = normalizeInput(input);

  return {
    issuer,
    issuedAt: Date.now(),
    expiresAt: normalizedInput.expiresAt,
    userRole: normalizedInput.userRole,
    deviceId: normalizedInput.deviceId,
    location: normalizedInput.location,
    resourceContext: normalizedInput.resourceContext,
    // Keep legacy for backwards compatibility
    geologicalContext: normalizedInput.geologicalContext,
    environmentalFactors:
      normalizedInput.environmentalFactors ?? createDefaultEnvironmentalFactors(),
    validationMetrics: normalizedInput.validationMetrics ?? createDefaultValidationMetrics(),
  };
}

/**
 * Create default environmental factors
 */
export function createDefaultEnvironmentalFactors(): EnvironmentalFactors {
  return {
    satelliteCount: 0,
    signalStrength: 0,
    atmosphericConditions: 'unknown',
    multipathIndicator: false,
  };
}

/**
 * Create default validation metrics
 */
export function createDefaultValidationMetrics(): ValidationMetrics {
  return {
    isJammed: false,
    isSpoofed: false,
    confidenceLevel: 0.5,
    integrityCheck: true,
  };
}

/**
 * Create a standard certificate structure (unsigned)
 * Caller must sign with appropriate crypto service
 */
export function createStandardCertificateData(
  input: CreateCertificateInput
): Omit<StandardCertificate, 'signature'> & { dataToSign: string } {
  const normalizedInput = normalizeInput(input);
  const commodityType = normalizedInput.assetLotData?.commodityType;
  const template = getEffectiveTemplate(normalizedInput.templateId, commodityType);

  const validation = validateCertificateInput(normalizedInput);
  if (!validation.valid) {
    throw new VerificationError(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const certificateId = generateCertificateId(template.type);
  const metadata = createCertificateMetadata(normalizedInput);

  // Create data hash - use commodity-agnostic field
  const dataToHash = {
    certificateId,
    type: template.type,
    metadata,
    assetLotData: normalizedInput.assetLotData,
    photoHash: normalizedInput.photoHash,
    photoEvidence: normalizedInput.photoEvidence,
    workflowContext: normalizedInput.workflowContext,
    complianceData: normalizedInput.complianceData,
    custodyData: normalizedInput.custodyData,
    settlementData: normalizedInput.settlementData,
  };

  const dataHash = hash256(JSON.stringify(dataToHash));
  const dataToSign = JSON.stringify({ certificateId, metadata, dataHash });

  return {
    certificateId,
    version: '1.0',
    type: template.type,
    securityLevel: template.securityLevel as 'standard' | 'enhanced',
    metadata,
    verificationData: {
      publicKey: '', // Caller must fill
      signature: '', // Caller must fill
      timestamp: Date.now(),
    },
    createdAt: Date.now(),
    dataHash,
    dataToSign,
  };
}

/**
 * Create a military-grade certificate structure (unsigned)
 * Caller must sign with multi-signature crypto service
 */
export function createMilitaryGradeCertificateData(input: CreateCertificateInput): Omit<
  MilitaryGradeCertificate,
  'multiSignature' | 'postQuantumHash'
> & {
  dataToSign: string;
  dataForPostQuantumHash: string;
} {
  const normalizedInput = normalizeInput(input);
  const commodityType = normalizedInput.assetLotData?.commodityType;
  const template = getEffectiveTemplate(normalizedInput.templateId, commodityType);

  if (!['military', 'post-quantum'].includes(template.securityLevel)) {
    throw new VerificationError(`Template '${normalizedInput.templateId}' is not military-grade`);
  }

  const validation = validateCertificateInput(normalizedInput);
  if (!validation.valid) {
    throw new VerificationError(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const certificateId = generateCertificateId(template.type, 'MIL');
  const metadata = createCertificateMetadata(
    normalizedInput,
    'GTCX Military-Grade Verification System'
  );

  // Use commodity-agnostic field
  const certificateData = {
    assetLotData: normalizedInput.assetLotData,
    // Keep legacy for backwards compatibility
    goldLotData: normalizedInput.goldLotData,
    photoHash: normalizedInput.photoHash,
    photoEvidence: normalizedInput.photoEvidence,
    workflowContext: normalizedInput.workflowContext,
    complianceData: normalizedInput.complianceData,
    custodyData: normalizedInput.custodyData,
    settlementData: normalizedInput.settlementData,
  };

  // Data for post-quantum hash
  const dataForPostQuantumHash = JSON.stringify({
    certificateId,
    metadata,
    certificateData,
  });

  // Data to sign (will include post-quantum hash after it's generated)
  const dataToSign = JSON.stringify({
    certificateId,
    metadata,
    // postQuantumHash will be added by caller
  });

  return {
    certificateId,
    version: '2.0',
    type: template.type,
    securityLevel: template.securityLevel as 'military' | 'post-quantum',
    metadata,
    certificateData,
    verificationData: {
      publicKey: '', // Caller must fill
      signature: '', // Caller must fill
      timestamp: Date.now(),
      entropyQuality: 0, // Caller must fill
    },
    createdAt: Date.now(),
    dataToSign,
    dataForPostQuantumHash,
  };
}

// ============================================================================
// CERTIFICATE VERIFICATION
// ============================================================================

/**
 * Verify certificate structure (without cryptographic verification)
 * Cryptographic verification must be done by platform-specific code
 */
export function verifyCertificateStructure(certificate: Certificate): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Basic field checks
  if (!certificate.certificateId) {
    errors.push('Missing certificate ID');
  }

  if (!certificate.version) {
    errors.push('Missing version');
  }

  if (!certificate.type) {
    errors.push('Missing type');
  }

  if (!certificate.metadata) {
    errors.push('Missing metadata');
  } else {
    if (!certificate.metadata.issuer) errors.push('Missing issuer');
    if (!certificate.metadata.issuedAt) errors.push('Missing issuedAt');
    if (!certificate.metadata.location) errors.push('Missing location');
  }

  if (!certificate.verificationData) {
    errors.push('Missing verification data');
  } else {
    if (!certificate.verificationData.publicKey) errors.push('Missing public key');
    if (!certificate.verificationData.signature) errors.push('Missing signature');
  }

  // Expiration check
  if (certificate.metadata?.expiresAt && certificate.metadata.expiresAt < Date.now()) {
    errors.push('Certificate has expired');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Check if certificate is expired
 */
export function isCertificateExpired(certificate: Certificate): boolean {
  if (!certificate.metadata?.expiresAt) return false;
  return certificate.metadata.expiresAt < Date.now();
}

/**
 * Get certificate age in milliseconds
 */
export function getCertificateAge(certificate: Certificate): number {
  return Date.now() - certificate.createdAt;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Format certificate for display
 */
export function formatCertificateForDisplay(certificate: Certificate): {
  id: string;
  type: string;
  securityLevel: string;
  issued: string;
  expires: string | null;
  location: string;
  issuer: string;
  commodityType?: string | undefined;
} {
  const { metadata } = certificate;

  // Try to get commodity type from certificate data
  let commodityType: string | undefined;
  if ('certificateData' in certificate) {
    const milCert = certificate as MilitaryGradeCertificate;
    commodityType = milCert.certificateData?.assetLotData?.commodityType;
  }

  return {
    id: certificate.certificateId,
    type: certificate.type,
    securityLevel: certificate.securityLevel,
    issued: new Date(metadata.issuedAt).toISOString(),
    expires: metadata.expiresAt ? new Date(metadata.expiresAt).toISOString() : null,
    location: `${metadata.location.latitude.toFixed(6)}, ${metadata.location.longitude.toFixed(6)}`,
    issuer: metadata.issuer,
    commodityType,
  };
}

/**
 * Extract commodity type from certificate
 */
export function getCertificateCommodityType(certificate: Certificate): CommodityType | undefined {
  if ('certificateData' in certificate) {
    const milCert = certificate as MilitaryGradeCertificate;
    return milCert.certificateData?.assetLotData?.commodityType;
  }
  return undefined;
}
