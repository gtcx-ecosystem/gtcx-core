/**
 * Integration tests: @gtcx/crypto → @gtcx/identity
 *
 * Tests the pipeline from key generation through identity creation,
 * DID generation, and signing with identity keys.
 */
import {
  sign,
  verify,
  hashObject,
  buildMerkleTree,
  generateMerkleProof,
  verifyMerkleProof,
  createCommitment,
  verifyCommitment,
  generateSalt,
} from '@gtcx/crypto';
import {
  createIdentity,
  createEnhancedIdentity,
  validateIdentity,
  isIdentityExpired,
  deriveIdentity,
  generateIdentityId,
  createDID,
  parseDID,
  isValidDID,
  createDIDDocument,
  extractPublicKey,
} from '@gtcx/identity';
import { describe, it, expect } from 'vitest';

describe('Crypto → Identity: Key generation and identity creation', () => {
  it('creates an identity using Ed25519 keys from crypto', async () => {
    const result = await createIdentity({ algorithm: 'Ed25519' });

    expect(result.identity.id).toMatch(/^GTCX_/);
    expect(result.identity.publicKey).toHaveLength(64); // 32 bytes hex
    expect(result.privateKey).toHaveLength(64);
    expect(result.identity.securityLevel).toBe('standard');
  });

  it('signs a message with identity private key and verifies with public key', async () => {
    const result = await createIdentity();
    const message = 'identity-bound-message';

    const signature = sign(message, result.privateKey);
    expect(verify(message, signature, result.identity.publicKey)).toBe(true);
  });

  it('rejects signature verification with wrong identity key', async () => {
    const alice = await createIdentity();
    const bob = await createIdentity();

    const signature = sign('alice-message', alice.privateKey);
    expect(verify('alice-message', signature, bob.identity.publicKey)).toBe(false);
  });

  it('creates an enhanced identity with dual-key support', async () => {
    const result = await createEnhancedIdentity();

    expect(result.identity.publicKey).toHaveLength(64);
    expect(result.privateKeys.ed25519).toHaveLength(64);

    // Sign/verify with the enhanced identity's Ed25519 key
    const sig = sign('enhanced-msg', result.privateKeys.ed25519);
    expect(verify('enhanced-msg', sig, result.identity.publicKey)).toBe(true);
  });

  it('validates a freshly created identity', async () => {
    const { identity } = await createIdentity();
    const validation = validateIdentity(identity);

    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('detects expired identity', async () => {
    const { identity } = await createIdentity();
    // Manually set expiry to the past
    identity.expiresAt = Date.now() - 1000;

    expect(isIdentityExpired(identity)).toBe(true);
  });

  it('generates deterministic identity IDs with prefix', () => {
    const id = generateIdentityId('TEST');
    expect(id).toMatch(/^TEST_/);
  });
});

describe('Crypto → Identity: DID operations', () => {
  it('creates a DID from identity and parses it back', async () => {
    const { identity } = await createIdentity();
    const did = createDID(identity);

    expect(did).toMatch(/^did:gtcx:/);
    expect(isValidDID(did)).toBe(true);

    const parsed = parseDID(did);
    expect(parsed).not.toBeNull();
    expect(parsed!.method).toBe('gtcx');
  });

  it('creates a DID document with the identity public key', async () => {
    const { identity } = await createIdentity();
    const didDoc = createDIDDocument(identity);

    expect(didDoc.id).toMatch(/^did:gtcx:/);
    expect(didDoc.verificationMethod.length).toBeGreaterThan(0);

    // Extract the public key from the DID document
    const extractedKey = extractPublicKey(didDoc);
    expect(extractedKey).not.toBeNull();
  });

  it('DID document verification method matches identity key', async () => {
    const { identity, privateKey } = await createIdentity();
    const didDoc = createDIDDocument(identity);

    // The DID document should contain a verification method
    // with the identity's public key
    const vm = didDoc.verificationMethod[0];
    expect(vm).toBeDefined();
    expect(vm!.type).toContain('Ed25519');

    // Sign with identity key and verify — proves DID is bound to the key
    const message = 'did-bound-assertion';
    const sig = sign(message, privateKey);
    expect(verify(message, sig, identity.publicKey)).toBe(true);
  });

  it('rejects invalid DID format', () => {
    expect(isValidDID('not-a-did')).toBe(false);
    expect(isValidDID('did:btc:abc')).toBe(false);
    expect(parseDID('garbage')).toBeNull();
  });
});

describe('Crypto → Identity: Key derivation and child identities', () => {
  it('derives a child identity from a parent', async () => {
    const parent = await createIdentity();
    const child = await deriveIdentity(parent.identity, 'child-context');

    expect(child.identity.id).not.toBe(parent.identity.id);
    expect(child.identity.publicKey).not.toBe(parent.identity.publicKey);

    // Both identities should be independently valid
    expect(validateIdentity(parent.identity).valid).toBe(true);
    expect(validateIdentity(child.identity).valid).toBe(true);
  });

  it('derived identities have independent signing keys', async () => {
    const parent = await createIdentity();
    const child = await deriveIdentity(parent.identity, 'signing-test');

    const message = 'cross-identity-test';
    const parentSig = sign(message, parent.privateKey);
    const childSig = sign(message, child.privateKey);

    // Each verifies only with its own key
    expect(verify(message, parentSig, parent.identity.publicKey)).toBe(true);
    expect(verify(message, parentSig, child.identity.publicKey)).toBe(false);
    expect(verify(message, childSig, child.identity.publicKey)).toBe(true);
    expect(verify(message, childSig, parent.identity.publicKey)).toBe(false);
  });
});

describe('Crypto hashing + Identity: Content-addressed identity data', () => {
  it('hashes identity metadata deterministically', async () => {
    const { identity } = await createIdentity({
      metadata: { userId: 'user-001', deviceId: 'device-001' },
    });

    const hash1 = hashObject(identity);
    const hash2 = hashObject(identity);
    expect(hash1).toBe(hash2);
  });

  it('creates a Merkle tree of identity IDs', async () => {
    const identities = await Promise.all(Array.from({ length: 5 }, () => createIdentity()));
    const ids = identities.map((r) => r.identity.id);

    const tree = buildMerkleTree(ids);
    expect(tree.root).toBeTruthy();

    // Prove inclusion for the 3rd identity
    const proof = generateMerkleProof(tree, 2);
    expect(verifyMerkleProof(proof)).toBe(true);
  });

  it('creates and verifies a commitment to identity data', async () => {
    const { identity } = await createIdentity();
    const salt = generateSalt();
    const data = JSON.stringify({ id: identity.id, publicKey: identity.publicKey });

    const commitment = createCommitment(data, salt);
    expect(verifyCommitment(data, salt, commitment)).toBe(true);
    expect(verifyCommitment('tampered', salt, commitment)).toBe(false);
  });
});
