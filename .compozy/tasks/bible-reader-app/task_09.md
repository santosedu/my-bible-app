---
status: pending
title: "Bible Chapter Reader Component"
type: frontend
complexity: medium
dependencies:
  - task_03
  - task_07
---

# Task 09: Bible Chapter Reader Component

## Overview

Build the ChapterReader component that renders Bible chapter text verse-by-verse from the BibleData layer. Each verse displays its number as a superscript and its text. Verses are interactive — clickable/tappable for selection. The component reads the current book and chapter from the URL params and bibleStore, fetches verse data from BibleData, and renders in the main content area of the AppShell.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST render all verses for the current chapter from BibleData.getChapter()
- MUST display verse numbers as superscript using DM Sans 600 at 0.65em per DESIGN.md
- MUST display verse text using Crimson Pro 400 at the current --fs-base size per DESIGN.md
- MUST apply reading line-height of 1.9 and max-width of 65ch per DESIGN.md
- MUST support verse selection (single tap/click) for highlight and note actions
- MUST support verse range selection (shift+click or long-press drag) for multi-verse operations
- MUST use reading padding of 24px horizontal, 28px vertical per DESIGN.md
- MUST mark the chapter as read in progressStore when the chapter is scrolled to the bottom
- MUST display the book name and chapter number as the page heading
- MUST update bibleStore with the current bookId and chapter when navigated to
- MUST reference `.stitch/DESIGN.md` for all typography and layout rules
</requirements>

## Subtasks
- [ ] 9.1 Build ChapterReader component that reads bookId and chapter from URL params
- [ ] 9.2 Render verses from BibleData with verse number superscripts and text
- [ ] 9.3 Apply DESIGN.md typography (Crimson Pro body, DM Sans verse numbers, 1.9 line-height, 65ch max-width)
- [ ] 9.4 Implement verse selection (single click and range selection)
- [ ] 9.5 Update bibleStore and progressStore on chapter navigation
- [ ] 9.6 Apply reading padding and whitespace per DESIGN.md layout principles

## Implementation Details

See TechSpec "Bible Chapter Reader" section for component behavior. See `.stitch/DESIGN.md` Section 3 for typography rules and Section 5 for layout principles (reading padding, whitespace).

The ChapterReader receives bookId and chapter from React Router params. It calls BibleData.getChapter(bookId, chapter) to get verse data and renders each verse with its number and text.

Verse selection state can be local to the component or lifted to a shared state — the key requirement is that downstream features (highlights, notes, bookmarks) can access the selected verse range.

Progress tracking: use an IntersectionObserver or scroll event to detect when the user has scrolled to the bottom of the chapter, then call progressStore.markChapterAsRead().

### Relevant Files
- `src/components/reader/ChapterReader.tsx` — Main chapter reader component (to be created)
- `src/components/reader/VerseBlock.tsx` — Individual verse with number and text (to be created)
- `src/data/bibleData.ts` — BibleData lookup functions (from task_03)
- `src/stores/bibleStore.ts` — Current navigation state (from task_06)
- `src/stores/progressStore.ts` — Reading progress tracking (from task_06)
- `.stitch/DESIGN.md` — Typography (Section 3), Layout (Section 5)

### Dependent Files
- Comparison mode (task_10) extends ChapterReader
- Highlights (task_11), Notes (task_12), Bookmarks (task_15) interact with verse selection
- Cross-references (task_13) adds indicators to verses

## Deliverables
- ChapterReader component rendering verses with correct typography
- VerseBlock component with superscript verse numbers
- Verse selection (single and range)
- Progress tracking on scroll completion
- Unit and integration tests

## Tests
- Unit tests:
  - [ ] ChapterReader renders correct number of verses for a chapter
  - [ ] Verse numbers display as superscripts with DM Sans styling
  - [ ] Verse text displays with Crimson Pro at correct line-height
  - [ ] Clicking a verse selects it (adds selected state)
  - [ ] Shift+clicking selects a verse range
  - [ ] Invalid bookId/chapter shows appropriate empty state
- Integration tests:
  - [ ] Navigating to /genesis/1 renders Genesis chapter 1 with all 31 verses
  - [ ] Navigating between chapters updates the displayed content
  - [ ] Scrolling to bottom triggers progressStore.markChapterAsRead
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Verses render with correct typography from DESIGN.md
- Verse selection works for single and range
- Chapter navigation updates store and URL
- Progress tracking fires on scroll completion
