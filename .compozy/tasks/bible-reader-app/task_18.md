---
status: completed
title: "Polish: Responsive Refinement, Accessibility, and Visual Finishing"
type: frontend
complexity: high
dependencies:
  - task_08
  - task_10
  - task_11
  - task_12
  - task_13
  - task_14
  - task_15
  - task_16
  - task_17
---

# Task 18: Polish: Responsive Refinement, Accessibility, and Visual Finishing

## Overview

Final polish pass across the entire application: refine responsive layouts at all three breakpoints (320px mobile, 768px tablet, 1280px+ desktop), implement comprehensive accessibility (ARIA labels, keyboard navigation, screen reader support, focus management), add smooth transitions and animations respecting `prefers-reduced-motion`, and ensure visual consistency with the `.stitch/DESIGN.md` design system. This is the last task before the MVP is complete.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST verify and fix responsive layout at 320px, 768px, and 1280px+ viewports
- MUST ensure WCAG AA color contrast ratios in all three themes
- MUST add ARIA labels to all interactive elements (buttons, links, toggles, panels)
- MUST implement full keyboard navigation (Tab, Arrow keys, Enter, Escape) for all interactive components
- MUST implement focus management for modal/overlay open and close
- MUST add `role` attributes where semantically needed (radiogroup, dialog, navigation, etc.)
- MUST respect `prefers-reduced-motion` for all animations and transitions
- MUST add a global error boundary to catch and display React errors gracefully
- MUST verify font size control works across the 14px-22px range per DESIGN.md
- MUST ensure no visual glitches or unreadable text in any theme
- MUST verify all localStorage operations handle quota exceeded errors
- MUST reference `.stitch/DESIGN.md` for all visual consistency checks
</requirements>

## Subtasks
- [ ] 18.1 Audit and fix responsive layout at all three breakpoints (320px, 768px, 1280px+)
- [ ] 18.2 Add ARIA labels and roles to all interactive elements
- [ ] 18.3 Implement keyboard navigation for all components (sidebar, reader, panels, modals)
- [ ] 18.4 Implement focus management for overlay/modal open and close
- [ ] 18.5 Verify and enforce prefers-reduced-motion respect
- [ ] 18.6 Add global React error boundary component
- [ ] 18.7 Final visual consistency audit against DESIGN.md across all themes

## Implementation Details

This is a cross-cutting polish task that touches many files. The PRD "Responsive Layout" section defines the three breakpoints. The PRD "Accessibility" section defines the accessibility requirements. `.stitch/DESIGN.md` Sections 2-6 define the visual standards.

Key areas to audit:
- Sidebar: responsive behavior at all breakpoints, keyboard navigation, ARIA landmarks
- Chapter reader: font size scaling, reading comfort, verse interaction accessibility
- Study panels: focus trap when open, Escape to close, screen reader announcements
- Theme toggle: radiogroup ARIA pattern
- Search: input labeling, result list semantics
- Bookmarks/notes panels: list semantics, item actions

The global error boundary wraps the entire app and displays a user-friendly error message with a reload button.

### Relevant Files
- All component files under `src/components/` — Accessibility attributes and responsive fixes
- `src/components/layout/ErrorBoundary.tsx` — Global error boundary (to be created)
- `src/index.css` — Reduced-motion media query, focus styles (from task_02)
- `.stitch/DESIGN.md` — Full design system specification for visual audit

### Dependent Files
- All feature components from tasks 08-17 are polished in this pass

## Deliverables
- Responsive layout working at all three breakpoints
- ARIA labels and roles on all interactive elements
- Keyboard navigation for all components
- Focus management for modals/overlays
- Global error boundary
- prefers-reduced-motion support verified
- Visual consistency with DESIGN.md
- Accessibility and responsive tests

## Tests
- Unit tests:
  - [ ] ErrorBoundary catches React errors and displays fallback UI
  - [ ] ErrorBoundary provides a "reload" button to recover
  - [ ] All interactive elements have accessible names (ARIA labels or visible text)
- Integration tests:
  - [ ] Full keyboard navigation flow: Tab through sidebar, select book, read chapter, open study panel, close with Escape
  - [ ] Focus trap works in modal/overlay (Tab cycles within, Escape closes)
  - [ ] Responsive rendering at 320px viewport (no horizontal overflow, all controls accessible)
  - [ ] Responsive rendering at 768px viewport (tablet layout correct)
  - [ ] Responsive rendering at 1280px+ viewport (desktop layout correct)
  - [ ] Theme switching produces no visual glitches or unreadable text
  - [ ] prefers-reduced-motion disables all animations
  - [ ] Font size slider adjusts text from 14px to 22px correctly
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Layout fully functional at 320px, 768px, and 1280px+ viewports
- WCAG AA contrast in all themes
- Full keyboard navigation across the entire app
- Screen reader compatible (ARIA labels, roles, focus management)
- No visual glitches in any theme
- Global error boundary catches and displays errors gracefully
