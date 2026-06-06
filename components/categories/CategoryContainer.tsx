// components/categories/CategoryContainer.tsx
"use client";

import { useState } from "react";
import CategoryFilters from "./CategoriesFilter";
import CategoryGrid from "./CategoriesGrid";

// 👇 1. Yahan humne strict 3-level types define kar diye
export type LeafCategory = { id: string; name: string; slug: string };
export type SubCategory = { id: string; name: string; slug: string; children: LeafCategory[] };
export type ParentCategory = { id: string; name: string; slug: string; children: SubCategory[] };

export default function CategoryContainer({
  parentCategories,
}: {
  parentCategories: ParentCategory[]; // 👇 2. Yahan strict type use kiya
}) {
  const [activeParentId, setActiveParentId] = useState<string>(
    parentCategories[0]?.id || ""
  );

  const activeParent = parentCategories.find((cat) => cat.id === activeParentId);
  
  // Ab TypeScript ko 100% pata hai ki activeChildren 'SubCategory[]' hi hai
  const activeChildren = activeParent?.children || [];

  return (
    <div>
      <CategoryFilters 
        parents={parentCategories} 
        activeId={activeParentId} 
        setActiveId={setActiveParentId} 
      />

      <CategoryGrid 
        childrenCategories={activeChildren} // ✅ TS Error Gone!
      />
    </div>
  );
}