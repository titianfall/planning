# Phase 3: Job Detail Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-17 (Updated — rebased on actual codebase)
**Phase:** 3-Job-Detail-Page
**Areas discussed:** 연봉 표시 단계, 마크다운 코드 블록, 외부 링크 UI 범위, hiringDifficulty 필드명

---

## Context Conflicts Resolved (vs. 2026-05-14 original)

| 항목 | 이전 결정 | 실제 코드베이스 | 재결정 |
|------|-----------|----------------|--------|
| 연봉 단계 | 3단계 (salaryEntry/Mid/Senior) | 2단계만 존재 (Entry/Senior) | **2단계 유지** |
| 난이도 필드 | hiringDifficulty enum | entryDifficulty String | **hiringDifficulty String으로 마이그레이션** |
| Badge 구현 | shadcn/ui Badge | shadcn 미설치 | **커스텀 Tailwind 배지** |
| 외부 링크 UI | Phase 3에서 UI 마련 | — | **Phase 4로 전위임** |

---

## 연봉 표시 단계

| Option | Description | Selected |
|--------|-------------|----------|
| 2단계 유지 (신입/경력) | 현 스키마 그대로, 마이그레이션 없음, ROADMAP SC3 일치 | ✓ |
| 3단계 추가 (중급 포함) | salaryMidMin/Max 필드 추가, 마이그레이션 필요 | |

**User's choice:** 2단계 유지
**Notes:** `salaryEntryMin/Max` + `salarySeniorMin/Max`. 스키마 변경 없음.

---

## 마크다운 코드 블록

| Option | Description | Selected |
|--------|-------------|----------|
| Inline code만 허용 | 백틱(`) 허용, 코드블록(```) 차단 | ✓ |
| 코드블록 전체 허용 | 인라인 + 펜스드 코드블록 모두 허용 | |
| 모두 차단 | H2/H3/bold/italic/목록만 | |

**User's choice:** Inline code만 허용
**Notes:** rehype-sanitize allowlist에 `code` 포함, `pre` 제외.

---

## 외부 링크 UI 범위

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 4로 전위임 | Phase 3은 DET-01~04만 집중 | ✓ |
| Phase 3에서 UI 마련 | 빈 링크 섹션 placeholder 포함 | |

**User's choice:** Phase 4로 전위임
**Notes:** Phase 3 domain boundary에서 링크 섹션 제거.

---

## hiringDifficulty 필드명

| Option | Description | Selected |
|--------|-------------|----------|
| entryDifficulty 그대로 | 스키마 변경 없음 | |
| hiringDifficulty로 변경 | 마이그레이션 + seed 업데이트 필요 | ✓ |

**User's choice:** hiringDifficulty로 마이그레이션
**Notes:** 값 ("활발"/"보통"/"거의 없음") 변경 없음. 필드명만 변경.

---

## Carried Forward (재확인 없이 유지)

- D-01: 2-컬럼 레이아웃 (데스크탑), 모바일 스택
- D-08: react-markdown + rehype-sanitize
- D-11: "← 직업 목록" 버튼 (Link href="/")
- D-12: 관련 직업 섹션 (같은 카테고리 max 3, JobCard 재사용)

## Claude's Discretion

- sidebar 섹션 구분선 및 여백
- 연봉 2단계 내부 레이아웃
- "관련 직업" empty state 처리
- 인라인 코드 스타일링
