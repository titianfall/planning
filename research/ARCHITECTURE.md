# Architecture Research: CS Career Compass

**Domain:** Content-driven catalog/directory web app with admin CMS
**Researched:** 2026-05-14
**Confidence:** HIGH (well-established patterns, stable for 5+ years)

## Component Overview

Five components, organized around a single source of truth (the database) with two read/write paths (public read, admin write):

```
                  ┌─────────────────────────┐
                  │   Browser (Public)      │
                  │   Card grid + detail    │
                  └───────────┬─────────────┘
                              │ HTTP (read-only)
                              ▼
┌──────────────┐      ┌─────────────────────┐      ┌──────────────┐
│  Admin UI    │◄────►│   Web Server / API  │◄────►│   Database   │
│  (CRUD)      │ HTTP │   (auth + routes)   │  SQL │  (jobs,      │
└──────────────┘      └─────────────────────┘      │   categories)│
       ▲                                            └──────────────┘
       │ session/login
       ▼
┌──────────────┐
│  Admin Auth  │
│  (single     │
│   user OK)   │
└──────────────┘
```

| Component | Responsibility | Notes |
|-----------|---------------|-------|
| **Public Catalog UI** | Render card grid, category filter, detail page. Read-only. SEO-friendly. | No auth. Cached if possible. |
| **Admin UI** | Form-based CRUD for jobs, categories, external links. | Lives at `/admin/*` route prefix. |
| **Web Server / API** | Routing, request handling, auth checks, query orchestration. | The only component that touches the DB. |
| **Database** | Persist jobs, categories, links, admin users. Source of truth. | Single relational DB is sufficient. |
| **Admin Auth** | Identify the admin, gate `/admin/*` routes. | As simple as one admin account + session cookie. |

### Boundaries

- **Public UI** must not write to DB and must not be able to reach admin endpoints.
- **Admin UI** must not be reachable by anonymous users (middleware check on every `/admin/*` request).
- **Web Server** must not embed content in code — content always flows from DB.
- **Database** does not enforce business logic beyond constraints; validation lives in the server.

## Data Flow

### Flow 1: Public read (the hot path)

```
Browser → GET /jobs?category=data-ai
       → Server: auth check (none required)
       → Server: SELECT jobs WHERE category=? + LEFT JOIN links
       → Server: render HTML
       → Browser: paint card grid
```

### Flow 2: Admin write (the cold path)

```
Admin Browser → POST /admin/jobs (form submit)
             → Server: auth check (session cookie → admin?)
             → Server: validate input
             → Server: INSERT/UPDATE/DELETE in DB (in a transaction)
             → Server: redirect to /admin/jobs (PRG pattern)
```

### Flow 3: Admin login

```
Admin Browser → POST /admin/login
             → Server: verify password hash
             → Server: set httpOnly session cookie
             → Server: redirect to /admin
```

## Data Model

```sql
CREATE TABLE categories (
    id            INTEGER PRIMARY KEY,
    slug          TEXT NOT NULL UNIQUE,        -- 'sw-engineer', 'data-ai', etc.
    name_ko       TEXT NOT NULL,               -- '소프트웨어 엔지니어'
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    id              INTEGER PRIMARY KEY,
    category_id     INTEGER NOT NULL REFERENCES categories(id),
    slug            TEXT NOT NULL UNIQUE,        -- 'backend-developer' → URL
    title_ko        TEXT NOT NULL,               -- '백엔드 개발자'
    title_en        TEXT,
    summary         TEXT NOT NULL,               -- 1-2 line blurb for card
    description     TEXT NOT NULL,               -- full markdown body for detail page
    required_skills TEXT NOT NULL,               -- JSON array
    salary_min      INTEGER,                      -- KRW, nullable
    salary_max      INTEGER,                      -- KRW, nullable
    salary_note     TEXT,                         -- '신입 기준', '경력 3년차' etc.
    is_published    BOOLEAN NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_jobs_category  ON jobs(category_id);
CREATE INDEX idx_jobs_published ON jobs(is_published);

CREATE TABLE external_links (
    id            INTEGER PRIMARY KEY,
    job_id        INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    label         TEXT NOT NULL,           -- 'LinkedIn', '사람인', '원티드'
    url           TEXT NOT NULL,
    link_type     TEXT NOT NULL,           -- 'job_board' | 'bootcamp' | 'company' | 'other'
    display_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_links_job ON external_links(job_id);

CREATE TABLE admin_users (
    id            INTEGER PRIMARY KEY,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,           -- bcrypt/argon2 — NEVER plaintext
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Modeling notes

- **`slug` columns** for SEO-friendly URLs (`/jobs/backend-developer`, not `/jobs/42`).
- **`required_skills` as JSON** — avoid a separate skills table for v1 (YAGNI).
- **`is_published` flag** lets admin draft jobs without exposing them.
- **External links as a child table** (not JSON on `jobs`) — structured fields + admin churn.
- **Salary as min/max + note** — ranges with caveats; single integer is too lossy.

## Routing Structure

### Public routes

| Path | Purpose |
|------|---------|
| `/` | Landing — hero + category tiles |
| `/jobs` | All jobs, card grid |
| `/jobs?category=data-ai` | Filtered grid |
| `/jobs/:slug` | Single job detail |

### Admin routes (all gated by auth middleware)

| Path | Method | Purpose |
|------|--------|---------|
| `/admin/login` | GET, POST | Login form |
| `/admin/logout` | POST | Clear session |
| `/admin` | GET | Dashboard |
| `/admin/jobs` | GET | List all jobs |
| `/admin/jobs/new` | GET, POST | Create form |
| `/admin/jobs/:id/edit` | GET, POST | Edit form |
| `/admin/jobs/:id/delete` | POST | Delete (CSRF-protected) |
| `/admin/categories` | GET, POST | Manage categories |

## Admin vs Public Separation

Three layers of separation:

1. **Route prefix:** Everything under `/admin/*` goes through auth middleware.
   ```
   app.use('/admin', requireAdminSession, adminRouter);
   app.use('/',       publicRouter);
   ```

2. **Template separation:** Admin and public views in different directories (`views/admin/`, `views/public/`).

3. **Query separation:** Public queries always filter `WHERE is_published = TRUE`. Use distinct repository functions (`getPublishedJobs()` vs `getAllJobs()`).

**Auth shape for single admin:**
- Username + bcrypt hash, seeded by a setup script
- httpOnly, sameSite=Lax, secure session cookie
- CSRF token on every POST form
- No JWT, no OAuth, no role system

## Suggested Build Order

### Phase 1: Foundation
1. Project scaffold, dev server runs
2. Database schema + migrations, seed 4 categories
3. Basic public route responds

### Phase 2: Public catalog
4. Seed 3–5 sample jobs via SQL
5. `/jobs` card grid — query DB, render cards
6. `/jobs/:slug` detail page
7. Category filter
8. Styling pass

### Phase 3: Admin authentication
9. Admin user table + seed script (bcrypt password)
10. `/admin/login` form + session middleware
11. Logout + CSRF

### Phase 4: Admin CRUD
12. `/admin/jobs` list view
13. Create job form with validation
14. Edit/delete job
15. External links sub-form (repeating fieldset)
16. Category management

### Phase 5: Polish
17. Empty states, draft/publish toggle
18. Error pages (404, 500)
19. Deploy

**Why this order:** Schema before UI → public before admin → seed data before admin UI → auth before CRUD endpoints (never the reverse).

## Key Architectural Decisions

### Decision 1: Server-rendered HTML (MPA), not SPA
SEO matters — students will Google "데이터 사이언티스트 진로" and you want to be a result. Card grid + detail pages are textbook server-rendering use cases.

### Decision 2: Relational DB, single instance
SQLite for dev + simple deploys, Postgres if hosted (Supabase/Neon/Railway). Catalog data is relational; total row count is in the low hundreds.

### Decision 3: Same app serves admin and public
One codebase, one deployment, separate route trees. Trust separation enforced by middleware.

### Decision 4: Slugs are first-class identifiers in URLs
Public URLs use slugs (`/jobs/backend-developer`), not numeric IDs. Slugs must be unique and immutable once published.

### Decision 5: External links are data, not config
Links live in the `external_links` table, edited by admin. Job boards and bootcamps change URLs; admin must update without redeploy.

### Decision 6: No public account system in v1
Anonymous public access assumed. Do not add a `users` table "just in case."

## Open Questions (for STACK.md to resolve)

- Markdown vs plain text vs WYSIWYG for `jobs.description`
- Image uploads in v1 (job icons, hero images) — suggest deferring
- Session storage: DB-backed vs signed cookies vs in-memory
- Deployment target (Vercel, Railway, VPS) — influences SQLite vs Postgres choice
