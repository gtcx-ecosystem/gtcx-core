// ============================================================================
// DIGITAL IDENTIFIER (DID) OPERATIONS
// W3C DID-compatible identity operations
// ============================================================================

import { hash256 } from '@gtcx/crypto';
import type { DigitalIdentity, EnhancedIdentity } from '@gtcx/types';

import { IdentityError } from './identity';
import type { DIDResolver, DIDResolverOptions, DIDResolutionResult } from './resolver';

/**
 * DID method for GTCX
 */
export const DID_METHOD = 'gtcx';

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
export function createDID(identity: DigitalIdentity): string {
  const fingerprint = identity.metadata.fingerprint ?? hash256(identity.publicKey).substring(0, 32);
  return `did:${DID_METHOD}:${fingerprint}`;
}

/**
 * Parse a DID string
 */
export function parseDID(did: string): {
  method: string;
  identifier: string;
  fragment?: string | undefined;
} | null {
  const match = did.match(/^did:([a-z0-9]+):([a-zA-Z0-9._:%-]+)(#[a-zA-Z0-9._:%-]*)?$/);
  if (!match) return null;

  return {
    method: match[1]!,
    identifier: match[2]!,
    fragment: match[3]?.substring(1),
  };
}

/**
 * Validate a GTCX DID format
 */
export function isValidDID(did: string): boolean {
  const parsed = parseDID(did);
  return parsed !== null && parsed.method === DID_METHOD;
}

/**
 * Create a DID Document from an identity
 */
export function createDIDDocument(identity: DigitalIdentity | EnhancedIdentity): DIDDocument {
  const did = createDID(identity);

  // Only extract public key material - never include private keys
  const verificationMethods: VerificationMethod[] = [
    {
      id: `${did}#keys-1`,
      type: 'Ed25519VerificationKey2020',
      controller: did,
      publicKeyHex: identity.publicKey,
    },
  ];

  // Add Secp256k1 public key if enhanced identity
  if ('multiKeyPairs' in identity && identity.multiKeyPairs.secp256k1) {
    const { publicKey } = identity.multiKeyPairs.secp256k1;
    verificationMethods.push({
      id: `${did}#keys-2`,
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller: did,
      publicKeyHex: publicKey,
    });
  }

  const document: DIDDocument = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/ed25519-2020/v1',
    ],
    id: did,
    verificationMethod: verificationMethods,
    authentication: verificationMethods.map((vm) => vm.id),
    assertionMethod: verificationMethods.map((vm) => vm.id),
    created: new Date(identity.createdAt).toISOString(),
  };

  // Defensive check: ensure no private key material leaked into the document
  const serialized = JSON.stringify(document);
  if (serialized.includes('privateKey') || serialized.includes('privateKeyRef')) {
    throw new IdentityError(
      'DID document must not contain private key material',
      'PRIVATE_KEY_LEAK'
    );
  }

  return document;
}

/**
 * Resolve a GTCX DID (stub - would typically call a resolver)
 */
export async function resolveDID(
  did: string,
  resolver?: DIDResolver | ((did: string) => Promise<DIDDocument | null>),
  options?: DIDResolverOptions
): Promise<DIDDocument | null> {
  if (!isValidDID(did)) {
    return null;
  }

  if (!resolver) {
    return null;
  }

  if (typeof (resolver as DIDResolver).resolve === 'function') {
    try {
      const result = await (resolver as DIDResolver).resolve(did, options);
      return result.document;
    } catch {
      return null;
    }
  }

  if (typeof resolver === 'function') {
    return resolver(did);
  }

  return null;
}

export async function resolveDIDWithMetadata(
  did: string,
  resolver: DIDResolver,
  options?: DIDResolverOptions
): Promise<DIDResolutionResult> {
  return resolver.resolve(did, options);
}

/**
 * Extract the public key from a DID Document
 */
export function extractPublicKey(document: DIDDocument, keyId?: string): string | null {
  const method = keyId
    ? document.verificationMethod.find((vm) => vm.id === keyId)
    : document.verificationMethod[0];

  return method?.publicKeyHex ?? method?.publicKeyMultibase ?? null;
}
