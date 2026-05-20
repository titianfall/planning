# Phase 6: SSR/SSG & SEO - Context

**Gathered:** 2026-05-20
**Status:** Ready for planning

<domain>
## Phase Boundary

공개 페이지(`/`, `/jobs/[slug]`)를 검색엔진이 인덱싱할 수 있는 형태로 정비한다:

1. **SSR/SSG 확인** — 공개 라우트가 서버에서 완전히 렌더된 HTML을 내보내는지 확인하고, 의도치 않은 `'use client'`를 제거한다. (단, Phase 5가 도입한 의도된 `<SearchBar>` 클라이언트 컴포넌트는 보존)
2. **per-job SEO 메타데이터** — `/jobs/[slug]`에 `generateMetadata`를 추가해 직업별 고유 `title`/`description`/`openGraph`를 생성한다.
3. **sitemap.xml + robots.txt** — `app/sitemap.ts`, `app/robots.ts`를 추가한다.
4. **revalidatePath 헬퍼 배선** — Phase 8 어드민 쓰기 액션이 사용할 캐시 무효화 헬퍼를 미리 만든다 (이번 페이즈에는 호출자 없음).
5. **JSON-LD 구조화 데이터** — 직업 페이지에 `Occupation` 스키마를 추가한다 (research 권장, 잠긴 성공기준 외 추가).

**UI/시각 작업 없음.** (FND-01, FND-02)

**범위 밖:** 어드민 쓰기 액션 자체(Phase 8 — 이번엔 헤더 배선만), Supabase/Vercel 배포(Phase 9), KakaoTalk 공유·동적 OG 이미지 생성(v2 EXP-04), 애널리틱스(v2).

</domain>

<decisions>
## Implementation Decisions

### 직업 페이지 렌더링 전략 (Rendering Strategy)
- **D-01:** `/jobs/[slug]`는 **SSG + ISR** — `generateStaticParams`로 빌드 시 모든 발행 직업(`isPublished: true`) 페이지를 정적 생성한다. 페이즈 제목 'SSG'와 일치하고, 성공기준 4의 `revalidatePath`가 실제로 캐시를 무효화할 대상을 만든다. research(`SUMMARY.md`)가 ISR + `revalidatePath` 패턴을 권장.
- **D-02:** 캐시 갱신은 **온디맨드 전용** — 시간 기반 `revalidate`를 두지 않고, Phase 8 어드민 쓰기의 `revalidatePath` 호출로만 갱신한다. 콘텐츠가 어드민 수정으로만 바뀌므로 시간 기반 재검증은 불필요.
- **D-03:** `dynamicParams: true` — 빌드 시점에 `generateStaticParams`에 없던 slug(Phase 8 어드민이 추가한 새 직업)도 첫 요청 시 렌더 후 캐시한다. 재빌드 없이 새 직업이 노출됨.
- **D-04:** `/` 홈은 Phase 5의 `?q=`·`?category=` search param 의존으로 본질적으로 요청 동적(dynamic SSR)이다 — 정적 생성 대상 아님. 성공기준 1("view-source에 완전한 HTML")은 동적 SSR로 충족된다. `/` 페이지 자체는 Server Component 유지, `<SearchBar>`만 클라이언트 컴포넌트.

### OG 이미지 전략 (OG Image)
- **D-05:** openGraph 블록은 **공용 정적 이미지 1개**를 사용한다 — 모든 페이지가 동일한 사이트 로고/브랜딩 OG 이미지를 공유한다. 직업별 동적 생성(`opengraph-image.tsx`/`ImageResponse`)은 하지 않는다. 공유 시 기본 외관은 확보하되 구현 부담 최소화 (v1 실용적 선택). Phase 3에서 '/api/og'를 이 페이즈로 미뤘으나, 동적 생성은 v2로 재이관.

### 메타데이터 내용 & 사이트 URL (Metadata Content)
- **D-06:** 직업 상세 페이지 `<title>` 형식: **`{직업명} - 기술, 연봉, 진로 | CS Career Compass`** — research `PITFALLS.md` Pitfall 6 권장 형식. 검색 키워드가 풍부해 SEO에 유리.
- **D-07:** 메타 `description`은 **`job.summary`** 필드를 사용한다 — 이미 존재하는 필수 `String` 필드이며 짧은 큐레이션 요약이라 메타 description에 그대로 적합. 마크다운 `description` 본문을 자르지 않으므로 마크다운 기호 제거 불필요.
- **D-08:** `metadataBase`(OG·canonical·sitemap의 절대 URL 기준)는 **`NEXT_PUBLIC_SITE_URL` env var**에서 읽고, 미설정 시 **`http://localhost:3000`** 폴백. `.env.example`에 `NEXT_PUBLIC_SITE_URL` 항목을 추가한다. Phase 9 배포 시 실제 도메인만 주입하면 됨 — 코드 변경 불필요.

### sitemap·robots 범위 (Sitemap & Robots)
- **D-09:** `app/robots.ts` — 공개 페이지는 전체 `allow`, 향후 Phase 7에서 생길 **`/admin`·`/auth` 경로를 지금 미리 `disallow`**에 포함한다. 어드민이 구현되기 전에도 크롤링 차단을 준비.
- **D-10:** `app/sitemap.ts`는 **`/` + 발행 직업 `/jobs/[slug]`만** 포함한다 (ROADMAP 성공기준 3 그대로). 각 직업 항목의 `lastModified`는 `job.updatedAt`. 카테고리 필터 URL(`/?category=...`)은 포함하지 않는다 — 중복 콘텐츠 회피.

### 구조화 데이터 (Structured Data)
- **D-11:** 직업 상세 페이지에 **JSON-LD `Occupation` 스키마**를 추가한다 — research `PITFALLS.md` Pitfall 6 권장. SEO 도메인 내 작업으로 이번 페이즈에 포함 (ROADMAP 잠긴 성공기준 title/description/OG 밖이지만 같은 SEO 도메인). 구글 리치 결과/검색 그래프 노출에 유리.

### Claude's Discretion
- `revalidatePath` 헬퍼 모듈의 위치·형태 (예: `lib/revalidate.ts`에 `revalidateHome()`/`revalidateJob(slug)` 함수). 이번 페이즈에는 호출자가 없으므로 export만 — 동작 검증용 임시 호출은 플래너 재량.
- 공용 정적 OG 이미지 파일의 실제 제작/디자인 (브랜딩·크기 1200×630 등) — 플래너/실행 재량. `app/opengraph-image.{png}` 또는 `public/` 경로 선택 포함.
- JSON-LD `Occupation` 스키마의 정확한 필드 매핑 (`name`, `description`, `occupationalCategory`, `estimatedSalary` 등 — Job 필드 → schema.org 속성 매핑) — 플래너 재량.
- `sitemap.ts`의 `changefreq`/`priority` 필드 포함 여부 — 플래너 재량 (필수 아님).
- `generateMetadata`의 `openGraph` 외 `twitter` 카드 블록 포함 여부 — 플래너 재량.
- 홈 `/`의 `generateMetadata`(또는 정적 metadata) 처리 — 직업 페이지가 핵심이나 `/`의 메타데이터도 layout 정적값보다 구체화할지는 재량.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `REQUIREMENTS.md` — FND-01 (모든 직업 상세 페이지가 SSR/SSG로 렌더링되어 검색엔진 노출), FND-02 (직업별 고유 SEO 메타데이터 title/description/OG)
- `ROADMAP.md` Phase 6 섹션 — Success criteria 4개 + Tasks (SC 이름: SSR/SSG & SEO)

### Prior phase context
- `phases/05-keyword-search/05-CONTEXT.md` — `/`가 `?q=`·`?category=` search param으로 동적이라는 점, 첫 클라이언트 컴포넌트 `<SearchBar>` 도입 (Phase 6 "accidental 'use client' 제거"가 건드리면 안 됨), `app/page.tsx` Server Component 구조
- `phases/03-job-detail-page/03-CONTEXT.md` — `generateMetadata`+`generateStaticParams`가 Phase 6 작업으로 이미 명시(D-12 인접), 상세 페이지 구조, 커스텀 Tailwind 패턴
- `phases/04-external-links/04-CONTEXT.md` — Phase 6 통합 노트("상세 페이지 SSR/SSG — 외부 링크는 외부 fetch 없어 정적 렌더 가능")

### Research
- `research/SUMMARY.md` — 스택 결정(Next.js 16.2 App Router, React 19, ISR + `revalidatePath` 패턴 권장), "Decisions Already Made" 중 SSR/SSG 관련
- `research/PITFALLS.md` Pitfall 6 (SEO Neglect) — title 형식 `{직업명} - 기술, 연봉, 진로 | CS Career Compass`, JSON-LD `Occupation` 스키마, 빌드 시 `sitemap.xml`, `generateMetadata` per route 권장. line 189 라우팅/URL은 "post-launch 변경 어려움" — 이번에 제대로 할 것.
- `research/ARCHITECTURE.md` — 공개 읽기 경로(Server Components → Prisma → DB, ISR 캐시), slug 기반 SEO URL

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/jobs/[slug]/page.tsx` (Phase 3) — Server Component. `prisma.job.findUnique({ where: { slug, isPublished: true }})`로 조회. **`generateMetadata`·`generateStaticParams` 없음** — 이번 페이즈에서 추가. `notFound()`로 미발행/없는 slug 처리 중.
- `app/layout.tsx` — 현재 정적 `metadata`만(`title`/`description`), 모든 페이지 동일. `metadataBase` 없음 — 추가 필요. `lang="ko-KR"` 설정됨. (참고: ROADMAP Phase 1이 명시한 Pretendard/Noto Sans KR `next/font` 배선은 현재 layout에 없음 — Phase 6 범위 밖, 별도 관찰 사항.)
- `app/page.tsx` (Phase 2/5) — 홈 Server Component, `searchParams`로 `category`(+Phase 5의 `q`) 처리.
- `lib/db.ts` — Prisma singleton (`import { prisma } from "@/lib/db"`)
- `prisma/schema.prisma` `Job` 모델 — `slug @unique`, `summary`(필수 String), `title`, `updatedAt @updatedAt`, `isPublished`, 연봉 필드 등. sitemap `lastModified`·meta description에 필요한 필드 모두 존재.

### Established Patterns
- 공개 라우트는 100% Server Component (Phase 1~4). Phase 5에서 `<SearchBar>` 단 하나만 클라이언트 컴포넌트로 추가 — Phase 6의 "accidental 'use client' 제거" 작업은 이 의도된 컴포넌트를 **제외**해야 한다.
- 공개 Prisma 읽기는 `isPublished: true` 필터 필수 — `generateStaticParams`/`sitemap.ts`의 직업 enumerate에도 동일 적용.
- Next.js 16 App Router 규약: `generateMetadata`/`generateStaticParams`는 라우트 파일 export, `app/sitemap.ts`/`app/robots.ts`는 파일 컨벤션.
- `next.config.ts`에 `experimental.typedRoutes: true` 설정됨 — 라우트 타입 안전.

### Integration Points
- Phase 3 → Phase 6: `app/jobs/[slug]/page.tsx`에 `generateMetadata` + `generateStaticParams` export 추가.
- Phase 5 → Phase 6: `/`의 동적 특성 확인 — search param 의존이라 정적 생성 비대상, 동적 SSR로 SC 1 충족.
- Phase 6 → Phase 8: `revalidatePath` 헬퍼를 만들어 두고, Phase 8 어드민 `createJob`/`updateJob`/`deleteJob` Server Action이 import해 호출한다 (이번 페이즈엔 호출자 없음).
- Phase 6 → Phase 7: `robots.ts`가 미리 `/admin`·`/auth`를 disallow — Phase 7 어드민 인증 라우트 도입 시 추가 작업 불필요.
- Phase 9: `NEXT_PUBLIC_SITE_URL` env var를 Vercel 운영 도메인으로 설정 (`.env.example`에 이번 페이즈가 항목 추가).

</code_context>

<specifics>
## Specific Ideas

- 직업 페이지 title 예시: `백엔드 개발자 - 기술, 연봉, 진로 | CS Career Compass`
- `metadataBase`: `new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")`
- sitemap 항목: `/`(lastModified 생략 가능) + 발행 직업마다 `{ url: '/jobs/{slug}', lastModified: job.updatedAt }`
- robots disallow 대상: `/admin`, `/auth` (Phase 7 도입 예정 경로 선반영)
- JSON-LD: `<script type="application/ld+json">` with schema.org `Occupation` — 직업 페이지에 삽입
- 공용 OG 이미지: 1200×630 사이트 브랜딩 이미지 1장

</specifics>

<deferred>
## Deferred Ideas

- 직업별 동적 OG 이미지 생성(`opengraph-image.tsx` / `ImageResponse` / `/api/og`) — v1은 공용 정적 이미지로 충분. v2 KakaoTalk 공유(EXP-04) 작업 시 재검토.
- sitemap에 카테고리 필터 URL(`/?category=...`) 포함 — 중복 콘텐츠 우려로 제외. 향후 SEO 분석 후 재검토 가능.
- 시간 기반 ISR `revalidate` — 어드민 온디맨드 무효화로 충분, 불필요.
- Pretendard / Noto Sans KR `next/font` 배선이 현재 `app/layout.tsx`에 없음 — Phase 1 ROADMAP 항목이나 현 코드에 미반영. Phase 6 범위(SEO) 밖 — 별도 보정 필요 시 회고/백로그 항목.
- 애널리틱스(Vercel Analytics 등) — v2.

</deferred>

---

*Phase: 6-SSR-SSG-SEO*
*Context gathered: 2026-05-20*
