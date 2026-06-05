## Protocol 27 — execution obligation (v1.1.0)

**You run commands.** Dev servers, gates, `adb`, and probes are agent-run — not operator checklists.

| Resource   | Path                                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| Hub spec   | `gtcx-docs/01-docs/governance/protocols/27-agent-execution-obligation/protocol.md` |
| Local rule | `.cursor/rules/protocol-27-agent-execution-obligation.mdc`                         |

**Before asking the human to run anything:** D1 Shell → D2 background → D3 `pnpm agent:git-push` (node spawn) → D4 owner repo → D5 `pnpm --dir ../gtcx-agentic ecosystem:push-all` → D6 Permission Unblock Report.

**IDE vs CLI:** Yolo (`~/.cursor/cli-config.json`, `approvalMode: unrestricted`) applies to **Cursor CLI** — not IDE Composer. IDE push: `pnpm agent:git-push`.

**Mobile:** background `expo start` / Metro; `adb reverse` + `am start` — not “press r” alone.

**Forbidden:** “verify locally”, “focus your terminal”, “run these commands”, “let me know when you've run”.
