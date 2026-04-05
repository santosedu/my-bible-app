---
status: pending
title: "Book Metadata and Navigation Data"
type: backend
complexity: low
dependencies:
  - task_01
---

# Task 04: Book Metadata and Navigation Data

## Overview

Define the complete BookMeta dataset for all 66 Bible books with testament grouping, abbreviations, and chapter counts. This data powers the sidebar book list, chapter navigation, and reading progress calculations. It is a standalone data module with no external dependencies beyond the path aliases from task 01.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST define BookMeta for all 66 Bible books (Genesis through Revelation)
- MUST include id, name (Portuguese), abbrev, testament ('old' | 'new'), and chapters count for each book
- MUST provide helper functions: getBooksByTestament(testament), getAllBooks(), getBookById(bookId)
- MUST group books correctly: 39 Old Testament, 27 New Testament
- MUST use Portuguese book names (Gênesis, Êxodo, etc.)
- MUST use consistent bookId format (lowercase, no accents, no spaces — e.g., 'genesis', '1-samuel')
</requirements>

## Subtasks
- [ ] 4.1 Define BookMeta type and BookId union type
- [ ] 4.2 Create the complete 66-book dataset with Portuguese names, abbreviations, testament grouping, and chapter counts
- [ ] 4.3 Implement helper functions: getBooksByTestament, getAllBooks, getBookById
- [ ] 4.4 Export a testament grouping structure for sidebar navigation (Old Testament / New Testament sections)

## Implementation Details

See TechSpec "Data Models" section for the BookMeta interface definition. The bookId format should be stable and used consistently across the data layer and stores.

Portuguese book names must be accurate (e.g., "1 Samuel" not "1st Samuel", "Gênesis" not "Genesis"). Chapter counts must match the actual Bible data.

### Relevant Files
- `src/data/books.ts` — BookMeta definitions and helper functions (to be created)
- `src/data/books/` — Individual book data files if splitting (optional)
- `.stitch/DESIGN.md` — Referenced for sidebar styling context

### Dependent Files
- Sidebar component (task_08) consumes this data for the book list
- BibleStore (task_06) uses bookId type for navigation state
- Reading progress (task_16) uses chapter counts for progress calculations

## Deliverables
- Complete 66-book BookMeta dataset with Portuguese names
- Helper functions for testament grouping and book lookup
- Unit tests verifying data completeness and helper function correctness

## Tests
- Unit tests:
  - [ ] getAllBooks returns exactly 66 books
  - [ ] getBooksByTestament('old') returns 39 books
  - [ ] getBooksByTestament('new') returns 27 books
  - [ ] getBookById('genesis') returns book with name 'Gênesis' and 50 chapters
  - [ ] getBookById('revelation') returns book with name 'Apocalipse' and 22 chapters
  - [ ] getBookById with unknown id returns undefined
  - [ ] Every book has a non-empty Portuguese name, abbreviation, and positive chapter count
  - [ ] No duplicate bookIds exist in the dataset
- Integration tests:
  - [ ] Module imports successfully without errors
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- All 66 books present with correct Portuguese names and chapter counts
- Testament grouping is accurate (39 OT, 27 NT)
- Helper functions return correct results for all inputs
