[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createDenyAllRevocationChecker

# Function: createDenyAllRevocationChecker()

> **createDenyAllRevocationChecker**(`reason?`): [`RevocationChecker`](../interfaces/RevocationChecker.md)

Defined in: [03-platform/packages/verification/src/certificates/revocation.ts:171](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/revocation.ts#L171)

Revocation checker that always reports "revoked" for every certificate.

Use during incident response when the real revocation backend cannot be
trusted, or as the default in environments where revocation is mandatory
but no backend is yet wired up. Fail-closed by construction.

## Parameters

### reason?

`string` = `'deny-all checker active'`

## Returns

[`RevocationChecker`](../interfaces/RevocationChecker.md)
