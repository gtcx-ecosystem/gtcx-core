import { describe, expect, it } from 'vitest';

import { hash256 } from '../src/hashing';

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randomAscii(next: () => number, maxLength: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789:/-_.#@';
  const len = Math.floor(next() * (maxLength + 1));
  let out = '';
  for (let i = 0; i < len; i++) {
    out += alphabet[Math.floor(next() * alphabet.length)];
  }
  return out;
}

describe('hash256 property checks', () => {
  it('is deterministic across randomized payloads', () => {
    const next = mulberry32(0x5eed1234);

    for (let i = 0; i < 500; i++) {
      const payload = randomAscii(next, 1024);
      const h1 = hash256(payload);
      const h2 = hash256(payload);
      expect(h1).toBe(h2);
    }
  });

  it('changes when payload changes by a suffix byte', () => {
    const next = mulberry32(0x5eed1234);

    for (let i = 0; i < 300; i++) {
      const payload = randomAscii(next, 1024);
      const modified = `${payload}|x`;
      expect(hash256(payload)).not.toBe(hash256(modified));
    }
  });
});
