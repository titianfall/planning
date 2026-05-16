# Stack Research: CS Career Compass

**Researched:** 2026-05-14
**Project context:** Greenfield student project. Korean CS undergraduates exploring career paths via a curated card-grid catalog. Admin (the curator) creates/edits/deletes job entries. No public auth in v1.

## Recommended Stack

### Frontend

**Choice:** Next.js 16.2 (App Router) + React 19 + TypeScript 5.x

- `next@16.2.x` — latest stable as of 2026-03-18
- `react@19.x` / `react-dom@19.x`
- `typescript@5.x`
- Tailwind CSS v4 for styling
- shadcn/ui for prebuilt accessible card/dialog/form components

**Why Next.js 16 App Router:**
1. **Server Components** fit a content catalog perfectly — pages render server-side with zero client JS on the read path, fast first paint, good SEO.
2. **ISR + `revalidatePath`** matches the admin workflow — when curator adds a job, `revalidatePath('/jobs')` refreshes the static page without a redeploy.
3. **Server Actions** remove the "do I need a separate API?" question — admin CRUD flows are Server Actions called directly from React forms, no REST controller layer.
4. **Turbopack** is stable and default in 16.x — `next dev` startup ~400% faster vs 15.x.
5. **Vercel deploy** is one command.

### Backend / API

**Choice:** Next.js Server Actions + Route Handlers — no separate backend service.

- **Public read path** (`/jobs`, `/jobs/[id]`): Server Components query Postgres directly via Prisma in `lib/db.ts`. No API layer.
- **Admin write path**: Server Actions (`'use server'`) handle create/update/delete. Forms post directly to the action.

Why no separate Express/Nest/Fastify: One admin, <200 job entries, no second client. Server Actions are typesafe end-to-end.

### Database

**Choice:** PostgreSQL via **Supabase** (managed) + **Prisma 6.x** as ORM.

**Why Supabase:**
1. One platform for DB + Auth + Storage in one signup.
2. Generous free tier, no credit card required.
3. Dashboard doubles as emergency admin tool if custom UI breaks.

**Why Prisma:**
1. Migrations as code: `prisma migrate dev` produces version-controlled SQL migrations.
2. Typesafe client — fully typed query results.
3. Prisma Studio is a free local GUI for data inspection during dev.

**Schema sketch:**
```prisma
model Job {
  id             String   @id @default(cuid())
  title          String
  category       Category
  description    String   @db.Text
  requiredSkills String[]
  salaryMin      Int?
  salaryMax      Int?
  salaryNote     String?
  isPublished    Boolean  @default(false)
  externalLinks  ExternalLink[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model ExternalLink {
  id       String @id @default(cuid())
  label    String   // "사람인", "원티드", "LinkedIn"
  url      String
  linkType String   // 'job_board' | 'bootcamp' | 'company' | 'other'
  order    Int      @default(0)
  jobId    String
  job      Job @relation(fields: [jobId], references: [id], onDelete: Cascade)
}

enum Category {
  SOFTWARE_ENGINEER
  DATA_AI
  SECURITY_CLOUD
  MOBILE_GAME
}
```

### Admin Interface

**Choice:** Custom admin UI in the same Next.js app under `/admin/*`, using shadcn/ui `Table`, `Form`, `Dialog` + `react-hook-form` + `zod`.

Why custom (not Payload/Strapi/Directus): Four operations on one entity (list, create, edit, delete). ~1–2 days to build directly. Same codebase, same types, same deploy.

**Upgrade path:** If a second editor or draft/publish workflow is needed later, migrate to **Payload CMS 3.x** (embeds inside existing Next.js app, uses existing Postgres).

### Auth

**Choice:** **Supabase Auth** with magic-link email login, gated to a single admin email.

**Pattern:**
- Admin email stored in env var: `ADMIN_EMAIL=curator@example.com`
- `middleware.ts` checks Supabase session on any `/admin/*` route — redirect to `/login` if missing
- Each Server Action independently re-verifies: if `session.user.email !== process.env.ADMIN_EMAIL`, throw
- Never trust middleware alone

### Hosting

**Choice:** **Vercel** (frontend + Server Actions) + **Supabase** (DB + Auth + Storage).

- Vercel Hobby plan: free, zero-config GitHub deploy, preview deploys per PR
- **Region:** `icn1` Seoul on Vercel + Seoul/Tokyo on Supabase (target users are in Korea)

## What NOT to Use

| Don't use | Why |
|-----------|-----|
| Create React App / plain Vite SPA | No SSR, bad SEO for a content catalog |
| Pages Router (Next.js) | App Router has been default for 3+ years; all 2026 docs assume it |
| MongoDB / Firestore | Job data is relational; forcing it into documents loses integrity |
| Sanity / Contentful | SaaS headless CMS — overkill for one admin + one entity type |
| Strapi | Needs its own deploy, doubles infra for no benefit at this scope |
| GraphQL (Apollo, urql) | One client, one server — Server Actions are simpler |
| Redux / Zustand | Read-mostly app; server state covers nearly everything |
| tRPC | Server Actions cover E2E typesafety in 2026 with less ceremony |
| Hardcoded password / Basic Auth | Server Actions are independently callable — page-level basic auth doesn't protect them |
| Heroku / DigitalOcean droplet | No reason to manage a VM; Vercel + Supabase removes ops entirely |
| Vue / Nuxt / SvelteKit | All capable, but Next.js + Vercel + Supabase has deepest Korean + English tutorial coverage |

## Confidence Levels

| Decision | Confidence | Notes |
|----------|------------|-------|
| Next.js 16.2 App Router | HIGH | Verified live at nextjs.org/blog 2026-05-14 |
| React 19 | HIGH | Ships with Next.js 16 |
| TypeScript + Tailwind v4 + shadcn/ui | MEDIUM | Standard 2025/2026 combo |
| Server Actions for admin writes | HIGH | Stable in Next.js 16 docs |
| PostgreSQL via Supabase | MEDIUM-HIGH | Well-established; verify free-tier at supabase.com/pricing |
| Prisma 6.x ORM | MEDIUM | Confirm latest version at install time |
| Custom shadcn/ui admin | HIGH | Sound given scope (one admin, one entity, <200 rows) |
| Supabase Auth (magic link) | MEDIUM-HIGH | Confirm `@supabase/ssr` + Next.js 16 integration guide at setup |
| Vercel Hobby + Supabase Free | HIGH choice / MEDIUM limits | Verify free-tier limits before launch |

## One-Paragraph Synthesis

Build CS Career Compass as a single Next.js 16.2 App Router project in TypeScript, styled with Tailwind v4 and shadcn/ui. Store jobs in PostgreSQL on Supabase via Prisma. Render the public catalog with Server Components + ISR. Implement admin CRUD as a custom `/admin/*` route using Server Actions and shadcn/ui forms — do not adopt a headless CMS for a one-admin / one-entity scope. Gate admin access with Supabase Auth magic-link, restricted to a single admin email checked in both middleware and each Server Action. Deploy on Vercel Hobby (Seoul region) connected to Supabase. Every layer has a free tier sufficient for a student project.
