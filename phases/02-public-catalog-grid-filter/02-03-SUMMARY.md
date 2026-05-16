---
phase: 02-public-catalog-grid-filter
plan: "02-03"
subsystem: ui
tags: [next.js, tailwind, server-component, prisma, responsive-grid, category-filter]

# Dependency graph
requires:
  - phase: 02-02
    provides: "JobCard(hiringDifficulty 뱃지, exampleCompanies, formatSalary) + CategoryFilter(Server Component, 필 칩 URL 필터) 컴포넌트"
provides:
  - "app/page.tsx — searchParams Promise 패턴, 병렬 Prisma 쿼리, 카테고리 서버사이드 필터링, 반응형 카드 그리드, 빈 상태 UI"
affects: [03-job-detail-page, 05-keyword-search]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Next.js 15+ searchParams: Promise<{ category?: string }> 패턴 — Server Component에서 await searchParams"
    - "Promise.all 병렬 Prisma 쿼리 패턴 — categories + jobs 동시 조회"
    - "Tailwind 반응형 그리드: grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    - "Prisma 조건부 where: activeCategory 있을 때만 { category: { slug: activeCategory } } 추가"

key-files:
  created: []
  modified:
    - app/page.tsx

key-decisions:
  - "Phase 1 smoke page 구조(카테고리 목록 섹션)를 카테고리 필터 칩 + 반응형 JobCard 그리드로 전면 교체"
  - "searchParams await 패턴: const { category: activeCategory } = await searchParams"
  - "jobs 쿼리에 include: { category: true } 포함 — JobCard의 job.category.name 렌더링에 필요"
  - "빈 상태 UI에 Link href='/' '전체 보기' 포함 — 필터 해제 UX"

patterns-established:
  - "서버사이드 카테고리 필터링: Prisma where { category: { slug: activeCategory } } 조건부 스프레드"

requirements-completed: [CAT-01, CAT-02, CAT-04, FND-03]

# Metrics
duration: 20min
completed: 2026-05-17
---

# Phase 2 Plan 03: Home Page Assembly Summary

**app/page.tsx를 Next.js 15 searchParams Promise 패턴 + 병렬 Prisma 쿼리 + CategoryFilter + 반응형 JobCard 그리드(1열/2열/3열)로 전면 재구현하여 Phase 2 성공 기준 4개 모두 충족**

## Performance

- **Duration:** 약 20분
- **Started:** 2026-05-17T00:00:00Z
- **Completed:** 2026-05-17
- **Tasks:** 2 (T01: 코드 재구현, T02: QA 검증)
- **Files modified:** 1 (app/page.tsx)

## Accomplishments

- `app/page.tsx` — `searchParams: Promise<{ category?: string }>` props, `await searchParams`로 activeCategory 추출
- Promise.all 병렬 쿼리: `categories` (sortOrder asc) + `jobs` (isPublished true, include category, 조건부 category.slug 필터)
- 반응형 그리드: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` (모바일 1열 / 태블릿 2열 / 데스크탑 3열)
- CategoryFilter에 `categories` + `activeSlug` 두 props 전달
- 빈 상태 UI: `jobs.length === 0` 시 "해당 카테고리에 직업이 없습니다" + "전체 보기" Link 렌더링
- QA 결과: `/`(6개 카드), `/?category=software-engineering`(3개 카드), `/?category=data-ai`(3개 카드), `/?category=nonexistent`(빈 상태 UI) 모두 정상

## Task Commits

1. **T01: app/page.tsx 카테고리 필터 + 반응형 그리드로 재구현** — `3c9da5c` (feat)

## Files Created/Modified

- `app/page.tsx` — Phase 1 smoke page에서 카테고리 필터 + 반응형 직업 카드 그리드로 전면 재구현

## Decisions Made

- `include: { category: true }` 를 jobs 쿼리에 포함 — JobCard Props 타입 `job.category.name` 렌더링 요구사항
- `links: true` include를 제거 — 이 페이지의 JobCard는 links 데이터를 사용하지 않으므로 불필요한 데이터 로드 배제

## Deviations from Plan

None — 플랜 스펙대로 정확히 구현됨.

## QA Results (T02)

| URL | 예상 | 실제 | 상태 |
|-----|------|------|------|
| `http://localhost:3001/` | 6개 카드 | 6개 카드 | PASS |
| `/?category=software-engineering` | 3개 카드 | 3개 카드 | PASS |
| `/?category=data-ai` | 3개 카드 | 3개 카드 | PASS |
| `/?category=nonexistent` | 빈 상태 UI | "해당 카테고리에 직업이 없습니다" + "전체 보기" | PASS |

**그리드 클래스 확인:** `sm:grid-cols-2`, `lg:grid-cols-3` HTML 출력에서 확인됨.
**수평 스크롤 방지:** `html { min-width: 320px }` globals.css에서 확인됨.
**카테고리 필터 href:** `/?category=software-engineering`, `/?category=data-ai` 정상.
**빌드 검증:** `npm run build` 성공 (TypeScript 오류 없음, 정적 페이지 생성 완료).

## Issues Encountered

- 개발 서버가 포트 3000 대신 3001에서 실행 중이었으나 (다른 프로세스 점유), 동일한 서버에서 QA 수행 완료.

## User Setup Required

None — 외부 서비스 설정 불필요.

## Next Phase Readiness

- Phase 2 성공 기준 4개 모두 충족:
  1. `/` 방문 시 발행된 직업이 카드 그리드로 표시됨 — DONE
  2. 카테고리 칩 클릭 → 해당 카테고리만 표시 + URL 업데이트 — DONE (CategoryFilter Link href)
  3. 직업 카드 클릭 → `/jobs/[slug]` 이동 — DONE (JobCard Link + bc2de52 route stub)
  4. 375px/768px/1280px 정상 렌더링 — DONE (sm:grid-cols-2 lg:grid-cols-3 + min-width:320px)
- Phase 3 (Job Detail Page) 진행 가능. `app/jobs/[slug]/page.tsx`는 bc2de52에서 이미 Prisma 쿼리 + notFound() 구현됨.

## Known Stubs

None — 모든 컴포넌트는 실제 DB 데이터를 렌더링함.

## Self-Check: PASSED

- app/page.tsx: FOUND
- searchParams Promise 패턴: CONFIRMED
- sm:grid-cols-2 lg:grid-cols-3 클래스: CONFIRMED
- npx tsc --noEmit: PASSED
- npm run build: PASSED
- 홈 6개 카드: CONFIRMED
- software-engineering 3개 카드: CONFIRMED
- data-ai 3개 카드: CONFIRMED
- nonexistent 빈 상태 UI: CONFIRMED
- commit 3c9da5c (T01): FOUND

---
*Phase: 02-public-catalog-grid-filter*
*Completed: 2026-05-17*
