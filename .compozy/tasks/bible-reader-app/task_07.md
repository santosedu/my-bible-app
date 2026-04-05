---
status: pending
title: "App Shell and Routing (React Router v7)"
type: frontend
complexity: medium
dependencies:
  - task_06
---

# Task 07: App Shell and Routing (React Router v7)

## Overview

Build the AppShell layout component and set up React Router v7 in declarative SPA mode with routes for the Bible reader. The AppShell provides the responsive frame structure (sidebar area, main content area, study panel area) and handles breakpoint-responsive layout switching. Routing enables deep linking to specific passages.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST set up React Router v7 in declarative SPA mode (no SSR)
- MUST define routes: `/` (redirect to Genesis 1), `/:bookId`, `/:bookId/:chapter`, `/search`
- MUST build AppShell component with three responsive zones: sidebar, main content, study panel
- MUST implement responsive breakpoint handling: desktop (persistent sidebar), tablet (collapsible drawer), mobile (overlay)
- MUST implement a sticky header with glassmorphism effect per DESIGN.md
- MUST implement a sticky bottom bar with backdrop-blur per DESIGN.md
- MUST redirect `/` to the user's last read location or default to Genesis 1
- MUST integrate themeStore to apply the current theme class to the document
- MUST reference `.stitch/DESIGN.md` for layout principles (mobile-first, padding, whitespace)
</requirements>

## Subtasks
- [ ] 7.1 Set up React Router v7 with BrowserRouter and route definitions
- [ ] 7.2 Build AppShell layout component with three-zone responsive structure
- [ ] 7.3 Implement sticky header with glassmorphism and book/chapter navigation display
- [ ] 7.4 Implement sticky bottom bar with backdrop-blur for mobile interaction
- [ ] 7.5 Add root redirect logic (last read location or Genesis 1 default)
- [ ] 7.6 Connect themeStore to apply data-theme attribute on document load

## Implementation Details

See TechSpec "App Shell" section for the component overview diagram. See TechSpec "Development Sequencing" step 5 for route definitions.

See ADR-003 Implementation Notes for route patterns: `/` (redirect), `/:bookId`, `/:bookId/:chapter`, `/search`.

See `.stitch/DESIGN.md` Section 5 for layout principles: mobile-first, reading padding 24px horizontal / 28px vertical, sticky header with `backdrop-filter: blur(12px)`, sticky bottom bar with backdrop-blur.

The AppShell should use placeholder components for the sidebar, reader, and study panel — those will be implemented in later tasks.

### Relevant Files
- `src/App.tsx` — Replace with router setup (rewrite)
- `src/main.tsx` — Wrap with BrowserRouter
- `src/components/layout/AppShell.tsx` — Main layout component (to be created)
- `src/components/layout/Header.tsx` — Sticky header (to be created)
- `src/components/layout/BottomBar.tsx` — Sticky bottom bar (to be created)
- `.stitch/DESIGN.md` — Layout principles (Section 5)

### Dependent Files
- Sidebar (task_08), Chapter Reader (task_09), and all feature components render within AppShell zones
- All routing depends on this setup

### Related ADRs
- [ADR-003: Frontend Technology Stack](../adrs/adr-003.md) — React Router v7 in declarative SPA mode; URL-based navigation

## Deliverables
- React Router v7 configured with all routes
- AppShell component with responsive three-zone layout
- Sticky header and bottom bar components
- Root redirect to last read location or Genesis 1
- Theme attribute applied on document load
- Unit and integration tests for routing and layout

## Tests
- Unit tests:
  - [ ] AppShell renders sidebar, main, and study panel zones
  - [ ] Header displays current book and chapter from bibleStore
  - [ ] Bottom bar renders on mobile viewport
  - [ ] data-theme attribute is set on document based on themeStore
- Integration tests:
  - [ ] Navigating to / redirects to /genesis/1 (default)
  - [ ] Navigating to /genesis/3 renders chapter 3 route
  - [ ] Navigating to /search renders search route
  - [ ] Browser back/forward updates the route correctly
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- All four routes resolve correctly
- AppShell renders three-zone layout at desktop breakpoint
- Header and bottom bar are sticky and apply glassmorphism
- Theme attribute applied on initial render
