# Codex Agent Context — GTCX Core

> **Agent:** GitHub Copilot Codex (codex-1, codex-cli)
> **Status:** Current
> **Date:** 2026-05-12

---

## 1. Inline Completion Hints

When working in this repo, Codex should prioritize:

### TypeScript Patterns

```typescript
// Prefer explicit return types on public API
export function sign(data: Uint8Array, keyPair: KeyPair): SignatureResult {
  // ...
}

// Prefer Zod schemas at boundaries
const TradeRequestSchema = z.object({
  assetId: z.string().uuid(),
  amount: z.number().positive(),
});

// Prefer traced operations for crypto
export const tracedSign = traced(sign, { category: 'crypto', operation: 'sign' });
```

### Rust Patterns

```rust
// Prefer `#![deny(unsafe_code, warnings, missing_docs)]`
// Prefer `zeroize` for sensitive data
// Prefer `Result<T, ZkpError>` for fallible operations
```

---

## 2. Tab-Trigger Patterns

| Trigger      | Expansion                                      |
| ------------ | ---------------------------------------------- |
| `gtcx-test`  | Vitest test template with coverage annotations |
| `gtcx-trace` | Traced wrapper boilerplate                     |
| `gtcx-zod`   | Zod schema with inferred type                  |
| `gtcx-rust`  | Rust module template with `#![deny]`           |
| `gtcx-fips`  | FIPS backend conditional block                 |

---

## 3. Copilot Chat Integration

When using Copilot Chat in VS Code / Cursor:

- **@workspace** — Reference `AGENTS.md` for repo identity
- **@workspace architecture** — Reference `docs/architecture/overview.md`
- **@workspace security** — Reference `docs/security/threat-control-matrix.md`
- **@workspace compliance** — Reference `docs/compliance/soc2-readiness.md`

---

## 4. Differences from AGENTS.md

| AGENTS.md Prescription      | Codex Override                        |
| --------------------------- | ------------------------------------- |
| Session-start reading order | Inline completion context only        |
| Machine-readable docs       | Prose comments in code                |
| Safety rules JSON           | Inline `// SAFETY:` comments for Rust |

---

## 5. Fallback

If `CODEX.md` conflicts with `AGENTS.md`, **AGENTS.md wins**.
