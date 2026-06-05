import type { ConnectivityProfile } from './types.js';

/**
 * Classify a connectivity profile based on bandwidth and latency measurements.
 *
 * Profile thresholds (matching architecture docs):
 * | Profile    | Bandwidth      | Latency  |
 * |------------|--------------- |----------|
 * | offline    | 0              | -        |
 * | ussd-only  | <1 Kbps        | -        |
 * | satellite  | <512 Kbps      | >500ms   |
 * | edge       | <200 Kbps      | -        |
 * | degraded   | 1-5 Mbps       | -        |
 * | standard   | >5 Mbps        | <200ms   |
 *
 * Note: satellite is checked before edge/degraded because it is
 * distinguished by high latency combined with low bandwidth.
 */
export function classifyProfile(bandwidthKbps: number, latencyMs: number): ConnectivityProfile {
  // No bandwidth means offline
  if (bandwidthKbps <= 0) {
    return 'offline';
  }

  // Very low bandwidth — USSD-only territory
  if (bandwidthKbps < 1) {
    return 'ussd-only';
  }

  // Satellite: low bandwidth + high latency
  if (bandwidthKbps < 512 && latencyMs > 500) {
    return 'satellite';
  }

  // Edge: low bandwidth (but not satellite-level latency)
  if (bandwidthKbps < 200) {
    return 'edge';
  }

  // Standard: high bandwidth + low latency (>5 Mbps = >5000 Kbps)
  if (bandwidthKbps > 5000 && latencyMs < 200) {
    return 'standard';
  }

  // Degraded: everything else (moderate bandwidth, or high bandwidth with high latency)
  return 'degraded';
}
