# Agent Context Recovery — gtcx-core

How to recover agent context across sessions, prevent context drift, and maintain codebase knowledge continuity.

## The Problem

AI agents have no persistent memory between sessions. Every new conversation starts from zero. Context window limits mean even within a session, early context gets compressed or lost. Without structure, this leads to:

- Repeated explanations of architecture and conventions
- AI making decisions that contradict prior ones
- Hallucinated file paths, function names, or patterns
- Regression to generic TypeScript patterns instead of `gtcx-core`-specific ones
- Wasted time re-establishing what was already known

## The Solution: Context Layers

Build context recovery into the project structure itself. Instead of relying on conversation history, encode knowledge into files the agent reads at session start.

### Layer 1: CLAUDE.md (Automatic — loaded every session)

Lives at the repo root. Automatically loaded by Claude Code.

**What to include:**

- Project name and what it does (2-3 sentences)
- Tech stack (exact versions, Rust + TypeScript)
- Monorepo structure (which folders are what)
- Key commands: install, build, test, lint
- Architecture summary (3-5 bullet points)
- Current conventions: naming, file structure, testing patterns
- Common pitfalls: things AI gets wrong in this repo repeatedly
- Active work: current branch, current task, what's in progress

**What NOT to include:**

- Full architecture docs (link to them instead)
- Detailed specs (too much noise for every session)
- Historical context that's no longer relevant

Keep it under 200 lines. Update it as the project evolves.

### Layer 2: Memory Files (Persistent across sessions)

Located at `.claude/projects/…/memory/`. Updated by the agent as patterns are confirmed.

- `MEMORY.md` — accumulated knowledge: confirmed patterns, pitfalls discovered, user preferences
- Topic files for detailed knowledge (e.g., `rust-patterns.md`, `zkp-conventions.md`)

**Rules for memory files:**

- Only write confirmed patterns — not guesses from a single session
- Remove entries that turn out to be wrong
- Keep entries concise — reference notes, not documentation
- Organize by topic, not chronologically

### Layer 3: Session Handoff Documents

When ending a session that will be continued later, create a handoff doc in `SOP/4-sessions/handoffs/`:

- What was being worked on (exact files, line numbers)
- Current state: what's done, what's in progress, what's blocked
- Decisions made during this session and why
- Known issues or gotchas discovered
- Exact next steps (numbered, specific)

Naming: `YYYY-MM-DD-handoff.md`

### Layer 4: Codebase Self-Documentation

Make the codebase itself provide context:

- Every SOP folder has a README explaining what's there
- Every package has a README with its purpose and key API surface
- Key architectural decisions are captured as ADRs in `SOP/2-docs/1-architecture/decisions/`
- Test files serve as living documentation of expected behavior
- `pnpm` scripts are descriptive (`test:coverage:critical`, not just `test`)

## Context Recovery Protocol

### Quick Recovery (< 2 minutes)

1. Agent reads `CLAUDE.md` (automatic on session start).
2. Agent reads memory files.
3. Agent reads last session handoff if continuing prior work.
4. Agent confirms understanding before proceeding.

### Deep Recovery (5–10 minutes)

When starting work in an unfamiliar area of the codebase:

1. Quick Recovery steps above.
2. Agent reads `SOP/1-agents/orientation.md`.
3. Agent reads the relevant architecture section (`SOP/2-docs/1-architecture/`).
4. Agent reads the relevant package spec (`SOP/2-docs/2-specs/packages/`).
5. Agent reads 2–3 test files to understand expected behavior patterns.
6. Agent summarizes understanding before proceeding.

### Full Recovery (after long gap or major refactor)

1. Deep Recovery steps above.
2. Agent reads recent ADRs for architectural decisions.
3. Agent runs `git log --oneline -20` to review recent changes.
4. Agent runs `pnpm test` to verify current state.
5. Agent updates memory files if anything has changed.

## Maintaining Context During a Session

- When context gets compressed, anchor on `CLAUDE.md` + memory files.
- Before major decisions, re-read the relevant ADR or spec.
- If the agent starts hallucinating paths or patterns, pause and re-read the actual file structure.
- Periodically commit progress to create concrete checkpoints.

## Red Flags (Context Has Been Lost)

Signs that an agent has lost context and needs recovery:

- Suggests file paths or functions that don't exist
- Uses patterns that contradict `code-standards.md` or existing packages
- Asks questions that were answered earlier in the session
- Proposes architecture that conflicts with existing ADRs
- Uses wrong import paths, package names, or API signatures

When you see these: run the Quick Recovery protocol before continuing.

## File Map

| File                           | Purpose                        | When to Update                                    |
| ------------------------------ | ------------------------------ | ------------------------------------------------- |
| `CLAUDE.md`                    | Auto-loaded project context    | When stack, structure, or conventions change      |
| `.claude/memory/MEMORY.md`     | Persistent agent memory        | After every significant session                   |
| `.claude/memory/*.md`          | Topic-specific knowledge       | When patterns are confirmed across sessions       |
| `SOP/4-sessions/handoffs/*.md` | Session handoff                | End of every session with in-progress work        |
| `SOP/4-sessions/insights/*.md` | Session insights and new ideas | When significant decisions or patterns surface    |
| ADRs                           | Decision record                | When significant architectural decisions are made |

## Anti-Patterns

- Relying solely on conversation history (it gets compressed and lost).
- Writing too much in CLAUDE.md — it should be scannable, not a textbook.
- Never updating memory files — they go stale and mislead future sessions.
- Skipping session handoffs for in-progress work.
- Dumping entire file contents into prompts instead of using structured context files.

## References

- [orientation.md](./orientation.md) — codebase map and session start protocol
- [safety-rules.md](./safety-rules.md) — what requires human approval
- [SOP/4-sessions/README.md](../4-sessions/README.md) — session document structure
- [SOP/2-docs/1-architecture/decisions/](../2-docs/1-architecture/decisions/README.md) — all ADRs
