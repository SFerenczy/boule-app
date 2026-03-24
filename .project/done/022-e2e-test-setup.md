# Ticket: E2E Test Setup with Playwright

## Priority

Medium

## Goal

Set up Playwright for end-to-end testing and write smoke tests covering core user flows.

## Context

The app is being shared with real users now. We need E2E tests to catch regressions in critical flows that unit/integration tests can't cover (navigation, full scoring flow, persistence across page loads).

## Tasks

- [ ] Install Playwright and configure for the SvelteKit project
- [ ] Add Playwright config (mobile viewport, webkit/chromium)
- [ ] Add smoke tests:
  - App loads and shows "New Game" button
  - Start a game with default settings → game view appears
  - Score a round → score updates in UI
  - End game → game over screen shown
  - Navigate to stats page
- [ ] Add `just e2e` command to justfile
- [ ] Ensure `just check` still works (e2e can be separate or included)
- [ ] Run `just check`

## Acceptance

- Playwright is configured and runs
- Smoke tests cover: app load, game creation, scoring, game end, navigation
- Tests run in CI-friendly headless mode
- `just e2e` runs the E2E suite
- `just check` passes

## Dependencies

None (tests against current app state)

## Notes

Use `@playwright/test` with the SvelteKit dev server. Mobile viewport (390x844 iPhone 14 Pro) should be the default since this is a mobile-first app. Keep tests focused on user flows, not implementation details.
