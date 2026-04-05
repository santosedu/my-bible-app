---
status: pending
title: "Bible Data Layer: Transform and Bundle Bible JSON Data"
type: backend
complexity: high
dependencies:
  - task_01
---

# Task 03: Bible Data Layer: Transform and Bundle Bible JSON Data

## Overview

Download, transform, and bundle Portuguese Bible text data (ARA, ACF, NVI) from the thiagobodruk/bible repository into normalized TypeScript modules. Implement the BibleData interface providing `getVerse`, `getChapter`, `getBook`, `getCrossReferences`, and `getSearchResults` functions. This is the core data layer that all reading, search, and reference features depend on.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST download Bible JSON data for ARA (pt_aa), ACF (pt_acf), and NVI (pt_nvi) from thiagobodruk/bible
- MUST transform raw JSON into normalized structure: `{bookId: {chapter: {verse: text}}}`
- MUST implement `getVerse(bookId, chapter, verse)` returning verse text or null
- MUST implement `getChapter(bookId, chapter)` returning Verse[] array
- MUST implement `getBook(bookId)` returning BookMeta
- MUST implement `getCrossReferences(bookId, chapter, verse)` returning BibleRef[] array
- MUST implement `getSearchResults(query)` with simple inverted index for performance, returning SearchResult[] sorted by relevance, capped at 50 results
- MUST bundle cross-reference data from scrollmapper/bible_databases or similar source
- MUST handle invalid references gracefully (return null/empty arrays)
- MUST use lazy-loaded imports for non-default translations to manage bundle size
</requirements>

## Subtasks
- [ ] 3.1 Download and verify Bible JSON data for all three Portuguese translations
- [ ] 3.2 Create a build-time transform script to normalize JSON into `{bookId: {chapter: {verse: text}}}` structure
- [ ] 3.3 Implement BibleData class with getVerse, getChapter, and getBook methods
- [ ] 3.4 Download and normalize cross-reference data into CrossReferenceMap structure
- [ ] 3.5 Implement getCrossReferences method
- [ ] 3.6 Implement getSearchResults with inverted index built at module load time
- [ ] 3.7 Add translation metadata (id, name, shortName, language) for ARA, ACF, NVI

## Implementation Details

See TechSpec "Core Interfaces" section for the BibleData interface definition. See TechSpec "Data Models" section for BibleTranslation, Verse, BibleRef, SearchResult, and CrossReferenceMap type definitions.

See ADR-002 for the data source strategy: bundle as JSON modules, transform at build time, no external API at runtime.

The thiagobodruk/bible repo uses book abbreviations as keys. A mapping file will be needed to convert between repo keys and the app's bookId format.

For search: build a simple inverted index mapping normalized words to verse locations at module initialization time. Use basic relevance scoring (exact phrase match > word proximity > individual word match).

### Relevant Files
- `src/data/bible/` — Bible data modules (to be created)
- `src/data/crossReferences/` — Cross-reference data modules (to be created)
- `src/data/bibleData.ts` — BibleData implementation (to be created)
- `src/data/translations.ts` — Translation metadata (to be created)
- `src/data/bookMapping.ts` — Mapping between thiagobodruk keys and app bookIds (to be created)
- `.stitch/DESIGN.md` — Referenced for reading typography tokens

### Dependent Files
- All components that display Bible text will import from this layer
- Zustand stores (task_06) depend on these types

### Related ADRs
- [ADR-002: Bible Data and Cross-Reference Strategy](../adrs/adr-002.md) — Bundle Bible text as JSON; normalize at build time; no external API

## Deliverables
- Normalized Bible data TypeScript modules for ARA, ACF, NVI
- Cross-reference data TypeScript module
- BibleData class with all five lookup methods
- Translation metadata definitions
- Unit tests for all lookup functions with fixture data

## Tests
- Unit tests:
  - [ ] getVerse with valid bookId/chapter/verse returns correct text
  - [ ] getVerse with invalid reference returns null
  - [ ] getChapter returns all verses for a chapter with correct numbering
  - [ ] getChapter with invalid chapter returns empty array
  - [ ] getBook returns correct BookMeta for known books
  - [ ] getBook with unknown bookId throws or returns null
  - [ ] getCrossReferences returns array of BibleRef for verses with cross-refs
  - [ ] getCrossReferences returns empty array for verses without cross-refs
  - [ ] getSearchResults with single word returns matching verses sorted by relevance
  - [ ] getSearchResults with phrase returns exact phrase matches first
  - [ ] getSearchResults caps results at 50
  - [ ] getSearchResults with empty query returns empty array
- Integration tests:
  - [ ] Loading BibleData module does not throw for any of the three translations
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- All three translations load and provide correct verse text
- Search returns relevant results within 100ms for typical queries
- Cross-reference lookups work for New Testament verses
- Invalid references handled gracefully without errors
