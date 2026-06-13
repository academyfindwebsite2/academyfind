// app/categories/page.tsx
import { prisma } from "@/lib/prisma";
import CategoryContainer from "@/components/categories/CategoryContainer"; 
import CategoriesHero from "@/components/categories/CategoriesHero";
import CategoryStats from "@/components/categories/CategoriesStats";
import CategoryCTA from "@/components/category/CategoryCTA";
import MoreCategories from "@/components/categories/MoreCategories";

export default async function CategoriesPage({
  searchParams,
}: {
  // 👇 1. searchParams define kiya
  searchParams: Promise<{ city?: string }>;
}) {
  const sp = await searchParams;
  const citySlug = sp.city; // 👇 2. URL se city nikal li (e.g., '?city=delhi')

  const parentCategories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          children: true, 
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <>
      {/* 👇 3. citySlug sabko as prop bhej diya */}
      <CategoriesHero citySlug={citySlug} />
      <CategoryStats />
      <CategoryContainer parentCategories={parentCategories} citySlug={citySlug} />
      <MoreCategories citySlug={citySlug} />  
      <CategoryCTA />
    </>
  );
}