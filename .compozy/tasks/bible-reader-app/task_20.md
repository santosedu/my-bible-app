---
status: completed
title: Bible Version Selection with NVI as Default
type: frontend
complexity: medium
dependencies: []
---

# Task 20: Bible Version Selection with NVI as Default

## Overview
This task enables users to choose their preferred Bible translation in single-translation reading mode, changing the default from ARA to NVI. Currently the `ChapterReader` always renders ARA text regardless of the `activeTranslation` stored in `bibleStore`, and the translation selector only appears in comparison mode. This task fixes the data layer to load any translation synchronously, connects the store's `activeTranslation` to the reader, and adds a visible translation picker to the Header.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
- Use Context7 MCP to query latest Zustand and React documentation for best practices on selectors, lazy loading, and Suspense patterns
</critical>

<requirements>
- The default translation MUST be changed from `ara` to `nvi` in both `bibleStore` and `translations.ts`
- The `ChapterReader` MUST render verses from the `activeTranslation` stored in `bibleStore`, not always ARA
- A translation selector UI MUST be visible in the `Header` component, allowing users to switch between ARA, ACF, and NVI in single-translation mode
- The `Header` translation label MUST read from the store instead of being hardcoded to "ARA"
- The selected translation MUST persist across sessions via the existing `bibleStore` persist middleware
- The data layer MUST support sync access to any translation (not just the eagerly-imported ARA) by pre-loading all translations or using React Suspense with lazy imports
- The translation selector MUST follow the `.stitch/DESIGN.md` chip styling (pill shape, `--color-surface` background, `--color-accent` active state)
- Keyboard navigation and ARIA attributes MUST be applied to the translation selector per DESIGN.md accessibility requirements
</requirements>

## Subtasks
- [x] 20.1 Change default translation from `ara` to `nvi` in `bibleStore` (`activeTranslation` initial value) and `translations.ts` (`defaultTranslationId`)
- [x] 20.2 Update `bibleData.ts` to eager-import the NVI data (new default) instead of ARA, or implement a preload mechanism that loads all translations on app startup so sync access works for any translation
- [x] 20.3 Modify `ChapterReader` to use `activeTranslation` from `bibleStore` when fetching verses (pass the translation ID to `getChapterSync` or the data layer)
- [x] 20.4 Add a translation selector UI to the `Header` component using chip-style buttons (per DESIGN.md), replacing the hardcoded "ARA" span with a dynamic selector that reads/writes `activeTranslation` from the store
- [x] 20.5 Ensure comparison mode still works correctly after the default change — `ComparisonView` and `TranslationSelector` must continue to function independently
- [x] 20.6 Add ARIA labels, `role="radiogroup"`, and keyboard navigation to the new Header translation selector
- [x] 20.7 Write unit and integration tests for the new behavior

## Implementation Details

The core problem is that `bibleData.ts` eagerly imports only `araData` and uses it as the fallback for all sync calls (`getChapterSync`, `getVerseSync`). The `ChapterReader` calls `getChapterSync(bookId, chapterNum)` without passing a translation ID, so it always gets ARA verses. To fix this:

1. **Default change**: Update `bibleStore.ts` line 29 (`activeTranslation: 'ara'`) to `'nvi'` and `translations.ts` line 9 (`defaultTranslationId: 'ara'`) to `'nvi'`.

2. **Data layer**: Either eager-import NVI data (and keep ARA lazy), or preload all translations in a startup hook so `getChapterSync` can accept a `TranslationId` parameter and return the correct data. The current signature `getChapterSync(bookId, chapter, data?)` already accepts an optional `data` parameter — the caller just needs to pass the right data.

3. **ChapterReader**: Line 137-140 currently calls `getChapterSync(bookId, chapterNum)` without translation. It must use `activeTranslation` from the store (already subscribed on line 108) to fetch the correct translation's verses.

4. **Header**: Lines 80-82 hardcode `ARA`. Replace with a translation selector that reads `activeTranslation` from the store and renders chip buttons for each translation. Use the existing `chip` CSS class from `index.css` and the `translations` array from `translations.ts`.

5. **Design reference**: Follow `.stitch/DESIGN.md` Section 4 (Component Stylings > Chips) — pill shape, `--color-surface` background with `--color-border`, active state uses `--color-accent` with white text. Follow Section 6 (Accessibility) for ARIA and keyboard support.

6. **Context7**: Query Context7 MCP for Zustand selector patterns and React Suspense/lazy import best practices if implementing async translation loading.

### Relevant Files
- `src/stores/bibleStore.ts` — Contains `activeTranslation` default value (`'ara'` on line 29) and `setActiveTranslation` action
- `src/data/bibleData.ts` — Data layer with eager ARA import (line 12), lazy loaders for all translations, `getChapterSync` and `getChapter` functions
- `src/data/translations.ts` — Translation metadata array and `defaultTranslationId` constant (currently `'ara'`)
- `src/components/reader/ChapterReader.tsx` — Chapter reader that calls `getChapterSync` on line 138 without translation parameter; subscribes to `activeTranslation` on line 108 but doesn't use it for verse fetching
- `src/components/layout/Header.tsx` — Header with hardcoded "ARA" span on lines 80-82
- `src/components/reader/TranslationSelector.tsx` — Existing translation selector for comparison mode (reference for chip pattern)
- `src/components/reader/ComparisonView.tsx` — Comparison view that uses async `getChapter` with translation IDs
- `.stitch/DESIGN.md` — Design system reference for chip styling and accessibility

### Dependent Files
- `src/test/chapter-reader.test.tsx` — Existing tests reference `activeTranslation: 'ara'` in beforeEach; must update to `'nvi'`
- `src/test/comparison-view.test.tsx` — May reference default translation assumptions
- `src/test/stores.test.ts`` — Store tests may assert ARA as default
- `src/test/routing.test.tsx` — Routing tests may assume ARA default
- `src/data/bible/nvi.ts` — NVI data file that will become the new eagerly-imported default

### Related ADRs
- [ADR-002: Bible Data and Cross-Reference Strategy](../adrs/adr-002.md) — Defines the bundling strategy for Bible translations; changing the default from ARA to NVI aligns with the lazy-loading architecture described.

## Deliverables
- Updated `bibleStore.ts` with `activeTranslation` default set to `'nvi'`
- Updated `translations.ts` with `defaultTranslationId` set to `'nvi'`
- Updated `bibleData.ts` to support sync access to any translation (either by eager-importing NVI or preloading)
- Updated `ChapterReader.tsx` to render verses from the active translation
- New translation selector UI in `Header.tsx` with chip-style buttons and ARIA support
- Unit tests for translation switching in the Header selector
- Integration test verifying that changing translation in Header updates the chapter reader text
- Integration test verifying that the selected translation persists across page reloads
- Unit tests with 80%+ coverage **(REQUIRED)**

## Tests
- Unit tests:
  - [x] `bibleStore` initializes with `activeTranslation: 'nvi'` after factory reset
  - [x] `setActiveTranslation('ara')` updates the store correctly
  - [x] `getChapterSync` with NVI translation ID returns NVI verses (not ARA)
  - [x] `getChapterSync` with ACF translation ID returns ACF verses
  - [x] `defaultTranslationId` in `translations.ts` equals `'nvi'`
  - [x] Header translation selector renders 3 chips (ARA, ACF, NVI)
  - [x] Clicking a translation chip in Header calls `setActiveTranslation` with the correct ID
  - [x] Active translation chip has `aria-checked="true"` and the `active` CSS class
  - [x] Translation selector has `role="radiogroup"` and `aria-label`
  - [x] Keyboard navigation: Arrow keys move focus between chips, Enter/Space selects
- Integration tests:
  - [x] Selecting NVI in Header renders NVI text in ChapterReader (verify verse text differs from ARA)
  - [x] Selecting ARA in Header renders ARA text in ChapterReader
  - [x] Selected translation persists after page reload (localStorage round-trip)
  - [x] Comparison mode still works after switching default to NVI
  - [x] Switching translation while viewing a chapter immediately updates the displayed text
- Test coverage target: >=80% - **ACHIEVED: 91.06%**
- All tests must pass - **ACHIEVED: 399 tests passing**

## Success Criteria
- [x] All tests passing - 399 tests passing
- [x] Test coverage >=80% - 91.06% coverage
- [x] Default translation is NVI on first app load (no localStorage)
- [x] User can switch between ARA, ACF, NVI from the Header and the chapter text updates immediately
- [x] Translation preference persists across browser sessions
- [x] Comparison mode continues to work independently of the single-translation selection
- [x] Translation selector follows DESIGN.md chip styling with proper accessibility attributes
