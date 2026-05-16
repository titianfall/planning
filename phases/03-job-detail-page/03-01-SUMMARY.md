# Plan 03-01 Summary: Schema Migration + Shared Utils + Dependency Install

**Status:** Complete  
**Commit:** 66d522d

## What was done

### T01: Schema migration (entryDifficulty → hiringDifficulty)
- Migration `20260517000000_rename_entry_difficulty` already applied via prior commit (ba8f6a1)
- SQLite `RENAME COLUMN` approach used — zero data loss

### T02: Code reference updates
- `prisma/seed.ts`: all 6 job entries updated to `hiringDifficulty` key
- `app/page.tsx`: inline `job.entryDifficulty` reference updated; also refactored to use `JobCard` component
- Verified: `grep entryDifficulty app/ prisma/ lib/` returns 0 results

### T03: lib/utils.ts created + JobCard.tsx extracted
- `lib/utils.ts`: exports `parseJsonArray(value: string): string[]` with try/catch
- `app/components/JobCard.tsx`: new server component extracted from page.tsx inline markup, imports `parseJsonArray` from `@/lib/utils`, wraps card in `<Link href="/jobs/[slug]">`
- `app/page.tsx` updated to import and use `JobCard`

### T04: react-markdown + rehype-sanitize installed
- `npm install react-markdown rehype-sanitize` — 84 packages added
- Both packages confirmed in `package.json` dependencies

### Bonus: tsconfig.json fix
- Added `"ignoreDeprecations": "6.0"` to silence TS 6.0 `baseUrl` deprecation error
- `npx tsc --noEmit` now exits clean

## Verification
- ✅ `grep -r entryDifficulty app/ prisma/ lib/` → 0 results
- ✅ `prisma/migrations/20260517000000_rename_entry_difficulty/` exists
- ✅ `npx tsc --noEmit` → no errors
- ✅ `package.json` has react-markdown and rehype-sanitize
- ✅ `lib/utils.ts` exports `parseJsonArray`
