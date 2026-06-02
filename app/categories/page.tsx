import CategoriesHero from "@/components/categories/CategoriesHero";
import CategoryStats from "@/components/categories/CategoriesStats";
import CategoryFilters from "@/components/categories/CategoriesFilter";
import CategoryGrid from "@/components/categories/CategoriesGrid";
import MoreCategories from "@/components/categories/MoreCategories";
import CategoryCTA from "@/components/categories/CategoriesCTA";

export default function CategoriesPage() {
  return (
    <>
      <CategoriesHero />
      <CategoryStats />
      <CategoryFilters />
      <CategoryGrid />
      <MoreCategories />
      <CategoryCTA />
    </>
  );
}