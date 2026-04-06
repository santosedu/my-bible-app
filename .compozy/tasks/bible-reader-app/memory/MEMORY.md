# Workflow Memory

Keep only durable, cross-task context here. Do not duplicate facts that are obvious from the repository, PRD documents, or git history.

## Current State

Task 16 (Reading Progress Tracking) complete with ProgressIndicator, ProgressPanel, OverallProgress components.
- Progress components have ~97% coverage
- Progress view accessible via /progress route and BottomBar navigation

## Shared Decisions

- Study panel directly displays BookmarksPanel instead of placeholder
- Decorative triangle SVG in bookmark cards per DESIGN.md Section 4
- BottomBar navigation: Books, Buscar, Progresso (replaced Favoritos placeholder)

## Shared Learnings

- Zustand persist middleware automatically handles localStorage - no additional code needed
- Icon styling: stroke-based, 20px, `--color-bookmark` (mapped to accent) when active
- Zustand selectors that return functions need to be called immediately to get values (e.g., `const getProgress = useStore(s => s.getBookProgress); const progress = getProgress(bookId)`)
- Direct store property access in components can cause infinite re-render loops

## Open Risks

## Handoffs
