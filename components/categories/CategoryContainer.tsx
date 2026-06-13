"use client";

import { useState } from "react";
import CategoryFilters from "./CategoriesFilter";
import CategoryGrid from "./CategoriesGrid";

export type LeafCategory = { id: string; name: string; slug: string };
export type SubCategory = { id: string; name: string; slug: string; children: LeafCategory[] };
export type ParentCategory = { id: string; name: string; slug: string; children: SubCategory[] };

export default function CategoryContainer({
  parentCategories,
  citySlug, // 👇 Naya prop accept kiya
}: {
  parentCategories: ParentCategory[];
  citySlug?: string;
}) {
  const [activeParentId, setActiveParentId] = useState<string>(
    parentCategories[0]?.id || ""
  );

  const activeParent = parentCategories.find((cat) => cat.id === activeParentId);
  const activeChildren = activeParent?.children || [];

  return (
    <div>
      <CategoryFilters 
        parents={parentCategories} 
        activeId={activeParentId} 
        setActiveId={setActiveParentId} 
      />

      {/* 👇 Grid component ko citySlug bhej diya taaki wo apne links me isko jod sake */}
      <CategoryGrid 
        childrenCategories={activeChildren} 
        citySlug={citySlug} 
      />
    </div>
  );
}