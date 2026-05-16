# Phase 3: Job Detail Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-14
**Phase:** 3-Job-Detail-Page
**Areas discussed:** 페이지 레이아웃, 연봉/난이도 표시형식, 마크다운 렌더링, 네비게이션

---

## 페이지 레이아웃

| Option | Description | Selected |
|--------|-------------|----------|
| 2-컬럼 (본문 + 사이드바) | 좌측 마크다운 본문, 우측 sidebar (연봉·난이도·태그·링크) | ✓ |
| 1-컬럼 (순차 스크롤) | 모든 정보 세로 단일 컬럼으로 | |

**User's choice:** 2-컬럼 레이아웃 (데스크탑), 모바일에서는 sidebar가 본문 아래 스택
**Notes:** 헤더 영역(직업명, 카테고리 배지, 연봉 요약, 예시 고용 회사)은 full-width로 2-컬럼 위에 배치.

---

## 연봉/난이도 표시형식

### 연봉

| Option | Description | Selected |
|--------|-------------|----------|
| 단일 범위 (salaryMin~salaryMax) | Phase 1 기존 스키마 그대로, 신입 기준 범위 하나 | |
| 3-단계 (신입/중급/시니어) | 신입/인턴, 1~3년차, 3~5년차 각각 별도 필드 | ✓ |

**User's choice:** 3-단계 연봉 — `salaryEntry`, `salaryMid`, `salarySenior` 필드 추가 (스키마 마이그레이션 필요)
**Notes:** 출처(sourceUrl) + 연도(asOfYear) 함께 표시. 연봉 크라우드소싱 없음 — 관리자 직접 입력.

### 난이도

| Option | Description | Selected |
|--------|-------------|----------|
| 텍스트만 | "신입 채용 활발 / 보통 / 거의없음" 텍스트 | |
| 색상 배지 | shadcn/ui Badge + 초록/노랑/빨강 | ✓ |
| 진행 바 | 막대 그래프 형식 | |

**User's choice:** 3-단계 색상 배지 — 활발(초록), 보통(노랑), 거의없음(빨강)
**Notes:** hiringDifficulty enum 필드 (ACTIVE | MODERATE | RARE).

---

## 마크다운 렌더링

| Option | Description | Selected |
|--------|-------------|----------|
| react-markdown + 제한 allowlist | H2/H3/bold/italic/목록만 허용, rehype-sanitize | ✓ |
| 구조화 plain-text | 마크다운 없이 섹션별 텍스트 필드 | |
| 풀 마크다운 | 코드블록, 이미지 등 모두 허용 | |

**User's choice:** react-markdown + rehype-sanitize, 제한된 허용 태그
**Notes:** 코드 블록, HTML 삽입, 이미지 비허용. Phase 8 어드민에서 textarea에 직접 입력.

---

## 네비게이션

| Option | Description | Selected |
|--------|-------------|----------|
| 브라우저 뒤로가기만 | 별도 버튼 없음 | |
| "← 직업 목록" 버튼 | 상단에 카탈로그 홈으로 링크 | ✓ |
| 상단 breadcrumb | Home > 카테고리 > 직업명 | |

**User's choice:** "← 직업 목록" 버튼 (상단)
**Notes:** Link href="/" 서버 네비게이션.

### 관련 직업

| Option | Description | Selected |
|--------|-------------|----------|
| 없음 | 상세 페이지에 관련 직업 없음 | |
| 같은 카테고리 max 3 | 하단 "관련 직업" 섹션, JobCard 재사용 | ✓ |
| 추천 알고리즘 기반 | 맞춤 추천 — v1 범위 외 | |

**User's choice:** 같은 카테고리에서 최대 3개, JobCard 컴포넌트 재사용
**Notes:** 같은 카테고리 직업이 없을 때 empty state는 Claude 재량.

---

## Claude's Discretion

- sidebar 내 섹션 구분선 및 간격
- 연봉 3단계 컴포넌트 내부 레이아웃 (테이블 vs. 카드 vs. 리스트)
- "관련 직업" empty state 디자인

## Deferred Ideas

- 즐겨찾기/저장 기능 — 공개 사용자 계정 없음
- 연봉 그래프 시각화 — v2
- OG 이미지 자동 생성 — Phase 6
- 외부 링크 클릭 추적 — v2 Analytics
