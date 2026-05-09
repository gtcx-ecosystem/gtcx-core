# Security Review Playbook

**Version:** 1.0.0
**Applies to:** `packages/security/`, `packages/identity/`
**Owner role:** `docs/agents/roles/crypto-security-engineer.md`

---

## 1. Default redaction preserved on traced operations

**Rule:** Calls to `traced(...)` from `@gtcx/ai` must rely on the default `redactSecrets` sanitizer when `logInput` or `logOutput` is true. Explicit `sanitizeInput` / `sanitizeOutput` overrides are permitted, but a sanitizer that bypasses redaction (identity function, `JSON.stringify` of raw input) is forbidden.

**Violation pattern:**

- Diff adds a `traced(...)` call with `logInput: true` or `logOutput: true` and an explicit sanitizer that does not redact secrets
- Diff modifies `packages/ai/src/index.ts` to remove `redactSecrets` from the default-sanitizer fallback
- Diff weakens the `REDACTED_KEY_PATTERNS` list in `packages/ai/src/index.ts`

**Category:** `redaction-bypass`
**Severity:** `critical`
**References:** SA-002 closure (`docs/audits/auto-dev-state.md`)

---

## 2. STRIDE delta for security-surface changes

**Rule:** Any diff touching `packages/security/src/` or `packages/identity/src/` requires a corresponding entry in the STRIDE table in `docs/security/threat-model.md` — either a new row for new attack surfaces, or a modification to an existing mitigation when the change alters how a threat is countered.

**Violation pattern:**

- Diff modifies a security-surface file
- Diff does not modify `docs/security/threat-model.md`
- PR description does not contain explicit "no STRIDE change because <reason>"

**Category:** `threat-model-drift`
**Severity:** `medium`

---

## 3. SecurityLogger strict-mode preserved

**Rule:** `SecurityLogger` operates in strict mode in production paths. Diff must not introduce `strict: false` in `packages/security/src/audit/` or downstream production code.

**Violation pattern:**

- Diff adds `new SecurityLogger({ strict: false, ... })` in `packages/security/src/`
- Diff modifies the SecurityLogger constructor to make non-strict the default
- Diff removes the strict-mode enforcement check

**Category:** `audit-trail`
**Severity:** `high`

---

## 4. Token lifecycle invariants

**Rule:** Modifications to `packages/security/src/auth/` must preserve the four token lifecycle phases: creation, validation, expiry, revocation. Removing any phase or short-circuiting any check is a critical finding.

**Violation pattern:**

- Diff removes a function or check named `revoke`, `isExpired`, `validate`, or equivalent from auth code
- Diff adds an early-return path in `validate()` that bypasses expiry or revocation checking
- Diff sets a token TTL to a value larger than the documented maximum (currently 72 hours per `OfflineSecurityConfig.maxOfflineHours`)

**Category:** `audit-trail`
**Severity:** `critical`

---

## 5. AES-GCM nonce uniqueness

**Rule:** Every encryption operation in `packages/security/src/offline/storage.ts` must use a fresh, unique IV. Reusing an IV with the same key catastrophically breaks AES-GCM confidentiality and authenticity.

**Violation pattern:**

- Diff adds an `encrypt(...)` call in `packages/security/src/offline/storage.ts` (or its decomposed children) where the IV is a constant, derived from a non-random source, or a counter that may collide across processes
- Diff caches an IV in a closure or class instance and reuses it

**Category:** `cryptographic-correctness`
**Severity:** `critical`

---

## 6. `secureCompare` for sensitive equality

**Rule:** Same as crypto playbook check 3. Equality comparisons of secrets, tokens, MACs, or any output of a cryptographic primitive must use `secureCompare`.

**Violation pattern:**

- Diff adds `===` or `!==` in `packages/security/src/`, `packages/identity/src/` comparing token strings, signature buffers, or password hashes
- The relevant import of `secureCompare` is missing

**Category:** `constant-time`
**Severity:** `high`

---

## 7. No `console.log` in production paths

**Rule:** `packages/*/src/` may emit `console.warn` and `console.error` (allowed by ESLint rule `no-console`). `console.log` and `console.debug` are forbidden in source. They risk leaking secret values bypassing the redaction layer.

**Violation pattern:**

- Diff adds `console.log` or `console.debug` anywhere in `packages/*/src/`

**Category:** `secret-leakage`
**Severity:** `medium`
**References:** `eslint.config.js` `no-console` rule

---

## 8. Audit events for privileged operations

**Rule:** New functions in `packages/security/src/` or `packages/identity/src/` that perform privileged actions (token issuance, permission grant, credential rotation, key destruction) must emit a `logSecurityEvent` call.

**Violation pattern:**

- Diff adds a new exported function that takes a `subject`, `principal`, or `credential` argument and modifies state
- The function body does not contain a `logSecurityEvent` call
- The function body does not delegate to another function known to log

**Category:** `audit-trail`
**Severity:** `high`

---

## 9. Permission checks at boundary, not deep in logic

**Rule:** Functions that accept a credential or token must validate it at function entry, before any business logic. Deep validation invites bypass via partial path execution.

**Violation pattern:**

- Diff adds a new exported function whose first executable statement is not a permission/credential validation
- The validation appears later in the function body, after data transformations or external calls

**Category:** `audit-trail`
**Severity:** `medium`

---

## 10. Offline queue checksum metadata

**Rule:** `packages/security/src/offline/` operations preserve checksum metadata on every queued item. Removing checksum write or read paths breaks tamper detection on sync.

**Violation pattern:**

- Diff removes a checksum field from an interface in `packages/security/src/offline/types.ts`
- Diff removes a checksum write call in `storage.ts`
- Diff adds a code path that reads queued items without verifying checksum

**Category:** `audit-trail`
**Severity:** `high`
**References:** `docs/security/threat-model.md` (TC-004)

---

## 11. DID resolution validates resolved documents

**Rule:** `packages/identity/src/` resolution paths must run resolved DID documents through Zod schema validation before consumption. Skipping validation enables DID-document spoofing.

**Violation pattern:**

- Diff adds a code path that consumes a resolved DID document without `.parse()` or `.safeParse()` against the documented schema
- Diff weakens the schema (e.g., adds `.passthrough()`, marks required fields optional)

**Category:** `cryptographic-correctness`
**Severity:** `high`
**References:** `docs/security/threat-model.md` (TC-010)

---

## 12. Failed-unlock counter not reset prematurely

**Rule:** `OfflineSecurityConfig.maxFailedAttempts` triggers data wipe after the configured number of failed unlock attempts. The counter must only reset on successful unlock — not on any other event (timeout, app restart, network reconnect).

**Violation pattern:**

- Diff adds a code path that resets the failed-unlock counter outside a successful-unlock handler
- Diff increases `maxFailedAttempts` default beyond 10 without updating threat-model rationale

**Category:** `audit-trail`
**Severity:** `critical`

---

## Severity-to-decision mapping

Critical findings: `redaction-bypass`, `audit-trail` (at critical), `cryptographic-correctness` → `REQUEST_CHANGES`. Two or more `high` findings → `REQUEST_CHANGES`. Otherwise → `COMMENT`.

## Changelog

- **1.0.0** (2026-05-09) — Initial 12 checks covering redaction, audit trail, token lifecycle, encryption invariants, and DID resolution.
