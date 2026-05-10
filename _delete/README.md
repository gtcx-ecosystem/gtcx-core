# Staged for Deletion

**Date:** 2026-05-09
**Reason:** Forensic documentation review — duplicates, superseded files, and unfilled templates.
**Action required:** Review this list. Delete the folder when satisfied, or move files back if needed.

---

## Files and Rationale

| File                                     | Original Location                              | Why Delete                                                                                                                                       |
| ---------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GEMINI.md`                              | `/GEMINI.md`                                   | Duplicate of engineering standards already covered by CLAUDE.md + docs/testing/quality-standards.md. 25 lines, fully superseded.                 |
| `agentic-guide.md`                       | `docs/agentic-guide.md`                        | Standalone doc authoring guide. Content covered by docs/agents/README.md and docs/agents/onboarding/. Orphaned — no other doc links to it.       |
| `docs-structure-standard-TEMPLATE.md`    | `docs/architecture/docs-structure-standard.md` | Unfilled template with `{organization-name}` placeholders. Never customized for gtcx-core.                                                       |
| `specs-backend-architecture-TEMPLATE.md` | `docs/specs/backend-architecture.md`           | Unfilled template with `[Project Name]` and `{version}` placeholders. Real backend architecture is at docs/architecture/backend-architecture.md. |
| `uat-evidence-log-DUPLICATE.md`          | `docs/agile/testing/uat/uat-evidence-log.md`   | Exact duplicate of docs/agile/testing/uat-evidence-log.md (which has actual entries). Empty template version.                                    |
| `auto-dev-cycle-1-2026-05-04.md`         | `docs/audits/`                                 | Point-in-time auto-dev cycle log from 2026-05-04. Findings fully incorporated into remediation-roadmap-10-10.md. No unique information.          |
| `auto-dev-cycle-2-2026-05-04.md`         | `docs/audits/`                                 | Same — cycle 2 snapshot. Superseded.                                                                                                             |
| `auto-dev-cycle-3-2026-05-04.md`         | `docs/audits/`                                 | Same — cycle 3 snapshot. Superseded.                                                                                                             |
| `auto-dev-cycle-4-2026-05-04.md`         | `docs/audits/`                                 | Same — cycle 4 snapshot. Superseded.                                                                                                             |
| `remediation-plan-2026-05-06.md`         | `docs/audits/`                                 | Earlier remediation plan (563 lines). Fully superseded by remediation-roadmap-10-10.md (316 lines, more current).                                |
| `10-10-roadmap-2026-05-06.md`            | `docs/audits/`                                 | Earlier 10/10 roadmap. Superseded by remediation-roadmap-10-10.md + docs/gtm/06-budget-readiness-plan.md.                                        |

## Also Fixed

| Change                         | What                                                                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `docs/audit/` → `docs/audits/` | Merged singular `docs/audit/` directory into `docs/audits/`. `gtcx-ecosystem-rating-2026-05-08.md` moved. Empty `docs/audit/` directory removed. |

## File Count Impact

- **Before:** 265 tracked markdown files
- **Staged for deletion:** 11 files
- **After deletion:** 254 tracked markdown files (4% reduction)
- **Moved (not deleted):** 1 file (ecosystem rating consolidated)

## How to Finalize

```bash
# Review complete — delete the staged files
rm -rf _delete/

# Or if you want to keep something, move it back first:
# mv _delete/GEMINI.md ./GEMINI.md
```
