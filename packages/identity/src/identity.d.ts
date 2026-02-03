import type { DigitalIdentity, EnhancedIdentity, SecurityLevel, IdentityMetadata, KeyDerivationParams } from '@gtcx/types';
/**
 * Options for identity creation
 */
export interface CreateIdentityOptions {
    securityLevel?: SecurityLevel;
    metadata?: Partial<IdentityMetadata>;
    algorithm?: 'Ed25519' | 'Secp256k1';
    enableMultiSig?: boolean;
}
/**
 * Result of identity creation
 * Includes private key that must be stored securely
 */
export interface IdentityCreationResult {
    identity: DigitalIdentity;
    privateKey: string;
}
export interface EnhancedIdentityCreationResult {
    identity: EnhancedIdentity;
    privateKeys: {
        ed25519: string;
        secp256k1?: string;
    };
}
/**
 * Generate a unique identity ID
 */
export declare function generateIdentityId(prefix?: string): string;
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
export declare function createIdentity(options?: CreateIdentityOptions): Promise<IdentityCreationResult>;
/**
 * Create an enhanced identity with multi-signature support
 * Used for military-grade security requirements
 */
export declare function createEnhancedIdentity(options?: CreateIdentityOptions & {
    keyDerivation?: Partial<KeyDerivationParams>;
}): Promise<EnhancedIdentityCreationResult>;
/**
 * Validate identity structure
 */
export declare function validateIdentity(identity: DigitalIdentity): {
    valid: boolean;
    errors: string[];
};
/**
 * Check if identity has expired
 */
export declare function isIdentityExpired(identity: DigitalIdentity): boolean;
/**
 * Create a derived identity from existing identity
 * Useful for creating role-specific or context-specific identities
 */
export declare function deriveIdentity(parentIdentity: DigitalIdentity, context: string, options?: Partial<CreateIdentityOptions>): Promise<IdentityCreationResult>;
//# sourceMappingURL=identity.d.ts.map