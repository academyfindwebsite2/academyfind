import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import formatSlug from "@/lib/formatSlug";

import {
  getCategoryBySlug,
  getCitiesForCategory,
  getFeaturedInstitutesForCategory, 
} from "@/lib/category/category";

import { getInstitutesByCategory } from "@/lib/category/category_inst";

import Breadcrumb from "@/components/navigation/BreadCrumbs";
import CategoryHero from "@/components/category/CategoryHero";
import TopCities from "@/components/category/TopCities";
import InstituteListing from "@/components/category/CategoryInstituteListing";
import CategoryCTA from "@/components/category/CategoryCTA";
import CategoryFAQ from "@/components/category/CategoryFAQ";
import PopularSearches from "@/components/category/PopularSearches";
import WhyChoose from "@/components/category/WhyChoose";
import Pagination from "@/components/navigation/Pagination";
import CategoryFilters from "@/components/category/CategoryFilter";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    rating?: string;  
    mode?: string;    
    fee?: string;     
    userLat?: string;   
    userLng?: string;   
    closestUser?: string;
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

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  
  // 🚀 Catch all query strings seamlessly
  const { page, q, sort, rating, mode, userLat, userLng, closestUser } = await searchParams;

  const categoryData = await getCategoryBySlug(category);
  if (!categoryData) {
    notFound();
  }

  const cities = await getCitiesForCategory(category);
  const currentPage = page ? parseInt(page, 10) : 1;

  const isClosestActive = closestUser === "true";
  const parsedLat = isClosestActive && userLat ? parseFloat(userLat) : undefined;
  const parsedLng = isClosestActive && userLng ? parseFloat(userLng) : undefined;

  // 🚀 Pass the new filters into the backend query function
  const { institutes, totalPages, totalCount } = await getInstitutesByCategory(
    category,
    currentPage,
    q,
    sort,
    rating,
    mode,
    parsedLat,
    parsedLng
  ); 

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
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

      {/* 🚀 PREMIUM SIDEBAR & GRID LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8 relative mt-16">
        {/* Sticky Filters Panel */}
        <aside className="lg:w-64 shrink-0 relative lg:sticky lg:top-24 self-start h-fit z-10 mb-6 lg:mb-0">
          <div className="sticky top-24">
            <CategoryFilters category={category} />
          </div>
        </aside>

        {/* Dynamic Content Grid View */}
        <div className="flex-1 min-w-0 w-full">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Explore All {categoryData.name} Institutes
            </h2>
            {isClosestActive && (
               <p className="text-sm text-slate-500 bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1 rounded-full w-fit flex items-center gap-2">
                 <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 Sorted by: <strong>Closest to Me</strong>
               </p>
            )}
            {q && (
               <p className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                 Filtered by: <span className="font-semibold">"{q}"</span>
               </p>
            )}
          </div>
          
          <InstituteListing institutes={institutes} category={category}/>
          <Pagination totalPages={totalPages} />
        </div>
      </div>

      <WhyChoose title={categoryData.name} />
      <PopularSearches categoryName={categoryData.name} />
      <CategoryFAQ categoryName={categoryData.name} />
      <CategoryCTA />
    </main>
  );
}