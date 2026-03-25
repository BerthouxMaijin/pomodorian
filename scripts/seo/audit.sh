#!/bin/bash
# Weekly SEO Audit — calls GSC API directly + sends HTML email via Resend
# Usage: ./scripts/seo/audit.sh
# Automated via launchd every Monday at 9am

set -e
cd "$(dirname "$0")/../.."

# Load env
if [ -f .env.local ]; then
  export $(grep RESEND_API_KEY .env.local | tr -d '"')
fi

npx tsx scripts/seo/audit.ts
