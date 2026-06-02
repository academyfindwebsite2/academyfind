import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InstituteCard from "@/components/institutes/InstituteCard";

import formatSlug from "@/lib/formatSlug";

import {
  getCategoryBySlug,
  getCitiesForCategory,
  getFeaturedInstitutesForCategory,
} from "@/lib/category";
import Breadcrumb from "@/components/navigation/BreadCrumbs";
import CategoryHero from "@/components/category/CategoryHero";
import TopCities from "@/components/category/TopCities";
import FeaturedInstitutes from "@/components/category/FeaturedInstitutes";
import CategoryCTA from "@/components/category/CategoryCTA";
import CategoryFAQ from "@/components/category/CategoryFAQ";
import PopularSearches from "@/components/category/PopularSearches";
import WhyChoose from "@/components/category/WhyChoose";


export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;

  const categoryName = formatSlug(category);

  return {
    title: `Best ${categoryName} Institutes in India | AcademyFind`,
    description: `Discover top ${categoryName} institutes across India. Compare cities, reviews and courses.`,
  };
}

export default async function CategoryPage({
  params,
}: PageProps) {
  const { category } = await params;

  const categoryData =
    await getCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  const cities = 
    await getCitiesForCategory(category);

  const featuredInstitutes =
    await getFeaturedInstitutesForCategory(
      category
    );

  return (
  <main className="max-w-7xl mx-auto px-6 py-10">
    <Breadcrumb
      items={[
        {
          label: categoryData.name,
          href: `/${category}`,
        },
      ]}
    />

    <CategoryHero category={categoryData} />

    <TopCities
      category={category}
      cities={cities}
    />

    <FeaturedInstitutes
      institutes={featuredInstitutes}
    />

    <WhyChoose
      title={categoryData.name}
    />

    <PopularSearches categoryName={categoryData.name} />

    <CategoryFAQ
      categoryName={categoryData.name}
    />

    <CategoryCTA />
  </main>
);
}