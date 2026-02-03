"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracedCreateProofBundle = exports.tracedVerifyQRCode = exports.tracedGenerateQRCode = exports.tracedVerifyCertificate = exports.tracedGenerateCertificate = void 0;
exports.tracedVerificationWorkflow = tracedVerificationWorkflow;
exports.logComplianceEvent = logComplianceEvent;
exports.logGCICalculation = logGCICalculation;
exports.computeVerificationSummary = computeVerificationSummary;
const ai_1 = require("@gtcx/ai");
// Category loggers
const verificationLog = (0, ai_1.createCategoryLogger)('verification');
const complianceLog = (0, ai_1.createCategoryLogger)('compliance');
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
exports.tracedGenerateCertificate = (0, ai_1.traced)((_params) => __awaiter(void 0, void 0, void 0, function* () {
    // Implementation would call actual certificate generator
    // This is a placeholder showing the traced pattern
    throw new Error('Implementation required - import from certificates/generator');
}), 'verification.generateCertificate', {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: (input) => {
        var _a, _b;
        const args = input;
        const params = args[0];
        return {
            type: params === null || params === void 0 ? void 0 : params.type,
            securityLevel: params === null || params === void 0 ? void 0 : params.securityLevel,
            hasAssetData: !!(params === null || params === void 0 ? void 0 : params.assetData),
            claimCount: (_b = (_a = params === null || params === void 0 ? void 0 : params.claims) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0,
            // Never log private keys
            hasPrivateKey: !!(params === null || params === void 0 ? void 0 : params.privateKey),
        };
    },
    sanitizeOutput: (output) => {
        var _a;
        const cert = output;
        return {
            certificateId: cert === null || cert === void 0 ? void 0 : cert.certificateId,
            type: cert === null || cert === void 0 ? void 0 : cert.type,
            securityLevel: cert === null || cert === void 0 ? void 0 : cert.securityLevel,
            issuedAt: (_a = cert === null || cert === void 0 ? void 0 : cert.metadata) === null || _a === void 0 ? void 0 : _a.issuedAt,
        };
    },
});
/**
 * Verify a certificate with full tracing
 */
exports.tracedVerifyCertificate = (0, ai_1.traced)((_certificate) => __awaiter(void 0, void 0, void 0, function* () {
    // Implementation would call actual verifier
    throw new Error('Implementation required - import from certificates/generator');
}), 'verification.verifyCertificate', {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: (input) => {
        const args = input;
        const cert = args[0];
        return {
            certificateId: cert === null || cert === void 0 ? void 0 : cert.certificateId,
            type: cert === null || cert === void 0 ? void 0 : cert.type,
            securityLevel: cert === null || cert === void 0 ? void 0 : cert.securityLevel,
        };
    },
});
// ============================================================================
// TRACED QR CODE OPERATIONS
// ============================================================================
/**
 * Generate a QR code with tracing
 */
exports.tracedGenerateQRCode = (0, ai_1.traced)((_params) => __awaiter(void 0, void 0, void 0, function* () {
    throw new Error('Implementation required - import from qr/generator');
}), 'verification.generateQRCode', {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeOutput: (output) => {
        var _a;
        const qr = output;
        return {
            id: qr === null || qr === void 0 ? void 0 : qr.id,
            type: (_a = qr === null || qr === void 0 ? void 0 : qr.data) === null || _a === void 0 ? void 0 : _a.type,
            size: qr === null || qr === void 0 ? void 0 : qr.size,
        };
    },
});
/**
 * Verify a QR code with tracing
 */
exports.tracedVerifyQRCode = (0, ai_1.traced)((_qrData) => __awaiter(void 0, void 0, void 0, function* () {
    throw new Error('Implementation required - import from qr/generator');
}), 'verification.verifyQRCode', {
    category: 'verification',
    logInput: false, // QR data might contain sensitive info
    logOutput: true,
});
// ============================================================================
// TRACED PROOF BUNDLE OPERATIONS
// ============================================================================
/**
 * Create a proof bundle with tracing
 */
exports.tracedCreateProofBundle = (0, ai_1.traced)((_params) => __awaiter(void 0, void 0, void 0, function* () {
    throw new Error('Implementation required - import from proofs/bundler');
}), 'verification.createProofBundle', {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: (input) => {
        var _a, _b, _c, _d;
        const args = input;
        const params = args[0];
        return {
            type: params === null || params === void 0 ? void 0 : params.type,
            hasLocation: !!(params === null || params === void 0 ? void 0 : params.location),
            photoCount: (_b = (_a = params === null || params === void 0 ? void 0 : params.photoHashes) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0,
            hasCertificate: !!(params === null || params === void 0 ? void 0 : params.certificate),
            claimCount: (_d = (_c = params === null || params === void 0 ? void 0 : params.claims) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0,
        };
    },
    sanitizeOutput: (output) => {
        const bundle = output;
        return {
            id: bundle === null || bundle === void 0 ? void 0 : bundle.id,
            type: bundle === null || bundle === void 0 ? void 0 : bundle.type,
            hasCertificate: !!(bundle === null || bundle === void 0 ? void 0 : bundle.certificate),
            hasQRCode: !!(bundle === null || bundle === void 0 ? void 0 : bundle.qrCode),
        };
    },
});
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
function tracedVerificationWorkflow(workflow, workflowName, metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        verificationLog.info(`workflow.start`, Object.assign({ name: workflowName }, metadata));
        try {
            const result = yield (0, ai_1.withTrace)(workflow);
            verificationLog.info(`workflow.complete`, { name: workflowName });
            return result;
        }
        catch (error) {
            verificationLog.error(`workflow.failed`, error instanceof Error ? error : new Error(String(error)), { name: workflowName });
            throw error;
        }
    });
}
// ============================================================================
// COMPLIANCE LOGGING
// ============================================================================
/**
 * Log a compliance event for audit purposes
 */
function logComplianceEvent(event) {
    if (event.success) {
        complianceLog.info(event.type, Object.assign({ subjectId: event.subjectId, credentialType: event.credentialType, gciScore: event.gciScore }, event.metadata));
    }
    else {
        complianceLog.warn(event.type, Object.assign({ subjectId: event.subjectId, reason: event.reason }, event.metadata));
    }
}
/**
 * Log a GCI score calculation for audit
 */
function logGCICalculation(params) {
    complianceLog.info('gci.calculated', {
        subjectId: params.subjectId,
        scoreDelta: params.newScore - params.previousScore,
        newScore: params.newScore,
        factorCount: Object.keys(params.factors).length,
        trigger: params.trigger,
    });
}
/**
 * Compute verification analytics from operation logs
 */
function computeVerificationSummary(logs) {
    const verificationLogs = logs.filter(l => l.category === 'verification');
    const durations = verificationLogs
        .map(l => l.durationMs)
        .filter((d) => d !== null);
    const operationsByType = {};
    const errorsByType = {};
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
//# sourceMappingURL=traced.js.map