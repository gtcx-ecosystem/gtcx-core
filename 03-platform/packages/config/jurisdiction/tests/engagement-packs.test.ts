/**
 * DTF-5.5.1 — Strict Zod CI for five engagement jurisdiction packs (ZW, GH, NA, BW, CD).
 */

import { describe, expect, it } from 'vitest';

import { ENGAGEMENT_JURISDICTIONS } from '../../../../tests/integration/fixtures/jurisdiction-fixtures';
import { EngagementJurisdictionPackSchema, JurisdictionConfigSchema } from '../src';

describe('Engagement jurisdiction packs (DTF-5.5.1 strict CI)', () => {
  for (const { code, name, fixture } of ENGAGEMENT_JURISDICTIONS) {
    it(`${code} (${name}) — passes EngagementJurisdictionPackSchema`, () => {
      const config = fixture();
      const result = EngagementJurisdictionPackSchema.safeParse(config);
      if (!result.success) {
        throw new Error(
          `${code} engagement pack failed:\n${JSON.stringify(result.error.issues, null, 2)}`
        );
      }
      expect(result.data.zkp.defaultProfileId).toBeDefined();
      expect(result.data.zkp.packs.length).toBeGreaterThan(0);
    });

    it(`${code} (${name}) — rejects unknown top-level keys (strict)`, () => {
      const config = fixture();
      const result = EngagementJurisdictionPackSchema.safeParse({
        ...config,
        unexpectedTier5Field: true,
      });
      expect(result.success).toBe(false);
    });

    it(`${code} (${name}) — default profile is listed in packs`, () => {
      const config = fixture();
      const parsed = EngagementJurisdictionPackSchema.parse(config);
      const ids = parsed.zkp.packs.map((p) => p.profileId);
      expect(ids).toContain(parsed.zkp.defaultProfileId);
    });
  }
});

describe('JurisdictionConfigSchema strict mode', () => {
  it('rejects unknown keys on otherwise valid-shaped objects', () => {
    const minimal = {
      unexpected: true,
    };
    const result = JurisdictionConfigSchema.safeParse(minimal);
    expect(result.success).toBe(false);
  });
});
