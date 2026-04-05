---
status: pending
title: "Reading Progress Tracking"
type: frontend
complexity: medium
dependencies:
  - task_06
  - task_07
---

# Task 16: Reading Progress Tracking

## Overview

Implement reading progress tracking that records which chapters the user has read and displays visual progress indicators per book and across the entire Bible. Progress is tracked via progressStore when the user scrolls to the bottom of a chapter (integrated with ChapterReader). A progress view shows completion percentages for each book and an overall Bible completion percentage.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST track which chapters have been read via progressStore
- MUST mark a chapter as read when the user scrolls to its bottom (integrated with task_09)
- MUST display per-book progress as a fraction or percentage (e.g., 12/50 chapters)
- MUST display overall Bible progress as a percentage (e.g., 45/1189 chapters)
- MUST provide a ProgressPanel or view showing all book progress
- MUST persist progress to localStorage via progressStore persist middleware
- MUST visually distinguish fully read, partially read, and unread books
- MUST reference `.stitch/DESIGN.md` for progress indicator styling
</requirements>

## Subtasks
- [ ] 16.1 Build ProgressIndicator component showing book completion fraction
- [ ] 16.2 Build ProgressPanel component listing all books with their progress
- [ ] 16.3 Build OverallProgress component showing total Bible completion percentage
- [ ] 16.4 Connect to progressStore for reading state
- [ ] 16.5 Integrate chapter-read marking with ChapterReader scroll detection (coordination with task_09)
- [ ] 16.6 Add progress view access point in navigation

## Implementation Details

See TechSpec "Reading Progress" section for tracking and display requirements.

The total chapter count across all 66 books is 1189. Each book's progress is calculated as `readChapters / totalChapters`. Overall progress is `totalReadChapters / 1189`.

The progressStore (task_06) provides isChapterRead() and getBookProgress(). This task builds the visual components that consume that data.

Chapter-read marking is triggered by the ChapterReader (task_09) when the user scrolls to the bottom. This task provides the visual feedback and summary views.

### Relevant Files
- `src/components/progress/ProgressIndicator.tsx` — Book progress bar/fraction (to be created)
- `src/components/progress/ProgressPanel.tsx` — All books progress list (to be created)
- `src/components/progress/OverallProgress.tsx` — Bible completion percentage (to be created)
- `src/stores/progressStore.ts` — Progress state and actions (from task_06)
- `src/data/books.ts` — Book metadata including chapter counts (from task_04)
- `.stitch/DESIGN.md` — Referenced for visual styling of progress elements

### Dependent Files
- progressStore (task_06) provides the data
- ChapterReader (task_09) triggers markChapterAsRead on scroll
- Bottom bar (task_07) or sidebar may provide progress view access

## Deliverables
- ProgressIndicator component for per-book progress
- ProgressPanel listing all books with progress
- OverallProgress component for Bible completion
- Unit and integration tests

## Tests
- Unit tests:
  - [ ] ProgressIndicator displays correct fraction for a book (e.g., 5/50)
  - [ ] ProgressIndicator displays 0/50 for books with no chapters read
  - [ ] ProgressIndicator displays full completion for fully read books
  - [ ] OverallProgress displays correct percentage (e.g., "3.8%" for 45/1189)
  - [ ] ProgressPanel lists all 66 books with their progress
  - [ ] Books are visually distinguished by read status (full, partial, none)
- Integration tests:
  - [ ] Reading a chapter updates progress in real-time
  - [ ] Progress persists across page reload via progressStore
  - [ ] Overall progress updates when any book's progress changes
  - [ ] ProgressPanel scrolls to show all 66 books
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Per-book progress displays correct fractions
- Overall Bible progress displays correct percentage
- Progress persists across page reload
- Visual distinction between read states works
