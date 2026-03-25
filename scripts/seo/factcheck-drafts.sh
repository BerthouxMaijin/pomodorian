#!/bin/bash
# ============================================================================
# Fact-check all draft articles that were written but not verified
#
# Usage:
#   ./scripts/seo/factcheck-drafts.sh              # all drafts
#   ./scripts/seo/factcheck-drafts.sh --parallel 4  # 4 parallel instances
#   ./scripts/seo/factcheck-drafts.sh --dry-run     # show what would run
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
FACTCHECK_PROMPT="$SCRIPT_DIR/prompt-factcheck.md"
LOG_DIR="$SCRIPT_DIR/logs"
CONTENT_DIR="$PROJECT_DIR/content/blog"

PARALLEL=4
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --parallel) PARALLEL="$2"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# Find all draft articles
DRAFTS=$(grep -rl "^status: draft" "$CONTENT_DIR" 2>/dev/null || true)

if [[ -z "$DRAFTS" ]]; then
  echo "No drafts to fact-check. All articles are published."
  exit 0
fi

TOTAL=$(echo "$DRAFTS" | wc -l | tr -d ' ')

echo "============================================"
echo "Pomodorian Draft Fact-Checker"
echo "============================================"
echo "Drafts to process: $TOTAL"
echo "Parallel instances: $PARALLEL"
echo "============================================"

if $DRY_RUN; then
  echo ""
  echo "DRY RUN — would fact-check:"
  for file in $DRAFTS; do
    slug=$(basename "$file" .md)
    lang=$(echo "$file" | sed "s|$CONTENT_DIR/||" | cut -d/ -f1)
    echo "  [$lang] $slug"
  done
  exit 0
fi

factcheck_article() {
  local article_path="$1"
  local slug
  slug=$(basename "$article_path" .md)
  local log_file="$LOG_DIR/fc-$slug.log"

  echo "[FACTCHECK] $slug"

  local fc_prompt
  fc_prompt=$(cat "$FACTCHECK_PROMPT")
  fc_prompt="${fc_prompt//\{\{ARTICLE_PATH\}\}/$article_path}"

  if ! claude -p "$fc_prompt" \
    --allowedTools "Write,Read,Edit,WebSearch,WebFetch" \
    >> "$log_file" 2>&1; then
    echo "[FAIL] $slug — see $log_file"
    return 1
  fi

  local status
  status=$(head -20 "$article_path" | grep "^status:" | awk '{print $2}')
  echo "[DONE] $slug → $status"
}

export -f factcheck_article
export FACTCHECK_PROMPT LOG_DIR

RUNNING=0
PIDS=()

for file in $DRAFTS; do
  factcheck_article "$file" &
  PIDS+=($!)
  RUNNING=$((RUNNING + 1))

  if [[ $RUNNING -ge $PARALLEL ]]; then
    wait -n 2>/dev/null || true
    RUNNING=$((RUNNING - 1))
  fi
done

for pid in "${PIDS[@]}"; do
  wait "$pid" 2>/dev/null || true
done

echo ""
echo "============================================"
echo "Fact-checking complete!"
echo "============================================"

published=$(grep -rl "^status: published" "$CONTENT_DIR" 2>/dev/null | wc -l | tr -d ' ')
drafts=$(grep -rl "^status: draft" "$CONTENT_DIR" 2>/dev/null | wc -l | tr -d ' ')

echo "Published: $published"
echo "Drafts remaining: $drafts"
