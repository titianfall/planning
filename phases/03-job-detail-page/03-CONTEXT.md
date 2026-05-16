# Phase 3: Job Detail Page - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

`/jobs/[slug]` 개별 직업 상세 페이지를 구현한다. 직업 설명(마크다운), 연봉(3단계), 신입 채용 난이도(3단계 색상 배지), 필요 기술 태그, 외부 링크 섹션을 포함한다. 반응형(375px~), 서버 사이드 렌더링. 링크 클릭 동작은 Phase 4에서 완성하되, 이번 Phase에서 링크 섹션 UI를 마련한다.

</domain>

<decisions>
## Implementation Decisions

### 페이지 레이아웃 (Page Layout)
- **D-01:** 2-컬럼 레이아웃 — 좌측 main(직업 설명 마크다운 본문), 우측 sidebar(연봉·난이도·기술태그·링크). 데스크탑(1280px+) 기준 약 2:1 비율
- **D-02:** 헤더 영역(full-width, 컬럼 상단): 직업명(H1) + 카테고리 배지 + 연봉 범위 요약 1줄 + 예시 고용 회사
- **D-03:** 모바일(375px): sidebar가 본문 아래로 스택 — 순서: 헤더 → 본문 → sidebar

### 연봉 표시 형식 (Salary Display)
- **D-04:** 3-단계 연봉 표시: 신입/인턴/계약직, 1~3년차, 3~5년차 — Job 스키마에 `salaryEntry`, `salaryMid`, `salarySenior` 필드 추가 (각 min/max 쌍) — Phase 1 스키마와 불일치 시 마이그레이션 필요
- **D-05:** 연봉 출처 표시: "출처: [sourceUrl 링크텍스트] (asOfYear년 기준)" 형식으로 sidebar에 표시

### 신입 채용 난이도 표시 (Difficulty Display)
- **D-06:** 3-단계 난이도 배지: 활발(초록), 보통(노랑), 거의없음(빨강) — Job 스키마의 `hiringDifficulty` 필드 (enum: ACTIVE | MODERATE | RARE)
- **D-07:** shadcn/ui Badge 컴포넌트 + Tailwind 색상 variant (green/yellow/red)

### 마크다운 렌더링 (Markdown Rendering)
- **D-08:** react-markdown + rehype-sanitize 사용 — 허용 태그: H2, H3, bold, italic, 순서없는/있는 목록(ul, ol)
- **D-09:** 코드 블록, HTML 직접 삽입, 이미지 비허용 — rehype-sanitize allowlist로 차단
- **D-10:** 어드민(Phase 8)이 textarea에 마크다운 직접 입력 — 별도 WYSIWYG 에디터 없음

### 네비게이션 (Navigation)
- **D-11:** 페이지 상단에 "← 직업 목록" 뒤로가기 버튼 — Link href="/" (서버 네비게이션)
- **D-12:** 같은 카테고리 관련 직업 최대 3개 카드 — 페이지 하단 "관련 직업" 섹션, JobCard 컴포넌트 재사용 (Phase 2에서 정의)

### Claude's Discretion
- sidebar 내 섹션 구분선 및 간격
- 연봉 3단계 컴포넌트 내부 레이아웃 (테이블 vs. 카드 vs. 리스트)
- "관련 직업" 섹션 없을 때(같은 카테고리 직업 0개) empty state 처리

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/PROJECT.md` — Core value, requirements, key decisions
- `.planning/REQUIREMENTS.md` — DET-01~04, LNK-01~03 상세 요구사항
- `.planning/ROADMAP.md` Phase 3 — Success criteria

### Prior phase context
- `.planning/phases/02-public-catalog-grid-filter/02-CONTEXT.md` — Phase 2에서 정의한 JobCard 컴포넌트, Job 스키마 필드

### Research
- `.planning/research/SUMMARY.md` — 스택 결정사항
- `.planning/research/ARCHITECTURE.md` — 라우팅 구조 (/jobs/[slug]), Prisma 스키마
- `.planning/research/PITFALLS.md` — Pitfall 2 (salary misinformation), Pitfall 14 (접근성)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 2에서 구현될 JobCard 컴포넌트 — "관련 직업" 섹션에서 재사용
- Phase 1 Prisma 스키마 Job 모델 — slug, summary, requiredSkills, salaryMin/Max, is_published 기존 필드
- shadcn/ui Badge — 이미 설치됨

### Schema Changes Required
- salaryEntry, salaryMid, salarySenior 필드 추가 (기존 salaryMin/Max와 병행 or 대체)
- hiringDifficulty enum 필드 추가 (ACTIVE | MODERATE | RARE)
- Prisma migration 필요 — seed 데이터도 업데이트

### Established Patterns
- Server Component로 퍼블릭 읽기 경로 (is_published = true 필터 필수)
- generateMetadata export — 각 직업 페이지 SEO 메타데이터 (Phase 3에서 구현)
- next/font Pretendard / Noto Sans KR — Phase 1에서 설정됨

### Integration Points
- Phase 2 -> Phase 3: 카드 클릭 -> /jobs/[slug] (CAT-04)
- Phase 4: 외부 링크 섹션 UI가 이미 있어야 Phase 4에서 링크 연결 완성 가능
- Phase 6: generateStaticParams로 모든 slug 정적 생성

</code_context>

<specifics>
## Specific Ideas

- 연봉 컴포넌트: "신입/인턴 3,500~4,500만원 | 1~3년차 4,500~6,500만원 | 3~5년차 6,500~9,000만원" 형식
- 난이도 배지: variant="outline" + Tailwind inline 색상 클래스
- 마크다운 렌더링: prose Tailwind 클래스 (@tailwindcss/typography 플러그인) 고려 — Claude 재량

</specifics>

<deferred>
## Deferred Ideas

- 즐겨찾기 / 저장 기능 — 공개 사용자 계정 없으므로 v1 범위 외
- 연봉 그래프 시각화 — v2 UX 개선 단계에서 검토
- OG 이미지 자동 생성 (/api/og) — Phase 6 SEO 강화 시 검토
- 외부 링크 클릭 추적 — v2 Analytics 단계

</deferred>

---

*Phase: 3-Job-Detail-Page*
*Context gathered: 2026-05-14*
