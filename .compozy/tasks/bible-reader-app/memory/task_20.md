# Task Memory: task_20.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Task 20: Bible Version Selection with NVI as Default - IMPLEMENTED
- Changed default translation from ARA to NVI
- Updated data layer to eagerly import all translations
- Modified ChapterReader to use activeTranslation from store
- Added translation selector to Header with chip-style UI
- Added full ARIA and keyboard accessibility support

## Important Decisions

- Eagerly loaded all translations (ara, acf, nvi) instead of lazy loading to enable sync access
- Removed unused getTranslationData, translationLoaders, dataCache, resetDataCache functions
- Header chips use `hidden sm:flex` class (visible on sm=640px and up)
- Keyboard navigation uses ArrowRight/Left/Up/Down, Home, End keys

## Learnings

- When changing default values in stores, must update all test beforeEach blocks
- The persist middleware handles localStorage automatically - no manual rehydration needed for tests
- Zustand selectors with functions need immediate call to get values

## Files / Surfaces

### Modified
- `src/stores/bibleStore.ts` - Changed activeTranslation default from 'ara' to 'nvi'
- `src/data/translations.ts` - Changed defaultTranslationId from 'ara' to 'nvi'
- `src/data/bibleData.ts` - Eagerly import all translations, updated getChapterSync/getVerseSync to accept translationId
- `src/components/reader/ChapterReader.tsx` - Use activeTranslation when fetching verses
- `src/components/layout/Header.tsx` - Added translation selector with chip UI and ARIA attributes
- `src/test/comparison-view.test.tsx` - Updated default expectation from ARA+ACF to NVI+ARA

### Created
- `src/test/translation-selector.test.tsx` - 28 new tests for translation selector and switching

### Updated Tests (all beforeEach blocks)
- `src/test/stores.test.ts`
- `src/test/chapter-reader.test.tsx`
- `src/test/routing.test.tsx`
- `src/test/comparison-view.test.tsx`
- `src/test/booklist.test.tsx`
- `src/test/accessibility.test.tsx`
- `src/test/app-shell.test.tsx`
- `src/test/bookmarks.test.tsx`
- `src/test/search.test.tsx`
- `src/test/notes.test.tsx`
- `src/test/highlights.test.tsx`
- `src/test/bibleData.test.ts` - Removed resetDataCache reference

## Errors / Corrections

- Had to add SidebarProvider wrapper for Header tests (useSidebar context)
- Removed unused getTranslationData function to fix lint error
- Had to update comparison-view test that expected ARA+ACF columns (now gets NVI+ARA)

## Ready for Next Run

Implementation complete. All 399 tests passing, coverage 91.06% (>80% target).
