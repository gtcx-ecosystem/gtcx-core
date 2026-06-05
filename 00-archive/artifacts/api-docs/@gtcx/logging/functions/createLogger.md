[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/logging](../README.md) / createLogger

# Function: createLogger()

> **createLogger**(`config`): [`Logger`](../classes/Logger.md)

Defined in: [logger.ts:249](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L249)

Factory function for creating a Logger instance.

## Parameters

### config

[`LoggerConfig`](../interfaces/LoggerConfig.md)

## Returns

[`Logger`](../classes/Logger.md)

## Example

```ts
const logger = createLogger({ service: 'api-gateway' });
logger.info('Server started', { port: 3000 });
```
