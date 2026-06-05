#!/usr/bin/env bash
# =============================================================================
# VAPOR CODE DETECTOR
# Fails if new stub patterns are introduced in production code.
# Run: ./03-platform/tools/check-vapor.sh
# CI:  Add to pre-commit or CI pipeline to prevent regression.
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

VIOLATIONS=0
WARNINGS=0

# Directories to scan (production code only)
SRC_DIRS=("03-platform/packages/*/src" "protocols/*/src" "intelligence/*/src")

# Resolve which dirs actually exist
SCAN_DIRS=()
for pattern in "${SRC_DIRS[@]}"; do
  for dir in $pattern; do
    [ -d "$dir" ] && SCAN_DIRS+=("$dir")
  done
done

if [ ${#SCAN_DIRS[@]} -eq 0 ]; then
  echo -e "${YELLOW}No source directories found to scan.${NC}"
  exit 0
fi

check_pattern() {
  local label="$1"
  local pattern="$2"
  local severity="$3"  # error or warn

  local matches
  matches=$(grep -rn --include='*.ts' --include='*.py' -E "$pattern" "${SCAN_DIRS[@]}" 2>/dev/null \
    | grep -v 'node_modules' \
    | grep -v '.test.' \
    | grep -v '__test__' \
    | grep -v '.spec.' || true)

  if [ -n "$matches" ]; then
    if [ "$severity" = "error" ]; then
      echo -e "${RED}FAIL${NC} $label"
      VIOLATIONS=$((VIOLATIONS + 1))
    else
      echo -e "${YELLOW}WARN${NC} $label"
      WARNINGS=$((WARNINGS + 1))
    fi
    echo "$matches" | head -10
    echo ""
  fi
}

echo "=== VAPOR CODE SCAN ==="
echo ""

# 1. Empty returns in service/data-access methods
check_pattern \
  "return [] in non-test service files (empty data)" \
  "return \[\];" \
  "warn"

# 2. Verify/crypto functions that always return true
check_pattern \
  "return true without preceding logic in verify/validate functions" \
  "^\s*return true;\s*$" \
  "warn"

# 3. Hardcoded confidence outside test files
check_pattern \
  "Hardcoded confidence magic number (0.XX)" \
  "confidence:\s*0\.[0-9]+" \
  "warn"

# 4. Stub/placeholder markers in production code
check_pattern \
  "STUB/PLACEHOLDER/TODO markers in production code" \
  "//\s*(STUB|PLACEHOLDER|TODO|FIXME|HACK|XXX)" \
  "warn"

# 5. Functions with all underscore-prefixed params (dead integration points)
check_pattern \
  "Functions with all _-prefixed params (unused integration points)" \
  "function\s+\w+\(\s*_\w+.*\)\s*[:{]" \
  "warn"

# 6. "quantum resistant" or "quantum-resistant" labels
check_pattern \
  "Overclaimed capability: 'quantum resistant'" \
  "quantum.?resistant" \
  "error"

# 7. random.choice / Math.random for non-test logic
check_pattern \
  "random.choice() or Math.random() in production logic" \
  "(random\.choice|Math\.random\(\))" \
  "warn"

# Summary
echo "=== SCAN COMPLETE ==="
if [ $VIOLATIONS -gt 0 ]; then
  echo -e "${RED}$VIOLATIONS violation(s) found — these MUST be fixed.${NC}"
  echo -e "${YELLOW}$WARNINGS warning(s) found — review recommended.${NC}"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}$WARNINGS warning(s) found — review recommended.${NC}"
  echo -e "${GREEN}No blocking violations.${NC}"
  exit 0
else
  echo -e "${GREEN}Clean — no vapor code detected.${NC}"
  exit 0
fi
