import { describe, it, expect } from 'vitest';

import { sanitizeString } from '../src/validation/sanitize';

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randomString(next: () => number, minLen: number, maxLen: number): string {
  const chars = [
    ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    '<',
    '>',
    '"',
    "'",
    '&',
    '/',
    '\\',
    '\u0000',
    '\u0007',
    '\u001f',
    '\u007f',
    '\n',
    '\t',
    '\r',
  ];
  const len = Math.floor(next() * (maxLen - minLen + 1)) + minLen;
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(next() * chars.length)];
  }
  return out;
}

describe('sanitizeString fuzz invariants', () => {
  it('removes tags and disallowed control characters across randomized inputs', () => {
    const next = mulberry32(0xc0ffee);
    const htmlTagRegex = /<[^>]+>/;
    const hasDisallowedControlChar = (value: string): boolean => {
      for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);
        if (
          (code <= 8 || (code >= 11 && code <= 12) || (code >= 14 && code <= 31) || code === 127) &&
          code >= 0
        ) {
          return true;
        }
      }
      return false;
    };

    for (let i = 0; i < 500; i++) {
      const input = randomString(next, 1, 128);
      const sanitized = sanitizeString(input);

      expect(htmlTagRegex.test(sanitized)).toBe(false);
      expect(hasDisallowedControlChar(sanitized)).toBe(false);
      expect(sanitized.length).toBeLessThanOrEqual(10000);
    }
  });
});
