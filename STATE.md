# Project State: CS Career Compass

**Updated:** 2026-05-17
**Current Phase:** 2
**Status:** Phase 2 executing (02-01 and 02-02 complete, 02-03 pending); Phase 3 planned (2 plans)

## Project Reference

See: .planning/PROJECT.md
**Core value:** CS 학생이 어떤 직업이 있는지 한눈에 보고, 바로 지원 사이트까지 이동할 수 있어야 한다.
**Current focus:** Phase 2 — Public Catalog (Grid + Filter)

## Current Position

- **Milestone:** v1
- **Phase:** 2 — Public Catalog (Grid + Filter)
- **Plan:** 02-01 and 02-02 complete; 02-03 pending
- **Status:** Phase 1 complete; Phase 2 executing (2/3 plans done)
- **Progress:** [====      ] Phase 1 complete; Phase 2 Plans 01-02 complete (schema + seed + UI components)

## Phase Progress

| # | Phase | Requirements | Status |
|---|-------|--------------|--------|
| 1 | Local Foundation & Data Schema | FND-04, FND-05, FND-06, FND-07 | Pending |
| 2 | Public Catalog (Grid + Filter) | CAT-01, CAT-02, CAT-04, FND-03 | Pending |
| 3 | Job Detail Page | DET-01, DET-02, DET-03, DET-04 | Planned |
| 4 | External Links | LNK-01, LNK-02, LNK-03 | Pending |
| 5 | Keyword Search | CAT-03 | Pending |
| 6 | SSR/SSG & SEO | FND-01, FND-02 | Pending |
| 7 | Admin Authentication | ADM-01 | Pending |
| 8 | Admin Dashboard & Job CRUD | ADM-02, ADM-03, ADM-04, ADM-05 | Pending |
| 9 | Admin Link Management & Deploy | ADM-06 | Pending |

## Performance Metrics

- **Phases planned:** 9
- **Plans executed:** 2 (02-01, 02-02)
- **Verifier runs:** 0
- **Cycles:** 0

## Accumulated Context

### Key Decisions (from research)

- Next.js 16.2 App Router + React 19 + TypeScript 5.x
- Tailwind CSS v4 + shadcn/ui
- Phase 1 uses Prisma + SQLite locally; Supabase/Postgres connection is deferred
- Prisma schema should remain migration-friendly for a later Supabase Postgres move
- Server Actions for admin writes (no REST/GraphQL/tRPC)
- Supabase Auth magic link + single allowlisted admin email
- 4 fixed categories as a controlled enum
- Slugs as first-class editable URL identifiers
- Korean-first copy with Pretendard / Noto Sans KR
- Draft/publish (`is_published`) and link health fields (`lastCheckedAt`, `httpStatus`) in schema from day one
- Job schema includes recommendation-ready fit metadata from day one, while the recommender algorithm remains out of v1 scope
- Vercel (Seoul `icn1`) + Supabase (Seoul/Tokyo)

### Open Questions (carry forward)

- Markdown vs. structured plain-text for job description body
- SVG icon set vs. per-job hero images (lean SVG-only for v1)
- Bootcamp catalog scope in v1 vs. v2
- Live job feed integration (deferred — manual curation in v1)
- Analytics provider choice (Vercel Analytics likely default)
- Salary data sourcing standards
- Exact fit metadata scale/encoding for future recommendation scoring
- KakaoTalk share (v2)
- Dark mode (v2)

### Todos

- Stabilize Docker Desktop storage if `meta.db` / `blob` / `snapshot` input-output errors recur
- Run `docker compose up` from `C:\Users\qkrwo\.planning`
- Verify Prisma migration, seed, and Next dev server inside Docker
- Open `http://localhost:3000` and confirm categories/jobs render

### Blockers

- Docker Desktop containerd storage intermittently fails with `meta.db: input/output error`, `blob ... input/output error`, or `snapshot ... no such file or directory`

## Session Continuity

**Last action:** Phase 2 Plan 02 (02-02) 완료. CategoryFilter Server Component 신규 구현. JobCard/jobs/[slug] route는 bc2de52에서 이미 구현됨을 확인.
**Next action:** Phase 2 Plan 03 (02-03) — 홈 카탈로그 페이지 조립 (CategoryFilter + JobCard 통합, URL 파라미터 기반 서버사이드 필터링).
