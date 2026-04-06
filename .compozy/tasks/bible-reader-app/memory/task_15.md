# Task Memory: task_15.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Implemented bookmarks feature with BookmarkButton and BookmarksPanel components. All 29 tests passing with 91% overall code coverage.

## Important Decisions

- Used `memo` for BookmarkButton to prevent unnecessary re-renders
- BookmarksPanel shows decorative triangle in top-right corner per DESIGN.md Section 4
- Study panel displays BookmarksPanel directly (no placeholder)
- Navigation from BookmarksPanel uses React Router's navigate function

## Learnings

- The persist middleware in zustand automatically persists to localStorage - no manual persistence needed
- Using `bookmarks.some()` to check if bookmarked, matching on bookId, chapter, verse, AND label to ensure uniqueness

## Files / Surfaces

Created:
- src/components/study/BookmarkButton.tsx
- src/components/study/BookmarksPanel.tsx
- src/test/bookmarks.test.tsx

Modified:
- src/components/reader/ChapterReader.tsx (added BookmarkButton to header)
- src/components/layout/AppShell.tsx (integrated BookmarksPanel)

## Errors / Corrections

- Fixed test for chapter-only reference - was including label in display
- Fixed persistence tests to not require actual rehydration (localStorage verification sufficient)

## Ready for Next Run

Task complete. Ready for commit.