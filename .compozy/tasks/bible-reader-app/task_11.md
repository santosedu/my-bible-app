---
status: pending
title: "Verse Highlights Feature"
type: frontend
complexity: medium
dependencies:
  - task_06
  - task_09
---

# Task 11: Verse Highlights Feature

## Overview

Implement color-coded verse highlighting. Users select a verse or verse range, pick a highlight color from the pastel palette (yellow, green, rose), and the highlight is applied and persisted. Highlights render as background colors on verse blocks. Users can remove or change highlight colors from a context action. All highlights persist via studyStore to localStorage.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST support three highlight colors: yellow, green, rose (from DESIGN.md color palette)
- MUST apply highlights to single verses and verse ranges (startVerse to endVerse)
- MUST display highlight color picker as circular buttons (32px) per DESIGN.md Section 4
- MUST render highlighted verses with the corresponding pastel background color from DESIGN.md Section 2
- MUST persist highlights to localStorage via studyStore persist middleware
- MUST allow removing a highlight from an already-highlighted verse
- MUST allow changing a highlight color on an already-highlighted verse
- MUST show active state ring on highlight button when a color is selected
</requirements>

## Subtasks
- [ ] 11.1 Build HighlightPicker component with three circular color buttons
- [ ] 11.2 Connect highlight actions to studyStore (addHighlight, removeHighlight, updateHighlightColor)
- [ ] 11.3 Render highlight backgrounds on VerseBlock based on studyStore highlights
- [ ] 11.4 Handle verse range highlighting (selected range from task_09's verse selection)
- [ ] 11.5 Implement highlight removal and color change on re-interaction

## Implementation Details

See TechSpec "Highlights" section for interaction flow. See TechSpec "Core Interfaces" for Highlight and HighlightColor type definitions.

See `.stitch/DESIGN.md` Section 2 for highlight color hex values (`--color-highlight-yellow: #F5E6B8`, `--color-highlight-green: #D4E8D0`, `--color-highlight-rose: #F0D4D4`). Section 4 for highlight button styling: circular (32px), active ring of `--color-text-muted`.

The highlight picker appears when verses are selected (from task_09's verse selection mechanism). Picking a color calls studyStore.addHighlight() with the selected verse range and color.

### Relevant Files
- `src/components/study/HighlightPicker.tsx` — Color picker with circular buttons (to be created)
- `src/components/reader/VerseBlock.tsx` — Add highlight background rendering (from task_09)
- `src/stores/studyStore.ts` — Highlight actions (from task_06)
- `.stitch/DESIGN.md` — Highlight colors (Section 2), button styling (Section 4)

### Dependent Files
- ChapterReader (task_09) renders highlight picker on verse selection
- VerseBlock (task_09) renders highlight backgrounds

## Deliverables
- HighlightPicker component with three pastel color buttons
- Highlight rendering on verse blocks
- Study store integration for persistence
- Unit and integration tests

## Tests
- Unit tests:
  - [ ] HighlightPicker renders three circular color buttons (yellow, green, rose)
  - [ ] Clicking a color button calls addHighlight with correct color
  - [ ] Highlighted verse renders with correct pastel background color
  - [ ] Highlighting a verse range applies color to all verses in range
  - [ ] Clicking highlight on already-highlighted verse offers remove/change options
  - [ ] Removing a highlight clears the background color
- Integration tests:
  - [ ] Adding a highlight persists to localStorage via studyStore
  - [ ] Reloading the page restores highlights on correct verses
  - [ ] Changing highlight color updates the background and persists
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Three highlight colors available and functional
- Highlights persist across page reload
- Verse ranges can be highlighted in a single action
- Highlights render with correct pastel backgrounds from DESIGN.md
