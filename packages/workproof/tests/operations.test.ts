import { generateKeyPair } from '@gtcx/crypto';
import { describe, it, expect } from 'vitest';

import { createWorkProof, verifyWorkProof } from '../src/workproof/operations';
import type { WorkProofCredentialSubject } from '../src/workproof/types';

function makeSubject(
  overrides: Partial<WorkProofCredentialSubject> = {}
): WorkProofCredentialSubject {
  return {
    id: 'did:gtcx:tp_subject-001',
    proofType: 'ProductionEvent',
    tradepassId: 'did:gtcx:tp_subject-001',
    issuerId: 'did:gtcx:issuer-001',
    issuerRole: 'EmploymentOperator',
    claims: [
      {
        predicateType: 'CommodityProduced',
        predicateURI: 'tradepass://workproof/production/commodity-produced',
        value: { kind: 'boolean', value: true },
        evidence: [{ type: 'satellite_image' as const, hash: 'sha256:abc', timestamp: Date.now() }],
        confidence: 0.9,
        issuedAt: Date.now(),
        proof: {
          type: 'Ed25519Signature2020' as const,
          created: new Date().toISOString(),
          verificationMethod: 'did:gtcx:issuer-001#key-1',
          proofValue: 'placeholder',
        },
      },
    ],
    ...overrides,
  };
}

describe('createWorkProof', () => {
  it('returns a valid W3C VC with Ed25519 proof', () => {
    const keyPair = generateKeyPair('Ed25519');
    const subject = makeSubject();

    const wp = createWorkProof({
      credentialSubject: subject,
      issuerDID: 'did:gtcx:issuer-001',
      issuerPrivateKey: keyPair.privateKey,
    });

    expect(wp.type).toEqual(['VerifiableCredential', 'WorkProof']);
    expect(wp.workProofVersion).toBe('2.1');
    expect(wp.proof).toBeDefined();
    expect(wp.proof!.type).toBe('Ed25519Signature2020');
    expect(wp.proof!.proofPurpose).toBe('assertionMethod');
    expect(wp.proof!.proofValue).toBeTruthy();
    expect(wp.issuer).toBe('did:gtcx:issuer-001');
  });
});

describe('verifyWorkProof', () => {
  it('valid: true for correctly signed WorkProof', () => {
    const keyPair = generateKeyPair('Ed25519');
    const wp = createWorkProof({
      credentialSubject: makeSubject(),
      issuerDID: 'did:gtcx:issuer-001',
      issuerPrivateKey: keyPair.privateKey,
    });

    const result = verifyWorkProof(wp, keyPair.publicKey);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('valid: false when signature is tampered', () => {
    const keyPair = generateKeyPair('Ed25519');
    const wp = createWorkProof({
      credentialSubject: makeSubject(),
      issuerDID: 'did:gtcx:issuer-001',
      issuerPrivateKey: keyPair.privateKey,
    });

    // Tamper with the proof value
    wp.proof = { ...wp.proof!, proofValue: 'aa'.repeat(32) };

    const result = verifyWorkProof(wp, keyPair.publicKey);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid signature');
  });

  it('valid: false when verified with wrong public key', () => {
    const issuerKeys = generateKeyPair('Ed25519');
    const otherKeys = generateKeyPair('Ed25519');

    const wp = createWorkProof({
      credentialSubject: makeSubject(),
      issuerDID: 'did:gtcx:issuer-001',
      issuerPrivateKey: issuerKeys.privateKey,
    });

    const result = verifyWorkProof(wp, otherKeys.publicKey);
    expect(result.valid).toBe(false);
  });

  it('valid: false when credentialSubject is tampered', () => {
    const keyPair = generateKeyPair('Ed25519');
    const wp = createWorkProof({
      credentialSubject: makeSubject(),
      issuerDID: 'did:gtcx:issuer-001',
      issuerPrivateKey: keyPair.privateKey,
    });

    // Tamper with the subject
    wp.credentialSubject.issuerRole = 'Attacker';

    const result = verifyWorkProof(wp, keyPair.publicKey);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid signature');
  });

  it('valid: false for expired WorkProof', () => {
    const keyPair = generateKeyPair('Ed25519');
    const wp = createWorkProof({
      credentialSubject: makeSubject(),
      issuerDID: 'did:gtcx:issuer-001',
      issuerPrivateKey: keyPair.privateKey,
      expirationDate: '2020-01-01T00:00:00Z',
    });

    const result = verifyWorkProof(wp, keyPair.publicKey);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('WorkProof has expired');
  });
});
