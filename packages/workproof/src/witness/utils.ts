import { hash256, generateSalt } from '@gtcx/crypto';

/** SHA-256 digest as 32-byte hex (64 chars), no prefix. */
export function digestHex32(input: string): string {
  return hash256(input);
}

/** 32-byte hex from `generateSalt()`. */
export function randomnessHex32(): string {
  return generateSalt(32);
}

export interface GpsCoordinates {
  lat: number;
  lon: number;
}

/** Parse GPS from WorkProof evidence item metadata. */
export function parseGpsFromEvidenceMetadata(
  metadata: Record<string, unknown> | undefined
): GpsCoordinates | undefined {
  if (!metadata) return undefined;
  const lat = readCoord(metadata, 'latitude', 'lat');
  const lon = readCoord(metadata, 'longitude', 'lon', 'lng');
  if (lat === undefined || lon === undefined) return undefined;
  return { lat, lon };
}

function readCoord(metadata: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const v = metadata[key];
    if (typeof v === 'number' && Number.isFinite(v)) return v;
  }
  return undefined;
}

/** Map commodity label to circuit `commodity_type` (matches Rust samples). */
export function commodityTypeFromLabel(commodity: string): number {
  const normalized = commodity.trim().toLowerCase();
  if (normalized === 'gold') return 0;
  if (normalized === 'diamond' || normalized === 'diamonds') return 1;
  if (normalized === 'cocoa') return 2;
  return 0;
}

/** Encode decimal degrees as u64 fixed-point (micro-degrees). */
export function coordToCircuitU64(degrees: number): number {
  return Math.round(degrees * 1_000_000);
}
