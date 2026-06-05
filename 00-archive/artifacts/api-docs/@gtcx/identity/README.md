[**GTCX Core API Reference**](../../README.md)

***

[GTCX Core API Reference](../../README.md) / @gtcx/identity

# @gtcx/identity

Identity management with DID (Decentralized Identifier) support.

## Installation

```bash
pnpm add @gtcx/identity
```

## Quick Start

```typescript
import { createIdentity, createDID, validateIdentity } from '@gtcx/identity';

const { identity, privateKey } = await createIdentity({
  metadata: { userId: 'inspector-001' },
});

const did = createDID(identity);
console.log(did); // did:gtcx:...
console.log(validateIdentity(identity).valid); // true
```

## API

| Export                            | Description                       |
| --------------------------------- | --------------------------------- |
| `createIdentity(opts?)`           | Create identity with Ed25519 keys |
| `createEnhancedIdentity()`        | Dual-key identity                 |
| `deriveIdentity(parent, context)` | Derive child identity             |
| `validateIdentity(identity)`      | Validate structure                |
| `isIdentityExpired(identity)`     | Check expiration                  |
| `createDID(identity)`             | Create DID string                 |
| `parseDID(did)`                   | Parse DID components              |
| `isValidDID(did)`                 | Validate DID format               |
| `createDIDDocument(identity)`     | W3C DID document                  |
| `createDIDResolver(config)`       | Resolver with adapters + cache    |
| `createHttpDIDResolverAdapter()`  | HTTP-based resolver adapter       |
| `createInMemoryDIDCache()`        | In-memory cache                   |

## Resolver Example

```typescript
import {
  createDIDResolver,
  createHttpDIDResolverAdapter,
  createInMemoryDIDCache,
} from '@gtcx/identity';

const resolver = createDIDResolver({
  adapters: [createHttpDIDResolverAdapter({ baseUrl: 'https://resolver.gtcx.trade' })],
  cache: createInMemoryDIDCache(),
  cacheTtlMs: 5 * 60_000,
});

const result = await resolver.resolve('did:gtcx:abc123');
console.log(result.document);
```

## Related

- [ADR-005: Ed25519 over secp256k1](../../_media/005-ed25519-signing.md)

## License

MIT

## Classes

- [DIDResolverError](classes/DIDResolverError.md)

## Interfaces

- [CreateIdentityOptions](interfaces/CreateIdentityOptions.md)
- [DIDDocument](interfaces/DIDDocument.md)
- [DIDResolutionMetadata](interfaces/DIDResolutionMetadata.md)
- [DIDResolutionResult](interfaces/DIDResolutionResult.md)
- [DIDResolver](interfaces/DIDResolver.md)
- [DIDResolverAdapter](interfaces/DIDResolverAdapter.md)
- [DIDResolverCache](interfaces/DIDResolverCache.md)
- [DIDResolverCacheEntry](interfaces/DIDResolverCacheEntry.md)
- [DIDResolverConfig](interfaces/DIDResolverConfig.md)
- [DIDResolverMetricsEvent](interfaces/DIDResolverMetricsEvent.md)
- [DIDResolverOptions](interfaces/DIDResolverOptions.md)
- [EnhancedIdentityCreationResult](interfaces/EnhancedIdentityCreationResult.md)
- [HttpDIDResolverConfig](interfaces/HttpDIDResolverConfig.md)
- [IdentityCreationResult](interfaces/IdentityCreationResult.md)
- [VerificationMethod](interfaces/VerificationMethod.md)

## Type Aliases

- [DIDResolverErrorCode](type-aliases/DIDResolverErrorCode.md)
- [DIDRevocationChecker](type-aliases/DIDRevocationChecker.md)
- [DIDRevocationStatus](type-aliases/DIDRevocationStatus.md)

## Variables

- [DID\_METHOD](variables/DID_METHOD.md)

## Functions

- [createDID](functions/createDID.md)
- [createDIDDocument](functions/createDIDDocument.md)
- [createDIDResolver](functions/createDIDResolver.md)
- [createEnhancedIdentity](functions/createEnhancedIdentity.md)
- [createHttpDIDResolverAdapter](functions/createHttpDIDResolverAdapter.md)
- [createIdentity](functions/createIdentity.md)
- [createInMemoryDIDCache](functions/createInMemoryDIDCache.md)
- [createStaticDIDResolverAdapter](functions/createStaticDIDResolverAdapter.md)
- [deriveIdentity](functions/deriveIdentity.md)
- [extractPublicKey](functions/extractPublicKey.md)
- [generateIdentityId](functions/generateIdentityId.md)
- [isIdentityExpired](functions/isIdentityExpired.md)
- [isValidDID](functions/isValidDID.md)
- [parseDID](functions/parseDID.md)
- [resolveDID](functions/resolveDID.md)
- [resolveDIDWithMetadata](functions/resolveDIDWithMetadata.md)
- [validateIdentity](functions/validateIdentity.md)
