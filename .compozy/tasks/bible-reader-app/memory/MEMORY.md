# Workflow Memory

Keep only durable, cross-task context here. Do not duplicate facts that are obvious from the repository, PRD documents, or git history.

## Current State

Task 20 (Bible Version Selection with NVI as Default) complete.
- Changed default translation from ARA to NVI in bibleStore and translations.ts
- All Bible translations (ARA, ACF, NVI) now eagerly loaded for sync access
- ChapterReader now uses activeTranslation from store when fetching verses
- Header has translation selector with chip-style UI, ARIA attributes, keyboard navigation
- Translation preference persists via Zustand persist middleware
- All 399 tests passing, 91.06% coverage

Task 19 (Chapter Selection View: Grid Component and Route) complete.
- Replaced BookRedirect with ChapterSelectionPage — book click now shows chapter grid instead of auto-redirecting to chapter 1
- ChapterGrid renders pill-shaped chip buttons in responsive grid (5/7/8/10 columns)
- Read chapters show green dot indicator and active chip styling
- Updated RootRedirect to go to /genesis (chapter selection) instead of /genesis/1
- Updated BookItem to navigate to /${book.id} instead of /${book.id}/1
- All 371 tests passing, 91.67% coverage (>80% target)
- All tasks now complete (01-19)

## Shared Decisions

- Study panel directly displays BookmarksPanel instead of placeholder
- Decorative triangle SVG in bookmark cards per DESIGN.md Section 4
- BottomBar navigation: Books, Buscar, Progresso (replaced Favoritos placeholder)
- Chapter selection page uses chip styling for chapter buttons (pill shape, --color-surface background, --color-accent for read state)

## Shared Learnings

- Zustand persist middleware automatically handles localStorage - no additional code needed
- Icon styling: stroke-based, 20px, `--color-bookmark` (mapped to accent) when active
- Zustand selectors that return functions need to be called immediately to get values (e.g., `const getProgress = useStore(s => s.getBookProgress); const progress = getProgress(bookId)`)
- Direct store property access in components can cause infinite re-render loops
- ErrorBoundary must be a class component to work with React error boundaries
- prefers-reduced-motion already implemented in index.css (lines 306-312)
- useProgressStore.isChapterRead() can be used directly as a Zustand selector

## Open Risks

## Handoffs
