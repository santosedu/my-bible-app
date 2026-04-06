---
status: completed
title: "Integrate New Themes into Store, Toggle UI, and Tests"
type: frontend
complexity: medium
dependencies:
  - task_21
---

# Task 22: Integrate New Themes into Store, Toggle UI, and Tests

## Overview

This task wires the three new color themes (green, blue, orange) into the application's theme infrastructure by updating the Zustand store types, the ThemeToggle UI component, and the ThemeInitializer logic. It ensures all existing and new tests pass with the expanded theme system.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST extend `ThemePreference` type in `themeStore.ts` to include `'green' | 'blue' | 'orange'`
- MUST extend `ResolvedTheme` type in `themeStore.ts` to include `'green' | 'blue' | 'orange'`
- MUST update `resolveTheme()` function to pass through green/blue/orange preferences directly (they are explicit themes, not system-resolved)
- MUST update `ThemeToggle.tsx` to display 7 theme options: Claro, Escuro, Sepia, Verde, Azul, Laranja, Sistema
- MUST maintain `role="radiogroup"` and `aria-label="Selecionar tema"` accessibility attributes with 7 radio buttons
- MUST update `ThemeInitializer.tsx` to correctly set `data-theme` attribute for green, blue, and orange themes
- MUST update all existing theme-related tests to account for the 7 possible theme values
- MUST add new test cases for the 3 new themes in theme toggle, store, and initializer tests

## Subtasks

- [x] 22.1 Update `ThemePreference` and `ResolvedTheme` types in `themeStore.ts` to include green, blue, orange
- [x] 22.2 Update `resolveTheme()` to handle new theme preferences (pass-through for explicit color themes)
- [x] 22.3 Update `ThemeToggle.tsx` to render 7 theme buttons with appropriate labels and visual indicators for each new palette
- [x] 22.4 Update `ThemeInitializer.tsx` to handle new resolved themes when setting `data-theme`
- [x] 22.5 Update `src/test/theme.test.tsx` to test 7 radio buttons and new theme selection flows
- [x] 22.6 Update `src/test/stores.test.ts` theme store tests to cover new preference values
- [x] 22.7 Update `src/test/design-system.test.ts` to verify CSS tokens for green, blue, and orange themes

## Implementation Details

### Relevant Files

- `src/stores/themeStore.ts` — Zustand store with `ThemePreference` and `ResolvedTheme` types; must extend both type unions
- `src/components/theme/ThemeToggle.tsx` — Theme selector UI with 4 radio buttons; must add 3 more
- `src/components/layout/ThemeInitializer.tsx` — Sets `data-theme` on `<html>`; must handle new theme values
- `src/test/theme.test.tsx` — Theme toggle and initializer tests (197 lines); must update for 7 options
- `src/test/stores.test.ts` — Store unit tests with theme store section (lines 220-265); must cover new preferences
- `src/test/design-system.test.ts` — CSS token verification tests (175 lines); must add green/blue/orange token checks

### Dependent Files

- `src/stores/index.ts` — Barrel export re-exports types from themeStore; no changes needed if types are re-exported
- `src/components/layout/Header.tsx` — Mounts ThemeToggle; no changes needed (ThemeToggle API unchanged)

### Related ADRs

- [ADR-003: Frontend Technology Stack](adrs/adr-003.md) — Use Tailwind CSS v4, Zustand with persist middleware; relevant for store pattern

## Deliverables

- Updated `themeStore.ts` with extended theme types
- Updated `ThemeToggle.tsx` with 7 theme options
- Updated `ThemeInitializer.tsx` handling new themes
- Updated test files covering all 7 theme options
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for theme switching to green, blue, and orange **(REQUIRED)**

## Tests

- Unit tests:
  - [x] `setTheme('green')` updates store preference to `'green'`
  - [x] `setTheme('blue')` updates store preference to `'blue'`
  - [x] `setTheme('orange')` updates store preference to `'orange'`
  - [x] `getResolvedTheme()` returns `'green'` when preference is `'green'` (not resolved to light/dark)
  - [x] `getResolvedTheme()` returns `'blue'` when preference is `'blue'`
  - [x] `getResolvedTheme()` returns `'orange'` when preference is `'orange'`
  - [x] `getResolvedTheme()` still returns `'light'` or `'dark'` when preference is `'system'`
  - [x] ThemeToggle renders 7 radio buttons with correct aria labels
  - [x] Clicking the green theme button calls `setTheme('green')`
  - [x] Clicking the blue theme button calls `setTheme('blue')`
  - [x] Clicking the orange theme button calls `setTheme('orange')`
  - [x] Theme persistence: green/blue/orange preference survives localStorage round-trip
- Integration tests:
  - [x] Selecting green theme sets `data-theme="green"` on `<html>` element
  - [x] Selecting blue theme sets `data-theme="blue"` on `<html>` element
  - [x] Selecting orange theme sets `data-theme="orange"` on `<html>` element
  - [x] Switching from green to system theme correctly resolves to OS preference
  - [x] All 7 theme buttons have `role="radio"` and belong to `role="radiogroup"`
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- [x] All tests passing
- [x] Test coverage >=80%
- [x] ThemeToggle displays all 7 theme options with correct visual indicators
- [x] Selecting any new theme immediately updates the UI with correct colors
- [x] Theme preference persists across page reloads
- [x] Accessibility: 7 radio buttons in radiogroup with correct ARIA attributes
