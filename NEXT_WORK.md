# Next Work Handoff: CS Career Compass Phase 1

**Updated:** 2026-05-16  
**Current phase:** Phase 1 - Local Foundation & Data Schema  
**Next session goal:** Docker 환경에서 Phase 1 앱을 정상 실행하고, Prisma migration/seed/Next dev까지 검증한다.

## What Was Done

- Phase 1 방향을 Supabase-first에서 local-first로 수정했다.
- Next.js App Router 기반 앱 골격을 생성했다.
- Tailwind CSS v4/PostCSS 설정을 추가했다.
- Prisma + SQLite schema를 추가했다.
- `Category`, `Job`, `JobLink` 모델을 정의했다.
- `Job`에 추천 확장용 metadata 필드를 포함했다.
  - `interestAreas`
  - `preferredStrengths`
  - `workStyles`
  - `skillLevel`
  - `collaborationLevel`
  - `mathIntensity`
  - `creativityLevel`
  - `entryDifficulty`
- 4개 카테고리와 10개 CS/IT 직군 seed 데이터를 작성했다.
- 기본 homepage가 Prisma에서 category/job 데이터를 읽어 카드 형태로 보여주도록 작성했다.
- Docker 개발 환경 파일을 추가했다.
  - `compose.yaml`
  - `Dockerfile`
  - `.dockerignore`
  - `scripts/docker-dev.sh`
- `README.md`에 Docker 실행법과 Docker Desktop 저장소 오류 대응을 추가했다.

## Important Files

- `package.json` - npm scripts and pinned core versions
- `compose.yaml` - Docker dev runtime, currently uses `node:24-bookworm` without custom build
- `scripts/docker-dev.sh` - container startup script
- `prisma/schema.prisma` - SQLite schema
- `prisma/seed.ts` - realistic CS/IT career seed data
- `app/page.tsx` - Phase 1 smoke page reading data through Prisma
- `lib/db.ts` - Prisma client singleton
- `README.md` - local/Docker setup instructions
- `ROADMAP.md` - Phase 1 revised success criteria
- `REQUIREMENTS.md` - `FND-05`, `FND-06`, `FND-07`

## Current Technical State

Installed package versions are intentionally pinned for compatibility:

- `next`: `^16.2.6`
- `react`: `^19.2.6`
- `react-dom`: `^19.2.6`
- `prisma`: `^6.19.0`
- `@prisma/client`: `^6.19.0`

Reason:

- `prisma@latest` installed Prisma 7.x, which rejected `url = env("DATABASE_URL")` inside `schema.prisma`.
- Phase 1 should stay on Prisma 6.x for the current schema style.
- `next/react/react-dom` were changed from `latest` to explicit compatible versions to avoid unstable Docker installs.

## Docker Status

Docker daemon was checked after manual Docker Desktop restart.

Confirmed:

- `docker version` worked.
- `hello-world` pulled and ran successfully once.
- `docker compose config` was valid.

Blocked:

- Docker Desktop later failed again with internal storage errors:

```text
meta.db: input/output error
blob ... input/output error
snapshot ... no such file or directory
```

This is a Docker Desktop/containerd storage issue, not an app code issue. It happened even when listing images or pulling official images.

## Why Compose Was Changed

Initial Compose used a custom Docker build. The build reached `npx prisma generate`, but Docker Desktop failed while exporting/unpacking image layers.

To reduce reliance on Docker image builds, `compose.yaml` now uses:

```yaml
image: node:24-bookworm
volumes:
  - .:/app
  - node_modules:/app/node_modules
  - next_cache:/app/.next
command: ["sh", "./scripts/docker-dev.sh"]
```

This means the next session can use `docker compose up` without building a custom app image.

## Next Commands To Run

After Docker Desktop is stable:

```powershell
cd C:\Users\qkrwo\.planning
docker compose down --volumes --remove-orphans
docker compose up
```

Expected container startup flow:

```text
npm ci
npx prisma generate
npx prisma migrate dev --name init_local_foundation
npm run db:seed
npm run dev:docker
```

Expected app URL:

```text
http://localhost:3000
```

## Verification Checklist

- `docker compose up` keeps `cs-career-compass-dev` running.
- Logs show `Prisma Client` generated successfully.
- Logs show migration applied or database already in sync.
- Logs show seed script completed without error.
- Logs show Next dev server listening on `0.0.0.0:3000`.
- `http://localhost:3000` returns the CS Career Compass smoke page.
- The page renders 4 categories and seeded job cards.

Optional checks:

```powershell
docker compose exec app npx prisma migrate status
docker compose exec app npm run db:seed
docker compose exec app npm run build
```

## If Docker Storage Errors Continue

Use Docker Desktop UI:

1. Quit Docker Desktop completely.
2. Start Docker Desktop again.
3. If errors continue, use Docker Desktop -> Troubleshoot -> Clean / Purge data.
4. Re-run:

```powershell
docker compose down --volumes --remove-orphans
docker compose up
```

The project itself does not need a custom Docker image right now, so avoid `docker compose build` unless the Dockerfile becomes necessary again.

## Known Follow-Up Work

1. Verify Docker runtime.
2. If migration works, mark Phase 1 implementation as partially complete in `STATE.md`.
3. Run `npm run build` inside Docker or locally after DB setup.
4. If Phase 1 is accepted, continue to Phase 2 using `phases/02-public-catalog-grid-filter/02-CONTEXT.md`.

## Notes For Next Agent

- Do not reintroduce Supabase into Phase 1.
- Keep SQLite for local foundation.
- Keep recommendation metadata as stored job fields only; do not implement recommendation algorithm in v1.
- The established 4 categories are:
  - SW엔지니어
  - 데이터/AI
  - 보안/클라우드
  - 모바일/게임
- Docker failures seen so far were Docker Desktop storage-layer failures, not confirmed app incompatibility.
