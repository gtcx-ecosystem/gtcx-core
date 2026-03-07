# Engineering

Architecture documentation for [Organization Name] — how the system is designed, built, and run.

## Contents

| Folder                                     | Description                                                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| [2-system-design/](2-system-design/)       | API design, content schema, database schema, repo and docs templates                    |
| [3-technology-stack/](3-technology-stack/) | Technology choices, dependency boundaries, version standards                            |
| [4-deployment/](4-deployment/)             | Deployment architecture, environment topology, cloud config                             |
| [5-compliance/](5-compliance/)             | Regulatory requirements, SOC 2 evidence pipeline                                        |
| [6-decisions/](6-decisions/)               | ADR template and authoring guide (actual ADRs live in `.gtcx/decisions/`)               |
| [7-security/](7-security/)                 | Security policies, threat models, vulnerability management                              |
| [agentic-guide.md](agentic-guide.md)       | Architecture documentation standard — folder structure, authoring rules, review cadence |

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       [Organization Name] Ecosystem                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      INTELLIGENCE LAYER                              │   │
│  │                                                                      │   │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │   │
│  │  │ [Index A]│    │ [Index C]│    │[Intel.   │    │ Research │      │   │
│  │  │  Index   │    │  Index   │    │ Product] │    │  Themes  │      │   │
│  │  └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘      │   │
│  │       │               │               │               │             │   │
│  │       └───────────────┴───────────────┴───────────────┘             │   │
│  │                               │                                      │   │
│  │                      KNOWLEDGE BASE                                  │   │
│  │              (Entities, Regulatory Tracker, Glossary)                │   │
│  └──────────────────────────────┬───────────────────────────────────────┘   │
│                                 │                                           │
│  ┌──────────────────────────────▼───────────────────────────────────────┐   │
│  │                      PUBLISHING LAYER                                │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │                   AGENTIC PRODUCTION                          │   │   │
│  │  │                                                               │   │   │
│  │  │  Scout Agents → Synthesis Agents → Production Agents → QA     │   │   │
│  │  │                                                               │   │   │
│  │  │        [AI SYSTEM] ORCHESTRATION (iterate until done)         │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │                   EDITORIAL LAYER                             │   │   │
│  │  │  Voice Guide │ Style Guide │ Quality Standards │ Human Gates  │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │                   DISTRIBUTION                                │   │   │
│  │  │     Email │ LinkedIn │ Twitter │ API │ Syndication            │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────┬───────────────────────────────────────┘   │
│                                 │                                           │
│  ┌──────────────────────────────▼───────────────────────────────────────┐   │
│  │                      PLATFORM LAYER                                  │   │
│  │                                                                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │[PLATFORM │ │[PLATFORM │ │[PLATFORM │ │[PLATFORM │ │[PLATFORM │  │   │
│  │  │   A]     │ │   B]     │ │   C]     │ │   D]     │ │   E]     │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  │                                                                      │   │
│  │  ┌──────────┐ ┌──────────┐                                          │   │
│  │  │[PLATFORM │ │[PLATFORM │                                          │   │
│  │  │   F]     │ │   G]     │                                          │   │
│  │  └──────────┘ └──────────┘                                          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

For documentation standards and folder rules, see [agentic-guide.md](agentic-guide.md).
