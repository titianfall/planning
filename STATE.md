# Project State: CS Career Compass

**Updated:** 2026-05-20
**Current Phase:** 3
**Status:** Phase 2 완료 (02-01, 02-02, 02-03 모두 완료); Phase 3 실행 예정 (Job Detail Page); Phase 4·5 컨텍스트 확보됨

## Project Reference

See: .planning/PROJECT.md
**Core value:** CS 학생이 어떤 직업이 있는지 한눈에 보고, 바로 지원 사이트까지 이동할 수 있어야 한다.
**Current focus:** Phase 3 — Job Detail Page

## Current Position

- **Milestone:** v1
- **Phase:** 3 — Job Detail Page
- **Plan:** Phase 2 모두 완료 (02-01, 02-02, 02-03); Phase 3 대기 중
- **Status:** Phase 1 complete; Phase 2 complete (3/3 plans done); Phase 3 not started
- **Progress:** [======    ] Phase 1 + Phase 2 complete (schema + seed + UI components + home page assembly)

## Phase Progress

| # | Phase | Requirements | Status |
|---|-------|--------------|--------|
| 1 | Local Foundation & Data Schema | FND-04, FND-05, FND-06, FND-07 | Pending |
| 2 | Public Catalog (Grid + Filter) | CAT-01, CAT-02, CAT-04, FND-03 | Complete |
| 3 | Job Detail Page | DET-01, DET-02, DET-03, DET-04 | Planned |
| 4 | External Links | LNK-01, LNK-02, LNK-03 | Pending |
| 5 | Keyword Search | CAT-03 | Pending |
| 6 | SSR/SSG & SEO | FND-01, FND-02 | Pending |
| 7 | Admin Authentication | ADM-01 | Pending |
| 8 | Admin Dashboard & Job CRUD | ADM-02, ADM-03, ADM-04, ADM-05 | Pending |
| 9 | Admin Link Management & Deploy | ADM-06 | Pending |

## Performance Metrics

- **Phases planned:** 9
- **Plans executed:** 3 (02-01, 02-02, 02-03)
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

**Last action:** Phase 5 (Keyword Search) discuss-phase 완료. 05-CONTEXT.md / 05-DISCUSSION-LOG.md 작성 — 입력 즉시 검색(디바운스, 클라이언트 컴포넌트), 검색 대상 직업명+기술태그, 검색창을 카테고리 필터 위 배치, 검색+카테고리 AND 결합 결정.
**Next action:** Phase 3 (Job Detail Page) 실행 — 03-01 (schema/deps) → 03-02. Phase 4·5는 컨텍스트 확보됨, 플랜 단계 대기 (`/gsd:plan-phase 5`).
**Resume file:** phases/05-keyword-search/05-CONTEXT.md
