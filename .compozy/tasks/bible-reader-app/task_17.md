---
status: pending
title: "Theme System: Dark/Light/Sepia with OS Detection and Toggle"
type: frontend
complexity: medium
dependencies:
  - task_02
  - task_06
---

# Task 17: Theme System: Dark/Light/Sepia with OS Detection and Toggle

## Overview

Implement the complete theme system supporting dark, light, and sepia themes with OS preference detection, manual toggle, and persistence. The theme system reads the user's OS preference on first load, allows manual override via a toggle control, and persists the choice across sessions. Themes are applied via the `data-theme` attribute on `<html>` using the CSS custom properties from task_02.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST detect OS color scheme preference via `prefers-color-scheme` media query on first load
- MUST default to OS preference when no manual selection is stored
- MUST support three themes: light, dark, sepia
- MUST provide a theme toggle control with all four options (light, dark, sepia, system)
- MUST apply theme via `data-theme` attribute on `<html>` element
- MUST listen for OS preference changes when theme is set to 'system'
- MUST persist theme preference via themeStore to localStorage
- MUST apply theme transition with 0.4s ease per DESIGN.md Section 5
- MUST use `role="radiogroup"` for the theme selector per DESIGN.md Section 6
- MUST ensure WCAG AA contrast in all three themes
</requirements>

## Subtasks
- [ ] 17.1 Build ThemeToggle component with radiogroup for light/dark/sepia/system options
- [ ] 17.2 Connect themeStore to apply data-theme attribute on mount and on change
- [ ] 17.3 Implement OS preference detection via matchMedia
- [ ] 17.4 Implement OS preference change listener for 'system' mode
- [ ] 17.5 Apply 0.4s ease transition on theme change
- [ ] 17.6 Add theme toggle access point in header or settings

## Implementation Details

See TechSpec "Theme System" section for OS detection and persistence requirements. See `.stitch/DESIGN.md` Section 2 for all three theme color definitions, Section 5 for transition timing (0.4s ease), and Section 6 for accessibility (`role="radiogroup"`, ARIA labels).

The themeStore (task_06) stores the user's preference ('light' | 'dark' | 'sepia' | 'system'). The resolved theme (the actual theme applied) is computed by checking the OS preference when the stored value is 'system'.

The `data-theme` attribute on `<html>` triggers the CSS custom property overrides defined in task_02's CSS. No JavaScript color manipulation is needed — CSS handles everything.

### Relevant Files
- `src/components/theme/ThemeToggle.tsx` — Theme selector radiogroup (to be created)
- `src/stores/themeStore.ts` — Theme preference and resolved theme (from task_06)
- `src/index.css` — CSS custom properties for all themes (from task_02)
- `.stitch/DESIGN.md` — Theme colors (Section 2), transitions (Section 5), accessibility (Section 6)

### Dependent Files
- themeStore (task_06) provides state management
- CSS tokens (task_02) provide the visual theme definitions
- AppShell (task_07) may host the ThemeToggle in header or settings

## Deliverables
- ThemeToggle component with four options
- OS preference detection and change listener
- data-theme attribute management
- Theme transition animation
- Unit and integration tests

## Tests
- Unit tests:
  - [ ] ThemeToggle renders four options: light, dark, sepia, system
  - [ ] Selecting a theme updates themeStore preference
  - [ ] Selecting 'system' resolves to OS preference (dark or light)
  - [ ] OS preference change triggers resolved theme update when in 'system' mode
  - [ ] data-theme attribute on <html> matches the resolved theme
- Integration tests:
  - [ ] First load with no stored preference uses OS detection
  - [ ] Manual theme selection overrides OS preference
  - [ ] Switching to 'system' reverts to OS preference
  - [ ] Theme persists across page reload via localStorage
  - [ ] Theme change applies 0.4s ease transition
  - [ ] WCAG AA contrast verified for all three themes
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- OS preference detected on first load
- Manual toggle overrides OS preference
- 'System' mode follows OS changes in real-time
- Theme persists across page reload
- All three themes apply correct colors via data-theme
