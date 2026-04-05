---
status: pending
title: "Cross-References Feature"
type: frontend
complexity: high
dependencies:
  - task_03
  - task_07
---

# Task 13: Cross-References Feature

## Overview

Implement cross-reference display and navigation. Each verse with available cross-references shows a subtle indicator. Tapping the indicator opens a panel or overlay displaying the referenced verses with their text. Users can navigate directly to any referenced passage. Cross-reference data comes from the bundled dataset in the Bible data layer.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST display a cross-reference indicator on verses that have cross-references
- MUST fetch cross-reference data via BibleData.getCrossReferences()
- MUST open a panel/overlay showing referenced verses with their text when indicator is tapped
- MUST display each reference with book name, chapter, and verse number
- MUST show the verse text for each cross-reference inline in the panel
- MUST allow navigation to any referenced passage via React Router
- MUST handle verses without cross-references gracefully (no indicator shown)
- MUST apply DESIGN.md styling (footnote text for references, stroke-based icons)
</requirements>

## Subtasks
- [ ] 13.1 Build CrossReferenceIndicator component (small icon on verses with cross-refs)
- [ ] 13.2 Build CrossReferencePanel component displaying referenced verses with text
- [ ] 13.3 Connect to BibleData.getCrossReferences() for data fetching
- [ ] 13.4 Implement navigation to referenced passages via React Router
- [ ] 13.5 Handle empty cross-reference state gracefully
- [ ] 13.6 Integrate indicator into VerseBlock rendering

## Implementation Details

See TechSpec "Cross-References" section for the feature specification. See TechSpec "Known Risks" for the data quality mitigation: validate at build time, show "no cross-references" gracefully.

See `.stitch/DESIGN.md` Section 3 for footnote styling (DM Sans 400, 0.8rem). Section 4 for icon styling (stroke-based, line-art, 20px).

The indicator is a small superscript icon or character (like a footnote marker) displayed after the verse text. When tapped, it opens the CrossReferencePanel which shows the list of referenced passages with their text.

Cross-reference data coverage may be limited (primarily New Testament). The panel should show an empty or informative message when no cross-references exist for a verse.

### Relevant Files
- `src/components/study/CrossReferenceIndicator.tsx` — Small indicator icon (to be created)
- `src/components/study/CrossReferencePanel.tsx` — Panel with referenced verses (to be created)
- `src/components/reader/VerseBlock.tsx` — Add cross-ref indicator (from task_09)
- `src/data/bibleData.ts` — getCrossReferences() and getVerse() (from task_03)
- `.stitch/DESIGN.md` — Footnote typography (Section 3), icon styling (Section 4)

### Dependent Files
- VerseBlock (task_09) renders the cross-reference indicator
- AppShell study panel (task_07) may host CrossReferencePanel

## Deliverables
- CrossReferenceIndicator component
- CrossReferencePanel component with verse text display
- Navigation to referenced passages
- Graceful handling of missing cross-references
- Unit and integration tests

## Tests
- Unit tests:
  - [ ] CrossReferenceIndicator renders only when cross-references exist for a verse
  - [ ] CrossReferenceIndicator does not render when no cross-references exist
  - [ ] CrossReferencePanel displays all referenced verses with book/chapter/verse
  - [ ] CrossReferencePanel displays verse text for each reference
  - [ ] Clicking a reference navigates to the correct /:bookId/:chapter route
  - [ ] Panel with no cross-references shows empty state message
- Integration tests:
  - [ ] Tapping indicator opens panel with correct cross-references for the verse
  - [ ] Navigating to a cross-reference and back preserves the original reading position
  - [ ] Cross-reference panel closes on Escape key or outside tap
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Cross-reference indicators appear on all verses with references
- Panel shows correct referenced verses with text
- Navigation to referenced passages works
- Empty state handled gracefully
