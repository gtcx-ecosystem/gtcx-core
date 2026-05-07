/**
 * Pricing adjustment calculations.
 */

import type { AssetLot, Location, QualityGrade } from '@gtcx/domain';

/** Get form-specific price adjustment. */
export function getFormPriceAdjustment(form: string): number {
  const adjustments: Record<string, number> = {
    raw: 0.7,
    processed: 0.85,
    refined: 1.0,
    premium: 1.1,
  };
  return adjustments[form.toLowerCase()] ?? 0.8;
}

/** Calculate purity adjustment factor. */
export function calculatePurityAdjustment(purity?: number): number {
  if (!purity) return 1.0;
  return purity / 100;
}

/** Calculate quality premium. */
export function calculateQualityPremium(assetLot: AssetLot): number {
  const premiums: Record<QualityGrade, number> = {
    A: 50,
    B: 25,
    C: 0,
    D: -25,
    ungraded: 0,
  };
  return premiums[assetLot.qualityGrade ?? 'ungraded'] ?? 0;
}

/** Calculate location-based price factor. */
export async function calculateLocationFactor(_location: Location): Promise<number> {
  return 1.0;
}
