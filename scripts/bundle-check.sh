#!/usr/bin/env bash
# Bundle size budget checker for SvelteKit static build output.
# Checks total JS size (raw and gzipped) against defined budgets.
# Run after `pnpm build` or via `just bundle-check`.

set -euo pipefail

BUILD_DIR="build/_app/immutable"

# --- Budgets (update these when intentionally increasing bundle size) ---
# Current baseline (2026-03-28): ~706 KB raw, ~236 KB gzip
MAX_RAW_KB=850
MAX_GZIP_KB=285

# ---------------------------------------------------------------------------

if [ ! -d "$BUILD_DIR" ]; then
  echo "ERROR: $BUILD_DIR not found. Run 'pnpm build' first."
  exit 1
fi

# Calculate raw JS size
raw_bytes=$(find "$BUILD_DIR" -name '*.js' -exec cat {} + | wc -c)
raw_kb=$(( raw_bytes / 1024 ))

# Calculate gzipped JS size
gzip_bytes=0
while IFS= read -r -d '' file; do
  size=$(gzip -c "$file" | wc -c)
  gzip_bytes=$(( gzip_bytes + size ))
done < <(find "$BUILD_DIR" -name '*.js' -print0)
gzip_kb=$(( gzip_bytes / 1024 ))

echo "Bundle size report (JS in $BUILD_DIR):"
echo "  Raw:    ${raw_kb} KB (budget: ${MAX_RAW_KB} KB)"
echo "  Gzip:   ${gzip_kb} KB (budget: ${MAX_GZIP_KB} KB)"
echo ""

failed=0

if [ "$raw_kb" -gt "$MAX_RAW_KB" ]; then
  echo "FAIL: Raw JS size ${raw_kb} KB exceeds budget of ${MAX_RAW_KB} KB"
  failed=1
fi

if [ "$gzip_kb" -gt "$MAX_GZIP_KB" ]; then
  echo "FAIL: Gzipped JS size ${gzip_kb} KB exceeds budget of ${MAX_GZIP_KB} KB"
  failed=1
fi

if [ "$failed" -eq 1 ]; then
  echo ""
  echo "Top JS files by size:"
  find "$BUILD_DIR" -name '*.js' -exec du -k {} + | sort -rn | head -10
  exit 1
fi

echo "OK: Bundle size within budget."
