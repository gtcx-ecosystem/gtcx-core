import { type SignatureResult, type VerificationResult } from './signing';
/**
 * Sign a message with Ed25519 (traced)
 *
 * @description
 * Traced version of sign() that logs operation details for debugging
 * and AI analysis. Does NOT log the private key or full message content.
 *
 * @param message - Message to sign
 * @param privateKeyHex - Private key in hex format
 * @returns Signature in hex format
 */
export declare const tracedSign: (message: string | Uint8Array, privateKeyHex: string) => string;
/**
 * Sign a hash directly (traced)
 */
export declare const tracedSignHash: (hash: string, privateKeyHex: string) => string;
/**
 * Verify a signature (traced)
 *
 * @description
 * Traced version that logs verification attempts. Useful for debugging
 * failed verifications and analyzing verification patterns.
 */
export declare const tracedVerify: (message: string | Uint8Array, signatureHex: string, publicKeyHex: string) => boolean;
/**
 * Verify a signature against a hash (traced)
 */
export declare const tracedVerifyHash: (hashHex: string, signatureHex: string, publicKeyHex: string) => boolean;
/**
 * Create a complete signed message object (traced)
 */
export declare const tracedCreateSignedMessage: (data: unknown, privateKeyHex: string, publicKeyHex: string) => SignatureResult;
/**
 * Verify a signed message object (traced)
 */
export declare const tracedVerifySignedMessage: (signedMessage: SignatureResult) => VerificationResult;
/**
 * Batch verify multiple signatures (traced)
 */
export declare const tracedBatchVerify: (items: Array<{
    message: string | Uint8Array;
    signature: string;
    publicKey: string;
}>) => boolean[];
/**
 * Log a signing operation for audit purposes
 */
export declare function logSigningOperation(metadata: {
    operation: 'sign' | 'verify';
    publicKeyId?: string;
    success: boolean;
    context?: string;
}): void;
//# sourceMappingURL=traced.d.ts.map