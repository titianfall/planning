# Research Summary: CS Career Compass

## Recommended Stack

- **Next.js 16.2 App Router + React 19 + TypeScript 5.x** — Server Components give SSR/SEO for the public catalog; ISR + `revalidatePath` matches the admin-edit workflow; Server Actions remove the need for a separate API layer.
- **Tailwind CSS v4 + shadcn/ui** — accessible prebuilt `Card`, `Dialog`, `Form`, `Table` primitives; pairs with `react-hook-form` + `zod` for admin forms.
- **Prisma 6.x with SQLite in Phase 1, later Supabase Postgres** — local SQLite keeps the foundation fast to validate; Prisma schema and migrations should stay portable for a later hosted Postgres move.
- **Supabase Auth (magic link), single allowlisted admin email** — gate `/admin/*` in `middleware.ts` AND re-verify in each Server Action; never trust middleware alone.
- **Vercel (Seoul `icn1`) + Supabase (Seoul/Tokyo)** — both have free tiers sufficient for a student project; target users are in Korea.

## Table Stakes Features

- **Card-grid home with 4 categories** (Software Engineer, Data/AI, Security/Cloud, Mobile/Game)
- **Job detail page per role** — description, required skills (tag list), salary range, external links
- **Salary range in KRW with 신입/경력 split and `as-of-year` label** — ambiguity sends users to Blind/JobPlanet
- **External job-board deep links** — LinkedIn, 사람인, 원티드, 점핏, 프로그래머스 잡스
- **Category filter / basic search** — users want to narrow even with 4 categories
- **Mobile-first responsive layout + Korean web font (Pretendard / Noto Sans KR)**
- **Admin CRUD on jobs/links/categories behind auth** — draft/publish toggle from day one
- **SSR/SSG with per-page SEO metadata + `sitemap.xml`** — students discover via Google search

## Architecture Pattern

Single Next.js app with two trust zones sharing one Prisma-managed database: a **public read path** (Server Components → Prisma → DB, cached via ISR) and an **admin write path** (`/admin/*` routes gated by middleware, Server Actions inside transactions, PRG-redirect back to lists). Phase 1 uses local SQLite; production can later move to Supabase Postgres without changing the app architecture. Build order: **local schema first → public read path with seeded data → admin auth → admin CRUD → hosted DB/deploy**.

## Key Pitfalls to Avoid

1. **Hand-rolling a heavyweight admin CMS** — scope admin to plain shadcn/ui forms; no WYSIWYG, no custom uploader, no role system in v1.
2. **Salary data becoming misinformation** — schema must carry `salaryMin/Max`, `salaryNote`, `sourceUrl`, `asOfYear`; always render with year + source.
3. **SEO neglect / client-only rendering** — Server Components + `generateMetadata` per route + `sitemap.xml` from day one; retrofitting is painful.
4. **Auth theater on `/admin/*`** — use Supabase Auth magic link AND re-check `session.user.email === ADMIN_EMAIL` inside every Server Action (middleware alone is not enough).
5. **External link rot** — store `lastCheckedAt` + `httpStatus` per link; add a weekly check to surface failures in admin dashboard.

## Decisions Already Made

- Single Next.js 16.2 App Router monorepo on Vercel; no separate backend service
- Phase 1 is local-first with Prisma + SQLite; Supabase Postgres is deferred to deployment/production hardening
- Server Actions for admin writes; no REST/GraphQL/tRPC layer
- Custom shadcn/ui admin at `/admin/*`; Payload CMS is the documented upgrade path if needed
- Supabase Auth magic link, single admin email allowlist; no public user accounts
- 4 fixed categories as a controlled enum; no free-text taxonomy
- Slugs are first-class editable URL identifiers with redirect table (not numeric IDs)
- Korean-first copy (ko-KR); Pretendard / Noto Sans KR font
- Anti-features locked: no public auth, no live job board clone, no salary crowdsourcing, no forums, no quizzes, no AI chatbot
- Draft/publish (`is_published`) and link health (`lastCheckedAt`, `httpStatus`) fields exist in schema from day one
- Job metadata for future fit recommendation exists from Phase 1, but the recommendation algorithm/UI remains out of v1

## Open Questions

- **Content body format**: Markdown with constrained renderer vs. structured plain-text fields
- **Image/icon strategy**: SVG icon set (Lucide/Heroicons) vs. per-job hero images via Supabase Storage — suggest deferring hero images to v2
- **Bootcamp & internship catalog**: v1 feature or v2 differentiator? (우아한테크코스, SSAFY, 부스트캠프, KDT)
- **신입 채용 live feed**: 원티드/점핏 API availability unverified; manual curation vs. RSS vs. scraping unresolved
- **Analytics choice**: Vercel Analytics vs. Plausible vs. Umami
- **Salary data sourcing**: what counts as a credible source and how is it refreshed?
- **KakaoTalk share integration**: SDK + OG image strategy
- **Dark mode**: v1 or v2?
