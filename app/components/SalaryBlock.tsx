type Props = {
  salaryEntryMin: number | null;
  salaryEntryMax: number | null;
  salarySeniorMin: number | null;
  salarySeniorMax: number | null;
  salarySourceUrl: string | null;
  salaryAsOfYear: number | null;
};

function formatSalary(min: number | null, max: number | null): string | null {
  if (!min && !max) return null;
  if (min && max)
    return `${min.toLocaleString("ko-KR")}~${max.toLocaleString("ko-KR")}만원`;
  if (min) return `${min.toLocaleString("ko-KR")}만원~`;
  return `~${max!.toLocaleString("ko-KR")}만원`;
}

export function SalaryBlock({
  salaryEntryMin,
  salaryEntryMax,
  salarySeniorMin,
  salarySeniorMax,
  salarySourceUrl,
  salaryAsOfYear,
}: Props) {
  const entryRange = formatSalary(salaryEntryMin, salaryEntryMax);
  const seniorRange = formatSalary(salarySeniorMin, salarySeniorMax);

  return (
    <div className="flex flex-col gap-2">
      {entryRange && (
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">신입</span>
          <span className="font-medium">{entryRange}</span>
        </div>
      )}
      {entryRange && seniorRange && (
        <div className="border-b border-[var(--line)]" />
      )}
      {seniorRange && (
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">경력</span>
          <span className="font-medium">{seniorRange}</span>
        </div>
      )}
      {salarySourceUrl && salaryAsOfYear && (
        <p className="text-xs text-[var(--muted)] mt-2">
          출처:{" "}
          <a
            href={salarySourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {(() => {
              try {
                return new URL(salarySourceUrl).hostname;
              } catch {
                return "링크";
              }
            })()}
          </a>{" "}
          ({salaryAsOfYear}년 기준)
        </p>
      )}
    </div>
  );
}
