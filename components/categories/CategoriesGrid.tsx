// components/categories/CategoriesGrid.tsx
"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import type { SubCategory } from "./CategoryContainer";

// Types matching the nested Prisma query
type LeafCategory = { id: string; name: string; slug: string };

interface CategoryGridProps {
  childrenCategories: SubCategory[]; // These are Level 1 categories (e.g., "Engineering")
  citySlug?: string; // 👇 1. Naya prop accept kiya
}

export default function CategoryGrid({ childrenCategories, citySlug }: CategoryGridProps) {
  if (!childrenCategories || childrenCategories.length === 0) {
    return (
      <section className="container mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">No sub-categories found.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {childrenCategories.map((subCat) => (
          // Rendering a 'CategoryGroup' for each Level 1 category
          <div key={subCat.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="rounded-xl bg-amber-50 p-2">
                <GraduationCap className="h-5 w-5 text-amber-500" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">{subCat.name}</h2>
            </div>

            {/* Rendering Level 2 (Leaf nodes) as actionable links */}
            <div className="space-y-2">
              {subCat.children.length > 0 ? (
                subCat.children.map((leaf) => {
                  
                  // 🚀 2. THE MAGIC ROUTING LOGIC
                  // Agar city hai toh /[category]/[city] pe bhejo, warna /[category] pe
                  const targetUrl = citySlug 
                    ? `/${leaf.slug}/${citySlug}` 
                    : `/${leaf.slug}`;

                  return (
                    <Link
                      key={leaf.slug}
                      href={targetUrl} // 👈 3. Updated dynamic link
                      className="group flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-slate-50 border border-transparent hover:border-slate-100"
                    >
                      <span className="text-sm font-medium text-slate-600 group-hover:text-amber-600">
                        {leaf.name}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-amber-500" />
                    </Link>
                  );
                })
              ) : (
                <p className="text-sm text-slate-400 italic px-4">Coming soon...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}