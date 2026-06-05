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

ARTIFACT_DIR="$ROOT_DIR/artifacts"
mkdir -p "$ARTIFACT_DIR"
OUT_PATH="$ARTIFACT_DIR/branch-protection-main.json"
UNAVAILABLE_PATH="$ARTIFACT_DIR/branch-protection-main.unavailable.json"

set +e
API_OUTPUT="$(gh api "repos/${REPO}/branches/${BRANCH}/protection" 2>&1)"
API_EXIT=$?
set -e

if [[ $API_EXIT -ne 0 ]]; then
  if grep -q "Upgrade to GitHub Pro or make this repository public to enable this feature" <<<"$API_OUTPUT"; then
    cat >"$UNAVAILABLE_PATH" <<EOF
{
  "status": "unavailable",
  "repository": "${REPO}",
  "branch": "${BRANCH}",
  "checkedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "reason": "GitHub branch protection API unavailable for this repository plan/visibility.",
  "rawError": $(jq -Rs . <<<"$API_OUTPUT")
}
EOF
    echo "WARN: Branch protection API unavailable for ${REPO}:${BRANCH} (GitHub plan/visibility constraint)"
    echo "Evidence written: ${UNAVAILABLE_PATH}"
    exit 0
  fi

  echo "ERROR: Failed to query branch protection API" >&2
  echo "$API_OUTPUT" >&2
  exit 1
fi

JSON="$API_OUTPUT"

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

printf '%s\n' "$JSON" >"$OUT_PATH"

echo "PASS: Branch protection checks verified for ${REPO}:${BRANCH}"
echo "Evidence written: ${OUT_PATH}"
