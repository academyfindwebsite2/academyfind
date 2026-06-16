import SearchHero from "@/components/searchPage/SearchHero";
import SearchFilters from "@/components/searchPage/SearchFilters";
import SearchResultsHeader from "@/components/searchPage/SearchResultsHeader";
import InstituteResults from "@/components/searchPage/InstituteResults";
import RelatedCategories from "@/components/searchPage/RelatedCategories";
import RelatedCities from "@/components/searchPage/RelatedCities";
import RelatedBlogs from "@/components/searchPage/RelatedBlogs";
import CompareCTA from "@/components/searchPage/CompareCTA";
import { prisma } from "@/lib/prisma"; 

type Props = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    city?: string;
    category?: string; 
    rating?: string;   
  }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  return {
    title: q ? `${q} Search Results | AcademyFind` : "Search | AcademyFind",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", type = "", city = "", category = "", rating = "" } = await searchParams;

  const categories = await prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } });
  const cities = await prisma.city.findMany({
    where: {
      institutes: {
        some: {
          isActive: true
        }
      }
    },
    select: { 
      name: true, 
      slug: true 
    },
    orderBy: [
      { name: 'asc' },
      { state: 'asc' },
    ]
  });

  return (
    <>
      <SearchHero query={q || city} />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          
          <SearchFilters 
            categories={categories} 
            cities={cities} 
            currentType={type} 
            currentCity={city} 
            currentCategory={category}
            currentRating={rating}
          />

          <div className="space-y-14">
            <SearchResultsHeader query={q} />

            {/* 🔥 Type parameter bhi pass kiya */}
            <InstituteResults query={q} type={type} city={city} category={category} rating={rating} />

            <RelatedCategories />
            <RelatedCities />
            <RelatedBlogs />
            <CompareCTA />
          </div>
        </div>
      </section>
    </>
  );
}