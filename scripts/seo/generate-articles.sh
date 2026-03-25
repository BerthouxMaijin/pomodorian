#!/bin/bash
# ============================================================================
# Pomodorian SEO Article Generator
# Launches parallel Claude Code instances to write + fact-check articles.
#
# Usage:
#   ./scripts/seo/generate-articles.sh                  # all topics
#   ./scripts/seo/generate-articles.sh --lang en        # only English
#   ./scripts/seo/generate-articles.sh --max 5          # first 5 topics
#   ./scripts/seo/generate-articles.sh --parallel 4     # 4 parallel instances
#   ./scripts/seo/generate-articles.sh --dry-run        # show what would run
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TOPICS_FILE="$SCRIPT_DIR/topics.tsv"
WRITE_PROMPT="$SCRIPT_DIR/prompt-write.md"
FACTCHECK_PROMPT="$SCRIPT_DIR/prompt-factcheck.md"
LOG_DIR="$SCRIPT_DIR/logs"
DATE=$(date +%Y-%m-%d)

# Defaults
PARALLEL=4
MAX_TOPICS=0  # 0 = all
FILTER_LANG=""
DRY_RUN=false

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --parallel) PARALLEL="$2"; shift 2 ;;
    --max) MAX_TOPICS="$2"; shift 2 ;;
    --lang) FILTER_LANG="$2"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

mkdir -p "$LOG_DIR"

# Read topics (skip comments and empty lines)
TOPICS=()
while IFS=$'\t' read -r topic keywords lang slug; do
  [[ "$topic" =~ ^#.*$ || -z "$topic" ]] && continue
  [[ -n "$FILTER_LANG" && "$lang" != "$FILTER_LANG" ]] && continue

  # Skip if article already exists
  output_path="$PROJECT_DIR/content/blog/$lang/$slug.md"
  if [[ -f "$output_path" ]]; then
    echo "SKIP (exists): $slug"
    continue
  fi

  TOPICS+=("$topic|$keywords|$lang|$slug")
done < "$TOPICS_FILE"

TOTAL=${#TOPICS[@]}
if [[ $MAX_TOPICS -gt 0 && $MAX_TOPICS -lt $TOTAL ]]; then
  TOPICS=("${TOPICS[@]:0:$MAX_TOPICS}")
  TOTAL=$MAX_TOPICS
fi

echo "============================================"
echo "Pomodorian Article Generator"
echo "============================================"
echo "Topics to process: $TOTAL"
echo "Parallel instances: $PARALLEL"
echo "Date: $DATE"
echo "============================================"

if [[ $TOTAL -eq 0 ]]; then
  echo "No new topics to process. Done."
  exit 0
fi

if $DRY_RUN; then
  echo ""
  echo "DRY RUN — would generate these articles:"
  for entry in "${TOPICS[@]}"; do
    IFS='|' read -r topic keywords lang slug <<< "$entry"
    echo "  [$lang] $slug — $topic"
  done
  exit 0
fi

# ──────────────────────────────────────────────
# Process a single article (write + fact-check)
# ──────────────────────────────────────────────
process_article() {
  local topic="$1"
  local keywords="$2"
  local lang="$3"
  local slug="$4"

  local output_path="$PROJECT_DIR/content/blog/$lang/$slug.md"
  local log_file="$LOG_DIR/$slug.log"

  mkdir -p "$(dirname "$output_path")"

  echo "[START] $slug ($lang)"

  # Build the write prompt
  local write_prompt
  write_prompt=$(cat "$WRITE_PROMPT")
  write_prompt="${write_prompt//\{\{TOPIC\}\}/$topic}"
  write_prompt="${write_prompt//\{\{KEYWORDS\}\}/$keywords}"
  write_prompt="${write_prompt//\{\{LANG\}\}/$lang}"
  write_prompt="${write_prompt//\{\{DATE\}\}/$DATE}"
  write_prompt="${write_prompt//\{\{OUTPUT_PATH\}\}/$output_path}"

  # Step 1: Write the article
  if ! claude -p "$write_prompt" \
    --allowedTools "Write,Read,WebSearch,WebFetch" \
    >> "$log_file" 2>&1; then
    echo "[FAIL-WRITE] $slug — see $log_file"
    return 1
  fi

  # Check file was created
  if [[ ! -f "$output_path" ]]; then
    echo "[FAIL-NOFILE] $slug — Claude didn't create the file"
    return 1
  fi

  # Step 2: Fact-check the article
  local fc_prompt
  fc_prompt=$(cat "$FACTCHECK_PROMPT")
  fc_prompt="${fc_prompt//\{\{ARTICLE_PATH\}\}/$output_path}"

  if ! claude -p "$fc_prompt" \
    --allowedTools "Write,Read,Edit,WebSearch,WebFetch" \
    >> "$log_file" 2>&1; then
    echo "[FAIL-FACTCHECK] $slug — see $log_file"
    return 1
  fi

  # Check final status
  local status
  status=$(head -20 "$output_path" | grep "^status:" | awk '{print $2}')
  echo "[DONE] $slug → $status"
}

export -f process_article
export PROJECT_DIR WRITE_PROMPT FACTCHECK_PROMPT LOG_DIR DATE

# ──────────────────────────────────────────────
# Run in parallel
# ──────────────────────────────────────────────
RUNNING=0
PIDS=()

for entry in "${TOPICS[@]}"; do
  IFS='|' read -r topic keywords lang slug <<< "$entry"

  process_article "$topic" "$keywords" "$lang" "$slug" &
  PIDS+=($!)
  RUNNING=$((RUNNING + 1))

  # Wait if we hit the parallel limit
  if [[ $RUNNING -ge $PARALLEL ]]; then
    wait -n 2>/dev/null || true
    RUNNING=$((RUNNING - 1))
  fi
done

# Wait for all remaining jobs
for pid in "${PIDS[@]}"; do
  wait "$pid" 2>/dev/null || true
done

echo ""
echo "============================================"
echo "Generation complete!"
echo "============================================"

# Count results
published=$(grep -rl "^status: published" "$PROJECT_DIR/content/blog/" 2>/dev/null | wc -l | tr -d ' ')
drafts=$(grep -rl "^status: draft" "$PROJECT_DIR/content/blog/" 2>/dev/null | wc -l | tr -d ' ')

echo "Published: $published"
echo "Drafts (need review): $drafts"
echo "Logs: $LOG_DIR/"
echo ""
echo "Next steps:"
echo "  1. Review drafts: grep -rl 'status: draft' content/blog/"
echo "  2. When ready: git add content/blog/ && git commit -m 'Add new SEO articles'"
echo "  3. Push to deploy: git push"
