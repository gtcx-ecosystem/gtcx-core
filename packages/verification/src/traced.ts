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

import { traced, withTrace, createCategoryLogger, type OperationLog } from '@gtcx/ai';
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
} from './types';

// Category loggers
const verificationLog = createCategoryLogger('verification');
const complianceLog = createCategoryLogger('compliance');

// ============================================================================
// TYPE HELPERS FOR SANITIZERS
// ============================================================================

// Input types for sanitizer type assertions
interface GenerateCertificateInput {
  type: CertificateType;
  securityLevel: CertificateSecurityLevel;
  location: CertificateLocation;
  assetData?: AssetLotData;
  claims?: Claim[];
  privateKey: string;
  publicKey: string;
}

interface GenerateQRCodeInput {
  certificateId: string;
  type: 'location' | 'photo' | 'certificate' | 'asset-lot';
  metadata?: Record<string, unknown>;
}

interface CreateProofBundleInput {
  type: 'location' | 'photo' | 'workflow' | 'certificate';
  location?: CertificateLocation;
  photoHashes?: string[];
  certificate?: Certificate;
  claims?: Claim[];
}

// ============================================================================
// TRACED CERTIFICATE OPERATIONS
// ============================================================================

/**
 * Generate a certificate with full tracing
 * 
 * @description
 * Creates a verification certificate with complete operation logging.
 * All inputs and outputs are logged (with sensitive data sanitized)
 * for audit and AI training purposes.
 */
export const tracedGenerateCertificate = traced(
  async (_params: GenerateCertificateInput): Promise<MilitaryGradeCertificate | StandardCertificate> => {
    // Implementation would call actual certificate generator
    // This is a placeholder showing the traced pattern
    throw new Error('Implementation required - import from certificates/generator');
  },
  'verification.generateCertificate',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: (input: unknown) => {
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
    },
    sanitizeOutput: (output: unknown) => {
      const cert = output as Certificate;
      return {
        certificateId: cert?.certificateId,
        type: cert?.type,
        securityLevel: cert?.securityLevel,
        issuedAt: cert?.metadata?.issuedAt,
      };
    },
  }
);

/**
 * Verify a certificate with full tracing
 */
export const tracedVerifyCertificate = traced(
  async (_certificate: Certificate): Promise<CertificateVerificationResult> => {
    // Implementation would call actual verifier
    throw new Error('Implementation required - import from certificates/generator');
  },
  'verification.verifyCertificate',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: (input: unknown) => {
      const args = input as Certificate[];
      const cert = args[0];
      return {
        certificateId: cert?.certificateId,
        type: cert?.type,
        securityLevel: cert?.securityLevel,
      };
    },
  }
);

// ============================================================================
// TRACED QR CODE OPERATIONS
// ============================================================================

/**
 * Generate a QR code with tracing
 */
export const tracedGenerateQRCode = traced(
  async (_params: GenerateQRCodeInput): Promise<GeneratedQRCode> => {
    throw new Error('Implementation required - import from qr/generator');
  },
  'verification.generateQRCode',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeOutput: (output: unknown) => {
      const qr = output as GeneratedQRCode;
      return {
        id: qr?.id,
        type: qr?.data?.type,
        size: qr?.size,
      };
    },
  }
);

/**
 * Verify a QR code with tracing
 */
export const tracedVerifyQRCode = traced(
  async (_qrData: string): Promise<QRCodeVerificationResult> => {
    throw new Error('Implementation required - import from qr/generator');
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
  async (_params: CreateProofBundleInput): Promise<ProofBundle> => {
    throw new Error('Implementation required - import from proofs/bundler');
  },
  'verification.createProofBundle',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: (input: unknown) => {
      const args = input as CreateProofBundleInput[];
      const params = args[0];
      return {
        type: params?.type,
        hasLocation: !!params?.location,
        photoCount: params?.photoHashes?.length ?? 0,
        hasCertificate: !!params?.certificate,
        claimCount: params?.claims?.length ?? 0,
      };
    },
    sanitizeOutput: (output: unknown) => {
      const bundle = output as ProofBundle;
      return {
        id: bundle?.id,
        type: bundle?.type,
        hasCertificate: !!bundle?.certificate,
        hasQRCode: !!bundle?.qrCode,
      };
    },
  }
);

// ============================================================================
// WORKFLOW TRACING
// ============================================================================

/**
 * Execute a complete verification workflow with correlated tracing
 * 
 * @description
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
    verificationLog.error(
      `workflow.failed`,
      error instanceof Error ? error : new Error(String(error)),
      { name: workflowName }
    );
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
  type: 'verification_requested' | 'verification_completed' | 'verification_failed' | 'claim_issued' | 'claim_revoked';
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

/**
 * Compute verification analytics from operation logs
 */
export function computeVerificationSummary(logs: OperationLog[]): VerificationSummary {
  const verificationLogs = logs.filter(l => l.category === 'verification');
  
  const durations = verificationLogs
    .map(l => l.durationMs)
    .filter((d): d is number => d !== null);

  const operationsByType: Record<string, number> = {};
  const errorsByType: Record<string, number> = {};

  verificationLogs.forEach(log => {
    const type = log.type.split('.').pop() || 'unknown';
    operationsByType[type] = (operationsByType[type] || 0) + 1;
    
    if (!log.success && log.error) {
      const errorType = log.error.name;
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
    }
  });

  return {
    totalOperations: verificationLogs.length,
    successfulVerifications: verificationLogs.filter(l => l.success).length,
    failedVerifications: verificationLogs.filter(l => !l.success).length,
    averageLatencyMs: durations.length > 0 
      ? durations.reduce((a, b) => a + b, 0) / durations.length 
      : 0,
    operationsByType,
    errorsByType,
  };
}
