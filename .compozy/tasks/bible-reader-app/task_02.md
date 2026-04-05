---
status: completed
title: "Design System: CSS Tokens, Typography, and Theme Foundation"
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 02: Design System: CSS Tokens, Typography, and Theme Foundation

## Overview

Implement the design system defined in `.stitch/DESIGN.md` as Tailwind v4 theme tokens and CSS custom properties. This includes the full color palette for all three themes (light, dark, sepia), typography rules (Crimson Pro + DM Sans fonts, sizes, line-heights), spacing/radius tokens, and component styling foundations (buttons, cards, chips, icons). The design system serves as the single source of truth for all visual styling across the app.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST implement all color tokens from `.stitch/DESIGN.md` Section 2 as CSS custom properties for light, dark, and sepia themes
- MUST configure Google Fonts (Crimson Pro + DM Sans) and add them to index.html
- MUST define typography scale matching DESIGN.md Section 3 (reading body 18px Crimson Pro 400, verse numbers DM Sans 600 0.65em, etc.)
- MUST set reading line-height to 1.9 and max-width to 65ch
- MUST define component styling tokens: buttons (pill, ghost, nav), cards (radius-lg 16px, flat elevation), chips (pill), highlight buttons (circular 32px), icons (stroke-based 20px)
- MUST implement theme switching via `data-theme` attribute on `<html>` with light, dark, and sepia values
- MUST implement Tailwind v4 `@theme` extensions for all custom tokens
- MUST respect `prefers-reduced-motion` as specified in DESIGN.md Section 6
- MUST ensure WCAG AA contrast ratios for all theme combinations
</requirements>

## Subtasks
- [x] 2.1 Add Google Fonts (Crimson Pro, DM Sans) to index.html
- [x] 2.2 Define CSS custom properties for all three themes (light, dark, sepia) using `data-theme` selectors
- [x] 2.3 Configure Tailwind v4 @theme extensions mapping design tokens to utility classes
- [x] 2.4 Implement typography scale and font-family declarations
- [x] 2.5 Define component styling base classes (button variants, card, chip, highlight button, icon)
- [x] 2.6 Add `prefers-reduced-motion` media query to disable animations

## Implementation Details

Reference `.stitch/DESIGN.md` for all token values. The themes are applied via `data-theme="light|dark|sepia"` on the `<html>` element (see DESIGN.md Section 7). Each theme overrides the CSS custom properties defined in `:root`.

Tailwind v4 uses CSS-first configuration via `@theme` in the CSS file. Extend the default theme with custom color, font, spacing, and radius tokens.

### Relevant Files
- `src/index.css` — Tailwind v4 directives, @theme extensions, CSS custom properties for all themes
- `index.html` — Google Fonts link tags for Crimson Pro and DM Sans
- `.stitch/DESIGN.md` — Full design system specification (Sections 2-7)

### Dependent Files
- All component files will consume these design tokens via Tailwind utility classes

### Related ADRs
- [ADR-003: Frontend Technology Stack](../adrs/adr-003.md) — Tailwind CSS v4 chosen for styling; custom components for Apple-like aesthetic

## Deliverables
- Complete design token system in Tailwind v4 @theme configuration
- Three working themes (light, dark, sepia) switchable via data-theme attribute
- Google Fonts loaded and configured
- Typography scale with Crimson Pro (reading) and DM Sans (UI)
- Base component style classes
- Unit tests verifying token values and theme switching

## Tests
- Unit tests:
  - [x] All CSS custom properties are defined in :root with correct default values
  - [x] Dark theme overrides all color tokens when data-theme="dark" is set
  - [x] Sepia theme overrides all color tokens when data-theme="sepia" is set
  - [x] Typography tokens match DESIGN.md spec (font families, sizes, weights)
  - [x] prefers-reduced-motion media query is present in CSS
- Integration tests:
  - [x] Theme attribute change on <html> triggers correct token updates in the DOM
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- All color tokens from DESIGN.md are implemented across all three themes
- Google Fonts load correctly (Crimson Pro, DM Sans)
- Tailwind utility classes for custom tokens are functional
- Theme switching via data-theme attribute works
