# My Bible App — Technical Specification

## Executive Summary

My Bible App is a single-page React 19 application built with Vite, using Tailwind CSS v4 for styling, Zustand for state management with localStorage persistence, and React Router v7 in declarative SPA mode for client-side routing. Bible text (ARA, ACF, NVI) and cross-reference data are bundled as JSON files, transformed into a normalized lookup structure at build time. The app renders custom components with no UI component library to achieve an Apple-like aesthetic with dark/light theme support across three responsive breakpoints (mobile, tablet, desktop).

**Primary trade-off:** Bundling Bible data increases initial bundle size (~2-3MB compressed) but eliminates all network latency for scripture access and removes external API dependencies. Building custom components gives full control over the Apple-like aesthetic but requires upfront design effort without pre-built accessible primitives.

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────┐
│                     App Shell                            │
│  ┌──────────┐  ┌──────────────────────┐  ┌───────────┐ │
│  │ Sidebar  │  │    Main Content      │  │ Study     │ │
│  │ (Nav)    │  │                      │  │ Panel     │ │
│  │          │  │  ┌────────────────┐  │  │           │ │
│  │ Book     │  │  │ Bible Chapter  │  │  │ Compare   │ │
│  │ List     │  │  │ Reader         │  │  │ Notes     │ │
│  │          │  │  │                │  │  │ Search    │ │
│  │ OT / NT  │  │  │ Verse blocks   │  │  │ CrossRef  │ │
│  │ Groups   │  │  │ with actions   │  │  │ Bookmarks │ │
│  │          │  │  └────────────────┘  │  │           │ │
│  └──────────┘  └──────────────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────┘
```

**App Shell**: Root layout component. Renders the responsive frame with sidebar, main content area, and study panels. Manages the overall layout breakpoints.

**Sidebar / Navigation**: Displays the Bible book list grouped by Old/New Testament. On desktop: persistent left sidebar. On tablet: collapsible drawer. On mobile: full-screen overlay triggered by hamburger menu.

**Bible Chapter Reader**: Renders the chapter text with verse-by-verse layout. Supports single-translation reading and multi-translation comparison mode with synchronized scrolling. Each verse is interactive (tap to highlight, note, bookmark).

**Study Panel**: A context-sensitive right panel (desktop) or bottom sheet (tablet/mobile) that shows comparison view, notes editor, cross-references, search results, or bookmarks depending on user action.

**Zustand Stores**: Four separate stores managing application state:
- `bibleStore` — current book/chapter, active translation(s), comparison mode toggle
- `studyStore` — highlights, notes, bookmarks
- `progressStore` — read chapters tracking
- `themeStore` — theme preference (dark/light/system)

**Bible Data Layer**: Normalized JSON data imported at build time. Provides `getVerse(bookId, chapter, verse)`, `getChapter(bookId, chapter)`, and `getCrossReferences(bookId, chapter, verse)` lookup functions.

## Implementation Design

### Core Interfaces

```typescript
interface BibleData {
  getVerse(bookId: string, chapter: number, verse: number): string | null;
  getChapter(bookId: string, chapter: number): Verse[];
  getBook(bookId: string): BookMeta;
  getCrossReferences(bookId: string, chapter: number, verse: number): BibleRef[];
  getSearchResults(query: string): SearchResult[];
}

interface Verse {
  number: number;
  text: string;
}

interface BibleRef {
  bookId: string;
  chapter: number;
  verse: number;
}

interface SearchResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

interface Highlight {
  id: string;
  bookId: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  color: HighlightColor;
  createdAt: number;
}

type HighlightColor = 'yellow' | 'green' | 'blue' | 'red' | 'purple';

interface Note {
  id: string;
  bookId: string;
  chapter: number;
  startVerse: number;
  endVerse: number | null;
  text: string;
  updatedAt: number;
}

interface Bookmark {
  id: string;
  bookId: string;
  chapter: number;
  verse: number | null;
  label: string;
  createdAt: number;
}
```

### Data Models

**Bible Data (bundled JSON)**:

```typescript
interface BibleTranslation {
  id: TranslationId;
  name: string;
  shortName: string;
  language: string;
  data: Record<BookId, Record<number, Record<number, string>>>;
}

type TranslationId = 'ara' | 'acf' | 'nvi';
type BookId = 'genesis' | 'exodus' | 'leviticus' | /* ... */ 'revelation';

interface BookMeta {
  id: BookId;
  name: string;
  abbrev: string;
  testament: 'old' | 'new';
  chapters: number;
}
```

**Cross-Reference Data (bundled JSON)**:

```typescript
interface CrossReferenceMap {
  [bookId: string]: {
    [chapter: number]: {
      [verse: number]: BibleRef[];
    };
  };
}
```

**User Data (Zustand + localStorage)**:

All user data is stored in Zustand stores with the `persist` middleware, serialized to localStorage under namespaced keys (`bible-app-highlights`, `bible-app-notes`, `bible-app-bookmarks`, `bible-app-progress`, `bible-app-theme`).

### API Endpoints

No server-side API endpoints. The app is a fully client-side SPA with no backend.

**External data sources consumed at build time only:**
- `thiagobodruk/bible` — Bible text JSON files (imported as TypeScript modules)
- Cross-reference dataset — imported as TypeScript module

**Runtime data access is purely in-memory via the `BibleData` interface.**

## Integration Points

No external service integrations at runtime. All data is bundled at build time.

**Build-time data pipeline:**
- Source: `thiagobodruk/bible` JSON files (one file per book per translation)
- Transform: Normalize into `{bookId: {chapter: {verse: text}}}` structure
- Output: TypeScript modules imported by the app
- Cross-reference data: Similar build-time normalization from source dataset

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|---------------------|-----------------|
| `src/` | New | Entire application source structure to be created | Create directory structure and all components |
| `package.json` | Modified | Add tailwindcss, zustand, react-router dependencies | Install 3 new runtime dependencies |
| `vite.config.ts` | Modified | Configure Tailwind CSS v4 plugin, path aliases | Update config |
| `tsconfig.app.json` | Modified | Add path aliases for clean imports (`@/components`, `@/data`, etc.) | Update paths |
| `index.html` | Modified | Update page title, add meta tags for PWA-like behavior | Minor update |
| `src/App.tsx` | Modified | Replace boilerplate with app shell and router outlet | Full rewrite |
| `src/index.css` | Modified | Replace with Tailwind directives and custom theme tokens | Full rewrite |
| `src/App.css` | Deleted | No longer needed (replaced by Tailwind) | Remove file |
| `public/` | Modified | Replace Vite assets with app favicon and icons | Update assets |

## Testing Approach

### Unit Tests

- **BibleData layer**: Test `getVerse`, `getChapter`, `getSearchResults`, and `getCrossReferences` with fixture data. Verify correct lookup, empty results for invalid references, and search ranking.
- **Zustand stores**: Test state transitions for highlights (add, remove, edit), notes (CRUD), bookmarks (CRUD), reading progress (mark chapter as read, query progress), and theme (toggle, persist).
- **Utility functions**: Test verse range normalization, Bible reference parsing, and search scoring logic.

### Integration Tests

- **Navigation flow**: Verify that URL changes (`/genesis/1`) correctly update the Bible reader and that browser back/forward works.
- **Study workflow**: Test the full cycle of navigating to a passage, highlighting verses, adding a note, and verifying data persists across page reload.
- **Theme switching**: Test that toggling theme updates the DOM class and persists across reload; verify OS preference detection.
- **Responsive layout**: Verify component rendering at key viewport widths (320px, 768px, 1280px).

## Development Sequencing

### Build Order

1. **Project scaffolding and Tailwind setup** — Install dependencies (tailwindcss, zustand, react-router), configure Tailwind v4 with Apple-like theme tokens, set up path aliases in tsconfig and vite config. No dependencies.
2. **Bible data layer** — Download and transform thiagobodruk/bible JSON data into normalized TypeScript modules. Implement `BibleData` interface with `getVerse`, `getChapter`, `getBook`. Depends on step 1 (path aliases).
3. **Book metadata and navigation data** — Define `BookMeta` array with all 66 books, testament grouping, abbreviations, and chapter counts. Depends on step 1.
4. **Zustand stores** — Implement `bibleStore` (navigation state), `studyStore` (highlights, notes, bookmarks), `progressStore` (reading progress), `themeStore` (theme preference) with persist middleware. Depends on steps 2 and 3 for type definitions.
5. **App shell and routing** — Set up React Router v7 with routes (`/`, `/:bookId`, `/:bookId/:chapter`, `/search`). Build the `AppShell` layout with responsive breakpoint handling. Depends on step 4.
6. **Sidebar / Book navigation** — Build the `BookList` component with Old/New Testament grouping. Connect to `bibleStore` for current selection. Desktop sidebar, tablet drawer, mobile overlay. Depends on steps 3 and 5.
7. **Bible chapter reader** — Build the `ChapterReader` component rendering verses from `BibleData`. Implement verse selection (tap/click). Depends on steps 2, 4, and 5.
8. **Multi-translation comparison** — Add comparison mode to `ChapterReader`. Display 2-3 synchronized translation columns. Toggle between single and comparison view. Depends on step 7.
9. **Highlights** — Implement verse highlight interaction (select verse range, pick color). Connect to `studyStore`. Render highlights on verses. Depends on steps 4 and 7.
10. **Notes** — Implement note creation/editing UI (inline or panel). Connect to `studyStore`. Display note indicators on verses. Depends on steps 4 and 7.
11. **Cross-references** — Bundle cross-reference data. Build cross-reference indicator and panel/overlay. Navigate to referenced passages. Depends on steps 2, 5, and 7.
12. **Full-text search** — Implement `getSearchResults` in BibleData layer. Build search input and results UI with book grouping. Depends on steps 2 and 5.
13. **Bookmarks** — Implement bookmark toggle and bookmarks panel. Connect to `studyStore`. Depends on steps 4 and 7.
14. **Reading progress** — Track chapter reads in `progressStore`. Display progress indicators per book and overall. Depends on steps 4 and 7.
15. **Theme system** — Implement dark/light theme with OS detection, manual toggle, and persistence. Apply Tailwind `dark:` classes across all components. Depends on step 4.
16. **Polish and responsive refinement** — Final pass on responsive breakpoints, animations, transitions, accessibility (ARIA, keyboard nav), and visual polish. Depends on all previous steps.

### Technical Dependencies

- **Bible data files**: Must download and transform JSON from `thiagobodruk/bible` before implementing the data layer (step 2).
- **Cross-reference data**: Must source and transform a cross-reference dataset before implementing cross-reference feature (step 11).
- **Tailwind v4**: Must be configured with theme tokens before any component development (step 1).

## Monitoring and Observability

As a client-side SPA with no backend, traditional monitoring does not apply. Instead:

- **Performance**: Measure initial bundle size and load time with Lighthouse. Target < 3s first contentful paint on 3G.
- **localStorage usage**: Log storage consumption warnings when approaching the 5MB limit.
- **Error tracking**: Add a global error boundary to catch and display React errors gracefully; log unexpected errors to console for debugging.

## Technical Considerations

### Key Decisions

- **Decision**: Bundle Bible data as JSON modules rather than fetching from an external API.
- **Rationale**: Eliminates network latency, API key management, and rate limit concerns. Provides predictable performance.
- **Trade-offs**: Larger initial bundle (~2-3MB compressed); data updates require redeployment; thiagobodruk data is CC BY-NC 2.0 BR (non-commercial).
- **Alternatives rejected**: api.bible (external dependency, rate limits), public/ static files (extra HTTP requests).

- **Decision**: Build custom components with Tailwind CSS instead of using a UI component library.
- **Rationale**: Full control over the Apple-like aesthetic; no need to override or customize a component library's design language.
- **Trade-offs**: More upfront CSS and accessibility work; no pre-built accessible primitives.
- **Alternatives rejected**: shadcn/ui (wrong aesthetic), CSS Modules (verbose for responsive/theme work).

- **Decision**: Use Zustand with persist middleware for all user data.
- **Rationale**: Minimal boilerplate, automatic localStorage serialization, selector-based subscriptions prevent unnecessary re-renders.
- **Trade-offs**: Adds a dependency (~1KB); less opinionated than Redux for large-scale apps (not a concern here).
- **Alternatives rejected**: React Context (verbose, no persistence), Redux (overkill).

### Known Risks

- **Bundle size with 3 translations**: Three full Bible translations in JSON could approach 5-10MB uncompressed. Mitigation: measure actual size after transformation; use Vite's code splitting to lazy-load non-default translations; apply gzip/brotli compression.
- **Search performance**: Full-text search across all verses without an index could be slow. Mitigation: implement a simple inverted index built at module load time; limit result display to top 50 matches.
- **Mobile performance with comparison view**: Rendering 3 synchronized columns of verses on mobile. Mitigation: comparison mode shows a single translation on mobile with a translation switcher instead of side-by-side columns; virtualize long chapter rendering if needed.
- **Cross-reference data quality**: Third-party cross-reference data may have gaps or inaccuracies. Mitigation: validate data at build time; show "no cross-references" gracefully when data is missing.

## Architecture Decision Records

- [ADR-001: Full Study MVP Product Approach](adrs/adr-001.md) — Ship all core study tools in Phase 1; defer reading plans, cloud sync, audio, and multi-language to later phases.
- [ADR-002: Bible Data and Cross-Reference Strategy](adrs/adr-002.md) — Bundle Bible text and cross-reference data as JSON files from thiagobodruk/bible; no external API at runtime.
- [ADR-003: Frontend Technology Stack](adrs/adr-003.md) — Use Tailwind CSS v4, Zustand with persist middleware, and React Router v7 in declarative SPA mode; no UI component library.
