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
    q?: string;
    lat?: string;
    lng?: string;     
    address?: string; 
    radius?: string;
    rating?: string;
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

export default async function CategoryCityPage({
  params,
  searchParams,
}: PageProps) {
  const { category, city } = await params;
  // 👇 URL se lat, lng, aur address catch kiya
  const { sort, page, q, lat, lng, address, radius, rating } = await searchParams;

  const categoryName = formatSlug(category);
  const cityName = formatSlug(city);

  const currentPage = page ? parseInt(page, 10) : 1;
  
  // 👇 Strings ko numbers me convert kiya backend ke liye
  const parsedLat = lat ? parseFloat(lat) : undefined;
  const parsedLng = lng ? parseFloat(lng) : undefined;

  const parsedRadius = radius ? parseInt(radius,10) : undefined
  const minRating = rating ? parseFloat(rating) : undefined

  // 👇 Backend function ko lat/lng paas kiye
  const {institutes, totalPages, totalCount, exactAreaMatch} = await getInstitutesByCategoryAndCity(
    category,
    city,
    sort,
    currentPage,
    q,
    parsedLat,
    parsedLng,
    parsedRadius,
    minRating,
  );

  // Fallback text jise hum UI par dikhayenge
  const displayLocationText = address || q || cityName;

  return (
    <main className="max-w-7xl mx-auto px-5 py-10">
      <Breadcrumb
        items={[
          { label: categoryName, href: `/${category}` },
          { label: cityName, href: `/${category}/${city}` },
        ]}
      />

      <CityHero categoryName={categoryName} cityName={cityName} totalCount={totalCount}/>

      <div className="flex flex-col lg:flex-row gap-8 relative mt-8">
        <aside className="lg:w-64 shrink-0 relative lg:sticky lg:top-24 slef-start h-fit z-10 mb-6 lg:mb-0">
        <div className="sticky top-24"> 
          <CityFilters category={category} city={city} hasLocation={!!parsedLat} />
        </div>
      </aside>

      <div className="flex-1 min-w-0 w-full">

        <MapToggleSection
          institutes={institutes.map((institute) => ({
            id: institute.id,
            name: institute.name,
            latitude: institute.latitude,
            longitude: institute.longitude,
            slug: `${institute.id}-${institute.slug}`,
          }))}
        />

        {/* 🔴 Fallback Banner (Agar radius me kuch nahi mila) */}
        {(q || address) && exactAreaMatch === false && (
          <div className="mt-6 mb-2 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm animate-in fade-in zoom-in duration-300">
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-1">📍</span>
              <div>
                <h4 className="text-lg font-bold">
                  Couldn't find verified {categoryName} institutes near "{displayLocationText}"
                </h4>
                <p className="mt-1 text-sm text-amber-700">
                  Don't worry! We've found the best and highly-rated institutes in other areas of <strong>{cityName}</strong> for you.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 🟢 Success Banner (Agar radius me mil gaya) */}
        {(q || address) && exactAreaMatch === true && (
          <div className="mt-6 mb-2 text-sm text-slate-500 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Showing results near: <span className="font-semibold text-slate-800 capitalize">"{displayLocationText}"</span>
          </div>
        )}

        <InstituteListing institutes={institutes} />

        <Pagination totalPages={totalPages} />
      </div>
      </div>

      

      <CityAbout categoryName={categoryName} cityName={cityName} />
      <RelatedCities category={category} />
      <CityFAQ categoryName={categoryName} cityName={cityName} />
      <CityCTA />
    </main>
  );
}