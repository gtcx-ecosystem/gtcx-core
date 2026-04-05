/**
 * FIPS 140-2/3 Compliance Mode
 *
 * When `GTCX_FIPS_MODE=true`, the crypto module restricts operations
 * to FIPS-validated algorithms only:
 *
 * - Signing: Secp256k1 ECDSA (FIPS 186-4) instead of Ed25519
 * - Hashing: SHA-256/SHA-512 only (FIPS 180-4) — no Blake3
 * - RNG: OS CSPRNG (SP 800-90A) — already the default
 * - ZKP: Allowed but logged as non-FIPS operations
 *
 * This does NOT make the module a FIPS-validated cryptographic module.
 * It restricts algorithm selection to FIPS-approved algorithms so that
 * a FIPS-validated backend (OpenSSL FIPS provider, AWS-LC-FIPS) can be
 * used at the platform level.
 *
 * @see _sop/2-docs/3-engineering/7-security/fips-assessment.md
 */

let _fipsMode: boolean | undefined;

/**
 * Check if FIPS mode is enabled.
 *
 * Reads `GTCX_FIPS_MODE` environment variable on first call and caches the result.
 */
export function isFipsMode(): boolean {
  if (_fipsMode === undefined) {
    _fipsMode = typeof process !== 'undefined' && process.env?.['GTCX_FIPS_MODE'] === 'true';
  }
  return _fipsMode;
}

/**
 * Log a warning when a non-FIPS algorithm is used in FIPS mode.
 * Only logs once per algorithm to avoid noise.
 */
/**
 * Reset the cached FIPS mode flag. For testing only.
 */
export function resetFipsMode(): void {
  _fipsMode = undefined;
}

const warned = new Set<string>();

export function fipsWarn(algorithm: string, alternative: string): void {
  if (!isFipsMode()) return;
  if (warned.has(algorithm)) return;
  warned.add(algorithm);
  if (typeof console !== 'undefined') {
    console.warn(
      `[gtcx/crypto] FIPS mode: ${algorithm} is not FIPS-validated. Use ${alternative} for FIPS compliance.`
    );
  }
}
