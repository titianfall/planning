import Link from "next/link";
import { prisma } from "@/lib/db";
import { CategoryFilter } from "@/app/components/CategoryFilter";
import { JobCard } from "@/app/components/JobCard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: activeCategory } = await searchParams;

  const [categories, jobs] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.job.findMany({
      where: {
        isPublished: true,
        ...(activeCategory ? { category: { slug: activeCategory } } : {}),
      },
      include: { category: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { title: "asc" }],
    }),
  ]);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-12">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-[var(--line)] pb-6">
          <p className="text-sm font-semibold text-[#246b57]">CS Career Compass</p>
          <h1 className="text-3xl font-bold sm:text-4xl">IT 진로 카탈로그</h1>
          <p className="text-sm text-[var(--muted)]">
            컴퓨터공학부 학생을 위한 국내 IT 직군 안내
          </p>
        </header>

        <CategoryFilter categories={categories} activeSlug={activeCategory} />

        {jobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-[var(--muted)]">해당 카테고리에 직업이 없습니다.</p>
            <Link href="/" className="text-sm text-[#246b57] underline">
              전체 보기
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
