# Pitfalls Research: CS Career Compass

**Domain:** Content-driven career catalog web platform (student project)
**Researched:** 2026-05-14
**Confidence:** MEDIUM (training-data sourced)

## Pitfall 1: Hand-Rolling an Admin CMS Instead of Using a Headless Backend

**Warning signs:** Spending a sprint on "auth + roles" before any career card is rendered; custom file uploader in tickets; rich text editor selection becomes a multi-day decision.

**Prevention:** Use a headless/managed CMS (Payload CMS, Strapi, Sanity) or Markdown/MDX files in repo. If custom admin is required, scope it to a single password-protected route with plain HTML forms, no WYSIWYG.

**Phase to address:** Earliest architecture phase — shapes the rest of the project.

---

## Pitfall 2: Over-Normalized Data Model for a Small Catalog

**Warning signs:** ERD has more than 4-5 tables for a catalog of <100 items; admin needs nested forms to create related entities; "Add a category" requires database access.

**Prevention:** Start with a single `Career` record holding arrays/JSON for skills, categories, links. Use Postgres `text[]` or JSON columns for tags/skills. Only normalize when you have evidence.

**Phase to address:** Data modeling phase, before schema is migrated.

---

## Pitfall 3: External Link Rot Without Detection

**Warning signs:** No `lastVerified` timestamp on link records; user reports of broken links arrive via email/Discord; no way to see "links unchecked in N months."

**Prevention:** Store `url`, `label`, `lastCheckedAt`, `httpStatus` per external link. Add a scheduled job (Vercel Cron / GitHub Actions weekly) that checks each URL. Surface broken links in admin dashboard.

**Phase to address:** Initial content schema + link health pass before launch; schema fields must exist day one.

---

## Pitfall 4: Salary Data That Becomes Misinformation

**Warning signs:** Salary shown without source, currency, year, or region; single number or free-text string; no "as of [year]" label.

**Prevention:** Schema: `salaryMin`, `salaryMax`, `currency`, `region`, `sourceUrl`, `sourceName`, `asOfYear`. Always render: "Median: X만원 (Source, 2026, 서울)". Add disclaimer banner. Flag entries older than 12 months in admin.

**Phase to address:** Content schema phase.

---

## Pitfall 5: Card Grid Performance Cliff at Scale

**Warning signs:** Card images not constrained by `next/image`; no `loading="lazy"` on below-the-fold images; mobile Lighthouse Performance score < 80.

**Prevention:** Use `next/image` with proper sizing. Serve illustrations as SVG when possible. Set fixed aspect ratio on card containers to prevent CLS. Pre-generate category pages with `generateStaticParams`.

**Phase to address:** UI/grid implementation phase; add Lighthouse CI before launch.

---

## Pitfall 6: SEO Neglect on a Content-First Site

**Warning signs:** Same `<title>` and meta description across all pages; no `sitemap.xml` or `robots.txt`; pages rendered entirely client-side.

**Prevention:** Use SSR or SSG for all career detail pages (Next.js `generateMetadata` per route). Per-page title: `{Career Title} - 기술, 연봉, 진로 | CS Career Compass`. Add JSON-LD `Occupation` schema. Generate `sitemap.xml` at build time.

**Phase to address:** Initial Next.js setup (SSR/SSG decision) and detail-page implementation. Hard to retrofit.

---

## Pitfall 7: Slug Strategy Locks You Out of URL Changes

**Warning signs:** URLs use numeric IDs; slug auto-generated from title with no override field; no redirect table; admin can rename a career without warning about URL change.

**Prevention:** Slug is a first-class editable field. Validate uniqueness; warn before changing an existing slug. Maintain a redirects table (`oldSlug -> careerId`) and 301 redirect from old slugs.

**Phase to address:** Routing phase, before any URLs are shared externally.

---

## Pitfall 8: Authentication Theater for the Admin Surface

**Warning signs:** "We'll just hide the URL" mentioned as a security strategy; hard-coded admin password in JS sent to the browser; `/admin` route publicly reachable in deployed environments.

**Prevention:** Use a managed auth provider (Supabase Auth, Clerk, Auth0 free tier) or HTTP Basic Auth via middleware. Never use security-by-obscurity. Rate-limit the admin login endpoint.

**Phase to address:** Before deploying admin routes to any public environment.

---

## Pitfall 9: Category Taxonomy Drift

**Warning signs:** Categories are free-text on career records; filter UI shows near-duplicate options ("frontend", "Front-end", "Frontend Development").

**Prevention:** Categories are a controlled vocabulary (enum in code or small CMS collection). Admin selects from a dropdown, cannot free-type. Show category counts in admin; hide empty categories from public nav.

**Phase to address:** Schema design phase.

---

## Pitfall 10: Markdown/Rich Text Without Sanitization or Constraints

**Warning signs:** `dangerouslySetInnerHTML` appears without a sanitizer; career description renders differently from career to career.

**Prevention:** Use Markdown (not HTML) with a constrained renderer (react-markdown with restricted components). Sanitize all rendered HTML with DOMPurify or rehype-sanitize. Define a content template for admins.

**Phase to address:** Content schema phase; locked before any content is authored.

---

## Pitfall 11: Scope Creep — "Let Users Save Favorites / Compare / Quiz"

**Warning signs:** User accounts being scoped before the catalog is complete; quiz/recommendation/AI features added to the roadmap.

**Prevention:** Pin the one-sentence product statement: "A read-only catalog of CS careers." Anti-feature list:
- No user accounts (use localStorage if needed)
- No quiz / recommender in v1
- No comments / community features

**Phase to address:** Continuous; revisit anti-feature list at the start of each phase.

---

## Pitfall 12: No Content Preview Before Publish

**Warning signs:** No `status` field on careers (draft/published); "Publish" and "save" are the same action.

**Prevention:** `status: 'draft' | 'published'` on every record. Admin has a "Preview" link that renders the draft using public templates. Use Next.js Draft Mode for static-generation setups.

**Phase to address:** Admin/CMS implementation phase.

---

## Pitfall 13: Mobile Layout Treated as an Afterthought

**Warning signs:** First implementation tested only at 1440px width; no breakpoints below `md`; sidebar filter has no mobile equivalent.

**Prevention:** Design mobile-first (375px viewport). Single-column card list on mobile, 2-column tablet, 3+ desktop. Filter UI: bottom-sheet or full-screen drawer on mobile. Test in Chrome DevTools device mode for every PR.

**Phase to address:** UI implementation phase; mobile is not a "polish" task.

---

## Pitfall 14: Accessibility Failures That Exclude Users

**Warning signs:** `<div>` everywhere with click handlers (not keyboard navigable); tab order broken or invisible; Lighthouse Accessibility score < 95.

**Prevention:** Cards are `<article>` containing a single `<a>` wrapper. All interactive elements are native HTML. Visible focus rings. Run axe DevTools on every PR. Color contrast minimum 4.5:1 for body text.

**Phase to address:** UI implementation phase; enforce via CI accessibility check.

---

## Pitfall 15: No Analytics, So No Learning

**Warning signs:** No analytics tool integrated; "We'll add Google Analytics later" never happens.

**Prevention:** Use lightweight, privacy-respecting analytics (Plausible, Umami, Vercel Analytics). Track: page views per career, external link clicks, filter usage.

**Phase to address:** Pre-launch; trivial to add.

---

## Pitfall 16: Image Asset Management Drift

**Warning signs:** Asset paths mixed across deployment + CDN + external URLs; same icon at different resolutions in different cards.

**Prevention:** Pick one storage strategy. Use one icon library (Lucide, Heroicons) for category icons — render as components. Every image record requires alt text.

**Phase to address:** Asset strategy in architecture phase.

---

## Critical Mistakes to Avoid (Ranked by Severity)

1. **Hand-rolling the CMS** — eats the entire time budget
2. **Scope creep into user accounts / quizzes** — turns a 4-week project into a 4-month one
3. **SEO neglect / client-side-only rendering** — site exists but is invisible
4. **No auth on admin routes** — public CMS = data loss waiting to happen
5. **Salary data without source/year/region** — actively misleads the audience
6. **No preview / draft state** — pain compounds with every content edit
7. **Link rot with no detection** — site degrades silently over months
8. **Accessibility neglect** — excludes users; may violate institutional policies
9. **Mobile-as-afterthought** — majority of traffic, easy to get wrong
10. **Over-normalized schema** — slows admin workflow, complicates everything downstream

## Phase-Specific Warning Map

| Phase | Likely Pitfalls | Priority |
|-------|-----------------|----------|
| Architecture / setup | 1 (CMS choice), 8 (auth strategy), 16 (asset strategy) | Lock before coding |
| Data modeling | 2, 4 (salary fields), 9 (taxonomy), 10 (content shape) | Schema as contract |
| Routing / URLs | 6 (SSR/SSG), 7 (slugs + redirects) | Hard to change post-launch |
| Card grid UI | 5 (performance), 13 (mobile), 14 (a11y) | Lighthouse CI from day one |
| Detail pages | 3 (link health), 4 (salary display), 6 (per-page SEO) | JSON-LD on every detail |
| Admin CMS | 1, 8, 10 (Markdown constraints), 12 (draft/preview) | Keep admin minimal |
| Pre-launch | 6 (sitemap), 15 (analytics), 3 (link audit) | Checklist gate |
| Continuous | 11 (scope creep), 4 (salary refresh), 3 (link rot) | Recurring review |
