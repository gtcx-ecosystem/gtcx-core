# @gtcx/api-client

Unified API client for GTCX protocols and platforms. A resilient, offline-aware client SDK designed for Global South connectivity challenges with built-in retry logic, circuit breakers, and offline queue support.

## Overview

The API client provides a single entry point for interacting with all GTCX protocol and platform services. It handles the realities of frontier market connectivity — intermittent networks, high latency, and extended offline periods — through resilience patterns that operate transparently.

## Installation

```bash
pnpm add @gtcx/api-client
```

## Quick Start

```typescript
import { GTCXClient } from '@gtcx/api-client';

const client = new GTCXClient({
  baseUrl: 'https://api.gtcx.global',
  auth: {
    type: 'tradepass',
    credential: userCredential,
  },
});

// Protocol clients
const identity = await client.tradepass.getIdentity(userId);
const location = await client.geotag.verify(coordinates);
const score = await client.gci.getComplianceScore(entityId);

// Platform clients
const lots = await client.crx.listLots({ status: 'available' });
const trade = await client.agx.createTrade(tradeRequest);
```

## Low-Level Client (Sprint 3 Hardening)

The low-level `createApiClient` is now hardened for enterprise use with request signing, mTLS (Node.js), and structured error taxonomy.

```typescript
import { createApiClient } from '@gtcx/api-client';

const client = createApiClient({
  baseUrl: 'https://api.gtcx.global',
  signer: async ({ method, url }) => ({
    'x-gtcx-signature': signRequest(method, url),
  }),
  mtls: {
    cert: process.env.MTLS_CERT!,
    key: process.env.MTLS_KEY!,
  },
});
```

## Resilience Patterns

### Retry with Exponential Backoff

Automatically retries failed requests with increasing delays. Only retries on transient errors (5xx, network timeouts).

```typescript
const client = new GTCXClient({
  retry: {
    attempts: 3,
    baseDelay: 1000, // 1 second initial delay
    maxDelay: 30000, // 30 seconds maximum delay
    backoffFactor: 2, // Exponential multiplier
    retryCondition: (error) => error.status >= 500,
  },
});
```

### Circuit Breaker

Prevents cascade failures by failing fast when a service is unresponsive. The circuit opens after repeated failures and periodically tests whether the service has recovered.

```typescript
const client = new GTCXClient({
  circuitBreaker: {
    failureThreshold: 5, // Open circuit after 5 consecutive failures
    resetTimeout: 30000, // Attempt recovery after 30 seconds
    halfOpenRequests: 1, // Test with 1 request before fully closing
  },
});
```

| State     | Behavior                                             |
| --------- | ---------------------------------------------------- |
| Closed    | Requests flow normally; failures are counted         |
| Open      | Requests fail immediately with `CircuitOpenError`    |
| Half-Open | One test request allowed; success closes the circuit |

### Offline Queue

Queues requests when the device is offline and drains them automatically on reconnection. Integrates with `@gtcx/sync` for protocol-aware conflict resolution.

```typescript
const client = new GTCXClient({
  offline: {
    enabled: true,
    storage: AsyncStorage, // React Native AsyncStorage or equivalent
    maxQueueSize: 100,
    syncOnReconnect: true,
  },
});

// Requests are transparently queued when offline
await client.workproof.logAction(action);

// Manual sync trigger
const result = await client.sync();
```

## Authentication

### TradePass Credentials

Primary authentication method for end users. Credentials are signed by the user's TradePass identity and can operate offline for up to 72 hours.

```typescript
const client = new GTCXClient({
  auth: {
    type: 'tradepass',
    credential: {
      id: 'tp_123...',
      signature: '...',
    },
    onRefresh: async () => {
      return await refreshCredential();
    },
  },
});
```

### API Key (Server-to-Server)

For backend service integration where TradePass identity is not applicable.

```typescript
const client = new GTCXClient({
  auth: {
    type: 'apikey',
    key: process.env.GTCX_API_KEY,
  },
});
```

## Protocol Clients

| Client             | Protocol  | Description                                |
| ------------------ | --------- | ------------------------------------------ |
| `client.tradepass` | TradePass | Identity and credential operations         |
| `client.geotag`    | GeoTag    | Location verification and proof submission |
| `client.gci`       | GCI       | Compliance scoring and certification       |
| `client.vaultmark` | VaultMark | Custody chain verification                 |
| `client.pvp`       | PvP       | Payment-versus-payment settlement          |
| `client.panx`      | PANX      | Oracle consensus and price feeds           |

## Platform Clients

| Client            | Platform | Description                   |
| ----------------- | -------- | ----------------------------- |
| `client.crx`      | CRX      | Commodity regulatory exchange |
| `client.sgx`      | SGX      | Sovereign governance exchange |
| `client.agx`      | AGX      | Global commodity exchange     |
| `client.pathways` | Pathways | ASM capital access            |

## Error Handling

The client provides typed error classes for different failure modes:

```typescript
import { GTCXError, NetworkError, AuthError, CircuitOpenError } from '@gtcx/api-client';

try {
  await client.crx.createLot(lotData);
} catch (error) {
  if (error instanceof NetworkError) {
    // Device is offline — request has been queued
  } else if (error instanceof AuthError) {
    // Credential expired or invalid
    await refreshCredentials();
  } else if (error instanceof CircuitOpenError) {
    // Service is down — circuit breaker is open
  } else if (error instanceof GTCXError) {
    // API-level error (4xx response)
    console.log(error.code, error.message);
  }
}
```

Low-level client also exposes: `HttpError`, `NetworkError`, `TimeoutError`, `AuthError`, `SigningError`, `ConfigurationError`.

## Events

The client emits lifecycle events for observability:

```typescript
client.on('offline', () => {
  // Device lost connectivity — requests will be queued
});

client.on('online', () => {
  // Connectivity restored — queued requests draining
});

client.on('circuitOpen', (service) => {
  // Circuit breaker opened for a specific service
});

client.on('authExpired', () => {
  // Authentication credential has expired
});

client.on('syncComplete', (result) => {
  // Offline queue drain completed
});
```

## Configuration Reference

```typescript
interface GTCXClientConfig {
  baseUrl: string;
  auth: TradePassAuthConfig | ApiKeyAuthConfig;
  retry?: {
    attempts: number; // Default: 3
    baseDelay: number; // Default: 1000ms
    maxDelay: number; // Default: 30000ms
    backoffFactor: number; // Default: 2
    retryCondition?: (error: GTCXError) => boolean;
  };
  circuitBreaker?: {
    failureThreshold: number; // Default: 5
    resetTimeout: number; // Default: 30000ms
    halfOpenRequests: number; // Default: 1
  };
  offline?: {
    enabled: boolean; // Default: false
    storage: AsyncStorage; // Platform-specific storage
    maxQueueSize: number; // Default: 100
    syncOnReconnect: boolean; // Default: true
  };
  timeout?: number; // Request timeout in ms. Default: 30000
  headers?: Record<string, string>;
  logger?: Logger;
}
```

## Principle Alignment

| Principle         | Implementation                                                |
| ----------------- | ------------------------------------------------------------- |
| P2 Type Safety    | Typed protocol and platform clients with full IntelliSense    |
| P4 Composability  | Pluggable auth, storage, and logger via configuration         |
| P8 Offline-First  | Transparent request queuing with automatic drain on reconnect |
| P9 Security       | TradePass credential auth; API key auth for server-to-server  |
| P12 Observability | Lifecycle events for offline, circuit state, auth, and sync   |

## Related

- [@gtcx/sync](./sync.md) — Synchronization engine used for offline queue conflict resolution
- [@gtcx/events](./events.md) — Event bus that receives synced events from the offline queue
- [@gtcx/connectivity](./connectivity.md) — Network detection and connectivity profiles
- [@gtcx/security](./security.md) — Authentication tokens and session management
