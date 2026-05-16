# Requirements: CS Career Compass

**Defined:** 2026-05-14
**Core Value:** CS 학생이 어떤 직업이 있는지 한눈에 보고, 바로 지원 사이트까지 이동할 수 있어야 한다.

## v1 Requirements

### Catalog (공개 카탈로그)

- [ ] **CAT-01**: 사용자가 홈에서 4개 카테고리별 직업 카드 그리드를 볼 수 있다 (SW엔지니어, 데이터/AI, 보안/클라우드, 모바일/게임)
- [ ] **CAT-02**: 사용자가 카테고리 필터로 특정 카테고리의 직업만 볼 수 있다
- [ ] **CAT-03**: 사용자가 키워드로 직업을 검색할 수 있다
- [ ] **CAT-04**: 사용자가 직업 카드를 클릭하면 해당 직업의 상세 페이지로 이동한다

### Detail (직업 상세)

- [ ] **DET-01**: 직업 상세 페이지에서 직업 설명(마크다운)을 볼 수 있다
- [ ] **DET-02**: 직업 상세 페이지에서 필요 기술을 태그 형태로 볼 수 있다
- [ ] **DET-03**: 직업 상세 페이지에서 연봉 범위(신입/경력, KRW, 출처, 연도)를 볼 수 있다
- [ ] **DET-04**: 직업 상세 페이지에서 신입 취업 난이도 지표를 볼 수 있다 (예: 신입 채용 거의 없음 / 보통 / 활발)

### Links (외부 링크)

- [ ] **LNK-01**: 직업 상세 페이지에서 관련 인턴십 채용 사이트 링크를 볼 수 있다 (사람인, 원티드, 점핏, 프로그래머스 잡스)
- [ ] **LNK-02**: 직업 상세 페이지에서 LinkedIn 관련 직무 검색 링크를 볼 수 있다. LinkedIn 검색 URL은 한국어 직업명을 검색어로 사용한다.
- [ ] **LNK-03**: 직업 상세 페이지에서 관련 주요 부트캠프 링크를 볼 수 있다 (우아한테크코스, SSAFY, 네이버 부스트캠프, 카카오 테크 캠퍼스 등)

### Admin (관리자)

- [ ] **ADM-01**: 관리자가 로그인(매직링크 이메일)으로 어드민 영역에 접근할 수 있다
- [ ] **ADM-02**: 관리자가 기본 대시보드에서 등록된 직업 수, 최근 수정 항목을 볼 수 있다
- [ ] **ADM-03**: 관리자가 직업을 새로 입력할 수 있다 (제목, 카테고리, 설명, 기술 태그, 연봉, 난이도)
- [ ] **ADM-04**: 관리자가 기존 직업 정보를 수정할 수 있다
- [ ] **ADM-05**: 관리자가 직업을 삭제할 수 있다 (확인 절차 포함)
- [ ] **ADM-06**: 관리자가 각 직업의 외부 링크를 추가/수정/삭제할 수 있다

### Foundation (기반 인프라)

- [ ] **FND-01**: 모든 직업 상세 페이지가 SSR/SSG로 렌더링되어 검색엔진에 노출된다
- [ ] **FND-02**: 각 직업 페이지마다 고유한 SEO 메타데이터(title, description, OG)가 있다
- [ ] **FND-03**: 공개 페이지가 모바일(375px)부터 데스크탑까지 반응형으로 표시된다
- [ ] **FND-04**: 한국어(Pretendard/Noto Sans KR) 폰트로 표시된다
- [ ] **FND-05**: Phase 1에서는 Prisma + SQLite 기반 로컬 DB가 동작하며, 나중에 Supabase Postgres로 이전 가능한 schema 형태를 유지한다
- [ ] **FND-06**: `Category`, `Job`, `JobLink` 모델이 정의되고, `Job`에는 향후 맞춤형 fit 추천을 위한 메타데이터 필드가 포함된다
- [ ] **FND-07**: seed script가 4개 카테고리와 주요 CS/IT 직군 데이터를 생성한다

## v2 Requirements

### Content Quality

- **QUAL-01**: 외부 링크 자동 상태 확인 (주간 cron, 어드민 대시보드에 깨진 링크 표시)
- **QUAL-02**: 직업 초안/발행 토글 (발행 전 미리보기 지원)
- **QUAL-03**: 연봉 정보 갱신 알림 (12개월 이상 미갱신 시 어드민에 표시)

### Catalog Expansion

- **EXP-01**: 부트캠프 별도 비교 카탈로그 (국비지원 여부, 기간, 비용)
- **EXP-02**: 학습 로드맵 (단계별 학습 경로 per 직업)
- **EXP-03**: 회사 티어별 기술 스택 (네카라쿠배당토 vs SI vs 스타트업)
- **EXP-04**: KakaoTalk 공유 버튼 + OG 이미지

### UX

- **UX-01**: 다크 모드
- **UX-02**: 경력 비교 뷰 (2-3개 직업 나란히 비교)

## Out of Scope

| Feature | Reason |
|---------|--------|
| 사용자 로그인/회원가입 | v1은 공개 열람만, 개인정보보호법 부담 없이 단순화 |
| 맞춤 추천 알고리즘/AI 챗봇 | 큐레이션된 정보가 더 신뢰성 높음, 구현 복잡도 높음 |
| 실시간 채용 공고 크롤링 | 사람인/원티드/점핏과 경쟁하지 않음, 외부 링크로 대체 |
| 연봉 크라우드소싱 | 모더레이션 부담, 크리티컬 매스 불가능 |
| 포럼/커뮤니티 기능 | OKKY, 인프런 커뮤니티 등 기존 채널로 충분 |
| 모바일 앱 | 웹 우선, 모바일 앱은 v2+ |
| 동영상 콘텐츠 호스팅 | YouTube/Inflearn으로 링크 아웃 |

**Note:** 맞춤 추천 알고리즘 자체는 v1 범위 밖이지만, 향후 추천 기능을 막지 않도록 직업별 fit 메타데이터는 Phase 1 schema에 포함한다.

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CAT-01 | Phase 2 | Pending |
| CAT-02 | Phase 2 | Pending |
| CAT-03 | Phase 5 | Pending |
| CAT-04 | Phase 2 | Pending |
| DET-01 | Phase 3 | Pending |
| DET-02 | Phase 3 | Pending |
| DET-03 | Phase 3 | Pending |
| DET-04 | Phase 3 | Pending |
| LNK-01 | Phase 4 | Pending |
| LNK-02 | Phase 4 | Pending |
| LNK-03 | Phase 4 | Pending |
| ADM-01 | Phase 7 | Pending |
| ADM-02 | Phase 8 | Pending |
| ADM-03 | Phase 8 | Pending |
| ADM-04 | Phase 8 | Pending |
| ADM-05 | Phase 8 | Pending |
| ADM-06 | Phase 9 | Pending |
| FND-01 | Phase 6 | Pending |
| FND-02 | Phase 6 | Pending |
| FND-03 | Phase 2 | Pending |
| FND-04 | Phase 1 | Pending |
| FND-05 | Phase 1 | Pending |
| FND-06 | Phase 1 | Pending |
| FND-07 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-14*
*Last updated: 2026-05-14 after Phase 1 local foundation revision*
