# Phase 5: Keyword Search - Context

**Gathered:** 2026-05-20
**Status:** Ready for planning

<domain>
## Phase Boundary

홈(`/`)에 키워드 검색을 추가한다. 방문자가 검색 입력창에 한국어/영어 키워드를 입력하면 직업명과 기술 태그에 매칭되는 직업만 그리드에 표시된다. 검색어는 URL search param `?q=...`로 유지되고, 기존 카테고리 필터(`?category=...`)와 **AND**로 함께 동작한다. (CAT-03)

**범위 밖:** 검색어 자동완성/추천, 검색 히스토리, 설명 본문 전문 검색, 정렬 옵션, 페이지네이션, 분석/추적.

</domain>

<decisions>
## Implementation Decisions

### 검색 입력 방식 (Search Input)
- **D-01:** **입력 즉시 검색(디바운스)** — 사용자가 타이핑하면 디바운스 후 그리드가 자동 갱신된다. ROADMAP의 "debounced input" 태스크와 일치. 명시적 엔터/제출 버튼에 의존하지 않는다.
- **D-02:** 검색창은 **클라이언트 컴포넌트**(`'use client'`)로 구현한다 — `useRouter`(또는 `useSearchParams`)로 `?q=` URL param을 갱신한다. **이 프로젝트 최초의 클라이언트 컴포넌트**다 (Phase 1~4는 100% Server Component). 데이터 페칭과 그리드 렌더링은 기존대로 `app/page.tsx` Server Component에 유지 — 클라이언트 컴포넌트는 검색 입력창 한 곳으로 한정한다.
- **D-03:** URL 갱신은 history `replace`로 처리해 타이핑마다 뒤로가기 히스토리가 쌓이지 않게 한다.

### 검색 대상 범위 (Search Scope)
- **D-04:** 검색어는 **직업명(`title`) + 기술 태그(`requiredSkills`)** 두 필드에만 매칭한다. ROADMAP 성공기준 2와 정확히 일치.
- **D-05:** `summary`와 마크다운 `description` 본문은 검색 대상에서 **제외**한다. (페이즈 목표문이 "설명까지" 언급하나, locked 성공기준 2를 기준으로 직업명+기술태그로 확정.)
- **D-06:** 매칭은 **대소문자 무시(case-insensitive)** — 한국어/영어 모두. (SQLite의 case-insensitive 매칭 방식은 research/planning에서 검증.)

### 검색창 배치 (Search Bar Placement)
- **D-07:** 검색 입력창은 **카테고리 필터 칩 위**에 배치한다. 홈 화면 순서: 헤더 → **검색창** → 카테고리 칩 → 직업 그리드. 검색이 1차 탐색 수단으로 먼저 눈에 들어오고, 카테고리 칩은 보조 필터 역할.
- **D-08:** 검색창은 가로폭 넓은 단일 입력 필드. 375px 모바일~데스크탑 반응형 (Phase 2 FND-03 패턴 유지).

### 검색 + 카테고리 결합 (Combined Filtering — carried from Phase 2)
- **D-09:** 검색어와 카테고리는 **AND** 적용 (Phase 2 D-05). `app/page.tsx`의 Prisma `where`를 `isPublished` + (있으면) `category` + (있으면) `q` 매칭으로 확장한다.

### Claude's Discretion
- 디바운스 지연 시간 (예: ~250–350ms) — 플래너 재량
- 빈 상태 문구 — 현재 `app/page.tsx`의 카테고리 빈 상태("해당 카테고리에 직업이 없습니다.")를 검색 결과 없음 상황까지 자연스럽게 커버하도록 플래너가 처리. 검색어+카테고리가 함께 활성일 때의 문구 포함.
- 검색어 지우기(clear) affordance — 입력창 내 X 버튼 vs 별도 링크. ROADMAP 태스크 "clear affordance"는 포함하되 정확한 형태는 재량.
- 결과 개수 표시 여부 — 재량 (논의에서 선택 안 됨)
- 검색창 정확한 스타일·여백·아이콘 — 커스텀 Tailwind + CSS 변수 패턴 따라 자유롭게

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `REQUIREMENTS.md` — CAT-03 상세 요구사항 (키워드 검색)
- `ROADMAP.md` Phase 5 섹션 — Success criteria 3개 + Tasks (debounced input, q+category Prisma where, empty state, clear affordance)

### Prior phase context
- `phases/02-public-catalog-grid-filter/02-CONTEXT.md` — 검색+카테고리 AND 결정(D-05), URL search param 상태 관리(D-04), JobCard/그리드 구조
- `phases/03-job-detail-page/03-CONTEXT.md` — 커스텀 Tailwind + CSS 변수 패턴 (shadcn 미사용)

### Research
- `research/SUMMARY.md` — 스택 결정사항 (Next.js 16.2 App Router, React 19, Tailwind v4, Prisma)
- `research/PITFALLS.md` — Pitfall 14 (접근성 — 검색 입력 라벨링), Pitfall 5 (그리드 성능)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/page.tsx` (Phase 2) — 홈 Server Component. 현재 `searchParams: Promise<{ category?: string }>`를 받아 Prisma `job.findMany`로 쿼리. `?q=` 처리를 추가해야 한다. 카테고리 빈 상태 UI(line 44–51)가 이미 존재 — 검색 결과 없음 상황으로 확장.
- `app/components/CategoryFilter.tsx` (Phase 2) — `<Link>` 기반 순수 서버 컴포넌트. 검색창은 이와 별개의 신규 클라이언트 컴포넌트(`<SearchBar>`).
- `lib/db.ts` — Prisma singleton (`import { prisma } from "@/lib/db"`)
- `lib/utils.ts` — `parseJsonArray` 헬퍼 (`requiredSkills` JSON 배열 파싱)

### Established Patterns
- Server Component 공개 읽기 (`isPublished: true` 필터 필수)
- URL search param으로 상태 관리 (`?category=...` → `?q=...` 추가)
- Next.js 15+ async searchParams: `const { ... } = await searchParams`
- 커스텀 Tailwind v4 + CSS 변수 (`--line`, `--muted`, `#246b57`) — shadcn 미사용

### Schema / Query Notes
- `requiredSkills`는 SQLite에 JSON 인코딩된 문자열 배열로 저장됨 — 기술 태그 매칭 방식(raw 문자열 `contains` vs JS 측 필터)은 research/planning에서 검증 필요.
- SQLite에서 Prisma `mode: 'insensitive'`는 미지원 — case-insensitive 매칭 구현 방식은 research에서 결정.

### Integration Points
- Phase 2 → Phase 5: `app/page.tsx`의 Prisma `where`를 `q` 매칭으로 확장, 신규 `<SearchBar>` 컴포넌트를 카테고리 필터 위에 삽입.
- Phase 6 SSR/SSG: 검색 결과 페이지는 search param 의존이라 정적 생성 대상 아님 — Phase 6 작업 시 고려.

</code_context>

<specifics>
## Specific Ideas

- 홈 화면 최종 순서: 헤더 → 검색 입력창 → 카테고리 필터 칩 → 직업 그리드
- URL 예시: `/?q=파이썬`, `/?q=react&category=sw-engineer` (검색 + 카테고리 동시)
- 검색창은 한국어/영어 키워드 모두 입력 가능 — placeholder 문구는 한국어

</specifics>

<deferred>
## Deferred Ideas

- 설명(description) 본문 전문 검색 — Phase 5 범위 밖 (성공기준 2가 직업명+기술태그로 한정). 향후 검색 고도화 시 재검토 가능.
- 검색어 자동완성/추천, 검색 히스토리 — v1 범위 외
- 결과 정렬 옵션, 페이지네이션 — v1 범위 외
- 검색 분석/추적 — v2 Analytics

</deferred>

---

*Phase: 5-Keyword-Search*
*Context gathered: 2026-05-20*
