---
status: pending
title: "TypeScript Types and Interfaces"
type: frontend
complexity: low
dependencies:
  - task_03
  - task_04
---

# Task 05: TypeScript Types and Interfaces

## Overview

Extract and consolidate all shared TypeScript types and interfaces from the TechSpec's Core Interfaces and Data Models sections into a centralized types module. This provides the type foundation consumed by Zustand stores, components, and the Bible data layer, ensuring type consistency across the entire application.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST define all interfaces from TechSpec "Core Interfaces" section (Verse, BibleRef, SearchResult, Highlight, HighlightColor, Note, Bookmark)
- MUST define all types from TechSpec "Data Models" section (BibleTranslation, TranslationId, BookId, BookMeta, CrossReferenceMap)
- MUST export all types from a single barrel file at src/types/index.ts
- MUST use the HighlightColor values from DESIGN.md (yellow, green, rose) rather than the TechSpec's (yellow, green, blue, red, purple)
- MUST ensure TypeScript strict mode compatibility (no implicit any, no unused vars)
</requirements>

## Subtasks
- [ ] 5.1 Create src/types/verse.ts with Verse, BibleRef, SearchResult types
- [ ] 5.2 Create src/types/study.ts with Highlight, HighlightColor, Note, Bookmark types
- [ ] 5.3 Create src/types/bible.ts with BibleTranslation, TranslationId, BookId, BookMeta, CrossReferenceMap types
- [ ] 5.4 Create src/types/index.ts barrel export
- [ ] 5.5 Verify all types compile under TypeScript strict mode

## Implementation Details

See TechSpec "Core Interfaces" and "Data Models" sections for the complete type definitions.

Important: Align HighlightColor with `.stitch/DESIGN.md` Section 2 which defines three highlight colors (yellow, green, rose) rather than the five in the TechSpec. This is intentional — the design system specifies the visual palette.

The types should be importable via `@/types` path alias configured in task_01.

### Relevant Files
- `src/types/verse.ts` — Verse, BibleRef, SearchResult types (to be created)
- `src/types/study.ts` — Highlight, HighlightColor, Note, Bookmark types (to be created)
- `src/types/bible.ts` — BibleTranslation, TranslationId, BookId, BookMeta, CrossReferenceMap types (to be created)
- `src/types/index.ts` — Barrel exports (to be created)

### Dependent Files
- Zustand stores (task_06) import types from here
- Bible data layer (task_03) uses these types
- All component tasks reference these types

## Deliverables
- Complete TypeScript type definitions for all data models
- Barrel export file for convenient imports
- TypeScript compilation passes with strict mode

## Tests
- Unit tests:
  - [ ] All types export without errors from barrel file
  - [ ] HighlightColor union contains exactly 'yellow' | 'green' | 'rose'
  - [ ] TranslationId union contains exactly 'ara' | 'acf' | 'nvi'
  - [ ] BookId type is a string union (verified by type compilation)
  - [ ] All interface properties match TechSpec definitions
- Integration tests:
  - [ ] TypeScript project compiles without type errors after types are defined
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- TypeScript strict mode compilation succeeds
- All types match TechSpec specifications (with DESIGN.md HighlightColor override)
- Barrel export provides clean import paths
