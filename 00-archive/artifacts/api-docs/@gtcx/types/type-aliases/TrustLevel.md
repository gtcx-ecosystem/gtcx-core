[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / TrustLevel

# Type Alias: TrustLevel

> **TrustLevel** = `"verified"` \| `"tentative"` \| `"uncertain"` \| `"rejected"`

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:18](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L18)

Trust level assigned to an AI-derived output.

- verified:   High confidence, complete evidence, no degradation
- tentative:  Moderate confidence or partial evidence
- uncertain:  Low confidence, stale data, or model uncertainty
- rejected:   Below minimum threshold or policy violation
