# Features Research: CS Career Compass

**Researched:** 2026-05-14
**Overall confidence:** MEDIUM (web verification unavailable; reasoning from training data on Korean tech job platforms and CS career sites)

## Table Stakes
(must have or users leave)

- **Job category card grid (home page)**: The explicit project premise. Users land expecting a scannable visual catalog of CS career tracks (Software Engineer, Data/AI, Security/Cloud, Mobile/Game). Without this, the product has no surface area. Complexity: Low.
- **Detail page per job**: Description, required skills, salary range, external job-board links. Stated in the brief; without per-job depth the grid is a dead end. Complexity: Low–Medium.
- **Required skills list (visible, scannable)**: CS students' #1 question is "what do I need to learn?" Bullet/tag list of languages, frameworks, fundamentals (CS theory, algorithms), tools. Complexity: Low.
- **Salary range (연봉)**: Korean students rank this near the top of decision factors; ambiguity drives them to Blind/JobPlanet. Must show entry-level (신입) vs. mid-level (경력) at minimum. Complexity: Low (display) — Medium (sourcing credible data).
- **External job board links per role**: LinkedIn, 사람인 (Saramin), 원티드 (Wanted), and ideally 점핏 (Jumpit, dev-focused) and 프로그래머스 잡스. Deep-linked to a category-filtered search where possible, not just the homepage. Complexity: Low.
- **Mobile-responsive layout**: Korean students browse heavily on mobile; a desktop-only catalog will lose the majority of sessions. Complexity: Low with Tailwind/modern CSS.
- **Korean-first copy (한국어 우선)**: This is for Korean CS students. English-only or machine-translated copy signals the product isn't for them. Complexity: Low (content work, not engineering).
- **Admin content management**: Stated in the brief. At minimum: CRUD on jobs, skills, salary bands, external links, with auth. Complexity: Medium.
- **Fast load + clean visual hierarchy**: Card grids that feel laggy or cluttered get bounced. Complexity: Low if static/SSG.
- **Basic search or category filter**: Even with only 4 categories, users want to narrow. Complexity: Low.

## Differentiators
(competitive advantage, worth building)

- **Learning roadmap per career (단계별 학습 경로)**: For each job, a recommended sequence (fundamentals → intermediate → advanced → portfolio projects). Inspired by roadmap.sh but Korean-localized. Complexity: Medium.
- **Curated Korean learning resources per skill**: Inflearn, 부스트코스, 프로그래머스 courses, YouTube channels (노마드코더, 드림코딩), books. Curation is the value. Complexity: Medium.
- **Bootcamp comparison per track**: 우아한테크코스, 네이버 부스트캠프, 카카오 테크 캠퍼스, 코드스테이츠, 패스트캠퍼스, 엘리스, 코드잇. Cost, duration, KDT 국비지원 eligibility, hiring outcomes. Complexity: Medium–High.
- **신입 채용 공고 라이브 피드**: Current entry-level postings per category from 원티드/점핏. Bridges "explore" to "apply." Complexity: Medium (manual) — High (API).
- **Tech stack heatmap by Korean company tier**: Which stacks 네카라쿠배당토 actually use. Korean CS students obsess over company tiers. Complexity: Medium.
- **신입 vs. 경력 entry difficulty indicator**: Honest signaling of "이 분야는 신입 채용이 거의 없음." Complexity: Low (content).
- **"하루 일과" (day in the life)**: Short narrative of what each role actually does day-to-day. Complexity: Low–Medium.
- **Portfolio/project ideas per role**: Concrete project suggestions with difficulty tier. Complexity: Medium.
- **인턴십 / 산학협력 기회 surfacing**: SW마에스트로, SSAFY, 우아한테크코스, 네이버 부스트캠프, 카카오 테크 캠퍼스. Complexity: Medium.
- **Dark mode**: Korean dev-audience users expect it. Complexity: Low.

## Anti-Features
(deliberately NOT build)

- **User accounts / auth for browsers**: A read-only catalog needs no login. Adds PIPA obligations for zero MVP value. (Admin auth only.)
- **Live job board (full ATS clone)**: Don't compete with 사람인/원티드/점핏 on their core function. Link out; don't replicate.
- **Salary crowdsourcing / community submissions**: Blind, JobPlanet, 크레딧잡 own this. Requires moderation and critical mass.
- **Forums / comments / community**: Moderation burden; OKKY, 인프런 커뮤니티 already serve this.
- **Quizzes / "what career fits you" personality tests**: Low-signal; heavy to build well.
- **Generic Western salary data**: Don't show Glassdoor US salaries for Korean students.
- **AI chatbot / GPT wrapper**: Hallucination risk on Korean-market specifics; curated source beats chatbot.
- **Video content production**: Link to YouTube/Inflearn. Don't host videos.
- **Endless trending feeds / news aggregation**: Dilutes product purpose.
- **Excessive job subcategories at MVP**: 4 categories is correct. Adding more creates empty pages.

## Korean Market Specifics

- **Company tier vocabulary is essential**: 네카라쿠배당토, 빅테크, 유니콘, 중견, SI, 스타트업, 공기업, 금융권 IT. Students mentally map every role to a tier.
- **신입/경력 dichotomy is sharper than in the West**: Korean hiring strongly distinguishes 신입 공채, 경력직, 인턴 → 정규직 전환. Surfacing which roles realistically hire 신입 directly is high-signal.
- **국비지원 / KDT (K-Digital Training)**: Government-subsidized bootcamps are a major pathway. 내일배움카드 eligibility is a knowledge gap worth filling.
- **Premier programs students target**: SSAFY, 우아한테크코스, 네이버 부스트캠프, 카카오 테크 캠퍼스, SW마에스트로, 42 서울.
- **자격증 culture**: 정보처리기사, SQLD, ADsP, AWS/Azure/GCP certs. Korean job postings list certs more rigidly than Western ones.
- **병역특례 / 산업기능요원 / 전문연구요원**: Military service alternatives matter enormously for male CS students.
- **사람인 vs. 원티드 vs. 점핏 audience split**: Wanted/Jumpit/Programmers skew startup and dev-focused; Saramin/JobKorea are broader and skew 대기업/SI. Linking should be tier-appropriate.
- **Salary norms by tier**: 네카라쿠배 신입 ~5,000–6,500만원, 유니콘 ~4,500–6,000만원, 중견 ~3,500–4,500만원, SI ~2,800–3,500만원.
- **KakaoTalk share**: Korean students share via KakaoTalk far more than Twitter. Optimize OG tags + Kakao share button.
- **Korean web fonts**: Pretendard, Noto Sans KR, or SUIT are the de facto modern Korean web fonts.
- **개인정보보호법 (PIPA)**: Another reason to avoid user accounts at MVP.

## Feature Complexity Notes

| Feature | Complexity | Rationale |
|---|---|---|
| Card grid home | Low | Static layout, 4–8 cards |
| Job detail page | Low–Medium | Template + content authoring |
| Skill tag display | Low | Static lists / simple model |
| Salary range display | Low | Display trivial; sourcing accurate Korean tier data is the work |
| External job links | Low | URL fields with deep-link patterns |
| Category filter / search | Low | Client-side for small N |
| Admin CMS | Medium | Auth + CRUD + content model; biggest backend chunk |
| Korean copy / i18n setup | Low | Single-locale ko-KR is simplest path |
| Mobile responsive | Low | Tailwind utilities |
| Dark mode | Low | Tailwind `dark:` |
| Learning roadmap per role | Medium | Content-heavy; static roadmap doc per role is fine |
| Curated resources per skill | Medium | Ongoing content maintenance |
| Bootcamp comparison | Medium–High | Wide content scope + accuracy burden |
| 신입 채용 live feed | Medium–High | API/RSS availability is the unknown; start manual/curated |
| Tier × stack heatmap | Medium | Research-heavy content; rendering is trivial |
| Career compare view | Medium | UI work + content normalization |
| Day-in-the-life narrative | Low–Medium | Content writing |
| Project ideas per role | Medium | Content writing + curation |
| Internship/SSAFY catalog | Medium | Separate content vertical |
| KakaoTalk share button | Low | SDK integration |

## Dependencies Between Features

```
Admin CMS
  ├─> Job category data model
  │     ├─> Card grid (home)
  │     └─> Job detail page
  │           ├─> Skills (list)
  │           │     └─> Curated resources per skill (differentiator)
  │           ├─> Salary range
  │           ├─> External job board links
  │           ├─> Day-in-the-life
  │           ├─> Project ideas
  │           └─> Learning roadmap (differentiator)
  │
  ├─> Bootcamp catalog (separate content vertical, links from job pages)
  │     └─> Bootcamp comparison view
  │
  └─> Internship/programs catalog (SSAFY/부스트캠프/SW마에스트로)
        └─> Links from job detail pages
```

**Build-order implication:** Admin CMS + data model → static job detail pages → home grid → external links/share → then layer differentiators (roadmap, resources, bootcamp catalog).
