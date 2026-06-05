[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / HealthResponse

# Interface: HealthResponse

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:69](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L69)

Health check response

## Properties

### checks

> **checks**: [`HealthCheck`](HealthCheck.md)[]

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:73](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L73)

***

### status

> **status**: `"healthy"` \| `"degraded"` \| `"unhealthy"`

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:70](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L70)

***

### uptime

> **uptime**: `number`

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:72](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L72)

***

### version

> **version**: `string`

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:71](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L71)
