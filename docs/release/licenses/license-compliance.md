---
title: "License Compliance — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "release"]
review_cycle: "on-change"
---

---
title: 'License Compliance'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'
---

# License Compliance — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Per-release audit of all open-source dependencies in `@gtcx/*` packages and `gtcx-*` crates.

---

## License Policy

| License Type             | Usage                    | Notes                                                     |
| ------------------------ | ------------------------ | --------------------------------------------------------- |
| MIT                      | Permitted — unrestricted | Attribution required in NOTICE                            |
| Apache 2.0               | Permitted — unrestricted | Attribution required in NOTICE                            |
| BSD (2-clause, 3-clause) | Permitted — unrestricted | Attribution required in NOTICE                            |
| ISC                      | Permitted — unrestricted | Attribution required in NOTICE                            |
| MPL 2.0                  | Permitted with review    | File-level copyleft — no modifications without disclosure |
| LGPL                     | Permitted with review    | Dynamic linking only — no static bundling                 |
| GPL / AGPL               | Prohibited               | Incompatible with commercial distribution                 |
| Unlicense / CC0          | Permitted                | No attribution required                                   |
| Custom / proprietary     | Legal review required    | Case-by-case                                              |

---

## Audit Procedure

Run before every release:

```bash
# npm ecosystem — requires license-checker or similar
pnpm audit --audit-level moderate
npx license-checker --production --failOn "GPL;AGPL"

# Rust ecosystem
cd rust && cargo deny check licenses
```

For any license outside the permitted list: open an issue, get legal review, do not publish until resolved.

---

## Audit Records

| Release | Date | Result | Notable Licenses | Reviewer |
| ------- | ---- | ------ | ---------------- | -------- |

---

## Attribution

For packages that require attribution, maintain `NOTICE.md` at the repo root. Include the package name, license type, and copyright notice.
