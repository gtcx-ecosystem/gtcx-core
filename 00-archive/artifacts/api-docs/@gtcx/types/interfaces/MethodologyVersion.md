[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / MethodologyVersion

# Interface: MethodologyVersion

Defined in: [03-platform/packages/types/src/common/provenance.ts:64](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L64)

Versioned methodology descriptor so consumers can reason about
which framework, version, and configuration produced an output.

## Properties

### configurationHash

> **configurationHash**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:70](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L70)

Hash of the configuration that produced this output

***

### framework

> **framework**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:66](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L66)

Framework name (e.g. 'cortex', 'anisa', 'sentinel')

***

### version

> **version**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:68](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L68)

Semantic version of the framework
