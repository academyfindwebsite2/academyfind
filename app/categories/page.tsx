import CategoriesHero from "@/components/categories/CategoryHero";
import CategoryStats from "@/components/categories/CategoryStats";
import CategoryFilters from "@/components/categories/CategoryFilter";
import CategoryGrid from "@/components/categories/CategoryGrid";
import MoreCategories from "@/components/categories/MoreCategories";
import CategoryCTA from "@/components/categories/CategoryCTA";

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