#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

REPO="${GITHUB_REPOSITORY:-gtcx-ecosystem/gtcx-core}"
BRANCH="${1:-main}"

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI is required" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh auth is not valid. Run: gh auth login -h github.com" >&2
  exit 1
fi

JSON="$(gh api "repos/${REPO}/branches/${BRANCH}/protection")"

require_bool() {
  local value="$1"
  local label="$2"
  if [[ "$value" != "true" ]]; then
    echo "FAIL: ${label} is not enabled" >&2
    exit 1
  fi
}

require_bool "$(jq -r '.required_pull_request_reviews != null' <<<"$JSON")" "required_pull_request_reviews"
require_bool "$(jq -r '.required_pull_request_reviews.require_code_owner_reviews' <<<"$JSON")" "require_code_owner_reviews"
require_bool "$(jq -r '.required_status_checks.strict' <<<"$JSON")" "required_status_checks.strict"

for check in "CI / ci" "CI / rust" "CI / security" "CI / docker"; do
  if ! jq -e --arg c "$check" '.required_status_checks.checks[] | select(.context == $c)' <<<"$JSON" >/dev/null; then
    echo "FAIL: missing required status check: ${check}" >&2
    exit 1
  fi
done

ARTIFACT_DIR="$ROOT_DIR/artifacts"
mkdir -p "$ARTIFACT_DIR"
OUT_PATH="$ARTIFACT_DIR/branch-protection-main.json"
printf '%s\n' "$JSON" >"$OUT_PATH"

echo "PASS: Branch protection checks verified for ${REPO}:${BRANCH}"
echo "Evidence written: ${OUT_PATH}"
