import { describe, it, expect } from 'vitest';

import {
  createDID,
  parseDID,
  isValidDID,
  createDIDDocument,
  resolveDID,
  resolveDIDWithMetadata,
  extractPublicKey,
} from '../src/did';
import type { DIDDocument } from '../src/did';
import { createIdentity, createEnhancedIdentity, IdentityError } from '../src/identity';
import type { DIDResolver } from '../src/resolver';

// ---------------------------------------------------------------------------
// createDID
// ---------------------------------------------------------------------------
describe('createDID', () => {
  it('returns a did:gtcx:... formatted string', async () => {
    const { identity } = await createIdentity();
    const did = createDID(identity);

    expect(did).toBeTypeOf('string');
    expect(did).toMatch(/^did:gtcx:.+$/);
  });

  it('uses the fingerprint from identity metadata', async () => {
    const { identity } = await createIdentity();
    const did = createDID(identity);

    expect(did).toBe(`did:gtcx:${identity.metadata.fingerprint}`);
  });

  it('produces consistent DIDs for the same identity', async () => {
    const { identity } = await createIdentity();
    const did1 = createDID(identity);
    const did2 = createDID(identity);

    expect(did1).toBe(did2);
  });

  it('produces different DIDs for different identities', async () => {
    const { identity: id1 } = await createIdentity();
    const { identity: id2 } = await createIdentity();
    const did1 = createDID(id1);
    const did2 = createDID(id2);

    expect(did1).not.toBe(did2);
  });
});

// ---------------------------------------------------------------------------
// parseDID
// ---------------------------------------------------------------------------
describe('parseDID', () => {
  it('extracts method and identifier from a valid DID', () => {
    const parsed = parseDID('did:gtcx:abc123def456');

    expect(parsed).not.toBeNull();
    expect(parsed!.method).toBe('gtcx');
    expect(parsed!.identifier).toBe('abc123def456');
    expect(parsed!.fragment).toBeUndefined();
  });

  it('returns null for an invalid DID', () => {
    expect(parseDID('')).toBeNull();
    expect(parseDID('not-a-did')).toBeNull();
    expect(parseDID('did:')).toBeNull();
    expect(parseDID('did:gtcx:')).toBeNull();
  });

  it('handles fragments', () => {
    const parsed = parseDID('did:gtcx:abc123#keys-1');

    expect(parsed).not.toBeNull();
    expect(parsed!.method).toBe('gtcx');
    expect(parsed!.identifier).toBe('abc123');
    expect(parsed!.fragment).toBe('keys-1');
  });

  it('parses non-gtcx DID methods', () => {
    const parsed = parseDID('did:web:example.com');

    expect(parsed).not.toBeNull();
    expect(parsed!.method).toBe('web');
    expect(parsed!.identifier).toBe('example.com');
  });
});

// ---------------------------------------------------------------------------
// isValidDID
// ---------------------------------------------------------------------------
describe('isValidDID', () => {
  it('accepts valid gtcx DIDs', () => {
    expect(isValidDID('did:gtcx:abc123')).toBe(true);
    expect(isValidDID('did:gtcx:abc123def456')).toBe(true);
  });

  it('accepts gtcx DID with fragment', () => {
    expect(isValidDID('did:gtcx:abc123#keys-1')).toBe(true);
  });

  it('rejects non-gtcx DIDs', () => {
    expect(isValidDID('did:web:example.com')).toBe(false);
    expect(isValidDID('did:key:z6Mk...')).toBe(false);
  });

  it('rejects malformed strings', () => {
    expect(isValidDID('')).toBe(false);
    expect(isValidDID('not-a-did')).toBe(false);
    expect(isValidDID('did:gtcx:')).toBe(false);
    expect(isValidDID('random-text')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// createDIDDocument
// ---------------------------------------------------------------------------
describe('createDIDDocument', () => {
  it('returns a valid W3C DID document structure', async () => {
    const { identity } = await createIdentity();
    const doc = createDIDDocument(identity);

    expect(doc['@context']).toContain('https://www.w3.org/ns/did/v1');
    expect(doc['@context']).toContain('https://w3id.org/security/suites/ed25519-2020/v1');
    expect(doc.id).toBe(createDID(identity));
    expect(doc.verificationMethod).toBeInstanceOf(Array);
    expect(doc.verificationMethod.length).toBe(1);
    expect(doc.authentication).toBeInstanceOf(Array);
    expect(doc.authentication.length).toBe(1);
    expect(doc.assertionMethod).toBeInstanceOf(Array);
    expect(doc.created).toBeTypeOf('string');
    // created should be an ISO date string
    expect(new Date(doc.created).getTime()).not.toBeNaN();
  });

  it('verification method has correct structure for standard identity', async () => {
    const { identity } = await createIdentity();
    const doc = createDIDDocument(identity);
    const did = createDID(identity);
    const vm = doc.verificationMethod[0];

    expect(vm!.id).toBe(`${did}#keys-1`);
    expect(vm!.type).toBe('Ed25519VerificationKey2020');
    expect(vm!.controller).toBe(did);
    expect(vm!.publicKeyHex).toBe(identity.publicKey);
  });

  it('authentication references match verification method IDs', async () => {
    const { identity } = await createIdentity();
    const doc = createDIDDocument(identity);

    const vmIds = doc.verificationMethod.map((vm) => vm.id);
    expect(doc.authentication).toEqual(vmIds);
  });

  it('handles enhanced identity with multiple keys', async () => {
    const { identity } = await createEnhancedIdentity();
    const doc = createDIDDocument(identity);
    const did = createDID(identity);

    // Should have 2 verification methods
    expect(doc.verificationMethod.length).toBe(2);

    // First key: Ed25519
    expect(doc.verificationMethod[0]!.id).toBe(`${did}#keys-1`);
    expect(doc.verificationMethod[0]!.type).toBe('Ed25519VerificationKey2020');
    expect(doc.verificationMethod[0]!.publicKeyHex).toBe(identity.publicKey);

    // Second key: Secp256k1
    expect(doc.verificationMethod[1]!.id).toBe(`${did}#keys-2`);
    expect(doc.verificationMethod[1]!.type).toBe('EcdsaSecp256k1VerificationKey2019');
    expect(doc.verificationMethod[1]!.publicKeyHex).toBe(
      identity.multiKeyPairs.secp256k1!.publicKey
    );

    // authentication should reference both keys
    expect(doc.authentication.length).toBe(2);
    expect(doc.assertionMethod!.length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// resolveDID
// ---------------------------------------------------------------------------
describe('resolveDID', () => {
  it('invokes a custom resolver and returns its result', async () => {
    const { identity } = await createIdentity();
    const doc = createDIDDocument(identity);
    const did = createDID(identity);

    const resolver = async (input: string): Promise<DIDDocument | null> => {
      if (input === did) return doc;
      return null;
    };

    const result = await resolveDID(did, resolver);
    expect(result).not.toBeNull();
    expect(result!.id).toBe(did);
  });

  it('returns null for an unknown DID with a custom resolver', async () => {
    const resolver = async (_input: string): Promise<DIDDocument | null> => null;

    const result = await resolveDID('did:gtcx:unknown', resolver);
    expect(result).toBeNull();
  });

  it('returns null when no resolver is provided', async () => {
    const result = await resolveDID('did:gtcx:someIdentifier');
    expect(result).toBeNull();
  });

  it('returns null for an invalid DID even with a resolver', async () => {
    const resolver = async (_input: string): Promise<DIDDocument | null> => {
      return {
        '@context': [],
        id: 'did:gtcx:test',
        verificationMethod: [],
        authentication: [],
        created: new Date().toISOString(),
      };
    };

    const result = await resolveDID('not-a-valid-did', resolver);
    expect(result).toBeNull();
  });

  it('returns null for non-gtcx DID', async () => {
    const resolver = async (_input: string): Promise<DIDDocument | null> => {
      return {
        '@context': [],
        id: 'did:web:example',
        verificationMethod: [],
        authentication: [],
        created: new Date().toISOString(),
      };
    };

    const result = await resolveDID('did:web:example.com', resolver);
    expect(result).toBeNull();
  });

  it('invokes DIDResolver.resolve() when object resolver provided', async () => {
    const { identity } = await createIdentity();
    const doc = createDIDDocument(identity);
    const did = createDID(identity);

    const resolver: DIDResolver = {
      resolve: async (inputDid: string) => ({
        didDocument: { id: inputDid } as any,
        document: doc,
        didResolutionMetadata: {},
        didDocumentMetadata: {},
      }),
    };

    const result = await resolveDID(did, resolver);
    expect(result).not.toBeNull();
    expect(result!.id).toBe(did);
  });

  it('returns null when DIDResolver.resolve() throws', async () => {
    const did = 'did:gtcx:test123';
    const resolver: DIDResolver = {
      resolve: async () => {
        throw new Error('Resolver failure');
      },
    };

    const result = await resolveDID(did, resolver);
    expect(result).toBeNull();
  });

  it('returns null for an invalid resolver object', async () => {
    const did = 'did:gtcx:test123';
    const result = await resolveDID(did, { foo: 'bar' } as any);
    expect(result).toBeNull();
  });
});

describe('resolveDIDWithMetadata', () => {
  it('delegates to resolver.resolve()', async () => {
    const did = 'did:gtcx:test123';
    const resolver: DIDResolver = {
      resolve: async (inputDid: string) => ({
        didDocument: { id: inputDid } as any,
        document: { id: inputDid } as DIDDocument,
        didResolutionMetadata: { test: true },
        didDocumentMetadata: {},
      }),
    };

    const result = await resolveDIDWithMetadata(did, resolver);
    expect(result.didResolutionMetadata).toEqual({ test: true });
  });
});

// ---------------------------------------------------------------------------
// extractPublicKey
// ---------------------------------------------------------------------------
describe('extractPublicKey', () => {
  it('extracts the first public key from a document', async () => {
    const { identity } = await createIdentity();
    const doc = createDIDDocument(identity);

    const key = extractPublicKey(doc);
    expect(key).toBe(identity.publicKey);
  });

  it('extracts a specific key by keyId', async () => {
    const { identity } = await createEnhancedIdentity();
    const doc = createDIDDocument(identity);
    const did = createDID(identity);

    const key1 = extractPublicKey(doc, `${did}#keys-1`);
    expect(key1).toBe(identity.publicKey);

    const key2 = extractPublicKey(doc, `${did}#keys-2`);
    expect(key2).toBe(identity.multiKeyPairs.secp256k1!.publicKey);
  });

  it('returns null when the specified keyId is not found', async () => {
    const { identity } = await createIdentity();
    const doc = createDIDDocument(identity);

    const key = extractPublicKey(doc, 'did:gtcx:unknown#keys-999');
    expect(key).toBeNull();
  });

  it('returns null for a document with no verification methods', () => {
    const emptyDoc: DIDDocument = {
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: 'did:gtcx:empty',
      verificationMethod: [],
      authentication: [],
      created: new Date().toISOString(),
    };

    const key = extractPublicKey(emptyDoc);
    expect(key).toBeNull();
  });
});
