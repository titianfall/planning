---
phase: 02-public-catalog-grid-filter
plan: "02-02"
subsystem: ui-components
tags: [next.js, tailwind, server-component, prisma, job-card, category-filter]

# Dependency graph
requires:
  - phase: 02-01
    provides: "Job 모델 exampleCompanies 필드 + hiringDifficulty 필드명 확정"
provides:
  - "app/components/JobCard.tsx — hiringDifficulty 뱃지 3색, exampleCompanies, formatSalary 포함"
  - "app/components/CategoryFilter.tsx — Server Component, 전체/카테고리 필 칩 링크"
  - "app/jobs/[slug]/page.tsx — Next.js 15 await params 패턴, notFound() 처리"
affects: [02-03, 03-job-detail-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "parseJsonArray/formatSalary 로컬 헬퍼 함수로 JSON string array 파싱 및 연봉 포맷"
    - "CSS 변수 패턴: border-[var(--line)], bg-[var(--panel)], text-[var(--muted)]"
    - "Server Component 기반 카테고리 필터 — URL search param /?category={slug}"

key-files:
  created:
    - app/components/CategoryFilter.tsx
  modified:
    - app/components/JobCard.tsx

key-decisions:
  - "JobCard의 parseJsonArray/formatSalary 헬퍼를 컴포넌트 내부에 로컬로 정의 (lib/utils.ts의 parseJsonArray와 별개)"
  - "CategoryFilter는 'use client' 없는 순수 Server Component로 구현 — Link 기반 URL 변경"
  - "app/jobs/[slug]/page.tsx는 bc2de52 커밋(Phase 3 Plan 02)에서 이미 플랜 스펙을 초과하는 완성 버전이 존재 — 재작성 불필요"

# Metrics
duration: 20min
completed: 2026-05-17
---

# Phase 2 Plan 02: Core Components Summary

**JobCard(hiringDifficulty 뱃지 3색, exampleCompanies, 신입 연봉 미리보기)와 CategoryFilter(Server Component, 필 칩 URL 필터) 구현 완료; /jobs/[slug] route stub은 bc2de52에서 이미 완성된 상태 확인**

## Performance

- **Duration:** 약 20분
- **Started:** 2026-05-16T15:27:00Z
- **Completed:** 2026-05-17
- **Tasks:** 3 (T01: 기확인, T02: 신규 구현, T03: 기확인)
- **Files modified:** 2 (JobCard.tsx 업데이트, CategoryFilter.tsx 신규 생성)

## Accomplishments

- `app/components/JobCard.tsx` — parseJsonArray/formatSalary 로컬 헬퍼, hiringDifficulty 3색 뱃지, exampleCompanies 최대 3개, skills 최대 3개 뱃지, 신입 연봉 미리보기, hover:shadow-md transition
- `app/components/CategoryFilter.tsx` — Server Component (use client 없음), "전체" href="/", 카테고리 href="/?category={slug}", 활성/비활성 스타일 구분
- `app/jobs/[slug]/page.tsx` — Next.js 15 `Promise<{ slug: string }>` params 패턴, `await params`, `prisma.job.findUnique({ where: { slug } })`, `notFound()` 호출, "← 직업 목록" 링크

## Task Commits

1. **T01: JobCard.tsx** — `bc2de52` (Phase 3 Plan 02 커밋에서 이미 히링 필드 포함 구현됨; 이 플랜에서 추가 내용 재확인 후 동일 스펙으로 재작성, git diff 없음으로 별도 커밋 불필요)
2. **T02: CategoryFilter.tsx** — `7f8d977` (feat — 신규 생성)
3. **T03: app/jobs/[slug]/page.tsx** — `bc2de52` (Phase 3 Plan 02 커밋에서 이미 스펙 초과 구현됨; 재작성 불필요)

## Files Created/Modified

- `app/components/CategoryFilter.tsx` (신규) — 카테고리 필터 Server Component
- `app/components/JobCard.tsx` (확인/동일 스펙) — hiringDifficulty 뱃지, exampleCompanies, salary 포함

## Decisions Made

- `JobCard`의 `parseJsonArray`와 `formatSalary`를 컴포넌트 내부에 로컬로 정의. `lib/utils.ts`에도 `parseJsonArray`가 있으나 Plan 스펙에 맞게 로컬 헬퍼로 유지.
- `CategoryFilter`는 순수 Server Component — 상태 관리 없이 Link + activeSlug prop으로 활성 스타일 처리.
- Phase 3 Plan 02(bc2de52)에서 이미 `/jobs/[slug]/page.tsx`가 플랜 스펙을 완전히 초과하여 구현됨. 중복 구현보다 기존 코드 검증으로 처리.

## Deviations from Plan

### 사전 구현된 코드 발견

**1. [정보성 편차] T01, T03 코드가 bc2de52(Phase 3 Plan 02)에서 이미 구현됨**
- **발견 시점:** T01 커밋 시도 시 git status에서 변경사항 없음 확인
- **상황:** `bc2de52` 커밋에서 Phase 3 Plan 02를 실행하며 JobCard.tsx를 업데이트하고 /jobs/[slug]/page.tsx를 생성해 02-02 Plan의 T01/T03 내용이 사전 충족됨
- **처리:** T01/T03 코드를 플랜 스펙과 대조하여 acceptance criteria 모두 충족 확인 후 추가 작업 없이 통과
- **영향:** 계획된 2개 커밋 중 T02 하나만 신규 생성. T01/T03은 bc2de52 커밋으로 갈음.

---

**총 편차:** 1 (정보성 — 사전 구현 코드 발견, 자동 수정 불필요)

## Known Stubs

None — CategoryFilter는 실제 Link 기반 필터이고, JobCard는 실제 데이터를 렌더링하며, /jobs/[slug]/page.tsx는 실제 Prisma 쿼리를 수행함.

## Self-Check

- app/components/JobCard.tsx: FOUND
- app/components/CategoryFilter.tsx: FOUND
- app/jobs/[slug]/page.tsx: FOUND
- TypeScript --noEmit: PASSED
- CategoryFilter 'use client' 없음: CONFIRMED
- commit 7f8d977 (T02 CategoryFilter): FOUND
- commit bc2de52 (T01/T03): FOUND

## Self-Check: PASSED

---
*Phase: 02-public-catalog-grid-filter*
*Completed: 2026-05-17*
