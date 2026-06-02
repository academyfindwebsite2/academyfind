import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryGroupProps {
  title: string;
  icon: React.ReactNode;
  categories: {
    name: string;
    slug: string;
  }[];
}

export default function CategoryGroup({
  title,
  icon,
  categories,
}: CategoryGroupProps) {
  return (
    <div className="rounded-3xl border bg-card p-6">
      <div className="mb-5 flex items-center gap-3">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className="group flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-muted"
          >
            <span>{category.name}</span>

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}