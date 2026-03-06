# @gtcx/connectivity

Connectivity profiling utilities. Provides a detector that classifies runtime connectivity into a small set of profiles.

## Scope

- `ConnectivityDetector` with listener hooks
- `classifyProfile` helper
- Connectivity profile types and state

## Key Exports

- `ConnectivityDetector`
- `classifyProfile`
- `ConnectivityProfile`, `ConnectivityState`

## Notes

- This package is intentionally minimal. It does not implement USSD or transport logic.

## References

- `packages/connectivity/src/types.ts`
