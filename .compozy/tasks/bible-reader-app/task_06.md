---
status: pending
title: "Zustand Stores: bibleStore, studyStore, progressStore, themeStore"
type: frontend
complexity: medium
dependencies:
  - task_05
---

# Task 06: Zustand Stores: bibleStore, studyStore, progressStore, themeStore

## Overview

Implement four Zustand stores with persist middleware for localStorage serialization, managing all application state: Bible navigation (current book/chapter, translation selection, comparison mode), study data (highlights, notes, bookmarks), reading progress (chapter read tracking), and theme preference (dark/light/sepia/system). Each store uses selector-based subscriptions for performance.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST implement bibleStore with current bookId, chapter, active translation, comparison translations, and comparison mode toggle
- MUST implement studyStore with highlights (add, remove, edit color), notes (create, update, delete), and bookmarks (add, remove, update label)
- MUST implement progressStore with markChapterAsRead(bookId, chapter), isChapterRead(bookId, chapter), getBookProgress(bookId), and getOverallProgress()
- MUST implement themeStore with theme preference ('light' | 'dark' | 'sepia' | 'system'), setTheme(), and resolved theme (actual applied theme after OS detection)
- MUST use Zustand persist middleware with localStorage under namespaced keys (bible-app-bible, bible-app-study, bible-app-progress, bible-app-theme)
- MUST use selector-based subscriptions to prevent unnecessary re-renders
- MUST handle localStorage errors gracefully (storage full, private browsing)
- MUST use types from @/types (task_05)
</requirements>

## Subtasks
- [ ] 6.1 Implement bibleStore with navigation state, translation selection, and comparison mode
- [ ] 6.2 Implement studyStore with highlights CRUD, notes CRUD, and bookmarks CRUD
- [ ] 6.3 Implement progressStore with chapter read tracking and progress calculation
- [ ] 6.4 Implement themeStore with theme preference, OS detection, and persistence
- [ ] 6.5 Add persist middleware configuration with namespaced localStorage keys
- [ ] 6.6 Add localStorage error handling (quota exceeded, access denied)

## Implementation Details

See TechSpec "Zustand Stores" section for the four-store architecture. See TechSpec "User Data (Zustand + localStorage)" section for persist middleware configuration and localStorage key names.

See `.stitch/DESIGN.md` for theme values: 'light', 'dark', 'sepia' (the TechSpec only mentions dark/light but DESIGN.md adds sepia).

The themeStore should detect OS preference via `window.matchMedia('(prefers-color-scheme: dark)')` and listen for changes when theme is 'system'.

### Relevant Files
- `src/stores/bibleStore.ts` — Bible navigation and translation state (to be created)
- `src/stores/studyStore.ts` — Highlights, notes, bookmarks state (to be created)
- `src/stores/progressStore.ts` — Reading progress state (to be created)
- `src/stores/themeStore.ts` — Theme preference state (to be created)
- `src/stores/index.ts` — Barrel exports (to be created)
- `src/types/index.ts` — Shared type definitions (from task_05)

### Dependent Files
- App shell (task_07) consumes stores for global state
- All feature components (tasks 08-17) consume specific stores
- Theme system (task_17) depends heavily on themeStore

### Related ADRs
- [ADR-003: Frontend Technology Stack](../adrs/adr-003.md) — Zustand with persist middleware chosen for state management

## Deliverables
- Four Zustand stores with persist middleware
- localStorage serialization under namespaced keys
- Graceful error handling for storage failures
- Unit tests for all store actions and state transitions

## Tests
- Unit tests:
  - [ ] bibleStore: setBook sets current bookId; setChapter sets current chapter
  - [ ] bibleStore: setActiveTranslation changes active translation
  - [ ] bibleStore: toggleComparisonMode flips comparison flag
  - [ ] studyStore: addHighlight adds highlight with correct color; removeHighlight removes it
  - [ ] studyStore: addNote creates note; updateNote modifies text; deleteNote removes it
  - [ ] studyStore: addBookmark creates bookmark; removeBookmark removes it
  - [ ] progressStore: markChapterAsRead records the chapter; isChapterRead returns true
  - [ ] progressStore: getBookProgress returns correct fraction (e.g., 5/50 chapters)
  - [ ] progressStore: getOverallProgress returns fraction of all 1189 chapters read
  - [ ] themeStore: setTheme persists theme to localStorage
  - [ ] themeStore: resolved theme returns actual theme (handles 'system' by checking OS preference)
  - [ ] Persist middleware: state survives localStorage serialization/deserialization cycle
  - [ ] localStorage error: store handles quota exceeded without throwing
- Integration tests:
  - [ ] Multiple stores can be used simultaneously without conflicts
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- All four stores persist state to localStorage and restore on reload
- Store actions produce correct state transitions
- No unnecessary re-renders when using selectors
- localStorage errors handled gracefully
