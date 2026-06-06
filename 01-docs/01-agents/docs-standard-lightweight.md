---
title: 'Docs Standard: Lightweight App Architecture'
status: 'current'
date: '2026-05-12'
owner: 'protocol-architect'
role: 'frontier-infra-engineer'
tier: 'critical'
tags: ['agentic', 'performance', 'bundle-size', 'tree-shaking']
review_cycle: 'quarterly'
---

## 1. Principle

Every package in the GTCX ecosystem must be **as powerful as necessary and as light as possible.**

A lightweight package:

- Ships only the code the consumer actually uses
- Has a defined maximum bundle size budget
- Uses explicit named exports, not `export *`
- Enables tree-shaking via ESM code splitting
- Minimizes runtime dependencies
- Optimizes for size in release builds

---

## 2. Bundle Size Budgets

### 2.1 Budget Table

| Package               | Budget (bytes) | Rationale                                         |
| --------------------- | -------------- | ------------------------------------------------- |
| `@gtcx/utils`         | 2,048          | Single utility file, zero deps                    |
| `@gtcx/types`         | 5,120          | Type-only, erased at runtime                      |
| `@gtcx/runtime`       | 4,096          | Pure aggregator shell                             |
| `@gtcx/resilience`    | 8,192          | Circuit breaker + retry + rate limiter            |
| `@gtcx/connectivity`  | 8,192          | Network detection, zero heavy deps                |
| `@gtcx/sync`          | 8,192          | Offline queue engine                              |
| `@gtcx/telemetry`     | 12,288         | OTel instrumentation, peer deps                   |
| `@gtcx/logging`       | 16,384         | Structured logging                                |
| `@gtcx/events`        | 10,240         | Typed event bus                                   |
| `@gtcx/schemas`       | 24,576         | Core12 + provenance schemas                       |
| `@gtcx/identity`      | 16,384         | DID, credentials                                  |
| `@gtcx/ai`            | 10,240         | AI hooks, zero external deps                      |
| `@gtcx/api-client`    | 24,576         | HTTP client (native fetch target)                 |
| `@gtcx/network`       | 16,384         | P2P primitives (libp2p is peer dep)               |
| `@gtcx/crypto-native` | 6,144          | JS wrapper + 1.7 MB `.node` binary                |
| `@gtcx/crypto`        | 45,056         | Noble curves + hashes + ZKP engine                |
| `@gtcx/security`      | 32,768         | Auth + validation + audit (post-barrel-refactor)  |
| `@gtcx/workproof`     | 32,768         | W3C VC attestation (post-barrel-refactor)         |
| `@gtcx/domain`        | 32,768         | Domain models (post-barrel-refactor)              |
| `@gtcx/services`      | 32,768         | Business services                                 |
| `@gtcx/verification`  | 65,536         | Certificates + QR + proofs (post-barrel-refactor) |

### 2.2 Budget Enforcement

```bash
# Check all packages against budgets
pnpm bundle:check-budgets

# Check single package
pnpm bundle:check-budgets --package @gtcx/crypto
```

Budget violations block release. Do not raise budgets to unblock — refactor the package.

---

## 3. Barrel Export Rules

### 3.1 Anti-Pattern: `export *`

`export *` defeats tree-shaking. Bundlers cannot eliminate dead code when the entire module is re-exported.

**Before (anti-pattern):**

```typescript
// 03-platform/packages/security/src/index.ts
export * from './validation';
export * from './auth';
export * from './offline';
export * from './audit';
```

**After (correct):**

```typescript
// 03-platform/packages/security/src/index.ts
// Only cross-cutting types and core exports
export type { ValidationResult, ValidationOptions } from './validation';
export { validateInput } from './validation';

// Subpaths for domain-specific imports:
// import { authenticate } from '@gtcx/security/auth';
// import { auditLog } from '@gtcx/security/audit';
```

### 3.2 Refactoring Checklist

For each package with `export *` in the main barrel:

- [ ] Identify which exports are cross-cutting (used by >50% of consumers)
- [ ] Keep only cross-cutting exports in main barrel
- [ ] Ensure subpath exports exist for all domains
- [ ] Update `package.json` `exports` to expose subpaths
- [ ] Update consumer imports to use subpaths
- [ ] Verify bundle size drops below budget

### 3.3 Priority Packages (highest impact)

1. `@gtcx/verification` — 4,776 LOC, 74 KB dist
2. `@gtcx/domain` — 3,907 LOC, 44 KB dist
3. `@gtcx/security` — 3,819 LOC, 55 KB dist
4. `@gtcx/workproof` — 2,462 LOC, 57 KB dist
5. `@gtcx/crypto` — 2,159 LOC, 43 KB dist

---

## 4. Build Configuration

### 4.1 tsup Base Config

```javascript
// 03-platform/packages/config/tsup/base.mjs
export default {
  format: ['cjs', 'esm'],
  dts: true,
  treeshake: true,
  splitting: true, // ← enable ESM code splitting
  minify: true, // ← enable minification for release
  sourcemap: true,
  clean: true,
  // ...
};
```

### 4.2 Package.json Exports

Every package must define conditional exports:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./subpath": {
      "types": "./dist/subpath.d.ts",
      "import": "./dist/subpath.mjs",
      "require": "./dist/subpath.js"
    }
  },
  "sideEffects": false
}
```

### 4.3 Rust Release Profile

```toml
[profile.release]
lto = true
codegen-units = 1
panic = "abort"
opt-level = "z"    # ← optimize for size
strip = true       # ← strip debug symbols
```

---

## 5. Dependency Rules

### 5.1 Runtime Dependency Minimization

| Rule                                  | Enforcement                                               |
| ------------------------------------- | --------------------------------------------------------- |
| Prefer native APIs over libraries     | `fetch` > `undici`; `node:crypto` > external crypto libs  |
| Peer deps for heavy optional features | libp2p, OTel as peer deps                                 |
| Dev-only for build tools              | tsup, typescript, vitest in `devDependencies`             |
| Optional deps with fallback           | `@gtcx/crypto-native` optional, pure-JS fallback required |

### 5.2 Dependency Audit

```bash
# Check for bloat
pnpm bundle:check-budgets

# Check for unused deps
pnpm depcheck

# Check for duplicate deps
pnpm why <package>
```

---

## 6. Verification Gates

| Gate                | Command                                                                    | Blocks Release? |
| ------------------- | -------------------------------------------------------------------------- | --------------- |
| Bundle size check   | `pnpm bundle:check-budgets`                                                | Yes             |
| Barrel export audit | `grep -r "export \*" 03-platform/packages/*/src/index.ts`                  | Yes             |
| Tree-shaking config | `grep -n "splitting\|treeshake" 03-platform/packages/config/tsup/base.mjs` | Yes             |
| Rust size opts      | `grep -n "opt-level\|strip" rust/Cargo.toml`                               | Yes             |

---

## 7. Migration Path

### Phase 1: Foundation (M1)

- Define budgets in `benchmarks/bundle-size-budgets.json`
- Create `.size-limit.json` config
- Enable `splitting: true` in tsup base

### Phase 2: Hardening (M2)

- Refactor 3+ bloated barrels
- Replace `undici` with native `fetch` in `api-client`
- Add `opt-level = "z"`, `strip = true` to Rust profile

### Phase 3: Certification (M3)

- All packages pass bundle size budget in CI
- All `export *` removed from main barrels
- Subpath imports enforced for heavy packages

### Phase 4: Reference (M4)

- All packages subpath-only
- No consumer imports from main barrel of heavy packages
- Bundle size gates are release-blocking
