# Phase 4: External Links - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-20
**Phase:** 4-External-Links
**Areas discussed:** LinkedIn 링크 생성 방식, 링크 소스 (공통 vs 직업별 큐레이션), 섹션 위치 & 레이아웃, 링크 표시 형태

---

## LinkedIn 링크 생성 방식

### 생성 방식

| Option | Description | Selected |
|--------|-------------|----------|
| 동적 생성 | ExternalLinks 컴포넌트가 런타임에 job.title로 URL 조립. 모든 직업 자동, 누락 없음. seed에 linkedin 행 불필요. | ✓ |
| seed/JobLink 저장 | 직업별로 LinkedIn 링크를 seed/admin이 직접 입력(type=linkedin). 수동 관리, 누락 위험. | |
| 둘 다 지원 | 기본 동적 생성, JobLink에 type=linkedin 행이 있으면 우선. 유연하나 복잡도 증가. | |

**User's choice:** 동적 생성

### LinkedIn 검색 큐레이 값

| Option | Description | Selected |
|--------|-------------|----------|
| job.title 그대로 | 한국어 직업명을 URL 인코딩해 keywords로 사용. LNK-02 명세 그대로. | |
| 별도 검색어 필드 추가 | Job 스키마에 검색어 필드를 추가해 직업별 최적 검색어 지정. | ✓ |

**User's choice:** 별도 검색어 필드 추가

### Fallback (검색어 필드가 비어있을 때)

| Option | Description | Selected |
|--------|-------------|----------|
| title로 폴백 | 필드를 nullable로 두고 비면 job.title로 검색 URL 생성. 누락 위험 없음. | ✓ |
| 필수 필드 | NOT NULL 강제 — 모든 직업이 명시적 검색어를 가져야 함. seed 전체 업데이트 필요. | |

**User's choice:** title로 폴백

### LinkedIn 링크 라벨

| Option | Description | Selected |
|--------|-------------|----------|
| 고정 "LinkedIn 검색" | 성공기준 2 문구 그대로. 간결. | ✓ |
| 직업명 포함 | 예: "LinkedIn에서 백엔드 개발자 검색" — 명확하나 길어짐. | |

**User's choice:** 고정 "LinkedIn 검색"

---

## 링크 소스 (공통 vs 직업별 큐레이션)

### 채용 사이트 링크 소스

| Option | Description | Selected |
|--------|-------------|----------|
| 공통 4개 동적 생성 | 모든 직업에 사람인/원티드/점핏/프로그래머스 4개 링크 자동 조립. 성공기준 1 전부 충족, 누락 없음. | ✓ |
| 직업별 큐레이션 (seed/JobLink) | 직업마다 seed/admin이 골라넣은 채용 링크만 표시. 4개 사이트 보장 안 됨. | |
| 하이브리드 | 공통 4개 + JobLink type=jobBoard 행 추가 표시. 유연하나 구현 복잡. | |

**User's choice:** 공통 4개 동적 생성

### 부트캠프 링크 소스

| Option | Description | Selected |
|--------|-------------|----------|
| 직업별 큐레이션 | seed/JobLink type=bootcamp 행으로 직업별 지정. 검색 URL 없는 고정 기관. 없으면 섹션 숨김. | ✓ |
| 공통 목록 | 모든 직업에 동일 부트캠프 세트. 직무 무관 부트캠프 노출 위험. | |
| 카테고리별 큐레이션 | 카테고리 단위 매핑. 스키마/매핑 로직 필요. | |

**User's choice:** 직업별 큐레이션

### 채용 사이트 검색어 공유

| Option | Description | Selected |
|--------|-------------|----------|
| linkedinQuery 필드 재사용 | 새 필드를 searchKeyword 같은 일반 이름으로 두고 LinkedIn + 채용사이트 4개가 공유. 필드 1개만 추가. | ✓ |
| job.title 그대로 | 채용 사이트는 항상 한국어 직업명으로 검색. 별도 필드는 LinkedIn 전용. | |
| 채용사이트 전용 별도 필드 | LinkedIn과 별개 필드 추가. 스키마 필드 2개로 증가. | |

**User's choice:** linkedinQuery 필드 재사용 → 단일 `searchKeyword` 필드로 통합

---

## 섹션 위치 & 레이아웃

### 섹션 위치

| Option | Description | Selected |
|--------|-------------|----------|
| 2-컬럼 아래 full-width | 헤더 → 2컬럼(본문|sidebar) → 외부링크 full-width 섹션. 가로 공간 활용. | ✓ |
| 우측 sidebar 하단 | 연봉·난이도·기술태그 아래 sidebar 내부에 추가. 링크 폭 좁음. | |
| 좌측 본문 컬럼 하단 | 마크다운 본문 바로 아래. 컬럼 폭으로 제한됨. | |

**User's choice:** 2-컬럼 아래 full-width

### 3개 타입 그룹 구분

| Option | Description | Selected |
|--------|-------------|----------|
| 타입별 헤딩 + 세로 스택 | "채용 사이트"/"LinkedIn"/"관련 부트캠프" 헤딩 각각, 세로 스택. 빈 타입 헤딩 숨김. | ✓ |
| 데스크탑 3컬럼 가로 | 3그룹을 가로 3컬럼, 모바일 스택. 그룹별 링크 수 다르면 높이 불균형. | |
| 하나의 박스 통합 | 구분 헤딩 없이 한 박스에 나열. 타입 구분 흐릿. | |

**User's choice:** 타입별 헤딩 + 세로 스택

### 섹션 순서

| Option | Description | Selected |
|--------|-------------|----------|
| 외부링크 → 관련직업 | 이 직업에 대한 행동(지원·학습) 먼저, 다른 직업 탐색 나중. 핵심 가치와 일치. | ✓ |
| 관련직업 → 외부링크 | 관련 직업 먼저, 외부 링크 맨 아래. Phase 3 레이아웃 변경 최소화. | |

**User's choice:** 외부링크 → 관련직업

---

## 링크 표시 형태

### 링크 형태

| Option | Description | Selected |
|--------|-------------|----------|
| 버튼/칩 형태 | 테두리·배경 있는 버튼/칩. 클릭 타깃 크고 모바일 친화적. | ✓ |
| 텍스트 링크 목록 | 세로 나열된 텍스트 하이퍼링크. 간결하나 클릭 영역 작음. | |
| 카드 형태 | 설명·아이콘 포함 카드. 풍부하나 공간 과다. | |

**User's choice:** 버튼/칩 형태

### 아이콘 표시

| Option | Description | Selected |
|--------|-------------|----------|
| 외부링크 아이콘만 | 각 링크에 ↗ SVG. 새 탭 열림 안내, 가볍고 외부 의존 없음. Phase 1 SVG-only와 일치. | ✓ |
| 사이트 파비콘 포함 | 사이트 파비콘 표시. 시각적이나 외부 이미지 로드 의존·깨짐 위험. | |
| 아이콘 없음 | 텍스트만. 미니멀하나 새 탭 안내 부재. | |

**User's choice:** 외부링크 아이콘만

---

## Claude's Discretion

- 채용 사이트 4개의 검색 URL 템플릿 상수의 위치 (컴포넌트 내 상수 vs 별도 파일)
- 버튼/칩의 정확한 색상·여백·래핑 간격
- 외부링크 ↗ 아이콘의 정확한 SVG/크기/위치
- 섹션 헤딩 카피 문구 및 타이포 (sidebar 헤딩 패턴 재사용 여부)
- 부트캠프 큐레이션의 직업↔부트캠프 매핑 데이터

## Deferred Ideas

- 어드민의 외부 링크 추가/수정/삭제 UI — Phase 9 (ADM-06)
- 외부 링크 상태 자동 점검 (주간 cron) — v2 QUAL-01
- 외부 링크 클릭 추적 — v2 Analytics
- 사이트 파비콘 표시 — D-13에서 제외, 후속 UX 개선 시 재검토 가능
