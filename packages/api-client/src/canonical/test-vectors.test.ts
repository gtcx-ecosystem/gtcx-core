/**
 * Locked test vector validation for the canonical signing contract.
 *
 * These tests validate that the implementation produces the exact
 * outputs defined in test-vectors.json. If any test here fails,
 * the contract has drifted and downstream consumers (mobile,
 * protocols, infra) will break.
 *
 * Downstream teams: import test-vectors.json and run the same
 * assertions in your language/framework of choice.
 */

import { describe, it, expect } from 'vitest';

import vectors from './test-vectors.json';

import {
  canonicalizePath,
  canonicalizeQueryString,
  canonicalizeBody,
  normalizeBodyForHash,
  formatDID,
  formatKeyId,
  parseEnvelope,
  buildCanonicalRequest,
} from './index';

describe('locked test vectors', () => {
  describe('canonicalizePath', () => {
    for (const vector of vectors.vectors.canonicalizePath) {
      it(vector.id, () => {
        expect(canonicalizePath(vector.input)).toBe(vector.expected);
      });
    }
  });

  describe('canonicalizeQueryString', () => {
    for (const vector of vectors.vectors.canonicalizeQueryString) {
      it(vector.id, () => {
        expect(canonicalizeQueryString(vector.input)).toBe(vector.expected);
      });
    }
  });

  describe('canonicalizeBody', () => {
    for (const vector of vectors.vectors.canonicalizeBody) {
      it(vector.id, () => {
        const input = vector.input === null ? null : (vector.input as string);
        expect(canonicalizeBody(input)).toBe(vector.expected);
      });
    }
  });

  describe('normalizeBodyForHash', () => {
    for (const vector of vectors.vectors.normalizeBodyForHash) {
      it(vector.id, () => {
        expect(normalizeBodyForHash(vector.input)).toBe(vector.expected);
      });
    }
  });

  describe('formatDID', () => {
    for (const vector of vectors.vectors.formatDID) {
      it(vector.id, () => {
        expect(formatDID(vector.publicKeyHex)).toBe(vector.expected);
      });
    }
  });

  describe('formatKeyId', () => {
    for (const vector of vectors.vectors.formatKeyId) {
      it(vector.id, () => {
        expect(formatKeyId(vector.did, vector.keyRef ?? undefined)).toBe(vector.expected);
      });
    }
  });

  describe('buildCanonicalRequest', () => {
    for (const vector of vectors.vectors.buildCanonicalRequest) {
      it(vector.id, () => {
        const result = buildCanonicalRequest(
          vector.context as {
            method: string;
            url: string;
            headers: Record<string, string>;
            body: string | null;
          },
          vector.did,
          vector.keyId,
          vector.timestamp,
          vector.nonce,
          vector.audience
        );
        expect(result.canonical).toBe(vector.expectedCanonical);
        expect(result.canonicalHash).toBe(vector.expectedCanonicalHash);
      });
    }
  });

  describe('envelope', () => {
    for (const vector of vectors.vectors.envelope) {
      it(vector.id, () => {
        expect(parseEnvelope(vector.wire)).toEqual(vector.expected);
      });
    }
  });
});
