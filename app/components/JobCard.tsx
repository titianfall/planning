import Link from "next/link";

type JobCardProps = {
  job: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    skills: string;
    exampleCompanies: string;
    salaryEntryMin: number | null;
    salaryEntryMax: number | null;
    hiringDifficulty: string;
    category: { name: string };
  };
};

function parseJsonArray(value: string): string[] {
  try {
    const p = JSON.parse(value);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

function formatSalary(min: number | null, max: number | null): string | null {
  if (!min && !max) return null;
  if (min && max)
    return `${min.toLocaleString("ko-KR")}~${max.toLocaleString("ko-KR")}만원`;
  if (min) return `${min.toLocaleString("ko-KR")}만원~`;
  return `~${max!.toLocaleString("ko-KR")}만원`;
}

function getDifficultyClass(difficulty: string): string {
  if (difficulty === "활발") return "bg-[#edf6f1] text-[#246b57]";
  if (difficulty === "보통") return "bg-[#fef8ec] text-[#9c6a00]";
  return "bg-[#f2f2f2] text-[#555]";
}

export function JobCard({ job }: JobCardProps) {
  const skills = parseJsonArray(job.skills).slice(0, 3);
  const companies = parseJsonArray(job.exampleCompanies).slice(0, 3);
  const salary = formatSalary(job.salaryEntryMin, job.salaryEntryMax);

  return (
    <Link href={`/jobs/${job.slug}`} className="block hover:shadow-md transition">
      <article className="flex min-h-56 flex-col justify-between rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold text-[#246b57]">{job.category.name}</p>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-medium ${getDifficultyClass(job.hiringDifficulty)}`}
            >
              {job.hiringDifficulty}
            </span>
          </div>
          <h2 className="text-xl font-bold leading-snug">{job.title}</h2>
          <p className="text-sm leading-6 text-[var(--muted)]">{job.summary}</p>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {companies.length > 0 && (
            <p className="text-xs text-[var(--muted)]">{companies.join(" · ")}</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={`${job.id}-${skill}`}
                className="rounded-full border border-[var(--line)] px-2.5 py-0.5 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
          {salary && (
            <p className="text-xs text-[var(--muted)]">
              신입 <span className="font-medium text-[var(--foreground)]">{salary}</span>
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
