import { prisma } from "@/lib/db";

function parseList(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.slice(0, 4) : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [categories, jobs] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.job.findMany({
      where: { isPublished: true },
      include: { category: true, links: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { title: "asc" }]
    })
  ]);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-12">
      <section className="mx-auto flex max-w-6xl flex-col gap-7">
        <header className="flex flex-col gap-4 border-b border-[var(--line)] pb-7">
          <p className="text-sm font-semibold text-[#246b57]">CS Career Compass</p>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              컴퓨터공학부 학생을 위한 IT 진로 탐색 기반
            </h1>
            <p className="text-base leading-7 text-[var(--muted)]">
              Phase 1은 로컬 데이터 구조와 실제 직군 seed를 검증합니다. 이후 카탈로그,
              상세 페이지, 관리자 입력, 추천 fit 기능으로 확장됩니다.
            </p>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article
              className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4"
              key={category.id}
            >
              <p className="text-sm font-semibold text-[#246b57]">{category.name}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {category.description}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <article
              className="flex min-h-64 flex-col justify-between rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5"
              key={job.id}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-[#246b57]">
                    {job.category.name}
                  </p>
                  <span className="rounded-full bg-[#edf6f1] px-3 py-1 text-xs font-medium text-[#246b57]">
                    {job.entryDifficulty}
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-bold">{job.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {job.summary}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {parseList(job.skills).map((skill) => (
                  <span
                    className="rounded-full border border-[var(--line)] px-3 py-1 text-xs"
                    key={`${job.id}-${skill}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
