# Phase 2: Public Catalog (Grid + Filter) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-14
**Phase:** 2-Public-Catalog-Grid-Filter
**Areas discussed:** 카드 콘텐츠, 필터 UX

---

## 카드 콘텐츠

| Option | Description | Selected |
|--------|-------------|----------|
| 직업명 + 한 줄 설명 + 예시 고용 회사 | 회사는 "예시 고용 회사" 의미 | ✓ |
| 직업명 + 한 줄 설명만 | 최소 정보 | |

**User's choice:** 직업명, 한 줄 요약, 예시 고용 회사(네이버·카카오 등), 주요 기술 태그 2-3개, 연봉 미리보기
**Notes:** 사용자가 처음에 "회사"를 언급 → 확인 결과 특정 회사 채용이 아닌 "예시 고용 회사" 표시를 원함. 추가로 주요 기술 태그와 연봉 미리보기도 카드에 포함하기로 결정.

---

## 필터 UX

| Option | Description | Selected |
|--------|-------------|----------|
| 상단 체크박스 | 화면 상단에 4개 직군 체크박스 (중복 선택 가능) | |
| 상단 필 칩 | 화면 상단에 체크에 가능한 필 버튼식 (하나만 선택) | ✓ |
| 상단 탭바 | All / SW엔지니어 / 데이터AI... 탭 모양 | |

**User's choice:** 상단 필 칩 (한 번에 하나만 선택)
**Notes:** 사용자가 처음에 "체크박스 형식 또는 자연어 검색"을 언급. 검색은 Phase 5로 분리, 카테고리 필터는 필 칩으로 결정.

### 검색 + 필터 조합 동작

| Option | Description | Selected |
|--------|-------------|----------|
| AND 적용 | 카테고리 필터 + 검색어 동시 적용 | ✓ |
| 검색 시 필터 무시 | 검색어 입력 시 카테고리 필터 초기화 | |

**User's choice:** AND 적용
**Notes:** Phase 5 검색 구현 시 URL param `?q=`와 `?category=`를 동시에 사용.

---

## Claude's Discretion

- 카드 내부 레이아웃 (이미지 위치, 태그 색상 팔레트)
- 필 칩 활성/비활성 시각 처리
- 그리드 카드 간격 및 패딩

## Deferred Ideas

- 검색 입력창 stub (Phase 5에서 구현)
- 카드 hover 애니메이션 / 즐겨찾기 버튼 — 후속 UX 개선 단계에서 검토
- 빈 카테고리 empty state 상세 UX — 플래너 재량
