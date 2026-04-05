---
status: pending
title: "Bookmarks Feature"
type: frontend
complexity: medium
dependencies:
  - task_06
  - task_07
---

# Task 15: Bookmarks Feature

## Overview

Implement bookmark functionality allowing users to save any chapter or verse for quick access. A bookmark toggle adds or removes bookmarks. A dedicated bookmarks panel lists all saved bookmarks with references and dates. Bookmarks persist via studyStore to localStorage. The bookmark icon uses the accent color when active per DESIGN.md.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST allow bookmarking a chapter or specific verse
- MUST toggle bookmark on/off via a bookmark button
- MUST display bookmark icon in active state (--color-accent) when bookmarked per DESIGN.md
- MUST provide a BookmarksPanel listing all bookmarks with book/chapter/verse references and creation dates
- MUST allow removing bookmarks from the BookmarksPanel
- MUST allow navigating to bookmarked passages from the BookmarksPanel
- MUST persist bookmarks to localStorage via studyStore persist middleware
- MUST apply DESIGN.md card styling for bookmarked verse cards (decorative triangle per Section 4)
</requirements>

## Subtasks
- [ ] 15.1 Build BookmarkButton component with toggle functionality
- [ ] 15.2 Connect bookmark actions to studyStore (addBookmark, removeBookmark)
- [ ] 15.3 Build BookmarksPanel component listing all bookmarks
- [ ] 15.4 Implement bookmark removal from BookmarksPanel
- [ ] 15.5 Implement navigation to bookmarked passages
- [ ] 15.6 Add bookmark button to chapter header or verse action area

## Implementation Details

See TechSpec "Bookmarks" section for the feature specification. See TechSpec "Core Interfaces" for Bookmark type definition.

See `.stitch/DESIGN.md` Section 2 for accent color (`--color-accent: #C49A6C`). Section 4 for icon styling: stroke-based, 20px, `--color-text-muted` default, `--color-bookmark` when active. Cards section for bookmarked verse card: decorative triangle in top-right corner.

The bookmark button appears in the chapter header (for chapter bookmarks) and as a verse action (for verse-specific bookmarks). The BookmarksPanel is accessible from the study panel area or bottom bar.

### Relevant Files
- `src/components/study/BookmarkButton.tsx` — Bookmark toggle button (to be created)
- `src/components/study/BookmarksPanel.tsx` — Bookmarks list panel (to be created)
- `src/stores/studyStore.ts` — Bookmark actions (from task_06)
- `src/data/books.ts` — Book names for display (from task_04)
- `.stitch/DESIGN.md` — Accent color (Section 2), icon/card styling (Section 4)

### Dependent Files
- ChapterReader header (task_09) contains chapter bookmark button
- AppShell study panel (task_07) hosts BookmarksPanel
- Bottom bar (task_07) provides access to bookmarks on mobile

## Deliverables
- BookmarkButton component with toggle
- BookmarksPanel with list, removal, and navigation
- Study store integration for persistence
- Unit and integration tests

## Tests
- Unit tests:
  - [ ] BookmarkButton toggles bookmark state on click
  - [ ] BookmarkButton shows active styling (--color-accent) when bookmarked
  - [ ] BookmarkButton shows default styling when not bookmarked
  - [ ] BookmarksPanel renders all bookmarks with references and dates
  - [ ] BookmarksPanel remove button calls studyStore.removeBookmark
  - [ ] Clicking a bookmark navigates to the correct passage
- Integration tests:
  - [ ] Adding a bookmark persists to localStorage via studyStore
  - [ ] Reloading the page restores bookmarks and active states
  - [ ] Removing a bookmark from panel removes it from localStorage
  - [ ] BookmarksPanel updates in real-time when bookmarks change
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Bookmarks can be added and removed
- Bookmark state persists across page reload
- BookmarksPanel lists all saved bookmarks
- Navigation to bookmarked passages works
