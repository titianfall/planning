# Phase 5: Keyword Search - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-20
**Phase:** 5-Keyword-Search
**Areas discussed:** 검색 입력 방식, 검색 대상 범위, 검색창 배치

---

## 회색 영역 선택

| Option | Description | Selected |
|--------|-------------|----------|
| 검색 입력 방식 | 입력 즉시 반영(디바운스) vs 엔터/버튼 제출 | ✓ |
| 검색 대상 범위 | 직업명+기술태그만 vs 설명까지 포함 | ✓ |
| 검색창 배치 | 카테고리 필터와의 위치 관계 | ✓ |
| 검색 결과 피드백 | 빈 상태 문구, 결과 개수, clear 방식 | |

---

## 검색 입력 방식

| Option | Description | Selected |
|--------|-------------|----------|
| 입력 즉시 검색 (디바운스) | 타이핑 후 ~300ms 뒤 그리드 자동 갱신. 검색창은 `'use client'` + `useRouter`. 데이터 페칭·그리드는 서버 컴포넌트 유지. | ✓ |
| 엔터/버튼 제출 (서버 컴포넌트 유지) | `<form method=GET>`. 100% 서버 컴포넌트 유지하나 실시간 피드백 없음. | |

**User's choice:** 입력 즉시 검색 (디바운스)
**Notes:** 프로젝트 최초의 클라이언트 컴포넌트가 됨 (Phase 1~4는 100% Server Component). 클라이언트 컴포넌트는 검색 입력창 한 곳으로 한정. 디바운스 지연 시간과 history `replace` 처리는 플래너 재량.

---

## 검색 대상 범위

| Option | Description | Selected |
|--------|-------------|----------|
| 직업명 + 기술 태그 | ROADMAP 성공기준 2와 정확히 일치. title + requiredSkills 매칭. | ✓ |
| 직업명 + 기술 태그 + 설명 본문 | 마크다운 description 전체 검색. 페이즈 목표문과 일치하나 정밀도 저하 우려. | |

**User's choice:** 직업명 + 기술 태그
**Notes:** 페이즈 목표문은 "설명까지" 언급하나 locked 성공기준 2("title and skill tags")를 기준으로 확정. summary/description 제외. description 전문 검색은 deferred.

---

## 검색창 배치

| Option | Description | Selected |
|--------|-------------|----------|
| 카테고리 필터 위 | 순서: 헤더 → 검색창 → 카테고리 칩 → 그리드. 검색이 1차 탐색 수단. | ✓ |
| 카테고리 필터 아래 | 순서: 헤더 → 카테고리 칩 → 검색창 → 그리드. | |
| 칩과 같은 줄 (한 줄 통합) | 검색창+칩을 하나의 필터 바로 통합. 모바일 줄바꿈 처리 필요. | |

**User's choice:** 카테고리 필터 위
**Notes:** 홈 화면 최종 순서 — 헤더 → 검색창 → 카테고리 칩 → 직업 그리드.

---

## Claude's Discretion

- 디바운스 지연 시간 (~250–350ms)
- 빈 상태 문구 (검색 결과 없음 / 검색어+카테고리 동시 활성 시 문구) — 기존 카테고리 빈 상태 UI 확장
- 검색어 지우기(clear) affordance 정확한 형태 (입력창 내 X 버튼 vs 별도 링크)
- 결과 개수 표시 여부 (논의에서 선택 안 됨)
- 검색창 정확한 스타일·여백·아이콘

## Deferred Ideas

- 설명(description) 본문 전문 검색 — 성공기준 2가 직업명+기술태그로 한정
- 검색어 자동완성/추천, 검색 히스토리 — v1 범위 외
- 결과 정렬 옵션, 페이지네이션 — v1 범위 외
- 검색 분석/추적 — v2 Analytics
