# Phase 3: Job Detail Page - Context

**Gathered:** 2026-05-17
**Status:** Ready for planning

<domain>
## Phase Boundary

`/jobs/[slug]` 개별 직업 상세 페이지를 구현한다. 직업 설명(마크다운), 연봉(신입/경력 2단계), 신입 채용 난이도(3단계 색상 배지), 필요 기술 태그, 관련 직업 섹션을 포함한다.

**외부 링크 섹션은 Phase 4에서 전담 구현 — Phase 3 범위 밖.**

</domain>

<decisions>
## Implementation Decisions

### 페이지 레이아웃 (Page Layout)
- **D-01:** 2-컬럼 레이아웃 — 좌측 main(직업 설명 마크다운 본문), 우측 sidebar(연봉·난이도·기술태그). 데스크탑(1280px+) 약 2:1 비율
- **D-02:** 헤더 영역(full-width, 컬럼 상단): 직업명(H1) + 카테고리 배지 + 연봉 1줄 요약 + 예시 고용 회사
- **D-03:** 모바일(375px): sidebar가 본문 아래 스택 — 순서: 헤더 → 본문 → sidebar

### 연봉 표시 형식 (Salary Display)
- **D-04:** 2단계 연봉 표시: 신입(`salaryEntryMin`/`salaryEntryMax`) + 경력(`salarySeniorMin`/`salarySeniorMax`). 현재 Prisma 스키마 그대로 사용, 스키마 마이그레이션 불필요. null 필드는 해당 행 비표시.
- **D-05:** 연봉 출처 표시: "출처: [salarySourceUrl 링크텍스트] (salaryAsOfYear년 기준)" 형식으로 sidebar 하단에 표시

### 신입 채용 난이도 표시 (Difficulty Display)
- **D-06:** `entryDifficulty` → `hiringDifficulty`로 필드명 변경. Prisma 마이그레이션 + seed.ts 업데이트 필요. 값은 기존 그대로 유지: "활발" | "보통" | "거의 없음"
- **D-07:** 커스텀 Tailwind 배지 컴포넌트 (shadcn/ui 미설치 — 기존 CSS 변수 패턴과 일관). 색상 매핑:
  - "활발" → bg `#edf6f1`, text `#246b57` (초록)
  - "보통" → bg `#fef8ec`, text `#9c6a00` (노랑)
  - "거의 없음" → bg `#f2f2f2`, text `#555` (회색)

### 마크다운 렌더링 (Markdown Rendering)
- **D-08:** `react-markdown` + `rehype-sanitize` 사용. package.json에 없으므로 설치 필요: `npm install react-markdown rehype-sanitize`
- **D-09:** 허용 요소: H2, H3, bold(`**`), italic(`*`), 순서없는/있는 목록(ul, ol), 인라인 코드(`` ` ` ``). 코드블록(` ``` `) 차단. rehype-sanitize allowlist로 제한.
- **D-10:** Phase 8 어드민 textarea에 마크다운 직접 입력 — 별도 WYSIWYG 에디터 없음

### 네비게이션 (Navigation)
- **D-11:** 페이지 상단 "← 직업 목록" 버튼 — `<Link href="/">` 서버 네비게이션
- **D-12:** 하단 "관련 직업" 섹션: 같은 카테고리에서 현재 직업 제외 최대 3개, Phase 2의 `JobCard` 컴포넌트 재사용

### Claude's Discretion
- sidebar 내 섹션 구분선 및 여백
- 연봉 2단계 컴포넌트 내부 레이아웃 (두 행 vs. 테이블 vs. 리스트)
- "관련 직업" 섹션 0개일 때 empty state 처리 (전체 섹션 숨기기 vs. 메시지 표시)
- 인라인 코드 스타일링 (배경색, 폰트)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `REQUIREMENTS.md` — DET-01, DET-02, DET-03, DET-04 상세 요구사항
- `ROADMAP.md` Phase 3 section — Success criteria 4개

### Prior phase context
- `phases/02-public-catalog-grid-filter/02-CONTEXT.md` — Phase 2에서 정의한 JobCard 컴포넌트, exampleCompanies 필드, CSS 변수 패턴
- `phases/02-public-catalog-grid-filter/02-01-PLAN.md` — exampleCompanies 스키마 변경 및 hiringDifficulty 마이그레이션 타이밍 확인

### Research
- `research/SUMMARY.md` — 스택 결정사항 (Next.js 16.2, Tailwind v4, Prisma)
- `research/PITFALLS.md` — Pitfall 2 (salary misinformation), Pitfall 14 (접근성)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/components/JobCard.tsx` (Phase 2 구현) — "관련 직업" 섹션에서 재사용
- `lib/db.ts` — Prisma singleton (`import { prisma } from "@/lib/db"`)
- `app/globals.css` — CSS 변수: `--line`, `--muted`, `--panel`, `--background`, `--foreground`, `#246b57`

### Schema Changes Required
- `entryDifficulty` → `hiringDifficulty` 필드명 변경 (Prisma migrate + seed.ts 키 변경)
- 값 변경 없음 ("활발"/"보통"/"거의 없음" 그대로)
- app/page.tsx 등 `entryDifficulty` 참조 코드 일괄 변경 필요

### Established Patterns
- Server Component 퍼블릭 읽기 (`isPublished: true` 필터 필수)
- Next.js 15+ async params: `const { slug } = await params`
- Tailwind v4 반응형: `sm:`, `lg:` 브레이크포인트
- Tailwind + CSS 변수 배지 패턴 (shadcn 없음)
- `parseJsonArray(value: string): string[]` 헬퍼 — Phase 2 JobCard에서 정의됨 (동일 패턴 재사용)

### Integration Points
- Phase 2 → Phase 3: Phase 2의 `/jobs/[slug]` route stub을 이 Phase에서 완전 구현으로 교체
- Phase 4: 외부 링크 섹션을 Phase 3 상세 페이지에 추가
- Phase 6: `generateStaticParams` + `generateMetadata` 추가 (SEO)

</code_context>

<specifics>
## Specific Ideas

- 연봉 표시 예시: "신입 3,200~5,000만원" / "경력 6,000~10,000만원" (KRW toLocaleString)
- hiringDifficulty 배지는 `<SalaryBlock>`, `<SkillTags>`와 함께 sidebar에 위치
- `generateMetadata` export로 per-job SEO title/description 설정 (Phase 6 전 미리 준비 가능)

</specifics>

<deferred>
## Deferred Ideas

- 외부 링크 섹션 (채용 사이트, LinkedIn, 부트캠프) — Phase 4 (LNK-01~03)
- 즐겨찾기 / 저장 기능 — v1 범위 외 (공개 사용자 계정 없음)
- 연봉 그래프 시각화 — v2 UX
- OG 이미지 자동 생성 (`/api/og`) — Phase 6 SEO 강화 시
- 외부 링크 클릭 추적 — v2 Analytics

</deferred>

---

*Phase: 3-Job-Detail-Page*
*Context updated: 2026-05-17 (rebased on actual codebase — shadcn 없음, 2단계 연봉, hiringDifficulty 마이그레이션, 외부 링크 Phase 4로)*
