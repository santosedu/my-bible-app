---
status: pending
title: "Full-Text Search Feature"
type: frontend
complexity: medium
dependencies:
  - task_03
  - task_07
---

# Task 14: Full-Text Search Feature

## Overview

Implement full-text Bible search across all translations. A search input allows keyword and phrase queries. Results display matching verses with book, chapter, and verse references, ranked by relevance and grouped by book. The search uses the inverted index built in the BibleData layer for performant lookups. Results are capped at 50 matches.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST provide a search input accessible from any screen (header or bottom bar)
- MUST support keyword search (single or multiple words)
- MUST support phrase search (quoted text)
- MUST display results with verse text, book name, chapter, and verse reference
- MUST group results by book per PRD specification
- MUST rank results by relevance (exact phrase > word proximity > individual word match)
- MUST cap displayed results at 50 matches
- MUST allow navigating to any result via React Router
- MUST show "no results" message when search returns empty
- MUST respond within 200ms for typical queries per PRD success metrics
</requirements>

## Subtasks
- [ ] 14.1 Build SearchInput component with debounced query input
- [ ] 14.2 Build SearchResults component displaying results grouped by book
- [ ] 14.3 Connect to BibleData.getSearchResults() for query execution
- [ ] 14.4 Implement result navigation (click to navigate to passage)
- [ ] 14.5 Implement "no results" empty state
- [ ] 14.6 Add search route integration and accessible search entry point

## Implementation Details

See TechSpec "Full-Text Search" section and "Known Risks" for the inverted index and performance mitigation strategies.

See `.stitch/DESIGN.md` Section 4 for search icon styling (stroke-based, 20px). The search input should be accessible from the header (desktop) or bottom bar (mobile).

Search input should debounce user input (e.g., 300ms) to avoid excessive queries during typing. The search route (`/search`) can receive the query as a URL parameter for shareable search results.

Results are grouped by book with book name headers. Each result shows the verse text with the matched query highlighted (bold or accent color).

### Relevant Files
- `src/components/search/SearchInput.tsx` — Debounced search input (to be created)
- `src/components/search/SearchResults.tsx` — Results list grouped by book (to be created)
- `src/components/search/SearchPage.tsx` — Full search page (to be created)
- `src/data/bibleData.ts` — getSearchResults() (from task_03)
- `src/data/books.ts` — Book names for display (from task_04)
- `.stitch/DESIGN.md` — Icon styling (Section 4)

### Dependent Files
- Header (task_07) contains the search trigger button
- Bottom bar (task_07) contains the search button on mobile
- React Router (task_07) provides the /search route

## Deliverables
- SearchInput component with debouncing
- SearchResults component with book grouping
- SearchPage route component
- Result navigation to Bible passages
- Unit and integration tests

## Tests
- Unit tests:
  - [ ] SearchInput debounces input and calls search after delay
  - [ ] SearchResults renders results grouped by book
  - [ ] Each result displays verse text, book name, chapter, and verse
  - [ ] Clicking a result navigates to /:bookId/:chapter
  - [ ] Empty results show "no results" message
  - [ ] Results are capped at 50 items
- Integration tests:
  - [ ] Searching for "amor" returns Portuguese verses containing the word
  - [ ] Phrase search "no princípio" returns exact phrase matches first
  - [ ] Search query in URL parameter loads results on page load
  - [ ] Search completes within 200ms for typical queries
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Search works for keywords and phrases across all translations
- Results grouped by book with correct references
- Result navigation works via React Router
- Search responds within 200ms for typical queries
