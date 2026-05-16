const colorMap: Record<string, string> = {
  "활발": "bg-[#edf6f1] text-[#246b57]",
  "보통": "bg-[#fef8ec] text-[#9c6a00]",
  "거의 없음": "bg-[#f2f2f2] text-[#555]",
};

export function HiringDifficultyBadge({ difficulty }: { difficulty: string }) {
  const colorClass = colorMap[difficulty] ?? "bg-[#f2f2f2] text-[#555]";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${colorClass}`}
    >
      {difficulty}
    </span>
  );
}
