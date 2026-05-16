# Next Work Handoff: CS Career Compass Phase 2

**Updated:** 2026-05-17
**Current phase:** Phase 2 - Public Catalog (Grid + Filter)
**Next session goal:** Phase 2 PLAN.md 생성 → 실행

---

## Phase 1 완료 상태

Phase 1 (Local Foundation & Data Schema)은 실질적으로 완료됐다.

- Docker 환경 구동 성공 (`docker compose up` 정상)
  - CRLF 이슈 수정: `compose.yaml` command를 `sed -i 's/\r//g'` 선처리로 해결
- Prisma migrate + seed + Next dev 서버 `0.0.0.0:3000` 기동 확인
- **카테고리 수정:** 보안/클라우드, 모바일/게임 제거 → **SW엔지니어 + 데이터/AI 2개 카테고리 유지**
  - 각 카테고리별 직군 3개씩, 총 6개 직군 유지
- 커밋 완료: `b189d55` — phase 1: 보안/클라우드·모바일/게임 카테고리 제거, Docker CRLF 수정

### Phase 1에서 변경된 데이터 구조 (Phase 2 플래너가 알아야 할 사항)

ROADMAP.md와 REQUIREMENTS.md의 CAT-01은 "4개 카테고리"를 명시하고 있으나, 실제 DB는 2개 카테고리(SW엔지니어, 데이터/AI)다. 플래너는 카테고리 수를 하드코딩하지 말고 DB에서 동적으로 읽어야 한다.

---

## Phase 2 플래닝 준비 상태

| 항목 | 상태 |
|------|------|
| CONTEXT.md | ✓ 존재 (`phases/02-public-catalog-grid-filter/02-CONTEXT.md`) |
| RESEARCH.md | ✗ 없음 (기존 `research/` 디렉토리 파일로 대체 가능) |
| UI-SPEC.md | ✗ 없음 |
| PLAN.md | ✗ 없음 |

---

## Phase 2 목표 및 요구사항

**Goal:** 익명 방문자가 홈페이지에서 모든 직업을 카드 그리드로 보고, 카테고리 필터로 좁혀보고, 카드 클릭으로 상세 페이지로 이동할 수 있어야 한다. 모바일/데스크탑 반응형.

**Requirements:** CAT-01, CAT-02, CAT-04, FND-03

### 성공 기준 (ROADMAP.md Phase 2)

1. `/`에서 발행된 직업이 카드 그리드로 표시됨 (카테고리별)
2. 카테고리 칩 클릭 → 해당 카테고리 직업만 표시 + URL `/?category=...` 업데이트
3. 직업 카드 클릭 → `/jobs/[slug]`로 이동
4. 375px / 768px / 1280px+ 에서 올바르게 렌더링 (수평 스크롤 없음)

---

## CONTEXT.md 핵심 결정사항 요약

(전체 내용: `phases/02-public-catalog-grid-filter/02-CONTEXT.md`)

### 카드 콘텐츠 (D-01, D-02)
- 직업명, 한 줄 요약, 예시 고용 회사명, 주요 기술 태그 2-3개, 연봉 미리보기(신입 기준)
- 카드 클릭 → `/jobs/[slug]`

### 카테고리 필터 UX (D-03, D-04, D-05)
- 화면 상단 **필 칩(pill chip)** 스타일: "전체 | SW엔지니어 | 데이터/AI"
- 한 번에 하나만 선택, URL search param `/?category=sw-engineer`
- Phase 5 검색과 AND 조합 예정

### 그리드 레이아웃 (D-06, D-07)
- 모바일(375px): 1열 / 태블릿(768px): 2열 / 데스크탑(1280px+): 3열
- shadcn/ui `Card` 컴포넌트 + Tailwind v4 그리드

### Specifics
- 연봉 미리보기 형식: "3,500~6,500만원" (신입 기준 KRW)
- "전체" 선택 시 URL에서 category param 제거
- 예시 고용 회사: "네이버, 카카오, 쿠팡" 등 — `exampleCompanies` 필드 추가 또는 seed에 포함

---

## 현재 코드 상태 (플래너가 알아야 할 사항)

### 핵심 파일

| 파일 | 내용 |
|------|------|
| `app/page.tsx` | Phase 1 smoke page — Prisma로 category/job 쿼리, 카드 형태 렌더링 (Phase 2에서 리빌드) |
| `prisma/schema.prisma` | Category, Job, JobLink 모델 정의됨 |
| `lib/db.ts` | Prisma client singleton |
| `app/globals.css` | Tailwind v4 CSS |
| `app/layout.tsx` | 베이스 레이아웃 |

### 스키마 주의사항

현재 Prisma 스키마에 `Job.exampleCompanies` 필드는 **없다**. D-01의 "예시 고용 회사명" 표시를 위해:
- 옵션 A: `Job` 스키마에 `exampleCompanies String` 필드 추가 (JSON 배열로 저장) + migration + seed 업데이트
- 옵션 B: 이 Phase에서는 고용 회사 미표시, Phase 3 이후로 defer

플래너가 선택 → 스키마 변경 시 migration task 포함 필요.

### 기존 research/ 파일 (리서치 대체)

- `research/ARCHITECTURE.md` — 라우팅 구조, 퍼블릭 읽기 경로 패턴
- `research/FEATURES.md` — 카드 그리드 복잡도, 반응형, 한국어 폰트
- `research/PITFALLS.md` — Pitfall 5(그리드 성능), Pitfall 13(모바일 후순위), Pitfall 14(접근성)
- `research/STACK.md` — 기술 스택 결정사항
- `research/SUMMARY.md` — 스택 결정사항 요약

---

## 다음 세션 실행 명령

```
/gsd:plan-phase 2 --skip-research
```

`--skip-research` 이유:
- Phase-specific RESEARCH.md는 없지만 `research/` 디렉토리의 공통 리서치 파일이 충분한 컨텍스트를 제공함
- CONTEXT.md에 D-01~D-07 구체적 결정사항이 있어 추가 리서치 불필요

### UI-SPEC 관련 참고

`/gsd:plan-phase 2 --skip-research`를 실행하면 UI-SPEC.md가 없다는 경고가 나올 수 있다.
- CONTEXT.md에 UI 결정사항(D-01~D-07)이 충분히 문서화되어 있으므로 `--skip-ui` 플래그 추가해서 우회 가능:

```
/gsd:plan-phase 2 --skip-research --skip-ui
```

---

## Docker 재시작 명령 (다음 세션에서도 필요 시)

```powershell
cd C:\Users\HANSUNG\planning\planning
docker compose up
```

앱 URL: http://localhost:3000

---

## Known Follow-Up Work

1. Phase 2 플래닝 → 실행 → 검증
2. Phase 1 STATE.md 업데이트 (Docker 검증 완료, Phase 1 Complete 처리)
3. ROADMAP.md / REQUIREMENTS.md의 카테고리 참조("보안/클라우드", "모바일/게임") 업데이트 여부 결정

## Notes For Next Agent

- 카테고리는 현재 2개 (SW엔지니어, 데이터/AI) — 하드코딩 금지, DB에서 동적 로드
- Phase 2는 `/jobs/[slug]` 상세 페이지로의 링크만 연결 (상세 페이지 자체는 Phase 3)
- Tailwind v4 + shadcn/ui Card 패턴 사용
- Server Component 패턴 유지 (URL search param 서버사이드 필터링)
- `is_published = true` 필터 필수
