# Task Memory: task_12.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Implemented the Verse Notes Feature (task_12.md) for the React Bible app.

## Important Decisions

1. **Note indicator UX**: Note indicator shows only on the STARTING verse of a note range (not on every verse in the range). This is cleaner UX - the user clicks verse 1 to see/edit the note on verses 1-N.

2. **verseHasNote fix**: Original code had `n.endVerse === null ? verseNumber === n.startVerse : verseNumber >= n.startVerse && verseNumber <= n.endVerse`. When `endVerse === null`, the condition simplified to `verseNumber >= n.startVerse && true`, showing indicators on ALL verses >= startVerse. Fixed by simplifying to just `verseNumber === n.startVerse`.

3. **NotesPanel edit state**: Each NoteCard has local `editing` state (useState). Clicking edit sets `editing = true`, which conditionally renders NoteEditor instead of note text.

## Learnings

1. **Zustand persist in tests**: `useStudyStore.setState({ notes: [] })` in beforeEach works for clearing notes between tests. `localStorage.clear()` is also called. The store is shared across all tests in the same worker.

2. **userEvent vs fireEvent**: For simple button clicks in tests, `fireEvent.click()` is more reliable than `userEvent.click()` in the jsdom test environment, especially with React Router context.

3. **vitest fake timers**: `vi.useFakeTimers()` + `vi.setSystemTime()` works for controlling `Date.now()`. For creating notes with different timestamps, call `vi.setSystemTime()` with different values BETWEEN `addNote` calls.

4. **NotesPanel sort test**: When testing sort order with controlled timestamps, directly set notes with explicit `updatedAt` values using `useStudyStore.setState({ notes: [...] })` instead of trying to control `Date.now()` with fake timers.

## Files / Surfaces

- `src/components/reader/ChapterReader.tsx` - modified (verseHasNote function, NoteEditor integration, hasNote prop on VerseBlock)
- `src/components/reader/VerseBlock.tsx` - modified (hasNote prop, note indicator rendering)
- `src/components/study/NoteEditor.tsx` - new (textarea with save/cancel/delete, Ctrl+Enter shortcut)
- `src/components/study/NotesPanel.tsx` - new (lists notes sorted by updatedAt desc, inline editing)
- `src/test/notes.test.tsx` - new (40 tests covering all note functionality)
- `src/index.css` - modified (added `.note-indicator` CSS class)

## Errors / Corrections

1. **verseHasNote bug**: Fixed indicator showing on ALL verses >= startVerse to only showing on startVerse.
2. **Test contamination**: Initial tests failed due to cross-test-store contamination. Fixed by ensuring beforeEach properly resets store state.
3. **sort test**: Pre-sorted notes approach works better than fake timers for controlling timestamps in tests.

## Ready for Next Run

N/A - task_12 is completed.
