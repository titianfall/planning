import Link from "next/link";
import { parseJsonArray } from "@/lib/utils";

type Job = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  skills: string;
  hiringDifficulty: string;
  category: { name: string };
};

export function JobCard({ job }: { job: Job }) {
  const skills = parseJsonArray(job.skills).slice(0, 4);

  return (
    <Link href={`/jobs/${job.slug}`} className="block">
      <article className="flex min-h-64 flex-col justify-between rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 hover:border-[#246b57] transition-colors">
        <div>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-[#246b57]">{job.category.name}</p>
            <span className="rounded-full bg-[#edf6f1] px-3 py-1 text-xs font-medium text-[#246b57]">
              {job.hiringDifficulty}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-bold">{job.title}</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{job.summary}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              className="rounded-full border border-[var(--line)] px-3 py-1 text-xs"
              key={`${job.id}-${skill}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
