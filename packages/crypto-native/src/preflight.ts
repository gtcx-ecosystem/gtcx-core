/**
 * @gtcx/crypto-native - Pre-flight Compatibility Check
 *
 * Verifies that the native cryptographic bindings are correctly loaded
 * and functional on the current system architecture.
 */

import { nativeBindings, sha256, generateKeyPair, sign, verify } from './index';

export interface PreflightResult {
  ok: boolean;
  platform: string;
  arch: string;
  version?: string;
  checks: {
    load: boolean;
    hashing: boolean;
    signing: boolean;
  };
  error?: string;
}

/**
 * Execute a battery of cryptographic tests against the native backend.
 */
export async function runPreflightCheck(): Promise<PreflightResult> {
  const result: PreflightResult = {
    ok: false,
    platform: process.platform,
    arch: process.arch,
    checks: {
      load: false,
      hashing: false,
      signing: false,
    },
  };

  try {
    // 1. Verify basic loading
    result.checks.load = !!nativeBindings;
    result.version =
      typeof nativeBindings.version === 'function' ? nativeBindings.version() : 'unknown';

    // 2. Verify hashing (Deterministic)
    const testData = new TextEncoder().encode('gtcx-preflight-test');
    const hash = sha256(testData);
    // Expected SHA-256 for 'gtcx-preflight-test'
    const expected = '8e5e94b087094208a38ec2d8291410427c593630f9a265c197945037d6e6f663';
    result.checks.hashing = hash === expected;

    // 3. Verify signing (Round-trip)
    const keyPair = generateKeyPair();
    const message = new TextEncoder().encode('gtcx-signature-test');
    const signature = sign(message, keyPair.privateKey);
    result.checks.signing = verify(signature, message, keyPair.publicKey);

    result.ok = result.checks.load && result.checks.hashing && result.checks.signing;
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
    result.ok = false;
  }

  return result;
}

/**
 * CLI Entry point
 */
if (require.main === module) {
  runPreflightCheck().then((result) => {
    if (result.ok) {
      process.stdout.write('✅ GTCX Native Pre-flight PASSED\n');
      process.stdout.write(`   Platform: ${result.platform} (${result.arch})\n`);
      process.stdout.write(`   Version:  ${result.version}\n`);
      process.exit(0);
    } else {
      process.stderr.write('❌ GTCX Native Pre-flight FAILED\n');
      process.stderr.write(`   Error: ${result.error}\n`);
      process.stdout.write('   Check Details:\n');
      process.stdout.write(`   - Load:    ${result.checks.load ? 'PASS' : 'FAIL'}\n`);
      process.stdout.write(`   - Hashing: ${result.checks.hashing ? 'PASS' : 'FAIL'}\n`);
      process.stdout.write(`   - Signing: ${result.checks.signing ? 'PASS' : 'FAIL'}\n`);
      process.exit(1);
    }
  });
}
