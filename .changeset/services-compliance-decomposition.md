---
'@gtcx/services': patch
---

Decompose `UnifiedComplianceService` into focused modules: `infrastructure.ts` (metrics/event factories), `dashboard.ts` (dashboard builder), `queries.ts` (data access), and `verification-methods.ts` (license/KYC verification). Reduces `UnifiedComplianceService.ts` from 555 to 495 LOC, removing the architecture boundary exception.
