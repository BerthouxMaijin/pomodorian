#!/bin/bash
# ============================================================================
# Review draft articles that didn't pass auto-scoring
#
# Usage:
#   ./scripts/seo/review-drafts.sh           # list all drafts
#   ./scripts/seo/review-drafts.sh --publish  # interactively publish drafts
# ============================================================================

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CONTENT_DIR="$PROJECT_DIR/content/blog"

PUBLISH=false
[[ "${1:-}" == "--publish" ]] && PUBLISH=true

drafts=$(grep -rl "^status: draft" "$CONTENT_DIR" 2>/dev/null || true)

if [[ -z "$drafts" ]]; then
  echo "No drafts to review. All articles are published."
  exit 0
fi

count=$(echo "$drafts" | wc -l | tr -d ' ')
echo "Found $count draft article(s):"
echo ""

for file in $drafts; do
  title=$(head -20 "$file" | grep "^title:" | sed 's/^title: *//' | tr -d '"')
  score=$(head -20 "$file" | grep "^score:" | awk '{print $2}')
  lang=$(echo "$file" | grep -oP 'blog/\K[^/]+')
  slug=$(basename "$file" .md)

  echo "  [$lang] $slug"
  echo "    Title: $title"
  echo "    Score: ${score:-?}/10"
  echo "    File:  $file"

  if $PUBLISH; then
    echo ""
    read -p "    Publish this article? (y/n/e=edit/s=skip): " choice
    case $choice in
      y|Y)
        sed -i '' 's/^status: draft/status: published/' "$file"
        echo "    → Published!"
        ;;
      e|E)
        ${EDITOR:-vim} "$file"
        read -p "    Publish after edit? (y/n): " after
        [[ "$after" == "y" ]] && sed -i '' 's/^status: draft/status: published/' "$file" && echo "    → Published!"
        ;;
      *)
        echo "    → Skipped"
        ;;
    esac
  fi
  echo ""
done
