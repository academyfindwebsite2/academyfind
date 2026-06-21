// components/categories/CategoriesGrid.tsx
"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import type { SubCategory } from "./CategoryContainer";

// 👇 1. Type me _count add kiya jo Prisma hume dega
type LeafCategory = { 
  id: string; 
  name: string; 
  slug: string; 
  _count?: { institutes: number } 
};

// Override SubCategory to use our updated LeafCategory
interface CategoryGridProps {
  childrenCategories: (Omit<SubCategory, 'children'> & { children: LeafCategory[] })[]; 
  citySlug?: string;
}

export default function CategoryGrid({ childrenCategories, citySlug }: CategoryGridProps) {
 
  const filteredCategories = childrenCategories
    .map((subCat) => {
      const activeLeaves = subCat.children.filter(
        (leaf) => (leaf._count?.institutes || 0) > 0
      );
      return { ...subCat, children: activeLeaves };
    })
    .filter((subCat) => subCat.children.length > 0);

  if (!filteredCategories || filteredCategories.length === 0) {
    return (
      <section className="container mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground font-medium">No active categories found in this section yet.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 items-start">
        {filteredCategories.map((subCat) => (
          <div key={subCat.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="rounded-xl bg-amber-50 p-2">
                <GraduationCap className="h-5 w-5 text-amber-500" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">{subCat.name}</h2>
            </div>

            <div className="space-y-2">
              {subCat.children.map((leaf) => {
                const targetUrl = citySlug 
                  ? `/${leaf.slug}/${citySlug}` 
                  : `/${leaf.slug}`;

                return (
                  <Link
                    key={leaf.slug}
                    href={targetUrl}
                    prefetch={false}
                    className="group flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-slate-50 border border-transparent hover:border-slate-100"
                  >
                    <span className="text-sm font-medium text-slate-600 group-hover:text-amber-600 flex items-center gap-2">
                      {leaf.name}
                      {/* Optional: Aap chaho toh count bhi dikha sakte ho, jaise (12) */}
                      <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                        {leaf._count?.institutes}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-amber-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}