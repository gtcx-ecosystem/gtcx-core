# repo/ — Scaffolding Layer

Templates and structures to copy into individual project repos. These define the standard shape of a project. Fill in `{curly-brace}` placeholders for each specific service.

---

## Contents

| Folder                                | Purpose                                                      |
| ------------------------------------- | ------------------------------------------------------------ |
| [`1-agents/`](1-agents/README.md)     | Onboarding, roles, team structure, workflows, governance     |
| [`2-docs/`](2-docs/README.md)         | Product, company, engineering, devops, specs, reference docs |
| [`3-agile/`](3-agile/README.md)       | Sprints, backlogs, audits, reports, incidents, hygiene       |
| [`4-sessions/`](4-sessions/README.md) | Session protocols, transcripts, insights, handoffs           |
| [`5-release/`](5-release/README.md)   | Release checklists, versioning, legal, licensing             |
| [`6-metrics/`](6-metrics/README.md)   | Metrics and dashboard templates                              |
| [`7-examples/`](7-examples/README.md) | Filled-in reference examples                                 |
| [`8-scripts/`](8-scripts/README.md)   | Repo hygiene and automation scripts                          |
| [`.gtcx/`](.gtcx/README.md)           | Architecture decisions (ADRs) and engineering principles     |

---

## How to Use

1. Identify which folders your new repo needs
2. Copy the relevant folder structure into your repo root
3. Replace all `{curly-brace}` placeholders with service-specific values
4. Replace all `[Square Bracket]` placeholders with organization-specific values
5. Delete scaffolding sections that do not apply

## What Belongs Here

- Templates meant to be copied and filled in per project
- Folder structures that define a project's shape
- Examples of completed templates (in `examples/`)

## What Does NOT Belong Here

- Universal governing rules — those live in `system/`
- Project-specific filled-in content from actual repos
