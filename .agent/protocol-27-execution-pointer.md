## Protocol 27 — execution obligation (v1.1.0)

**You run commands.** Dev servers, gates, `adb`, and probes are agent-run — not operator checklists.

| Resource   | Path                                                                            |
| ---------- | ------------------------------------------------------------------------------- |
| Hub spec   | `gtcx-docs/docs/governance/protocols/27-agent-execution-obligation/protocol.md` |
| Local rule | `.cursor/rules/protocol-27-agent-execution-obligation.mdc`                      |

**Before asking the human to run anything:** diagnosis D1 Shell → D2 background → D3 node spawn → D4 owner repo → D5 ecosystem scripts → D6 Permission Unblock Report.

**Mobile:** background `expo start` / Metro; `adb reverse` + `am start` — not “press r” alone.

**Git push (IDE harness):** `pnpm --dir ../gtcx-agentic ecosystem:push-all` when bare `git push` is denied.

**Forbidden:** “verify locally”, “focus your terminal”, “run these commands”, “let me know when you've run”.
