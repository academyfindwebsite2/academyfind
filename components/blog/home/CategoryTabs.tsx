"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Flame } from "lucide-react";

interface CategoryTabsProps {
  activeCategorySlug?: string;
  categories: { id: string; name: string; slug: string }[];
}

export default function CategoryTabs({
  activeCategorySlug = "",
  categories,
}: CategoryTabsProps) {
  const searchParams = useSearchParams();

  // Preserves search query parameters (like sorting/q) while resetting page to 1
  const getCategoryHref = (slug: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", "1");
    if (!slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    return `/blog?${params.toString()}`;
  };

  return (
    <div className="sticky top-24 z-40 mx-auto mt-8 flex w-full max-w-fit items-center justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto rounded-full border border-slate-200/50 bg-white/70 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl ring-1 ring-slate-900/5 no-scrollbar sm:gap-3">
        
        <div className="hidden items-center gap-2 pl-3 pr-2 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-amber-600 sm:flex">
          <Flame className="h-4 w-4" />
          Browse
        </div>

        <Link
          href={getCategoryHref("")}
          className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
            activeCategorySlug === ""
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          All
        </Link>

        {categories.map((category) => (
          <Link
            key={category.slug}
            href={getCategoryHref(category.slug)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              activeCategorySlug === category.slug
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}