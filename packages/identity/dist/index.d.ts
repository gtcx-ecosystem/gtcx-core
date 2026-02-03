import { SecurityLevel, IdentityMetadata, DigitalIdentity, KeyDerivationParams, EnhancedIdentity } from '@gtcx/types';

/**
 * Options for identity creation
 */
interface CreateIdentityOptions {
    securityLevel?: SecurityLevel;
    metadata?: Partial<IdentityMetadata>;
    algorithm?: 'Ed25519' | 'Secp256k1';
    enableMultiSig?: boolean;
}
/**
 * Result of identity creation
 * Includes private key that must be stored securely
 */
interface IdentityCreationResult {
    identity: DigitalIdentity;
    privateKey: string;
}
interface EnhancedIdentityCreationResult {
    identity: EnhancedIdentity;
    privateKeys: {
        ed25519: string;
        secp256k1?: string;
    };
}
/**
 * Generate a unique identity ID
 */
declare function generateIdentityId(prefix?: string): string;
/**
 * Create a standard digital identity
 *
 * @example
 * ```typescript
 * const { identity, privateKey } = await createIdentity({
 *   securityLevel: 'standard',
 *   metadata: { userRole: 'miner', deviceId: 'abc123' }
 * });
 * // Store privateKey in secure storage immediately
 * await secureStore.set(identity.privateKeyRef, privateKey);
 * ```
 */
declare function createIdentity(options?: CreateIdentityOptions): Promise<IdentityCreationResult>;
/**
 * Create an enhanced identity with multi-signature support
 * Used for military-grade security requirements
 */
declare function createEnhancedIdentity(options?: CreateIdentityOptions & {
    keyDerivation?: Partial<KeyDerivationParams>;
}): Promise<EnhancedIdentityCreationResult>;
/**
 * Validate identity structure
 */
declare function validateIdentity(identity: DigitalIdentity): {
    valid: boolean;
    errors: string[];
};
/**
 * Check if identity has expired
 */
declare function isIdentityExpired(identity: DigitalIdentity): boolean;
/**
 * Create a derived identity from existing identity
 * Useful for creating role-specific or context-specific identities
 */
declare function deriveIdentity(parentIdentity: DigitalIdentity, context: string, options?: Partial<CreateIdentityOptions>): Promise<IdentityCreationResult>;

/**
 * DID method for GTCX
 */
declare const DID_METHOD = "gtcx";
/**
 * DID Document structure (simplified W3C spec)
 */
interface DIDDocument {
    '@context': string[];
    id: string;
    controller?: string;
    verificationMethod: VerificationMethod[];
    authentication: string[];
    assertionMethod?: string[];
    created: string;
    updated?: string;
}
interface VerificationMethod {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase?: string;
    publicKeyHex?: string;
}
/**
 * Create a DID from an identity
 * Format: did:gtcx:<fingerprint>
 */
declare function createDID(identity: DigitalIdentity): string;
/**
 * Parse a DID string
 */
declare function parseDID(did: string): {
    method: string;
    identifier: string;
    fragment?: string;
} | null;
/**
 * Validate a GTCX DID format
 */
declare function isValidDID(did: string): boolean;
/**
 * Create a DID Document from an identity
 */
declare function createDIDDocument(identity: DigitalIdentity | EnhancedIdentity): DIDDocument;
/**
 * Resolve a GTCX DID (stub - would typically call a resolver)
 */
declare function resolveDID(did: string, resolver?: (did: string) => Promise<DIDDocument | null>): Promise<DIDDocument | null>;
/**
 * Extract the public key from a DID Document
 */
declare function extractPublicKey(document: DIDDocument, keyId?: string): string | null;

export { type CreateIdentityOptions, type DIDDocument, DID_METHOD, type EnhancedIdentityCreationResult, type IdentityCreationResult, type VerificationMethod, createDID, createDIDDocument, createEnhancedIdentity, createIdentity, deriveIdentity, extractPublicKey, generateIdentityId, isIdentityExpired, isValidDID, parseDID, resolveDID, validateIdentity };
