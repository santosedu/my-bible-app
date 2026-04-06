# Workflow Memory

Keep only durable, cross-task context here. Do not duplicate facts that are obvious from the repository, PRD documents, or git history.

## Current State

Task 15 (Bookmarks Feature) complete with BookmarkButton and BookmarksPanel components.

## Shared Decisions

- Study panel directly displays BookmarksPanel instead of placeholder
- Decorative triangle SVG in bookmark cards per DESIGN.md Section 4

## Shared Learnings

- Zustand persist middleware automatically handles localStorage - no additional code needed
- Icon styling: stroke-based, 20px, `--color-bookmark` (mapped to accent) when active

## Open Risks

## Handoffs
