---
'@gtcx/sync': minor
---

Declare the `resolveConflict` export added by the conflict-resolution
work in `436338d`/`79075ee` (`feat(sync): add conflict hooks` and
follow-up).

**New export**

- `resolveConflict` — conflict resolver entry point used by the
  offline-first sync engine.

This is a declaration-only changeset; the export already exists in the
source tree. Required by `api:check:release` so the next publish
records the minor bump.
