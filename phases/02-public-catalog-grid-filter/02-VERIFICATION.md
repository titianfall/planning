---
phase: 02-public-catalog-grid-filter
verified: 2026-05-17T00:00:00Z
status: passed
score: 4/4 must-haves verified
overrides_applied: 1
overrides:
  - must_have: "Visiting `/` shows a responsive card grid of all published jobs grouped by the 4 categories (SW엔지니어, 데이터/AI, 보안/클라우드, 모바일/게임)"
    reason: "Phase 1 커밋 b189d55에서 보안/클라우드·모바일/게임 카테고리를 영구적으로 제거하기로 결정. ROADMAP.md 성공 기준 1번을 2개 카테고리 기준으로 업데이트하여 구현과 문서를 일치시킴."
    accepted_by: "qkrwogh7366@gmail.com"
    accepted_at: "2026-05-17T00:00:00Z"
---

# Phase 2: Public Catalog (Grid + Filter) 검증 보고서

**Phase Goal:** 익명 방문자가 홈페이지에서 모든 직업을 카드 형태로 보고, 카테고리로 필터링할 수 있다 — 모바일과 데스크탑 모두에서.
**Verified:** 2026-05-17
**Status:** PASS
**Re-verification:** No — 초기 검증 (Option A 결정 후 최종 처리)

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `/` 방문 시 발행된 직업들이 카테고리 카드 그리드로 표시된다 (현재 2개 카테고리: SW엔지니어, 데이터/AI) | VERIFIED (override) | 그리드 구현 완전. Phase 1 커밋 b189d55에서 보안/클라우드·모바일/게임 제거가 영구 결정으로 확정. ROADMAP 성공 기준 1번 업데이트 완료. |
| 2 | 카테고리 칩 클릭 시 해당 카테고리 직업만 그리드에 표시되고 URL이 `/?category=...`로 업데이트된다 | VERIFIED | `CategoryFilter.tsx` L24: `href={\`/?category=${cat.slug}\`}` — Link 기반 URL 변경. `page.tsx` L11: `await searchParams`로 서버사이드 Prisma 필터링. |
| 3 | 직업 카드 클릭 시 `/jobs/[slug]` 상세 페이지로 이동한다 | VERIFIED | `JobCard.tsx` L47: `<Link href={\`/jobs/${job.slug}\`}>`. `app/jobs/[slug]/page.tsx`는 실제 Prisma `findUnique({ where: { slug, isPublished: true } })` + `notFound()` 구현됨. |
| 4 | 375px·768px·1280px에서 수평 스크롤 없이 올바르게 렌더링된다 | VERIFIED | `page.tsx` L39: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` (모바일 1열/태블릿 2열/데스크탑 3열). `globals.css` L16: `html { min-width: 320px }` 수평 스크롤 방지. |

**Score:** 4/4 truths verified (기준 1번은 ROADMAP 업데이트로 override 처리)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/page.tsx` | 홈 Server Component — Prisma 쿼리 + 카테고리 필터 + 반응형 그리드 | VERIFIED | 56줄. `isPublished: true` 필터 L16. `Promise.all` 병렬 쿼리 L13. `sm:grid-cols-2 lg:grid-cols-3` L39. |
| `app/components/JobCard.tsx` | JobCard — job 데이터 렌더링, `/jobs/[slug]` 링크 | VERIFIED | 84줄. 실제 job prop 렌더링. `<Link href={\`/jobs/${job.slug}\`}>` L47. parseJsonArray 로컬 정의 L18-25. |
| `app/components/CategoryFilter.tsx` | CategoryFilter — Server Component, URL 필터 칩 | VERIFIED | 36줄. `'use client'` 없음 (Server Component). `href="/"` 전체 링크 L12. `href={\`/?category=${cat.slug}\`}` L24. 활성/비활성 스타일 구분 L14-L28. |
| `app/jobs/[slug]/page.tsx` | 직업 상세 라우트 — Prisma 조회 + notFound() | VERIFIED | Phase 3 사전 구현(bc2de52). 125줄. 실제 Prisma `findUnique` L26. `if (!job) notFound()` L31. |
| `prisma/schema.prisma` | Category, Job, JobLink 모델 | VERIFIED | Category L10-19, Job L21-53 (isPublished, slug, hiringDifficulty 포함), JobLink L55-67. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/page.tsx` | `prisma.job.findMany` | Prisma Client import | WIRED | `import { prisma } from "@/lib/db"` L2. `isPublished: true` 필터 + `include: { category: true }` L15-23. |
| `app/page.tsx` | `CategoryFilter` | props 전달 | WIRED | `<CategoryFilter categories={categories} activeSlug={activeCategory} />` L36. |
| `app/page.tsx` | `JobCard` | map 렌더링 | WIRED | `jobs.map((job) => <JobCard key={job.id} job={job} />)` L41. |
| `CategoryFilter` | URL `/?category=` | Next.js Link | WIRED | `href={\`/?category=${cat.slug}\`}` L24. 서버 컴포넌트 — 클라이언트 상태 없음. |
| `JobCard` | `/jobs/[slug]` | Next.js Link | WIRED | `<Link href={\`/jobs/${job.slug}\`}>` L47. |
| `app/jobs/[slug]/page.tsx` | `prisma.job.findUnique` | Prisma Client | WIRED | `where: { slug, isPublished: true }` L27. `if (!job) notFound()` L31. |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| `app/page.tsx` | `jobs` | `prisma.job.findMany` L15 | isPublished 필터 + category include로 DB에서 실제 데이터 조회 | FLOWING |
| `app/page.tsx` | `categories` | `prisma.category.findMany` L14 | sortOrder 정렬로 DB에서 실제 카테고리 조회 | FLOWING |
| `app/components/JobCard.tsx` | `job` prop | page.tsx에서 jobs 배열 맵 | DB 쿼리 결과 직접 전달 | FLOWING |
| `app/components/CategoryFilter.tsx` | `categories` prop | page.tsx에서 전달 | DB 쿼리 결과 직접 전달 | FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| TypeScript 오류 없음 | `node_modules/.bin/tsc --noEmit` | 출력 없음 (오류 0건) | PASS |
| JobCard가 실제 Prisma 결과 렌더링 | grep 분석 | props.job.title, .summary, .skills, .hiringDifficulty 등 실제 필드 렌더링 확인 | PASS |
| isPublished 필터 적용 | grep 분석 | `page.tsx` L16: `isPublished: true` 조건 확인 | PASS |
| 빈 상태 UI 존재 | 코드 분석 | `page.tsx` L44-51: `jobs.length === 0` 분기로 "해당 카테고리에 직업이 없습니다." + "전체 보기" Link | PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| CAT-01 | 02-01 | 직업 카탈로그 카드 그리드 표시 | SATISFIED | `app/page.tsx` 그리드 구현 + Prisma 쿼리 |
| CAT-02 | 02-03 | 카테고리 필터링 | SATISFIED | `CategoryFilter` + URL searchParams 서버사이드 필터 |
| CAT-04 | 02-02 | 카드 클릭 → 상세 페이지 | SATISFIED | `JobCard` `<Link href={/jobs/${slug}}>` |
| FND-03 | 02-03 | 반응형 레이아웃 | SATISFIED | `sm:grid-cols-2 lg:grid-cols-3` + `min-width:320px` |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|---------|--------|
| `app/components/JobCard.tsx` | 18-25 | `parseJsonArray` 로컬 정의 (lib/utils.ts에도 별도 정의됨) | Info | 중복 코드. Phase 3 Plan 03-01이 이 중복을 제거하도록 계획됨. Phase 2 기능 동작에는 영향 없음. |

데이터 관련 안티패턴:
- `return []`, `return {}`, `return null` — 없음 (실제 Prisma 쿼리 사용)
- TBD/FIXME/XXX 마커 — 없음
- Placeholder 텍스트 — 없음 (실제 한국어 콘텐츠)

---

## 기술 구현 요약

Phase 2의 **기술 구현은 완전하고 올바르게 동작**합니다.

### 검증된 항목:
- `app/page.tsx`: Next.js 15 `searchParams: Promise<{category?: string}>` 패턴 + `await searchParams` + `Promise.all` 병렬 Prisma 쿼리 + `isPublished: true` 필터 + 반응형 그리드
- `CategoryFilter.tsx`: Server Component (use client 없음) + `href="/?category={slug}"` Link 기반 URL 필터 + 활성/비활성 스타일 구분
- `JobCard.tsx`: 실제 DB 데이터 렌더링 + `<Link href="/jobs/{slug}">` 카드 전체 클릭 지원
- `app/jobs/[slug]/page.tsx`: 실제 Prisma `findUnique` + `notFound()` (Phase 3 사전 구현, 성공 기준 3번 충족)
- Tailwind 반응형: `sm:grid-cols-2 lg:grid-cols-3` (1열/2열/3열) + `min-width:320px`
- TypeScript: `npx tsc --noEmit` 오류 0건

### 범위 결정 처리:
ROADMAP.md 성공 기준 1번을 "2개 카테고리 (SW엔지니어, 데이터/AI)" 기준으로 업데이트 완료 (Option A 채택). Phase 1 커밋 b189d55의 카테고리 제거가 영구 결정으로 확정됨. 구현과 문서가 일치하므로 Phase 2는 PASS.

---

_Verified: 2026-05-17_
_Verifier: Claude (gsd-verifier)_
_Final decision: Option A adopted by project owner (qkrwogh7366@gmail.com) on 2026-05-17_
