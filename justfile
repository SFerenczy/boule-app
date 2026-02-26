# Boule App task runner

# Install all dependencies
setup:
    pnpm install

# Start dev server
dev:
    pnpm exec vite dev

# Static SPA build
build:
    pnpm exec vite build

# Preview production build
preview:
    pnpm exec vite preview

# Run tests once
test:
    pnpm exec vitest run

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

# Full quality gate
check: format-check lint typecheck test

# Take a mobile screenshot of a route (starts dev server if needed)
screenshot route='/':
    node scripts/screenshot.mjs {{route}}
