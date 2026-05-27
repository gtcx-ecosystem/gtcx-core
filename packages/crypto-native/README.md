# @gtcx/crypto-native

> **Maturity:** Beta — NAPI bindings stable; native `.node` binary not generated in CI (local build required).
> **Coverage:** ~9.5% (loader only; native binary not instrumented in test env)

Native Node.js bindings loader for GTCX cryptographic operations.

This package loads the NAPI-RS binary produced by `rust/gtcx-node` and exposes a stable JS/TS API.
It is optional and intended to be consumed by `@gtcx/crypto` as the preferred backend.

## Usage

```typescript
import { sign, verify, generateKeyPair } from '@gtcx/crypto-native';

const { privateKey, publicKey } = generateKeyPair();
const signature = sign(new TextEncoder().encode('hello'), privateKey);
console.log(verify(signature, new TextEncoder().encode('hello'), publicKey));
```

## Building the Native Binary

```bash
# From repo root
pnpm --filter @gtcx/crypto-native build:native
```

The build script expects the Rust toolchain and will place the native addon in:

- `packages/crypto-native/native/gtcx_node.node`

If the binary is not present, imports will fail and callers should fall back to JS implementations.

## License

MIT
