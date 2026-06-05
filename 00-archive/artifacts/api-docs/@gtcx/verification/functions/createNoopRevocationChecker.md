[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createNoopRevocationChecker

# ~~Function: createNoopRevocationChecker()~~

> **createNoopRevocationChecker**(): [`RevocationChecker`](../interfaces/RevocationChecker.md)

Defined in: [03-platform/packages/verification/src/certificates/revocation.ts:194](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/revocation.ts#L194)

Revocation checker that always reports "not revoked" for every certificate.

**DO NOT use in production.** This bypasses the entire revocation pathway
and silently reintroduces SA-004. Provided exclusively for tests where
revocation is out of scope. The function name and this docstring are the
load-bearing safeguards — there is no env-flag guard because tests need
to exercise the verify path without a network round-trip.

If you find yourself reaching for this in production code, the right
answer is `createDenyAllRevocationChecker()` until your real backend
is ready.

## Returns

[`RevocationChecker`](../interfaces/RevocationChecker.md)

## Deprecated

for production use only. Tests may use freely.
