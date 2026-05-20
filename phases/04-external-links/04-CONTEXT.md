# Phase 4: External Links - Context

**Gathered:** 2026-05-20
**Status:** Ready for planning

<domain>
## Phase Boundary

직업 상세 페이지(`/jobs/[slug]`)에 외부 링크 섹션을 추가한다. 3가지 타입을 그룹으로 표시한다:
1. **채용 사이트** — 사람인, 원티드, 점핏, 프로그래머스 잡스
2. **LinkedIn 검색** — 직무 검색 결과로 이동하는 단일 링크
3. **관련 부트캠프** — 우아한테크코스, SSAFY, 네이버 부스트캠프, 카카오 테크 캠퍼스 등

모든 외부 링크는 새 탭으로 열리고 `rel="noopener noreferrer"`를 가진다.

**범위 밖:** 어드민의 링크 CRUD 관리(Phase 9), 링크 상태 자동 점검(v2 QUAL-01), 링크 클릭 추적(v2 Analytics).

</domain>

<decisions>
## Implementation Decisions

### LinkedIn 링크 (LinkedIn Link)
- **D-01:** LinkedIn 검색 링크는 **동적 생성** — `ExternalLinks` 컴포넌트가 런타임에 직업 데이터로 검색 URL을 조립한다. seed/JobLink에 LinkedIn 행을 저장하지 않는다. 모든 직업이 자동으로 일관된 LinkedIn 링크를 가져 누락이 없다.
- **D-02:** `Job` 스키마에 `searchKeyword` 필드(String, nullable)를 추가한다. LinkedIn 및 채용 사이트 검색 URL의 검색어로 사용한다.
- **D-03:** `searchKeyword`가 비어있으면(`null`) `job.title`(한국어 직업명)로 폴백한다. seed/admin이 특별히 지정한 직업만 커스텀 검색어를 쓰고 나머지는 자동 처리 — 누락 위험 없음.
- **D-04:** LinkedIn 링크 표시 라벨은 고정 문자열 **"LinkedIn 검색"**.
- **D-05:** 현재 `prisma/seed.ts`의 잘못 분류된 LinkedIn 행(type=`jobBoard`, 영어 키워드)을 제거한다. 예: "LinkedIn DevOps 검색", "LinkedIn ML Engineer 검색".

### 링크 소스 (Link Source)
- **D-06:** **채용 사이트 4개**(사람인, 원티드, 점핏, 프로그래머스 잡스)는 **공통 동적 생성** — 모든 직업에 4개 링크를 검색어 URL로 자동 조립한다. 성공기준 1의 4개 사이트를 전부 보장하며 직업별 누락이 없다. LinkedIn과 동일 패턴.
- **D-07:** 채용 사이트 4개의 검색 URL 검색어는 **D-02의 `searchKeyword` 필드를 공유**한다 (비면 `job.title` 폴백). LinkedIn + 채용 사이트 4개가 단일 필드를 함께 사용 — 스키마/admin 필드 1개만 추가.
- **D-08:** **부트캠프 링크는 직업별 큐레이션** — seed/`JobLink`의 `type=bootcamp` 행으로 직업별 지정. 부트캠프는 검색 URL이 없는 고정 기관이므로 동적 생성 불가. 해당 직업에 `bootcamp` 링크가 없으면 "관련 부트캠프" 헤딩과 섹션을 숨긴다 (성공기준 3 "where applicable").

### 섹션 위치 & 레이아웃 (Section Layout)
- **D-09:** 외부 링크 섹션은 상세 페이지의 **2-컬럼 영역 아래 full-width 섹션**으로 배치한다. 순서: 헤더 → 2-컬럼(본문 | sidebar) → **외부 링크** → 관련 직업.
- **D-10:** 3개 타입 그룹은 **타입별 헤딩 + 세로 스택**으로 구분한다 — "채용 사이트" / "LinkedIn" / "관련 부트캠프" 헤딩을 각각 달고 세로로 쌓는다. 임 타입(부트캠프)이 비면 해당 헤딩과 그룹을 숨긴다.
- **D-11:** 채용 사이트(4개) + LinkedIn(1개)은 항상 동적 생성되므로 외부 링크 섹션 전체가 비는 경우는 없다 — 섹션 단위 empty state 불필요.

### 링크 표시 형태 (Link Presentation)
- **D-12:** 각 링크는 **버튼/칩 형태**로 표시한다 — 테두리·배경이 있는 클릭 타깃. 모바일 친화적이며 그룹 내 래핑이 자연스럽다. 커스텀 Tailwind (shadcn 미사용).
- **D-13:** 각 링크에 **외부링크 아이콘(↗ SVG)**만 표시한다. 새 탭으로 열림을 알린다. 사이트 파비콘은 사용하지 않는다 — 외부 이미지 로드 의존/깨짐 위험 회피, Phase 1 SVG-only 결정과 일치.

### Claude's Discretion
- 채용 사이트 4개의 검색 URL 템플릿 상수의 위치 (컴포넌트 내 상수 vs 별도 파일) — 정확한 URL 패턴은 research/planning에서 검증
- 버튼/칩의 정확한 색상·여백·래핑 간격
- 외부링크 ↗ 아이콘의 정확한 SVG/크기/위치
- 섹션 헤딩 카피의 정확한 문구 및 타이포 (sidebar 헤딩 패턴 `text-xs uppercase` 재사용 여부)
- 부트캠프 큐레이션의 직업↔부트캠프 매핑 데이터 (seed에서 직업별로 지정)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `REQUIREMENTS.md` — LNK-01, LNK-02, LNK-03 상세 요구사항 (특히 LNK-02 "한국어 직업명을 검색어로 사용")
- `ROADMAP.md` Phase 4 섹션 — Success criteria 4개 + Tasks

### Prior phase context
- `phases/03-job-detail-page/03-CONTEXT.md` — 상세 페이지 2-컬럼 레이아웃(D-01), 커스텀 Tailwind/CSS 변수 배지 패턴, JobCard 재사용, "관련 직업" 섹션
- `phases/02-public-catalog-grid-filter/02-CONTEXT.md` — `parseJsonArray` 헬퍼, CSS 변수 패턴

### Research
- `research/SUMMARY.md` — 스택 결정사항 (Next.js 16.2, Tailwind v4, Prisma)
- `research/PITFALLS.md` — Pitfall 14 (접근성 — 외부 링크 새 탭 안내)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/jobs/[slug]/page.tsx` (Phase 3) — 외부 링크 섹션을 삽입할 상세 페이지. 현재 헤더 → 2-컬럼 div → "관련 직업" 섹션 순. 외부 링크 섹션을 2-컬럼 div와 "관련 직업" 섹션 사이에 끼운다.
- `lib/db.ts` — Prisma singleton (`import { prisma } from "@/lib/db"`)
- `lib/utils.ts` — `parseJsonArray` 헬퍼
- `app/globals.css` — CSS 변수: `--line`, `--muted`, `--panel`, `#246b57` (배지/버튼 스타일 일관성)
- `prisma/seed.ts` — `links` 배열은 `[type, label, url]` 튜플 형식. `await prisma.jobLink.createMany` 패턴 존재.

### Schema Changes Required
- `Job` 모델에 `searchKeyword String?` 필드 추가 — Prisma 마이그레이션 필요
- `prisma/seed.ts` 정리: type=`jobBoard`로 잘못 분류된 LinkedIn 행 제거, 부트캠프 행을 직업별로 큐레이션 정비, (선택) 일부 직업에 `searchKeyword` 지정
- 동적 생성으로 대체되므로 채용 사이트/LinkedIn 링크는 seed `JobLink` 행으로 저장하지 않음 — seed `links`에는 `bootcamp` 타입만 남긴다

### Established Patterns
- Server Component 공개 읽기 (`isPublished: true` 필터 필수)
- 상세 페이지 쿼리에 `include: { links: true }` 추가 필요 (현재 `category`만 include)
- Tailwind v4 반응형: `sm:`, `lg:` 브레이크포인트
- Tailwind + CSS 변수 컴포넌트 패턴 (shadcn 없음)

### Integration Points
- Phase 3 → Phase 4: Phase 3 상세 페이지에 `<ExternalLinks>` 섹션 추가
- Phase 9: 어드민이 `JobLink` 행(부트캠프)을 CRUD로 관리 — 동적 생성 링크(채용/LinkedIn)는 관리 대상 아님, `searchKeyword` 필드만 admin 폼에 노출
- Phase 6: 상세 페이지 SSR/SSG — 외부 링크는 정적 렌더 가능 (외부 fetch 없음)

</code_context>

<specifics>
## Specific Ideas

- 채용 사이트 검색 URL 패턴 예시 (research/planning에서 정확성 검증 필요):
  - 사람인: `https://www.saramin.co.kr/zf_user/search?searchword={검색어}`
  - 원티드: `https://www.wanted.co.kr/search?query={검색어}`
  - 점핏: `https://www.jumpit.co.kr/search?keyword={검색어}`
  - 프로그래머스 잡스: `https://career.programmers.co.kr/job?search={검색어}`
  - LinkedIn: `https://www.linkedin.com/jobs/search/?keywords={검색어}`
- 검색어는 `encodeURIComponent`로 URL 인코딩. `searchKeyword ?? job.title` 사용.
- 부트캠프 후보: 우아한테크코스, SSAFY, 네이버 부스트캠프, 카카오 테크 캠퍼스 — 직업/카테고리에 맞게 seed에서 직업별 지정.

</specifics>

<deferred>
## Deferred Ideas

- 어드민의 외부 링크 추가/수정/삭제 UI — Phase 9 (ADM-06)
- 외부 링크 상태 자동 점검 (주간 cron, 깨진 링크 표시) — v2 QUAL-01
- 외부 링크 클릭 추적 — v2 Analytics
- 사이트 파비콘 표시 — D-13에서 제외, 후속 UX 개선 시 재검토 가능

None remaining — discussion stayed within phase scope.

</deferred>

---

*Phase: 4-External-Links*
*Context gathered: 2026-05-20*
