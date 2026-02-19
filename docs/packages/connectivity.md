# @gtcx/connectivity

Adaptive connectivity profiles and sync strategies for frontier market operations.

## Overview

This package implements:

- **ADR-0016**: Connectivity Profiles Over Binary Online/Offline
- **ADR-0019**: USSD as First-Class Channel

Rather than binary online/offline, GTCX recognizes 6 distinct connectivity profiles that reflect frontier market realities.

## Installation

```bash
pnpm add @gtcx/connectivity
```

## Quick Start

```typescript
import {
  useConnectivity,
  SYNC_STRATEGIES,
  USSDGateway,
  RateLimiter,
  connectivityLogger,
  validateMSISDN,
} from '@gtcx/connectivity';

// React Native hook
const { profile, isConnected, strategy } = useConnectivity();

// USSD Gateway with security
const limiter = new RateLimiter({ maxRequests: 10, windowMs: 60000 });
const gateway = new USSDGateway({
  telco: 'MTN',
  serviceCode: '*384#',
});

// Structured logging (P5 + P12)
connectivityLogger.info('ussd.request_received', 'Processing USSD', {
  serviceCode: '*384*1#',
});
```

## Connectivity Profiles

| Profile     | Bandwidth | Latency  | Use Case                  |
| ----------- | --------- | -------- | ------------------------- |
| `offline`   | 0         | ∞        | Rural mine, no signal     |
| `ussd-only` | 140 bytes | —        | Feature phone (40% users) |
| `edge`      | <200 Kbps | High     | 2G/EDGE coverage          |
| `degraded`  | 1-5 Mbps  | Variable | 3G intermittent           |
| `standard`  | >5 Mbps   | Low      | 4G/WiFi                   |
| `satellite` | 512 Kbps  | 500ms+   | Remote sites              |

### Sync Strategies

Each profile has a configured sync strategy:

```typescript
import { SYNC_STRATEGIES, getProfileStrategy } from '@gtcx/connectivity';

const strategy = getProfileStrategy('edge');
// {
//   batchSize: 5,
//   maxPayloadBytes: 10240,
//   compressionLevel: 2,
//   syncInterval: 30000,
//   priorityThreshold: 'high',
// }
```

## USSD Gateway

USSD service codes for feature phone users (40% of target market):

| Code      | Function           |
| --------- | ------------------ |
| `*384*1#` | Balance & Status   |
| `*384*2#` | Verify Lot         |
| `*384*3#` | Record Sale        |
| `*384*4#` | Price Check        |
| `*384*5#` | Help               |
| `*384*0#` | Language Selection |

### Languages Supported

- 🇬🇧 English (EN)
- 🇫🇷 French (FR)
- 🇹🇿 Swahili (SW)
- 🇳🇬 Hausa (HA)
- 🇬🇭 Twi (TW)
- 🇵🇹 Portuguese (PT)

### Example: USSD Gateway with Security

```typescript
import {
  USSDGateway,
  RateLimiter,
  validateMSISDN,
  sanitizeUSSDInput,
  connectivityLogger,
} from '@gtcx/connectivity';

// Rate limiter (10 requests/minute per MSISDN)
const limiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000,
});

// Create gateway
const gateway = new USSDGateway({
  telco: 'MTN',
  serviceCode: '*384#',
  tradePassLookup: async (msisdn) => {
    // Validate before lookup
    const validMsisdn = validateMSISDN(msisdn);
    return tradePassService.findByPhone(validMsisdn);
  },
});

// Handle request with rate limiting
async function handleUSSD(request: USSDRequest) {
  // Rate limit check
  if (!limiter.hit(request.msisdn)) {
    return { text: 'Too many requests. Try again later.', continueSession: false };
  }

  // Sanitize input
  const sanitizedRequest = {
    ...request,
    text: sanitizeUSSDInput(request.text),
  };

  // Process
  return gateway.handleRequest(sanitizedRequest);
}
```

## Observability (P12)

### Structured Logging

```typescript
import { connectivityLogger, hashMSISDN } from '@gtcx/connectivity';

// Always hash PII before logging
connectivityLogger.info('ussd.session_created', 'New USSD session', {
  msisdnHash: hashMSISDN('+233201234567'), // '***4567 (13 digits)'
  serviceCode: '*384*1#',
});

// Timed operations
const result = await connectivityLogger.timed(
  'sync.completed',
  'Batch sync completed',
  () => uploadBatch(items),
  { batchSize: items.length }
);
// Automatically logs durationMs
```

### Metrics

```typescript
import { connectivityMetrics } from '@gtcx/connectivity';

// Increment counters
connectivityMetrics.inc('ussd_requests_total', { serviceCode: '1' });
connectivityMetrics.inc('profile_changes_total', { from: 'edge', to: 'standard' });

// Get metrics for export
const allMetrics = connectivityMetrics.getAll();
```

### Security Audit Events

```typescript
import { emitSecurityAudit, registerSecurityHandler } from '@gtcx/connectivity';

// Register handler for security events
registerSecurityHandler((event) => {
  // Send to SIEM, alert system, etc.
  securityService.log(event);
});

// Events are automatically emitted for:
// - Rate limit exceeded
// - Invalid MSISDN attempts
// - Session hijack attempts
// - Suspicious input
```

## Security (P9)

### MSISDN Validation

```typescript
import { validateMSISDN, normalizeMSISDN } from '@gtcx/connectivity';

// Validate E.164 format
const valid = validateMSISDN('+233201234567'); // OK
validateMSISDN('abc'); // Throws ZodError

// Normalize with default country code
const normalized = normalizeMSISDN('0201234567', '233');
// '+233201234567'
```

### Rate Limiting

```typescript
import { RateLimiter, DEFAULT_USSD_RATE_LIMIT } from '@gtcx/connectivity';

const limiter = new RateLimiter(DEFAULT_USSD_RATE_LIMIT);
// { maxRequests: 10, windowMs: 60000 }

if (limiter.hit(msisdn)) {
  // Process request
} else {
  // Rate limited - emits security.rate_limit_exceeded event
}

// Check remaining quota
const remaining = limiter.remaining(msisdn);
```

### Input Sanitization

```typescript
import { sanitizeUSSDInput, LotCodeSchema, WeightSchema } from '@gtcx/connectivity';

// Sanitize text input
const safe = sanitizeUSSDInput(userInput);

// Validate structured input
const lotCode = LotCodeSchema.parse('LOT-2024-001');
const weight = WeightSchema.parse('15.5'); // Returns number
```

## Data Migration (P11)

Schema versioning for backward compatibility:

```typescript
import {
  migrateUSSDSession,
  migrateConnectivityState,
  detectSchemaVersion,
  SCHEMA_VERSIONS,
} from '@gtcx/connectivity';

// Load from storage (unknown version)
const storedSession = await storage.get('ussd_session');

// Migrate to current version
const session = migrateUSSDSession(storedSession);

// Check version
const version = detectSchemaVersion(storedSession);
// '1.0.0' or '2.0.0'

// Current versions
console.log(SCHEMA_VERSIONS);
// { USSDSession: '2.0.0', ConnectivityState: '2.0.0' }
```

## React Native Hook

```typescript
import { useConnectivity } from '@gtcx/connectivity';

function SyncButton() {
  const {
    profile,
    isConnected,
    state,
    strategy,
    canSync,
    supportsRichMedia,
    refresh,
  } = useConnectivity({
    pollInterval: 30000,
    onProfileChange: (newProfile, oldProfile) => {
      console.log(`Profile changed: ${oldProfile} → ${newProfile}`);
    },
  });

  return (
    <Button
      disabled={!canSync()}
      onPress={() => syncData(strategy)}
    >
      Sync ({profile})
    </Button>
  );
}
```

## Package Structure

```
packages/connectivity/
├── src/
│   ├── index.ts              # Main exports
│   ├── types.ts              # Type definitions + Zod schemas
│   ├── detection/            # Profile detection
│   │   ├── index.ts
│   │   └── network-info.ts
│   ├── profiles/             # Profile strategies
│   │   └── index.ts
│   ├── adaptive/             # Adaptive sync
│   │   ├── index.ts
│   │   └── sync-scheduler.ts
│   ├── fallback/             # USSD/SMS channels
│   │   ├── index.ts
│   │   ├── ussd-gateway.ts
│   │   ├── ussd-session.ts
│   │   └── ussd-menus.ts
│   ├── hooks/                # React Native
│   │   ├── index.ts
│   │   └── useConnectivity.ts
│   ├── observability/        # Logging + metrics (P5, P12)
│   │   └── index.ts
│   ├── security/             # Validation + rate limiting (P9)
│   │   └── index.ts
│   └── migration/            # Schema migrations (P11)
│       └── index.ts
├── tests/
├── package.json
└── README.md
```

## Threat Model (P7 + P9)

### Assets Protected

| Asset         | Description         | Protection                         |
| ------------- | ------------------- | ---------------------------------- |
| MSISDN        | Phone numbers (PII) | Hashed in logs, validated on input |
| TradePass ID  | User identity       | Session binding, hijack detection  |
| Sale Records  | Transaction data    | Validated input, audit trail       |
| Session State | User flow state     | Timeout, MSISDN binding            |

### Threats Addressed

| Threat                      | Mitigation                               |
| --------------------------- | ---------------------------------------- |
| **USSD Injection**          | Input sanitization removes control chars |
| **Rate Limiting Bypass**    | Per-MSISDN rate limiting with audit      |
| **Session Hijacking**       | MSISDN binding, hijack detection         |
| **Phone Number Harvesting** | PII never logged raw                     |
| **Replay Attacks**          | Session timeout (180s)                   |
| **Invalid Input**           | Zod validation on all boundaries         |

### Security Events

The following events are emitted to registered security handlers:

| Event                             | Severity | Trigger                |
| --------------------------------- | -------- | ---------------------- |
| `security.rate_limit_exceeded`    | Medium   | >10 requests/minute    |
| `security.invalid_msisdn`         | Low      | Malformed phone number |
| `security.session_hijack_attempt` | High     | MSISDN mismatch        |
| `security.suspicious_input`       | Medium   | Control chars in input |
| `security.authentication_failed`  | Medium   | Invalid TradePass link |

## Principle Alignment

| Principle            | Implementation                                                             |
| -------------------- | -------------------------------------------------------------------------- |
| P1 Package Structure | Clear module boundaries (detection, profiles, adaptive, fallback, hooks)   |
| P2 Type Safety       | Zod validation at all boundaries; typed connectivity profiles              |
| P4 Composability     | Dependency injection for telco config, storage, and TradePass lookup       |
| P5 AI-Native         | Structured logging with `connectivityLogger` for ML analysis               |
| P6 Asset Abstraction | Commodity-agnostic — connectivity profiles are universal                   |
| P8 Offline-First     | Core design principle; 6 profiles from `offline` to `satellite`            |
| P9 Security          | MSISDN validation, rate limiting, input sanitization, audit events         |
| P11 Data Evolution   | Schema versioning with migration functions for USSD sessions               |
| P12 Observability    | Structured logging, Prometheus-compatible metrics, security event handlers |

## Related

- [@gtcx/sync](./sync.md) — Synchronization engine that uses connectivity profiles for sync strategy selection
- [@gtcx/api-client](./api-client.md) — API client that responds to connectivity state changes
- [@gtcx/events](./events.md) — Event bus that receives profile change events
- [@gtcx/identity](./identity.md) — TradePass identity lookup for USSD authentication
- [Shared Infrastructure](../architecture/shared-infrastructure.md) — Sync strategy by connectivity profile
