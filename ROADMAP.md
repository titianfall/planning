# Roadmap: CS Career Compass

**Generated:** 2026-05-14
**Phases:** 9 | **Requirements:** 24 | **Coverage:** 100%

## Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation & Data Schema | Working local Next.js app with Prisma + SQLite schema and realistic CS/IT career seed data | FND-04, FND-05, FND-06, FND-07 | 8 criteria |
| 2 | Public Catalog (Grid + Filter) | Visitor can browse all jobs as a responsive card grid and narrow by category | CAT-01, CAT-02, CAT-04, FND-03 | 4 criteria |
| 3 | Job Detail Page | Visitor can open a job and read description, skills, salary, and difficulty | DET-01, DET-02, DET-03, DET-04 | 4 criteria |
| 4 | External Links | Visitor can click out to job boards, LinkedIn, and bootcamps from a job page | LNK-01, LNK-02, LNK-03 | 3 criteria |
| 5 | Keyword Search | Visitor can search jobs by keyword across the catalog | CAT-03 | 3 criteria |
| 6 | SSR/SSG & SEO | Public pages are server-rendered with per-job SEO metadata and a sitemap | FND-01, FND-02 | 4 criteria |
| 7 | Admin Authentication | A single allowlisted admin can log in via magic link and reach `/admin/*` | ADM-01 | 4 criteria |
| 8 | Admin Dashboard & Job CRUD | Admin can view counts, create, edit, and delete jobs through a UI | ADM-02, ADM-03, ADM-04, ADM-05 | 5 criteria |
| 9 | Admin Link Management & Deploy | Admin can manage external links per job; site is live on Vercel | ADM-06 | 4 criteria |

## Phase Details

### Phase 1: Foundation & Data Schema

**Goal:** Project scaffold, local database schema, and realistic career seed data exist so the public read path can be built before any Supabase/Postgres integration.
**Requirements:** FND-04, FND-05, FND-06, FND-07
**UI hint:** yes

**Success criteria:**
1. `npm run dev` or `pnpm dev` boots a Next.js App Router app at `localhost:3000`
2. TypeScript, Tailwind CSS, and a basic app layout/UI structure are wired up
3. Prisma uses SQLite locally via `DATABASE_URL="file:./dev.db"` and migrations run cleanly
4. Prisma schema defines `Category`, `Job`, and `JobLink` models
5. `Job` includes recommendation-ready metadata fields for future fit scoring, such as interest areas, preferred strengths, work styles, skill level, collaboration level, math intensity, creativity level, and entry difficulty
6. Seed script populates 4 fixed categories and realistic CS/IT career data rather than placeholder examples
7. Seeded jobs include links where useful, so downstream detail/link phases can render real-looking content
8. Pretendard / Noto Sans KR fonts and `ko-KR` defaults are applied in the base layout

**Tasks (high-level):**
- Initialize Next.js App Router + TypeScript + Tailwind CSS
- Install Prisma and configure local SQLite for Phase 1
- Author Prisma schema for `Category`, `Job`, `JobLink` with migration-safe fields for a later Supabase Postgres move
- Add recommendation-ready metadata fields to `Job` without implementing the recommender UI or algorithm in v1
- Run first local migration and verify with Prisma Studio or a seed/read smoke test
- Write seed script (`prisma/seed.ts`) with 4 categories and major CS/IT careers
- Configure `next/font` with Pretendard and Noto Sans KR
- Add `ko-KR` locale defaults and base layout
- Defer Supabase/Postgres connection to a later deployment/infrastructure phase

---

### Phase 2: Public Catalog (Grid + Filter)

**Goal:** Anonymous visitors can land on the homepage, see all jobs as cards, and filter by one of the 4 categories — on mobile or desktop.
**Requirements:** CAT-01, CAT-02, CAT-04, FND-03
**UI hint:** yes

**Success criteria:**
1. Visiting `/` shows a responsive card grid of all published jobs grouped by the 4 categories (SW엔지니어, 데이터/AI, 보안/클라우드, 모바일/게임)
2. Clicking a category chip filters the grid to only jobs in that category and updates the URL (`/?category=...`)
3. Clicking a job card navigates to `/jobs/[slug]` for that job
4. The grid renders correctly at 375px (mobile), 768px (tablet), and 1280px+ (desktop) with no horizontal scroll or layout breaks

**Tasks (high-level):**
- Build `app/page.tsx` Server Component fetching jobs via Prisma (`is_published = true`)
- Create `<JobCard>` and `<CategoryFilter>` shadcn-based components
- Implement category filter via URL search params
- Add responsive Tailwind grid (1 col mobile, 2 col tablet, 3-4 col desktop)
- Wire card click to `/jobs/[slug]` route stub
- Manual QA at 375 / 768 / 1280 breakpoints

---

### Phase 3: Job Detail Page

**Goal:** A visitor opening a job card sees a complete, well-formatted detail page with description, skills, salary, and difficulty.
**Requirements:** DET-01, DET-02, DET-03, DET-04
**UI hint:** yes

**Success criteria:**
1. `/jobs/[slug]` renders the job description as formatted Markdown (headings, lists, code, bold) with safe rendering
2. Required skills appear as tag chips below the description
3. Salary section shows 신입 and 경력 ranges in KRW with the source URL and `asOfYear` label visible
4. A "신입 취업 난이도" indicator is displayed with one of three states (거의 없음 / 보통 / 활발)

**Tasks (high-level):**

**Wave 1** — Schema migration + dependency install (no dependencies):
- Rename `entryDifficulty` → `hiringDifficulty` in Prisma schema + migrate
- Update seed.ts, JobCard.tsx, and all code references
- Extract `parseJsonArray` to `lib/utils.ts`
- Install `react-markdown` + `rehype-sanitize`

**Wave 2** *(blocked on Wave 1 completion)*:
- Build `<MarkdownRenderer>`, `<SkillTags>`, `<SalaryBlock>`, `<HiringDifficultyBadge>` components
- Replace Phase 2 route stub with full 2-column `app/jobs/[slug]/page.tsx`
- QA at 375px / 768px / 1280px breakpoints

**Cross-cutting constraints:**
- All components are Server Components (no 'use client')
- `isPublished: true` filter mandatory on all Prisma public reads
- No shadcn/ui — custom Tailwind + CSS variables only

---

### Phase 4: External Links

**Goal:** A visitor on a job detail page can click out to relevant job boards, LinkedIn searches, and bootcamps in one click.
**Requirements:** LNK-01, LNK-02, LNK-03
**UI hint:** yes

**Success criteria:**
1. Each job detail page shows links to relevant 인턴십/채용 sites (사람인, 원티드, 점핏, 프로그래머스 잡스) grouped under "채용 사이트"
2. Each job detail page shows a "LinkedIn 검색" link that opens a pre-filled LinkedIn job search for the role
3. Each job detail page shows a "관련 부트캠프" section listing curated bootcamp links (우아한테크코스, SSAFY, 네이버 부스트캠프, 카카오 테크 캠퍼스 등) where applicable
4. (Bundled) All external links open in a new tab with `rel="noopener noreferrer"`

**Tasks (high-level):**
- Extend seed data with `JobLink` rows tagged by link type (`jobBoard`, `linkedin`, `bootcamp`)
- Build `<ExternalLinks>` section component that groups by type
- Render section headings only when at least one link of that type exists
- Apply secure link attributes globally

---

### Phase 5: Keyword Search

**Goal:** A visitor can type a keyword and see jobs whose title, skills, or description match.
**Requirements:** CAT-03
**UI hint:** yes

**Success criteria:**
1. A search input on `/` accepts a Korean or English keyword and updates the grid in place (URL `?q=...`)
2. Results match against job title and skill tags (case-insensitive); an empty-state appears when no jobs match
3. Search combines with the category filter (both active simultaneously narrows the result set)

**Tasks (high-level):**
- Add `<SearchBar>` component with debounced input
- Extend home Server Component query to filter by `q` and `category` together via Prisma `where`
- Implement empty state UI
- Add a "clear" affordance on the search input

---

### Phase 6: SSR/SSG & SEO

**Goal:** Public pages render on the server with proper SEO metadata so Google can index every job.
**Requirements:** FND-01, FND-02
**UI hint:** no

**Success criteria:**
1. `view-source:` on `/` and `/jobs/[slug]` shows fully rendered HTML with job content (not just an empty React shell)
2. Each `/jobs/[slug]` exports `generateMetadata` returning a unique `title`, `description`, and `openGraph` block derived from the job
3. `/sitemap.xml` lists `/` and one entry per published job with `lastmod` from `updatedAt`
4. `revalidatePath` is invoked from admin write actions so changes appear within one refresh (ISR cache invalidation wired, even though admin writes land in Phase 8)

**Tasks (high-level):**
- Confirm Server Components are used end-to-end on public routes; remove any accidental `'use client'`
- Add `generateMetadata` to job detail route
- Add `app/sitemap.ts` enumerating published jobs
- Add `app/robots.ts`
- Wire `revalidatePath('/')` and `revalidatePath('/jobs/[slug]')` helpers ready for admin actions

---

### Phase 7: Admin Authentication

**Goal:** A single allowlisted admin email can sign in via Supabase magic link and reach gated `/admin/*` routes; everyone else is blocked.
**Requirements:** ADM-01
**UI hint:** yes

**Success criteria:**
1. Visiting `/admin` while logged out redirects to `/admin/login` which sends a magic link to the entered email
2. Clicking the emailed link returns the user to `/admin` with an authenticated session
3. Visiting `/admin/*` with a session whose email is not the allowlisted `ADMIN_EMAIL` results in a 403 (not just middleware bounce)
4. Every Server Action in `/admin/*` re-verifies `session.user.email === ADMIN_EMAIL` server-side before executing

**Tasks (high-level):**
- Install `@supabase/ssr` and configure Supabase Auth client (server + browser variants)
- Implement `/admin/login` page with magic link form
- Implement OAuth callback handler at `/auth/callback`
- Add `middleware.ts` matching `/admin/:path*` that checks session and admin email
- Build shared `requireAdmin()` guard for Server Actions and assert in a test action
- Document `ADMIN_EMAIL` env var in `.env.example`

---

### Phase 8: Admin Dashboard & Job CRUD

**Goal:** Admin can see catalog state, create new jobs, edit existing ones, and delete with a confirmation step — all from a custom shadcn/ui interface.
**Requirements:** ADM-02, ADM-03, ADM-04, ADM-05
**UI hint:** yes

**Success criteria:**
1. `/admin` shows a dashboard with total published jobs count, total draft count, and a list of 5 most recently updated jobs with links to edit
2. `/admin/jobs/new` form (title, slug, category select, markdown description, skill tags, salary fields, difficulty, `is_published` toggle) creates a job via Server Action and redirects to its edit page
3. `/admin/jobs/[id]/edit` loads existing data, allows changes, and saves via Server Action with `revalidatePath` triggering on success
4. A delete action on the edit page requires typing the slug (or a `Dialog` confirm) and removes the job plus its links via a Prisma transaction
5. All forms use `react-hook-form` + `zod` with inline validation errors and disable submit while pending

**Tasks (high-level):**
- Build admin shell layout (`app/admin/layout.tsx`) with nav
- Implement dashboard page with three Prisma aggregate queries
- Build `<JobForm>` shared between new/edit
- Implement `createJob`, `updateJob`, `deleteJob` Server Actions with `requireAdmin()` + `revalidatePath`
- Wire shadcn `Dialog` for delete confirmation
- Add zod schemas covering all job fields including the salary `asOfYear`

---

### Phase 9: Admin Link Management & Production Deploy

**Goal:** Admin can manage each job's external links, and the entire site is deployed live on Vercel for real users.
**Requirements:** ADM-06
**UI hint:** yes

**Success criteria:**
1. The job edit page contains a "외부 링크" section listing all `JobLink` rows with type (job board / linkedin / bootcamp), label, and URL
2. Admin can add a new link (type, label, URL), edit any field inline, and delete a link with confirmation — each action persists via a Server Action and the public detail page reflects the change after refresh
3. The site is deployed on Vercel (Seoul `icn1`) with the production database, `ADMIN_EMAIL`, and Supabase keys configured as env vars, and a custom domain or `*.vercel.app` URL responding 200 to `/`, `/jobs/[slug]`, and `/sitemap.xml`
4. A short README documents local dev, env vars, seed, deploy, and admin login flow

**Tasks (high-level):**
- Build `<JobLinksEditor>` component (CRUD on `JobLink` rows)
- Implement `addLink`, `updateLink`, `deleteLink` Server Actions with admin guard + `revalidatePath('/jobs/[slug]')`
- Configure Vercel project, link Supabase, set env vars
- Run production migration and seed (or import) initial data
- Smoke-test public + admin flows on production URL
- Write `README.md` with setup, scripts, deploy, and operations notes

---

## Coverage Validation

| Requirement | Phase |
|-------------|-------|
| FND-04 | Phase 1 |
| FND-05 | Phase 1 |
| FND-06 | Phase 1 |
| FND-07 | Phase 1 |
| CAT-01 | Phase 2 |
| CAT-02 | Phase 2 |
| CAT-04 | Phase 2 |
| FND-03 | Phase 2 |
| DET-01 | Phase 3 |
| DET-02 | Phase 3 |
| DET-03 | Phase 3 |
| DET-04 | Phase 3 |
| LNK-01 | Phase 4 |
| LNK-02 | Phase 4 |
| LNK-03 | Phase 4 |
| CAT-03 | Phase 5 |
| FND-01 | Phase 6 |
| FND-02 | Phase 6 |
| ADM-01 | Phase 7 |
| ADM-02 | Phase 8 |
| ADM-03 | Phase 8 |
| ADM-04 | Phase 8 |
| ADM-05 | Phase 8 |
| ADM-06 | Phase 9 |

**Total mapped:** 24/24 (100%)
**Orphans:** 0
**Duplicates:** 0

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Local Foundation & Data Schema | 0/0 | Complete | 2026-05-17 |
| 2. Public Catalog (Grid + Filter) | 3/3 | Complete | 2026-05-17 |
| 3. Job Detail Page | 0/2 | Planned | - |
| 4. External Links | 0/0 | Not started | - |
| 5. Keyword Search | 0/0 | Not started | - |
| 6. SSR/SSG & SEO | 0/0 | Not started | - |
| 7. Admin Authentication | 0/0 | Not started | - |
| 8. Admin Dashboard & Job CRUD | 0/0 | Not started | - |
| 9. Admin Link Management & Deploy | 0/0 | Not started | - |
