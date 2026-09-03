# Multi-concept Visual Differentiation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Domain Atlas, Quality Lab, and Composition Studio materially different desktop prototypes while preserving one shared catalog and documenting the meaning of each concept.

**Architecture:** Keep the static Next.js App Router and shared `CatalogIndex` fixture. Each concept gets its own visual grammar and interaction affordance: domain exploration, review triage, and workflow composition. No runtime API, token, fake quality score, or executable plugin behavior is introduced.

**Tech Stack:** Next.js 16, TypeScript, CSS Modules, Lucide, Vitest, Playwright, GitHub Actions static export.

> **Superseded note:** After review, Quality Lab was removed from the primary concept gallery because its review-system semantics did not fit the marketplace-only prototype. The current gallery exposes four concepts: Academic Registry, Domain Atlas, Ecosystem Showcase, and Composition Studio. The replacement C view uses a product-led ecosystem skin; former review metadata ideas are retained only in the methodology/data boundaries.

---

### Task 1: Document and test concept meaning

**Files:** `docs/concepts.md`, `web/src/components/concepts/meeting-ballot.test.tsx`, `web/e2e/concepts.spec.ts`

Write the shared-vs-unique content contract and add observable markers for the three distinct lenses. Run unit and desktop E2E tests and commit.

### Task 2: Rework Domain Atlas

**Files:** `web/src/components/concepts/domain-atlas.tsx`, `web/src/components/concepts/domain-atlas.module.css`

Add a visible domain navigation rail, active lens marker, map/grid motif, domain-colored nodes, stronger ontology lines, and explicit fixture-coverage disclosure. Keep search and domain controls read-only prototype affordances. Run typecheck, lint, and E2E; commit.

### Task 3: Rework Quality Lab

**Files:** `web/src/components/concepts/quality-lab.tsx`, `web/src/components/concepts/quality-lab.module.css`

Add visible triage states, protocol rail, field-gap summary, and a rubric matrix. Use a darker slate/amber review grammar. Keep metadata coverage as field presence and quality dimensions as not evaluated. Run typecheck, lint, and E2E; commit.

### Task 4: Rework Composition Studio

**Files:** `web/src/components/concepts/composition-studio.tsx`, `web/src/components/concepts/composition-studio.module.css`

Add a workflow rail, bundle manifest, stage-labeled nodes, connector paths, and a composition status panel. Use a distinct lavender/ink canvas. Keep add/remove local-only and execution explicitly future work. Run typecheck, lint, and E2E; commit.

### Task 5: Verify and deploy the standalone repository

Run `npm run verify`, `NEXT_PUBLIC_BASE_PATH=/medical-component-market-prototype npm run build`, and desktop/mobile Playwright. Capture final 1440px screenshots and update the artifact README. From `/Users/junzhin/coding_files/awesome-dsh-med-plugin-feature-skill-catalog-web-prototype`, run `git status --short` and `git push origin main`. Confirm remote SHA and do not touch the organization repository or previous Fork.
