# Known Pitfalls

## Active TODOs / FIXMEs in Code

**Discovered:** 2026-05-27
| File | Line | Issue |
|------|------|-------|
| 03-platform/packages/ai/dist/index.js | 57 | (msg, data) => emit("debug", msg, data) |
| 03-platform/packages/ai/dist/index.js | 312 | (msg, data) => emit("debug", msg, data) |
| 03-platform/packages/ai/src/category-logger.ts | 26 | (msg, data) => emit('debug', msg, data), |
| 03-platform/packages/ai/src/provenance.ts | 31 | (msg: string, data?: Record<string, unknown>) => emit('debug', msg, data), |
| 03-platform/packages/ai/src/span-emitter.ts | 103 | is visible without breaking the call. |
| 03-platform/packages/ai/tests/ai.test.ts | 64 | level', () => { |
| 03-platform/packages/ai/tests/ai.test.ts | 725 | writes structured JSON to stderr', () => { |
| 03-platform/packages/ai/tests/coverage-gaps.test.ts | 28 | branches', () => { |
| 03-platform/packages/ai/tests/coverage-gaps.test.ts | 29 | methods work', () => { |
| 03-platform/packages/crypto/CHANGELOG.md | 90 | in `NativeZkpEngine`. `schnorrProveIdentityAttribute` now normalizes arbitrary ` |

> Review and resolve these before they become blockers.

## Code Quality

**Discovered:** 2026-05-27

- Add pitfalls here as they are discovered
