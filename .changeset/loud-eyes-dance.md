---
'@gtcx/services': patch
---

Decompose `registration.ts` and `trading.ts` into focused submodules

- `registration.ts`: 599 → 364 LOC (extracted `config`, `errors`, `helpers`, `types`, `validation`, `progress`)
- `trading.ts`: 728 → 411 LOC (extracted `config`, `errors`, `pricing`, `validation`, `execution`, `helpers`)
- Removed architecture boundary exceptions for both files
- All 189 tests pass, zero lint/type errors
