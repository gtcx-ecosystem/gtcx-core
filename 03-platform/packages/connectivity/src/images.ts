import type { ConnectivityProfile } from './types.js';

export interface DownsampleConfig {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
}

const LOW_BANDWIDTH_PROFILES: readonly ConnectivityProfile[] = ['edge', 'ussd-only', 'satellite'];

/** Determine whether image downsampling should be used for a profile. */
export function shouldDownsample(profile: ConnectivityProfile): boolean {
  return LOW_BANDWIDTH_PROFILES.includes(profile);
}

/**
 * Return downsampling parameters for a given profile.
 *
 * | Profile    | maxWidth | maxHeight | quality | format |
 * |------------|----------|-----------|---------|--------|
 * | edge       | 640      | 480       | 0.6     | jpeg   |
 * | ussd-only  | 320      | 240       | 0.4     | jpeg   |
 * | satellite  | 480      | 360       | 0.5     | jpeg   |
 * | other      | Infinity | Infinity  | 1.0     | jpeg   |
 */
export function downsampleConfig(profile: ConnectivityProfile): DownsampleConfig {
  switch (profile) {
    case 'edge':
      return { maxWidth: 640, maxHeight: 480, quality: 0.6, format: 'jpeg' };
    case 'ussd-only':
      return { maxWidth: 320, maxHeight: 240, quality: 0.4, format: 'jpeg' };
    case 'satellite':
      return { maxWidth: 480, maxHeight: 360, quality: 0.5, format: 'jpeg' };
    default:
      return {
        maxWidth: Number.POSITIVE_INFINITY,
        maxHeight: Number.POSITIVE_INFINITY,
        quality: 1.0,
        format: 'jpeg',
      };
  }
}
