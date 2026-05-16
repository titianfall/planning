# CS Career Compass

## What This Is

CS Career Compass는 컴퓨터공학과 학생들을 위한 진로 탐색 웹 플랫폼이다.
소프트웨어 엔지니어, 데이터/AI, 보안/클라우드, 모바일/게임 등 CS 관련 직업들을 카드 형태로 탐색하고,
각 직업의 상세 설명과 함께 실제 인턴십·부트캠프 채용 사이트로 바로 연결되는 링크를 제공한다.
직업 콘텐츠는 관리자가 직접 입력·관리한다.

## Core Value

CS 학생이 어떤 직업이 있는지 한눈에 보고, 바로 지원 사이트까지 이동할 수 있어야 한다.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 직업 카드 그리드 — 카테고리별(SW엔지니어, 데이터/AI, 보안/클라우드, 모바일/게임)로 직업 카드 목록 표시
- [ ] 직업 상세 페이지 — 직업 설명, 필요 기술, 연봉 수준, 관련 외부 링크(LinkedIn, 사람인, 원티드 등)
- [ ] 관리자 입력 인터페이스 — 직업 정보 추가/수정/삭제
- [ ] 카테고리 필터 — 카테고리별 필터링
- [ ] 로컬 기반 데이터 구조 — Phase 1에서 Prisma + SQLite로 직업/카테고리/링크 schema와 seed 데이터 구축
- [ ] 추천 확장 메타데이터 — 맞춤 추천은 v1 범위 밖이지만 직업별 fit 분석을 위한 metadata는 schema에 포함

### Out of Scope

- 로그인/회원가입 — v1은 공개 열람만, 계정 관리 불필요
- 맞춤 추천 알고리즘 — v1은 카탈로그 탐색에 집중하되, 추천 확장용 직업 메타데이터는 Phase 1부터 저장
- 모바일 앱 — 웹 우선, 모바일 앱은 v2 이후

## Context

- 대상 사용자: 컴공 학과 재학생 (주로 2~4학년, 진로 고민 중인 학생)
- 콘텐츠 소스: 관리자(엄선자)가 직접 큐레이션하여 입력
- 외부 링크 대상: LinkedIn, 사람인, 원티드, 각 부트캠프 공식 사이트

## Constraints

- **Tech**: 웹 애플리케이션 (브라우저에서 접근 가능)
- **Content**: 직업 정보는 하드코딩 없이 관리자가 입력 관리
- **Phase 1 DB**: Supabase 연결 없이 Prisma + SQLite 로컬 DB 우선
- **Future DB**: Prisma schema를 유지해 이후 Supabase Postgres로 이전 가능하게 설계

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 카드 그리드 UI | 직업 목록을 시각적으로 빠르게 탐색하기 위해 | — Pending |
| 관리자 직접 입력 방식 | 큐레이션된 정확한 정보 제공, API 연동 불필요 | — Pending |
| 외부 링크 방식 | 실제 채용 사이트와 연결해 즉시 지원 가능 | — Pending |
| Phase 1 로컬 DB 우선 | 클라우드 설정 전에 앱 골격과 데이터 구조를 빠르게 검증하기 위해 | Prisma + SQLite |
| 추천 메타데이터 선반영 | 향후 성향/역량 기반 fit 추천을 schema 변경 없이 확장하기 위해 | Job metadata fields |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-14 after Phase 1 local foundation revision*
