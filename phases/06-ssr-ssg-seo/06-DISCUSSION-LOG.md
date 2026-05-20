# Phase 6: SSR/SSG & SEO - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-20
**Phase:** 6-SSR-SSG-SEO
**Areas discussed:** 직업 페이지 렌더링 전략, OG 이미지 전략, 메타데이터 내용 & 사이트 URL, sitemap·robots 범위 + 구조화 데이터

---

## 직업 페이지 렌더링 전략

### Q1: /jobs/[slug] 상세 페이지를 어떻게 렌더링할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| SSG + ISR (generateStaticParams) | 빌드 시 발행 직업 페이지 정적 생성 + ISR 캐싱. 페이즈 제목 'SSG'와 일치, revalidatePath가 의미를 가짐. research 권장. | ✓ |
| 동적 SSR (요청마다 렌더) | 매 요청 서버 렌더. 항상 최신이나 SSG 이점 없고 revalidatePath 무의미. | |

### Q2: SSG 선택 시, 캐시 갱신(revalidate) 방식은?

| Option | Description | Selected |
|--------|-------------|----------|
| 온디맨드 전용 (revalidatePath만) | 시간 기반 재검증 없이 Phase 8 어드민 쓰기의 revalidatePath 호출로만 갱신. | ✓ |
| 시간 기반 폴백 + 온디맨드 | revalidate에 주기 설정 + revalidatePath 병행. 어드민 호출 누락 시에도 갱신. | |

### Q3: 빌드 이후 추가된 직업(generateStaticParams에 없던 slug) 처리는?

| Option | Description | Selected |
|--------|-------------|----------|
| dynamicParams true (요청 시 생성) | 빌드 시 없던 직업도 첫 요청 시 렌더 후 캐시. 어드민 새 직업 즉시 노출. | ✓ |
| dynamicParams false (404) | 빌드 시 생성된 slug만 유효, 나머지 404. | |

**User's choice:** SSG + ISR / 온디맨드 전용 / dynamicParams true
**Notes:** 콘텐츠가 어드민 수정으로만 바뀌므로 시간 기반 재검증이 불필요하다는 판단.

---

## OG 이미지 전략

### Q1: 직업 페이지의 openGraph 블록에 OG 이미지를 어떻게 처리할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 직업별 동적 생성 | opengraph-image.tsx + ImageResponse로 직업별 이미지 자동 생성. 구현 부담 큼. | |
| 공용 정적 이미지 1개 | 모든 페이지가 동일한 사이트 브랜딩 OG 이미지 공유. 구현 간단, v1 실용적. | ✓ |
| 텍스트 OG만 (이미지 없음) | og:title/description/url/type만, 이미지 없음. | |

**User's choice:** 공용 정적 이미지 1개
**Notes:** Phase 3에서 '/api/og'를 Phase 6으로 미뤘으나, 동적 생성은 v2(KakaoTalk 공유)로 재이관.

---

## 메타데이터 내용 & 사이트 URL

### Q1: 직업 상세 페이지의 <title> 형식은?

| Option | Description | Selected |
|--------|-------------|----------|
| {직업명} - 기술, 연봉, 진로 \| CS Career Compass | research PITFALLS Pitfall 6 권장. 검색 키워드 풍부. | ✓ |
| {직업명} \| CS Career Compass | 간결한 형식. 키워드 노출 적음. | |

### Q2: 메타 description은 어느 필드에서 가져올까요?

| Option | Description | Selected |
|--------|-------------|----------|
| job.summary 사용 | 이미 존재하는 필수 String 필드, 짧은 큐레이션 요약. 마크다운 제거 불필요. | ✓ |
| description 마크다운 앞부분 잘라서 | 본문 앞 N자 사용. 마크다운 기호 제거 필요, 문장 잘림 가능. | |

### Q3: metadataBase(OG·canonical·sitemap의 절대 URL)를 어떻게 처리할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| NEXT_PUBLIC_SITE_URL env var + localhost 폴백 | .env.example에 항목 추가, 미설정 시 http://localhost:3000 폴백. Phase 9 배포 시 도메인만 주입. | ✓ |
| placeholder 도메인 하드코딩 | 임시 도메인을 코드에 직접 작성. Phase 9에서 교체 필요, 누락 위험. | |

**User's choice:** title 형식(research 권장) / job.summary / NEXT_PUBLIC_SITE_URL env var
**Notes:** —

---

## sitemap·robots 범위 + 구조화 데이터

### Q1: robots.ts 정책을 어떻게 설정할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 공개 allow + /admin·/auth 미리 disallow | 공개 페이지 전체 allow, 향후 Phase 7의 /admin·/auth 경로 선반영 disallow. | ✓ |
| 전체 allow만 | 공개 페이지만 있으니 전체 allow. /admin 차단은 Phase 7에서. | |

### Q2: sitemap.xml에 무엇을 포함할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| / + 발행 직업 /jobs/[slug]만 | ROADMAP 성공기준 3 그대로. lastmod = updatedAt. | ✓ |
| 위 + 카테고리 필터 URL도 | /?category=... URL도 포함. 중복 콘텐츠 이슈 가능. | |

### Q3: JSON-LD Occupation 구조화 데이터를 이번 페이즈에 포함할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 이번 페이즈에 포함 | 직업 페이지에 JSON-LD Occupation 스키마 추가. SEO 도메인 내, research 권장. | ✓ |
| Deferred | 잠긴 성공기준 밖이므로 향후 SEO 강화 페이즈로. | |

**User's choice:** /admin·/auth 미리 disallow / / + 발행 직업만 / JSON-LD 포함
**Notes:** JSON-LD는 ROADMAP 잠긴 성공기준(title/description/OG) 밖이지만 같은 SEO 도메인이므로 이번 페이즈에 포함하기로.

---

## Claude's Discretion

- `revalidatePath` 헬퍼 모듈의 위치·형태 (이번 페이즈엔 호출자 없음, export만)
- 공용 정적 OG 이미지 파일의 제작/디자인 (1200×630, 배치 경로)
- JSON-LD `Occupation` 스키마의 정확한 필드 매핑
- `sitemap.ts`의 `changefreq`/`priority` 필드 포함 여부
- `generateMetadata`의 `twitter` 카드 블록 포함 여부
- 홈 `/`의 메타데이터를 layout 정적값보다 구체화할지

## Deferred Ideas

- 직업별 동적 OG 이미지 생성 — v2 KakaoTalk 공유(EXP-04) 작업 시 재검토
- sitemap에 카테고리 필터 URL 포함 — 중복 콘텐츠 우려로 제외
- 시간 기반 ISR `revalidate` — 온디맨드 무효화로 충분
- Pretendard / Noto Sans KR `next/font` 배선 누락 (현 layout.tsx에 없음) — Phase 6 범위 밖, 회고/백로그 항목
- 애널리틱스 — v2
