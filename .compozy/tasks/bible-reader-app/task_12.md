---
status: pending
title: "Verse Notes Feature"
type: frontend
complexity: medium
dependencies:
  - task_06
  - task_09
---

# Task 12: Verse Notes Feature

## Overview

Implement verse notes allowing users to attach free-text annotations to any verse or verse range. Notes are created, edited, and deleted via an inline editor or panel. A note indicator icon displays on verses that have notes. All notes persist via studyStore to localStorage. Notes can be reviewed in a dedicated panel.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST allow creating a note attached to a verse or verse range
- MUST allow editing existing note text
- MUST allow deleting a note
- MUST display a note indicator icon on verses that have notes
- MUST provide a note editor UI (inline textarea or panel) for text input
- MUST persist notes to localStorage via studyStore persist middleware
- MUST display note creation/update timestamps
- MUST apply DESIGN.md styling (footnote text DM Sans 400 0.8rem for note display)
</requirements>

## Subtasks
- [ ] 12.1 Build NoteEditor component with textarea for note text input
- [ ] 12.2 Connect note actions to studyStore (addNote, updateNote, deleteNote)
- [ ] 12.3 Render note indicator icon on VerseBlock for verses with notes
- [ ] 12.4 Implement note creation flow from verse selection
- [ ] 12.5 Implement note editing and deletion flows
- [ ] 12.6 Build NotesPanel component listing all notes with references

## Implementation Details

See TechSpec "Notes" section for interaction flow. See TechSpec "Core Interfaces" for Note type definition.

See `.stitch/DESIGN.md` Section 3 for footnote text styling: DM Sans 400, 0.8rem. Section 4 for icon styling: stroke-based, line-art, 20px, `--color-text-muted` default.

The note editor appears when a verse is selected and the user chooses to add a note (could be a button alongside the highlight picker). The editor provides a textarea for free-text input with save/cancel actions.

The note indicator is a small icon displayed inline or as a superscript on the verse, similar to a footnote marker.

### Relevant Files
- `src/components/study/NoteEditor.tsx` — Note text editor (to be created)
- `src/components/study/NotesPanel.tsx` — Panel listing all notes (to be created)
- `src/components/reader/VerseBlock.tsx` — Add note indicator rendering (from task_09)
- `src/stores/studyStore.ts` — Note actions (from task_06)
- `.stitch/DESIGN.md` — Footnote typography (Section 3), icon styling (Section 4)

### Dependent Files
- ChapterReader (task_09) triggers note creation on verse selection
- VerseBlock (task_09) displays note indicator
- Study panel in AppShell (task_07) may host NotesPanel

## Deliverables
- NoteEditor component with textarea
- NotesPanel component listing all notes
- Note indicator on verses with notes
- Study store integration for persistence
- Unit and integration tests

## Tests
- Unit tests:
  - [ ] NoteEditor renders textarea and save/cancel buttons
  - [ ] Saving a note calls studyStore.addNote with correct verse range and text
  - [ ] Editing a note calls studyStore.updateNote with modified text
  - [ ] Deleting a note calls studyStore.deleteNote and removes the indicator
  - [ ] Note indicator appears on verses that have notes
  - [ ] Note indicator does not appear on verses without notes
  - [ ] NotesPanel lists all notes with book/chapter/verse references
- Integration tests:
  - [ ] Creating a note persists to localStorage via studyStore
  - [ ] Reloading the page restores notes and indicators on correct verses
  - [ ] Editing a note updates the text and persists
  - [ ] Deleting a note removes it from localStorage and clears the indicator
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Notes can be created, edited, and deleted
- Note indicators display on correct verses
- Notes persist across page reload
- NotesPanel lists all notes with references
