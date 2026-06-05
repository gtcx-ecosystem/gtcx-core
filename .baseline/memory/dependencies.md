# Cross-Repo Dependencies

> Refreshed 2026-06-07 after EXT-INF-002 pack ack.

## Ecosystem Dependencies

No cross-repo link dependencies detected in package.json.

## Hard Dependencies (Blocking)

| Needs                  | From Repo           | Status                | ETA   | Blocking Epic                                      |
| ---------------------- | ------------------- | --------------------- | ----- | -------------------------------------------------- |
| ZKP transcript publish | gtcx-core           | partial               | human | CORE-004 (verify gate done; ceremony Class S)      |
| EXT-INF-002 vendor SOW | gtcx-infrastructure | outbound-acknowledged | human | Pack ack 2026-06-07; SOW signature Class S remains |
| OI-X02 hub ack         | gtcx-infrastructure | **done** 2026-06-04   | —     | ER-1-08 closed                                     |

## Soft Dependencies (Nice to have)

| Needs                                                        | From Repo  | Status        | ETA           |
| ------------------------------------------------------------ | ---------- | ------------- | ------------- |
| Agile audit refresh (6/10 snapshot stale vs five-lane model) | gtcx-agile | informational | owner refresh |

## Downstream Consumers

| Repo | What They Need | Status |
| ---- | -------------- | ------ |
| —    | —              | —      |

---

_Refresh after coordination changes: `pnpm agent:reconcile-auto-dev`_
