# Guide: Agent Context Recovery

## The Problem

AI agents have no persistent memory between sessions. Every new conversation starts from zero. Context window limits mean even within a session, early context gets compressed or lost. This leads to:

- Repeated explanations of architecture and conventions
- AI making decisions that contradict earlier ones
- Hallucinated file paths, function names, or patterns
- Regression to generic patterns instead of project-specific ones
- Wasted time re-establishing what was already known

## The Solution: Context Layers

Build context recovery into the project structure itself. Instead of relying on conversation history, encode knowledge into files the agent can read at session start.

### Layer 1: CLAUDE.md (Automatic — loaded every session)

The most critical file. Lives at repo root. Automatically loaded by Claude Code.

**What to include:**

- Project name, what it does (2-3 sentences)
- Tech stack (exact versions)
- Monorepo structure (which folders are what)
- Key commands: install, build, test, lint, dev
- Architecture summary (3-5 bullet points)
- Current conventions: naming, file structure, testing patterns
- Common pitfalls: things the AI gets wrong repeatedly
- Active work: current branch, current task, what's in progress

**What NOT to include:**

- Full architecture docs (link to them instead)
- Detailed specs (too much noise for every session)
- Historical context that's no longer relevant

Keep it under 200 lines. Update it as the project evolves.

### Layer 2: Memory Files (Persistent across sessions)

For Claude Code, use `.claude/` memory directory. For other tools, use a `.ai/` or `.context/` directory.

- `MEMORY.md` — accumulated knowledge: patterns confirmed, pitfalls discovered, user preferences
- Topic files (e.g., `testing-patterns.md`, `api-conventions.md`) for detailed knowledge
- Update after every significant session — this is the agent's "long-term memory"

**Rules for memory files:**

- Only write confirmed patterns (not guesses from one session)
- Remove entries that turn out to be wrong
- Keep entries concise — these are reference notes, not documentation
- Organize by topic, not chronologically

### Layer 3: Session Handoff Documents

When ending a session that will be continued later, create a handoff doc:

- What was being worked on (exact files, line numbers)
- Current state (what's done, what's in progress, what's blocked)
- Decisions made during this session and why
- Known issues or gotchas discovered
- Exact next steps (numbered, specific)

Use the template at `templates/session-docs/session-recap.md`.

Store in: `docs/specs/_project/planning/sessions/` or a dedicated sessions folder.

### Layer 4: Codebase Self-Documentation

Make the codebase itself provide context:

- Every folder has a README explaining what's there
- Every service has a service-overview doc
- Key architectural decisions captured in ADRs
- Test files serve as living documentation of expected behavior
- Package.json scripts are descriptive (`"test:unit"`, `"dev:api"`, not just `"test"`, `"dev"`)

## Context Recovery Protocol

When starting a new session or recovering from context loss:

### Quick Recovery (< 2 minutes)

1. Agent reads CLAUDE.md (automatic)
2. Agent reads memory files
3. Agent reads last session recap (if continuing work)
4. Agent confirms understanding: "Based on my context, I understand we're working on X using Y. Last session we completed A and B. Next step is C. Correct?"

### Deep Recovery (5-10 minutes)

When starting a new area of the codebase:

1. Quick Recovery steps above
2. Agent reads the relevant service-overview doc
3. Agent reads the relevant architecture section
4. Agent explores key files (package.json, directory structure, recent git log)
5. Agent reads 2-3 relevant test files to understand expected behavior
6. Agent summarizes understanding before proceeding

### Full Recovery (after long gap or major changes)

1. Deep Recovery steps above
2. Agent reads recent ADRs for architectural decisions
3. Agent reviews git log for recent changes
4. Agent runs the test suite to verify current state
5. Agent updates memory files if anything has changed

## Maintaining Context During a Session

- When context gets compressed, anchor on CLAUDE.md + memory files
- Before major decisions, re-read the relevant protocol or spec
- If the agent starts hallucinating paths or patterns, pause and re-read the actual file structure
- Periodically save progress to a session recap (don't wait until the end)

## Red Flags (Context Has Been Lost)

Signs that an agent has lost context and needs recovery:

- Suggests files/functions that don't exist
- Uses patterns that contradict project conventions
- Asks questions that were answered earlier
- Proposes architecture that was already decided against
- Uses wrong package names, import paths, or API signatures

When you see these: stop, run the Quick Recovery protocol, then continue.

## Anti-Patterns

- Relying solely on conversation history (it gets compressed/lost)
- Writing novels in CLAUDE.md (it should be scannable, not a textbook)
- Never updating memory files (they go stale)
- Skipping session recaps ("I'll remember next time" — you won't)
- Dumping entire file contents into prompts instead of using structured context files

## File Map

| File                       | Purpose                     | When to Update                               |
| -------------------------- | --------------------------- | -------------------------------------------- |
| `CLAUDE.md`                | Auto-loaded project context | When stack, structure, or conventions change |
| `.claude/memory/MEMORY.md` | Persistent agent memory     | After every significant session              |
| `.claude/memory/*.md`      | Topic-specific knowledge    | When patterns are confirmed                  |
| Session recaps             | Session handoff             | End of every session                         |
| Service overviews          | Per-service orientation     | When service architecture changes            |
| ADRs                       | Decision record             | When significant decisions are made          |

## Reference

- templates/session-docs/session-recap.md
- templates/session-docs/project-insights.md
- templates/onboarding/service-overview.md
- templates/architecture/adr.md
- protocols/docs-structure/protocol.md
