# Boule App task runner

# Install all dependencies and generate artifacts
setup:
    pnpm install
    pnpm exec paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide --strategy localStorage preferredLanguage baseLocale --silent
    pnpm exec svelte-kit sync

# Start dev server
dev:
    pnpm exec vite dev

# Static SPA build
build:
    pnpm exec vite build

# Preview production build
preview:
    pnpm exec vite preview

# Run tests once (with coverage)
test:
    pnpm exec vitest run --coverage

# Tests in watch mode
test-watch:
    pnpm exec vitest

# Lint (zero warnings)
lint:
    pnpm exec eslint src/ --max-warnings 0

# Format all files
format:
    pnpm exec prettier --write .

# Verify formatting
format-check:
    pnpm exec prettier --check .

# Type check
typecheck:
    pnpm exec svelte-kit sync && pnpm exec svelte-check

# Dead code/export detection
knip:
    pnpm exec knip

# Audit production dependencies for high/critical vulnerabilities
audit:
    pnpm audit --prod --audit-level=high

# Full quality gate
check: format-check lint typecheck test knip

# Check bundle size against budget (requires build)
bundle-check:
    just build
    bash scripts/bundle-check.sh

# Run Lighthouse CI (builds first, too slow for `just check`)
lighthouse:
    just build
    pnpm exec lhci autorun

# Run Playwright E2E tests
e2e *args='':
    pnpm exec playwright test {{args}}

# Take a mobile screenshot of a route (starts dev server if needed)
screenshot route='/':
    node scripts/screenshot.mjs {{route}}
