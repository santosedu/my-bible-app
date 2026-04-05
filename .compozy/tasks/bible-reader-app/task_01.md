---
status: completed
title: "Project Scaffolding: Dependencies, Tailwind v4, Path Aliases, Testing Setup"
type: infra
complexity: medium
dependencies: []
---

# Task 01: Project Scaffolding: Dependencies, Tailwind v4, Path Aliases, Testing Setup

## Overview

Set up the foundational project infrastructure: install all runtime and dev dependencies (Tailwind CSS v4, Zustand, React Router v7, Vitest, Testing Library), configure path aliases in Vite and TypeScript, wire up Tailwind's Vite plugin, and bootstrap the test framework. This task creates the build tooling and developer experience foundation that every subsequent task depends on.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST install tailwindcss v4 and @tailwindcss/vite as dev dependencies
- MUST install zustand and react-router as runtime dependencies
- MUST install vitest, @testing-library/react, @testing-library/jest-dom, and jsdom as dev dependencies
- MUST configure path aliases (@/) in both vite.config.ts and tsconfig.app.json
- MUST configure the Tailwind v4 Vite plugin in vite.config.ts
- MUST configure Vitest with jsdom environment and Testing Library setup
- MUST add a "test" script to package.json
- MUST replace src/index.css with Tailwind v4 directives (placeholder)
- MUST delete src/App.css (no longer needed)
- MUST reference `.stitch/DESIGN.md` for design system token definitions
</requirements>

## Subtasks
- [x] 1.1 Install all required runtime and dev dependencies
- [x] 1.2 Configure Tailwind v4 with @tailwindcss/vite plugin in vite.config.ts
- [x] 1.3 Set up path aliases (@/components, @/data, @/stores, @/types, @/utils) in vite.config.ts and tsconfig.app.json
- [x] 1.4 Configure Vitest with jsdom environment, setup file, and Testing Library matchers
- [x] 1.5 Replace src/index.css with Tailwind v4 import and delete src/App.css
- [x] 1.6 Update package.json scripts to include "test" and "test:coverage"
- [x] 1.7 Verify build, lint, and test all pass on the scaffold

## Implementation Details

Install dependencies using npm. Configure Vite with the Tailwind v4 plugin and path alias resolution. Configure TypeScript with matching path aliases. Set up Vitest with a setup file that imports @testing-library/jest-dom. Replace the default Vite scaffold CSS with Tailwind's v4 `@import "tailwindcss"` directive.

Reference `.stitch/DESIGN.md` Section 7 (Technical Notes) for theme approach: themes applied via `data-theme` attribute on `<html>`, CSS custom properties in `:root`.

See TechSpec "Impact Analysis" table for the full list of files to modify.

### Relevant Files
- `package.json` — Add dependencies and test scripts
- `vite.config.ts` — Add Tailwind plugin and path aliases
- `tsconfig.app.json` — Add path aliases matching Vite config
- `src/index.css` — Replace with Tailwind v4 directives
- `src/App.css` — Delete (replaced by Tailwind)
- `src/main.tsx` — Update imports after CSS changes

### Dependent Files
- All subsequent task files depend on the infrastructure set up here

### Related ADRs
- [ADR-003: Frontend Technology Stack](../adrs/adr-003.md) — Defines Tailwind CSS v4, Zustand, and React Router v7 as the chosen stack

## Deliverables
- Working Tailwind v4 build pipeline
- Path aliases functional in both Vite and TypeScript
- Vitest configured and runnable with a smoke test
- package.json with all required dependencies and scripts
- Clean removal of Vite scaffold CSS (App.css deleted, index.css replaced)

## Tests
- Unit tests:
  - [x] Smoke test: a trivial Vitest test file runs and passes
  - [x] Path alias resolution: an import from @/types resolves correctly in test context
  - [x] Tailwind build: vite build succeeds without CSS errors
- Integration tests:
  - [x] Full build pipeline: npm run build completes successfully
  - [x] Lint passes: npm run lint completes with zero errors
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `npm run build` succeeds
- `npm run lint` succeeds
- `npm run test` runs Vitest and passes
- Path aliases (@/components, @/data, @/stores, @/types, @/utils) resolve in both source and test files
