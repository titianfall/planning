# Phase 7: Admin Authentication - Context

**Gathered:** 2026-05-20
**Status:** Descoped — 페이즈 폐기. 이대로 plan/research 하지 말 것.

<domain>
## Phase Boundary

**이 페이즈는 원래 범위(Supabase 매직 링크 인증)가 폐기되었다.**

원래 Phase 7은 "허용된 단일 관리자 이메일이 Supabase 매직 링크로 로그인해 게이트된
`/admin/*`에 접근"(ADM-01)하는 인증 배관이었다. discuss-phase 논의에서 사용자가 다음을 결정:

- 이 사이트는 **로컬 전용**으로 운영·종료한다. Vercel 배포·Supabase 도입 없음.
- 어드민 영역에 **인증 게이트를 두지 않는다** — 로컬 단일 사용자 도구이므로 `/admin/*`은 그냥 열린다.

결과적으로 Phase 7에는 고유한 구현 작업이 없다. 어드민 셸(`/admin` 라우트 +
`app/admin/layout.tsx`)은 후속 어드민 CRUD 페이즈가 직접 만든다.

**산출물:** 코드 없음. 이 CONTEXT.md는 페이즈 폐기 결정의 기록이다.

</domain>

<decisions>
## Implementation Decisions

### 인증 방식
- **D-01:** `/admin/*`에 인증 게이트를 두지 않는다. Supabase Auth, 매직 링크,
  `middleware.ts`, `requireAdmin()` 가드, `ADMIN_EMAIL` 허용목록 — 전부 구현하지 않는다.
  사이트가 로컬 단일 사용자 도구이므로 불필요.

### 페이즈 처리
- **D-02:** Phase 7은 스킵/병합한다. 고유 작업이 없으므로 ROADMAP에서 제거하거나 후속
  어드민 CRUD 페이즈에 병합한다. `/admin` 라우트와 `app/admin/layout.tsx` 어드민 셸은
  어드민 CRUD 페이즈가 직접 만든다.

### 배포 / 인프라
- **D-03:** 프로젝트는 로컬 전용으로 종료한다. Vercel 배포·Supabase Postgres 이전·
  Supabase Auth 도입 없음. DB는 계속 Prisma + SQLite. ROADMAP Phase 9의 "Production
  Deploy" 부분은 제거하고 Admin Link Management(ADM-06)만 남긴다.

### 요구사항 영향
- **D-04:** ADM-01("관리자가 매직링크 이메일 로그인으로 어드민 영역에 접근")은
  범위 제외(Out of Scope)로 이동한다. `research/SUMMARY.md`의 "Decisions Already Made"
  중 Supabase Auth·Vercel 항목은 이 결정으로 반전된다.

### Claude's Discretion
해당 없음 — 폐기 결정이라 구현 재량 영역이 없다.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 폐기된 페이즈 정의 (참고용)
- `ROADMAP.md` Phase 7 섹션 — 원래 정의(Supabase 매직 링크, success criteria 4개).
  이 결정으로 무효.
- `REQUIREMENTS.md` ADM-01 — 범위 제외로 이동 필요.

### 영향받는 문서 (정리 필요 — 후속 `/gsd:phase` 및 수동 편집)
- `ROADMAP.md` — Phase 7 제거/병합, Phase 9의 "Production Deploy" 태스크·성공기준 제거.
- `REQUIREMENTS.md` — ADM-01 → Out of Scope. 배포 관련 성공기준 정리.
- `PROJECT.md` — Key Decisions / Accumulated Context의 Supabase Auth·Vercel 항목 반전.
- `research/SUMMARY.md` — "Decisions Already Made"의 Supabase Auth·Vercel 항목이
  stale가 됨 (이력 문서이므로 후순위).

No external specs — 결정 사항은 위 decisions에 모두 담겨 있다.

</canonical_refs>

<code_context>
## Existing Code Insights

### 미구현 / 미설치 (의도적)
- `middleware.ts` 없음 — 추가하지 않는다.
- `@supabase/ssr` 등 Supabase 패키지 미설치 — 설치하지 않는다.
- `app/admin/` 디렉터리 없음 — 어드민 CRUD 페이즈가 생성한다.

### 기존 자산
- `app/layout.tsx` — `lang="ko-KR"` 루트 레이아웃. 어드민 셸은 별도
  `app/admin/layout.tsx`로 후속 페이즈가 추가한다.
- `phases/06-ssr-ssg-seo/06-CONTEXT.md` D-09 — `robots.ts`가 `/admin`·`/auth`를
  disallow 선반영하기로 했다. 인증을 안 해도 `/admin` disallow는 그대로 둬도 무해
  (어드민 페이지 검색 색인 방지). `/auth` 경로는 더 이상 생기지 않으므로 robots에서
  빼도 된다 — Phase 6 plan/실행 또는 회고 재량.

</code_context>

<specifics>
## Specific Ideas

논의에서 합의된 ROADMAP 수술 방향 (후속 `/gsd:phase` 작업용):
- Phase 7 제거(또는 어드민 CRUD 페이즈에 병합).
- 어드민 대시보드 & Job CRUD 페이즈(현 Phase 8)는 **인증 없는 로컬 CRUD**로 유지하되
  `/admin` 라우트 + `app/admin/layout.tsx` 셸 생성을 포함한다.
- 어드민 링크 관리 페이즈(현 Phase 9)는 "Admin Link Management"(ADM-06)만 남기고
  "Production Deploy"를 제거한다.

병합 후 예상 로드맵: Phase 1–6 유지 → Admin Dashboard & Job CRUD (인증 없음, `/admin`
셸 포함) → Admin Link Management (ADM-06).

</specifics>

<deferred>
## Deferred Ideas

- 어드민 인증(Supabase 매직 링크 + 단일 이메일 허용목록) — 프로젝트가 향후 공개
  배포로 전환될 경우에만 필요. 현재 "로컬 전용 종료" 결정 하에서는 불필요. 배포를
  다시 검토하게 되면 이 페이즈 정의를 복원할 것.
- Vercel 배포(Seoul `icn1`) + Supabase Postgres 이전 — 동일하게 배포 전환 시 재검토.

</deferred>

---

*Phase: 7-Admin-Authentication*
*Context gathered: 2026-05-20*
