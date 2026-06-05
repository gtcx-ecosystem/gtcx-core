# @gtcx/runtime

> **Maturity:** Beta — stable API, used in downstream repos, but not all edge cases hardened.
> **Coverage:** ~80%

Batteries-included runtime substrate that wires together `api-client`, `connectivity`, `resilience`, and `telemetry` into a single deployable runtime.

## Installation

```bash
pnpm add @gtcx/runtime
```

## Quick Start

```typescript
import { createRuntime } from '@gtcx/runtime';

const runtime = createRuntime({
  profile: 'edge',
  telemetry: true,
  resilience: { circuitBreaker: true, retry: true },
});

await runtime.start();
// ... use runtime.api, runtime.connectivity, etc.
await runtime.shutdown();
```

## API

| Export              | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `createRuntime()`   | Factory for the composed runtime                                   |
| `Runtime`           | Runtime interface with start/shutdown lifecycle                    |
| `RuntimeOptions`    | Configuration for profiles, telemetry, and resilience              |
| `DeploymentProfile` | Enum of supported deployment profiles (`edge`, `cloud`, `on-prem`) |

## License

MIT
