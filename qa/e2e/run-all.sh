#!/usr/bin/env bash
# Runs every browser suite against a production build served on port 3100.
# Usage, from the repo root:
#   npm run build
#   PORT=3100 node node_modules/next/dist/bin/next start &
#   bash qa/e2e/run-all.sh
# Needs Playwright with Chromium available to `require('playwright')`
# (it is not a dependency of this repo).
cd "$(dirname "$0")" || exit 1
mkdir -p shots
total_pass=0; total_fail=0
for f in audit undo tasks theme service-worker alarm i18n focus-and-goal backup mini-timer integration extend-and-quiet-breaks; do
  out=$(node "$f.js" 2>&1); code=$?
  pass=$(echo "$out" | grep -c '^ *PASS')
  fail=$(echo "$out" | grep -c 'FAIL')
  # A suite that crashes prints no FAIL line: its exit code is the only sign.
  if [ "$code" -ne 0 ] && [ "$fail" -eq 0 ]; then
    fail=1
    printf '%-26s CRASHED (exit %s)\n' "$f" "$code"
    echo "$out" | tail -8
  fi
  printf '%-26s PASS=%-4s FAIL=%s\n' "$f" "$pass" "$fail"
  echo "$out" | grep 'FAIL' | cut -c1-300
  total_pass=$((total_pass + pass)); total_fail=$((total_fail + fail))
done
echo "TOTAL PASS=$total_pass FAIL=$total_fail"
[ "$total_fail" -eq 0 ]
