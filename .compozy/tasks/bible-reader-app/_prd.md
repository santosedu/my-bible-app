# My Bible App — Product Requirements Document

## Overview

My Bible App is a responsive web application for reading and studying the Bible, built with React. It targets study-focused readers who need more than a simple passage viewer — they compare translations, annotate verses, follow cross-references, and search across scripture. The app provides an Apple-like interface with dark and light themes, optimized for desktop browsers, tablets, and mobile devices. Portuguese translations are the primary language, with a path to multi-language support in future phases.

## Goals

- Deliver a complete Bible study experience accessible from any device with a browser.
- Provide Portuguese-first Bible reading with multiple translation support and side-by-side comparison.
- Enable users to highlight verses, attach notes, bookmark passages, and track reading progress — all stored locally.
- Offer full-text search and cross-reference navigation for deep study workflows.
- Maintain an Apple-like aesthetic with responsive layouts across desktop, tablet, and mobile.
- Support dark and light themes with OS-level preference detection and manual override.

## User Stories

### Primary Persona: Study-Focused Reader

- As a study-focused reader, I want to navigate the Bible by book, chapter, and verse so that I can quickly find any passage.
- As a study-focused reader, I want to read multiple Portuguese translations side-by-side so that I can compare wording and gain deeper understanding.
- As a study-focused reader, I want to highlight verses in different colors so that I can categorize and revisit important passages.
- As a study-focused reader, I want to attach personal notes to any verse or passage so that I can record insights and reflections.
- As a study-focused reader, I want to search the entire Bible by keyword or phrase so that I can find relevant passages across all books.
- As a study-focused reader, I want to follow cross-references from any verse so that I can explore related scripture.
- As a study-focused reader, I want to bookmark passages so that I can quickly return to them later.
- As a study-focused reader, I want to track my reading progress so that I can see which chapters I have read.

### Secondary Persona: Casual Browser

- As a casual browser, I want a clean, distraction-free reading view so that I can focus on the text.
- As a casual browser, I want to switch between dark and light themes so that I can read comfortably in any environment.
- As a casual browser, I want the app to work well on my phone so that I can read on the go.

## Core Features

### Bible Navigation

Users navigate the Bible through a hierarchical structure: Testament > Book > Chapter. A sidebar or bottom sheet provides the book list with Old and New Testament groupings. Chapter and verse selection loads the corresponding text. The current location is always visible and accessible.

### Multi-Translation Reading

The app supports multiple Portuguese Bible translations (ARA, ACF, NVI). Users select their preferred translation for single-pane reading. A comparison mode displays 2-3 translations side-by-side, with synchronized verse scrolling.

### Highlights and Notes

Users can select any verse or range of verses to apply color-coded highlights. Users can attach free-text notes to any verse or passage. Highlights and notes are persisted locally and can be reviewed, edited, or deleted from a dedicated panel.

### Cross-References

Each verse displays an indicator when cross-references are available. Selecting a cross-reference opens a panel or overlay showing the related verses with their text. Users can navigate directly to the referenced passage.

### Full-Text Search

A search input allows users to find verses by keyword or phrase across the entire Bible. Results display matching verses with book, chapter, and verse references. Results are ranked by relevance and grouped by book.

### Bookmarks

Users can bookmark any chapter or verse for quick access. A bookmarks panel lists all saved bookmarks with references and dates. Bookmarks can be organized or removed.

### Reading Progress

The app tracks which chapters the user has read. A visual indicator shows progress per book and across the entire Bible. Progress is persisted locally.

### Theme Support

The app supports dark and light themes. Theme defaults to the user's OS preference (prefers-color-scheme). A manual toggle allows overriding the OS default. The chosen theme persists across sessions. Dark theme uses true dark backgrounds with off-white text for comfortable extended reading.

### Responsive Layout

The app adapts its layout across three breakpoints:
- **Desktop**: sidebar navigation with main reading pane, study panels in secondary columns or drawers.
- **Tablet**: collapsible sidebar or bottom sheet navigation, study panels in slide-over sheets.
- **Mobile**: full-screen reading with bottom tab bar or hamburger menu, study panels as full-screen overlays.

## User Experience

### Primary Flow: Bible Study Session

1. User opens the app on their preferred device.
2. The app loads their last reading location and preferred theme.
3. User navigates to a passage via the sidebar/book list or search.
4. User reads the passage in their preferred translation.
5. User activates comparison mode to view multiple translations side-by-side.
6. User highlights key verses and attaches a note.
7. User follows a cross-reference to explore related scripture.
8. User bookmarks the passage for future reference.
9. Reading progress is automatically updated.

### Onboarding

First-time users see the app in their OS-preferred theme with a default Portuguese translation (ARA). The book list is immediately accessible. No account creation or configuration is required — the app is usable out of the box.

### Accessibility

- Sufficient color contrast ratios meeting WCAG AA standards in both themes.
- Keyboard navigation support for all interactive elements.
- Font size controls for comfortable reading.
- Screen reader compatible markup for verse references and navigation.

## High-Level Technical Constraints

- Must run as a single-page application in modern browsers (Chrome, Firefox, Safari, Edge).
- Bible text data must be loaded from an external source (API or bundled) — no hardcoded scripture in the source code.
- User-generated data (highlights, notes, bookmarks, progress) must persist in the browser using local storage mechanisms.
- The app must perform well on mobile devices with constrained memory and CPU.
- Portuguese Bible text must be sourced from providers that permit browser-based usage.

## Non-Goals (Out of Scope)

- **User accounts and cloud sync** — deferred to Phase 2.
- **Reading plans and daily devotionals** — deferred to Phase 2.
- **Audio playback (text-to-speech or audio Bible)** — deferred to Phase 3.
- **Multi-language Bible support beyond Portuguese** — deferred to Phase 3.
- **Social features (sharing, community notes, comments)** — out of scope for all planned phases.
- **Original language tools (Hebrew/Greek, Strong's concordance)** — out of scope for all planned phases.
- **Native mobile apps (iOS/Android)** — the app is web-only, accessible via mobile browsers.
- **Offline access to Bible text** — requires network connectivity to load translations (local caching is acceptable but full offline mode is out of scope for MVP).

## Phased Rollout Plan

### MVP (Phase 1)

- Bible navigation (book > chapter > verse)
- Portuguese translations (ARA, ACF, NVI)
- Multi-translation side-by-side comparison
- Highlights (color-coded) and notes
- Cross-references
- Full-text search
- Bookmarks
- Reading progress tracking
- Dark/light theme with OS detection and manual toggle
- Responsive layout (desktop, tablet, mobile)
- Apple-like UI design
- Local persistence for all user data

**Success criteria**: A study-focused user can complete a full study session — navigate to a passage, compare translations, highlight, annotate, search, follow cross-references, and bookmark — entirely within the app on any device.

### Phase 2

- Reading plans (chronological, thematic, whole-Bible-in-a-year)
- Cloud sync for user data (highlights, notes, bookmarks, progress)
- User accounts

**Success criteria**: Users can follow structured reading plans and access their data across multiple devices.

### Phase 3

- Audio Bible playback
- Additional language support (English, Spanish, etc.)
- Advanced search filters and search history

**Success criteria**: Users can listen to the Bible being read and switch between multiple languages.

## Success Metrics

- **Navigation efficiency**: User can reach any verse in under 3 taps/clicks.
- **Study completion**: Users can perform a full study workflow (compare, highlight, note, search, cross-reference) without leaving the app.
- **Responsive quality**: Layout is fully functional and visually polished at 320px, 768px, and 1280px+ viewports.
- **Theme consistency**: Zero visual glitches or unreadable text in either dark or light mode.
- **Performance**: Bible text loads within 2 seconds on a 3G connection; study interactions (highlight, note, search) respond within 200ms.
- **Data persistence**: All user data survives page reload and browser restart.

## Risks and Mitigations

- **Portuguese Bible data availability**: Quality Portuguese translations may have limited free API availability. Mitigation: research and validate data sources during TechSpec phase; consider self-hosting public domain translations.
- **Apple-like design complexity**: Achieving a polished Apple-like UI requires significant design and CSS effort. Mitigation: establish a design system early with reusable components; reference Apple Human Interface Guidelines.
- **Mobile performance with comparison view**: Rendering multiple translations simultaneously may be slow on mobile devices. Mitigation: lazy-load comparison panels; optimize rendering with virtualized lists for long chapters.
- **Scope creep in Phase 1**: The full study MVP has many features. Mitigation: strict YAGNI enforcement; each feature must serve the study-focused persona; defer anything that does not directly support the core study workflow.

## Architecture Decision Records

- [ADR-001: Full Study MVP Product Approach](adrs/adr-001.md) — Ship all core study tools in Phase 1; defer reading plans, cloud sync, audio, and multi-language to later phases.

## Open Questions

- Which specific Portuguese Bible translations will be available, and from which data sources? (Depends on API availability and licensing research.)
- Should highlights support custom colors or a predefined palette?
- Should cross-references be sourced from the Bible data provider or curated independently?
