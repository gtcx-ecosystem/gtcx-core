export interface SignatureResult {
    signature: string;
    publicKey: string;
    message: string;
    timestamp: number;
}
export interface VerificationResult {
    valid: boolean;
    publicKey: string;
    error?: string;
}
/**
 * Sign a message with Ed25519
 */
export declare function sign(message: string | Uint8Array, privateKeyHex: string): string;
/**
 * Sign a hash directly
 */
export declare function signHash(hash: string, privateKeyHex: string): string;
/**
 * Verify a signature
 */
export declare function verify(message: string | Uint8Array, signatureHex: string, publicKeyHex: string): boolean;
/**
 * Verify a signature against a hash
 */
export declare function verifyHash(hashHex: string, signatureHex: string, publicKeyHex: string): boolean;
/**
 * Create a complete signed message object
 */
export declare function createSignedMessage(data: unknown, privateKeyHex: string, publicKeyHex: string): SignatureResult;
/**
 * Verify a signed message object
 */
export declare function verifySignedMessage(signedMessage: SignatureResult): VerificationResult;
/**
 * Batch verify multiple signatures
 */
export declare function batchVerify(items: Array<{
    message: string | Uint8Array;
    signature: string;
    publicKey: string;
}>): boolean[];
//# sourceMappingURL=signing.d.ts.map