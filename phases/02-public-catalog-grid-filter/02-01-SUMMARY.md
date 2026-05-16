---
phase: 02-public-catalog-grid-filter
plan: "02-01"
subsystem: database
tags: [prisma, sqlite, schema-migration, seed]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "Prisma schema (Job, Category, JobLink 모델) + 기존 마이그레이션 + seed.ts 구조"
provides:
  - "Job 모델에 exampleCompanies String @default('[]') 필드 추가"
  - "마이그레이션 파일 20260516153755_add_example_companies 생성 및 적용"
  - "seed.ts 6개 직업 데이터에 실제 예시 회사명 배열 추가"
  - "dev.db 모든 job 행에 exampleCompanies 데이터 반영 완료"
affects: [02-02, 02-03, 03-job-detail-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "JSON string array 저장 패턴: json() 헬퍼로 string[]를 DB TEXT로 직렬화 (skills 필드와 동일)"

key-files:
  created:
    - prisma/migrations/20260516153755_add_example_companies/migration.sql
  modified:
    - prisma/schema.prisma
    - prisma/seed.ts

key-decisions:
  - "exampleCompanies는 skills 필드와 동일하게 JSON string array로 SQLite TEXT 컬럼에 저장"
  - "기존 job 행에는 DEFAULT '[]'로 마이그레이션 적용 후 seed 재실행으로 실제 데이터 채움"

patterns-established:
  - "JSON array 필드 패턴: schema에 String @default('[]'), seed에서 json() 헬퍼로 직렬화"

requirements-completed: [CAT-01]

# Metrics
duration: 15min
completed: 2026-05-17
---

# Phase 2 Plan 01: Schema Extension — exampleCompanies Summary

**Prisma Job 모델에 exampleCompanies 필드를 추가하고 마이그레이션 적용 후 6개 직업 seed 데이터에 실제 한국 IT 기업명 배열을 채워 직업 카드 UI 데이터 기반을 완성**

## Performance

- **Duration:** 약 15분
- **Started:** 2026-05-17T00:00:00Z
- **Completed:** 2026-05-17
- **Tasks:** 2
- **Files modified:** 3 (schema.prisma, seed.ts, migration.sql 생성)

## Accomplishments

- Prisma Job 모델에 `exampleCompanies String @default("[]")` 필드 추가 및 마이그레이션 완료
- SQLite migration.sql에 `"exampleCompanies" TEXT NOT NULL DEFAULT '[]'` 컬럼 생성 확인
- seed.ts 6개 직업 모두에 한국 IT 기업 예시 배열 추가 및 DB 반영 완료

## Task Commits

1. **T01: schema.prisma exampleCompanies 추가 + 마이그레이션** - `5fce844` (feat)
2. **T02: seed.ts 6개 직업 exampleCompanies 추가 및 seed 재실행** - `580e9ab` (feat)
3. **[Rule 1 Auto-fix] entryDifficulty -> hiringDifficulty 필드명 변경** - `ba8f6a1` (fix)

## Files Created/Modified

- `prisma/schema.prisma` - Job 모델에 exampleCompanies 추가, entryDifficulty -> hiringDifficulty 변경
- `prisma/migrations/20260516153755_add_example_companies/migration.sql` - exampleCompanies 컬럼 추가 마이그레이션
- `prisma/migrations/20260517000000_rename_entry_difficulty/migration.sql` - entryDifficulty -> hiringDifficulty RENAME COLUMN 마이그레이션
- `prisma/seed.ts` - 6개 직업 데이터에 exampleCompanies 배열 추가, hiringDifficulty로 필드명 통일

## Decisions Made

- exampleCompanies는 기존 skills 필드와 동일하게 `json()` 헬퍼로 JSON 직렬화하여 SQLite TEXT로 저장
- 마이그레이션에 `--name add_example_companies` 명시적 이름 사용

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] npm install 실행으로 node_modules 초기화**
- **Found during:** T01 (마이그레이션 실행)
- **Issue:** node_modules가 비어 있어 prisma CLI를 찾을 수 없었음
- **Fix:** `npm install` 실행으로 의존성 설치 후 로컬 `node_modules/.bin/prisma`로 마이그레이션 수행
- **Files modified:** package-lock.json (잠금 파일 업데이트), node_modules/ (설치)
- **Verification:** `node_modules/.bin/prisma --version`으로 6.19.3 확인 후 마이그레이션 성공
- **Committed in:** 5fce844 (T01 커밋에 포함)

**2. [Rule 1 - Bug] entryDifficulty -> hiringDifficulty 필드명 변경 및 마이그레이션 처리**
- **Found during:** T02 완료 후 (외부 도구에 의해 schema, seed.ts, migration 파일이 변경된 상태 발견)
- **Issue:** schema.prisma의 `entryDifficulty`가 `hiringDifficulty`로 변경되어 있었으나 seed.ts와 DB migration이 불완전한 상태. Phase 3 CONTEXT.md D-06에서 이 변경이 명시되어 있으며 02-01 타이밍에 적용이 의도됨
- **Fix:** 미적용 마이그레이션 파일 확인 → `prisma migrate deploy`로 적용 완료 → seed 재실행 성공 확인
- **Files modified:** prisma/schema.prisma, prisma/seed.ts, prisma/migrations/20260517000000_rename_entry_difficulty/migration.sql
- **Verification:** `prisma.job.findFirst({ select: { hiringDifficulty: true } })` 정상 반환 + seed 오류 없음
- **Committed in:** ba8f6a1 (fix 커밋)

---

**Total deviations:** 2 auto-fixed (1 blocking — 패키지 미설치, 1 bug — 필드명 불일치)
**Impact on plan:** 모든 수정이 DB 일관성 유지에 필수적. Phase 3 계획 변경을 Phase 2 초기에 통합하여 다운스트림 이슈 예방.

## Issues Encountered

- `npx prisma`가 v7.8.0을 자동 다운로드하려 했으나, package.json은 v6.19.x를 사용 중. 로컬 `node_modules/.bin/prisma`를 직접 사용하여 해결.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- exampleCompanies 데이터가 dev.db에 모든 job 행에 채워져 있어 02-02 (JobCard UI 컴포넌트) 에서 바로 렌더링 가능
- Prisma Client가 exampleCompanies 필드를 포함하여 재생성된 상태

## Self-Check: PASSED

- SUMMARY.md: FOUND
- migration 20260516153755_add_example_companies/migration.sql: FOUND
- exampleCompanies in schema.prisma: FOUND
- exampleCompanies in seed.ts: FOUND
- commit 5fce844 (T01): FOUND
- commit 580e9ab (T02): FOUND
- commit ba8f6a1 (auto-fix hiringDifficulty): FOUND

---
*Phase: 02-public-catalog-grid-filter*
*Completed: 2026-05-17*
