import fc from 'fast-check';
import { describe, it } from 'vitest';

import { generateKeyPair } from '../src/keys';
import { sign, verify } from '../src/signing';

describe('Cryptographic Properties', () => {
  describe('Ed25519 Signatures', () => {
    it('should always verify a legitimately signed message', () => {
      fc.assert(
        fc.property(fc.uint8Array({ minLength: 1, maxLength: 1024 }), (messageBytes) => {
          const message = Buffer.from(messageBytes).toString('hex');
          const keyPair = generateKeyPair();
          const signature = sign(message, keyPair.privateKey);
          return verify(message, signature, keyPair.publicKey);
        }),
        { numRuns: 100 }
      );
    });

    it('should never verify a modified message', () => {
      fc.assert(
        fc.property(
          fc.uint8Array({ minLength: 1, maxLength: 512 }),
          fc.uint8Array({ minLength: 1, maxLength: 512 }),
          (messageBytes, differentMessageBytes) => {
            fc.pre(Buffer.compare(messageBytes, differentMessageBytes) !== 0);

            const message = Buffer.from(messageBytes).toString('hex');
            const differentMessage = Buffer.from(differentMessageBytes).toString('hex');

            const keyPair = generateKeyPair();
            const signature = sign(message, keyPair.privateKey);

            return !verify(differentMessage, signature, keyPair.publicKey);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
