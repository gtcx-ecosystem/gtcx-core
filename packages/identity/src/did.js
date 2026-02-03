// ============================================================================
// DIGITAL IDENTIFIER (DID) OPERATIONS
// W3C DID-compatible identity operations
// ============================================================================
import { hash256 } from '@gtcx/crypto';
/**
 * DID method for GTCX
 */
export const DID_METHOD = 'gtcx';
/**
 * Create a DID from an identity
 * Format: did:gtcx:<fingerprint>
 */
export function createDID(identity) {
    const fingerprint = identity.metadata.fingerprint
        ?? hash256(identity.publicKey).substring(0, 32);
    return `did:${DID_METHOD}:${fingerprint}`;
}
/**
 * Parse a DID string
 */
export function parseDID(did) {
    const match = did.match(/^did:([^:]+):([^#]+)(#.*)?$/);
    if (!match)
        return null;
    return {
        method: match[1],
        identifier: match[2],
        fragment: match[3]?.substring(1),
    };
}
/**
 * Validate a GTCX DID format
 */
export function isValidDID(did) {
    const parsed = parseDID(did);
    return parsed !== null && parsed.method === DID_METHOD;
}
/**
 * Create a DID Document from an identity
 */
export function createDIDDocument(identity) {
    const did = createDID(identity);
    const verificationMethods = [
        {
            id: `${did}#keys-1`,
            type: 'Ed25519VerificationKey2020',
            controller: did,
            publicKeyHex: identity.publicKey,
        },
    ];
    // Add Secp256k1 key if enhanced identity
    if ('multiKeyPairs' in identity && identity.multiKeyPairs.secp256k1) {
        verificationMethods.push({
            id: `${did}#keys-2`,
            type: 'EcdsaSecp256k1VerificationKey2019',
            controller: did,
            publicKeyHex: identity.multiKeyPairs.secp256k1.publicKey,
        });
    }
    return {
        '@context': [
            'https://www.w3.org/ns/did/v1',
            'https://w3id.org/security/suites/ed25519-2020/v1',
        ],
        id: did,
        verificationMethod: verificationMethods,
        authentication: verificationMethods.map(vm => vm.id),
        assertionMethod: verificationMethods.map(vm => vm.id),
        created: new Date(identity.createdAt).toISOString(),
    };
}
/**
 * Resolve a GTCX DID (stub - would typically call a resolver)
 */
export async function resolveDID(did, resolver) {
    if (!isValidDID(did)) {
        return null;
    }
    if (resolver) {
        return resolver(did);
    }
    // Default: return null (no local resolution capability)
    return null;
}
/**
 * Extract the public key from a DID Document
 */
export function extractPublicKey(document, keyId) {
    const method = keyId
        ? document.verificationMethod.find(vm => vm.id === keyId)
        : document.verificationMethod[0];
    return method?.publicKeyHex ?? method?.publicKeyMultibase ?? null;
}
//# sourceMappingURL=did.js.map