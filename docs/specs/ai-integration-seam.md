---
title: 'Ai Integration Seam'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'
---

# AI Integration Seam — gtcx-core ↔ gtcx-intelligence

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

How the AI observability stub in gtcx-core connects to the full AI implementation in gtcx-intelligence.

---

## Architecture

gtcx-core provides the **hook points**. gtcx-intelligence provides the **implementation**. The connection is via the optional peer dependency pattern described in [ADR-008](../decisions/008-optional-tracing-peer-deps.md).

```
gtcx-core                      gtcx-intelligence
────────────                       ──────────────────
@gtcx/ai (stub)          ←──→     Full tracing implementation
  traced() → no-op                   traced() → logs to AI pipeline
  withTrace() → passthrough          withTrace() → logs + traces
  createCategoryLogger() → stderr    createCategoryLogger() → pipeline

@gtcx/crypto
  tracedSign(), tracedVerify(), ...   (automatically use full impl when available)

@gtcx/verification
  tracedGenerateCertificate(), ...    (automatically use full impl when available)

@gtcx/workproof/ai
  Types + Zod schemas only     ←──→  AI validation engine populates these types
```

---

## How Injection Works

Each consuming package (`@gtcx/crypto`, `@gtcx/verification`) has a `tracing.ts` adapter:

```typescript
// packages/crypto/src/tracing.ts
const noopTraced: TraceFn = (fn) => fn;
let _traced: TraceFn = noopTraced;

try {
  const ai = require('@gtcx/ai');
  if (ai?.traced) _traced = ai.traced;
} catch {
  // @gtcx/ai not installed — no-op fallback
}

export const traced = _traced;
```

When gtcx-intelligence replaces `@gtcx/ai` with its full implementation, the `require('@gtcx/ai')` call resolves to the real package. Zero code changes needed in consuming packages.

---

## What gtcx-core Provides

### 1. Operation Tracing Hooks (36+ traced functions)

| Package              | Traced Functions | Categories     |
| -------------------- | ---------------- | -------------- |
| `@gtcx/crypto`       | 30+              | `crypto`       |
| `@gtcx/verification` | 6+               | `verification` |

Each traced function wraps a base operation with metadata:

```typescript
tracedSign = traced(sign, 'crypto.sign', {
  category: 'crypto',
  logInput: false, // Never log private keys
  logOutput: false, // Don't log signatures
  metadata: { algorithm: 'Ed25519' },
});
```

**Contract**: Traced functions MUST produce identical results to base functions. Tests enforce this (`expect(tracedSign(...)).toBe(sign(...))`).

### 2. Operation Log Schema

Every traced operation emits an `OperationLog`:

```typescript
interface OperationLog<TInput = any, TOutput = any> {
  operationName: string; // e.g. 'crypto.sign'
  type: string;
  category?: string; // e.g. 'crypto', 'verification'
  input?: TInput; // Sanitized via sanitizeInput()
  output?: TOutput; // Sanitized via sanitizeOutput()
  duration?: number;
  durationMs?: number | null;
  timestamp: number;
  success?: boolean;
  error?: { name: string; message: string; stack?: string };
  metadata?: Record<string, unknown>;
}
```

### 3. AI Validation Types (workproof/ai)

`@gtcx/workproof/ai` exports the type contract for AI validation results:

```typescript
interface WorkProofAIValidationResult {
  workProofId: string;
  overallAnomalyScore: number; // 0-1
  overallConfidence: number; // 0-1
  predicateValidations: AIPredicateValidation[];
  agents: ValidationAgent[]; // Ensemble members
  humanReviewRequired: boolean;
  flaggedReasons: string[];
  validatedAt: number;
}

type ValidationAgentRole =
  | 'primary_validator'
  | 'anomaly_detector'
  | 'consistency_checker'
  | 'fraud_scorer'
  | 'satellite_correlator';
```

These types define what gtcx-intelligence must produce. gtcx-core does not validate or consume these — it only defines the schema.

---

## What gtcx-core Does NOT Provide

| Concern                  | Status in gtcx-core                                | Required in gtcx-intelligence             |
| ------------------------ | -------------------------------------------------- | ----------------------------------------- |
| AI inference             | Not implemented                                    | Must implement                            |
| Hallucination guardrails | No confidence thresholds                           | Must define rejection criteria            |
| Human-in-the-loop        | No gates                                           | Must implement review triggers            |
| Data privacy controls    | No PII redaction (sanitizers exist but are no-ops) | Must implement sanitizers                 |
| Kill switch              | No `DISABLE_AI` flag                               | Must provide circuit breaker              |
| Model governance         | No model card, no versioning                       | Must track model versions + accuracy      |
| AI output signing        | Crypto layer signs anything                        | Must validate before requesting signature |

---

## Governance Guarantees Product Surfaces Can Claim

Based on what gtcx-core actually provides today:

### Can claim:

- "Cryptographic operations are traceable" — traced wrappers exist for all signing, hashing, key, certificate, and proof operations
- "Operation metadata is structured" — `OperationLog` schema is defined and consistent
- "AI integration is modular" — the adapter pattern (ADR-008) allows swapping stub for full implementation without code changes
- "AI validation result schemas are defined" — `WorkProofAIValidationResult` and related types exist in `@gtcx/workproof/ai`
- "Private keys are never logged" — `logInput: false` is set on all signing traced functions

### Cannot claim (until gtcx-intelligence is wired in):

- "AI-powered verification" — no AI runs in gtcx-core
- "Anomaly detection" — types exist, implementation does not
- "AI validation of attestations" — schema only, no validation logic
- "Confidence scoring" — types define scores, nothing computes them
- "Human-in-the-loop review" — `humanReviewRequired` field exists, no trigger mechanism

---

## Integration Checklist for gtcx-intelligence

When connecting gtcx-intelligence to gtcx-core:

1. **Replace `@gtcx/ai` stub** — publish a full implementation that satisfies the same interface (`traced`, `withTrace`, `createCategoryLogger`)
2. **Implement `traced()` with real logging** — emit `OperationLog` entries to the AI observability pipeline
3. **Implement sanitizers** — `sanitizeInput` and `sanitizeOutput` must strip key material before logging
4. **Populate `WorkProofAIValidationResult`** — the ensemble validation system must produce results matching the schema in `@gtcx/workproof/ai`
5. **Add confidence thresholds** — define minimum `overallConfidence` for automated acceptance vs. `humanReviewRequired: true`
6. **Add kill switch** — provide a `GTCX_DISABLE_AI` environment variable that disables all AI features, falling back to deterministic-only verification
7. **Document data boundaries** — specify what data leaves the system, what trains models, and what stays local

---

## Reference

- [ADR-008: Optional Tracing via Peer Dependencies](../decisions/008-optional-tracing-peer-deps.md)
- [Package Spec: @gtcx/ai](./packages/ai.md)
- [`packages/crypto/src/tracing.ts`](../../packages/crypto/src/tracing.ts) — adapter implementation
- [`packages/workproof/src/ai/`](../../packages/workproof/src/ai/) — AI validation types
