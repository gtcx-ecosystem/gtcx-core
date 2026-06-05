[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createInMemoryRevocationChecker

# Function: createInMemoryRevocationChecker()

> **createInMemoryRevocationChecker**(): [`RevocationChecker`](../interfaces/RevocationChecker.md)

Defined in: [03-platform/packages/verification/03-platform/src/certificates/revocation.ts:158](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/certificates/revocation.ts#L158)

In-memory revocation checker backed by the singleton [RevocationRegistry](../certificates/classes/RevocationRegistry.md).

Suitable for testing and single-process environments. Not durable — registry
state is lost on process restart. Production deployments must supply their
own [RevocationChecker](../interfaces/RevocationChecker.md) that consults a persistent source.

## Returns

[`RevocationChecker`](../interfaces/RevocationChecker.md)
