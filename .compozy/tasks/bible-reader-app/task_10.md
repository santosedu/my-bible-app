---
status: pending
title: "Multi-Translation Comparison Mode"
type: frontend
complexity: high
dependencies:
  - task_09
---

# Task 10: Multi-Translation Comparison Mode

## Overview

Add comparison mode to the ChapterReader that displays 2-3 Bible translations side-by-side with synchronized verse scrolling. On desktop/tablet, translations appear as synchronized columns. On mobile, a single translation is shown with a translation switcher. Users can toggle comparison mode and select which translations to compare.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST support comparing 2 or 3 translations simultaneously
- MUST display synchronized columns on desktop/tablet viewports
- MUST display single translation with switcher on mobile viewports
- MUST synchronize vertical scroll position across translation columns
- MUST allow user to select which translations to compare from ARA, ACF, NVI
- MUST toggle comparison mode via a button or chip control
- MUST persist comparison mode state and selected translations in bibleStore
- MUST apply DESIGN.md typography to all translation columns
- MUST lazy-load non-default translation data to manage bundle size
</requirements>

## Subtasks
- [ ] 10.1 Add comparison mode toggle to ChapterReader toolbar/header
- [ ] 10.2 Build translation selector allowing choice of 2-3 translations
- [ ] 10.3 Implement side-by-side column layout for desktop/tablet
- [ ] 10.4 Implement single-column translation switcher for mobile
- [ ] 10.5 Implement synchronized scrolling across translation columns
- [ ] 10.6 Persist comparison mode and translation selections in bibleStore

## Implementation Details

See TechSpec "Multi-Translation Reading" section for comparison mode behavior. See TechSpec "Known Risks" for the mobile performance mitigation strategy: show single translation on mobile with a switcher rather than side-by-side columns.

See `.stitch/DESIGN.md` Section 4 for chip styling: pill shape, active state with accent background and white text.

Synchronized scrolling: use a shared scroll container or coordinate scroll positions via refs and scroll event handlers. Ensure that verse alignment stays correct across translations (some translations may have different verse counts in the same chapter).

### Relevant Files
- `src/components/reader/ChapterReader.tsx` — Extended with comparison mode (from task_09)
- `src/components/reader/ComparisonView.tsx` — Side-by-side translation columns (to be created)
- `src/components/reader/TranslationSelector.tsx` — Translation selection chips (to be created)
- `src/data/bibleData.ts` — BibleData for fetching verse text per translation (from task_03)
- `src/stores/bibleStore.ts` — Comparison mode state (from task_06)
- `.stitch/DESIGN.md` — Chip styling (Section 4)

### Dependent Files
- ChapterReader (task_09) is extended by this feature
- bibleStore (task_06) gains comparison state

## Deliverables
- ComparisonView component with synchronized translation columns
- TranslationSelector chips for choosing translations
- Mobile-responsive comparison (columns vs switcher)
- Synchronized scrolling implementation
- Unit and integration tests

## Tests
- Unit tests:
  - [ ] ComparisonView renders correct number of translation columns (2 or 3)
  - [ ] Each column displays verses from the correct translation
  - [ ] TranslationSelector shows all three translations as selectable chips
  - [ ] Selecting a translation updates the comparison columns
  - [ ] Toggling comparison mode shows/hides additional columns
- Integration tests:
  - [ ] Scrolling one column synchronizes scroll position of other columns
  - [ ] Mobile viewport shows single column with translation switcher instead of side-by-side
  - [ ] Comparison mode persists across page reload via bibleStore
  - [ ] Chapters with different verse counts across translations handle gracefully
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- 2-3 translations render side-by-side on desktop/tablet
- Mobile shows single translation with switcher
- Scroll synchronization works across columns
- Comparison mode and translation selections persist
