import { describe, it, expect } from 'vitest';

import {
  GH_GOLD_ORIGIN_PROFILE,
  profileById,
  certificationMaskSatisfied,
  CertificationBit,
  certificationBitMask,
} from '../src/circuit-profiles';

describe('circuit profiles', () => {
  it('gh-gold-origin maps to CommodityOrigin underlying circuit', () => {
    expect(GH_GOLD_ORIGIN_PROFILE.profileId).toBe('gh-gold-origin');
    expect(GH_GOLD_ORIGIN_PROFILE.underlyingCircuit).toBe('CommodityOrigin');
    expect(GH_GOLD_ORIGIN_PROFILE.commodityType).toBe(0);
  });

  it('requires regulatory export license bit in certification mask', () => {
    const mask = GH_GOLD_ORIGIN_PROFILE.requiredCertificationMask;
    expect(mask).toBe(certificationBitMask(CertificationBit.RegulatoryExportLicense));
    expect(certificationMaskSatisfied(mask, mask)).toBe(true);
    expect(certificationMaskSatisfied(0, mask)).toBe(false);
  });

  it('profile registry resolves by id', () => {
    const p = profileById('gh-gold-origin');
    expect(p.jurisdictionCode).toBe('GH');
    expect(p.bounds[0]).toBeLessThan(p.bounds[1]);
  });
});
