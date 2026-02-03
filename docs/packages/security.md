# @gtcx/security

Non-cryptographic security utilities for the GTCX Protocol ecosystem. Complements `@gtcx/crypto` by providing validation, authentication, offline credential management, and security audit logging.

## Overview

```
@gtcx/crypto              @gtcx/security
├── keys                   ├── validation/
├── signing                │   ├── schemas      (P2 Type Safety)
├── hashing                │   └── sanitize     (P9 Input Validation)
└── proofs                 ├── auth/
                           │   ├── tokens
   Cryptographic           │   ├── sessions
   Primitives              │   └── permissions
                           ├── offline/         (P8 Offline-First)
                           │   ├── secure-storage
                           │   ├── credential-cache
                           │   └── tamper-detection
                           └── audit/           (P12 Observability)
                               ├── events
                               └── logger
```

`@gtcx/crypto` handles cryptographic primitives (signing, hashing). This package handles everything else in the security domain: input validation, authentication state, offline credential caching, and structured security event logging.

## Installation

```bash
pnpm add @gtcx/security
```

## Quick Start

### Validation (P2, P9)

```typescript
import {
  CommonSchemas,
  sanitizeString,
  createBoundaryValidator
} from '@gtcx/security/validation';

// Use common schemas
const email = CommonSchemas.email.parse(input.email);
const uuid = CommonSchemas.uuid.parse(input.id);

// Sanitize untrusted input
const clean = sanitizeString(userInput, {
  maxLength: 1000,
  stripHtml: true,
  trimWhitespace: true,
});

// Create boundary validator for API endpoints
const validateRequest = createBoundaryValidator(RequestSchema);
const validated = validateRequest(rawInput); // Throws on invalid
```

### Authentication

```typescript
import {
  createAuthToken,
  verifyAuthToken,
  createSession,
  validatePermission
} from '@gtcx/security/auth';

// Create and verify tokens
const token = await createAuthToken({
  subject: userId,
  audience: 'gtcx-api',
  expiresIn: '1h',
});
const payload = await verifyAuthToken(token);

// Session management
const session = await createSession({
  userId,
  deviceId,
  maxAge: 72 * 60 * 60 * 1000, // 72 hours (P8 offline limit)
});

// Permission checking
const allowed = validatePermission({
  actor: session.userId,
  action: 'verify',
  resource: 'tradepass:credential',
  context: { ownerId: credentialOwnerId },
});
```

### Offline Security (P8)

```typescript
import {
  SecureStorage,
  CredentialCache,
  verifyIntegrity
} from '@gtcx/security/offline';

// Secure local storage with PIN-based unlock
const storage = new SecureStorage({
  deviceId: await getDeviceId(),
  maxOfflineHours: 72,
  maxFailedAttempts: 10,
});

await storage.unlock(userPin);
await storage.set('credentials', myCredentials);
const creds = await storage.get('credentials');

// Credential caching with expiry
const cache = new CredentialCache(storage);
await cache.store(credential, {
  expiresAt: Date.now() + 72 * 60 * 60 * 1000
});

const cached = await cache.get(credentialId);
if (cached.expired) {
  // Prompt for online refresh
}

// Tamper detection
const integrity = await verifyIntegrity(data, check, trustedRootKey);
if (!integrity.valid) {
  await logSecurityEvent({
    eventType: 'TAMPER_DETECTED',
    severity: 'CRITICAL',
    reason: integrity.reason,
  });
}
```

### Audit Logging (P12)

```typescript
import {
  logSecurityEvent,
  createAuditTrail
} from '@gtcx/security/audit';

// Log security events
await logSecurityEvent({
  eventType: 'AUTH_SUCCESS',
  severity: 'INFO',
  actor: userId,
  action: 'login',
  outcome: 'SUCCESS',
  metadata: { method: 'biometric' },
});

// Create audit trail for multi-step operations
const audit = createAuditTrail('custody_transfer');
audit.record('initiated', { from: vaultA, to: vaultB });
audit.record('verified', { inspector: inspectorId });
audit.record('completed', { timestamp: Date.now() });
await audit.finalize();
```

## API Reference

### Validation Module

#### Common Schemas

```typescript
import { CommonSchemas } from '@gtcx/security/validation';

// Identity schemas
CommonSchemas.uuid          // UUID v4
CommonSchemas.did           // W3C DID format
CommonSchemas.tradePassId   // TradePass identifier

// Data schemas
CommonSchemas.email         // Email address
CommonSchemas.phone         // E.164 phone number
CommonSchemas.url           // Valid URL
CommonSchemas.datetime      // ISO 8601 datetime
CommonSchemas.coordinates   // { lat, lng } with bounds

// Security schemas
CommonSchemas.signature     // Hex-encoded signature
CommonSchemas.publicKey     // Hex-encoded public key
CommonSchemas.hash          // SHA-256 hash
```

#### Sanitization

```typescript
import { sanitizeString, sanitizeObject } from '@gtcx/security/validation';

// String sanitization
const clean = sanitizeString(input, {
  maxLength: 1000,         // Truncate if longer
  stripHtml: true,         // Remove HTML tags
  trimWhitespace: true,    // Trim leading/trailing
  normalizeUnicode: true,  // NFC normalization
});

// Object sanitization (recursive)
const cleanObj = sanitizeObject(input, {
  maxDepth: 10,            // Prevent deep nesting attacks
  maxKeys: 100,            // Limit object size
  stripProto: true,        // Remove __proto__
});
```

### Auth Module

#### Tokens

```typescript
import { createAuthToken, verifyAuthToken } from '@gtcx/security/auth';

interface TokenOptions {
  subject: string;         // User ID
  audience: string;        // Target service
  expiresIn: string;       // '1h', '24h', '72h'
  claims?: Record<string, unknown>;
}

const token = await createAuthToken(options);
const payload = await verifyAuthToken(token);
```

#### Permissions

```typescript
import { validatePermission } from '@gtcx/security/auth';

// Permission format: resource:action
// Supported permissions:
//   tradepass:issue, tradepass:verify, tradepass:revoke
//   geotag:create, geotag:verify
//   vaultmark:transfer
//   gci:evaluate
//   admin:*

// Role-based permission sets
const ROLES = {
  producer:  ['tradepass:verify', 'geotag:create'],
  inspector: ['tradepass:verify', 'geotag:verify', 'gci:evaluate'],
  admin:     ['admin:*'],
};
```

### Offline Module

#### SecureStorage

```typescript
import { SecureStorage } from '@gtcx/security/offline';

interface SecureStorageConfig {
  deviceId: string;
  maxOfflineHours: number;     // Default: 72
  maxFailedAttempts: number;   // Default: 10
  wipeOnExceed: boolean;       // Default: true
}

class SecureStorage {
  constructor(config: SecureStorageConfig);
  unlock(secret: string): Promise<void>;
  lock(): void;
  set<T>(key: string, value: T): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  wipe(): Promise<void>;
}
```

#### Tamper Detection

```typescript
import { createIntegrityCheck, verifyIntegrity } from '@gtcx/security/offline';

interface IntegrityCheck {
  dataHash: string;
  signatureChain: string[];
  createdAt: string;
  lastVerified: string;
}

const check = await createIntegrityCheck(data, signingKey);
const result = await verifyIntegrity(data, check, trustedKey);
// { valid: boolean, reason?: string }
```

### Audit Module

#### Security Event Types

```typescript
type SecurityEventType =
  | 'AUTH_SUCCESS'
  | 'AUTH_FAILURE'
  | 'AUTH_LOCKOUT'
  | 'ACCESS_GRANTED'
  | 'ACCESS_DENIED'
  | 'VALIDATION_FAILURE'
  | 'CRYPTO_OPERATION'
  | 'OFFLINE_SYNC'
  | 'TAMPER_DETECTED'
  | 'KEY_LIFECYCLE';

interface SecurityEvent {
  timestamp: string;
  eventType: SecurityEventType;
  severity: 'INFO' | 'WARN' | 'HIGH' | 'CRITICAL';
  actor?: string;
  resource?: string;
  action?: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  reason?: string;
  traceId?: string;
  metadata?: Record<string, unknown>;
}
```

#### Security Handlers

```typescript
import { registerSecurityHandler } from '@gtcx/security/audit';

registerSecurityHandler(async (event) => {
  await analyticsService.track(event);
  if (event.severity === 'CRITICAL') {
    await alertService.notify(event);
  }
});
```

## Scope Boundary

This package does **not**:
- Implement cryptographic primitives (use `@gtcx/crypto`)
- Provide platform-specific secure storage (iOS Keychain, Android Keystore)
- Handle network security (use TLS at the transport layer)
- Store secrets directly (provides abstractions over platform-specific backends)

## Principle Alignment

| Principle | Implementation |
|-----------|---------------|
| P1 Package Structure | Four independent modules (validation, auth, offline, audit) |
| P2 Type Safety | 30+ Zod schemas for all external inputs |
| P4 Composability | Pluggable storage backends, handler registration |
| P8 Offline-First | SecureStorage, CredentialCache with 72h offline support |
| P9 Security | Input validation, sanitization, RBAC, lockout mechanism |
| P12 Observability | 40+ categorized security event types with severity levels |

## Related

- [@gtcx/crypto](./crypto.md) — Cryptographic primitives (signing, hashing, proofs)
- [@gtcx/identity](./identity.md) — Identity creation and DID management
- [Security Framework](../specs/security-framework.md) — Key hierarchy, algorithm standards, and threat model
- [Security Audit](./security-audit.md) — Detailed principle compliance audit of this package
