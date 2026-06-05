import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import {
  createHashCommitmentZkpEngine,
  NativeZkpEngine,
  type ZkProofInput,
} from '../../03-platform/packages/crypto/src/zkp';

/**
 * ZKP Parity Tests
 *
 * Verifies that the TypeScript 'Placeholder' engine and the Rust 'Native' engine
 * adhere to the same logical contract, even if their underlying math differs.
 */
describe('ZKP Engine Parity', () => {
  // SA-002: HashCommitmentZkpEngine.generate() throws by default. Parity tests
  // must opt in because they exercise generate() — this is a controlled test
  // context, not a regulatory or production claim.
  beforeEach(() => {
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '1');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const engines = [{ name: 'TypeScript (Placeholder)', engine: createHashCommitmentZkpEngine() }];

  // Try to load native engine if available
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nativeModule = require('../../03-platform/packages/crypto-native');
    if (nativeModule) {
      engines.push({ name: 'Rust (Native)', engine: new NativeZkpEngine(nativeModule) });
    }
  } catch {
    // Native not available in this environment
  }

  engines.forEach(({ name, engine }) => {
    describe(`${name} Engine`, () => {
      it('should satisfy the basic proof round-trip', async () => {
        const input: ZkProofInput = {
          system: name.includes('TypeScript') ? 'schnorr' : 'schnorr', // TS engine supports anything
          proofType: 'identity_attribute',
          publicInputs: ['subject-123'],
          witness: 'attribute-value',
          verificationKeyId: 'vk-1',
        };

        const proof = await engine.generate(input);
        expect(proof.proof).toBeDefined();

        const isValid = await engine.verify(proof);
        expect(isValid).toBe(true);
      });

      it('should fail verification if public inputs are tampered', async () => {
        const input: ZkProofInput = {
          system: name.includes('TypeScript') ? 'schnorr' : 'schnorr',
          proofType: 'identity_attribute',
          publicInputs: ['subject-123'],
          witness: 'attribute-value',
          verificationKeyId: 'vk-1',
        };

        const proof = await engine.generate(input);

        // Tamper with public inputs
        const tamperedProof = {
          ...proof,
          publicInputs: ['subject-666'],
        };

        const isValid = await engine.verify(tamperedProof);
        expect(isValid).toBe(false);
      });

      it('should fail verification if proof bytes are tampered', async () => {
        const input: ZkProofInput = {
          system: name.includes('TypeScript') ? 'schnorr' : 'schnorr',
          proofType: 'identity_attribute',
          publicInputs: ['subject-123'],
          witness: 'attribute-value',
          verificationKeyId: 'vk-1',
        };

        const proof = await engine.generate(input);

        // Tamper with proof content (flip last character)
        const tamperedProof = {
          ...proof,
          proof:
            proof.proof.substring(0, proof.proof.length - 1) +
            (proof.proof.endsWith('A') ? 'B' : 'A'),
        };

        const isValid = await engine.verify(tamperedProof);
        expect(isValid).toBe(false);
      });
    });
  });
});
