---
status: pending
title: "Sidebar / Book Navigation Component"
type: frontend
complexity: medium
dependencies:
  - task_04
  - task_07
---

# Task 08: Sidebar / Book Navigation Component

## Overview

Build the BookList sidebar component displaying all 66 Bible books grouped by Old and New Testament. The sidebar adapts responsively: persistent on desktop, collapsible drawer on tablet, full-screen overlay on mobile. Clicking a book navigates to its first chapter via React Router. The currently selected book is visually highlighted.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST display all 66 books grouped into "Antigo Testamento" (39) and "Novo Testamento" (27)
- MUST show book names in Portuguese from the BookMeta dataset
- MUST highlight the currently selected book from bibleStore
- MUST navigate to /:bookId/1 when a book is clicked
- MUST render as persistent sidebar on desktop (>1024px)
- MUST render as collapsible drawer on tablet (768-1024px)
- MUST render as full-screen overlay on mobile (<768px) triggered by hamburger menu
- MUST be keyboard navigable (arrow keys, Enter to select)
- MUST apply design tokens from `.stitch/DESIGN.md` (nav button pill style, active state with accent color)
</requirements>

## Subtasks
- [ ] 8.1 Build BookList component rendering testament groups with book items
- [ ] 8.2 Connect to bibleStore for current book selection highlighting
- [ ] 8.3 Connect to React Router for book click navigation
- [ ] 8.4 Implement responsive behavior: sidebar / drawer / overlay modes
- [ ] 8.5 Implement open/close toggle for tablet drawer and mobile overlay
- [ ] 8.6 Add keyboard navigation support (arrow keys, Enter, Escape to close)

## Implementation Details

See TechSpec "Sidebar / Navigation" section for responsive behavior specifications.

See `.stitch/DESIGN.md` Section 4 for nav button styling: pill with border, `--color-text-secondary`, scale on active. Section 5 for mobile-first layout principles.

The sidebar should consume book data from task_04's helper functions (getBooksByTestament). The currently active book comes from bibleStore (task_06).

On mobile, the sidebar is hidden by default and opened via a hamburger button in the Header (task_07). Closing can be triggered by Escape key or tapping outside.

### Relevant Files
- `src/components/navigation/BookList.tsx` — Main book list component (to be created)
- `src/components/navigation/TestamentGroup.tsx` — Testament section header + book list (to be created)
- `src/components/navigation/BookItem.tsx` — Individual book button (to be created)
- `src/data/books.ts` — BookMeta data (from task_04)
- `src/stores/bibleStore.ts` — Current book selection (from task_06)
- `.stitch/DESIGN.md` — Nav button styling (Section 4), layout (Section 5)

### Dependent Files
- AppShell (task_07) provides the sidebar zone where BookList renders
- Header (task_07) may contain the hamburger toggle button

## Deliverables
- BookList component with testament grouping
- Responsive sidebar behavior across all breakpoints
- Book click navigation via React Router
- Keyboard navigation support
- Unit and integration tests

## Tests
- Unit tests:
  - [ ] BookList renders 39 Old Testament and 27 New Testament books
  - [ ] Currently selected book has active/selected styling
  - [ ] Clicking a book calls navigate with correct bookId
  - [ ] Testament groups render with correct Portuguese headers
- Integration tests:
  - [ ] BookList renders correctly in AppShell sidebar zone at desktop width
  - [ ] Sidebar opens and closes on mobile via hamburger toggle
  - [ ] Selecting a book updates the URL and closes mobile overlay
  - [ ] Keyboard navigation: Tab focuses books, Enter selects, Escape closes overlay
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- All 66 books displayed with correct Portuguese names
- Testament grouping is accurate
- Responsive behavior works at all three breakpoints
- Keyboard navigation functional
