// ============================================================================
// TRACED VERIFICATION OPERATIONS
// Certificate generation, QR codes, and proofs with operation logging
// ============================================================================
//
// AI-native verification operations that log all operations for:
// - Debugging verification workflows
// - Training compliance AI models
// - Audit trails for regulatory reporting
// - Performance analysis
// ============================================================================

import { hash256, sign, verify } from '@gtcx/crypto';

import {
  createMilitaryGradeCertificateData,
  createStandardCertificateData,
  verifyCertificateStructure,
} from './certificates/generator.js';
import {
  createCryptographicProofRef,
  createLocationProof,
  createPhotoProof,
  createProofBundle,
} from './proofs/bundler.js';
import {
  createAssetLotQRData,
  createCertificateQRData,
  createLocationQRData,
  createPhotoQRData,
  createQRCodeStructure,
  verifyQRCodeData,
} from './qr/generator.js';
import { traced, withTrace, createCategoryLogger } from './tracing.js';
import type {
  Certificate,
  MilitaryGradeCertificate,
  StandardCertificate,
  CertificateVerificationResult,
  GeneratedQRCode,
  QRCodeVerificationResult,
  ProofBundle,
  CertificateType,
  CertificateSecurityLevel,
  AssetLotData,
  CertificateLocation,
  Claim,
  CommodityType,
  MeasurementUnit,
  OperatorRole,
} from './types';

// Category loggers
const verificationLog = createCategoryLogger('verification');
const complianceLog = createCategoryLogger('compliance');

// ============================================================================
// TYPE HELPERS FOR SANITIZERS
// ============================================================================

// Input types for sanitizer type assertions
export interface GenerateCertificateInput {
  type: CertificateType;
  securityLevel: CertificateSecurityLevel;
  location: CertificateLocation;
  assetData?: AssetLotData;
  claims?: Claim[];
  privateKey: string;
  publicKey: string;
}

export interface GenerateQRCodeInput {
  certificateId: string;
  type: 'location' | 'photo' | 'certificate' | 'asset-lot';
  metadata?: Record<string, unknown> | undefined;
  size?: number | undefined;
}

interface QRMetadataInput {
  hash?: string | undefined;
  photoHash?: string | undefined;
  location?: { latitude: number; longitude: number } | undefined;
  assetWeight?: number | undefined;
  assetUnit?: MeasurementUnit | undefined;
  purity?: number | undefined;
  commodityType?: CommodityType | undefined;
  producerId?: string | undefined;
  operatorRole?: OperatorRole | undefined;
}

export interface CreateProofBundleInput {
  type: 'location' | 'photo' | 'workflow' | 'certificate';
  location?: CertificateLocation | undefined;
  photoHashes?: string[] | undefined;
  certificate?: Certificate | undefined;
  claims?: Claim[] | undefined;
}

// ============================================================================
// SANITIZER FUNCTIONS
// Extracted for independent unit testing and to keep traced() calls readable.
// ============================================================================

export function sanitizeGenerateCertificateInput(input: unknown): Record<string, unknown> {
  const args = input as GenerateCertificateInput[];
  const params = args[0];
  return {
    type: params?.type,
    securityLevel: params?.securityLevel,
    hasAssetData: !!params?.assetData,
    claimCount: params?.claims?.length ?? 0,
    // Never log private keys
    hasPrivateKey: !!params?.privateKey,
  };
}

export function sanitizeGenerateCertificateOutput(output: unknown): Record<string, unknown> {
  const cert = output as Certificate;
  return {
    certificateId: cert?.certificateId,
    type: cert?.type,
    securityLevel: cert?.securityLevel,
    issuedAt: cert?.metadata?.issuedAt,
  };
}

export function sanitizeVerifyCertificateInput(input: unknown): Record<string, unknown> {
  const args = input as Certificate[];
  const cert = args[0];
  return {
    certificateId: cert?.certificateId,
    type: cert?.type,
    securityLevel: cert?.securityLevel,
  };
}

export function sanitizeGenerateQRCodeOutput(output: unknown): Record<string, unknown> {
  const qr = output as GeneratedQRCode;
  return {
    id: qr?.id,
    type: qr?.data?.type,
    size: qr?.size,
  };
}

export function sanitizeCreateProofBundleInput(input: unknown): Record<string, unknown> {
  const args = input as CreateProofBundleInput[];
  const params = args[0];
  return {
    type: params?.type,
    hasLocation: !!params?.location,
    photoCount: params?.photoHashes?.length ?? 0,
    hasCertificate: !!params?.certificate,
    claimCount: params?.claims?.length ?? 0,
  };
}

export function sanitizeCreateProofBundleOutput(output: unknown): Record<string, unknown> {
  const bundle = output as ProofBundle;
  return {
    id: bundle?.id,
    type: bundle?.type,
    hasCertificate: !!bundle?.certificate,
    hasQRCode: !!bundle?.qrCode,
  };
}

// ============================================================================
// TRACED CERTIFICATE OPERATIONS
// ============================================================================

/**
 * Generate a certificate with full tracing
 *
 * Creates a verification certificate with complete operation logging.
 * All inputs and outputs are logged (with sensitive data sanitized)
 * for audit and AI training purposes.
 */
export const tracedGenerateCertificate = traced(
  async (
    params: GenerateCertificateInput
  ): Promise<MilitaryGradeCertificate | StandardCertificate> => {
    const certInput = {
      templateId: params.type,
      location: params.location,
      userRole: params.assetData?.operatorRole ?? 'operator',
      deviceId: 'traced-verification',
      assetLotData: params.assetData,
      complianceData: params.claims ? { claims: params.claims } : undefined,
    };

    const shouldUseMilitary =
      params.securityLevel === 'military' || params.securityLevel === 'post-quantum';

    if (shouldUseMilitary) {
      const unsigned = createMilitaryGradeCertificateData(certInput);
      const postQuantumHash = hash256(unsigned.dataForPostQuantumHash);
      const dataToSign = JSON.stringify({
        certificateId: unsigned.certificateId,
        metadata: unsigned.metadata,
        postQuantumHash,
      });
      const ed25519Signature = sign(dataToSign, params.privateKey);
      const certificate = { ...unsigned };
      delete (certificate as { dataToSign?: string }).dataToSign;
      delete (certificate as { dataForPostQuantumHash?: string }).dataForPostQuantumHash;

      return {
        ...certificate,
        postQuantumHash,
        multiSignature: {
          ed25519: ed25519Signature,
        },
        verificationData: {
          ...certificate.verificationData,
          publicKey: params.publicKey,
          signature: ed25519Signature,
          entropyQuality: 1,
        },
        certificateData: {
          ...certificate.certificateData,
          claims: params.claims,
        },
      };
    }

    const unsigned = createStandardCertificateData(certInput);
    const signature = sign(unsigned.dataToSign, params.privateKey);
    const certificate = { ...unsigned };
    delete (certificate as { dataToSign?: string }).dataToSign;

    return {
      ...certificate,
      signature,
      verificationData: {
        ...certificate.verificationData,
        publicKey: params.publicKey,
        signature,
      },
    };
  },
  'verification.generateCertificate',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: sanitizeGenerateCertificateInput,
    sanitizeOutput: sanitizeGenerateCertificateOutput,
  }
);

/**
 * Verify a certificate with full tracing
 */
export const tracedVerifyCertificate = traced(
  async (certificate: Certificate): Promise<CertificateVerificationResult> => {
    const structure = verifyCertificateStructure(certificate);
    const now = Date.now();

    const hashValid =
      'dataHash' in certificate
        ? Boolean(certificate.dataHash)
        : 'postQuantumHash' in certificate
          ? Boolean(certificate.postQuantumHash)
          : false;

    // Require a cryptographic signature on every certificate variant.
    let signatureValid = false;
    let cryptoVerified = false;
    const { publicKey, signature: sig } = certificate.verificationData ?? {};
    if (publicKey && sig) {
      let dataToSign: string | null = null;

      if ('dataHash' in certificate && certificate.dataHash) {
        dataToSign = JSON.stringify({
          certificateId: certificate.certificateId,
          metadata: certificate.metadata,
          dataHash: certificate.dataHash,
        });
      } else if ('postQuantumHash' in certificate && certificate.postQuantumHash) {
        dataToSign = JSON.stringify({
          certificateId: certificate.certificateId,
          metadata: certificate.metadata,
          postQuantumHash: certificate.postQuantumHash,
        });
      }

      if (dataToSign) {
        try {
          signatureValid = verify(dataToSign, sig, publicKey);
          cryptoVerified = true;
        } catch {
          signatureValid = false;
          cryptoVerified = true;
        }
      }
    }
    const timestampValid =
      certificate.metadata.issuedAt <= now &&
      certificate.verificationData.timestamp <= now &&
      certificate.createdAt <= now;
    const notExpired = !certificate.metadata.expiresAt || certificate.metadata.expiresAt > now;

    const isValid = structure.valid && hashValid && signatureValid && timestampValid && notExpired;
    const passedChecks = [hashValid, signatureValid, timestampValid, notExpired].filter(
      Boolean
    ).length;
    const confidence = passedChecks / 4;
    const details = isValid
      ? `Certificate passed ${cryptoVerified ? 'cryptographic' : 'structural'} and temporal checks`
      : `Certificate validation failed: ${structure.errors.join(', ') || 'one or more checks failed'}`;

    return {
      isValid,
      certificate,
      confidence,
      details,
      checks: {
        hashValid,
        signatureValid,
        timestampValid,
        notExpired,
      },
    };
  },
  'verification.verifyCertificate',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: sanitizeVerifyCertificateInput,
  }
);

// ============================================================================
// TRACED QR CODE OPERATIONS
// ============================================================================

/**
 * Generate a QR code with tracing
 */
export const tracedGenerateQRCode = traced(
  async (params: GenerateQRCodeInput): Promise<GeneratedQRCode> => {
    const metadata = (params.metadata ?? {}) as QRMetadataInput;
    const hash = metadata.hash ?? hash256(JSON.stringify({ certificateId: params.certificateId }));
    const location = metadata.location ?? { latitude: 0, longitude: 0 };

    const qrData =
      params.type === 'location'
        ? createLocationQRData(params.certificateId, location, hash)
        : params.type === 'photo'
          ? createPhotoQRData(params.certificateId, metadata.photoHash ?? hash, location)
          : params.type === 'asset-lot'
            ? createAssetLotQRData(
                params.certificateId,
                {
                  weight: metadata.assetWeight ?? 0,
                  unit: metadata.assetUnit,
                  purity: metadata.purity,
                  commodityType: metadata.commodityType ?? 'other',
                  producerId: metadata.producerId,
                  operatorRole: metadata.operatorRole,
                  location,
                },
                hash
              )
            : createCertificateQRData(
                {
                  certificateId: params.certificateId,
                  issuedAt: Date.now(),
                  location,
                  assetLotData:
                    metadata.assetWeight !== undefined ||
                    metadata.assetUnit !== undefined ||
                    metadata.purity !== undefined ||
                    metadata.commodityType !== undefined
                      ? {
                          estimatedWeight: metadata.assetWeight,
                          unit: metadata.assetUnit,
                          purity: metadata.purity,
                          commodityType: metadata.commodityType,
                          producerId: metadata.producerId,
                          operatorRole: metadata.operatorRole,
                        }
                      : undefined,
                },
                hash
              );

    const generated = createQRCodeStructure(qrData, params.size);
    const qrCodeUri = `data:application/json;base64,${Buffer.from(generated.dataString).toString('base64')}`;

    return { ...generated, qrCodeUri };
  },
  'verification.generateQRCode',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeOutput: sanitizeGenerateQRCodeOutput,
  }
);

/**
 * Verify a QR code with tracing
 */
export const tracedVerifyQRCode = traced(
  async (qrData: string): Promise<QRCodeVerificationResult> => {
    return verifyQRCodeData(qrData);
  },
  'verification.verifyQRCode',
  {
    category: 'verification',
    logInput: false, // QR data might contain sensitive info
    logOutput: true,
  }
);

// ============================================================================
// TRACED PROOF BUNDLE OPERATIONS
// ============================================================================

/**
 * Create a proof bundle with tracing
 */
export const tracedCreateProofBundle = traced(
  async (params: CreateProofBundleInput): Promise<ProofBundle> => {
    const timestamp = Date.now();
    const payloadHash = hash256(
      JSON.stringify({
        type: params.type,
        location: params.location,
        photoHashes: params.photoHashes,
        certificateId: params.certificate?.certificateId,
        timestamp,
      })
    );
    const signature = hash256(`${payloadHash}:traced-proof-signature`);
    const publicKey = params.certificate?.verificationData.publicKey ?? 'traced-public-key';

    const cryptographicProof = createCryptographicProofRef(payloadHash, signature, publicKey);
    const locationProof = params.location
      ? createLocationProof({
          coordinates: params.location,
          signature,
          publicKey,
        })
      : undefined;
    const photoProofs = params.photoHashes?.map((photoHash, index) =>
      createPhotoProof({
        uri: `photo://${index}`,
        fileHash: photoHash,
        timestamp,
      })
    );

    const bundle = createProofBundle({
      type: params.type,
      cryptographicProof,
      locationProof,
      photoProofs,
      certificate: params.certificate,
    });

    return params.claims && params.claims.length > 0
      ? { ...bundle, claims: params.claims }
      : bundle;
  },
  'verification.createProofBundle',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: sanitizeCreateProofBundleInput,
    sanitizeOutput: sanitizeCreateProofBundleOutput,
  }
);

// ============================================================================
// WORKFLOW TRACING
// ============================================================================

/**
 * Execute a complete verification workflow with correlated tracing
 *
 * Wraps an entire verification workflow so all operations share
 * the same trace ID. This enables:
 * - End-to-end latency tracking
 * - Workflow visualization
 * - Failure analysis
 *
 * @example
 * ```typescript
 * const result = await tracedVerificationWorkflow(async () => {
 *   const location = await captureLocation();
 *   const photos = await capturePhotos();
 *   const certificate = await generateCertificate({...});
 *   const qr = await generateQRCode({...});
 *   return { certificate, qr };
 * }, 'origin-verification');
 * ```
 */
export async function tracedVerificationWorkflow<T>(
  workflow: () => Promise<T>,
  workflowName: string,
  metadata?: Record<string, unknown>
): Promise<T> {
  verificationLog.info(`workflow.start`, { name: workflowName, ...metadata });

  try {
    const result = await withTrace(workflow);
    verificationLog.info(`workflow.complete`, { name: workflowName });
    return result;
  } catch (error) {
    verificationLog.error(`workflow.failed`, {
      error: error instanceof Error ? error.message : String(error),
      name: workflowName,
    });
    throw error;
  }
}

// ============================================================================
// COMPLIANCE LOGGING
// ============================================================================

/**
 * Log a compliance event for audit purposes
 */
export function logComplianceEvent(event: {
  type:
    | 'verification_requested'
    | 'verification_completed'
    | 'verification_failed'
    | 'claim_issued'
    | 'claim_revoked';
  subjectId: string;
  credentialType?: string;
  gciScore?: number;
  success: boolean;
  reason?: string;
  metadata?: Record<string, unknown>;
}): void {
  if (event.success) {
    complianceLog.info(event.type, {
      subjectId: event.subjectId,
      credentialType: event.credentialType,
      gciScore: event.gciScore,
      ...event.metadata,
    });
  } else {
    complianceLog.warn(event.type, {
      subjectId: event.subjectId,
      reason: event.reason,
      ...event.metadata,
    });
  }
}

/**
 * Log a GCI score calculation for audit
 */
export function logGCICalculation(params: {
  subjectId: string;
  previousScore: number;
  newScore: number;
  factors: Record<string, number>;
  trigger: string;
}): void {
  complianceLog.info('gci.calculated', {
    subjectId: params.subjectId,
    scoreDelta: params.newScore - params.previousScore,
    newScore: params.newScore,
    factorCount: Object.keys(params.factors).length,
    trigger: params.trigger,
  });
}

// ============================================================================
// VERIFICATION ANALYTICS
// ============================================================================

/**
 * Verification operation summary for analytics
 */
export interface VerificationSummary {
  totalOperations: number;
  successfulVerifications: number;
  failedVerifications: number;
  averageLatencyMs: number;
  operationsByType: Record<string, number>;
  errorsByType: Record<string, number>;
}

export interface VerificationOperationLog<TInput = unknown, TOutput = unknown> {
  operationName: string;
  type: string;
  category?: string;
  input?: TInput;
  output?: TOutput;
  duration?: number;
  durationMs?: number | null;
  timestamp: number;
  success?: boolean;
  error?: { name: string; message: string; stack?: string };
  metadata?: Record<string, unknown>;
}

/**
 * Compute verification analytics from operation logs
 */
export function computeVerificationSummary(logs: VerificationOperationLog[]): VerificationSummary {
  const verificationLogs = logs.filter((l) => l.category === 'verification');

  const durations = verificationLogs
    .map((l) => l.durationMs)
    .filter((d): d is number => typeof d === 'number');

  const operationsByType: Record<string, number> = {};
  const errorsByType: Record<string, number> = {};

  verificationLogs.forEach((log) => {
    const type = log.type.split('.').pop() || 'unknown';
    operationsByType[type] = (operationsByType[type] || 0) + 1;

    if (!log.success && log.error) {
      const errorType = log.error.name;
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
    }
  });

  return {
    totalOperations: verificationLogs.length,
    successfulVerifications: verificationLogs.filter((l) => l.success).length,
    failedVerifications: verificationLogs.filter((l) => !l.success).length,
    averageLatencyMs:
      durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
    operationsByType,
    errorsByType,
  };
}
