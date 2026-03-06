# @gtcx/connectivity

Network connectivity detection and profiling for offline-first GTCX applications.

## Scope

- `ConnectivityDetector` with listener hooks
- `classifyProfile` — classifies runtime into a connectivity profile
- Profile and state type definitions

## Key Exports

| Export                 | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `ConnectivityDetector` | Detector instance with `onChange` listener support    |
| `classifyProfile`      | Classifies signal strength / bandwidth into a profile |
| `ConnectivityProfile`  | Profile type: `offline`, `low`, `medium`, `high`      |
| `ConnectivityState`    | Current connectivity state shape                      |

## Notes

- Intentionally minimal — does not implement USSD, SMS fallback, or transport switching.
- Consuming layers use the profile classification to determine sync behavior, offline queue activation, and UI state.

## References

- `packages/connectivity/src/types.ts`
