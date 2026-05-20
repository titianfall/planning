# Phase 7: Admin Authentication - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-20
**Phase:** 7-Admin Authentication
**Areas discussed:** 페이즈 범위 / 인증 방식 / 배포 의도

---

## 회색지대 선택 (initial)

제시한 회색지대: 비허용 사용자 처리 / Phase 7의 `/admin` 범위 / 로그인 페이지 흐름 /
로그인 후 리다이렉트.

**User's choice:** (Other / free text) "로그인 부분은 딱히 신경쓰지 않을게 로컬에서만
돌아가는 사이트"
**Notes:** 사용자가 제시된 회색지대를 모두 건너뛰고, 사이트가 로컬 전용이며 로그인은
중요하게 보지 않는다고 밝힘. 이는 ROADMAP Phase 7 + research가 잠근 "Supabase 매직 링크
인증"과 충돌 → HOW가 아니라 페이즈 성격 자체를 바꾸는 신호로 판단, 명확화 진행.

---

## 어드민 게이트 방식

| Option | Description | Selected |
|--------|-------------|----------|
| A. 인증 게이트 없음 | 로컬 단일 사용자 사이트 — `/admin/*`을 그냥 연다 | ✓ |
| B. 최소 로컬 게이트 | `.env` 단일 비밀번호 쿠키 로그인, Supabase·이메일 없음 | |
| C. ROADMAP 그대로 | 로컬이어도 Supabase 매직 링크를 제대로 구현 | |

**User's choice:** A — 인증 게이트 없음.

---

## Phase 7 산출물

| Option | Description | Selected |
|--------|-------------|----------|
| 어드민 셸 스캐폴드 | `/admin` 라우트 + `app/admin/layout.tsx` 골격만, 게이트 없음 | |
| Phase 7 스킵/병합 | 인증이 없으면 고유 작업 없음 → Phase 7 제거/병합, 후속 페이즈가 `/admin` 셸 생성 | ✓ |

**User's choice:** Phase 7 스킵/병합.

---

## 배포 의도

| Option | Description | Selected |
|--------|-------------|----------|
| 로컬 전용으로 종료 | Phase 9 배포 파트 제거, Supabase 도입 없음, ADM-01 범위 제외 | ✓ |
| 나중에 배포 가능성 열어둠 | 로컬로 하되 코드·스키마는 배포 가능하게 유지 | |

**User's choice:** 로컬 전용으로 종료.

---

## Claude's Discretion

없음 — 페이즈 폐기 결정이라 구현 재량 영역이 없다.

## Deferred Ideas

- 어드민 인증(Supabase 매직 링크 + 단일 이메일 허용목록) — 향후 공개 배포 전환 시에만 재검토.
- Vercel 배포 + Supabase Postgres 이전 — 배포 전환 시 재검토.
