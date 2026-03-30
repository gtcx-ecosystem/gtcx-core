/**
 * WorkProof operations — create and verify W3C VC-based employment attestations
 *
 * @simplified Ed25519 signing only. Multi-sig and ZKP integration not yet wired.
 */

import { hashObject, sign, verify } from '@gtcx/crypto';
import type { CredentialProof } from '@gtcx/types';

import { WorkProofSchema } from './schemas';
import type { WorkProof, WorkProofCredentialSubject } from './types';

// ============================================================================
// TYPES
// ============================================================================

export interface CreateWorkProofInput {
  credentialSubject: WorkProofCredentialSubject;
  issuerDID: string;
  issuerPrivateKey: string;
  expirationDate?: string;
}

export interface WorkProofVerificationResult {
  valid: boolean;
  errors: string[];
}

// ============================================================================
// CREATE
// ============================================================================

/**
 * Create a signed WorkProof (W3C Verifiable Credential).
 *
 * Signs a hash of the credentialSubject with Ed25519 and attaches
 * the proof envelope per W3C VC Data Model 1.1 §4.7.
 */
export function createWorkProof(input: CreateWorkProofInput): WorkProof {
  const { credentialSubject, issuerDID, issuerPrivateKey, expirationDate } = input;

  const now = new Date().toISOString();

  // Canonical serialization of the subject for signing (deterministic key ordering)
  const subjectHash = hashObject(credentialSubject);
  const signature = sign(subjectHash, issuerPrivateKey);

  const proof: CredentialProof = {
    type: 'Ed25519Signature2020',
    created: now,
    verificationMethod: `${issuerDID}#key-1`,
    proofPurpose: 'assertionMethod',
    proofValue: signature,
  };

  const workProof: WorkProof = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://gtcx.io/credentials/workproof/v2.1',
    ],
    type: ['VerifiableCredential', 'WorkProof'],
    issuer: issuerDID,
    issuanceDate: now,
    ...(expirationDate ? { expirationDate } : {}),
    credentialSubject,
    workProofVersion: '2.1',
    proof,
  };

  return workProof;
}

// ============================================================================
// VERIFY
// ============================================================================

/**
 * Verify a WorkProof's schema validity and cryptographic signature.
 *
 * Checks:
 * 1. Zod schema validation (structure, required fields)
 * 2. Ed25519 signature over credentialSubject hash
 * 3. Temporal validity (not expired)
 */
export function verifyWorkProof(
  workProof: WorkProof,
  issuerPublicKey: string
): WorkProofVerificationResult {
  const errors: string[] = [];

  // 1. Schema validation
  const schemaResult = WorkProofSchema.safeParse(workProof);
  if (!schemaResult.success) {
    for (const issue of schemaResult.error.issues) {
      errors.push(`Schema: ${issue.path.join('.')}: ${issue.message}`);
    }
    return { valid: false, errors };
  }

  // 2. Proof presence
  if (!workProof.proof) {
    errors.push('Missing proof envelope');
    return { valid: false, errors };
  }

  // 3. Signature verification
  const subjectHash = hashObject(workProof.credentialSubject);
  try {
    const sigValid = verify(subjectHash, workProof.proof.proofValue, issuerPublicKey);
    if (!sigValid) {
      errors.push('Invalid signature');
    }
  } catch {
    errors.push('Signature verification failed');
  }

  // 4. Temporal validity
  if (workProof.expirationDate) {
    const expiry = new Date(workProof.expirationDate).getTime();
    if (expiry < Date.now()) {
      errors.push('WorkProof has expired');
    }
  }

  return { valid: errors.length === 0, errors };
}
