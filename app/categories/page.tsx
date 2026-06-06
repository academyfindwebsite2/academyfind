// app/categories/page.tsx
import { prisma } from "@/lib/prisma";
// ... (imports remain same)
import CategoryContainer from "@/components/categories/CategoryContainer"; 
import CategoriesHero from "@/components/categories/CategoriesHero";
import CategoryStats from "@/components/categories/CategoriesStats";
import CategoryCTA from "@/components/category/CategoryCTA";
import MoreCategories from "@/components/categories/MoreCategories";

export default async function CategoriesPage() {
  // DB se Level 0 (parentId: null) aur unke nested children fetch karein
  const parentCategories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          children: true, // 👈 Ye Level 2 (SEO pages) ko bhi fetch kar lega
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <CategoriesHero />
      <CategoryStats />
      
      <CategoryContainer parentCategories={parentCategories} />
      
       <MoreCategories />  
      <CategoryCTA />
    </>
  );
}