# Kimi Agent Context — GTCX Core

> **Agent:** Kimi Code CLI
> **Status:** Current
> **Date:** 2026-05-12

---

## 1. Skill Loading Protocol

Kimi Code CLI can load skills from `SKILL.md` files. This repo has no project-specific skills yet.

**To create a skill:**

1. Write `docs/agents/skills/<skill-name>/SKILL.md`
2. Reference it in `KIMI.md` below
3. Skills are modular, composable, and reusable across repos

**Current built-in skills available:**

- `kimi-cli-help` — Kimi CLI usage, config, troubleshooting
- `skill-creator` — Guide for creating effective skills

---

## 2. Kimi-Specific Conventions

| Convention       | Rule                                                       |
| ---------------- | ---------------------------------------------------------- |
| Tool use         | Prefer `Agent` tool for exploration; `Shell` for execution |
| Background tasks | Use `run_in_background=true` for long builds/tests         |
| Plan mode        | Use `EnterPlanMode` for multi-file changes >2-3 files      |
| Skills           | Read `SKILL.md` before using a skill                       |

---

## 3. Kimi CLI Configuration

Kimi reads from `~/.config/kimi/config.yaml` (user-level) and respects repo-level conventions.

No repo-level Kimi config exists yet. To create one:

```bash
mkdir -p .kimi
echo "model: kimi-k1.5" > .kimi/config.yaml
```

---

## 4. Differences from AGENTS.md

| AGENTS.md Prescription      | Kimi Override                     |
| --------------------------- | --------------------------------- |
| Generic agent instructions  | Kimi-specific tool patterns       |
| No skill system             | Skills loaded from `SKILL.md`     |
| No background task guidance | Background tasks for builds/tests |

---

## 5. Fallback

If `KIMI.md` conflicts with `AGENTS.md`, **AGENTS.md wins**.
