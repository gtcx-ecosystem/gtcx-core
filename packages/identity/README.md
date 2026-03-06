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
  adapters: [createHttpDIDResolverAdapter({ baseUrl: 'https://resolver.gtcx.io' })],
  cache: createInMemoryDIDCache(),
  cacheTtlMs: 5 * 60_000,
});

const result = await resolver.resolve('did:gtcx:abc123');
console.log(result.document);
```

## Related

- [ADR-005: Ed25519 over secp256k1](../../SOP/2-docs/1-architecture/decisions/005-ed25519-signing.md)

## License

MIT
