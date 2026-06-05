[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/services](../README.md) / [](../README.md) / runHealthChecks

# Function: runHealthChecks()

> **runHealthChecks**(`deps?`): `Promise`\<[`HealthCheckResult`](../interfaces/HealthCheckResult.md)\>

Defined in: [03-platform/packages/services/03-platform/src/health.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/health.ts#L45)

Run health checks against service dependencies.

## Parameters

### deps?

[`HealthCheckDeps`](../interfaces/HealthCheckDeps.md) = `{}`

## Returns

`Promise`\<[`HealthCheckResult`](../interfaces/HealthCheckResult.md)\>

## Example

```ts
const result = await runHealthChecks({ storageService: myStorage });
if (result.status !== 'healthy') {
  // trigger alert or readiness probe failure
}
```
