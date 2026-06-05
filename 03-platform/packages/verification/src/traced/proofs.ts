/**
 * Traced proof bundle operations.
 */

import { hash256 } from '@gtcx/crypto';

import {
  createCryptographicProofRef,
  createLocationProof,
  createPhotoProof,
  createProofBundle,
} from '../proofs/bundler.js';
import { traced } from '../tracing.js';
import type { ProofBundle } from '../types';

import {
  CreateProofBundleInput,
  sanitizeCreateProofBundleInput,
  sanitizeCreateProofBundleOutput,
} from './sanitizers';

export const tracedCreateProofBundle = traced(
  async (params: CreateProofBundleInput): Promise<ProofBundle> => {
    const timestamp = Date.now();
    const payloadHash = hash256(
      JSON.stringify({
        type: params.type,
        location: params.location,
        photoHashes: params.photoHashes,
        certificateId: params.certificate?.certificateId,
        timestamp,
      })
    );
    const signature = hash256(`${payloadHash}:traced-proof-signature`);
    const publicKey = params.certificate?.verificationData.publicKey ?? 'traced-public-key';

    const cryptographicProof = createCryptographicProofRef(payloadHash, signature, publicKey);
    const locationProof = params.location
      ? createLocationProof({
          coordinates: params.location,
          signature,
          publicKey,
        })
      : undefined;
    const photoProofs = params.photoHashes?.map((photoHash, index) =>
      createPhotoProof({
        uri: `photo://${index}`,
        fileHash: photoHash,
        timestamp,
      })
    );

    const bundle = createProofBundle({
      type: params.type,
      cryptographicProof,
      locationProof,
      photoProofs,
      certificate: params.certificate,
    });

    return params.claims && params.claims.length > 0
      ? { ...bundle, claims: params.claims }
      : bundle;
  },
  'verification.createProofBundle',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeInput: sanitizeCreateProofBundleInput,
    sanitizeOutput: sanitizeCreateProofBundleOutput,
  }
);
