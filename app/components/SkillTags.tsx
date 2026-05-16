import { parseJsonArray } from "@/lib/utils";

export function SkillTags({ skills }: { skills: string }) {
  const tags = parseJsonArray(skills);

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((skill) => (
        <span
          key={skill}
          className="text-xs px-2.5 py-1 bg-[var(--panel)] border border-[var(--line)] rounded-full text-[var(--foreground)]"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
