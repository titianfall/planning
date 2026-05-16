import Link from "next/link";

type Props = {
  categories: { id: string; slug: string; name: string }[];
  activeSlug: string | undefined;
};

export function CategoryFilter({ categories, activeSlug }: Props) {
  return (
    <nav aria-label="카테고리 필터" className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={
          activeSlug === undefined
            ? "rounded-full bg-[#246b57] text-white px-4 py-1.5 text-sm font-medium"
            : "rounded-full border border-[var(--line)] px-4 py-1.5 text-sm hover:border-[#246b57] hover:text-[#246b57] transition"
        }
      >
        전체
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/?category=${cat.slug}`}
          className={
            cat.slug === activeSlug
              ? "rounded-full bg-[#246b57] text-white px-4 py-1.5 text-sm font-medium"
              : "rounded-full border border-[var(--line)] px-4 py-1.5 text-sm hover:border-[#246b57] hover:text-[#246b57] transition"
          }
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
}
