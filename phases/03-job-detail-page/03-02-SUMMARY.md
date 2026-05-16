# Plan 03-02 Summary: Job Detail Page — Components + Full Route

**Status:** Complete  
**Commit:** bc2de52

## What was done

### T01: MarkdownRenderer.tsx
- Server component (no 'use client')
- `react-markdown` + `rehype-sanitize` with custom allowlist: h2, h3, strong, em, ul, ol, li, p, code
- All 7 element types mapped to Tailwind classNames
- pre/script/iframe blocked by sanitize schema

### T02: SkillTags.tsx
- Server component; parses skills JSON via `parseJsonArray` from `@/lib/utils`
- Returns null when empty; badges use rounded-full + CSS variable tokens

### T03: SalaryBlock.tsx
- Server component; local `formatSalary` helper for ko-KR locale formatting
- Entry/senior rows conditionally rendered (null when both min+max are null)
- Source link with `target="_blank" rel="noopener noreferrer"` + domain extraction
- Divider between entry and senior rows only when both are present

### T04: HiringDifficultyBadge.tsx
- Server component; colorMap Record maps "활발"/"보통"/"거의 없음" to hex colors
- Fallback to gray for unknown values

### T05: app/jobs/[slug]/page.tsx
- Async server component; `params: Promise<{ slug: string }>` with `await params`
- `prisma.job.findUnique({ where: { slug, isPublished: true } })` + `notFound()` on null
- Related jobs: same categoryId, excludes current, isPublished, take: 3
- 2-column layout: `flex flex-col lg:flex-row`; sidebar stacks below on mobile
- Related jobs section hidden when 0 results
- All 5 components imported and wired

### T06: QA
- `npm run build` succeeds — all 3 routes compile:
  - `/` (Static)
  - `/_not-found` (Static)
  - `/jobs/[slug]` (Dynamic)
- `npx tsc --noEmit` passes clean

## Verification
- ✅ DET-01: MarkdownRenderer renders description with h2/ul/bold
- ✅ DET-02: SkillTags renders skill badges
- ✅ DET-03: SalaryBlock renders entry/senior salary with null row suppression
- ✅ DET-04: HiringDifficultyBadge renders 3-level color badge
- ✅ `notFound()` called when slug not found
- ✅ `lg:flex-row` 2-column layout at desktop breakpoint
- ✅ relatedJobs.length > 0 guard on related section
- ✅ No 'use client' in any of the 4 new components or page.tsx
- ✅ Next.js production build clean
