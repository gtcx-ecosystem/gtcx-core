/**
 * Integration: per-jurisdiction config validation + end-to-end signing
 * pipeline for the 5 imminent engagement target states (Zimbabwe, Ghana,
 * Namibia, Botswana, DR Congo).
 *
 * Sprint 3 task 3.1 of the engagement-readiness roadmap. Proves the
 * foundation surface is jurisdiction-agnostic — the same crypto primitives
 * sign and verify identically regardless of which jurisdiction config is
 * loaded — and that each of the 5 configs validates cleanly against
 * `JurisdictionConfigSchema`.
 *
 * Fixture configs ship under `fixtures/jurisdiction-fixtures.ts`. They are
 * not production regulator-grade configs — see fixture file header.
 */

import { sign, verify, generateKeyPair, hash256 } from '@gtcx/crypto';
import {
  EngagementJurisdictionPackSchema,
  JurisdictionConfigSchema,
} from '@gtcx/jurisdiction-config';
import { describe, it, expect } from 'vitest';

import { ENGAGEMENT_JURISDICTIONS } from './fixtures/jurisdiction-fixtures';

describe('Jurisdiction config validation', () => {
  for (const { code, name, fixture } of ENGAGEMENT_JURISDICTIONS) {
    it(`${code} (${name}) — fixture passes strict EngagementJurisdictionPackSchema`, () => {
      const config = fixture();
      const result = EngagementJurisdictionPackSchema.safeParse(config);
      if (!result.success) {
        throw new Error(
          `${code} config failed schema validation:\n${JSON.stringify(result.error.issues, null, 2)}`
        );
      }
      expect(result.success).toBe(true);
      expect(JurisdictionConfigSchema.safeParse(config).success).toBe(true);
    });

    it(`${code} (${name}) — identity section has matching ISO codes`, () => {
      const config = fixture();
      expect(config.identity.countryCode).toBe(code);
      expect(config.identity.countryCode3).toHaveLength(3);
      expect(config.identity.region).toMatch(/_africa$/);
    });
  }
});

describe('Jurisdiction-agnostic crypto pipeline', () => {
  /**
   * Same crypto primitives sign and verify identically for every
   * jurisdiction. This proves the foundation library is independent of
   * jurisdiction policy — country-specific business logic happens above
   * the crypto layer.
   */
  for (const { code, name, fixture } of ENGAGEMENT_JURISDICTIONS) {
    it(`${code} (${name}) — end-to-end sign and verify with jurisdiction-tagged payload`, () => {
      const config = fixture();

      // Tag the message with the jurisdiction identity so each test exercises
      // distinct bytes through the crypto pipeline.
      const payload = new TextEncoder().encode(
        JSON.stringify({
          jurisdiction: config.identity.countryCode,
          regulator: config.regulatory.primaryAuthority.abbreviation,
          currency: config.financial.currency.code,
          ts: 1700000000000,
        })
      );

      // Generate a keypair, sign the payload, verify it round-trips.
      const keyPair = generateKeyPair();
      const signature = sign(payload, keyPair.privateKey);
      const ok = verify(payload, signature, keyPair.publicKey);

      expect(ok).toBe(true);

      // Tampering with the payload (any byte) must invalidate the signature.
      const tampered = new Uint8Array(payload);
      tampered[0] = (tampered[0] ?? 0) ^ 0x01;
      const okTampered = verify(tampered, signature, keyPair.publicKey);
      expect(okTampered).toBe(false);
    });

    it(`${code} (${name}) — hash of jurisdiction config is deterministic`, () => {
      const config = fixture();
      const serialized = new TextEncoder().encode(JSON.stringify(config));
      const h1 = hash256(serialized);
      const h2 = hash256(serialized);
      expect(h1).toBe(h2);
      expect(h1).toMatch(/^[0-9a-f]{64}$/);
    });
  }

  it('produces distinct config hashes across all 5 jurisdictions', () => {
    const hashes = new Set<string>();
    for (const { fixture } of ENGAGEMENT_JURISDICTIONS) {
      const config = fixture();
      const serialized = new TextEncoder().encode(JSON.stringify(config));
      hashes.add(hash256(serialized));
    }
    expect(hashes.size).toBe(ENGAGEMENT_JURISDICTIONS.length);
  });
});
