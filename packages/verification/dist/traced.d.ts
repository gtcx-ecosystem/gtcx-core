import { type OperationLog } from '@gtcx/ai';
import type { Certificate, MilitaryGradeCertificate, StandardCertificate, CertificateVerificationResult, GeneratedQRCode, QRCodeVerificationResult, ProofBundle, CertificateType, CertificateSecurityLevel, AssetLotData, CertificateLocation, Claim } from './types';
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
/**
 * Generate a certificate with full tracing
 *
 * @description
 * Creates a verification certificate with complete operation logging.
 * All inputs and outputs are logged (with sensitive data sanitized)
 * for audit and AI training purposes.
 */
export declare const tracedGenerateCertificate: (_params: GenerateCertificateInput) => Promise<MilitaryGradeCertificate | StandardCertificate>;
/**
 * Verify a certificate with full tracing
 */
export declare const tracedVerifyCertificate: (_certificate: Certificate) => Promise<CertificateVerificationResult>;
/**
 * Generate a QR code with tracing
 */
export declare const tracedGenerateQRCode: (_params: GenerateQRCodeInput) => Promise<GeneratedQRCode>;
/**
 * Verify a QR code with tracing
 */
export declare const tracedVerifyQRCode: (_qrData: string) => Promise<QRCodeVerificationResult>;
/**
 * Create a proof bundle with tracing
 */
export declare const tracedCreateProofBundle: (_params: CreateProofBundleInput) => Promise<ProofBundle>;
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
export declare function tracedVerificationWorkflow<T>(workflow: () => Promise<T>, workflowName: string, metadata?: Record<string, unknown>): Promise<T>;
/**
 * Log a compliance event for audit purposes
 */
export declare function logComplianceEvent(event: {
    type: 'verification_requested' | 'verification_completed' | 'verification_failed' | 'claim_issued' | 'claim_revoked';
    subjectId: string;
    credentialType?: string;
    gciScore?: number;
    success: boolean;
    reason?: string;
    metadata?: Record<string, unknown>;
}): void;
/**
 * Log a GCI score calculation for audit
 */
export declare function logGCICalculation(params: {
    subjectId: string;
    previousScore: number;
    newScore: number;
    factors: Record<string, number>;
    trigger: string;
}): void;
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
export declare function computeVerificationSummary(logs: OperationLog[]): VerificationSummary;
export {};
//# sourceMappingURL=traced.d.ts.map