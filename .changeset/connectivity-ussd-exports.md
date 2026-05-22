---
'@gtcx/connectivity': minor
---

Declare USSD protocol handler exports added in `3cdc511`
(`feat(connectivity): implement USSD protocol handlers per 10/10-roadmap M2`).

**New exports**

- `UssdParsedInput`, `UssdParseError`, `UssdParser` — parser surface for
  USSD session strings.
- `UssdRequest`, `UssdResponse` — request/response types for USSD
  interactions.
- `UssdSession`, `UssdSessionData`, `UssdSessionOptions`,
  `UssdSessionState` — session lifecycle.

This is a declaration-only changeset; the exports already exist in the
source tree. Required by `api:check:release` so the next publish
records the minor bump.
