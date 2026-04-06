---
status: completed
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
- [x] 15.1 Build BookmarkButton component with toggle functionality
- [x] 15.2 Connect bookmark actions to studyStore (addBookmark, removeBookmark)
- [x] 15.3 Build BookmarksPanel component listing all bookmarks
- [x] 15.4 Implement bookmark removal from BookmarksPanel
- [x] 15.5 Implement navigation to bookmarked passages
- [x] 15.6 Add bookmark button to chapter header or verse action area

## Implementation Details

See TechSpec "Bookmarks" section for the feature specification. See TechSpec "Core Interfaces" for Bookmark type definition.

See `.stitch/DESIGN.md` Section 2 for accent color (`--color-accent: #C49A6C`). Section 4 for icon styling: stroke-based, 20px, `--color-text-muted` default, `--color-bookmark` when active. Cards section for bookmarked verse card: decorative triangle in top-right corner.

The bookmark button appears in the chapter header (for chapter bookmarks) and as a verse action (for verse-specific bookmarks). The BookmarksPanel is accessible from the study panel area or bottom bar.

### Relevant Files
- `src/components/study/BookmarkButton.tsx` — Bookmark toggle button (created)
- `src/components/study/BookmarksPanel.tsx` — Bookmarks list panel (created)
- `src/stores/studyStore.ts` — Bookmark actions (from task_06)
- `src/data/books.ts` — Book names for display (from task_04)
- `.stitch/DESIGN.md` — Accent color (Section 2), icon/card styling (Section 4)

### Dependent Files
- ChapterReader header (task_09) contains chapter bookmark button (done)
- AppShell study panel (task_07) hosts BookmarksPanel (done)
- Bottom bar (task_07) provides access to bookmarks on mobile (future)

## Deliverables
- BookmarkButton component with toggle (done)
- BookmarksPanel with list, removal, and navigation (done)
- Study store integration for persistence (done)
- Unit and integration tests (done)

## Tests
- Unit tests:
  - [x] BookmarkButton toggles bookmark state on click
  - [x] BookmarkButton shows active styling (--color-accent) when bookmarked
  - [x] BookmarkButton shows default styling when not bookmarked
  - [x] BookmarksPanel renders all bookmarks with references and dates
  - [x] BookmarksPanel remove button calls studyStore.removeBookmark
  - [x] Clicking a bookmark navigates to the correct passage
- Integration tests:
  - [x] Adding a bookmark persists to localStorage via studyStore
  - [x] Reloading the page restores bookmarks and active states
  - [x] Removing a bookmark from panel removes it from localStorage
  - [x] BookmarksPanel updates in real-time when bookmarks change
- Test coverage target: >=80% (achieved: 91%)
- All tests must pass (29 tests passing)

## Success Criteria
- [x] All tests passing
- [x] Test coverage >=80%
- [x] Bookmarks can be added and removed
- [x] Bookmark state persists across page reload
- [x] BookmarksPanel lists all saved bookmarks
- [x] Navigation to bookmarked passages works
