---
title: 'Docs Standard: Machine-Readable Documents'
status: 'current'
date: '2026-05-12'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['agentic', 'docs', 'machine-readable', 'schema']
review_cycle: 'quarterly'
---

## 1. Principle

All documentation in the GTCX ecosystem must be **machine-readable first, human-readable second.**

An agent must be able to:

- Parse any doc's metadata without regex or NLP
- Discover all docs and their relationships via a manifest
- Validate any doc against a schema
- Route tasks to the correct role via structured rules
- Understand safety constraints without parsing prose

Humans still read the docs — but the structure serves agents first.

---

## 2. YAML Frontmatter

### 2.1 Required Fields

Every `.md` file in `docs/` must have YAML frontmatter:

```yaml
---
title: "Document Title"
status: "current" | "draft" | "deprecated" | "superseded"
date: "2026-05-12"
owner: "protocol-architect" | "crypto-security-engineer" | "frontier-infra-engineer" | "quality-evidence-lead"
role: "protocol-architect" | "crypto-security-engineer" | "frontier-infra-engineer" | "quality-evidence-lead"
tier: "critical" | "standard" | "informational"
tags: ["security", "crypto", "agentic", "compliance"]
review_cycle: "quarterly" | "monthly" | "on-change"
---
```

### 2.2 Field Definitions

| Field          | Type     | Required | Description                                                                         |
| -------------- | -------- | -------- | ----------------------------------------------------------------------------------- |
| `title`        | string   | Yes      | Human-readable title                                                                |
| `status`       | enum     | Yes      | `current`, `draft`, `deprecated`, `superseded`                                      |
| `date`         | ISO date | Yes      | Last updated date                                                                   |
| `owner`        | enum     | Yes      | Person/role responsible                                                             |
| `role`         | enum     | Yes      | Agent role that owns this doc                                                       |
| `tier`         | enum     | Yes      | `critical` (blocks release), `standard` (governs work), `informational` (reference) |
| `tags`         | string[] | Yes      | At least one tag from approved list                                                 |
| `review_cycle` | enum     | Yes      | How often this doc must be reviewed                                                 |

### 2.3 Frontmatter Validation

```bash
# Validate all docs
pnpm docs:check-frontmatter

# Validate single file
node tools/check-doc-frontmatter.mjs docs/agents/docs-standard-machine-readable.md
```

---

## 3. JSON Schemas

### 3.1 Role Schema

`docs/agents/schemas/role.schema.json` defines the machine-readable role entity:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "archetype", "owns", "autonomous"],
  "properties": {
    "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "archetype": { "type": "string" },
    "owns": {
      "type": "array",
      "items": { "type": "string", "format": "uri-reference" }
    },
    "doesNotOwn": {
      "type": "array",
      "items": { "type": "string", "format": "uri-reference" }
    },
    "autonomous": { "type": "boolean" },
    "autonomousBoundaries": {
      "type": "array",
      "items": { "type": "string" }
    },
    "escalationTriggers": {
      "type": "array",
      "items": { "type": "string" }
    },
    "requiredArtifacts": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

### 3.2 Playbook Schema

`docs/agents/schemas/playbook.schema.json` defines the machine-readable playbook entity:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "trigger", "output", "steps"],
  "properties": {
    "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "trigger": { "type": "string" },
    "output": { "type": "string" },
    "preFlight": {
      "type": "array",
      "items": { "type": "string" }
    },
    "steps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["number", "action", "verification"],
        "properties": {
          "number": { "type": "integer" },
          "action": { "type": "string" },
          "verification": { "type": "string" },
          "gates": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    },
    "postFlight": {
      "type": "array",
      "items": { "type": "string" }
    },
    "hardRules": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["rule", "scope", "severity"],
        "properties": {
          "rule": { "type": "string" },
          "scope": { "type": "string" },
          "severity": { "enum": ["critical", "high", "medium", "low"] },
          "enforcement": { "enum": ["gate", "human-in-loop", "audit"] }
        }
      }
    },
    "references": {
      "type": "array",
      "items": { "type": "string", "format": "uri-reference" }
    }
  }
}
```

### 3.3 ADR Schema

`docs/agents/schemas/adr.schema.json` defines the machine-readable ADR entity:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "status", "date", "title", "context", "decision", "consequences"],
  "properties": {
    "id": { "type": "string", "pattern": "^ADR-[0-9]{3}$" },
    "status": { "enum": ["proposed", "accepted", "deprecated", "superseded"] },
    "date": { "type": "string", "format": "date" },
    "title": { "type": "string" },
    "context": { "type": "string" },
    "decision": { "type": "string" },
    "consequences": {
      "type": "object",
      "properties": {
        "positive": { "type": "array", "items": { "type": "string" } },
        "negative": { "type": "array", "items": { "type": "string" } },
        "neutral": { "type": "array", "items": { "type": "string" } }
      }
    },
    "supersededBy": { "type": "string", "pattern": "^ADR-[0-9]{3}$" },
    "related": {
      "type": "array",
      "items": { "type": "string", "pattern": "^ADR-[0-9]{3}$" }
    }
  }
}
```

### 3.4 Doc Schema

`docs/agents/schemas/doc.schema.json` validates frontmatter:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["title", "status", "date", "owner", "role", "tier", "tags", "review_cycle"],
  "properties": {
    "title": { "type": "string", "minLength": 1 },
    "status": { "enum": ["current", "draft", "deprecated", "superseded"] },
    "date": { "type": "string", "format": "date" },
    "owner": {
      "enum": [
        "protocol-architect",
        "crypto-security-engineer",
        "frontier-infra-engineer",
        "quality-evidence-lead",
        "product-lead"
      ]
    },
    "role": {
      "enum": [
        "protocol-architect",
        "crypto-security-engineer",
        "frontier-infra-engineer",
        "quality-evidence-lead",
        "product-lead"
      ]
    },
    "tier": { "enum": ["critical", "standard", "informational"] },
    "tags": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string", "pattern": "^[a-z0-9-]+$" }
    },
    "review_cycle": { "enum": ["quarterly", "monthly", "on-change"] }
  }
}
```

---

## 4. docs-manifest.json

### 4.1 Purpose

Auto-generated manifest mapping all docs, roles, playbooks, and ADRs.

### 4.2 Generation

```bash
# Generate manifest
node tools/generate-docs-manifest.mjs

# Output: docs/agents/docs-manifest.json
```

### 4.3 Manifest Structure

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-05-12T00:00:00Z",
  "repo": "gtcx-ecosystem/gtcx-core",
  "docs": {
    "docs/agents/docs-standard-machine-readable.md": {
      "title": "Docs Standard: Machine-Readable Documents",
      "status": "current",
      "date": "2026-05-12",
      "owner": "protocol-architect",
      "role": "protocol-architect",
      "tier": "critical",
      "tags": ["agentic", "docs", "machine-readable", "schema"],
      "review_cycle": "quarterly",
      "outgoingLinks": ["docs/agents/schemas/role.schema.json"],
      "incomingLinks": ["docs/audit:10-10-roadmap-2026-05-11.md"]
    }
  },
  "roles": {
    "protocol-architect": {
      "docsOwned": ["docs/agents/docs-standard-machine-readable.md"],
      "playbooksOwned": ["docs/agents/workflows/tasks/write-adr.md"]
    }
  },
  "playbooks": {
    "update-repo-overview": {
      "doc": "docs/agents/workflows/tasks/update-repo-overview.md",
      "trigger": "After every master audit cycle",
      "output": "docs/overview/README.md"
    }
  },
  "adrs": {
    "ADR-013": {
      "doc": "docs/decisions/013-api-baseline-and-performance-budget-gates.md",
      "status": "accepted",
      "supersededBy": null
    }
  }
}
```

---

## 5. Structured Safety Rules

### 5.1 Format

`docs/agents/safety-rules.json` replaces prose rules with a structured array:

```json
[
  {
    "id": "SR-001",
    "rule": "never-skip-ci",
    "description": "Never commit code that bypasses or skips CI verification gates",
    "scope": "all",
    "severity": "critical",
    "enforcement": "gate",
    "trigger": "pre-commit",
    "verification": "pnpm lint && pnpm test && pnpm architecture:check"
  },
  {
    "id": "SR-002",
    "rule": "no-raw-ai-approval",
    "description": "No raw AI output can approve consequential actions without human review",
    "scope": "consequential",
    "severity": "critical",
    "enforcement": "human-in-loop",
    "trigger": "ai-output",
    "verification": "Human CODEOWNER approval required"
  },
  {
    "id": "SR-003",
    "rule": "no-secrets-in-source",
    "description": "No API keys, tokens, or passwords in source code",
    "scope": "all",
    "severity": "critical",
    "enforcement": "gate",
    "trigger": "pre-commit",
    "verification": "trufflehog filesystem --path ."
  },
  {
    "id": "SR-004",
    "rule": "signed-commits-required",
    "description": "All commits must be cryptographically signed",
    "scope": "all",
    "severity": "high",
    "enforcement": "gate",
    "trigger": "push",
    "verification": "git verify-commit HEAD"
  },
  {
    "id": "SR-005",
    "rule": "architecture-boundary-enforced",
    "description": "No cross-package dependencies without explicit approval",
    "scope": "packages",
    "severity": "high",
    "enforcement": "gate",
    "trigger": "pr-review",
    "verification": "pnpm architecture:check"
  }
]
```

### 5.2 Validation

```bash
# Validate safety rules against schema
node tools/validate-safety-rules.mjs
```

---

## 6. Machine-Routing Rules

### 6.1 Format

`docs/agents/routing-rules.json` defines how tasks route to roles:

```json
{
  "schemaVersion": 1,
  "rules": [
    {
      "role": "protocol-architect",
      "triggers": [
        { "pattern": "packages/*/package.json", "weight": 1.0 },
        { "pattern": "docs/architecture/**", "weight": 1.0 },
        { "pattern": "docs/decisions/**", "weight": 1.0 },
        { "pattern": "pnpm-workspace.yaml", "weight": 1.0 }
      ],
      "autonomous": false,
      "requiredReviewers": ["protocol-architect"]
    },
    {
      "role": "crypto-security-engineer",
      "triggers": [
        { "pattern": "packages/crypto/**", "weight": 1.0 },
        { "pattern": "rust/gtcx-crypto/**", "weight": 1.0 },
        { "pattern": "rust/gtcx-zkp/**", "weight": 1.0 },
        { "pattern": "packages/security/**", "weight": 0.5 }
      ],
      "autonomous": false,
      "requiredReviewers": ["crypto-security-engineer"]
    },
    {
      "role": "frontier-infra-engineer",
      "triggers": [
        { "pattern": "packages/connectivity/**", "weight": 1.0 },
        { "pattern": "packages/sync/**", "weight": 1.0 },
        { "pattern": "packages/network/**", "weight": 1.0 },
        { "pattern": "rust/gtcx-network/**", "weight": 1.0 },
        { "pattern": "rust/gtcx-edge/**", "weight": 1.0 }
      ],
      "autonomous": true,
      "autonomousBoundaries": ["packages/connectivity/**", "packages/sync/**"],
      "requiredReviewers": []
    },
    {
      "role": "quality-evidence-lead",
      "triggers": [
        { "pattern": "docs/audit/**", "weight": 1.0 },
        { "pattern": "docs/compliance/**", "weight": 1.0 },
        { "pattern": "docs/security/**", "weight": 0.5 },
        { "pattern": "quality/**", "weight": 1.0 },
        { "pattern": "benchmarks/**", "weight": 1.0 }
      ],
      "autonomous": true,
      "autonomousBoundaries": ["docs/audit/**", "quality/**"],
      "requiredReviewers": []
    }
  ]
}
```

### 6.2 Routing Algorithm

For a given PR or task:

1. Match file paths against trigger patterns
2. Sum weights per role
3. Select highest-weight role(s)
4. If `autonomous: true` and all changed files within `autonomousBoundaries`, auto-approve
5. Otherwise, require `requiredReviewers`

---

## 7. Verification Gates

| Gate              | Command                                | Blocks Release? |
| ----------------- | -------------------------------------- | --------------- |
| Frontmatter lint  | `pnpm docs:check-frontmatter`          | Yes             |
| Schema validation | `node tools/validate-schemas.mjs`      | Yes             |
| Docs manifest     | `node tools/check-docs-manifest.mjs`   | Yes             |
| Safety rules      | `node tools/validate-safety-rules.mjs` | Yes             |

---

## 8. Migration Path

### Phase 1: Foundation (M1)

- Write this standard doc
- Create JSON schemas (role, playbook, ADR, doc)
- Frontmatter on 50% of docs

### Phase 2: Hardening (M2)

- Frontmatter on 100% of docs
- Create `docs-manifest.json` generator
- Structured safety rules created

### Phase 3: Certification (M3)

- `pnpm docs:check-frontmatter` passes in CI
- Machine-routing rules active
- Typedoc API docs generated

### Phase 4: Reference (M4)

- All docs validated by schema
- Manifest auto-generated on every commit
- Routing rules drive CODEOWNERS assignment
