# CS Career Compass

컴퓨터공학부/IT 전공 학생을 위한 진로 탐색 웹 플랫폼입니다. Phase 1은 Docker 또는 로컬 Node 환경에서 Next.js App Router, Tailwind CSS, Prisma + SQLite, 실제 CS/IT 직군 seed 데이터를 검증합니다.

## Docker 개발 실행

```bash
docker compose up
```

컨테이너는 시작 시 다음 작업을 수행합니다.

1. `npm ci`
2. `prisma generate`
3. `prisma migrate dev --name init_local_foundation`
4. `npm run db:seed`
5. `next dev --hostname 0.0.0.0`

앱은 `http://localhost:3000`에서 열립니다. Prisma Studio가 필요하면 별도 터미널에서 다음을 실행합니다.

```bash
docker compose exec app npx prisma studio --hostname 0.0.0.0
```

### Docker Desktop 저장소 오류

`meta.db: input/output error`, `blob ... input/output error`, `snapshot ... no such file or directory`가 나오면 앱 설정 문제가 아니라 Docker Desktop 내부 containerd 저장소 문제입니다. Docker Desktop을 완전히 종료 후 재시작하고, 계속 반복되면 Docker Desktop의 Troubleshoot 메뉴에서 clean/purge data를 실행한 뒤 다시 `docker compose up`을 실행합니다.

## 로컬 Node 실행

```bash
npm install
npm run db:migrate -- --name init_local_foundation
npm run db:seed
npm run dev
```

## 환경 변수

```env
DATABASE_URL="file:./dev.db"
```

Phase 1은 SQLite를 사용합니다. Prisma schema는 이후 Supabase Postgres로 이전할 수 있도록 문자열 ID와 단순 필드 중심으로 유지합니다.
