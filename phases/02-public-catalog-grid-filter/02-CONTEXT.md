# Phase 2: Public Catalog (Grid + Filter) - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

홈페이지에서 발행된 직업들을 카드 그리드로 탐색하고, 카테고리 필 칩으로 필터링하며, 카드를 클릭하면 상세 페이지로 이동하는 공개 카탈로그 페이지를 구현한다. 반응형(375px~)으로 동작한다. 검색은 Phase 5에서 구현 — 이 페이지에 검색 입력창 자리(stub)만 둘 수 있다.

</domain>

<decisions>
## Implementation Decisions

### 카드 콘텐츠 (Card Content)
- **D-01:** 각 직업 카드에 표시할 정보: 직업명(title_ko), 한 줄 요약(summary), 예시 고용 회사명(예: 네이버, 카카오 등 — Job 스키마의 별도 필드나 seed 데이터로 표현), 주요 기술 태그 2-3개(requiredSkills 배열 앞 2-3개), 연봉 미리보기(salaryMin~salaryMax 범위, 신입 기준 KRW)
- **D-02:** 카드 클릭 → `/jobs/[slug]` 상세 페이지로 이동 (CAT-04)

### 카테고리 필터 UX
- **D-03:** 화면 상단에 **필 칩(pill chip)** 스타일 카테고리 필터 — "전체 | SW엔지니어 | 데이터/AI | 보안/클라우드 | 모바일/게임" (한 번에 하나만 선택)
- **D-04:** 선택된 카테고리는 URL search param (`/?category=sw-engineer`)으로 유지 — Server Component에서 서버사이드 필터링
- **D-05:** 검색과 카테고리 필터를 함께 사용 시 **AND 적용** — 카테고리로 먼저 좁히고 검색어로 추가 필터링 (Phase 5에서 검색 구현 시 이 동작 사용)

### 그리드 레이아웃
- **D-06:** 반응형 컬럼 — 모바일(375px): 1열, 태블릿(768px): 2열, 데스크탑(1280px+): 3열
- **D-07:** shadcn/ui `Card` 컴포넌트 기반, Tailwind v4 그리드

### Claude's Discretion
- 카드 정확한 내부 레이아웃(이미지 위치, 태그 색상 등) — shadcn/ui Card 패턴 따라 자유롭게
- 필 칩 비활성/활성 상태 시각 처리 — Tailwind로 자유롭게

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/PROJECT.md` — Core value, requirements, key decisions
- `.planning/REQUIREMENTS.md` — CAT-01, CAT-02, CAT-04, FND-03 상세 요구사항
- `.planning/ROADMAP.md` Phase 2 — Success criteria (4개)

### Research
- `.planning/research/SUMMARY.md` — 스택 결정사항 (Next.js 16.2, Tailwind v4, shadcn/ui, Prisma)
- `.planning/research/ARCHITECTURE.md` — 퍼블릭 읽기 경로 패턴, 라우팅 구조 (`/?category=:slug`)
- `.planning/research/FEATURES.md` — 카드 그리드 복잡도, 모바일 반응형 중요성, 한국어 폰트

### Pitfalls
- `.planning/research/PITFALLS.md` — Pitfall 5 (카드 그리드 성능), Pitfall 13 (모바일 후순위 처리), Pitfall 14 (접근성)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 1에서 구축된 `Category`, `Job`, `JobLink` Prisma 스키마 — `job.summary`, `job.requiredSkills`, `job.salaryMin/Max`, `job.slug` 필드 사용
- Next.js App Router `app/page.tsx` Server Component — Prisma로 직업 목록 쿼리
- shadcn/ui `Card` 컴포넌트 — 이미 설치됨

### Established Patterns
- Server Component로 퍼블릭 읽기 경로 (`is_published = true` 필터 필수)
- URL search param으로 상태 관리 (`/?category=data-ai`)
- `next/font` Pretendard / Noto Sans KR — 이미 Phase 1에서 설정됨

### Integration Points
- `app/page.tsx` → `/jobs/[slug]` 링크 (Phase 3에서 상세 페이지 구현)
- 카테고리 필터 → Phase 5 검색과 AND 조합 예정 (URL param `?q=` 추가)
- Phase 6 SSR/SSG에서 `generateStaticParams`로 카탈로그 페이지 정적 생성

</code_context>

<specifics>
## Specific Ideas

- 카드 예시 고용 회사: "네이버, 카카오, 쿠팡" 등 실명 텍스트로 표시 — Job 스키마에 `exampleCompanies: String[]` 필드 추가 또는 seed 데이터에 포함
- 연봉 미리보기: "3,500~6,500만원" 형식, 신입 기준
- 필터 칩: "전체" 선택 시 URL에서 category param 제거 (`/?` → `/`)

</specifics>

<deferred>
## Deferred Ideas

- 빈 카테고리 상태 처리 — Phase 2 범위에 포함되나 별도로 논의하지 않음 (플래너가 자유롭게 구현)
- 검색 입력창 자리(stub) — Phase 5에서 구현, 이 페이지에 placeholder로만 표시 가능
- 카드 hover 애니메이션 / 즐겨찾기 버튼 — 범위 외, 후속 UX 개선 시 검토

</deferred>

---

*Phase: 2-Public-Catalog-Grid-Filter*
*Context gathered: 2026-05-14*
