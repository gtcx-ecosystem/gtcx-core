[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / deriveKeyPbkdf2

# Function: deriveKeyPbkdf2()

> **deriveKeyPbkdf2**(`params`): `Promise`\<`string`\>

Defined in: [key-derivation.ts:64](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/key-derivation.ts#L64)

PBKDF2-HMAC-SHA256 key derivation. Returns hex-encoded derived key.

Tuned for short, low-entropy inputs (e.g. 6-digit PINs) where a high
iteration count is the only useful cost lever against brute-force.

Implementation uses the runtime's `crypto.subtle.deriveBits` via WebCrypto,
which is available in Node 20+ (where it routes through OpenSSL/aws-lc-rs
and is therefore FIPS-compatible under our existing FIPS validation, CMVP
#4816) and in every supported browser. If `crypto.subtle.deriveBits` is
unavailable, this throws a typed `Error` at call time — there is no
non-PBKDF2-spec fallback in the canonical package, by deliberate choice:
a silent fallback to iterated SHA-256 would not produce RFC 7914 §11
outputs and would create a regulator-visible discrepancy between consumers.

**Runtime requirements:**

- Node 20+ — `globalThis.crypto.subtle` is built in; no action required.
- Modern browsers — WebCrypto is built in; no action required.
- **React Native (Hermes via Expo)** — WebCrypto is NOT shipped by default.
  Install a polyfill that populates `globalThis.crypto.subtle` before any
  call into this function. Recommended: `react-native-quick-crypto` (full
  WebCrypto surface). Import the polyfill at app boot (e.g. in your root
  `_layout.tsx`) so `subtle.importKey` and `subtle.deriveBits` resolve.
  Validate with the RFC 7914 §11 test vectors in
  `03-platform/packages/crypto/tests/key-derivation.test.ts` from the RN runtime
  before relying on this in production.
- Older Node / restricted environments — call may throw; either upgrade
  the runtime or pre-validate with `globalThis.crypto?.subtle?.deriveBits`.

## Parameters

### params

[`Pbkdf2Params`](../interfaces/Pbkdf2Params.md)

## Returns

`Promise`\<`string`\>

## Throws

TypeError when params are invalid (non-positive iterations, non-byte-aligned key length, etc.)

## Throws

Error when `crypto.subtle.deriveBits` is unavailable in the runtime

## Example

```ts
import { deriveKeyPbkdf2 } from '@gtcx/crypto';
const hex = await deriveKeyPbkdf2({
  password: 'pin:123456:did:gtcx:tp_abc',
  salt: 'did:gtcx:tp_abc',
  iterations: 100_000,
  keyLengthBits: 256,
});
// hex is 64 chars (256 bits / 4 bits per hex char)
```
