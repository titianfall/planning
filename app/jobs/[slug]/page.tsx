import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import { MarkdownRenderer } from "@/app/components/MarkdownRenderer";
import { SkillTags } from "@/app/components/SkillTags";
import { SalaryBlock } from "@/app/components/SalaryBlock";
import { HiringDifficultyBadge } from "@/app/components/HiringDifficultyBadge";
import { JobCard } from "@/app/components/JobCard";

function formatSalary(min: number | null, max: number | null): string | null {
  if (!min && !max) return null;
  if (min && max)
    return `${min.toLocaleString("ko-KR")}~${max.toLocaleString("ko-KR")}만원`;
  if (min) return `${min.toLocaleString("ko-KR")}만원~`;
  return `~${max!.toLocaleString("ko-KR")}만원`;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const job = await prisma.job.findUnique({
    where: { slug, isPublished: true },
    include: { category: true },
  });

  if (!job) notFound();

  const relatedJobs = await prisma.job.findMany({
    where: {
      categoryId: job.categoryId,
      id: { not: job.id },
      isPublished: true,
    },
    take: 3,
    include: { category: true },
  });

  const exampleCompanies = parseJsonArray(job.exampleCompanies);
  const entrySalary = formatSalary(job.salaryEntryMin, job.salaryEntryMax);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/"
          className="inline-flex items-center text-sm text-[#246b57] hover:underline"
        >
          ← 직업 목록
        </Link>

        <header className="mt-6 border-b border-[var(--line)] pb-6 flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#246b57]">
            {job.category.name}
          </span>
          <h1 className="text-2xl font-bold sm:text-3xl">{job.title}</h1>
          {exampleCompanies.length > 0 && (
            <p className="text-sm text-[var(--muted)]">
              {exampleCompanies.join(" · ")}
            </p>
          )}
          {entrySalary && (
            <p className="text-sm text-[var(--muted)]">신입 {entrySalary}</p>
          )}
        </header>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-12">

          <section className="lg:flex-[2] min-w-0">
            <MarkdownRenderer content={job.description ?? ""} />
          </section>

          <aside className="flex flex-col gap-6 lg:flex-[1]">

            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                신입 취업 난이도
              </h2>
              <HiringDifficultyBadge difficulty={job.hiringDifficulty} />
            </div>

            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                연봉
              </h2>
              <SalaryBlock
                salaryEntryMin={job.salaryEntryMin}
                salaryEntryMax={job.salaryEntryMax}
                salarySeniorMin={job.salarySeniorMin}
                salarySeniorMax={job.salarySeniorMax}
                salarySourceUrl={job.salarySourceUrl}
                salaryAsOfYear={job.salaryAsOfYear}
              />
            </div>

            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                필요 기술
              </h2>
              <SkillTags skills={job.skills} />
            </div>

          </aside>
        </div>

        {relatedJobs.length > 0 && (
          <section className="mt-12 border-t border-[var(--line)] pt-8">
            <h2 className="mb-4 text-lg font-semibold">관련 직업</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedJobs.map((relJob) => (
                <JobCard key={relJob.id} job={relJob} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
