# @gtcx/ai-eval

AI evaluation pipeline for the GTCX ecosystem. Quantifies agent accuracy, safety, efficiency, and context utilization after every agent-driven change.

**Strategic goal:** Ship machine-readable trust scorecards on every release — encoded GTCX safety rules and gate semantics that are hard to copy in 90 days. Roadmap: [docs/roadmap.md §4.10](../../docs/roadmap.md#410-gtcxai-eval--machine-readable-trust-scorecards-strategic-moat) · Spec: [ai-evaluation-pipeline.md](../../docs/specs/ai-evaluation-pipeline.md).

## Usage

```bash
# Evaluate current repo
pnpm ai:evaluate

# Evaluate with custom baseline
pnpm ai:evaluate --baseline 01-docs/01-agents/evaluations/baseline-2026-05-01.json

# Evaluate only safety
pnpm ai:evaluate --dimensions safety

# Strict mode — fails if any dimension below threshold
pnpm ai:evaluate --strict
```

## Dimensions

| Dimension  | What it measures                      | Threshold                                   |
| ---------- | ------------------------------------- | ------------------------------------------- |
| Accuracy   | Test pass rate                        | ≥95% (≥98% for security packages)           |
| Safety     | Diff scan against `safety-rules.json` | Zero block violations                       |
| Efficiency | Tokens per task, duration per task    | ≤10% token increase, ≤20% duration increase |
| Context    | Context window utilization            | Score ≥0.7                                  |

## Scorecard Output

JSON matching the `AIScorecard` schema. See `src/types.ts` for full type definition.

## Programmatic API

```typescript
import { evaluateAccuracy, evaluateSafety, buildScorecard } from '@gtcx/ai-eval';

const accuracy = await evaluateAccuracy('/path/to/repo');
const safety = await evaluateSafety('/path/to/repo', 'main');
const scorecard = buildScorecard(meta, accuracy, safety, efficiency, context);
```

## Implementation Status

| Step | Deliverable                   | Status     |
| ---- | ----------------------------- | ---------- |
| 1    | Package scaffold              | ✅ Done    |
| 2    | Accuracy engine               | ✅ Done    |
| 3    | Safety scanner                | ✅ Done    |
| 4    | Efficiency engine             | ✅ Done    |
| 5    | Context tracker               | ✅ Done    |
| 6    | CLI entry point               | ✅ Done    |
| 7    | CI workflow                   | 📋 Planned |
| 8    | Baseline snapshot             | 📋 Planned |
| 9    | Roll out to baseline-os       | 📋 Planned |
| 10   | Roll out to gtcx-intelligence | 📋 Planned |

## Specification

`gtcx-core/docs/specs/ai-evaluation-pipeline.md`
