[**GTCX Core API Reference**](../../README.md)

***

[GTCX Core API Reference](../../README.md) / @gtcx/connectivity

# @gtcx/connectivity

Network connectivity detection and profiling for offline-first applications.

## Installation

```bash
pnpm add @gtcx/connectivity
```

## Quick Start

```typescript
import { ConnectivityDetector, classifyProfile } from '@gtcx/connectivity';

const detector = new ConnectivityDetector();
const profile = classifyProfile(await detector.check());
```

## API

| Export                    | Description                   |
| ------------------------- | ----------------------------- |
| `ConnectivityDetector`    | Network state detector        |
| `classifyProfile(result)` | Classify connectivity profile |
| `ConnectivityState`       | Current state type            |

## Related

- [ADR-007: Offline-First Architecture](../../_media/007-offline-first-architecture.md)

## License

MIT

## Classes

- [ConnectivityDetector](classes/ConnectivityDetector.md)
- [RequestBatcher](classes/RequestBatcher.md)
- [UssdParseError](classes/UssdParseError.md)
- [UssdParser](classes/UssdParser.md)
- [UssdSession](classes/UssdSession.md)

## Interfaces

- [AdaptiveMode](interfaces/AdaptiveMode.md)
- [AdaptiveModeConfig](interfaces/AdaptiveModeConfig.md)
- [BatchRequest](interfaces/BatchRequest.md)
- [BatchResponse](interfaces/BatchResponse.md)
- [CompressedPayload](interfaces/CompressedPayload.md)
- [ConnectivityCheckResult](interfaces/ConnectivityCheckResult.md)
- [ConnectivityDetectorOptions](interfaces/ConnectivityDetectorOptions.md)
- [ConnectivityState](interfaces/ConnectivityState.md)
- [DownsampleConfig](interfaces/DownsampleConfig.md)
- [RequestBatcherOptions](interfaces/RequestBatcherOptions.md)
- [UssdParsedInput](interfaces/UssdParsedInput.md)
- [UssdRequest](interfaces/UssdRequest.md)
- [UssdResponse](interfaces/UssdResponse.md)
- [UssdSessionData](interfaces/UssdSessionData.md)
- [UssdSessionOptions](interfaces/UssdSessionOptions.md)

## Type Aliases

- [BatchFlushFn](type-aliases/BatchFlushFn.md)
- [ConnectivityCheckFn](type-aliases/ConnectivityCheckFn.md)
- [ConnectivityListener](type-aliases/ConnectivityListener.md)
- [ConnectivityProfile](type-aliases/ConnectivityProfile.md)
- [UssdSessionState](type-aliases/UssdSessionState.md)

## Variables

- [DEFAULT\_PROFILE\_CONFIG](variables/DEFAULT_PROFILE_CONFIG.md)

## Functions

- [adaptClientOptionsForProfile](functions/adaptClientOptionsForProfile.md)
- [classifyProfile](functions/classifyProfile.md)
- [compressPayload](functions/compressPayload.md)
- [createAdaptiveClientOptions](functions/createAdaptiveClientOptions.md)
- [createAdaptiveMode](functions/createAdaptiveMode.md)
- [createOfflineHandlerFromDetector](functions/createOfflineHandlerFromDetector.md)
- [decompressPayload](functions/decompressPayload.md)
- [downsampleConfig](functions/downsampleConfig.md)
- [shouldCompress](functions/shouldCompress.md)
- [shouldDownsample](functions/shouldDownsample.md)
