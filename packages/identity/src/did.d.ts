import type { DigitalIdentity, EnhancedIdentity } from '@gtcx/types';
/**
 * DID method for GTCX
 */
export declare const DID_METHOD = "gtcx";
/**
 * DID Document structure (simplified W3C spec)
 */
export interface DIDDocument {
    '@context': string[];
    id: string;
    controller?: string;
    verificationMethod: VerificationMethod[];
    authentication: string[];
    assertionMethod?: string[];
    created: string;
    updated?: string;
}
export interface VerificationMethod {
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
export declare function createDID(identity: DigitalIdentity): string;
/**
 * Parse a DID string
 */
export declare function parseDID(did: string): {
    method: string;
    identifier: string;
    fragment?: string;
} | null;
/**
 * Validate a GTCX DID format
 */
export declare function isValidDID(did: string): boolean;
/**
 * Create a DID Document from an identity
 */
export declare function createDIDDocument(identity: DigitalIdentity | EnhancedIdentity): DIDDocument;
/**
 * Resolve a GTCX DID (stub - would typically call a resolver)
 */
export declare function resolveDID(did: string, resolver?: (did: string) => Promise<DIDDocument | null>): Promise<DIDDocument | null>;
/**
 * Extract the public key from a DID Document
 */
export declare function extractPublicKey(document: DIDDocument, keyId?: string): string | null;
//# sourceMappingURL=did.d.ts.map