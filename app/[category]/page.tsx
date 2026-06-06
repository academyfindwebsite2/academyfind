import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import formatSlug from "@/lib/formatSlug";

import {
  getCategoryBySlug,
  getCitiesForCategory,
  getFeaturedInstitutesForCategory, // 👈 Naya function import kiya
} from "@/lib/category";

import { getInstitutesByCategory } from "@/lib/category_inst";

import Breadcrumb from "@/components/navigation/BreadCrumbs";
import CategoryHero from "@/components/category/CategoryHero";
import TopCities from "@/components/category/TopCities";
import FeaturedInstitutes from "@/components/category/FeaturedInstitutes";
import InstituteListing from "@/components/category/CategoryInstituteListing";
import CategoryCTA from "@/components/category/CategoryCTA";
import CategoryFAQ from "@/components/category/CategoryFAQ";
import PopularSearches from "@/components/category/PopularSearches";
import WhyChoose from "@/components/category/WhyChoose";
import Pagination from "@/components/navigation/Pagination";
import MapToggleSection from "@/components/maps/MapToggleSection";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>
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

export default async function CategoryPage({ params,searchParams }: PageProps) {
  const { category } = await params;
  const {page} = await searchParams;

  const categoryData = await getCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  // Data fetching
  const cities = await getCitiesForCategory(category);
  const featuredInstitutes = await getFeaturedInstitutesForCategory(category);
  const currentPage = page ? parseInt(page, 10) : 1;

  
  // 👈 Ye actual institutes laane ke liye call hai
  const {institutes,totalPages,totalCount} = await getInstitutesByCategory(category,currentPage); 

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

      <CategoryHero category={categoryData} totalCount={totalCount}/>

      <TopCities category={category} cities={cities} />

      <section className="mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            Explore All {categoryData.name} Institutes
          </h2>
        </div>
        
        <InstituteListing institutes={institutes} />
        <Pagination totalPages={totalPages} />
      </section>

      {/*<FeaturedInstitutes institutes={featuredInstitutes} />*/}
      

      <WhyChoose title={categoryData.name} />

      <PopularSearches categoryName={categoryData.name} />

      <CategoryFAQ categoryName={categoryData.name} />

      <CategoryCTA />
    </main>
  );
}