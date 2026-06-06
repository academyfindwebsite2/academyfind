import { getInstitutesByCategoryAndCity } from "@/lib/institutes_cat_city";
import type { Metadata } from "next";
import formatSlug from "@/lib/formatSlug";

import Breadcrumb from "@/components/navigation/BreadCrumbs";
import CityHero from "@/components/City_Category/CityHero";
import CityFilters from "@/components/City_Category/CityFilters";
import InstituteListing from "@/components/City_Category/InstituteListing";
import CityAbout from "@/components/City_Category/CityAbout";
import RelatedCities from "@/components/City_Category/RelatedCities";
import CityFAQ from "@/components/City_Category/CityFAQ";
import CityCTA from "@/components/City_Category/CityCTA";
import Pagination from "@/components/navigation/Pagination";

// Naya component import karein
import MapToggleSection from "@/components/maps/MapToggleSection"; 

export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    category: string;
    city: string;
  }>;
  searchParams: Promise<{
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, city } = await params;

  const categoryName = formatSlug(category);
  const cityName = formatSlug(city);

  return {
    title: `Best ${categoryName} in ${cityName} | AcademyFind`,
    description: `Discover the best ${categoryName} in ${cityName}.`,
  };
}

// Server Component (No 'useState' here)
export default async function CategoryCityPage({
  params,
  searchParams,
}: PageProps) {
  const { category, city } = await params;
  const { sort,page } = await searchParams;

  const categoryName = formatSlug(category);
  const cityName = formatSlug(city);

  const currentPage = page ? parseInt(page, 10) : 1;

  const {institutes, totalPages} = await getInstitutesByCategoryAndCity(
    category,
    city,
    sort,
    currentPage
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <Breadcrumb
        items={[
          {
            label: categoryName,
            href: `/${category}`,
          },
          {
            label: cityName,
            href: `/${category}/${city}`,
          },
        ]}
      />

      <CityHero categoryName={categoryName} cityName={cityName} />

      <CityFilters category={category} city={city} activeSort={sort} />

      <MapToggleSection
        institutes={institutes.map((institute) => ({
          id: institute.id,
          name: institute.name,
          latitude: institute.latitude,
          longitude: institute.longitude,
          slug: `${institute.id}-${institute.slug}`,
        }))}
      />

      <InstituteListing institutes={institutes} />

      <Pagination totalPages={totalPages} />

      <CityAbout categoryName={categoryName} cityName={cityName} />

      <RelatedCities category={category} />

      <CityFAQ categoryName={categoryName} cityName={cityName} />

      <CityCTA />
    </main>
  );
}